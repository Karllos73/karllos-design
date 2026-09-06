"use client";

import { useEffect, useState } from "react";

const KEY = "karllos_cookie_consent";

export default function CookieBar() {
  const [hidden, setHidden] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let already = null;
    try {
      already = localStorage.getItem(KEY);
    } catch {
      already = null;
    }
    if (!already) {
      setHidden(false);
      requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)));
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(KEY, "accepted");
    } catch {
      /* ignore storage errors (private mode, etc.) */
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setShow(false);
    setTimeout(() => setHidden(true), reduceMotion ? 0 : 500);
  }

  if (hidden) return null;

  return (
    <div
      className={`cookie-bar${show ? " show" : ""}`}
      role="dialog"
      aria-label="Aviso de cookies"
    >
      <p>
        Este site usa apenas armazenamento local essencial (sem cookies de rastreamento). Veja a{" "}
        <a href="/privacidade">Política de Privacidade</a>.
      </p>
      <button className="btn btn-primary" type="button" onClick={accept}>
        Entendi
      </button>
    </div>
  );
}
