// ===============================
// ✅ Twilio OTP Server for Render
// ===============================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route (Render test)
app.get("/", (req, res) => {
  res.send("✅ Twilio OTP Server is running successfully on Render!");
});

// Initialize Twilio client
if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH || !process.env.TWILIO_SERVICE) {
  console.error("❌ Missing Twilio environment variables! Please check Render Settings → Environment.");
  process.exit(1);
}

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

// ===============================
// 📲 Route: Send OTP
// ===============================
app.post("/send-otp", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ success: false, message: "Phone number is required" });
  }

  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_SERVICE)
      .verifications.create({ to: phone, channel: "sms" });

    console.log(`✅ OTP sent to ${phone}`);
    res.json({ success: true, message: "OTP sent successfully", sid: verification.sid });
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP", error: error.message });
  }
});

// ===============================
// 🔐 Route: Verify OTP
// ===============================
app.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: "Phone number and OTP are required" });
  }

  try {
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_SERVICE)
      .verificationChecks.create({ to: phone, code: otp });

    if (verificationCheck.status === "approved") {
      console.log(`✅ OTP verified for ${phone}`);
      res.json({ success: true, message: "OTP verified successfully" });
    } else {
      res.json({ success: false, message: "Invalid or expired OTP" });
    }
  } catch (error) {
    console.error("❌ Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "OTP verification failed", error: error.message });
  }
});

// ===============================
// 🚀 Start Server (Render auto assigns port)
// ===============================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Twilio OTP Server running on port ${PORT}`);
});


// --- KEEP SERVER ALIVE ---
import fetch from "node-fetch"; // or const fetch = require("node-fetch"); if using CommonJS

setInterval(() => {
  fetch("https://college-live-dashboard.onrender.com/")
    .then(() => console.log("🟢 Keep-alive ping successful"))
    .catch((err) => console.error("🔴 Keep-alive ping failed:", err.message));
}, 10 * 60 * 1000); // every 10 minutes
