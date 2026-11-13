// EM-004 v2: fotos a planos cortos + camaras + texto cinetico + pulsos y barras animadas (mismo motor que scenes023).
import React from "react";
import { Img, staticFile } from "remotion";
import { ramp } from "../utils/anim";
import { theme } from "../themes/brand";
import { ink, orange, RED, SvgFrame, teal, useT } from "./kit";
import type { SceneProps } from "./scenes";
import { Cam } from "./kit2";
import { FULL, Kin, LEFT, Ov, Pill, pk, Pip, RIGHT, Sfx, sfxOf, Shots, Src } from "./scenes023";
import { Lab, Sm } from "./scenes025";
import type { Ev, Sh } from "./scenes023";

// Foto aun sin llegar -> foto de relleno (borrar la entrada cuando llegue).
const FB: Record<string, string> = {};
const CARD = "#FFFDF6";

type Mk = (P: (part: number, o?: number) => number, dur: number) => { shots: Sh[]; ov: React.ReactNode; ev?: Ev[]; src?: React.ReactNode; sm?: [number, number][] };
const scene = (from: number, id: string, mk: Mk): React.FC<SceneProps> => ({ cues, dur }) => {
  const P0 = pk(cues, from);
  const P = (part: number, o = 0) => (part - from >= cues.length ? dur + o : P0(part, o));
  const { shots, ov, ev = [], src, sm = [] } = mk(P, dur);
  const list = shots.map((s) => ({ ...s, id: FB[s.id] ?? s.id }));
  return (
    <>
      {/* precarga: Remotion espera a que carguen las fotos antes de capturar el fotograma (las <image> de SVG no esperan) */}
      <div style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", opacity: 0.01 }}>
        {[...new Set(list.map((s) => s.id))].map((i) => (
          <Img key={i} src={staticFile(`illustrations/em004-${i}.png`)} />
        ))}
      </div>
      <SvgFrame>
        <Cam dur={dur} z1={1.04} amt={0.6}>
          <Shots id={id} list={list} dur={dur} pfx="em004-" />
        </Cam>
        <Cam dur={dur} z1={1.05} dx={-20} amt={1.3}>
          <g style={{ filter: "drop-shadow(0 4px 7px rgba(20,33,61,0.55))" }}>{ov}</g>
        </Cam>
        <Lab text="Illustrative image" a={0} b={dur + 1} />
        {sm.map(([a, b], i) => <Sm key={i} a={a} b={b} />)}
        {src}
      </SvgFrame>
      <Sfx ev={[...sfxOf(list), ...ev]} />
    </>
  );
};

/** Pulso: anillo que se expande + brillo sobre el elemento clave de la foto (coordenadas de la foto). */
const Pulse: React.FC<{ x: number; y: number; r: number; a: number; e?: number; color?: string }> = ({ x, y, r, a, e = 1e6, color = orange }) => {
  const t = useT();
  if (t < a || t > e) return null;
  const k = ((t - a) * 0.8) % 1;
  const f = Math.min(1, (t - a) / 0.3) * Math.min(1, (e - t) / 0.3 + 0.0001);
  return (
    <g opacity={f}>
      <circle cx={x} cy={y} r={r * 0.6} fill="#FFF3C9" opacity={0.2 + 0.12 * Math.sin(t * 6)} style={{ mixBlendMode: "screen" }} />
      <circle cx={x} cy={y} r={r * (0.6 + 0.7 * k)} fill="none" stroke={color} strokeWidth={4 + 12 * (1 - k)} opacity={1 - k} />
    </g>
  );
};

/** Banda de papel tras un rotulo sobre foto (contraste). */
const Band: React.FC<{ x: number; y: number; w: number; h: number; a: number; b?: number }> = ({ x, y, w, h, a, b }) => (
  <Ov x={x} y={y} a={a} b={b} lim={1.03}>
    <rect x={-w / 2 + 8} y={-h / 2 + 10} width={w} height={h} rx={30} fill={ink} opacity={0.2} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={30} fill={CARD} opacity={0.93} stroke={teal} strokeWidth={5} />
  </Ov>
);

/** Barras que crecen (porcentajes) dentro de una tarjeta. */
const Bar: React.FC<{ x: number; y: number; a: number; b?: number; title: string; rows: [string, number, string][] }> = ({ x, y, a, b, title, rows }) => {
  const t = useT();
  const W = 780, H = 130 + rows.length * 110, g = ramp(t, a + 0.4, a + 1.6), tw = W - 300;
  return (
    <Ov x={x} y={y} a={a} b={b} lim={1.04}>
      <rect x={-W / 2 + 8} y={-H / 2 + 10} width={W} height={H} rx={28} fill={ink} opacity={0.16} />
      <rect x={-W / 2} y={-H / 2} width={W} height={H} rx={28} fill={CARD} stroke={teal} strokeWidth={6} />
      <text x={0} y={-H / 2 + 62} textAnchor="middle" fontFamily={theme.font} fontWeight={800} fontSize={38} fill={ink}>
        {title}
      </text>
      {rows.map(([lab, v, col], i) => {
        const yy = -H / 2 + 150 + i * 110, bw = (tw * v * g) / 100;
        return (
          <g key={lab}>
            <text x={-W / 2 + 32} y={yy} dominantBaseline="central" fontFamily={theme.font} fontWeight={800} fontSize={34} fill={ink}>
              {lab}
            </text>
            <rect x={-W / 2 + 250} y={yy - 28} width={tw} height={56} rx={14} fill="#E6E1D3" />
            <rect x={-W / 2 + 250} y={yy - 28} width={Math.max(0.1, bw)} height={56} rx={14} fill={col} />
            <text x={-W / 2 + 250 + 14} y={yy + 1} dominantBaseline="central" fontFamily={theme.font} fontWeight={900} fontSize={36} fill="#FFFFFF">
              {Math.round(v * g)}%
            </text>
          </g>
        );
      })}
    </Ov>
  );
};

const hook = scene(0, "hook", (P) => ({
  shots: [
    { id: "queue", t: P(0), r: FULL, f: [0.5, 0.5], mv: "in", tr: "cut" },
    { id: "queue", t: P(0, 2.9), r: RIGHT, f: [0.7, 0.35], z: 1.4, mv: "pl", tr: "wl", rot: 1.5 },
    { id: "cost", t: P(1), r: RIGHT, f: [0.5, 0.45], mv: "in", tr: "wl", rot: -1.5 },
    { id: "bucket", t: P(1, 2.5), r: FULL, f: [0.6, 0.55], mv: "in", tr: "zoom", m: (S) => <Pulse x={S * 0.66} y={S * 0.55} r={S * 0.12} a={P(1, 3.0)} e={P(2)} /> },
    { id: "building", t: P(2), r: RIGHT, f: [0.5, 0.4], mv: "pl", tr: "page", rot: 1.5 },
    { id: "ticket", t: P(2, 2.9), r: FULL, f: [0.2, 0.6], z: 1.1, mv: "pl", tr: "pop", m: (S) => <Pulse x={S * 0.2} y={S * 0.55} r={S * 0.1} a={P(2, 3.3)} e={P(3)} /> },
    { id: "counter", t: P(3), r: FULL, f: [0.7, 0.4], mv: "in", tr: "page", rot: 0 },
    { id: "counter", t: P(3, 2.7), r: LEFT, f: [0.78, 0.45], z: 1.3, mv: "in", tr: "pop", rot: -1.5, m: (S) => <Pulse x={S * 0.78} y={S * 0.45} r={S * 0.1} a={P(3, 3.0)} e={P(4)} /> },
    { id: "split", t: P(4), r: FULL, f: [0.4, 0.5], mv: "out", tr: "zoom" },
  ],
  ov: (
    <>
      <Kin x={500} y={250} text="THAT PRICE" size={130} fill={orange} a={P(0, 3.2)} b={P(1)} rot={-3} />
      <Kin x={500} y={300} text="CORN" size={120} fill={teal} a={P(1, 0.2)} b={P(1, 2.5)} rot={-3} />
      <Kin x={500} y={430} text="HEAT" size={120} fill={orange} a={P(1, 0.8)} b={P(1, 2.5)} rot={2} />
      <Kin x={500} y={560} text="SALT" size={120} a={P(1, 1.4)} b={P(1, 2.5)} rot={-2} />
      <Kin x={960} y={190} text="ONE BUCKET?" size={150} fill={orange} a={P(1, 2.8)} b={P(2)} rot={-3} />
      <Pill x={500} y={200} text="AT AMC" size={50} a={P(2, 0.2)} b={P(2, 2.9)} color={teal} />
      <Kin x={500} y={340} text="ABOUT HALF" size={130} fill={orange} a={P(2, 0.6)} b={P(2, 2.9)} rot={-3} />
      <Kin x={500} y={480} text="TO THE STUDIO" size={90} a={P(2, 1.4)} b={P(2, 2.9)} />
      <Kin x={960} y={190} text="OF YOUR TICKET" size={110} fill={teal} a={P(2, 3.2)} b={P(3)} />
      <Kin x={500} y={250} text="ANOTHER WAY" size={110} fill={teal} a={P(3, 0.4)} b={P(3, 2.7)} rot={-2} />
      <Kin x={500} y={390} text="TO PAY THE BILLS" size={80} a={P(3, 1.2)} b={P(3, 2.7)} />
      <Kin x={1400} y={280} text="RIGHT IN" size={110} fill={orange} a={P(3, 3.0)} b={P(4)} rot={3} />
      <Kin x={1400} y={420} text="FRONT OF YOU" size={90} a={P(3, 3.3)} b={P(4)} />
      <Kin x={960} y={190} text="FOLLOW" size={150} fill={teal} a={P(4, 0.2)} rot={-3} />
      <Kin x={960} y={350} text="THE MONEY" size={150} fill={orange} a={P(4, 0.6)} rot={2} />
    </>
  ),
}));

const ticket = scene(5, "ticket", (P) => ({
  shots: [
    { id: "ticket", t: P(5), r: RIGHT, f: [0.8, 0.55], z: 1.3, mv: "pl", tr: "page", rot: 1.5 },
    { id: "split", t: P(6), r: RIGHT, f: [0.5, 0.78], z: 1.2, mv: "in", tr: "wl", rot: -1.5, m: (S) => <Pulse x={S * 0.5} y={S * 0.78} r={S * 0.09} a={P(6, 0.8)} e={P(6, 2.8)} /> },
    { id: "ticket", t: P(6, 2.8), r: FULL, f: [0.2, 0.6], z: 1.1, mv: "in", tr: "zoom", m: (S) => <Pulse x={S * 0.2} y={S * 0.55} r={S * 0.1} a={P(6, 3.2)} e={P(7)} /> },
    { id: "building", t: P(7), r: LEFT, f: [0.5, 0.5], mv: "in", tr: "page", rot: -1.5 },
    { id: "split", t: P(7, 3.2), r: LEFT, f: [0.3, 0.6], z: 1.3, mv: "pr", tr: "pop", rot: 1 },
    { id: "building", t: P(8), r: FULL, f: [0.5, 0.3], z: 1.05, mv: "in", tr: "page" },
    { id: "queue", t: P(9), r: FULL, f: [0.5, 0.5], mv: "out", tr: "zoom" },
  ],
  ov: (
    <>
      <Kin x={500} y={300} text="YOUR TICKET" size={120} fill={orange} a={P(5, 0.2)} b={P(6)} rot={-3} />
      <Kin x={500} y={250} text="NOT A" size={130} a={P(6, 0.3)} b={P(6, 2.8)} rot={-2} />
      <Kin x={500} y={400} text="FLAT FEE" size={150} fill={RED} a={P(6, 0.7)} b={P(6, 2.8)} rot={-3} />
      <Kin x={1400} y={200} text="A SHARE OF" size={110} fill={teal} a={P(6, 3.1)} b={P(7)} rot={-2} />
      <Kin x={1400} y={340} text="TICKET SALES" size={100} fill={orange} a={P(6, 3.5)} b={P(7)} rot={2} />
      <Pill x={1400} y={190} text="AMC ANNUAL RESULTS" size={42} a={P(7, 0.2)} b={P(7, 3.1)} color={teal} />
      <Bar x={1400} y={470} title="WHERE A TICKET GOES" a={P(7, 0.5)} b={P(7, 3.3)} rows={[["STUDIO", 48, orange], ["CINEMA", 52, teal]]} />
      <Kin x={1400} y={250} text="CLOSE TO HALF" size={100} fill={orange} a={P(7, 3.4)} b={P(8)} rot={-3} />
      <Kin x={1400} y={400} text="GOES TO THE" size={90} a={P(7, 3.7)} b={P(8)} />
      <Kin x={1400} y={520} text="STUDIO" size={150} fill={teal} a={P(7, 4.0)} b={P(8)} rot={3} />
      <Kin x={500} y={200} text="THE BUILDING" size={90} fill={teal} a={P(8, 0.3)} b={P(9)} />
      <Kin x={500} y={320} text="THE SCREENS" size={90} a={P(8, 1.3)} b={P(9)} />
      <Kin x={500} y={440} text="THE STAFF" size={90} fill={orange} a={P(8, 2.3)} b={P(9)} />
      <Kin x={500} y={560} text="THE CLEANING" size={90} a={P(8, 3.3)} b={P(9)} />
      <Kin x={960} y={190} text="ABOUT HALF" size={140} fill={orange} a={P(9, 0.3)} rot={-3} />
      <Kin x={960} y={340} text="IS LEFT" size={140} fill={teal} a={P(9, 0.9)} rot={2} />
    </>
  ),
  sm: [[P(7, 0.5), P(7, 3.3)]],
  src: <Src text="AMC annual results 2025 (calculated)" a={P(7, 0.2)} b={P(8, 0.5)} />,
}));

const counter = scene(10, "counter", (P) => ({
  shots: [
    { id: "walkpast", t: P(10), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page" },
    { id: "counter", t: P(11), r: RIGHT, f: [0.5, 0.5], mv: "pl", tr: "wl", rot: 1.5 },
    { id: "split", t: P(12), r: RIGHT, f: [0.2, 0.6], z: 1.3, mv: "in", tr: "wl", rot: -1.5 },
    { id: "cost", t: P(13), r: FULL, f: [0.7, 0.5], mv: "in", tr: "page", m: (S) => <Pulse x={S * 0.28} y={S * 0.75} r={S * 0.1} a={P(13, 1.2)} e={P(13, 3.2)} color={teal} /> },
    { id: "counter", t: P(13, 3.2), r: RIGHT, f: [0.75, 0.45], z: 1.3, mv: "in", tr: "page", rot: 1.5 },
    { id: "queue", t: P(14), r: LEFT, f: [0.6, 0.5], z: 1.2, mv: "pr", tr: "wr", rot: -1.5 },
    { id: "ticket", t: P(15), r: RIGHT, f: [0.2, 0.6], mv: "in", tr: "page", rot: 1.5 },
    { id: "counter", t: P(15, 2.1), r: RIGHT, f: [0.78, 0.45], z: 1.2, mv: "pr", tr: "wl", rot: -1 },
    { id: "split", t: P(15, 4.2), r: FULL, f: [0.5, 0.75], z: 1.1, mv: "in", tr: "zoom" },
    { id: "cost", t: P(16), r: LEFT, f: [0.5, 0.45], mv: "in", tr: "wr", rot: 1.5 },
    { id: "counter", t: P(16, 3.4), r: LEFT, f: [0.78, 0.45], z: 1.2, mv: "pr", tr: "page", rot: -1.5 },
    { id: "bucket", t: P(17), r: FULL, f: [0.6, 0.5], mv: "in", tr: "zoom", m: (S) => <Pulse x={S * 0.66} y={S * 0.55} r={S * 0.14} a={P(17, 2.4)} e={P(18)} /> },
  ],
  ov: (
    <>
      <Pill x={960} y={150} text="THE SNACK COUNTER" size={52} a={P(10, 0.2)} b={P(11)} color={teal} />
      <Kin x={500} y={250} text="STUDIO'S SHARE" size={90} fill={teal} a={P(11, 0.2)} b={P(12)} rot={-2} />
      <Kin x={500} y={390} text="TICKET SALES" size={110} fill={orange} a={P(11, 0.9)} b={P(12)} rot={-2} />
      <Kin x={500} y={540} text="NOT SNACKS" size={110} a={P(11, 2.4)} b={P(12)} rot={2} />
      <Kin x={500} y={300} text="STAYS WITH" size={110} fill={teal} a={P(12, 0.3)} b={P(13)} rot={-2} />
      <Kin x={500} y={450} text="THE CINEMA" size={120} fill={orange} a={P(12, 0.9)} b={P(13)} rot={2} />
      <Kin x={500} y={230} text="FOOD COST" size={120} fill={teal} a={P(13, 0.4)} b={P(13, 3.2)} rot={-3} />
      <Kin x={500} y={400} text="ABOUT 1/5" size={190} fill={orange} a={P(13, 1.4)} b={P(13, 3.2)} rot={-3} />
      <Kin x={500} y={300} text="OF WHAT" size={120} a={P(13, 3.5)} b={P(14)} rot={-2} />
      <Kin x={500} y={440} text="IT CHARGED" size={120} fill={orange} a={P(13, 3.9)} b={P(14)} rot={2} />
      <Bar x={1400} y={430} title="EACH $100 OF SNACKS" a={P(14, 0.3)} b={P(15)} rows={[["FOOD COST", 20, "#9AA4B2"], ["LEFT OVER", 80, teal]]} />
      <Kin x={1400} y={760} text="STAFF  RENT  PROFIT" size={60} a={P(14, 2.2)} b={P(15)} />
      <Kin x={500} y={300} text="TICKETS" size={130} fill={teal} a={P(15, 0.3)} b={P(15, 4.2)} rot={-3} />
      <Kin x={500} y={450} text="+ SNACKS" size={130} fill={orange} a={P(15, 2.1)} b={P(15, 4.2)} rot={2} />
      <Band x={960} y={250} w={1060} h={300} a={P(15, 4.3)} b={P(16)} />
      <Kin x={960} y={190} text="MINUS STUDIO" size={92} fill={teal} a={P(15, 4.4)} b={P(16)} rot={-2} />
      <Kin x={960} y={310} text="MINUS FOOD COST" size={92} fill={orange} a={P(15, 5.0)} b={P(16)} rot={2} />
      <Pill x={1400} y={190} text="AMC + CINEMARK 2025" size={42} a={P(16, 0.2)} b={P(17)} color={teal} />
      <Bar x={1400} y={470} title="SHARE FROM FOOD & DRINK" a={P(16, 0.6)} b={P(17)} rows={[["AMC", 49, orange], ["CINEMARK", 60, teal]]} />
      <Pill x={1400} y={740} text="CINEMARK'S FILM COST INCLUDES ADVERTISING" size={26} a={P(16, 1.5)} b={P(17)} color={orange} />
      <Kin x={960} y={190} text="NOT A SIDE BUSINESS" size={110} fill={teal} a={P(17, 0.2)} b={P(17, 2.4)} rot={-2} />
      <Kin x={960} y={190} text="KEEPS THE LIGHTS ON" size={110} fill={orange} a={P(17, 2.6)} rot={2} />
    </>
  ),
  sm: [[P(14, 0.3), P(15)], [P(16, 0.6), P(17)]],
  src: (
    <>
      <Src text="AMC annual results 2025 (calculated)" a={P(13, 0.2)} b={P(15)} />
      <Src text="AMC & Cinemark annual results 2025 (calculated)" a={P(16, 0.2)} b={P(17)} />
    </>
  ),
}));

const economists = scene(18, "economists", (P) => ({
  shots: [
    { id: "counter", t: P(18), r: FULL, f: [0.5, 0.5], mv: "out", tr: "page" },
    { id: "economist", t: P(19), r: RIGHT, f: [0.5, 0.5], mv: "in", tr: "wl", rot: 1.5, m: (S) => (
      <>
        <Pulse x={S * 0.17} y={S * 0.3} r={S * 0.1} a={P(19, 1.6)} e={P(19, 3.2)} color={teal} />
        <Pulse x={S * 0.43} y={S * 0.34} r={S * 0.09} a={P(19, 2.8)} e={P(20)} />
      </>
    ) },
    { id: "splurge", t: P(20), r: FULL, f: [0.6, 0.5], mv: "in", tr: "page", m: (S) => <Pulse x={S * 0.55} y={S * 0.62} r={S * 0.14} a={P(20, 1.5)} e={P(21)} /> },
    { id: "walkpast", t: P(21), r: FULL, f: [0.55, 0.5], mv: "in", tr: "wl" },
    { id: "walkpast", t: P(22), r: LEFT, f: [0.55, 0.5], mv: "in", tr: "page", rot: -1.5 },
    { id: "splurge", t: P(22, 0.4), r: RIGHT, f: [0.6, 0.5], mv: "in", tr: "wr", rot: 1.5, L: 1 },
    { id: "splurge", t: P(23), r: LEFT, f: [0.6, 0.55], mv: "in", tr: "page", rot: -1.5 },
    { id: "walkpast", t: P(23, 2.6), r: RIGHT, f: [0.55, 0.5], mv: "pl", tr: "wl", rot: 1.5, L: 1 },
    { id: "ticket", t: P(23, 5.0), r: FULL, f: [0.2, 0.6], z: 1.1, mv: "in", tr: "zoom", m: (S) => <Pulse x={S * 0.2} y={S * 0.55} r={S * 0.1} a={P(23, 5.4)} e={P(24)} /> },
    { id: "combo", t: P(24), r: FULL, f: [0.45, 0.5], mv: "in", tr: "page", m: (S) => <Pulse x={S * 0.46} y={S * 0.55} r={S * 0.14} a={P(24, 2.0)} e={P(24, 3.4)} /> },
    { id: "combo", t: P(24, 3.4), r: RIGHT, f: [0.88, 0.55], z: 1.3, mv: "pu", tr: "wl", rot: 1.5 },
    { id: "counter", t: P(25), r: RIGHT, f: [0.3, 0.6], z: 1.3, mv: "in", tr: "page", rot: -1.5 },
    { id: "counter", t: P(25, 3.0), r: FULL, f: [0.3, 0.55], z: 1.1, mv: "pr", tr: "zoom" },
    { id: "economist", t: P(26), r: FULL, f: [0.6, 0.5], z: 1.1, mv: "in", tr: "fade" },
  ],
  ov: (
    <>
      <Kin x={500} y={250} text="WHY NOT" size={120} fill={teal} a={P(18, 0.2)} b={P(18, 2.6)} rot={-2} />
      <Kin x={500} y={390} text="CHEAP POPCORN?" size={90} a={P(18, 0.8)} b={P(18, 2.6)} />
      <Kin x={500} y={310} text="SELL MORE?" size={140} fill={orange} a={P(18, 2.8)} b={P(19)} rot={-3} />
      <Kin x={500} y={300} text="ECONOMISTS" size={100} fill={teal} a={P(19, 0.2)} b={P(20)} rot={-2} />
      <Kin x={500} y={430} text="TWO KINDS" size={110} a={P(19, 1.2)} b={P(20)} rot={2} />
      <Kin x={500} y={560} text="OF MOVIEGOERS" size={80} fill={orange} a={P(19, 1.8)} b={P(20)} />
      <Kin x={960} y={180} text="SOME SPLURGE" size={130} fill={orange} a={P(20, 0.3)} b={P(21)} rot={-3} />
      <Pill x={960} y={310} text="BIG POPCORN  BIG DRINK" size={44} a={P(20, 1.2)} b={P(21)} color={teal} />
      <Kin x={500} y={220} text="JUST THE" size={100} a={P(21, 0.3)} b={P(22)} rot={-2} />
      <Kin x={500} y={350} text="MOVIE" size={170} fill={teal} a={P(21, 0.6)} b={P(22)} rot={-3} />
      <Kin x={500} y={720} text="WALK RIGHT PAST" size={90} fill={orange} a={P(21, 2.8)} b={P(22)} rot={2} />
      <Kin x={780} y={915} text="THE COUNTER SORTS YOU OUT" size={60} fill={teal} a={P(22, 0.8)} b={P(23)} />
      <Kin x={1400} y={250} text="SPLURGERS" size={90} fill={orange} a={P(23, 0.2)} b={P(23, 2.6)} rot={-2} />
      <Kin x={1400} y={380} text="PAY A LOT" size={110} a={P(23, 0.8)} b={P(23, 2.6)} rot={2} />
      <Kin x={500} y={250} text="EVERYONE ELSE" size={80} fill={teal} a={P(23, 2.9)} b={P(23, 5.0)} rot={-2} />
      <Kin x={500} y={380} text="JUST THE TICKET" size={80} a={P(23, 3.5)} b={P(23, 5.0)} />
      <Kin x={960} y={170} text="TICKET PRICE STAYS" size={100} fill={teal} a={P(23, 5.2)} b={P(24)} rot={-2} />
      <Kin x={960} y={300} text="WHAT MOST ACCEPT" size={80} fill={orange} a={P(23, 5.9)} b={P(24)} rot={2} />
      <Kin x={500} y={250} text="THE COMBO" size={130} fill={teal} a={P(24, 0.3)} b={P(24, 3.4)} rot={-3} />
      <Kin x={500} y={400} text="BIGGER BUCKET" size={100} fill={orange} a={P(24, 1.1)} b={P(24, 3.4)} rot={2} />
      <Kin x={500} y={300} text="A LITTLE" size={110} a={P(24, 3.7)} b={P(25)} rot={-2} />
      <Kin x={500} y={440} text="DISCOUNT" size={120} fill={orange} a={P(24, 4.0)} b={P(25)} rot={2} />
      <Kin x={500} y={600} text="ON THE FENCE" size={80} fill={teal} a={P(24, 5.0)} b={P(25)} />
      <Kin x={500} y={280} text="NO OUTSIDE" size={100} fill={RED} a={P(25, 0.3)} b={P(25, 3.0)} rot={-3} />
      <Kin x={500} y={410} text="SNACKS" size={150} a={P(25, 0.8)} b={P(25, 3.0)} rot={2} />
      <Kin x={960} y={190} text="LITTLE" size={120} fill={orange} a={P(25, 3.3)} b={P(26)} rot={-3} />
      <Kin x={960} y={340} text="COMPETITION" size={120} fill={teal} a={P(25, 3.7)} b={P(26)} rot={2} />
      <Kin x={500} y={540} text="AN EXPLANATION" size={90} fill={teal} a={P(26, 0.3)} rot={-2} />
      <Kin x={500} y={680} text="NOT PROOF" size={140} fill={orange} a={P(26, 1.3)} rot={-3} />
      <Pip x={1660} y={800} a={P(26, 2.4)} s={0.9} arm="chin" />
    </>
  ),
  src: (
    <>
      <Src text="Marketplace, 2014 (economists' reasoning)" a={P(19, 0.2)} b={P(22, 0.3)} />
      <Src text="Marketplace, 2014 (economists' reasoning)" a={P(23, 0.2)} b={P(26, 5)} />
    </>
  ),
}));

const history = scene(27, "history", (P) => ({
  shots: [
    { id: "depression", t: P(27), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page" },
    { id: "building", t: P(28), r: FULL, f: [0.5, 0.4], z: 1.15, mv: "pl", tr: "zoom" },
    { id: "depression", t: P(29), r: FULL, f: [0.85, 0.2], z: 1.4, mv: "pd", tr: "page" },
    { id: "depression", t: P(30), r: FULL, f: [0.5, 0.55], mv: "in", tr: "zoom", m: (S) => <Pulse x={S * 0.46} y={S * 0.6} r={S * 0.09} a={P(30, 1.8)} e={P(31)} /> },
    { id: "depression", t: P(31), r: RIGHT, f: [0.8, 0.7], z: 1.3, mv: "in", tr: "wl", rot: 1.5 },
    { id: "depression", t: P(31, 2.7), r: LEFT, f: [0.35, 0.55], z: 1.3, mv: "pl", tr: "page", rot: -1.5 },
    { id: "depression", t: P(32), r: FULL, f: [0.78, 0.7], z: 1.3, mv: "pr", tr: "wl" },
    { id: "bucket", t: P(33), r: FULL, f: [0.5, 0.5], mv: "in", tr: "fade", m: (S) => <Pulse x={S * 0.66} y={S * 0.55} r={S * 0.14} a={P(33, 0.8)} e={P(34)} /> },
  ],
  ov: (
    <>
      <Kin x={500} y={220} text="THE TWIST" size={150} fill={orange} a={P(27, 0.3)} b={P(27, 2.3)} rot={-3} />
      <Kin x={500} y={390} text="NO POPCORN" size={110} fill={teal} a={P(27, 2.4)} b={P(28)} rot={-2} />
      <Kin x={500} y={520} text="AT ALL" size={110} a={P(27, 2.8)} b={P(28)} rot={2} />
      <Pill x={500} y={150} text="A CENTURY AGO" size={48} a={P(28, 0.2)} b={P(29)} color={teal} />
      <Kin x={500} y={290} text="GRAND THEATERS" size={90} fill={teal} a={P(28, 0.8)} b={P(28, 3.3)} rot={-2} />
      <Kin x={500} y={430} text="RUGS ON THE FLOOR" size={80} a={P(28, 1.8)} b={P(28, 3.3)} />
      <Kin x={500} y={380} text="NO SNACKING" size={130} fill={RED} a={P(28, 3.4)} b={P(29)} rot={-3} />
      <Kin x={500} y={250} text="THE GREAT" size={110} fill={orange} a={P(29, 0.2)} b={P(30)} rot={-2} />
      <Kin x={500} y={390} text="DEPRESSION" size={110} fill={orange} a={P(29, 0.5)} b={P(30)} rot={2} />
      <Kin x={500} y={540} text="CLOSED" size={150} fill={RED} a={P(29, 1.8)} b={P(30)} rot={-3} />
      <Kin x={500} y={170} text="STREET VENDORS" size={100} fill={teal} a={P(30, 0.3)} b={P(31)} rot={-2} />
      <Kin x={500} y={290} text="ALREADY SELLING" size={80} a={P(30, 1.1)} b={P(31)} />
      <Kin x={500} y={300} text="KEEP THE" size={110} fill={teal} a={P(31, 0.2)} b={P(31, 2.7)} rot={-2} />
      <Kin x={500} y={440} text="TICKET LOW" size={120} fill={orange} a={P(31, 0.7)} b={P(31, 2.7)} rot={2} />
      <Kin x={1400} y={250} text="EARN AT" size={120} fill={teal} a={P(31, 3.0)} b={P(32)} rot={-2} />
      <Kin x={1400} y={400} text="THE STAND" size={120} fill={orange} a={P(31, 3.3)} b={P(32)} rot={2} />
      <Pill x={500} y={170} text="ONE HISTORIAN SAYS" size={46} a={P(32, 0.2)} b={P(33)} color={orange} />
      <Kin x={500} y={330} text="POPCORN" size={150} fill={orange} a={P(32, 0.8)} b={P(33)} rot={-3} />
      <Kin x={500} y={480} text="SAVED THEATERS" size={80} a={P(32, 1.6)} b={P(33)} />
      <Kin x={500} y={250} text="STILL AT" size={130} fill={teal} a={P(33, 0.3)} rot={-2} />
      <Kin x={500} y={400} text="WORK TODAY" size={130} fill={orange} a={P(33, 0.8)} rot={2} />
      <Pill x={960} y={902} text="OUR READING" size={28} a={P(33, 0.3)} b={P(34)} color={teal} />
    </>
  ),
  src: <Src text="NPR, 2025 (historian Andrew F. Smith)" a={P(32, 0.2)} b={P(33, 1)} />,
}));

const close = scene(34, "close", (P) => ({
  shots: [
    { id: "queue", t: P(34), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page" },
    { id: "ticket", t: P(35), r: LEFT, f: [0.4, 0.5], mv: "in", tr: "wr", rot: -1.5 },
    { id: "bucket", t: P(35, 0.4), r: RIGHT, f: [0.6, 0.5], mv: "in", tr: "wl", rot: 1.5, L: 1 },
    { id: "cost", t: P(36), r: FULL, f: [0.55, 0.5], mv: "in", tr: "zoom" },
    { id: "depression", t: P(37), r: FULL, f: [0.5, 0.55], mv: "in", tr: "page" },
    { id: "zoo-winter", t: P(38), r: FULL, f: [0.6, 0.5], z: 1.15, mv: "pl", tr: "zoom" },
  ],
  ov: (
    <>
      <Kin x={1400} y={200} text="YOU KNOW" size={100} fill={teal} a={P(34, 0.3)} b={P(35)} rot={-2} />
      <Kin x={1400} y={330} text="THE GAME" size={110} fill={orange} a={P(34, 0.8)} b={P(35)} rot={2} />
      <Band x={510} y={245} w={700} h={270} a={P(35, 0.4)} b={P(36)} />
      <Band x={1410} y={245} w={700} h={270} a={P(35, 2.5)} b={P(36)} />
      <Kin x={510} y={180} text="TICKET" size={110} fill={teal} a={P(35, 0.5)} b={P(36)} rot={-2} />
      <Kin x={510} y={310} text="ABOUT HALF: THE STUDIO" size={50} a={P(35, 1.3)} b={P(36)} />
      <Kin x={1410} y={180} text="POPCORN" size={110} fill={orange} a={P(35, 2.6)} b={P(36)} rot={2} />
      <Kin x={1410} y={310} text="PAYS THE CINEMA" size={64} a={P(35, 3.3)} b={P(36)} />
      <Pill x={960} y={902} text="ROUGHLY SPEAKING" size={28} a={P(35, 0.3)} b={P(36)} color={teal} />
      <Kin x={500} y={220} text="STILL A LOT" size={120} fill={orange} a={P(36, 0.3)} b={P(36, 2.3)} rot={-3} />
      <Kin x={500} y={220} text="BUT IT MAKES SENSE" size={90} fill={teal} a={P(36, 2.4)} b={P(37)} rot={2} />
      <Kin x={500} y={240} text="HARD TIMES" size={130} fill={orange} a={P(37, 0.3)} b={P(38)} rot={-3} />
      <Kin x={500} y={400} text="NEW MENU" size={150} a={P(37, 1.0)} b={P(38)} rot={2} />
      <Kin x={500} y={220} text="PARIS, 1870" size={120} fill={teal} a={P(38, 0.2)} rot={-2} />
      <Kin x={500} y={360} text="ATE ITS ZOO?" size={120} fill={orange} a={P(38, 1.2)} rot={2} />
    </>
  ),
}));

export const SCENES004V2: Record<string, React.FC<SceneProps>> = { "popcorn-hook": hook, ticket, counter, economists, history, close };
