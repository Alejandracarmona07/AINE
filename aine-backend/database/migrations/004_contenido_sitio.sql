-- Contenido editable del sitio y redes sociales
CREATE TABLE IF NOT EXISTS contenido_sitio (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  clave      VARCHAR(80) NOT NULL UNIQUE,
  valor      TEXT NOT NULL,
  activo     TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS redes_sociales (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(50) NOT NULL,
  url        VARCHAR(255) NOT NULL,
  icono_url  VARCHAR(255) NULL,
  orden      INT UNSIGNED NOT NULL DEFAULT 0,
  activo     TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO contenido_sitio (clave, valor) VALUES
  ('banner_tag', 'Belleza · Maquillaje · Cursos'),
  ('banner_titulo', 'Consiente tu piel con AINÉ'),
  ('banner_btn', 'Ver catálogo'),
  ('quienes_somos_titulo', '¿Quiénes somos?'),
  ('quienes_somos_texto', 'En nuestra tienda virtual contamos con variedad, precios especiales, productos nacionales e internacionales. Tenemos maquillaje para todos los gustos y necesidades. ¡Consiéntete!'),
  ('galeria_titulo', 'Inspiración & looks'),
  ('galeria_subtitulo', 'Descubre combinaciones y tendencias de nuestra comunidad AINÉ'),
  ('cursos_titulo', 'Aprende Maquillaje con AINÉ'),
  ('cursos_subtitulo', 'Descubre técnicas, tendencias y tips para resaltar tu belleza como toda una diosa'),
  ('pagos_titulo', 'Formas de pago'),
  ('pagos_subtitulo', 'Elige la opción que más te convenga. Pagos seguros y confirmación rápida.'),
  ('pagos_nota', '¿Dudas con tu pago? Escríbenos por WhatsApp y te ayudamos al instante.'),
  ('footer_titulo', 'Contáctanos'),
  ('footer_whatsapp_texto', '311 259 9598'),
  ('footer_whatsapp_url', 'https://wa.me/573112599598'),
  ('footer_copy', '© AINÉ — Maquillaje, belleza y cursos'),
  ('contacto_whatsapp', '573112599598')
ON DUPLICATE KEY UPDATE valor = VALUES(valor);

INSERT INTO redes_sociales (nombre, url, icono_url, orden)
SELECT * FROM (
  SELECT 'Instagram' AS nombre, 'https://www.instagram.com/aleja.duque18?igsh=ZjV3M3oxZnA1aHp3' AS url, '/images/social/instagram.png' AS icono_url, 1 AS orden
  UNION ALL SELECT 'Facebook', 'https://www.facebook.com/share/16FZK6FQax/', '/images/social/facebook.png', 2
  UNION ALL SELECT 'WhatsApp', 'https://wa.me/573112599598', '/images/social/whatsapp.png', 3
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM redes_sociales LIMIT 1);
