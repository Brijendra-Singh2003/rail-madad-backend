import express from "express";
import { registerControler } from "../controller/user";
import User from "../models/User";

const Userrouter = express.Router();

Userrouter.post("/register", registerControler);

Userrouter.get("/", async (req, res) => {
    const all_users = await User.find();

    return res.json(all_users);
});

export default Userrouter;
