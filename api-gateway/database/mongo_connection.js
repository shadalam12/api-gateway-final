import mongoose from "mongoose";

const url = "mongodb+srv://baba:b2aba2@cluster0.7hmk5xj.mongodb.net/request_logs?retryWrites=true&w=majority&appName=Cluster0";

//  Connect to MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};