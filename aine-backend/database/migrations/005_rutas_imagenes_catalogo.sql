-- Las imágenes de productos viven en public/images/catalogo/
-- La BD guarda la RUTA (no el archivo binario)

UPDATE productos
SET imagen_url = CONCAT('/images/catalogo/', SUBSTRING(imagen_url, 9))
WHERE imagen_url LIKE '/images/%'
  AND imagen_url NOT LIKE '/images/cursos/%'
  AND imagen_url NOT LIKE '/images/pagos/%'
  AND imagen_url NOT LIKE '/images/galeria/%'
  AND imagen_url NOT LIKE '/images/social/%'
  AND imagen_url NOT LIKE '/images/catalogo/%';

UPDATE galeria
SET imagen_url = CONCAT('/images/catalogo/', SUBSTRING(imagen_url, 9))
WHERE imagen_url IN ('/images/maquillaje2.jpg', '/images/maquillaje3.jpg');
