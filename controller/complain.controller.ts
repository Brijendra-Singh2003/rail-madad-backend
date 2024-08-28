import "dotenv/config";
import Complain from '../models/Complain';
import { Request, Response } from "express";

export const ComplaintControler = async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      const { phone, discription, image_url, pnr } = req.body;
  
      if (!phone || !discription || !image_url || !pnr) {
        return res.status(400).send("All fields are required");
      }
  
      const complaint = new Complain({ phone, discription, image_url, pnr });
      await complaint.save();
  
      res.status(201).send({
        success: true,
        message: "Complaint registered successfully",
        complaint,
      });
    } catch (error: any) {
      console.error("Error during registration:", error.message);
      res.status(500).send({
        success: false,
        message: 'Error in registration',
        error: error.message,
      });
    }
  };
  