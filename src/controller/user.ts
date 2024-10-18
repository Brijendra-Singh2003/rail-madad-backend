import "dotenv/config";
import User from "../models/User";
import { Request, response, Response } from "express";

export const registerControler = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, phone, PNR } = req.body;
    if (!firstName || !lastName || !phone || !PNR) {
      res.send("All feilds are require");
    }

    let user = new User({
      firstName,
      lastName,
      phone,
      PNR,
      //   isDeleted: false,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch(error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export async function getAllUsers(req: Request, res: Response) {
  const users = await User.aggregate([
    {
      $lookup: {
        from: "complains", // The collection name for complaints
        localField: "_id",
        foreignField: "user",
        as: "complaints",
      },
    },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        phone: 1,
        complaints: { $size: "$complaints" },
      },
    },
  ]);

  return res.json({success: true, data: users});
}

export const getUserById = async(req:Request,res:Response)=>{
  try {
    const { phone } = req.params;  // Assuming phone is passed as a parameter
    if (!phone) {
      res.status(400).send({
        success: false,
        message: 'Phone number is required',
      }); 
    } else {
      try {
        console.log("Phone is", phone);
        
        // Use 'findOne' to search by phone since phone should be unique
        const response = await User.findOne({ phone: phone });
        
        if (!response) {
          return res.status(404).json({
            success: false,
            message: 'User not found',
          });
        }
    
        console.log("User is", response);
        res.json({  
          success: true,
          data: response,
        });
      } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).json({
          success: false,
          message: 'An error occurred while retrieving the user',
        });
      }
    }
    
  } catch (error : any) {
    console.log(error);

        res.json({
            success: false,
            message: error.message,
        });
  }
}
