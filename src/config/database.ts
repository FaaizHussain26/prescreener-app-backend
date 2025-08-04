import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB with URI:", process.env.MONGO_URI); // Added for debugging
    console.log("Using database name:", process.env.MONGO_DATABASE_NAME); // Added for debugging
    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: process.env.MONGO_DATABASE_NAME as string,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
