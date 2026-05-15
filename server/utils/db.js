import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      dbName: "e-commerce",
    });
    console.log("DB connect 🦞");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
