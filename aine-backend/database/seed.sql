-- Datos iniciales para AINÉ (productos del catálogo actual)
USE aine_db;

INSERT INTO categorias (nombre, descripcion) VALUES
  ('Pestañinas', 'Pestañinas de distintas marcas, colores y precios.'),
  ('Bases', 'Bases con buena cobertura: polvo, líquido, barra y más.'),
  ('Rubores', 'Rubor en crema, líquido, barra y polvo para un acabado perfecto.'),
  ('Labiales', 'Labiales mate, gloss e hidratantes para cada ocasión.')
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen_url, stock) VALUES
  ((SELECT id FROM categorias WHERE nombre = 'Bases'), 'Base Hidratante', 'Una base ligera para un acabado natural.', 30000, '/images/base.jpg', 50),
  ((SELECT id FROM categorias WHERE nombre = 'Bases'), 'Base liquida', 'Una base ligera para un acabado luminoso.', 48000, '/images/base2.jpg', 40),
  ((SELECT id FROM categorias WHERE nombre = 'Bases'), 'Base natural', 'Cobertura ligera.', 34000, '/images/base3.jpg', 35),
  ((SELECT id FROM categorias WHERE nombre = 'Bases'), 'Base Hidratante Premium', 'Una base ligera para un acabado natural.', 53000, '/images/base4.jpg', 30),
  ((SELECT id FROM categorias WHERE nombre = 'Labiales'), 'Labial en barra', 'Color duradero.', 24000, '/images/labial.jpg', 60),
  ((SELECT id FROM categorias WHERE nombre = 'Labiales'), 'Labial', 'Dale mas personalidad a tus labios.', 15000, '/images/labial2.jpg', 55),
  ((SELECT id FROM categorias WHERE nombre = 'Labiales'), 'Labial mate', 'Formula suave con un acabado mate.', 20000, '/images/labialmate.jpg', 45),
  ((SELECT id FROM categorias WHERE nombre = 'Rubores'), 'Blush', 'Acabado natural.', 25000, '/images/Rubor.jpg', 40),
  ((SELECT id FROM categorias WHERE nombre = 'Rubores'), 'Rubor Bonita', 'Ponte mas bonita.', 22000, '/images/rubor1.jpg', 38),
  ((SELECT id FROM categorias WHERE nombre = 'Rubores'), 'Rubor liquido', 'Para un acabado mas luminoso.', 18000, '/images/rubor2.jpeg', 42),
  ((SELECT id FROM categorias WHERE nombre = 'Rubores'), 'Rubor', 'Efecto natural.', 20000, '/images/rubor3.jpg', 36),
  ((SELECT id FROM categorias WHERE nombre = 'Pestañinas'), 'Pestañina Escrespadora', 'Volumen con mas curva.', 42000, '/images/pestañina.jpg', 25),
  ((SELECT id FROM categorias WHERE nombre = 'Pestañinas'), 'Pestañas hermosas', 'Volumen extremo sin grumos.', 38000, '/images/Pestanina1.jpg', 28),
  ((SELECT id FROM categorias WHERE nombre = 'Pestañinas'), 'Pestañina Maybelline', 'Elevan la belleza natural de tus pestañas.', 54000, '/images/pestañina2.jpg', 20);

INSERT INTO cursos (titulo, descripcion, precio, imagen_url) VALUES
  ('Maquillaje básico', 'Aprende técnicas esenciales para el día a día.', 89000, '/images/cursos/maquillaje-basico.jpg'),
  ('Contouring y highlighting', 'Resalta tu belleza con técnicas profesionales.', 120000, '/images/cursos/contouring.jpg'),
  ('Labios perfectos', 'Tips y tendencias para un acabado impecable.', 75000, '/images/cursos/labios.jpg');

INSERT INTO formas_pago (nombre, descripcion, icono_url, orden) VALUES
  ('Nequi', 'Paga al instante con tu celular.', '/images/pagos/nequi.svg', 1),
  ('Daviplata', 'Transferencia rápida desde Daviplata.', '/images/pagos/daviplata.svg', 2),
  ('Bancolombia', 'Transferencia a cuenta de ahorros o corriente.', '/images/pagos/bancolombia.svg', 3),
  ('PSE', 'Débito desde tu banco en línea.', '/images/pagos/pse.svg', 4),
  ('Tarjeta', 'Crédito o débito Visa / Mastercard.', '/images/pagos/tarjeta.svg', 5),
  ('Efectivo', 'Pago contra entrega en Medellín y área metropolitana.', '/images/pagos/efectivo.svg', 6),
  ('WhatsApp', 'Coordina tu pedido y pago por chat.', '/images/pagos/whatsapp.svg', 7);

-- Catálogo ampliado
INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen_url, stock) VALUES
  ((SELECT id FROM categorias WHERE nombre = 'Bases'), 'Base Full Cover', 'Alta cobertura para eventos especiales.', 62000, '/images/base2.jpg', 22),
  ((SELECT id FROM categorias WHERE nombre = 'Bases'), 'Base Serum Glow', 'Acabado radiante con vitamina E.', 45000, '/images/base3.jpg', 30),
  ((SELECT id FROM categorias WHERE nombre = 'Bases'), 'Polvo Compacto Satin', 'Fijación ligera todo el día.', 28000, '/images/base4.jpg', 45),
  ((SELECT id FROM categorias WHERE nombre = 'Labiales'), 'Labial Gloss Brillo', 'Brillo intenso sin sensación pegajosa.', 18000, '/images/labialmate.jpg', 50),
  ((SELECT id FROM categorias WHERE nombre = 'Labiales'), 'Labial Nude Elegance', 'Tonos naturales para oficina y día.', 22000, '/images/labial.jpg', 48),
  ((SELECT id FROM categorias WHERE nombre = 'Labiales'), 'Labial Rojo Clásico', 'Rojo intenso de larga duración.', 26000, '/images/labial2.jpg', 40),
  ((SELECT id FROM categorias WHERE nombre = 'Labiales'), 'Balsamo Tintado', 'Hidratación con color suave.', 12000, '/images/labialmate.jpg', 65),
  ((SELECT id FROM categorias WHERE nombre = 'Rubores'), 'Rubor Polvo Rosé', 'Color buildable para todo tono de piel.', 21000, '/images/rubor1.jpg', 35),
  ((SELECT id FROM categorias WHERE nombre = 'Rubores'), 'Rubor Coral Sunset', 'Tono cálido para look veraniego.', 23000, '/images/rubor3.jpg', 32),
  ((SELECT id FROM categorias WHERE nombre = 'Rubores'), 'Paleta Rubor + Iluminador', 'Dos acabados en un solo producto.', 35000, '/images/Rubor.jpg', 28),
  ((SELECT id FROM categorias WHERE nombre = 'Rubores'), 'Rubor Stick', 'Formato en barra, fácil de aplicar.', 19000, '/images/rubor2.jpeg', 38),
  ((SELECT id FROM categorias WHERE nombre = 'Pestañinas'), 'Pestañina Waterproof', 'Resistente al agua y al sudor.', 48000, '/images/pestañina2.jpg', 24),
  ((SELECT id FROM categorias WHERE nombre = 'Pestañinas'), 'Pestañina Color Azul', 'Toque de color para looks creativos.', 36000, '/images/Pestanina1.jpg', 18),
  ((SELECT id FROM categorias WHERE nombre = 'Pestañinas'), 'Pestañina Natural Fiber', 'Efecto extensiones naturales.', 41000, '/images/pestañina.jpg', 26),
  ((SELECT id FROM categorias WHERE nombre = 'Pestañinas'), 'Duo Pestañina + Delineador', 'Kit esencial para la mirada.', 58000, '/images/pestañina2.jpg', 15);

INSERT INTO cursos (titulo, descripcion, precio, imagen_url) VALUES
  ('Smoky eyes profundo', 'Domina el ahumado clásico y moderno paso a paso.', 95000, '/images/cursos/smoky-eyes.jpg'),
  ('Maquillaje de novias', 'Piel impecable, ojos y labios para el gran día.', 180000, '/images/cursos/novias.jpg'),
  ('Automaquillaje de día', 'Rutina rápida de 15 minutos para salir lista.', 65000, '/images/cursos/automaquillaje.jpg'),
  ('Contorno avanzado', 'Esculpe rostro, nariz y mandíbula como pro.', 110000, '/images/cursos/contorno.jpg'),
  ('Look de fiesta', 'Brillos, glitter y piel glow para la noche.', 85000, '/images/cursos/fiesta.jpg'),
  ('Piel perfecta + base', 'Preparación, primer y elección de base ideal.', 72000, '/images/cursos/piel-base.jpg'),
  ('Pestañas de impacto', 'Técnicas de rizado, capas y pegado de pestañas.', 68000, '/images/cursos/pestanas.jpg'),
  ('Maquillaje editorial', 'Creatividad, color y tendencias de pasarela.', 140000, '/images/cursos/editorial.jpg');
