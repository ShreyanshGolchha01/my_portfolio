import { NextRequest } from "next/server";

const DEFAULT_USER = "Aditya-1304";
const GRAPH_COLOR = "ffd54f";

function sanitizeGitHubUser(input: string | null) {
  const trimmed = (input ?? "").trim();
  const candidate = trimmed.replace(/[^A-Za-z0-9-]/g, "");
  return candidate.length > 0 ? candidate : DEFAULT_USER;
}

function fallbackSvg(user: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="120" viewBox="0 0 720 120" role="img" aria-label="GitHub graph unavailable">
  <rect width="720" height="120" fill="#0b0907" />
  <rect x="16" y="16" width="688" height="88" rx="8" fill="#0e0c09" stroke="#ffd54f3a" />
  <text x="36" y="56" fill="#e6e2d3" font-family="IBM Plex Mono, monospace" font-size="14">
    GitHub graph unavailable for ${user}
  </text>
  <text x="36" y="80" fill="#9a9486" font-family="IBM Plex Mono, monospace" font-size="12">
    Open github profile to view latest contributions.
  </text>
</svg>`;
}

export async function GET(request: NextRequest) {
  const user = sanitizeGitHubUser(request.nextUrl.searchParams.get("user"));
  const noCache = request.nextUrl.searchParams.get("nocache") === "1";
  const upstreamUrl = `https://ghchart.rshah.org/${GRAPH_COLOR}/${encodeURIComponent(user)}`;

  try {
    const upstream = await fetch(upstreamUrl, {
      cache: noCache ? "no-store" : "force-cache",
      next: noCache ? undefined : { revalidate: 3600 },
      headers: {
        "user-agent": "aditya-portfolio-replica/1.0",
      },
    });

    if (!upstream.ok) {
      throw new Error(`Graph upstream failed with ${upstream.status}`);
    }

    const svg = await upstream.text();

    return new Response(svg, {
      headers: {
        "content-type": "image/svg+xml; charset=utf-8",
        "cache-control": noCache
          ? "no-store"
          : "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new Response(fallbackSvg(user), {
      headers: {
        "content-type": "image/svg+xml; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }
}
