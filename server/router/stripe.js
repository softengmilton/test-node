// routes/stripe.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createSession, handleWebhook } = require('../controllers/stripeController');

// Protected route: only logged-in users can create a checkout session
router.post('/create-checkout-session', authMiddleware, createSession);

// Public route: Stripe will POST here
router.post('/webhook', handleWebhook);

module.exports = router;
