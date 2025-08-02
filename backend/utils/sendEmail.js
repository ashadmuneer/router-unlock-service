const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, template, data }) => {
  const {
    country,
    brand,
    model,
    network,
    imei,
    serialNumber,
    mobileNumber,
    email,
    amount,
    orderId,
    paymentTime,
  } = data;

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email content based on template
  let htmlContent = '';

  if (template === 'invoice') {
    htmlContent = `
      <h2>Order Successfully Placed, Your Invoice</h2>
      <p>Dear Customer,</p>
      <p>Thank you! Your order with GenuineUnlocker Router Unlock Service has been placed successfully, and your payment has been received.</p>
      <h3>Order Details:</h3>
      <ul>
        <li><strong>Order ID:</strong> ${orderId}</li>
        <li><strong>Brand:</strong> ${brand}</li>
        <li><strong>Model:</strong> ${model}</li>
        <li><strong>Country:</strong> ${country}</li>
        <li><strong>Network:</strong> ${network}</li>
        <li><strong>IMEI:</strong> ${imei}</li>
        <li><strong>Serial Number:</strong> ${serialNumber}</li>
        <li><strong>Whatsapp Number:</strong> ${mobileNumber}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Amount Paid:</strong> USD ${amount}</li>
        <li><strong>Payment Time:</strong> ${paymentTime}</li>
      </ul>
      <p>We will process your unlock request shortly. Contact us at genuineunlockerinfo@gmail.com if you have any questions.</p>
      <p>Best regards,<br>Genuine Unlocker Team</p>
    `;
  } else if (template === 'newOrder') {
    htmlContent = `
      <h2>New Router Unlock Order Notification</h2>
      <p>Admin, a new order has been received:</p>
      <h3>Order Details:</h3>
      <ul>
        <li><strong>Order ID:</strong> ${orderId}</li>
        <li><strong>Brand:</strong> ${brand}</li>
        <li><strong>Model:</strong> ${model}</li>
         <li><strong>Country:</strong> ${country}</li>
        <li><strong>Network:</strong> ${network}</li>
        <li><strong>IMEI:</strong> ${imei}</li>
        <li><strong>Serial Number:</strong> ${serialNumber}</li>
        <li><strong>Customer Whatsapp Number:</strong> ${mobileNumber}</li>
        <li><strong>Customer Email:</strong> ${email || 'Not provided'}</li>
        <li><strong>Amount Received:</strong> USD ${amount}</li>
        <li><strong>Payment Time:</strong> ${paymentTime}</li>
      </ul>
      <p>Please review and process the order promptly.</p>
      <p>Best regards,<br>Genuine Unlocker System</p>
    `;
  } else {
    throw new Error('Invalid email template specified');
  }

  // Email options
  const mailOptions = {
    from: `"Genuine Unlocker" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to} for order ${orderId}`);
  } catch (error) {
    console.error(`Failed to send email to ${to} for order ${orderId}:`, error);
    throw new Error(`Failed to send email to ${to}`);
  }
};

module.exports = sendEmail;