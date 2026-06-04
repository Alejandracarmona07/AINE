class ListPaymentMethods {
  constructor({ paymentMethodRepository }) {
    this.paymentMethodRepository = paymentMethodRepository;
  }

  async execute() {
    return await this.paymentMethodRepository.findAllActive();
  }
}

module.exports = { ListPaymentMethods };
