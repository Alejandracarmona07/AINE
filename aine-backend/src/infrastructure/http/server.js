function startServer({ app, port }) {
  return app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

module.exports = { startServer };

