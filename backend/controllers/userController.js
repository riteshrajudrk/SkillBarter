import User from "../models/User.js";
import Review from "../models/Review.js";
import { rankMatches } from "../services/matchingService.js";

const formatSkillArray = (skills = []) => {
  if (!Array.isArray(skills)) {
    return [];
  }

  return skills
    .map((skill) => {
      if (typeof skill === "string") {
        return { name: skill.trim() };
      }

      return {
        name: skill.name?.trim() || ""
      };
    })
    .filter((skill) => skill.name);
};

export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const reviews = await Review.find({ reviewee: req.params.id })
    .populate("reviewer", "name avatar")
    .sort({ createdAt: -1 })
    .limit(10);

  res.json({ user, reviews });
};

export const updateProfile = async (req, res) => {
  const { name, bio, skillsOffered, skillsWanted } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: name?.trim(),
      bio: bio?.trim(),
      skillsOffered: formatSkillArray(skillsOffered),
      skillsWanted: formatSkillArray(skillsWanted)
    },
    {
      new: true,
      runValidators: true
    }
  ).select("-password");

  res.json(updatedUser);
};

export const browseUsers = async (req, res) => {
  const { q } = req.query;
  const filters = {
    isBanned: false,
    onboardingCompleted: true
  };

  if (q) {
    filters.$or = [
      { name: new RegExp(q, "i") },
      { "skillsOffered.name": new RegExp(q, "i") },
      { "skillsWanted.name": new RegExp(q, "i") }
    ];
  }

  const users = await User.find(filters)
    .select("-password")
    .sort({ createdAt: -1 });

  res.json(users);
};

export const getRecommendedMatches = async (req, res) => {
  const currentUser = await User.findById(req.user._id).select("-password");
  const candidates = await User.find({
    _id: { $ne: req.user._id },
    isBanned: false,
    onboardingCompleted: true
  }).select("-password");

  const matches = rankMatches(currentUser, candidates).slice(0, 8);
  res.json(matches);
};
