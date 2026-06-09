-- Blog de tips y comentarios / experiencias de la comunidad

CREATE TABLE IF NOT EXISTS blog_tips (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo      VARCHAR(150) NOT NULL,
  resumen     VARCHAR(300) NOT NULL,
  contenido   TEXT NOT NULL,
  imagen_url  VARCHAR(255) NULL,
  etiqueta    VARCHAR(60) NULL,
  orden       INT UNSIGNED NOT NULL DEFAULT 0,
  activo      TINYINT(1) NOT NULL DEFAULT 1,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS comunidad_comentarios (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tipo         ENUM('tip', 'experiencia') NOT NULL,
  tip_id       INT UNSIGNED NULL,
  producto_id  INT UNSIGNED NULL,
  usuario_id   INT UNSIGNED NOT NULL,
  contenido    TEXT NOT NULL,
  calificacion TINYINT UNSIGNED NULL,
  activo       TINYINT(1) NOT NULL DEFAULT 1,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_comentarios_tip
    FOREIGN KEY (tip_id) REFERENCES blog_tips (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_comentarios_producto
    FOREIGN KEY (producto_id) REFERENCES productos (id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_comentarios_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX idx_comentarios_tip (tip_id),
  INDEX idx_comentarios_producto (producto_id),
  INDEX idx_comentarios_tipo (tipo)
) ENGINE=InnoDB;

INSERT INTO blog_tips (titulo, resumen, contenido, imagen_url, etiqueta, orden)
SELECT v.titulo, v.resumen, v.contenido, v.imagen_url, v.etiqueta, v.orden
FROM (
  SELECT 'Base que dura todo el día' AS titulo,
    'Prepara tu piel antes de aplicar base para un acabado impecable.' AS resumen,
    'Limpia e hidrata tu rostro, espera 2 minutos y aplica primer en zona T. Usa poca base y difumina con esponja húmeda. Sella con polvo translúcido solo donde brillas.' AS contenido,
    '/images/cursos/piel-base.jpg' AS imagen_url, 'Piel' AS etiqueta, 1 AS orden
  UNION ALL SELECT 'Labios que no se transfieren',
    'Fija el color de tu labial para que aguante comidas y besos.',
    'Delinea y rellena con labial, pon una servilleta sobre los labios y aplica polvo translúcido. Repite una segunda capa de color. Evita gloss en el centro si usas mascarilla.',
    '/images/cursos/labios.jpg', 'Labios', 2
  UNION ALL SELECT 'Rubor natural en 30 segundos',
    'El truco sonrisa para un flush saludable sin exagerar.',
    'Sonríe y aplica el rubor en el bulbo de las mejillas, difuminando hacia las sienes. Si usas rubor líquido, hazlo antes del polvo. Menos es más: puedes intensificar después.',
    '/images/galeria/look2.jpg', 'Rubor', 3
  UNION ALL SELECT 'Pestañas con más volumen',
    'Riza, capas finas y secado entre cada pasada.',
    'Riza pestañas en la raíz 10 segundos. Aplica pestañina en zigzag de raíz a punta. Deja secar y repite una segunda capa solo en las puntas. Limpia el exceso del cepillo antes de aplicar.',
    '/images/cursos/pestanas.jpg', 'Ojos', 4
  UNION ALL SELECT 'Contorno suave para principiantes',
    'Esculpe sin líneas duras con producto cremoso.',
    'Usa un tono solo dos grados más oscuro que tu piel. Aplica bajo pómulos, mandíbula y nariz. Difumina con brocha o esponja mojada hasta que no se vean bordes. Ilumina arco de cupido y lagrimal.',
    '/images/cursos/contouring.jpg', 'Rostro', 5
) AS v
WHERE NOT EXISTS (SELECT 1 FROM blog_tips bt WHERE bt.titulo = v.titulo);

INSERT INTO contenido_sitio (clave, valor) VALUES
  ('blog_titulo', 'Tips & Comunidad AINÉ'),
  ('blog_subtitulo', 'Aprende gratis, comparte tu experiencia y descubre qué productos ama nuestra comunidad'),
  ('blog_tips_tab', 'Tips gratis'),
  ('blog_exp_tab', 'Experiencias'),
  ('blog_comentar_cta', 'Inicia sesión para comentar y compartir tu experiencia con los productos AINÉ.')
ON DUPLICATE KEY UPDATE valor = VALUES(valor);
