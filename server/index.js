import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js"

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
connectDB();

app.listen(port, ()=>{
    console.log(`server running on port http://localhost:${port} 🦀`);
})