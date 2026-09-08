"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PARAGRAPHS = [
  "Sou o Karllos. Edito vídeo, desenho identidade visual e construo a consistência que falta entre a tela e o feed. Todo projeto passa pelo mesmo processo, do roteiro ao arquivo final.",
  "Menos enfeite, mais decisão. Prefiro um corte certeiro e uma paleta de duas cores bem aplicada a um efeito chamativo sem função.",
];

export default function About() {
  const aboutTextRef = useRef(null);
  const aboutVisualRef = useRef(null);
  const paraRefs = useRef([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width:768px)").matches;

    const paras = paraRefs.current.filter(Boolean);
    paras.forEach((p) => {
      const text = p.textContent;
      p.innerHTML = text
        .split(" ")
        .map((w) => `<span class="word">${w}</span>`)
        .join(" ");
    });

    if (reduceMotion) return;

    const stVars = {
      trigger: aboutTextRef.current,
      start: "top 20%",
      // Just enough scroll distance for the last word to finish its color
      // reveal — the pin used to hold on for 1.4x the viewport height
      // after the text had already fully revealed, which read as the
      // page getting stuck. Releasing right as the reveal completes
      // avoids that dead scroll.
      end: "+=" + Math.round(window.innerHeight * 0.8),
      scrub: 0.6,
    };
    // Pinning the avatar column here used to work fine on its own, but
    // once the Work section above gained its own (async, Supabase-data-
    // driven) pinned depth gallery, this trigger's start/end kept getting
    // computed against a stale pre-gallery layout — no amount of
    // ScrollTrigger.refresh() timing (rAF, timeout, ResizeObserver) fixed
    // it reliably, and a wrongly-pinned avatar bleeding through another
    // section is worse than losing the pin effect. Word-color reveal
    // below is unaffected — only the "avatar stays put while you read"
    // pin is dropped.

    const tl = gsap.timeline({ scrollTrigger: stVars });
    paras.forEach((p, i) => {
      const words = p.querySelectorAll(".word");
      tl.fromTo(
        words,
        { color: "#9696A2" },
        { color: "#F7F7FA", stagger: 0.05, ease: "none" },
        i === 0 ? 0 : ">"
      );
    });

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  // Floating tool badges, desktop only.
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width:768px)").matches;
    if (reduceMotion || !isDesktop) return;
    const cleanups = [];
    document.querySelectorAll(".tool-badge").forEach((el, i) => {
      gsap.to(el, {
        y: (i % 2 === 0 ? -1 : 1) * 8,
        rotate: (i % 2 === 0 ? 1 : -1) * 2,
        duration: 5 + i * 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.3,
      });
      const onEnter = () => gsap.to(el, { scale: 1.15, duration: 0.25, ease: "power2.out" });
      const onLeave = () => gsap.to(el, { scale: 1, duration: 0.3, ease: "power2.out" });
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section className="about" id="sobre">
      <p className="about-ghost">SOBRE</p>
      <div className="wrap">
        <div className="about-visual" ref={aboutVisualRef}>
          <div className="avatar reveal">
            <img src="/assets/avatar.jpg" alt="Foto de Karllos, autor do estúdio Karllos Design" loading="lazy" />
          </div>
          <div className="tool-badge tool-badge-1">Pr</div>
          <div className="tool-badge tool-badge-2">Ae</div>
          <div className="tool-badge tool-badge-3">Ps</div>
          <div className="tool-badge tool-badge-4">Ai</div>
          <div className="about-index">
            <span className="bar"></span>01 / 04
          </div>
        </div>
        <div className="about-text" ref={aboutTextRef}>
          <p className="eyebrow reveal">Quem sou eu</p>
          <h2 className="reveal">
            Aqui, corte e design nascem do mesmo processo: entender a história antes de decidir a forma.
          </h2>
          {PARAGRAPHS.map((text, i) => (
            <p
              key={i}
              className="reveal scrub-text"
              ref={(el) => (paraRefs.current[i] = el)}
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
