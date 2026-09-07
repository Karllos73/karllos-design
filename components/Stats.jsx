"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 3, suffix: "", label: "Áreas de atuação: vídeo, design e identidade visual" },
  { value: 1, suffix: "", label: "Estúdio, um profissional, sem repasse pra terceiros" },
  { value: 100, suffix: "%", label: "Processo autoral, do briefing à entrega" },
  { value: 1, suffix: " dia útil", label: "Tempo médio de resposta ao seu contato" },
];

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const duration = 1100;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(eased * value));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="stat-number">
      {String(display).padStart(2, "0")}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="stats" id="diferenciais">
      <div className="wrap">
        <p className="eyebrow reveal">Diferenciais</p>
        <h2 className="reveal" style={{ fontSize: "clamp(28px,4vw,44px)", maxWidth: "18ch" }}>
          Um estúdio pequeno, feito pra dar atenção real a cada projeto.
        </h2>
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <div className="stat-card reveal" key={i}>
              <Counter value={s.value} suffix={s.suffix} />
              <p>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
