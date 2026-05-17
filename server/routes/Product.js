import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { createProduct, getAllProducts } from "../controller/Product.js";
import uploadFiles from "../middlewares/multer.js";

const router = express.Router();

router.post("/product/new", isAuth, uploadFiles, createProduct);
router.get("/product/all", getAllProducts);

export default router;
