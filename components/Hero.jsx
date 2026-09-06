"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Entrance sequence: content visible by default in CSS; GSAP only sets a
  // "from" state right before animating in, so a stalled tween never leaves
  // anything permanently hidden. A hard fallback guarantees visibility.
  // (The 3D organism now lives in GlobalOrganism.jsx, mounted once at the
  // layout level — it owns its own self-contained entrance.)
  useEffect(() => {
    const textEls = sectionRef.current.querySelectorAll(".hero-word, .hero-anim");

    function forceVisible() {
      textEls.forEach((el) => {
        el.style.opacity = 1;
        el.style.transform = "none";
      });
    }

    if (reduceMotion) {
      forceVisible();
      return;
    }

    gsap.set('[data-anim="label"], [data-anim="lede"]', { opacity: 0, y: 15 });
    gsap.set(".hero-word", { yPercent: 115 });
    gsap.set('[data-anim="cta"]', { opacity: 0, scale: 0.96 });

    const tl = gsap.timeline({
      defaults: { ease: "expo.out" },
      onComplete: () => textEls.forEach((el) => (el.style.transform = "none")),
    });
    tl.to('[data-anim="label"]', { opacity: 1, y: 0, duration: 0.3 }, 0.3)
      .to(".hero-word", { yPercent: 0, duration: 0.45, stagger: 0.1, ease: "expo.out" }, 0.45)
      .to('[data-anim="lede"]', { opacity: 1, y: 0, duration: 0.4 }, 0.7)
      .to('[data-anim="cta"]', { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.6)" }, 0.85);

    const failsafe = setTimeout(forceVisible, 3000);
    return () => clearTimeout(failsafe);
  }, [reduceMotion]);

  return (
    <section className="hero" id="hero-section" ref={sectionRef}>
      <div className="hero-stage-line" aria-hidden="true"></div>
      <div className="hero-orbit" aria-hidden="true">
        <span>DESIGN</span><span>MOTION</span><span>IDENTIDADE</span>
      </div>
      <div className="wrap">
        <div className="hero-content">
          <p className="eyebrow hero-anim" data-anim="label">
            Designer Freelancer
          </p>
          <h1>
            <span className="line">
              <span className="hero-word">Corto o que</span>
            </span>
            <span className="line">
              <span className="hero-word">sobra.</span>
            </span>
            <span className="line">
              <span className="hero-word">Desenho o</span>
            </span>
            <span className="line">
              <span className="hero-word">que fica.</span>
            </span>
          </h1>
          <p className="lede hero-anim" data-anim="lede">
            Edição de vídeo, design gráfico e identidade visual. Um estúdio de uma pessoa só, com
            processo que não deixa nada ao acaso.
          </p>
          <div className="hero-actions hero-anim" data-anim="cta">
            <a className="btn btn-primary btn-icon-lead" href="#trabalhos">
              <span className="btn-icon">→</span>
              <span className="label">Ver trabalhos</span>
            </a>
            <a className="btn btn-ghost" href="#contato">
              <span className="label">Falar no WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
      <div className="hero-foot hero-foot-wrap">
        <div className="social-row">
          <a href="https://instagram.com/ruannz7x_" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" />
            </svg>
          </a>
          <a href="https://wa.me/5588988443624" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M20 12a8 8 0 1 1-3.6-6.7L20 4l-1 3.8A7.96 7.96 0 0 1 20 12Z" />
            </svg>
          </a>
          <a href="mailto:ruannkarllos05@gmail.com" aria-label="Email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </a>
        </div>
        <div className="scroll-cue">
          <span>Scroll</span>
          <span className="dot-line"></span>
        </div>
      </div>
    </section>
  );
}
