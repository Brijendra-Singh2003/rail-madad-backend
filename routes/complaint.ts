import express from "express";
import { ComplaintController } from "../controller/complain.controller";
import multer from "multer";
import path from "path";
const storage = multer.memoryStorage();

const upload = multer({storage});
const complaintRouter = express.Router();


complaintRouter.post("/done",upload.single('image'), ComplaintController);

export default complaintRouter;