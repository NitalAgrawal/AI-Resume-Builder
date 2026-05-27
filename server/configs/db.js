import mongoose from "mongoose";

let memoryServer;

const connectDb = async () => {
  let mongodbURI = process.env.MONGODB_URI;
  const projectName = "Resume-Builder";

  const isPlaceholder = !mongodbURI || mongodbURI.includes("<username>") || mongodbURI.includes("<password>");

  if (!isPlaceholder) {
    try {
      await mongoose.connect(mongodbURI);
      console.log("Database connected successfully to Atlas");
      return;
    } catch (error) {
      console.error("Error connecting to Atlas MongoDB:", error.message);
      console.log("Falling back to in-memory MongoDB...");
    }
  } else {
    console.log("Placeholder or missing MongoDB URI detected. Using in-memory MongoDB for local development.");
  }

  // Fallback / Placeholder logic: Use in-memory MongoDB
  try {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    memoryServer = await MongoMemoryServer.create();
    const uri = memoryServer.getUri();
    await mongoose.connect(uri);
    console.log("Connected to in-memory MongoDB");
  } catch (err) {
    console.error("Failed to start in-memory MongoDB:", err.message);
  }
};

export default connectDb;
