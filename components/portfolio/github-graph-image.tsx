"use client";

import { useMemo, useState } from "react";

type GithubGraphImageProps = {
  user: string;
};

const FALLBACK_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="120" viewBox="0 0 720 120" role="img" aria-label="Activity graph unavailable">
  <rect width="720" height="120" fill="#0b0907" />
  <rect x="16" y="16" width="688" height="88" rx="8" fill="#0e0c09" stroke="#ffd54f3a" />
  <text x="36" y="56" fill="#e6e2d3" font-family="IBM Plex Mono, monospace" font-size="14">
    Unable to load live GitHub activity graph right now.
  </text>
  <text x="36" y="80" fill="#9a9486" font-family="IBM Plex Mono, monospace" font-size="12">
    Please refresh or open GitHub profile directly.
  </text>
</svg>`;

export function GithubGraphImage({ user }: GithubGraphImageProps) {
  const liveSrc = useMemo(
    () => `https://ghchart.rshah.org/39d353/${encodeURIComponent(user)}`,
    [user],
  );
  const fallbackSrc = useMemo(
    () => `data:image/svg+xml;utf8,${encodeURIComponent(FALLBACK_SVG)}`,
    [],
  );
  const [src, setSrc] = useState(liveSrc);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-graph-img
      src={src}
      alt={`GitHub contribution heatmap for ${user}`}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => {
        if (src !== fallbackSrc) {
          setSrc(fallbackSrc);
        }
      }}
    />
  );
}
