"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// The 3D canvas touches window/WebGL — load client-side only.
const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false });

/**
 * Per-section targets for the organism's scale/x-offset/opacity. It reads
 * as a bold, centered-right presence only in the Hero; everywhere else it
 * eases down to a small, dim, edge-pushed accent so it never fights the
 * reading column or merges visually with foreground UI (cards/badges are
 * opaque and simply paint over it — see globals.css .organism-layer).
 */
const SECTION_TARGETS = {
  "hero-section": { scale: 1.05, x: 0.55, opacity: 1 },
  sobre: { scale: 0.5, x: -1.35, opacity: 0.4 },
  servicos: { scale: 0.42, x: 1.3, opacity: 0.35 },
  processo: { scale: 0.48, x: -1.3, opacity: 0.38 },
  trabalhos: { scale: 0.4, x: 1.3, opacity: 0.32 },
  faq: { scale: 0.45, x: -1.25, opacity: 0.35 },
  // Kept off-center and dim here on purpose: the CTA section already has
  // its own bright pink radial glow (.cta-blob) behind the centered copy —
  // a centered, brighter organism washed out against it and read as one
  // muddy blob instead of two distinct layers.
  contato: { scale: 0.4, x: -1.3, opacity: 0.3 },
};

export default function GlobalOrganism() {
  const groupRef = useRef();
  const materialRef = useRef();
  const targetRef = useRef({ ...SECTION_TARGETS["hero-section"] });
  const explodeRef = useRef(0);
  const [mount3D, setMount3D] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setIsDesktop(window.matchMedia("(min-width:768px)").matches);
    setMount3D(true);
  }, []);

  // Scroll-driven size/position/opacity: whichever section currently
  // spans the viewport center owns the organism's target, which
  // DigitalOrganism eases toward every frame — so it reads as one
  // continuous background presence, not a hero-only prop.
  useEffect(() => {
    if (!mount3D) return;
    const desktop = window.matchMedia("(min-width:768px)").matches;
    const triggers = Object.entries(SECTION_TARGETS)
      .map(([id, base]) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const target = desktop ? base : { ...base, x: base.x * 0.35, scale: base.scale * 0.9 };
        return ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onToggle: ({ isActive }) => {
            if (isActive) targetRef.current = target;
          },
        });
      })
      .filter(Boolean);
    return () => triggers.forEach((t) => t.kill());
  }, [mount3D]);

  // Final-scene explosion: as the last (contato) section scrolls into
  // view, particles fly outward from the organism's core and fade to
  // nothing — a deliberate one-time "dissipation" instead of just
  // shrinking like every other section. Scrubbed to scroll position, so
  // scrolling back up smoothly re-forms it rather than restarting a
  // one-shot animation.
  useEffect(() => {
    if (!mount3D) return;
    const el = document.getElementById("contato");
    if (!el) return;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "top 15%",
      scrub: 0.6,
      onUpdate: (self) => {
        explodeRef.current = self.progress;
      },
    });
    return () => trigger.kill();
  }, [mount3D]);

  return (
    <div className="organism-layer" aria-hidden="true">
      {mount3D && (
        <Hero3D
          groupRef={groupRef}
          materialRef={materialRef}
          reduceMotion={reduceMotion}
          isDesktop={isDesktop}
          targetRef={targetRef}
          explodeRef={explodeRef}
        />
      )}
    </div>
  );
}
