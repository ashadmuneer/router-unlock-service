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

// PayPal client configuration
// const environment = new paypal.core.SandboxEnvironment(
//   process.env.PAYPAL_CLIENT_ID,
//   process.env.PAYPAL_CLIENT_SECRET
// );
const environment = new paypal.core.LiveEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const paypalClient = new paypal.core.PayPalHttpClient(environment);

// Pricing in USD (converted from SAR)
const networkPricing = {
  STC: 2,
  ZAIN: 0.012,
  MOBILY: 0.012,
  GO: 0.012,
  Other: 0.012,
};

// Create order
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
    !brand ||
    !model ||
    !network ||
    !imei ||
    !serialNumber ||
    !email ||
    termsAccepted !== true
  ) {
    return res
      .status(400)
      .json({ error: "All fields are required and terms must be accepted" });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const amount = networkPricing[network] || networkPricing.Other;

  try {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");

    request.requestBody({
      intent: "CAPTURE",
      application_context: {
        shipping_preference: "NO_SHIPPING", // ✅ This ensures no delivery required
        user_action: "PAY_NOW", // ✅ Makes PayPal button say "Pay Now"
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
          description: `Router unlock for ${brand} ${model} (${network}) - IMEI: ${imei}`,
          soft_descriptor: `Unlock ${brand.slice(0, 12)}`,
          items: [
            {
              name: `Unlock ${brand} ${model}`,
              description: `Unlock for ${brand} router on ${network}`,
              sku: imei,
              unit_amount: {
                currency_code: "USD",
                value: amount.toFixed(2),
              },
              quantity: "1",
              category: "DIGITAL_GOODS", // ✅ No shipping, no delivery, no holds
            },
          ],
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
    });

    await order.save();

    res.json({
      orderId,
      amount,
      currency: "USD",
      clientId: process.env.PAYPAL_CLIENT_ID,
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

// Verify payment
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
        // Email to user
        if (order.email) {
          await sendEmail({
            to: order.email,
            subject: "Order Successfully Placed – Invoice",
            template: "invoice",
            data: {
              ...order.toObject(),
              paymentTime: order.paymentTime.toISOString(),
            },
          });
        }

        // Email to admin
        await sendEmail({
          to: "genuineunlockerinfo@gmail.com",
          subject: "New Router Unlock Order Received",
          template: "newOrder",
          data: {
            ...order.toObject(),
            paymentTime: order.paymentTime.toISOString(),
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
