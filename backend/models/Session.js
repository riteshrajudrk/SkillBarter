import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    swapRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SwapRequest",
      required: true
    },
    scheduledTime: { type: Date, required: true },
    meetingLink: { type: String, default: "" },
    notes: { type: String, default: "" },
    reminderSent: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled"
    }
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
