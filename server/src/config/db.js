// Mongoose connection
// Folder: server/src/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI is not set in environment');
    }

    const connection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });

    console.log(`MongoDB connected: ${connection.connection.host}/${connection.connection.name}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
