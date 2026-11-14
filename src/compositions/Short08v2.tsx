// SHORT-08 V2 (el ojo del billete): camara continua sin cortes secos, rotulos con datos, sellos DOCUMENTED / MYTH.
// Primer fotograma = ultimo (ojo x3,2 sobre la pupila) para que haga bucle. Vectoriales (plan B): boceto 1776, ojo del retablo, sellos de 1935, barras de tiempo.
import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import timing from "../episodes/SHORT-08V2.timing.json";
import { WordGroup, wordGroups } from "./ShortGeneric";
import { theme, VIDEO } from "../themes/brand";

const { fps } = VIDEO;
const NAVY = "#0A1A4A", YEL = "#FFC400", INK = "#F6E7BE";
const IMP = "Impact, 'Arial Black', sans-serif";
const T = timing as unknown as { ends: number[]; gap: number; words: [string, number, number][][] };
const TAIL = 0.5, OV = 0.4, LEAD = 0.2;
export const SHORT08V2_FRAMES = Math.ceil((T.ends[T.ends.length - 1] + TAIL) * fps);
const fr = (s: number) => Math.round(s * fps);
const C = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const sm = (x: number) => x * x * (3 - 2 * x);
const S = (p: number) => (p ? T.ends[p - 1] : 0); // inicio de la frase p
/** Instante (s) de una palabra de la frase p (sin puntuacion, mayusculas ignoradas). */
const W = (p: number, w: string, k = 0) => {
  const hit = T.words[p].filter(([x]) => x.toLowerCase().replace(/[^a-z0-9-]/g, "") === w.toLowerCase());
  return S(p) + hit[k][1];
};
const END = T.ends[T.ends.length - 1] + TAIL;

type Cam = [number, number, number]; // foco x, foco y (fraccion de la imagen), escala (1 = la imagen cubre el cuadro)
type Over = React.FC<{ t: number }>;
type ShotDef = { p: number; img?: string; ar?: number; a: Cam; b: Cam; ease?: "out" | "in" | "io"; tr?: "l" | "r" | "u"; dim?: number; blur?: [number, number]; tag: string; over?: Over; bg?: Over; imgOver?: Over };

/** Rotulo Impact grande con golpe de entrada. */
const Pop: React.FC<{ a: number; b: number; y: number; s: number; c?: string; rot?: number; children: React.ReactNode }> = ({ a, b, y, s, c = YEL, rot = 0, children }) => (
  <Sequence from={fr(a)} durationInFrames={Math.max(fr(b) - fr(a), 4)}>
    <PopIn y={y} s={s} c={c} rot={rot} n={Math.max(fr(b) - fr(a), 4)}>{children}</PopIn>
  </Sequence>
);
const PopIn: React.FC<{ y: number; s: number; c: string; rot: number; n: number; children: React.ReactNode }> = ({ y, s, c, rot, n, children }) => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", left: 20, right: 20, top: y, textAlign: "center", fontFamily: IMP, fontSize: s, lineHeight: 1.02, color: c, opacity: interpolate(f, [n - 3, n], [1, 0], C), transform: `rotate(${rot}deg) scale(${interpolate(f, [0, 5], [1.4, 1], C) * (1 + 0.04 * f / n)})`, WebkitTextStroke: `10px ${NAVY}`, paintOrder: "stroke fill", textShadow: `0 8px 24px ${NAVY}` }}>{children}</div>;
};

/** Sello de papel (DOCUMENTED / MYTH) con golpe suave. */
const Stamp: React.FC<{ a: number; b: number; y: number; word: string; sub: string; c: string; rot: number; small?: boolean }> = ({ a, b, y, word, sub, c, rot, small }) => (
  <Sequence from={fr(a)} durationInFrames={Math.max(fr(b) - fr(a), 4)}>
    <StampIn y={y} word={word} sub={sub} c={c} rot={rot} small={small} n={Math.max(fr(b) - fr(a), 4)} />
    {!small && <Audio src={staticFile("audio/sfx/thud.wav")} volume={0.1} />}
  </Sequence>
);
const StampIn: React.FC<{ y: number; word: string; sub: string; c: string; rot: number; small?: boolean; n: number }> = ({ y, word, sub, c, rot, small, n }) => {
  const f = useCurrentFrame();
  const sc = (small ? 0.42 : 1) * interpolate(f, [0, 7], [1.8, 1], C);
  return (
    <div style={{ position: "absolute", left: small ? 40 : 90, top: y, width: small ? 760 : 900, transformOrigin: "0 0", opacity: interpolate(f, [0, 4, n - 5, n], [0, 1, 1, 0], C), transform: `rotate(${rot}deg) scale(${sc})`, border: `14px solid ${c}`, borderRadius: 18, background: "rgba(247,243,234,.94)", padding: "12px 10px", textAlign: "center", color: c, fontFamily: IMP }}>
      <div style={{ fontSize: word.length > 6 ? 150 : 200, lineHeight: 1.05 }}>{word}</div>
      <div style={{ fontFamily: theme.font, fontWeight: 800, fontSize: 56, color: theme.ink }}>{sub}</div>
    </div>
  );
};

/** Cifra que sube de 0 a n entre a y b (s). */
const Count: React.FC<{ a: number; b: number; end: number; to: number }> = ({ a, b, end, to }) => {
  const f = useCurrentFrame();
  const k = sm(Math.min(f / Math.max(fr(b - a), 1), 1));
  return <div style={{ position: "absolute", left: 20, right: 20, top: 300, textAlign: "center", fontFamily: IMP, fontSize: 470, lineHeight: 1, color: YEL, opacity: interpolate(f, [fr(end - a) - 3, fr(end - a)], [1, 0], C), transform: `scale(${interpolate(f, [0, 5], [1.3, 1], C)})`, WebkitTextStroke: `12px ${NAVY}`, paintOrder: "stroke fill", textShadow: `0 8px 24px ${NAVY}` }}>{Math.round(to * k)}</div>;
};

/** Barra de tiempo vectorial: relleno entre dos fechas. */
const Bar: React.FC<{ t: number; a: number; b: number; end: number; l0: string; l1: string; fill: [number, number]; y?: number }> = ({ t, a, b, end, l0, l1, fill, y = 1120 }) => {
  if (t < a || t > end) return null;
  const k = sm(Math.min(Math.max((t - a) / (b - a), 0), 1));
  const o = Math.min((t - a) / 0.15, 1, (end - t) / 0.15);
  return (
    <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, opacity: o }}>
      <rect x={90} y={y} width={900} height={34} rx={17} fill="rgba(10,26,74,.85)" stroke="#fff" strokeWidth={4} />
      <rect x={90} y={y} width={900 * (fill[0] + (fill[1] - fill[0]) * k)} height={34} rx={17} fill={YEL} />
      <text x={90} y={y + 100} fontFamily={IMP} fontSize={72} fill="#fff" stroke={NAVY} strokeWidth={9} paintOrder="stroke">{l0}</text>
      <text x={990} y={y + 100} textAnchor="end" fontFamily={IMP} fontSize={72} fill={YEL} stroke={NAVY} strokeWidth={9} paintOrder="stroke">{l1}</text>
    </svg>
  );
};

/** Ojo vectorial (almendra, iris, pupila) dibujado con trazo; k = progreso 0-1. */
const EyeVec: React.FC<{ cx: number; cy: number; r: number; k: number; col: string; w: number; rot?: number }> = ({ cx, cy, r, k, col, w, rot = 0 }) => (
  <g transform={`rotate(${rot} ${cx} ${cy})`} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round">
    <path pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(k * 1.6, 1)} d={`M ${cx - r} ${cy} Q ${cx} ${cy - r * 0.95} ${cx + r} ${cy} Q ${cx} ${cy + r * 0.95} ${cx - r} ${cy}`} />
    <circle pathLength={1} cx={cx} cy={cy} r={r * 0.4} strokeDasharray={1} strokeDashoffset={1 - Math.min(Math.max(k * 2 - 0.6, 0), 1)} />
    <circle cx={cx} cy={cy} r={r * 0.17} fill={col} opacity={k > 0.85 ? 1 : 0} />
  </g>
);

/** N1: boceto de 1776 (ojo en triangulo radiante) sobre una hoja, se dibuja solo. */
const Sketch: Over = ({ t }) => {
  const t0 = W(7, "sketches"), tg = W(7, "glowing");
  const d = (a: number, dur: number) => Math.min(Math.max((t - a) / dur, 0), 1);
  const glow = d(tg, 0.5) * (1 + 0.08 * Math.sin(t * 7));
  const sc = 1 + 0.1 * d(S(7), 4.8);
  const rays = Array.from({ length: 21 }, (_, i) => (-170 + i * 8.5) * Math.PI / 180);
  return (
    <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, opacity: interpolate(t, [S(7) - 0.1, S(7) + 0.3], [0, 1], C), transform: `scale(${sc})`, transformOrigin: "540px 780px" }}>
      <g transform="translate(0 70) rotate(-2.5 540 780)">
        <rect x={150} y={330} width={780} height={900} rx={8} fill="rgba(14,12,8,.5)" stroke="#F2E8D0" strokeWidth={4} style={{ filter: "drop-shadow(0 22px 30px rgba(0,0,0,.45))" }} />
        <circle cx={540} cy={800} r={420 * glow} fill={YEL} opacity={0.35 * Math.min(glow, 1)} style={{ filter: "blur(60px)" }} />
        <g fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round">
          <path pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d(t0, 0.9)} d="M 540 450 L 300 1030 L 780 1030 Z" />
          {rays.map((a, i) => <path key={i} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d(t0 + 0.9 + i * 0.015, 0.4)} strokeWidth={6} d={`M ${540 + Math.cos(a) * 330} ${800 + Math.sin(a) * 330} L ${540 + Math.cos(a) * 395} ${800 + Math.sin(a) * 395}`} />)}
        </g>
        <EyeVec cx={540} cy={830} r={120} k={d(t0 + 0.9, 0.9)} col={INK} w={9} />
      </g>
    </svg>
  );
};

/** N2: ojo vectorial dentro del triangulo radiante del retablo (coordenadas de la imagen, 1000x1000). */
const TrinityEye: Over = ({ t }) => {
  const a = W(9, "trinity") - 1.3;
  return <svg viewBox="0 0 1000 1000" style={{ position: "absolute", inset: 0 }}><EyeVec cx={801} cy={138} r={27} k={Math.min(Math.max((t - a) / 0.8, 0), 1)} col="#7A3B0A" w={3.2} rot={-12} /></svg>;
};

/** N3: los dos sellos del reverso del billete (1935), dibujo simplificado. */
const Seals: Over = ({ t }) => {
  const k = Math.min(Math.max((t - S(21)) / 5, 0), 1);
  const ring = (cx: number) => (
    <>
      <circle cx={cx} cy={960} r={240} fill="#EFE7D2" stroke={theme.ink} strokeWidth={8} />
      <circle cx={cx} cy={960} r={212} fill="none" stroke={theme.teal} strokeWidth={5} strokeDasharray="3 12" strokeLinecap="round" />
      <circle cx={cx} cy={960} r={192} fill="none" stroke={theme.ink} strokeWidth={4} />
    </>
  );
  const fe = (l: number, w: number) => `M 0 ${-w} C ${l * 0.45} ${-w * 1.7} ${l * 0.85} ${-w * 1.3} ${l} 0 C ${l * 0.85} ${w * 1.3} ${l * 0.45} ${w * 1.7} 0 ${w} Z`;
  const FEA = [[14, 104], [-2, 134], [-18, 150], [-34, 152], [-50, 140], [-66, 120]];
  const wing = (m: number) => (
    <g transform={`scale(${m} 1)`} fill={theme.ink} stroke="#EFE7D2" strokeWidth={2.5} strokeLinejoin="round">
      {FEA.map(([an, l]) => <path key={an} transform={`translate(30 -38) rotate(${an})`} d={fe(l, 10)} />)}
      <ellipse cx={52} cy={-42} rx={40} ry={26} transform="rotate(-28 52 -42)" />
    </g>
  );
  const tail = [64, 77, 90, 103, 116].map((an) => <path key={an} transform={`translate(0 36) rotate(${an})`} d={fe(80, 11)} fill={theme.ink} stroke="#EFE7D2" strokeWidth={2.5} />);
  const toes = (m: number) => <path d={`M ${22 * m} 58 L ${32 * m} 98 M ${32 * m} 98 L ${50 * m} 110 M ${32 * m} 98 L ${34 * m} 116 M ${32 * m} 98 L ${18 * m} 110`} stroke="#F2B01E" strokeWidth={8} strokeLinecap="round" fill="none" />;
  return (
    <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.1 * k})`, transformOrigin: "540px 960px" }}>
      {ring(270)}
      <g transform="translate(270 967) scale(.95)">
        <clipPath id="shd8"><path d="M -28 -22 H 28 V 22 Q 28 62 0 76 Q -28 62 -28 22 Z" /></clipPath>
        {tail}{wing(1)}{wing(-1)}
        <ellipse cx={0} cy={4} rx={46} ry={62} fill={theme.ink} />
        {toes(-1)}{toes(1)}
        <path d="M -84 104 Q -52 118 -26 100" stroke={theme.teal} strokeWidth={5} fill="none" strokeLinecap="round" />
        {[[-72, 108, -30], [-58, 111, 25], [-46, 110, -35], [-34, 105, 30]].map(([x, y, r]) => <ellipse key={x} cx={x} cy={y - 8} rx={11} ry={5} transform={`rotate(${r} ${x} ${y - 8})`} fill={theme.teal} />)}
        {[96, 104, 112].map((y, i) => <path key={y} d={`M 26 ${y} L ${84 - i * 2} ${y - 10 + i * 5}`} stroke={theme.orange} strokeWidth={4} strokeLinecap="round" />)}
        <path d="M 84 90 L 100 83 L 86 100 Z M 82 98 L 98 94 L 82 108 Z" fill={theme.orange} />
        <g clipPath="url(#shd8)">
          <rect x={-28} y={-22} width={56} height={100} fill="#EFE7D2" />
          {[-19, -6, 7, 20].map((x) => <rect key={x} x={x - 3} y={0} width={6} height={80} fill={theme.orange} />)}
          <rect x={-28} y={-22} width={56} height={22} fill={theme.teal} />
        </g>
        <path d="M -28 -22 H 28 V 22 Q 28 62 0 76 Q -28 62 -28 22 Z" fill="none" stroke="#EFE7D2" strokeWidth={5} />
        <path d="M -30 -98 C -30 -122 -8 -130 8 -120 C 22 -112 24 -92 18 -78 C 24 -62 32 -46 38 -30 L -38 -30 C -30 -48 -24 -62 -28 -76 C -30 -84 -30 -92 -30 -98 Z" fill="#fff" stroke={theme.ink} strokeWidth={4} strokeLinejoin="round" />
        <path d="M -29 -106 C -54 -108 -62 -90 -52 -72 C -50 -84 -40 -90 -29 -90 Z" fill="#F2B01E" stroke={theme.ink} strokeWidth={3.5} strokeLinejoin="round" />
        <circle cx={-12} cy={-104} r={4.5} fill={theme.ink} />
        <path d="M -22 -112 L 0 -108" stroke={theme.ink} strokeWidth={3.5} strokeLinecap="round" />
      </g>
      {ring(810)}
      <g transform="translate(810 975)">
        {Array.from({ length: 17 }, (_, i) => { const a = (-165 + i * 9.7) * Math.PI / 180; return <path key={i} d={`M ${Math.cos(a) * 105} ${-70 + Math.sin(a) * 105} L ${Math.cos(a) * 150} ${-70 + Math.sin(a) * 150}`} stroke={YEL} strokeWidth={7} strokeLinecap="round" />; })}
        <path d="M -118 112 L 0 -30 L 118 112 Z" fill="#D7C79A" stroke={theme.ink} strokeWidth={6} strokeLinejoin="round" />
        {[20, 46, 72, 98].map((y) => <path key={y} d={`M ${-118 + (y + 30) * 0.9 - 6} ${y + 14} H ${118 - (y + 30) * 0.9 + 6}`} stroke={theme.ink} strokeWidth={3} opacity={0.6} />)}
        <path d="M -52 -42 L 0 -130 L 52 -42 Z" fill="#EFE7D2" stroke={theme.ink} strokeWidth={6} strokeLinejoin="round" />
        <EyeVec cx={0} cy={-68} r={28} k={1} col={theme.ink} w={5} />
      </g>
    </svg>
  );
};

/** Ojo con una cruz (frase 17: las ideas de Franklin no llevaban ojo). */
const NoEye: Over = ({ t }) => {
  const k = Math.min(Math.max((t - S(17) - 0.25) / 0.3, 0), 1);
  return (
    <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, opacity: interpolate(t, [S(17), S(17) + 0.15, S(18) - 0.1, S(18)], [0, 1, 1, 0], C) }}>
      <g style={{ filter: `drop-shadow(0 6px 14px ${NAVY})` }}>
        <EyeVec cx={540} cy={560} r={170} k={1} col="#fff" w={18} />
        <circle cx={540} cy={560} r={236} fill="none" stroke="#E5252A" strokeWidth={28} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} transform="rotate(-135 540 560)" />
        <path d="M 373 393 L 707 727" stroke="#E5252A" strokeWidth={32} strokeLinecap="round" strokeDasharray={1} pathLength={1} strokeDashoffset={1 - k} />
      </g>
    </svg>
  );
};

const SHOTS: ShotDef[] = [
  { p: 0, img: "em025-bill-eye", a: [0.51, 0.3, 3.2], b: [0.51, 0.34, 1.15], ease: "out", tag: "US $1 reverse · public domain" },
  { p: 1, img: "em025-lodge-handshake", a: [0.45, 0.52, 1.05], b: [0.52, 0.52, 1.2], tag: "Illustrative image" },
  { p: 2, img: "em025-stamp-desk", a: [0.5, 0.55, 1.1], b: [0.66, 0.55, 1.25], tr: "r", tag: "Illustrative image" },
  { p: 3, img: "em025-philadelphia-1776-committee-room-v2", ar: 1376 / 768, a: [0.2, 0.45, 1.0], b: [0.74, 0.5, 1.3], tag: "AI illustration, not portraits" },
  { p: 6, img: "em025-secretary-desk", a: [0.45, 0.25, 1.0], b: [0.5, 0.68, 1.25], tr: "u", tag: "AI illustration, not a portrait" },
  { p: 7, img: "em025-secretary-desk", a: [0.5, 0.6, 1.0], b: [0.5, 0.6, 1.2], blur: [8, 2], dim: 0.2, tag: "Simplified illustration", over: Sketch },
  { p: 9, img: "em025-church-painting", a: [0.55, 0.45, 1.15], b: [0.8, 0.15, 2.4], ease: "io", tag: "Illustrative image · Simplified eye overlay", imgOver: TrinityEye },
  { p: 10, img: "em025-philadelphia-1776-committee-room-v2", ar: 1376 / 768, a: [0.35, 0.7, 1.6], b: [0.8, 0.45, 1.6], tr: "l", tag: "AI illustration, not portraits · Simplified overlay", over: ({ t }) => <Bar t={t} a={S(11)} b={S(12) - 0.4} end={S(12)} l0="1776" l1="1782" fill={[0, 1]} /> },
  { p: 12, img: "em025-artist-draft", a: [0.55, 0.68, 1.0], b: [0.55, 0.66, 1.5], tag: "AI illustration, not portraits" },
  { p: 13, img: "em025-paper-trail", a: [0.55, 0.5, 1.0], b: [0.22, 0.48, 1.5], tag: "Illustrative image" },
  { p: 14, img: "em025-bill-eye", a: [0.5, 0.5, 1.0], b: [0.51, 0.3, 1.3], dim: 0.35, tag: "US $1 reverse · public domain" },
  { p: 15, img: "em025-masonic-manual", a: [0.3, 0.45, 1.15], b: [0.68, 0.5, 1.15], tr: "l", tag: "Illustrative image" },
  { p: 16, img: "em025-philadelphia-1776-committee-room-v2b", ar: 1376 / 768, a: [0.8, 0.5, 1.15], b: [0.5, 0.55, 1.35], tag: "AI illustration, not portraits · Simplified overlay", over: NoEye },
  { p: 18, img: "em025-masonic-manual", a: [0.5, 0.5, 1.0], b: [0.72, 0.45, 1.3], tag: "Illustrative image · Simplified overlay", over: ({ t }) => <Bar t={t} a={S(19)} b={S(20) - 0.3} end={S(20)} l0="1782" l1="1790s" fill={[0.35, 1]} /> },
  { p: 20, img: "em025-wallet", a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.4], tag: "Illustrative image" },
  { p: 21, img: "em025-president-desk", a: [0.5, 0.6, 1.0], b: [0.5, 0.6, 1.1], tr: "r", blur: [10, 6], dim: 0.45, tag: "Simplified illustration", over: Seals },
  { p: 22, img: "em025-president-desk", a: [0.45, 0.6, 1.0], b: [0.45, 0.6, 1.25], tag: "AI illustration, not a portrait" },
  { p: 23, img: "em025-president-desk", a: [0.45, 0.6, 1.25], b: [0.8, 0.4, 1.0], tag: "AI illustration, not a portrait" },
  { p: 24, img: "em025-bill-eye", a: [0.5, 0.4, 1.0], b: [0.5, 0.4, 1.15], dim: 0.45, tag: "US $1 reverse · public domain · Simplified overlay", over: ({ t }) => <Bar t={t} a={S(24) + 0.3} b={S(24) + 2.3} end={S(25)} l0="1782" l1="1935" fill={[0, 1]} y={1100} /> },
  { p: 25, img: "em025-stamp-desk", a: [0.3, 0.6, 1.1], b: [0.75, 0.7, 1.3], ease: "io", tr: "u", tag: "Illustrative image" },
  { p: 27, img: "em025-bill-eye", a: [0.5, 0.5, 1.0], b: [0.51, 0.3, 3.2], ease: "in", tag: "US $1 reverse · public domain" },
];
const start = (i: number) => (i ? S(SHOTS[i].p) - LEAD : 0);

const Layer: React.FC<{ s: ShotDef; from: number; n: number }> = ({ s, from, n }) => {
  const f = useCurrentFrame();
  const t = (f + from) / fps;
  const p = Math.min(f / Math.max(n - 1, 1), 1);
  const e = s.ease === "out" ? 1 - (1 - p) ** 3 : s.ease === "in" ? p ** 1.5 : s.ease === "io" ? sm(p) : 0.55 * p + 0.45 * sm(p);
  const sc = s.a[2] * (s.b[2] / s.a[2]) ** e;
  const fx = s.a[0] + (s.b[0] - s.a[0]) * e, fy = s.a[1] + (s.b[1] - s.a[1]) * e;
  const ih = 1920 * sc, iw = ih * (s.ar ?? 1);
  const left = Math.min(Math.max(540 - fx * iw, 1080 - iw), 0), top = Math.min(Math.max(960 - fy * ih, 1920 - ih), 0);
  const k = sm(Math.min(f / fr(OV), 1));
  const slide = s.tr === "l" ? `translateX(${-(1 - k) * 1080}px)` : s.tr === "r" ? `translateX(${(1 - k) * 1080}px)` : s.tr === "u" ? `translateY(${(1 - k) * 1920}px)` : "none";
  const Over = s.over, Bg = s.bg, ImgOver = s.imgOver;
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: s.tr || from === 0 ? 1 : k, transform: slide }}>
      {Bg && <Bg t={t} />}
      {s.img && (
        <div style={{ position: "absolute", left, top, width: iw, height: ih, filter: s.blur ? `blur(${s.blur[0] + (s.blur[1] - s.blur[0]) * p}px)` : undefined }}>
          <Img src={staticFile(`illustrations/${s.img}.png`)} style={{ width: iw, height: ih }} />
          {ImgOver && <ImgOver t={t} />}
        </div>
      )}
      {s.dim ? <AbsoluteFill style={{ background: `rgba(10,26,74,${s.dim})` }} /> : null}
      {Over && <Over t={t} />}
    </AbsoluteFill>
  );
};

const Texts: React.FC = () => (
  <>
    <Pop a={0.2} b={1.5} y={230} s={520}>?</Pop>
    <Pop a={S(1) + 0.15} b={S(2) - 0.1} y={330} s={200}>SECRET</Pop>
    <Pop a={W(1, "brotherhood")} b={S(2) - 0.1} y={560} s={150} c="#fff">BROTHERHOOD?</Pop>
    <Pop a={S(2) + 0.1} b={S(3) - 0.1} y={340} s={140} c="#fff">THE</Pop>
    <Pop a={S(2) + 0.25} b={S(3) - 0.1} y={470} s={200}>PAPERWORK</Pop>
    <Pop a={S(3) + 0.1} b={S(4) - 0.1} y={300} s={250}>4 JULY</Pop>
    <Pop a={W(3, "seventeen")} b={S(4) - 0.1} y={560} s={360}>1776</Pop>
    <Pop a={S(4) + 0.1} b={S(5) - 0.1} y={330} s={190} c="#fff">NATIONAL</Pop>
    <Pop a={W(4, "seal")} b={S(5) - 0.1} y={520} s={330}>SEAL</Pop>
    <Pop a={W(5, "franklin")} b={S(6) - 0.1} y={300} s={170}>FRANKLIN</Pop>
    <Pop a={W(5, "jefferson")} b={S(6) - 0.1} y={480} s={170} c="#fff">JEFFERSON</Pop>
    <Pop a={W(5, "adams")} b={S(6) - 0.1} y={660} s={170}>ADAMS</Pop>
    <Pop a={S(6) + 0.1} b={W(6, "artist")} y={300} s={110} c="#fff">DU SIMITIÈRE</Pop>
    <Pop a={W(6, "artist")} b={S(7) - 0.1} y={300} s={240}>ARTIST</Pop>
    <Pop a={S(7) + 0.1} b={W(7, "eye")} y={300} s={140} c="#fff">AUG 1776</Pop>
    <Pop a={W(7, "eye")} b={S(8) - 0.1} y={218} s={170}>AN EYE IN</Pop>
    <Pop a={S(8) + 0.05} b={S(9) - 0.1} y={330} s={150} c="#fff" rot={-3}>DU SIMITIÈRE</Pop>
    <Pop a={W(8, "not")} b={S(9) - 0.1} y={520} s={150} c="#FF7A1F" rot={-3}>NOT A MASON</Pop>
    <Pop a={S(9) + 0.1} b={W(9, "no")} y={330} s={260}>NEW EYE?</Pop>
    <Pop a={W(9, "no")} b={W(9, "religious")} y={330} s={460} c="#FF7A1F">NO</Pop>
    <Pop a={W(9, "religious")} b={W(9, "trinity")} y={330} s={125}>RELIGIOUS ART</Pop>
    <Pop a={W(9, "trinity")} b={S(10) - 0.1} y={330} s={190}>= TRINITY</Pop>
    <Pop a={S(10) + 0.1} b={W(10, "shelves")} y={310} s={280}>AUG 20</Pop>
    <Pop a={W(10, "shelves")} b={S(11) - 0.1} y={310} s={250} c="#FF7A1F">SHELVED</Pop>
    <Pop a={W(11, "six")} b={S(12) - 0.1} y={280} s={250}>6 YEARS</Pop>
    <Pop a={W(11, "three")} b={S(12) - 0.1} y={500} s={130} c="#fff">3 COMMITTEES</Pop>
    <Pop a={W(11, "seventeen")} b={S(12) - 0.1} y={650} s={300}>1782</Pop>
    <Pop a={S(12) + 0.1} b={W(12, "unfinished")} y={300} s={240}>BARTON</Pop>
    <Pop a={W(12, "unfinished")} b={S(13) - 0.1} y={300} s={190}>UNFINISHED</Pop>
    <Pop a={W(12, "pyramid")} b={S(13) - 0.1} y={500} s={230} c="#fff">PYRAMID</Pop>
    <Pop a={S(13) + 0.1} b={S(14) - 0.1} y={300} s={120} c="#fff">SECRETARY</Pop>
    <Pop a={W(13, "charles")} b={S(14) - 0.1} y={420} s={210}>THOMSON</Pop>
    <Pop a={S(14) + 0.1} b={W(14, "approves")} y={300} s={270}>20 JUNE</Pop>
    <Pop a={W(14, "approves")} b={S(15) - 0.1} y={300} s={190} c="#fff">APPROVED</Pop>
    <Pop a={S(14) + 0.5} b={S(15) - 0.1} y={600} s={330}>1782</Pop>
    <Pop a={S(15)} b={S(16) - 0.1} y={300} s={230} c="#fff">WHERE?</Pop>
    <Pop a={W(15, "masons")} b={S(16) - 0.1} y={520} s={260}>MASONS?</Pop>
    <Pop a={S(16) + 0.1} b={W(16, "franklin")} y={300} s={170} c="#fff">ONE KNOWN MASON</Pop>
    <Pop a={W(16, "franklin")} b={S(17) - 0.1} y={460} s={250}>FRANKLIN</Pop>
    <Pop a={S(17) + 0.1} b={S(18) - 0.1} y={820} s={190}>NO EYE</Pop>
    <Pop a={S(18) + 0.1} b={W(18, "nineties")} y={300} s={180} c="#fff">MASONIC</Pop>
    <Pop a={S(18) + 0.2} b={S(19) - 0.1} y={470} s={190}>HANDBOOKS</Pop>
    <Pop a={W(18, "nineties")} b={S(19) - 0.1} y={640} s={330} c="#fff">1790s</Pop>
    <Pop a={S(19) + 0.1} b={S(20) - 0.1} y={300} s={190}>YEARS AFTER</Pop>
    <Pop a={S(19) + 0.5} b={S(20) - 0.1} y={480} s={190} c="#fff">THE SEAL</Pop>
    <Pop a={S(20) + 0.1} b={S(21) - 0.1} y={300} s={420}>WHY?</Pop>
    <Pop a={W(20, "masons")} b={S(21) - 0.1} y={650} s={230} c="#fff">MASONS?</Pop>
    <Pop a={S(21) + 0.1} b={S(22) - 0.1} y={190} s={340}>1935</Pop>
    <Pop a={W(21, "both")} b={S(22) - 0.1} y={520} s={130} c="#fff">BOTH SIDES</Pop>
    <Pop a={S(22) + 0.1} b={W(22, "mason")} y={300} s={190} c="#fff">ROOSEVELT</Pop>
    <Pop a={W(22, "approved")} b={W(22, "mason")} y={470} s={190}>APPROVED</Pop>
    <Pop a={W(22, "mason")} b={S(23) - 0.1} y={300} s={260} c="#FF7A1F">MASON</Pop>
    <Pop a={W(22, "since")} b={S(23) - 0.1} y={520} s={200}>SINCE 1911</Pop>
    <Sequence from={fr(W(24, "one"))} durationInFrames={fr(S(25) - 0.1) - fr(W(24, "one"))}><Count a={W(24, "one")} b={W(24, "fifty-three")} end={S(25) - 0.1} to={153} /></Sequence>
    <Pop a={W(24, "fifty-three")} b={S(25) - 0.1} y={800} s={210} c="#fff">YEARS</Pop>
    <Stamp a={S(25) + 0.05} b={S(27) - 0.1} y={300} word="DOCUMENTED" sub="the design story" c={theme.teal} rot={-4} />
    <Stamp a={S(26) + 0.05} b={S(27) - 0.1} y={760} word="MYTH" sub="Masons created it" c={theme.orange} rot={4} />
    <Stamp a={S(27)} b={END - 0.9} y={260} word="MYTH" sub="Masons created it" c={theme.orange} rot={0} small />
  </>
);

const Tag: React.FC = () => {
  const t = useCurrentFrame() / fps;
  const i = SHOTS.reduce((a, _, k) => (t >= start(k) + (k ? OV / 2 : 0) ? k : a), 0);
  return <div style={{ position: "absolute", left: 40, top: 178, background: "rgba(10,26,74,.85)", color: "#fff", fontFamily: theme.font, fontWeight: 700, fontSize: 32, padding: "6px 20px", borderRadius: 6 }}>{SHOTS[i].tag}</div>;
};

export const Short08v2: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / fps;
  const last = [...Array(T.ends.length).keys()].filter((i) => i && t >= S(i)).pop() ?? 0;
  const punch = last ? 0.04 * Math.exp(-(t - S(last)) / 0.1) : 0; // golpe de camara al empezar cada frase
  const groups = wordGroups(T);
  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <Audio src={staticFile("audio/SHORT-08V2.wav")} />
      <AbsoluteFill style={{ transform: `scale(${1 + punch})` }}>
        {SHOTS.map((s, i) => {
          const a = fr(start(i)), b = i + 1 < SHOTS.length ? fr(start(i + 1) + OV) : SHORT08V2_FRAMES;
          return <Sequence key={i} from={a} durationInFrames={b - a} name={`shot-${i}`}><Layer s={s} from={a} n={b - a} /></Sequence>;
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,26,74,.55) 0%, rgba(10,26,74,0) 14%, rgba(10,26,74,0) 62%, rgba(10,26,74,.82) 80%, rgba(10,26,74,.9) 100%)", pointerEvents: "none" }} />
      <Texts />
      <div style={{ position: "absolute", top: 100, left: 0, right: 0, textAlign: "center", fontFamily: theme.font, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: "#fff" }}><span style={{ background: "rgba(10,26,74,.85)", padding: "6px 26px", borderRadius: 6 }}>THE EVERYDAY MYSTERY</span></div>
      <Tag />
      {groups.map((g, k) => <Sequence key={k} from={g.from} durationInFrames={g.dur} name={`words-${k}`}><WordGroup ws={g.ws.map((x) => ({ ...x, w: x.w.replace(/[.,;:]$/, "") }))} frames={g.dur} /></Sequence>)}
    </AbsoluteFill>
  );
};
