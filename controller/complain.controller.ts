import "dotenv/config";
import Complain from '../models/Complain';
import { Request, Response } from "express";
import multer from "multer";
import { bucket } from "../configurations/firebaseConfig";
import { promise } from "zod";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const ComplaintController = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    console.log(req.file); // Access the uploaded file via req.file
    console.log("user", req.session?.user);

    const { description, pnr } = req.body;
    const phone = req.session?.user.phone;

    if (!description || !pnr) {
      return res.status(400).send("All fields are required");
    }

    if (!req.file) {
      return res.status(400).send("Image is required");
    }

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

    const image_url = await new Promise<string>((resolve, reject) => {
      blobStream.on('finish', () => {
        resolve(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`);
      });
      blobStream.end(file.buffer);
    });



    // const formData = new FormData();

    // formData.append("description", description);
    // formData.append("file", new Blob([file.buffer], { type: file.mimetype }), file.originalname);

    // const response = await fetch("http://localhost:8000/analyze-grievance/", {
    //   method: "POST",
    //   body: formData
    // });

    // if(response.ok) {
    // const data = await response.json();
    const data = AiResponse;

    const complaint = new Complain({
      user: req.session?.user._id,
      phone,
      pnr,
      image_url,
      description,
      category: data.category,
      subcategory: data.subcategory,
      severity: data.severity,
    });

    complaint.conversations.push({
      role: "user",
      message: description,
    });
    complaint.conversations.push({
      role: "model",
      message: data.preliminary_response,
    });

    await complaint.save();

    return res.status(201).send({
      success: true,
      message: "Complaint registered successfully",
      complaintId: complaint.id,
    });
    // }

    //   console.log(await response.text());
    res.status(201).send({
      success: true,
      message: "Complaint registered successfully",
      // complaint,
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

export async function getComplaintCount(req: Request, res: Response) {
  try {
    const [count, pending] = await Promise.all([
      Complain.countDocuments({}),
      Complain.countDocuments({ status: "pending" })
    ]);

    const data = {
      success: true,
      count,
      pending,
    };

    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
}

export async function getMyComplaints(req: Request, res: Response) {
  const user = req.session?.user._id;
  const complaints = await Complain.find({ user })
    .select({
      image_url: true,
      description: true,
      status: true,
      pnr: true,
      createdAt: true,
      updatedAt: true,
    });

  return res.json({ success: true, data: complaints });
}

export const getComplaintById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    console.log("get complaints by id", { id });

    const complaint = await Complain.findById(id);
    console.log({ complaint });

    res.json({
      success: true,
      data: complaint?.conversations ?? [],
    });
  }
  catch (err: any) {
    console.log(err);

    res.json({
      success: false,
      message: err.message,
    });
  }
}


const AiResponse = {
  category: 'coach-cleanliness',
  subcategory: 'Others',
  severity: 'high',
  preliminary_response: 'Thank you for bringing this to our attention. We understand the importance of cleanliness and will send a cleaning crew immediately to address the issue.',
  metadata: {
    data: {
      BlueMatrixColumn: '0.14307 0.06061 0.7141',
      BlueTRC: '(Binary data 40 bytes, use -b option to extract)',
      CMMFlags: 'Not Embedded, Independent',
      ColorSpaceData: 'RGB ',
      ConnectionSpaceIlluminant: '0.9642 1 0.82491',
      DeviceAttributes: 'Reflective, Glossy, Positive, Color',
      DeviceManufacturer: '',
      DeviceModel: '',
      Directory: '.',
      ExifToolVersion: 12.57,
      FileAccessDate: '2024:08:31 15:08:14+00:00',
      FileInodeChangeDate: '2024:08:31 15:08:14+00:00',
      FileModifyDate: '2024:08:31 15:08:14+00:00',
      FileName: '',
      FilePermissions: '-rw-r--r--',
      FileSize: '46 kB',
      FileType: 'Extended WEBP',
      FileTypeExtension: 'webp',
      GreenMatrixColumn: '0.38515 0.71687 0.09708',
      GreenTRC: '(Binary data 40 bytes, use -b option to extract)',
      HorizontalScale: 0,
      ImageHeight: 320,
      ImageSize: '320x320',
      ImageWidth: 320,
      MIMEType: 'image/webp',
      MediaWhitePoint: '0.9642 1 0.82491',
      Megapixels: 0.102,
      PrimaryPlatform: 'Unknown ()',
      ProfileCMMType: '',
      ProfileClass: 'Display Device Profile',
      ProfileConnectionSpace: 'XYZ ',
      ProfileCopyright: 'Google Inc. 2016',
      ProfileCreator: '',
      ProfileDateTime: '2016:01:01 00:00:00',
      ProfileDescription: 'sRGB',
      ProfileFileSignature: 'acsp',
      ProfileID: 0,
      ProfileVersion: '4.3.0',
      RedMatrixColumn: '0.43607 0.22249 0.01392',
      RedTRC: '(Binary data 40 bytes, use -b option to extract)',
      RenderingIntent: 'Media-Relative Colorimetric',
      SourceFile: '',
      VP8Version: '0 (bicubic reconstruction, normal loop)',
      VerticalScale: 0,
      WebP_Flags: 'ICC Profile'
    }
  }
};
