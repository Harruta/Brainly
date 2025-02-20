"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield db_1.UserModel.create({
            username,
            password,
        });
        res.json({
            message: "User signed up",
            user
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error creating user",
        });
    }
}));
app.post("api/v1/signin", (req, res) => {
});
app.post("api/v1/content", (req, res) => {
});
app.get("api/v1/signup", (req, res) => {
});
app.delete("api/v1/signup", (req, res) => {
});
app.post("api/v1/brain/share", (req, res) => {
});
app.post("api/v1/brain/:sharelink", (req, res) => {
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
