-- Elimina Nequi, Daviplata y Bancolombia; conserva PSE, Tarjeta, Efectivo y WhatsApp

DELETE FROM formas_pago WHERE nombre IN ('Nequi', 'Daviplata', 'Bancolombia');

UPDATE contenido_sitio
SET valor = 'Coordina efectivo o tu pedido por WhatsApp.'
WHERE clave = 'pagos_manual_subtitulo';
