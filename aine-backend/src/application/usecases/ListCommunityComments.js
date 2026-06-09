class ListCommunityComments {
  /**
   * @param {{ communityCommentRepository: import("../../domain/ports/CommunityCommentRepositoryPort").CommunityCommentRepositoryPort }} deps
   */
  constructor({ communityCommentRepository }) {
    this.communityCommentRepository = communityCommentRepository;
  }

  async execute({ tipo, tipId, productoId } = {}) {
    return await this.communityCommentRepository.findAllActive({ tipo, tipId, productoId });
  }
}

module.exports = { ListCommunityComments };
