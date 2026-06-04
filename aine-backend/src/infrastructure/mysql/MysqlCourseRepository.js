class MysqlCourseRepository {
  constructor({ pool }) {
    this.pool = pool;
  }

  async findAllActive() {
    const [rows] = await this.pool.query(
      `SELECT id, titulo, descripcion, precio, imagen_url AS imagen
       FROM cursos
       WHERE activo = 1
       ORDER BY precio ASC`,
    );
    return rows.map((row) => ({
      id: row.id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      precio: Number(row.precio),
      imagen: row.imagen,
    }));
  }
}

module.exports = { MysqlCourseRepository };
