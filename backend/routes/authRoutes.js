const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getMe,
  updateProfile,
  changePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);
router.patch("/profile", protect, updateProfile);
router.patch("/change-password", protect, changePassword);

module.exports = router;