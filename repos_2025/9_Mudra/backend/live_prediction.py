import socket
import numpy as np
import joblib
import time

# =========================
# Load trained components
# =========================
model = joblib.load("shapes_features.pkl")
scaler = joblib.load("scaler_shapes.pkl")
le = joblib.load("label_encoder_shapes.pkl")

# =========================
# UDP SETTINGS
# =========================
UDP_IP = "10.125.129.232"
UDP_PORT = 12345  # change if different

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.bind((UDP_IP, UDP_PORT))

print("Listening for IMU stream...")

# =========================
# Feature Extraction (same as training)
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

# =========================
# Resample to 300 timesteps
# =========================
def resample_to_300(data):
    data = np.array(data)
    length = data.shape[0]

    if length == 300:
        return data

    indices = np.linspace(0, length - 1, 300).astype(int)
    return data[indices]

# =========================
# Live Prediction Loop
# =========================
while True:

    cmd = input("\nPress ENTER to record 3 seconds (or type 'q' to quit): ")

    if cmd.lower() == 'q':
        break

    print("Recording... Move now!")

    start_time = time.time()
    buffer = []

    while time.time() - start_time < 2:
        try:
            data, _ = sock.recvfrom(1024)
            values = data.decode().strip().split(",")

            if len(values) == 6:
                sample = [float(v) for v in values]
                buffer.append(sample)

        except:
            continue

    if len(buffer) < 50:
        print("Too few samples captured. Try again.")
        continue

    print(f"Captured {len(buffer)} samples.")

    # Resample
    buffer_resampled = resample_to_300(buffer)

    # Flatten
    flat = buffer_resampled.flatten()

    # Feature extraction
    features = extract_features(flat).reshape(1, -1)

    # Scale
    features_scaled = scaler.transform(features)

    # Predict
    prediction = model.predict(features_scaled)
    letter = le.inverse_transform(prediction)[0]

    print("\n======================")
    print("Predicted Letter:", letter)
    print("======================")