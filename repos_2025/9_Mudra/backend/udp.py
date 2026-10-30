import socket
import os
import time
import numpy as np
import string

UDP_IP = "10.125.129.232"
UDP_PORT = 12345
RECORD_DURATION = 2
FIXED_LENGTH = 300   # resample target

DATASET_FILE = "datasets/shapes.csv"

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.bind((UDP_IP, UDP_PORT))
sock.settimeout(1.0)

print("IMU Dataset Recorder (Single CSV Mode)")
print("Each gesture becomes one row.\n")

def resample_signal(data, target_len):
    data = np.array(data)
    original_len = len(data)

    indices = np.linspace(0, original_len - 1, target_len)
    resampled = []

    for col in range(data.shape[1]):
        resampled_col = np.interp(indices,
                                  np.arange(original_len),
                                  data[:, col])
        resampled.append(resampled_col)

    return np.array(resampled).T  # shape (target_len, 6)

while True:

    label = input("Enter letter (A-Z) or 'stop': ").strip().upper()

    if label == "STOP":
        print("Exiting.")
        break

    # if label not in string.ascii_uppercase:
    #     print("Invalid label.\n")
    #     continue

    cmd = input("Press ENTER to record | 'stop' to exit: ").strip().lower()
    if cmd == "stop":
        break

    print("Recording for 3 seconds... Move now!")

    gesture = []
    start_time = time.time()

    while time.time() - start_time < RECORD_DURATION:
        try:
            data, _ = sock.recvfrom(1024)
        except socket.timeout:
            continue

        try:
            values = list(map(int, data.decode().strip().split(",")))
        except:
            continue

        if len(values) != 6:
            continue

        if any(abs(v) > 40000 for v in values):
            continue

        gesture.append(values)

    if len(gesture) < 50:
        print("Too few samples. Discarded.\n")
        continue

    print(f"Captured {len(gesture)} samples.")

    confirm = input("Save this sample? (y/n): ").strip().lower()
    if confirm != 'y':
        print("Discarded.\n")
        continue

    # 🔥 Resample to fixed length
    gesture_resampled = resample_signal(gesture, FIXED_LENGTH)

    # Flatten into single vector
    flat = gesture_resampled.flatten()

    # Append label
    row = np.append(flat, label)

    # Save to dataset.csv
    with open(DATASET_FILE, "a") as f:
        f.write(",".join(map(str, row)) + "\n")

    print("Sample appended to dataset.csv ✔\n")