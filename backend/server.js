const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const orderRoutes = require('./routes/orderRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['https://genuineunlocker.net']// Allow only your frontend's URL
}));
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', orderRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
