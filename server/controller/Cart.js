import { Cart } from "../model/Cart.js";
import { Product } from "../model/Product.js";

import TryCatch from "../utils/TryCatch.js";

export const addToCart = TryCatch(async (req, res) => {
  console.log(req.body);
  const { product } = req.body;

  const cart = await Cart.findOne({
    product: product,
    user: req.user._id,
  }).populate("product");

  // cart already exists
  if (cart) {
    if (cart.product.stock === cart.quantity) {
      return res.status(400).json({
        message: "Out of Stock",
      });
    }

    cart.quantity = cart.quantity + 1;

    await cart.save();

    return res.json({
      message: "Added to cart",
    });
  }

  // new cart item
  const cartproduct = await Product.findById(product);

  if (!cartproduct || cartproduct.stock === 0) {
    return res.status(400).json({
      message: "Out of Stock",
    });
  }

  await Cart.create({
    quantity: 1,
    product: product,
    user: req.user._id,
  });

  res.json({
    message: "Added to Cart",
  });
});
