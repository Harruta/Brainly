import mongoose from "mongoose";
import { Schema, model } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try{
        await mongoose.connect(String(process.env.MONGO_URI),{
            serverSelectionTimeoutMS: 5000,
        });
        console.log("MongoDB Connected Successfully");
    } catch(error){
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

const UserSchema = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
});
const ContentSchema = new Schema({
    title: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    type: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true}
})
const LinkSchema = new Schema({
    hash: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true,
        unique: true
    },
})

export const UserModel = model("User", UserSchema);
export const ContentModel = model("Content", ContentSchema);
export const LinkModel = model("Link", LinkSchema);

connectDB();