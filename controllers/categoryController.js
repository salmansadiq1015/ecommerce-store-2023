import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

// Create Category Controller
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({
        message: "Name is required!",
      });
    }
    // Existing Category
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(201).send({
        success: true,
        message: "Category already exist!",
      });
    }
    // Save New Category
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(200).send({
      success: true,
      message: "Category created successfully!",
      category,
    });
  } catch (error) {
    console.log(error),
      res.status(500).send({
        success: false,
        message: "Error in Create Category Controller!",
        error,
      });
  }
};

// 2) updateCategoryModel

export const updateCategoryModel = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category updated successfully😎",
      category,
    });
  } catch (error) {
    console.log(error),
      res.status(500).send({
        success: false,
        message: "Error in update Category Controller!",
        error,
      });
  }
};

// allCategoryController

export const allCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "All Category List",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Geting All Category Controller!",
      error,
    });
  }
};

// Single Category Controller

export const singleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Get Single Category successfully!",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Geting Single Category Controller!",
      error,
    });
  }
};

// deleteCategoryController
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Category is deleted successfully!",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Deleting Category Controller!",
      error,
    });
  }
};
