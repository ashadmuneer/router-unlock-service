const nodemailer = require("nodemailer");
const generateInvoicePDF = require("./generateInvoicePDF"); // 👈 Add this
const fs = require("fs");

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
    paymentType, // 👈 Make sure this is included
  } = data;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let htmlContent = "";
  let attachments = [];

  if (template === "invoice") {
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
        <li><strong>Payment Method:</strong> ${paymentType}</li>
      </ul>
      <p>Invoice is attached below.</p>
      <p>Best regards,<br>Genuine Unlocker Team</p>
    `;

    // 📎 Generate PDF invoice
    const filePath = await generateInvoicePDF(data);
    attachments.push({
      filename: `Invoice-${orderId}.pdf`,
      path: filePath,
    });
  } else if (template === "newOrder") {
    htmlContent = `
      <h2>New Router Unlock Order Notification</h2>
      <p>Admin, a new order has been received:</p>
      <ul>
        <li><strong>Order ID:</strong> ${orderId}</li>
        <li><strong>Brand:</strong> ${brand}</li>
        <li><strong>Model:</strong> ${model}</li>
        <li><strong>Country:</strong> ${country}</li>
        <li><strong>Network:</strong> ${network}</li>
        <li><strong>IMEI:</strong> ${imei}</li>
        <li><strong>Serial Number:</strong> ${serialNumber}</li>
        <li><strong>Customer Whatsapp Number:</strong> ${mobileNumber}</li>
        <li><strong>Customer Email:</strong> ${email}</li>
        <li><strong>Amount Received:</strong> USD ${amount}</li>
        <li><strong>Payment Time:</strong> ${paymentTime}</li>
        <li><strong>Payment Method:</strong> ${paymentType}</li>
      </ul>
      <p>Please review and process the order promptly.</p>
    `;
  } else {
    throw new Error("Invalid email template specified");
  }

  const mailOptions = {
    from: `"Genuine Unlocker" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlContent,
    attachments, // 📎 include if any
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to} for order ${orderId}`);

    // Clean up PDF file after sending
    if (attachments.length > 0) {
      fs.unlink(attachments[0].path, () => {}); // non-blocking delete
    }
  } catch (error) {
    console.error(`❌ Failed to send email to ${to} for order ${orderId}:`, error);
    throw new Error(`Failed to send email to ${to}`);
  }
};

module.exports = sendEmail;
