"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

type VisionMode = "clean" | "retro";

const VISION_STORAGE_KEY = "portadi-vision";

export function SiteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add("js");

    const revealNodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (revealNodes.length === 0) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      revealNodes.forEach((node) => node.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.14 },
    );

    revealNodes.forEach((node) => observer.observe(node));
    revealNodes[0]?.classList.add("visible");

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    const nav = document.querySelector<HTMLElement>("header.site-nav");
    const navInner = nav?.querySelector<HTMLElement>(".nav-inner");
    const progress = document.getElementById("scroll-progress");
    const visionToggle = document.getElementById("vision-toggle");

    const setNavBlur = (scrolled: boolean) => {
      if (!navInner) {
        return;
      }

      const blur = scrolled ? "blur(16px)" : "blur(14px)";
      navInner.style.setProperty("backdrop-filter", blur);
      navInner.style.setProperty("-webkit-backdrop-filter", blur);
    };

    const updateScrollUI = () => {
      const top = window.scrollY || document.documentElement.scrollTop;
      const fullHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progressRatio = fullHeight > 0 ? (top / fullHeight) * 100 : 0;
      const scrolled = top > 8;

      if (progress) {
        progress.style.width = `${progressRatio}%`;
      }

      nav?.classList.toggle("scrolled", scrolled);
      setNavBlur(scrolled);
    };

    const setVision = (mode: VisionMode) => {
      document.body.dataset.vision = mode;

      if (!visionToggle) {
        return;
      }

      visionToggle.setAttribute("aria-pressed", mode === "retro" ? "true" : "false");
      visionToggle.setAttribute(
        "title",
        mode === "retro" ? "Disable retro texture" : "Enable retro texture",
      );
    };

    try {
      const stored = localStorage.getItem(VISION_STORAGE_KEY);
      setVision(stored === "retro" ? "retro" : "clean");
    } catch {
      setVision("clean");
    }

    const onToggleVision = () => {
      const nextMode: VisionMode =
        document.body.dataset.vision === "retro" ? "clean" : "retro";

      setVision(nextMode);
      try {
        localStorage.setItem(VISION_STORAGE_KEY, nextMode);
      } catch {
        // Ignore storage failures in private mode / strict settings.
      }
    };

    updateScrollUI();
    window.addEventListener("scroll", updateScrollUI, { passive: true });
    window.addEventListener("resize", updateScrollUI);
    visionToggle?.addEventListener("click", onToggleVision);

    return () => {
      window.removeEventListener("scroll", updateScrollUI);
      window.removeEventListener("resize", updateScrollUI);
      visionToggle?.removeEventListener("click", onToggleVision);
    };
  }, [pathname]);

  return null;
}
