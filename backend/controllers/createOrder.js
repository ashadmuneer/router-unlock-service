const paypal = require("@paypal/checkout-server-sdk");
const Order = require("../models/Order");

// PayPal client configuration (assumed to be set up in a config file or environment)
const environment = new paypal.core.LiveEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const paypalClient = new paypal.core.PayPalHttpClient(environment);

// TAC-based pricing rules (abbreviated)
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
  90909090: {
    // Test
    STC: 2,
    ZAIN: 2,
    MOBILY: 2,
    "GO Telecom": 2,
    Other: 1,
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