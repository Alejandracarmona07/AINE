class MysqlCourseSessionRepository {
  /**
   * @param {{ pool: import("mysql2/promise").Pool }} deps
   */
  constructor({ pool }) {
    this.pool = pool;
  }

  async findByCourseId(cursoId) {
    const [rows] = await this.pool.query(
      `SELECT
         id,
         curso_id AS cursoId,
         fecha,
         hora,
         cupos_total AS cuposTotal,
         cupos_ocupados AS cuposOcupados,
         (cupos_total - cupos_ocupados) AS cuposDisponibles
       FROM curso_fechas
       WHERE curso_id = ? AND activo = 1 AND cupos_ocupados < cupos_total
       ORDER BY fecha ASC, hora ASC`,
      [cursoId],
    );

    return rows.map((row) => ({
      id: row.id,
      cursoId: row.cursoId,
      fecha:
        row.fecha instanceof Date
          ? row.fecha.toISOString().slice(0, 10)
          : String(row.fecha).slice(0, 10),
      hora: row.hora,
      cuposTotal: row.cuposTotal,
      cuposOcupados: row.cuposOcupados,
      cuposDisponibles: row.cuposDisponibles,
    }));
  }

  async findById(fechaId) {
    const [rows] = await this.pool.query(
      `SELECT id, curso_id AS cursoId, cupos_total AS cuposTotal, cupos_ocupados AS cuposOcupados
       FROM curso_fechas
       WHERE id = ? AND activo = 1
       LIMIT 1`,
      [fechaId],
    );
    return rows[0] ?? null;
  }

  async reserveSpot(fechaId, connection) {
    const conn = connection ?? this.pool;
    const [result] = await conn.query(
      `UPDATE curso_fechas
       SET cupos_ocupados = cupos_ocupados + 1
       WHERE id = ? AND activo = 1 AND cupos_ocupados < cupos_total`,
      [fechaId],
    );
    return result.affectedRows > 0;
  }
}

module.exports = { MysqlCourseSessionRepository };
