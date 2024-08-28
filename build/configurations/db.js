"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const connectDB = async () => {
    console.log(process.env.DATABASE_URL);
    const DATABASEURL = process.env.DATABASE_URL || "mongodb://localhost:27017/";
    try {
        await mongoose_1.default.connect(DATABASEURL);
        console.log("Database connected ✌");
    }
    catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};
exports.default = connectDB;
