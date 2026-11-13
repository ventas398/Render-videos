// Portada EM-053B (propuesta 1 elegida por Javier): UN hombre, CUATRO colores. Misma foto Flow en 4 franjas con otra correccion de color.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const S = 720 / 768; // escala de la imagen 1376x768 a 720 de alto (el hombre queda de ~385 px)
const X0 = 232 * S; // origen del recorte: hombre centrado en cada franja de 316 px
const W = 316;
const INK = "#0A0A0A";

type Strip = { img: string; over: React.CSSProperties[]; extra?: React.ReactNode };
const STRIPS: Strip[] = [
  { // triunfo: hora dorada, bloom, saturacion +30
    img: "saturate(1.55) contrast(1.12) brightness(1.12) sepia(.45) hue-rotate(-12deg)",
    over: [
      { background: "linear-gradient(180deg, rgba(255,150,20,.45) 0%, rgba(255,190,60,.35) 45%, rgba(255,120,0,.3) 100%)", mixBlendMode: "soft-light" },
      { background: "radial-gradient(ellipse 260px 220px at 62% 42%, rgba(255,235,150,.95) 0%, rgba(255,190,60,.55) 38%, rgba(255,160,0,0) 75%)", mixBlendMode: "screen" },
    ],
  },
  { // tension: azul-verde oscuro, contraste alto, vineta fuerte, horizonte rojizo
    img: "grayscale(.55) contrast(1.45) brightness(.78)",
    over: [
      { background: "#0B5753", mixBlendMode: "color", opacity: 0.8 },
      { background: "rgba(40,120,115,.3)", mixBlendMode: "screen" }, // levanta los negros: el hombre se lee
      { background: "linear-gradient(180deg, rgba(0,0,0,0) 36%, rgba(220,60,30,.55) 43%, rgba(0,0,0,0) 50%)", mixBlendMode: "screen", WebkitMaskImage: "linear-gradient(90deg, #000 0%, #000 18%, transparent 36%, transparent 64%, #000 82%, #000 100%)" }, // horizonte rojizo solo a los lados, sin cruzar el torso
      { boxShadow: "inset 0 0 120px 50px rgba(0,8,10,.92)" },
    ],
  },
  { // pena: azul gris desaturado (-60 %), brillo -15, rayas de lluvia
    img: "saturate(.4) brightness(.85) contrast(.95)",
    over: [{ background: "#4C6384", mixBlendMode: "color", opacity: 0.5 }, { background: "rgba(20,30,50,.22)" }],
    extra: (
      <svg width={W} height={720} style={{ position: "absolute", left: 0, top: 0 }}>
        {Array.from({ length: 26 }, (_, i) => {
          const x = (i * 53) % (W + 90) - 30, y = (i * 137) % 640;
          return <line key={i} x1={x} y1={y} x2={x - 22} y2={y + 85} stroke="#DCE6F5" strokeOpacity={0.55} strokeWidth={3} strokeLinecap="round" />;
        })}
      </svg>
    ),
  },
  { // calma: pastel lavanda-rosa, luz levantada, neblina
    img: "brightness(1.22) contrast(.8) saturate(.85)",
    over: [
      { background: "linear-gradient(180deg, rgba(205,182,235,.7) 0%, rgba(246,198,216,.6) 100%)", mixBlendMode: "soft-light" },
      { background: "linear-gradient(180deg, rgba(255,255,255,0) 28%, rgba(255,240,248,.42) 44%, rgba(255,240,248,.1) 62%, rgba(255,255,255,0) 100%)" },
      { background: "rgba(245,225,245,.22)" },
    ],
  },
];

export const ThumbEM053Bcover: React.FC = () => (
  <AbsoluteFill style={{ background: "#fff", overflow: "hidden", fontFamily: 'Impact, "Arial Black", sans-serif' }}>
    {STRIPS.map((s, i) => (
      <div key={i} style={{ position: "absolute", left: i * (W + 5), top: 0, width: i === 3 ? W + 1 : W, height: 720, overflow: "hidden" }}>
        <Img src={staticFile("illustrations/em053b-beach-sunrise.png")} style={{ position: "absolute", left: -X0, top: 0, width: 1376 * S, height: 720, filter: s.img }} />
        {s.over.map((o, k) => <div key={k} style={{ position: "absolute", inset: 0, ...o }} />)}
        {s.extra}
      </div>
    ))}
    <div style={{ position: "absolute", left: 590, top: 24, width: 100, height: 100, borderRadius: 50, background: "#fff", boxShadow: "0 6px 18px rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Segoe UI Symbol, Segoe UI, sans-serif", fontSize: 72, color: INK }}>♪</div>
    <div style={{ position: "absolute", left: -40, width: 1360, top: 575, height: 125, transform: "rotate(-3deg)", background: "#FFD21F", boxShadow: "0 8px 0 rgba(0,0,0,.35), 0 16px 28px rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontSize: 134, lineHeight: 1, color: INK, letterSpacing: 6, whiteSpace: "nowrap", WebkitTextStroke: "12px #fff", paintOrder: "stroke fill" }}>SAME MAN</span>
    </div>
    <div style={{ position: "absolute", right: 20, top: 16, background: "rgba(255,255,255,.88)", color: "#0A1A4A", fontFamily: "Segoe UI, sans-serif", fontSize: 24, padding: "2px 14px", borderRadius: 14 }}>Illustrative image</div>
  </AbsoluteFill>
);
