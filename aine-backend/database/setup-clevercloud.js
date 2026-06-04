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

  console.log("Aplicando ampliación de catálogo...");
  await runSqlFile(connection, path.join(dbDir, "migrations", "002_catalogo_ampliado.sql"));

  const [tables] = await connection.query("SHOW TABLES");
  const [productos] = await connection.query("SELECT COUNT(*) AS total FROM productos");
  const [categorias] = await connection.query("SELECT COUNT(*) AS total FROM categorias");

  console.log("Tablas:", tables.map((t) => Object.values(t)[0]).join(", "));
  console.log("Productos:", productos[0].total);
  console.log("Categorías:", categorias[0].total);

  await connection.end();
  console.log("Listo: base de datos enlazada a Clever Cloud.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
