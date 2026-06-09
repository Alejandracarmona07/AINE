-- Integración Stripe Checkout

SET @col_es_stripe = (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'formas_pago'
    AND column_name = 'es_stripe'
);

SET @sql_es_stripe = IF(
  @col_es_stripe = 0,
  'ALTER TABLE formas_pago ADD COLUMN es_stripe TINYINT(1) NOT NULL DEFAULT 0',
  'SELECT 1'
);

PREPARE stmt_es_stripe FROM @sql_es_stripe;
EXECUTE stmt_es_stripe;
DEALLOCATE PREPARE stmt_es_stripe;

UPDATE formas_pago SET es_stripe = 1 WHERE nombre IN ('Tarjeta', 'PSE');

CREATE TABLE IF NOT EXISTS pagos_stripe (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  stripe_session_id VARCHAR(255) NOT NULL UNIQUE,
  stripe_payment_id VARCHAR(255) NULL,
  usuario_id        INT UNSIGNED NULL,
  email             VARCHAR(150) NULL,
  total             DECIMAL(12, 2) NOT NULL,
  moneda            VARCHAR(3) NOT NULL DEFAULT 'cop',
  estado            ENUM('pendiente', 'completado', 'expirado', 'fallido') NOT NULL DEFAULT 'pendiente',
  items_json        JSON NOT NULL,
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pagos_stripe_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_pagos_stripe_estado (estado)
) ENGINE=InnoDB;

INSERT INTO contenido_sitio (clave, valor) VALUES
  ('pagos_stripe_titulo', 'Pago en línea seguro'),
  ('pagos_stripe_subtitulo', 'Tarjeta y PSE procesados por Stripe con cifrado de extremo a extremo.'),
  ('pagos_manual_titulo', 'Otros medios de pago'),
  ('pagos_manual_subtitulo', 'Coordina Nequi, Daviplata, transferencia o efectivo por WhatsApp.')
ON DUPLICATE KEY UPDATE valor = VALUES(valor);
