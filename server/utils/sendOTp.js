import { createTransport } from "nodemailer";

const sendotp = async ({ email, subject, otp }) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASS,
    },
  });
};
