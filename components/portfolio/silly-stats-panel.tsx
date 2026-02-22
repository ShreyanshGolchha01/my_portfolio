"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type StatKey = "clicks" | "travelPx" | "scrolls" | "keys";

type Stats = Record<StatKey, number>;

const STATS_KEYS: StatKey[] = ["clicks", "travelPx", "scrolls", "keys"];
const ZERO_STATS: Stats = { clicks: 0, travelPx: 0, scrolls: 0, keys: 0 };
const DEFAULT_BASE: Stats = {
  clicks: 3598,
  travelPx: 2_332_625,
  scrolls: 55_249,
  keys: 4067,
};
const SEND_INTERVAL_MS = 20_000;
const REFRESH_INTERVAL_MS = 90_000;
const RETRY_INTERVAL_MS = 7000;
const SEND_THRESHOLDS: Stats = {
  clicks: 20,
  travelPx: 2400,
  scrolls: 18,
  keys: 24,
};

function formatCompact(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}K`;
  }

  return `${value}`;
}

export function SillyStatsPanel() {
  const baseRef = useRef<Stats>({ ...DEFAULT_BASE });
  const pendingRef = useRef<Stats>({ ...ZERO_STATS });
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncingRef = useRef(false);

  const mouseXRef = useRef(-1);
  const mouseYRef = useRef(-1);
  const mouseMoveTickRef = useRef(0);
  const mouseTravelBufferRef = useRef(0);
  const scrollTickRef = useRef(0);

  const [viewStats, setViewStats] = useState<Stats>(DEFAULT_BASE);

  const refreshViewStats = useCallback(() => {
    const base = baseRef.current;
    const pending = pendingRef.current;

    setViewStats({
      clicks: base.clicks + pending.clicks,
      travelPx: base.travelPx + pending.travelPx,
      scrolls: base.scrolls + pending.scrolls,
      keys: base.keys + pending.keys,
    });
  }, []);

  const mergeBaseStats = useCallback(
    (incoming: Partial<Stats>) => {
      for (const key of STATS_KEYS) {
        const value = incoming[key];
        if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
          baseRef.current[key] = Math.max(baseRef.current[key], Math.floor(value));
        }
      }

      refreshViewStats();
    },
    [refreshViewStats],
  );

  const bumpPending = useCallback(
    (key: StatKey, increment: number) => {
      if (!Number.isFinite(increment) || increment <= 0) {
        return;
      }

      pendingRef.current[key] += increment;
      refreshViewStats();
    },
    [refreshViewStats],
  );

  const loadFromServer = useCallback(
    async (force = false) => {
      try {
        const response = await fetch("/api/stats", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load stats.");
        }

        const payload = (await response.json()) as Partial<Stats>;
        mergeBaseStats(payload);
      } catch {
        if (!force && retryTimerRef.current === null) {
          retryTimerRef.current = setTimeout(() => {
            retryTimerRef.current = null;
            void loadFromServer(true);
          }, RETRY_INTERVAL_MS);
        }
      }
    },
    [mergeBaseStats],
  );

  const sendPending = useCallback(
    async (useKeepAlive = false) => {
      if (syncingRef.current) {
        return;
      }

      const staged: Partial<Stats> = {};
      for (const key of STATS_KEYS) {
        const value = Math.floor(pendingRef.current[key]);
        if (value > 0) {
          staged[key] = value;
          pendingRef.current[key] -= value;
        }
      }

      if (Object.keys(staged).length === 0) {
        refreshViewStats();
        return;
      }

      syncingRef.current = true;

      try {
        const response = await fetch("/api/stats", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(staged),
          keepalive: useKeepAlive,
        });

        if (!response.ok) {
          throw new Error("Failed to push stats.");
        }

        for (const key of STATS_KEYS) {
          const value = staged[key];
          if (typeof value === "number" && value > 0) {
            baseRef.current[key] += value;
          }
        }
      } catch {
        for (const key of STATS_KEYS) {
          const value = staged[key];
          if (typeof value === "number" && value > 0) {
            pendingRef.current[key] += value;
          }
        }

        if (!useKeepAlive && retryTimerRef.current === null) {
          retryTimerRef.current = setTimeout(() => {
            retryTimerRef.current = null;
            void sendPending(false);
          }, RETRY_INTERVAL_MS);
        }
      } finally {
        syncingRef.current = false;
        refreshViewStats();
      }
    },
    [refreshViewStats],
  );

  const maybePushEarly = useCallback(
    (key: StatKey) => {
      if (pendingRef.current[key] >= SEND_THRESHOLDS[key]) {
        void sendPending(false);
      }
    },
    [sendPending],
  );

  const flushTravel = useCallback(() => {
    if (mouseTravelBufferRef.current <= 0) {
      return;
    }

    bumpPending("travelPx", mouseTravelBufferRef.current);
    mouseTravelBufferRef.current = 0;
    maybePushEarly("travelPx");
  }, [bumpPending, maybePushEarly]);

  useEffect(() => {
    void loadFromServer(false);

    const onClick = (event: MouseEvent) => {
      if (!event.isTrusted) {
        return;
      }

      bumpPending("clicks", 1);
      maybePushEarly("clicks");
    };

    const onKeydown = (event: KeyboardEvent) => {
      if (!event.isTrusted || event.repeat) {
        return;
      }

      bumpPending("keys", 1);
      maybePushEarly("keys");
    };

    const onMousemove = (event: MouseEvent) => {
      if (!event.isTrusted) {
        return;
      }

      const nextX = event.clientX;
      const nextY = event.clientY;

      if (mouseXRef.current >= 0 && mouseYRef.current >= 0) {
        const deltaX = nextX - mouseXRef.current;
        const deltaY = nextY - mouseYRef.current;
        mouseTravelBufferRef.current += Math.round(
          Math.sqrt(deltaX * deltaX + deltaY * deltaY),
        );
      }

      mouseXRef.current = nextX;
      mouseYRef.current = nextY;
      mouseMoveTickRef.current += 1;

      if (mouseMoveTickRef.current % 5 === 0) {
        flushTravel();
      }
    };

    const onScroll = () => {
      scrollTickRef.current += 1;

      if (scrollTickRef.current % 4 !== 0) {
        return;
      }

      bumpPending("scrolls", 1);
      maybePushEarly("scrolls");
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        flushTravel();
        void sendPending(true);
      } else {
        void loadFromServer(true);
      }
    };

    const onPagehide = () => {
      flushTravel();
      void sendPending(true);
    };

    const onBeforeUnload = () => {
      flushTravel();
      void sendPending(true);
    };

    const sendTicker = window.setInterval(() => {
      void sendPending(false);
    }, SEND_INTERVAL_MS);

    const refreshTicker = window.setInterval(() => {
      void loadFromServer(true);
    }, REFRESH_INTERVAL_MS);

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("mousemove", onMousemove);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPagehide);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      window.clearInterval(sendTicker);
      window.clearInterval(refreshTicker);

      if (retryTimerRef.current !== null) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }

      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeydown);
      document.removeEventListener("mousemove", onMousemove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPagehide);
      window.removeEventListener("beforeunload", onBeforeUnload);

      flushTravel();
      void sendPending(true);
    };
  }, [bumpPending, flushTravel, loadFromServer, maybePushEarly, sendPending]);

  const travelFeet = Math.round(viewStats.travelPx / 1152);
  const travelMiles = travelFeet / 5280;

  const statRows = useMemo(
    () => [
      {
        id: "stat-clicks",
        label: "mouse clicks",
        value: formatCompact(Math.max(0, Math.floor(viewStats.clicks))),
      },
      {
        id: "stat-travel",
        label: "mouse travel",
        value: `${formatCompact(Math.max(0, travelFeet))} ft`,
        subId: "stat-travel-mi",
        subValue: `${travelMiles.toFixed(2)} mi`,
      },
      {
        id: "stat-scrolls",
        label: "mouse scrolls",
        value: formatCompact(Math.max(0, Math.floor(viewStats.scrolls))),
      },
      {
        id: "stat-keys",
        label: "keypresses",
        value: formatCompact(Math.max(0, Math.floor(viewStats.keys))),
      },
    ],
    [travelFeet, travelMiles, viewStats.clicks, viewStats.keys, viewStats.scrolls],
  );

  return (
    <section id="silly-stats" className="panel activity-panel" data-reveal>
      <div className="panel-head">
        <p className="label">silly stats</p>
        <p className="activity-sub">live global counters</p>
      </div>
      <div className="activity-grid">
        {statRows.map((row) => (
          <div key={row.id} className="silly-stat">
            <span className="silly-stat-label">{row.label}</span>
            <span className="silly-stat-value" id={row.id}>
              {row.value}
            </span>
            {row.subId && row.subValue ? (
              <span className="silly-stat-sub" id={row.subId}>
                {row.subValue}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
