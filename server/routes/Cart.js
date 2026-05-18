import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { addToCart } from "../controller/Cart.js";

const router = express.Router();

router.post("/cart/add", isAuth, addToCart);

export default router;
