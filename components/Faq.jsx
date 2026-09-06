"use client";

import { useRef, useState } from "react";

const ITEMS = [
  {
    q: "Quanto tempo leva pra receber meu vídeo ou design?",
    a: "Varia com a complexidade do projeto, mas o prazo é sempre combinado no briefing antes de começar — sem surpresas no meio do caminho.",
  },
  {
    q: "Quantas revisões estão incluídas?",
    a: "Uma rodada de ajustes está inclusa em todo projeto. Mudanças de escopo depois da aprovação do roteiro/conceito são orçadas à parte.",
  },
  {
    q: "Em quais formatos eu recebo os arquivos?",
    a: "Nos formatos combinados no briefing — MP4 para vídeo, PDF/PNG para artes, ou os arquivos-fonte (AI, PSD) quando fizer parte do escopo.",
  },
  {
    q: "Como funciona o orçamento?",
    a: "Não trabalho com pacote fixo genérico — o valor é calculado depois de entender o escopo real do seu projeto no briefing.",
  },
  {
    q: "Como eu começo um projeto?",
    a: "Me chama no WhatsApp ou preenche o formulário lá embaixo, contando a ideia. O briefing começa a partir daí.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);
  const answerRefs = useRef([]);

  return (
    <section id="faq">
      <div className="wrap" style={{ textAlign: "center" }}>
        <p className="eyebrow reveal" style={{ justifyContent: "center" }}>
          Perguntas frequentes
        </p>
        <h2 className="reveal" style={{ fontSize: "clamp(28px,4vw,44px)" }}>
          Ainda com dúvida?
        </h2>
        <div className="faq-list">
          {ITEMS.map((item, i) => {
            const open = openIndex === i;
            return (
              <div className="faq-item reveal" data-open={open} key={item.q}>
                <button className="faq-q" onClick={() => setOpenIndex(open ? null : i)}>
                  <span>{item.q}</span>
                  <span className="plus">+</span>
                </button>
                <div
                  className="faq-a"
                  ref={(el) => (answerRefs.current[i] = el)}
                  style={{ maxHeight: open ? answerRefs.current[i]?.scrollHeight ?? 300 : 0 }}
                >
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
