// orderRoutes.js
const express = require("express");
const paypal = require("@paypal/checkout-server-sdk");
const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// Validate env vars
if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
  console.error("❌ PayPal credentials are missing in .env");
  process.exit(1);
}

// PayPal client configuration
const environment = new paypal.core.LiveEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const paypalClient = new paypal.core.PayPalHttpClient(environment);

// TAC-based pricing rules
const tacPricing = {
  86720604: {
    // Huawei H112-370
    STC: 55,
    ZAIN: 35,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86073004: {
    // Huawei H112-372
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86193505: {
    // Huawei H122-373A
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86688704: {
    // Huawei H122-373
    STC: 55,
    ZAIN: 35,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86406705: {
    // Huawei N5368X
    STC: 60,
    ZAIN: 60,
    MOBILY: 60,
    "GO Telecom": 60,
    Other: 60,
  },
  86597804: {
    // Huawei E6878-370
    STC: 55,
    ZAIN: 35,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86037604: {
    // Huawei E6878-870
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86584007: {
    // Brovi H153-381
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86124107: {
    // Brovi H151-370
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86075606: {
    // Brovi H155-381
    STC: 55,
    ZAIN: 35,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86681507: {
    // Brovi H155-381 (TAC2)
    STC: 55,
    ZAIN: 35,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86688806: {
    // Brovi H155-382
    STC: 55,
    ZAIN: 35,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86241607: {
    // Brovi H155-383
    STC: 55,
    ZAIN: 35,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86717306: {
    // Brovi H158-381
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86120006: {
    // Brovi H352-381
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86968607: {
    // Brovi E6888-982
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86119206: {
    // Brovi Plus H155-380
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86015506: {
    // ZTE MU5120
    STC: 29,
    ZAIN: 29,
    MOBILY: 29,
    "GO Telecom": 29,
    Other: 29,
  },
  86581106: {
    // ZTE MC888
    STC: 29,
    ZAIN: 29,
    MOBILY: 29,
    "GO Telecom": 29,
    Other: 29,
  },
  86367104: {
    // ZTE MC801A
    STC: 29,
    ZAIN: 29,
    MOBILY: 29,
    "GO Telecom": 29,
    Other: 29,
  },
  86556005: {
    // ZTE MC801A (TAC2)
    STC: 29,
    ZAIN: 29,
    MOBILY: 29,
    "GO Telecom": 29,
    Other: 29,
  },
  86896605: {
    // ZTE MC801A (TAC3)
    STC: 29,
    ZAIN: 29,
    MOBILY: 29,
    "GO Telecom": 29,
    Other: 29,
  },
  86156906: {
    // ZTE MC888A ULTRA
    STC: 29,
    ZAIN: 29,
    MOBILY: 29,
    "GO Telecom": 29,
    Other: 29,
  },
  86992605: {
    // ZTE MU5001M
    STC: 29,
    ZAIN: 29,
    MOBILY: 29,
    "GO Telecom": 29,
    Other: 29,
  },
  86637807: {
    // ZTE G5C
    STC: 29,
    ZAIN: 29,
    MOBILY: 29,
    "GO Telecom": 29,
    Other: 29,
  },
  86062806: {
    // ZTE MC801A1
    STC: 29,
    ZAIN: 29,
    MOBILY: 29,
    "GO Telecom": 29,
    Other: 29,
  },
  86160006: {
    // ZTE MC801A1 (TAC2)
    STC: 29,
    ZAIN: 29,
    MOBILY: 29,
    "GO Telecom": 29,
    Other: 29,
  },
  86583105: {
    // Oppo T1A (CTC03)
    STC: 55,
    ZAIN: 35,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86264406: {
    // Oppo T1A (CTC03) (TAC2)
    STC: 55,
    ZAIN: 35,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86782206: {
    // Oppo T2 (CTD05)
    STC: 55,
    ZAIN: 35,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },

  86481205: {
    // GHTelcom H138-380
    STC: 55,
    ZAIN: 35,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86588106: {
    // Soyealink SRT873
    STC: 55,
    ZAIN: 35,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86399806: {
    // Soyealink SRT875
    STC: 55,
    ZAIN: 35,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  35840799: {
    // GreenPacket D5H-250MK
    STC: 55,
    ZAIN: 35,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  35162435: {
    // GreenPacket D5H-EA20/EA60/EA62
    STC: 55,
    ZAIN: 35,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  35759615: {
    // GreenPacket Y5-210MU
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  35181075: {
    // AVXAV WQRTM-838A
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86055606: {
    // AURORA C082 PRO
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  35813213: {
    // D-Link DWR-2000M
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86886605: {
    // FIBOCOM AX3600
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86962406: {
    // TD TECH IC5989
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86204005: {
    // OPPO T1A (CTC02)
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  35418669: {
    // NOKIA AOD311NK
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86719705: {
    // QUECTEL RM500Q-AE
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86133507: {
    // BROVI H165-383
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86490205: {
    // OPPO T1A (CTB06)
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86172305: {
    // OPPO T1A (CTB03)
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86851005: {
    // MEIGLINK A50E
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  35705623: {
    // NOKIA FASTMILE 5G GATEWAY 3.2
    STC: 55,
    ZAIN: 35,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  35277834: {
    // NOKIA FASTMILE 5G GATEWAY 3.1
    STC: 55,
    ZAIN: 35,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86144007: {
    // QUECTEL RG50OL-EU
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86441004: {
    // ZLT X21
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86529706: {
    // ZTE MU5001A-B-M-U/MU5002
    STC: 29,
    ZAIN: 29,
    MOBILY: 29,
    "GO Telecom": 29,
    Other: 29,
  },
  86911905: {
    // TELSTRA AW1000
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
  86237606: {
    // FLYBOX CP52
    STC: 55,
    ZAIN: 55,
    MOBILY: 55,
    "GO Telecom": 55,
    Other: 55,
  },
};

const DEFAULT_PRICE = 55;

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

  if (!/^\d{15}$/.test(imei)) {
    return res.status(400).json({ error: "IMEI must be exactly 15 digits" });
  }

  // Extract TAC (first 8 digits of IMEI)
  const tac = imei.substring(0, 8);

  // Determine price: Check TAC-based pricing, fall back to DEFAULT_PRICE
  let amount = DEFAULT_PRICE;
  if (tacPricing[tac] && tacPricing[tac][network]) {
    amount = tacPricing[tac][network];
  } else {
    console.warn(
      `[Create Order] No price found for TAC ${tac} and network ${network}. Using default price: ${DEFAULT_PRICE}`
    );
  }

  const deliveryTime =
    networkDeliveryTimes[network] || networkDeliveryTimes.Other;

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
      deliveryTime,
    });

    await order.save();

    res.json({
      orderId,
      amount,
      currency: "USD",
      clientId: process.env.PAYPAL_CLIENT_ID,
      deliveryTime,
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
        // Format paymentTime for email
        const formattedPaymentTime = order.paymentTime.toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Riyadh",
        });

        if (order.email) {
          await sendEmail({
            to: order.email,
            subject: "Order Successfully Placed – Invoice",
            template: "invoice",
            data: {
              ...order.toObject(),
              paymentTime: formattedPaymentTime,
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
            paymentTime: formattedPaymentTime,
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

    // Format paymentTime for response
    const formattedPaymentTime = order.paymentTime
      ? order.paymentTime.toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Riyadh",
        })
      : null;

    res.json({
      ...order.toObject(),
      paymentTime: formattedPaymentTime,
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
        paymentTime: order.paymentTime
          ? order.paymentTime.toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
              timeZone: "Asia/Riyadh",
            })
          : null,
      }))
    );
  } catch (error) {
    console.error("Track Order Error:", error.message);
    res.status(500).json({ error: "Failed to track order" });
  }
});

module.exports = router;
