// EM-055 (El hombre de Somerton, 1948-2022): 100% vectorial, sin rostros reales (victima no identificada + Carl Webb, persona real fallecida con posible familia viva).
import React from "react";
import { Calendar, G, GOLD, GREY, ink, orange, RED, teal, Txt } from "./kit";
import type { SceneProps } from "./scenes";
import { Kin, Pill } from "./scenes023";
import { Stp } from "./scenes025";
import { mkScene } from "./v2";

const scene = mkScene("em055-", {}, [], []);
type PF = (part: number, o?: number) => number;

/** Rotulo corto de la parte n; i=0 arriba, 1 debajo. */
const cap = (P: PF, n: number, text: string, i = 0, m = n + 1, dy = 0) => (
  <Kin key={`${n}${i}`} x={960} y={(i ? 330 : 190) + dy} text={text} size={Math.max(60, Math.min(140, Math.round(2250 / text.length)))} fill={(n + i) % 2 ? orange : teal} a={P(n, 0.2 + i * 1.1)} b={P(m)} rot={(n + i) % 2 ? 3 : -3} />
);

/** Muro del paseo maritimo y arena, para el hallazgo del cuerpo. */
const Beach: React.FC<{ o: number }> = ({ o }) =>
  o <= 0 ? null : (
    <G o={o}>
      <rect x={0} y={700} width={1920} height={380} fill="#E3D5B3" opacity={0.6} />
      <rect x={0} y={660} width={1920} height={50} fill={GREY} opacity={0.5} />
    </G>
  );

/** Figura generica recostada contra el muro, sin rostro, zapatos cruzados. */
const Body: React.FC<{ x: number; y: number; o: number; s?: number }> = ({ x, y, o, s = 1 }) =>
  o <= 0 ? null : (
    <G x={x} y={y} s={s} o={o}>
      <path d="M-90 40 Q-100 -70 -20 -90 Q60 -100 70 -40 L80 30 Q40 60 -10 55 Q-60 55 -90 40 Z" fill="#3B4A6B" stroke={ink} strokeWidth={6} />
      <circle cx={-40} cy={-95} r={34} fill="#D8C6A0" stroke={ink} strokeWidth={6} />
      <rect x={60} y={20} width={120} height={26} rx={12} fill="#2B2F38" stroke={ink} strokeWidth={5} />
      <rect x={160} y={10} width={30} height={34} rx={8} fill="#2B2F38" stroke={ink} strokeWidth={5} />
    </G>
  );

/** Trozo de papel enrollado, hallado en un bolsillo cosido. */
const Pocket: React.FC<{ x: number; y: number; o: number; s?: number }> = ({ x, y, o, s = 1 }) =>
  o <= 0 ? null : (
    <G x={x} y={y} s={s} o={o} rot={-6}>
      <rect x={-70} y={-36} width={140} height={72} rx={10} fill="#F2E9D0" stroke={ink} strokeWidth={5} />
      <Txt x={0} y={8} size={30} fill={ink}>ENDED</Txt>
    </G>
  );

/** Libro (Rubaiyat, 1941) con pagina doblada. */
const Book: React.FC<{ x: number; y: number; o: number; s?: number }> = ({ x, y, o, s = 1 }) =>
  o <= 0 ? null : (
    <G x={x} y={y} s={s} o={o}>
      <rect x={-130} y={-90} width={260} height={180} rx={8} fill={GOLD} stroke={ink} strokeWidth={6} />
      <rect x={-110} y={-70} width={220} height={140} rx={4} fill="#FBF6E8" stroke={ink} strokeWidth={4} />
      <line x1={0} y1={-70} x2={0} y2={70} stroke={ink} strokeWidth={4} />
      <path d="M90 50 L110 70 L70 70 Z" fill="#FBF6E8" stroke={ink} strokeWidth={4} />
      <Txt x={0} y={-104} size={28} fill={ink}>RUBAIYAT · 1941</Txt>
    </G>
  );

/** Tarjeta con 5 lineas de letras mayusculas, una tachada (codigo nunca descifrado; representacion esquematica, no transcripcion exacta). */
const CodeLines: React.FC<{ x: number; y: number; o: number; s?: number }> = ({ x, y, o, s = 1 }) =>
  o <= 0 ? null : (
    <G x={x} y={y} s={s} o={o}>
      <rect x={-220} y={-140} width={440} height={280} rx={10} fill="#FBF6E8" stroke={ink} strokeWidth={6} />
      {["MRGOABABD", "MTBIMPANETP", "MLIABOAIAQC", "ITTMTSAMSTGAB", "AIAXP"].map((line, i) => (
        <Txt key={i} x={0} y={-90 + i * 48} size={30} fill={i === 3 ? RED : ink} spacing={4}>
          {line}
        </Txt>
      ))}
      <line x1={-200} y1={-90 + 3 * 48 - 10} x2={200} y2={-90 + 3 * 48 - 10} stroke={RED} strokeWidth={5} />
    </G>
  );

/** Mascarilla de yeso generica (sin rasgos identificables) con hebras de pelo marcadas, fuente del ADN. */
const DeathMask: React.FC<{ x: number; y: number; o: number; s?: number }> = ({ x, y, o, s = 1 }) =>
  o <= 0 ? null : (
    <G x={x} y={y} s={s} o={o}>
      <rect x={-70} y={40} width={140} height={30} rx={8} fill={GREY} opacity={0.5} />
      <ellipse cx={0} cy={-10} rx={70} ry={90} fill="#E9E2CF" stroke={ink} strokeWidth={6} />
      <circle cx={-20} cy={110} r={6} fill={teal} />
      <circle cx={0} cy={118} r={6} fill={teal} />
      <circle cx={20} cy={112} r={6} fill={teal} />
      <Txt x={0} y={150} size={24} fill={ink}>DNA FROM HAIR</Txt>
    </G>
  );

/** Arbol genealogico esquematico, tres nodos convergiendo en un nombre. */
const FamilyTree: React.FC<{ x: number; y: number; o: number; s?: number }> = ({ x, y, o, s = 1 }) =>
  o <= 0 ? null : (
    <G x={x} y={y} s={s} o={o}>
      {[-120, 0, 120].map((cx, i) => (
        <circle key={i} cx={cx} cy={-80} r={16} fill={GREY} stroke={ink} strokeWidth={4} />
      ))}
      <line x1={-120} y1={-64} x2={0} y2={10} stroke={ink} strokeWidth={4} />
      <line x1={0} y1={-64} x2={0} y2={10} stroke={ink} strokeWidth={4} />
      <line x1={120} y1={-64} x2={0} y2={10} stroke={ink} strokeWidth={4} />
      <circle cx={0} cy={30} r={22} fill={orange} stroke={ink} strokeWidth={5} />
      <Txt x={0} y={74} size={28} fill={ink}>WEBB</Txt>
    </G>
  );

/** Frasco de toxina, sin nombre (los nombres no se hicieron publicos hasta decadas despues). */
const Vial: React.FC<{ x: number; y: number; o: number; s?: number }> = ({ x, y, o, s = 1 }) =>
  o <= 0 ? null : (
    <G x={x} y={y} s={s} o={o}>
      <rect x={-30} y={-80} width={60} height={140} rx={16} fill="#EAF2EA" stroke={ink} strokeWidth={6} />
      <rect x={-30} y={-10} width={60} height={70} rx={10} fill={RED} opacity={0.55} />
      <rect x={-14} y={-110} width={28} height={34} rx={6} fill={GREY} stroke={ink} strokeWidth={5} />
      <Txt x={0} y={90} size={24} fill={ink}>?</Txt>
    </G>
  );

/** Carpeta de caso con sello (generico, sin logo de agencia). */
const CaseFile: React.FC<{ x: number; y: number; o: number; stamp?: string; stampColor?: string }> = ({ x, y, o, stamp, stampColor = RED }) =>
  o <= 0 ? null : (
    <G x={x} y={y} o={o}>
      <rect x={-140} y={-100} width={280} height={200} rx={10} fill="#F2E9D0" stroke={ink} strokeWidth={6} />
      <rect x={-140} y={-130} width={150} height={40} rx={8} fill="#F2E9D0" stroke={ink} strokeWidth={6} />
      {[-40, 0, 40].map((ly) => (
        <line key={ly} x1={-100} y1={ly} x2={100} y2={ly} stroke={GREY} strokeWidth={5} />
      ))}
      {stamp && (
        <G rot={-10} y={10}>
          <rect x={-130} y={-28} width={260} height={56} rx={10} fill="none" stroke={stampColor} strokeWidth={7} />
          <Txt x={0} y={2} size={30} fill={stampColor} spacing={1}>
            {stamp}
          </Txt>
        </G>
      )}
    </G>
  );

const ch01 = scene(0, "ch01", (P) => ({
  shots: [],
  ov: (
    <>
      <Beach o={1} />
      <Body x={960} y={660} o={1} s={1.1} />
      {cap(P, 0, "A MAN WAS FOUND DEAD ON A BEACH IN AUSTRALIA")}
      {cap(P, 1, "NO WALLET. NO ID. EVERY TAG CUT OUT")}
      <Pocket x={1380} y={560} o={P(2, 0.3) ? 1 : 0} s={0.9} />
      {cap(P, 2, "A HIDDEN POCKET HELD ONE WORD: \"ENDED\"")}
      {cap(P, 3, "FOR 74 YEARS, NOBODY KNEW HIS NAME")}
      {cap(P, 4, "THEN IN 2022, RESEARCHERS SAID THEY HAD ONE")}
      <Stp x={560} y={520} k="D" size={44} a={P(5, 1.0)} b={P(6)} />
      <Stp x={960} y={520} k="P" size={44} a={P(5, 1.8)} b={P(6)} />
      <Stp x={1360} y={520} k="N" size={44} a={P(5, 2.6)} b={P(6)} />
      {cap(P, 5, "WE MARK EVERY CLAIM: DOCUMENTED, DISPUTED, OR NO EVIDENCE FOUND", 1)}
    </>
  ),
  simp: [0, 1e6],
}));

const ch02 = scene(6, "ch02", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 6, "WHAT WAS FOUND ON THAT BEACH")}
      {cap(P, 7, "AND A CODE NO ONE HAS EVER EXPLAINED")}
      {cap(P, 8, "THE NAME RESEARCHERS GAVE HIM IN 2022")}
      {cap(P, 9, "THE EVERYDAY MYSTERY")}
    </>
  ),
  simp: [0, 1e6],
}));

const ch03 = scene(10, "ch03", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 10, "FIRST, THE BEACH")}
      <Calendar x={500} y={640} month="DECEMBER" year="48" o={P(11, 0.2) ? 1 : 0} />
      {cap(P, 11, "DEC 1, 1948 · SOMERTON PARK, NEAR GLENELG")}
      <Beach o={P(12, 0.2) ? 1 : 0} />
      <Body x={1340} y={700} o={P(12, 0.2) ? 1 : 0} s={0.9} />
      {cap(P, 12, "PROPPED AGAINST THE SEA WALL, SHOES CROSSED")}
      {cap(P, 13, "LOOKED LIKE HE WAS JUST ASLEEP")}
      {cap(P, 14, "NO WALLET. NO ID. EVERY TAG CUT OUT, ON PURPOSE")}
      <Stp x={1380} y={300} k="D" size={56} a={P(15, 0.8)} />
    </>
  ),
  simp: [0, 1e6],
}));

const ch04 = scene(16, "ch04", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 16, "THE CAUSE OF DEATH WAS NEVER OFFICIALLY SETTLED")}
      <Vial x={600} y={640} o={P(17, 0.2) ? 1 : 0} />
      {cap(P, 17, "THE PATHOLOGIST SUSPECTED POISON")}
      <Pill x={960} y={300} text="DIGITALIS · OUABAIN — NAMED DECADES LATER" size={34} color={orange} a={P(18, 0.2)} b={P(21)} />
      {cap(P, 18, "TWO TOXINS FOUND — NOT NAMED PUBLICLY FOR DECADES", 1)}
      <CaseFile x={1360} y={640} stamp="NO VERDICT" stampColor={orange} o={P(19, 0.2) ? 1 : 0} />
      {cap(P, 19, "THE CORONER COULD NOT RULE A CAUSE. CASE CLOSED, NO VERDICT")}
      {cap(P, 20, "1994: A JUDGE GUESSED DIGITALIS — OPINION, NOT NEW FORENSICS")}
      <Stp x={1380} y={520} k="P" size={56} a={P(21, 0.8)} />
      {cap(P, 21, "DISPUTED: NO POISON WAS EVER FOUND IN THE AUTOPSY", 1)}
    </>
  ),
  simp: [0, 1e6],
}));

const ch05 = scene(22, "ch05", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 22, "MONTHS LATER, POLICE SEARCHED HIS CLOTHES AGAIN")}
      <Pocket x={620} y={660} o={P(23, 0.2) ? 1 : 0} s={1.1} />
      {cap(P, 23, "A HIDDEN, SEWN POCKET HELD A ROLLED SCRAP OF PAPER")}
      {cap(P, 24, "\"TAMAM SHUD\" — PERSIAN FOR \"ENDED\"")}
      <Book x={1340} y={660} o={P(25, 0.3) ? 1 : 0} />
      {cap(P, 25, "TORN FROM A 1941 NEW ZEALAND RUBAIYAT")}
      {cap(P, 26, "A MAN LATER HANDED POLICE A MATCHING COPY")}
      <Stp x={960} y={300} k="D" size={56} a={P(27, 0.8)} />
      {cap(P, 27, "DOCUMENTED: PAPER AND BOOK, CONFIRMED UNDER A MICROSCOPE", 1)}
    </>
  ),
  simp: [0, 1e6],
}));

const ch06 = scene(28, "ch06", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 28, "INSIDE THE BACK COVER, SOMETHING STRANGER")}
      <CodeLines x={960} y={620} o={P(29, 0.2) ? 1 : 0} s={0.9} />
      {cap(P, 29, "FAINT PENCIL MARKS: 5 LINES, ONE CROSSED OUT")}
      {cap(P, 30, "1978: MILITARY CODEBREAKERS SAID IT MIGHT BE UNSOLVABLE")}
      {cap(P, 31, "SINCE THEN: INITIALS? SHORTHAND? A 2014 STUDY FOUND NO MATCH")}
      {cap(P, 32, "NO PROPOSED ANSWER HAS EVER BEEN ACCEPTED AS DEFINITIVE")}
      <Stp x={1380} y={300} k="N" size={56} a={P(33, 0.8)} />
      {cap(P, 33, "NO EVIDENCE FOUND: NEVER CRACKED IN A CONFIRMED WAY", 1)}
    </>
  ),
  simp: [0, 1e6],
}));

const ch07 = scene(34, "ch07", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 34, "2022: A POSSIBLE BREAKTHROUGH")}
      <DeathMask x={560} y={640} o={P(36, 0.2) ? 1 : 0} />
      {cap(P, 35, "DNA POINTED TO A NAME: CARL WEBB, AN ELECTRICAL ENGINEER")}
      {cap(P, 36, "FROM HAIRS IN A 1949 PLASTER DEATH MASK — NOT THE BODY ITSELF", 1)}
      <FamilyTree x={1360} y={640} o={P(37, 0.2) ? 1 : 0} />
      {cap(P, 37, "A FAMILY TREE OF DISTANT COUSINS LED TO WEBB")}
      <Pill x={960} y={300} text={'"CAUTIOUSLY OPTIMISTIC" — POLICE, NOT CONFIRMED'} size={34} color={orange} a={P(38, 0.2)} b={P(41)} />
      {cap(P, 38, "POLICE: CAUTIOUSLY OPTIMISTIC. NOT CONFIRMED", 1)}
      {cap(P, 39, "FAMILY PHOTOS SURFACED; 1951 DIVORCE PAPERS CALLED HIM VIOLENT")}
      {cap(P, 40, "\"100% CONVINCED\" VS. \"NOT SURE WE'LL EVER BE CERTAIN\"")}
      <Stp x={1380} y={520} k="P" size={56} a={P(41, 0.8)} />
      {cap(P, 41, "DISPUTED: A RESEARCH TEAM'S PROPOSAL, NOT A POLICE CONFIRMATION", 1)}
      {cap(P, 42, "STILL NO OFFICIAL ANSWER FOR WHY — OR HOW — HE DIED")}
    </>
  ),
  simp: [0, 1e6],
}));

const ch08 = scene(43, "ch08", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 43, "2021: AUTHORITIES EXHUMED THE BODY FOR DIRECT DNA")}
      <CaseFile x={960} y={660} stamp="EXHUMED 2021" stampColor={teal} o={P(43, 0.3) ? 1 : 0} />
      {cap(P, 44, "A STRONGER TEST THAN HAIR ON PLASTER")}
      {cap(P, 45, "THAT COMPARISON HAS NOT BEEN MADE PUBLIC")}
      <Pill x={960} y={300} text={'"COMPLEX AND ONGOING" — SA POLICE'} size={36} color={GREY} a={P(46, 0.2)} b={P(48)} />
      {cap(P, 46, "POLICE CALL IT: COMPLEX AND ONGOING", 1)}
      <Stp x={620} y={520} k="D" size={48} a={P(47, 0.8)} b={P(48)} />
      <Stp x={1300} y={520} k="P" size={48} a={P(47, 1.6)} b={P(48)} />
      {cap(P, 47, "NEVER OFFICIALLY CLOSED. DISPUTED: EXACTLY WHERE IT STANDS")}
    </>
  ),
  simp: [0, 1e6],
}));

const ch09 = scene(48, "ch09", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 48, "OVER THE DECADES: SPY THEORIES, COLD WAR LINKS, SECRET CODES")}
      {cap(P, 49, "NONE OF THEM HAVE EVER BEEN BACKED BY REAL EVIDENCE")}
      {cap(P, 50, "AT LEAST 8 \"POSITIVE\" IDs IN 1949 — EVERY ONE WRONG")}
      <Stp x={1380} y={300} k="N" size={56} a={P(51, 0.8)} />
      {cap(P, 51, "NO EVIDENCE FOUND, FOR EVERY ONE OF THESE", 1)}
    </>
  ),
  simp: [0, 1e6],
}));

const ch10 = scene(52, "ch10", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 52, "SO, WHAT DO WE ACTUALLY KNOW?")}
      <Stp x={480} y={450} k="D" size={56} a={P(53, 0.2)} b={P(54)} />
      <Pill x={480} y={560} text="THE BODY · THE NOTE · THE BOOK" size={26} color={teal} a={P(53, 0.6)} b={P(54)} />
      <Stp x={960} y={450} k="P" size={56} a={P(53, 0.9)} b={P(54)} />
      <Pill x={960} y={560} text="CAUSE OF DEATH · THE 2022 ID" size={26} color={teal} a={P(53, 1.3)} b={P(54)} />
      <Stp x={1440} y={450} k="N" size={56} a={P(53, 1.6)} b={P(54)} />
      <Pill x={1440} y={560} text="THE CODE · EVERY SPY THEORY" size={24} color={GREY} a={P(53, 2.0)} b={P(54)} />
      {cap(P, 54, "A NAME IS NOT THE SAME THING AS AN ANSWER", 1)}
    </>
  ),
  simp: [0, 1e6],
}));

const ch11 = scene(55, "ch11", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 55, "SO, WHO WAS THE SOMERTON MAN?")}
      <G x={960} y={640} o={P(56, 0.2) ? 1 : 0}>
        <Txt x={0} y={0} size={140} fill={orange}>?</Txt>
        <Txt x={0} y={100} size={34} fill={ink}>CARL WEBB?</Txt>
      </G>
      {cap(P, 56, "MAYBE. NOT ACCORDING TO THE PEOPLE WHOSE JOB IS TO CONFIRM IT")}
      {cap(P, 57, "WHAT ELSE MIGHT WE BE WRONG ABOUT CALLING \"SOLVED\"?")}
    </>
  ),
  simp: [0, 1e6],
}));

export const SCENES055: Record<string, React.FC<SceneProps>> = { ch01, ch02, ch03, ch04, ch05, ch06, ch07, ch08, ch09, ch10, ch11 };
