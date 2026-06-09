class MysqlGalleryRepository {
  /**
   * @param {{ pool: import("mysql2/promise").Pool }} deps
   */
  constructor({ pool }) {
    this.pool = pool;
  }

  async findAllActive() {
    const [rows] = await this.pool.query(
      `SELECT id, imagen_url AS imagen, titulo
       FROM galeria
       WHERE activo = 1
       ORDER BY orden ASC, id ASC`,
    );
    return rows.map((row) => ({
      id: row.id,
      imagen: row.imagen,
      titulo: row.titulo,
    }));
  }
}

module.exports = { MysqlGalleryRepository };
