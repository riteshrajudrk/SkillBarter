import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import SwapRequest from "../models/SwapRequest.js";

dotenv.config();

const buildSkills = (items) => items.map((item) => ({ name: item }));

const demoUsers = [
  {
    name: "Aarav Sharma",
    email: "aarav@example.com",
    password: "123456",
    bio: "Frontend developer who enjoys teaching React and JavaScript.",
    skillsOffered: buildSkills(["React", "JavaScript"]),
    skillsWanted: buildSkills(["UI Design", "Figma"]),
    onboardingCompleted: true
  },
  {
    name: "Meera Patel",
    email: "meera@example.com",
    password: "123456",
    bio: "UI designer looking to exchange design skills for backend learning.",
    skillsOffered: buildSkills(["UI Design", "Figma"]),
    skillsWanted: buildSkills(["Node.js", "MongoDB"]),
    onboardingCompleted: true
  },
  {
    name: "Rohan Verma",
    email: "rohan@example.com",
    password: "123456",
    bio: "Backend learner who can help with MongoDB and Express basics.",
    skillsOffered: buildSkills(["Node.js", "MongoDB"]),
    skillsWanted: buildSkills(["React", "JavaScript"]),
    onboardingCompleted: true
  }
];

const seedDemo = async () => {
  await connectDB();

  await SwapRequest.deleteMany({});
  await User.deleteMany({});

  const createdUsers = [];

  for (const userData of demoUsers) {
    const user = await User.create(userData);
    createdUsers.push(user);
  }

  await SwapRequest.create({
    senderId: createdUsers[0]._id,
    receiverId: createdUsers[1]._id,
    skillOffered: "React",
    skillRequested: "UI Design",
    message: "Hi, I can teach React and would like to learn UI Design.",
    status: "pending"
  });

  await SwapRequest.create({
    senderId: createdUsers[1]._id,
    receiverId: createdUsers[2]._id,
    skillOffered: "UI Design",
    skillRequested: "Node.js",
    message: "Would you like to swap design help for backend basics?",
    status: "accepted"
  });

  console.log("Demo data created successfully.");
  console.log("Login with: aarav@example.com / 123456");
  console.log("Login with: meera@example.com / 123456");
  console.log("Login with: rohan@example.com / 123456");

  await mongoose.connection.close();
};

seedDemo().catch(async (error) => {
  console.error("Failed to seed demo data", error);
  await mongoose.connection.close();
  process.exit(1);
});
