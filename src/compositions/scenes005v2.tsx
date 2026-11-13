// EM-005 (semaforo) v6: kit2 (mkScene). Imagenes IA em005-* ("Illustrative image"; las nuevas -v2 con personas: "AI illustration, not a portrait") + un esquema propio de niebla ("Simplified illustration").
// Reglas del pensador: brazo bajado = "proceed with caution"; sin 1929 ("about 60 years later"); sin retrato de Booth; calle victoriana generica "London, 1868".
import React from "react";
import { ink, orange, RED, teal, useT } from "./kit";
import type { SceneProps } from "./scenes";
import { FULL, Kin, Pill } from "./scenes023";
import { Stp } from "./scenes025";
import { Cite, mkScene } from "./v2";
import { ramp } from "../utils/anim";
import { theme } from "../themes/brand";

const scene = mkScene("em005-", {}, ["steam-loco-1830s-signal-v2", "salt-lake-1912-signal-v2", "police-1927-british-street-v2", "police-1868-westminster-semaphore-v2", "detroit-1920-amber-v3b", "cleveland-1914-signal-v3", "cleveland-1914-signal-v3b", "railway-lantern-1841-v3b"]);
const W = (id: string) => ({ id, asp: 1672 / 941 });
const N = (id: string) => ({ id, asp: 1376 / 768 });
const SEM = "semaphore-signal-v2", LAMP = "gas-lamp-burst-v2", FOG = "traffic-light-fog", GREEN = "traffic-light-fog-green-v2";
const LOCO = "steam-loco-1830s-signal-v2", SL = "salt-lake-1912-signal-v2", BR = "police-1927-british-street-v2", WM = "police-1868-westminster-semaphore-v2";
const DET = "detroit-1920-amber-v3b", CL1 = "cleveland-1914-signal-v3", CL2 = "cleveland-1914-signal-v3b", LT1 = "railway-lantern-1841-v3", LT2 = "railway-lantern-1841-v3b";

/** Esquema: la niebla desvia por igual rojo, verde y azul. */
const Fog: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const t = useT();
  const o = ramp(t, a, a + 0.4) * (1 - ramp(t, b - 0.3, b));
  const cols = ["#D64545", "#2E9E5B", "#4A7FD6"];
  return o > 0 ? (
    <g opacity={o}>
      <rect x={1000} y={240} width={820} height={470} rx={30} fill="#FFFDF6" stroke={ink} strokeWidth={5} />
      {Array.from({ length: 22 }, (_, i) => <circle key={i} cx={1310 + ((i * 53) % 150)} cy={330 + ((i * 97) % 320)} r={14} fill="#9AA5B1" opacity={0.7} />)}
      {cols.map((c, i) => (
        <g key={c} stroke={c} strokeWidth={9} strokeLinecap="round" fill="none">
          <line x1={1040} y1={400 + i * 90} x2={1290} y2={400 + i * 90} />
          <line x1={1480} y1={400 + i * 90} x2={1760} y2={370 + i * 120} opacity={0.8} />
        </g>
      ))}
      <text x={1410} y={285} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontWeight={800} fontSize={40} fill={teal}>FOG SCATTERS ALL COLOURS</text>
      <text x={1410} y={685} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontWeight={700} fontSize={34} fill={ink}>about equally</text>
    </g>
  ) : null;
};

const ch01 = scene(0, "ch01", (P) => ({
  shots: [
    { ...W(LAMP), t: 0, r: FULL, f: [0.7, 0.35], z: 1.15, mv: "in", tr: "cut" },
    { ...W(FOG), t: P(2), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page" },
    { ...W(SEM), t: P(4), r: FULL, f: [0.5, 0.5], mv: "pr", tr: "wl" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="THE FIRST TRAFFIC LIGHT" size={110} fill={teal} a={P(0, 0.3)} b={P(1)} rot={-3} />
      <Kin x={960} y={340} text="EXPLODED" size={170} fill={RED} a={P(0, 2.2)} b={P(1)} rot={3} />
      <Kin x={960} y={190} text="THE OFFICER WAS INJURED" size={96} fill={orange} a={P(1, 0.2)} b={P(2)} rot={-3} />
      <Kin x={960} y={190} text="WE OBEY ITS DESCENDANTS" size={100} fill={teal} a={P(2, 0.2)} b={P(3)} rot={-3} />
      <Kin x={960} y={190} text="WHY RED?" size={190} fill={RED} a={P(3, 0.2)} b={P(4)} rot={3} />
      <Pill x={960} y={780} text="RED = STOP, GREEN = GO. WHO DECIDED?" size={46} color={teal} a={P(3, 1.8)} b={P(4)} />
      <Pill x={960} y={150} text="LONDON, THE AGE OF HORSES" size={56} color={orange} a={P(4, 0.3)} b={P(5)} />
    </>
  ),
}));

const ch02 = scene(5, "ch02", (P) => ({
  shots: [
    { ...N(WM), t: P(5), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "cut" },
    { ...W(SEM), t: P(7), r: FULL, f: [0.3, 0.3], z: 1.5, mv: "in", tr: "zoom" },
    { ...W(SEM), t: P(9), r: FULL, f: [0.43, 0.5], z: 1.5, mv: "in", tr: "page" },
    { ...N(WM), t: P(10), r: FULL, f: [0.6, 0.62], z: 1.3, mv: "in", tr: "wl" },
  ],
  ov: (
    <>
      <Pill x={960} y={150} text="LONDON, 1868" size={64} color={teal} a={P(5, 0.3)} b={P(6)} />
      <Kin x={960} y={290} text="HORSES AND CARRIAGES" size={90} fill={orange} a={P(5, 1.0)} b={P(6)} rot={-2} />
      <Kin x={960} y={190} text="CROSSING WAS RISKY" size={120} fill={orange} a={P(6, 0.3)} b={P(7)} rot={-3} />
      <Kin x={960} y={190} text="JOHN PEAKE KNIGHT" size={110} fill={teal} a={P(7, 0.2)} b={P(8)} rot={-3} />
      <Pill x={960} y={330} text="A RAILWAY MAN" size={52} color={orange} a={P(7, 1.4)} b={P(8)} />
      <Pill x={960} y={150} text="DAY: SEMAPHORE ARMS, LIKE A RAILWAY SIGNAL" size={44} color={teal} a={P(8, 0.2)} b={P(9)} />
      <Kin x={1000} y={330} text="ARMS LEVEL = STOP" size={90} fill={RED} a={P(8, 1.8)} b={P(9)} rot={-2} />
      <Kin x={1000} y={470} text="ARMS DOWN = PROCEED WITH CAUTION" size={58} fill={teal} a={P(8, 3.4)} b={P(9)} rot={2} />
      <Cite text="The Engineer, 1868 (via Jalopnik)" a={P(8)} b={P(9)} y={832} x={96} />
      <Kin x={960} y={190} text="NIGHT: RED AND GREEN GAS LAMPS" size={80} fill={orange} a={P(9, 0.2)} b={P(10)} rot={-3} />
      <Kin x={960} y={190} text="WORKED BY HAND" size={120} fill={teal} a={P(10, 0.2)} b={P(11)} rot={3} />
      <Pill x={960} y={330} text="A POLICE OFFICER, A LEVER" size={52} color={orange} a={P(10, 1.2)} b={P(11)} />
    </>
  ),
}));

const ch03 = scene(11, "ch03", (P) => ({
  shots: [
    { ...W(SEM), t: P(11), r: FULL, f: [0.5, 0.5], mv: "in", tr: "cut" },
    { ...W(LAMP), t: P(12), r: FULL, f: [0.7, 0.35], z: 1.1, mv: "in", tr: "zoom" },
    { ...W(LAMP), t: P(13), r: FULL, f: [0.3, 0.4], mv: "pr", tr: "page" },
    { ...N(BR), t: P(15), r: FULL, f: [0.5, 0.5], mv: "in", tr: "wl" },
  ],
  ov: (
    <>
      <Pill x={960} y={150} text="DECEMBER 1868" size={64} color={teal} a={P(11, 0.2)} b={P(12)} />
      <Kin x={960} y={290} text="IT GOES UP" size={130} fill={orange} a={P(11, 0.8)} b={P(12)} rot={-3} />
      <Pill x={960} y={150} text="EARLY JANUARY 1869" size={64} color={teal} a={P(12, 0.2)} b={P(13)} />
      <Kin x={960} y={290} text="GAS LEAKS, A LAMP EXPLODES" size={90} fill={RED} a={P(12, 1.0)} b={P(13)} rot={3} />
      <Kin x={960} y={190} text="THE OFFICER WAS BADLY INJURED" size={80} fill={orange} a={P(13, 0.2)} b={P(14)} rot={-3} />
      <Kin x={960} y={340} text="THE SIGNAL CAME DOWN" size={100} fill={teal} a={P(13, 1.8)} b={P(14)} rot={3} />
      <Kin x={960} y={190} text="NOT THE BEST" size={140} fill={orange} a={P(14, 0.2)} b={P(15)} rot={-3} />
      <Kin x={960} y={350} text="PRODUCT LAUNCH" size={140} fill={teal} a={P(14, 0.8)} b={P(15)} rot={3} />
      <Pill x={960} y={120} text="BACK IN BRITAIN" size={64} color={teal} a={P(15, 0.2)} b={P(16)} />
      <Kin x={960} y={260} text="ABOUT 60 YEARS LATER" size={120} fill={orange} a={P(15, 0.8)} b={P(16)} rot={-3} />
    </>
  ),
}));

const ch04 = scene(16, "ch04", (P) => ({
  shots: [
    { ...N(LT1), t: P(16), r: FULL, f: [0.5, 0.5], mv: "in", tr: "cut" },
    { ...N(LOCO), t: P(17), r: FULL, f: [0.28, 0.55], z: 1.5, mv: "pr", tr: "page" },
    { ...N(LT2), t: P(18), r: FULL, f: [0.6, 0.5], z: 1.8, mv: "in", tr: "zoom" },
    { ...N(LT1), t: P(19), r: FULL, f: [0.6, 0.5], z: 1.6, mv: "out", tr: "fade" },
    { ...N(LOCO), t: P(20), r: FULL, f: [0.25, 0.55], z: 1.6, mv: "pr", tr: "wl" },
    { ...N(LT2), t: P(21), r: FULL, f: [0.6, 0.5], z: 1.5, mv: "in", tr: "zoom" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="FROM THE RAILWAYS" size={130} fill={teal} a={P(16, 0.3)} b={P(17)} rot={-3} />
      <Pill x={960} y={150} text="JANUARY 1841" size={64} color={orange} a={P(17, 0.2)} b={P(18)} />
      <Kin x={960} y={290} text="MANAGERS MEET TO AGREE SIGNALS" size={80} fill={teal} a={P(17, 1.0)} b={P(18)} rot={2} />
      <Kin x={640} y={330} text="RED = DANGER" size={52} fill={RED} a={P(18, 0.4)} b={P(19)} rot={-2} />
      <Kin x={640} y={440} text="WHITE = SAFE" size={52} fill={ink} a={P(18, 2.2)} b={P(19)} rot={2} />
      <Kin x={640} y={550} text="GREEN = CAUTION" size={52} fill={teal} a={P(18, 4.0)} b={P(19)} rot={-2} />
      <Pill x={960} y={150} text="WHY RED? NOBODY KNOWS FOR SURE" size={52} color={orange} a={P(19, 0.2)} b={P(20)} />
      <Kin x={960} y={190} text="A BAD IDEA: WHITE" size={110} fill={RED} a={P(20, 0.3)} b={P(21)} rot={-3} />
      <Pill x={960} y={690} text="BROKEN RED LENS = DANGER SHOWS AS SAFE" size={46} color={teal} a={P(20, 2.6)} b={P(21)} />
      <Kin x={960} y={190} text="GREEN FOR GO" size={140} fill={teal} a={P(21, 0.3)} rot={3} />
    </>
  ),
}));

const ch05 = scene(22, "ch05", (P) => ({
  shots: [
    { ...W(FOG), t: P(22), r: FULL, f: [0.4, 0.4], mv: "in", tr: "cut" },
    { ...W(FOG), t: P(24), r: FULL, f: [0.7, 0.5], mv: "pl", tr: "page" },
    { ...W(FOG), t: P(25), r: FULL, f: [0.5, 0.5], mv: "out", tr: "fade" },
  ],
  ov: (
    <>
      <Kin x={1330} y={190} text="ANOTHER STORY:" size={84} fill={teal} a={P(22, 0.2)} b={P(23)} rot={-3} />
      <Kin x={1330} y={310} text="RED CUTS THROUGH FOG" size={80} fill={orange} a={P(22, 1.2)} b={P(23)} rot={3} />
      <Kin x={1330} y={290} text="SOUNDS CLEVER" size={84} fill={teal} a={P(23, 0.2)} b={P(24)} rot={-3} />
      <Stp x={1400} y={300} k="M" size={70} a={P(23, 1.2)} b={P(24)} />
      <Fog a={P(24, 0.2)} b={P(25)} />
      <Kin x={1330} y={190} text="RED SEEMS TO HAVE WON" size={72} fill={orange} a={P(25, 0.2)} b={P(26)} rot={-3} />
      <Kin x={1330} y={310} text="BY HISTORY, NOT NATURE" size={72} fill={teal} a={P(25, 1.4)} b={P(26)} rot={3} />
    </>
  ),
  simp: [P(24), P(25)],
}));

const ch06 = scene(26, "ch06", (P) => ({
  shots: [
    { ...N(SL), t: P(26), r: FULL, f: [0.5, 0.5], mv: "in", tr: "cut" },
    { ...N(SL), t: P(27), r: FULL, f: [0.25, 0.6], z: 1.3, mv: "pl", tr: "page" },
    { ...N(CL1), t: P(28), r: FULL, f: [0.55, 0.5], z: 1.3, mv: "pr", tr: "wr" },
    { ...N(CL2), t: P(29), r: FULL, f: [0.4, 0.4], z: 1.9, mv: "in", tr: "zoom" },
    { ...N(DET), t: P(30), r: FULL, f: [0.5, 0.45], z: 1.6, mv: "in", tr: "page" },
    { ...N(LT1), t: P(31), r: FULL, f: [0.6, 0.5], z: 1.3, mv: "in", tr: "wl" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="THE IDEA CAME BACK" size={110} fill={teal} a={P(26, 0.3)} b={P(27)} rot={-3} />
      <Pill x={960} y={780} text="40+ YEARS LATER, WITH ELECTRICITY" size={52} color={orange} a={P(26, 1.6)} b={P(27)} />
      <Pill x={960} y={150} text="1912: SALT LAKE CITY" size={64} color={teal} a={P(27, 0.2)} b={P(28)} />
      <Kin x={960} y={290} text="OFFICER LESTER WIRE" size={100} fill={orange} a={P(27, 1.0)} b={P(28)} rot={-3} />
      <Pill x={640} y={150} text="1914: CLEVELAND" size={64} color={teal} a={P(28, 0.2)} b={P(29)} />
      <Kin x={560} y={290} text="A BUSY CORNER" size={96} fill={orange} a={P(28, 1.0)} b={P(29)} rot={3} />
      <Kin x={560} y={190} text="ONLY RED" size={110} fill={RED} a={P(29, 0.3)} b={P(30)} rot={-3} />
      <Kin x={560} y={320} text="AND GREEN" size={110} fill={teal} a={P(29, 1.0)} b={P(30)} rot={3} />
      <Kin x={500} y={440} text="NOTHING IN BETWEEN" size={58} fill={orange} a={P(29, 2.2)} b={P(30)} rot={-2} />
      <Pill x={960} y={150} text="1920: DETROIT" size={64} color={teal} a={P(30, 0.2)} b={P(31)} />
      <Kin x={650} y={300} text="WILLIAM POTTS" size={96} fill={orange} a={P(30, 1.0)} b={P(31)} rot={-3} />
      <Kin x={650} y={430} text="ADDS AMBER" size={96} fill={orange} a={P(30, 1.3)} b={P(31)} rot={-3} />
      <Kin x={960} y={190} text="BORROWED FROM RAILWAYS" size={96} fill={teal} a={P(31, 0.3)} rot={3} />
    </>
  ),
}));

const ch07 = scene(32, "ch07", (P) => ({
  shots: [
    { ...N(LT2), t: P(32), r: FULL, f: [0.5, 0.5], mv: "in", tr: "cut" },
    { ...W(LAMP), t: P(33), r: FULL, f: [0.7, 0.35], z: 1.1, mv: "in", tr: "page" },
    { ...W(SEM), t: P(34), r: FULL, f: [0.5, 0.5], mv: "pr", tr: "wl" },
    { ...W(GREEN), t: P(35), r: FULL, f: [0.35, 0.5], z: 1.2, mv: "in", tr: "zoom" },
  ],
  ov: (
    <>
      <Kin x={480} y={190} text="RED: THE RAILWAYS" size={86} fill={RED} a={P(32, 0.3)} b={P(33)} rot={-3} />
      <Kin x={500} y={330} text="AMBER: A DETROIT OFFICER" size={68} fill={orange} a={P(32, 2.2)} b={P(33)} rot={3} />
      <Kin x={1380} y={190} text="IT BEGAN WITH A LAMP" size={78} fill={teal} a={P(33, 0.2)} b={P(34)} rot={-3} />
      <Kin x={1380} y={310} text="THAT BLEW UP" size={96} fill={orange} a={P(33, 1.2)} b={P(34)} rot={3} />
      <Kin x={960} y={190} text="A WILD BACKSTORY" size={120} fill={teal} a={P(34, 0.2)} b={P(35)} rot={-3} />
      <Kin x={1450} y={190} text="THE LIGHT" size={110} fill={teal} a={P(35, 0.2)} b={P(36)} rot={-3} />
      <Kin x={1450} y={320} text="TURNS GREEN" size={110} fill={teal} a={P(35, 0.6)} b={P(36)} rot={3} />
      <Kin x={1450} y={190} text="BUT WHAT DOES" size={96} fill={teal} a={P(36, 0.2)} b={P(37)} rot={-3} />
      <Kin x={1450} y={330} text="“OK” STAND FOR?" size={96} fill={orange} a={P(36, 0.9)} b={P(37)} rot={3} />
      <Kin x={1500} y={190} text="NEXT: WHY IS" size={88} fill={teal} a={P(37, 0.2)} rot={-3} />
      <Kin x={1500} y={310} text="THE WHOLE WORLD" size={88} fill={teal} a={P(37, 0.7)} rot={3} />
      <Kin x={1480} y={430} text="SAYING “OK”?" size={110} fill={orange} a={P(37, 1.3)} rot={3} />
    </>
  ),
  src: <EndCard a={P(38, -3.0)} />,
}));

/** Tarjeta final: titulo del episodio sobre papel, en el ultimo segundo. */
const EndCard: React.FC<{ a: number }> = ({ a }) => {
  const o = ramp(useT(), a, a + 0.3);
  const tx = { textAnchor: "middle" as const, fontFamily: theme.font, fontWeight: 900 };
  return o > 0 ? (
    <g opacity={o}>
      <rect width={1920} height={1080} fill="#FFFDF6" />
      <text x={960} y={430} fontSize={96} fill={ink} {...tx}>WHY DOES RED MEAN STOP?</text>
      <text x={960} y={540} fontSize={64} fill={ink} {...tx}>THE FIRST TRAFFIC LIGHT EXPLODED</text>
      <rect x={860} y={600} width={200} height={8} fill={orange} />
      <text x={960} y={690} fontSize={44} fill={teal} {...tx}>THE EVERYDAY MYSTERY</text>
    </g>
  ) : null;
};

export const SCENES005V2: Record<string, React.FC<SceneProps>> = { "light-hook": ch01, london: ch02, boom: ch03, railway: ch04, "fog-myth": ch05, "electric-amber": ch06, close: ch07 };
