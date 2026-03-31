import { NextRequest, NextResponse } from "next/server";

const CANONICAL_HOST = "shreyanshgolchha.me";
const ALLOWED_ROUTES = new Set(["/"]);

function normalizePath(pathname: string): string {
  if (pathname !== "/" && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

function isLocalHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function proxy(request: NextRequest) {
  const hostHeader = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const hostname = hostHeader.split(":")[0].toLowerCase();
  const pathname = normalizePath(request.nextUrl.pathname);
  const isLocal = isLocalHost(hostname);

  if (!isLocal && hostname !== CANONICAL_HOST) {
    return NextResponse.redirect(`https://${CANONICAL_HOST}/`, 308);
  }

  if (!ALLOWED_ROUTES.has(pathname)) {
    const redirectUrl = new URL("/", request.url);

    if (!isLocal) {
      redirectUrl.protocol = "https:";
      redirectUrl.host = CANONICAL_HOST;
    }

    return NextResponse.redirect(redirectUrl, 308);
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals, API routes, and static files.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
