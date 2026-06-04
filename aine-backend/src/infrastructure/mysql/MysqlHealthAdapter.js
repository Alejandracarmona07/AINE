class MysqlHealthAdapter {
  /**
   * @param {{ pool: import("mysql2/promise").Pool }} deps
   */
  constructor({ pool }) {
    this.pool = pool;
  }

  async check() {
    const [rows] = await this.pool.query("SELECT 1 AS ok");
    return rows?.[0]?.ok === 1;
  }
}

module.exports = { MysqlHealthAdapter };

