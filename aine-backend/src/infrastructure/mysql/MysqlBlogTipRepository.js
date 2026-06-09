class MysqlBlogTipRepository {
  /**
   * @param {{ pool: import("mysql2/promise").Pool }} deps
   */
  constructor({ pool }) {
    this.pool = pool;
  }

  async findAllActive() {
    const [rows] = await this.pool.query(
      `SELECT
         t.id,
         t.titulo,
         t.resumen,
         t.contenido,
         t.imagen_url AS imagen,
         t.etiqueta,
         COUNT(c.id) AS comentariosCount
       FROM blog_tips t
       LEFT JOIN comunidad_comentarios c
         ON c.tip_id = t.id AND c.tipo = 'tip' AND c.activo = 1
       WHERE t.activo = 1
       GROUP BY t.id
       ORDER BY t.orden ASC, t.id ASC`,
    );

    return rows.map((row) => ({
      id: row.id,
      titulo: row.titulo,
      resumen: row.resumen,
      contenido: row.contenido,
      imagen: row.imagen,
      etiqueta: row.etiqueta,
      comentariosCount: Number(row.comentariosCount),
    }));
  }
}

module.exports = { MysqlBlogTipRepository };
