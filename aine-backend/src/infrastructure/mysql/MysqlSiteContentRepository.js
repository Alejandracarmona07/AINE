class MysqlSiteContentRepository {
  /**
   * @param {{ pool: import("mysql2/promise").Pool }} deps
   */
  constructor({ pool }) {
    this.pool = pool;
  }

  async findAllActive() {
    const [rows] = await this.pool.query(
      `SELECT clave, valor
       FROM contenido_sitio
       WHERE activo = 1`,
    );

    return rows.reduce((acc, row) => {
      acc[row.clave] = row.valor;
      return acc;
    }, {});
  }
}

module.exports = { MysqlSiteContentRepository };
