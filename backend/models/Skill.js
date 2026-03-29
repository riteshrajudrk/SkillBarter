import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    skillName: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    popularityScore: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
