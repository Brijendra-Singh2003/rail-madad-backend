import "dotenv/config";
import User from "../models/User";
import { Request, Response } from "express";

export const registerControler = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, phone, PNR } = req.body;
    if (!firstName || !lastName || !phone || !PNR) {
      res.send("All feilds are require");
    }

    let user = new User({
      firstName,
      lastName,
      phone,
      PNR,
      //   isDeleted: false,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch(error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
