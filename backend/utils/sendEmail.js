/**
 * Email Utility - Transaction Notifications
 * Uses nodemailer with Gmail
 * Set EMAIL and EMAIL_PASSWORD in .env
 */
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, text) => {
  if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
    console.log("Email not configured, skipping notification");
    return;
  }
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error("Email send error:", error.message);
  }
};

module.exports = sendEmail;
