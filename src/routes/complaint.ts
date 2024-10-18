import express from "express";
import { changeStatus, ComplaintController, getComplaintCount, getMyComplaints, getComplaintById } from "../controller/complain.controller";
import multer from "multer";
import { isAuthenticated } from "../middlewares/auth";
import { getAllComplaints } from "../controller/admin.controller";

const storage = multer.memoryStorage();
const upload = multer({ storage });
const complaintRouter = express.Router();

// Admin
complaintRouter.get("/getAllComplaints", getAllComplaints);
complaintRouter.get("/count", getComplaintCount);

// User
complaintRouter.get("/my", isAuthenticated, getMyComplaints);
complaintRouter.post("/changeStatus", changeStatus);
complaintRouter.post("/done", isAuthenticated, upload.single('image'), ComplaintController);
complaintRouter.get("/:id", isAuthenticated, getComplaintById);

export default complaintRouter;