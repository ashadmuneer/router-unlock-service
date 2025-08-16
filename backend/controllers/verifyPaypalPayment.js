const paypal = require("@paypal/checkout-server-sdk");
const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");
const generateInvoicePDF = require("../utils/generateInvoicePDF");

// PayPal client configuration
const environment = new paypal.core.LiveEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const paypalClient = new paypal.core.PayPalHttpClient(environment);

async function verifyPaypalPayment(req, res) {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  try {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const capture = await paypalClient.execute(request);
    const captureData = capture.result.purchase_units[0].payments.captures[0];
    const captureId = captureData.id;
    const paymentStatus = captureData.status; // COMPLETED, PENDING, DENIED, etc.

    const order = await Order.findOneAndUpdate(
      { orderId },
      {
        paymentId: captureId,
        paymentStatus:
          paymentStatus === "COMPLETED"
            ? "Success"
            : paymentStatus === "PENDING"
            ? "Pending"
            : "Failed",
        paymentTime: new Date(),
        paymentType: "PayPal",
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (paymentStatus === "COMPLETED") {
      // ✅ Immediate success → send invoice
      try {
        const formattedPaymentTime = order.paymentTime.toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Riyadh",
        });

        const invoicePdfBuffer = await generateInvoicePDF({
          ...order.toObject(),
          paymentTime: formattedPaymentTime,
          paymentType: "PayPal",
        });

        const attachments = [
          {
            filename: `Invoice_${order.orderId}.pdf`,
            content: invoicePdfBuffer,
            contentType: "application/pdf",
          },
        ];

        if (order.email) {
          await sendEmail({
            to: order.email,
            subject: "Order Successfully Placed – Invoice",
            template: "invoice",
            data: {
              ...order.toObject(),
              paymentTime: formattedPaymentTime,
              paymentType: "PayPal",
              deliveryTime: order.deliveryTime,
            },
            attachments,
          });
        }

        await sendEmail({
          to: "genuineunlockerinfo@gmail.com",
          subject: "New Digital Service Order Received",
          template: "newOrder",
          data: {
            ...order.toObject(),
            paymentTime: formattedPaymentTime,
            paymentType: "PayPal",
            deliveryTime: order.deliveryTime,
          },
          attachments,
        });

        res.json({
          status: "success",
          message: "PayPal payment verified and order updated",
        });
      } catch (emailErr) {
        console.error("Email send error:", emailErr.message);
        res.json({
          status: "success",
          message: "PayPal payment verified, but email failed",
        });
      }
    } else if (paymentStatus === "PENDING") {
      // ⚠️ Mark as pending, no invoice yet
      if (order.email) {
        await sendEmail({
          to: order.email,
          subject: "Your PayPal Payment is Pending",
          template: "pendingPayment", // 👉 you should create this template
          data: {
            ...order.toObject(),
            paymentType: "PayPal",
          },
        });
      }

      await sendEmail({
        to: "genuineunlockerinfo@gmail.com",
        subject: "New PayPal Payment Pending",
        template: "newOrder",
        data: {
          ...order.toObject(),
          paymentType: "PayPal",
        },
      });

      res.json({
        status: "pending",
        message:
          "PayPal payment is pending. Invoice will be sent automatically when cleared (via webhook).",
      });
    } else {
      // ❌ Failed or Denied
      res.status(400).json({ error: "PayPal payment not completed" });
    }
  } catch (error) {
    console.error("[Verify PayPal Payment] Error:", {
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

    res.status(500).json({ error: "Failed to verify PayPal payment" });
  }
}

module.exports = verifyPaypalPayment;
