import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

export const userMiddleware = async (req: Request, res:Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    try{
        if(!header) {
            return res.status(401).json({
                message: "Unauthorized",
            });
    }
    const decoded = jwt.verify(header as string, JWT_PASSWORD) as {id: string};
    //@ts-ignore
    res.userId = decoded.id;
    next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized",
        })
    }
}