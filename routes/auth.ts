import express from "express";
import { sendOtp } from "../controller/auth.controller";
import { isAuthenticated } from "../middlewares/auth";

const AuthRouter = express.Router();
// @/api/auth/send-otp

AuthRouter.post("/send-otp", sendOtp);

// @/api/auth/verify-otp
AuthRouter.post("/verify-otp", isAuthenticated, (req, res) => {
  console.log("call hua");
  res.send("hurrayh");
});

export default AuthRouter;
