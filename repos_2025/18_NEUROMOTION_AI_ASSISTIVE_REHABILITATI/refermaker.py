#!/usr/bin/env python3
"""
Physio Recorder System - Frame-Locked Quaternion Edition
Records a reference video (.mp4) and perfectly synced IMU Quaternions (.csv)

Dual mode:
  Standalone: python refermaker.py --name shoulder_raise --port /dev/ttyACM0
  Flask:      import refermaker; refermaker.generate_record_frames(save_path, port)
"""
import argparse
import numpy as np
import pandas as pd
import cv2
import serial
import sys
import os
import warnings

warnings.filterwarnings("ignore", category=UserWarning)

try:
    import mediapipe as mp
    import mediapipe.python.solutions.pose as mp_pose
    import mediapipe.python.solutions.drawing_utils as mp_drawing
except ImportError:
    print("Please install dependencies: pip install mediapipe opencv-python pyserial pandas")
    sys.exit(1)


# ---------------------------------------------------------------------------
# Global state — Flask routes write to this to control generate_record_frames
# ---------------------------------------------------------------------------
RECORD_STATE = {
    "is_recording": False,
    "running":      True,
}


class AngleSmoother:
    def __init__(self, alpha=0.1):
        self.alpha = max(0.001, min(1.0, alpha))
        self.sin_val, self.cos_val, self.init = 0.0, 0.0, False

    def update(self, angle_deg):
        r = np.radians(angle_deg)
        s, c = np.sin(r), np.cos(r)
        if not self.init:
            self.sin_val, self.cos_val, self.init = s, c, True
        else:
            self.sin_val = (1 - self.alpha) * self.sin_val + self.alpha * s
            self.cos_val = (1 - self.alpha) * self.cos_val + self.alpha * c
        return float(np.degrees(np.arctan2(self.sin_val, self.cos_val)))


def normalize_quat(q):
    mag = np.linalg.norm(q)
    return q / mag if mag > 0 else q


def _save_outputs(video_filename, csv_filename, out_video, recording_data, frame_count, fps):
    """Save video and CSV. Called from inside the loop so browser disconnect can't skip it."""
    if out_video is not None:
        out_video.release()
        print(f"[refermaker] ✓ Video: {video_filename} ({frame_count} frames @ {fps:.1f} fps)")
    else:
        print("[refermaker] No video — recording was never started.")

    if recording_data:
        col_order = ["t", "qw_fa", "qx_fa", "qy_fa", "qz_fa",
                          "qw_ua", "qx_ua", "qy_ua", "qz_ua"]
        pd.DataFrame(recording_data)[col_order].to_csv(csv_filename, index=False)
        print(f"[refermaker] ✓ CSV: {csv_filename} ({len(recording_data)} rows)")
    else:
        print("[refermaker] No CSV rows — recording never started or IMU not connected.")


# ---------------------------------------------------------------------------
# ORIGINAL STANDALONE — unchanged
# ---------------------------------------------------------------------------
def record_reference(output_base_name, port, baud=921600, vision_alpha=0.1):
    print(f"[*] Opening Serial Port {port}...")
    try:
        ser = serial.Serial(port, baud, timeout=0.01)
    except Exception as e:
        print(f"[!] Serial Error: {e}")
        return

    cap = cv2.VideoCapture(0)
    if not cap.isOpened(): return

    width, height = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = 30.0

    video_filename = f"{output_base_name}.mp4"
    csv_filename   = f"{output_base_name}_data.csv"

    out_video = cv2.VideoWriter(video_filename, cv2.VideoWriter_fourcc(*'mp4v'), fps, (width, height))
    pose = mp_pose.Pose(min_detection_confidence=0.7, min_tracking_confidence=0.7)

    smoother_fa_yaw = AngleSmoother(alpha=vision_alpha)
    smoother_ua_yaw = AngleSmoother(alpha=vision_alpha)

    recording_data = []
    is_recording   = False
    frame_count    = 0

    print("\n" + "="*50)
    print(" PHYSIO RECORDER STUDIO ACTIVE (QUATERNION SYNC)")
    print(" Press 'r' to START. Press 's' to STOP. 'q' to QUIT.")
    print("="*50 + "\n")

    while cap.isOpened():
        success, frame = cap.read()
        if not success: break

        imu_q_fa = np.array([1.0, 0.0, 0.0, 0.0])
        imu_q_ua = np.array([1.0, 0.0, 0.0, 0.0])
        while ser.in_waiting:
            line  = ser.readline().decode('ascii', errors='ignore').strip()
            parts = line.split(',')
            if len(parts) >= 9:
                try:
                    imu_q_fa = normalize_quat(np.array([float(parts[1]), float(parts[2]), float(parts[3]), float(parts[4])]))
                    imu_q_ua = normalize_quat(np.array([float(parts[5]), float(parts[6]), float(parts[7]), float(parts[8])]))
                except ValueError: pass

        results = pose.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        if results.pose_landmarks:
            lm   = results.pose_landmarks.landmark
            v_ua = np.array([lm[14].x - lm[12].x, lm[14].y - lm[12].y, lm[14].z - lm[12].z])
            v_fa = np.array([lm[16].x - lm[14].x, lm[16].y - lm[14].y, lm[16].z - lm[14].z])
            vis_yaw_fa = smoother_fa_yaw.update(float(np.degrees(np.arctan2(v_fa[2], v_fa[0]))))
            vis_yaw_ua = smoother_ua_yaw.update(float(np.degrees(np.arctan2(v_ua[2], v_ua[0]))))
            ser.write(f"V,{vis_yaw_fa:.2f},{vis_yaw_ua:.2f}\n".encode())
            mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('r') and not is_recording:
            is_recording = True; frame_count = 0
            print("\n[!] RECORDING STARTED...")
        elif key == ord('s') and is_recording:
            is_recording = False
            print("\n[!] RECORDING STOPPED.")
        elif key == ord('q'):
            break

        if is_recording:
            elapsed = frame_count / fps
            out_video.write(frame)
            recording_data.append({
                "t": elapsed,
                "qw_fa": imu_q_fa[0], "qx_fa": imu_q_fa[1],
                "qy_fa": imu_q_fa[2], "qz_fa": imu_q_fa[3],
                "qw_ua": imu_q_ua[0], "qx_ua": imu_q_ua[1],
                "qy_ua": imu_q_ua[2], "qz_ua": imu_q_ua[3],
            })
            frame_count += 1

        display_frame = cv2.flip(frame, 1)
        status = f"RECORDING - Frm: {frame_count}" if is_recording else \
                 ("STANDBY" if len(recording_data) == 0 else f"SAVED {len(recording_data)}")
        color = (0, 0, 255) if is_recording else (0, 255, 0)
        cv2.putText(display_frame, status, (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
        cv2.imshow('Physio Studio Recorder', display_frame)

    cap.release()
    out_video.release()
    ser.close()
    cv2.destroyAllWindows()

    if recording_data:
        pd.DataFrame(recording_data).to_csv(csv_filename, index=False)
        print(f"[+] Saved {csv_filename} ({len(recording_data)} frames)")


# ---------------------------------------------------------------------------
# FLASK GENERATOR
# KEY FIX: Save files INSIDE the loop when running=False is detected,
# before yielding the final frame. Browser disconnect can't skip this.
# ---------------------------------------------------------------------------
def generate_record_frames(save_path, port, baud=921600, vision_alpha=0.1):

    RECORD_STATE["running"]      = True
    RECORD_STATE["is_recording"] = False

    out_dir = os.path.dirname(save_path)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)
    video_filename = save_path + ".mp4"
    csv_filename   = save_path + "_data.csv"

    recording_data = []
    frame_count    = 0
    fps            = 30.0
    out_video      = None
    saved          = False  # guard so we only save once

    ser = None
    try:
        ser = serial.Serial(port, baud, timeout=0.01)
        print(f"[refermaker] Serial {port} @ {baud} — OK")
    except Exception as e:
        print(f"[refermaker] Serial FAILED: {e} — identity quaternions will be used")

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("[refermaker] ERROR: Cannot open webcam.")
        return

    width  = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    cam_fps = cap.get(cv2.CAP_PROP_FPS)
    if cam_fps and cam_fps > 1:
        fps = cam_fps

    pose = mp_pose.Pose(min_detection_confidence=0.7, min_tracking_confidence=0.7)
    smoother_fa_yaw = AngleSmoother(alpha=vision_alpha)
    smoother_ua_yaw = AngleSmoother(alpha=vision_alpha)

    print(f"[refermaker] Stream started → {video_filename}")

    while cap.isOpened():

        # ---------------------------------------------------------------
        # CHECK STOP SIGNAL FIRST — save before browser disconnects
        # ---------------------------------------------------------------
        if not RECORD_STATE.get("running", True):
            if not saved:
                print("[refermaker] Stop signal received — saving now (inside loop)")
                _save_outputs(video_filename, csv_filename, out_video,
                              recording_data, frame_count, fps)
                saved = True
            break

        success, frame = cap.read()
        if not success:
            print("[refermaker] Webcam read failed.")
            break

        # --- IMU read (reset per frame, same as standalone) ---
        imu_q_fa = np.array([1.0, 0.0, 0.0, 0.0])
        imu_q_ua = np.array([1.0, 0.0, 0.0, 0.0])
        if ser and ser.is_open:
            while ser.in_waiting:
                try:
                    line  = ser.readline().decode('ascii', errors='ignore').strip()
                    parts = line.split(',')
                    if len(parts) >= 9:
                        imu_q_fa = normalize_quat(np.array([float(parts[1]), float(parts[2]),
                                                              float(parts[3]), float(parts[4])]))
                        imu_q_ua = normalize_quat(np.array([float(parts[5]), float(parts[6]),
                                                              float(parts[7]), float(parts[8])]))
                except (ValueError, UnicodeDecodeError):
                    pass

        # --- Vision + Mahony feedback ---
        results = pose.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        if results.pose_landmarks:
            lm   = results.pose_landmarks.landmark
            v_ua = np.array([lm[14].x - lm[12].x, lm[14].y - lm[12].y, lm[14].z - lm[12].z])
            v_fa = np.array([lm[16].x - lm[14].x, lm[16].y - lm[14].y, lm[16].z - lm[14].z])
            vis_yaw_fa = smoother_fa_yaw.update(float(np.degrees(np.arctan2(v_fa[2], v_fa[0]))))
            vis_yaw_ua = smoother_ua_yaw.update(float(np.degrees(np.arctan2(v_ua[2], v_ua[0]))))
            if ser and ser.is_open:
                ser.write(f"V,{vis_yaw_fa:.2f},{vis_yaw_ua:.2f}\n".encode())
            mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        is_recording = RECORD_STATE.get("is_recording", False)

        if is_recording and out_video is None:
            out_video      = cv2.VideoWriter(video_filename,
                                             cv2.VideoWriter_fourcc(*'mp4v'),
                                             fps, (width, height))
            frame_count    = 0
            recording_data = []
            print(f"[refermaker] ● Recording STARTED → {video_filename}")

        if is_recording and out_video is not None:
            elapsed = frame_count / fps
            out_video.write(frame)
            recording_data.append({
                "t":     elapsed,
                "qw_fa": float(imu_q_fa[0]), "qx_fa": float(imu_q_fa[1]),
                "qy_fa": float(imu_q_fa[2]), "qz_fa": float(imu_q_fa[3]),
                "qw_ua": float(imu_q_ua[0]), "qx_ua": float(imu_q_ua[1]),
                "qy_ua": float(imu_q_ua[2]), "qz_ua": float(imu_q_ua[3]),
            })
            frame_count += 1

        # --- Preview frame ---
        display_frame = cv2.flip(frame.copy(), 1)
        h_d, w_d = display_frame.shape[:2]

        if is_recording:
            cv2.rectangle(display_frame, (0, 0), (w_d, 50), (0, 0, 120), -1)
            cv2.circle(display_frame, (22, 25), 10, (0, 0, 255), -1)
            mm, ss = divmod(int(frame_count / fps), 60)
            cv2.putText(display_frame, f"RECORDING {mm:02d}:{ss:02d} - Frm: {frame_count}",
                        (42, 33), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        elif len(recording_data) == 0:
            cv2.rectangle(display_frame, (0, 0), (w_d, 50), (20, 20, 20), -1)
            cv2.putText(display_frame, "STANDBY — Click Start Recording",
                        (12, 33), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        else:
            cv2.rectangle(display_frame, (0, 0), (w_d, 50), (20, 20, 20), -1)
            cv2.putText(display_frame, f"PAUSED — {len(recording_data)} frames captured",
                        (12, 33), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 200, 200), 2)

        cv2.rectangle(display_frame, (0, h_d - 36), (w_d, h_d), (15, 15, 15), -1)
        imu_ok = ser is not None and ser.is_open
        cv2.putText(display_frame,
                    "IMU CONNECTED" if imu_ok else "NO SERIAL — identity quaternions",
                    (10, h_d - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.55,
                    (0, 210, 80) if imu_ok else (0, 100, 220), 1)

        ret, buf = cv2.imencode('.jpg', display_frame, [cv2.IMWRITE_JPEG_QUALITY, 82])
        if ret:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n'
                   + buf.tobytes()
                   + b'\r\n')

    # Fallback save if loop exited for another reason (webcam died etc.)
    if not saved:
        print("[refermaker] Loop exited — saving outputs (fallback)")
        _save_outputs(video_filename, csv_filename, out_video,
                      recording_data, frame_count, fps)

    cap.release()
    pose.close()
    if ser and ser.is_open:
        ser.close()
    print("[refermaker] Done.")


# ---------------------------------------------------------------------------
# STANDALONE ENTRY POINT
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--name",         default="reference")
    p.add_argument("--port",         default="/dev/ttyACM0")
    p.add_argument("--baud",         type=int,   default=921600)
    p.add_argument("--vision-alpha", type=float, default=0.1)
    args = p.parse_args()
    record_reference(args.name, args.port, args.baud, args.vision_alpha)