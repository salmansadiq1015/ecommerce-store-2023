import express from "express";
import { isAdmin, requireSignin } from "../middlewares/authMiddleware.js";
import {
  allCategoryController,
  createCategoryController,
  deleteCategoryController,
  singleCategoryController,
  updateCategoryModel,
} from "../controllers/categoryController.js";

// |Router Objects
const router = express.Router();

// Routing
// 1) Create Category
router.post(
  "/create-category",
  requireSignin,
  isAdmin,
  createCategoryController
);

// 2) Update Category
router.put("/update-category/:id", requireSignin, isAdmin, updateCategoryModel);

// 3) Get All Category
router.get("/all-category", allCategoryController);

// 4) Get single Category
router.get("/single-category/:slug", singleCategoryController);

// 5) Delete Category
router.delete(
  "/delete-category/:id",
  requireSignin,
  isAdmin,
  deleteCategoryController
);

export default router;
