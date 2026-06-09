-- Corrige formas de pago duplicadas y rutas de imágenes de cursos

DELETE fp1
FROM formas_pago fp1
INNER JOIN formas_pago fp2 ON fp1.nombre = fp2.nombre AND fp1.id > fp2.id;

UPDATE cursos SET imagen_url = '/images/cursos/maquillaje-basico.jpg'
WHERE titulo = 'Maquillaje básico' OR imagen_url = '/images/maquillaje.jpg';

UPDATE cursos SET imagen_url = '/images/cursos/contouring.jpg'
WHERE titulo = 'Contouring y highlighting' OR imagen_url = '/images/maquillaje2.jpg';

UPDATE cursos SET imagen_url = '/images/cursos/labios.jpg'
WHERE titulo = 'Labios perfectos' OR imagen_url = '/images/maquillaje3.jpg';

SET @idx_exists = (
  SELECT COUNT(*)
  FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = 'formas_pago'
    AND index_name = 'uk_formas_pago_nombre'
);

SET @sql = IF(
  @idx_exists = 0,
  'ALTER TABLE formas_pago ADD UNIQUE KEY uk_formas_pago_nombre (nombre)',
  'SELECT 1'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
