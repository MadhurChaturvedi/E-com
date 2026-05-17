import mongoose from "mongoose";
import { Product } from "./Product";

const cartSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    require: Number,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Cart = mongoose.model("Cart", cartSchema);
