class ListSocialNetworks {
  /**
   * @param {{ socialNetworkRepository: { findAllActive: () => Promise<unknown[]> } }} deps
   */
  constructor({ socialNetworkRepository }) {
    this.socialNetworkRepository = socialNetworkRepository;
  }

  async execute() {
    return await this.socialNetworkRepository.findAllActive();
  }
}

module.exports = { ListSocialNetworks };
