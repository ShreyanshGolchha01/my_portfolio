"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type MouseEvent } from "react";

const navLinks = [
  { label: "projects", href: "/#projects" },
  { label: "experience", href: "/#experience" },
  { label: "skills", href: "/#skills" },
  { label: "contact", href: "/#contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const onBrandClick = (event: MouseEvent<HTMLAnchorElement>) => {
    setIsMobileMenuOpen(false);

    if (pathname !== "/") {
      return;
    }

    event.preventDefault();
    const topSection = document.getElementById("top");

    if (topSection) {
      topSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (window.location.hash !== "#top") {
      window.history.replaceState(null, "", "#top");
    }
  };

  return (
    <header className={`site-nav${isMobileMenuOpen ? " mobile-open" : ""}`}>
      <div className="nav-inner">
        <Link className="nav-brand" href="/#top" onClick={onBrandClick}>
          <Image
            src="/me_nobg.png"
            alt=""
            width={30}
            height={30}
            className="nav-logo"
            aria-hidden
          />
          <span>shreyansh golchha</span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label={isMobileMenuOpen ? "close menu" : "open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="site-nav-menu"
          onClick={() => setIsMobileMenuOpen((previous) => !previous)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="site-nav-menu" className="nav-menu" aria-label="main navigation">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
