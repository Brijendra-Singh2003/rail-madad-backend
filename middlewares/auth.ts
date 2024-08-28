import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import twilio from "twilio";
import { z } from 'zod';

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
console.log("acc id ", twilioAccountSid);
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioServiceSid = process.env.TWILIO_SERVICE_ID;

const client = twilio(twilioAccountSid, twilioAuthToken);

const bodySchema = z.object({
  phone: z.string().length(10),
  otp: z.string().length(6),
});

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  // TODO: check if user is logged in.
  // 1. check cookies for user data 
  // 2. parse user data and store it in req.body.user
  // 3. else return un-authenticated status.

  // ye sb @/api/auth/verify-otp controller me kr.
  try {
    const result = bodySchema.safeParse(req.body);
    
    if (!result.success) {
      return res.json({success: false, message: result.error.message});
    }

    const {phone, otp} = result.data;
    
    if(otp === '123456') {
      res.json({success: true, message: "varification successful"});
    } else {
      res.json({success: false, message: "Incorrect OTP"});
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
  } catch (error) {
    console.error("Error during OTP verification:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
  // next();
}
