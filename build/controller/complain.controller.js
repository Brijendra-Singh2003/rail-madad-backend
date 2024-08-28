"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintControler = void 0;
require("dotenv/config");
const Complain_1 = __importDefault(require("../models/Complain"));
const ComplaintControler = async (req, res) => {
    try {
        console.log(req.body);
        const { phone, discription, image_url, pnr } = req.body;
        if (!phone || !discription || !image_url || !pnr) {
            return res.status(400).send("All fields are required");
        }
        const complaint = new Complain_1.default({ phone, discription, image_url, pnr });
        await complaint.save();
        res.status(201).send({
            success: true,
            message: "Complaint registered successfully",
            complaint,
        });
    }
    catch (error) {
        console.error("Error during registration:", error.message);
        res.status(500).send({
            success: false,
            message: 'Error in registration',
            error: error.message,
        });
    }
};
exports.ComplaintControler = ComplaintControler;
