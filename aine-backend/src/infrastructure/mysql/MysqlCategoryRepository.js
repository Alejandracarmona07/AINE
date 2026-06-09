class MysqlCategoryRepository {
  /**
   * @param {{ pool: import("mysql2/promise").Pool }} deps
   */
  constructor({ pool }) {
    this.pool = pool;
  }

  async findAll() {
    const [rows] = await this.pool.query(
      `SELECT id, nombre, descripcion
       FROM categorias
       ORDER BY nombre ASC`,
    );
    return rows.map((row) => ({
      id: row.id,
      nombre: row.nombre,
      descripcion: row.descripcion,
    }));
  }
}

module.exports = { MysqlCategoryRepository };
