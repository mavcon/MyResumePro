require('dotenv').config();

module.exports = {
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  SUBSCRIPTION_PLANS: {
    BASIC: {
      id: 'price_basic',
      name: 'Basic',
      credits: 10,
      price: 999 // $9.99
    },
    PRO: {
      id: 'price_pro',
      name: 'Professional',
      credits: 50,
      price: 2999 // $29.99
    },
    ENTERPRISE: {
      id: 'price_enterprise',
      name: 'Enterprise',
      credits: 200,
      price: 9999 // $99.99
    }
  }
}; 