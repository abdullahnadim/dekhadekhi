import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rate limiting configuration
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100");
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000");

// In-memory rate limit store (replace with Redis edge KV in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(request: NextRequest): string {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";
  return `rate_limit:${ip}`;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count };
}

// ─── Auth helper (cookie-based, no Prisma needed here) ───
function getSessionFromCookies(request: NextRequest): {
  isLoggedIn: boolean;
  role?: string;
} {
  // Auth.js stores session as a cookie (JWT)
  const sessionToken =
    request.cookies.get("authjs.session-token") ||
    request.cookies.get("__Secure-authjs.session-token");
  return { isLoggedIn: !!sessionToken };
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Rate Limiting for API routes ─────────────────────────
  if (pathname.startsWith("/api/")) {
    const key = getRateLimitKey(request);
    const { allowed, remaining } = checkRateLimit(key);

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests", message: "Please slow down." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": RATE_LIMIT_MAX.toString(),
            "X-RateLimit-Remaining": "0",
            "Retry-After": "60",
          },
        }
      );
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", RATE_LIMIT_MAX.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    return response;
  }

  // ─── Auth Guard ───────────────────────────────────────────
  const { isLoggedIn } = getSessionFromCookies(request);

  // Admin protection
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL("/login?reason=unauthorized", request.url)
      );
    }
  }

  // Dashboard protection
  if (pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(
          `/login?callbackUrl=${encodeURIComponent(pathname)}`,
          request.url
        )
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2)$).*)",
  ],
};
