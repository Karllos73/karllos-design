"use client";

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

// Mood colors driving the depth gallery's background + accent dot per
// category — pulled straight from the site's own palette (never the
// reference demo's), so each project's "mood" still reads as Karllos
// Design's brand rather than a foreign color scheme.
const MOOD = {
  video: { color: "#4C72FF", label: "Movimento" },
  design: { color: "#E35B71", label: "Cor" },
  marca: { color: "#8B2CF5", label: "Identidade" },
};

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

/**
 * Depth-scrolling gallery — desktop + motion-allowed only. One project fills
 * the panel at a time; scrolling through the pinned section advances to the
 * next via a diagonal wipe, while the background mood-blob and the two info
 * panels (index/title on the left, category/subtitle/format on the right)
 * cross to the next project's data at the same moment the wipe fully
 * covers the panel — so the swap itself is always hidden behind the bar.
 *
 * Interaction pattern is inspired by houmahani/codrops-depth-gallery (MIT) —
 * rebuilt here with CSS/GSAP against Karllos's own real project data and
 * palette rather than porting the reference's Three.js/GLSL pipeline or its
 * imagery, since our items are looping videos, not static photos.
 */
function DepthGallery({ projects }) {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const barRef = useRef(null);
  const panelRefs = useRef([]);
  const videoRefs = useRef([]);
  const activeRef = useRef(0);
  const animatingRef = useRef(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const panels = panelRefs.current.filter(Boolean);
    const bar = barRef.current;
    const bg = bgRef.current;
    if (!section || !panels.length || !bar || !bg) return;

    const count = panels.length;
    gsap.set(panels, { autoAlpha: 0 });
    gsap.set(panels[0], { autoAlpha: 1 });
    gsap.set(bar, { xPercent: -140, skewX: -16 });
    bg.style.backgroundColor = MOOD[projects[0].category]?.color || "#8B2CF5";

    function goTo(index) {
      if (index === activeRef.current || animatingRef.current) return;
      animatingRef.current = true;
      const from = panels[activeRef.current];
      const to = panels[index];
      const mood = MOOD[projects[index].category]?.color || "#8B2CF5";

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => {
          animatingRef.current = false;
        },
      });
      tl.set(bar, { xPercent: -140, skewX: -16 })
        .to(bar, { xPercent: 0, duration: 0.4 }, 0)
        .to(bg, { backgroundColor: mood, duration: 0.7 }, 0)
        .call(() => {
          gsap.set(from, { autoAlpha: 0 });
          gsap.set(to, { autoAlpha: 1 });
          activeRef.current = index;
          setActive(index);
        })
        .to(bar, { xPercent: 140, duration: 0.4 });
    }

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=" + Math.round(window.innerHeight * 0.85 * count),
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const idx = Math.min(count - 1, Math.floor(self.progress * count));
        goTo(idx);
      },
    });

    // The gallery only mounts once the (async) Supabase fetch resolves, so
    // it adds ~count viewport-heights to the document well after every
    // other section's own ScrollTrigger (MotionDirector's reveals, etc.)
    // already computed its trigger positions against the shorter,
    // pre-gallery layout. Refresh whenever the document's real height
    // settles so those recompute against this section's final size.
    let resizeTimer;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 120);
    });
    ro.observe(document.body);

    return () => {
      clearTimeout(resizeTimer);
      ro.disconnect();
      trigger.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);

  // Only the active panel's video plays — the rest stay paused so we're
  // never decoding a dozen looping videos at once.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) v.play().catch(() => {});
      else v.pause();
    });
  }, [active]);

  const project = projects[active];
  const mood = MOOD[project.category] || MOOD.marca;
  const mediaPath = MEDIA_BY_TITLE[project.title];

  return (
    <div className="depth-gallery" ref={sectionRef}>
      <div className="depth-bg" ref={bgRef} aria-hidden="true" />
      <div className="depth-wipe-bar" ref={barRef} aria-hidden="true" />

      <div className="depth-index">
        <span className="depth-index-num">{String(active + 1).padStart(2, "0")}</span>
        <span className="depth-index-total">/ {String(projects.length).padStart(2, "0")}</span>
        <span className="depth-index-dot" style={{ background: mood.color }} />
        <span className="depth-index-mood">{mood.label}</span>
      </div>

      <div className="depth-stage">
        {projects.map((p, i) => {
          const mp = MEDIA_BY_TITLE[p.title];
          return (
            <div className="depth-panel project" key={p.id} ref={(el) => (panelRefs.current[i] = el)}>
              {mp ? (
                <video
                  ref={(el) => (videoRefs.current[i] = el)}
                  className="depth-media"
                  muted
                  loop
                  playsInline
                  preload="none"
                  src={mp}
                />
              ) : (
                <div className="depth-media depth-media-icon">{ICONS[p.category]}</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="depth-info">
        <span className="depth-info-row">
          <b>Categoria</b> {TAGS[project.category]}
        </span>
        <span className="depth-info-row">
          <b>Projeto</b> {project.subtitle}
        </span>
        <span className="depth-info-row">
          <b>Formato</b> {mediaPath ? "Vídeo · MP4" : "Design · Arte final"}
        </span>
      </div>

      <h3 className="depth-title">{project.title}</h3>
      <span className="depth-tags">
        #SCROLL #{TAGS[project.category].toUpperCase()} #TRABALHOS
      </span>
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
  const [galleryMode, setGalleryMode] = useState(false);

  useImperativeHandle(ref, () => ({
    setFilter: (f) => setFilter(f),
  }));

  useEffect(() => {
    setGalleryMode(
      window.matchMedia("(min-width:900px)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

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
        {!galleryMode && (
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
        )}
      </div>

      {error && (
        <p className="grid-status wrap">
          Não consegui carregar os trabalhos agora — tenta recarregar a página.
        </p>
      )}
      {!error && !projects && <p className="grid-status wrap">Carregando trabalhos…</p>}

      {!error && projects && galleryMode && <DepthGallery projects={projects} />}

      {!error && projects && !galleryMode && (
        <div className="wrap">
          <div className="grid" id="workGrid">
            {projects.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i}
                hidden={filter !== "todos" && p.category !== filter}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
});

export default Work;
