import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoutes from "./routes/User.js";
import productRouter from "./routes/Product.js";
import cloudinary from "cloudinary";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.Key_Name,
  api_key: process.env.API_Key,
  api_secret: process.env.API_Secret,
});

const app = express();
const port = process.env.PORT || 5000;
connectDB();

app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", productRouter);

app.get("/", async (req, res) => {
  res.send("Hello World Server is running fine");
});

app.listen(port, () => {
  console.log(`server running on port http://localhost:${port} 🦀`);
});
