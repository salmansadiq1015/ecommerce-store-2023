import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONDO_URL);
    console.log(
      `Connected to MongoDB DataBase ${conn.connection.host}`.bgMagenta.white
    );
  } catch (error) {
    console.log(`Error in MongoDB ${error}`.bgRed.white);
  }
};

export default connectDB;
