"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Stats = {
  clicks: number;
  travelPx: number;
  scrolls: number;
  keys: number;
};

const DEFAULT_BASE: Stats = {
  clicks: 1799,
  travelPx: 1_166_312,
  scrolls: 27_624,
  keys: 2033,
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
  const mouseXRef = useRef(-1);
  const mouseYRef = useRef(-1);
  const mouseMoveTickRef = useRef(0);
  const mouseTravelBufferRef = useRef(0);
  const scrollTickRef = useRef(0);

  const [viewStats, setViewStats] = useState<Stats>(DEFAULT_BASE);

  const bumpPending = useCallback(
    (key: keyof Stats, increment: number) => {
      if (!Number.isFinite(increment) || increment <= 0) {
        return;
      }

      setViewStats((current) => ({
        ...current,
        [key]: current[key] + increment,
      }));
    },
    [],
  );

  const flushTravel = useCallback(() => {
    if (mouseTravelBufferRef.current <= 0) {
      return;
    }

    bumpPending("travelPx", mouseTravelBufferRef.current);
    mouseTravelBufferRef.current = 0;
  }, [bumpPending]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!event.isTrusted) {
        return;
      }

      bumpPending("clicks", 1);
    };

    const onKeydown = (event: KeyboardEvent) => {
      if (!event.isTrusted || event.repeat) {
        return;
      }

      bumpPending("keys", 1);
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
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        flushTravel();
      }
    };

    const onPagehide = () => {
      flushTravel();
    };

    const onBeforeUnload = () => {
      flushTravel();
    };

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("mousemove", onMousemove);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPagehide);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeydown);
      document.removeEventListener("mousemove", onMousemove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPagehide);
      window.removeEventListener("beforeunload", onBeforeUnload);

      flushTravel();
    };
  }, [bumpPending, flushTravel]);

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
        <p className="activity-sub">live local counters</p>
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
