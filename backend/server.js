const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const path = require('path');

const orderRoutes = require('./routes/orderRoutes');

const app = express();
const port = process.env.PORT || 5000;

// CORS
const corsOptions = {
  origin: ['https://genuineunlocker.net', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());

// API routes
app.use('/api', orderRoutes);
console.log('API routes mounted at /api');

// Static frontend
const distPath = path.join(__dirname, '../Frontend/dist');
app.use(express.static(distPath));
console.log('Serving static files from:', distPath);

// ✅ Safe fallback catch-all (no wildcard route)
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Health check
app.get('/ping', (req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`[PING] Received at ${timestamp} from ${req.ip}`);
  res.status(200).send('✅ Server is awake');
});

// MongoDB connection
const connectToDB = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
connectToDB();

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
