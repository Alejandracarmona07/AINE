class CreateStripeCheckout {
  /**
   * @param {{
   *   stripe: import('stripe').Stripe | null,
   *   stripePaymentRepository: import('../../infrastructure/mysql/MysqlStripePaymentRepository'),
   *   frontendUrl: string
   * }} deps
   */
  constructor({ stripe, stripePaymentRepository, frontendUrl }) {
    this.stripe = stripe;
    this.stripePaymentRepository = stripePaymentRepository;
    this.frontendUrl = (frontendUrl ?? "http://localhost:5173").replace(/\/$/, "");
  }

  async execute({ items, email, usuarioId }) {
    if (!this.stripe) {
      const err = new Error("Stripe no está configurado. Añade STRIPE_SECRET_KEY al backend.");
      err.code = "stripe_not_configured";
      throw err;
    }

    if (!Array.isArray(items) || items.length === 0) {
      const err = new Error("el carrito está vacío");
      err.code = "validation_error";
      throw err;
    }

    const lineItems = [];
    let total = 0;

    for (const item of items) {
      const nombre = item.nombre?.trim();
      const precio = Number(item.precio);
      const cantidad = Math.max(1, Number(item.cantidad) || 1);

      if (!nombre || !Number.isFinite(precio) || precio <= 0) {
        const err = new Error("hay artículos inválidos en el carrito");
        err.code = "validation_error";
        throw err;
      }

      total += precio * cantidad;
      lineItems.push({
        price_data: {
          currency: "cop",
          unit_amount: Math.round(precio * 100),
          product_data: {
            name: nombre.slice(0, 120),
            description: item.tipo === "curso" ? "Curso AINÉ" : "Producto AINÉ",
          },
        },
        quantity: cantidad,
      });
    }

    const customerEmail = email?.trim() || undefined;

    const session = await this.stripe.checkout.sessions.create({
      mode: "payment",
      currency: "cop",
      line_items: lineItems,
      success_url: `${this.frontendUrl}/?pago=exitoso&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.frontendUrl}/?pago=cancelado`,
      customer_email: customerEmail,
      locale: "es",
      metadata: {
        usuarioId: usuarioId ? String(usuarioId) : "",
      },
      payment_intent_data: {
        metadata: {
          origen: "aine-tienda",
        },
      },
    });

    await this.stripePaymentRepository.createPending({
      sessionId: session.id,
      usuarioId: usuarioId ?? null,
      email: customerEmail ?? null,
      total,
      items,
    });

    return { url: session.url, sessionId: session.id };
  }
}

module.exports = { CreateStripeCheckout };
