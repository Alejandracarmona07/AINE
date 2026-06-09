const mysql = require("mysql2/promise");

let cachedPool;

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
  if (cachedPool) return cachedPool;

  const cfg = getMysqlConfigFromEnv(env);
  const isServerless = Boolean(env.VERCEL);

  if (cfg.uri) {
    cachedPool = mysql.createPool({
      uri: cfg.uri,
      waitForConnections: true,
      connectionLimit: isServerless ? 1 : 5,
      maxIdle: isServerless ? 0 : 5,
      idleTimeout: isServerless ? 5_000 : 60_000,
      queueLimit: 0,
      enableKeepAlive: false,
    });
    return cachedPool;
  }

  if (!cfg.host || !cfg.user || !cfg.database) {
    throw new Error(
      "Missing MySQL env vars. Expected MYSQL_ADDON_URI or (MYSQL_ADDON_HOST, MYSQL_ADDON_USER, MYSQL_ADDON_PASSWORD, MYSQL_ADDON_DB).",
    );
  }

  cachedPool = mysql.createPool({
    ...cfg,
    waitForConnections: true,
    connectionLimit: isServerless ? 1 : 5,
    maxIdle: isServerless ? 0 : 5,
    idleTimeout: isServerless ? 5_000 : 60_000,
    queueLimit: 0,
    enableKeepAlive: false,
  });

  return cachedPool;
}

module.exports = { createMysqlPool };
