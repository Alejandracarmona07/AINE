const app = require("./app");
const { startServer } = require("./src/infrastructure/http/server");

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

startServer({ app, port: PORT });
