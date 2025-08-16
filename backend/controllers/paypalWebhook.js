const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");
const generateInvoicePDF = require("../utils/generateInvoicePDF");

async function paypalWebhook(req, res) {
  try {
    const event = req.body;

    console.log("📩 PayPal Webhook received:", event.event_type);

    // Handle only completed captures
    if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const capture = event.resource;
      const captureId = capture.id;
      const orderId = capture.supplementary_data?.related_ids?.order_id;

      if (!orderId) {
        console.error("❌ No orderId found in webhook payload");
        return res.sendStatus(400);
      }

      // Update the order
      const order = await Order.findOneAndUpdate(
        { orderId },
        {
          paymentId: captureId,
          paymentStatus: "Success",
          paymentTime: new Date(),
          paymentType: "PayPal",
        },
        { new: true }
      );

      if (order) {
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

          // Generate invoice
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

          // ✅ Send to customer
          if (order.email) {
            await sendEmail({
              to: order.email,
              subject: "Payment Cleared – Invoice Attached",
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

          // ✅ Send to admin
          await sendEmail({
            to: "genuineunlockerinfo@gmail.com",
            subject: "Pending PayPal Payment Cleared",
            template: "newOrder",
            data: {
              ...order.toObject(),
              paymentTime: formattedPaymentTime,
              paymentType: "PayPal",
              deliveryTime: order.deliveryTime,
            },
            attachments,
          });

          console.log("✅ Webhook processed: order updated & invoice sent");
        } catch (err) {
          console.error("❌ Webhook email error:", err.message);
        }
      }
    }

    res.sendStatus(200); // Always respond 200 to PayPal
  } catch (err) {
    console.error("❌ Webhook handler error:", err.message);
    res.sendStatus(500);
  }
}

module.exports = paypalWebhook;
