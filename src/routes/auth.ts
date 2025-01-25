import express from "express";
import { signin, sendOtp, signup } from "../controller/auth.controller";
import { isAuthenticated,isAdmin } from "../middlewares/auth";

const AuthRouter = express.Router();

// @/api/auth/send-otp
AuthRouter.post("/send-otp", sendOtp);

AuthRouter.post("/signup", signup);

AuthRouter.post("/signin", signin);

AuthRouter.post('/logout', (req, res) => {
  req.session = null;
  return res.json({ success: true, message: "Logged out successfully" });
});

AuthRouter.get("/session", async (req, res) => {
  return res.json(req.session);
});

AuthRouter.get("/checkAccess",isAdmin,(req,res)=>{
  return res.json(({success:true,message:"admin"}));
});



// @/api/auth/verify-otp
// AuthRouter.post("/verify-otp", isAuthenticated, (req, res) => {
//   console.log("call hua");
//   res.send("hurrayh");
// });

export default AuthRouter;
