import { NextFunction, Request, Response } from "express";

export async function logger(req: Request, res: Response, next: NextFunction) {
  const t1 = Date.now();
  const path = req.path;

  const log = () => {
    const time = Date.now() - t1;
    console.log(new Date(), req.method, path, `${time}ms`);
  };

  res.once("finish", log);

  next();
}
