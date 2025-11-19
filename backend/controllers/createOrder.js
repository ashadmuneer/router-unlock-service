const paypal = require("@paypal/checkout-server-sdk");
const Order = require("../models/Order");

const environment = new paypal.core.LiveEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const paypalClient = new paypal.core.PayPalHttpClient(environment);


async function getTacPricingDB() {
  const res = await fetch("https://dashboard-18tv.onrender.com/api/tac-pricing");
  const data = await res.json();

  return Object.fromEntries(
    data.map(item => [
      item.tac,
      item.prices
    ])
  );
}
let tacPricing = {};

getTacPricingDB().then((data) => {
  tacPricing = data;
  console.log(tacPricing);
});

const DEFAULT_PRICE = 55;

// Delivery Time Based on Network
const networkDeliveryTimes = {
  STC: "1–3 Days",
  ZAIN: "1–3 Days",
  MOBILY: "1–3 Days",
  GO: "1-3 Days",
  Other: "1-3 Days",
};

async function createOrder(req, res) {
  const {
    country,
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
    !country ||
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

  const tac = imei.substring(0, 8);

  let amount = DEFAULT_PRICE;

  if (tacPricing[tac]) {
    if (tacPricing[tac][network] !== undefined) {
      // ✅ Exact TAC + network price found
      amount = tacPricing[tac][network];
    } else if (tacPricing[tac].Other !== undefined) {
      // ✅ Use TAC-specific "Other" as default
      amount = tacPricing[tac].Other;
    } else {
      console.warn(
        `[Create Order] TAC ${tac} exists but no price for network ${network}, using global default ${DEFAULT_PRICE}`
      );
    }
  } else {
    console.warn(
      `[Create Order] No TAC pricing found for ${tac}, using global default ${DEFAULT_PRICE}`
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
      country,
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
      paymentType: "PayPal",
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
}

module.exports = createOrder;
