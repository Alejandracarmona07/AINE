class ListBlogTips {
  /**
   * @param {{ blogTipRepository: import("../../domain/ports/BlogTipRepositoryPort").BlogTipRepositoryPort }} deps
   */
  constructor({ blogTipRepository }) {
    this.blogTipRepository = blogTipRepository;
  }

  async execute() {
    return await this.blogTipRepository.findAllActive();
  }
}

module.exports = { ListBlogTips };
