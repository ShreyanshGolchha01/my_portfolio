import type { Metadata } from "next";

import { BlogsContent } from "@/components/portfolio/blogs-content";

export const metadata: Metadata = {
  title: "Aditya Mandal | Blogs",
  description:
    "Technical blogs by Aditya Mandal on backend systems, Rust, and Solana engineering.",
  openGraph: {
    title: "Aditya Mandal | Blogs",
    description:
      "Technical blogs by Aditya Mandal on backend systems, Rust, and Solana engineering.",
    type: "website",
    url: "https://www.adityamandal.tech/blogs",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditya Mandal | Blogs",
    description:
      "Technical blogs by Aditya Mandal on backend systems, Rust, and Solana engineering.",
    images: ["/og-image.jpg"],
  },
};

export default function BlogsPage() {
  return <BlogsContent />;
}
