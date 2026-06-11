require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

const MIGRATIONS = [
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

async function createConnection() {
  const uri = process.env.MYSQL_ADDON_URI;
  if (uri) {
    return mysql.createConnection({ uri, multipleStatements: true });
  }

  return mysql.createConnection({
    host: process.env.MYSQL_ADDON_HOST,
    port: Number(process.env.MYSQL_ADDON_PORT || 3306),
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB,
    multipleStatements: true,
  });
}

async function runSqlFile(connection, filePath) {
  const sql = fs.readFileSync(filePath, "utf8");
  await connection.query(sql);
}

async function connectWithRetry(maxAttempts = 12, delayMs = 5000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await createConnection();
    } catch (err) {
      const isConnLimit = /max_user_connections/i.test(err.message);
      if (!isConnLimit || attempt === maxAttempts) throw err;
      console.log(
        `Conexiones ocupadas (${attempt}/${maxAttempts}). Reintento en ${delayMs / 1000}s...`,
      );
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

async function main() {
  const connection = await connectWithRetry();
  const migrationsDir = path.join(__dirname, "migrations");

  for (const file of MIGRATIONS) {
    const filePath = path.join(migrationsDir, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`No se encontró la migración: ${file}`);
    }
    console.log(`Aplicando ${file}...`);
    await runSqlFile(connection, filePath);
    console.log(`OK: ${file}`);
  }

  const tables = [
    "categorias",
    "productos",
    "cursos",
    "formas_pago",
    "galeria",
    "contenido_sitio",
    "redes_sociales",
    "usuarios",
    "blog_tips",
    "comunidad_comentarios",
    "pagos_stripe",
    "curso_fechas",
    "inscripciones_cursos",
  ];

  console.log("\nResumen Clever Cloud:");
  for (const table of tables) {
    try {
      const [rows] = await connection.query(`SELECT COUNT(*) AS total FROM ${table}`);
      console.log(`- ${table}: ${rows[0].total} registros`);
    } catch (err) {
      console.log(`- ${table}: no existe (${err.message})`);
    }
  }

  await connection.end();
  console.log("\nMigraciones aplicadas correctamente.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
