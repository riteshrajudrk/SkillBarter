import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const skillTagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    }
  },
  { _id: false }
);

const availabilitySchema = new mongoose.Schema(
  {
    day: String,
    slots: [String]
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    headline: { type: String, default: "" },
    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    },
    skillsOffered: [skillTagSchema],
    skillsWanted: [skillTagSchema],
    portfolioLinks: [String],
    availability: [availabilitySchema],
    rating: { type: Number, default: 5 },
    reputation: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    badges: [String],
    sessionsCompleted: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    googleId: { type: String, default: "" },
    onboardingCompleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

userSchema.pre("save", async function savePassword(next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password || "");
};

const User = mongoose.model("User", userSchema);

export default User;
