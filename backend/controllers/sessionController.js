import Session from "../models/Session.js";
import SwapRequest from "../models/SwapRequest.js";
import User from "../models/User.js";
import { buildBadges } from "../services/badgeService.js";

export const listSessions = async (req, res) => {
  const sessions = await Session.find({ participants: req.user._id })
    .populate("participants", "name avatar")
    .populate("swapRequest")
    .sort({ scheduledTime: 1 });

  res.json(sessions);
};

export const createSession = async (req, res) => {
  const swap = await SwapRequest.findById(req.body.swapRequest);
  if (!swap || ![String(swap.senderId), String(swap.receiverId)].includes(String(req.user._id))) {
    return res.status(404).json({ message: "Related swap request not found" });
  }

  const session = await Session.create({
    ...req.body,
    participants: [swap.senderId, swap.receiverId]
  });

  res.status(201).json(session);
};

export const updateSessionStatus = async (req, res) => {
  const session = await Session.findOneAndUpdate(
    { _id: req.params.id, participants: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  if (req.body.status === "Completed") {
    await Promise.all(
      session.participants.map(async (participantId) => {
        const user = await User.findById(participantId);
        user.sessionsCompleted += 1;
        user.points += 50;
        user.badges = buildBadges(user);
        await user.save();
      })
    );
  }

  res.json(session);
};
