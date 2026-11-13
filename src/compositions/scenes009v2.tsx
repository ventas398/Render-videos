// EM-009 v2 (kit2): fotos libres con credito (CC0 / CC BY), 2 imagenes ChatGPT (yogur, pollo) y tarjetas vectoriales propias con las definiciones oficiales.
import React from "react";
import { teal, orange, ink } from "./kit";
import type { SceneProps } from "./scenes";
import { FULL, Kin, Ov, Pill, Pip } from "./scenes023";
import { Cite, mkScene } from "./v2";

const CARD = "#FFFDF6";
const scene = mkScene("em009-", {
  waste: { f: "em009-foodwaste.jpg", asp: 1.025, cr: "Wormsandstuff, Wikimedia Commons (CC0)", lab: "Illustrative image" },
  meats: { f: "em009-meats.jpg", asp: 1.509, cr: "Raysonho, Wikimedia Commons (CC0)", lab: "Illustrative image" },
  fr: { f: "em009-fridge.jpg", asp: 1.333, cr: "Candeadly, Wikimedia Commons (CC BY 4.0)", lab: "Illustrative image" },
});
const CK = { id: "packaged-chicken", asp: 1672 / 941 };
const W = (id: string) => ({ id, asp: 1672 / 941 });
const N = (id: string) => ({ id, asp: 1376 / 768 });

export const T: React.FC<{ x: number; y: number; s: number; w?: number; fill?: string; children: string }> = ({ x, y, s, w = 800, fill = ink, children }) => (
  <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontFamily="Segoe UI, sans-serif" fontWeight={w} fontSize={s} fill={fill}>
    {children}
  </text>
);
/** Tarjeta de definicion: titulo grande de color + lineas. */
export const Def: React.FC<{ x?: number; y?: number; w?: number; title: string; color: string; lines: string[]; a: number; b?: number; rot?: number }> = ({ x = 960, y = 450, w = 1180, title, color, lines, a, b, rot }) => {
  const h = lines.length ? 430 : 190;
  return (
  <Ov x={x} y={y} a={a} b={b} rot={rot}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={30} fill={CARD} stroke={color} strokeWidth={8} />
    <T x={0} y={lines.length ? -130 : 0} s={title.length > 16 ? 84 : lines.length ? 110 : 90} w={900} fill={color}>{title}</T>
    {lines.map((l, i) => (
      <T key={i} x={0} y={-10 + i * 74} s={54}>{l}</T>
    ))}
  </Ov>
  );
};
/** Nodo de linea de tiempo. */
export const Node: React.FC<{ x: number; y: number; year: string; text: string; color: string; a: number; b?: number; s?: number }> = ({ x, y, year, text, color, a, b, s }) => {
  const lines = text.split("|");
  const h = Math.max(0, lines.length - 2) * 54; // tarjeta mas alta si hay 3 lineas
  return (
    <Ov x={x} y={y} a={a} b={b} s={s}>
      <rect x={-210} y={-150 - h / 2} width={420} height={300 + h} rx={26} fill={CARD} stroke={color} strokeWidth={7} />
      <T x={0} y={-70 - h / 2} s={84} w={900} fill={color}>{year}</T>
      {lines.map((l, i) => (
        <T key={i} x={0} y={20 - h / 2 + i * 54} s={42}>{l}</T>
      ))}
    </Ov>
  );
};

const hook = scene(0, "hook", (P) => ({
  shots: [
    { id: "yogurt", t: 0, r: FULL, f: [0.5, 0.55], mv: "in", tr: "cut" },
    { ...CK, t: P(0, 2.2), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "wl" },
    { id: "yogurt", t: P(1, 1.0), r: FULL, f: [0.4, 0.6], z: 1.3, mv: "in", tr: "pop" },
    { ...CK, t: P(1, 3.2), r: FULL, f: [0.5, 0.5], z: 1.4, mv: "pr", tr: "wr" },
    { id: "fr", t: P(2), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page" },
    { id: "meats", t: P(3), r: FULL, f: [0.5, 0.45], mv: "pl", tr: "fade" },
    { id: "yogurt", t: P(4), r: FULL, f: [0.5, 0.5], mv: "in", tr: "zoom" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="TWO DATES" size={190} fill={orange} a={P(1, 0.1)} b={P(1, 1.0)} rot={-3} />
      <Kin x={1400} y={250} text="BEST BEFORE" size={110} fill={teal} a={P(1, 1.4)} b={P(1, 3.2)} rot={-3} />
      <Kin x={500} y={250} text="USE BY" size={150} fill={orange} a={P(1, 3.6)} b={P(2)} rot={3} />
      <Kin x={960} y={190} text="TWINS?" size={220} fill={teal} a={P(2, 0.2)} b={P(2, 1.4)} rot={-4} />
      <Kin x={960} y={190} text="NOT TWINS" size={170} fill={orange} a={P(2, 1.4)} b={P(3)} rot={3} />
      <Kin x={500} y={190} text="QUALITY" size={130} fill={teal} a={P(3, 3.2)} b={P(4)} rot={-3} />
      <Kin x={1400} y={190} text="SAFETY" size={150} fill={orange} a={P(3, 4.8)} b={P(4)} rot={3} />
      <Kin x={960} y={190} text="WHY?" size={230} fill={orange} rot={-4} a={P(4, 0.6)} />
      <Pill x={960} y={790} text="EXAMPLES ONLY" size={40} color={teal} a={P(0, 0.2)} b={P(3)} />
      <Pip x={1660} y={780} a={P(4, 1.4)} s={0.9} arm="chin" />
    </>
  ),
}));

const official = scene(5, "official", (P) => ({
  shots: [
    { id: "fr", t: P(5), r: FULL, f: [0.5, 0.45], mv: "in", tr: "page" },
    { id: "meats", t: P(6), r: FULL, f: [0.5, 0.45], mv: "pr", tr: "fade" },
    { ...CK, t: P(9), r: FULL, f: [0.5, 0.5], z: 1.2, mv: "in", tr: "wl" },
  ],
  ov: (
    <>
      <Kin x={500} y={260} text="THE OFFICIAL" size={110} fill={orange} a={P(5, 0.4)} b={P(6)} rot={-3} />
      <Kin x={500} y={420} text="DEFINITIONS" size={110} fill={teal} a={P(5, 0.9)} b={P(6)} rot={-3} />
      <Def title="USE BY" color={orange} lines={["Eat until this date, not after,", "even if it looks and smells fine"]} a={P(6, 0.4)} b={P(7)} />
      <Def title="BEST BEFORE" color={teal} lines={["Safe to eat after this date,", "but may not be at its best"]} a={P(7, 0.4)} b={P(8)} />
      <Def y={330} title="BEST BEFORE = QUALITY" color={teal} lines={[]} w={1300} a={P(8, 0.6)} b={P(9)} />
      <Def y={720} title="USE BY = SAFETY" color={orange} lines={[]} w={1300} a={P(8, 2.8)} b={P(9)} />
      <Kin x={1400} y={260} text="NOT MEDICAL" size={110} fill={orange} a={P(9, 0.4)} b={P(10)} rot={-3} />
      <Kin x={1400} y={420} text="ADVICE" size={150} fill={teal} a={P(9, 0.9)} b={P(10)} rot={3} />
    </>
  ),
  src: (
    <>
      <Cite text="European Food Safety Authority (EFSA)" a={P(5, 0.3)} b={P(8)} y={832} />
      <Cite text="AESAN, Spain" a={P(8, 0.3)} b={P(9)} y={832} />
    </>
  ),
  simp: [P(6, 0.4), P(9)],
}));

const chooser = scene(10, "chooser", (P) => ({
  shots: [
    { id: "yogurt", t: P(10), r: FULL, f: [0.5, 0.5], mv: "pr", tr: "page" },
    { id: "fr", t: P(11), r: FULL, f: [0.5, 0.5], mv: "in", tr: "fade" },
  ],
  ov: (
    <>
      <Kin x={960} y={170} text="WHO CHOOSES?" size={170} fill={orange} a={P(10, 0.3)} b={P(10, 3.6)} rot={-3} />
      <Pill x={960} y={500} text="FOOD BUSINESSES DO" size={80} color={teal} a={P(10, 1.8)} b={P(11)} />
      <Pill x={960} y={700} text="EFSA BUILT A DECISION TOOL" size={50} color={orange} a={P(10, 4.2)} b={P(11)} />
      <Pill x={960} y={250} text="THE PRODUCT ITSELF" size={64} color={teal} a={P(11, 0.4)} b={P(12)} />
      <Pill x={960} y={450} text="HOW IT IS HANDLED" size={64} color={orange} a={P(11, 1.4)} b={P(12)} />
      <Pill x={960} y={650} text="HOW IT IS STORED" size={64} color={teal} a={P(11, 2.4)} b={P(12)} />
    </>
  ),
  src: <Cite text="European Food Safety Authority (EFSA)" a={P(10, 0.3)} b={P(12)} y={832} />,
  simp: [P(11, 0.4), P(12)],
}));

const history = scene(12, "history", (P) => ({
  shots: [
    { id: "meats", t: P(12), r: FULL, f: [0.3, 0.45], mv: "pr", tr: "page" },
    { ...W("shop-1950s"), t: P(13), r: FULL, f: [0.4, 0.5], mv: "in", tr: "fade" },
    { ...N("uk-shop-shelf-1972-clean-v2"), t: P(14), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "wl" },
    { ...N("uk-pantry-fridge-1985-v2"), t: P(15), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "fade" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="NOT FROM A" size={120} fill={teal} a={P(12, 0.3)} b={P(13)} rot={-3} />
      <Kin x={960} y={350} text="SAFETY LAB?" size={150} fill={orange} a={P(12, 0.9)} b={P(13)} rot={3} />
      <Node x={420} y={440} year="1950s" text="M&S prints dates|stockroom only" color={teal} a={P(13, 1.0)} b={P(15)} />
      <Node x={960} y={440} year="1970" text="Dates on|the shelves" color={orange} a={P(14, 0.3)} b={P(15)} />
      <Node x={1500} y={440} year="1973" text="Named|sell-by dates" color={teal} a={P(14, 3.6)} b={P(15)} />
      <Kin x={960} y={190} text="THE 1980s" size={150} fill={orange} a={P(15, 0.3)} b={P(15, 5.0)} rot={-3} />
      <Pill x={500} y={560} text="BEST BEFORE: ADVISORY" size={56} color={teal} a={P(15, 2.4)} b={P(16)} />
      <Pill x={1400} y={760} text="USE BY: REAL RISK" size={56} color={orange} a={P(15, 5.2)} b={P(16)} />
      <Pill x={960} y={190} text="ONE ACCOUNT, NOT A GOVERNMENT ARCHIVE" size={52} color={orange} a={P(16, 0.3)} b={P(17)} />
    </>
  ),
  src: <Cite text="The Spectator + M&S MyLearning" a={P(12, 0.3)} b={P(17)} y={832} />,
  simp: [P(13, 1.0), P(15)],
}));

const other = scene(17, "other", (P) => ({
  shots: [
    { id: "meats", t: P(17), r: FULL, f: [0.7, 0.45], mv: "pl", tr: "page" },
    { ...W("shelf-labels"), t: P(18), r: FULL, f: [0.4, 0.5], mv: "in", tr: "fade" },
    { id: "fr", t: P(20), r: FULL, f: [0.5, 0.5], mv: "in", tr: "fade" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="A THIRD DATE" size={150} fill={teal} a={P(17, 0.2)} b={P(18)} rot={-3} />
      <Kin x={960} y={780} text="SELL BY" size={190} fill={orange} a={P(17, 1.2)} b={P(18)} rot={3} />
      <Def title="SELL BY" color={orange} lines={["Tells the store how long to display it.", "It is not a safety date."]} a={P(18, 0.6)} b={P(19)} />
      <Def title="NO FEDERAL DATE RULE" color={teal} lines={["Except for infant formula,", "product dates are not required."]} w={1280} a={P(19, 0.4)} b={P(20)} />
      <Kin x={500} y={190} text="EUROPE" size={130} fill={teal} a={P(20, 0.3)} b={P(21)} rot={-3} />
      <Kin x={1400} y={190} text="USA" size={150} fill={orange} a={P(20, 2.2)} b={P(21)} rot={3} />
      <Pill x={500} y={500} text="USE BY = SAFETY" size={56} color={teal} a={P(20, 0.8)} b={P(21)} />
      <Pill x={1400} y={500} text="USE BY = PEAK QUALITY" size={50} color={orange} a={P(20, 2.8)} b={P(21)} />
      <Kin x={960} y={670} text="SAME WORDS, DIFFERENT MEANING" size={72} fill={ink} a={P(20, 4.6)} b={P(21)} />
      <Pill x={960} y={650} text="CHECK THE LABEL IN YOUR COUNTRY" size={56} color={teal} a={P(21, 0.4)} b={P(22)} />
    </>
  ),
  src: <Cite text="USDA FSIS guidance (archived 2004, reposted 2017) + EFSA" a={P(18, 0.3)} b={P(22)} y={832} />,
  simp: [P(18, 0.6), P(22)],
}));

const waste = scene(22, "waste", (P) => ({
  shots: [
    { id: "waste", t: P(22), r: FULL, f: [0.5, 0.45], mv: "in", tr: "page" },
    { ...W("food-waste"), t: P(23), r: FULL, f: [0.5, 0.5], mv: "in", tr: "zoom" },
    { id: "waste", t: P(24), r: FULL, f: [0.5, 0.4], mv: "pl", tr: "fade" },
    { id: "meats", t: P(25), r: FULL, f: [0.5, 0.45], mv: "pr", tr: "wr" },
  ],
  ov: (
    <>
      <Kin x={500} y={330} text="WASTE" size={200} fill={orange} a={P(22, 0.2)} b={P(23)} rot={-4} />
      <Kin x={960} y={190} text="UP TO 10%" size={220} fill={orange} a={P(23, 4.0)} b={P(24)} rot={-3} />
      <Pill x={960} y={640} text="OF 88 MILLION TONNES A YEAR (EU)" size={56} color={teal} a={P(23, 6.4)} b={P(24)} />
      <Kin x={960} y={190} text="LINKED," size={170} fill={teal} a={P(24, 0.2)} b={P(25)} rot={-3} />
      <Kin x={960} y={380} text="NOT CAUSED" size={170} fill={orange} a={P(24, 0.8)} b={P(25)} rot={3} />
      <Pill x={960} y={800} text="AN ESTIMATE" size={64} color={teal} a={P(24, 1.8)} b={P(25)} />
      <Kin x={1400} y={250} text="FULL CIRCLE" size={130} fill={orange} a={P(25, 0.4)} b={P(26)} rot={-3} />
      <Kin x={1400} y={430} text="2022: M&S" size={100} fill={teal} a={P(25, 1.6)} b={P(26)} />
      <Kin x={1400} y={570} text="DROPS SELL-BY" size={100} fill={orange} a={P(25, 3.0)} b={P(26)} />
      <Kin x={1400} y={700} text="ON MANY FRUIT + VEG" size={70} fill={teal} a={P(25, 4.2)} b={P(26)} />
    </>
  ),
  src: (
    <>
      <Cite text="European Commission estimate, via EFSA (2020)" a={P(23, 3.8)} b={P(25)} y={832} />
      <Cite text="The Spectator, 2022" a={P(25, 0.3)} b={P(26)} y={832} />
    </>
  ),
}));

const practical = scene(26, "practical", (P) => ({
  shots: [
    { ...CK, t: P(26), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page" },
    { ...W("shelf-labels"), t: P(27, 4.0), r: FULL, f: [0.6, 0.5], mv: "pr", tr: "wr" },
    { id: "yogurt", t: P(29), r: FULL, f: [0.4, 0.55], mv: "pl", tr: "fade" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="HOW TO READ A LABEL" size={110} fill={orange} a={P(26, 0.3)} b={P(27)} rot={-3} />
      <Pill x={960} y={800} text="NOT MEDICAL ADVICE" size={56} color={teal} a={P(26, 2.2)} b={P(27)} />
      <Kin x={500} y={150} text="1" size={150} fill={orange} a={P(27, 0.3)} b={P(28)} />
      <Pill x={960} y={440} text="FIND THE EXACT WORDS" size={76} color={teal} a={P(27, 0.7)} b={P(28)} />
      <Pill x={960} y={640} text="USE BY  /  BEST BEFORE" size={64} color={orange} a={P(27, 2.0)} b={P(28)} />
      <Kin x={500} y={150} text="2" size={150} fill={orange} a={P(28, 0.3)} b={P(29)} />
      <Pill x={960} y={440} text="READ THE STORAGE INSTRUCTIONS" size={70} color={teal} a={P(28, 0.7)} b={P(29)} />
      <Kin x={960} y={190} text="UNSURE?" size={170} fill={orange} a={P(29, 0.3)} b={P(30)} rot={-3} />
      <Pill x={960} y={500} text="FOLLOW THE LABEL" size={76} color={teal} a={P(29, 1.2)} b={P(30)} />
      <Pill x={960} y={700} text="+ YOUR NATIONAL FOOD AGENCY" size={60} color={orange} a={P(29, 2.4)} b={P(30)} />
    </>
  ),
  src: <Cite text="EFSA decision tool (storage conditions)" a={P(28, 0.3)} b={P(29)} y={832} />,
}));

const close = scene(30, "close", (P) => ({
  shots: [
    { id: "yogurt", t: P(30), r: FULL, f: [0.5, 0.5], mv: "in", tr: "cut" },
    { id: "jeans", t: P(31), r: FULL, f: [0.5, 0.5], mv: "in", tr: "zoom" },
    { id: "pocket", t: P(32), r: FULL, f: [0.55, 0.45], z: 1.2, mv: "in", tr: "fade" },
  ],
  ov: (
    <>
      <Kin x={500} y={190} text="IS IT SAFE?" size={130} fill={orange} a={P(30, 0.4)} b={P(31)} rot={-3} />
      <Kin x={1400} y={190} text="AT ITS BEST?" size={130} fill={teal} a={P(30, 2.4)} b={P(31)} rot={3} />
      <Kin x={960} y={190} text="YOUR JEANS POCKET" size={120} fill={orange} a={P(31, 1.6)} b={P(32)} rot={-3} />
      <Kin x={960} y={190} text="STORY TOLD" size={170} fill={orange} a={P(32, 1.2)} rot={-4} />
      <Pip x={1660} y={780} a={P(32, 2.0)} s={0.9} arm="point" />
    </>
  ),
}));

export const SCENES009V2: Record<string, React.FC<SceneProps>> = { hook, official, chooser, history, other, waste, practical, close };

