"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controller/user");
const User_1 = __importDefault(require("../models/User"));
const Userrouter = express_1.default.Router();
Userrouter.post("/register", user_1.registerControler);
Userrouter.get("/", async (req, res) => {
    const all_users = await User_1.default.find();
    return res.json(all_users);
});
exports.default = Userrouter;
