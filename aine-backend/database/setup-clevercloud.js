require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

async function runSqlFile(connection, filePath) {
  const sql = fs.readFileSync(filePath, "utf8");
  await connection.query(sql);
}

async function main() {
  const uri = process.env.MYSQL_ADDON_URI;
  const connection = uri
    ? await mysql.createConnection({ uri, multipleStatements: true })
    : await mysql.createConnection({
        host: process.env.MYSQL_ADDON_HOST,
        port: Number(process.env.MYSQL_ADDON_PORT || 3306),
        user: process.env.MYSQL_ADDON_USER,
        password: process.env.MYSQL_ADDON_PASSWORD,
        database: process.env.MYSQL_ADDON_DB,
        multipleStatements: true,
      });

  const dbDir = path.join(__dirname, "..", "database");

  console.log("Importando tablas...");
  await runSqlFile(connection, path.join(dbDir, "schema.clevercloud.sql"));

  console.log("Importando datos...");
  await runSqlFile(connection, path.join(dbDir, "seed.clevercloud.sql"));

  const migrations = [
    "002_catalogo_ampliado.sql",
    "003_galeria.sql",
    "004_contenido_sitio.sql",
    "005_rutas_imagenes_catalogo.sql",
    "006_fix_pagos_y_cursos.sql",
    "007_blog_comunidad.sql",
    "008_stripe_pagos.sql",
    "009_quitar_nequi_daviplata_bancolombia.sql",
    "010_inscripciones_cursos.sql",
    "011_quienes_somos_texto.sql",
  ];

  for (const file of migrations) {
    console.log(`Aplicando ${file}...`);
    await runSqlFile(connection, path.join(dbDir, "migrations", file));
  }

  const [tables] = await connection.query("SHOW TABLES");
  const [productos] = await connection.query("SELECT COUNT(*) AS total FROM productos");
  const [categorias] = await connection.query("SELECT COUNT(*) AS total FROM categorias");
  const [galeria] = await connection.query("SELECT COUNT(*) AS total FROM galeria");
  const [contenido] = await connection.query("SELECT COUNT(*) AS total FROM contenido_sitio");

  console.log("Tablas:", tables.map((t) => Object.values(t)[0]).join(", "));
  console.log("Productos:", productos[0].total);
  console.log("Categorías:", categorias[0].total);
  console.log("Galería:", galeria[0].total);
  console.log("Contenido sitio:", contenido[0].total);

  await connection.end();
  console.log("Listo: base de datos enlazada a Clever Cloud.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
