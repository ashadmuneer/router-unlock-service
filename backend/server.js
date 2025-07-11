const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const orderRoutes = require('./routes/orderRoutes');

const app = express();
const port = process.env.PORT || 5000;

// ✅ Working CORS setup
const corsOptions = {
  origin: 'https://genuineunlocker.net',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.get('/ping', (req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`[PING] Received at ${timestamp} from ${req.ip}`);
  res.status(200).send('✅ Server is awake');
});

// Connect to MongoDB
connectDB();


// Routes
app.use('/api', orderRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
