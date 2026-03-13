const { createProxyMiddleware } = require("http-proxy-middleware");

const target = process.env.BACKEND_PROXY_TARGET || "http://localhost:8000";

module.exports = function setupProxy(app) {
  const commonOptions = {
    target,
    changeOrigin: true,
    ws: true,
    logLevel: "warn",
    pathRewrite: (path, req) => req.originalUrl,
  };

  app.use("/health", createProxyMiddleware(commonOptions));
  app.use("/vehicles", createProxyMiddleware(commonOptions));
  app.use("/telemetry", createProxyMiddleware(commonOptions));
  app.use("/stats", createProxyMiddleware(commonOptions));
  app.use("/ws", createProxyMiddleware(commonOptions));
};
