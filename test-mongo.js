// Simple test script to check MongoDB connection
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://3570kumarraushan:jCsfp7wEGnW87KoM@cluster0.yjoknqo.mongodb.net/job-portal?retryWrites=true&w=majority&appName=Cluster0';

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('URI:', MONGODB_URI.replace(/:[^:@]*@/, ':****@')); // Hide password
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✓ Successfully connected to MongoDB');
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('✗ MongoDB connection failed:');
    console.error('Error name:', error.name);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.reason) {
      console.error('Error reason:', error.reason);
    }
  }
}

testConnection();
