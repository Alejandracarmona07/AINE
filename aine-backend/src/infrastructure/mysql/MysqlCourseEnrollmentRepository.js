class MysqlCourseEnrollmentRepository {
  /**
   * @param {{ pool: import("mysql2/promise").Pool }} deps
   */
  constructor({ pool }) {
    this.pool = pool;
  }

  async create({ cursoId, fechaId, nombreApellido, email, whatsapp }, connection) {
    const conn = connection ?? this.pool;
    const [result] = await conn.query(
      `INSERT INTO inscripciones_cursos (curso_id, fecha_id, nombre_apellido, email, whatsapp)
       VALUES (?, ?, ?, ?, ?)`,
      [cursoId, fechaId, nombreApellido, email, whatsapp],
    );

    return {
      id: result.insertId,
      cursoId,
      fechaId,
      nombreApellido,
      email,
      whatsapp,
      estado: "pendiente",
    };
  }
}

module.exports = { MysqlCourseEnrollmentRepository };
