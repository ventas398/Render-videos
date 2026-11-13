// EM-008 v2 (kit2): fotos de dominio publico de 1896 y 1908 (Dorando, Windsor), 5 imagenes ChatGPT y diagramas propios (ruta, pista, linea mas corta, cronologia).
import React from "react";
import { teal, orange, ink } from "./kit";
import type { SceneProps } from "./scenes";
import { FULL, Kin, LEFT, Ov, Pill, Pip, RIGHT } from "./scenes023";
import { Cite, mkScene } from "./v2";
import { Def, Node, T } from "./scenes009v2";

const CARD = "#FFFDF6";
const scene = mkScene("em008-", {
  merson: { f: "em008-merson.jpg", asp: 1.28, cr: "Luc-Olivier Merson, 1869 (public domain)", lab: "Painting, 1869" },
  athens96: { f: "em008-athens96.jpg", asp: 1.438, cr: "Burton Holmes, 1901 (public domain)" },
  stadium: { f: "em008-stadium.jpg", asp: 1.502, cr: "Jebulon, Wikimedia Commons (CC0)", lab: "Illustrative image" },
  windsor: { f: "em008-windsor08.jpg", asp: 1.164, cr: "IOC photographer, 1908 (public domain)" },
  dorando1: { f: "em008-dorando1.jpg", asp: 1.164, cr: "Unknown author, 1908 (public domain)" },
  whitecity: { f: "em008-whitecity.jpg", asp: 3.593, cr: "Unknown author, 1908 (public domain)" },
  wstart: { f: "em008-windsor-start.png", asp: 1.387, cr: "Theodore A. Cook, 1908 (public domain)" },
  dorando2: { f: "em008-dorando2.jpg", asp: 1.414, cr: "Unknown author, 1908 (public domain)" },
});
const W = (id: string) => ({ id, asp: 1672 / 941 });

/** Ruta Maraton -> Atenas. */
const Route: React.FC<{ a: number; b?: number }> = ({ a, b }) => (
  <Ov x={960} y={470} a={a} b={b}>
    <rect x={-640} y={-190} width={1280} height={380} rx={30} fill={CARD} stroke={teal} strokeWidth={8} />
    <path d="M -430 40 C -250 -60 -120 120 40 20 S 300 -40 430 40" fill="none" stroke={teal} strokeWidth={14} strokeDasharray="30 22" strokeLinecap="round" />
    <circle cx={-430} cy={40} r={26} fill={orange} />
    <circle cx={430} cy={40} r={26} fill={orange} />
    <T x={-430} y={110} s={50} w={900} fill={orange}>MARATHON</T>
    <T x={430} y={110} s={50} w={900} fill={orange}>ATHENS</T>
    <T x={0} y={-110} s={64} w={900} fill={teal}>ABOUT 40 KM = 25 MILES</T>
  </Ov>
);

/** Pista del estadio de 1908: entrada real, entrada usada y los 385 yardas. Esquema, no a escala. */
const Track: React.FC<{ a: number; b?: number; reveal?: number; arc?: number }> = ({ a, b, reveal = 0, arc }) => (
  <Ov x={960} y={440} a={a} b={b}>
    <rect x={-640} y={-260} width={1280} height={520} rx={30} fill={CARD} stroke={ink} strokeWidth={6} />
    <ellipse cx={0} cy={20} rx={430} ry={190} fill="#DDEBE4" stroke={ink} strokeWidth={10} />
    <ellipse cx={0} cy={20} rx={270} ry={90} fill={CARD} stroke={ink} strokeWidth={5} />
    <rect x={-100} y={-212} width={200} height={44} rx={10} fill={orange} />
    <T x={0} y={-190} s={28} w={900} fill={CARD}>ROYAL BOX</T>
    <T x={0} y={-130} s={34} w={800} fill={orange}>FINISH</T>
    <circle cx={-430} cy={20} r={20} fill={ink} opacity={reveal ? 0.9 : 0.3} />
    <text x={-430} y={20} textAnchor="middle" dominantBaseline="central" fontSize={26} fontWeight={900} fill={CARD} opacity={reveal ? 1 : 0}>x</text>
    <T x={-545} y={-10} s={28} w={800} fill={ink}>ROYAL</T>
    <T x={-545} y={26} s={28} w={800} fill={ink}>ENTRANCE</T>
    <circle cx={430} cy={20} r={20} fill={teal} />
    <T x={545} y={-10} s={28} w={800} fill={teal}>ENTRANCE</T>
    <T x={545} y={26} s={28} w={800} fill={teal}>USED</T>
    {arc ? <ellipse cx={0} cy={20} rx={430} ry={190} fill="none" stroke={orange} strokeWidth={22} strokeLinecap="round" pathLength={100} strokeDasharray={`${arc} ${100 - arc}`} transform="translate(0 40) scale(1 -1)" /> : null}
    <T x={0} y={235} s={36} w={800} fill={ink}>NOT TO SCALE</T>
  </Ov>
);

/** Linea mas corta frente a la linea real de carrera. */
const Lines: React.FC<{ a: number; b?: number; real?: number }> = ({ a, b, real }) => (
  <Ov x={960} y={450} a={a} b={b}>
    <rect x={-700} y={-250} width={1400} height={500} rx={30} fill={CARD} stroke={ink} strokeWidth={6} />
    <path d="M -620 100 C -380 100 -300 -110 -60 -110 S 300 100 620 100" fill="none" stroke="#C9CCD1" strokeWidth={170} strokeLinecap="round" />
    <path d="M -620 150 C -400 150 -330 -60 -80 -60 S 280 150 620 150" fill="none" stroke={orange} strokeWidth={12} strokeLinecap="round" />
    {real ? <path d="M -620 90 C -380 90 -300 -150 -60 -150 S 300 90 620 90" fill="none" stroke={teal} strokeWidth={12} strokeDasharray="26 20" strokeLinecap="round" /> : null}
    <T x={-380} y={-200} s={44} w={900} fill={orange}>SHORTEST POSSIBLE LINE</T>
    {real ? <T x={400} y={-200} s={44} w={900} fill={teal}>THE LINE YOU RUN</T> : null}
  </Ov>
);

const hook = scene(0, "hook", (P) => ({
  shots: [
    { id: "finish", t: 0, r: FULL, f: [0.5, 0.55], mv: "in", tr: "cut" },
    { ...W("athens-1896"), t: P(2), r: FULL, f: [0.6, 0.5], mv: "pl", tr: "wl" },
    { id: "stadium", t: P(3), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page" },
    { id: "finish", t: P(4), r: FULL, f: [0.5, 0.5], mv: "in", tr: "zoom" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="HOW LONG IS A MARATHON?" size={100} fill={orange} a={P(0, 0.2)} b={P(1)} rot={-3} />
      <Kin x={500} y={230} text="26.2 MILES" size={150} fill={orange} a={P(1, 0.3)} b={P(2)} rot={-3} />
      <Kin x={1400} y={400} text="42 KM" size={150} fill={teal} a={P(1, 1.8)} b={P(2)} rot={3} />
      <Kin x={960} y={190} text="STRANGE NUMBER" size={150} fill={orange} a={P(2, 0.3)} b={P(3)} rot={-3} />
      <Pill x={960} y={800} text="NOT 25.  NOT 30.  NOT 40." size={64} color={teal} a={P(2, 2.0)} b={P(3)} />
      <Kin x={960} y={190} text="OLYMPEDIA SAYS:" size={130} fill={teal} a={P(3, 2.4)} b={P(4)} rot={-3} />
      <Kin x={960} y={350} text="CERTAINLY FALSE" size={130} fill={orange} a={P(3, 4.4)} b={P(4)} rot={3} />
      <Kin x={960} y={190} text="WHY?" size={230} fill={orange} rot={-4} a={P(4, 0.6)} />
      <Pip x={1660} y={780} a={P(4, 1.4)} s={0.9} arm="chin" />
    </>
  ),
}));

const legend = scene(5, "legend", (P) => ({
  shots: [
    { ...W("greek-messenger"), t: P(5), r: FULL, f: [0.4, 0.5], mv: "in", tr: "page" },
    { id: "merson", t: P(5, 5.0), r: RIGHT, f: [0.5, 0.45], mv: "in", tr: "pop", rot: 1.5 },
    { id: "athens96", t: P(6), r: FULL, f: [0.5, 0.5], mv: "pr", tr: "fade" },
    { ...W("athens-1896"), t: P(7), r: FULL, f: [0.7, 0.5], mv: "pl", tr: "wr" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="THE LEGEND" size={170} fill={orange} a={P(5, 0.3)} b={P(5, 4.8)} rot={-3} />
      <Kin x={500} y={250} text="A MESSENGER," size={110} fill={teal} a={P(5, 5.2)} b={P(6)} rot={-3} />
      <Kin x={500} y={420} text="A VICTORY," size={110} fill={orange} a={P(5, 6.2)} b={P(6)} rot={3} />
      <Kin x={500} y={590} text="THEN HE DIES" size={100} fill={teal} a={P(5, 7.2)} b={P(6)} rot={-3} />
      <Pill x={960} y={800} text="A FRENCH SCHOLAR'S IDEA" size={64} color={teal} a={P(6, 0.4)} b={P(6, 3.6)} />
      <Kin x={960} y={190} text="ATHENS 1896" size={170} fill={orange} a={P(6, 3.8)} b={P(7)} rot={-3} />
      <Route a={P(7, 0.5)} b={P(8)} />
    </>
  ),
  src: <Cite text="Wikipedia" a={P(5, 0.3)} b={P(6)} y={832} />,
  simp: [P(7, 0.5), P(8)],
}));

const distances = scene(8, "distances", (P) => ({
  shots: [
    { id: "athens96", t: P(8), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "page" },
    { id: "stadium", t: P(9), r: FULL, f: [0.4, 0.5], mv: "in", tr: "fade" },
    { ...W("athens-1896"), t: P(10), r: FULL, f: [0.3, 0.5], mv: "pr", tr: "wl" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="ALWAYS 26.2?" size={170} fill={teal} a={P(8, 0.2)} b={P(9)} rot={-3} />
      <Kin x={960} y={380} text="NOT EVEN CLOSE" size={150} fill={orange} a={P(8, 1.8)} b={P(9)} rot={3} />
      <Kin x={960} y={190} text="IT CHANGED EVERY GAMES" size={120} fill={orange} a={P(9, 0.3)} b={P(9, 3.8)} rot={-3} />
      <Pill x={960} y={800} text="DEPENDING ON TWO POINTS" size={64} color={teal} a={P(9, 3.8)} b={P(10)} />
      <Node x={520} y={440} year="1900" text="Paris|a little over|40 km" color={teal} a={P(10, 0.3)} b={P(11)} />
      <Node x={1400} y={440} year="1904" text="Saint Louis|about|40 km" color={orange} a={P(10, 3.6)} b={P(11)} />
      <Kin x={960} y={190} text="NO STANDARD" size={150} fill={orange} a={P(10, 6.6)} b={P(11)} rot={-3} />
    </>
  ),
  src: <Cite text="Wikipedia" a={P(9, 0.3)} b={P(11)} y={832} />,
  simp: [P(10, 0.3), P(11)],
}));

const london = scene(11, "london", (P) => ({
  shots: [
    { id: "windsor", t: P(11), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page" },
    { id: "wstart", t: P(12), r: LEFT, f: [0.7, 0.5], mv: "in", tr: "pop", rot: -1.5 },
    { id: "whitecity", t: P(12, 4.5), r: [970, 660, 880, 245], mv: "pl", tr: "pop", rot: 1.5 },
    { id: "windsor", t: P(13), r: LEFT, f: [0.35, 0.55], z: 1.3, mv: "in", tr: "wl", rot: -1.5 },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="LONDON, JULY 1908" size={150} fill={orange} a={P(11, 0.3)} b={P(12)} rot={-3} />
      <Kin x={500} y={250} text="START:" size={100} fill={teal} a={P(12, 0.4)} b={P(12, 4.5)} rot={-3} />
      <Kin x={500} y={400} text="WINDSOR CASTLE" size={100} fill={orange} a={P(12, 1.2)} b={P(12, 4.5)} rot={3} />
      <Kin x={1400} y={250} text="FINISH:" size={100} fill={teal} a={P(12, 4.8)} b={P(13)} rot={-3} />
      <Kin x={1400} y={400} text="ROYAL BOX" size={110} fill={orange} a={P(12, 5.6)} b={P(13)} rot={3} />
      <Pill x={1400} y={540} text="A PRINCESS GAVE THE SIGNAL" size={44} color={teal} a={P(12, 6.6)} b={P(13)} />
      <Kin x={1400} y={190} text="ABOUT 26 MILES" size={110} fill={teal} a={P(13, 0.4)} b={P(14)} rot={-3} />
      <Kin x={1400} y={350} text="+ 385 YARDS" size={140} fill={orange} a={P(13, 2.6)} b={P(14)} rot={3} />
      <Kin x={960} y={190} text="WHY THOSE YARDS?" size={130} fill={orange} a={P(14, 0.2)} b={P(14, 2.0)} rot={-3} />
      <Track a={P(14, 2.0)} b={P(15)} reveal={1} />
      <Track a={P(15)} b={P(16)} reveal={1} arc={25} />
      <Pill x={960} y={765} text="ONE ACCOUNT, NOT PROVEN" size={52} color={teal} a={P(14, 5.0)} b={P(15)} />
    </>
  ),
  src: <Cite text="Wikipedia + Windsor Local History Group" a={P(14, 1.0)} b={P(16)} y={832} />,
  simp: [P(14, 2.0), P(16)],
}));

const myth = scene(16, "myth", (P) => ({
  shots: [
    { id: "windsor", t: P(16), r: FULL, f: [0.7, 0.4], mv: "pr", tr: "page" },
    { id: "wstart", t: P(18), r: RIGHT, f: [0.75, 0.5], z: 1.2, mv: "in", tr: "fade", rot: 1.5 },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="THE NURSERY WINDOW" size={120} fill={orange} a={P(16, 0.3)} b={P(17)} rot={-3} />
      <Pill x={960} y={800} text="START UNDER THE ROYAL CHILDREN'S WINDOWS" size={48} color={teal} a={P(16, 2.4)} b={P(17)} />
      <Kin x={960} y={190} text="OLYMPEDIA:" size={120} fill={teal} a={P(17, 0.2)} b={P(18)} rot={-3} />
      <Kin x={960} y={360} text="CERTAINLY FALSE" size={150} fill={orange} a={P(17, 0.9)} b={P(18)} rot={3} />
      <Pill x={500} y={250} text="THE YEAR BEFORE" size={52} color={teal} a={P(18, 0.3)} b={P(19)} />
      <Pill x={500} y={400} text="ORGANIZERS ASKED TO START" size={44} color={orange} a={P(18, 1.8)} b={P(19)} />
      <Pill x={500} y={510} text="AT WINDSOR" size={44} color={orange} a={P(18, 2.6)} b={P(19)} />
      <Pill x={500} y={700} text="THE ROYALS HAD NOT ASKED" size={52} color={teal} a={P(18, 6.0)} b={P(19)} />
      <Kin x={1400} y={190} text="NICE STORY," size={100} fill={orange} a={P(18, 8.4)} b={P(19)} rot={3} />
      <Kin x={1400} y={330} text="NO RECORDS" size={110} fill={teal} a={P(18, 9.6)} b={P(19)} rot={-3} />
    </>
  ),
  src: <Cite text="Olympedia" a={P(17, 0.3)} b={P(19)} y={832} />,
}));

const dorando = scene(19, "dorando", (P) => ({
  shots: [
    { id: "dorando2", t: P(19), r: FULL, f: [0.5, 0.45], mv: "in", tr: "page" },
    { id: "dorando1", t: P(20), r: RIGHT, f: [0.5, 0.5], mv: "in", tr: "pop", rot: 1.5 },
    { id: "dorando2", t: P(21), r: FULL, f: [0.45, 0.5], mv: "pl", tr: "wl" },
    { id: "dorando1", t: P(22), r: FULL, f: [0.5, 0.45], z: 1.1, mv: "pr", tr: "fade" },
    { id: "dorando2", t: P(23), r: LEFT, f: [0.5, 0.45], z: 1.2, mv: "in", tr: "wr", rot: -1.5 },
    { ...W("athens-1896"), t: P(24), r: FULL, f: [0.5, 0.5], mv: "in", tr: "zoom" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="WHAT REALLY HAPPENED" size={110} fill={teal} a={P(19, 0.2)} b={P(20)} rot={-3} />
      <Kin x={480} y={250} text="DORANDO PIETRI" size={82} fill={orange} a={P(20, 0.4)} b={P(21)} rot={-3} />
      <Pill x={500} y={430} text="ABOUT 1 MILE TO GO" size={56} color={teal} a={P(20, 1.6)} b={P(21)} />
      <Kin x={500} y={190} text="HE FELL," size={140} fill={orange} a={P(21, 1.6)} b={P(22)} rot={-3} />
      <Kin x={500} y={350} text="GOT UP," size={140} fill={teal} a={P(21, 2.8)} b={P(22)} rot={3} />
      <Kin x={500} y={510} text="FELL AGAIN" size={140} fill={orange} a={P(21, 3.6)} b={P(22)} rot={-3} />
      <Kin x={960} y={190} text="OFFICIALS HELPED" size={150} fill={orange} a={P(22, 0.3)} b={P(23)} rot={-3} />
      <Kin x={1400} y={250} text="DISQUALIFIED" size={110} fill={orange} a={P(23, 1.0)} b={P(24)} rot={4} />
      <Pill x={1400} y={430} text="JOHNNY HAYES (USA): GOLD" size={50} color={teal} a={P(23, 3.6)} b={P(24)} />
      <Kin x={960} y={190} text="NEXT DAY: A SPECIAL CUP" size={110} fill={teal} a={P(24, 0.3)} b={P(24, 3.2)} rot={-3} />
      <Pill x={960} y={800} text="QUEEN ALEXANDRA GAVE IT TO HIM" size={52} color={orange} a={P(24, 1.2)} b={P(24, 3.2)} />
      <Kin x={960} y={190} text="A CELEBRITY ANYWAY" size={120} fill={orange} a={P(24, 3.4)} rot={-3} />
    </>
  ),
  src: <Cite text="Olympedia + Wikipedia" a={P(19, 0.3)} b={P(25)} y={832} />,
}));

const official = scene(25, "official", (P) => ({
  shots: [
    { id: "stadium", t: P(25), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page" },
    { id: "athens96", t: P(26, 3.2), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "fade" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="1921" size={220} fill={orange} a={P(25, 0.2)} b={P(25, 4.6)} rot={-3} />
      <Def y={560} title="26 MILES 385 YARDS" color={teal} lines={[]} w={1200} a={P(25, 3.0)} b={P(26)} />
      <Kin x={470} y={190} text="ITS OWN MINUTES" size={100} fill={teal} a={P(26, 0.3)} b={P(26, 3.2)} rot={-3} />
      <Kin x={1460} y={190} text="ARE SILENT" size={120} fill={orange} a={P(26, 1.2)} b={P(26, 3.2)} rot={3} />
      <Pill x={500} y={420} text="WHO: KNOWN" size={64} color={teal} a={P(26, 3.4)} b={P(27)} />
      <Pill x={1400} y={420} text="WHY: NOT EXACTLY" size={64} color={orange} a={P(26, 4.6)} b={P(27)} />
      <Node x={285} y={400} s={0.9} year="1896" text="Marathon|to Athens|~40 km" color={teal} a={P(27, 0.2)} />
      <Node x={715} y={400} s={0.9} year="1908" text="London|26 mi 385 yd" color={orange} a={P(27, 0.7)} />
      <Node x={1145} y={400} s={0.9} year="1921" text="Made|official" color={teal} a={P(27, 1.2)} />
      <Node x={1575} y={400} s={0.9} year="1924" text="Every Games|since then" color={orange} a={P(27, 1.7)} />
    </>
  ),
  src: <Cite text="Olympedia + Wikipedia (Marathon)" a={P(25, 0.3)} b={P(28)} y={832} />,
  simp: [P(27, 0.2), P(28)],
}));

const practical = scene(28, "practical", (P) => ({
  shots: [
    { ...W("measuring-wheel"), t: P(28), r: FULL, f: [0.4, 0.5], mv: "in", tr: "page" },
    { ...W("gps-watch"), t: P(31), r: FULL, f: [0.4, 0.5], mv: "pl", tr: "wl" },
    { ...W("measuring-wheel"), t: P(33), r: FULL, f: [0.7, 0.5], mv: "pr", tr: "fade" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="THE PRACTICAL PART" size={130} fill={orange} a={P(28, 0.3)} b={P(29)} rot={-3} />
      <Pill x={960} y={800} text="IF YOU RUN, OR IF YOU WATCH" size={64} color={teal} a={P(28, 1.6)} b={P(29)} />
      <Kin x={960} y={190} text="OFFICIAL COURSES" size={110} fill={teal} a={P(29, 0.3)} b={P(29, 4.0)} rot={-3} />
      <Lines a={P(29, 4.0)} b={P(31)} real={0} />
      <Pill x={960} y={800} text="ALONG THE SHORTEST POSSIBLE ROUTE" size={50} color={orange} a={P(29, 3.0)} b={P(30)} />
      <Lines a={P(30, 0.3)} b={P(31)} real={1} />
      <Pill x={960} y={800} text="NOBODY RUNS THE PERFECT LINE" size={56} color={teal} a={P(30, 1.2)} b={P(31)} />
      <Kin x={1400} y={190} text="YOUR WATCH" size={120} fill={orange} a={P(31, 0.3)} b={P(32)} rot={-3} />
      <Kin x={1400} y={350} text="READS LONG" size={120} fill={teal} a={P(31, 1.2)} b={P(32)} rot={3} />
      <Pill x={1400} y={520} text="EXTRA DISTANCE YOU RAN" size={48} color={orange} a={P(31, 4.2)} b={P(32)} />
      <Kin x={1400} y={190} text="SAFETY MARGIN" size={120} fill={orange} a={P(32, 0.3)} b={P(32, 5.0)} rot={-3} />
      <Pill x={1400} y={350} text="ABOUT 0.1% ADDED ON PURPOSE" size={44} color={teal} a={P(32, 1.2)} b={P(32, 5.0)} />
      <Pill x={1400} y={450} text="SO A COURSE IS NEVER SHORT" size={44} color={orange} a={P(32, 2.6)} b={P(32, 5.0)} />
      <Pill x={1400} y={560} text="TRUST THE COURSE MARKERS" size={56} color={orange} a={P(32, 5.6)} b={P(33)} />
      <Kin x={960} y={190} text="WATCHING?" size={150} fill={teal} a={P(33, 0.3)} b={P(34)} rot={-3} />
      <Pill x={960} y={800} text="AFTER MILE 26: ABOUT 385 YARDS" size={56} color={orange} a={P(33, 1.6)} b={P(34)} />
      <Kin x={960} y={370} text="SAVE SOME CHEERING" size={120} fill={orange} a={P(33, 4.2)} b={P(34)} rot={3} />
    </>
  ),
  src: <Cite text="Running USA (course measurer) + AIMS" a={P(29, 0.3)} b={P(33)} y={832} />,
  simp: [P(29, 4.0), P(31)],
}));

const close = scene(34, "close", (P) => ({
  shots: [
    { id: "dorando1", t: P(34), r: FULL, f: [0.5, 0.45], z: 1.1, mv: "in", tr: "cut" },
    { id: "finish", t: P(35), r: FULL, f: [0.5, 0.5], mv: "in", tr: "zoom" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="A LEFTOVER" size={170} fill={orange} a={P(34, 0.5)} b={P(35)} rot={-3} />
      <Kin x={960} y={360} text="FROM ONE LONDON RACE" size={110} fill={teal} a={P(34, 2.2)} b={P(35)} rot={3} />
      <Kin x={960} y={170} text="WHAT EVERYDAY NUMBER" size={100} fill={teal} a={P(35, 0.4)} rot={-3} />
      <Kin x={960} y={330} text="IS A LEFTOVER?" size={120} fill={orange} a={P(35, 2.0)} rot={3} />
      <Pip x={1660} y={780} a={P(35, 3.6)} s={0.9} arm="point" />
    </>
  ),
}));

export const SCENES008V2: Record<string, React.FC<SceneProps>> = { hook, legend, distances, london, myth, dorando, official, practical, close };
