import cors from "cors";

const allowedOrigins = [
  process.env.FRONTEND_URL ?? "http://localhost:3000",
  "http://localhost:3000",
  "http://localhost:3001",
];

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // No-origin requests (Postman, curl) are allowed only in development.
    // In production the Next.js proxy always sends an origin header.
    if (!origin) {
      if (process.env.NODE_ENV !== "production") return callback(null, true);
      return callback(new Error("CORS: Missing origin in production"));
    }
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});
