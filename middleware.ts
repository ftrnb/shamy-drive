import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Edge-compatible middleware — does NOT import prisma/bcrypt/auth.ts
// to keep bundle < 1 MB (Vercel Edge Function limit).
// Uses next-auth/jwt (jose) to verify the encrypted JWT session cookie.
export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    // getToken auto-detects __Secure-authjs.session-token vs authjs.session-token
    // based on secureCookie / AUTH_URL. No need to set secureCookie manually.
  });

  const isLoggedIn = !!token;
  const role = (token as any)?.role as string | undefined;

  const { nextUrl } = req;
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isAccountRoute = nextUrl.pathname.startsWith("/compte");

  if (isAdminRoute) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl));
    if (role !== "ADMIN") return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (isAccountRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/compte/:path*"],
};
