class ListGallery {
  /**
   * @param {{ galleryRepository: { findAllActive: () => Promise<unknown[]> } }} deps
   */
  constructor({ galleryRepository }) {
    this.galleryRepository = galleryRepository;
  }

  async execute() {
    return await this.galleryRepository.findAllActive();
  }
}

module.exports = { ListGallery };
