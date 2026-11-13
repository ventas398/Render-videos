import React from "react";
import { AbsoluteFill } from "remotion";
import { Grain } from "./shared";
import { C, HAND, Cup, Bulb, Lens, Bolt, Popcorn, Pocket, Roll } from "./C";

// Familia C (cuaderno/sobremesa) en tres variantes: 1 limpio, 2 collage, 3 mesa de cafeteria.
export const INK = "#26407A";
export const BLACK = '"Segoe UI Black", "Segoe UI", sans-serif';
export const SERIF = '"Georgia Pro", Georgia, serif';
const at = (x: number, y: number, s: number, r = 0) => `translate(${x},${y}) rotate(${r}) scale(${s})`;
const ln = { stroke: C.brown, strokeWidth: 5, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" } as const;
const cream = "#FFF6E3";

export const Defs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id="dwob" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves={2} seed={4} result="w" /><feDisplacementMap in="SourceGraphic" in2="w" scale={9} /></filter>
    <filter id="dtear" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={3} seed={8} result="w" /><feDisplacementMap in="SourceGraphic" in2="w" scale={14} /></filter>
    <filter id="dsh" x="-10%" y="-10%" width="125%" height="135%"><feDropShadow dx={0} dy={16} stdDeviation={14} floodColor="#3A2619" floodOpacity={0.35} /></filter>
    <filter id="dstamp" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={2} result="n" /><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -9 7" result="m" /><feComposite in="SourceGraphic" in2="m" operator="in" result="s" /><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={1} seed={5} result="w" /><feDisplacementMap in="s" in2="w" scale={5} /></filter>
    <filter id="dsh2" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx={6} dy={10} stdDeviation={7} floodColor="#3A2619" floodOpacity={0.4} /></filter>
  </svg>
);

const Spark: React.FC<{ c?: string }> = ({ c = C.terra }) => <path d="M0 -26 Q4 -4 26 0 Q4 4 0 26 Q-4 4 -26 0 Q-4 -4 0 -26 Z" fill={c} stroke={C.brown} strokeWidth={4} strokeLinejoin="round" />;
const Torn: React.FC<{ x: number; y: number; w: number; h: number; c: string; r?: number }> = ({ x, y, w, h, c, r = 0 }) => (
  <g filter="url(#dsh)" transform={`rotate(${r} ${x + w / 2} ${y + h / 2})`}><rect x={x} y={y} width={w} height={h} fill={c} filter="url(#dtear)" /></g>
);
const Tape: React.FC<{ x: number; y: number; c: string; r?: number; w?: number }> = ({ x, y, c, r = 0, w = 170 }) => (
  <rect x={x} y={y} width={w} height={44} fill={c} opacity={0.85} transform={`rotate(${r} ${x + w / 2} ${y + 22})`} filter="url(#dtear)" />
);


const VERD = [["REAL", "#2F7A3B"], ["MYTH", "#C0392B"], ["WHY?", INK]] as const;
export const Stamp: React.FC<{ text: string; color: string; rot: number; size?: number }> = ({ text, color, rot, size = 56 }) => (
  <div style={{ transform: `rotate(${rot}deg)`, border: `${Math.max(2, size / 9)}px solid ${color}`, color, fontFamily: BLACK, fontSize: size, letterSpacing: size / 12, padding: `${size / 14}px ${size / 3}px`, borderRadius: size / 6, lineHeight: 1.1, filter: "url(#dstamp)", opacity: 0.92, whiteSpace: "nowrap" }}>{text}</div>
);
export const Verdict: React.FC<{ v: "1" | "2" | "3" }> = ({ v }) => (
  <div style={{ display: "flex", alignItems: "center", gap: v === "2" ? 14 : 22 }}>
    {VERD.map(([t, col], i) => v === "2" ? <Stamp key={t} text={t} color={col} rot={[-4, 3, -2][i]} size={20} /> : v === "1" ? (
      <div key={t} style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: HAND, fontWeight: 700, fontSize: 28, color: C.brown }}>
        <svg width={30} height={30} viewBox="0 0 30 30" style={{ overflow: "visible" }}><rect x={2} y={2} width={26} height={26} fill="none" stroke={C.brown} strokeWidth={3} strokeLinejoin="round" />{i === 0 && <path d="M5 16 L13 25 L33 -4" fill="none" stroke={C.terra} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />}</svg>{t}
      </div>
    ) : (
      <div key={t} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 28, color: INK, padding: "0 10px", border: i === 0 ? `3px solid ${C.terra}` : "3px solid transparent", borderRadius: "50% 45% 52% 48%" }}>{t}</div>
    ))}
  </div>
);

// ---------- C1: cuaderno limpio, un solo acento ----------
const LLens: React.FC = () => (<g><circle cx={84} cy={78} r={60} {...ln} /><circle cx={84} cy={78} r={44} {...ln} strokeWidth={2.5} opacity={0.4} /><path d="M128 122 L176 176" {...ln} strokeWidth={20} /><path d="M148 144 L176 176" stroke={C.terra} strokeWidth={9} strokeLinecap="round" /></g>);
const LCup: React.FC = () => (<g><path d="M44 84 H152 V112 Q152 160 98 160 Q44 160 44 112 Z" {...ln} /><path d="M152 96 Q190 94 188 124 Q184 146 150 144" {...ln} /><ellipse cx={98} cy={168} rx={74} ry={13} {...ln} /><path d="M72 62 Q60 46 74 32 Q86 18 72 4 M104 64 Q92 48 106 34 Q118 20 104 6 M136 62 Q124 46 138 32 Q150 18 136 4" {...ln} stroke={C.terra} strokeWidth={4} /></g>);

export const Banner1: React.FC = () => (
  <AbsoluteFill style={{ background: "#FDFBF5" }}>
    <Defs />
    <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(180deg, transparent 0, transparent 70px, rgba(60,110,190,.22) 70px, rgba(60,110,190,.22) 72px)", backgroundPositionY: 30 }} />
    <div style={{ position: "absolute", left: 96, top: 0, width: 3, height: 1440, background: "rgba(217,88,43,.6)" }} />
    <div style={{ position: "absolute", left: 108, top: 0, width: 2, height: 1440, background: "rgba(217,88,43,.35)" }} />
    <svg width={2560} height={1440} style={{ position: "absolute", left: 0, top: 0 }}>
      <g filter="url(#dwob)">
        <g transform={at(190, 590, 1.55)}><LLens /></g>
        <g transform={at(2090, 590, 1.55)}><LCup /></g>
      </g>
    </svg>
    <div style={{ position: "absolute", left: 0, width: 2560, top: 604, textAlign: "center", fontFamily: SERIF, fontSize: 108, color: C.brown, whiteSpace: "nowrap" }}>
      The{" "}
      <span style={{ position: "relative", display: "inline-block" }}>
        Everyday
        <svg viewBox="0 0 100 60" preserveAspectRatio="none" style={{ position: "absolute", left: -36, top: -6, width: "calc(100% + 72px)", height: "122%", overflow: "visible", filter: "url(#dwob)" }}><path d="M52 4 C90 2 99 20 96 34 C92 52 64 58 40 57 C12 56 -2 42 3 26 C8 10 30 6 66 3" fill="none" stroke={C.terra} strokeWidth={6} strokeLinecap="round" vectorEffect="non-scaling-stroke" /></svg>
        <span style={{ position: "absolute", left: "50%", top: -92, transform: "translateX(-50%) rotate(-4deg)", fontFamily: HAND, fontWeight: 700, fontSize: 54, color: C.terra }}>look twice!</span>
      </span>{" "}
      <span style={{ color: C.terra, fontStyle: "italic" }}>Mystery</span>
    </div>
    <div style={{ position: "absolute", left: 0, width: 2560, top: 752, textAlign: "center", fontFamily: HAND, fontSize: 62, color: C.brown, fontWeight: 700 }}>Look again at what you stopped seeing.</div>
    <div style={{ position: "absolute", left: 0, width: 2560, top: 846, display: "flex", justifyContent: "center", alignItems: "center", gap: 36, fontFamily: HAND, fontWeight: 700, fontSize: 46, color: C.terra }}>
      Verdict:<div style={{ transform: "scale(1.3)", transformOrigin: "left center", marginRight: 100 }}><Verdict v="1" /></div>
    </div>
    <Grain w={2560} h={1440} opacity={0.12} />
  </AbsoluteFill>
);

export const Avatar1: React.FC = () => (
  <AbsoluteFill style={{ background: "transparent" }}>
    <Defs />
    <svg width={800} height={800} viewBox="0 0 800 800">
      <circle cx={400} cy={400} r={400} fill="#FBF7EE" />
      <circle cx={400} cy={400} r={372} fill="none" stroke={C.terra} strokeWidth={12} />
      <circle cx={400} cy={400} r={344} fill="none" stroke={C.brown} strokeWidth={2.5} />
      <text x={400} y={522} textAnchor="middle" fontFamily={SERIF} fontSize={290} fill={C.brown} letterSpacing={-6}>EM</text>
      <path d="M404 220 C610 212 700 330 668 430 C636 530 500 598 330 584 C150 570 96 460 128 360 C160 262 270 226 440 214" fill="none" stroke={C.terra} strokeWidth={13} strokeLinecap="round" filter="url(#dwob)" />
    </svg>
  </AbsoluteFill>
);

// ---------- C2: collage de recortes y cintas ----------
const TC = [C.terra, C.sage, C.denim, C.must, C.blush];
const clips = ["polygon(2% 5%,98% 0,100% 95%,3% 100%)", "polygon(0 3%,97% 0,100% 98%,4% 100%)", "polygon(3% 0,100% 4%,97% 100%,0 96%)"];
const Row: React.FC<{ text: string; size: number; top: number; off: number }> = ({ text, size, top, off }) => (
  <div style={{ position: "absolute", left: 0, width: 2560, top, display: "flex", justifyContent: "center", gap: size * 0.1 }}>
    {text.split("").map((ch, i) => {
      if (ch === " ") return <div key={i} style={{ width: size * 0.45 }} />;
      const k = (i + off) % 5;
      const light = k === 3 || k === 4;
      return (
        <div key={i} style={{ filter: "drop-shadow(4px 6px 0 rgba(58,38,25,.3))", transform: `rotate(${[-4, 3, -2, 4, -3, 2, -5][(i + off) % 7]}deg) translateY(${[0, 6, -4, 5, -2][i % 5]}px)` }}>
          <div style={{ width: size, height: size, background: TC[k], clipPath: clips[i % 3], color: light ? C.brown : "#fff", fontFamily: BLACK, fontSize: size * 0.7, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>{ch}</div>
        </div>
      );
    })}
  </div>
);

export const Banner2: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #E9D2A6 0%, #DDBF8F 60%, #CDA970 100%)" }}>
    <Defs />
    <svg width={2560} height={1440} style={{ position: "absolute", left: 0, top: 0 }}>
      <Torn x={50} y={470} w={380} h={440} c={C.sage} r={-4} />
      <Torn x={330} y={650} w={230} h={290} c={C.blush} r={5} />
      <Torn x={2130} y={470} w={380} h={440} c={C.denim} r={4} />
      <Torn x={2000} y={650} w={230} h={290} c={C.must} r={-5} />
      <Torn x={1020} y={80} w={520} h={110} c={C.terra} r={-2} />
      <Torn x={420} y={1120} w={440} h={120} c={C.sage} r={3} />
      <Torn x={1700} y={1150} w={400} h={110} c={C.blush} r={-3} />
      <Tape x={120} y={448} c={C.must} r={-8} />
      <Tape x={2250} y={448} c={C.blush} r={7} />
      <Tape x={1180} y={60} c={C.cream} r={4} w={200} />
      <g filter="url(#dwob)">
        <g transform={at(70, 600, 1.3)}><Cup /></g>
        <g transform={at(300, 500, 1.1, -6)}><Bulb /></g>
        <g transform={at(380, 690, 0.95, 5)}><Pocket /></g>
        <g transform={at(2150, 490, 1.5, -4)}><Lens /></g>
        <g transform={at(2000, 700, 1.0, -4)}><Popcorn /></g>
        <g transform={at(2330, 690, 1.1, 6)}><Roll /></g>
        <g transform={at(2340, 470, 0.8, 8)}><Bolt /></g>
        <g transform={at(1100, 1120, 0.8)}><Spark c={C.must} /></g>
        <g transform={at(1500, 1200, 0.8)}><Spark c={C.sage} /></g>
        <g transform={at(540, 540, 0.7)}><Spark c={C.terra} /></g>
        <g transform={at(2040, 600, 0.7)}><Spark c={C.cream} /></g>
      </g>
    </svg>
    <div style={{ position: "absolute", left: 0, width: 2560, top: 420, display: "flex", justifyContent: "center", gap: 110 }}>
      {VERD.map(([t, col], i) => <Stamp key={t} text={t} color={col} rot={[-7, 3, 6][i]} size={50} />)}
    </div>
    {[[1020, 100, 520, "Real or myth?", BLACK, 52, "#fff", -2], [420, 1120, 440, "Test it.", HAND, 70, "#fff", 3], [1700, 1150, 400, "Look closer.", HAND, 60, C.brown, -3]].map(([x, y, w, t, f, z, col, r]) => (
      <div key={t as string} style={{ position: "absolute", left: x as number, top: (y as number) + 6, width: w as number, textAlign: "center", fontFamily: f as string, fontWeight: 700, fontSize: z as number, color: col as string, transform: `rotate(${r}deg)`, lineHeight: "100px" }}>{t as string}</div>
    ))}
    <Row text="THE EVERYDAY" size={96} top={532} off={0} />
    <Row text="MYSTERY" size={150} top={636} off={2} />
    <div style={{ position: "absolute", left: 690, width: 1180, top: 818, height: 82, background: cream, filter: "url(#dtear) drop-shadow(3px 5px 0 rgba(58,38,25,.25))", transform: "rotate(-1deg)" }} />
    <div style={{ position: "absolute", left: 0, width: 2560, top: 826, textAlign: "center", fontFamily: HAND, fontSize: 56, color: C.brown, fontWeight: 700, transform: "rotate(-1deg)" }}>Look again at what you stopped seeing.</div>
    <Grain w={2560} h={1440} opacity={0.24} />
  </AbsoluteFill>
);

export const Avatar2: React.FC = () => (
  <AbsoluteFill style={{ background: "transparent" }}>
    <Defs />
    <svg width={800} height={800} viewBox="0 0 800 800">
      <defs><clipPath id="cl2"><circle cx={400} cy={400} r={400} /></clipPath></defs>
      <g clipPath="url(#cl2)">
        <circle cx={400} cy={400} r={400} fill={C.must} />
        <circle cx={190} cy={600} r={250} fill={C.denim} opacity={0.9} />
        <circle cx={640} cy={190} r={190} fill={C.blush} />
        <circle cx={400} cy={400} r={372} fill="none" stroke={cream} strokeWidth={6} strokeDasharray="22 16" strokeLinecap="round" />
        <g filter="url(#dsh)"><rect x={180} y={190} width={440} height={430} fill={cream} transform="rotate(-7 400 400)" filter="url(#dtear)" /></g>
        <text x={400} y={500} textAnchor="middle" fontFamily={BLACK} fontSize={260} fill={C.terra} transform="rotate(-7 400 400)" letterSpacing={-8}>EM</text>
        <rect x={290} y={150} width={210} height={56} fill={C.sage} opacity={0.9} transform="rotate(-7 400 400)" filter="url(#dtear)" />
      </g>
    </svg>
  </AbsoluteFill>
);

// ---------- C3: mesa de cafeteria vista desde arriba ----------
const Gingham: React.FC<{ s: number; id: string; a?: number }> = ({ s, id, a = 0.42 }) => (
  <pattern id={id} width={s} height={s} patternUnits="userSpaceOnUse"><rect width={s} height={s} fill={cream} /><rect width={s / 2} height={s} fill={C.terra} opacity={a} /><rect width={s} height={s / 2} fill={C.terra} opacity={a} /></pattern>
);

export const Banner3: React.FC = () => (
  <AbsoluteFill style={{ background: "#EBD3B0" }}>
    <Defs />
    <svg width={2560} height={1440} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs><Gingham s={160} id="g3" /><radialGradient id="vg" cx="50%" cy="50%" r="70%"><stop offset="0.55" stopColor="#3A2619" stopOpacity={0} /><stop offset="1" stopColor="#3A2619" stopOpacity={0.55} /></radialGradient></defs>
      <rect width={2560} height={1440} fill="url(#g3)" />
      <rect width={2560} height={1440} fill="url(#vg)" />
      {/* servilleta */}
      <g transform="rotate(-1.2 1280 720)">
        <g filter="url(#dsh)"><rect x={500} y={515} width={1560} height={410} fill={cream} /></g>
        <path d="M1280 515 V925 M500 720 H2060" stroke="#3A2619" strokeOpacity={0.07} strokeWidth={3} />
        <rect x={520} y={535} width={1520} height={370} fill="none" stroke={C.terra} strokeOpacity={0.45} strokeWidth={3} strokeDasharray="14 10" />
        <circle cx={1975} cy={760} r={54} fill="none" stroke="#8A5A2B" strokeWidth={9} opacity={0.2} />
      </g>
      {/* taza vista desde arriba */}
      <g filter="url(#dsh2)">
        <circle cx={420} cy={730} r={170} fill={cream} stroke={C.brown} strokeWidth={5} />
        <circle cx={420} cy={730} r={128} fill="none" stroke={C.brown} strokeWidth={2.5} opacity={0.4} />
        <rect x={500} y={706} width={96} height={46} rx={23} fill={C.terra} stroke={C.brown} strokeWidth={5} />
        <circle cx={420} cy={730} r={102} fill="#FFFDF6" stroke={C.brown} strokeWidth={5} />
        <circle cx={420} cy={730} r={80} fill="#5A3620" stroke={C.brown} strokeWidth={4} />
        <path d="M376 700 A52 52 0 0 1 430 676" stroke="#C99A6A" strokeWidth={9} strokeLinecap="round" fill="none" opacity={0.8} />
        <rect x={280} y={850} width={150} height={16} rx={8} fill="#C9C9CF" stroke={C.brown} strokeWidth={4} transform="rotate(-24 280 850)" />
      </g>
      {/* lupa */}
      <g transform="translate(2190,690) rotate(38)" filter="url(#dsh2)">
        <rect x={104} y={-17} width={250} height={34} rx={17} fill={C.terra} stroke={C.brown} strokeWidth={5} />
        <circle r={112} fill="rgba(200,225,240,.45)" stroke={C.brown} strokeWidth={14} />
        <circle r={96} fill="none" stroke="#fff" strokeOpacity={0.5} strokeWidth={4} />
        <path d="M-66 -40 A80 80 0 0 1 -10 -80" stroke="#fff" strokeWidth={9} strokeLinecap="round" fill="none" opacity={0.7} />
      </g>
      {/* lapiz y azucar (zona TV) */}
      <g transform="translate(1180,1040) rotate(-6)" filter="url(#dsh2)">
        <rect width={460} height={38} fill={C.must} stroke={C.brown} strokeWidth={5} />
        <path d="M460 0 L540 19 L460 38 Z" fill="#F0D2A8" stroke={C.brown} strokeWidth={5} strokeLinejoin="round" />
        <rect x={-46} width={46} height={38} rx={8} fill={C.blush} stroke={C.brown} strokeWidth={5} />
      </g>
      {[[1860, 1010, 8], [1950, 1060, -14], [1880, 1130, 20]].map(([x, y, r], i) => <g key={i} transform={`rotate(${r} ${x + 50} ${y + 32})`} filter="url(#dsh2)"><rect x={x} y={y} width={100} height={64} fill="#fff" stroke={C.brown} strokeWidth={4} /><rect x={x} y={y + 22} width={100} height={20} fill={[C.denim, C.blush, C.sage][i]} /></g>)}
      {[[760, 1040, 30], [840, 1110, -20], [700, 1130, 60]].map(([x, y, r], i) => <g key={i} transform={`translate(${x},${y}) rotate(${r})`} filter="url(#dsh2)"><ellipse rx={28} ry={19} fill="#5A3620" stroke={C.brown} strokeWidth={3} /><path d="M-24 0 Q0 -8 24 0" stroke={C.brown} strokeWidth={3} fill="none" /></g>)}
    </svg>
    <div style={{ position: "absolute", left: 0, width: 2560, top: 600, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 124, color: INK, whiteSpace: "nowrap", transform: "rotate(-1.2deg)" }}>The Everyday Mystery</div>
    <svg width={2560} height={1440} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d="M876 856 Q1180 874 1420 852 T1690 856" {...ln} stroke={C.terra} strokeWidth={8} filter="url(#dwob)" transform="rotate(-1.2 1280 720)" />
    </svg>
    <div style={{ position: "absolute", left: 0, width: 2560, top: 744, textAlign: "center", fontFamily: HAND, fontSize: 62, color: C.brown, fontWeight: 700, transform: "rotate(-1.2deg)" }}>Look again at what you stopped seeing.</div>
    <div style={{ position: "absolute", left: 900, top: 562, fontFamily: HAND, fontWeight: 700, fontSize: 44, color: C.terra, transform: "rotate(-4deg)" }}>real or myth?</div>
    <div style={{ position: "absolute", left: 1722, top: 842, fontFamily: HAND, fontWeight: 700, fontSize: 44, color: C.terra, transform: "rotate(-4deg)", display: "flex", alignItems: "center", gap: 8 }}><svg width={44} height={40} viewBox="0 0 44 40"><path d="M4 22 L16 34 L40 4" fill="none" stroke={C.terra} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /></svg>checked</div>
    <Grain w={2560} h={1440} opacity={0.2} />
  </AbsoluteFill>
);

export const Avatar3: React.FC = () => (
  <AbsoluteFill style={{ background: "transparent" }}>
    <Defs />
    <svg width={800} height={800} viewBox="0 0 800 800">
      <defs><Gingham s={100} id="g3a" /><clipPath id="cl3"><circle cx={400} cy={400} r={400} /></clipPath></defs>
      <g clipPath="url(#cl3)">
        <rect width={800} height={800} fill="url(#g3a)" />
        <circle cx={400} cy={400} r={400} fill="none" stroke={C.brown} strokeOpacity={0.35} strokeWidth={30} />
        <g filter="url(#dsh)"><circle cx={400} cy={400} r={270} fill={cream} stroke={C.brown} strokeWidth={6} /></g>
        <circle cx={400} cy={400} r={248} fill="none" stroke={C.terra} strokeWidth={4} strokeDasharray="12 10" />
        <circle cx={560} cy={590} r={70} fill="none" stroke="#8A5A2B" strokeWidth={12} opacity={0.22} />
        <text x={400} y={490} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={300} fill={INK} letterSpacing={-6}>EM</text>
      </g>
    </svg>
  </AbsoluteFill>
);
