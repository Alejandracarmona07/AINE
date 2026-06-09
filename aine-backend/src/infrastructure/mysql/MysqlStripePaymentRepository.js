class MysqlStripePaymentRepository {
  /**
   * @param {{ pool: import("mysql2/promise").Pool }} deps
   */
  constructor({ pool }) {
    this.pool = pool;
  }

  async createPending({ sessionId, usuarioId, email, total, items }) {
    await this.pool.query(
      `INSERT INTO pagos_stripe (stripe_session_id, usuario_id, email, total, items_json)
       VALUES (?, ?, ?, ?, ?)`,
      [sessionId, usuarioId ?? null, email ?? null, total, JSON.stringify(items)],
    );
  }

  async markCompleted({ sessionId, paymentId }) {
    const [result] = await this.pool.query(
      `UPDATE pagos_stripe
       SET estado = 'completado',
           stripe_payment_id = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE stripe_session_id = ? AND estado = 'pendiente'`,
      [paymentId ?? null, sessionId],
    );
    return result.affectedRows > 0;
  }

  async findBySessionId(sessionId) {
    const [rows] = await this.pool.query(
      `SELECT id, stripe_session_id AS sessionId, estado, total, email, items_json AS itemsJson
       FROM pagos_stripe
       WHERE stripe_session_id = ?
       LIMIT 1`,
      [sessionId],
    );
    if (!rows[0]) return null;
    const row = rows[0];
    return {
      id: row.id,
      sessionId: row.sessionId,
      estado: row.estado,
      total: Number(row.total),
      email: row.email,
      items: typeof row.itemsJson === "string" ? JSON.parse(row.itemsJson) : row.itemsJson,
    };
  }
}

module.exports = { MysqlStripePaymentRepository };
