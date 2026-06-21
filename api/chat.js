const Anthropic = require("@anthropic-ai/sdk");

const DEMO_REPLIES = {
  ldr: "The LDR (Light Dependent Resistor) is like a tiny eye that can tell if it's bright or dark! When light shines on it, electricity flows easily. When it's dark, it blocks the electricity. Connect one leg to 5V and the other to pin A0 with a 10kΩ resistor to GND. The Arduino reads the light level as a number between 0 (dark) and 1023 (very bright)!",
  led: "LEDs have two legs — the longer one is positive (+) and goes through a 220Ω resistor to your Arduino pin. The shorter leg (-) goes to GND. Never connect an LED without a resistor or it will burn out! Use digitalWrite(pin, HIGH) to turn it on and LOW to turn it off.",
  buzzer: "The buzzer makes beep sounds! Connect the (+) leg to a digital pin and the (-) leg to GND. Use tone(pin, frequency) to make it beep at different pitches. Higher frequency = higher pitch. Use noTone(pin) to stop the sound.",
  servo: "The servo motor can rotate to exact positions between 0° and 180°. It has 3 wires: Red (5V), Brown/Black (GND), and Orange (Signal → pin 9). Use #include <Servo.h>, then myServo.attach(9) in setup and myServo.write(angle) in loop!",
  ultrasonic: "The ultrasonic sensor works like a bat! It sends out a sound pulse from TRIG and listens for the echo on ECHO. The time it takes to come back tells you the distance. Formula: distance = duration × 0.034 / 2 (in cm). Connect TRIG to pin 2 and ECHO to pin 3.",
  water: "The water level sensor detects how much water touches its surface. Connect VCC to 5V, GND to GND, and Signal to A1. The Arduino reads values from 0 (dry) to ~600 (fully submerged). It's great for flood alerts and plant watering systems!",
  breadboard: "The breadboard is like a playground for circuits! The holes are connected in rows — each row of 5 holes is connected underneath. The two long rows on the sides are for power (+) and ground (-). Push components and wires into the holes to build circuits without soldering!",
  resistor: "Resistors slow down electricity — like a speed bump for electrons! The 220Ω resistor protects LEDs, and the 10kΩ resistor is used with sensors. The colored stripes tell you the resistance value. Always use one with LEDs or they'll burn out!",
};

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { message, history } = req.body;
  if (!message || message.trim().length === 0) {
    return res.status(400).json({ error: "Message is empty" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const hasApi = apiKey && apiKey !== "your-api-key-here";

  if (!hasApi) {
    const p = message.toLowerCase();
    let reply = "Great question! I'm running in demo mode right now. Try asking about: LDR, LED, buzzer, servo, ultrasonic sensor, water sensor, breadboard, or resistors!";
    for (const [key, val] of Object.entries(DEMO_REPLIES)) {
      if (p.includes(key)) { reply = val; break; }
    }
    if (p.includes("light") && !p.includes("led")) reply = DEMO_REPLIES.ldr;
    if (p.includes("distance")) reply = DEMO_REPLIES.ultrasonic;
    return res.json({ reply });
  }

  try {
    const anthropic = new Anthropic();
    const messages = (history || []).concat([{ role: "user", content: message }]);

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
    res.status(500).json({ error: err.message });
  }
};
