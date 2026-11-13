// EM-042 (Boston Molasses Flood, 1919): 100% vectorial, sin fotos (21 muertos reales).
// mkScene con shots:[] en todos los capitulos; todo el contenido visual va en ov (kit.tsx).
import React from "react";
import { AMBER, Arrow, Calendar, G, GREEN, GREY, ink, orange, RED, SAND, teal, Txt } from "./kit";
import type { SceneProps } from "./scenes";
import { Kin, Pill, Reading } from "./scenes023";
import { Stp } from "./scenes025";
import { mkScene } from "./v2";

const scene = mkScene("em042-", {}, [], []);
type PF = (part: number, o?: number) => number;

/** Rotulo corto de la parte n; i=0 arriba, 1 debajo. */
const cap = (P: PF, n: number, text: string, i = 0, m = n + 1, dy = 0) => (
  <Kin key={`${n}${i}`} x={960} y={(i ? 330 : 190) + dy} text={text} size={Math.max(60, Math.min(140, Math.round(2250 / text.length)))} fill={(n + i) % 2 ? orange : teal} a={P(n, 0.2 + i * 1.1)} b={P(m)} rot={(n + i) % 2 ? 3 : -3} />
);
const pill = (P: PF, n: number, text: string, y = 150, m = n + 1, size = 52) => <Pill key={`p${n}${text}`} x={960} y={y} text={text} size={size} color={n % 2 ? orange : teal} a={P(n, 0.2)} b={P(m)} />;

/** Tanque de melaza en corte: nivel de llenado, altura y diametro. */
const Tank: React.FC<{ x: number; y: number; o: number; wave?: number }> = ({ x, y, o, wave = 0 }) =>
  o <= 0 ? null : (
    <G x={x} y={y} o={o}>
      <rect x={-130} y={-220} width={260} height={220} rx={10} fill="none" stroke={ink} strokeWidth={8} />
      <rect x={-124} y={-60} width={248} height={54} fill="#8B5A2B" opacity={0.85} />
      {wave > 0 && <path d={`M-130 -60 Q-60 ${-60 - 40 * wave} 0 -60 Q60 ${-60 + 40 * wave} 130 -60`} fill="none" stroke="#8B5A2B" strokeWidth={10} opacity={wave} />}
      <line x1={-170} y1={-220} x2={-170} y2={-6} stroke={teal} strokeWidth={5} />
      <Txt x={-210} y={-114} size={34} fill={teal}>15m</Txt>
      <line x1={-130} y1={20} x2={130} y2={20} stroke={orange} strokeWidth={5} />
      <Txt x={0} y={52} size={34} fill={orange}>27m</Txt>
    </G>
  );

/** Termometro con nivel (0..1) y color segun frio/calido. */
const Thermo: React.FC<{ x: number; y: number; level: number; o: number; label: string }> = ({ x, y, level, o, label }) =>
  o <= 0 ? null : (
    <G x={x} y={y} o={o}>
      <rect x={-22} y={-160} width={44} height={200} rx={22} fill="#fff" stroke={ink} strokeWidth={6} />
      <circle r={38} cy={56} fill="#fff" stroke={ink} strokeWidth={6} />
      <rect x={-12} y={56 - 150 * level} width={24} height={150 * level + 20} rx={12} fill={level > 0.5 ? RED : "#3E7BD6"} />
      <circle r={28} cy={56} fill={level > 0.5 ? RED : "#3E7BD6"} />
      <Txt x={0} y={124} size={30} fill={ink}>{label}</Txt>
    </G>
  );

/** Pared de acero en corte con remaches y grieta opcional. */
const Wall: React.FC<{ x: number; y: number; o: number; crack?: number }> = ({ x, y, o, crack = 0 }) =>
  o <= 0 ? null : (
    <G x={x} y={y} o={o}>
      <rect x={-160} y={-140} width={320} height={280} fill={GREY} opacity={0.3} stroke={ink} strokeWidth={6} />
      {[-120, -40, 40, 120].map((rx) => (
        <circle key={rx} cx={rx} cy={0} r={11} fill={ink} />
      ))}
      {crack > 0 && <path d="M-10 -140 L20 -60 L-14 0 L22 70 L0 140" fill="none" stroke={RED} strokeWidth={6} strokeLinecap="round" opacity={crack} />}
    </G>
  );

/** Mazo de juez + documento, generico. */
const Court: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) =>
  o <= 0 ? null : (
    <G x={x} y={y} o={o}>
      <rect x={-110} y={-130} width={220} height={260} rx={10} fill="#fff" stroke={ink} strokeWidth={6} />
      {[-80, -30, 20, 70].map((ly) => (
        <line key={ly} x1={-80} y1={ly} x2={80} y2={ly} stroke={GREY} strokeWidth={6} />
      ))}
      <rect x={-130} y={140} width={260} height={16} rx={8} fill={ink} />
      <rect x={-20} y={60} width={40} height={90} fill={SAND} stroke={ink} strokeWidth={5} />
    </G>
  );

/** Parque tranquilo: suelo verde, par de arboles, placa del nombre. */
const Park: React.FC<{ o: number }> = ({ o }) =>
  o <= 0 ? null : (
    <G o={o}>
      <rect x={0} y={760} width={1920} height={320} fill={GREEN} opacity={0.35} />
      {[300, 1620].map((cx) => (
        <G key={cx} x={cx} y={760}>
          <rect x={-10} y={-70} width={20} height={70} fill="#6B4A2A" />
          <circle cy={-110} r={70} fill={GREEN} opacity={0.7} />
        </G>
      ))}
      <rect x={760} y={820} width={400} height={90} rx={10} fill="#fff" stroke={ink} strokeWidth={5} />
      <Txt x={960} y={865} size={34}>LANGONE PARK</Txt>
    </G>
  );

const ch01 = scene(0, "ch01", (P) => ({
  shots: [],
  ov: (
    <>
      <Tank x={960} y={620} o={P(1, 0.2) ? 1 : 0} wave={0} />
      {cap(P, 0, "A SWEET SMELL OVER BOSTON")}
      {cap(P, 1, "A GIANT STEEL TANK LET GO")}
      <Tank x={960} y={620} o={1} wave={1} />
      {cap(P, 2, "NOT WATER. MOLASSES.")}
      {cap(P, 3, "A WAVE TORE THROUGH THE STREETS")}
      <Pill x={960} y={700} text="21 PEOPLE DIED" size={64} color={RED} a={P(4, 0.2)} b={P(6)} />
      {cap(P, 5, "HOW DID SOMETHING THIS SLOW MOVE THAT FAST?")}
      {cap(P, 6, "WE MARK EVERY CLAIM")}
      <Stp x={560} y={520} k="D" size={44} a={P(6, 1.0)} b={P(7)} />
      <Stp x={960} y={520} k="P" size={44} a={P(6, 1.8)} b={P(7)} />
      <Stp x={1360} y={520} k="N" size={44} a={P(6, 2.6)} b={P(7)} />
    </>
  ),
  simp: [0, 1e6],
}));

const ch02 = scene(7, "ch02", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 7, "WHAT THE TANK HELD")}
      {cap(P, 8, "A HARVARD TEAM, A CENTURY LATER")}
      {cap(P, 9, "THEY COULD NOT CLOSE THE CASE")}
      {cap(P, 10, "THE EVERYDAY MYSTERY")}
    </>
  ),
  simp: [0, 1e6],
}));

const ch03 = scene(11, "ch03", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 11, "FIRST, THE FACTS")}
      {pill(P, 12, "JANUARY 15, 1919 · 12:30 PM")}
      {cap(P, 12, "BOSTON'S NORTH END", 1, 13)}
      {cap(P, 13, "PURITY DISTILLING CO.")}
      <Tank x={500} y={650} o={P(14, 0.2) ? 1 : 0} />
      {cap(P, 14, "15 METERS TALL (50 FT)")}
      {cap(P, 15, "27 METERS ACROSS (90 FT)", 1, 16)}
      <Pill x={1440} y={650} text="2,000,000+ GALLONS" size={46} color={teal} a={P(16, 0.2)} b={P(18)} />
      {cap(P, 17, "A FIVE-STORY BUILDING OF MOLASSES")}
      {cap(P, 18, "56 KM/H (35 MPH)")}
      <Pill x={960} y={700} text="21 DEAD · ~150 HURT" size={54} color={RED} a={P(19, 0.2)} b={P(20)} />
      {cap(P, 20, "SIZE, DATE, TOLL: AGREED")}
      <Stp x={1380} y={520} k="D" size={70} a={P(20, 0.8)} />
    </>
  ),
  simp: [0, 1e6],
}));

const ch04 = scene(21, "ch04", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 21, "BUT HOW HIGH WAS THE WAVE?")}
      {cap(P, 22, "HERE, THE REPORTS DISAGREE")}
      {[["8 M (25 FT)", 560, 0.35], ["4.5 M", 960, 0.5], ["12 M (40 FT)", 1360, 0.65]].map(([t, cx, h], i) => (
        <G key={cx as number} x={cx as number} y={700}>
          <rect x={-70} y={-(h as number) * 300} width={140} height={(h as number) * 300} fill={i === 1 ? teal : orange} opacity={0.6} />
          <Txt x={0} y={-(h as number) * 300 - 30} size={34}>{t as string}</Txt>
        </G>
      ))}
      {cap(P, 23, "ONE ACCOUNT ESTIMATE")}
      {cap(P, 24, "ANOTHER, LOWER", 1, 25)}
      {cap(P, 25, "A MEMORIAL PLAQUE: A THIRD NUMBER")}
      <Stp x={960} y={300} k="P" size={70} a={P(25, 1.0)} />
    </>
  ),
  simp: [0, 1e6],
}));

const ch05 = scene(26, "ch05", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 26, "WHY DID IT MOVE SO FAST?")}
      {cap(P, 27, "HARVARD, 2016")}
      <Thermo x={500} y={620} level={0.15} o={P(28, 0.2) ? 1 : 0} label="COLD NIGHT" />
      <Arrow x1={620} y1={620} x2={780} y2={620} o={P(29, 0.2)} />
      <Thermo x={900} y={620} level={0.75} o={P(28, 0.2) ? 1 : 0} label="MILD AFTERNOON" />
      {cap(P, 28, "A SHARP SWING IN TEMPERATURE")}
      {cap(P, 29, "MOLASSES: ~4X MORE VISCOUS")}
      {cap(P, 30, "A HEAVY WAVE, NO EXPLOSION NEEDED")}
      {cap(P, 31, "THE COLD ALSO STIFFENED THE SPILL")}
      <Reading x={960} y={700} a={P(32, 0.2)} b={P(33)} />
      {cap(P, 32, "A LIQUID TURNED HEAVY, NOT LIGHT")}
      {cap(P, 33, "OUR READING, NOT THE STUDY'S WORDS")}
      {cap(P, 34, "WHY THE WALL GAVE WAY: STILL UNCLEAR")}
      <Stp x={1380} y={300} k="D" size={60} a={P(34, 0.8)} />
    </>
  ),
  simp: [0, 1e6],
}));

const ch06 = scene(35, "ch06", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 35, "A 2014 ENGINEERING REVIEW")}
      <Wall x={960} y={620} o={P(36, 0.2) ? 1 : 0} crack={P(38, 0.2) ? 1 : 0} />
      {cap(P, 36, "WALLS TOO THIN FOR THE LOAD")}
      {cap(P, 37, "RIVETS CONCENTRATED STRESS", 1, 38)}
      {cap(P, 38, "STEEL LOW IN MANGANESE: MORE BRITTLE")}
      {cap(P, 39, "NOT A VERIFIED QUOTE, AS REPORTED")}
      {cap(P, 40, "THIN STEEL: DOCUMENTED")}
      <Stp x={620} y={300} k="D" size={56} a={P(40, 0.6)} />
      <Stp x={1300} y={300} k="N" size={56} a={P(40, 1.4)} />
    </>
  ),
  simp: [0, 1e6],
}));

const ch07 = scene(41, "ch07", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 41, "SO WHAT ACTUALLY BROKE THE WALL?")}
      {cap(P, 42, "WILD TEMPERATURE SWINGS")}
      {cap(P, 43, "WARM MOLASSES POURED ON COLD")}
      {["PRESSURE MISMATCH", "FERMENTATION GAS", "A CRACK SINCE 1915"].map((t, i) => (
        <Pill key={t} x={400 + i * 560} y={650} text={t} size={38} color={i % 2 ? orange : teal} a={P(44 + i, 0.2)} b={P(47)} />
      ))}
      {cap(P, 47, "NO SINGLE THEORY STANDS ALONE")}
      {cap(P, 48, "PIECES THAT MAY HAVE ADDED UP")}
      <Stp x={960} y={300} k="P" size={70} a={P(48, 0.8)} />
    </>
  ),
  simp: [0, 1e6],
}));

const ch08 = scene(49, "ch08", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 49, "RUSHING BEFORE PROHIBITION?")}
      <Calendar x={960} y={620} month="JANUARY" year="16" o={P(50, 0.2) ? 1 : 0} />
      {cap(P, 50, "PROHIBITION BEGAN THE NEXT DAY")}
      {cap(P, 51, "A BELIEF, NOT A PROVEN FACT")}
      <Pill x={960} y={300} text="THEORY STAYS OPEN" size={54} color={orange} a={P(52, 0.2)} />
    </>
  ),
  simp: [0, 1e6],
}));

const ch09 = scene(53, "ch09", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 53, "UNITED STATES INDUSTRIAL ALCOHOL")}
      <Court x={960} y={620} o={P(54, 0.2) ? 1 : 0} />
      {cap(P, 54, "119 RESIDENTS SUED THE COMPANY")}
      {cap(P, 55, "DEFENSE: BLAMED ANARCHISTS")}
      {cap(P, 56, "NO INVESTIGATOR EVER BACKED IT")}
      {cap(P, 57, "AUDITOR HUGH OGDEN: COMPANY LIABLE")}
      <Pill x={960} y={300} text="$628,000 (~$11.5M TODAY)" size={48} color={teal} a={P(58, 0.2)} b={P(60)} />
      {cap(P, 59, "FAMILIES: ~$7,000 EACH", 1, 60)}
      {cap(P, 60, "AN EARLY CLASS ACTION LAWSUIT")}
      <Stp x={1380} y={300} k="D" size={60} a={P(60, 0.8)} />
      {cap(P, 61, "THE TREASURER SKIPPED SAFETY CHECKS")}
    </>
  ),
  simp: [0, 1e6],
}));

const ch10 = scene(62, "ch10", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 62, "MASSACHUSETTS CHANGED ITS RULES")}
      <Pill x={960} y={620} text="LICENSED ARCHITECT OR ENGINEER REQUIRED" size={38} color={teal} a={P(63, 0.2)} b={P(64)} />
      {cap(P, 63, "ENGINEERING PLANS NEEDED SIGN-OFF")}
      <Park o={P(64, 0.2) ? 1 : 0} />
      {cap(P, 64, "THE TANK WAS NEVER REBUILT")}
      {cap(P, 65, "CLEANUP TOOK WEEKS")}
      {cap(P, 66, "2019: RADAR FOUND THE OLD BASE")}
    </>
  ),
  simp: [0, 1e6],
}));

const ch11 = scene(67, "ch11", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 67, "WHAT DO WE ACTUALLY KNOW?")}
      <Stp x={480} y={450} k="D" size={60} a={P(68, 0.2)} b={P(71)} />
      <Pill x={480} y={560} text="TANK, DATE, SPEED, TOLL" size={30} color={teal} a={P(68, 0.6)} b={P(71)} />
      <Stp x={960} y={450} k="P" size={60} a={P(69, 0.2)} b={P(71)} />
      <Pill x={960} y={560} text="WAVE HEIGHT · SINGLE CAUSE" size={30} a={P(69, 0.6)} b={P(71)} />
      <Stp x={1440} y={450} k="N" size={60} a={P(70, 0.2)} b={P(71)} />
      <Pill x={1440} y={560} text="BOMB · DELIBERATE RUSH" size={30} color={AMBER} a={P(70, 0.6)} b={P(71)} />
      {cap(P, 71, "AN ORDINARY FAILURE, NOT A STRANGE ONE")}
    </>
  ),
  simp: [0, 1e6],
}));

const ch12 = scene(72, "ch12", (P) => ({
  shots: [],
  ov: (
    <>
      <Park o={1} />
      {cap(P, 72, "WHY DID THE WAVE KILL 21 PEOPLE?")}
      {cap(P, 73, "THE COLD MADE IT HEAVY")}
      {cap(P, 74, "SCIENTISTS AND ENGINEERS STILL DISAGREE")}
      {cap(P, 75, "WHAT QUIET STRAIN SITS UNNOTICED, RIGHT NOW?")}
    </>
  ),
  simp: [0, 1e6],
}));

export const SCENES042: Record<string, React.FC<SceneProps>> = { ch01, ch02, ch03, ch04, ch05, ch06, ch07, ch08, ch09, ch10, ch11, ch12 };
