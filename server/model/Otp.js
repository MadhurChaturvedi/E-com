import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },
  otp: {
    type: Number,
    require: true,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 5 * 60 * 1000),
    index: { expires: "5m" },
  },
});

export const OTP = mongoose.model("OTP", otpSchema);
