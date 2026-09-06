"use client";

import { useState } from "react";

const SUPABASE_URL = "https://mctkvfpuljgqfajddhdn.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_kOxdA64DlBI_9CBnDQqeBw_4dwp6Tn5";

export default function ContactCta() {
  const [sending, setSending] = useState(false);
  const [note, setNote] = useState("");
  const [success, setSuccess] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value.trim(),
      contact: form.contact.value.trim(),
      brief: form.brief.value.trim(),
    };
    if (!data.name || !data.contact) {
      setSuccess(false);
      setNote("Preenche nome e contato.");
      return;
    }
    setSending(true);
    setSuccess(false);
    setNote("Enviando…");
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(data),
      });
      setSending(false);
      if (res.ok) {
        setSuccess(true);
        setNote("Mensagem enviada! Te respondo em breve.");
        form.reset();
      } else {
        setNote("Não consegui enviar agora — me chama no WhatsApp.");
      }
    } catch {
      setSending(false);
      setNote("Não consegui enviar agora — me chama no WhatsApp.");
    }
  }

  return (
    <section className="cta-final" id="contato">
      <div className="blob cta-blob" aria-hidden="true"></div>
      <div className="wrap">
        <p className="eyebrow reveal" style={{ justifyContent: "center" }}>
          Vamos criar
        </p>
        <h2 className="reveal">Vamos cortar seu próximo vídeo?</h2>
        <p className="lede reveal">Me chama e conta a ideia. Resposta em até 1 dia útil.</p>
        <div className="contact-actions reveal">
          <a className="btn btn-primary" href="https://wa.me/5588988443624" target="_blank" rel="noopener noreferrer">
            <span className="label">WhatsApp</span>
          </a>
          <a className="btn btn-ghost" href="mailto:ruannkarllos05@gmail.com">
            <span className="label">Email</span>
          </a>
          <a className="btn btn-ghost" href="https://instagram.com/ruannz7x_" target="_blank" rel="noopener noreferrer">
            <span className="label">Instagram</span>
          </a>
        </div>
        <form className="lead-form reveal" noValidate onSubmit={onSubmit}>
          <div className="lead-row">
            <label className="sr-only" htmlFor="lead-name">
              Seu nome
            </label>
            <input
              id="lead-name"
              type="text"
              name="name"
              placeholder="Seu nome"
              required
              autoComplete="name"
            />
            <label className="sr-only" htmlFor="lead-contact">
              WhatsApp ou e-mail
            </label>
            <input
              id="lead-contact"
              type="text"
              name="contact"
              placeholder="WhatsApp ou e-mail"
              required
              autoComplete="tel"
            />
          </div>
          <label className="sr-only" htmlFor="lead-brief">
            Conta rapidamente sobre o projeto
          </label>
          <textarea
            id="lead-brief"
            name="brief"
            rows="3"
            placeholder="Conta rapidamente sobre o projeto (opcional)"
          ></textarea>
          <button type="submit" className="btn btn-primary" disabled={sending}>
            <span className="label">Enviar mensagem</span>
          </button>
          <p className="lead-consent">
            Ao enviar, você concorda com a{" "}
            <a href="/privacidade">Política de Privacidade</a>. Usamos seus dados só para
            responder sobre o projeto.
          </p>
          <p className={`lead-note${success ? " success" : ""}`} role="status">
            {note}
          </p>
        </form>
      </div>
    </section>
  );
}
