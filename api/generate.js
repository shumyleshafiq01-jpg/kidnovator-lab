const Anthropic = require("@anthropic-ai/sdk");

const DEMO_PROJECTS = {
  default: {
    title: "Automatic Night Light",
    code: `// Automatic Night Light - Kidnovators Kit
// Uses LDR sensor to detect darkness and turn on LED

int ldrPin = A0;    // LDR sensor connected to analog pin A0
int ledPin = 8;     // LED connected to digital pin 8
int threshold = 500; // Light threshold (adjust based on your room)

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("Night Light Ready!");
}

void loop() {
  int lightLevel = analogRead(ldrPin);
  Serial.print("Light Level: ");
  Serial.println(lightLevel);

  if (lightLevel < threshold) {
    digitalWrite(ledPin, HIGH);
    Serial.println("LED ON - It's dark!");
  } else {
    digitalWrite(ledPin, LOW);
    Serial.println("LED OFF - It's bright!");
  }

  delay(500);
}`,
    wiring: [
      "Connect one leg of the LDR to 5V on Arduino",
      "Connect the other leg of LDR to Analog pin A0 AND to one end of a 10kΩ resistor",
      "Connect the other end of the 10kΩ resistor to GND",
      "Connect the long leg (+) of the LED to Digital pin 8 through a 220Ω resistor",
      "Connect the short leg (-) of the LED to GND"
    ],
    explanation: "The LDR (Light Dependent Resistor) changes its resistance based on light. In bright light, resistance is low so the reading is high. In darkness, resistance is high so the reading is low. When the reading drops below our threshold (500), the Arduino turns on the LED. It's like giving your room a brain that knows when it's dark!",
    pins_used: { "LDR Sensor": "A0", "LED": "D8", "Power": "5V", "Ground": "GND" },
    components_needed: ["Arduino Uno", "LDR (Photoresistor)", "LED (any color)", "220Ω Resistor", "10kΩ Resistor", "Breadboard", "Jumper Wires"]
  },
  parking: {
    title: "Smart Parking Sensor with Buzzer",
    code: `// Smart Parking Sensor - Kidnovators Kit
// Buzzer beeps faster as object gets closer

int trigPin = 2;
int echoPin = 3;
int buzzerPin = 7;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzerPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("Parking Sensor Ready!");
}

long getDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH);
  return duration * 0.034 / 2;
}

void loop() {
  long distance = getDistance();
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

  if (distance < 10) {
    tone(buzzerPin, 1000);
    delay(100);
    noTone(buzzerPin);
    delay(100);
  } else if (distance < 30) {
    tone(buzzerPin, 800);
    delay(200);
    noTone(buzzerPin);
    delay(200);
  } else if (distance < 50) {
    tone(buzzerPin, 600);
    delay(500);
    noTone(buzzerPin);
    delay(500);
  } else {
    noTone(buzzerPin);
  }
}`,
    wiring: [
      "Connect Ultrasonic Sensor VCC to 5V",
      "Connect Ultrasonic Sensor GND to GND",
      "Connect Ultrasonic Sensor TRIG to Digital pin 2",
      "Connect Ultrasonic Sensor ECHO to Digital pin 3",
      "Connect Buzzer (+) to Digital pin 7",
      "Connect Buzzer (-) to GND"
    ],
    explanation: "The ultrasonic sensor sends out sound waves and measures how long they take to bounce back. This tells us how far away an object is. The closer the object, the faster the buzzer beeps — just like a real car parking sensor!",
    pins_used: { "Ultrasonic TRIG": "D2", "Ultrasonic ECHO": "D3", "Buzzer": "D7", "Power": "5V", "Ground": "GND" },
    components_needed: ["Arduino Uno", "Ultrasonic Sensor", "Buzzer", "Breadboard", "Jumper Wires"]
  },
  water: {
    title: "Water Level Alert System",
    code: `// Water Level Alert - Kidnovators Kit
// LEDs show water level, buzzer warns when high

int waterPin = A1;
int greenLed = 5;
int yellowLed = 6;
int redLed = 4;
int buzzerPin = 7;

void setup() {
  pinMode(greenLed, OUTPUT);
  pinMode(yellowLed, OUTPUT);
  pinMode(redLed, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("Water Level Monitor Ready!");
}

void loop() {
  int level = analogRead(waterPin);
  Serial.print("Water Level: ");
  Serial.println(level);

  digitalWrite(greenLed, LOW);
  digitalWrite(yellowLed, LOW);
  digitalWrite(redLed, LOW);
  noTone(buzzerPin);

  if (level > 500) {
    digitalWrite(redLed, HIGH);
    tone(buzzerPin, 1000);
    Serial.println("WARNING: Water level HIGH!");
  } else if (level > 300) {
    digitalWrite(yellowLed, HIGH);
    Serial.println("Water level: Medium");
  } else if (level > 100) {
    digitalWrite(greenLed, HIGH);
    Serial.println("Water level: Low - Safe");
  }

  delay(500);
}`,
    wiring: [
      "Connect Water Sensor VCC to 5V",
      "Connect Water Sensor GND to GND",
      "Connect Water Sensor Signal to Analog pin A1",
      "Connect Green LED to Digital pin 5 through 220Ω resistor",
      "Connect Yellow LED to Digital pin 6 through 220Ω resistor",
      "Connect Red LED to Digital pin 4 through 220Ω resistor",
      "Connect all LED short legs (-) to GND",
      "Connect Buzzer (+) to Digital pin 7, (-) to GND"
    ],
    explanation: "The water sensor detects how much water is touching it. Low water = green LED. Medium water = yellow LED. High water = red LED and buzzer alarm! It's like a smart water tank that tells you when it's getting too full.",
    pins_used: { "Water Sensor": "A1", "Green LED": "D5", "Yellow LED": "D6", "Red LED": "D4", "Buzzer": "D7" },
    components_needed: ["Arduino Uno", "Water Level Sensor", "LED Red", "LED Green", "LED Yellow", "Buzzer", "220Ω Resistors (x3)", "Breadboard", "Jumper Wires"]
  },
  traffic: {
    title: "Traffic Light Sequence",
    code: `// Traffic Light Sequence - Kidnovators Kit
// Red, Yellow, Green LEDs cycle like a real traffic light

int redPin = 4;
int yellowPin = 6;
int greenPin = 5;

void setup() {
  pinMode(redPin, OUTPUT);
  pinMode(yellowPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("Traffic Light Ready!");
}

void loop() {
  // Green ON
  digitalWrite(greenPin, HIGH);
  Serial.println("GREEN - Go!");
  delay(5000);
  digitalWrite(greenPin, LOW);

  // Yellow ON
  digitalWrite(yellowPin, HIGH);
  Serial.println("YELLOW - Slow down!");
  delay(2000);
  digitalWrite(yellowPin, LOW);

  // Red ON
  digitalWrite(redPin, HIGH);
  Serial.println("RED - Stop!");
  delay(5000);
  digitalWrite(redPin, LOW);
}`,
    wiring: [
      "Connect Red LED long leg through 220Ω resistor to Digital pin 4",
      "Connect Green LED long leg through 220Ω resistor to Digital pin 5",
      "Connect Yellow LED long leg through 220Ω resistor to Digital pin 6",
      "Connect all LED short legs (-) to GND"
    ],
    explanation: "Three LEDs cycle in the same pattern as a real traffic light: Green (go) for 5 seconds, Yellow (slow down) for 2 seconds, Red (stop) for 5 seconds, then repeat!",
    pins_used: { "Red LED": "D4", "Green LED": "D5", "Yellow LED": "D6" },
    components_needed: ["Arduino Uno", "LED Red", "LED Green", "LED Yellow", "220Ω Resistors (x3)", "Breadboard", "Jumper Wires"]
  },
  door: {
    title: "Automatic Door with Servo",
    code: `// Automatic Door - Kidnovators Kit
// Servo opens door when ultrasonic detects someone nearby

#include <Servo.h>

Servo doorServo;
int trigPin = 2;
int echoPin = 3;
int buzzerPin = 7;

void setup() {
  doorServo.attach(9);
  doorServo.write(0);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzerPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("Auto Door Ready!");
}

long getDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH);
  return duration * 0.034 / 2;
}

void loop() {
  long distance = getDistance();
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

  if (distance < 30) {
    tone(buzzerPin, 1000, 200);
    doorServo.write(90);
    Serial.println("Door OPEN");
    delay(3000);
  } else {
    doorServo.write(0);
    Serial.println("Door CLOSED");
  }
  delay(200);
}`,
    wiring: [
      "Connect Ultrasonic Sensor VCC to 5V, GND to GND",
      "Connect TRIG to Digital pin 2, ECHO to Digital pin 3",
      "Connect Servo Red wire to 5V, Brown/Black to GND",
      "Connect Servo Orange (signal) wire to Digital pin 9",
      "Connect Buzzer (+) to Digital pin 7, (-) to GND"
    ],
    explanation: "The ultrasonic sensor acts like an eye — when someone walks within 30cm, the servo motor rotates to 90° (opening the door) and the buzzer beeps. After 3 seconds, it closes again. Just like automatic doors at a shop!",
    pins_used: { "Ultrasonic TRIG": "D2", "Ultrasonic ECHO": "D3", "Servo": "D9", "Buzzer": "D7" },
    components_needed: ["Arduino Uno", "Ultrasonic Sensor", "Servo Motor", "Buzzer", "Breadboard", "Jumper Wires"]
  },
  rain: {
    title: "Rain Detector Alarm",
    code: `// Rain Detector Alarm - Kidnovators Kit
// Water sensor detects rain, buzzer and LED alert you

int waterPin = A1;
int buzzerPin = 7;
int redLed = 4;
int greenLed = 5;

void setup() {
  pinMode(buzzerPin, OUTPUT);
  pinMode(redLed, OUTPUT);
  pinMode(greenLed, OUTPUT);
  Serial.begin(9600);
  Serial.println("Rain Detector Ready!");
}

void loop() {
  int moisture = analogRead(waterPin);
  Serial.print("Moisture: ");
  Serial.println(moisture);

  if (moisture > 300) {
    digitalWrite(redLed, HIGH);
    digitalWrite(greenLed, LOW);
    tone(buzzerPin, 1500);
    delay(300);
    noTone(buzzerPin);
    delay(300);
    Serial.println("RAIN DETECTED!");
  } else {
    digitalWrite(redLed, LOW);
    digitalWrite(greenLed, HIGH);
    noTone(buzzerPin);
    Serial.println("Dry - All clear");
  }
  delay(500);
}`,
    wiring: [
      "Connect Water Sensor VCC to 5V, GND to GND",
      "Connect Water Sensor Signal to Analog pin A1",
      "Connect Red LED through 220Ω resistor to Digital pin 4",
      "Connect Green LED through 220Ω resistor to Digital pin 5",
      "Connect Buzzer (+) to Digital pin 7, (-) to GND"
    ],
    explanation: "The water sensor detects moisture on its surface. When raindrops (or any water) touch it, the reading goes up. If it crosses 300, the red LED lights up and the buzzer beeps an alarm. When it's dry, the green LED stays on — all clear!",
    pins_used: { "Water Sensor": "A1", "Red LED": "D4", "Green LED": "D5", "Buzzer": "D7" },
    components_needed: ["Arduino Uno", "Water Level Sensor", "LED Red", "LED Green", "Buzzer", "220Ω Resistors (x2)", "Breadboard", "Jumper Wires"]
  }
};

function getDemoResponse(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes("parking") || p.includes("ultrasonic") || p.includes("distance")) return DEMO_PROJECTS.parking;
  if (p.includes("water") || p.includes("flood") || p.includes("level")) return DEMO_PROJECTS.water;
  if (p.includes("traffic") || p.includes("3 led") || p.includes("three led")) return DEMO_PROJECTS.traffic;
  if (p.includes("door") || p.includes("servo") || p.includes("gate")) return DEMO_PROJECTS.door;
  if (p.includes("rain") || p.includes("detector") || p.includes("alarm")) return DEMO_PROJECTS.rain;
  return DEMO_PROJECTS.default;
}

const SYSTEM_PROMPT = `You are an expert Arduino programmer and educator for the Kidnovators AI & Robotics Kit.
This kit contains: Arduino Uno, Breadboard, LEDs (Red/Green/Yellow), Buzzer, Servo Motor,
Ultrasonic Distance Sensor, Water Level Sensor, LDR (Light Sensor/Photoresistor),
Resistors (220Ω, 470Ω, 10kΩ), Jumper Wires, 9V Battery with snap connector.

When a user describes what they want to build, generate:
1. Complete Arduino .ino code that is ready to upload
2. A brief circuit wiring guide (which pin connects to what)
3. A simple explanation of how the code works (suitable for kids aged 8-14)

Rules:
- Only use components available in the kit listed above
- Use simple variable names and add minimal but helpful comments
- Use standard Arduino libraries only (no external libraries)
- Pin assignments should be practical and avoid conflicts
- Always include setup() and loop() functions

Format your response as JSON with this structure:
{
  "title": "Project name",
  "code": "// The complete Arduino code here",
  "wiring": ["Step 1: Connect...", "Step 2: Connect..."],
  "explanation": "Simple explanation of how it works",
  "pins_used": {"component": "pin number"},
  "components_needed": ["Arduino Uno", "LED", "LDR", ...]
}

Return ONLY valid JSON, no markdown fences or extra text.`;

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt } = req.body;
  if (!prompt || prompt.trim().length === 0) {
    return res.status(400).json({ error: "Please describe what you want to build" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const hasApi = apiKey && apiKey !== "your-api-key-here";

  if (!hasApi) {
    return res.json(getDemoResponse(prompt));
  }

  try {
    const anthropic = new Anthropic();
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].text;
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse AI response");
      }
    }
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
