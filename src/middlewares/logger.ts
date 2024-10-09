import { NextFunction, Request, Response } from "express";

export async function logger(req: Request, _: Response, next: NextFunction) {
  console.log(new Date(), req.method, req.path);

  next();
}
