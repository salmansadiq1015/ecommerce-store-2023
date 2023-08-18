import express from "express";
import {
  deleteOrderController,
  deleteUserController,
  forgotPasswordController,
  getAllOrdersController,
  getOrdersController,
  getUserController,
  loginController,
  orderStatusController,
  registerController,
  testController,
  updateProfileController,
} from "../controllers/authController.js";
import { isAdmin, requireSignin } from "../middlewares/authMiddleware.js";

// Router Objects
const router = express.Router();

// Routing

// Register Route
router.post("/register", registerController);
// Login Route
router.post("/login", loginController);

// Forword Password
router.post("/forgot-password", forgotPasswordController);

// Text
router.get("/test", requireSignin, isAdmin, testController);

// Protected Route
router.get("/user-auth", requireSignin, (req, res) => {
  res.status(200).send({ ok: true });
});

// Protected Admin Route
router.get("/admin-auth", requireSignin, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// Get All Users Route
router.get("/all-users", getUserController);

// Delete Users Route
router.delete("/delete-user/:id", deleteUserController);

// Update User
router.put("/profile", requireSignin, updateProfileController);

// Orders Route
router.get("/orders", requireSignin, getOrdersController);

//All Orders Route
router.get("/all-orders", requireSignin, isAdmin, getAllOrdersController);

// Update Orders
router.put(
  "/order-status/:orderId",
  requireSignin,
  isAdmin,
  orderStatusController
);

// Delete Order
router.delete(
  "/order-delete/:id",
  requireSignin,
  isAdmin,
  deleteOrderController
);

export default router;
