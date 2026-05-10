import "dotenv/config";
import Complain from "../models/Complain";
import { Request, Response } from "express";
import FormData from "form-data";
import axios from "axios";
import fs from "fs";
// below imports were used for Firebase storage; commented for local demo
// import multer from "multer";
// import { bucket } from "../configurations/firebaseConfig";

// upload middleware is defined in routes; controller only needs to handle the saved file

export const ComplaintController = async (req: Request, res: Response) => {
  try {
    // console.log(req.body);
    // console.log(req.file); // Access the uploaded file via req.file
    // console.log("user", req.session?.user);

    const { description, pnr, llm_tried } = req.body;
    const phone = req.session?.user.phone;
    console.log("llm_tried value is ", llm_tried, typeof llm_tried);
    if (!description || !pnr) {
      return res.status(400).send("All fields are required");
    }

    console.log("file ", req.file);
    if (!req.file) {
      return res.status(400).send("Image is required");
    }

    // multer disk storage saved file to uploads directory
    const file = req.file as Express.Multer.File;
    // Construct public URL assuming express.static is serving the uploads folder
    const host = req.get("host");
    const protocol = req.protocol;
    const image_url = `${protocol}://${host}/uploads/${file.filename}`;
    console.log("local file saved at", file.path, "image_url", image_url);

    // -- firebase upload logic, kept for reference (commented) --
    /*
    const fileName = `complaints/${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);
    const blobStream = fileUpload.createWriteStream({
      metadata: { contentType: file.mimetype },
    });
    blobStream.on("error", (err) => {
      console.error("Error uploading file:", err);
      return res
        .status(500)
        .json({ message: "Something went wrong uploading the file" });
    });
    const image_url = await new Promise<string>((resolve, reject) => {
      blobStream.on("finish", () => {
        resolve(
          `https://firebasestorage.googleapis.com/v0/b/${
            bucket.name
          }/o/${encodeURIComponent(fileName)}?alt=media`,
        );
      });
      blobStream.end(file.buffer);
    });
    console.log("url:", image_url);
    */

    // const formData = new FormData();

    // formData.append("description", description);

    // const response = await fetch("http://localhost:8000/analyze-grievance/", {
    //   method: "POST",
    //   body: formData
    // });

    // if(response.ok) {
    // const data = await response.json();
    // const data = AiResponse;
    const formData = new FormData();
    formData.append("text", description);
    formData.append("image_url", ""); // currently sendinf null image_url until I fiXed the cloud deploymeny issue
    // since we use disk storage, read the file as stream
    // as we are using the url to send to ai server
    // formData.append(
    //   "image",
    //   fs.createReadStream(file.path) as any,
    //   {
    //     filename: file.originalname,
    //     contentType: file.mimetype,
    //   } as any,
    // );
    let response;
    if (llm_tried == "true") {
      console.log("Calling ai server with llm");
      response = await axios.post(
        process.env.AI_SERVER_URL + "classify_with_llm",
        formData,
        {
          headers: formData.getHeaders(),
        },
      );
    } else {
      console.log("Calling ai server without llm");
      response = await axios.post(
        process.env.AI_SERVER_URL + "classify",
        formData,
        {
          headers: formData.getHeaders(),
        },
      );
    }
    const data = response.data;
    console.log("respnse from ai server :", response.data);

    // Do not save complaint here; return data for user confirmation
    const complaintData = {
      user: req.session?.user._id,
      phone,
      pnr,
      image_url,
      description,
      category: data.category,
      subcategory: data.subCategory,
      severity: data.severity,
    };

    return res.status(200).send({
      success: true,
      message: "Classification completed, awaiting user confirmation",
      data: {
        category: data.category,
        subcategory: data.subCategory,
        severity: data.severity,
        image_url,
        description,
        pnr,
        phone,
      },
    });
    // }
  } catch (error: any) {
    console.error("Error during registration:", error.message);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};

export async function humanResponse(req: Request, res: Response) {
  try {
    const { agree, complaintData } = req.body;
    console.log("agree:", agree, "complaintData:", complaintData);

    if (!complaintData) {
      return res.status(400).send({
        success: false,
        message: "Complaint data is required",
      });
    }

    if (agree) {
      // Save the complaint
      console.log("Complaints Data is ", complaintData);
      const complaintDataWithUser = {
        ...complaintData,
        user: req.session?.user._id,
      };
      const complaint = new Complain(complaintDataWithUser);
      await complaint.save();

      return res.status(201).send({
        success: true,
        message: "Complaint registered successfully",
        data: {
          complaintId: complaint._id,
          category: complaint.category,
          subcategory: complaint.subcategory,
          severity: complaint.severity,
        },
      });
    } else {
      // User disagreed, do not save
      return res.status(200).send({
        success: true,
        message: "Complaint not saved as per user choice",
      });
    }
  } catch (error) {
    console.error("Error during human response:", error);
    res.status(500).send({
      success: false,
      message: "Error in human response",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function getComplaintCount(req: Request, res: Response) {
  try {
    const [count, pending] = await Promise.all([
      Complain.countDocuments({}),
      Complain.countDocuments({ status: "pending" }),
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
  const complaints = await Complain.find({ user }).select({
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
      data: complaint,
    });
  } catch (err: any) {
    console.error(err);

    res.json({
      success: false,
      message: err.message,
    });
  }
};

export async function getComplaintBYId(req: Request, res: Response) {
  const { id } = req.params; // Extract the id from req.params
  // console.log("id is", id);

  if (!id) {
    console.error("No complaint ID received");
    return res.status(400).send({
      success: false,
      message: "No complaint ID provided",
    });
  }

  try {
    const complaint = await Complain.findById(id); // Pass only the id to findById
    // console.log("complaint is", complaint);

    if (complaint) {
      return res.status(200).send({
        success: true,
        data: complaint,
      });
    } else {
      return res.status(404).send({
        success: false,
        message: "Complaint not found",
      });
    }
  } catch (error: any) {
    console.error("Error fetching complaint:", error);
    return res.status(500).send({
      success: false,
      message: "Error fetching complaint",
    });
  }
}

export const changeStatus = async (req: Request, res: Response) => {
  try {
    const { id, status } = req.body;
    // fetch the complaint according to the is given

    console.log("id and status is ", id, "amd", status);

    const complaint = await Complain.findById(id);
    if (!complaint) {
      res.status(404).send("no complain found");
    } else {
      console.log("pehle ", complaint);
      complaint.status = status;

      const updatedComplaint = await complaint.save();

      console.log("Complaint after update:", updatedComplaint);
      return res
        .status(200)
        .json({ message: "Status updated successfully", complaint });
    }
  } catch (error: any) {
    console.error("Error fetching complaint:", error);
    return res.status(500).send({
      success: false,
      message: "Error fetching complaint",
    });
  }
};

const AiResponse = {
  category: "coach-cleanliness",
  subcategory: "Others",
  severity: "high",
  preliminary_response:
    "Thank you for bringing this to our attention. We understand the importance of cleanliness and will send a cleaning crew immediately to address the issue.",
  metadata: {
    data: {
      BlueMatrixColumn: "0.14307 0.06061 0.7141",
      BlueTRC: "(Binary data 40 bytes, use -b option to extract)",
      CMMFlags: "Not Embedded, Independent",
      ColorSpaceData: "RGB ",
      ConnectionSpaceIlluminant: "0.9642 1 0.82491",
      DeviceAttributes: "Reflective, Glossy, Positive, Color",
      DeviceManufacturer: "",
      DeviceModel: "",
      Directory: ".",
      ExifToolVersion: 12.57,
      FileAccessDate: "2024:08:31 15:08:14+00:00",
      FileInodeChangeDate: "2024:08:31 15:08:14+00:00",
      FileModifyDate: "2024:08:31 15:08:14+00:00",
      FileName: "",
      FilePermissions: "-rw-r--r--",
      FileSize: "46 kB",
      FileType: "Extended WEBP",
      FileTypeExtension: "webp",
      GreenMatrixColumn: "0.38515 0.71687 0.09708",
      GreenTRC: "(Binary data 40 bytes, use -b option to extract)",
      HorizontalScale: 0,
      ImageHeight: 320,
      ImageSize: "320x320",
      ImageWidth: 320,
      MIMEType: "image/webp",
      MediaWhitePoint: "0.9642 1 0.82491",
      Megapixels: 0.102,
      PrimaryPlatform: "Unknown ()",
      ProfileCMMType: "",
      ProfileClass: "Display Device Profile",
      ProfileConnectionSpace: "XYZ ",
      ProfileCopyright: "Google Inc. 2016",
      ProfileCreator: "",
      ProfileDateTime: "2016:01:01 00:00:00",
      ProfileDescription: "sRGB",
      ProfileFileSignature: "acsp",
      ProfileID: 0,
      ProfileVersion: "4.3.0",
      RedMatrixColumn: "0.43607 0.22249 0.01392",
      RedTRC: "(Binary data 40 bytes, use -b option to extract)",
      RenderingIntent: "Media-Relative Colorimetric",
      SourceFile: "",
      VP8Version: "0 (bicyclic reconstruction, normal loop)",
      VerticalScale: 0,
      WebP_Flags: "ICC Profile",
    },
  },
};

export const deleteComplaint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Complaint ID is required",
      });
    }

    // Delete the complaint by ID
    const deletedComplaint = await Complain.findByIdAndDelete(id);

    if (!deletedComplaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Fetch remaining complaints
    const remainingComplaints = await Complain.find().select({
      image_url: true,
      description: true,
      status: true,
      pnr: true,
      category: true,
      severity: true,
      createdAt: true,
      updatedAt: true,
    });

    return res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
      deletedComplaint: deletedComplaint._id,
      remainingComplaints,
    });
  } catch (error: any) {
    console.error("Error deleting complaint:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting complaint",
      error: error.message,
    });
  }
};
