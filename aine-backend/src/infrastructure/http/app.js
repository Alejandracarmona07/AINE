const cors = require("cors");
const express = require("express");

function createApp({ checkDatabaseHealth, listProducts, listCourses, listPaymentMethods }) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.json({ name: "aine-backend", status: "running" });
  });

  app.get("/health", async (_req, res) => {
    try {
      const ok = await checkDatabaseHealth.execute();
      res.status(ok ? 200 : 500).json({ ok });
    } catch (err) {
      res.status(500).json({ ok: false, error: "db_health_failed", message: err?.message });
    }
  });

  app.get("/api/productos", async (_req, res) => {
    try {
      const productos = await listProducts.execute();
      res.json({ productos });
    } catch (err) {
      res.status(500).json({ error: "products_fetch_failed", message: err?.message });
    }
  });

  app.get("/api/cursos", async (_req, res) => {
    try {
      const cursos = await listCourses.execute();
      res.json({ cursos });
    } catch (err) {
      res.status(500).json({ error: "courses_fetch_failed", message: err?.message });
    }
  });

  app.get("/api/formas-pago", async (_req, res) => {
    try {
      const formasPago = await listPaymentMethods.execute();
      res.json({ formasPago });
    } catch (err) {
      res.status(500).json({ error: "payment_methods_fetch_failed", message: err?.message });
    }
  });

  return app;
}

module.exports = { createApp };

