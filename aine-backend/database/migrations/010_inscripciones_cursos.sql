-- Fechas, cupos e inscripciones de cursos

CREATE TABLE IF NOT EXISTS curso_fechas (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  curso_id       INT UNSIGNED NOT NULL,
  fecha          DATE NOT NULL,
  hora           VARCHAR(10) NOT NULL DEFAULT '10:00',
  cupos_total    INT UNSIGNED NOT NULL DEFAULT 10,
  cupos_ocupados INT UNSIGNED NOT NULL DEFAULT 0,
  activo         TINYINT(1) NOT NULL DEFAULT 1,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_curso_fechas_curso
    FOREIGN KEY (curso_id) REFERENCES cursos (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX idx_curso_fechas_curso (curso_id),
  INDEX idx_curso_fechas_fecha (fecha)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS inscripciones_cursos (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  curso_id        INT UNSIGNED NOT NULL,
  fecha_id        INT UNSIGNED NOT NULL,
  nombre_apellido VARCHAR(120) NOT NULL,
  email           VARCHAR(150) NOT NULL,
  whatsapp        VARCHAR(20) NOT NULL,
  estado          ENUM('pendiente', 'confirmada', 'cancelada') NOT NULL DEFAULT 'pendiente',
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_inscripciones_curso
    FOREIGN KEY (curso_id) REFERENCES cursos (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_inscripciones_fecha
    FOREIGN KEY (fecha_id) REFERENCES curso_fechas (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_inscripciones_curso (curso_id),
  INDEX idx_inscripciones_email (email)
) ENGINE=InnoDB;

INSERT INTO curso_fechas (curso_id, fecha, hora, cupos_total, cupos_ocupados)
SELECT c.id, v.fecha, v.hora, v.cupos_total, 0
FROM cursos c
INNER JOIN (
  SELECT 'Automaquillaje de día' AS titulo, '2026-06-15' AS fecha, '10:00' AS hora, 12 AS cupos_total
  UNION ALL SELECT 'Automaquillaje de día', '2026-07-05', '15:00', 10
  UNION ALL SELECT 'Pestañas de impacto', '2026-06-20', '11:00', 8
  UNION ALL SELECT 'Pestañas de impacto', '2026-07-12', '16:00', 8
  UNION ALL SELECT 'Piel perfecta + base', '2026-06-22', '10:00', 10
  UNION ALL SELECT 'Piel perfecta + base', '2026-07-18', '14:00', 10
  UNION ALL SELECT 'Labios perfectos', '2026-06-28', '10:00', 12
  UNION ALL SELECT 'Labios perfectos', '2026-07-20', '11:00', 12
  UNION ALL SELECT 'Maquillaje básico', '2026-06-14', '09:00', 15
  UNION ALL SELECT 'Smoky eyes profundo', '2026-06-21', '15:00', 10
  UNION ALL SELECT 'Contorno avanzado', '2026-07-06', '10:00', 8
  UNION ALL SELECT 'Look de fiesta', '2026-07-11', '17:00', 10
) AS v ON v.titulo = c.titulo
WHERE NOT EXISTS (
  SELECT 1 FROM curso_fechas cf
  WHERE cf.curso_id = c.id AND cf.fecha = v.fecha AND cf.hora = v.hora
);
