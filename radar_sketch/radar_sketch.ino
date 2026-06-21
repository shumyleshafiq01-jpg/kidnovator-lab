#include <Servo.h>

#define trigPin 9
#define echoPin 10

long duration;
int distance;
bool motorOn = true;
int sweepDelay = 15;
String cmd = "";

Servo myservo;

int calculateDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.034 / 2;
  return distance;
}

void checkSerial() {
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n') {
      cmd.trim();
      if (cmd == "M0") motorOn = false;
      if (cmd == "M1") motorOn = true;
      if (cmd == "S1") sweepDelay = 30;
      if (cmd == "S2") sweepDelay = 15;
      if (cmd == "S3") sweepDelay = 8;
      if (cmd == "S4") sweepDelay = 3;
      cmd = "";
    } else {
      cmd += c;
    }
  }
}

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  myservo.attach(11);
  Serial.begin(9600);
}

void loop() {
  checkSerial();

  if (!motorOn) {
    delay(50);
    return;
  }

  int i;
  for (i = 15; i <= 165; i++) {
    checkSerial();
    if (!motorOn) return;

    myservo.write(i);
    delay(sweepDelay);
    calculateDistance();
    Serial.print(i);
    Serial.print(",");
    Serial.print(distance);
    Serial.print(".");
  }

  for (i = 165; i >= 15; i--) {
    checkSerial();
    if (!motorOn) return;

    myservo.write(i);
    delay(sweepDelay);
    calculateDistance();
    Serial.print(i);
    Serial.print(",");
    Serial.print(distance);
    Serial.print(".");
  }
}
