import SwapRequest from "../models/SwapRequest.js";

export const createSwapRequest = async (req, res) => {
  const { receiverId, skillOffered, skillRequested, message } = req.body;

  if (!receiverId || !skillOffered || !skillRequested) {
    return res.status(400).json({
      message: "receiverId, skillOffered and skillRequested are required"
    });
  }

  if (String(receiverId) === String(req.user._id)) {
    return res.status(400).json({ message: "You cannot request yourself" });
  }

  const existingRequest = await SwapRequest.findOne({
    senderId: req.user._id,
    receiverId,
    status: "pending"
  });

  if (existingRequest) {
    return res.status(409).json({ message: "You already sent a pending request" });
  }

  const swapRequest = await SwapRequest.create({
    senderId: req.user._id,
    receiverId,
    skillOffered,
    skillRequested,
    message: message || "",
    status: "pending"
  });

  res.status(201).json(swapRequest);
};

export const getSwapRequests = async (req, res) => {
  const receivedRequests = await SwapRequest.find({ receiverId: req.user._id })
    .populate("senderId", "name bio skillsOffered skillsWanted")
    .sort({ createdAt: -1 });

  const sentRequests = await SwapRequest.find({ senderId: req.user._id })
    .populate("receiverId", "name bio skillsOffered skillsWanted")
    .sort({ createdAt: -1 });

  res.json({
    receivedRequests,
    sentRequests
  });
};

export const updateSwapStatus = async (req, res) => {
  const { status } = req.body;

  if (!["accepted", "rejected", "completed"].includes(status)) {
    return res.status(400).json({
      message: "Status must be accepted, rejected or completed"
    });
  }

  const swapRequest = await SwapRequest.findOne({
    _id: req.params.id,
    receiverId: req.user._id
  });

  if (!swapRequest) {
    return res.status(404).json({ message: "Request not found" });
  }

  swapRequest.status = status;
  await swapRequest.save();

  await swapRequest.populate("senderId", "name bio skillsOffered skillsWanted");
  await swapRequest.populate("receiverId", "name bio skillsOffered skillsWanted");

  res.json(swapRequest);
};
