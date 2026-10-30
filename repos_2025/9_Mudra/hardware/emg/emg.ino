const int emgPin = 34; 

void setup() {
  Serial.begin(115200);
  // Explicitly set resolution for ESP32 (0-4095)
  analogReadResolution(12); 
  pinMode(emgPin, INPUT);
  Serial.println("Reading EMG Sensor...");
}

void loop() {
  int rawValue = analogRead(emgPin);
  
  // Print both raw value and a small graph bar in Serial Monitor
  Serial.println(rawValue);
  delay(100); // Slow down for debugging
}
