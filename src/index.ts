import express from "express";
import { UserModel } from "./db";
const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await UserModel.create({
            username,
            password,
        });
        
        res.json({
            message: "User signed up",
            user
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating user",
        });
    }
});

app.post("api/v1/signin",(req, res) => {
    
})
app.post("api/v1/content",(req, res) => {
    
})
app.get("api/v1/signup",(req, res) => {
    
})
app.delete("api/v1/signup",(req, res) => {
    
})
app.post("api/v1/brain/share",(req, res) => {
    
})
app.post("api/v1/brain/:sharelink",(req, res) => {
    
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});