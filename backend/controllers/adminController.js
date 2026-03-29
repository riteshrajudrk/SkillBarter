import User from "../models/User.js";
import Review from "../models/Review.js";
import Session from "../models/Session.js";
import Skill from "../models/Skill.js";

export const getAdminAnalytics = async (_req, res) => {
  const [users, reviews, sessions, skills] = await Promise.all([
    User.countDocuments(),
    Review.countDocuments(),
    Session.countDocuments(),
    Skill.countDocuments()
  ]);

  res.json({
    totals: { users, reviews, sessions, skills },
    leaderboard: await User.find()
      .select("name avatar points rating badges")
      .sort({ points: -1, rating: -1 })
      .limit(5)
  });
};

export const listUsersForAdmin = async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
};

export const toggleBanUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.isBanned = !user.isBanned;
  await user.save();
  res.json(user);
};

export const moderateReview = async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  res.json({ ok: true });
};

export const createCategory = async (req, res) => {
  const skill = await Skill.create(req.body);
  res.status(201).json(skill);
};
