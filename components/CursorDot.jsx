"use client";

import { useEffect, useRef } from "react";

const GROW_SELECTOR =
  "a, button, .solution-card, .project, .tool-badge, .faq-q, input, textarea";

/**
 * Subtle cursor-follower dot, desktop + pointer:fine only. Grows over
 * interactive elements. Never replaces the native cursor.
 */
export default function CursorDot() {
  const dotRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !window.matchMedia("(pointer:fine)").matches) return;

    const dot = dotRef.current;
    let x = 0,
      y = 0,
      tx = 0,
      ty = 0,
      raf;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    function loop() {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      if (dot) dot.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    }
    const onOver = (e) => {
      if (e.target.closest(GROW_SELECTOR)) dot.classList.add("grow");
    };
    const onOut = (e) => {
      if (e.target.closest(GROW_SELECTOR)) dot.classList.remove("grow");
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    raf = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div className="cursor-dot" ref={dotRef} aria-hidden="true" />;
}
