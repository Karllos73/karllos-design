"use client";

import { useEffect } from "react";

/**
 * Shared scroll-reveal for every static `.reveal` element (grouped by
 * section so the stagger delay resets per-section). Elements toggle
 * in-view every time they cross the threshold, in both scroll directions.
 * Dynamically-added elements (Work section's Supabase cards) manage their
 * own observer since they don't exist yet when this runs on mount.
 */
export default function RevealObserver() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sections = Array.from(document.querySelectorAll("section"));
    const groups = {};

    document.querySelectorAll(".reveal").forEach((el) => {
      const parent = el.closest("section") || document.body;
      const key = parent === document.body ? "body" : sections.indexOf(parent);
      if (!groups[key]) groups[key] = [];
      groups[key].push(el);
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in-view"));
      return;
    }

    const observers = [];
    Object.keys(groups).forEach((key) => {
      const els = groups[key];
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const idx = els.indexOf(entry.target);
            entry.target.style.transitionDelay = (Math.max(idx, 0) % 4) * 80 + "ms";
            entry.target.classList.toggle("in-view", entry.isIntersecting);
          });
        },
        { threshold: 0.15 }
      );
      els.forEach((el) => io.observe(el));
      observers.push(io);
    });

    return () => observers.forEach((io) => io.disconnect());
  }, []);

  return null;
}
