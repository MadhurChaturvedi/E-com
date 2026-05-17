import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
} from "../controller/Product.js";
import uploadFiles from "../middlewares/multer.js";

const router = express.Router();

router.post("/product/new", isAuth, uploadFiles, createProduct);
router.get("/product/all", getAllProducts);
router.get("/product/:id", getSingleProduct);

export default router;
