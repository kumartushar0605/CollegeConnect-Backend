import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

export const connectDB = () => {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
};
