class MysqlSocialNetworkRepository {
  /**
   * @param {{ pool: import("mysql2/promise").Pool }} deps
   */
  constructor({ pool }) {
    this.pool = pool;
  }

  async findAllActive() {
    const [rows] = await this.pool.query(
      `SELECT id, nombre, url, icono_url AS icono
       FROM redes_sociales
       WHERE activo = 1
       ORDER BY orden ASC, nombre ASC`,
    );

    return rows.map((row) => ({
      id: row.id,
      nombre: row.nombre,
      url: row.url,
      icono: row.icono,
    }));
  }
}

module.exports = { MysqlSocialNetworkRepository };
