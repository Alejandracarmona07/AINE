class ListCourseSessions {
  /**
   * @param {{ courseSessionRepository: { findByCourseId: Function } }} deps
   */
  constructor({ courseSessionRepository }) {
    this.courseSessionRepository = courseSessionRepository;
  }

  async execute({ cursoId }) {
    const id = Number(cursoId);
    if (!Number.isInteger(id) || id <= 0) {
      const err = new Error("cursoId inválido");
      err.code = "validation_error";
      throw err;
    }
    return await this.courseSessionRepository.findByCourseId(id);
  }
}

module.exports = { ListCourseSessions };
