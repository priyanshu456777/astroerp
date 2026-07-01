const express = require("express");
const router = express.Router();
const { sendSignupOtp, verifySignupOtp, sendLoginOtp } = require("../controllers/otpController");

router.post("/send-signup-otp", sendSignupOtp);
router.post("/verify-signup-otp", verifySignupOtp);
router.post("/send-login-otp", sendLoginOtp);

module.exports = router;