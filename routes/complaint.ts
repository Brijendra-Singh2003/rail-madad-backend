import express from "express";
import { ComplaintControler } from "../controller/complain.controller";

const complaintRouter = express.Router();

complaintRouter.post("/done", ComplaintControler);

export default complaintRouter;