// controllers/authController.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const { sendVerificationEmail } = require('../services/emailService');

module.exports = {
  // --------- SIGNUP ----------
  signup: async (req, res) => {
    try {
      const { name, email, password, userType } = req.body;
      // 1. Validate required fields
      if (!name || !email || !password)
        return res.status(400).json({ error: 'Name, email, and password are required' });

      // 2. Check if user already exists
      const existing = await User.findOne({ email });
      if (existing)
        return res.status(400).json({ error: 'Email already registered' });

      // 3. Hash the password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // 4. Create a new user
      const newUser = new User({
        name,
        email,
        passwordHash,
        userType: userType || 'user'
      });
      const savedUser = await newUser.save();

      // 5. Generate email verification token (JWT with short expiry)
      const emailToken = jwt.sign(
        { id: savedUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      // 6. Send verification email
      await sendVerificationEmail(savedUser, emailToken);

      return res.status(201).json({
        message: 'User created. Please check your email to verify your account.'
      });
    } catch (err) {
      console.error('authController.signup error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // --------- VERIFY EMAIL ----------
  verifyEmail: async (req, res) => {
    try {
      const { token } = req.query;
      if (!token) return res.status(400).json({ error: 'Missing token' });

      // 1. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return res.status(400).json({ error: 'Invalid token' });

      // 2. If already verified, skip
      if (user.isVerified)
        return res.status(200).json({ message: 'Email already verified.' });

      // 3. Mark as verified
      user.isVerified = true;
      await user.save();

      return res.status(200).json({ message: 'Email verified successfully.' });
    } catch (err) {
      console.error('authController.verifyEmail error:', err);
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }
  },

  // --------- LOGIN ----------
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ error: 'Email and password are required' });

      // Find user
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: 'Invalid credentials' });

      // Check if verified
      if (!user.isVerified)
        return res.status(403).json({ error: 'Email not verified' });

      // Compare password
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch)
        return res.status(400).json({ error: 'Invalid credentials' });

      // Generate JWT (longer expiry, e.g., 7 days)
      const token = jwt.sign(
        { id: user._id, userType: user.userType },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        message: 'Login successful',
        token
      });
    } catch (err) {
      console.error('authController.login error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};
