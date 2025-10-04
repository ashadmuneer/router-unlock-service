const express = require("express");
const dotenv = require("dotenv");
const createOrder = require("../controllers/createOrder");
const verifyPaypalPayment = require("../controllers/verifyPaypalPayment");
const getOrderDetails = require("../controllers/getOrderDetails");
const trackOrderByIMEI = require("../controllers/trackOrderByIMEI");

dotenv.config();

const router = express.Router();

// Define body parser
const jsonParser = express.json();

// Validate env vars
if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
  console.error("❌ PayPal credentials are missing in .env");
  process.exit(1);
}

// JSON-handled POST routes
router.post("/create-order", jsonParser, createOrder);
router.post("/verify-payment", jsonParser, verifyPaypalPayment);

// GET routes
router.get("/order-details/:orderId", getOrderDetails);
router.get("/track-order/:imei", trackOrderByIMEI);

module.exports = router;