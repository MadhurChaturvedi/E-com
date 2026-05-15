import { OTP } from "../model/Otp.js";
import sendotp from "../utils/sendOTp.js";
import TryCatch from "../utils/TryCatch.js";

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
