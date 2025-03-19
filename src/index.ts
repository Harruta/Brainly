import express, { Request, Response } from "express";
import { UserModel, ContentModel, LinkModel } from "./db";
import jwt from "jsonwebtoken";
import { userMiddleware } from "./middleware";
import { random } from "./utils";
import cors from "cors";

const app = express();
const PORT = process.env.PORT ||3000;
const JWT_PASSWORD = "secret";

app.use(express.json());
app.use(cors());

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
    const title = req.body.title;
    const link = req.body.link;
    const type = req.body.type;
    await ContentModel.create({
        title,
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

app.get("/api/v1/content", userMiddleware, async (req: Request, res: Response) => {
    //@ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId", "username")
    res.json({
        content
    })
});

app.delete("/api/v1/content",userMiddleware, async (req: Request, res: Response) => {
    const contentId = req.body.contentId;
    await ContentModel.deleteMany({
        //@ts-ignore
        userId: req.userId
    })
    res.json({
        message: "Content deleted"
    })
});

app.post("/api/v1/brain/share", userMiddleware, async (req: Request, res: Response) => {
    const share = req.body.share;
    if(share){
        const existingLink = await LinkModel.findOne({
            //@ts-ignore
            userId: req.userId
        });
        if(existingLink) {
            res.json({
                hash: existingLink.hash
            })
            return;
        }

        const hash = random(10);
        await LinkModel.create({
            //@ts-ignore
            userId: req.userId,
            hash: hash
        })
        res.json({
            message: "/share/" + hash
        })

    } else {
        LinkModel.deleteOne({
            //@ts-ignore
            userId: req.userId
        });
    }
    res.json({
        message: "removed link"
    })
});

app.get("/api/v1/brain/:sharelink", async (req: Request, res: Response) => {
    const hash = req.params.sharelink;
    const link = await LinkModel.findOne({
        hash
    });
    if (!link){
        res.status(411).json({
            message: "Invalid Link"
        })
        return;
    }
    const content = await ContentModel.find({
        userId: link.userId
    })
    const user = await UserModel.findOne({
        _id: link.userId
    })
    if(!user){
        res.status(411).json({
            message: "User not found"
        })
        return;
    }
    res.json({
        username: user.username,
        content: content
    })
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});