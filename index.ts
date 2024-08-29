import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./configurations/db";
import AuthRouter from "./routes/auth";
import Userrouter from "./routes/user";
import Complainrouter from "./routes/complaint";

import formidable from 'formidable';


const app = express();
const PORT = process.env.PORT || 8800;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// CORS configuration
const corsOptions = {
  origin: FRONTEND_URL,
  credential: true,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", AuthRouter);
app.use("/api/user", Userrouter);
app.use("/api/complaints", Complainrouter);



app.get("/hi", (req, res) => {
  console.log("hello");
  res.json("hi");
});

app.get("*", (req, res) => {
  res.sendStatus(404);
})

async function main() {
  await connectDB(); // await database connection before listening to incoming requests

  app.listen(PORT, () => {
    console.log(`Your backend is running at http://localhost:${PORT}`);
  });
}

main();
