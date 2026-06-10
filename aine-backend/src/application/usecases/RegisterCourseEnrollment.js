class RegisterCourseEnrollment {
  /**
   * @param {{
   *   courseSessionRepository: import('../../infrastructure/mysql/MysqlCourseSessionRepository'),
   *   courseEnrollmentRepository: import('../../infrastructure/mysql/MysqlCourseEnrollmentRepository'),
   *   pool: import('mysql2/promise').Pool
   * }} deps
   */
  constructor({ courseSessionRepository, courseEnrollmentRepository, pool }) {
    this.courseSessionRepository = courseSessionRepository;
    this.courseEnrollmentRepository = courseEnrollmentRepository;
    this.pool = pool;
  }

  async execute({ cursoId, fechaId, nombreApellido, email, whatsapp }) {
    const cursoIdNum = Number(cursoId);
    const fechaIdNum = Number(fechaId);
    const nombre = nombreApellido?.trim();
    const emailTrim = email?.trim().toLowerCase();
    const whatsappTrim = whatsapp?.trim().replace(/\s/g, "");

    if (!Number.isInteger(cursoIdNum) || cursoIdNum <= 0) {
      const err = new Error("curso inválido");
      err.code = "validation_error";
      throw err;
    }

    if (!Number.isInteger(fechaIdNum) || fechaIdNum <= 0) {
      const err = new Error("selecciona una fecha disponible");
      err.code = "validation_error";
      throw err;
    }

    if (!nombre || nombre.length < 3) {
      const err = new Error("nombre y apellido son obligatorios");
      err.code = "validation_error";
      throw err;
    }

    if (!emailTrim || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      const err = new Error("correo inválido");
      err.code = "validation_error";
      throw err;
    }

    if (!whatsappTrim || whatsappTrim.length < 10) {
      const err = new Error("whatsapp inválido (mínimo 10 dígitos)");
      err.code = "validation_error";
      throw err;
    }

    const fecha = await this.courseSessionRepository.findById(fechaIdNum);
    if (!fecha || Number(fecha.cursoId) !== cursoIdNum) {
      const err = new Error("la fecha seleccionada no está disponible");
      err.code = "validation_error";
      throw err;
    }

    if (fecha.cuposOcupados >= fecha.cuposTotal) {
      const err = new Error("no hay cupos disponibles para esta fecha");
      err.code = "no_cupos";
      throw err;
    }

    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();

      const reserved = await this.courseSessionRepository.reserveSpot(fechaIdNum, connection);
      if (!reserved) {
        const err = new Error("no hay cupos disponibles para esta fecha");
        err.code = "no_cupos";
        throw err;
      }

      const inscripcion = await this.courseEnrollmentRepository.create(
        {
          cursoId: cursoIdNum,
          fechaId: fechaIdNum,
          nombreApellido: nombre,
          email: emailTrim,
          whatsapp: whatsappTrim,
        },
        connection,
      );

      await connection.commit();
      return inscripcion;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
}

module.exports = { RegisterCourseEnrollment };
