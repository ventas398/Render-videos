import React from "react";
import { AbsoluteFill } from "remotion";
import { Grain } from "./shared";

export const C = { paper: "#F3E3C3", paper2: "#EAD3A9", cream: "#FFF6E3", brown: "#3A2619", terra: "#D9582B", must: "#F2B134", sage: "#6F9A55", denim: "#4D7EA8", blush: "#F2A99B", mute: "#7A5A44" };
export const SLAB = '"Rockwell Nova", Rockwell, "Georgia Pro", Georgia, serif';
export const HAND = '"Ink Free", "Segoe Print", "Bradley Hand ITC", cursive';

const L = { stroke: C.brown, strokeWidth: 6, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" } as const;
const blob = (c: string, extra: React.CSSProperties = {}) => ({ fill: c, style: { mixBlendMode: "multiply" as const, ...extra } });

const Wobble: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id="wob" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves={2} seed={4} result="w" />
      <feDisplacementMap in="SourceGraphic" in2="w" scale={9} />
    </filter>
  </svg>
);

// Cada garabato vive en una caja de 200x200.
export const Cup: React.FC = () => (
  <g>
    <path d="M52 92 H160 V120 Q160 168 106 168 Q52 168 52 120 Z" {...blob(C.terra)} />
    <ellipse cx={116} cy={176} rx={76} ry={14} {...blob(C.must)} />
    <path d="M44 84 H152 V112 Q152 160 98 160 Q44 160 44 112 Z" {...L} />
    <path d="M152 96 Q190 94 188 124 Q184 146 150 144" {...L} />
    <ellipse cx={98} cy={168} rx={74} ry={13} {...L} />
    <path d="M72 62 Q60 46 74 32 Q86 18 72 4" {...L} strokeWidth={5} />
    <path d="M104 64 Q92 48 106 34 Q118 20 104 6" {...L} strokeWidth={5} />
    <path d="M136 62 Q124 46 138 32 Q150 18 136 4" {...L} strokeWidth={5} />
  </g>
);

export const Bulb: React.FC = () => (
  <g>
    <path d="M108 38 a52 52 0 0 1 28 96 v20 h-56 v-20 a52 52 0 0 1 28 -96 z" {...blob(C.must)} />
    <path d="M100 30 a52 52 0 0 1 28 96 v20 h-56 v-20 a52 52 0 0 1 28 -96 z" {...L} />
    <path d="M78 156 h44 M82 170 h36 M90 184 h20" {...L} />
    <path d="M86 112 L100 82 L114 112" {...L} strokeWidth={5} />
    <path d="M30 70 L10 62 M34 36 L18 22 M170 70 L190 62 M166 36 L182 22 M100 6 V-12" {...L} strokeWidth={5} />
  </g>
);

export const Lens: React.FC = () => (
  <g>
    <circle cx={92} cy={86} r={60} {...blob(C.denim, { opacity: 0.55 })} />
    <circle cx={84} cy={78} r={60} {...L} />
    <circle cx={84} cy={78} r={46} {...L} strokeWidth={3} opacity={0.5} />
    <path d="M52 62 A 36 36 0 0 1 80 42" {...L} strokeWidth={7} opacity={0.5} />
    <path d="M128 122 L176 176" {...L} strokeWidth={22} />
    <path d="M128 122 L176 176" stroke={C.terra} strokeWidth={10} strokeLinecap="round" />
  </g>
);

export const Bolt: React.FC = () => (
  <g>
    <polygon points="118,16 62,106 100,106 82,186 152,82 112,82" {...blob(C.must)} transform="translate(9,9)" />
    <polygon points="110,10 54,100 92,100 74,180 144,76 104,76" {...L} />
  </g>
);

export const Popcorn: React.FC = () => (
  <g>
    <path d="M60 98 L152 98 L138 186 L74 186 Z" {...blob(C.terra)} transform="translate(8,6)" />
    {[[70, 78, 22], [100, 62, 28], [134, 74, 24], [86, 96, 18], [122, 96, 18], [108, 44, 18]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={C.cream} stroke={C.brown} strokeWidth={5} />)}
    <path d="M52 92 L144 92 L130 180 L66 180 Z" fill={C.cream} stroke={C.brown} strokeWidth={6} strokeLinejoin="round" />
    <path d="M82 92 L78 180 M98 92 L98 180 M114 92 L118 180" {...L} strokeWidth={5} stroke={C.terra} />
    <path d="M52 92 L144 92 L130 180 L66 180 Z" {...L} />
  </g>
);

export const Pocket: React.FC = () => (
  <g>
    <path d="M36 44 H164 V124 Q164 176 100 184 Q36 176 36 124 Z" {...blob(C.denim, { opacity: 0.8 })} transform="translate(9,8)" />
    <path d="M28 36 H156 V116 Q156 168 92 176 Q28 168 28 116 Z" {...L} />
    <path d="M44 52 H140 V114 Q140 154 92 162 Q44 154 44 114 Z" {...L} strokeWidth={3} strokeDasharray="9 9" stroke={C.terra} />
    <rect x={84} y={64} width={46} height={40} rx={6} {...L} strokeWidth={5} />
    <circle cx={108} cy={52} r={16} fill={C.must} stroke={C.brown} strokeWidth={5} />
    <path d="M108 44 V60" {...L} strokeWidth={3} />
  </g>
);

export const Roll: React.FC = () => (
  <g>
    <circle cx={88} cy={84} r={58} {...blob(C.blush)} transform="translate(9,8)" />
    <circle cx={80} cy={76} r={58} fill={C.cream} stroke={C.brown} strokeWidth={6} />
    <circle cx={80} cy={76} r={20} {...L} />
    <circle cx={80} cy={76} r={36} {...L} strokeWidth={3} opacity={0.5} />
    <path d="M132 100 Q146 128 138 150 Q132 172 150 188 L112 188 Q112 150 126 128" fill={C.cream} stroke={C.brown} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
  </g>
);

const Sparkle: React.FC<{ s?: number; c?: string }> = ({ s = 1, c = C.must }) => (
  <path d="M0 -26 Q4 -4 26 0 Q4 4 0 26 Q-4 4 -26 0 Q-4 -4 0 -26 Z" fill={c} stroke={C.brown} strokeWidth={4} strokeLinejoin="round" transform={`scale(${s})`} />
);

const at = (x: number, y: number, s: number, r = 0) => `translate(${x},${y}) rotate(${r}) scale(${s})`;

export const BannerC: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, #F8EBD0 0%, ${C.paper} 55%, ${C.paper2} 100%)` }}>
    <Wobble />
    {/* cuaderno: renglones y margen */}
    <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(180deg, transparent 0, transparent 62px, rgba(77,126,168,.26) 62px, rgba(77,126,168,.26) 64px)`, backgroundPositionY: 20 }} />
    <div style={{ position: "absolute", left: 500, top: 0, width: 3, height: 1440, background: "rgba(217,88,43,.55)" }} />
    <div style={{ position: "absolute", left: 512, top: 0, width: 2, height: 1440, background: "rgba(217,88,43,.35)" }} />
    <svg width={2560} height={1440} style={{ position: "absolute", left: 0, top: 0 }}>
      {/* mancha de taza */}
      <circle cx={2010} cy={960} r={64} fill="none" stroke="#8A5A2B" strokeWidth={10} opacity={0.13} />
      <circle cx={2012} cy={962} r={58} fill="none" stroke="#8A5A2B" strokeWidth={3} opacity={0.12} />
      {/* grupo izquierda */}
      <g filter="url(#wob)">
        <g transform={at(60, 620, 1.38)}><Cup /></g>
        <g transform={at(290, 524, 1.12, -6)}><Bulb /></g>
        <g transform={at(318, 728, 0.98, 5)}><Pocket /></g>
        <g transform={at(430, 590, 0.8)}><Sparkle s={1} /></g>
        <g transform={at(70, 540, 0.8)}><Sparkle s={0.8} c={C.blush} /></g>
        <g transform={at(48, 1010, 0.7)}><Sparkle s={0.7} /></g>
      </g>
      {/* grupo derecha */}
      <g filter="url(#wob)">
        <g transform={at(2086, 736, 1.0, -4)}><Popcorn /></g>
        <g transform={at(2100, 520, 1.3, -3)}><Lens /></g>
        <g transform={at(2300, 724, 1.08, 6)}><Roll /></g>
        <g transform={at(2380, 520, 0.8, 8)}><Bolt /></g>
        <g transform={at(2480, 700, 0.9)}><Sparkle s={0.9} c={C.blush} /></g>
        <g transform={at(2090, 700, 0.7)}><Sparkle s={0.7} /></g>
      </g>
      {/* notas adhesivas (solo TV) */}
      <g transform="translate(130,1090) rotate(-6)" filter="url(#wob)">
        <rect width={240} height={220} fill={C.must} stroke={C.brown} strokeWidth={5} />
        <rect x={20} y={-18} width={120} height={38} fill="rgba(255,255,255,.5)" stroke="none" transform="rotate(-4)" />
        <text x={120} y={140} textAnchor="middle" fontFamily={HAND} fontSize={96} fill={C.brown}>Why?</text>
      </g>
      <g transform="translate(2200,1100) rotate(5)" filter="url(#wob)">
        <rect width={250} height={210} fill={C.blush} stroke={C.brown} strokeWidth={5} />
        <text x={125} y={90} textAnchor="middle" fontFamily={HAND} fontSize={52} fill={C.brown}>check it</text>
        <text x={125} y={150} textAnchor="middle" fontFamily={HAND} fontSize={52} fill={C.brown}>twice</text>
      </g>
      <g filter="url(#wob)">
        <path d="M1050 1180 Q1280 1230 1510 1170" {...L} strokeDasharray="4 22" strokeWidth={8} opacity={0.5} />
        <path d="M980 250 Q1280 190 1590 260" {...L} strokeDasharray="4 22" strokeWidth={8} opacity={0.5} />
        <g transform={at(1640, 262, 0.7)}><Sparkle s={0.9} c={C.terra} /></g>
      </g>
    </svg>
    <div style={{ position: "absolute", left: 0, width: 2560, top: 590, textAlign: "center", fontFamily: SLAB, fontWeight: 800, fontSize: 104, isolation: "isolate", letterSpacing: "-0.01em", color: C.brown, whiteSpace: "nowrap", textShadow: `5px 5px 0 rgba(217,88,43,.9)` }}>The Everyday{" "}<span style={{ position: "relative", display: "inline-block" }}><svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", left: -18, top: 6, width: "calc(100% + 36px)", height: "92%", zIndex: -1, mixBlendMode: "multiply" }}><path d="M3 22 Q2 8 14 7 L90 4 Q98 6 97 20 L98 78 Q97 94 86 95 L12 97 Q3 95 4 80 Z" fill={C.must} opacity={0.85} /></svg>Mystery</span></div>
    <svg width={2560} height={1440} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d="M790 868 Q1000 884 1220 866 T1700 870" {...L} stroke={C.terra} strokeWidth={9} filter="url(#wob)" />
    </svg>
    <div style={{ position: "absolute", left: 0, width: 2560, top: 770, textAlign: "center", fontFamily: HAND, fontSize: 70, color: C.brown, fontWeight: 700 }}>Look again at what you stopped seeing.</div>
    <Grain w={2560} h={1440} opacity={0.26} />
  </AbsoluteFill>
);

export const AvatarC: React.FC = () => (
  <AbsoluteFill style={{ background: "transparent" }}>
    <svg width={800} height={800} viewBox="0 0 800 800">
      <defs>
        <filter id="wobA" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves={2} seed={6} result="w" /><feDisplacementMap in="SourceGraphic" in2="w" scale={14} /></filter>
      </defs>
      <circle cx={400} cy={400} r={400} fill={C.terra} />
      <circle cx={400} cy={400} r={372} fill="none" stroke={C.cream} strokeWidth={6} strokeDasharray="22 16" strokeLinecap="round" opacity={0.9} />
      <g filter="url(#wobA)">
        <circle cx={412} cy={414} r={300} fill={C.must} />
        <circle cx={400} cy={400} r={300} fill={C.cream} stroke={C.brown} strokeWidth={10} />
        <text x={414} y={506} textAnchor="middle" fontFamily={SLAB} fontWeight={800} fontSize={236} fill={C.terra} letterSpacing={-6}>EM</text>
        <text x={400} y={492} textAnchor="middle" fontFamily={SLAB} fontWeight={800} fontSize={236} fill={C.brown} letterSpacing={-6}>EM</text>
        <g transform="translate(590,226) scale(1.4)"><path d="M0 -26 Q4 -4 26 0 Q4 4 0 26 Q-4 4 -26 0 Q-4 -4 0 -26 Z" fill={C.terra} stroke={C.brown} strokeWidth={4} strokeLinejoin="round" /></g>
      </g>
    </svg>
  </AbsoluteFill>
);
