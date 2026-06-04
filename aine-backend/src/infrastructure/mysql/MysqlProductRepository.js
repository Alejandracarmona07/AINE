class MysqlProductRepository {
  /**
   * @param {{ pool: import("mysql2/promise").Pool }} deps
   */
  constructor({ pool }) {
    this.pool = pool;
  }

  async findAllActive() {
    const [rows] = await this.pool.query(
      `SELECT p.id,
              p.nombre,
              p.descripcion,
              p.precio,
              p.imagen_url AS imagen,
              c.nombre AS categoria
       FROM productos p
       INNER JOIN categorias c ON c.id = p.categoria_id
       WHERE p.activo = 1
       ORDER BY c.nombre, p.nombre`,
    );
    return rows.map((row) => ({
      id: row.id,
      nombre: row.nombre,
      descripcion: row.descripcion,
      precio: Number(row.precio),
      imagen: row.imagen,
      categoria: row.categoria,
    }));
  }
}

module.exports = { MysqlProductRepository };
