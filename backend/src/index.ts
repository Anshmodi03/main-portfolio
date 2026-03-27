import "dotenv/config";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import { corsMiddleware } from "./middleware/cors";
import { globalRateLimit } from "./middleware/rateLimit";
import contactRouter from "./routes/contact";

const app = express();
const PORT = process.env.PORT ?? 5000;

// Security middleware
app.use(helmet());
app.use(corsMiddleware);
app.use(globalRateLimit);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

// Trust proxy (for rate limiting behind nginx/Vercel)
app.set("trust proxy", 1);

// Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now(), uptime: process.uptime() });
});

app.use("/api/contact", contactRouter);

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler — no stack traces in production
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  } else {
    console.error(`[ERROR] ${err.message}`);
  }
  res.status(500).json({ success: false, message: "Internal server error" });
});

// Guard: refuse to start without a real MongoDB URI
if (!process.env.MONGODB_URI) {
  console.error("✗ MONGODB_URI is not set. Refusing to start.");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✓ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("✗ MongoDB connection failed:", err);
    process.exit(1);
  });

export default app;
