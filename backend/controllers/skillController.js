import Skill from "../models/Skill.js";
import User from "../models/User.js";

export const getMarketplace = async (req, res) => {
  const { category, level, location, q, popular } = req.query;
  const filters = { isBanned: false };

  if (level) filters.experienceLevel = level;
  if (location) filters.location = new RegExp(location, "i");
  if (q) filters["skillsOffered.name"] = new RegExp(q, "i");
  if (category) filters["skillsOffered.category"] = category;

  const users = await User.find(filters)
    .select("-password")
    .sort(popular ? { rating: -1, sessionsCompleted: -1 } : { createdAt: -1 });

  const cards = users.flatMap((user) =>
    user.skillsOffered
      .filter((skill) => !category || skill.category === category)
      .map((skill) => ({
        id: `${user._id}-${skill.name}`,
        skillTitle: skill.name,
        skillCategory: skill.category,
        experienceLevel: skill.level,
        teacher: {
          id: user._id,
          name: user.name,
          avatar: user.avatar,
          rating: user.rating,
          location: user.location
        }
      }))
  );

  res.json(cards);
};

export const listSkillCatalog = async (_req, res) => {
  const skills = await Skill.find().sort({ popularityScore: -1, skillName: 1 });
  res.json(skills);
};

export const createSkill = async (req, res) => {
  const skill = await Skill.create(req.body);
  res.status(201).json(skill);
};
