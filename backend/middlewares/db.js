import mongoose from "mongoose";

try {
  await mongoose.connect(
    "mongodb://admin:admin@localhost/storageApp?authSource=admin"
  );
  console.log("Connected to MongoDB");
} catch (err) {
  console.error("Error connecting to MongoDB:", err);
}

