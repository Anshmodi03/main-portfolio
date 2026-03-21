import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000";

// In-memory rate limiter: 10 requests per 15 minutes per IP
const rateMap = new Map<string, { count: number; reset: number }>();
const LIMIT = 10;
const WINDOW_MS = 15 * 60 * 1000;

function checkRate(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!checkRate(ip)) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    // Only forward the 4 known fields — strip any extra body properties
    const raw = await req.json();
    const { name, email, subject, message } = raw as Record<string, unknown>;
    const body = { name, email, subject, message };

    const res = await fetch(`${BACKEND_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Contact proxy error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to connect to server" },
      { status: 500 }
    );
  }
}
