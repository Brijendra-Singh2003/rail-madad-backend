"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controller/auth.controller");
const AuthRouter = express_1.default.Router();
// @/api/auth/send-otp
AuthRouter.post("/send-otp", auth_controller_1.sendOtp);
AuthRouter.post("/signup", auth_controller_1.signup);
AuthRouter.post("/signin", auth_controller_1.signin);
AuthRouter.post('/logout', (req, res) => {
    req.session = null;
    return res.json({ success: true, message: "Logged out successfully" });
});
AuthRouter.get("/session", async (req, res) => {
    return res.json(req.session);
});
// @/api/auth/verify-otp
// AuthRouter.post("/verify-otp", isAuthenticated, (req, res) => {
//   console.log("call hua");
//   res.send("hurrayh");
// });
exports.default = AuthRouter;
