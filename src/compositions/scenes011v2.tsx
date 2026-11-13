// EM-011 v2 (kit2): fotos libres de los puentes de Spijkenisse (CC BY 2.0), 5 imagenes ChatGPT y un billete vectorial generico (sin diseno real del BCE).
import React from "react";
import { teal, orange } from "./kit";
import type { SceneProps } from "./scenes";
import { FULL, Kin, LEFT, Ov, Pill, Pip, RIGHT } from "./scenes023";
import { Cite, mkScene } from "./v2";
import { Node } from "./scenes009v2";

const CARD = "#FFFDF6";
const CC = "Roel van Deursen, Wikimedia Commons (CC BY 2.0)";
const scene = mkScene("em011-", {
  sp10: { f: "em011-spijk10.jpg", asp: 1.827, cr: CC },
  sp100: { f: "em011-spijk100.jpg", asp: 1.822, cr: CC },
  sp200: { f: "em011-spijk200.jpg", asp: 1.788, cr: CC },
  sp10b: { f: "em011-spijk10b.jpg", asp: 1.776, cr: CC },
  cart: { f: "em012-carts.jpg", asp: 1.5, cr: "Polycart, Wikimedia Commons (CC BY 2.0)", lab: "Modern carts" },
}, ["design-jury-1996"]);
const W = (id: string) => ({ id, asp: 1672 / 941 });

/** Billete generico: anverso con ventanas, reverso con un puente. No es ningun diseno real. */
const Bill: React.FC<{ a: number; b?: number; side: "front" | "back"; color?: string }> = ({ a, b, side, color = teal }) => (
  <Ov x={960} y={520} a={a} b={b} s={0.85}>
    <rect x={-380} y={-200} width={760} height={400} rx={22} fill={CARD} stroke={color} strokeWidth={10} />
    <rect x={-340} y={-160} width={680} height={320} rx={12} fill={color} opacity={0.12} />
    {side === "front"
      ? [-210, 0, 210].map((x) => <path key={x} d={`M ${x - 70} 110 V -20 A 70 70 0 0 1 ${x + 70} -20 V 110 Z`} fill={CARD} stroke={color} strokeWidth={9} />)
      : (
        <>
          <path d="M -340 40 H 340" stroke={color} strokeWidth={14} />
          {[-200, 0, 200].map((x) => <path key={x} d={`M ${x - 95} 40 A 95 95 0 0 1 ${x + 95} 40`} fill="none" stroke={color} strokeWidth={14} />)}
          <path d="M -340 120 Q -170 90 0 120 T 340 120" fill="none" stroke={color} strokeWidth={8} opacity={0.6} />
        </>
      )}
  </Ov>
);

const hook = scene(0, "hook", (P) => ({
  shots: [
    { ...W("generic-bridge"), t: 0, r: FULL, f: [0.5, 0.5], mv: "in", tr: "cut" },
    { ...W("arches-styles"), t: P(1), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "page" },
    { ...W("ecb-building"), t: P(2), r: FULL, f: [0.5, 0.5], mv: "in", tr: "fade" },
    { ...W("generic-bridge"), t: P(3), r: FULL, f: [0.6, 0.5], mv: "pr", tr: "wl" },
    { ...W("arches-styles"), t: P(4), r: FULL, f: [0.5, 0.5], mv: "in", tr: "zoom" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="TURN THE NOTE OVER" size={130} fill={orange} a={P(0, 0.2)} b={P(1)} rot={-3} />
      <Bill side="back" a={P(0, 2.0)} b={P(4)} />
      <Pill x={960} y={780} text="A BRIDGE ON THE BACK" size={60} color={teal} a={P(0, 2.4)} b={P(1)} />
      <Kin x={960} y={190} text="EVERY NOTE, A DIFFERENT BRIDGE" size={90} fill={teal} a={P(1, 0.3)} b={P(2)} rot={-3} />
      <Kin x={960} y={190} text="THE BANK SAYS:" size={110} fill={teal} a={P(2, 0.2)} b={P(2, 2.6)} rot={-3} />
      <Kin x={960} y={190} text="NOT REAL BRIDGES" size={130} fill={orange} a={P(2, 2.8)} b={P(3)} rot={3} />
      <Kin x={960} y={190} text="A BRIDGE EDITOR, PER A PODCAST" size={80} fill={teal} a={P(3, 0.3)} b={P(4)} rot={-3} />
      <Pill x={960} y={780} text="THOUGHT HE RECOGNIZED SOME" size={52} color={orange} a={P(3, 3.0)} b={P(4)} />
      <Kin x={960} y={190} text="WHY?" size={230} fill={orange} rot={-4} a={P(4, 0.6)} />
      <Pip x={1660} y={780} a={P(4, 1.4)} s={0.9} arm="chin" />
    </>
  ),
  simp: [P(0, 2.0), P(4)],
}));

const design = scene(5, "design", (P) => ({
  shots: [
    { ...W("arches-styles"), t: P(5), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page" },
    { ...W("ecb-building"), t: P(6), r: FULL, f: [0.4, 0.5], mv: "pl", tr: "fade" },
    { ...W("generic-bridge"), t: P(7), r: FULL, f: [0.5, 0.5], mv: "in", tr: "wl" },
    { ...W("arches-styles"), t: P(8), r: FULL, f: [0.3, 0.5], mv: "pr", tr: "wr" },
    { ...W("ecb-building"), t: P(9), r: FULL, f: [0.6, 0.5], mv: "in", tr: "fade" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="THE FRONT: WINDOWS" size={120} fill={teal} a={P(5, 0.2)} b={P(6)} rot={-3} />
      <Bill side="front" a={P(5, 1.2)} b={P(6, 3.0)} />
      <Pill x={960} y={780} text="WINDOWS AND DOORWAYS" size={60} color={orange} a={P(5, 1.6)} b={P(6)} />
      <Kin x={960} y={190} text="OPENNESS AND COOPERATION" size={90} fill={orange} a={P(6, 0.5)} b={P(7)} rot={-3} />
      <Pill x={960} y={762} text="ACCORDING TO THE BANK" size={52} color={teal} a={P(6, 1.4)} b={P(7)} />
      <Kin x={960} y={190} text="THE BACK: BRIDGES" size={120} fill={orange} a={P(7, 0.2)} b={P(7, 3.8)} rot={-3} />
      <Bill side="back" a={P(7, 0.6)} b={P(8)} color={orange} />
      <Kin x={960} y={190} text="COMMUNICATION" size={130} fill={teal} a={P(7, 4.0)} b={P(8)} rot={3} />
      <Pill x={960} y={780} text="BETWEEN PEOPLE, AND THE WORLD" size={50} color={teal} a={P(7, 5.0)} b={P(8)} />
      <Kin x={960} y={190} text="EACH NOTE, ITS OWN STYLE" size={100} fill={teal} a={P(8, 0.2)} b={P(9)} rot={-3} />
      {[
        ["5", "Classical", teal, 2.8],
        ["10", "Romanesque", orange, 4.2],
        ["20", "Gothic", teal, 5.4],
        ["50", "Renaissance", orange, 6.8],
        ["100", "Baroque", teal, 8.2],
      ].map(([y, t, c, o], i) => <Node key={y as string} x={290 + i * 345} y={520} s={0.78} year={y as string} text={t as string} color={c as string} a={P(8, o as number)} b={P(9)} />)}
      <Kin x={960} y={190} text="A TOUR OF EUROPEAN HISTORY" size={90} fill={teal} a={P(9, 0.2)} b={P(9, 4.6)} rot={-3} />
      <Kin x={960} y={190} text="BUT NOTHING REAL" size={140} fill={orange} a={P(9, 4.8)} b={P(10)} rot={3} />
      <Pill x={960} y={725} text="NO ACTUAL EXISTING MONUMENT" size={52} color={teal} a={P(9, 5.4)} b={P(10)} />
    </>
  ),
  src: <Cite text="facts from European Central Bank (design elements)" a={P(5, 0.3)} b={P(10)} y={832} />,
  simp: [P(5, 1.2), P(10)],
}));

const rule = scene(10, "rule", (P) => ({
  shots: [
    { ...W("design-jury-1996"), t: P(10), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page" },
    { ...W("generic-bridge"), t: P(11), r: RIGHT, f: [0.5, 0.5], mv: "pl", tr: "pop", rot: 1.5 },
    { ...W("design-jury-1996"), t: P(12), r: FULL, f: [0.4, 0.5], mv: "pr", tr: "wl" },
    { ...W("design-jury-1996"), t: P(13), r: LEFT, f: [0.5, 0.5], z: 1.3, mv: "in", tr: "wr", rot: -1.5 },
    { ...W("ecb-building"), t: P(14), r: FULL, f: [0.5, 0.5], mv: "in", tr: "fade" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="WHY NOT USE REAL ONES?" size={110} fill={orange} a={P(10, 0.2)} b={P(11)} rot={-3} />
      <Pill x={960} y={780} text="MONEY FOR MANY COUNTRIES" size={56} color={teal} a={P(10, 1.8)} b={P(11)} />
      <Kin x={500} y={250} text="EVERY COUNTRY WANTS" size={90} fill={teal} a={P(11, 0.2)} b={P(12)} rot={-3} />
      <Kin x={500} y={400} text="ITS OWN BRIDGE" size={110} fill={orange} a={P(11, 1.0)} b={P(12)} rot={3} />
      <Kin x={960} y={190} text="THE CONTEST BANNED:" size={110} fill={teal} a={P(12, 0.4)} b={P(13)} rot={-3} />
      <Pill x={960} y={420} text="NATIONAL HEROES" size={64} color={orange} a={P(12, 3.0)} b={P(13)} />
      <Pill x={960} y={560} text="NATIONAL SYMBOLS" size={64} color={teal} a={P(12, 4.4)} b={P(13)} />
      <Pill x={960} y={700} text="NATIONAL MONUMENTS" size={64} color={orange} a={P(12, 5.8)} b={P(13)} />
      <Kin x={1440} y={250} text="1996" size={200} fill={orange} a={P(13, 0.2)} b={P(14)} rot={-3} />
      <Pill x={1440} y={470} text="ROBERT KALINA, AUSTRIA" size={52} color={teal} a={P(13, 1.4)} b={P(14)} />
      <Pill x={1440} y={600} text="ANNOUNCED IN DECEMBER" size={52} color={orange} a={P(13, 4.2)} b={P(14)} />
      <Kin x={960} y={190} text="EVERY BRIDGE INVENTED" size={100} fill={teal} a={P(14, 0.2)} b={P(15)} rot={-3} />
      <Kin x={960} y={350} text="NO COUNTRY WINS" size={120} fill={orange} a={P(14, 2.0)} b={P(15)} rot={3} />
      <Kin x={960} y={510} text="NO COUNTRY LOSES" size={110} fill={teal} a={P(14, 3.4)} b={P(15)} rot={-3} />
    </>
  ),
  src: <Cite text="facts from 99% Invisible (podcast) + Wikipedia" a={P(12, 0.3)} b={P(15)} y={832} />,
}));

const twist = scene(15, "twist", (P) => ({
  shots: [
    { ...W("design-jury-1996"), t: P(15), r: FULL, f: [0.6, 0.5], mv: "pl", tr: "page" },
    { ...W("arches-styles"), t: P(16), r: FULL, f: [0.5, 0.5], mv: "in", tr: "fade" },
    { ...W("generic-bridge"), t: P(17), r: RIGHT, f: [0.5, 0.5], mv: "in", tr: "pop", rot: 1.5 },
    { ...W("generic-bridge"), t: P(18), r: FULL, f: [0.5, 0.5], mv: "pr", tr: "wl" },
    { ...W("design-jury-1996"), t: P(19), r: LEFT, f: [0.4, 0.5], z: 1.3, mv: "in", tr: "wr", rot: -1.5 },
    { ...W("ecb-building"), t: P(20), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "fade" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="BUT HERE'S THE TWIST" size={110} fill={orange} a={P(15, 0.2)} b={P(15, 3.0)} rot={-3} />
      <Node x={520} y={470} year="EARLY" text="Real bridges|(Rialto, Venice)" color={orange} a={P(15, 3.2)} b={P(17)} />
      <Node x={1400} y={470} year="FINAL" text="Redrawn|more generic" color={teal} a={P(16, 0.2)} b={P(17)} />
      <Kin x={960} y={190} text="EARLY DRAFTS" size={130} fill={orange} a={P(15, 3.6)} b={P(16)} rot={-3} />
      <Pill x={960} y={780} text="REDRAWN TO LOOK GENERIC" size={52} color={teal} a={P(16, 0.4)} b={P(17)} />
      <Kin x={500} y={250} text="RUSS SWAN," size={110} fill={teal} a={P(17, 0.4)} b={P(18)} rot={-3} />
      <Kin x={500} y={400} text="BRIDGE MAGAZINE" size={100} fill={orange} a={P(17, 1.4)} b={P(18)} rot={3} />
      <Pill x={500} y={620} text="THOUGHT HE SAW REAL BRIDGES" size={44} color={teal} a={P(17, 3.2)} b={P(18)} />
      <Kin x={960} y={190} text="NORTHERN FRANCE" size={130} fill={orange} a={P(18, 0.3)} b={P(19)} rot={-3} />
      <Pill x={960} y={780} text="A BRIDGE HE VISITED WEEKS BEFORE" size={48} color={teal} a={P(18, 1.4)} b={P(19)} />
      <Kin x={1440} y={250} text="KALINA SAYS:" size={100} fill={teal} a={P(19, 0.3)} b={P(20)} rot={-3} />
      <Kin x={1440} y={400} text="GENERIC ENOUGH..." size={90} fill={orange} a={P(19, 1.2)} b={P(20)} rot={3} />
      <Kin x={1440} y={550} text="BUT APPARENTLY NOT" size={90} fill={teal} a={P(19, 3.2)} b={P(20)} rot={-3} />
      <Kin x={960} y={190} text="ONE PODCAST" size={130} fill={teal} a={P(20, 0.3)} b={P(20, 4.0)} rot={-3} />
      <Pill x={960} y={780} text="TAKE THE DETAILS WITH SALT" size={56} color={orange} a={P(20, 1.4)} b={P(20, 4.0)} />
      <Kin x={960} y={190} text="THE BANK: NOT REAL" size={120} fill={orange} a={P(20, 4.4)} b={P(21)} rot={3} />
    </>
  ),
  src: <Cite text="facts from Wikipedia + 99% Invisible (podcast)" a={P(15, 0.3)} b={P(21)} y={832} />,
  simp: [P(15, 3.2), P(17)],
}));

const real = scene(21, "real", (P) => ({
  shots: [
    { id: "sp10", t: P(21), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page" },
    { id: "sp100", t: P(22), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "wl" },
    { id: "sp200", t: P(22, 4.8), r: RIGHT, f: [0.5, 0.5], mv: "in", tr: "pop", rot: 1.5 },
    { id: "sp10b", t: P(23), r: FULL, f: [0.5, 0.5], mv: "in", tr: "fade" },
    { id: "sp200", t: P(24), r: FULL, f: [0.5, 0.5], mv: "pr", tr: "wr" },
    { id: "sp10", t: P(25), r: LEFT, f: [0.4, 0.5], z: 1.2, mv: "in", tr: "wl", rot: -1.5 },
    { id: "sp100", t: P(26), r: FULL, f: [0.5, 0.5], mv: "in", tr: "zoom" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="THEN SOMEONE" size={130} fill={teal} a={P(21, 0.2)} b={P(22)} rot={-3} />
      <Kin x={960} y={350} text="BUILT THEM" size={150} fill={orange} a={P(21, 1.2)} b={P(22)} rot={3} />
      <Kin x={960} y={190} text="ROBIN STAM" size={130} fill={orange} a={P(22, 0.3)} b={P(22, 4.5)} rot={-3} />
      <Pill x={960} y={700} text="DUTCH ARTIST" size={56} color={teal} a={P(22, 1.0)} b={P(22, 4.5)} />
      <Kin x={500} y={190} text="7 BRIDGES" size={150} fill={teal} a={P(22, 4.8)} b={P(23)} rot={-3} />
      <Pill x={500} y={400} text="SPIJKENISSE" size={64} color={orange} a={P(22, 6.0)} b={P(23)} />
      <Pill x={500} y={530} text="NEAR ROTTERDAM" size={56} color={teal} a={P(22, 7.2)} b={P(23)} />
      <Kin x={960} y={190} text="COLORED CONCRETE" size={120} fill={orange} a={P(23, 0.3)} b={P(24)} rot={-3} />
      <Pill x={960} y={700} text="AROUND A HOUSING ESTATE" size={52} color={teal} a={P(23, 1.4)} b={P(24)} />
      <Kin x={960} y={190} text="WALK OR BIKE" size={140} fill={teal} a={P(24, 0.3)} b={P(24, 3.4)} rot={-3} />
      <Pill x={960} y={700} text="WITHIN WALKING DISTANCE" size={52} color={orange} a={P(24, 3.8)} b={P(25)} />
      <Kin x={960} y={190} text="WHEN? SOURCES DISAGREE" size={100} fill={orange} a={P(25, 0.2)} b={P(26)} rot={-3} />
      <Node x={1230} y={480} s={0.8} year="2011" text="Some sources" color={teal} a={P(25, 2.2)} b={P(26)} />
      <Node x={1640} y={480} s={0.8} year="2013" text="Others" color={orange} a={P(25, 3.8)} b={P(26)} />
      <Kin x={960} y={190} text="THE MONEY CAME FIRST" size={110} fill={teal} a={P(26, 0.3)} b={P(26, 3.0)} rot={-3} />
      <Kin x={960} y={350} text="THE CONCRETE LATER" size={120} fill={orange} a={P(26, 3.0)} b={P(27)} rot={3} />
    </>
  ),
  src: <Cite text="facts from Euronews + 99% Invisible" a={P(22, 0.3)} b={P(27)} y={824} />,
  simp: [P(25, 2.2), P(26)],
}));

const future = scene(27, "future", (P) => ({
  shots: [
    { ...W("arches-styles"), t: P(27), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page" },
    { ...W("europa-vase"), t: P(28), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "wl" },
    { ...W("ecb-building"), t: P(29), r: FULL, f: [0.5, 0.5], mv: "in", tr: "fade" },
    { ...W("generic-bridge"), t: P(30), r: FULL, f: [0.4, 0.5], mv: "pr", tr: "wr" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="THE NEWER NOTES:" size={110} fill={teal} a={P(27, 0.2)} b={P(27, 3.0)} rot={-3} />
      <Kin x={960} y={190} text="SAME IDEA" size={150} fill={orange} a={P(27, 3.2)} b={P(28)} rot={3} />
      <Pill x={960} y={780} text="WINDOWS FRONT, BRIDGES BACK" size={52} color={teal} a={P(27, 3.8)} b={P(28)} />
      <Kin x={960} y={190} text="EUROPA" size={150} fill={orange} a={P(28, 0.3)} b={P(29)} rot={-3} />
      <Pill x={960} y={780} text="PORTRAIT FROM A LOUVRE VASE" size={52} color={teal} a={P(28, 1.4)} b={P(29)} />
      <Kin x={960} y={190} text="NEXT SERIES: TWO THEMES" size={100} fill={teal} a={P(29, 0.3)} b={P(30)} rot={-3} />
      <Pill x={960} y={500} text="EUROPEAN CULTURE" size={64} color={orange} a={P(29, 2.6)} b={P(30)} />
      <Pill x={960} y={650} text="RIVERS AND BIRDS" size={64} color={teal} a={P(29, 4.8)} b={P(30)} />
      <Kin x={960} y={190} text="EXPECTED: AROUND END OF 2026" size={72} fill={orange} a={P(30, 0.3)} b={P(30, 4.8)} rot={-3} />
      <Pill x={960} y={780} text="THEN SEVERAL YEARS TO ARRIVE" size={52} color={teal} a={P(30, 4.8)} b={P(30, 7.6)} />
      <Pill x={960} y={780} text="YOUR NOTES KEEP THEIR VALUE" size={52} color={orange} a={P(30, 7.8)} b={P(31)} />
    </>
  ),
  src: <Cite text="facts from European Central Bank" a={P(27, 0.3)} b={P(31)} y={832} />,
}));

const game = scene(31, "game", (P) => ({
  shots: [
    { ...W("arches-styles"), t: P(31), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page" },
    { ...W("generic-bridge"), t: P(32), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "fade" },
    { id: "sp200", t: P(33), r: FULL, f: [0.5, 0.5], mv: "in", tr: "wl" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="PLAY A GAME" size={170} fill={orange} a={P(31, 0.3)} b={P(32)} rot={-3} />
      <Pill x={960} y={780} text="CHECK THE NUMBER, GUESS THE STYLE" size={48} color={teal} a={P(31, 1.8)} b={P(32)} />
      <Node x={520} y={470} s={0.9} year="20" text="Gothic" color={teal} a={P(32, 0.4)} b={P(33)} />
      <Node x={1400} y={470} s={0.9} year="50" text="Renaissance" color={orange} a={P(32, 1.8)} b={P(33)} />
      <Kin x={960} y={190} text="THEN FIND THE BRIDGE" size={100} fill={teal} a={P(32, 3.2)} b={P(33)} rot={-3} />
      <Pill x={960} y={780} text="ITS TWIN IN REAL LIFE" size={52} color={orange} a={P(32, 4.4)} b={P(33)} />
      <Kin x={960} y={190} text="NO EXACT MATCH" size={140} fill={orange} a={P(33, 0.3)} b={P(34)} rot={-3} />
      <Kin x={960} y={350} text="THAT'S THE IDEA" size={110} fill={teal} a={P(33, 2.4)} b={P(34)} rot={3} />
    </>
  ),
  simp: [P(32, 0.4), P(33)],
}));

const close = scene(34, "close", (P) => ({
  shots: [
    { ...W("generic-bridge"), t: P(34), r: FULL, f: [0.5, 0.5], mv: "in", tr: "cut" },
    { id: "cart", t: P(35), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page" },
    { id: "cart", t: P(36), r: FULL, f: [0.6, 0.5], z: 1.3, mv: "in", tr: "zoom" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="A CAREFUL FICTION" size={140} fill={orange} a={P(34, 0.4)} b={P(35)} rot={-3} />
      <Kin x={960} y={350} text="A TOUR OF EUROPE" size={110} fill={teal} a={P(34, 2.4)} b={P(35)} rot={3} />
      <Pill x={960} y={780} text="WITH NO OFFICIAL ADDRESS" size={52} color={orange} a={P(34, 4.2)} b={P(35)} />
      <Kin x={960} y={190} text="NOW, THE SUPERMARKET" size={110} fill={teal} a={P(35, 0.3)} b={P(36)} rot={-3} />
      <Kin x={960} y={350} text="GRAB A CART" size={140} fill={orange} a={P(35, 2.6)} b={P(36)} rot={3} />
      <Kin x={960} y={190} text="WHY DID SHOPPERS NEED" size={100} fill={teal} a={P(36, 0.2)} rot={-3} />
      <Kin x={960} y={350} text="CONVINCING?" size={150} fill={orange} a={P(36, 1.4)} rot={3} />
      <Pip x={1660} y={780} a={P(36, 2.0)} s={0.9} arm="point" />
    </>
  ),
}));

export const SCENES011V2: Record<string, React.FC<SceneProps>> = { hook, design, rule, twist, real, future, game, close };
