import type { Metadata } from "next";

import { SiteHeader } from "@/components/portfolio/site-header";
import { SiteEffects } from "@/components/runtime/site-effects";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: "Shreyansh Golchha | Portfolio",
  description: "Full-stack developer building meaningful digital experiences.",
  authors: [{ name: "Shreyansh Golchha" }],
  icons: {
    icon: [{ url: "/favicon.svg?v=3", type: "image/svg+xml" }],
    shortcut: "/favicon.svg?v=3",
    apple: "/favicon.svg?v=3",
  },
  openGraph: {
    type: "website",
    url: "https://example.com/",
    title: "Shreyansh Golchha | Portfolio",
    description: "Full-stack developer building meaningful digital experiences.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Portfolio cover image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shreyansh Golchha | Portfolio",
    description: "Full-stack developer building meaningful digital experiences.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body data-vision="clean">
        <div id="scroll-progress" className="scroll-progress" aria-hidden="true" />
        <div className="site-backdrop" aria-hidden="true" />

        <SiteHeader />
        {children}

        <button
          id="vision-toggle"
          className="vision-toggle"
          type="button"
          aria-label="Toggle retro texture"
          aria-pressed="false"
          title="Enable retro texture"
        >
          <svg
            className="icon-eye-open"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M1.5 12s3.8-6.5 10.5-6.5S22.5 12 22.5 12s-3.8 6.5-10.5 6.5S1.5 12 1.5 12Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="12"
              cy="12"
              r="3.2"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>

          <svg
            className="icon-eye-closed"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 3l18 18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M2 12s3.5-6 10-6c2.2 0 4.1.6 5.8 1.6M22 12s-3.5 6-10 6c-2.2 0-4.1-.6-5.8-1.6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <SiteEffects />
      </body>
    </html>
  );
}
