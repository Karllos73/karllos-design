"use client";

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
          Serviços pensados pra resolver, não só decorar.
        </h2>
        <div className="solutions-list">
          {SERVICES.map((s) => (
            <a
              key={s.filter}
              className="solution-card reveal"
              href="#trabalhos"
              onClick={() => onFilterTo?.(s.filter)}
            >
              <span className="solution-tab">{s.tab}</span>
              <div className="solution-dots" aria-hidden="true"></div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <span className="solution-arrow">↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
