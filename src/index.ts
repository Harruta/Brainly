import express, { Request, Response } from "express";
import { UserModel, ContentModel } from "./db";
import jwt from "jsonwebtoken";
import { userMiddleware } from "./middleware";

const app = express();
const PORT = 3000;
const JWT_PASSWORD = "secret";

app.use(express.json());

app.post("/api/v1/signup", async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        
        const user = await UserModel.create({
            username,
            password,
        });
        
        res.json({
            message: "User signed up",
            user,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating user",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

app.post("/api/v1/signin", async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const existingUser = await UserModel.findOne({ username, password });

        if (existingUser) {
            const token = jwt.sign({ id: existingUser._id }, JWT_PASSWORD);
            res.json({
                token,
                message: "User signed in",
            });
        } else {
            res.status(401).json({
                message: "Invalid credentials",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error signing in",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

// Placeholder routes
app.post("/api/v1/content", userMiddleware, async (req: Request, res: Response) => {
    const link = req.body.link;
    const type = req.body.type;
    await ContentModel.create({
        link,
        type,
        //@ts-ignore
        userId: req.userId,
        tags: []
    })
    res.json({
        message: "Content added"
    })
});

app.get("/api/v1/signup", (req: Request, res: Response) => {
    res.send("Signup GET API placeholder");
});

app.delete("/api/v1/signup", (req: Request, res: Response) => {
    res.send("Signup DELETE API placeholder");
});

app.post("/api/v1/brain/share", (req: Request, res: Response) => {
    res.send("Brain share API placeholder");
});

app.post("/api/v1/brain/:sharelink", (req: Request, res: Response) => {
    res.send(`Brain share API for link: ${req.params.sharelink}`);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});