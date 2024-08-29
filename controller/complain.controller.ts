import "dotenv/config";
import Complain from '../models/Complain';
import { Request, Response } from "express";
import multer from "multer";
import {bucket} from "../configurations/firebaseConfig";
import { promise } from "zod";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const ComplaintController = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { phone, description, pnr } = req.body;
    console.log("phone", phone);
    console.log(req.file); // Access the uploaded file via req.file

    if (!phone || !description || !pnr) {
      return res.status(400).send("All fields are required");
    }
    console.log("user is ",req.session?.user);
    if(!req.file){
      return res.status(400).send("Image is also required");
    }
    let imageUrl=""
    const file = req.file;
    const fileName = `complaints/${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });
    
    blobStream.on('error', (err) => {
      console.error('Error uploading file:', err);
      return res.status(500).json({ message: "Something went wrong uploading the file" });
    });

    await new Promise<void>((resolve,reject)=>{
      blobStream.on('finish', () => {
        imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
        resolve();
      });
      blobStream.end(file.buffer);
    });

    

    const complaint = new Complain({ phone, description, pnr,image_url:imageUrl });
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
