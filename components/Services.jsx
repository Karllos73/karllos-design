"use client";

const ICONS = {
  video: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  design: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="4" y="4" width="7" height="7" />
      <rect x="13" y="4" width="7" height="7" />
      <rect x="4" y="13" width="7" height="7" />
      <rect x="13" y="13" width="7" height="7" />
    </svg>
  ),
  marca: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M12 3 21 8.5V15.5L12 21 3 15.5V8.5L12 3Z" />
      <path d="M12 3V21M3 8.5 21 15.5M21 8.5 3 15.5" />
    </svg>
  ),
};

const SERVICES = [
  {
    tab: "Vídeo",
    filter: "video",
    title: (
      <>
        Edição de vídeo com <span className="hl">ritmo</span> que prende atenção do primeiro
        segundo
      </>
    ),
    desc: "Corte, color e motion para bastidores, procedimentos, reels e vídeos institucionais.",
  },
  {
    tab: "Design",
    filter: "design",
    title: (
      <>
        Artes gráficas com <span className="hl">hierarquia clara</span> e consistência visual
      </>
    ),
    desc: "Peças para redes sociais, campanhas e material impresso.",
  },
  {
    tab: "Identidade",
    filter: "marca",
    title: (
      <>
        Identidade visual <span className="hl">coerente</span> em todos os pontos de contato
      </>
    ),
    desc: "Logotipo, paleta e aplicações para marcas que precisam de consistência.",
  },
];

export default function Services({ onFilterTo }) {
  return (
    <section id="servicos">
      <div className="wrap">
        <p className="eyebrow reveal">O que eu entrego</p>
        <h2 className="reveal" style={{ fontSize: "clamp(28px,4vw,44px)", maxWidth: "16ch" }}>
          Vídeo, design ou marca: a solução dita o formato, não o contrário.
        </h2>
        <div className="solutions-list">
          {SERVICES.map((s, i) => (
            <a
              key={s.filter}
              className={`solution-card solution-row reveal${i % 2 ? " reverse" : ""}`}
              href="#trabalhos"
              onClick={() => onFilterTo?.(s.filter)}
            >
              <div className="solution-visual">
                <div className="solution-dots" aria-hidden="true"></div>
                <span className="solution-icon">{ICONS[s.filter]}</span>
              </div>
              <div className="solution-copy">
                <span className="solution-tab">{s.tab}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className="solution-arrow">
                  Ver trabalhos <em>↗</em>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
