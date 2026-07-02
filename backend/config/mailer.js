const axios = require("axios");

const sendOtpEmail = async (toEmail, otp, purpose) => {
  const subject = purpose === "signup" ? "Verify your AstroERP account" : "Your AstroERP login code";
  const html = `
    <div style="font-family: sans-serif; max-width: 400px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
      <h2 style="color: #0B2530;">AstroERP</h2>
      <p style="color: #444;">${purpose === "signup" ? "Use this code to verify your email:" : "Use this code to log in:"}</p>
      <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #10b981; margin: 16px 0;">${otp}</div>
      <p style="color: #888; font-size: 13px;">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
    </div>
  `;

  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: { name: "AstroERP", email: "priyanshu456sh3@gmail.com" },
      to: [{ email: toEmail }],
      subject,
      htmlContent: html,
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
};

module.exports = { sendOtpEmail };