import React from "react";
import { AbsoluteFill } from "remotion";
import { Grain } from "./shared";

export const A = { paper: "#F7F3EA", card: "#FFFDF8", ink: "#14213D", teal: "#0A8F8D", orange: "#E56B0F", line: "#D8CFBD" };
export const SERIF = '"Georgia Pro", Georgia, "Times New Roman", serif';
const SANS = '"Segoe UI", Arial, sans-serif';
const IMPACT = 'Impact, "Arial Black", sans-serif';

export const RoughDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={2} result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -9 7" result="m" />
      <feComposite in="SourceGraphic" in2="m" operator="in" result="s" />
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={1} seed={5} result="w" />
      <feDisplacementMap in="s" in2="w" scale={5} />
    </filter>
  </svg>
);

export const Stamp: React.FC<{ text: string; color: string; rot: number; x: number; y: number; size?: number }> = ({ text, color, rot, x, y, size = 58 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${rot}deg)`, border: `${Math.round(size / 9)}px solid ${color}`, color, fontFamily: IMPACT, fontSize: size, letterSpacing: size / 10, padding: `${size / 12}px ${size / 2.2}px`, borderRadius: size / 5, opacity: 0.9, filter: "url(#rough)", lineHeight: 1.1 }}>{text}</div>
);

const ticks = (n: number, r1: number, r2: number, major = 5) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const r = i % major === 0 ? r1 - 10 : r1;
    return <line key={i} x1={Math.cos(a) * r} y1={Math.sin(a) * r} x2={Math.cos(a) * r2} y2={Math.sin(a) * r2} />;
  });

export const BannerA: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, #FCF9F1 0%, ${A.paper} 55%, #E9DEC6 100%)` }}>
    <RoughDefs />
    {/* cuadricula tecnica */}
    <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(10,143,141,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(10,143,141,.10) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
    <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(10,143,141,.17) 1px, transparent 1px), linear-gradient(90deg, rgba(10,143,141,.17) 1px, transparent 1px)`, backgroundSize: "200px 200px" }} />
    <svg width={2560} height={1440} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <filter id="sh" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#14213D" floodOpacity="0.16" /></filter>
      </defs>
      {/* reglas arriba y abajo (solo visibles en TV) */}
      {[470, 970].map((y) => (
        <g key={y} stroke={A.ink} strokeOpacity={0.28} strokeWidth={2}>
          <line x1={120} y1={y} x2={2440} y2={y} />
          {Array.from({ length: 117 }, (_, i) => <line key={i} x1={120 + i * 20} y1={y} x2={120 + i * 20} y2={y + (i % 5 === 0 ? 22 : 11) * (y < 700 ? -1 : 1)} />)}
        </g>
      ))}
      {/* lupa tecnica (izquierda) */}
      <g transform="translate(290,716)">
        <g stroke={A.teal} strokeWidth={2} strokeDasharray="14 8" opacity={0.7}><line x1={-210} y1={0} x2={210} y2={0} /><line x1={0} y1={-210} x2={0} y2={210} /></g>
        <circle r={132} fill="rgba(255,255,255,.55)" stroke={A.ink} strokeWidth={5} />
        <circle r={112} fill="none" stroke={A.ink} strokeWidth={1.8} opacity={0.6} />
        <circle r={150} fill="none" stroke={A.teal} strokeWidth={1.5} strokeDasharray="3 9" />
        <path d="M-80 -62 A 100 100 0 0 1 -20 -100" stroke={A.ink} strokeWidth={8} strokeLinecap="round" fill="none" opacity={0.35} />
        <line x1={96} y1={96} x2={196} y2={196} stroke={A.ink} strokeWidth={34} strokeLinecap="round" />
        <line x1={96} y1={96} x2={196} y2={196} stroke={A.paper} strokeWidth={20} strokeLinecap="round" />
        <line x1={150} y1={150} x2={196} y2={196} stroke={A.orange} strokeWidth={20} strokeLinecap="round" />
        <g stroke={A.teal} strokeWidth={2}><line x1={-132} y1={-188} x2={132} y2={-188} /><line x1={-132} y1={-198} x2={-132} y2={-178} /><line x1={132} y1={-198} x2={132} y2={-178} /></g>
        <text x={0} y={-204} textAnchor="middle" fontFamily={SANS} fontSize={24} fill={A.teal} fontWeight={600}>Ø 264</text>
      </g>
      {/* mira con interrogante (derecha) */}
      <g transform="translate(2272,716)">
        <circle r={176} fill="none" stroke={A.ink} strokeWidth={2} opacity={0.5} />
        <g stroke={A.ink} strokeWidth={2} opacity={0.55}>{ticks(72, 176, 196)}</g>
        <circle r={140} fill="rgba(255,255,255,.55)" stroke={A.orange} strokeWidth={4} strokeDasharray="22 12" />
        <g stroke={A.teal} strokeWidth={2} opacity={0.7}><line x1={-210} y1={0} x2={-60} y2={0} /><line x1={60} y1={0} x2={210} y2={0} /><line x1={0} y1={-210} x2={0} y2={-70} /><line x1={0} y1={70} x2={0} y2={210} /></g>
        <text x={0} y={92} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={250} fill={A.orange}>?</text>
      </g>
      {/* tarjeta de expediente */}
      <g filter="url(#sh)">
        <rect x={530} y={545} width={1500} height={350} fill={A.card} stroke={A.ink} strokeWidth={3} />
      </g>
      <rect x={546} y={561} width={1468} height={318} fill="none" stroke={A.ink} strokeWidth={1.5} opacity={0.4} />
      {[[530, 545, 1, 1], [2030, 545, -1, 1], [530, 895, 1, -1], [2030, 895, -1, -1]].map(([x, y, sx, sy], i) => (
        <path key={i} d={`M ${x + sx * 46} ${y} L ${x} ${y} L ${x} ${y + sy * 46}`} stroke={A.orange} strokeWidth={7} fill="none" />
      ))}
      {/* rombo naranja entre reglas */}
      <line x1={760} y1={782} x2={1236} y2={782} stroke={A.ink} strokeWidth={2} opacity={0.5} />
      <line x1={1324} y1={782} x2={1800} y2={782} stroke={A.ink} strokeWidth={2} opacity={0.5} />
      <rect x={1271} y={771} width={22} height={22} fill={A.orange} transform="rotate(45 1282 782)" />
      {/* clip */}
      <g transform="translate(630,494) rotate(7)" fill="none" stroke="#8B93A6" strokeWidth={6} strokeLinecap="round">
        <path d="M18 120 V30 a20 20 0 0 1 40 0 V130 a30 30 0 0 1 -60 0 V46" />
      </g>
    </svg>
    <div style={{ position: "absolute", left: 530, width: 1500, top: 582, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: "0.46em", color: A.teal, paddingLeft: "0.46em" }}>EVERYDAY CASES  ·  FILE No. 01</div>
    <div style={{ position: "absolute", left: 530, width: 1500, top: 636, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 88, letterSpacing: "0.07em", color: A.ink, whiteSpace: "nowrap", paddingLeft: "0.07em" }}>THE EVERYDAY MYSTERY</div>
    <div style={{ position: "absolute", left: 530, width: 1500, top: 804, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 52, color: A.teal }}>Look again at what you stopped seeing.</div>
    <Stamp text="DOCUMENTED" color={A.teal} rot={-5} x={1668} y={522} size={52} />
    <Stamp text="DISPUTED" color={A.orange} rot={4} x={560} y={846} size={44} />
    <Grain w={2560} h={1440} opacity={0.22} />
  </AbsoluteFill>
);

export const AvatarA: React.FC = () => (
  <AbsoluteFill style={{ background: "transparent" }}>
    <svg width={800} height={800} viewBox="0 0 800 800">
      <defs>
        <radialGradient id="aw" cx="50%" cy="42%" r="70%"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.7" stopColor="#F7F3EA" /><stop offset="1" stopColor="#E7DBC2" /></radialGradient>
        <path id="circ" d="M400,400 m-296,0 a296,296 0 1,1 592,0 a296,296 0 1,1 -592,0" />
        <filter id="roughA"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} result="n" /><feColorMatrix in="n" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -8 5.8" result="m" /><feComposite in="SourceGraphic" in2="m" operator="in" /></filter>
      </defs>
      <circle cx={400} cy={400} r={400} fill="url(#aw)" />
      <circle cx={400} cy={400} r={378} fill="none" stroke={A.orange} strokeWidth={16} />
      <circle cx={400} cy={400} r={352} fill="none" stroke={A.ink} strokeWidth={2} />
      <g transform="translate(400,400)" stroke={A.ink} strokeWidth={2.4} opacity={0.55}>{ticks(120, 350, 330, 5)}</g>
      <text fontFamily={SANS} fontWeight={700} fontSize={31} fill={A.ink} opacity={0.8}><textPath href="#circ" textLength={1840} lengthAdjust="spacing">THE EVERYDAY MYSTERY  •  LOOK AGAIN AT WHAT YOU STOPPED SEEING  •  </textPath></text>
      <circle cx={400} cy={400} r={236} fill="#FFFFFF" stroke={A.teal} strokeWidth={4} />
      <circle cx={400} cy={400} r={222} fill="none" stroke={A.teal} strokeWidth={1.5} strokeDasharray="2 8" />
      <text x={400} y={470} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={270} fill={A.ink} letterSpacing={-4}>EM</text>
      <line x1={282} y1={520} x2={370} y2={520} stroke={A.ink} strokeWidth={4} /><line x1={430} y1={520} x2={518} y2={520} stroke={A.ink} strokeWidth={4} />
      <circle cx={400} cy={520} r={11} fill={A.orange} />
    </svg>
  </AbsoluteFill>
);
