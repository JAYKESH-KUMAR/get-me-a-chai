
import mongoose from "mongoose";


const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:TglunlsKygNazmfqeEhjmPUHZQYHWxfb@centerbeam.proxy.rlwy.net:11753";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDb = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    mongoose.set("bufferCommands", false);

    cached.promise = mongoose.connect(MONGO_URI, {
      dbName: "test",
      serverSelectionTimeoutMS: 30000,
    }).then((mongoose) => {
      console.log("MongoDB Connected");
      return mongoose;
    }).catch((err) => {
      console.error("MongoDB Error:", err);
      throw err;
    });

  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDb;