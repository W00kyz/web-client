import React from "react";
import "./home.css";
import veraImage from "../assets/images/verai.png";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero__grid">
          <div className="hero__content">
            <h1 className="hero__title">
              Automação e Inteligência
              <br /> para Fiscalização Administrativa
            </h1>
            <p className="hero__subtitle">
              Padronize templates, processe documentos e gere relatórios com agilidade e precisão.
            </p>

            <div className="hero__cta">
              <Link to="/templates" className="btn btn--primary">Começar Agora</Link>
              <a href="#como-funciona" className="btn btn--ghost">Ver como funciona</a>
            </div>
          </div>

          {/* Ilustração simples em SVG (não depende de arquivo externo) */}
          <div className="hero__illustration" aria-hidden="true">
              <img src={veraImage} alt="Ilustração do Vera.AI" />
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section className="about">
        <div className="about__card">
          <div className="about__icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M4 5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5z" stroke="currentColor" strokeWidth="1.6" />
              <path d="M13 3v4h4" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </div>
          <p className="about__text">
            <strong>O Vera.<b>AI</b></strong> ajuda fiscais e administradores a gerenciar <b>templates</b>,
            processar <b>documentos</b> e gerar <b>relatórios</b> com agilidade e precisão.
          </p>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="steps">
        <h2 className="section-title">Como Funciona</h2>

        <ol className="steps__grid">
          <Step number={1} title="Crie seu template" icon={<IconTemplate />} />
          <Step number={2} title="Faça upload do documento" icon={<IconUpload />} />
          <Step number={3} title="Extraia as informações" icon={<IconExtract />} />
          <Step number={4} title="Gere relatórios" icon={<IconReport />} />
        </ol>
      </section>

      {/* BENEFÍCIOS */}
      <section className="benefits">
        <div className="benefits__card">
          <Benefit icon={<IconZap />} title="Rápido e fácil de usar" />
          <Benefit icon={<IconShield />} title="Seguro" />
          <Benefit icon={<IconBars />} title="Relatórios precisos" />
          <Benefit icon={<IconCloud />} title="Acesso em qualquer lugar" />
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="final-cta">
        <Link to="/templates" className="btn btn--xl btn--primary">Começar!</Link>
      </section>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Vera.AI — Todos os direitos reservados.</span>
      </footer>
    </main>
  );
}

/* ---------- Subcomponentes ---------- */

function Step({ number, title, icon }: { number: number; title: string; icon: React.ReactNode }) {
  return (
    <li className="step">
      <div className="step__badge">{number}</div>
      <div className="step__icon">{icon}</div>
      <h3 className="step__title">{title}</h3>
    </li>
  );
}

function Benefit({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="benefit">
      <div className="benefit__icon">{icon}</div>
      <span className="benefit__title">{title}</span>
    </div>
  );
}

/* ---------- Ícones (SVG inline) ---------- */

function IconTemplate() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="u-stroke">
      <rect x="4" y="3" width="12" height="18" rx="2" strokeWidth="1.8" />
      <path d="M16 7h4v12a2 2 0 0 1-2 2h-2V7z" strokeWidth="1.8" />
      <path d="M7.5 8.5h5M7.5 11.5h5" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconUpload() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="u-stroke">
      <path d="M12 15V4" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 8l4-4 4 4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="16" width="16" height="4" rx="1.5" strokeWidth="1.8" />
    </svg>
  );
}

function IconExtract() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="u-stroke">
      <rect x="4" y="3" width="16" height="18" rx="2" strokeWidth="1.8" />
      <path d="M8 8h8M8 12h8M8 16h5" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="18.5" cy="16.5" r="0.01" stroke="none" />
    </svg>
  );
}

function IconReport() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="u-stroke">
      <path d="M5 20V10M10 20v-6M15 20v-9M20 20V8" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconZap() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="u-stroke">
      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="u-stroke">
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" strokeWidth="1.8" />
      <path d="M9.5 12.5l2 2 4-4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconBars() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="u-stroke">
      <rect x="4" y="11" width="3" height="9" rx="1" strokeWidth="1.8" />
      <rect x="10.5" y="7" width="3" height="13" rx="1" strokeWidth="1.8" />
      <rect x="17" y="4" width="3" height="16" rx="1" strokeWidth="1.8" />
    </svg>
  );
}

function IconCloud() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="u-stroke">
      <path d="M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.5 2" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
