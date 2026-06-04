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

  const migration = path.join(__dirname, "migrations", "002_catalogo_ampliado.sql");
  console.log("Aplicando migración 002...");
  await runSqlFile(connection, migration);

  const [productos] = await connection.query("SELECT COUNT(*) AS total FROM productos");
  const [cursos] = await connection.query("SELECT COUNT(*) AS total FROM cursos");
  const [pagos] = await connection.query("SELECT COUNT(*) AS total FROM formas_pago");

  console.log("Productos:", productos[0].total);
  console.log("Cursos:", cursos[0].total);
  console.log("Formas de pago:", pagos[0].total);

  await connection.end();
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
