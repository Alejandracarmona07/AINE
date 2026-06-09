class GetStripePaymentStatus {
  /**
   * @param {{ stripePaymentRepository: import('../../infrastructure/mysql/MysqlStripePaymentRepository') }} deps
   */
  constructor({ stripePaymentRepository }) {
    this.stripePaymentRepository = stripePaymentRepository;
  }

  async execute({ sessionId }) {
    if (!sessionId) {
      const err = new Error("sessionId es obligatorio");
      err.code = "validation_error";
      throw err;
    }

    const pago = await this.stripePaymentRepository.findBySessionId(sessionId);
    if (!pago) {
      const err = new Error("pago no encontrado");
      err.code = "not_found";
      throw err;
    }

    return pago;
  }
}

module.exports = { GetStripePaymentStatus };
