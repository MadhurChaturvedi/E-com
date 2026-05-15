import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoutes from "./routes/User.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
connectDB();

app.use(express.json());
app.use("/api", userRoutes);

app.get("/", async (req, res) => {
  res.send("Hello World Server is running fine");
});

app.listen(port, () => {
  console.log(`server running on port http://localhost:${port} 🦀`);
});
