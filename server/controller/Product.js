import { Product } from "../model/Product.js";
import bufferGenerator from "../utils/bufferGenerator.js";
import TryCatch from "../utils/TryCatch.js";
import cloudinary from "cloudinary";

export const createProduct = TryCatch(async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({
      message: "YOU are not Admin",
    });

  const { title, description, category, price, stock } = req.body;

  // for checking images
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(403).json({
      message: "no File to upload",
    });
  }

  const imageUplaodPromises = files.map(async (files) => {
    const fileBuffer = bufferGenerator(files);
    const result = await cloudinary.v2.uploader.upload(fileBuffer.content);
    return {
      id: result.public_id,
      url: result.secure_url,
    };
  });

  const uploadedImage = await Promise.all(imageUplaodPromises);
  const product = await Product.create({
    title,
    description,
    category,
    price,
    stock,
    images: uploadedImage,
  });

  res.status(201).json({
    message: "Product Created",
    product,
  });
});
