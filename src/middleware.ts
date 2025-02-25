import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

interface AuthenticatedRequest extends Request {
  userId?: string; // Add userId to the request type
}

export const userMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
        const token = req.headers["authorization"];

        if (!token) {
            console.log("Authorization token missing");
            res.status(401).json({ message: "Unauthorized: No token provided" });
            return; 
        }

        const decoded = jwt.verify(token, JWT_PASSWORD) as { id: string };

        console.log("Decoded JWT:", decoded); // Debugging

        req.userId = decoded.id; // Fix: Use `decoded.id` directly

        next(); // Proceed to next middleware
    } catch (error) {
        console.log("JWT Verification Error:", error);
        res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
        return; // Ensure function stops after sending response
    }
};
