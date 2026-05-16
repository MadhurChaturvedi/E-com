import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  stock: {
    type: Number,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  images: [
    {
      id: String,
      url: String,
    },
  ],
  sold: {
    type: Number,
    default: 0,
  },

  category: {
    type: String,
    require: true,
  },

  createAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Product = mongoose.model("Product", productSchema);
