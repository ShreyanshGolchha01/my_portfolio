import { NextResponse } from "next/server";

type StatKey = "clicks" | "travelPx" | "scrolls" | "keys";
type Stats = Record<StatKey, number>;

const STATS_KEYS: StatKey[] = ["clicks", "travelPx", "scrolls", "keys"];
const SEED_STATS: Stats = {
  clicks: 3598,
  travelPx: 2_332_625,
  scrolls: 55_249,
  keys: 4067,
};

const CACHE_HEADERS = {
  "cache-control": "no-store",
};

declare global {
  var __portadiStats__: Stats | undefined;
}

function getStore(): Stats {
  if (!globalThis.__portadiStats__) {
    globalThis.__portadiStats__ = { ...SEED_STATS };
  }

  return globalThis.__portadiStats__;
}

function parseIncoming(body: unknown): Partial<Stats> {
  if (!body || typeof body !== "object") {
    return {};
  }

  const payload = body as Record<string, unknown>;
  const parsed: Partial<Stats> = {};

  for (const key of STATS_KEYS) {
    const raw = payload[key];

    if (typeof raw !== "number" || !Number.isFinite(raw)) {
      continue;
    }

    const normalized = Math.min(500_000, Math.max(0, Math.floor(raw)));
    if (normalized > 0) {
      parsed[key] = normalized;
    }
  }

  return parsed;
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getStore(), {
    headers: CACHE_HEADERS,
  });
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "Invalid JSON payload.",
      },
      {
        status: 400,
        headers: CACHE_HEADERS,
      },
    );
  }

  const incoming = parseIncoming(payload);
  const store = getStore();

  for (const key of STATS_KEYS) {
    const increment = incoming[key];
    if (typeof increment === "number" && increment > 0) {
      store[key] += increment;
    }
  }

  return NextResponse.json(store, {
    headers: CACHE_HEADERS,
  });
}
