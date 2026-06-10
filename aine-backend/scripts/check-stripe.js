require("dotenv").config();
require("dotenv").config({ path: ".env.local", override: true });

const { readStripeEnv } = require("../src/config/stripeEnv");
const { createStripeClient } = require("../src/infrastructure/stripe/createStripeClient");

async function main() {
  const env = readStripeEnv();

  console.log("=== Configuración Stripe AINÉ ===\n");
  console.log("FRONTEND_URL:", env.frontendUrl);
  console.log("STRIPE_SECRET_KEY:", env.secretKey ? `${env.secretKey.slice(0, 12)}...` : "NO CONFIGURADA");
  console.log("STRIPE_PUBLISHABLE_KEY:", env.publishableKey ? `${env.publishableKey.slice(0, 12)}...` : "NO CONFIGURADA");
  console.log("STRIPE_WEBHOOK_SECRET:", env.webhookSecret ? "configurado" : "opcional (recomendado en producción)");

  if (!env.isConfigured) {
    console.log("\n❌ Stripe no está listo.");
    console.log("\nPasos:");
    console.log("1. Crea cuenta en https://dashboard.stripe.com/register");
    console.log("2. Ve a Developers → API keys");
    console.log("3. Copia sk_test_... y pk_test_... en aine-backend/.env.local");
    console.log("4. Reinicia el backend: npm run dev");
    process.exit(1);
  }

  const stripe = createStripeClient(env.secretKey);
  const balance = await stripe.balance.retrieve();

  console.log("\n✅ Conexión con Stripe OK");
  console.log("Modo:", env.secretKey.startsWith("sk_live") ? "PRODUCCIÓN" : "PRUEBAS");
  console.log("Monedas disponibles:", balance.available.map((b) => b.currency.toUpperCase()).join(", ") || "ninguna");
  console.log("\nPrueba un pago con tarjeta: 4242 4242 4242 4242");
}

main().catch((err) => {
  console.error("\n❌ Error:", err.message);
  if (err.message.includes("Invalid API Key")) {
    console.error("La STRIPE_SECRET_KEY en .env.local no es válida. Revisa el Dashboard de Stripe.");
  }
  process.exit(1);
});
