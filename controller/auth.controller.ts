import "dotenv/config";
import twilio from "twilio";
import { Request, Response } from "express";

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
console.log("acc id ", twilioAccountSid);
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioServiceSid = process.env.TWILIO_SERVICE_ID;

const client = twilio(twilioAccountSid, twilioAuthToken);

export const sendOtp = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

