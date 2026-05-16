import express from "express";
import { loginUser, verifyUser } from "../controller/User.js";

const router = express.Router();

router.post("/user/login", loginUser);
router.post("/user/verify", verifyUser)

export default router;
