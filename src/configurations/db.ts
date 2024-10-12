import mongoose from "mongoose";

const DATABASEURL = process.env.DATABASE_URL as string;

const connectDB = async () => {
  console.log("connecting to db...");
  try {
    await mongoose.connect(DATABASEURL);
  } catch (error: any) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
  console.log("Database connected ✌");
};

export default connectDB;