const Otp = require("../models/Otp");
const User = require("../models/User");
const AdminRequest = require("../models/AdminRequest");
const { sendOtpEmail } = require("../config/mailer");
const { generateAccessToken, generateRefreshToken } = require("../config/generateTokens");

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Called when user fills signup form and clicks "Continue" (sends OTP, doesn't create account yet)
const sendSignupOtp = async (req, res) => {
  try {
    const { email, ...rest } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const otp = generateOtp();
    await Otp.deleteMany({ email: email.toLowerCase(), purpose: "signup" });
    await Otp.create({
      email: email.toLowerCase(),
      otp,
      purpose: "signup",
      payload: { email, ...rest },
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendOtpEmail(email, otp, "signup");
    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Send signup OTP error:", error.message);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

// Called when user enters the OTP on signup — creates the actual account
const verifySignupOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await Otp.findOne({ email: email.toLowerCase(), purpose: "signup" });

    if (!record) return res.status(400).json({ message: "OTP expired or not found. Please request again." });
    if (record.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    const { password, role, ...rest } = record.payload;
    const wantsAdmin = role === "admin";

    const user = await User.create({
      ...rest,
      email: email.toLowerCase(),
      password: password,
      role: "student",
      adminStatus: wantsAdmin ? "pending" : "none",
    });

    if (wantsAdmin) {
      await AdminRequest.create({ userId: user._id });
    }

    await Otp.deleteMany({ email: email.toLowerCase(), purpose: "signup" });

    // If student (not requesting admin), log them in immediately — no second OTP needed
    if (!wantsAdmin) {
      const accessToken = generateAccessToken(user._id, user.role);
      const refreshToken = generateRefreshToken(user._id);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        message: "Account created successfully",
        user,
        accessToken,
        wantsAdmin: false,
      });
    }

    return res.status(201).json({ message: "Account created successfully", userId: user._id, wantsAdmin: true });
  } catch (error) {
    console.error("Verify signup OTP error:", error.message);
    return res.status(500).json({ message: "Failed to verify OTP" });
  }
};

// Kept for compatibility if any other route calls this directly
const sendLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOtp();

    await Otp.deleteMany({ email: email.toLowerCase(), purpose: "login" });
    await Otp.create({
      email: email.toLowerCase(),
      otp,
      purpose: "login",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendOtpEmail(email, otp, "login");
    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Send login OTP error:", error.message);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

module.exports = { sendSignupOtp, verifySignupOtp, sendLoginOtp };