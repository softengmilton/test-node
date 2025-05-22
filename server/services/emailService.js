// services/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

module.exports.sendVerificationEmail = async (user, token) => {
  // Build the URL: BASE_URL/verify-email?token=...
  const verifyUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: '"Resume Builder" <no-reply@yourapp.com>',
    to: user.email,
    subject: 'Please verify your email',
    text: `Hello ${user.name},\n\nPlease verify your email by clicking:\n${verifyUrl}\n\nThank you!`,
    html: `<p>Hello ${user.name},</p>
           <p>Please verify your email by clicking the link below:</p>
           <a href="${verifyUrl}">Verify Email</a>
           <p>Thank you!</p>`
  };

  await transporter.sendMail(mailOptions);
};
