const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
require('dotenv').config();

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

// ✅ Serve the React frontend
app.use(express.static(path.join(__dirname, '../Frontend/dist')));

// ✅ All other routes serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/dist', 'index.html'));
});

// Test route
app.get('/ping', (req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`[PING] Received at ${timestamp} from ${req.ip}`);
  res.status(200).send('✅ Server is awake');
});

connectDB();

app.use('/api', orderRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
