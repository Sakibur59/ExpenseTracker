const { MongoClient } = require('mongodb');

let db;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db(process.env.DB_NAME);
    console.log('✅ MongoDB connected successfully');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

module.exports = { connectDB, getDB };