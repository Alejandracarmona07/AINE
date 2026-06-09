class MysqlCommunityCommentRepository {
  /**
   * @param {{ pool: import("mysql2/promise").Pool }} deps
   */
  constructor({ pool }) {
    this.pool = pool;
  }

  async findAllActive({ tipo, tipId, productoId } = {}) {
    const conditions = ["c.activo = 1"];
    const params = [];

    if (tipo) {
      conditions.push("c.tipo = ?");
      params.push(tipo);
    }
    if (tipId != null) {
      conditions.push("c.tip_id = ?");
      params.push(tipId);
    }
    if (productoId != null) {
      conditions.push("c.producto_id = ?");
      params.push(productoId);
    }

    const [rows] = await this.pool.query(
      `SELECT
         c.id,
         c.tipo,
         c.tip_id AS tipId,
         c.producto_id AS productoId,
         p.nombre AS productoNombre,
         c.usuario_id AS usuarioId,
         u.nombre AS autor,
         c.contenido,
         c.calificacion,
         c.created_at AS createdAt
       FROM comunidad_comentarios c
       INNER JOIN usuarios u ON u.id = c.usuario_id
       LEFT JOIN productos p ON p.id = c.producto_id
       WHERE ${conditions.join(" AND ")}
       ORDER BY c.created_at DESC`,
      params,
    );

    return rows.map((row) => ({
      id: row.id,
      tipo: row.tipo,
      tipId: row.tipId,
      productoId: row.productoId,
      productoNombre: row.productoNombre,
      usuarioId: row.usuarioId,
      autor: row.autor,
      contenido: row.contenido,
      calificacion: row.calificacion,
      createdAt: row.createdAt,
    }));
  }

  async create({ tipo, tipId = null, productoId = null, usuarioId, contenido, calificacion = null }) {
    const [result] = await this.pool.query(
      `INSERT INTO comunidad_comentarios (tipo, tip_id, producto_id, usuario_id, contenido, calificacion)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [tipo, tipId, productoId, usuarioId, contenido, calificacion],
    );

    const [rows] = await this.pool.query(
      `SELECT
         c.id,
         c.tipo,
         c.tip_id AS tipId,
         c.producto_id AS productoId,
         p.nombre AS productoNombre,
         c.usuario_id AS usuarioId,
         u.nombre AS autor,
         c.contenido,
         c.calificacion,
         c.created_at AS createdAt
       FROM comunidad_comentarios c
       INNER JOIN usuarios u ON u.id = c.usuario_id
       LEFT JOIN productos p ON p.id = c.producto_id
       WHERE c.id = ?
       LIMIT 1`,
      [result.insertId],
    );

    const row = rows[0];
    return {
      id: row.id,
      tipo: row.tipo,
      tipId: row.tipId,
      productoId: row.productoId,
      productoNombre: row.productoNombre,
      usuarioId: row.usuarioId,
      autor: row.autor,
      contenido: row.contenido,
      calificacion: row.calificacion,
      createdAt: row.createdAt,
    };
  }
}

module.exports = { MysqlCommunityCommentRepository };
