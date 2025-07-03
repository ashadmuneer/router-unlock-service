const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Pricing based on network (in SAR)
const networkPricing = {
  STC: 230,      // ~20 INR
  ZAIN: 130,   // ~25 INR
  MOBILY: 230,   // ~22 INR
  GO: 230,     // ~18 INR
  Other: 230,   // ~250 INR
};

// Create order
router.post('/create-order', async (req, res) => {
  const { brand, model, network, imei, serialNumber, mobileNumber, email, termsAccepted } = req.body;

  console.log('Create order payload:', req.body); // Debug log

  if (!brand || !model || !network || !imei || !serialNumber || !mobileNumber || !email || termsAccepted !== true) {
    return res.status(400).json({ error: 'All fields are required and terms must be accepted' });
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Use predefined price or default to 12 SAR for custom networks
  const amount = networkPricing[network] || 12;

  try {
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // Convert to halala (1 SAR = 100 halala)
      currency: 'SAR',
      receipt: `receipt_${Date.now()}`,
    });

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
      currency: 'SAR', // Store currency in the order
      orderId: razorpayOrder.id,
    });

    await order.save();

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Verify payment
router.post('/verify-payment', async (req, res) => {
  const { orderId, paymentId, signature } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  // Case: Razorpay modal closed or payment failed — no paymentId
  if (!paymentId || !signature) {
    try {
      await Order.findOneAndUpdate(
        { orderId },
        {
          paymentStatus: 'Failed',
          paymentTime: new Date(),
        },
        { new: true }
      );

      console.warn(`Payment was not completed for orderId: ${orderId}`);
      return res.status(200).json({ status: 'failed', message: 'Payment not completed' });
    } catch (err) {
      console.error('Error updating failed payment:', err);
      return res.status(500).json({ error: 'Failed to update order status' });
    }
  }

  // Case: Payment done — validate signature
  try {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      await Order.findOneAndUpdate(
        { orderId },
        {
          paymentId,
          paymentStatus: 'Failed',
          paymentTime: new Date(),
        }
      );
      return res.status(400).json({ error: 'Invalid signature, payment verification failed' });
    }

    const order = await Order.findOneAndUpdate(
      { orderId },
      {
        paymentId,
        paymentStatus: 'Success',
        paymentTime: new Date(),
      },
      { new: true }
    );

    if (!order) {
      console.error(`Order not found for orderId: ${orderId}`);
      return res.status(404).json({ error: 'Order not found' });
    }

    try {
      // Send invoice email to customer using order.email
      if (order.email) {
        await sendEmail({
          to: order.email,
          subject: 'Order Successfully Placed, Your Invoice',
          template: 'invoice',
          data: {
            brand: order.brand,
            model: order.model,
            network: order.network,
            imei: order.imei,
            serialNumber: order.serialNumber,
            mobileNumber: order.mobileNumber,
            email: order.email,
            amount: order.amount,
            currency: order.currency || 'SAR',
            orderId: order.orderId,
            paymentTime: order.paymentTime.toISOString(),
          },
        });
        console.log(`Customer invoice email sent to ${order.email} for order ${orderId}`);
      } else {
        console.warn(`No customer email provided for order ${orderId}`);
      }

      // Send new order notification to admin
      const adminEmail = 'genuineunlockerinfo@gmail.com';
      await sendEmail({
        to: adminEmail,
        subject: 'New Router Unlock Order Received',
        template: 'newOrder',
        data: {
          brand: order.brand,
          model: order.model,
          network: order.network,
          imei: order.imei,
          serialNumber: order.serialNumber,
          mobileNumber: order.mobileNumber,
          email: order.email || 'Not provided',
          amount: order.amount,
          currency: order.currency || 'SAR',
          orderId: order.orderId,
          paymentTime: order.paymentTime.toISOString(),
          termsAccepted: order.termsAccepted,
        },
      });
      console.log(`Admin notification email sent to ${adminEmail} for order ${orderId}`);
    } catch (emailErr) {
      console.error('Error sending email(s) for order', orderId, ':', emailErr.message);
      // Not failing the request, as payment is successful
    }

    res.json({ status: 'success', message: 'Payment verified and order updated' });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Internal server error during verification' });
  }
});

// Fetch order details
router.get('/order-details/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      orderId: order.orderId,
      brand: order.brand,
      model: order.model,
      network: order.network,
      imei: order.imei,
      serialNumber: order.serialNumber,
      mobileNumber: order.mobileNumber,
      email: order.email,
      termsAccepted: order.termsAccepted,
      amount: order.amount,
      currency: order.currency || 'SAR',
      paymentStatus: order.paymentStatus,
      paymentTime: order.paymentTime ? order.paymentTime.toISOString() : null,
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Track order by IMEI
router.get('/track-order/:imei', async (req, res) => {
  try {
    const imei = req.params.imei;
    if (!imei) {
      return res.status(400).json({ error: 'IMEI is required' });
    }

    const orders = await Order.find({ imei });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: 'No orders found for this IMEI' });
    }

    const orderDetails = orders.map(order => ({
      orderId: order.orderId,
      mobileNumber: order.mobileNumber,
      email: order.email,
      imeiNumber: order.imei,
      brand: order.brand,
      model: order.model,
      network: order.network,
      termsAccepted: order.termsAccepted,
      status: order.paymentStatus,
      amount: order.amount,
      currency: order.currency || 'SAR',
      paymentTime: order.paymentTime ? order.paymentTime.toISOString() : null,
    }));

    res.json(orderDetails);
  } catch (error) {
    console.error('Error tracking order:', error);
    res.status(500).json({ error: 'Failed to track order' });
  }
});

module.exports = router;