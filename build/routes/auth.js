"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controller/auth.controller");
const auth_1 = require("../middlewares/auth");
const AuthRouter = express_1.default.Router();
// @/api/auth/send-otp
AuthRouter.post("/send-otp", auth_controller_1.sendOtp);
// @/api/auth/verify-otp
AuthRouter.post("/verify-otp", auth_1.isAuthenticated, (req, res) => {
    console.log("call hua");
    res.send("hurrayh");
});
exports.default = AuthRouter;
