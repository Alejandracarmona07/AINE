class ListCourses {
  constructor({ courseRepository }) {
    this.courseRepository = courseRepository;
  }

  async execute() {
    return await this.courseRepository.findAllActive();
  }
}

module.exports = { ListCourses };
