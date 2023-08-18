import express from "express";
import { isAdmin, requireSignin } from "../middlewares/authMiddleware.js";
import {
  allProductController,
  braintreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  relatedProductsController,
  searchProductController,
  singleProductController,
  updateProductController,
} from "../controllers/productsController.js";
import fromidable from "express-formidable";

// Create Router
const router = express.Router();

// Routes
// Create Products Route
router.post(
  "/create-product",
  requireSignin,
  isAdmin,
  fromidable(),
  createProductController
);

// Update Products Route
router.put(
  "/update-product/:pid",
  requireSignin,
  isAdmin,
  fromidable(),
  updateProductController
);

// Get All Products Route
router.get("/get-product", allProductController);

// Single Products Route
router.get("/single-product/:slug", singleProductController);

// Photo Route
router.get("/product-photo/:pid", productPhotoController);

// Delete Products Route
router.delete(
  "/delete-product/:pid",
  requireSignin,
  isAdmin,
  deleteProductController
);

// Filter Route
router.post("/product-filters", productFiltersController);

// product Count
router.get("/product-count", productCountController);

// Product Per-Page
router.get("/product-list/:page", productListController);

// Search Products
router.get("/search/:keyword", searchProductController);

// Similar Products
router.get("/related-products/:pid/:cid", relatedProductsController);

// Category wise Products
router.get("/product-category/:slug", productCategoryController);

// Payment Route
// BrainTree Token
router.get("/braintree/token", braintreeTokenController);

// Payment
router.post("/braintree/payment", requireSignin, braintreePaymentController);

export default router;
