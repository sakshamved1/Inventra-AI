import mongoose from "mongoose";

let retryCount = 0;
const MAX_RETRIES = 3;

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/InventraAI";

    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      maxPoolSize: 10,
    };

    await mongoose.connect(mongoURI, options);
    console.log("✅ MongoDB connected successfully");
    retryCount = 0; // Reset retry count on success
  } catch (error) {
    console.error("MongoDB connection error:");
    console.error(error);

    if (retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`⏳ Retrying connection (${retryCount}/${MAX_RETRIES})...`);
      setTimeout(() => connectDB(), 5000);
    } else {
      console.log("⚠️  Max retries reached. Server running without database.");
      console.log("💡 Please check MongoDB connection or use local MongoDB.");
    }
  }
};

export default connectDB;
