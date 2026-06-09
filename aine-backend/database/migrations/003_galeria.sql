-- Galería de inspiración (looks)
CREATE TABLE IF NOT EXISTS galeria (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  imagen_url VARCHAR(255) NOT NULL,
  titulo     VARCHAR(120) NOT NULL,
  activo     TINYINT(1) NOT NULL DEFAULT 1,
  orden      INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO galeria (imagen_url, titulo, orden)
SELECT * FROM (
  SELECT '/images/galeria/look1.jpg' AS imagen_url, 'Glow natural' AS titulo, 1 AS orden
  UNION ALL SELECT '/images/galeria/look2.jpg', 'Rubor fresh', 2
  UNION ALL SELECT '/images/galeria/look3.jpg', 'Labios intensos', 3
  UNION ALL SELECT '/images/galeria/look4.jpg', 'Mirada impacto', 4
  UNION ALL SELECT '/images/maquillaje2.jpg', 'Look profesional', 5
  UNION ALL SELECT '/images/maquillaje3.jpg', 'Estilo editorial', 6
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM galeria LIMIT 1);
