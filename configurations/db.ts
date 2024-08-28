import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  console.log(process.env.DATABASE_URL);

  const DATABASEURL = process.env.DATABASE_URL || "mongodb://localhost:27017/";
  try {
    await mongoose.connect(DATABASEURL);

    console.log("Database connected ✌");
  } catch (error: any) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;