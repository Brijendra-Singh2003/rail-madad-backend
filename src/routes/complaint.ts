import express from "express";
import {
  changeStatus,
  ComplaintController,
  getComplaintCount,
  getMyComplaints,
  getComplaintById,
  deleteComplaint,
  humanResponse,
} from "../controller/complain.controller";
import multer from "multer";
import path from "path";
import fs from "fs";
import { isAuthenticated } from "../middlewares/auth";
import { getAllComplaints } from "../controller/admin.controller";

// ensure upload directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

import { storage } from "../configurations/cloudinary";
const upload = multer({ storage });

// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (_req, file, cb) => {
//     const uniqueName = `${Date.now()}_${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });
// const upload = multer({ storage });

const complaintRouter = express.Router();

// Admin
complaintRouter.get("/getAllComplaints", getAllComplaints);
complaintRouter.get("/count", getComplaintCount);
complaintRouter.post("/human-response", isAuthenticated, humanResponse);

// User
complaintRouter.get("/my", isAuthenticated, getMyComplaints);
complaintRouter.post("/changeStatus", changeStatus);
complaintRouter.delete("/:id", deleteComplaint);
complaintRouter.post(
  "/done",
  isAuthenticated,
  upload.single("image"),
  ComplaintController,
);
complaintRouter.get("/:id", getComplaintById);

export default complaintRouter;
