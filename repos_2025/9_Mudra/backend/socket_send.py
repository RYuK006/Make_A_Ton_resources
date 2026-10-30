import socket
import numpy as np
import joblib
import time
import json
import asyncio
import websockets
import threading

# =========================
# Load trained components
# =========================
# Letters Model
model_l = joblib.load("models/letters/model_features.pkl")
scaler_l = joblib.load("models/letters/scaler.pkl")
le_l = joblib.load("models/letters/label_encoder.pkl")

# Shapes Model
model_s = joblib.load("models/shapes/shapes_features.pkl")
scaler_s = joblib.load("models/shapes/scaler_shapes.pkl")
le_s = joblib.load("models/shapes/label_encoder_shapes.pkl")

# =========================
# Shared State
# =========================
state = {
    "type": "NONE",      # The actual result (e.g., 'A' or 'Circle')
    "mode": "NONE",      # 'LETTER' or 'SHAPE'
    "confidence": 0.0,
    "size": 250,
    "position": {"x": 400, "y": 200},
    "isDragging": False,
    "webcamEnabled": False,
}

connected_clients = set()

# =========================
# UDP SETTINGS (IMU INPUT)
# =========================
UDP_IP = "10.125.129.232"
UDP_PORT = 12345
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.bind((UDP_IP, UDP_PORT))

# =========================
# Helper Functions
# =========================
def extract_features(sample):
    sample = sample.reshape(-1, 6)
    features = []
    for i in range(6):
        axis = sample[:, i]
        features.append(np.mean(axis))
        features.append(np.std(axis))
        features.append(np.min(axis))
        features.append(np.max(axis))
        features.append(np.ptp(axis))
        features.append(np.sum(axis**2))
    return np.array(features)

def resample_to_300(data):
    data = np.array(data)
    length = data.shape[0]
    if length == 300: return data
    indices = np.linspace(0, length - 1, 300).astype(int)
    return data[indices]

# =========================
# Broadcast Utility
# =========================
async def broadcast_state():
    if not connected_clients:
        return
    payload = json.dumps({"type": "update", "state": state})
    await asyncio.gather(*[client.send(payload) for client in connected_clients], return_exceptions=True)

# =========================
# WebSocket Handler
# =========================
async def handler(websocket):
    connected_clients.add(websocket)
    await websocket.send(json.dumps({"type": "sync", "state": state}))
    try:
        async for message in websocket: pass
    except websockets.ConnectionClosed: pass
    finally: connected_clients.remove(websocket)

# =========================
# Prediction Loop (Threaded)
# =========================
def prediction_worker(loop):
    while True:
        print("\n--- SELECT MODE ---")
        print("1: Letters")
        print("2: Shapes")
        choice = input("Choice: ").strip()

        if choice == '1':
            m, s, l, mode_label = model_l, scaler_l, le_l, "LETTER"
        else:
            m, s, l, mode_label = model_s, scaler_s, le_s, "SHAPE"

        input(f"Press ENTER to record 2s for {mode_label}...")
        print("Recording...")
        
        start_time = time.time()
        buffer = []
        while time.time() - start_time < 2:
            try:
                sock.settimeout(0.1)
                data, _ = sock.recvfrom(1024)
                v = data.decode().strip().split(",")
                if len(v) == 6: buffer.append([float(x) for x in v])
            except: continue

        if len(buffer) < 50: continue

        # Pipeline
        flat = resample_to_300(buffer).flatten()
        feats = extract_features(flat).reshape(1, -1)
        feats_scaled = s.transform(feats)

        pred = m.predict(feats_scaled)
        prob = m.predict_proba(feats_scaled)

        # Update global state with the MODE
        state["type"] = l.inverse_transform(pred)[0]
        state["mode"] = mode_label # <--- KEY ADDITION
        state["confidence"] = float(np.max(prob))

        print(f"[{state['mode']}] Predicted: {state['type']} ({round(state['confidence'], 2)})")

        loop.call_soon_threadsafe(lambda: asyncio.create_task(broadcast_state()))

# =========================
# Start Server
# =========================
async def main():
    loop = asyncio.get_running_loop()
    threading.Thread(target=prediction_worker, args=(loop,), daemon=True).start()
    async with websockets.serve(handler, "0.0.0.0", 8080):
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())