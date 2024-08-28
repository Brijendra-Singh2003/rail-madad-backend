"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerControler = void 0;
require("dotenv/config");
const User_1 = __importDefault(require("../models/User"));
const registerControler = async (req, res) => {
    try {
        const { firstName, lastName, phone, PNR } = req.body;
        if (!firstName || !lastName || !phone || !PNR) {
            res.send("All feilds are require");
        }
        let user = new User_1.default({
            firstName,
            lastName,
            phone,
            PNR,
            //   isDeleted: false,
        });
        await user.save();
        res.status(201).json({ message: "User registered successfully", user });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.registerControler = registerControler;
