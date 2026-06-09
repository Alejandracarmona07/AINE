class ListSiteContent {
  /**
   * @param {{ siteContentRepository: { findAllActive: () => Promise<Record<string, string>> } }} deps
   */
  constructor({ siteContentRepository }) {
    this.siteContentRepository = siteContentRepository;
  }

  async execute() {
    return await this.siteContentRepository.findAllActive();
  }
}

module.exports = { ListSiteContent };
