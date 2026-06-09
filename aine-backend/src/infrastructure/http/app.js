const cors = require("cors");
const express = require("express");

function createApp({
  checkDatabaseHealth,
  listProducts,
  listCourses,
  listPaymentMethods,
  listCategories,
  listGallery,
  getCatalog,
  registerUser,
  loginUser,
  listBlogTips,
  listCommunityComments,
  createCommunityComment,
  createStripeCheckout,
  handleStripeWebhook,
  getStripePaymentStatus,
  stripePublishableKey,
}) {
  const app = express();

  app.use(cors());

  app.post(
    "/api/pagos/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      try {
        const result = await handleStripeWebhook.execute({
          rawBody: req.body,
          signature: req.headers["stripe-signature"],
        });
        res.json(result);
      } catch (err) {
        const status = err.code === "stripe_not_configured" ? 503 : 400;
        res.status(status).json({ error: err.code ?? "webhook_failed", message: err?.message });
      }
    },
  );

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

  app.get("/api/catalogo", async (_req, res) => {
    try {
      const catalogo = await getCatalog.execute();
      res.json(catalogo);
    } catch (err) {
      res.status(500).json({ error: "catalog_fetch_failed", message: err?.message });
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

  app.get("/api/categorias", async (_req, res) => {
    try {
      const categorias = await listCategories.execute();
      res.json({ categorias });
    } catch (err) {
      res.status(500).json({ error: "categories_fetch_failed", message: err?.message });
    }
  });

  app.get("/api/galeria", async (_req, res) => {
    try {
      const galeria = await listGallery.execute();
      res.json({ galeria });
    } catch (err) {
      res.status(500).json({ error: "gallery_fetch_failed", message: err?.message });
    }
  });

  app.post("/api/auth/registro", async (req, res) => {
    try {
      const usuario = await registerUser.execute(req.body ?? {});
      res.status(201).json({ usuario });
    } catch (err) {
      const status =
        err.code === "validation_error" ? 400 : err.code === "email_taken" ? 409 : 500;
      res.status(status).json({ error: err.code ?? "register_failed", message: err?.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const usuario = await loginUser.execute(req.body ?? {});
      res.json({ usuario });
    } catch (err) {
      const status = err.code === "validation_error" || err.code === "invalid_credentials" ? 401 : 500;
      res.status(status).json({ error: err.code ?? "login_failed", message: err?.message });
    }
  });

  app.get("/api/blog/tips", async (_req, res) => {
    try {
      const tips = await listBlogTips.execute();
      res.json({ tips });
    } catch (err) {
      res.status(500).json({ error: "blog_tips_fetch_failed", message: err?.message });
    }
  });

  app.get("/api/blog/comentarios", async (req, res) => {
    try {
      const tipo = req.query.tipo;
      const tipId = req.query.tipId ? Number(req.query.tipId) : undefined;
      const productoId = req.query.productoId ? Number(req.query.productoId) : undefined;
      const comentarios = await listCommunityComments.execute({ tipo, tipId, productoId });
      res.json({ comentarios });
    } catch (err) {
      res.status(500).json({ error: "blog_comments_fetch_failed", message: err?.message });
    }
  });

  app.post("/api/blog/comentarios", async (req, res) => {
    try {
      const comentario = await createCommunityComment.execute(req.body ?? {});
      res.status(201).json({ comentario });
    } catch (err) {
      const status =
        err.code === "validation_error" ? 400 : err.code === "auth_required" ? 401 : 500;
      res.status(status).json({ error: err.code ?? "comment_create_failed", message: err?.message });
    }
  });

  app.get("/api/pagos/config", (_req, res) => {
    res.json({
      stripeEnabled: Boolean(stripePublishableKey),
      publishableKey: stripePublishableKey ?? null,
    });
  });

  app.post("/api/pagos/checkout", async (req, res) => {
    try {
      const { items, email, usuarioId } = req.body ?? {};
      const checkout = await createStripeCheckout.execute({ items, email, usuarioId });
      res.json(checkout);
    } catch (err) {
      const status =
        err.code === "validation_error"
          ? 400
          : err.code === "stripe_not_configured"
            ? 503
            : 500;
      res.status(status).json({ error: err.code ?? "checkout_failed", message: err?.message });
    }
  });

  app.get("/api/pagos/estado/:sessionId", async (req, res) => {
    try {
      const pago = await getStripePaymentStatus.execute({ sessionId: req.params.sessionId });
      res.json({ pago });
    } catch (err) {
      const status = err.code === "not_found" ? 404 : err.code === "validation_error" ? 400 : 500;
      res.status(status).json({ error: err.code ?? "payment_status_failed", message: err?.message });
    }
  });

  return app;
}

module.exports = { createApp };

