import mongoose from "mongoose";
import env from "./env.js";

const connectDB = async () => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongodbUri);
  console.log("MongoDB connected");
};

export default connectDB;
