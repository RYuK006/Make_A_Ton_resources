#include <USB.h>
#include <USBHIDMouse.h>
#include <Wire.h>
#include <MPU6050_tockn.h>

USBHIDMouse Mouse;
MPU6050 mpu6050(Wire);

const float sensitivityX = 0.5;   
const float sensitivityY = 0.4;   
const float filterAlpha = 0.3;    
const float deadzone = 1.2;       

float smoothX = 0, smoothY = 0;
float accX = 0, accY = 0;

void setup() {
  Wire.begin();
  mpu6050.begin();
  mpu6050.calcGyroOffsets(true); 
  Mouse.begin();
  USB.begin();
}

void loop() {
  mpu6050.update();

  float gx = mpu6050.getGyroX(); 
  float gy = mpu6050.getGyroY();

  // Smoothing
  smoothX = (gx * filterAlpha) + (smoothX * (1.0 - filterAlpha));
  smoothY = (gy * filterAlpha) + (smoothY * (1.0 - filterAlpha));

  // --- THE ROTATION FIX ---
  // We swap smoothX and smoothY roles to fix your mapping:
  // Tilting "Up/Down" (gx) now moves Horizontal (accX)
  // Tilting "Left/Right" (gy) now moves Vertical (accY)
  
  float targetX = smoothX * sensitivityX;  // gx controls Left/Right
  float targetY = smoothY * -sensitivityY; // gy controls Up/Down

  // Apply Deadzone
  if (abs(targetX) < deadzone) targetX = 0;
  if (abs(targetY) < deadzone) targetY = 0;

  accX += targetX;
  accY += targetY;

  int moveX = (int)accX;
  int moveY = (int)accY;

  if (moveX != 0 || moveY != 0) {
    Mouse.move(moveX, moveY);
    accX -= moveX; 
    accY -= moveY;
  }
  
  delay(10); 
}
