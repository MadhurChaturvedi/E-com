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

// get all products

export const getAllProducts = TryCatch(async (req, res) => {
  const { search, category, page, sortByPrice } = req.query;

  const filter = {};
  if (search) {
    filter.title = {
      $regex: search,
      $options: "i",
    };
  }
  if (category) {
    filter.category = category;
  }

  const limit = 8;
  const skip = (page - 1) * limit;
  let sortOption = { createdAt: -1 };

  if (sortByPrice) {
    if (sortByPrice === "lowToHigh") {
      sortOption = { price: 1 };
    } else if (sortByPrice === "HighToLow") {
      sortOption = { price: -1 };
    }
  }
  const products = await Product.find(filter)
    .sort(sortOption)
    .limit(limit)
    .skip(skip);

  const categorys = await Product.distinct("category");
  const newProduct = await Product.find().sort("-createAt").limit(4);
  const countProduct = await Product.countDocuments();
  const totalPages = Math.ceil(countProduct / limit);

  res.status(200).json({
    products,
    categorys,
    totalPages,
    newProduct,
  });
});
