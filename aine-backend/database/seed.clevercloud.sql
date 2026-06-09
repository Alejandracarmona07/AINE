-- Datos iniciales (Clever Cloud: importar con -D $MYSQL_ADDON_DB)

INSERT INTO categorias (nombre, descripcion) VALUES
  ('Pestañinas', 'Pestañinas de distintas marcas, colores y precios.'),
  ('Bases', 'Bases con buena cobertura: polvo, líquido, barra y más.'),
  ('Rubores', 'Rubor en crema, líquido, barra y polvo para un acabado perfecto.'),
  ('Labiales', 'Labiales mate, gloss e hidratantes para cada ocasión.')
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion);

INSERT INTO productos (categoria_id, nombre, descripcion, precio, imagen_url, stock)
SELECT c.id, v.nombre, v.descripcion, v.precio, v.imagen_url, v.stock
FROM (
  SELECT 'Bases' AS cat, 'Base Hidratante' AS nombre, 'Una base ligera para un acabado natural.' AS descripcion, 30000 AS precio, '/images/base.jpg' AS imagen_url, 50 AS stock
  UNION ALL SELECT 'Bases', 'Base liquida', 'Una base ligera para un acabado luminoso.', 48000, '/images/base2.jpg', 40
  UNION ALL SELECT 'Bases', 'Base natural', 'Cobertura ligera.', 34000, '/images/base3.jpg', 35
  UNION ALL SELECT 'Bases', 'Base Hidratante Premium', 'Una base ligera para un acabado natural.', 53000, '/images/base4.jpg', 30
  UNION ALL SELECT 'Labiales', 'Labial en barra', 'Color duradero.', 24000, '/images/labial.jpg', 60
  UNION ALL SELECT 'Labiales', 'Labial', 'Dale mas personalidad a tus labios.', 15000, '/images/labial2.jpg', 55
  UNION ALL SELECT 'Labiales', 'Labial mate', 'Formula suave con un acabado mate.', 20000, '/images/labialmate.jpg', 45
  UNION ALL SELECT 'Rubores', 'Blush', 'Acabado natural.', 25000, '/images/Rubor.jpg', 40
  UNION ALL SELECT 'Rubores', 'Rubor Bonita', 'Ponte mas bonita.', 22000, '/images/rubor1.jpg', 38
  UNION ALL SELECT 'Rubores', 'Rubor liquido', 'Para un acabado mas luminoso.', 18000, '/images/rubor2.jpeg', 42
  UNION ALL SELECT 'Rubores', 'Rubor', 'Efecto natural.', 20000, '/images/rubor3.jpg', 36
  UNION ALL SELECT 'Pestañinas', 'Pestañina Escrespadora', 'Volumen con mas curva.', 42000, '/images/pestañina.jpg', 25
  UNION ALL SELECT 'Pestañinas', 'Pestañas hermosas', 'Volumen extremo sin grumos.', 38000, '/images/Pestanina1.jpg', 28
  UNION ALL SELECT 'Pestañinas', 'Pestañina Maybelline', 'Elevan la belleza natural de tus pestañas.', 54000, '/images/pestañina2.jpg', 20
) AS v
INNER JOIN categorias c ON c.nombre = v.cat
WHERE NOT EXISTS (SELECT 1 FROM productos p WHERE p.nombre = v.nombre AND p.categoria_id = c.id);

INSERT INTO cursos (titulo, descripcion, precio, imagen_url)
SELECT v.titulo, v.descripcion, v.precio, v.imagen_url
FROM (
  SELECT 'Maquillaje básico' AS titulo, 'Aprende técnicas esenciales para el día a día.' AS descripcion, 89000 AS precio, '/images/cursos/maquillaje-basico.jpg' AS imagen_url
  UNION ALL SELECT 'Contouring y highlighting', 'Resalta tu belleza con técnicas profesionales.', 120000, '/images/cursos/contouring.jpg'
  UNION ALL SELECT 'Labios perfectos', 'Tips y tendencias para un acabado impecable.', 75000, '/images/cursos/labios.jpg'
) AS v
WHERE NOT EXISTS (SELECT 1 FROM cursos c WHERE c.titulo = v.titulo);
