import express from "express";
import path from "path";
import fs from "fs";
import app, { loadSeoData, injectSeo } from "./app.js";
import { initDb } from "./db.js";

const PORT = 3000;

async function startServer() {
  // Connect and initialize Neon Postgres tables in background
  initDb().catch((err) => {
    console.error("Background DB init error:", err);
  });

  if (!process.env.VERCEL) {
    if (process.env.NODE_ENV !== "production") {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "custom",
      });

      app.use(vite.middlewares);

      app.get("*", async (req, res, next) => {
        if (req.path.startsWith("/api/") || req.path.includes(".")) {
          return next();
        }
        try {
          const rawHtml = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");
          const baseSeo = await loadSeoData();
          const injected = await injectSeo(rawHtml, baseSeo, req.path);
          const transformed = await vite.transformIndexHtml(req.url, injected);
          res.status(200).set({ "Content-Type": "text/html" }).end(transformed);
        } catch (e) {
          console.error("Vite index.html inject error:", e);
          next(e);
        }
      });
    } else {
      const distPath = path.join(process.cwd(), "dist");
      
      app.use(express.static(distPath, { index: false }));
      
      app.get("*", async (req, res) => {
        try {
          const rawHtml = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");
          const baseSeo = await loadSeoData();
          const injected = await injectSeo(rawHtml, baseSeo, req.path);
          res.status(200).set({ "Content-Type": "text/html" }).end(injected);
        } catch (e) {
          console.error("Failed to inject SEO tags in production, sending raw index.html:", e);
          if (fs.existsSync(path.join(distPath, "index.html"))) {
            res.sendFile(path.join(distPath, "index.html"));
          } else {
            res.status(404).json({ error: "Page not found" });
          }
        }
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});

export default app;
