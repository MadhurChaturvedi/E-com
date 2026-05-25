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

export const removeFromCart = TryCatch(async (req, res) => {
  // 1. Find the cart belonging to the logged-in user
  // 2. Use $pull to remove the item matching the product ID from the items array
  const updatedCart = await Cart.findOneAndUpdate(
    { user: req.user._id }, // Assumes you have auth middleware setting req.user
    { $pull: { items: { product: req.params.id } } },
    { new: true }, // Returns the updated document
  );

  if (!updatedCart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  res.json({
    message: "Item removed from cart",
    cart: updatedCart,
  });
});

export const updateCart = TryCatch(async (req, res) => {
  const { action } = req.body;

  if (action === "inc") {
    const { id } = req.body;
    const cart = await Cart.findById(id).populate("product");
    if (cart.quantity < cart.product.stock) {
      cart.quantity++;
      await cart.save();
    }
    else{
      return res.status(400).json({
          
      })
    }
  }
});
