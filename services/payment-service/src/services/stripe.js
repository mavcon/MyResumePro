const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Subscription, Transaction } = require('../models');
const logger = require('../utils/logger');
const { SUBSCRIPTION_PLANS } = require('../config/constants');

class StripeService {
  async createCustomer(userId, email, name) {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          userId
        }
      });
      return customer;
    } catch (error) {
      logger.error('Stripe customer creation error:', error);
      throw error;
    }
  }

  async createSubscription(userId, customerId, planId) {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: planId }],
        expand: ['latest_invoice.payment_intent']
      });

      await Subscription.create({
        userId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        plan: planId,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      });

      return subscription;
    } catch (error) {
      logger.error('Subscription creation error:', error);
      throw error;
    }
  }

  async createPaymentIntent(amount, currency = 'usd', customerId) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        customer: customerId,
        payment_method_types: ['card']
      });

      return paymentIntent;
    } catch (error) {
      logger.error('Payment intent creation error:', error);
      throw error;
    }
  }

  async handleWebhook(event) {
    try {
      switch (event.type) {
        case 'invoice.payment_succeeded':
          await this.handleSuccessfulPayment(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionCancelled(event.data.object);
          break;
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event.data.object);
          break;
      }
    } catch (error) {
      logger.error('Webhook handling error:', error);
      throw error;
    }
  }

  async handleSuccessfulPayment(invoice) {
    await Transaction.create({
      userId: invoice.metadata.userId,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'succeeded',
      stripePaymentIntentId: invoice.payment_intent,
      type: 'subscription',
      description: `Subscription payment for ${invoice.metadata.plan}`
    });
  }

  async handleSubscriptionCancelled(subscription) {
    await Subscription.update(
      { status: 'cancelled' },
      { where: { stripeSubscriptionId: subscription.id } }
    );
  }

  async handlePaymentIntentSucceeded(paymentIntent) {
    await Transaction.create({
      userId: paymentIntent.metadata.userId,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: 'succeeded',
      stripePaymentIntentId: paymentIntent.id,
      type: 'one-time',
      description: paymentIntent.metadata.description
    });
  }
}

module.exports = new StripeService(); 