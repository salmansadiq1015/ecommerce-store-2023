import { comparePassword, hashPassword } from "../helper/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import orderModel from "../models/orderModel.js";

// Register Controlller
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    // Validation
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    }
    if (!phone) {
      return res.send({ message: "Phone is required" });
    }
    if (!address) {
      return res.send({ message: "Address is required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is required" });
    }
    // Check user
    const existingUser = await userModel.findOne({ email });
    // Existing User
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User is already registered please login!",
      });
    }

    // Registering User
    const hashedPassword = await hashPassword(password);
    // Save Password
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      answer,
    }).save();
    res.status(201).send({
      success: true,
      message: "User Register successfully!",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Register Controller",
      error,
    });
  }
};

// Login Controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password!",
      });
    }
    // Check User
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered!",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid password!",
      });
    }
    // Token Creation
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "User login successfully!",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login controller",
      error,
    });
  }
};

// Forgot Password Controller

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }

    // Check
    const user = await userModel.findOne({ email, answer });

    // Validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong email or answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password reset successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login controller",
      error,
    });
  }
};

// Test Controller
export const testController = async (req, res) => {
  res.send("Route is Protected");
};

// Get All Users
export const getUserController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      total: users.length,
      message: "All users",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting users",
      error,
    });
  }
};

// deleteUserController
export const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "User delete successfully!",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while delete user",
      error,
    });
  }
};

// Update Profile Controller

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const user = await userModel.findById(req.user._id);

    const updateUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        email: email || user.email,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while update profile",
      error,
    });
  }
};

// getOrdersController

export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders!",
      error,
    });
  }
};

// Get all Order(Admin Panal)
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders!",
      error,
    });
  }
};

// orderStatusControllere
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders!",
      error,
    });
  }
};

// Delete Order Controller
export const deleteOrderController = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderModel.findByIdAndDelete(id);
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders!",
      error,
    });
  }
};
