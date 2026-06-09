function createStripeClient(secretKey) {
  if (!secretKey) return null;
  // eslint-disable-next-line global-require
  const Stripe = require("stripe");
  return new Stripe(secretKey);
}

module.exports = { createStripeClient };
