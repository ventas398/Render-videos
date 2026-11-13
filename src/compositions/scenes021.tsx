import React from "react";
import { vis } from "../components/ui";
import { lerp, ramp } from "../utils/anim";
import type { SceneProps } from "./scenes";
import { Chips, Note } from "./scenes011";
import { Arrow, G, GOLD, GREY, ink, orange, Person, Plaque, SAND, seg, SimpleNote, SOFT, Stamp, SvgFrame, teal, Txt, useT, WARM } from "./kit";

/* ------------------------------------------------------------------ piezas genericas (sin marcas) */
type Pt = [number, number];
const SKIN = "#F1D5B0";
const zig = (p: Pt[]) => p.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
const clamp = (v: number) => Math.max(0, Math.min(1, v));
/** Destello: pico rapido y un segundo pico mas debil. */
const flash = (t: number, ft: number) => ramp(t, ft - 0.05, ft) * (1 - ramp(t, ft, ft + 0.7)) + 0.5 * ramp(t, ft + 0.25, ft + 0.3) * (1 - ramp(t, ft + 0.3, ft + 0.7));

const Foot: React.FC<{ t: number; c: number[]; k: number; text: string }> = ({ t, c, k, text }) => (
  <Note x={960} y={735} text={text} o={vis(t, c[k] + 0.6, c[k + 1] === undefined ? 1e6 : c[k + 1] - 0.4)} size={36} fill={teal} />
);

const Cloud: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <ellipse rx={150} ry={46} fill="#9AA6B5" />
    <ellipse cx={-60} cy={-26} rx={80} ry={40} fill="#9AA6B5" />
    <ellipse cx={50} cy={-34} rx={90} ry={44} fill="#8D99AA" />
  </G>
);

const Bolt: React.FC<{ d: string; o?: number; w?: number; c?: string }> = ({ d, o = 1, w = 14, c = orange }) =>
  o > 0 ? (
    <g opacity={o} fill="none" strokeLinejoin="round" strokeLinecap="round">
      <path d={d} stroke={c} strokeWidth={w} />
      <path d={d} stroke="#fff" strokeWidth={w / 3} />
    </g>
  ) : null;

/** Ventana 760x520 con tormenta sobre el estanque (vectorial). fl = destello 0..1; arc = inicio de las ondas de sonido. */
const Win: React.FC<{ x: number; y?: number; t: number; fl: number; arc?: number; id: string }> = ({ x, y = 400, t, fl, arc, id }) => {
  const bolt = "M-110 -130 L-150 -20 L-100 -20 L-160 120";
  return (
    <G x={x} y={y}>
      <defs>
        <clipPath id={id}>
          <rect x={-380} y={-260} width={760} height={520} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect x={-380} y={-260} width={760} height={330} fill="#CBD3DD" />
        {[[-250, -150, 1], [-20, -190, 1.3], [210, -130, 1.1], [330, -210, 0.9]].map(([cx, cy, cs]) => (
          <Cloud key={cx} x={cx} y={cy} s={cs} />
        ))}
        <path d="M-380 70 Q-250 20 -140 60 T120 56 T380 40 V90 H-380Z" fill="#A9B8B4" />
        <path d={`M-380 ${70 + 4 * Math.sin(t * 1.4)} ${Array.from({ length: 20 }, (_, n) => `L${-380 + n * 40} ${70 + 4 * Math.sin(n * 0.9 + t * 1.4)}`).join(" ")} V260 H-380 Z`} fill={teal} fillOpacity={0.3} stroke={teal} strokeWidth={4} />
        <rect x={-380} y={-260} width={760} height={520} fill="#FFF3C0" opacity={fl * 0.75} />
        <Bolt d={bolt} o={fl} w={24} c={GOLD} />
        {arc !== undefined &&
          [0, 1, 2].map((i) => {
            const u = ramp(t, arc + i * 0.35, arc + i * 0.35 + 3.2);
            return <circle key={i} cx={-130} cy={-40} r={40 + u * 520} fill="none" stroke={ink} strokeWidth={6} strokeDasharray="14 12" opacity={vis(t, arc + i * 0.35) * (1 - u)} />;
          })}
      </g>
      <rect x={-380} y={-260} width={760} height={520} fill="none" stroke={ink} strokeWidth={16} />
      <line x1={0} y1={-260} x2={0} y2={260} stroke={ink} strokeWidth={10} />
      <line x1={-380} y1={-20} x2={380} y2={-20} stroke={ink} strokeWidth={10} />
      <rect x={-420} y={262} width={840} height={26} rx={6} fill={SAND} stroke={ink} strokeWidth={6} />
    </G>
  );
};

/** Reloj: u = vuelta de la aguja (0..1), wedge = fraccion rellena en naranja. */
const Clock: React.FC<{ x: number; y: number; r: number; u: number; wedge?: number; o?: number }> = ({ x, y, r, u, wedge = 0, o = 1 }) => {
  const a = wedge * Math.PI * 2;
  return (
    <G x={x} y={y} o={o}>
      <circle r={r} fill="#fff" stroke={ink} strokeWidth={8} />
      {wedge > 0.01 && <path d={`M0 0 L0 ${-r + 6} A${r - 6} ${r - 6} 0 ${a > Math.PI ? 1 : 0} 1 ${(r - 6) * Math.sin(a)} ${-(r - 6) * Math.cos(a)} Z`} fill={orange} fillOpacity={0.3} />}
      {[0, 90, 180, 270].map((d) => (
        <line key={d} x1={0} y1={-r + 6} x2={0} y2={-r + 22} stroke={ink} strokeWidth={6} transform={`rotate(${d})`} />
      ))}
      <line x1={0} y1={0} x2={0} y2={-r + 20} stroke={orange} strokeWidth={8} strokeLinecap="round" transform={`rotate(${u * 360})`} />
      <circle r={9} fill={ink} />
    </G>
  );
};

/** Cinta metrica horizontal; prog = cuanto se ha desenrollado, lit = marcas encendidas (de 16). */
const Tape: React.FC<{ x1: number; x2: number; y: number; prog: number; lit: number; o?: number }> = ({ x1, x2, y, prog, lit, o = 1 }) => {
  const w = (x2 - x1) * prog;
  return (
    <G o={o}>
      <rect x={x1} y={y - 28} width={w} height={56} rx={6} fill={WARM} stroke={ink} strokeWidth={5} />
      {Array.from({ length: 17 }, (_, i) => {
        const tx = x1 + (i * (x2 - x1)) / 16;
        return tx <= x1 + w ? <line key={i} x1={tx} y1={y - 28} x2={tx} y2={y - (i % 4 ? 8 : 0)} stroke={i < lit ? orange : ink} strokeWidth={i < lit ? 8 : 4} /> : null;
      })}
    </G>
  );
};

/** Ventanita del observador (izquierda) y tormenta lejana con rayo (derecha), para las cintas. */
const Ends: React.FC<{ y: number; o?: number }> = ({ y, o = 1 }) => (
  <G o={o}>
    <G x={230} y={y}>
      <rect x={-70} y={-85} width={140} height={170} fill={SOFT} stroke={ink} strokeWidth={8} />
      <line x1={0} y1={-85} x2={0} y2={85} stroke={ink} strokeWidth={6} />
      <line x1={-70} y1={0} x2={70} y2={0} stroke={ink} strokeWidth={6} />
    </G>
    <Cloud x={1600} y={y - 60} s={0.9} />
    <Bolt d={zig([[1590, y - 20], [1560, y + 40], [1600, y + 40], [1560, y + 100]])} w={12} />
  </G>
);

/** Puntos de una descarga a distintas distancias del observador; un punto de sonido sale de cada uno a la misma velocidad. */
const Arrive: React.FC<{ pts: Pt[]; ox: number; oy: number; t: number; t0: number; v?: number }> = ({ pts, ox, oy, t, t0, v = 450 }) => (
  <>
    {pts.map(([x, y], i) => {
      const len = Math.hypot(x - ox, y - oy);
      const f = clamp(((t - t0) * v) / len);
      return (
        <g key={i}>
          <line x1={x} y1={y} x2={ox} y2={oy} stroke={GREY} strokeWidth={4} strokeDasharray="12 10" />
          <circle cx={x} cy={y} r={11} fill={orange} />
          {f > 0 && f < 1 && <circle cx={lerp(x, ox, f)} cy={lerp(y, oy, f)} r={14} fill={teal} stroke="#fff" strokeWidth={3} />}
        </g>
      );
    })}
  </>
);

/** Envolvente de sonido: n=1 estruendo largo. */
const env = (u: number) => 115 * Math.exp(-u / 650) * (0.55 + 0.45 * Math.sin(u * 0.035 + 1));
const rumble = (x0: number, len: number, y: number, p: number) =>
  `M${x0} ${y} ` +
  Array.from({ length: Math.floor((len * p) / 5) + 1 }, (_, i) => `L${x0 + i * 5} ${y + env(i * 5) * Math.sin(i * 5 * 0.55) * Math.cos(i * 5 * 0.17)}`).join(" ");

/* ------------------------------------------------------------------ hook (0-2) */
const SceneHook: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const n = t > c[0] + 3.32 ? "10" : t > c[0] + 2.9 ? "5" : "1";
  return (
    <>
      <SvgFrame>
        <G o={k(0, 2)}>
          <Win x={lerp(960, 560, ramp(t, c[2] + 0.2, c[2] + 1.0))} t={t} fl={flash(t, c[0] + 0.7)} arc={c[1] + 1.2} id="w21a" />
        </G>
        <G o={vis(t, c[0] + 2.1, c[1] + 1.0) * k(0, 1)}>
          <circle cx={1560} cy={400} r={130} fill="#fff" stroke={orange} strokeWidth={8} />
          <Txt x={1560} y={404} size={140} serif fill={orange}>
            {n}
          </Txt>
        </G>
        <G o={vis(t, c[1] + 1.3, c[2] - 0.4) * k(1, 1)}>
          <rect x={1380} y={365} width={360} height={70} rx={35} fill="#fff" stroke={ink} strokeWidth={5} />
          <Txt x={1560} y={400} size={44} weight={700}>
            THUNDER
          </Txt>
        </G>
        <G o={vis(t, c[2] + 1.0)}>
          <Txt x={1400} y={300} size={230} serif fill={orange}>
            WHY?
          </Txt>
          <Note x={1400} y={470} text="Why is the sound late?" o={1} size={44} fill={ink} />
        </G>
      </SvgFrame>
      <Chips t={t} c={c} list={[["THAT FLASH, AGAIN"], ["THEN THE SOUND"], ["WHY?", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ cause (3-5) */
const SceneCause: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const bx = 750;
  const ft = c[0] + 4.3;
  const boltO = ramp(t, ft - 0.05, ft) * (0.4 + 0.6 * (1 - ramp(t, ft, ft + 0.8)));
  const push = ramp(t, c[1] + 2.3, c[1] + 3.6);
  const hot = ramp(t, c[1] + 0.7, c[1] + 1.6);
  const bolt = zig([[bx, 160], [bx - 35, 270], [bx + 25, 320], [bx - 30, 440], [bx + 30, 490], [bx - 15, 640]]);
  return (
    <>
      <SvgFrame>
        <G o={k(0, 2)}>
          <defs>
            <clipPath id="p21c">
              <rect x={250} y={140} width={1000} height={550} rx={14} />
            </clipPath>
          </defs>
          <rect x={250} y={140} width={1000} height={550} rx={14} fill={SOFT} fillOpacity={0.45} stroke={ink} strokeWidth={5} />
          <g clipPath="url(#p21c)">
            <rect x={bx - 38} y={140} width={76} height={550} fill={orange} opacity={0.3 * hot} />
            {Array.from({ length: 11 * 7 }, (_, n) => {
              const i = n % 11;
              const j = Math.floor(n / 11);
              const d = (i - 5) * 85;
              if (!d) return null;
              const x = bx + d + Math.sign(d) * 95 * push * Math.exp(-Math.abs(d) / 230);
              return <circle key={n} cx={x} cy={190 + j * 70} r={9} fill={teal} opacity={0.7} />;
            })}
            {[0, 1, 2].map((i) => {
              const u = ramp(t, c[2] + 2.2 + i * 0.5, c[2] + 4.4 + i * 0.5);
              return <rect key={i} x={bx - 40 - u * 440} y={160 - u * 20} width={80 + u * 880} height={500 + u * 40} rx={40 + u * 440} fill="none" stroke={ink} strokeWidth={6} strokeDasharray="16 12" opacity={vis(t, c[2] + 2.2 + i * 0.5) * (1 - u)} />;
            })}
          </g>
          <Bolt d={bolt} o={boltO} />
        </G>
        <G o={k(0)}>
          <Note x={1560} y={400} text="a bolt crosses the air" o={1} size={42} fill={teal} />
        </G>
        <G o={k(1)}>
          <Note x={1560} y={370} text="the air heats fast" o={1} size={42} fill={orange} />
          <Note x={1560} y={430} text="and expands" o={vis(t, c[1] + 2.3)} size={42} fill={orange} />
          <Arrow x1={bx + 50} y1={400} x2={bx + 190} y2={400} color={orange} w={7} o={push} />
          <Arrow x1={bx - 50} y1={400} x2={bx - 190} y2={400} color={orange} w={7} o={push} />
        </G>
        <G o={k(2)}>
          <Plaque x={1560} y={400} text="SHOCKWAVE" w={420} o={vis(t, c[2] + 2.5)} />
        </G>
        <Foot t={t} c={c} k={0} text="National Weather Service" />
        <Foot t={t} c={c} k={1} text="National Weather Service" />
        <Foot t={t} c={c} k={2} text="Environment Canada" />
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["WHERE THUNDER COMES FROM"], ["THE AIR EXPANDS"], ["A SHOCKWAVE"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ race (6-9) */
const SceneRace: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const go = ramp(t, c[0] + 6.0, c[0] + 7.1);
  const slow = ramp(t, c[0] + 6.0, c[0] + 8.2);
  const lx = lerp(300, 1900, go);
  const u9 = clamp((t - (c[3] + 0.6)) / 5);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Plaque x={960} y={185} text="ROUGHLY THE SAME TIME" w={860} o={vis(t, c[0] + 3.9)} />
          <line x1={250} y1={300} x2={250} y2={640} stroke={ink} strokeWidth={5} strokeDasharray="14 10" />
          {[400, 590].map((y) => (
            <line key={y} x1={250} y1={y + 8} x2={1700} y2={y + 8} stroke={ink} strokeWidth={3} opacity={0.3} />
          ))}
          <Txt x={130} y={350} size={36}>
            LIGHT
          </Txt>
          <Txt x={130} y={540} size={36}>
            SOUND
          </Txt>
          {go > 0.02 && go < 0.98 && [0, 1, 2].map((i) => (lx - 130 - i * 60 > 290 ? <line key={i} x1={lx - 70 - i * 60} y1={340 + i * 22} x2={lx - 130 - i * 60} y2={340 + i * 22} stroke={orange} strokeWidth={8} strokeLinecap="round" /> : null))}
          <Person x={lx} y={400} s={0.75} body={orange} />
          <Person x={300 + 160 * slow} y={590} s={0.75} body={teal} />
        </G>
        <G o={k(1)}>
          <rect x={300} y={200} width={1200} height={440} fill="none" stroke={ink} strokeWidth={5} />
          <Txt x={170} y={310} size={36}>
            LIGHT
          </Txt>
          <Txt x={170} y={520} size={36}>
            SOUND
          </Txt>
          <rect x={300} y={270} width={1440 * ramp(t, c[1] + 2.0, c[1] + 2.9)} height={80} fill={orange} />
          <G o={vis(t, c[1] + 2.4)}>
            <Txt x={900} y={312} size={56} fill="#fff">
              300,000 KM/S
            </Txt>
          </G>
          <rect x={300} y={480} width={8} height={80} fill={teal} opacity={vis(t, c[1] + 4.9)} />
          <G o={vis(t, c[1] + 5.4)}>
            <Txt x={520} y={522} size={52} fill={teal}>
              0.3 KM/S
            </Txt>
          </G>
        </G>
        <G o={k(2)}>
          <Stamp x={960} y={230} text="OUR ARITHMETIC" o={vis(t, c[2] + 0.1)} size={52} />
          <G o={vis(t, c[2] + 1.2)}>
            <Txt x={960} y={430} size={92}>
              300,000 ÷ 0.3 ≈ 1,000,000x
            </Txt>
          </G>
          <Note x={960} y={560} text="light is about a million times faster" o={vis(t, c[2] + 1.9)} size={48} fill={ink} />
        </G>
        <G o={k(3)}>
          <Clock x={960} y={250} r={85} u={u9} wedge={u9} />
          <rect x={260} y={485} width={1400} height={30} rx={8} fill={SAND} stroke={ink} strokeWidth={5} />
          <Bolt d={zig([[260, 400], [240, 440], [270, 440], [250, 475]])} w={10} />
          <Person x={1660} y={455} s={0.6} />
          <circle cx={lerp(260, 1660, u9)} cy={500} r={20} fill={teal} stroke="#fff" strokeWidth={4} />
          <Note x={960} y={555} text="one mile" o={1} size={40} fill={teal} />
          <G o={vis(t, c[3] + 3.6)}>
            <rect x={540} y={595} width={840} height={80} rx={40} fill="#fff" stroke={orange} strokeWidth={6} />
            <Txt x={960} y={636} size={52} fill={orange}>
              ~5 SECONDS PER MILE
            </Txt>
          </G>
        </G>
        <Foot t={t} c={c} k={0} text="UCAR Center for Science Education" />
        <Foot t={t} c={c} k={1} text="Environment Canada" />
        <Foot t={t} c={c} k={3} text="National Weather Service" />
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["A RACE"], ["TWO SPEEDS"], ["ONE MILLION TIMES"], ["THUNDER'S PACE"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ count (10-14) */
const Card: React.FC<{ y: number; text: string; color: string; o: number }> = ({ y, text, color, o }) => (
  <G o={o}>
    <rect x={380} y={y - 85} width={1160} height={170} rx={24} fill="#fff" stroke={color} strokeWidth={8} />
    <Txt x={960} y={y + 3} size={80}>
      {text}
    </Txt>
  </G>
);

const SceneCount: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const x0 = 340;
  const x1 = 1470;
  const hot = ramp(t, c[4] + 2.6, c[4] + 3.6);
  const ray = (cx: number, hotter: boolean, o: number) => [0, 1, 2].map((i) => {
    const ph = (((t - c[4]) / 1.6 + i / 3) % 1 + 1) % 1;
    return <circle key={i} cx={cx} cy={395} r={Math.max(1, ph * (hotter ? 250 : 125))} fill="none" stroke={hotter ? orange : teal} strokeWidth={6} strokeDasharray="12 10" opacity={(1 - ph) * o} />;
  });
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Stamp x={520} y={215} text="OUR COMPARISON" o={vis(t, c[0] + 0.1)} size={44} rot={-6} />
          <Ends y={470} />
          <Tape x1={x0} x2={x1} y={470} prog={ramp(t, c[0] + 1.8, c[0] + 3.0)} lit={Math.max(0, Math.floor((t - (c[0] + 2.9)) / 0.28))} />
          <Note x={900} y={580} text="count the seconds" o={vis(t, c[0] + 2.8)} size={44} fill={teal} />
        </G>
        <G o={k(1, 2)}>
          <Card y={330} text="SECONDS ÷ 5 = MILES" color={teal} o={1} />
        </G>
        <G o={k(2)}>
          <Card y={540} text="SECONDS ÷ 3 = KM" color={orange} o={vis(t, c[2] + 0.1)} />
        </G>
        <G o={k(3)}>
          <Stamp x={480} y={215} text="OUR ARITHMETIC" o={vis(t, c[3] + 0.1)} size={44} rot={-6} />
          <G o={vis(t, c[3] + 0.7)}>
            <Txt x={960} y={380} size={100}>
              10 s ≈ 2 mi ≈ 3 km
            </Txt>
          </G>
          <Ends y={570} />
          <Tape x1={x0} x2={x1} y={570} prog={1} lit={Math.min(10, Math.max(0, Math.floor((t - (c[3] + 0.7)) / 0.3)))} />
        </G>
        <G o={k(4)}>
          <defs>
            <clipPath id="hot21">
              <rect x={250} y={230} width={670} height={330} rx={18} />
            </clipPath>
            <clipPath id="cold21">
              <rect x={1000} y={230} width={670} height={330} rx={18} />
            </clipPath>
          </defs>
          <rect x={250} y={230} width={670} height={330} rx={18} fill={WARM} stroke={ink} strokeWidth={5} />
          <rect x={1000} y={230} width={670} height={330} rx={18} fill={SOFT} stroke={ink} strokeWidth={5} />
          <g clipPath="url(#hot21)">
            <circle cx={400} cy={395} r={12} fill={orange} />
            {ray(400, true, vis(t, c[4] + 2.7))}
          </g>
          <g clipPath="url(#cold21)">
            <circle cx={1150} cy={395} r={12} fill={teal} />
            {ray(1150, false, vis(t, c[4] + 3.4))}
          </g>
          <rect x={945} y={230} width={30} height={290} rx={15} fill="#fff" stroke={ink} strokeWidth={4} />
          <rect x={952} y={520 - 80 - 150 * hot} width={16} height={80 + 150 * hot} fill={orange} />
          <circle cx={960} cy={542} r={36} fill={orange} stroke={ink} strokeWidth={4} />
          <Note x={585} y={195} text="hot air: faster" o={vis(t, c[4] + 2.6)} size={44} fill={orange} />
          <Note x={1335} y={195} text="cold air: slower" o={vis(t, c[4] + 3.3)} size={44} fill={teal} />
          <Stamp x={620} y={645} text="OUR READING" o={vis(t, c[4] + 4.8)} size={40} rot={-6} />
          <Note x={1260} y={645} text="the count is an estimate" o={vis(t, c[4] + 5.6)} size={40} fill={ink} />
        </G>
        <Foot t={t} c={c} k={1} text="National Weather Service" />
        <Foot t={t} c={c} k={2} text="Environment Canada" />
        <Foot t={t} c={c} k={4} text="Environment Canada" />
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["THE DELAY IS A RULER"], ["DIVIDE BY FIVE"], ["DIVIDE BY THREE"], ["A QUICK EXAMPLE"], ["IT IS AN ESTIMATE"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ rumble (15-20) */
const Observer: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <G x={x} y={y}>
    <circle r={26} fill={ink} />
    <Txt x={0} y={62} size={32}>
      YOU
    </Txt>
  </G>
);

const SceneRumble: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const bang = Math.max(0, Math.min(1, ramp(t, c[0] + 1.3, c[0] + 2.0)));
  const bangD = `M300 400 ` + Array.from({ length: Math.floor(120 * bang) + 1 }, (_, i) => `L${300 + i * 4} ${400 + 150 * Math.exp(-i / 14) * Math.sin(i * 0.9)}`).join(" ");
  const diag: Pt[] = [[1620, 240], [1500, 330], [1560, 360], [1380, 450], [1440, 480], [1230, 570], [1280, 600], [1070, 650]];
  const far: Pt[] = [[1560, 360], [1440, 480], [1280, 600], [1070, 650], [1380, 450]];
  const clap: Pt[] = [270, 360, 450, 540, 630].map((y) => [1150, y]);
  const rum: Pt[] = [0, 1, 2, 3, 4, 5].map((i) => [760 + i * 160, 390 + i * 26]);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <line x1={260} y1={400} x2={1700} y2={400} stroke={ink} strokeWidth={3} opacity={0.3} />
          <path d={bangD} fill="none" stroke={ink} strokeWidth={6} strokeLinejoin="round" />
          <path d={rumble(960, 700, 400, ramp(t, c[0] + 2.7, c[0] + 3.9))} fill="none" stroke={orange} strokeWidth={6} strokeLinejoin="round" />
          <Note x={560} y={620} text="one bang" o={vis(t, c[0] + 1.7)} size={48} fill={ink} />
          <Note x={1310} y={620} text="or a rumble" o={vis(t, c[0] + 2.8)} size={48} fill={orange} />
        </G>
        <G o={k(1)}>
          <line x1={150} y1={650} x2={1780} y2={650} stroke={ink} strokeWidth={4} opacity={0.35} />
          <Cloud x={1680} y={200} s={1.3} />
          <Bolt d={zig(diag)} w={12} />
          <Person x={330} y={650} s={0.85} />
          <Arrive pts={far} ox={330} oy={580} t={t} t0={c[1] + 0.7} />
        </G>
        <G o={k(2)}>
          <Observer x={360} y={450} />
          <line x1={400} y1={450} x2={1300} y2={450} stroke={ink} strokeWidth={4} strokeDasharray="4 12" strokeLinecap="round" />
          <line x1={1150} y1={240} x2={1150} y2={660} stroke={orange} strokeWidth={12} strokeLinecap="round" />
          <Arrive pts={clap} ox={385} oy={450} t={t} t0={c[2] + 1.4} />
          <Plaque x={1560} y={240} text="CLAP" w={320} o={vis(t, c[2] + 3.5)} />
        </G>
        <G o={k(3)}>
          <Observer x={360} y={450} />
          <line x1={400} y1={450} x2={1700} y2={450} stroke={ink} strokeWidth={4} strokeDasharray="4 12" strokeLinecap="round" />
          <line x1={740} y1={382} x2={1560} y2={522} stroke={orange} strokeWidth={12} strokeLinecap="round" />
          <Arrive pts={rum} ox={385} oy={450} t={t} t0={c[3] + 0.9} />
          <Plaque x={1560} y={240} text="RUMBLE" w={380} o={vis(t, c[3] + 2.6)} />
        </G>
        <G o={k(4)}>
          <Clock x={620} y={420} r={170} u={0.5 * ramp(t, c[4] + 0.4, c[4] + 3.2)} wedge={0.5 * ramp(t, c[4] + 0.4, c[4] + 3.2)} />
          <G o={vis(t, c[4] + 2.2)}>
            <Txt x={1330} y={375} size={80}>
              MORE THAN
            </Txt>
            <Txt x={1330} y={475} size={80} fill={orange}>
              30 SECONDS
            </Txt>
          </G>
        </G>
        <G o={k(5)}>
          <Stamp x={420} y={215} text="OUR READING" o={vis(t, c[5] + 0.1)} size={44} rot={-6} />
          <G o={vis(t, c[5] + 0.9)}>
            <Bolt d={zig([[430, 330], [395, 410], [445, 440], [405, 520], [440, 630]])} w={12} />
          </G>
          <Arrow x1={540} y1={480} x2={700} y2={480} color={ink} w={8} o={vis(t, c[5] + 1.6)} />
          <defs>
            <clipPath id="band21">
              <rect x={760} y={300} width={920 * ramp(t, c[5] + 3.0, c[5] + 4.8)} height={280} />
            </clipPath>
          </defs>
          <g clipPath="url(#band21)">
            <path d={`M760 440 ${Array.from({ length: 185 }, (_, i) => `L${760 + i * 5} ${440 - env(i * 5)}`).join(" ")} ${Array.from({ length: 185 }, (_, i) => `L${760 + (184 - i) * 5} ${440 + env((184 - i) * 5)}`).join(" ")} Z`} fill={orange} fillOpacity={0.25} stroke={orange} strokeWidth={5} />
          </g>
          <Arrow x1={760} y1={600} x2={1680} y2={600} color={ink} w={6} o={vis(t, c[5] + 3.0)} />
          <Note x={1220} y={655} text="a stretch of sound, spread out in time" o={vis(t, c[5] + 3.4)} size={40} fill={teal} />
        </G>
        <Foot t={t} c={c} k={1} text="Environment Canada" />
        <Foot t={t} c={c} k={2} text="Environment Canada" />
        <Foot t={t} c={c} k={3} text="Environment Canada" />
        <Foot t={t} c={c} k={4} text="Wikipedia" />
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["NOT ONE BANG"], ["DIFFERENT DISTANCES"], ["ACROSS YOUR VIEW"], ["ALONG YOUR VIEW"], ["A LONG RUMBLE"], ["OUR READING", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ warning (21-25) */
const SceneWarning: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const ring = ramp(t, c[0] + 3.9, c[0] + 5.0);
  const f22 = flash(t, c[1] + 4.0) + flash(t, c[1] + 4.8) + flash(t, c[1] + 5.6);
  const house = "M850 380 L1060 240 L1270 380 Z";
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <rect x={330} y={140} width={1260} height={540} rx={14} fill={SOFT} fillOpacity={0.45} stroke={ink} strokeWidth={5} />
          <circle cx={960} cy={410} r={230 * ring} fill={teal} fillOpacity={0.1} stroke={ink} strokeWidth={6} strokeDasharray="16 12" />
          <Bolt d={zig([[960, 340], [935, 395], [975, 400], [945, 470]])} w={12} />
          <line x1={960} y1={410} x2={1190 * ring + 960 * (1 - ring)} y2={410} stroke={orange} strokeWidth={6} />
          <G o={vis(t, c[0] + 4.4)}>
            <rect x={1215} y={375} width={340} height={70} rx={35} fill="#fff" stroke={orange} strokeWidth={6} />
            <Txt x={1385} y={411} size={44} fill={orange}>
              ~10 MILES
            </Txt>
          </G>
        </G>
        <G o={k(1)}>
          <Plaque x={960} y={190} text="HEAT LIGHTNING" w={760} o={vis(t, c[1] + 2.64)} />
          {[[1480, 430, 0.8], [1700, 410, 0.7]].map(([x, y, s]) => (
            <Cloud key={x} x={x} y={y} s={s} />
          ))}
          <Bolt d={zig([[1550, 395], [1590, 420], [1620, 395], [1650, 420]])} o={Math.min(1, f22)} w={10} c={GOLD} />
          <path d="M0 565 Q960 470 1920 565 V700 H0 Z" fill={SAND} stroke={ink} strokeWidth={5} />
          {[0, 1, 2].map((i) => {
            const u = ramp(t, c[1] + 6.8 + i * 0.45, c[1] + 8.8 + i * 0.45);
            return <circle key={i} cx={1480} cy={500} r={40 + u * 430} fill="none" stroke={ink} strokeWidth={6} strokeDasharray="14 12" opacity={vis(t, c[1] + 6.8 + i * 0.45) * (1 - u)} />;
          })}
          <Person x={360} y={575} s={1} />
          <Note x={800} y={655} text="too far to hear" o={vis(t, c[1] + 7.6)} size={46} fill={orange} />
        </G>
        <G o={k(2)} y={-30}>
          <Cloud x={620} y={290} s={1.4} />
          <Cloud x={900} y={270} s={1} />
          {[500, 570, 640, 710, 780].map((x, i) => (
            <line key={x} x1={x} y1={390 + (i % 2) * 30} x2={x - 18} y2={470 + (i % 2) * 30} stroke={teal} strokeWidth={5} strokeLinecap="round" />
          ))}
          <circle cx={1700} cy={260} r={52} fill={GOLD} />
          <rect x={150} y={600} width={1620} height={26} rx={6} fill={SAND} stroke={ink} strokeWidth={5} />
          <G o={vis(t, c[2] + 2.2)}>
            <Bolt d={zig([[1010, 300], [1080, 380], [1130, 360], [1210, 470], [1260, 450], [1450, 600]])} w={12} />
          </G>
          <G o={vis(t, c[2] + 3.6)}>
            <line x1={620} y1={635} x2={620} y2={705} stroke={ink} strokeWidth={4} strokeDasharray="8 8" />
            <line x1={1450} y1={635} x2={1450} y2={705} stroke={ink} strokeWidth={4} strokeDasharray="8 8" />
            <Arrow x1={640} y1={690} x2={1430} y2={690} color={teal} w={6} />
            <Txt x={1035} y={664} size={42} fill={teal}>
              MORE THAN 3 MILES
            </Txt>
          </G>
        </G>
        <G o={k(3)}>
          <line x1={80} y1={620} x2={1840} y2={620} stroke={ink} strokeWidth={5} />
          <G o={vis(t, c[3] + 0.7)}>
            <rect x={418} y={420} width={28} height={200} fill={SAND} stroke={ink} strokeWidth={4} />
            <rect x={110} y={240} width={620} height={190} rx={14} fill={WARM} stroke={ink} strokeWidth={6} />
            <Txt x={420} y={305} size={40}>
              WHEN THUNDER ROARS,
            </Txt>
            <Txt x={420} y={370} size={46} fill={orange}>
              GO INDOORS
            </Txt>
          </G>
          <G o={vis(t, c[3] + 1.9)}>
            <rect x={880} y={380} width={360} height={240} fill="#fff" stroke={ink} strokeWidth={6} />
            <path d={house} fill={SAND} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
            <rect x={920} y={440} width={100} height={90} fill="#FFE69A" stroke={ink} strokeWidth={5} />
            <rect x={1110} y={470} width={90} height={150} fill={WARM} stroke={ink} strokeWidth={5} />
          </G>
          <G o={vis(t, c[3] + 3.2)}>
            <Clock x={1560} y={380} r={105} u={0.5 * ramp(t, c[3] + 3.4, c[3] + 5.0)} wedge={0.5 * ramp(t, c[3] + 3.4, c[3] + 5.0)} />
            <Txt x={1560} y={555} size={56} fill={orange}>
              30 MINUTES
            </Txt>
          </G>
        </G>
        <G o={k(4)}>
          <Stamp x={480} y={215} text="OUR READING" o={vis(t, c[4] + 0.1)} size={44} rot={-6} />
          <Ends y={470} />
          <Tape x1={340} x2={1470} y={470} prog={1} lit={Math.min(16, Math.max(0, Math.floor((t - (c[4] + 3.4)) / 0.2)))} />
          <Note x={900} y={600} text="a warning with a ruler built in" o={vis(t, c[4] + 2.8)} size={48} fill={teal} />
        </G>
        <Foot t={t} c={c} k={0} text="National Weather Service" />
        <Foot t={t} c={c} k={1} text="UCAR Center for Science Education" />
        <Foot t={t} c={c} k={2} text="National Weather Service" />
        <Foot t={t} c={c} k={3} text="National Weather Service (NOAA JetStream)" />
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["HOW FAR?"], ["HEAT LIGHTNING"], ["AWAY FROM THE STORM"], ["THE SAFETY RULE"], ["OUR READING", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ close (26-28) */
const SceneClose: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const lit = Math.max(0, Math.floor((t - (c[0] + 0.9)) / 0.4) + 1);
  const ang = Math.PI * ramp(t, c[2] + 0.8, c[2] + 2.2);
  const sx = Math.cos(ang);
  const done = ramp(t, c[2] + 2.2, c[2] + 2.6);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Win x={1100} t={t} fl={flash(t, c[0] + 0.3)} arc={c[0] + 2.2} id="w21b" />
          <Person x={420} y={640} s={2.2} />
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={330 + i * 45} cy={270} r={15} fill={i < lit ? orange : "#fff"} stroke={ink} strokeWidth={4} />
          ))}
        </G>
        <G o={k(1, 2)}>
          <rect x={200} y={140} width={1520} height={550} rx={26} fill="#F3E7CF" stroke={ink} strokeWidth={6} />
          <Note x={1330} y={400} text="your desk" o={k(1)} size={72} fill={teal} />
          <G o={1}>
            <rect x={600} y={260} width={212} height={300} fill="#fff" />
            <path d="M600 260 H812 V560 H600" fill="none" stroke={ink} strokeWidth={5} />
            <G x={600} y={410}>
              <g transform={`scale(${sx} 1)`}>
                <rect x={-212} y={-150} width={212} height={300} fill={sx < 0 ? "#EDE6D6" : "#fff"} />
                <path d="M0 -150 H-212 V150 H0" fill="none" stroke={ink} strokeWidth={5} />
              </g>
            </G>
            {ang > 0.02 && <line x1={600} y1={260} x2={600} y2={560} stroke={ink} strokeWidth={4} />}
            {done > 0 && <rect x={388} y={260} width={424} height={300} fill="none" stroke={ink} strokeWidth={4} strokeDasharray="12 10" opacity={done * 0.6} />}
            {done > 0 && <rect x={600} y={260} width={212} height={300} fill="none" stroke={orange} strokeWidth={7} opacity={done} />}
            {ang > 0.05 && ang < 3.1 && [-150, 150].map((dy) => <circle key={dy} cx={600 - 212 * sx} cy={410 + dy} r={24} fill={SKIN} stroke={ink} strokeWidth={4} />)}
          </G>
          <Note x={600} y={640} text="same shape" o={vis(t, c[2] + 2.9)} size={44} fill={teal} />
        </G>
        <G o={k(2)}>
          <G o={vis(t, c[2] + 3.5)}>
            <Txt x={1400} y={300} size={230} serif fill={orange}>
              WHY?
            </Txt>
          </G>
          <Note x={1390} y={470} text="The shape stays the same" o={vis(t, c[2] + 2.4)} size={40} fill={ink} />
        </G>
      </SvgFrame>
      <Chips t={t} c={c} list={[["COUNT FROM INDOORS"], ["A CLUE ON YOUR DESK"], ["WHY?", true]]} />
    </>
  );
};

export const SCENES021: Record<string, React.FC<SceneProps>> = {
  hook: SceneHook,
  cause: SceneCause,
  race: SceneRace,
  count: SceneCount,
  rumble: SceneRumble,
  warning: SceneWarning,
  close: SceneClose,
};
