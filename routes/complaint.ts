import express from "express";
import { ComplaintController, getAllComplaints, getComplaintCount } from "../controller/complain.controller";
import multer from "multer";
import { isAuthenticated } from "../middlewares/auth";
import Complain from "../models/Complain";

const storage = multer.memoryStorage();

const upload = multer({ storage });
const complaintRouter = express.Router();


complaintRouter.post("/done", isAuthenticated, upload.single('image'), ComplaintController);
complaintRouter.get("/count", getComplaintCount);
complaintRouter.get("/all", getAllComplaints);
complaintRouter.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        console.log({id});

        const complaint = await Complain.findById(id);
        console.log({complaint});

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
});

export default complaintRouter;