import "dotenv/config";
import { NextFunction, Request, Response } from "express";

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.user) {
    return res.status(403).json({ success: false, message: "un authenticated" });
  }

  next();
}
