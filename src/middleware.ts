import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

export const userMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = req.headers["authorization"]; // Expecting raw token directly

        if (!token) {
            console.log("Authorization token missing");
            res.status(401).json({ message: "Unauthorized: No token provided" });
            return;
        }

        const decoded = jwt.verify(token, JWT_PASSWORD) as { id: string };

        (req as any).userId = decoded.id; // Attach userId to request

        next(); // Proceed to next middleware or route handler
    } catch (error) {
        console.log("JWT Verification Error:", error);
        res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
};
