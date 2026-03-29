import mongoose from "mongoose";

const swapRequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    skillOffered: {
      type: String,
      required: true,
      trim: true
    },
    skillRequested: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      default: "",
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

const SwapRequest = mongoose.model("SwapRequest", swapRequestSchema);

export default SwapRequest;
