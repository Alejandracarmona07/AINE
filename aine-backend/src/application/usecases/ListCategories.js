class ListCategories {
  /**
   * @param {{ categoryRepository: { findAll: () => Promise<unknown[]> } }} deps
   */
  constructor({ categoryRepository }) {
    this.categoryRepository = categoryRepository;
  }

  async execute() {
    return await this.categoryRepository.findAll();
  }
}

module.exports = { ListCategories };
