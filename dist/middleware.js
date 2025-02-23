"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const userMiddleware = (req, res, next) => {
    try {
        const token = req.headers["authorization"]; // Expecting raw token directly
        if (!token) {
            console.log("Authorization token missing");
            res.status(401).json({ message: "Unauthorized: No token provided" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_PASSWORD);
        req.userId = decoded.id; // Attach userId to request
        next(); // Proceed to next middleware or route handler
    }
    catch (error) {
        console.log("JWT Verification Error:", error);
        res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
};
exports.userMiddleware = userMiddleware;
