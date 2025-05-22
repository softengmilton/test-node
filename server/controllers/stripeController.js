// controllers/stripeController.js
const stripeService = require('../services/stripeService');

// POST /api/stripe/create-checkout-session
async function createSession(req, res) {
  // req.user is attached by authMiddleware
  return stripeService.createCheckoutSession(req, res);
}

// POST /api/stripe/webhook
async function handleWebhook(req, res) {
  return stripeService.handleWebhook(req, res);
}

module.exports = { createSession, handleWebhook };
