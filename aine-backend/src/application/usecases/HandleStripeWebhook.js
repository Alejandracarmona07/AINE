class HandleStripeWebhook {
  /**
   * @param {{
   *   stripe: import('stripe').Stripe | null,
   *   webhookSecret: string | undefined,
   *   stripePaymentRepository: import('../../infrastructure/mysql/MysqlStripePaymentRepository')
   * }} deps
   */
  constructor({ stripe, webhookSecret, stripePaymentRepository }) {
    this.stripe = stripe;
    this.webhookSecret = webhookSecret;
    this.stripePaymentRepository = stripePaymentRepository;
  }

  async execute({ rawBody, signature }) {
    if (!this.stripe || !this.webhookSecret) {
      const err = new Error("webhook de Stripe no configurado");
      err.code = "stripe_not_configured";
      throw err;
    }

    const event = this.stripe.webhooks.constructEvent(rawBody, signature, this.webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      await this.stripePaymentRepository.markCompleted({
        sessionId: session.id,
        paymentId: session.payment_intent ?? null,
      });
    }

    return { received: true, type: event.type };
  }
}

module.exports = { HandleStripeWebhook };
