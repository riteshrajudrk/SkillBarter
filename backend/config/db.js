import mongoose from "mongoose";
import env from "./env.js";

let connectionPromise = null;

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(env.mongodbUri).then((connection) => {
      console.log("MongoDB connected");
      return connection;
    });
  }

  return connectionPromise;
};

export default connectDB;
