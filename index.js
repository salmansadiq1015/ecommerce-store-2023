import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import productsRoute from "./routes/productsRoute.js";
import contactRoute from "./routes/contactRoute.js";
import cors from "cors";
import path from "path";

// Config-Dotenv
dotenv.config();

// DataBase Configration
connectDB();

// Rest Object
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "./client/build")));

// All Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productsRoute);
app.use("/api/v1/contact", contactRoute);

// Rest API
app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// Port
const PORT = process.env.PORT || 5000;

// Listen
app.listen(PORT, () => {
  console.log(
    `Server is running on ${process.env.DEV_MODE} mode at PORT ${PORT}`.bgBlue
      .white
  );
});
