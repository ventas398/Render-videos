import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import timing from "../episodes/SHORT-64.timing.json";
import { WordGroup, wordGroups } from "./ShortGeneric";

/**
 * SHORT-64 STORYBOARD 'Is That a Brain Behind God?' (estilo AT-A4 como SHORT-62A). Vertical 1080x1920.
 * Guion = docs\SHORT-64-GUION.md v0.1 (texto PASA LOTE-LX). Voz nube + tiempos reales de src\episodes\SHORT-64.timing.json.
 * Techo dibujado (panel de fresco simplificado, nunca liso); parte 5 = foto real PD del techo (em025-sistine-real.jpg) con credito.
 * Documentos (30 %): JAMA 1990 (p1), Neurosurgery 2010 (p3), libro de Condivi 1553 (p6). Sin cerebro realista: contorno discontinuo.
 * v1.1 (25/11): fresco REAL (PD) en p0/p10 (Creacion de Adan) y p4/p7/p8 (Separacion de la luz) con circulo; sin personaje calvo (orden 24/11).
 */
// 22/11 18:1x: voz en la nube (Kokoro am_liam) -> tiempos reales de SHORT-64.timing.json (12 partes)
const T = timing as unknown as { ends: number[]; words: [string, number, number][][]; provisional?: boolean };
const ends = T.ends;
const st = (i: number) => (i === 0 ? 0 : ends[i - 1]);
const TAIL = 4.2;
export const SHORT64A = { fps: 30, seconds: Math.ceil((ends[ends.length - 1] + TAIL) * 10) / 10 };
const FIN0 = ends[ends.length - 1] + 0.2;

const C = { ink: "#2E2418", paper: "#FFFDF4", red: "#D7263D", teal: "#1F7A8C", orange: "#E07A1F", purple: "#5A4E8C", stoneA: "#7A5A36", stoneB: "#C9A66B", frame: "#E8D3A8", sky: "#9CC3D6", cloud: "#F2EEE2", mantle: "#B8423A", skin: "#E3B48E", robe: "#C9B9D6", libA: "#4A3424", libB: "#5E4330", wood: "#9A5B2E", woodD: "#6E3F1F", night: "#1B2440", nightB: "#26325A", moon: "#F3E6B0", bill: "#7FA98A", billD: "#3F6B4E", book: "#E9DDBF" };
const FONT = '"Arial Black", "Segoe UI Black", "Helvetica Neue", Arial, sans-serif';
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const DY = 175;

const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps, t: frame / fps };
};
const useSp = () => {
  const { frame, fps } = useT();
  return (t0: number, damping = 12, stiffness = 170) =>
    frame < t0 * fps ? 0 : spring({ frame: frame - t0 * fps, fps, config: { damping, stiffness, mass: 0.55 } });
};

const Label: React.FC<{ p: number; text: string; red?: string }> = ({ p, text, red }) => {
  const size = Math.min(76, Math.floor(940 / (text.length * 0.8)));
  const i = red ? text.indexOf(red) : -1;
  return (
    <div style={{ position: "absolute", left: 540, top: 370, transform: `translate(-50%, -50%) scale(${0.4 + 0.6 * p})`, opacity: Math.min(1, p * 3), fontFamily: FONT, fontSize: size, lineHeight: 1.05, color: C.ink, whiteSpace: "nowrap", letterSpacing: 1, textAlign: "center", WebkitTextStroke: `10px ${C.paper}`, paintOrder: "stroke fill" }}>
      {i < 0 ? text : <>{text.slice(0, i)}<span style={{ color: C.red }}>{red}</span>{text.slice(i + red!.length)}</>}
    </div>
  );
};
const R: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: C.red }}>{children}</span>;

const Stamp: React.FC<{ p: number; s: string; t: string; c: string }> = ({ p, s, t, c }) => (
  <div style={{ position: "absolute", left: 540, top: 1165 + DY, transform: `translate(-50%, -50%) rotate(-6deg) scale(${1.8 - 0.8 * p})`, opacity: Math.min(1, p * 4), border: `9px solid ${c}`, borderRadius: 14, padding: "6px 22px 8px", fontFamily: FONT, color: c, whiteSpace: "nowrap", background: "rgba(255,253,244,0.92)", textAlign: "center" }}>
    <div style={{ fontSize: t.length > 12 ? 40 : 50, lineHeight: 1.05 }}>{t}</div>
    <div style={{ fontSize: 22, letterSpacing: 1 }}>{s}</div>
  </div>
);

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={660} height={760} viewBox="0 0 660 760" style={{ position: "absolute", left: 210, top: 470 + DY, overflow: "visible", transform: "scale(1.15)" }}>{children}</svg>
);

type BgKind = "stone" | "library" | "night";
const TILE: Record<BgKind, [string, string, number]> = { stone: [C.stoneA, C.stoneB, 120], library: [C.libA, C.libB, 110], night: [C.night, C.nightB, 160] };
/** Fondo: sillares de piedra (capilla), estanteria de libros (biblioteca) o cielo nocturno (luna). Nunca liso */
const Bg: React.FC<{ kind: BgKind }> = ({ kind }) => {
  const [a, b, size] = TILE[kind];
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <pattern id={`bg64-${kind}`} width={size} height={size} patternUnits="userSpaceOnUse">
          <rect width={size} height={size} fill={a} />
          <rect x={3} y={3} width={size - 6} height={size - 6} fill={b} rx={kind === "night" ? 80 : 4} opacity={kind === "night" ? 0.35 : 1} />
        </pattern>
      </defs>
      <rect width={1080} height={1920} fill={`url(#bg64-${kind})`} />
      {kind === "library" && [500, 760, 1020, 1280].map((y) => (
        <g key={y}>
          <rect x={0} y={y} width={1080} height={22} fill={C.woodD} />
          {Array.from({ length: 18 }, (_, i) => <rect key={i} x={20 + i * 58} y={y - 170 + (i % 3) * 14} width={46} height={170 - (i % 3) * 14} fill={["#7A2E2A", "#2F4F6E", "#6B5A2E", "#3F5E3A"][i % 4]} stroke={C.ink} strokeWidth={3} />)}
        </g>
      ))}
      {kind === "night" && [[120, 520], [930, 640], [260, 1500], [980, 1700], [80, 1100], [640, 1820]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={6} fill={C.moon} />)}
      <rect x={0} y={1380} width={1080} height={540} fill={kind === "night" ? "#141A30" : C.wood} />
      {kind !== "night" && [1420, 1500, 1580].map((y) => <line key={y} x1={0} y1={y} x2={1080} y2={y} stroke={C.woodD} strokeWidth={5} />)}
    </svg>
  );
};

/** Panel de techo simplificado: marco de piedra, cielo, manto rojo detras de Dios, dos brazos. brain: contorno discontinuo (lectura de 1990) */
const Fresco: React.FC<{ brain?: number; spark?: number }> = ({ brain = 0, spark = 0 }) => (
  <g>
    <rect x={0} y={60} width={660} height={660} rx={10} fill={C.frame} stroke={C.ink} strokeWidth={10} />
    <rect x={26} y={86} width={608} height={608} fill={C.sky} stroke="#8A6A3E" strokeWidth={12} />
    {[[150, 170, 70], [520, 640, 80], [130, 640, 60]].map(([x, y, r]) => <ellipse key={`${x}`} cx={x} cy={y} rx={r * 1.8} ry={r * 0.7} fill={C.cloud} opacity={0.9} />)}
    <g transform="translate(-300 -530) scale(0.92)">
      <path d="M560 760 Q760 700 900 800 Q990 900 940 1040 Q890 1170 740 1180 Q600 1185 540 1090 Q490 990 520 870 Q530 790 560 760 Z" fill={C.mantle} stroke={C.ink} strokeWidth={8} />
      <g fill="none" stroke={C.paper} strokeWidth={7} strokeDasharray="16 10" strokeLinecap="round" opacity={brain}>
        <path d="M580 900 Q600 790 720 780 Q860 770 910 880 Q950 990 860 1060 Q760 1120 650 1080 Q560 1040 580 900 Z" />
        <path d="M640 860 Q700 830 760 880 M800 830 Q860 870 840 940 M620 980 Q700 950 770 1000 M780 1040 Q850 1010 880 970" />
      </g>
    </g>
    <path d="M230 510 Q180 570 140 600" fill="none" stroke={C.skin} strokeWidth={28} strokeLinecap="round" />
    <path d="M40 690 Q70 650 95 628" fill="none" stroke={C.skin} strokeWidth={28} strokeLinecap="round" />
    <circle cx={118} cy={614} r={22 + 6 * spark} fill="none" stroke={C.red} strokeWidth={6} opacity={0.4 + 0.6 * spark} />
  </g>
);

/** p0/p10: detalle real PD de 'La creacion de Adan' con la forma marcada. Coordenadas sobre la foto reducida a 2576x1169 */
export const Creation: React.FC<{ p: number }> = ({ p }) => {
  const W = 980, k = W / 1696, H = Math.round(1169 * k);
  return (
    <AbsoluteFill>
      <Img src={staticFile("photos/em025-creation-bg.jpg")} style={{ width: "100%", height: "100%" }} />
      <div style={{ position: "absolute", left: (1080 - W) / 2, top: 662, width: W, height: H, overflow: "hidden", border: `6px solid ${C.paper}`, boxSizing: "content-box", marginLeft: -6 }}>
        <Img src={staticFile("photos/em025-creation-of-adam.jpg")} style={{ position: "absolute", left: -880 * k, top: 0, width: 2576 * k, height: H, maxWidth: "none" }} />
        <svg width={W} height={H} viewBox="880 0 1696 1169" style={{ position: "absolute", left: 0, top: 0 }}>
          <ellipse cx={1900} cy={475} rx={650} ry={445} fill="none" stroke={C.red} strokeWidth={18} strokeDasharray="46 28" strokeLinecap="round" opacity={p} />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

/** p4/p7/p8: panel real PD 'Separacion de la luz y las tinieblas' (recortado y girado) con el cuello marcado */
const Neck: React.FC<{ p: number }> = ({ p }) => (
  <AbsoluteFill>
    <Img src={staticFile("photos/em025-separation-bg.jpg")} style={{ width: "100%", height: "100%" }} />
    <div style={{ position: "absolute", left: 224, top: 590, width: 620, height: 816, border: `6px solid ${C.paper}`, boxSizing: "content-box" }}>
      <Img src={staticFile("photos/em025-separation-light-panel.jpg")} style={{ width: 620, height: 816, display: "block" }} />
      <svg width={620} height={816} viewBox="0 0 966 1272" style={{ position: "absolute", left: 0, top: 0 }}>
        <circle cx={498} cy={462} r={102 + 20 * (1 - p)} fill="none" stroke={C.paper} strokeWidth={22} opacity={p} />
        <circle cx={498} cy={462} r={102 + 20 * (1 - p)} fill="none" stroke={C.red} strokeWidth={13} opacity={p} />
      </svg>
    </div>
    <NeckZoom p={p} />
  </AbsoluteFill>
);

/** Recuadro ampliado DIBUJADO del cuello (LOTE-NJ, opcion b): cabeza echada atras vista desde abajo, sin cerebro */
const NeckZoom: React.FC<{ p: number }> = ({ p }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0 }} opacity={p}>
    <path d="M497 928 L300 990 M603 928 L780 990" stroke={C.red} strokeWidth={6} strokeLinecap="round" />
    <g transform="translate(280 990)">
      <clipPath id="neck64"><rect width={520} height={390} rx={18} /></clipPath>
      <g clipPath="url(#neck64)">
        <rect width={520} height={390} fill={C.cloud} />
        {/* cuello */}
        <path d="M178 108 Q196 210 150 300 L370 300 Q324 210 342 108 Z" fill={C.skin} stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
        <path d="M232 150 Q250 220 238 292 M288 150 Q270 220 282 292" fill="none" stroke="#B9805A" strokeWidth={8} strokeLinecap="round" />
        {/* barbilla y barba vistas desde abajo */}
        <path d="M132 0 L388 0 Q420 70 356 120 Q320 92 260 142 Q200 92 164 120 Q100 70 132 0 Z" fill="#8A5A36" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
        <path d="M196 46 Q214 76 200 96 M260 56 Q262 90 250 112 M326 46 Q306 76 320 96" fill="none" stroke="#5E3A20" strokeWidth={6} strokeLinecap="round" />
        {/* cuello de la tunica */}
        <path d="M0 270 Q100 252 150 296 Q260 352 370 296 Q420 252 520 270 L520 390 L0 390 Z" fill="#C4707C" stroke={C.ink} strokeWidth={7} />
        <rect y={338} width={520} height={52} fill={C.paper} />
      </g>
      <rect width={520} height={390} rx={18} fill="none" stroke={C.red} strokeWidth={10} />
      <text x={260} y={375} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={700} fontSize={30} fill={C.ink}>Simplified illustration of the neck</text>
    </g>
  </svg>
);

/** p1/p3: articulo simplificado (sin logos ni maquetacion real) */
const Journal: React.FC<{ p: number; a: string; b: string; c: string; brain?: boolean }> = ({ p, a, b, c, brain }) => (
  <g transform={`translate(330 ${400 + 60 * (1 - p)}) rotate(-3)`} opacity={Math.min(1, p * 2)}>
    <rect x={-260} y={-340} width={520} height={680} rx={8} fill={C.paper} stroke={C.ink} strokeWidth={8} />
    <text y={-276} textAnchor="middle" fontFamily={FONT} fontSize={46} fill={C.ink}>{a}</text>
    <text y={-226} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={700} fontSize={26} fill={C.teal}>{b}</text>
    <text y={-186} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={700} fontSize={22} fill={C.ink}>{c}</text>
    {Array.from({ length: 9 }, (_, i) => <line key={i} x1={-210} y1={-130 + i * 40} x2={i % 3 === 2 ? 40 : 210} y2={-130 + i * 40} stroke={C.ink} strokeWidth={6} opacity={0.3} />)}
    {brain && (
      <g transform="translate(60 100) scale(0.42) translate(-745 -930)" fill="none" stroke={C.red} strokeWidth={10} strokeDasharray="16 10">
        <path d="M580 900 Q600 790 720 780 Q860 770 910 880 Q950 990 860 1060 Q760 1120 650 1080 Q560 1040 580 900 Z" />
        <path d="M640 860 Q700 830 760 880 M800 830 Q860 870 840 940 M620 980 Q700 950 770 1000" />
      </g>
    )}
  </g>
);

/** p6: libro impreso del siglo XVI, abierto (sin retrato) */
const Book: React.FC<{ p: number }> = ({ p }) => (
  <g transform={`translate(330 ${430 + 50 * (1 - p)})`} opacity={Math.min(1, p * 2)}>
    <path d="M-300 -220 L0 -250 L300 -220 L300 240 L0 210 L-300 240 Z" fill="#6E3F1F" stroke={C.ink} strokeWidth={8} />
    <path d="M-280 -230 Q-140 -250 0 -225 L0 200 Q-140 175 -280 200 Z" fill={C.book} stroke={C.ink} strokeWidth={6} />
    <path d="M280 -230 Q140 -250 0 -225 L0 200 Q140 175 280 200 Z" fill={C.book} stroke={C.ink} strokeWidth={6} />
    <text x={-140} y={-150} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={30} fill={C.ink}>VITA DI</text>
    <text x={-140} y={-110} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={26} fill={C.ink}>MICHELAGNOLO</text>
    <text x={-140} y={-72} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={26} fill={C.ink}>BUONARROTI</text>
    <text x={-140} y={120} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={34} fill={C.red}>MDLIII</text>
    {Array.from({ length: 9 }, (_, i) => <line key={i} x1={40} y1={-170 + i * 38} x2={250} y2={-170 + i * 38} stroke={C.ink} strokeWidth={5} opacity={0.35} />)}
  </g>
);

/** p11 (CTA a SHORT-65 'why cold can feel wet'): vaso frio con gotas e interrogante */
const Bill: React.FC<{ p: number }> = ({ p }) => (
  <g transform={`translate(330 ${400 + 40 * (1 - p)})`} opacity={Math.min(1, p * 2)}>
    <path d="M-120 -170 L120 -170 L95 170 L-95 170 Z" fill="#CFE6F2" stroke={C.ink} strokeWidth={8} strokeLinejoin="round" />
    <path d="M-108 -60 L108 -60 L95 170 L-95 170 Z" fill="#9CCBE3" stroke="none" />
    <rect x={-60} y={-120} width={44} height={44} rx={6} fill="#EEF7FC" stroke={C.ink} strokeWidth={5} transform="rotate(12 -38 -98)" />
    {[[-70, 0], [-20, 60], [40, -10], [70, 90], [-50, 120], [10, 140]].map(([x, y], i) => (
      <path key={i} d={`M${x} ${y - 18} Q${x + 12} ${y} ${x} ${y + 10} Q${x - 12} ${y} ${x} ${y - 18} Z`} fill="#EEF7FC" stroke={C.ink} strokeWidth={3} />
    ))}
    <text x={210} y={30} textAnchor="middle" fontFamily={FONT} fontSize={110} fill={C.red} stroke={C.paper} strokeWidth={6} paintOrder="stroke">?</text>
  </g>
);

const Fin: React.FC = () => {
  const { t } = useT();
  const o = interpolate(t, [FIN0, FIN0 + 0.3], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Creation p={1} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 60px 260px" }}>
        <div style={{ background: "rgba(255,253,244,0.93)", border: `7px solid ${C.ink}`, borderRadius: 18, padding: "50px 46px", display: "flex", flexDirection: "column", gap: 36, textAlign: "center", fontFamily: FONT, color: C.ink }}>
          <div style={{ fontSize: 76, lineHeight: 1.05 }}>IS THAT A <R>BRAIN</R> BEHIND GOD?</div>
          <div style={{ fontSize: 50, lineHeight: 1.2 }}>Includes simplified illustrations.</div>
          <div style={{ fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 30, lineHeight: 1.3 }}>Sources: Meshberger, JAMA 264 (1990); Suk & Tamargo, Neurosurgery 66 (2010); Condivi, Vita di Michelagnolo Buonarroti (1553). Ceiling images: Michelangelo, Sistine Chapel ceiling - public domain.</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Short64A: React.FC = () => {
  const { t } = useT();
  const sp = useSp();
  const ease = (a: number, b: number) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const P = st;
  const part = ends.findIndex((e) => t < e);
  const k = part < 0 ? ends.length - 1 : part;
  const z = 1 + (k % 2 ? 0.07 : 0.02) * interpolate(t, [P(k), ends[k]], [0, 1], clamp) + (k % 2 ? 0 : 0.05);
  const groups = T.provisional ? [] : wordGroups(T as never);
  // sellos al EMPEZAR su parte: 2.2 DOCUMENTED (se publico), 2.6 DOCUMENTED ONE ACCOUNT, inferencia DISPUTED
  const STAMP: Record<number, { t: string; c: string; s: string }> = {
    1: { t: "DOCUMENTED", c: C.teal, s: "the claim was published" },
    6: { t: "DOCUMENTED", c: C.teal, s: "ONE ACCOUNT · Condivi, 1553" },
    10: { t: "DISPUTED", c: C.orange, s: "a brain in the fresco" },
  };
  const LAB = ["ANATOMY CODE?", "JAMA, 1990", "INTELLIGENCE, NOT ONLY LIFE", "NEUROSURGERY, 2010", "A BRAIN STEM?", "COULD HE KNOW?", "CONDIVI, 1553", "THE TWIST", "GOITER?", "PATTERN OR PLAN?", "OUR READING", "NEXT: COLD FEELS WET?"];
  const RED = ["CODE", "1990", "INTELLIGENCE", "2010", "BRAIN STEM", "KNOW", "1553", "TWIST", "GOITER", "PLAN", "READING", "NEXT"];
  const labelAt = (i: number) => (i === 0 ? 3.15 : P(i) + 0.1);
  const bg: BgKind = k === 1 || k === 3 || k === 6 ? "library" : k === 7 || k === 9 ? "night" : "stone";
  const creation = k === 0 || k === 10;
  const neck = k === 4 || k === 7 || k === 8;
  const real = creation || neck || k === 5;
  const credit = neck ? "Michelangelo, Sistine ceiling · public domain · rotated, circled" : creation ? "Michelangelo, Sistine Chapel · public domain · circle added" : "Michelangelo, Sistine Chapel ceiling · public domain";

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.stoneA }}>
      {!T.provisional && <Audio src={staticFile("audio/SHORT-64.wav")} />}
      {t < FIN0 + 0.35 && (
        <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "50% 55%" }}>
          {k === 5 ? (
            <AbsoluteFill>
              <Img src={staticFile("photos/em025-sistine-real.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + 0.08 * ease(P(5), ends[5])})` }} />
            </AbsoluteFill>
          ) : creation ? <Creation p={k === 0 ? ease(0.4, 1.1) : 0.65 + 0.35 * Math.abs(Math.sin(t * 2))} /> : neck ? <Neck p={k === 4 ? ease(P(4) + 0.5, P(4) + 1.2) : 1} /> : <Bg kind={bg} />}
          <Svg>
            {k === 2 && <Fresco brain={1} spark={ease(P(2) + 0.6, P(2) + 1.4)} />}
            {k === 1 && <Journal p={ease(P(1), P(1) + 0.6)} a="JAMA" b="Meshberger · 10 Oct 1990" c="264: 1837-41" brain />}
            {k === 3 && <Journal p={ease(P(3), P(3) + 0.6)} a="NEUROSURGERY" b="Suk & Tamargo · 2010" c="66 (5): 851" />}
            {k === 6 && <Book p={ease(P(6), P(6) + 0.6)} />}
            {k === 9 && <><g transform="translate(15 60) scale(0.55)"><Fresco brain={1} /></g><g transform="translate(470 220)"><circle r={150} fill={C.moon} stroke={C.ink} strokeWidth={8} /><circle cx={-50} cy={-35} r={22} fill="#D8C98E" /><circle cx={50} cy={-35} r={22} fill="#D8C98E" /><path d="M-60 50 Q0 100 60 50" stroke="#B8A86E" strokeWidth={14} fill="none" strokeLinecap="round" /></g></>}
            {k === 11 && <Bill p={ease(P(11), P(11) + 0.6)} />}
          </Svg>
          <Label p={sp(labelAt(k))} text={LAB[k]} red={RED[k]} />
          {STAMP[k] && <Stamp p={sp(P(k) + 0.25, 9, 220)} s={STAMP[k].s} t={STAMP[k].t} c={STAMP[k].c} />}
        </AbsoluteFill>
      )}
      {t < 3.2 && (
        <div style={{ position: "absolute", left: 40, right: 40, top: 250, opacity: interpolate(t, [0, 0.2, 2.8, 3.2], [0, 1, 1, 0], clamp), transform: "rotate(-1.5deg)", background: C.paper, border: `7px solid ${C.ink}`, borderRadius: 14, padding: "20px 26px", fontFamily: FONT, fontSize: 64, lineHeight: 1.08, color: C.ink, textAlign: "center", boxShadow: "10px 10px 0 rgba(46,36,24,0.18)" }}>
          IS THAT A <R>BRAIN</R> BEHIND GOD?
        </div>
      )}
      {t >= FIN0 && <Fin />}
      <div style={{ position: "absolute", top: 100, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontSize: 38, letterSpacing: 7, color: "#fff" }}><span style={{ background: "rgba(10,26,74,.85)", padding: "6px 26px", borderRadius: 6 }}>THE EVERYDAY MYSTERY</span></div>
      {t < FIN0 && <div style={{ position: "absolute", left: 40, top: 172, fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: real ? 28 : 32, color: C.ink, background: "rgba(255,253,244,0.85)", padding: "4px 14px", borderRadius: 6 }}>{real ? credit : "Simplified illustration"}</div>}
      <AbsoluteFill style={{ transform: "translateY(136px)" }}>
        {groups.map((g, i) => <Sequence key={`w${i}`} from={g.from} durationInFrames={g.dur} name={`words-${i}`}><WordGroup ws={g.ws} frames={g.dur} /></Sequence>)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
