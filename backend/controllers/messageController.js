import Message from "../models/Message.js";
import SwapRequest from "../models/SwapRequest.js";

const conversationIdFor = (userId, partnerId) =>
  [String(userId), String(partnerId)].sort().join(":");

const findAcceptedSwap = async (userId, partnerId) => {
  return SwapRequest.findOne({
    $or: [
      { senderId: userId, receiverId: partnerId },
      { senderId: partnerId, receiverId: userId }
    ],
    status: { $in: ["accepted", "completed"] }
  });
};

export const getContacts = async (req, res) => {
  const requests = await SwapRequest.find({
    $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
    status: { $in: ["accepted", "completed"] }
  })
    .populate("senderId", "name bio skillsOffered skillsWanted")
    .populate("receiverId", "name bio skillsOffered skillsWanted")
    .sort({ updatedAt: -1 });

  const contacts = [];

  for (const request of requests) {
    const otherUser = String(request.senderId._id) === String(req.user._id)
      ? request.receiverId
      : request.senderId;

    if (!contacts.find((contact) => String(contact._id) === String(otherUser._id))) {
      contacts.push(otherUser);
    }
  }

  res.json(contacts);
};

export const getConversation = async (req, res) => {
  const acceptedSwap = await findAcceptedSwap(req.user._id, req.params.partnerId);

  if (!acceptedSwap) {
    return res.status(403).json({
      message: "You can only message users with accepted swap requests"
    });
  }

  const conversationId = conversationIdFor(req.user._id, req.params.partnerId);
  const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
  res.json(messages);
};

export const sendMessage = async (req, res) => {
  const { receiver, message } = req.body;

  if (!receiver || !message) {
    return res.status(400).json({ message: "Receiver and message are required" });
  }

  const acceptedSwap = await findAcceptedSwap(req.user._id, receiver);

  if (!acceptedSwap) {
    return res.status(403).json({
      message: "You can only message users with accepted swap requests"
    });
  }

  const conversationId = conversationIdFor(req.user._id, receiver);
  const savedMessage = await Message.create({
    conversationId,
    sender: req.user._id,
    receiver,
    message
  });

  res.status(201).json(savedMessage);
};

export const markConversationRead = async (req, res) => {
  const acceptedSwap = await findAcceptedSwap(req.user._id, req.params.partnerId);

  if (!acceptedSwap) {
    return res.status(403).json({
      message: "You can only open conversations with accepted swap requests"
    });
  }

  const conversationId = conversationIdFor(req.user._id, req.params.partnerId);
  await Message.updateMany(
    { conversationId, receiver: req.user._id, readAt: null },
    { readAt: new Date() }
  );

  res.json({ ok: true });
};
