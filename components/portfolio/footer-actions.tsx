"use client";

import { useEffect, useRef, useState } from "react";

import type { SocialLink } from "@/components/portfolio/data";

type FooterActionsProps = {
  links: SocialLink[];
};

export function FooterActions({ links }: FooterActionsProps) {
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="footer-actions">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noopener noreferrer" : undefined}
          onClick={async (event) => {
            if (!link.copyValue) {
              return;
            }

            event.preventDefault();
            try {
              await navigator.clipboard.writeText(link.copyValue);
              setCopiedLabel(link.label);

              if (timerRef.current) {
                clearTimeout(timerRef.current);
              }

              timerRef.current = setTimeout(() => {
                setCopiedLabel(null);
              }, 1200);
            } catch {
              setCopiedLabel(null);
            }
          }}
        >
          {link.label}
          {copiedLabel === link.label ? (
            <span style={{ marginLeft: "0.4rem", fontSize: "0.72rem", opacity: 0.8 }}>
              id copied
            </span>
          ) : null}
        </a>
      ))}
    </div>
  );
}
