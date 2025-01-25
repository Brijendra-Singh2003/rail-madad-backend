import "dotenv/config";
import { NextFunction, Request, Response } from "express";

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.user) {
    return res.status(403).json({ success: false, message: "un authenticated" });
  }

  next();
}

export async function isAdmin(req: Request,res: Response,next: NextFunction){
  console.log("call hua");
  console.log(req?.session?.user);
  if (!req.session?.user) {
    console.log("y")
    return res.status(403).json({ success: false, message: "un authenticated" });
  }
  if(req.session?.user?.phone !== '1111111111'){
    console.log("False");
    return res.status(403).json({ success: false, message: "un authenticated" }); 
  }
  console.log("true");

    next();
}


