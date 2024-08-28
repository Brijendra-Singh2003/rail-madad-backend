"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = isAuthenticated;
require("dotenv/config");
const twilio_1 = __importDefault(require("twilio"));
const zod_1 = require("zod");
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
console.log("acc id ", twilioAccountSid);
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioServiceSid = process.env.TWILIO_SERVICE_ID;
const client = (0, twilio_1.default)(twilioAccountSid, twilioAuthToken);
const bodySchema = zod_1.z.object({
    phone: zod_1.z.string().length(10),
    otp: zod_1.z.string().length(6),
});
async function isAuthenticated(req, res, next) {
    // TODO: check if user is logged in.
    // 1. check cookies for user data 
    // 2. parse user data and store it in req.body.user
    // 3. else return un-authenticated status.
    // ye sb @/api/auth/verify-otp controller me kr.
    try {
        const result = bodySchema.safeParse(req.body);
        if (!result.success) {
            return res.json({ success: false, message: result.error.message });
        }
        const { phone, otp } = result.data;
        if (otp === '123456') {
            res.json({ success: true, message: "varification successful" });
        }
        else {
            res.json({ success: false, message: "Incorrect OTP" });
        }
        // // Verify the OTP using Twilio's Verify service
        // const verificationCheck = await client.verify.v2
        //   .services(twilioServiceSid)
        //   .verificationChecks.create({ to: phone, code: otp });
        // if (verificationCheck.status === "approved") {
        //   // OTP is correct, proceed to the next middleware
        //   console.log("approved");
        //   next();
        // } else {
        //   // OTP is incorrect
        //   res.status(401).json({ message: "Unauthorized: Incorrect OTP" });
        // }
    }
    catch (error) {
        console.error("Error during OTP verification:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
    // next();
}
