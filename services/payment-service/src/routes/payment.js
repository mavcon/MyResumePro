const express = require('express');
const stripeService = require('../services/stripe');
const authMiddleware = require('../middleware/auth');
const logger = require('../utils/logger');
const { SUBSCRIPTION_PLANS } = require('../config/constants');

const router = express.Router();

router.post('/create-subscription', authMiddleware, async (req, res, next) => {
  try {
    const { planId, email, name } = req.body;
    const userId = req.user.id;

    if (!SUBSCRIPTION_PLANS[planId]) {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    const customer = await stripeService.createCustomer(userId, email, name);
    const subscription = await stripeService.createSubscription(
      userId,
      customer.id,
      SUBSCRIPTION_PLANS[planId].id
    );

    res.json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret
      }
    });
  } catch (error) {
    logger.error('Subscription creation error:', error);
    next(error);
  }
});

router.post('/create-payment', authMiddleware, async (req, res, next) => {
  try {
    const { amount, currency, customerId } = req.body;
    
    const paymentIntent = await stripeService.createPaymentIntent(
      amount,
      currency,
      customerId
    );

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret
      }
    });
  } catch (error) {
    logger.error('Payment creation error:', error);
    next(error);
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    await stripeService.handleWebhook(event);
    res.json({ received: true });
  } catch (error) {
    logger.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

module.exports = router; 