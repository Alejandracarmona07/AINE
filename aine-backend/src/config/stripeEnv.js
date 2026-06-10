function readStripeEnv() {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim() || null;
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY?.trim() || null;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim() || null;
  const frontendUrl = (
    process.env.FRONTEND_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:5173"
  ).replace(/\/$/, "");

  return {
    secretKey,
    publishableKey,
    webhookSecret,
    frontendUrl,
    isConfigured: Boolean(secretKey && publishableKey),
  };
}

module.exports = { readStripeEnv };
