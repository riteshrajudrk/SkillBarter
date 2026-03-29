import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { generateToken } from "../services/tokenService.js";
import env from "../config/env.js";

const googleClient = new OAuth2Client(env.googleClientId || undefined);

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

const buildAuthResponse = (user) => ({
  token: generateToken(user._id),
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    bio: user.bio,
    skillsOffered: user.skillsOffered,
    skillsWanted: user.skillsWanted,
    onboardingCompleted: user.onboardingCompleted,
    isAdmin: user.isAdmin
  }
});

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required"
    });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    password
  });

  res.status(201).json(buildAuthResponse(user));
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const passwordMatches = await user.comparePassword(password);

  if (!passwordMatches) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json(buildAuthResponse(user));
};

export const googleLogin = async (req, res) => {
  const { credential } = req.body;

  if (!credential || !env.googleClientId) {
    return res.status(400).json({ message: "Google login is not configured" });
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.googleClientId
  });

  const payload = ticket.getPayload();

  let user = await User.findOne({ email: payload.email.toLowerCase() });

  if (!user) {
    user = await User.create({
      name: payload.name,
      email: payload.email.toLowerCase(),
      avatar: payload.picture,
      googleId: payload.sub
    });
  }

  res.json(buildAuthResponse(user));
};

export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
};

export const completeOnboarding = async (req, res) => {
  const { name, bio, skillsOffered, skillsWanted } = req.body;

  if (!name || !bio) {
    return res.status(400).json({ message: "Name and bio are required" });
  }

  const formattedSkillsOffered = formatSkillArray(skillsOffered);
  const formattedSkillsWanted = formatSkillArray(skillsWanted);

  if (!formattedSkillsOffered.length || !formattedSkillsWanted.length) {
    return res.status(400).json({
      message: "Add at least one offered skill and one wanted skill"
    });
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: name.trim(),
      bio: bio.trim(),
      skillsOffered: formattedSkillsOffered,
      skillsWanted: formattedSkillsWanted,
      onboardingCompleted: true
    },
    { new: true, runValidators: true }
  ).select("-password");

  res.json(updatedUser);
};
