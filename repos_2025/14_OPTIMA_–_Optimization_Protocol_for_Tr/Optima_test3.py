#!/usr/bin/env python

import glob
import sys
import argparse
import cv2
import numpy as np
import torch
import os
import csv
import time
import matplotlib.pyplot as plt
import threading
from flask import Flask, Response, jsonify, send_from_directory

# ---------------- CARLA IMPORT ----------------
try:
    sys.path.append(glob.glob('../carla/dist/carla-*%d.%d-%s.egg' % (
        sys.version_info.major,
        sys.version_info.minor,
        'win-amd64' if sys.platform == 'win32' else 'linux-x86_64'))[0])
except IndexError:
    pass

import carla
from numpy import random

WIDTH = 640
HEIGHT = 480
DISPLAY_W = 400
DISPLAY_H = 300

SAVE_INTERVAL = 10
JUNCTION_RADIUS = 35

CSV_PATH = r"C:\Users\PC\Desktop\CARLA_0.9.15\WindowsNoEditor\PythonAPI\csv\traffic_data.csv"

# ========== FLASK SETUP ==========
app = Flask(__name__, static_folder='.')   # serve current directory as static
camera_frames = {}
frame_lock = threading.Lock()

vehicle_type_counts = {
    "car": 0,
    "bike": 0,
    "bus": 0,
    "ambulance": 0
}
counts_lock = threading.Lock()

# Serve the login page
@app.route('/')
@app.route('/login.html')
def login_page():
    return send_from_directory('.', 'login.html')

# Serve the dashboard page
@app.route('/dashboard.html')
def dashboard_page():
    return send_from_directory('.', 'dashboard.html')

# MJPEG stream from NORTH camera
@app.route('/video_feed/north')
def video_feed_north():
    def generate():
        while True:
            with frame_lock:
                frame = camera_frames.get("NORTH")
                if frame is None:
                    time.sleep(0.1)
                    continue
                frame = frame.copy()
            ret, jpeg = cv2.imencode('.jpg', frame)
            if not ret:
                continue
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')
            time.sleep(0.03)
    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/video_feed/south')
def video_feed_south():
    def generate():
        while True:
            with frame_lock:
                frame = camera_frames.get("SOUTH")
                if frame is None:
                    time.sleep(0.1)
                    continue
                frame = frame.copy()
            ret, jpeg = cv2.imencode('.jpg', frame)
            if not ret:
                continue
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')
            time.sleep(0.03)
    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/video_feed/east')
def video_feed_east():
    def generate():
        while True:
            with frame_lock:
                frame = camera_frames.get("EAST")
                if frame is None:
                    time.sleep(0.1)
                    continue
                frame = frame.copy()
            ret, jpeg = cv2.imencode('.jpg', frame)
            if not ret:
                continue
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')
            time.sleep(0.03)
    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/video_feed/west')
def video_feed_west():
    def generate():
        while True:
            with frame_lock:
                frame = camera_frames.get("WEST")
                if frame is None:
                    time.sleep(0.1)
                    continue
                frame = frame.copy()
            ret, jpeg = cv2.imencode('.jpg', frame)
            if not ret:
                continue
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')
            time.sleep(0.03)
    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

# JSON with current vehicle counts
@app.route('/data')
def data():
    with counts_lock:
        return jsonify(vehicle_type_counts)

def run_flask():
    app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False, threaded=True)

# ==================== TRAFFIC LIGHT CONTROLLER ====================
class TrafficLightController:
    def __init__(self, group, order=['NORTH', 'EAST', 'SOUTH', 'WEST']):
        """
        group: list of traffic light actors (must match order)
        order: list of direction names in the same order as group
        """
        self.group = group
        self.order = order
        self.current_phase = 0               # index in order
        self.phase_start_time = time.time()
        self.green_duration = 5.0             # initial default
        self.emergency_mode = False
        self.emergency_direction = None
        self.emergency_start_time = None

    def get_light_for_direction(self, direction):
        """Return the traffic light actor controlling a given direction."""
        try:
            idx = self.order.index(direction)
            return self.group[idx]
        except ValueError:
            return None

    def update(self, direction_counts, emergency_dir):
        """
        direction_counts: dict with counts per direction
        emergency_dir: direction of an emergency vehicle, or None
        """
        now = time.time()

        # ----- Emergency handling -----
        if emergency_dir and not self.emergency_mode:
            # Enter emergency mode: give green to the emergency approach, red to all others
            self.emergency_mode = True
            self.emergency_direction = emergency_dir
            self.emergency_start_time = now
            print(f"🚨 Emergency preempt: {emergency_dir} GREEN, all others RED")
            for i, light in enumerate(self.group):
                if self.order[i] == emergency_dir:
                    light.set_state(carla.TrafficLightState.Green)
                else:
                    light.set_state(carla.TrafficLightState.Red)
            return

        if self.emergency_mode:
            # Check if emergency vehicle still present in the same direction
            if emergency_dir == self.emergency_direction:
                # Still present, keep holding
                return
            else:
                # Emergency cleared – exit emergency mode
                print("🚨 Emergency cleared, resuming normal cycle")
                self.emergency_mode = False
                self.emergency_direction = None
                # Force all red briefly before restarting cycle
                for light in self.group:
                    light.set_state(carla.TrafficLightState.Red)
                # Small delay (blocking) to ensure all red – can be adjusted
                time.sleep(1)
                # Reset phase to start fresh
                self.phase_start_time = now
                self.current_phase = 0
                # Fall through to normal update

        # ----- Normal adaptive cycle -----
        if self.emergency_mode:
            return

        current_dir = self.order[self.current_phase]
        count = direction_counts.get(current_dir, 0)

        # Map count to green time: minimum 2s, maximum 10s, linear between 0 and 20 vehicles
        desired_duration = max(2.0, min(10.0, 2.0 + count * 0.4))

        # Time to switch?
        if now - self.phase_start_time >= desired_duration:
            # Move to next phase
            self.current_phase = (self.current_phase + 1) % len(self.order)
            self.phase_start_time = now
            for i, light in enumerate(self.group):
                if i == self.current_phase:
                    light.set_state(carla.TrafficLightState.Green)
                else:
                    light.set_state(carla.TrafficLightState.Red)
            print(f"Phase changed to {self.order[self.current_phase]} for {desired_duration:.1f}s")
        else:
            # Ensure correct lights are set (in case of external changes)
            for i, light in enumerate(self.group):
                if i == self.current_phase:
                    if light.get_state() != carla.TrafficLightState.Green:
                        light.set_state(carla.TrafficLightState.Green)
                else:
                    if light.get_state() != carla.TrafficLightState.Red:
                        light.set_state(carla.TrafficLightState.Red)

# =====================================================
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("-n", "--number-of-vehicles", default=60, type=int)
    args = parser.parse_args()

    client = carla.Client("127.0.0.1", 2000)
    client.set_timeout(40.0)

    world = client.get_world()
    world_map = world.get_map()
    print("Connected to CARLA")

    # Spawn vehicles with autopilot
    tm = client.get_trafficmanager(8000)
    tm.global_percentage_speed_difference(15.0)

    blueprints = world.get_blueprint_library().filter("vehicle.*")
    spawn_points = world_map.get_spawn_points()
    random.shuffle(spawn_points)

    vehicles = []
    batch = []

    for i, transform in enumerate(spawn_points):
        if i >= args.number_of_vehicles:
            break
        bp = random.choice(blueprints)
        batch.append(
            carla.command.SpawnActor(bp, transform)
            .then(carla.command.SetAutopilot(
                carla.command.FutureActor,
                True,
                tm.get_port()
            ))
        )

    responses = client.apply_batch_sync(batch, True)
    for r in responses:
        if not r.error:
            vehicles.append(r.actor_id)
    print("Vehicles spawned:", len(vehicles))

    # Find a junction
    traffic_lights = world.get_actors().filter("traffic.traffic_light")
    if not traffic_lights:
        print("No traffic lights found, exiting.")
        return
    first_light = traffic_lights[0]
    waypoint = world_map.get_waypoint(first_light.get_transform().location)
    junction = waypoint.get_junction()
    junction_id = junction.id
    center = junction.bounding_box.location
    group = first_light.get_group_traffic_lights()
    print("Using Junction ID:", junction_id)

    # Initialize traffic light controller
    # Assumption: group order is NORTH, EAST, SOUTH, WEST (may need manual adjustment)
    traffic_controller = TrafficLightController(group)

    # YOLO setup
    sys.path.insert(0, './yolov5')
    from models.common import DetectMultiBackend
    from utils.general import non_max_suppression
    from utils.torch_utils import select_device

    device = select_device('cpu')
    model = DetectMultiBackend('yolov5/yolov5s.pt', device=device)
    names = model.names
    print("YOLO Loaded")

    # Cameras
    camera_bp = world.get_blueprint_library().find("sensor.camera.rgb")
    camera_bp.set_attribute("image_size_x", str(WIDTH))
    camera_bp.set_attribute("image_size_y", str(HEIGHT))

    directions = {
        "NORTH": carla.Vector3D(0, 1, 0),
        "SOUTH": carla.Vector3D(0, -1, 0),
        "EAST": carla.Vector3D(1, 0, 0),
        "WEST": carla.Vector3D(-1, 0, 0),
    }

    cameras = []

    def make_callback(name):
        def callback(image):
            array = np.frombuffer(image.raw_data, dtype=np.uint8)
            frame = array.reshape((HEIGHT, WIDTH, 4))[:, :, :3]
            frame = np.ascontiguousarray(frame)

            # Optional YOLO drawing
            img = torch.from_numpy(frame).to(device)
            img = img.permute(2, 0, 1).float() / 255.0
            img = img.unsqueeze(0)
            pred = model(img)
            pred = non_max_suppression(pred)

            count = 0
            for det in pred:
                if len(det):
                    for *xyxy, conf, cls in det:
                        label = names[int(cls)]
                        if label in ["car", "truck", "bus", "motorbike"]:
                            count += 1
                            x1, y1, x2, y2 = map(int, xyxy)
                            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

            cv2.putText(frame, f"{name} YOLO: {count}",
                        (10, 25), cv2.FONT_HERSHEY_SIMPLEX,
                        0.6, (0, 255, 255), 2)

            frame = cv2.resize(frame, (DISPLAY_W, DISPLAY_H))
            with frame_lock:
                camera_frames[name] = frame
        return callback

    for name, vec in directions.items():
        cam_loc = center + vec * 25 + carla.Location(z=8)
        look = center - cam_loc
        yaw = np.degrees(np.arctan2(look.y, look.x))
        cam_rot = carla.Rotation(pitch=-15, yaw=yaw)
        cam = world.spawn_actor(camera_bp, carla.Transform(cam_loc, cam_rot))
        cam.listen(make_callback(name))
        cameras.append(cam)

    # Graph setup
    plt.ion()
    fig, ax = plt.subplots()
    bars = ax.bar(["NORTH", "SOUTH", "EAST", "WEST"], [0, 0, 0, 0])
    ax.set_ylim(0, 50)
    ax.set_title("Live Congestion")

    # CSV setup
    os.makedirs(os.path.dirname(CSV_PATH), exist_ok=True)
    csv_file = open(CSV_PATH, 'w', newline='')
    writer = csv.writer(csv_file)
    writer.writerow(["timestamp", "junction_id", "direction", "vehicle_count", "car", "bike", "bus", "ambulance"])

    last_save = time.time()
    last_light_update = time.time()  # timer for traffic light updates

    # Start Flask thread
    flask_thread = threading.Thread(target=run_flask, daemon=True)
    flask_thread.start()
    print("Flask server running at http://localhost:5000")

    try:
        while True:
            world.wait_for_tick()
            vehicles_all = world.get_actors().filter("vehicle.*")

            current_counts = {"car": 0, "bike": 0, "bus": 0, "ambulance": 0}
            direction_counts = {"NORTH": 0, "SOUTH": 0, "EAST": 0, "WEST": 0}
            emergency_dir = None

            for v in vehicles_all:
                loc = v.get_location()
                if loc.distance(center) < JUNCTION_RADIUS:
                    dx = loc.x - center.x
                    dy = loc.y - center.y
                    if abs(dx) > abs(dy):
                        direction = "EAST" if dx > 0 else "WEST"
                    else:
                        direction = "NORTH" if dy > 0 else "SOUTH"
                    direction_counts[direction] += 1

                    type_id = v.type_id.lower()
                    if any(x in type_id for x in ["ambulance", "fire", "police"]):
                        current_counts["ambulance"] += 1
                        emergency_dir = direction
                    elif any(x in type_id for x in ["bike", "motorbike"]):
                        current_counts["bike"] += 1
                    elif any(x in type_id for x in ["bus", "truck", "truck"]):
                        current_counts["bus"] += 1
                    else:
                        current_counts["car"] += 1

            with counts_lock:
                vehicle_type_counts.update(current_counts)

            # Update traffic lights every 0.5 seconds
            if time.time() - last_light_update >= 0.5:
                traffic_controller.update(direction_counts, emergency_dir)
                last_light_update = time.time()

            # Update graph
            for bar, val in zip(bars, direction_counts.values()):
                bar.set_height(val)
            fig.canvas.draw()
            fig.canvas.flush_events()

            # CSV save
            if time.time() - last_save >= SAVE_INTERVAL:
                for d, c in direction_counts.items():
                    writer.writerow([
                        time.time(), junction_id, d, c,
                        current_counts["car"],
                        current_counts["bike"],
                        current_counts["bus"],
                        current_counts["ambulance"]
                    ])
                last_save = time.time()
                print("CSV saved")

            # OpenCV display
            with frame_lock:
                if len(camera_frames) == 4:
                    top = np.hstack((camera_frames["NORTH"], camera_frames["SOUTH"]))
                    bottom = np.hstack((camera_frames["EAST"], camera_frames["WEST"]))
                    grid = np.vstack((top, bottom))
                    cv2.imshow("SMART TRAFFIC MONITOR", grid)

            if cv2.waitKey(1) == ord('q'):
                break

    finally:
        print("Cleaning up")
        csv_file.close()
        for cam in cameras:
            cam.stop()
            cam.destroy()
        client.apply_batch([carla.command.DestroyActor(x) for x in vehicles])
        cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
