import productsModel from "../models/productsModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from "dotenv";
import orderModel from "../models/orderModel.js";

// Config-Dotenv
dotenv.config();

// Payment Gateway

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// Create Product Controller
export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // Validation
    switch (true) {
      case !name:
        return res.status(500).send({ message: "Name is required!" });

      case !description:
        return res.status(500).send({ message: "Description is required!" });

      case !price:
        return res.status(500).send({ message: "Price is required!" });

      case !category:
        return res.status(500).send({ message: "Category is required!" });

      case !quantity:
        return res.status(500).send({ message: "Quantity is required!" });

      case photo && photo.size > 1000000:
        return res.status(500).send({
          message: "Photo is required and Size should be less then 1MB!",
        });
    }

    const products = new productsModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(200).send({
      success: true,
      message: "Product created successfully!",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in create product controller",
      error,
    });
  }
};

// Update Product Controller
export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // Validation
    switch (true) {
      case !name:
        return res.status(500).send({ message: "Name is required!" });

      case !description:
        return res.status(500).send({ message: "Description is required!" });

      case !price:
        return res.status(500).send({ message: "Price is required!" });

      case !category:
        return res.status(500).send({ message: "Category is required!" });

      case !quantity:
        return res.status(500).send({ message: "Quantity is required!" });

      case photo && photo.size > 1000000:
        return res.status(500).send({
          message: "Photo is required and Size should be less then 1MB!",
        });
    }

    const products = await productsModel.findByIdAndUpdate(
      req.params.pid,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(200).send({
      success: true,
      message: "Product Updated successfully!",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error whine updating product controller",
      error,
    });
  }
};

// Get All Product Controller
export const allProductController = async (req, res) => {
  try {
    const products = await productsModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      total: products.length,
      message: "All products  list",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting all products controller",
      error,
    });
  }
};

// Single Product Controller
export const singleProductController = async (req, res) => {
  try {
    const products = await productsModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single product",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting single product controller",
      error,
    });
  }
};

// productPhotoController
export const productPhotoController = async (req, res) => {
  try {
    const product = await productsModel
      .findById(req.params.pid)
      .select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting product photo controller",
      error,
    });
  }
};

// Delete Product Controller
export const deleteProductController = async (req, res) => {
  try {
    const products = await productsModel
      .findByIdAndDelete(req.params.pid)
      .select("-photo");
    res.status(200).send({
      success: true,
      message: "Product delete successfully!",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Deleting product controller",
      error,
    });
  }
};

// productFiltersController
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productsModel.find(args);

    res.status(200).send({
      success: true,
      message: "Filter Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in filter controller!",
      error,
    });
  }
};

// productCountController
export const productCountController = async (req, res) => {
  try {
    const total = await productsModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while count products",
      error,
    });
  }
};

// product-List Controller

export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productsModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while getting products list!",
      error,
    });
  }
};

// searchController
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productsModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in search controller!",
      error,
    });
  }
};

export const relatedProductsController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productsModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in related products controller!",
      error,
    });
  }
};

// Product Category Controller
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productsModel
      .find({ category })
      .populate("category");

    res.status(200).send({
      success: true,
      message: "Get category product successfully!",
      products,
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error while getting product category!",
      error,
    });
  }
};

// braintreeTokenController

export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in token controller",
      error,
    });
  }
};

// Payment
export const braintreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (err, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(err);
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in payment controller",
      error,
    });
  }
};
