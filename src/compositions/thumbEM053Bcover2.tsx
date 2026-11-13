// Portada EM-053B v2 (decision de Javier 10/11): titulo "One Scene, Four Moods", miniatura "BLAME THE MUSIC".
// Concepto (a): hombre con auriculares (Flow); de la copa izquierda salen 4 cintas de ondas que acaban en 4 caritas (triunfo, tension, pena, calma).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const S = 720 / 768;
const CUP = { x: 962, y: 114 }; // copa izquierda de los auriculares (1280x720)
const INK = "#0A0A0A";

type Mood = { x: number; y: number; c1: string; c2: string; rim: string; face: React.ReactNode };
const W = { stroke: "#fff", strokeWidth: 6, fill: "none", strokeLinecap: "round" as const };
const D = { stroke: "#1A1030", strokeWidth: 7, fill: "none", strokeLinecap: "round" as const };
const MOODS: Mood[] = [
  { x: 150, y: 285, c1: "#FFE27A", c2: "#FFB000", rim: "#fff", face: ( // triunfo: sonrisa grande y ojos felices
    <>
      <path d="M-26 -12 Q-18 -26 -10 -12" {...D} /><path d="M10 -12 Q18 -26 26 -12" {...D} />
      <path d="M-30 6 Q0 46 30 6 Z" fill="#7A2A00" stroke="#7A2A00" strokeWidth={5} strokeLinejoin="round" />
      <path d="M-18 14 Q0 24 18 14" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" />
    </>
  ) },
  { x: 345, y: 225, c1: "#1F8E9C", c2: "#0B3A47", rim: "#FF4B3A", face: ( // tension: ojos muy abiertos, boca de susto
    <>
      <circle cx={-17} cy={-10} r={13} fill="#fff" /><circle cx={17} cy={-10} r={13} fill="#fff" />
      <circle cx={-17} cy={-8} r={5} fill="#0B1F26" /><circle cx={17} cy={-8} r={5} fill="#0B1F26" />
      <path d="M-28 -28 L-8 -36 M28 -28 L8 -36" {...W} strokeWidth={5} />
      <ellipse cx={0} cy={26} rx={11} ry={15} fill="#06181E" stroke="#fff" strokeWidth={5} />
    </>
  ) },
  { x: 540, y: 290, c1: "#9AAAC2", c2: "#4F6079", rim: "#fff", face: ( // pena: ojos tristes, boca invertida y lagrima
    <>
      <path d="M-30 -14 L-10 -22 M30 -14 L10 -22" {...D} strokeWidth={6} />
      <circle cx={-18} cy={-4} r={5} fill="#1A2233" /><circle cx={18} cy={-4} r={5} fill="#1A2233" />
      <path d="M-18 28 Q0 12 18 28" {...D} />
      <path d="M-18 6 Q-24 20 -18 24 Q-12 20 -18 6 Z" fill="#CFE8FF" stroke="#fff" strokeWidth={2} />
    </>
  ) },
  { x: 735, y: 235, c1: "#D9CBFA", c2: "#A48BDE", rim: "#fff", face: ( // calma: ojos cerrados y sonrisa suave
    <>
      <path d="M-30 -8 Q-19 2 -8 -8" {...D} /><path d="M8 -8 Q19 2 30 -8" {...D} />
      <path d="M-18 16 Q0 32 18 16" {...D} />
      <ellipse cx={-30} cy={10} rx={9} ry={5} fill="#F4A8C8" opacity={0.6} /><ellipse cx={30} cy={10} rx={9} ry={5} fill="#F4A8C8" opacity={0.6} />
    </>
  ) },
];

/** Cinta de onda: arco que sale de la copa, sube y baja sobre su cara (los arcos van anidados, no se cruzan). Curva cuadratica + ondulacion senoidal. */
const ribbon = (x1: number, y1: number, x2: number, y2: number, cy: number, k: number) => {
  const cx = (x1 + x2) / 2 + 40, pts: string[] = [];
  for (let i = 0; i <= 80; i++) {
    const t = i / 80, u = 1 - t;
    const x = u * u * x1 + 2 * u * t * cx + t * t * x2, y = u * u * y1 + 2 * u * t * cy + t * t * y2;
    const dx = 2 * u * (cx - x1) + 2 * t * (x2 - cx), dy = 2 * u * (cy - y1) + 2 * t * (y2 - cy), l = Math.hypot(dx, dy);
    const w = Math.sin(t * Math.PI * 9 + k * 1.3) * 7 * Math.sin(Math.PI * t);
    pts.push(`${i ? "L" : "M"}${(x - (dy / l) * w).toFixed(1)} ${(y + (dx / l) * w).toFixed(1)}`);
  }
  return pts.join(" ");
};
const TOP = [50, 36, 22, 8]; // altura del arco de cada cinta (la mas lejana, la mas alta)

export const ThumbEM053Bcover2: React.FC = () => (
  <AbsoluteFill style={{ background: "#fff", overflow: "hidden", fontFamily: 'Impact, "Arial Black", sans-serif' }}>
    <Img src={staticFile("illustrations/em053b-cover-headphones.png")} style={{ position: "absolute", left: -5, top: 0, width: 1376 * S, height: 720, filter: "contrast(1.1) saturate(1.2) brightness(1.02)" }} />
    <AbsoluteFill style={{ boxShadow: "inset 0 0 140px 20px rgba(40,20,70,.35)" }} />
    <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        {MOODS.map((m, i) => (
          <React.Fragment key={i}>
            <linearGradient id={`rb${i}`} gradientUnits="userSpaceOnUse" x1={CUP.x} y1={CUP.y} x2={m.x} y2={m.y}>
              <stop offset="0" stopColor="#fff" /><stop offset="0.5" stopColor={m.c1} /><stop offset="1" stopColor={m.c2} />
            </linearGradient>
            <radialGradient id={`dk${i}`} cx="35%" cy="28%" r="80%"><stop offset="0" stopColor={m.c1} /><stop offset="1" stopColor={m.c2} /></radialGradient>
          </React.Fragment>
        ))}
        <filter id="gl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7" /></filter>
        <filter id="sh" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#000" floodOpacity="0.5" /></filter>
      </defs>
      {MOODS.map((m, i) => {
        const d = ribbon(CUP.x - 22, CUP.y, m.x + 18, m.y - 56, TOP[3 - i], i + 1);
        return (
          <g key={i}>
            <path d={d} stroke={m.c1} strokeWidth={22} fill="none" strokeLinecap="round" filter="url(#gl)" opacity={0.75} />
            <path d={d} stroke="#fff" strokeWidth={21} fill="none" strokeLinecap="round" opacity={0.9} />
            <path d={d} stroke={`url(#rb${i})`} strokeWidth={14} fill="none" strokeLinecap="round" />
          </g>
        );
      })}
      {MOODS.map((m, i) => (
        <g key={i} transform={`translate(${m.x} ${m.y}) scale(1.12)`}>
          <circle r={78} fill={m.c1} opacity={0.65} filter="url(#gl)" />
          <g filter="url(#sh)">
            <circle r={62} fill={`url(#dk${i})`} stroke={m.rim} strokeWidth={7} />
          </g>
          <ellipse cx={-18} cy={-38} rx={30} ry={13} fill="#fff" opacity={0.3} transform="rotate(-20 -18 -38)" />
          {m.face}
        </g>
      ))}
    </svg>
    <div style={{ position: "absolute", left: -40, top: 440, width: 800, height: 270, transform: "rotate(-3deg)", background: "#FFD21F", boxShadow: "0 8px 0 rgba(0,0,0,.35), 0 16px 28px rgba(0,0,0,.45)", display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 90 }}>
      {["BLAME", "THE MUSIC"].map((w) => (
        <span key={w} style={{ fontSize: 124, lineHeight: 1.02, color: INK, letterSpacing: 4, whiteSpace: "nowrap", WebkitTextStroke: "12px #fff", paintOrder: "stroke fill" }}>{w}</span>
      ))}
    </div>
    <div style={{ position: "absolute", right: 20, top: 16, background: "rgba(255,255,255,.88)", color: "#0A1A4A", fontFamily: "Segoe UI, sans-serif", fontSize: 24, padding: "2px 14px", borderRadius: 14 }}>Illustrative image</div>
  </AbsoluteFill>
);
