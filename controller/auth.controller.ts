import "dotenv/config";
import { Request, Response } from "express";
import { z } from "zod";
import User from "../models/User";
import twilioService from "../configurations/twilio";

const signupSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  phone: z.string().length(10),
  otp: z.string().length(6),
});

const loginSchema = z.object({
  phone: z.string().length(10),
  otp: z.string().length(6),
});

export async function signup(req: Request, res: Response<{ success: boolean; message: string; error?: any }>) {
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
  const copy = await User.findOne({ phone: result.data.phone });

  if (copy?._id) {
    return res.json({ success: false, message: "Phone number already used" });
  }

  const user = await User.create({
    firstName: result.data.firstName,
    lastName: result.data.lastName,
    phone: result.data.phone,
  });

  // store user in cookies
  if (req.session) {
    req.session.user = user;
  } else {
    throw new Error("session not initialized");
  }

  return res.json({ success: true, message: "Verification successful" });
}

export async function signin(req: Request, res: Response<{ success: boolean; message: string; error?: any }>) {
  const result = loginSchema.safeParse(req.body);
  
  // check input
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.error.formErrors.fieldErrors, message: "Bad request" });
  }
  
  console.log(result.data);
  // search user
  const user = await User.findOne({ phone: result.data.phone });

  console.log({user});

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
  } else {
    throw new Error("session not initialized");
  }

  return res.json({ success: true, message: "Verification successful" });
}

export const sendOtp = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

