import jwt from "jsonwebtoken";
import { User } from "../model/User.js";

export const isAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token)
      return res.status(403).json({
        message: "Please login",
      });

    const decodeData = jwt.verify(token, process.env.JWT_SEC);
    req.user = await User.findById(decodeData._id);
    next();
  } catch (error) {
    res.status(500).json({
      message: "Please login",
    });
  }
};
