import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

app.get("/", (req, res) => {
  res.send("✅ Twilio OTP Server is running successfully on Render!");
});


app.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  try {
    await client.verify.v2.services(process.env.TWILIO_SERVICE)
      .verifications.create({ to: phone, channel: "sms" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const result = await client.verify.v2.services(process.env.TWILIO_SERVICE)
      .verificationChecks.create({ to: phone, code: otp });
    res.json({ success: result.status === "approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => console.log("✅ OTP Server running on port 4000"));
