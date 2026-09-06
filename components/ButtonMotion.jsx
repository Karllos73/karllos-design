"use client";

import { useEffect } from "react";
import gsap from "gsap";

/**
 * Magnetic hover pull for every `.btn` (desktop only), plus its own
 * scale-based press feedback — GSAP's inline transform would otherwise
 * block the CSS `:active` rule from showing.
 */
export default function ButtonMotion() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width:768px)").matches;
    if (reduceMotion || !isDesktop) return;

    const cleanups = [];
    document.querySelectorAll(".btn").forEach((btn) => {
      const onMove = (e) => {
        const r = btn.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        gsap.to(btn, { x: mx * 0.3, y: my * 0.4, duration: 0.6, ease: "power3.out" });
      };
      const onLeave = () =>
        gsap.to(btn, { x: 0, y: 0, scale: 1, duration: 0.6, ease: "elastic.out(1,.35)" });
      const onDown = () => gsap.to(btn, { scale: 0.96, duration: 0.15 });
      const onUp = () => gsap.to(btn, { scale: 1, duration: 0.2 });

      btn.addEventListener("mousemove", onMove);
      btn.addEventListener("mouseleave", onLeave);
      btn.addEventListener("mousedown", onDown);
      btn.addEventListener("mouseup", onUp);
      cleanups.push(() => {
        btn.removeEventListener("mousemove", onMove);
        btn.removeEventListener("mouseleave", onLeave);
        btn.removeEventListener("mousedown", onDown);
        btn.removeEventListener("mouseup", onUp);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
