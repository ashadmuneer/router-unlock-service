const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const path = require('path');
const fs = require('fs'); // Added for file existence check

const orderRoutes = require('./routes/orderRoutes');

const app = express();
const port = process.env.PORT || 5000;

// ✅ Working CORS setup
const corsOptions = {
  origin: ['https://genuineunlocker.net', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());

// Serve static frontend files from Vite's dist folder
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
console.log('Serving static files from:', distPath);

// API Routes
app.use('/api', orderRoutes);
console.log('API routes mounted at /api');

// Serve index.html for all unknown routes to support SPA refresh


// Ping endpoint for health check
app.get('/ping', (req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`[PING] Received at ${timestamp} from ${req.ip}`);
  res.status(200).send('✅ Server is awake');
});

// Connect to MongoDB
const connectToDB = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit on connection failure
  }
};
connectToDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;