// EM-022 v2: fotos a planos cortos + camaras + texto cinetico (mismo motor que scenes023).
import React from "react";
import { teal, orange, RED, SvgFrame } from "./kit";
import type { SceneProps } from "./scenes";
import { Cam } from "./kit2";
import { Ar, FULL, Kin, Pill, pk, Reading, Pip, Sfx, sfxOf, Shots, Src } from "./scenes023";
import type { Ev, Sh } from "./scenes023";
import { Lab } from "./scenes025";

type Mk = (P: (part: number, o?: number) => number, dur: number) => { shots: Sh[]; ov: React.ReactNode; ev?: Ev[]; src?: React.ReactNode };
const scene = (from: number, id: string, mk: Mk): React.FC<SceneProps> => ({ cues, dur }) => {
  const P0 = pk(cues, from);
  const P = (part: number, o = 0) => (part - from >= cues.length ? dur + o : P0(part, o));
  const { shots, ov, ev = [], src } = mk(P, dur);
  const labels: [string, number, number][] = [];
  shots.forEach((s, i) => {
    const t = s.id === "professor" || s.id === "porstmann" ? "AI illustration, not a portrait" : s.id === "un-docs2" ? "Simplified illustration" : "Illustrative image";
    const e = shots[i + 1]?.t ?? dur;
    const l = labels[labels.length - 1];
    if (l && l[0] === t) l[2] = e; else labels.push([t, s.t, e]);
  });
  return (
    <>
      <SvgFrame>
        <Cam dur={dur} z1={1.04} amt={0.6}>
          <Shots id={id} list={shots} dur={dur} pfx="em022-" />
        </Cam>
        <Cam dur={dur} z1={1.05} dx={-20} amt={1.3}>
          {ov}
        </Cam>
        {labels.map(([text, a, b], i) => <Lab key={i} text={text} a={a} b={b} />)}
        {src}
      </SvgFrame>
      <Sfx ev={[...sfxOf(shots), ...ev]} />
    </>
  );
};

const hook = scene(0, "hook", (P) => ({
  shots: [
    { id: "fold-hook", t: 0, r: FULL, f: [0.5, 0.55], mv: "in", tr: "cut" },
    { id: "halves", t: P(0, 3.2), r: FULL, f: [0.55, 0.5], mv: "pl", tr: "wl", rot: 1.5 },
    { id: "fold-repeat", t: P(1), r: FULL, f: [0.5, 0.5], mv: "pr", tr: "page", rot: -1.5 },
    { id: "fold-hook", t: P(1, 2.2), r: FULL, f: [0.62, 0.55], z: 1.6, mv: "in", tr: "zoom", rot: 1 },
    { id: "copier", t: P(2), r: FULL, f: [0.5, 0.4], mv: "out", tr: "pop" },
  ],
  ov: (
    <>
      <Kin x={1400} y={250} text="A4" size={200} fill={orange} a={P(0, 0.2)} b={P(0, 3.2)} rot={-5} />
      <Kin x={500} y={380} text="FOLD" size={210} a={P(0, 3.4)} b={P(1)} fill={teal} rot={-3} />
      <Kin x={500} y={560} text="IN HALF" size={170} a={P(0, 3.6)} b={P(1)} rot={-3} />
      <Kin x={1340} y={820} text="AGAIN" size={130} a={P(1, 0.2)} b={P(1, 2.2)} rot={4} fill={teal} />
      <Kin x={960} y={190} text="WHY?" size={230} fill={orange} rot={-4} a={P(2, 0.4)} />
      <Pip x={1660} y={800} a={P(2, 1.0)} s={0.9} arm="chin" />
    </>
  ),
}));

const ratio = scene(3, "ratio", (P) => ({
  shots: [
    { id: "halves", t: P(3), r: FULL, f: [0.5, 0.5], mv: "pr", tr: "wr", rot: -1.5 },
    { id: "ladder", t: P(3, 3.2), r: FULL, f: [0.4, 0.6], mv: "in", tr: "zoom" },
    { id: "diagonal", t: P(4), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page", rot: 2 },
    { id: "diagonal", t: P(4, 3.6), r: FULL, f: [0.45, 0.5], z: 1.4, mv: "pl", tr: "fade", m: (S) => <Ar x1={S * 0.2} y1={S * 0.8} x2={S * 0.75} y2={S * 0.22} a={P(4, 4.2)} e={P(5)} /> },
    { id: "scissors", t: P(5), r: FULL, f: [0.5, 0.5], mv: "in", tr: "wl", rot: 1.5 },
    { id: "halves", t: P(5, 3.8), r: FULL, f: [0.6, 0.5], z: 1.2, mv: "pr", tr: "pop" },
    { id: "ladder", t: P(6), r: FULL, f: [0.5, 0.5], mv: "out", tr: "page", rot: -1 },
    { id: "ladder", t: P(6, 3), r: FULL, f: [0.7, 0.55], z: 1.5, mv: "pl", tr: "zoom" },
    { id: "fold-repeat", t: P(7), r: FULL, f: [0.5, 0.5], mv: "in", tr: "wr", rot: 1.5 },
  ],
  ov: (
    <>
      <Kin x={500} y={300} text="1 : 1.414" size={150} fill={orange} a={P(3, 3.3)} b={P(4)} rot={-3} />
      <Pill x={1400} y={250} text="ISO PAPER SIZES" size={48} a={P(3, 0.4)} b={P(3, 3.2)} color={teal} />
      <Kin x={1400} y={470} text="ONE ASPECT" size={110} a={P(3, 1.2)} b={P(3, 3.2)} />
      <Kin x={1400} y={620} text="RATIO" size={170} a={P(3, 1.8)} b={P(3, 3.2)} fill={orange} rot={-3} />
      <Kin x={500} y={300} text="DIAGONAL" size={110} a={P(4, 0.4)} b={P(4, 3.6)} />
      <Kin x={500} y={450} text="= 1.414 x SIDE" size={96} fill={orange} a={P(4, 1.4)} b={P(4, 3.6)} />
      <Pill x={500} y={150} text="OUR ARITHMETIC" size={44} a={P(4, 0.2)} b={P(5)} color={teal} rot={-2} />
      <Kin x={500} y={300} text="UNIQUE" size={140} a={P(5, 0.3)} b={P(5, 3.8)} fill={orange} rot={-4} />
      <Kin x={960} y={900} text="HALVES KEEP THE SHAPE" size={84} a={P(5, 4.4)} b={P(6)} />
      <Kin x={500} y={300} text="HALF THE AREA" size={100} a={P(6, 0.3)} b={P(6, 3)} fill={teal} />
      <Kin x={1400} y={470} text="NEXT SIZE" size={110} fill={orange} a={P(7, 0.5)} b={P(8)} rot={-2} />
      <Kin x={1400} y={620} text="DOWN" size={170} fill={teal} a={P(7, 0.9)} b={P(8)} rot={-2} />
      <Reading x={1400} y={150} a={P(7, 0.2)} b={P(8)} />
    </>
  ),
  src: (
    <>
      <Src text="Wikipedia" a={P(3, 0.3)} b={P(4)} />
      <Src text="Wikipedia" a={P(5, 0.3)} b={P(7)} />
    </>
  ),
}));

const sizes = scene(8, "sizes", (P) => ({
  shots: [
    { id: "square-meter", t: P(8), r: FULL, f: [0.55, 0.55], mv: "in", tr: "page", rot: 0 },
    { id: "square-meter", t: P(8, 2.4), r: FULL, f: [0.7, 0.6], z: 1.5, mv: "pu", tr: "pop", rot: -1.5 },
    { id: "halves", t: P(9), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "wl", rot: 1.5 },
    { id: "halves", t: P(9, 2.8), r: FULL, f: [0.3, 0.6], z: 1.5, mv: "in", tr: "zoom" },
    { id: "sixteen-sheets", t: P(10), r: FULL, f: [0.5, 0.5], mv: "in", tr: "fade", rot: 1 },
    { id: "sixteen-sheets", t: P(10, 3.6), r: FULL, f: [0.5, 0.45], z: 1.3, mv: "out", tr: "page", rot: 0 },
    { id: "scale", t: P(11), r: FULL, f: [0.5, 0.6], mv: "in", tr: "wr", rot: -1.5 },
    { id: "scale", t: P(11, 2.6), r: FULL, f: [0.3, 0.55], z: 1.7, mv: "pl", tr: "zoom" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="A0 = 1 m2" size={180} fill={orange} a={P(8, 0.3)} b={P(8, 2.4)} rot={-3} />
      <Pill x={1400} y={170} text="ONE SQUARE METER" size={46} a={P(8, 2.6)} b={P(9)} color={teal} />
      <Kin x={500} y={300} text="210 x 297" size={140} fill={orange} a={P(9, 0.3)} b={P(9, 2.8)} />
      <Kin x={500} y={450} text="MILLIMETERS" size={90} a={P(9, 1.0)} b={P(9, 2.8)} />
      <Kin x={960} y={190} text="A4" size={220} a={P(9, 3.0)} b={P(10)} fill={teal} rot={4} />
      <Kin x={1400} y={420} text="16 x A4" size={170} fill={orange} a={P(10, 0.4)} b={P(10, 3.6)} />
      <Kin x={1400} y={600} text="~ 1 m2" size={200} fill={teal} a={P(10, 1.0)} b={P(10, 3.6)} rot={-3} />
      <Pill x={1400} y={200} text="OUR ARITHMETIC" size={44} a={P(10, 0.2)} b={P(10, 3.6)} color={teal} rot={-2} />
      <Kin x={1400} y={300} text="5 g" size={230} fill={orange} a={P(11, 0.5)} b={P(11, 2.6)} rot={4} />
      <Kin x={960} y={190} text="ONE SHEET" size={120} a={P(11, 2.8)} b={P(12)} />
    </>
  ),
  src: (
    <>
      <Src text="Wikipedia" a={P(8, 0.3)} b={P(10)} />
      <Src text="Cambridge University" a={P(11, 0.2)} b={P(12)} />
    </>
  ),
}));

const letter = scene(12, "letter", (P) => ({
  shots: [
    { id: "letter", t: P(12), r: FULL, f: [0.5, 0.55], mv: "in", tr: "page", rot: 0 },
    { id: "letter", t: P(12, 3.8), r: FULL, f: [0.35, 0.45], z: 1.7, mv: "pr", tr: "zoom", rot: 1.5 },
    { id: "professor", t: P(13), r: FULL, f: [0.6, 0.5], mv: "pl", tr: "wl" },
    { id: "scissors", t: P(14), r: FULL, f: [0.5, 0.5], mv: "in", tr: "pop", rot: -2 },
    { id: "professor", t: P(14, 2.8), r: FULL, f: [0.6, 0.35], z: 1.8, mv: "in", tr: "wr", rot: 2 },
    { id: "professor", t: P(15), r: FULL, f: [0.4, 0.4], z: 1.6, mv: "pr", tr: "zoom" },
    { id: "letter", t: P(16), r: FULL, f: [0.6, 0.5], z: 1.3, mv: "pd", tr: "page", rot: -1 },
  ],
  ov: (
    <>
      <Kin x={1400} y={180} text="1786" size={200} fill={orange} a={P(12, 0.4)} b={P(12, 3.8)} rot={-4} />
      <Pill x={1000} y={830} text="OCTOBER 25" size={52} a={P(12, 1.6)} b={P(12, 3.8)} rot={-3} />
      <Kin x={500} y={300} text="LICHTENBERG" size={110} fill={teal} a={P(13, 0.2)} b={P(14)} />
      <Kin x={500} y={440} text="PHYSICS PROFESSOR" size={74} a={P(13, 1.0)} b={P(14)} />
      <Kin x={1400} y={250} text="CUT THE PAPER" size={90} a={P(14, 0.4)} b={P(14, 2.8)} fill={orange} rot={3} />
      <Kin x={500} y={800} text="IT ALREADY FIT" size={96} a={P(15, 0.4)} b={P(16)} fill={orange} rot={-3} />
      <Kin x={500} y={380} text="HIS CLAIM:" size={120} a={P(16, 0.5)} fill={teal} />
      <Kin x={500} y={560} text="NOT BY ACCIDENT" size={72} a={P(16, 1.0)} fill={orange} rot={-3} />
    </>
  ),
  src: (
    <>
      <Src text="Wikipedia" a={P(12, 0.3)} b={P(14)} />
      <Src text="Cambridge translation" a={P(14, 0.2)} b={P(15)} />
    </>
  ),
}));

const standard = scene(17, "standard", (P) => ({
  shots: [
    { id: "porstmann", t: P(17), r: FULL, f: [0.5, 0.5], mv: "in", tr: "pop" },
    { id: "porstmann", t: P(17, 3.2), r: FULL, f: [0.7, 0.45], z: 1.5, mv: "pl", tr: "wl", rot: -1.5 },
    { id: "standard", t: P(18), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page", rot: 2 },
    { id: "standard", t: P(18, 3.0), r: FULL, f: [0.4, 0.55], z: 1.5, mv: "pr", tr: "fade" },
    { id: "un-docs2", t: P(19), r: FULL, f: [0.5, 0.5], mv: "out", tr: "wr", rot: -1 },
    { id: "world", t: P(19, 3.4), r: FULL, f: [0.4, 0.45], mv: "in", tr: "zoom" },
    { id: "un-docs2", t: P(20), r: FULL, f: [0.6, 0.56], z: 1.1, mv: "pl", tr: "page", rot: 0 },
  ],
  ov: (
    <>
      <Kin x={1400} y={180} text="1918" size={220} fill={orange} a={P(17, 0.3)} b={P(17, 3.2)} rot={-4} />
      <Pill x={500} y={150} text="WALTER PORSTMANN" size={46} a={P(17, 1.2)} b={P(18)} color={teal} />
      <Kin x={500} y={300} text="BASED ON AREA" size={96} a={P(17, 3.4)} b={P(18)} />
      <Kin x={500} y={300} text="GERMAN STANDARD" size={90} a={P(18, 0.4)} b={P(18, 3.0)} fill={teal} />
      <Kin x={500} y={450} text="EARLY 1920s" size={100} a={P(18, 1.2)} b={P(18, 3.0)} fill={orange} />
      <Kin x={960} y={190} text="1975" size={200} a={P(19, 0.3)} b={P(19, 3.4)} fill={orange} />
      <Pill x={960} y={790} text="ISO 216" size={64} a={P(19, 1.3)} b={P(19, 3.4)} rot={-3} />
      <Kin x={960} y={190} text="UNITED NATIONS" size={110} a={P(20, 0.3)} b={P(21)} fill={teal} rot={-2} />
    </>
  ),
  src: (
    <>
      <Src text="Wikipedia" a={P(17, 0.3)} b={P(18)} />
      <Src text="Wikipedia + Cambridge" a={P(18, 0.3)} b={P(20)} />
      <Src text="Cambridge University" a={P(20, 0.2)} b={P(21)} />
    </>
  ),
}));

const use = scene(21, "use", (P) => ({
  shots: [
    { id: "ladder", t: P(21), r: FULL, f: [0.4, 0.55], mv: "pl", tr: "wl" },
    { id: "copier", t: P(22), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page", rot: 1.5 },
    { id: "copier", t: P(22, 3.4), r: FULL, f: [0.65, 0.55], z: 1.4, mv: "pl", tr: "zoom" },
    { id: "brochure", t: P(23), r: FULL, f: [0.45, 0.5], mv: "in", tr: "pop", rot: -2 },
    { id: "fold-hook", t: P(23, 2.6), r: FULL, f: [0.45, 0.5], z: 1.2, mv: "pr", tr: "wr" },
    { id: "world", t: P(24), r: FULL, f: [0.5, 0.45], mv: "in", tr: "fade" },
    { id: "world", t: P(24, 4.8), r: FULL, f: [0.4, 0.45], z: 1.6, mv: "pl", tr: "page", rot: 2 },
    { id: "fold-repeat", t: P(25), r: FULL, f: [0.5, 0.5], mv: "in", tr: "wl", rot: -1 },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="SCALING" size={190} fill={orange} a={P(21, 0.3)} b={P(22)} rot={-3} />
      <Kin x={500} y={300} text="A4 → A5" size={130} a={P(22, 0.4)} b={P(22, 3.4)} fill={teal} />
      <Kin x={500} y={450} text="A4 → A3" size={130} a={P(22, 1.5)} b={P(22, 3.4)} fill={orange} />
      <Kin x={1400} y={170} text="FOLD IT" size={120} a={P(23, 0.4)} b={P(23, 2.6)} fill={orange} rot={3} />
      <Kin x={960} y={190} text="A5 PAGES" size={130} a={P(23, 2.8)} b={P(24)} fill={teal} />
      <Kin x={1400} y={450} text="A5 PAGES" size={140} a={P(23, 1.0)} b={P(23, 2.6)} fill={teal} rot={-3} />
      <Kin x={960} y={170} text="MOST OF THE WORLD" size={86} a={P(24, 0.5)} b={P(24, 4.8)} fill={teal} />
      <Pill x={960} y={290} text="EXCEPT: NORTH AMERICA, PHILIPPINES, PARTS OF LATIN AMERICA" size={36} a={P(24, 1.5)} b={P(24, 4.8)} color={orange} />
      <Kin x={500} y={400} text="WE FOUND" size={100} a={P(24, 5.0)} b={P(25)} />
      <Kin x={500} y={540} text="NO SOURCE" size={140} a={P(24, 5.4)} b={P(25)} fill={RED} rot={-3} />
      <Reading x={1400} y={200} a={P(25, 0.2)} b={P(26)} />
      <Kin x={1400} y={430} text="A RULE FOR" size={110} a={P(25, 1.0)} b={P(26)} />
      <Kin x={1400} y={590} text="EVERY FOLD" size={120} a={P(25, 1.4)} b={P(26)} fill={orange} rot={-3} />
    </>
  ),
  src: (
    <>
      <Src text="Wikipedia" a={P(21, 0.3)} b={P(24, 5.6)} />
    </>
  ),
}));

const close = scene(26, "close", (P) => ({
  shots: [
    { id: "letter", t: P(26), r: FULL, f: [0.5, 0.5], mv: "pr", tr: "wr", rot: -1.5 },
    { id: "fold-hook", t: P(26, 3.2), r: FULL, f: [0.7, 0.5], z: 1.3, mv: "in", tr: "zoom" },
    { id: "standard", t: P(27), r: FULL, f: [0.5, 0.5], mv: "out", tr: "fade" },
    { id: "world", t: P(28), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page", rot: 2 },
  ],
  ov: (
    <>
      <Reading x={1400} y={150} a={P(26, 0.2)} b={P(26, 3.2)} />
      <Kin x={1400} y={700} text="1786" size={190} fill={orange} a={P(26, 0.8)} b={P(26, 3.2)} rot={-4} />
      <Kin x={960} y={190} text="YEARS TO AGREE" size={120} a={P(27, 0.3)} b={P(27, 3.2)} fill={teal} />
      <Kin x={960} y={730} text="OR ONE MORNING" size={110} a={P(27, 3.4)} b={P(28)} fill={orange} rot={-3} />
      <Kin x={500} y={330} text="1967" size={230} a={P(28, 0.4)} fill={orange} rot={-4} />
      <Kin x={500} y={600} text="WHY?" size={200} a={P(28, 2.4)} fill={teal} rot={3} />
    </>
  ),
}));

export const SCENES022V2: Record<string, React.FC<SceneProps>> = { hook, ratio, sizes, letter, standard, use, close };
