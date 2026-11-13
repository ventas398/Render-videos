// EM-056 (inundacion de melaza de Boston, 1919): 100% vectorial, 21 muertos reales -- sin fotos del momento del desastre ni de victimas.
import React from "react";
import { Calendar, G, GREY, ink, orange, RED, teal, Txt } from "./kit";
import type { SceneProps } from "./scenes";
import { Kin, Pill, Reading } from "./scenes023";
import { Stp } from "./scenes025";
import { mkScene } from "./v2";

const scene = mkScene("em056-", {}, [], []);
type PF = (part: number, o?: number) => number;

const BROWN = "#6B3F1D";
const BROWN_D = "#4A2A12";
const STEEL = "#7D8899";

/** Rotulo corto de la parte n; i=0 arriba, 1 debajo. */
const cap = (P: PF, n: number, text: string, i = 0, m = n + 1, dy = 0) => (
  <Kin key={`${n}${i}`} x={960} y={(i ? 330 : 190) + dy} text={text} size={Math.max(60, Math.min(140, Math.round(2250 / text.length)))} fill={(n + i) % 2 ? orange : teal} a={P(n, 0.2 + i * 1.1)} b={P(m)} rot={(n + i) % 2 ? 3 : -3} />
);

/** Tanque de acero (5 plantas), con grieta opcional. */
const Tank: React.FC<{ x: number; y: number; o: number; s?: number; crack?: number }> = ({ x, y, o, s = 1, crack = 0 }) =>
  o <= 0 ? null : (
    <G x={x} y={y} s={s} o={o}>
      <rect x={-130} y={-220} width={260} height={280} rx={10} fill={BROWN} stroke={ink} strokeWidth={6} />
      {[-170, -110, -50, 10].map((ly) => (
        <line key={ly} x1={-130} y1={ly} x2={130} y2={ly} stroke={BROWN_D} strokeWidth={4} opacity={0.6} />
      ))}
      <rect x={-150} y={60} width={300} height={20} rx={6} fill={GREY} />
      {crack > 0 && (
        <path d="M-20 -200 L10 -120 L-10 -40 L20 40" stroke={RED} strokeWidth={8} fill="none" opacity={crack} />
      )}
    </G>
  );

/** Ola de melaza avanzando (forma de onda). */
const Wave: React.FC<{ y: number; o: number; w?: number }> = ({ y, o, w = 1 }) =>
  o <= 0 ? null : (
    <G o={o}>
      <path
        d={`M-80 ${y} Q 320 ${y - 90 * w} 760 ${y - 20 * w} Q 1200 ${y + 60 * w} 1680 ${y - 30 * w} Q 1900 ${y - 60 * w} 2000 ${y}  L2000 900 L-80 900 Z`}
        fill={BROWN}
        opacity={0.88}
      />
      <path d={`M-80 ${y + 10} Q 320 ${y - 80 * w} 760 ${y - 10 * w} Q 1200 ${y + 70 * w} 1680 ${y - 20 * w}`} stroke={BROWN_D} strokeWidth={6} fill="none" opacity={0.6} />
    </G>
  );

/** Comparacion de grosor de pared: lo exigible vs lo construido. */
const Wall: React.FC<{ x: number; y: number; o: number; s?: number }> = ({ x, y, o, s = 1 }) =>
  o <= 0 ? null : (
    <G x={x} y={y} s={s} o={o}>
      <rect x={-170} y={-100} width={70} height={220} fill={STEEL} stroke={ink} strokeWidth={6} />
      <Txt x={-135} y={140} size={26} fill={ink}>SHOULD BE</Txt>
      <rect x={30} y={-100} width={34} height={220} fill={STEEL} stroke={ink} strokeWidth={6} />
      <Txt x={47} y={140} size={26} fill={ink}>BUILT</Txt>
    </G>
  );

/** Bomba tachada (mito del sabotaje anarquista, desmentido). */
const BombX: React.FC<{ x: number; y: number; o: number; s?: number }> = ({ x, y, o, s = 1 }) =>
  o <= 0 ? null : (
    <G x={x} y={y} s={s} o={o}>
      <circle cx={0} cy={10} r={70} fill="#2B2F38" stroke={ink} strokeWidth={6} />
      <rect x={-14} y={-80} width={28} height={40} rx={8} fill="#2B2F38" stroke={ink} strokeWidth={5} />
      <path d="M0 -80 Q 30 -120 60 -100" stroke={orange} strokeWidth={8} fill="none" />
      <line x1={-90} y1={-90} x2={90} y2={110} stroke={RED} strokeWidth={14} />
      <line x1={90} y1={-90} x2={-90} y2={110} stroke={RED} strokeWidth={14} />
    </G>
  );

/** Balanza de la justicia, esquematica. */
const Gavel: React.FC<{ x: number; y: number; o: number; s?: number }> = ({ x, y, o, s = 1 }) =>
  o <= 0 ? null : (
    <G x={x} y={y} s={s} o={o}>
      <line x1={0} y1={-90} x2={0} y2={80} stroke={ink} strokeWidth={8} />
      <line x1={-110} y1={-60} x2={110} y2={-60} stroke={ink} strokeWidth={8} />
      <path d="M-110 -60 L-150 10 L-70 10 Z" fill="none" stroke={ink} strokeWidth={6} />
      <path d="M110 -60 L70 10 L150 10 Z" fill="none" stroke={ink} strokeWidth={6} />
      <rect x={-50} y={80} width={100} height={22} rx={6} fill={GREY} stroke={ink} strokeWidth={5} />
    </G>
  );

/** Carpeta de caso con sello (generica, sin logo de ninguna agencia). */
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
          <rect x={-140} y={-28} width={280} height={56} rx={10} fill="none" stroke={stampColor} strokeWidth={7} />
          <Txt x={0} y={2} size={26} fill={stampColor} spacing={1}>
            {stamp}
          </Txt>
        </G>
      )}
    </G>
  );

/** Termometro con dos barras de viscosidad (caliente vs frio): cuanto mas frio, mas alta la barra. */
const Thermo: React.FC<{ x: number; y: number; o: number; cold?: number }> = ({ x, y, o, cold = 0 }) =>
  o <= 0 ? null : (
    <G x={x} y={y} o={o}>
      <rect x={-130} y={30} width={60} height={80} fill="none" stroke={ink} strokeWidth={6} />
      <rect x={-124} y={110 - 60} width={48} height={60} fill={orange} opacity={0.8} />
      <Txt x={-100} y={150} size={24} fill={ink}>WARM</Txt>
      <rect x={10} y={30} width={60} height={80} fill="none" stroke={ink} strokeWidth={6} />
      <rect x={16} y={110 - 60 * (1 + cold * 3)} width={48} height={60 * (1 + cold * 3)} fill={teal} opacity={0.85} />
      <Txt x={40} y={150} size={24} fill={ink}>COLD</Txt>
    </G>
  );

/** Birrete de graduado, esquematico (clase de Harvard, sin retratos). */
const Cap: React.FC<{ x: number; y: number; o: number; s?: number }> = ({ x, y, o, s = 1 }) =>
  o <= 0 ? null : (
    <G x={x} y={y} s={s} o={o}>
      <path d="M-110 0 L0 -50 L110 0 L0 50 Z" fill="#2B2F38" stroke={ink} strokeWidth={6} />
      <rect x={-30} y={0} width={60} height={46} fill="#2B2F38" stroke={ink} strokeWidth={5} />
      <circle cx={0} cy={0} r={10} fill={GREY} />
      <line x1={0} y1={0} x2={60} y2={60} stroke={GREY} strokeWidth={4} />
    </G>
  );

const ch00 = scene(0, "ch00", (P) => ({
  shots: [],
  ov: (
    <>
      <Wave y={700} o={1} />
      {cap(P, 0, "A WAVE OF MOLASSES AT 35 MPH KILLED 21 PEOPLE")}
      {cap(P, 1, "FOR ALMOST 100 YEARS, NOBODY COULD SAY WHY SOMETHING THAT SLOW WAS THAT DEADLY")}
      <Cap x={960} y={560} o={P(2, 0.2) ? 1 : 0} />
      {cap(P, 2, "THEN A HARVARD PHYSICS CLASS RAN THE NUMBERS")}
      <Tank x={960} y={620} o={P(3, 0.2) ? 1 : 0} s={0.9} crack={1} />
      {cap(P, 3, "A TANK THAT SHOULD NEVER HAVE BEEN BUILT. A COLD NIGHT THAT MADE IT WORSE", 1)}
    </>
  ),
  simp: [0, 1e6],
}));

const ch01 = scene(4, "ch01", (P) => ({
  shots: [],
  ov: (
    <>
      <Calendar x={520} y={640} month="JANUARY" year="19" o={P(4, 0.2) ? 1 : 0} />
      {cap(P, 4, "JAN 15, 1919 · BOSTON'S NORTH END")}
      <Tank x={1340} y={660} o={P(5, 0.2) ? 1 : 0} s={1} />
      {cap(P, 5, "A STEEL TANK, 5 STORIES TALL — OVER 2 MILLION GALLONS")}
      <Wave y={700} o={P(6, 0.2) ? 1 : 0} />
      {cap(P, 6, "JUST AFTER NOON, IT TORE OPEN")}
      {cap(P, 7, "21 DEAD. ABOUT 150 HURT")}
      {cap(P, 8, "FAST, LOUD, STRONG ENOUGH TO CRUSH WATERFRONT BUILDINGS")}
      <Stp x={1400} y={300} k="D" size={52} a={P(6, 0.6)} />
    </>
  ),
  simp: [0, 1e6],
}));

const ch02 = scene(9, "ch02", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 9, "HERE'S THE PART THAT GETS SKIPPED")}
      {cap(P, 10, "BUILT IN 1915 BY A COMPANY TREASURER — NO ENGINEERING BACKGROUND", 1)}
      {cap(P, 11, "HE SKIPPED BASIC SAFETY CHECKS, LIKE TESTING FOR LEAKS")}
      {cap(P, 12, "THE TANK LEAKED ALMOST FROM DAY ONE", 1)}
      {cap(P, 13, "PAINTED BROWN, SO THE LEAKS WOULDN'T SHOW")}
      {cap(P, 14, "KIDS FROM THE NEIGHBORHOOD CAME TO SCRAPE UP THE RUNOFF", 1)}
      <Wall x={620} y={600} o={P(15, 0.2) ? 1 : 0} />
      {cap(P, 15, "DECADES LATER: THE STEEL WALLS WERE FAR TOO THIN")}
      {cap(P, 16, "ENGINEER RONALD MAYVILLE: ALMOST HALF AS THICK AS IT SHOULD HAVE BEEN", 1)}
      {cap(P, 17, "LOW IN MANGANESE — BRITTLE INSTEAD OF FLEXIBLE")}
      <Stp x={1360} y={300} k="D" size={52} a={P(18, 0.4)} />
      {cap(P, 18, "MAYVILLE'S OWN WORDS: \"UNDER-DESIGNED\"", 1)}
    </>
  ),
  simp: [0, 1e6],
}));

const ch03 = scene(19, "ch03", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 19, "AFTER THE DISASTER, THE COMPANY HAD A DIFFERENT STORY")}
      <BombX x={960} y={620} o={P(20, 0.2) ? 1 : 0} />
      {cap(P, 20, "THEY BLAMED ANARCHISTS — SAID A BOMB DESTROYED THE TANK")}
      {cap(P, 21, "NOT A WILD CLAIM FOR THE TIME — BOMBINGS WERE IN THE NEWS THAT YEAR", 1)}
      {cap(P, 22, "BUT THE COURTS DIDN'T BUY IT")}
      <Stp x={960} y={300} k="M" size={56} a={P(22, 0.6)} />
    </>
  ),
  simp: [0, 1e6],
}));

const ch04 = scene(23, "ch04", (P) => ({
  shots: [],
  ov: (
    <>
      <Gavel x={600} y={620} o={P(23, 0.2) ? 1 : 0} />
      {cap(P, 23, "A COURT-APPOINTED INVESTIGATOR SPENT ALMOST 3 YEARS ON IT")}
      {cap(P, 24, "HIS CONCLUSION: NO BOMB. NO SABOTAGE", 1)}
      {cap(P, 25, "JUST A TANK BUILT BADLY AND NEVER PROPERLY TESTED")}
      <CaseFile x={1340} y={640} stamp="$600,000+ PAID" stampColor={teal} o={P(26, 0.2) ? 1 : 0} />
      {cap(P, 26, "THE COMPANY PAID OUT OVER $600,000 TO VICTIMS AND FAMILIES", 1)}
      {cap(P, 27, "MASSACHUSETTS REWROTE ITS BUILDING CODES")}
      <Stp x={620} y={300} k="D" size={52} a={P(28, 0.4)} />
      {cap(P, 28, "FROM THEN ON: A LICENSED ARCHITECT AND ENGINEER HAD TO SIGN OFF", 1)}
    </>
  ),
  simp: [0, 1e6],
}));

const ch05 = scene(29, "ch05", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 29, "SO THE TANK ITSELF: THAT MYSTERY WAS SOLVED BY 1925")}
      {cap(P, 30, "BUT ONE QUESTION STAYED OPEN FOR ALMOST A CENTURY", 1)}
      {cap(P, 31, "MOLASSES IS SLOW. SO WHY COULDN'T PEOPLE JUST GET OUT OF THE WAY?")}
    </>
  ),
  simp: [0, 1e6],
}));

const ch06 = scene(32, "ch06", (P) => ({
  shots: [],
  ov: (
    <>
      <Cap x={620} y={620} o={P(32, 0.2) ? 1 : 0} />
      {cap(P, 32, "IN 2016, A HARVARD FLUID DYNAMICS CLASS DECIDED TO FIND OUT")}
      <Stp x={1360} y={300} k="P" size={48} a={P(33, 0.4)} />
      {cap(P, 33, "SHARP, KENNEDY & RUBINSTEIN PRESENTED TO THE AMERICAN PHYSICAL SOCIETY", 1)}
      {cap(P, 34, "THEY PULLED BOSTON'S HISTORICAL WEATHER DATA FOR THAT DAY")}
      {cap(P, 35, "AND TESTED MOLASSES AT DIFFERENT TEMPERATURES — CORN SYRUP IN A FREEZER", 1)}
      <Thermo x={960} y={640} o={P(36, 0.2) ? 1 : 0} cold={0.9} />
      {cap(P, 36, "THE TWIST: THAT NIGHT, TEMPERATURES DROPPED TO NEAR FREEZING")}
      <Stp x={620} y={300} k="P" size={48} a={P(37, 0.4)} />
      {cap(P, 37, "THEIR MODEL: THE COLD MADE THE SPILLED MOLASSES 4X MORE VISCOUS", 1)}
      {cap(P, 38, "THICKER. STICKIER. HARDER TO ESCAPE, HARDER TO PULL PEOPLE OUT OF")}
      <Pill x={960} y={300} text={'RUBINSTEIN: "WARMER, IT WOULD HAVE KILLED FEWER PEOPLE"'} size={30} color={orange} a={P(39, 0.2)} b={P(41)} />
      {cap(P, 39, "A WARMER DAY, HE SAID, WOULD HAVE SPREAD THINNER — AND KILLED FEWER", 1)}
      <Reading x={1400} y={620} a={P(40, 0.3)} b={P(41)} />
      {cap(P, 40, "BY HIS ESTIMATE: ABOUT HALF THE VICTIMS DIED BECAUSE THEY GOT STUCK")}
    </>
  ),
  simp: [0, 1e6],
}));

const ch07 = scene(41, "ch07", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 41, "SO HERE'S THE DISTINCTION WORTH REMEMBERING")}
      <Wall x={560} y={620} o={P(42, 0.2) ? 1 : 0} s={0.8} />
      {cap(P, 42, "WHY THE TANK BROKE: BAD ENGINEERING, FROM 1915", 1)}
      <Thermo x={1360} y={640} o={P(43, 0.2) ? 1 : 0} cold={0.9} />
      {cap(P, 43, "WHY THE WAVE WAS SO DEADLY: THE COLD — MODELED DECADES LATER")}
      {cap(P, 44, "TWO DIFFERENT QUESTIONS. TWO DIFFERENT ANSWERS", 1)}
    </>
  ),
  simp: [0, 1e6],
}));

const ch08 = scene(45, "ch08", (P) => ({
  shots: [],
  ov: (
    <>
      <CaseFile x={960} y={640} stamp="CONFERENCE TALK, NOT A PAPER" stampColor={GREY} o={P(45, 0.3) ? 1 : 0} />
      {cap(P, 45, "NO PEER-REVIEWED PAPER — JUST THAT ONE 2016 CONFERENCE TALK")}
      <Stp x={1400} y={300} k="D" size={48} a={P(45, 0.9)} />
      {cap(P, 46, "BUT IT MATCHED EYEWITNESS ACCOUNTS FROM ALMOST 100 YEARS EARLIER", 1)}
      {cap(P, 47, "A BADLY-BUILT TANK. THE WRONG PEOPLE BLAMED. A COLD FRONT THAT MADE IT WORSE")}
      {cap(P, 48, "NEXT TIME SOMEONE SAYS \"SLOW AS MOLASSES\" — THAT NIGHT, SLOW IS WHAT KILLED", 1)}
      {cap(P, 49, "WHAT ELSE GETS BLAMED ON THE WRONG CAUSE, DECADES AFTER THE FACT?")}
    </>
  ),
  simp: [0, 1e6],
}));

export const SCENES056: Record<string, React.FC<SceneProps>> = { ch00, ch01, ch02, ch03, ch04, ch05, ch06, ch07, ch08 };
