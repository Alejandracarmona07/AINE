class MysqlPaymentMethodRepository {
  constructor({ pool }) {
    this.pool = pool;
  }

  async findAllActive() {
    const [rows] = await this.pool.query(
      `SELECT id, nombre, descripcion, icono_url AS icono
       FROM formas_pago
       WHERE activo = 1
       ORDER BY orden ASC, nombre ASC`,
    );
    return rows.map((row) => ({
      id: row.id,
      nombre: row.nombre,
      descripcion: row.descripcion,
      icono: row.icono,
    }));
  }
}

module.exports = { MysqlPaymentMethodRepository };
