class MysqlUserRepository {
  /**
   * @param {{ pool: import("mysql2/promise").Pool }} deps
   */
  constructor({ pool }) {
    this.pool = pool;
  }

  async findById(id) {
    const [rows] = await this.pool.query(
      `SELECT id, nombre, email, telefono, rol, activo
       FROM usuarios
       WHERE id = ?
       LIMIT 1`,
      [id],
    );
    return rows[0] ?? null;
  }

  async findByEmail(email) {
    const [rows] = await this.pool.query(
      `SELECT id, nombre, email, password_hash, telefono, rol, activo
       FROM usuarios
       WHERE email = ?
       LIMIT 1`,
      [email],
    );
    return rows[0] ?? null;
  }

  async create({ nombre, email, passwordHash, telefono = null }) {
    const [result] = await this.pool.query(
      `INSERT INTO usuarios (nombre, email, password_hash, telefono)
       VALUES (?, ?, ?, ?)`,
      [nombre, email, passwordHash, telefono],
    );

    return {
      id: result.insertId,
      nombre,
      email,
      telefono,
      rol: "cliente",
    };
  }
}

module.exports = { MysqlUserRepository };
