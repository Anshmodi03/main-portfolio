import cors from "cors";

const allowedOrigins = [
  process.env.FRONTEND_URL ?? "http://localhost:3000",
  "http://localhost:3000",
  "http://localhost:3001",
];

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // No-origin requests are server-to-server calls (Node.js fetch, Postman, curl).
    // Browsers always send Origin; only server runtimes omit it — allow them through.
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});
