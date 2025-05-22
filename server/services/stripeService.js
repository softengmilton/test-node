// services/stripeService.js
require('dotenv').config();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const User = require('../models/User');
const Subscription = require('../models/Subscription');

module.exports = {
  // Create a Stripe Checkout Session for subscription
  createCheckoutSession: async (req, res) => {
    try {
      const { priceId } = req.body; // e.g. “price_1Nxxx…” from Stripe Dashboard

      // 1. Create a Stripe Customer if not exists
      let stripeCustomerId = req.user.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: req.user.email,
          name: req.user.name
        });
        stripeCustomerId = customer.id;
        // Save to user
        req.user.stripeCustomerId = stripeCustomerId;
        await req.user.save();
      }

      // 2. Create a Checkout Session
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        customer: stripeCustomerId,
        line_items: [
          {
            price: priceId,
            quantity: 1
          }
        ],
        success_url: `${process.env.BASE_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.BASE_URL}/subscription/cancel`
      });

      return res.status(200).json({ url: session.url });
    } catch (err) {
      console.error('stripeService.createCheckoutSession error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Handle Stripe Webhook for subscription events
  handleWebhook: async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('⚠️ Webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        // A new checkout session is completed:
        const session = event.data.object;
        // We can optionally do something here, but subscription is created in invoice.paid
        break;

      case 'invoice.paid':
      case 'invoice.payment_succeeded': {
        // Subscription was successfully created or renewal was paid
        const subscriptionId = event.data.object.subscription;
        const customerId = event.data.object.customer;

        // Find user by stripeCustomerId
        const user = await User.findOne({ stripeCustomerId: customerId });
        if (!user) break;

        // Mark user as subscribed
        user.isSubscribed = true;
        await user.save();

        // Create or update our Subscription record
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        let dbSub = await Subscription.findOne({ stripeSubscriptionId: subscriptionId });
        if (!dbSub) {
          dbSub = new Subscription({
            user: user._id,
            stripeSubscriptionId: subscriptionId,
            planName: sub.items.data[0].plan.nickname || sub.items.data[0].plan.id,
            status: sub.status,
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000)
          });
        } else {
          dbSub.status = sub.status;
          dbSub.currentPeriodStart = new Date(sub.current_period_start * 1000);
          dbSub.currentPeriodEnd = new Date(sub.current_period_end * 1000);
        }
        await dbSub.save();
        break;
      }

      case 'customer.subscription.deleted': {
        // Subscription was canceled or expired
        const sub = event.data.object;
        const subscriptionId = sub.id;
        const customerId = sub.customer;

        // Find user
        const user = await User.findOne({ stripeCustomerId: customerId });
        if (!user) break;

        user.isSubscribed = false;
        await user.save();

        // Update Subscription record
        await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: subscriptionId },
          { status: sub.status }
        );
        break;
      }

      default:
        // Unexpected event type
        console.warn(`Unhandled event type ${event.type}`);
    }

    // Return a 200 to acknowledge receipt of the event
    res.json({ received: true });
  }
};
