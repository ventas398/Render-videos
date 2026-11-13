import React from "react";
import { vis } from "../components/ui";
import { lerp, ramp } from "../utils/anim";
import type { SceneProps } from "./scenes";
import { Chips, Note } from "./scenes011";
import { Arrow, G, GOLD, GREEN, GREY, ink, orange, Plaque, RED, SAND, seg, SimpleNote, SOFT, Stamp, SvgFrame, teal, Txt, useT, WARM } from "./kit";

/* ------------------------------------------------------------------ piezas genericas (sin marcas) */
type Dent = [number, number, number]; // [x, profundidad, anchura]

/** Linea de superficie del agua con abolladuras (hacia abajo). */
const surf = (y0: number, dents: Dent[], t: number, amp = 3, extra?: (x: number) => number): string =>
  Array.from({ length: 97 }, (_, i) => {
    const x = i * 20;
    let y = y0 + amp * Math.sin(i * 0.7 + t * 1.4) + (extra ? extra(x) : 0);
    for (const [cx, d, w] of dents) y += d * Math.exp(-(((x - cx) / w) ** 2));
    return `${i ? "L" : "M"}${x} ${y}`;
  }).join(" ");

const Water: React.FC<{ d: string; o?: number }> = ({ d, o = 1 }) => (
  <G o={o}>
    <path d={`${d} V745 H0 Z`} fill={teal} fillOpacity={0.15} />
    <path d={d} fill="none" stroke={teal} strokeWidth={7} strokeLinejoin="round" />
  </G>
);

const FOOT = [150, -10, -150];
/** Abolladuras bajo los 6 pies (3 cercanos, 3 lejanos) de un zapatero en x, escala s, profundidad d. */
const ds = (x: number, s: number, d: number): Dent[] => FOOT.flatMap((f) => [[x + f * s, d, 26 * s] as Dent, [x + (f + 28) * s, d, 26 * s] as Dent]);
/** y del cuerpo para que los pies toquen el fondo de la abolladura. */
const sy = (y0: number, s: number, d: number) => y0 + d - 62 * s;

const LEGS = ["M35 6 L100 -20 L150 62", "M5 8 L-30 -28 L-10 62", "M-35 6 L-110 -20 L-150 62"];
/** Zapatero de agua (vista lateral, mira a la derecha). Pies en y=62. */
const Strider: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <G x={28} o={0.4}>
      {LEGS.map((d) => (
        <path key={d} d={d} fill="none" stroke={ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </G>
    {LEGS.map((d) => (
      <path key={d} d={d} fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    ))}
    <ellipse rx={70} ry={16} fill={ink} />
    <circle cx={78} cy={-4} r={11} fill={ink} />
    <path d="M86 -12 L106 -28" stroke={ink} strokeWidth={4} strokeLinecap="round" />
  </G>
);

/** Zapatero visto desde arriba. hl = patas medias naranja (propulsion) y traseras teal (direccion). */
const TopStrider: React.FC<{ x: number; y: number; s?: number; o?: number; hl?: number }> = ({ x, y, s = 1, o = 1, hl = 0 }) => (
  <G x={x} y={y} s={s} o={o}>
    {[-1, 1].map((m) => (
      <G key={m}>
        <path d={`M35 ${10 * m} L105 ${40 * m} L150 ${62 * m}`} fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M0 ${12 * m} L-20 ${100 * m} L-40 ${150 * m}`} fill="none" stroke={hl ? orange : ink} strokeWidth={hl ? 8 : 6} strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M-38 ${8 * m} L-110 ${45 * m} L-150 ${70 * m}`} fill="none" stroke={hl ? teal : ink} strokeWidth={hl ? 8 : 6} strokeLinecap="round" strokeLinejoin="round" />
      </G>
    ))}
    <ellipse rx={62} ry={20} fill={ink} />
    <circle cx={70} cy={0} r={12} fill={ink} />
  </G>
);

const Mini: React.FC<{ x1: number; y1: number; x2: number; y2: number; c: string; o?: number }> = ({ x1, y1, x2, y2, c, o = 1 }) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const p = (d: number) => `${x2 + Math.cos(a + d) * 14},${y2 + Math.sin(a + d) * 14}`;
  return (
    <g opacity={o}>
      <line x1={x1} y1={y1} x2={x2 - Math.cos(a) * 8} y2={y2 - Math.sin(a) * 8} stroke={c} strokeWidth={5} strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${p(Math.PI - 0.5)} ${p(Math.PI + 0.5)}`} fill={c} />
    </g>
  );
};

const Vortex: React.FC<{ x: number; y: number; r?: number; dir?: number; t: number; o?: number }> = ({ x, y, r = 56, dir = 1, t, o = 1 }) => (
  <G x={x} y={y} o={o} rot={dir * t * 80}>
    <circle r={r} fill="none" stroke={teal} strokeWidth={6} strokeDasharray="34 18" strokeLinecap="round" />
    <circle r={r * 0.5} fill="none" stroke={teal} strokeWidth={4} strokeDasharray="18 14" strokeLinecap="round" />
  </G>
);

const Foot: React.FC<{ t: number; c: number[]; k: number; text: string; x?: number }> = ({ t, c, k, text, x = 960 }) => <Note x={x} y={735} text={text} o={vis(t, c[k] + 0.6)} size={36} fill={teal} />;

/* ------------------------------------------------------------------ hook (0-2) */
const SceneHook: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const y0 = 560;
  const water = surf(y0, ds(960, 2, 24), t);
  const feet = ds(960, 2, 24);
  return (
    <>
      <SvgFrame>
        <G o={k(0, 1)}>
          <Water d={water} />
          <Strider x={960} y={sy(y0, 2, 24)} s={2} />
          <Note x={960} y={690} text={t > c[1] - 0.2 ? "the water pushes back" : "standing on tiny dents"} o={1} size={44} fill={teal} />
          {feet.map(([fx], i) => (
            <Arrow key={i} x1={fx} y1={y0 + 96} x2={fx} y2={y0 + 42} color={orange} w={6} o={vis(t, c[1] + 0.4 + i * 0.15)} />
          ))}
        </G>
        <G o={k(2)}>
          <Water d={surf(700, ds(960, 1, 16), t)} />
          <Strider x={960} y={sy(700, 1, 16)} s={1} />
          <Txt x={760} y={340} size={280} serif>
            WHY
          </Txt>
          <Txt x={1170} y={330} size={280} serif fill={orange}>
            ?
          </Txt>
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["A STANDING INSECT"], ["THE WATER PUSHES BACK"], ["WHY?", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ tension (3-8) */
const SceneTension: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const xs = [520, 960, 1400].map((x, i) => x + 14 * Math.sin(t * 0.7 + i * 2));
  const dent7 = 70 * ramp(t, c[4] + 1.0, c[4] + 3.4);
  const fab = Array.from({ length: 65 }, (_, i) => {
    const x = 560 + i * 12.5;
    return `${i ? "L" : "M"}${x} ${400 + dent7 * Math.exp(-(((x - 960) / 120) ** 2))}`;
  }).join(" ");
  const flank = (x: number) => 520 + 80 * Math.exp(-(((x - 960) / 80) ** 2));
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Plaque x={960} y={200} text="WATER STRIDER" w={700} o={vis(t, c[0] + 0.4)} />
          <Water
            d={surf(
              520,
              xs.flatMap((x) => ds(x, 1, 10)),
              t,
            )}
          />
          {xs.map((x) => (
            <Strider key={x} x={x} y={sy(520, 1, 10)} s={1} />
          ))}
          <Foot t={t} c={c} k={0} text="Wikipedia" />
        </G>
        <G o={k(1)}>
          <TopStrider x={480} y={400} s={0.9} />
          <line x1={330} y1={610} x2={630} y2={610} stroke={ink} strokeWidth={6} />
          {[330, 630].map((x) => (
            <line key={x} x1={x} y1={594} x2={x} y2={626} stroke={ink} strokeWidth={6} />
          ))}
          <Txt x={480} y={670} size={48} serif fill={ink}>
            2-12 mm
          </Txt>
          <G x={1100} y={400} o={vis(t, c[1] + 1.2)}>
            <path d="M0 -90 C50 -10 70 30 70 55 A70 70 0 0 1 -70 55 C-70 30 -50 -10 0 -90Z" fill={teal} fillOpacity={0.3} stroke={teal} strokeWidth={6} />
          </G>
          <Note x={1100} y={590} text="most: fresh water" o={vis(t, c[1] + 1.2)} size={36} fill={ink} />
          <G x={1560} y={400} o={vis(t, c[1] + 3.0)}>
            {[-40, 0, 40].map((dy) => (
              <path key={dy} d={`M-100 ${dy} Q-75 ${dy - 30} -50 ${dy} T0 ${dy} T50 ${dy} T100 ${dy}`} fill="none" stroke={teal} strokeWidth={8} strokeLinecap="round" />
            ))}
          </G>
          <Txt x={1560} y={590} size={44} weight={800} fill={orange}>
            ~10 % MARINE
          </Txt>
          <Foot t={t} c={c} k={1} text="Wikipedia" />
        </G>
        <G o={k(2)}>
          <rect x={560} y={240} width={800} height={450} rx={24} fill={teal} fillOpacity={0.1} stroke={ink} strokeWidth={6} />
          {Array.from({ length: 4 }, (_, j) =>
            Array.from({ length: 6 }, (_, i) => {
              const mx = 660 + i * 120;
              const my = [290, 440, 536, 632][j];
              const o = j === 0 ? vis(t, c[2] + 3.4) : vis(t, c[2] + 1.0);
              return (
                <G key={`${i}${j}`}>
                  <circle cx={mx} cy={my} r={22} fill={teal} fillOpacity={0.25} stroke={teal} strokeWidth={4} />
                  {j === 0 ? (
                    <Arrow x1={mx} y1={my + 28} x2={mx} y2={my + 96} color={orange} w={9} o={o} />
                  ) : (
                    <>
                      <Mini x1={mx} y1={my - 24} x2={mx} y2={my - 44} c={GREEN} o={o} />
                      <Mini x1={mx} y1={my + 24} x2={mx} y2={my + 44} c={GREEN} o={o} />
                      <Mini x1={mx - 24} y1={my} x2={mx - 44} y2={my} c={GREEN} o={o} />
                      <Mini x1={mx + 24} y1={my} x2={mx + 44} y2={my} c={GREEN} o={o} />
                    </>
                  )}
                </G>
              );
            }),
          )}
          <Note x={290} y={488} text="inside: pulled all around" o={vis(t, c[2] + 1.0)} size={36} fill={GREEN} />
          <Note x={1650} y={290} text="surface: pulled inward" o={vis(t, c[2] + 3.4)} size={36} fill={orange} />
          <line x1={540} y1={488} x2={612} y2={488} stroke={GREEN} strokeWidth={3} strokeLinecap="round" opacity={vis(t, c[2] + 1.0)} />
          <line x1={1436} y1={290} x2={1322} y2={290} stroke={orange} strokeWidth={3} strokeLinecap="round" opacity={vis(t, c[2] + 3.4)} />
          <Foot t={t} c={c} k={2} text="Wikipedia" />
        </G>
        <G o={k(3)}>
          <Plaque x={960} y={200} text="ELASTIC FILM" w={620} o={vis(t, c[3] + 0.4)} />
          <path d={`M0 520 L1920 520 V745 H0 Z`} fill={teal} fillOpacity={0.15} />
          <line x1={420} y1={520} x2={1500} y2={520} stroke={teal} strokeWidth={14} strokeLinecap="round" />
          <Arrow x1={600} y1={470} x2={380} y2={470} color={orange} w={8} o={vis(t, c[3] + 1.0)} />
          <Arrow x1={1320} y1={470} x2={1540} y2={470} color={orange} w={8} o={vis(t, c[3] + 1.0)} />
          <Note x={960} y={640} text="the surface behaves like a stretched film" o={vis(t, c[3] + 1.6)} size={40} fill={ink} />
          <Foot t={t} c={c} k={3} text="Wikipedia" />
        </G>
        <G o={k(4)}>
          <rect x={540} y={330} width={24} height={300} rx={8} fill={SAND} stroke={ink} strokeWidth={5} />
          <rect x={1356} y={330} width={24} height={300} rx={8} fill={SAND} stroke={ink} strokeWidth={5} />
          <path d={fab} fill="none" stroke={ink} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" />
          <path d={fab} fill="none" stroke={WARM} strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" />
          <G x={960} y={386 + dent7} o={vis(t, c[4] + 0.6)}>
            <rect x={-26} y={-170} width={52} height={170} rx={26} fill={SOFT} stroke={ink} strokeWidth={6} />
          </G>
          <Note x={960} y={640} text="it dents instead of breaking" o={vis(t, c[4] + 2.4)} size={40} fill={ink} />
        </G>
        <G o={k(5)}>
          <path d={`M0 520 L${Array.from({ length: 97 }, (_, i) => `${i * 20} ${flank(i * 20)}`).join(" L")} L1920 520 V745 H0 Z`} fill={teal} fillOpacity={0.15} />
          <path d={`M0 520 L${Array.from({ length: 97 }, (_, i) => `${i * 20} ${flank(i * 20)}`).join(" L")} L1920 520`} fill="none" stroke={teal} strokeWidth={7} />
          <path d="M700 230 L960 600" fill="none" stroke={ink} strokeWidth={12} strokeLinecap="round" />
          {[880, 1040].map((x) => (
            <Arrow key={x} x1={x} y1={670} x2={x} y2={590} color={orange} w={8} o={vis(t, c[5] + 1.4)} />
          ))}
          <Note x={1400} y={640} text="the surface pushes back" o={vis(t, c[5] + 1.4)} size={38} fill={orange} />
          <Note x={560} y={420} text="a dent under the foot" o={vis(t, c[5] + 0.6)} size={38} fill={ink} />
          <Foot t={t} c={c} k={5} text="Wikipedia" />
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["THE WATER STRIDER"], ["SIZE AND HABITAT"], ["A PULL AT THE SURFACE"], ["AN ELASTIC FILM"], ["OUR COMPARISON", true], ["DENTS PUSH BACK"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ legs (9-15) */
const SceneLegs: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const drop = (i: number) => {
    const u = (t * 0.25 + i / 3) % 1;
    const run = Math.min(u / 0.75, 1);
    const fall = Math.max(0, (u - 0.75) / 0.25);
    return { x: lerp(500, 1200, run) + fall * 20, y: lerp(340, 600, run) - 24 + fall * fall * 150, o: 1 - fall * fall };
  };
  const hair = (u: number) => ({ x: lerp(500, 1400, u), y: lerp(560, 300, u) });
  const rise = ramp(t, c[3] + 2.4, c[3] + 5.0);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Plaque x={960} y={190} text="HYDROPHOBIC = REPELS WATER" w={1200} o={vis(t, c[0] + 0.4)} />
          <path d="M420 330 L1300 640" fill="none" stroke={ink} strokeWidth={12} strokeLinecap="round" />
          {[0, 1, 2].map((i) => {
            const d = drop(i);
            return (
              <path
                key={i}
                d="M0 -26 C16 -4 22 8 22 16 A22 22 0 0 1 -22 16 C-22 8 -16 -4 0 -26Z"
                transform={`translate(${d.x} ${d.y})`}
                fill={teal}
                fillOpacity={0.55 * d.o}
                stroke={teal}
                strokeWidth={4}
                opacity={d.o}
              />
            );
          })}
          <Note x={640} y={560} text="repels water" o={vis(t, c[0] + 2.0)} size={40} fill={ink} />
          <Foot t={t} c={c} k={0} text="Wikipedia" />
        </G>
        <G o={k(1)}>
          <path d={surf(540, [[520, 90, 60], ...[1210, 1290, 1370, 1430, 1510, 1590].map((x) => [x, 14, 18] as Dent)], t)} fill="none" stroke={teal} strokeWidth={7} />
          <path d={`${surf(540, [[520, 90, 60], ...[1210, 1290, 1370, 1430, 1510, 1590].map((x) => [x, 14, 18] as Dent)], t)} V745 H0 Z`} fill={teal} fillOpacity={0.15} />
          <rect x={420} y={250} width={200} height={80} rx={14} fill={WARM} stroke={ink} strokeWidth={6} />
          <line x1={520} y1={330} x2={520} y2={628} stroke={ink} strokeWidth={8} strokeLinecap="round" />
          <rect x={1300} y={250} width={200} height={80} rx={14} fill={WARM} stroke={ink} strokeWidth={6} />
          {[1210, 1290, 1370, 1430, 1510, 1590].map((x, i) => (
            <line key={x} x1={1320 + i * 32} y1={330} x2={x} y2={552} stroke={ink} strokeWidth={6} strokeLinecap="round" />
          ))}
          <Note x={520} y={730 - 20} text="same weight, smaller area" o={vis(t, c[1] + 1.0)} size={40} fill={RED} />
          <Note x={1400} y={710} text="same weight, larger area" o={vis(t, c[1] + 2.0)} size={40} fill={teal} />
          <Foot t={t} c={c} k={1} text="Wikipedia" />
        </G>
        <G o={k(2)}>
          <defs>
            <clipPath id="lens11">
              <circle cx={960} cy={490} r={205} />
            </clipPath>
          </defs>
          <Txt x={960} y={168} size={44} weight={800} fill={teal}>
            SEVERAL THOUSAND HAIRS
          </Txt>
          <Txt x={960} y={222} size={44} weight={800} fill={teal}>
            PER SQUARE MILLIMETER
          </Txt>
          <circle cx={960} cy={490} r={205} fill="#fff" />
          <G o={1}>
            <g clipPath="url(#lens11)">
              <rect x={700} y={450} width={520} height={80} rx={40} fill={SAND} stroke={ink} strokeWidth={5} />
              {Array.from({ length: 27 }, (_, i) => (
                <g key={i} opacity={vis(t, c[2] + 0.8 + i * 0.05)}>
                  <line x1={740 + i * 18} y1={450} x2={750 + i * 18} y2={395} stroke={ink} strokeWidth={3} />
                  <line x1={740 + i * 18} y1={530} x2={750 + i * 18} y2={585} stroke={ink} strokeWidth={3} />
                </g>
              ))}
            </g>
          </G>
          <circle cx={960} cy={490} r={205} fill="none" stroke={ink} strokeWidth={10} />
          <Foot t={t} c={c} k={2} text="Wikipedia" />
        </G>
        <G o={k(3)}>
          <path d={surf(430, [], t)} fill="none" stroke={teal} strokeWidth={7} />
          <path d={`${surf(430, [], t)} V745 H0 Z`} fill={teal} fillOpacity={0.15} />
          <G x={960} y={lerp(640, 540, rise)}>
            <ellipse rx={190} ry={76} fill="#EAF1F7" stroke={GREY} strokeWidth={5} />
            <Strider x={0} y={0} s={1.2} />
          </G>
          <Arrow x1={1240} y1={640} x2={1240} y2={520} color={orange} w={8} o={vis(t, c[3] + 1.8)} />
          <Note x={1600} y={560} text="trapped air:" o={vis(t, c[3] + 0.8)} size={40} fill={ink} />
          <Note x={1600} y={606} text="float and breathe" o={vis(t, c[3] + 0.8)} size={40} fill={teal} />
          <Foot t={t} c={c} k={3} text="Wikipedia" />
        </G>
        <G o={k(4)}>
          <path d={surf(520, [[620, -130, 80]], t)} fill="none" stroke={teal} strokeWidth={7} />
          <path d={`${surf(520, [[620, -130, 80]], t)} V745 H0 Z`} fill={teal} fillOpacity={0.15} />
          <path d="M620 250 L620 400" fill="none" stroke={ink} strokeWidth={10} strokeLinecap="round" />
          <circle cx={620} cy={232} r={26} fill={ink} />
          <Arrow x1={780} y1={440} x2={780} y2={300} color={orange} w={8} o={vis(t, c[4] + 1.0)} />
          <Note x={1300} y={300} text="AKIN TO" o={vis(t, c[4] + 1.6)} size={40} fill={GREY} />
          <Txt x={1300} y={440} size={170} serif fill={orange}>
            100x
          </Txt>
          <Note x={1300} y={560} text="a strider's body weight" o={vis(t, c[4] + 1.6)} size={40} fill={ink} />
          <Foot t={t} c={c} k={4} text="MIT News" />
        </G>
        <G o={k(5)}>
          <defs>
            <clipPath id="lens14">
              <circle cx={640} cy={460} r={205} />
            </clipPath>
          </defs>
          <circle cx={640} cy={460} r={205} fill="#fff" />
          <g clipPath="url(#lens14)">
            <polygon points="420,395 900,444 900,476 420,525" fill={SAND} stroke={ink} strokeWidth={5} />
            {[-14, -5, 5, 14].map((dy, i) => (
              <line key={i} x1={430} y1={460 + dy * 2.2} x2={900} y2={460 + dy * 0.4} stroke={ink} strokeWidth={3} strokeDasharray="14 8" opacity={vis(t, c[5] + 1.2 + i * 0.1)} />
            ))}
          </g>
          <circle cx={640} cy={460} r={205} fill="none" stroke={ink} strokeWidth={10} />
          <Note x={1400} y={380} text="tapered hairs" o={vis(t, c[5] + 0.8)} size={44} fill={ink} />
          <Note x={1400} y={500} text="with tiny grooves" o={vis(t, c[5] + 1.6)} size={44} fill={teal} />
          <Foot t={t} c={c} k={5} text="Science news report (2015)" />
        </G>
        <G o={k(6)}>
          <polygon points="500,490 500,620 1400,316 1400,284" fill={SAND} stroke={ink} strokeWidth={5} />
          {[0, 1, 2, 3].map((i) => {
            const u = (t * 0.22 + i / 4) % 1;
            const p = hair(u);
            return <circle key={i} cx={p.x} cy={p.y - 44 + u * 36} r={14 + 16 * (1 - u)} fill={teal} fillOpacity={0.5 * (1 - u * u * u)} stroke={teal} strokeWidth={3} opacity={1 - u * u * u} />;
          })}
          <Note x={960} y={660} text="no outside force needed" o={vis(t, c[6] + 1.4)} size={40} fill={ink} />
          <Foot t={t} c={c} k={6} text="Science news report (2015)" />
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["WATER-REPELLING LEGS"], ["WEIGHT SPREAD OUT"], ["MICROHAIRS"], ["TRAPPED AIR"], ["HARD TO PULL OUT"], ["A 2015 STUDY"], ["DROPLETS PUSHED OFF"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ rowing (16-21) */
const SceneRowing: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const mx = lerp(560, 1360, ramp(t, c[0] + 1.2, c[0] + 4.5));
  const rx = lerp(520, 1500, ramp(t, c[5] + 0.8, c[5] + 6.0));
  const wave = (x: number) => (x > 700 ? 16 * Math.sin(x * 0.05 - t * 4) * Math.exp(-(x - 700) / 320) : 0);
  const robotDents: Dent[] = [
    [rx - 90, 12, 22],
    [rx + 90, 12, 22],
  ];
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Water d={surf(560, ds(mx, 1.8, 16), t)} />
          <Strider x={mx} y={sy(560, 1.8, 16)} s={1.8} />
          <Arrow x1={mx + 340} y1={380} x2={mx + 520} y2={380} color={orange} w={10} o={vis(t, c[0] + 1.2)} />
        </G>
        <G o={k(1)}>
          <TopStrider x={960} y={440} s={1.7} hl={ramp(t, c[1] + 1.4, c[1] + 2.2)} />
          <Txt x={690} y={185} size={44} weight={800} fill={orange}>
            PROPULSION
          </Txt>
          <Txt x={560} y={640} size={44} weight={800} fill={teal}>
            STEER
          </Txt>
          <Note x={690} y={242} text="middle legs: longest" o={vis(t, c[1] + 1.8)} size={38} fill={ink} />
          <Note x={1420} y={440} text="front legs" o={vis(t, c[1] + 0.6)} size={38} fill={ink} />
          {[335, 545].map((y) => (
            <line key={y} x1={1245} y1={y} x2={1330} y2={y === 335 ? 420 : 460} stroke={GREY} strokeWidth={3} strokeLinecap="round" opacity={vis(t, c[1] + 0.6)} />
          ))}
          <Foot t={t} c={c} k={1} text="Wikipedia" />
        </G>
        <G o={k(2)}>
          <Plaque x={960} y={190} text="MENISCUS" w={520} o={vis(t, c[2] + 0.4)} />
          <path d={surf(520, [[900, 90, 100]], t)} fill="none" stroke={teal} strokeWidth={7} />
          <path d={`${surf(520, [[900, 90, 100]], t)} V745 H0 Z`} fill={teal} fillOpacity={0.15} />
          <path d="M620 300 L900 598" fill="none" stroke={ink} strokeWidth={12} strokeLinecap="round" />
          <G o={vis(t, c[2] + 1.8)}>
            <line x1={1120} y1={330} x2={960} y2={560} stroke={WARM} strokeWidth={14} strokeLinecap="round" />
            <ellipse cx={955} cy={566} rx={16} ry={50} transform="rotate(35 955 566)" fill={orange} fillOpacity={0.7} stroke={ink} strokeWidth={4} />
          </G>
          <Note x={1400} y={470} text="the dip acts like an oar" o={vis(t, c[2] + 1.8)} size={40} fill={orange} />
          <Foot t={t} c={c} k={2} text="Discover magazine" />
        </G>
        <G o={k(3)}>
          <Plaque x={960} y={190} text="VORTICES" w={520} o={vis(t, c[3] + 0.4)} />
          <path d={surf(420, [[1000, 80, 90]], t)} fill="none" stroke={teal} strokeWidth={7} />
          <path d={`${surf(420, [[1000, 80, 90]], t)} V745 H0 Z`} fill={teal} fillOpacity={0.15} />
          <path d="M800 300 L1000 496" fill="none" stroke={ink} strokeWidth={12} strokeLinecap="round" />
          <Vortex x={760} y={580} dir={1} t={t} o={vis(t, c[3] + 1.2)} />
          <Vortex x={620} y={500} r={46} dir={-1} t={t} o={vis(t, c[3] + 1.6)} />
          <Arrow x1={840} y1={640} x2={1160} y2={640} color={orange} w={10} o={vis(t, c[3] + 2.2)} />
          <Note x={1500} y={640} text="the push" o={vis(t, c[3] + 2.2)} size={44} fill={orange} />
          <Foot t={t} c={c} k={3} text="MIT News (2003)" />
        </G>
        <G o={k(4)}>
          <G o={1 - ramp(t, c[4] + 3.4, c[4] + 3.8)}>
            <path d={surf(470, [[700, 70, 70]], t, 3, wave)} fill="none" stroke={teal} strokeWidth={7} />
            <path d={`${surf(470, [[700, 70, 70]], t, 3, wave)} V745 H0 Z`} fill={teal} fillOpacity={0.15} />
            <path d="M520 230 L700 536" fill="none" stroke={ink} strokeWidth={12} strokeLinecap="round" />
            <Note x={1200} y={590} text="the little waves" o={vis(t, c[4] + 0.8)} size={40} fill={ink} />
            <Stamp x={1340} y={300} text="SMALL ROLE" o={vis(t, c[4] + 1.8)} size={52} color={orange} rot={-3} />
            <Foot t={t} c={c} k={4} text="MIT News" />
          </G>
          <G o={ramp(t, c[4] + 3.8, c[4] + 4.3)}>
            <defs>
              <clipPath id="pond20">
                <rect x={120} y={170} width={1680} height={440} rx={30} />
              </clipPath>
            </defs>
            <rect x={120} y={170} width={1680} height={440} rx={30} fill={teal} fillOpacity={0.1} stroke={teal} strokeWidth={4} />
            <g clipPath="url(#pond20)">
              {[0, 1, 2].map((i) => {
                const u = (t * 0.35 + i / 3) % 1;
                return <circle key={i} cx={900} cy={390} r={40 + u * 480} fill="none" stroke={i === 0 ? orange : teal} strokeWidth={i === 0 ? 10 : 4} opacity={i === 0 ? Math.min(1, u * 6) * (1 - u * 0.4) : 0.7 * (1 - u)} />;
              })}
            </g>
            <TopStrider x={1050} y={390} s={0.9} />
            <Arrow x1={1250} y1={390} x2={1450} y2={390} color={orange} w={8} o={vis(t, c[4] + 7.0)} />
            <Note x={1000} y={660} text="a circular surface wave: its crest gives thrust" o={vis(t, c[4] + 6.0)} size={40} fill={orange} />
            <Foot t={t} c={c} k={4} text="Wikipedia" />
          </G>
        </G>
        <G o={k(5)}>
          <path d={surf(560, robotDents, t)} fill="none" stroke={teal} strokeWidth={7} />
          <path d={`${surf(560, robotDents, t)} V745 H0 Z`} fill={teal} fillOpacity={0.15} />
          {[1, 2, 3].map((i) => (
            <Vortex key={i} x={rx - 120 - i * 130} y={600} r={34} dir={i % 2 ? 1 : -1} t={t} o={vis(t, c[5] + 1.5) * Math.max(0, 1 - i * 0.22)} />
          ))}
          <G x={rx} y={365} s={1.6}>
            <rect x={-70} y={-30} width={140} height={60} rx={14} fill={SOFT} stroke={ink} strokeWidth={6} />
            <circle cx={0} cy={0} r={9} fill={orange} />
            <path d="M-50 30 L-90 122" stroke={ink} strokeWidth={6} fill="none" strokeLinecap="round" />
            <path d="M50 30 L90 122" stroke={ink} strokeWidth={6} fill="none" strokeLinecap="round" />
          </G>
          <Note x={rx} y={270} text="a small robot" o={vis(t, c[5] + 0.8)} size={40} fill={teal} />
          <Foot t={t} c={c} k={5} text="MIT News (2003)" />
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["MOVING"], ["PROPULSION AND STEERING"], ["THE MENISCUS"], ["VORTICES"], ["WAVES, SMALL ROLE"], ["A SMALL ROBOT"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ life (22-23) */
const SceneLife: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const u = t % 1;
  const sx = lerp(360, 1560, u);
  const rip = (i: number) => (t * 0.4 + i / 3) % 1;
  const px = 1300 + 6 * Math.sin(t * 9);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Stamp x={900} y={210} text="OFTEN 1 M/S OR FASTER" o={vis(t, c[0] + 0.6)} size={52} pad={80} color={teal} rot={-2} />
          <Water d={surf(540, ds(sx, 1, 10), t)} />
          <Strider x={sx} y={sy(540, 1, 10)} s={1} />
          <line x1={360} y1={640} x2={1560} y2={640} stroke={ink} strokeWidth={6} />
          {Array.from({ length: 11 }, (_, i) => (
            <line key={i} x1={360 + i * 120} y1={626} x2={360 + i * 120} y2={654} stroke={ink} strokeWidth={4} />
          ))}
          <Txt x={360} y={690} size={36} weight={700}>
            0
          </Txt>
          <Txt x={1560} y={690} size={36} weight={700}>
            1 m
          </Txt>
          <G x={1720} y={260}>
            <circle r={64} fill="#fff" stroke={ink} strokeWidth={6} />
            <line x1={0} y1={0} x2={0} y2={-50} stroke={orange} strokeWidth={7} strokeLinecap="round" transform={`rotate(${t * 360})`} />
            <circle r={6} fill={ink} />
          </G>
          <Note x={1720} y={366} text="1 s" o={1} size={40} fill={orange} />
          <Foot t={t} c={c} k={0} text="Wikipedia" />
        </G>
        <G o={k(1)}>
          <defs>
            <clipPath id="pond23">
              <rect x={120} y={170} width={1680} height={440} rx={30} />
            </clipPath>
          </defs>
          <rect x={120} y={170} width={1680} height={440} rx={30} fill={teal} fillOpacity={0.1} stroke={teal} strokeWidth={4} />
          <g clipPath="url(#pond23)">
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={1300} cy={390} r={30 + rip(i) * 520} fill="none" stroke={teal} strokeWidth={4} opacity={1 - rip(i)} />
            ))}
          </g>
          <TopStrider x={600} y={390} s={1.2} />
          <G x={px} y={390}>
            <circle r={10} fill={RED} />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={i} x1={0} y1={0} x2={22 * Math.cos(i * 1.05 + t * 9)} y2={22 * Math.sin(i * 1.05 + t * 9)} stroke={RED} strokeWidth={3} strokeLinecap="round" />
            ))}
          </G>
          <Note x={1300} y={660} text="struggling prey" o={vis(t, c[1] + 0.8)} size={40} fill={RED} />
          <Note x={600} y={660} text="front legs feel the ripples" o={vis(t, c[1] + 1.8)} size={38} fill={teal} />
          <Foot t={t} c={c} k={1} text="Wikipedia" />
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["SPEED"], ["FEELING RIPPLES"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ limits (24-25) */
const Badge: React.FC<{ x: number; label: string; o: number; children: React.ReactNode }> = ({ x, label, o, children }) => (
  <G x={x} y={330} o={o}>
    <circle r={80} fill="#fff" stroke={ink} strokeWidth={6} />
    {children}
    <Txt x={0} y={130} size={36} weight={700} fill={teal}>
      {label}
    </Txt>
  </G>
);

const SceneLimits: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Stamp x={960} y={190} text="OUR READING: AN INFERENCE" o={vis(t, c[0] + 0.4)} size={44} pad={80} color={teal} rot={-2} />
          <Badge x={420} label="surface tension" o={vis(t, c[0] + 1.6)}>
            <path d="M-50 10 Q-25 -20 0 10 T50 10" fill="none" stroke={teal} strokeWidth={9} strokeLinecap="round" />
          </Badge>
          <Badge x={780} label="light bodies" o={vis(t, c[0] + 2.6)}>
            <path d="M-34 36 Q-30 -30 30 -40 Q34 14 -34 36Z" fill={SOFT} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
            <line x1={-34} y1={36} x2={8} y2={-8} stroke={ink} strokeWidth={4} />
          </Badge>
          <Badge x={1140} label="dry legs" o={vis(t, c[0] + 3.6)}>
            <path d="M0 -40 C16 -14 22 -2 22 8 A22 22 0 0 1 -22 8 C-22 -2 -16 -14 0 -40Z" fill={teal} fillOpacity={0.4} stroke={teal} strokeWidth={5} />
            <line x1={-44} y1={44} x2={44} y2={-6} stroke={ink} strokeWidth={5} strokeLinecap="round" />
          </Badge>
          <Badge x={1500} label="clever rowing" o={vis(t, c[0] + 4.6)}>
            <line x1={-40} y1={-34} x2={26} y2={30} stroke={WARM} strokeWidth={10} strokeLinecap="round" />
            <ellipse cx={28} cy={34} rx={10} ry={30} transform="rotate(-45 28 34)" fill={orange} fillOpacity={0.7} stroke={ink} strokeWidth={4} />
          </Badge>
          <Water d={surf(680, ds(960, 1.1, 12), t)} />
          <Strider x={960} y={sy(680, 1.1, 12)} s={1.1} />
        </G>
        <G o={k(1)}>
          <Note x={960} y={290} text="20 CM" o={vis(t, c[1] + 2.4)} size={48} fill={orange} />
          <line x1={735} y1={340} x2={1185} y2={340} stroke={ink} strokeWidth={6} />
          {[735, 1185].map((x) => (
            <line key={x} x1={x} y1={324} x2={x} y2={356} stroke={ink} strokeWidth={6} />
          ))}
          <Plaque x={960} y={190} text="LARGEST THAT CAN STILL WALK ON WATER" w={1400} o={vis(t, c[1] + 0.6)} />
          <Water d={surf(640, ds(960, 1.5, 22), t)} />
          <Strider x={960} y={sy(640, 1.5, 22)} s={1.5} />
          <Foot t={t} c={c} k={1} text="MIT News" />
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["OUR READING", true], ["A SIZE LIMIT"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ close (26-28) */
const SceneClose: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const pulse = 1 + 0.12 * Math.sin(t * 3);
  const ft = c[1] + 3.5;
  const flash = ramp(t, ft - 0.05, ft) * (1 - ramp(t, ft, ft + 0.7)) + 0.5 * ramp(t, ft + 0.25, ft + 0.3) * (1 - ramp(t, ft + 0.3, ft + 0.7));
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Water d={surf(580, ds(960, 1.9, 20), t)} />
          <Strider x={960} y={sy(580, 1.9, 20)} s={1.9} />
          <ellipse cx={960 + 150 * 1.9} cy={580 + 20} rx={64 * pulse} ry={24 * pulse} fill="none" stroke={orange} strokeWidth={5} strokeDasharray="14 10" />
          <Note x={960} y={700} text="tiny dimples under each foot" o={vis(t, c[0] + 1.6)} size={44} fill={orange} />
        </G>
        <G o={k(1, 2)}>
          <G x={lerp(960, 560, ramp(t, c[2] + 0.2, c[2] + 1.0))} y={400}>
            <defs>
              <clipPath id="pane">
                <rect x={-380} y={-260} width={760} height={520} />
              </clipPath>
            </defs>
            <g clipPath="url(#pane)">
              <rect x={-380} y={-260} width={760} height={330} fill="#CBD3DD" />
              {[[-250, -150, 1], [-20, -190, 1.3], [210, -130, 1.1], [330, -210, 0.9]].map(([cx, cy, cs], i) => (
                <G key={i} x={cx + 260 * (1 - ramp(t, c[1] + 0.2, c[1] + 3.4))} y={cy} s={cs}>
                  <ellipse rx={150} ry={46} fill="#9AA6B5" />
                  <ellipse cx={-60} cy={-26} rx={80} ry={40} fill="#9AA6B5" />
                  <ellipse cx={50} cy={-34} rx={90} ry={44} fill="#8D99AA" />
                </G>
              ))}
              <path d="M-380 70 Q-250 20 -140 60 T120 56 T380 40 V90 H-380Z" fill="#A9B8B4" />
              <path d={`M-380 ${70 + 4 * Math.sin(t * 1.4)} ${Array.from({ length: 20 }, (_, n) => `L${-380 + n * 40} ${70 + 4 * Math.sin(n * 0.9 + t * 1.4)}`).join(" ")} V260 H-380 Z`} fill={teal} fillOpacity={0.3} stroke={teal} strokeWidth={4} />
              <rect x={-380} y={-260} width={760} height={520} fill="#FFF3C0" opacity={flash * 0.75} />
              <path d="M-110 -130 L-150 -20 L-100 -20 L-160 120" fill="none" stroke={GOLD} strokeWidth={24} strokeLinejoin="round" strokeLinecap="round" opacity={flash} />
              <path d="M-110 -130 L-150 -20 L-100 -20 L-160 120" fill="none" stroke="#fff" strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" opacity={flash} />
              {[-60, 40, 150, 250].map((x, i) => (
                <line key={x} x1={x - 160} y1={90 + i * 40} x2={x - 100} y2={90 + i * 40} stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={flash} />
              ))}
              {[0, 1, 2].map((i) => {
                const u = ramp(t, c[2] + 0.9 + i * 0.35, c[2] + 5);
                return <circle key={i} cx={-130} cy={-40} r={40 + u * 520} fill="none" stroke={ink} strokeWidth={6} strokeDasharray="14 12" opacity={vis(t, c[2] + 0.9 + i * 0.35) * (1 - u)} />;
              })}
            </g>
            <rect x={-380} y={-260} width={760} height={520} fill="none" stroke={ink} strokeWidth={16} />
            <line x1={0} y1={-260} x2={0} y2={260} stroke={ink} strokeWidth={10} />
            <line x1={-380} y1={-20} x2={380} y2={-20} stroke={ink} strokeWidth={10} />
            <rect x={-420} y={262} width={840} height={26} rx={6} fill={SAND} stroke={ink} strokeWidth={6} />
            <Note x={0} y={330} text="a pond, seen from a window" o={1} size={36} fill={teal} />
          </G>
        </G>
        <G o={k(2)}>
          <G o={vis(t, c[2] + 1.1)}>
            <rect x={440} y={540} width={240} height={70} rx={35} fill="#fff" stroke={ink} strokeWidth={5} />
            <Txt x={560} y={575} size={46} weight={700}>
              thunder
            </Txt>
          </G>
          <G o={vis(t, c[2] + 1.8)}>
            <Txt x={1400} y={300} size={230} serif fill={orange}>
              WHY?
            </Txt>
          </G>
          <Note x={1400} y={470} text="Why does the sound come late?" o={vis(t, c[2] + 1.8)} size={44} fill={ink} />
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["A POND, CLOSE UP"], ["A STORM ROLLS IN"], ["WHY?", true]]} />
    </>
  );
};

export const SCENES020: Record<string, React.FC<SceneProps>> = {
  hook: SceneHook,
  tension: SceneTension,
  legs: SceneLegs,
  rowing: SceneRowing,
  life: SceneLife,
  limits: SceneLimits,
  close: SceneClose,
};
