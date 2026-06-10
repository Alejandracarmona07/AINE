class GetStripePaymentStatus {
  /**
   * @param {{
   *   stripe: import('stripe').Stripe | null,
   *   stripePaymentRepository: import('../../infrastructure/mysql/MysqlStripePaymentRepository')
   * }} deps
   */
  constructor({ stripe, stripePaymentRepository }) {
    this.stripe = stripe;
    this.stripePaymentRepository = stripePaymentRepository;
  }

  async execute({ sessionId }) {
    if (!sessionId) {
      const err = new Error("sessionId es obligatorio");
      err.code = "validation_error";
      throw err;
    }

    let pago = await this.stripePaymentRepository.findBySessionId(sessionId);
    if (!pago) {
      const err = new Error("pago no encontrado");
      err.code = "not_found";
      throw err;
    }

    if (this.stripe && pago.estado === "pendiente") {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid") {
        await this.stripePaymentRepository.markCompleted({
          sessionId,
          paymentId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null,
        });
        pago = await this.stripePaymentRepository.findBySessionId(sessionId);
      }
    }

    return pago;
  }
}

module.exports = { GetStripePaymentStatus };
