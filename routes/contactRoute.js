import express from "express";
import {
  createMessageController,
  deleteMessageController,
  getMessageController,
} from "../controllers/ContactController.js";

// Router Objects
const router = express.Router();

// Routes
// Create Message Route
router.post("/create-message", createMessageController);

// // Get Messages Route
router.get("/get-message", getMessageController);

// // Delete Message Route
router.delete("/delete-message/:id", deleteMessageController);

export default router;
