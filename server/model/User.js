import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    role: {
      type: String,
      default: "User",
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
