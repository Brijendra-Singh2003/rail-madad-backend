import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import cors, { CorsOptions } from "cors";
import path from "path";

import connectDB from "./configurations/db";
import AuthRouter from "./routes/auth";
import Userrouter from "./routes/user";
import Complainrouter from "./routes/complaint";

import formidable from 'formidable';


const app = express();
const PORT = process.env.PORT || 8800;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const AUTH_SECRET = process.env.AUTH_SECRET as string;

// CORS configuration
const corsOptions: CorsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieSession({
  name: 'session',
  keys: [AUTH_SECRET], // Replace with your secret

  // Cookie Options
  maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
}));
app.use(cookieParser());

// Routes
app.use("/api/auth", AuthRouter);
app.use("/api/user", Userrouter);
app.use("/api/complaints", Complainrouter);



app.get("/hi", (req, res) => {
  console.log(req.session);
  console.log("hello");
  res.json("hi");
});

// app.use(express.static(path.join(__dirname, "../..", "/frontend/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../..", "/frontend/build/index.html"));
// });

async function main() {
  await connectDB(); // await database connection before listening to incoming requests

  app.listen(PORT, () => {
    console.log(`Your backend is running at http://localhost:${PORT}`);
  });
}

main();
