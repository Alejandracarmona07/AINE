class ListProducts {
  /**
   * @param {{ productRepository: { findAllActive: () => Promise<unknown[]> } }} deps
   */
  constructor({ productRepository }) {
    this.productRepository = productRepository;
  }

  async execute() {
    return await this.productRepository.findAllActive();
  }
}

module.exports = { ListProducts };
