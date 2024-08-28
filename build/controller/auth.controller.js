"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtp = void 0;
require("dotenv/config");
const twilio_1 = __importDefault(require("twilio"));
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
console.log("acc id ", twilioAccountSid);
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioServiceSid = process.env.TWILIO_SERVICE_ID;
const client = (0, twilio_1.default)(twilioAccountSid, twilioAuthToken);
const sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({ message: "Phone number is required", success: false });
        }
        // Send OTP using Twilio's Verify service
        // const verification = await client.verify.v2
        //   .services(twilioServiceSid)
        //   .verifications.create({ to: phone, channel: "sms" });
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
