const mysql = require("mysql2/promise");

function getMysqlConfigFromEnv(env) {
  if (env.MYSQL_ADDON_URI) return { uri: env.MYSQL_ADDON_URI };

  return {
    host: env.MYSQL_ADDON_HOST,
    port: env.MYSQL_ADDON_PORT ? Number(env.MYSQL_ADDON_PORT) : 3306,
    user: env.MYSQL_ADDON_USER,
    password: env.MYSQL_ADDON_PASSWORD,
    database: env.MYSQL_ADDON_DB,
  };
}

function createMysqlPool(env = process.env) {
  const cfg = getMysqlConfigFromEnv(env);

  if (cfg.uri) return mysql.createPool(cfg.uri);

  if (!cfg.host || !cfg.user || !cfg.database) {
    throw new Error(
      "Missing MySQL env vars. Expected MYSQL_ADDON_URI or (MYSQL_ADDON_HOST, MYSQL_ADDON_USER, MYSQL_ADDON_PASSWORD, MYSQL_ADDON_DB).",
    );
  }

  const isServerless = Boolean(env.VERCEL);

  return mysql.createPool({
    ...cfg,
    waitForConnections: true,
    connectionLimit: isServerless ? 1 : 10,
    queueLimit: 0,
    idleTimeout: isServerless ? 10_000 : 60_000,
  });
}

module.exports = { createMysqlPool };

