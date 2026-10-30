#!/usr/bin/env python3
"""
Live Physio Assistive System - Web Streaming Module
Adapted for Flask MJPEG Integration
Dependency Note: pip install "numpy<2" opencv-python mediapipe pandas pyserial
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

# Global State Dictionary for Flask to read/write asynchronously
LATEST_SCORE = {
    "running": True,
    "score": 0.0,
    "imu_score": 0.0,
    "vis_score": 0.0,
    "msg": "Initializing...",
    "trigger_calib": False,
    "trigger_reset": False
}

def normalize_angle(angle):
    return float((angle + 180) % 360 - 180)

def euler_to_quat(roll, pitch, yaw):
    r, p, y = np.radians(roll), np.radians(pitch), np.radians(yaw)
    cr, sr = np.cos(r * 0.5), np.sin(r * 0.5)
    cp, sp = np.cos(p * 0.5), np.sin(p * 0.5)
    cy, sy = np.cos(y * 0.5), np.sin(y * 0.5)
    
    qw = cr * cp * cy + sr * sp * sy
    qx = sr * cp * cy - cr * sp * sy
    qy = cr * sp * cy + sr * cp * sy
    qz = cr * cp * sy - sr * sp * cy
    return np.stack([qw, qx, qy, qz], axis=-1)

def quat_angular_diff(q1, q2):
    dot = np.sum(q1 * q2, axis=-1)
    dot = np.clip(np.abs(dot), 0.0, 1.0)
    theta_rad = 2 * np.arccos(dot)
    return np.degrees(theta_rad)

def quat_inverse(q):
    """Returns the inverse (conjugate) of a unit quaternion [w, x, y, z]"""
    return np.array([q[..., 0], -q[..., 1], -q[..., 2], -q[..., 3]])

def quat_mult(q1, q2):
    """Multiplies two quaternions q1 * q2. Supports numpy broadcasting."""
    w1, x1, y1, z1 = q1[..., 0], q1[..., 1], q1[..., 2], q1[..., 3]
    w2, x2, y2, z2 = q2[..., 0], q2[..., 1], q2[..., 2], q2[..., 3]
    
    w = w1*w2 - x1*x2 - y1*y2 - z1*z2
    x = w1*x2 + x1*w2 + y1*z2 - z1*y2
    y = w1*y2 - x1*z2 + y1*w2 + z1*x2
    z = w1*z2 + x1*y2 - y1*x2 + z1*w2
    return np.stack([w, x, y, z], axis=-1)

def quat_to_yaw(q):
    w, x, y, z = q[..., 0], q[..., 1], q[..., 2], q[..., 3]
    return np.degrees(np.arctan2(2.0 * (w * z + x * y), 1.0 - 2.0 * (y * y + z * z)))

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

def extract_reference_from_video(video_path):
    print(f"[*] Analyzing Reference Video (Fallback Mode): {video_path}...")
    pose = mp_pose.Pose(static_image_mode=True, min_detection_confidence=0.5)
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened(): sys.exit(1)
        
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    data, frame_count = [], 0
    
    while cap.isOpened():
        success, image = cap.read()
        if not success: break
        
        results = pose.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        if results.pose_landmarks:
            lm = results.pose_landmarks.landmark
            v_ua = np.array([lm[14].x - lm[12].x, lm[14].y - lm[12].y, lm[14].z - lm[12].z])
            yaw_ua, roll_ua = np.degrees(np.arctan2(v_ua[2], v_ua[0])), np.degrees(np.arctan2(v_ua[1], v_ua[0]))
            
            v_fa = np.array([lm[16].x - lm[14].x, lm[16].y - lm[14].y, lm[16].z - lm[14].z])
            yaw_fa, roll_fa = np.degrees(np.arctan2(v_fa[2], v_fa[0])), np.degrees(np.arctan2(v_fa[1], v_fa[0]))
            
            q_ua = euler_to_quat(roll_ua, 0.0, yaw_ua)
            q_fa = euler_to_quat(roll_fa, 0.0, yaw_fa)
            
            data.append({
                "t": frame_count / fps, 
                "qw_ua": q_ua[0], "qx_ua": q_ua[1], "qy_ua": q_ua[2], "qz_ua": q_ua[3],
                "qw_fa": q_fa[0], "qx_fa": q_fa[1], "qy_fa": q_fa[2], "qz_fa": q_fa[3]
            })
        frame_count += 1
    
    cap.release(); pose.close()
    return pd.DataFrame(data).astype(np.float64)

def generate_live_physio_frames(ref_df, video_path, port, baud=921600, vision_alpha=0.1):
    global LATEST_SCORE
    LATEST_SCORE["running"] = True
    LATEST_SCORE["trigger_calib"] = False
    LATEST_SCORE["trigger_reset"] = False
    
    print(f"[*] Starting Video Stream | Opening Serial Port {port}...")
    try: 
        ser = serial.Serial(port, baud, timeout=0.01)
    except Exception as e:
        print(f"[!] Serial Error: {e}")
        return

    cap = cv2.VideoCapture(0)
    cap_ref = cv2.VideoCapture(video_path)
    ref_fps = cap_ref.get(cv2.CAP_PROP_FPS) or 30.0

    pose = mp_pose.Pose(min_detection_confidence=0.7, min_tracking_confidence=0.7)
    smoother_fa = AngleSmoother(alpha=vision_alpha)
    smoother_ua = AngleSmoother(alpha=vision_alpha)
    
    ref_times = ref_df['t'].to_numpy()
    ref_max_t = ref_df['t'].max()

    imu_t, imu_start_t = 0.0, None
    imu_q_fa = np.array([1.0, 0.0, 0.0, 0.0])
    imu_q_ua = np.array([1.0, 0.0, 0.0, 0.0])
    
    # Persistent Correction Offsets
    offset_q_fa = np.array([1.0, 0.0, 0.0, 0.0])
    offset_q_ua = np.array([1.0, 0.0, 0.0, 0.0])
    is_calibrated = False
    
    vis_yaw_fa, vis_yaw_ua = 0.0, 0.0
    
    while cap.isOpened() and LATEST_SCORE.get("running", True):
        success, frame = cap.read()
        if not success: break
        
        # Drain serial buffer for Quaternions
        while ser.in_waiting:
            line = ser.readline().decode('ascii', errors='ignore').strip()
            parts = line.split(',')
            if len(parts) >= 9:
                try:
                    imu_t = float(parts[0])
                    if imu_start_t is None: imu_start_t = imu_t
                    q1 = np.array([float(parts[1]), float(parts[2]), float(parts[3]), float(parts[4])])
                    q2 = np.array([float(parts[5]), float(parts[6]), float(parts[7]), float(parts[8])])
                    imu_q_fa = q1 / max(1e-6, np.linalg.norm(q1))
                    imu_q_ua = q2 / max(1e-6, np.linalg.norm(q2))
                except ValueError: pass

        # Vision tracking for stabilization
        results = pose.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        if results.pose_landmarks:
            lm = results.pose_landmarks.landmark
            v_ua = np.array([lm[14].x - lm[12].x, lm[14].y - lm[12].y, lm[14].z - lm[12].z])
            vis_yaw_ua = smoother_ua.update(float(np.degrees(np.arctan2(v_ua[2], v_ua[0]))))
            
            v_fa = np.array([lm[16].x - lm[14].x, lm[16].y - lm[14].y, lm[16].z - lm[14].z])
            vis_yaw_fa = smoother_fa.update(float(np.degrees(np.arctan2(v_fa[2], v_fa[0]))))
            
            ser.write(f"V,{vis_yaw_fa:.2f},{vis_yaw_ua:.2f}\n".encode())
            
        elapsed = (imu_t - imu_start_t) % ref_max_t if imu_start_t is not None else 0.0
        window_times = np.linspace(elapsed - 0.5, elapsed + 0.5, 15) % ref_max_t

        def nlerp_quat(times, ref_t, w, x, y, z):
            q_interp = np.column_stack([np.interp(times, ref_t, w), np.interp(times, ref_t, x), np.interp(times, ref_t, y), np.interp(times, ref_t, z)])
            return q_interp / np.linalg.norm(q_interp, axis=1, keepdims=True)

        # 1. Get Base pristine reference quaternions
        base_targ_q_fa = nlerp_quat(window_times, ref_times, ref_df['qw_fa'], ref_df['qx_fa'], ref_df['qy_fa'], ref_df['qz_fa'])
        base_targ_q_ua = nlerp_quat(window_times, ref_times, ref_df['qw_ua'], ref_df['qx_ua'], ref_df['qy_ua'], ref_df['qz_ua'])

        # 2. Apply correction offset (Compensated Reference = Offset * Base Reference)
        targ_q_fa = quat_mult(offset_q_fa, base_targ_q_fa)
        targ_q_ua = quat_mult(offset_q_ua, base_targ_q_ua)

        # QUATERNION DISTANCE MATCHING (IMU)
        errs_fa = quat_angular_diff(targ_q_fa, imu_q_fa)
        errs_ua = quat_angular_diff(targ_q_ua, imu_q_ua)

        total_errs = (errs_fa + errs_ua) / 2.0
        best_idx = np.argmin(total_errs)
        
        imu_score = max(0.0, 100.0 - total_errs[best_idx])
        ref_yaw_fa_disp = normalize_angle(quat_to_yaw(targ_q_fa[best_idx]))
        ref_yaw_ua_disp = normalize_angle(quat_to_yaw(targ_q_ua[best_idx]))
        
        # VISION DISTANCE MATCHING
        vis_err_fa = abs(normalize_angle(vis_yaw_fa - ref_yaw_fa_disp))
        vis_err_ua = abs(normalize_angle(vis_yaw_ua - ref_yaw_ua_disp))
        vis_total_err = (vis_err_fa + vis_err_ua) / 2.0
        vision_score = max(0.0, 100.0 - vis_total_err)
        
        # FUSED ACCURACY (IMU + VISION)
        fused_score = (imu_score + vision_score) / 2.0
        
        best_fa_err, best_ua_err = errs_fa[best_idx], errs_ua[best_idx]
        
        target_frame_idx = int(elapsed * ref_fps)
        cap_ref.set(cv2.CAP_PROP_POS_FRAMES, target_frame_idx)
        ret_ref, ref_frame = cap_ref.read()
        if not ret_ref: ref_frame = np.zeros_like(frame)
        
        msg = "PROPER" if fused_score > 80 else "CORRECT POSTURE"
        if best_fa_err > 20 and best_ua_err > 20: msg = "FULL ARM ALIGN ERROR"
        elif best_fa_err > 20: msg = "FOREARM ALIGN ERROR"
        elif best_ua_err > 20: msg = "UPPER ARM ALIGN ERROR"

        # Update Flask Global State
        LATEST_SCORE["score"] = fused_score
        LATEST_SCORE["imu_score"] = imu_score
        LATEST_SCORE["vis_score"] = vision_score
        LATEST_SCORE["msg"] = msg

        if results.pose_landmarks: mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        frame, ref_frame = cv2.flip(frame, 1), cv2.flip(ref_frame, 1)
        color = (0, 255, 0) if fused_score > 80 else (0, 0, 255)

        # ---------------------------------------------------------
        # DISPLAY RESIZING AND DASHBOARD CREATION
        # ---------------------------------------------------------
        target_h = 480
        h, w = frame.shape[:2]
        frame_resized = cv2.resize(frame, (int(w * target_h / h), target_h))
        r_h, r_w = ref_frame.shape[:2]
        ref_frame_resized = cv2.resize(ref_frame, (int(r_w * target_h / r_h), target_h))
        
        # Video Labels
        cv2.putText(frame_resized, "YOUR MOVEMENT (MIRRORED)", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
        cv2.putText(ref_frame_resized, "REFERENCE (MIRRORED)", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)

        # Build Side Dashboard Panel
        dash_w = 320
        dashboard = np.zeros((target_h, dash_w, 3), dtype=np.uint8)
        
        cv2.putText(dashboard, "LIVE TELEMETRY", (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        cv2.line(dashboard, (20, 55), (dash_w - 20, 55), (100, 100, 100), 1)
        
        # Breakdown Scores
        cv2.putText(dashboard, f"IMU ALONE:  {imu_score:.1f}%", (20, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 200, 0), 2)
        cv2.putText(dashboard, f"VIS ALONE:  {vision_score:.1f}%", (20, 140), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (200, 200, 255), 2)
        
        # Main Fused Score
        cv2.putText(dashboard, "BOTH FUSED:", (20, 200), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        cv2.putText(dashboard, f"{fused_score:.1f}%", (20, 245), cv2.FONT_HERSHEY_SIMPLEX, 1.4, color, 3)
        
        # Status Messages
        cv2.putText(dashboard, "STATUS:", (20, 300), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1)
        cv2.putText(dashboard, msg, (20, 330), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

        if is_calibrated:
            cv2.putText(dashboard, "OFFSET CALIBRATED", (20, 380), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 200, 0), 2)
            
        cv2.line(dashboard, (20, target_h - 60), (dash_w - 20, target_h - 60), (100, 100, 100), 1)
        cv2.putText(dashboard, "WEB STREAMING ACTIVE", (20, target_h - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (150, 150, 255), 1)
        
        final_ui = cv2.hconcat([ref_frame_resized, frame_resized, dashboard])
        
        # Check for Web-Triggered Calibration / Reset via Global Dict
        if LATEST_SCORE.get("trigger_calib"):
            if fused_score > 85 and best_fa_err < 10 and best_ua_err < 10:
                offset_q_fa = quat_mult(imu_q_fa, quat_inverse(base_targ_q_fa[best_idx]))
                offset_q_ua = quat_mult(imu_q_ua, quat_inverse(base_targ_q_ua[best_idx]))
                is_calibrated = True
            LATEST_SCORE["trigger_calib"] = False

        if LATEST_SCORE.get("trigger_reset"):
            offset_q_fa = np.array([1.0, 0.0, 0.0, 0.0])
            offset_q_ua = np.array([1.0, 0.0, 0.0, 0.0])
            is_calibrated = False
            LATEST_SCORE["trigger_reset"] = False

        # MJPEG Frame Yielding (Replaces cv2.imshow)
        ret, buffer = cv2.imencode('.jpg', final_ui)
        if not ret:
            continue
        
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    print("\n[!] Closing Generator Session...")
    cap.release()
    cap_ref.release()
    pose.close()
    if 'ser' in locals() and ser.is_open:
        ser.close()

if __name__ == "__main__":
    print("This module is now designed to be imported and streamed via Flask.")
    print("To test locally, run your Flask app.")