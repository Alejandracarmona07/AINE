-- Tablas para Clever Cloud MySQL (usa la BD que ya viene con el addon)
-- No incluye CREATE DATABASE: importar con -D $MYSQL_ADDON_DB

CREATE TABLE IF NOT EXISTS usuarios (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  telefono      VARCHAR(20) NULL,
  rol           ENUM('cliente', 'admin') NOT NULL DEFAULT 'cliente',
  activo        TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categorias (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(80) NOT NULL UNIQUE,
  descripcion TEXT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS productos (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  categoria_id INT UNSIGNED NOT NULL,
  nombre       VARCHAR(150) NOT NULL,
  descripcion  TEXT NULL,
  precio       DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
  imagen_url   VARCHAR(255) NULL,
  stock        INT UNSIGNED NOT NULL DEFAULT 0,
  activo       TINYINT(1) NOT NULL DEFAULT 1,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_productos_categoria
    FOREIGN KEY (categoria_id) REFERENCES categorias (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  INDEX idx_productos_categoria (categoria_id),
  INDEX idx_productos_activo (activo)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cursos (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo      VARCHAR(150) NOT NULL,
  descripcion TEXT NULL,
  precio      DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (precio >= 0),
  imagen_url  VARCHAR(255) NULL,
  activo      TINYINT(1) NOT NULL DEFAULT 1,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pedidos (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT UNSIGNED NOT NULL,
  total      DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  estado     ENUM('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado') NOT NULL DEFAULT 'pendiente',
  notas      TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pedidos_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  INDEX idx_pedidos_usuario (usuario_id),
  INDEX idx_pedidos_estado (estado)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pedido_items (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pedido_id       INT UNSIGNED NOT NULL,
  producto_id     INT UNSIGNED NOT NULL,
  cantidad        INT UNSIGNED NOT NULL DEFAULT 1 CHECK (cantidad > 0),
  precio_unitario DECIMAL(10, 2) NOT NULL CHECK (precio_unitario >= 0),
  CONSTRAINT fk_pedido_items_pedido
    FOREIGN KEY (pedido_id) REFERENCES pedidos (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_pedido_items_producto
    FOREIGN KEY (producto_id) REFERENCES productos (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  INDEX idx_pedido_items_pedido (pedido_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS galeria (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  imagen_url VARCHAR(255) NOT NULL,
  titulo     VARCHAR(120) NOT NULL,
  activo     TINYINT(1) NOT NULL DEFAULT 1,
  orden      INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS formas_pago (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(80) NOT NULL,
  descripcion TEXT NULL,
  icono_url   VARCHAR(255) NULL,
  activo      TINYINT(1) NOT NULL DEFAULT 1,
  orden       INT UNSIGNED NOT NULL DEFAULT 0,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
