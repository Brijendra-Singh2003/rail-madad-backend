import "dotenv/config";
import Complain from '../models/Complain';
import { Request, Response } from 'express';
export const getAllComplaints = async(req: Request,res: Response)=>{
    try {
        
        const complaints = await Complain.find();
        if(complaints){
            // console.log("the list of all the complaints is ",complaints);
            res.status(200).send({
                success:true,
                data:complaints,
            });
        }else{
            res.status(200).send({
                success:true,
                data:[], // return null array;
            });
        }
    } catch (error: any) {
        console.log('error');
        // return res.status(500).send('Internal Server error');
        console.error("Error during registration:", error.message);
        res.status(500).send({
          success: false,
          message: 'Error in registration',
          error: error.message,
        });

    }
}