"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#trabalhos", label: "Trabalhos" },
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#processo", label: "Processo" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close on Escape, matching the original vanilla behavior.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Header starts fully transparent over the Hero and picks up its
  // blurred pill background once the page has scrolled past it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={scrolled || open ? "is-scrolled" : ""}>
      <nav className="navbar wrap" style={{ paddingLeft: 12, paddingRight: 12 }}>
        <a className="brandmark" href="#top">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2 21 7.5V16.5L12 22 3 16.5V7.5L12 2Z" stroke="#C449FF" strokeWidth="1.4" />
            <path d="M10 8.6 15.5 12 10 15.4V8.6Z" fill="#C449FF" />
          </svg>
          <span>KARLLOS</span>
        </a>
        <div className="navlinks">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
        <div className="nav-right">
          <a className="nav-cta" href="#contato">
            Iniciar Projeto
          </a>
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="mobileMenu"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
      <div className={`mobile-menu${open ? " show" : ""}`} id="mobileMenu" hidden={!open}>
        <nav className="mobile-menu-links">
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              style={{ transitionDelay: open ? `${80 + i * 60}ms` : "0ms" }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contato"
            style={{ transitionDelay: open ? `${80 + LINKS.length * 60}ms` : "0ms" }}
            onClick={() => setOpen(false)}
          >
            Contato
          </a>
        </nav>
        <div className="mobile-menu-foot">
          <a href="/privacidade">Privacidade</a>
          <a href="/termos">Termos de Uso</a>
        </div>
      </div>
    </header>
  );
}
