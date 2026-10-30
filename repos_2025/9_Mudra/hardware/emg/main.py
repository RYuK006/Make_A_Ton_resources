import serial
import time
from evdev import UInput, ecodes as e

# --- Configuration ---
SERIAL_PORT = '/dev/ttyUSB0'
BAUD_RATE = 115200
THRESHOLD = 800
# ---------------------

def run_detector():
    # Setup Virtual Input Device
    # We define BTN_LEFT so the OS recognizes this script as a mouse
    cap = {e.EV_KEY: [e.BTN_LEFT, e.BTN_RIGHT, e.BTN_MIDDLE]}
    ui = UInput(cap, name='Fist-Airmouse-Clicker')

    # Track the state to prevent duplicate events
    fist_was_clenched = False

    try:
        # Initialize serial connection
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=0.1)
        time.sleep(2) 
        print(f"Connected to {SERIAL_PORT}. Fist-to-Click Active.")

        while True:
            if ser.in_waiting > 0:
                line = ser.readline().decode('utf-8', errors='ignore').strip()
                
                try:
                    value = float(line)
                    is_clenched = value >= THRESHOLD

                    # Logic: Only send an event when the state CHANGES
                    if is_clenched and not fist_was_clenched:
                        # Fist just closed -> Press Mouse Left
                        ui.write(e.EV_KEY, e.BTN_LEFT, 1)
                        ui.syn()
                        fist_was_clenched = True
                        print(f"Value: {value:<5} | ✊ CLENCHED")

                    elif not is_clenched and fist_was_clenched:
                        # Fist just opened -> Release Mouse Left
                        ui.write(e.EV_KEY, e.BTN_LEFT, 0)
                        ui.syn()
                        fist_was_clenched = False
                        print(f"Value: {value:<5} | ✋ RELEASED")

                except ValueError:
                    continue

    except serial.SerialException as err:
        print(f"Serial Error: {err}")
    except KeyboardInterrupt:
        print("\nStopping detector...")
    finally:
        if 'ser' in locals() and ser.is_open:
            ser.close()
        ui.close()

if __name__ == "__main__":
    run_detector()
