"use client";

import { useEffect, useRef, useState } from "react";

const GROW_SELECTOR =
  "a, button, .solution-row, .tool-badge, .faq-q, input, textarea";
const LABEL_SELECTOR = ".project";

/**
 * Subtle cursor-follower dot, desktop + pointer:fine only. Grows over
 * interactive elements, and expands into a "Ver projeto" pill over work
 * cards. Never replaces the native cursor.
 */
export default function CursorDot() {
  const dotRef = useRef(null);
  const [label, setLabel] = useState(false);

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
      if (e.target.closest(LABEL_SELECTOR)) setLabel(true);
      else if (e.target.closest(GROW_SELECTOR)) dot.classList.add("grow");
    };
    const onOut = (e) => {
      if (e.target.closest(LABEL_SELECTOR)) setLabel(false);
      else if (e.target.closest(GROW_SELECTOR)) dot.classList.remove("grow");
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

  return (
    <div className={`cursor-dot${label ? " label" : ""}`} ref={dotRef} aria-hidden="true">
      {label && <span>Ver projeto</span>}
    </div>
  );
}
