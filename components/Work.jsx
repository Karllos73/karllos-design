"use client";

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";

const SUPABASE_URL = "https://mctkvfpuljgqfajddhdn.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_kOxdA64DlBI_9CBnDQqeBw_4dwp6Tn5";

const MEDIA_BY_TITLE = {
  Blefaroplastia: "/assets/videos/blefaroplastia.mp4",
  "Clipes Cirurgicos": "/assets/videos/clipes-cirurgicos.mp4",
  "Clipes Cirúrgicos": "/assets/videos/clipes-cirurgicos.mp4",
  "Bastidores de Centro Cirurgico": "/assets/videos/bastidores-centro-cirurgico.mp4",
  "Bastidores de Centro Cirúrgico": "/assets/videos/bastidores-centro-cirurgico.mp4",
  Oceno: "/assets/videos/oceno.mp4",
  "Reel Cinematografico": "/assets/videos/reel-cinematografico.mp4",
  "Reel Cinematográfico": "/assets/videos/reel-cinematografico.mp4",
};

const ICONS = {
  video: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  marca: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M12 3 21 8.5V15.5L12 21 3 15.5V8.5L12 3Z" />
      <path d="M12 3V21M3 8.5 21 15.5M21 8.5 3 15.5" />
    </svg>
  ),
  design: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="4" y="4" width="7" height="7" />
      <rect x="13" y="4" width="7" height="7" />
      <rect x="4" y="13" width="7" height="7" />
      <rect x="13" y="13" width="7" height="7" />
    </svg>
  ),
};
const TAGS = { video: "Vídeo", marca: "Identidade", design: "Design" };

function ProjectCard({ project, index, hidden }) {
  const cardRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = cardRef.current;
    if (!el) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      el.classList.add("in-view");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.style.transitionDelay = (index % 3) * 80 + "ms";
          entry.target.classList.toggle("in-view", entry.isIntersecting);
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [index]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const v = videoRef.current;
    if (!v || reduceMotion) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.play().catch(() => {});
          else entry.target.pause();
        });
      },
      { threshold: 0.35 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const mediaPath = MEDIA_BY_TITLE[project.title];

  return (
    <div className="tilt-card reveal" data-cat={project.category} ref={cardRef} hidden={hidden}>
      <div className="project">
        {mediaPath ? (
          <div className="thumb thumb-video">
            <span className="tag">{TAGS[project.category]}</span>
            <video ref={videoRef} className="preview-video" muted loop playsInline preload="none" src={mediaPath} />
          </div>
        ) : (
          <div className="thumb">
            <span className="tag">{TAGS[project.category]}</span>
            {ICONS[project.category]}
          </div>
        )}
        <div className="project-body">
          <h3>{project.title}</h3>
          <p>{project.subtitle}</p>
        </div>
      </div>
    </div>
  );
}

const FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "video", label: "Vídeo" },
  { key: "design", label: "Design" },
  { key: "marca", label: "Identidade" },
];

const Work = forwardRef(function Work(_props, ref) {
  const [projects, setProjects] = useState(null);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("todos");

  useImperativeHandle(ref, () => ({
    setFilter: (f) => setFilter(f),
  }));

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/projects?select=*&order=sort_order`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("bad response"))))
      .then(setProjects)
      .catch(() => setError(true));
  }, []);

  return (
    <section id="trabalhos">
      <div className="wrap">
        <p className="eyebrow reveal">Trabalhos</p>
        <h2 className="reveal" style={{ fontSize: "clamp(28px,4vw,44px)" }}>
          Projetos onde craft e narrativa viram uma coisa só.
        </h2>
        <div className="filters" role="group" aria-label="Filtrar trabalhos por área">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className="filter-btn"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="grid" id="workGrid">
          {error && (
            <p className="grid-status">
              Não consegui carregar os trabalhos agora — tenta recarregar a página.
            </p>
          )}
          {!error && !projects && <p className="grid-status">Carregando trabalhos…</p>}
          {!error &&
            projects &&
            projects.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i}
                hidden={filter !== "todos" && p.category !== filter}
              />
            ))}
        </div>
      </div>
    </section>
  );
});

export default Work;
