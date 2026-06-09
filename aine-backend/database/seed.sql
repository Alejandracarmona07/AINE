-- Datos iniciales para AINÉ (productos del catálogo actual)
USE aine_db;

INSERT INTO categorias (nombre, descripcion) VALUES
  ('Pestañinas', 'Pestañinas de distintas marcas, colores y precios.'),
  ('Bases', 'Bases con buena cobertura: polvo, líquido, barra y más.'),
  ('Rubores', 'Rubor en crema, líquido, barra y polvo para un acabado perfecto.'),
  ('Labiales', 'Labiales mate, gloss e hidratantes para cada ocasión.')
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen_url, stock) VALUES
  ((SELECT id FROM categorias WHERE nombre = 'Bases'), 'Base Hidratante', 'Una base ligera para un acabado natural.', 30000, '/images/catalogo/base.jpg', 50),
  ((SELECT id FROM categorias WHERE nombre = 'Bases'), 'Base liquida', 'Una base ligera para un acabado luminoso.', 48000, '/images/catalogo/base2.jpg', 40),
  ((SELECT id FROM categorias WHERE nombre = 'Bases'), 'Base natural', 'Cobertura ligera.', 34000, '/images/catalogo/base3.jpg', 35),
  ((SELECT id FROM categorias WHERE nombre = 'Bases'), 'Base Hidratante Premium', 'Una base ligera para un acabado natural.', 53000, '/images/catalogo/base4.jpg', 30),
  ((SELECT id FROM categorias WHERE nombre = 'Labiales'), 'Labial en barra', 'Color duradero.', 24000, '/images/catalogo/labial.jpg', 60),
  ((SELECT id FROM categorias WHERE nombre = 'Labiales'), 'Labial', 'Dale mas personalidad a tus labios.', 15000, '/images/catalogo/labial2.jpg', 55),
  ((SELECT id FROM categorias WHERE nombre = 'Labiales'), 'Labial mate', 'Formula suave con un acabado mate.', 20000, '/images/catalogo/labialmate.jpg', 45),
  ((SELECT id FROM categorias WHERE nombre = 'Rubores'), 'Blush', 'Acabado natural.', 25000, '/images/catalogo/Rubor.jpg', 40),
  ((SELECT id FROM categorias WHERE nombre = 'Rubores'), 'Rubor Bonita', 'Ponte mas bonita.', 22000, '/images/catalogo/rubor1.jpg', 38),
  ((SELECT id FROM categorias WHERE nombre = 'Rubores'), 'Rubor liquido', 'Para un acabado mas luminoso.', 18000, '/images/catalogo/rubor2.jpeg', 42),
  ((SELECT id FROM categorias WHERE nombre = 'Rubores'), 'Rubor', 'Efecto natural.', 20000, '/images/catalogo/rubor3.jpg', 36),
  ((SELECT id FROM categorias WHERE nombre = 'Pestañinas'), 'Pestañina Escrespadora', 'Volumen con mas curva.', 42000, '/images/catalogo/pestañina.jpg', 25),
  ((SELECT id FROM categorias WHERE nombre = 'Pestañinas'), 'Pestañas hermosas', 'Volumen extremo sin grumos.', 38000, '/images/catalogo/Pestanina1.jpg', 28),
  ((SELECT id FROM categorias WHERE nombre = 'Pestañinas'), 'Pestañina Maybelline', 'Elevan la belleza natural de tus pestañas.', 54000, '/images/catalogo/pestañina2.jpg', 20);

INSERT INTO cursos (titulo, descripcion, precio, imagen_url) VALUES
  ('Maquillaje básico', 'Aprende técnicas esenciales para el día a día.', 89000, '/images/cursos/maquillaje-basico.jpg'),
  ('Contouring y highlighting', 'Resalta tu belleza con técnicas profesionales.', 120000, '/images/cursos/contouring.jpg'),
  ('Labios perfectos', 'Tips y tendencias para un acabado impecable.', 75000, '/images/cursos/labios.jpg');

INSERT INTO galeria (imagen_url, titulo, orden) VALUES
  ('/images/galeria/look1.jpg', 'Glow natural', 1),
  ('/images/galeria/look2.jpg', 'Rubor fresh', 2),
  ('/images/galeria/look3.jpg', 'Labios intensos', 3),
  ('/images/galeria/look4.jpg', 'Mirada impacto', 4),
  ('/images/catalogo/maquillaje2.jpg', 'Look profesional', 5),
  ('/images/catalogo/maquillaje3.jpg', 'Estilo editorial', 6);

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

INSERT INTO redes_sociales (nombre, url, icono_url, orden) VALUES
  ('Instagram', 'https://www.instagram.com/aleja.duque18?igsh=ZjV3M3oxZnA1aHp3', '/images/social/instagram.png', 1),
  ('Facebook', 'https://www.facebook.com/share/16FZK6FQax/', '/images/social/facebook.png', 2),
  ('WhatsApp', 'https://wa.me/573112599598', '/images/social/whatsapp.png', 3);

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
  ((SELECT id FROM categorias WHERE nombre = 'Bases'), 'Base Full Cover', 'Alta cobertura para eventos especiales.', 62000, '/images/catalogo/base2.jpg', 22),
  ((SELECT id FROM categorias WHERE nombre = 'Bases'), 'Base Serum Glow', 'Acabado radiante con vitamina E.', 45000, '/images/catalogo/base3.jpg', 30),
  ((SELECT id FROM categorias WHERE nombre = 'Bases'), 'Polvo Compacto Satin', 'Fijación ligera todo el día.', 28000, '/images/catalogo/base4.jpg', 45),
  ((SELECT id FROM categorias WHERE nombre = 'Labiales'), 'Labial Gloss Brillo', 'Brillo intenso sin sensación pegajosa.', 18000, '/images/catalogo/labialmate.jpg', 50),
  ((SELECT id FROM categorias WHERE nombre = 'Labiales'), 'Labial Nude Elegance', 'Tonos naturales para oficina y día.', 22000, '/images/catalogo/labial.jpg', 48),
  ((SELECT id FROM categorias WHERE nombre = 'Labiales'), 'Labial Rojo Clásico', 'Rojo intenso de larga duración.', 26000, '/images/catalogo/labial2.jpg', 40),
  ((SELECT id FROM categorias WHERE nombre = 'Labiales'), 'Balsamo Tintado', 'Hidratación con color suave.', 12000, '/images/catalogo/labialmate.jpg', 65),
  ((SELECT id FROM categorias WHERE nombre = 'Rubores'), 'Rubor Polvo Rosé', 'Color buildable para todo tono de piel.', 21000, '/images/catalogo/rubor1.jpg', 35),
  ((SELECT id FROM categorias WHERE nombre = 'Rubores'), 'Rubor Coral Sunset', 'Tono cálido para look veraniego.', 23000, '/images/catalogo/rubor3.jpg', 32),
  ((SELECT id FROM categorias WHERE nombre = 'Rubores'), 'Paleta Rubor + Iluminador', 'Dos acabados en un solo producto.', 35000, '/images/catalogo/Rubor.jpg', 28),
  ((SELECT id FROM categorias WHERE nombre = 'Rubores'), 'Rubor Stick', 'Formato en barra, fácil de aplicar.', 19000, '/images/catalogo/rubor2.jpeg', 38),
  ((SELECT id FROM categorias WHERE nombre = 'Pestañinas'), 'Pestañina Waterproof', 'Resistente al agua y al sudor.', 48000, '/images/catalogo/pestañina2.jpg', 24),
  ((SELECT id FROM categorias WHERE nombre = 'Pestañinas'), 'Pestañina Color Azul', 'Toque de color para looks creativos.', 36000, '/images/catalogo/Pestanina1.jpg', 18),
  ((SELECT id FROM categorias WHERE nombre = 'Pestañinas'), 'Pestañina Natural Fiber', 'Efecto extensiones naturales.', 41000, '/images/catalogo/pestañina.jpg', 26),
  ((SELECT id FROM categorias WHERE nombre = 'Pestañinas'), 'Duo Pestañina + Delineador', 'Kit esencial para la mirada.', 58000, '/images/catalogo/pestañina2.jpg', 15);

INSERT INTO cursos (titulo, descripcion, precio, imagen_url) VALUES
  ('Smoky eyes profundo', 'Domina el ahumado clásico y moderno paso a paso.', 95000, '/images/cursos/smoky-eyes.jpg'),
  ('Maquillaje de novias', 'Piel impecable, ojos y labios para el gran día.', 180000, '/images/cursos/novias.jpg'),
  ('Automaquillaje de día', 'Rutina rápida de 15 minutos para salir lista.', 65000, '/images/cursos/automaquillaje.jpg'),
  ('Contorno avanzado', 'Esculpe rostro, nariz y mandíbula como pro.', 110000, '/images/cursos/contorno.jpg'),
  ('Look de fiesta', 'Brillos, glitter y piel glow para la noche.', 85000, '/images/cursos/fiesta.jpg'),
  ('Piel perfecta + base', 'Preparación, primer y elección de base ideal.', 72000, '/images/cursos/piel-base.jpg'),
  ('Pestañas de impacto', 'Técnicas de rizado, capas y pegado de pestañas.', 68000, '/images/cursos/pestanas.jpg'),
  ('Maquillaje editorial', 'Creatividad, color y tendencias de pasarela.', 140000, '/images/cursos/editorial.jpg');
