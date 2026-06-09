-- Ampliación catálogo: formas de pago, más productos y cursos
-- Ejecutar sobre aine_db (XAMPP) o addon Clever Cloud

CREATE TABLE IF NOT EXISTS formas_pago (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(80) NOT NULL,
  descripcion TEXT NULL,
  icono_url   VARCHAR(255) NULL,
  activo      TINYINT(1) NOT NULL DEFAULT 1,
  orden       INT UNSIGNED NOT NULL DEFAULT 0,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO formas_pago (nombre, descripcion, icono_url, orden)
SELECT v.nombre, v.descripcion, v.icono_url, v.orden
FROM (
  SELECT 'PSE' AS nombre, 'Débito desde tu banco en línea.' AS descripcion, '/images/pagos/pse.svg' AS icono_url, 1 AS orden
  UNION ALL SELECT 'Tarjeta', 'Crédito o débito Visa / Mastercard.', '/images/pagos/tarjeta.svg', 2
  UNION ALL SELECT 'Efectivo', 'Pago contra entrega en Medellín y área metropolitana.', '/images/pagos/efectivo.svg', 3
  UNION ALL SELECT 'WhatsApp', 'Coordina tu pedido y pago por chat.', '/images/pagos/whatsapp.svg', 4
) AS v
WHERE NOT EXISTS (SELECT 1 FROM formas_pago fp WHERE fp.nombre = v.nombre);

INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen_url, stock)
SELECT c.id, v.nombre, v.descripcion, v.precio, v.imagen_url, v.stock
FROM (
  SELECT 'Bases' AS cat, 'Base Full Cover' AS nombre, 'Alta cobertura para eventos especiales.' AS descripcion, 62000 AS precio, '/images/base2.jpg' AS imagen_url, 22 AS stock
  UNION ALL SELECT 'Bases', 'Base Serum Glow', 'Acabado radiante con vitamina E.', 45000, '/images/base3.jpg', 30
  UNION ALL SELECT 'Bases', 'Polvo Compacto Satin', 'Fijación ligera todo el día.', 28000, '/images/base4.jpg', 45
  UNION ALL SELECT 'Labiales', 'Labial Gloss Brillo', 'Brillo intenso sin sensación pegajosa.', 18000, '/images/labialmate.jpg', 50
  UNION ALL SELECT 'Labiales', 'Labial Nude Elegance', 'Tonos naturales para oficina y día.', 22000, '/images/labial.jpg', 48
  UNION ALL SELECT 'Labiales', 'Labial Rojo Clásico', 'Rojo intenso de larga duración.', 26000, '/images/labial2.jpg', 40
  UNION ALL SELECT 'Labiales', 'Balsamo Tintado', 'Hidratación con color suave.', 12000, '/images/labialmate.jpg', 65
  UNION ALL SELECT 'Rubores', 'Rubor Polvo Rosé', 'Color buildable para todo tono de piel.', 21000, '/images/rubor1.jpg', 35
  UNION ALL SELECT 'Rubores', 'Rubor Coral Sunset', 'Tono cálido para look veraniego.', 23000, '/images/rubor3.jpg', 32
  UNION ALL SELECT 'Rubores', 'Paleta Rubor + Iluminador', 'Dos acabados en un solo producto.', 35000, '/images/Rubor.jpg', 28
  UNION ALL SELECT 'Rubores', 'Rubor Stick', 'Formato en barra, fácil de aplicar.', 19000, '/images/rubor2.jpeg', 38
  UNION ALL SELECT 'Pestañinas', 'Pestañina Waterproof', 'Resistente al agua y al sudor.', 48000, '/images/pestañina2.jpg', 24
  UNION ALL SELECT 'Pestañinas', 'Pestañina Color Azul', 'Toque de color para looks creativos.', 36000, '/images/Pestanina1.jpg', 18
  UNION ALL SELECT 'Pestañinas', 'Pestañina Natural Fiber', 'Efecto extensiones naturales.', 41000, '/images/pestañina.jpg', 26
  UNION ALL SELECT 'Pestañinas', 'Duo Pestañina + Delineador', 'Kit esencial para la mirada.', 58000, '/images/pestañina2.jpg', 15
) AS v
INNER JOIN categorias c ON c.nombre = v.cat
WHERE NOT EXISTS (SELECT 1 FROM productos p WHERE p.nombre = v.nombre AND p.categoria_id = c.id);

INSERT INTO cursos (titulo, descripcion, precio, imagen_url)
SELECT v.titulo, v.descripcion, v.precio, v.imagen_url
FROM (
  SELECT 'Smoky eyes profundo' AS titulo, 'Domina el ahumado clásico y moderno paso a paso.' AS descripcion, 95000 AS precio, '/images/cursos/smoky-eyes.jpg' AS imagen_url
  UNION ALL SELECT 'Maquillaje de novias', 'Piel impecable, ojos y labios para el gran día.', 180000, '/images/cursos/novias.jpg'
  UNION ALL SELECT 'Automaquillaje de día', 'Rutina rápida de 15 minutos para salir lista.', 65000, '/images/cursos/automaquillaje.jpg'
  UNION ALL SELECT 'Contorno avanzado', 'Esculpe rostro, nariz y mandíbula como pro.', 110000, '/images/cursos/contorno.jpg'
  UNION ALL SELECT 'Look de fiesta', 'Brillos, glitter y piel glow para la noche.', 85000, '/images/cursos/fiesta.jpg'
  UNION ALL SELECT 'Piel perfecta + base', 'Preparación, primer y elección de base ideal.', 72000, '/images/cursos/piel-base.jpg'
  UNION ALL SELECT 'Pestañas de impacto', 'Técnicas de rizado, capas y pegado de pestañas.', 68000, '/images/cursos/pestanas.jpg'
  UNION ALL SELECT 'Maquillaje editorial', 'Creatividad, color y tendencias de pasarela.', 140000, '/images/cursos/editorial.jpg'
) AS v
WHERE NOT EXISTS (SELECT 1 FROM cursos c WHERE c.titulo = v.titulo);
