"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtp = void 0;
exports.signup = signup;
exports.signin = signin;
require("dotenv/config");
const zod_1 = require("zod");
const User_1 = __importDefault(require("../models/User"));
const signupSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().optional(),
    phone: zod_1.z.string().length(10),
    otp: zod_1.z.string().length(6),
});
const loginSchema = zod_1.z.object({
    phone: zod_1.z.string().length(10),
    otp: zod_1.z.string().length(6),
});
async function signup(req, res) {
    const result = signupSchema.safeParse(req.body);
    // check input
    if (!result.success) {
        return res.status(400).json({ success: false, error: result.error.formErrors.fieldErrors, message: "Bad request" });
    }
    // verify otp
    if (result.data.otp !== "123456") {
        return res.json({ success: false, message: 'incorrect otp' });
    }
    // const verificationCheck = await twilioService.verificationChecks.create({ to: result.data.phone, code: result.data.otp });
    // if (verificationCheck.status !== "approved") {
    //   return res.json({success: false, message: verificationCheck.status});
    // }
    // create user
    const copy = await User_1.default.findOne({ phone: result.data.phone });
    if (copy?._id) {
        return res.json({ success: false, message: "Phone number already used" });
    }
    const user = await User_1.default.create({
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        phone: result.data.phone,
    });
    // store user in cookies
    if (req.session) {
        req.session.user = user;
    }
    else {
        throw new Error("session not initialized");
    }
    return res.json({ success: true, message: "Verification successful" });
}
async function signin(req, res) {
    const result = loginSchema.safeParse(req.body);
    // check input
    if (!result.success) {
        return res.status(400).json({ success: false, error: result.error.formErrors.fieldErrors, message: "Bad request" });
    }
    console.log(result.data);
    // search user
    const user = await User_1.default.findOne({ phone: result.data.phone });
    console.log({ user });
    if (!user?._id) {
        return res.json({ success: false, message: "Account not found" });
    }
    // verify otp
    if (result.data.otp !== "123456") {
        return res.json({ success: false, message: 'incorrect otp' });
    }
    // const verificationCheck = await twilioService.verificationChecks.create({ to: result.data.phone, code: result.data.otp });
    // if (verificationCheck.status !== "approved") {
    //   return res.json({ success: false, message: verificationCheck.status });
    // }
    // store user in cookies
    if (req.session) {
        req.session.user = user;
    }
    else {
        throw new Error("session not initialized");
    }
    return res.json({ success: true, message: "Verification successful" });
}
const sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({ message: "Phone number is required", success: false });
        }
        // Send OTP
        // const verification = await twilioService.verifications.create({ to: phone, channel: "sms" });
        // if (verification.status === "pending") {
        res.status(200).json({ message: "OTP sent successfully", success: true });
        // } else {
        //   res.status(500).json({ message: "Failed to send OTP", success: false });
        // }
    }
    catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};
exports.sendOtp = sendOtp;
