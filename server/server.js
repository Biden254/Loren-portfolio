require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const SITE_DIR = path.join(__dirname, "..", "src");

app.disable("x-powered-by");

/* ---------------------------------------------------------------------------
 * Middleware
 * ------------------------------------------------------------------------- */

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  next();
});

/* ---------------------------------------------------------------------------
 * Static site
 * ------------------------------------------------------------------------- */

app.use(
  express.static(SITE_DIR, {
    extensions: ["html"],
    maxAge: IS_PRODUCTION ? "1h" : 0,
    index: "index.html"
  })
);

/* ---------------------------------------------------------------------------
 * Routing and error handling
 * ------------------------------------------------------------------------- */

app.use((req, res) => {
  if (req.method === "GET" || req.method === "HEAD") {
    res.status(404).sendFile(path.join(SITE_DIR, "404.html"));
    return;
  }
  res.status(405).json({ success: false, message: "Method not allowed." });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }
  console.error("[server]", error.message);
  res.status(500).json({ success: false, message: "Unexpected server error." });
});

app.listen(PORT, () => {
  console.log(`Portfolio server listening on http://localhost:${PORT}`);
  console.log(`Static site: ${SITE_DIR}`);
});

module.exports = app;
