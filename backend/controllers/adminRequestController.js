const AdminRequest = require("../models/AdminRequest");
const User = require("../models/User");

const createRequest = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(400).json({ message: "You are already an admin" });
    }

    const existing = await AdminRequest.findOne({ userId: req.user._id, status: "pending" });
    if (existing) {
      return res.status(409).json({ message: "You already have a pending request" });
    }

    const request = await AdminRequest.create({
      userId: req.user._id,
      reason: req.body.reason || "",
    });

    await User.findByIdAndUpdate(req.user._id, { adminStatus: "pending" });

    return res.status(201).json({ message: "Admin access request submitted", request });
  } catch (error) {
    console.error("Create admin request error:", error.message);
    return res.status(500).json({ message: "Server error while submitting request" });
  }
};

const getRequests = async (req, res) => {
  try {
    const requests = await AdminRequest.find()
      .populate("userId", "name email role adminStatus")
      .sort({ createdAt: -1 });
    return res.status(200).json({ requests });
  } catch (error) {
    console.error("Get admin requests error:", error.message);
    return res.status(500).json({ message: "Server error while fetching requests" });
  }
};

const reviewRequest = async (req, res) => {
  try {
    const { decision } = req.body;
    if (!["approved", "rejected"].includes(decision)) {
      return res.status(400).json({ message: "Decision must be 'approved' or 'rejected'" });
    }

    const request = await AdminRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ message: "This request has already been reviewed" });
    }

    request.status = decision;
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();
    await request.save();

    if (decision === "approved") {
      await User.findByIdAndUpdate(request.userId, { role: "admin", adminStatus: "approved" });
    } else {
      await User.findByIdAndUpdate(request.userId, { adminStatus: "rejected" });
    }

    return res.status(200).json({ message: `Request ${decision}`, request });
  } catch (error) {
    console.error("Review admin request error:", error.message);
    return res.status(500).json({ message: "Server error while reviewing request" });
  }
};

module.exports = { createRequest, getRequests, reviewRequest };