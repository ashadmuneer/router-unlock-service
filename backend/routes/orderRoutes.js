const express = require("express");
const paypal = require("@paypal/checkout-server-sdk");
const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");
const dotenv = require("dotenv");

dotenv.config(); // Load .env

const router = express.Router();

// Validate env vars
if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
  console.error("❌ PayPal credentials are missing in .env");
  process.exit(1);
}

// PayPal client configuration (Live Environment)
const environment = new paypal.core.LiveEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const paypalClient = new paypal.core.PayPalHttpClient(environment);

// Pricing in USD
const networkPricing = {
  STC: 2,
  ZAIN: 2,
  MOBILY: 2,
  "GO Telecom": 3,
  Other: 2,
};

// Delivery Time Based on Network
const networkDeliveryTimes = {
  STC: "1–9 Days",
  ZAIN: "1–10 Hours",
  MOBILY: "1–9 Days",
  GO: "1-9 Days",
  Other: "1-9 Days",
};

// Create PayPal order
router.post("/create-order", async (req, res) => {
  const {
    brand,
    model,
    network,
    imei,
    serialNumber,
    mobileNumber,
    email,
    termsAccepted,
  } = req.body;

  console.log("[Create Order] Payload:", req.body);

  if (
    !brand || !model || !network || !imei ||
    !serialNumber || !email || termsAccepted !== true
  ) {
    return res
      .status(400)
      .json({ error: "All fields are required and terms must be accepted" });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const amount = networkPricing[network] || networkPricing.Other;
  const deliveryTime = networkDeliveryTimes[network] || networkDeliveryTimes.Other;

  try {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");

    request.requestBody({
      intent: "CAPTURE",
      application_context: {
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
      },
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: amount.toFixed(2),
              },
            },
          },
          description: `Instant digital unlock for ${brand} ${model} (${network}) - IMEI: ${imei}`,
          soft_descriptor: `UNLOCK-${brand.slice(0, 11).toUpperCase()}`,
          custom_id: `IMEI-${imei}`,
          items: [
            {
              name: `Unlock ${brand} ${model}`,
              description: `Instant digital unlock service (no shipping)`,
              sku: imei,
              unit_amount: {
                currency_code: "USD",
                value: amount.toFixed(2),
              },
              quantity: "1",
              category: "DIGITAL_GOODS",
            },
          ],
          payment_instruction: {
            disbursement_mode: "INSTANT",
          },
        },
      ],
    });

    const paypalOrder = await paypalClient.execute(request);
    const orderId = paypalOrder.result.id;

    const order = new Order({
      brand,
      model,
      network,
      imei,
      serialNumber,
      mobileNumber,
      email,
      termsAccepted,
      amount,
      currency: "USD",
      orderId,
      invoiceId: `INV-${orderId}`,
      deliveryTime, // ✅ Added
    });

    await order.save();

    res.json({
      orderId,
      amount,
      currency: "USD",
      clientId: process.env.PAYPAL_CLIENT_ID,
      deliveryTime, // ✅ Returned
    });
  } catch (error) {
    console.error("[Create Order] PayPal Error:", {
      status: error.statusCode,
      message: error.message,
      details: error.result?.details || error,
    });
    res.status(500).json({ error: "Failed to create PayPal order" });
  }
});

// Verify and capture payment
router.post("/verify-payment", async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  try {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const capture = await paypalClient.execute(request);
    const captureId = capture.result.purchase_units[0].payments.captures[0].id;

    const order = await Order.findOneAndUpdate(
      { orderId },
      {
        paymentId: captureId,
        paymentStatus:
          capture.result.status === "COMPLETED" ? "Success" : "Failed",
        paymentTime: new Date(),
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (capture.result.status === "COMPLETED") {
      try {
        if (order.email) {
          await sendEmail({
            to: order.email,
            subject: "Order Successfully Placed – Invoice",
            template: "invoice",
            data: {
              ...order.toObject(),
              paymentTime: order.paymentTime.toISOString(),
              deliveryTime: order.deliveryTime,
            },
          });
        }

        await sendEmail({
          to: "genuineunlockerinfo@gmail.com",
          subject: "New Router Unlock Order Received",
          template: "newOrder",
          data: {
            ...order.toObject(),
            paymentTime: order.paymentTime.toISOString(),
            deliveryTime: order.deliveryTime,
          },
        });

        res.json({
          status: "success",
          message: "Payment verified and order updated",
        });
      } catch (emailErr) {
        console.error("Email send error:", emailErr.message);
        res.json({
          status: "success",
          message: "Payment verified, but email failed",
        });
      }
    } else {
      res.status(400).json({ error: "Payment not completed" });
    }
  } catch (error) {
    console.error("[Verify Payment] Error:", {
      message: error.message,
      details: error.result?.details || error,
    });

    await Order.findOneAndUpdate(
      { orderId },
      {
        paymentStatus: "Failed",
        paymentTime: new Date(),
      }
    );

    res.status(500).json({ error: "Failed to verify payment" });
  }
});

// Order Details
router.get("/order-details/:orderId", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json({
      ...order.toObject(),
      paymentTime: order.paymentTime?.toISOString() || null,
    });
  } catch (error) {
    console.error("Fetch Order Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Track Order by IMEI
router.get("/track-order/:imei", async (req, res) => {
  try {
    const imei = req.params.imei;
    if (!imei) return res.status(400).json({ error: "IMEI is required" });

    const orders = await Order.find({ imei });
    if (!orders?.length)
      return res.status(404).json({ error: "No orders found for this IMEI" });

    res.json(
      orders.map((order) => ({
        ...order.toObject(),
        paymentTime: order.paymentTime?.toISOString() || null,
      }))
    );
  } catch (error) {
    console.error("Track Order Error:", error.message);
    res.status(500).json({ error: "Failed to track order" });
  }
});

module.exports = router;
