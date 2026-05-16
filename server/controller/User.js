import { OTP } from "../model/Otp.js";
import { User } from "../model/User.js";
import sendotp from "../utils/sendOTp.js";
import TryCatch from "../utils/TryCatch.js";
import jwt from "jsonwebtoken";
export const loginUser = TryCatch(async (req, res) => {
  const { email } = req.body;
  const subject = "Ecomerce App";

  const otp = Math.floor(Math.random() * 1000000);

  const prevOTP = await OTP.findOne({
    email,
  });

  if (prevOTP) {
    await prevOTP.deleteOne();
  }

  await sendotp({
    email,
    subject,
    otp,
  });

  await OTP.create({ email, otp });

  res.json({
    message: "OTP send to you mail",
  });
});

export const verifyUser = TryCatch(async (req, res) => {
  const { email, otp } = req.body;

  const haveOtp = await OTP.findOne({
    email,
    otp,
  });

  if (!haveOtp)
    return res.status(400).json({
      message: "Wrong otp",
    });

  let user = await User.findOne({ email });

  if (user) {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC, {
      expiresIn: "15d",
    });

    await haveOtp.deleteOne();
    res.json({
      message: "User LogedIn",
      token,
      user,
    });
  } else {
    user = await User.create({
      email,
    });
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC, {
      expiresIn: "15d",
    });

    await haveOtp.deleteOne();
    res.json({
      message: "User LogedIn",
      token,
      user,
    });
  }
});
