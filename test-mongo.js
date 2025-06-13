// Simple test script to check MongoDB connection
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manually load .env.local file since dotenv is not available
function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '.env.local');
    const envFile = fs.readFileSync(envPath, 'utf8');
    
    envFile.split('\n').forEach(line => {
      const [key, ...values] = line.split('=');
      if (key && values.length > 0) {
        process.env[key.trim()] = values.join('=').trim();
      }
    });
  } catch (error) {
    console.error('❌ Could not load .env.local file:', error.message);
    process.exit(1);
  }
}

// Load environment variables
loadEnvFile();

// Use environment variable instead of hardcoded credentials
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set!');
  console.log('Please check your .env.local file');
  process.exit(1);
}

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
