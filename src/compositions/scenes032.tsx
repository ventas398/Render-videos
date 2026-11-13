// EM-032 (vomitorium): kit2 (mkScene). 15 imagenes ChatGPT em032-* + copia de em025-stamp-desk; todas con "Illustrative image" (AI illustration en los planos con caras). Sin diagramas: no lleva "Simplified illustration".
import React from "react";
import { teal, orange } from "./kit";
import type { SceneProps } from "./scenes";
import { FULL, Kin, LEFT, Pill, Pip, Reading } from "./scenes023";
import { Stp } from "./scenes025";
import { Cite, mkScene } from "./v2";

const scene = mkScene("em032-", {}, ["arena-tunnel", "seneca-desk", "tiber-mouth-200bc-v2"]);
const W = (id: string) => ({ id, asp: 1672 / 941 });

const ch01 = scene(0, "ch01", (P) => ({
  shots: [
    { ...W("hook-banquet"), t: 0, r: FULL, f: [0.5, 0.5], mv: "in", tr: "cut" },
    { ...W("hook-door"), t: P(2), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="EVERYBODY KNOWS THIS ONE" size={96} fill={teal} a={P(0, 0.3)} b={P(1)} rot={-3} />
      <Kin x={960} y={190} text="A ROOM FOR VOMITING?" size={120} fill={orange} a={P(1, 0.2)} b={P(2)} rot={3} />
      <Pill x={960} y={780} text="THE VOMITORIUM" size={60} color={teal} a={P(1, 2.6)} b={P(2)} />
      <Kin x={960} y={190} text="HISTORIANS: A MYTH" size={130} fill={orange} a={P(2, 0.4)} b={P(3)} rot={-3} />
      <Kin x={960} y={190} text="SO WHERE DID IT COME FROM?" size={86} fill={teal} a={P(3, 0.2)} b={P(4)} rot={3} />
      <Kin x={960} y={190} text="LET'S FOLLOW THE CLUES" size={110} fill={orange} a={P(4, 0.2)} b={P(5)} rot={-3} />
      <Pip x={1660} y={780} a={P(4, 0.6)} s={0.9} arm="point" />
    </>
  ),
}));

const ch02 = scene(6, "ch02", (P) => ({
  shots: [
    { ...W("seneca-desk"), t: P(6), r: FULL, f: [0.5, 0.5], mv: "in", tr: "cut" },
    { ...W("luxury-table"), t: P(10), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "page" },
  ],
  ov: (
    <>
      <Pill x={960} y={150} text="CLUE 1" size={64} color={orange} a={P(6, 0.2)} b={P(7)} />
      <Kin x={960} y={290} text="A PHILOSOPHER: SENECA" size={100} fill={teal} a={P(6, 0.8)} b={P(7)} rot={-3} />
      <Kin x={960} y={190} text="A LETTER TO HIS MOTHER" size={100} fill={teal} a={P(7, 0.3)} b={P(7, 2.6)} rot={-3} />
      <Kin x={960} y={190} text="THE GREED OF THE RICH" size={110} fill={orange} a={P(7, 2.6)} b={P(8)} rot={3} />
      <Kin x={960} y={190} text="THEY VOMIT THAT THEY MAY EAT," size={80} fill={teal} a={P(8, 0.2)} b={P(8, 2.2)} rot={-3} />
      <Kin x={960} y={320} text="AND EAT THAT THEY MAY VOMIT" size={80} fill={orange} a={P(8, 1.2)} b={P(9)} rot={3} />
      <Cite text="Seneca, To Helvia, ch. 10 (Stewart transl.)" a={P(8)} b={P(9, 1.8)} y={832} />
      <Kin x={960} y={190} text="THAT SOUNDS LIKE PROOF" size={110} fill={orange} a={P(9, 0.2)} b={P(10)} rot={-3} />
      <Kin x={960} y={190} text="BUT READ IT AGAIN" size={130} fill={teal} a={P(10, 0.2)} b={P(11)} rot={3} />
      <Kin x={960} y={190} text="AN INSULT," size={150} fill={orange} a={P(11, 0.3)} b={P(12)} rot={-3} />
      <Kin x={960} y={350} text="NOT A REPORT" size={150} fill={teal} a={P(11, 1.2)} b={P(12)} rot={3} />
      <Pill x={960} y={190} text="A TROPE: A STOCK IMAGE" size={64} color={teal} a={P(12, 0.8)} b={P(13)} />
      <Cite text="Sarah Bond, classicist (Scientific American)" a={P(12)} b={P(13)} y={860} />
      <Stp x={1380} y={300} k="D" size={70} a={P(13, 0.2)} b={P(14)} />
      <Kin x={500} y={300} text="THE QUOTE" size={110} fill={teal} a={P(13, 0.2)} b={P(14)} rot={-3} />
      <Kin x={960} y={520} text="THE ROOM: NOT" size={130} fill={orange} a={P(13, 2.0)} b={P(14)} rot={3} />
    </>
  ),
}));

const ch03 = scene(14, "ch03", (P) => ({
  shots: [
    { ...W("courtroom-hall"), t: P(14), r: FULL, f: [0.5, 0.5], mv: "in", tr: "cut" },
    { ...W("roman-bath"), t: P(17), r: FULL, f: [0.5, 0.5], mv: "pr", tr: "page" },
    { ...W("feast-platters"), t: P(18), r: FULL, f: [0.5, 0.5], mv: "in", tr: "wl" },
  ],
  ov: (
    <>
      <Pill x={960} y={150} text="CLUE 2" size={64} color={orange} a={P(14, 0.2)} b={P(15)} />
      <Kin x={960} y={290} text="NAMED PEOPLE" size={120} fill={teal} a={P(14, 0.8)} b={P(15)} rot={-3} />
      <Kin x={960} y={190} text="CICERO DEFENDS A KING" size={100} fill={teal} a={P(15, 0.3)} b={P(16)} rot={-3} />
      <Kin x={960} y={190} text="A STORY CICERO MOCKS:" size={96} fill={teal} a={P(16, 0.2)} b={P(16, 3.2)} rot={-3} />
      <Kin x={960} y={335} text="CAESAR WANTS TO VOMIT" size={96} fill={orange} a={P(16, 1.6)} b={P(17)} rot={3} />
      <Cite text="Cicero, Pro Deiotaro 21 (Latin Library; Attalus)" a={P(16)} b={P(18)} />
      <Kin x={960} y={190} text="A MURDER PLOT," size={120} fill={orange} a={P(17, 0.2)} b={P(18)} rot={-3} />
      <Kin x={960} y={340} text="NOT A BANQUET ROOM" size={110} fill={teal} a={P(17, 1.6)} b={P(18)} rot={3} />
      <Kin x={960} y={190} text="VITELLIUS, THE EMPEROR" size={100} fill={teal} a={P(18, 0.2)} b={P(19)} rot={-3} />
      <Kin x={960} y={353} text="3 OR 4 FEASTS A DAY" size={120} fill={orange} a={P(18, 1.4)} b={P(19)} rot={3} />
      <Cite text="Suetonius, Vitellius 13" a={P(18)} b={P(21)} />
      <Kin x={960} y={190} text="A HABIT OF VOMITING" size={110} fill={orange} a={P(19, 0.3)} b={P(20)} rot={-3} />
      <Kin x={500} y={300} text="ACCUSATIONS" size={110} fill={teal} a={P(20, 0.2)} b={P(21)} rot={-3} />
      <Stp x={1400} y={300} k="D" size={70} a={P(20, 1.4)} b={P(21)} />
      <Kin x={960} y={190} text="NO ROOM BUILT FOR IT" size={120} fill={orange} a={P(21, 0.3)} rot={-3} />
    </>
  ),
}));

const ch04 = scene(22, "ch04", (P) => ({
  shots: [
    { ...W("library-codex"), t: P(22), r: FULL, f: [0.5, 0.5], mv: "in", tr: "cut" },
    { ...W("morning-doorway"), t: P(26), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "page" },
    { id: "tiber-mouth-200bc-v2", asp: 1376 / 768, t: P(28), r: FULL, f: [0.5, 0.5], mv: "in", tr: "fade" },
    { ...W("arena-tunnel"), t: P(30), r: FULL, f: [0.5, 0.5], mv: "in", tr: "wl" },
    { ...W("amphitheatre-aerial"), t: P(32), r: FULL, f: [0.5, 0.5], mv: "out", tr: "zoom" },
  ],
  ov: (
    <>
      <Pill x={960} y={150} text="CLUE 3" size={64} color={orange} a={P(22, 0.2)} b={P(23)} />
      <Kin x={960} y={290} text="THE WORD ITSELF" size={120} fill={teal} a={P(22, 0.6)} b={P(23)} rot={-3} />
      <Kin x={960} y={190} text="ONLY ONE ANCIENT WRITER" size={96} fill={teal} a={P(23, 0.3)} b={P(23, 3.4)} rot={-3} />
      <Kin x={960} y={320} text="MACROBIUS" size={150} fill={orange} a={P(23, 1.8)} b={P(24)} rot={3} />
      <Cite text="Macrobius, Saturnalia, book 6 (Latin text)" a={P(23)} b={P(32)} y={860} />
      <Kin x={960} y={190} text="CENTURIES AFTER SENECA" size={100} fill={orange} a={P(24, 0.2)} b={P(25)} rot={-3} />
      <Kin x={960} y={190} text="HE TRACES A LINE BY VIRGIL" size={90} fill={teal} a={P(25, 0.2)} b={P(26)} rot={3} />
      <Kin x={960} y={190} text="A HOUSE 'VOMITS' VISITORS" size={100} fill={orange} a={P(26, 0.3)} b={P(27)} rot={-3} />
      <Kin x={960} y={190} text="BEAUTIFUL, OLD-FASHIONED" size={96} fill={teal} a={P(27, 0.3)} b={P(28)} rot={3} />
      <Kin x={960} y={190} text="ENNIUS: THE TIBER VOMITS" size={96} fill={orange} a={P(28, 0.3)} b={P(29)} rot={-3} />
      <Pill x={960} y={780} text="INTO THE SALTY SEA" size={56} color={teal} a={P(28, 2.2)} b={P(29)} />
      <Reading x={400} y={110} a={P(29, 0.1)} b={P(30)} />
      <Kin x={960} y={250} text="ONE VERB, TWO MEANINGS" size={100} fill={teal} a={P(29, 0.3)} b={P(30)} rot={-3} />
      <Kin x={960} y={400} text="POUR OUT / BE SICK" size={110} fill={orange} a={P(29, 1.8)} b={P(30)} rot={3} />
      <Kin x={960} y={190} text="HENCE: VOMITORIA" size={120} fill={orange} a={P(30, 0.3)} b={P(31)} rot={-3} />
      <Pill x={960} y={780} text="IN THE THEATERS" size={56} color={teal} a={P(30, 2.2)} b={P(31)} />
      <Kin x={960} y={190} text="CROWDS POUR INTO THEIR SEATS" size={90} fill={teal} a={P(31, 0.3)} b={P(32)} rot={3} />
      <Reading x={400} y={90} a={P(32, 0.1)} b={P(33)} />
      <Kin x={960} y={190} text="PICTURE A STADIUM" size={120} fill={orange} a={P(32, 0.2)} b={P(32, 2.6)} rot={-3} />
      <Pill x={960} y={780} text="WIDE TUNNELS, A CROWD FLOWING LIKE WATER" size={44} color={teal} a={P(32, 2.0)} />
    </>
  ),
}));

const ch05 = scene(33, "ch05", (P) => ({
  shots: [
    { ...W("victorian-christmas"), t: P(33), r: FULL, f: [0.5, 0.5], mv: "in", tr: "cut" },
    { ...W("novel-1920s"), t: P(37), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "page" },
    { ...W("hook-banquet"), t: P(38), r: FULL, f: [0.6, 0.5], mv: "pr", tr: "fade" },
    { ...W("seneca-desk"), t: P(40), r: FULL, f: [0.5, 0.5], mv: "in", tr: "wl" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="SO WHEN DID THE ROOM APPEAR?" size={86} fill={teal} a={P(33, 0.2)} b={P(34)} rot={-3} />
      <Kin x={960} y={190} text="MUCH LATER" size={170} fill={orange} a={P(34, 0.1)} b={P(35)} rot={3} />
      <Kin x={960} y={190} text="1871" size={200} fill={orange} a={P(35, 0.5)} b={P(36)} rot={-3} />
      <Pill x={960} y={780} text="ONE EARLY EXAMPLE" size={56} color={teal} a={P(35, 1.8)} b={P(36)} />
      <Kin x={960} y={190} text="A FRENCH JOURNALIST:" size={90} fill={teal} a={P(36, 0.2)} b={P(36, 3.2)} rot={-3} />
      <Kin x={960} y={335} text="AN ENGLISH CHRISTMAS DINNER" size={80} fill={orange} a={P(36, 1.0)} b={P(37)} rot={3} />
      <Cite text="Felix Pyat, 1871 (via nunc.ch)" a={P(36)} b={P(37)} />
      <Kin x={960} y={190} text="1923" size={200} fill={orange} a={P(37, 0.3)} b={P(38)} rot={-3} />
      <Pill x={960} y={780} text="ALDOUS HUXLEY, IN A NOVEL" size={56} color={teal} a={P(37, 1.2)} b={P(38)} />
      <Cite text="Scientific American" a={P(37)} b={P(41)} y={860} />
      <Kin x={960} y={190} text="BOND: IT CAUGHT ON" size={110} fill={teal} a={P(38, 0.2)} b={P(39)} rot={-3} />
      <Kin x={960} y={350} text="IT SOUNDS LIKE 'VOMIT'" size={100} fill={orange} a={P(38, 2.0)} b={P(39)} rot={3} />
      <Kin x={960} y={190} text="IT FIT WHAT PEOPLE" size={110} fill={teal} a={P(39, 0.2)} b={P(40)} rot={-3} />
      <Kin x={960} y={350} text="BELIEVED ABOUT ROMANS" size={110} fill={orange} a={P(39, 1.2)} b={P(40)} rot={3} />
      <Pill x={960} y={150} text="SENECA, FROM CLUE 1" size={60} color={teal} a={P(40, 0.2)} b={P(40, 3.6)} />
      <Kin x={960} y={300} text="A BAD AXE TO GRIND" size={120} fill={orange} a={P(40, 3.0)} rot={-3} />
      <Pill x={960} y={780} text="ABOUT LUXURY, SAYS BOND" size={56} color={teal} a={P(40, 4.4)} />
    </>
  ),
}));

const ch06 = scene(41, "ch06", (P) => ({
  shots: [
    { id: "stamp-desk", asp: 1, t: P(41), r: LEFT, f: [0.5, 0.5], mv: "in", tr: "cut" },
    { ...W("arena-tunnel"), t: P(42), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page" },
    { id: "stamp-desk", asp: 1, t: P(43), r: LEFT, f: [0.5, 0.5], mv: "in", tr: "fade" },
    { ...W("ruins-dawn"), t: P(47), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "zoom" },
  ],
  ov: (
    <>
      <Kin x={1400} y={300} text="THE ANSWER" size={130} fill={teal} a={P(41, 0.2)} b={P(42)} rot={3} />
      <Kin x={960} y={190} text="A PASSAGE FOR CROWDS" size={120} fill={orange} a={P(42, 0.3)} b={P(43)} rot={-3} />
      <Stp x={1400} y={300} k="M" size={80} a={P(43, 0.4)} b={P(44)} />
      <Pill x={1400} y={520} text="THE ROOM FOR VOMITING:" size={38} color={teal} a={P(43, 0.4)} b={P(44)} />
      <Pill x={1400} y={600} text="A MODERN MISTAKE" size={46} color={orange} a={P(43, 1.4)} b={P(44)} />
      <Stp x={1400} y={300} k="D" size={80} a={P(44, 0.4)} b={P(45)} />
      <Pill x={1400} y={520} text="ACCUSATIONS AT FEASTS" size={46} color={teal} a={P(44, 0.4)} b={P(45)} />
      <Reading x={1400} y={170} a={P(45, 0.1)} b={P(46)} />
      <Kin x={1400} y={330} text="WRITERS ATTACKED" size={90} fill={teal} a={P(45, 0.3)} b={P(46)} rot={-3} />
      <Kin x={1400} y={450} text="GREED" size={150} fill={orange} a={P(45, 1.4)} b={P(46)} rot={3} />
      <Kin x={1400} y={300} text="AN INSULT," size={110} fill={orange} a={P(46, 0.3)} b={P(47)} rot={-3} />
      <Kin x={1400} y={430} text="NOT A FLOOR PLAN" size={90} fill={teal} a={P(46, 1.4)} b={P(47)} rot={3} />
      <Kin x={960} y={190} text="A LAST QUESTION" size={140} fill={teal} a={P(47, 0.2)} b={P(48)} rot={-3} />
      <Kin x={960} y={190} text="WHAT ELSE DO WE REPEAT" size={100} fill={orange} a={P(48, 0.2)} rot={-3} />
      <Kin x={960} y={345} text="ABOUT THE ROMANS?" size={100} fill={teal} a={P(48, 0.8)} rot={3} />
      <Pill x={960} y={780} text="WITHOUT CHECKING" size={60} color={orange} a={P(48, 1.8)} />
      <Pip x={1660} y={780} a={P(48, 2.4)} s={0.9} arm="chin" />
    </>
  ),
}));

export const SCENES032: Record<string, React.FC<SceneProps>> = { ch01, ch02, ch03, ch04, ch05, ch06 };
