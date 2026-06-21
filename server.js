const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");
const path = require("path");
const fs = require("fs");
const { execFile } = require("child_process");
require("dotenv").config();

const ARDUINO_CLI = path.join(__dirname, "tools", "arduino-cli.exe");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const apiKey = process.env.ANTHROPIC_API_KEY;
const hasApi = apiKey && apiKey !== "your-api-key-here";
const anthropic = hasApi ? new Anthropic() : null;

if (!hasApi) {
  console.log("No API key found — running in DEMO MODE. Code generation will use sample responses.");
}

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
    // It's dark - turn ON the LED
    digitalWrite(ledPin, HIGH);
    Serial.println("LED ON - It's dark!");
  } else {
    // It's bright - turn OFF the LED
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
  }
};

function getDemoResponse(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes("parking") || p.includes("ultrasonic") || p.includes("distance")) return DEMO_PROJECTS.parking;
  if (p.includes("water") || p.includes("flood") || p.includes("rain") || p.includes("level")) return DEMO_PROJECTS.water;
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
- If the request is unclear, make reasonable assumptions and note them

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

app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim().length === 0) {
    return res.status(400).json({ error: "Please describe what you want to build" });
  }

  if (!hasApi) {
    await new Promise(r => setTimeout(r, 1200));
    return res.json(getDemoResponse(prompt));
  }

  try {
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
    console.error("API Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message || message.trim().length === 0) {
    return res.status(400).json({ error: "Message is empty" });
  }

  try {
    const messages = (history || []).concat([{ role: "user", content: message }]);

    if (!hasApi) {
      const p = message.toLowerCase();
      let reply = "Great question! I'm running in demo mode right now so I can't give a custom answer. Add your API key to the .env file to unlock the full AI tutor!";
      if (p.includes("ldr") || p.includes("light")) reply = "The LDR (Light Dependent Resistor) is like a tiny eye that can tell if it's bright or dark! When light shines on it, electricity flows easily. When it's dark, it blocks the electricity. Connect one leg to 5V and the other to pin A0 with a 10kΩ resistor to GND. The Arduino reads the light level as a number between 0 (dark) and 1023 (very bright)!";
      if (p.includes("led")) reply = "LEDs have two legs — the longer one is positive (+) and goes through a 220Ω resistor to your Arduino pin. The shorter leg (-) goes to GND. Never connect an LED without a resistor or it will burn out! Use digitalWrite(pin, HIGH) to turn it on and LOW to turn it off.";
      if (p.includes("buzzer")) reply = "The buzzer makes beep sounds! Connect the (+) leg to a digital pin and the (-) leg to GND. Use tone(pin, frequency) to make it beep at different pitches. Higher frequency = higher pitch. Use noTone(pin) to stop the sound.";
      if (p.includes("servo")) reply = "The servo motor can rotate to exact positions between 0° and 180°. It has 3 wires: Red (5V), Brown/Black (GND), and Orange (Signal → pin 9). Use #include <Servo.h>, then myServo.attach(9) in setup and myServo.write(angle) in loop!";
      if (p.includes("ultrasonic") || p.includes("distance")) reply = "The ultrasonic sensor works like a bat! It sends out a sound pulse from TRIG and listens for the echo on ECHO. The time it takes to come back tells you the distance. Formula: distance = duration × 0.034 / 2 (in cm). Connect TRIG to pin 2 and ECHO to pin 3.";
      return res.json({ reply });
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: `You are a friendly Arduino tutor for kids aged 8-14 using the Kidnovators AI & Robotics Kit.
The kit has: Arduino Uno, Breadboard, LEDs (Red/Green/Yellow), Buzzer, Servo Motor,
Ultrasonic Distance Sensor, Water Level Sensor, LDR (Photoresistor), Resistors (220Ω, 470Ω, 10kΩ), Jumper Wires, 9V Battery.
Answer questions simply. If they ask about wiring, be very specific about which pin to which hole.
Keep answers short and encouraging. Use analogies kids can understand.`,
      messages,
    });

    res.json({ reply: response.content[0].text });
  } catch (err) {
    console.error("Chat Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

function runCli(args) {
  return new Promise((resolve, reject) => {
    execFile(ARDUINO_CLI, args, { timeout: 120000 }, (err, stdout, stderr) => {
      if (err) return reject(new Error(stderr || err.message));
      resolve(stdout);
    });
  });
}

app.get("/api/boards", async (req, res) => {
  try {
    const out = await runCli(["board", "list", "--format", "json"]);
    const data = JSON.parse(out);
    const boards = (data.detected_ports || [])
      .filter(p => p.port && p.matching_boards && p.matching_boards.length > 0)
      .map(p => ({
        port: p.port.address,
        protocol: p.port.protocol,
        board: p.matching_boards[0].name,
        fqbn: p.matching_boards[0].fqbn,
      }));
    res.json({ boards });
  } catch (err) {
    res.json({ boards: [], error: err.message });
  }
});

app.post("/api/upload", async (req, res) => {
  const { code, port: portName, fqbn } = req.body;

  if (!code) return res.status(400).json({ error: "No code provided" });

  const sketchDir = path.join(__dirname, "temp_sketch");
  const sketchFile = path.join(sketchDir, "temp_sketch.ino");

  try {
    fs.mkdirSync(sketchDir, { recursive: true });
    fs.writeFileSync(sketchFile, code, "utf8");

    const boardFqbn = fqbn || "arduino:avr:uno";

    await runCli(["compile", "--fqbn", boardFqbn, sketchDir]);

    if (portName) {
      await runCli(["upload", "--fqbn", boardFqbn, "--port", portName, sketchDir]);
      res.json({ success: true, message: `Code compiled and uploaded to ${portName}` });
    } else {
      res.json({ success: true, message: "Code compiled successfully. Connect Arduino and try again to upload." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    try { fs.rmSync(sketchDir, { recursive: true, force: true }); } catch {}
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Kidnovator Code Generator running at http://localhost:${PORT}`);
});
