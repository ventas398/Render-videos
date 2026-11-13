// EM-054 (D.B. Cooper, 1971): 100% vectorial, sin rostros reales (3 sospechosos ya fallecidos, caso abierto).
// mkScene con shots:[] en todos los capitulos; todo el contenido visual va en ov (kit.tsx).
import React from "react";
import { Calendar, G, GREY, ink, orange, RED, teal, Txt } from "./kit";
import type { SceneProps } from "./scenes";
import { Kin, Pill } from "./scenes023";
import { Stp } from "./scenes025";
import { mkScene } from "./v2";

const scene = mkScene("em054-", {}, [], []);
type PF = (part: number, o?: number) => number;

/** Rotulo corto de la parte n; i=0 arriba, 1 debajo. */
const cap = (P: PF, n: number, text: string, i = 0, m = n + 1, dy = 0) => (
  <Kin key={`${n}${i}`} x={960} y={(i ? 330 : 190) + dy} text={text} size={Math.max(60, Math.min(140, Math.round(2250 / text.length)))} fill={(n + i) % 2 ? orange : teal} a={P(n, 0.2 + i * 1.1)} b={P(m)} rot={(n + i) % 2 ? 3 : -3} />
);
/** Avion de pasajeros, silueta lateral simplificada (727). */
const Plane: React.FC<{ x: number; y: number; o: number; s?: number; rot?: number; night?: boolean }> = ({ x, y, o, s = 1, rot = 0, night = false }) =>
  o <= 0 ? null : (
    <G x={x} y={y} s={s} rot={rot} o={o}>
      {night && <rect x={-900} y={-500} width={1800} height={1000} fill="#1B2A4A" opacity={0.5} />}
      <path d="M-260 10 Q-260 -40 -170 -40 L150 -40 Q230 -40 230 0 Q230 40 150 40 L-170 40 Q-260 40 -260 10 Z" fill="#fff" stroke={ink} strokeWidth={7} />
      <path d="M-40 -40 L30 -170 L70 -170 L50 -40 Z" fill={teal} stroke={ink} strokeWidth={6} />
      <path d="M150 -10 L240 -90 L260 -80 L190 10 Z" fill={orange} stroke={ink} strokeWidth={6} />
      <path d="M-230 -10 L-150 20 L-150 40 L-230 30 Z" fill={GREY} stroke={ink} strokeWidth={5} />
      {Array.from({ length: 6 }).map((_, i) => (
        <circle key={i} cx={-140 + i * 55} cy={-2} r={7} fill={ink} />
      ))}
    </G>
  );

/** Paracaidas abierto con una figura generica colgando (sin rostro). */
const Chute: React.FC<{ x: number; y: number; o: number; s?: number }> = ({ x, y, o, s = 1 }) =>
  o <= 0 ? null : (
    <G x={x} y={y} s={s} o={o}>
      <path d="M-170 -20 Q0 -170 170 -20 Q90 -50 0 -30 Q-90 -50 -170 -20 Z" fill={orange} stroke={ink} strokeWidth={6} />
      <line x1={-140} y1={-24} x2={-14} y2={70} stroke={ink} strokeWidth={4} />
      <line x1={140} y1={-24} x2={14} y2={70} stroke={ink} strokeWidth={4} />
      <circle cy={90} r={16} fill={ink} />
      <rect x={-18} y={104} width={36} height={46} rx={10} fill={ink} />
    </G>
  );

/** Fajo de billetes con signo de dolar. */
const Cash: React.FC<{ x: number; y: number; o: number; s?: number }> = ({ x, y, o, s = 1 }) =>
  o <= 0 ? null : (
    <G x={x} y={y} s={s} o={o}>
      {[18, 9, 0].map((dy, i) => (
        <rect key={i} x={-120} y={-50 + dy} width={240} height={90} rx={10} fill="#DDF2DD" stroke={ink} strokeWidth={5} />
      ))}
      <circle cy={-5} r={30} fill="none" stroke="#2F8F4E" strokeWidth={5} />
      <Txt x={0} y={-2} size={44} fill="#2F8F4E">$</Txt>
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
          <rect x={-120} y={-28} width={240} height={56} rx={10} fill="none" stroke={stampColor} strokeWidth={7} />
          <Txt x={0} y={2} size={34} fill={stampColor} spacing={1}>{stamp}</Txt>
        </G>
      )}
    </G>
  );

/** Rio con banco de arena, para el hallazgo del dinero. */
const River: React.FC<{ o: number }> = ({ o }) =>
  o <= 0 ? null : (
    <G o={o}>
      <rect x={0} y={700} width={1920} height={380} fill="#3E7BD6" opacity={0.35} />
      <path d="M700 760 Q960 700 1220 760 L1220 860 L700 860 Z" fill="#D8C6A0" opacity={0.9} />
      <Txt x={960} y={930} size={34}>COLUMBIA RIVER, 1980</Txt>
    </G>
  );

/** Figura generica (sin rostro real) con signo de interrogacion, para sospechosos no probados. */
const Suspect: React.FC<{ x: number; y: number; o: number; name: string }> = ({ x, y, o, name }) =>
  o <= 0 ? null : (
    <G x={x} y={y} o={o}>
      <circle cy={-130} r={50} fill="#E9E2CF" stroke={ink} strokeWidth={6} />
      <Txt x={0} y={-122} size={56} fill={ink}>?</Txt>
      <path d="M-70 40 Q0 -60 70 40 L70 160 L-70 160 Z" fill={GREY} opacity={0.6} stroke={ink} strokeWidth={6} />
      <Txt x={0} y={200} size={30} fill={ink}>{name}</Txt>
    </G>
  );

const ch01 = scene(0, "ch01", (P) => ({
  shots: [],
  ov: (
    <>
      <Plane x={960} y={640} o={1} s={1.1} />
      {cap(P, 0, "A MAN IN A SUIT BOARDED A PLANE")}
      {cap(P, 1, "UNDER A FAKE NAME")}
      {cap(P, 2, "HE SAID HE HAD A BOMB")}
      <Cash x={620} y={700} o={P(2, 0.3) ? 1 : 0} s={0.6} />
      {cap(P, 3, "$200,000 · 4 PARACHUTES · RADIO SILENCE")}
      <Chute x={1340} y={680} o={P(3, 0.6) ? 1 : 0} s={0.8} />
      {cap(P, 4, "THEN HE JUMPED INTO THE NIGHT")}
      {cap(P, 5, "HE WAS NEVER SEEN AGAIN")}
      <Stp x={560} y={520} k="D" size={44} a={P(6, 1.0)} b={P(7)} />
      <Stp x={960} y={520} k="P" size={44} a={P(6, 1.8)} b={P(7)} />
      <Stp x={1360} y={520} k="N" size={44} a={P(6, 2.6)} b={P(7)} />
    </>
  ),
  simp: [0, 1e6],
}));

const ch02 = scene(6, "ch02", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 6, "WE MARK EVERY CLAIM")}
      {cap(P, 7, "THREE SUSPECTS, NONE PROVEN")}
      {cap(P, 8, "A PARACHUTE THAT RESURFACED MONTHS AGO")}
      {cap(P, 9, "THE EVERYDAY MYSTERY")}
    </>
  ),
  simp: [0, 1e6],
}));

const ch03 = scene(10, "ch03", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 10, "FIRST, THE HIJACKING ITSELF")}
      <Calendar x={500} y={640} month="NOVEMBER" year="71" o={P(11, 0.2) ? 1 : 0} />
      {cap(P, 11, "FLIGHT 305 · PORTLAND TO SEATTLE")}
      {cap(P, 12, "TICKET BOUGHT IN CASH: \"DAN COOPER\"")}
      <Plane x={1360} y={640} o={P(13, 0.2) ? 1 : 0} s={0.8} />
      {cap(P, 13, "A NOTE: \"I HAVE A BOMB\"")}
      <Pill x={960} y={700} text="$200,000 + 4 PARACHUTES" size={48} color={teal} a={P(14, 0.2)} b={P(16)} />
      {cap(P, 14, "DEMANDED, READY AT LANDING")}
      {cap(P, 15, "PASSENGERS RELEASED · MONEY CAME ABOARD")}
      <Stp x={1380} y={300} k="D" size={60} a={P(16, 0.8)} />
    </>
  ),
  simp: [0, 1e6],
}));

const ch04 = scene(17, "ch04", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 17, "THE PLANE TOOK OFF AGAIN")}
      <Plane x={960} y={620} o={P(18, 0.2) ? 1 : 0} night />
      {cap(P, 18, "LOW AND SLOW, TOWARD RENO")}
      <Chute x={960} y={700} o={P(19, 0.2) ? 1 : 0} s={1.1} />
      {cap(P, 19, "SOMEWHERE OVER SOUTHERN WASHINGTON")}
      {cap(P, 20, "HE OPENED THE REAR STAIRS AND JUMPED")}
      <Stp x={620} y={300} k="D" size={56} a={P(20, 0.9)} b={P(21)} />
      <Stp x={1300} y={300} k="P" size={56} a={P(20, 1.7)} b={P(21)} />
      {cap(P, 21, "THE JUMP: DOCUMENTED. AFTER IT: DISPUTED")}
    </>
  ),
  simp: [0, 1e6],
}));

const ch05 = scene(22, "ch05", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 22, "NINE YEARS LATER, A CLUE")}
      <River o={P(23, 0.2) ? 1 : 0} />
      <Cash x={960} y={700} o={P(23, 0.2) ? 1 : 0} s={0.7} />
      {cap(P, 23, "FEBRUARY 10, 1980 · ROTTING CASH IN A SANDBAR")}
      <Pill x={960} y={300} text="$5,800 OF $200,000" size={50} color={teal} a={P(24, 0.2)} b={P(26)} />
      {cap(P, 24, "SERIAL NUMBERS MATCHED THE RANSOM")}
      {cap(P, 25, "THE ONLY PHYSICAL EVIDENCE EVER FOUND", 1, 26)}
      <Stp x={1380} y={520} k="D" size={56} a={P(26, 0.8)} />
    </>
  ),
  simp: [0, 1e6],
}));

const ch06 = scene(27, "ch06", (P) => ({
  shots: [],
  ov: (
    <>
      <CaseFile x={960} y={640} o={P(27, 0.2) ? 1 : 0} stamp="INACTIVE" stampColor={orange} />
      {cap(P, 27, "JULY 8, 2016 · THE FBI STEPPED BACK")}
      {cap(P, 28, "NOT SOLVED. INACTIVE.")}
      {cap(P, 29, "STILL OPEN TO NEW PHYSICAL EVIDENCE")}
      <Stp x={1380} y={300} k="D" size={56} a={P(29, 0.8)} />
    </>
  ),
  simp: [0, 1e6],
}));

const ch07 = scene(30, "ch07", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 30, "THREE MEN WERE NAMED. NONE CONFIRMED.")}
      <Suspect x={420} y={580} o={P(31, 0.2) ? 1 : 0} name="RICHARD McCOY" />
      <Suspect x={960} y={580} o={P(32, 0.2) ? 1 : 0} name="KENNETH CHRISTIANSEN" />
      <Suspect x={1500} y={580} o={P(33, 0.2) ? 1 : 0} name="ROBERT RACKSTRAW" />
      {cap(P, 31, "COPIED THE METHOD · WITNESSES SAID NO MATCH")}
      {cap(P, 32, "SAME AIRLINE · DNA DID NOT MATCH", 1, 33)}
      {cap(P, 33, "\"SUSPECT OF CONSENSUS\" · DENIED IT UNTIL HE DIED")}
      {cap(P, 34, "NEVER FORMALLY CHARGED. NEVER CONFIRMED.")}
      <Stp x={960} y={300} k="P" size={70} a={P(35, 0.8)} />
    </>
  ),
  simp: [0, 1e6],
}));

const ch08 = scene(36, "ch08", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 36, "2022 · A NEW PIECE TURNED UP")}
      <Chute x={960} y={620} o={P(37, 0.2) ? 1 : 0} s={1} />
      {cap(P, 37, "A RIG FOUND ON McCOY FAMILY PROPERTY")}
      {cap(P, 38, "HIS CHILDREN BELIEVE IT PROVES THEIR FATHER")}
      <CaseFile x={960} y={640} o={P(39, 0.3) ? 1 : 0} stamp="SEIZED 2024" stampColor={RED} />
      {cap(P, 39, "2024 · THE FBI SEIZED AND TESTED IT")}
      {cap(P, 40, "ALMOST TWO YEARS LATER, IT CAME BACK", 1, 41)}
      <Pill x={960} y={300} text={'"NOT BEING CREDITED OR DISCREDITED"'} size={38} color={orange} a={P(41, 0.2)} b={P(42)} />
      <Stp x={1380} y={520} k="N" size={56} a={P(42, 0.8)} />
    </>
  ),
  simp: [0, 1e6],
}));

const ch09 = scene(43, "ch09", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 43, "SO LET'S COUNT WHAT WE KNOW")}
      <Stp x={480} y={450} k="D" size={60} a={P(44, 0.2)} b={P(47)} />
      <Pill x={480} y={560} text="HIJACKING · DEMAND · THE JUMP" size={28} color={teal} a={P(44, 0.6)} b={P(47)} />
      <Stp x={960} y={450} k="D" size={60} a={P(45, 0.2)} b={P(47)} />
      <Pill x={960} y={560} text="1980 MONEY · 2016 CLOSURE" size={28} color={teal} a={P(45, 0.6)} b={P(47)} />
      <Stp x={1440} y={450} k="N" size={60} a={P(46, 0.2)} b={P(47)} />
      <Pill x={1440} y={560} text="EVERY SUSPECT · THE 2025 PARACHUTE" size={26} color={GREY} a={P(46, 0.6)} b={P(47)} />
    </>
  ),
  simp: [0, 1e6],
}));

const ch10 = scene(47, "ch10", (P) => ({
  shots: [],
  ov: (
    <>
      {cap(P, 47, "SO, WHO WAS D.B. COOPER?")}
      <G x={960} y={620} o={P(48, 0.2) ? 1 : 0}>
        <Txt x={0} y={0} size={160} fill={orange}>?</Txt>
      </G>
      {cap(P, 48, "AFTER 54 YEARS: WE DON'T KNOW")}
      {cap(P, 49, "WHAT WOULD ACTUAL PROOF EVEN LOOK LIKE?")}
    </>
  ),
  simp: [0, 1e6],
}));

export const SCENES054: Record<string, React.FC<SceneProps>> = { ch01, ch02, ch03, ch04, ch05, ch06, ch07, ch08, ch09, ch10 };
