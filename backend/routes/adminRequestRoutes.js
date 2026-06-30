const express = require("express");
const router = express.Router();
const { createRequest, getRequests, reviewRequest } = require("../controllers/adminRequestController");
const { protect, requireSuperAdmin } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", createRequest);
router.get("/", requireSuperAdmin, getRequests);
router.patch("/:id", requireSuperAdmin, reviewRequest);

module.exports = router;