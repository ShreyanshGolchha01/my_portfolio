"use client";

import { useMemo, useState } from "react";

type GithubGraphImageProps = {
  user: string;
};

export function GithubGraphImage({ user }: GithubGraphImageProps) {
  const primarySrc = useMemo(
    () => `/api/github-graph.svg?user=${encodeURIComponent(user)}&nocache=1`,
    [user],
  );
  const fallbackSrc = useMemo(
    () => `https://ghchart.rshah.org/ffd54f/${encodeURIComponent(user)}`,
    [user],
  );
  const [src, setSrc] = useState(primarySrc);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-graph-img
      data-fallback={fallbackSrc}
      src={src}
      alt={`GitHub contribution heatmap for ${user}`}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (src !== fallbackSrc) {
          setSrc(fallbackSrc);
        }
      }}
    />
  );
}
