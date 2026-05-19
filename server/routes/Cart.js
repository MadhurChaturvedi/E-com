import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { addToCart, removeFromCart } from "../controller/Cart.js";

const router = express.Router();

router.post("/cart/add", isAuth, addToCart);
router.get("/cart/remove/:id", isAuth, removeFromCart);

export default router;
