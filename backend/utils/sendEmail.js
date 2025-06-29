const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, template, data }) => {
  const {
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
      <p>Your order with Router Unlock Service has been successfully placed and payment processed.</p>
      <h3>Order Details:</h3>
      <ul>
        <li><strong>Order ID:</strong> ${orderId}</li>
        <li><strong>Brand:</strong> ${brand}</li>
        <li><strong>Model:</strong> ${model}</li>
        <li><strong>Network:</strong> ${network}</li>
        <li><strong>IMEI:</strong> ${imei}</li>
        <li><strong>Serial Number:</strong> ${serialNumber}</li>
        <li><strong>Mobile Number:</strong> ${mobileNumber}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Amount:</strong> Rs${amount}</li>
        <li><strong>Payment Time:</strong> ${paymentTime}</li>
      </ul>
      <p>We will process your unlock request shortly. Contact us at genuineunlockerinfo@gmail.com if you have any questions.</p>
      <p>Best regards,<br>Router Unlock Service Team</p>
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
        <li><strong>Network:</strong> ${network}</li>
        <li><strong>IMEI:</strong> ${imei}</li>
        <li><strong>Serial Number:</strong> ${serialNumber}</li>
        <li><strong>Mobile Number:</strong> ${mobileNumber}</li>
        <li><strong>Customer Email:</strong> ${email || 'Not provided'}</li>
        <li><strong>Amount:</strong> Rs${amount}</li>
        <li><strong>Payment Time:</strong> ${paymentTime}</li>
      </ul>
      <p>Please review and process the order promptly.</p>
      <p>Best regards,<br>Router Unlock Service System</p>
    `;
  } else {
    throw new Error('Invalid email template specified');
  }

  // Email options
  const mailOptions = {
    from: `"Router Unlock Service" <${process.env.EMAIL_USER}>`,
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