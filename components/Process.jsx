"use client";

const STEPS = [
  {
    num: "01",
    title: "Briefing & referências",
    desc: "Entendo o objetivo, o público e reúno referências visuais antes de abrir qualquer arquivo.",
  },
  {
    num: "02",
    title: "Roteiro & direção de arte",
    desc: "Defino estrutura de corte ou conceito visual e alinho com você antes da produção.",
  },
  {
    num: "03",
    title: "Produção",
    desc: "Edição, color, motion ou peças gráficas. Com atualizações parciais no caminho.",
  },
  {
    num: "04",
    title: "Entrega & ajustes",
    desc: "Arquivos finais nos formatos combinados, com uma rodada de ajustes inclusa.",
  },
];

export default function Process() {
  return (
    <section className="process" id="processo">
      <div className="wrap">
        <p className="eyebrow reveal">Como eu trabalho</p>
        <h2 className="reveal" style={{ fontSize: "clamp(28px,4vw,44px)" }}>
          Do briefing à entrega. Sem ruído no meio.
        </h2>
        <div className="process-grid">
          {STEPS.map((s) => (
            <div className="process-card reveal" data-num={s.num} key={s.num}>
              <span className="process-num">{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
