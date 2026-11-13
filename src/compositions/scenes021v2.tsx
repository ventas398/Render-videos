import React from "react";
import { vis } from "../components/ui";
import { lerp, ramp } from "../utils/anim";
import type { SceneProps } from "./scenes";
import { BigNumber, Cam, DrawOn, Foot2, Mascot, ObjectCard, Pop, Scrawl, Simplified2 } from "./kit2";
import type { Mood } from "./kit2";
import { G, GOLD, GREY, ink, orange, RED, SAND, seg, SOFT, Stamp, SvgFrame, teal, Txt, useT, WARM } from "./kit";

/* ------------------------------------------------------------------ piezas (genericas, sin marcas) */
type Pt = [number, number];
const NWS = "National Weather Service";
const ECCC = "Environment and Climate Change Canada";
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const zig = (p: Pt[]) => p.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
const flash = (t: number, ft: number) => ramp(t, ft - 0.05, ft) * (1 - ramp(t, ft, ft + 0.7)) + 0.5 * ramp(t, ft + 0.25, ft + 0.3) * (1 - ramp(t, ft + 0.3, ft + 0.7));
/** Visible durante la parte k de la escena (para los pies de fuente). */
const ft = (t: number, c: number[], k: number) => vis(t, c[k] + 0.5, c[k + 1] === undefined ? 1e6 : c[k + 1] - 0.4);

const Cloud: React.FC<{ x: number; y: number; s?: number; o?: number; dark?: boolean }> = ({ x, y, s = 1, o = 1, dark }) => (
  <G x={x} y={y} s={s} o={o}>
    <g stroke={ink} strokeWidth={6 / s} strokeLinejoin="round">
      <ellipse rx={150} ry={46} fill={dark ? "#7F8CA0" : "#B5BFCC"} />
      <ellipse cx={-60} cy={-26} rx={80} ry={40} fill={dark ? "#7F8CA0" : "#B5BFCC"} />
      <ellipse cx={50} cy={-34} rx={90} ry={44} fill={dark ? "#6E7B90" : "#A3AEBE"} />
    </g>
    <ellipse rx={146} ry={40} fill={dark ? "#7F8CA0" : "#B5BFCC"} />
  </G>
);

const Bolt: React.FC<{ d: string; t0: number; t1: number; w?: number }> = ({ d, t0, t1, w = 22 }) => (
  <>
    <DrawOn d={d} t0={t0} t1={t1} w={w + 10} color={ink} />
    <DrawOn d={d} t0={t0} t1={t1} w={w} color={orange} />
    <DrawOn d={d} t0={t0} t1={t1} w={w / 3} color="#fff" />
  </>
);

/** Ventana con tormenta sobre el estanque: cortinas, repisa, destello y ondas de sonido. fl = destello 0..1; arc = inicio de las ondas. Centrada en (x, y). */
const Storm: React.FC<{ x: number; y: number; s?: number; t: number; fl: number; arc?: number; id: string; o?: number }> = ({ x, y, s = 1, t, fl, arc, id, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <defs>
      <clipPath id={id}>
        <rect x={-380} y={-260} width={760} height={520} />
      </clipPath>
    </defs>
    <rect x={-396} y={-246} width={820} height={560} rx={14} fill={ink} opacity={0.16} />
    <g clipPath={`url(#${id})`}>
      <rect x={-380} y={-260} width={760} height={340} fill="#C7CFDA" />
      {[[-250, -150, 1], [-20, -190, 1.3], [210, -130, 1.1], [330, -210, 0.9]].map(([cx, cy, cs]) => (
        <Cloud key={cx} x={cx} y={cy} s={cs} dark />
      ))}
      <path d="M-380 80 Q-250 20 -140 66 T120 60 T380 44 V100 H-380Z" fill="#8FAE9A" stroke={ink} strokeWidth={5} />
      <path d={`M-380 ${86 + 4 * Math.sin(t * 1.4)} ${Array.from({ length: 20 }, (_, n) => `L${-380 + n * 40} ${86 + 5 * Math.sin(n * 0.9 + t * 1.4)}`).join(" ")} V260 H-380 Z`} fill={teal} fillOpacity={0.4} stroke={teal} strokeWidth={5} />
      <rect x={-380} y={-260} width={760} height={520} fill="#FFF3C0" opacity={fl * 0.8} />
      {fl > 0.02 && <path d="M-110 -130 L-150 -20 L-100 -20 L-160 120" fill="none" stroke={GOLD} strokeWidth={26} strokeLinejoin="round" strokeLinecap="round" opacity={fl} />}
      {arc !== undefined &&
        [0, 1, 2].map((i) => {
          const u = ramp(t, arc + i * 0.35, arc + i * 0.35 + 3.2);
          return <circle key={i} cx={-130} cy={-40} r={40 + u * 520} fill="none" stroke={ink} strokeWidth={6} strokeDasharray="14 12" opacity={vis(t, arc + i * 0.35) * (1 - u)} />;
        })}
    </g>
    <rect x={-380} y={-260} width={760} height={520} fill="none" stroke={ink} strokeWidth={18} />
    <line x1={0} y1={-260} x2={0} y2={260} stroke={ink} strokeWidth={10} />
    <line x1={-380} y1={-20} x2={380} y2={-20} stroke={ink} strokeWidth={10} />
    <rect x={-430} y={262} width={860} height={30} rx={8} fill={SAND} stroke={ink} strokeWidth={6} />
    <path d="M-380 -260 Q-340 -60 -400 260 H-300 Q-270 0 -300 -260Z" fill={teal} stroke={ink} strokeWidth={6} />
    <path d="M380 -260 Q340 -60 400 260 H300 Q270 0 300 -260Z" fill={teal} stroke={ink} strokeWidth={6} />
  </G>
);

/** Reloj de pared / cronometro: u = vuelta de la aguja (0..1), wedge = fraccion rellena. */
const Dial: React.FC<{ x: number; y: number; r: number; u: number; wedge?: number; o?: number; stop?: boolean }> = ({ x, y, r, u, wedge = 0, o = 1, stop }) => {
  const a = wedge * Math.PI * 2;
  return (
    <G x={x} y={y} o={o}>
      {stop && <rect x={-16} y={-r - 40} width={32} height={34} rx={8} fill={GREY} stroke={ink} strokeWidth={6} />}
      <circle r={r + 10} fill={ink} opacity={0.16} cx={10} cy={12} />
      <circle r={r} fill="#fff" stroke={ink} strokeWidth={10} />
      {wedge > 0.01 && <path d={`M0 0 L0 ${-r + 10} A${r - 10} ${r - 10} 0 ${a > Math.PI ? 1 : 0} 1 ${(r - 10) * Math.sin(a)} ${-(r - 10) * Math.cos(a)} Z`} fill={orange} fillOpacity={0.35} />}
      {Array.from({ length: 12 }, (_, d) => (
        <line key={d} x1={0} y1={-r + 12} x2={0} y2={-r + (d % 3 ? 26 : 38)} stroke={ink} strokeWidth={d % 3 ? 4 : 8} transform={`rotate(${d * 30})`} />
      ))}
      <line x1={0} y1={0} x2={0} y2={-r + 34} stroke={orange} strokeWidth={10} strokeLinecap="round" transform={`rotate(${u * 360})`} />
      <circle r={12} fill={ink} />
    </G>
  );
};

/** Onda de sonido: suma de pulsos que llegan en los tiempos arr (px en el eje x del trazo). */
const trace = (x0: number, y0: number, len: number, arr: number[], amp: number, prog: number) => {
  const pts: string[] = [];
  for (let x = 0; x <= len * prog; x += 3) {
    let v = 0;
    for (const xi of arr) {
      const d = x - xi;
      if (d >= -6) v += Math.exp(-Math.max(d, 0) / 55) * Math.sin(d * 0.8) * (d < 0 ? 0.3 : 1);
    }
    pts.push(`${pts.length ? "L" : "M"}${x0 + x} ${y0 + Math.max(-1, Math.min(1, v / 2.4)) * amp}`);
  }
  return pts.join(" ");
};

/** Mascota segun una lista de [hasta (s), estado]. */
const moodAt = (t: number, list: [number, Mood][]): Mood => (list.find(([u]) => t < u) ?? list[list.length - 1])[1];

/* ------------------------------------------------------------------ hook (0-2) */
const SceneHook: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const n = t > c[0] + 3.32 ? "10" : t > c[0] + 2.9 ? "5" : "1";
  const th = c[1] + 1.2;
  const shake = t > th ? Math.sin((t - th) * 40) * 6 * Math.exp(-(t - th) * 3) : 0;
  const mv = ramp(t, c[2] + 0.2, c[2] + 1.0);
  return (
    <>
      <SvgFrame>
        <Cam dur={dur} z0={1} z1={1.07} dx={-30} amt={0.6}>
          <G o={k(0, 2)}>
            <Storm x={lerp(1050, 820, mv) + shake} y={lerp(470, 480, mv)} s={lerp(1, 0.88, mv)} t={t} fl={flash(t, c[0] + 0.7)} arc={c[1] + 1.2} id="w21v" />
          </G>
        </Cam>
        <Cam dur={dur} z0={1} z1={1.04} dx={20} amt={1.3}>
          <Mascot x={260} y={866} s={1.25} mood={moodAt(t, [[th, "curious"], [c[2] + 0.3, "surprised"], [1e9, "thinking"]])} look={[10, 0]} arm={t < th ? "point" : "down"} o={k(0, 2)} jump={t > th && t < th + 0.5 ? Math.sin(((t - th) / 0.5) * Math.PI) * 26 : 0} />
          <G o={vis(t, c[0] + 2.1, c[1] + 1.0) * k(0, 1)}>
            <ObjectCard x={1660} y={470} w={300} h={300} tab="COUNT" t0={c[0] + 2.1}>
              <BigNumber x={0} y={10} text={n} size={190} fill={orange} t0={c[0] + 2.1} mark="none" />
            </ObjectCard>
          </G>
          <G o={vis(t, c[1] + 1.3, c[2] - 0.4) * k(1)}>
            <Scrawl x={1050} y={850} size={62} fill={ink}>
              then... THUNDER
            </Scrawl>
          </G>
          <ObjectCard x={1500} y={480} w={520} h={470} tab="THE QUESTION" t0={c[2] + 0.2} o={k(2)}>
            <text y={20} textAnchor="middle" dominantBaseline="central" fontFamily={'Georgia, Cambria, serif'} fontWeight={700} fontSize={130} fill={orange}>
              WHY?
            </text>
            <Scrawl x={0} y={110} size={38} fill={teal}>
              why is the sound late?
            </Scrawl>
          </ObjectCard>
        </Cam>
      </SvgFrame>
    </>
  );
};

/* ------------------------------------------------------------------ cause (3-5): tracker 0 */
const SceneCause: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const spread = ramp(t, c[1] + 1.0, c[1] + 3.2);
  const dots = Array.from({ length: 44 }, (_, i) => {
    const a = i * 2.399;
    const r0 = 34 + ((i * 37) % 130);
    return { x: 940 + Math.cos(a) * r0, y: 560 + Math.sin(a) * r0 * 1.6, dx: Math.cos(a), dy: Math.sin(a) };
  });
  return (
    <>
      <SvgFrame>
        <Cam dur={dur} z0={1} z1={1.32} dy={-40} amt={0.55}>
          <path d="M0 780 Q300 700 640 770 T1300 760 T1920 740 V1080 H0Z" fill="#9DBBA8" stroke={ink} strokeWidth={6} />
          <path d="M0 860 Q400 800 900 850 T1920 830 V1080 H0Z" fill="#86A894" stroke={ink} strokeWidth={6} />
          <Cloud x={960} y={250} s={2.4} dark />
        </Cam>
        <Cam dur={dur} z0={1} z1={1.32} dy={-40}>
          <Bolt d={zig([[1000, 330], [920, 450], [1000, 470], [890, 620], [960, 640], [880, 790]])} t0={c[0] + 1.6} t1={c[0] + 2.1} />
          <Scrawl x={1480} y={470} size={52} o={k(0)} t0={c[0] + 0.6}>
            lightning passes
          </Scrawl>
          <Scrawl x={1480} y={530} size={52} o={k(0)} t0={c[0] + 0.6}>
            through the air
          </Scrawl>
          <DrawOn d="M1330 500 Q1150 480 1040 560" t0={c[0] + 3} t1={c[0] + 3.6} w={6} color={teal} o={k(0)} />
          <G o={k(1, 2)}>
            {dots.map((d, i) => (
              <circle key={i} cx={d.x + d.dx * spread * 110} cy={d.y + d.dy * spread * 140} r={9} fill={spread > 0.4 ? orange : teal} opacity={0.85} stroke={ink} strokeWidth={3} />
            ))}
          </G>
          <Scrawl x={1480} y={420} size={56} fill={orange} o={k(1)} t0={c[1] + 0.6}>
            the air heats fast
          </Scrawl>
          <Scrawl x={1480} y={490} size={56} fill={orange} o={vis(t, c[1] + 2.6) * k(1)}>
            ...and expands
          </Scrawl>
          {[0, 1, 2].map((i) => {
            const u = ramp(t, c[2] + 0.4 + i * 0.5, c[2] + 3.4 + i * 0.5);
            return <circle key={i} cx={940} cy={620} r={60 + u * 700} fill="none" stroke={ink} strokeWidth={9} strokeDasharray="22 16" opacity={vis(t, c[2] + 0.3 + i * 0.5) * (1 - u) * k(2)} />;
          })}
        </Cam>
        <ObjectCard x={1480} y={560} w={440} h={250} tab="SHOCKWAVE" o={k(2)} t0={c[2] + 0.3}>
          <Txt x={0} y={-30} size={50}>
            THUNDER IS THE
          </Txt>
          <Txt x={0} y={36} size={50} fill={orange}>
            SOUND OF IT
          </Txt>
        </ObjectCard>
        <Cam dur={dur} z0={1} z1={1.1} dx={10} amt={1.4}>
          <Mascot x={230} y={866} s={1.1} mood="curious" look={[10, -6]} arm={t > c[2] ? "ear" : "down"} />
        </Cam>
        <Foot2 text={NWS} o={Math.max(ft(t, c, 0), ft(t, c, 1))} />
        <Foot2 text={ECCC} o={ft(t, c, 2)} />
        <Simplified2 o={1} />
      </SvgFrame>
    </>
  );
};

/* ------------------------------------------------------------------ race (6-9): tracker 1 */
const SceneRace: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const lt = ramp(t, c[0] + 2.0, c[0] + 2.7);
  const sd = clamp((t - (c[0] + 2.0)) / 22);
  const sweep = Math.min(0.995, ramp(t, c[3] + 0.6, c[3] + 4.6));
  return (
    <>
      <SvgFrame>
        <Cam dur={dur} z0={1} z1={1.05} dx={-20} amt={0.6}>
          <G o={k(0)}>
            {[400, 580].map((y) => (
              <g key={y}>
                <rect x={300} y={y - 56} width={1330} height={112} rx={20} fill="#F4EBD6" stroke={ink} strokeWidth={6} />
                <line x1={330} y1={y} x2={1600} y2={y} stroke={ink} strokeWidth={4} strokeDasharray="30 24" opacity={0.4} />
              </g>
            ))}
            {Array.from({ length: 8 }, (_, i) => (
              <rect key={i} x={1560 + (i % 2) * 28} y={344 + i * 28} width={28} height={28} fill={ink} />
            ))}
            <Cloud x={190} y={340} s={0.9} dark />
            <path d="M205 380 L170 440 L212 440 L176 500" fill="none" stroke={orange} strokeWidth={14} strokeLinejoin="round" strokeLinecap="round" />
            <Scrawl x={960} y={250} size={60} fill={ink}>
              roughly the same time...
            </Scrawl>
            <Scrawl x={960} y={720} size={64} fill={orange} o={vis(t, c[0] + 3.4)} t0={c[0] + 3.4}>
              ...but it is a race, and it is not close
            </Scrawl>
            <G x={lerp(380, 1540, lt)} y={400}>
              <circle r={44} fill={orange} stroke={ink} strokeWidth={7} />
              <path d="M6 -26 L-14 4 H6 L-8 28" fill="none" stroke="#fff" strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
              {lt > 0 && lt < 1 && <line x1={-130} y1={0} x2={-60} y2={0} stroke={orange} strokeWidth={10} strokeLinecap="round" />}
            </G>
            <G x={lerp(380, 1540, sd)} y={580}>
              <circle r={44} fill={teal} stroke={ink} strokeWidth={7} />
              <path d="M-12 -12 H0 L14 -26 V26 L0 12 H-12 Z" fill="#fff" />
              <path d="M24 -14 Q34 0 24 14" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
            </G>
            <Txt x={150} y={620} size={40} fill={teal}>
              SOUND
            </Txt>
          </G>
          <ObjectCard x={600} y={530} w={640} h={470} tab="LIGHT" t0={c[1] + 0.2} o={k(1)}>
            <path d="M18 -170 L-30 -88 H18 L-26 -10" fill="none" stroke={orange} strokeWidth={22} strokeLinejoin="round" strokeLinecap="round" />
            <BigNumber x={0} y={70} text="300,000 KM/S" size={80} t0={c[1] + 0.5} mark="under" />
            <rect x={-270} y={150} width={540} height={26} rx={13} fill={orange} stroke={ink} strokeWidth={5} />
          </ObjectCard>
          <ObjectCard x={1320} y={530} w={640} h={470} tab="SOUND" tabColor={teal} t0={c[1] + 0.8} o={k(1)}>
            <path d="M-50 -110 H-20 L30 -150 V-30 L-20 -70 H-50 Z" fill={teal} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
            <path d="M60 -130 Q90 -90 60 -50 M84 -150 Q130 -90 84 -30" fill="none" stroke={teal} strokeWidth={8} strokeLinecap="round" />
            <BigNumber x={0} y={70} text="0.3 KM/S" size={80} t0={c[1] + 1.0} mark="under" markColor={teal} />
            <rect x={-270} y={150} width={4} height={26} fill={teal} />
          </ObjectCard>
          <G o={k(2)}>
            <Pop x={620} y={620} t0={c[2] + 0.4}>
              <circle r={110} fill={orange} stroke={ink} strokeWidth={8} />
              <path d="M12 -56 L-30 10 H12 L-20 62" fill="none" stroke="#fff" strokeWidth={16} strokeLinejoin="round" strokeLinecap="round" />
            </Pop>
            <Pop x={1300} y={620} t0={c[2] + 0.8}>
              <circle r={7} fill={teal} stroke={ink} strokeWidth={3} />
              <Scrawl x={0} y={50} size={38} fill={teal}>
                sound
              </Scrawl>
            </Pop>
            <BigNumber x={960} y={300} text="~1,000,000x" size={200} t0={c[2] + 0.3} mark="under" />
            <Scrawl x={960} y={790} size={52} fill={ink} o={vis(t, c[2] + 1.8)} t0={c[2] + 1.8}>
              light is about a million times faster
            </Scrawl>
          </G>
          <G o={k(3)}>
            <Dial x={620} y={500} r={210} u={sweep} wedge={sweep} stop />
            <BigNumber x={1290} y={380} text="5 SECONDS" size={110} t0={c[3] + 0.4} mark="under" />
            <Scrawl x={1290} y={520} size={64} fill={teal} o={vis(t, c[3] + 1.4)} t0={c[3] + 1.4}>
              per mile
            </Scrawl>
            <G o={vis(t, c[3] + 2.0)}>
              <rect x={1000} y={650} width={600} height={34} rx={8} fill="#B8BFC9" stroke={ink} strokeWidth={5} />
              {[1030, 1570].map((x) => (
                <g key={x}>
                  <rect x={x - 8} y={610} width={16} height={44} fill={ink} />
                </g>
              ))}
              <Scrawl x={1300} y={740} size={48} fill={ink}>
                one mile
              </Scrawl>
            </G>
          </G>
        </Cam>
        <Cam dur={dur} z0={1} z1={1.05} dx={10} amt={1.3}>
          <Mascot x={1735} y={866} s={0.95} flip mood={moodAt(t, [[c[0] + 2.0, "curious"], [c[1], "surprised"], [c[2], "thinking"], [1e9, "curious"]])} look={[-12, 0]} arm={t < c[1] ? "point" : "down"} />
        </Cam>
        <Stamp x={300} y={170} text="OUR ARITHMETIC" o={k(2)} />
        <Foot2 text="UCAR Center for Science Education" o={ft(t, c, 0)} />
        <Foot2 text={ECCC} o={ft(t, c, 1)} />
        <Foot2 text={NWS} o={ft(t, c, 3)} />
        <Simplified2 o={1} />
      </SvgFrame>
    </>
  );
};

/* ------------------------------------------------------------------ count (10-14): tracker 1 */
const RuleCard: React.FC<{ text: string; tab: string; t0: number; o: number; icon: React.ReactNode }> = ({ text, tab, t0, o, icon }) => (
  <ObjectCard x={960} y={500} w={1240} h={380} tab={tab} t0={t0} o={o}>
    <G x={-540} y={30} s={1.05}>{icon}</G>
    <BigNumber x={70} y={40} text={text} size={84} t0={t0 + 0.3} mark="under" />
  </ObjectCard>
);

const SceneCount: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const lit = Math.max(0, Math.floor((t - (c[0] + 1.6)) / 0.4) + 1);
  const unroll = ramp(t, c[0] + 0.6, c[0] + 1.8);
  const x1 = 330;
  const x2 = 1600;
  const w = (x2 - x1) * unroll;
  const stopIcon = (
    <g>
      <circle r={60} fill="#fff" stroke={ink} strokeWidth={8} />
      <path d="M0 0 V-40 M0 0 L26 14" stroke={orange} strokeWidth={8} strokeLinecap="round" />
    </g>
  );
  return (
    <>
      <SvgFrame>
        <Cam dur={dur} z0={1} z1={1.05} dx={-20} amt={0.6}>
          <G o={k(0)}>
            <rect x={150} y={470} width={190} height={150} rx={30} fill={teal} stroke={ink} strokeWidth={7} />
            <circle cx={245} cy={545} r={36} fill={SOFT} stroke={ink} strokeWidth={6} />
            <rect x={x1} y={520} width={w} height={90} rx={8} fill={WARM} stroke={ink} strokeWidth={6} />
            {Array.from({ length: 17 }, (_, i) => {
              const tx = x1 + (i * (x2 - x1)) / 16;
              return tx <= x1 + w ? <line key={i} x1={tx} y1={520} x2={tx} y2={560 - (i % 4 ? 0 : 20) + (i % 4 ? -20 : 0) + 20} stroke={i < lit ? orange : ink} strokeWidth={i < lit ? 12 : 5} /> : null;
            })}
            <G o={vis(t, c[0] + 1.8)}>
              <path d="M1670 420 L1630 490 H1668 L1632 560" fill="none" stroke={orange} strokeWidth={14} strokeLinejoin="round" strokeLinecap="round" />
              <Scrawl x={1650} y={400} size={44}>
                flash
              </Scrawl>
            </G>
            <Scrawl x={960} y={360} size={62} fill={ink} o={vis(t, c[0] + 0.8)} t0={c[0] + 0.8}>
              count the seconds
            </Scrawl>
            <Scrawl x={960} y={430} size={56} fill={teal} o={vis(t, c[0] + 1.4)} t0={c[0] + 1.4}>
              from flash to thunder
            </Scrawl>
          </G>
          <RuleCard text="SECONDS ÷ 5 = MILES" tab="MILES" t0={c[1] + 0.2} o={k(1)} icon={stopIcon} />
          <RuleCard text="SECONDS ÷ 3 = KM" tab="KILOMETERS" t0={c[2] + 0.2} o={k(2)} icon={stopIcon} />
          <G o={k(3)}>
            <Dial x={400} y={500} r={170} u={ramp(t, c[3] + 0.4, c[3] + 3.4)} stop />
            <Pop x={400} y={760} t0={c[3] + 3.2}>
              <Scrawl x={0} y={0} size={44}>
                ten seconds
              </Scrawl>
            </Pop>
            <BigNumber x={1210} y={440} text="10 s ≈ 2 mi ≈ 3 km" size={100} t0={c[3] + 0.6} mark="under" />
            <Scrawl x={1210} y={590} size={50} fill={teal} o={vis(t, c[3] + 2.4)} t0={c[3] + 2.4}>
              miles or kilometers, you choose
            </Scrawl>
          </G>
          <G o={k(4)}>
            {[
              { x: 560, hot: true, label: "hot air: faster" },
              { x: 1180, hot: false, label: "cold air: slower" },
            ].map(({ x, hot, label }) => (
              <g key={x}>
                <rect x={x - 28} y={290} width={56} height={330} rx={28} fill="#fff" stroke={ink} strokeWidth={8} />
                <circle cx={x} cy={650} r={54} fill={hot ? orange : teal} stroke={ink} strokeWidth={8} />
                <rect x={x - 12} y={hot ? 330 : 470} width={24} height={hot ? 300 : 160} rx={12} fill={hot ? orange : teal} />
                <path d={`M${x + 70} 450 H${x + (hot ? 330 : 190)}`} stroke={hot ? orange : teal} strokeWidth={14} strokeLinecap="round" />
                <path d={`M${x + (hot ? 330 : 190)} 450 l-26 -20 v40 z`} fill={hot ? orange : teal} stroke={hot ? orange : teal} strokeWidth={6} strokeLinejoin="round" />
                <Scrawl x={x + 250} y={380} size={44} fill={hot ? orange : teal}>
                  {label}
                </Scrawl>
              </g>
            ))}
            <Scrawl x={960} y={800} size={56} fill={ink} o={vis(t, c[4] + 3.4)} t0={c[4] + 3.4}>
              the count is an estimate
            </Scrawl>
          </G>
        </Cam>
        <Cam dur={dur} z0={1} z1={1.05} dx={10} amt={1.3}>
          <Mascot x={1735} y={866} s={0.95} flip mood={moodAt(t, [[c[1], "curious"], [c[4], "happy"], [1e9, "thinking"]])} arm={t < c[1] ? "point" : "down"} look={[-10, 0]} />
        </Cam>
        <Stamp x={300} y={170} text="OUR COMPARISON" o={k(0)} color={teal} />
        <Stamp x={300} y={170} text="OUR ARITHMETIC" o={k(3)} />
        <Stamp x={300} y={170} text="OUR READING" o={k(4)} color={teal} />
        <Foot2 text={NWS} o={ft(t, c, 1)} />
        <Foot2 text={ECCC} o={Math.max(ft(t, c, 2), ft(t, c, 4))} />
        <Simplified2 o={1} />
      </SvgFrame>
    </>
  );
};

/* ------------------------------------------------------------------ rumble (15-20): tracker 2 */
const OBS: Pt = [400, 650];
const Strike: React.FC<{ pts: Pt[]; t: number; t0: number; v?: number; obs?: Pt }> = ({ pts, t, t0, v = 330, obs = OBS }) => (
  <>
    <path d={zig(pts)} fill="none" stroke={ink} strokeWidth={22} strokeLinejoin="round" strokeLinecap="round" />
    <path d={zig(pts)} fill="none" stroke={orange} strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" />
    {pts.map(([x, y], i) => {
      const len = Math.hypot(x - obs[0], y - obs[1]);
      const f = clamp(((t - t0) * v) / len);
      return (
        <g key={i}>
          <line x1={x} y1={y} x2={obs[0]} y2={obs[1]} stroke={GREY} strokeWidth={4} strokeDasharray="12 10" />
          {f > 0 && f < 1 && <circle cx={lerp(x, obs[0], f)} cy={lerp(y, obs[1], f)} r={15} fill={teal} stroke={ink} strokeWidth={4} />}
        </g>
      );
    })}
  </>
);

const Panel: React.FC<{ x: number; y: number; w: number; h: number; arr: number[]; t: number; t0: number; label?: string; labelColor?: string; len?: number; amp?: number; rate?: number }> = ({ x, y, w, h, arr, t, t0, label, labelColor = orange, len = 700, amp = 50, rate = 0.3 }) => (
  <G o={vis(t, t0)}>
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={18} fill="#FFFDF6" stroke={ink} strokeWidth={6} />
    <line x1={x - w / 2 + 30} y1={y} x2={x - w / 2 + 30 + len} y2={y} stroke={GREY} strokeWidth={3} />
    <path d={trace(x - w / 2 + 30, y, len, arr, amp, clamp((t - t0) * rate))} fill="none" stroke={ink} strokeWidth={5} strokeLinejoin="round" />
    {label && (
      <Txt x={x + w / 2 - 125} y={y} size={56} fill={labelColor}>
        {label}
      </Txt>
    )}
  </G>
);

const SceneRumble: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const bolt16: Pt[] = [[1380, 310], [1320, 380], [1250, 360], [1180, 480], [1110, 520], [1040, 620], [940, 680]];
  const across: Pt[] = [[1400, 280], [1415, 350], [1390, 420], [1410, 490], [1395, 560], [1400, 640]];
  const along: Pt[] = [[820, 580], [980, 540], [1140, 500], [1280, 450], [1400, 400], [1480, 330]];
  const arrOf = (pts: Pt[], v: number) => pts.map(([x, y]) => (Math.hypot(x - OBS[0], y - OBS[1]) / v) * 300 * 0.3);
  const rum = Array.from({ length: 14 }, (_, i) => 120 + i * 28 + ((i * 13) % 17));
  const long = Array.from({ length: 40 }, (_, i) => 40 + i * 27 + ((i * 19) % 13));
  return (
    <>
      <SvgFrame>
        <Cam dur={dur} z0={1} z1={1.05} dx={-20} amt={0.6}>
          <G o={k(0)}>
            <ObjectCard x={640} y={540} w={560} h={430} tab="ONE BANG?" t0={c[0] + 0.5}>
              <path d={trace(-210, 20, 420, [190], 150, 1)} fill="none" stroke={ink} strokeWidth={6} />
            </ObjectCard>
            <ObjectCard x={1300} y={540} w={560} h={430} tab="OR A RUMBLE" tabColor={teal} t0={c[0] + 1.6}>
              <path d={trace(-210, 20, 420, rum.map((r) => r * 0.9), 120, 1)} fill="none" stroke={teal} strokeWidth={6} />
            </ObjectCard>
          </G>
          <G o={k(1)}>
            <Cloud x={1330} y={270} s={1.1} dark />
            <Strike pts={bolt16} t={t} t0={c[1] + 1.0} />
            <Scrawl x={1100} y={800} size={42} fill={ink}>
              sound from each part reaches you at a different time
            </Scrawl>
          </G>
          <G o={k(2)}>
            <Strike pts={across} t={t} t0={c[2] + 1.0} v={420} />
            <Panel x={1120} y={800} w={820} h={150} arr={arrOf(across, 420).map((a) => a * 1.1)} t={t} t0={c[2] + 1.2} len={520} rate={0.3} label="CLAP" />
            <Scrawl x={960} y={290} size={52} fill={teal}>
              across your line of sight
            </Scrawl>
          </G>
          <G o={k(3)}>
            <Strike pts={along} t={t} t0={c[3] + 1.0} v={420} />
            <Panel x={1120} y={800} w={820} h={150} arr={arrOf(along, 420).map((a) => a * 0.46)} t={t} t0={c[3] + 1.2} len={520} rate={0.3} label="RUMBLE" labelColor={teal} />
            <Scrawl x={800} y={330} size={52} fill={teal}>
              roughly along your line of sight
            </Scrawl>
          </G>
          <G o={k(4)}>
            <ObjectCard x={1030} y={540} w={1260} h={450} tab="WIKIPEDIA SAYS" t0={c[4] + 0.2}>
              <path d={trace(-560, 80, 1120, long, 100, clamp((t - c[4] - 0.8) / 3.2))} fill="none" stroke={teal} strokeWidth={6} />
              <BigNumber x={0} y={-90} text="MORE THAN 30 SECONDS" size={90} t0={c[4] + 0.5} mark="under" />
            </ObjectCard>
          </G>
          <G o={k(5)}>
            <ObjectCard x={1000} y={540} w={1300} h={430} tab="ONE BOLT" tabColor={teal} t0={c[5] + 0.2}>
              <path d="M-560 -60 L-600 20 H-560 L-600 100" fill="none" stroke={orange} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
              <path d={trace(-420, 40, 1000, long, 90, clamp((t - c[5] - 0.6) / 3))} fill="none" stroke={teal} strokeWidth={6} />
              <DrawOn d="M-420 150 H580 M560 130 L585 150 L560 170" t0={c[5] + 1.2} t1={c[5] + 2.2} w={7} color={orange} />
              <Scrawl x={80} y={-60} size={54} fill={ink} o={vis(t, c[5] + 0.8)} t0={c[5] + 0.8}>
                not one sound: a stretch of sound,
              </Scrawl>
              <Scrawl x={80} y={-4} size={54} fill={orange} o={vis(t, c[5] + 1.4)} t0={c[5] + 1.4}>
                spread out in time
              </Scrawl>
            </ObjectCard>
          </G>
        </Cam>
        <Cam dur={dur} z0={1} z1={1.06} dx={10} amt={1.3}>
          <Mascot x={t < c[1] ? 250 : t < c[4] ? 300 : 190} y={866} s={t < c[1] ? 1.1 : t < c[4] ? 0.85 : 0.95} mood={moodAt(t, [[c[1], "surprised"], [c[4], "curious"], [1e9, "thinking"]])} arm={t < c[1] ? "ear" : "down"} look={[10, 0]} />
        </Cam>
        <Stamp x={300} y={170} text="OUR READING" o={k(5)} color={teal} />
        <Foot2 text={ECCC} o={Math.max(ft(t, c, 1), ft(t, c, 2), ft(t, c, 3))} />
        <Foot2 text="Wikipedia" o={ft(t, c, 4)} />
        <Simplified2 o={1} />
      </SvgFrame>
    </>
  );
};

/* ------------------------------------------------------------------ warning (21-25): tracker 3 */
const House: React.FC<{ x: number; y: number; s?: number; fill?: string }> = ({ x, y, s = 1, fill = "#FBE3CF" }) => (
  <G x={x} y={y} s={s}>
    <rect x={-60} y={-70} width={120} height={80} fill={fill} stroke={ink} strokeWidth={7} />
    <path d="M-76 -66 L0 -130 L76 -66Z" fill={orange} stroke={ink} strokeWidth={7} strokeLinejoin="round" />
    <rect x={-14} y={-34} width={28} height={44} fill={ink} />
  </G>
);

const SceneWarning: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const fl = Math.max(flash(t, c[1] + 2.0), flash(t, c[1] + 3.6) * 0.7, flash(t, c[1] + 6.2));
  const ring = (i: number) => ramp(t, c[0] + 1.0 + i * 0.7, c[0] + 4.2 + i * 0.7);
  const wedge = ramp(t, c[3] + 2.2, c[3] + 6.0);
  return (
    <>
      <SvgFrame>
        <Cam dur={dur} z0={1} z1={1.05} dx={-20} amt={0.6}>
          <G o={k(0)}>
            <circle cx={700} cy={560} r={300} fill={SOFT} fillOpacity={0.7} stroke={teal} strokeWidth={8} strokeDasharray="26 16" />
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={700} cy={560} r={20 + ring(i) * 280} fill="none" stroke={ink} strokeWidth={6} strokeDasharray="14 12" opacity={(1 - ring(i)) * 0.8} />
            ))}
            <path d="M712 500 L676 560 H712 L676 620" fill="none" stroke={orange} strokeWidth={16} strokeLinejoin="round" strokeLinecap="round" />
            <House x={860} y={640} s={0.8} />
            <House x={1250} y={640} s={0.8} fill="#EDE6D6" />
            <G o={vis(t, c[0] + 5)}>
              <Scrawl x={860} y={710} size={40} fill={teal}>
                hears it
              </Scrawl>
              <Scrawl x={1250} y={710} size={40} fill={RED}>
                silence
              </Scrawl>
            </G>
            <BigNumber x={1330} y={380} text="~10 MILES" size={112} t0={c[0] + 0.5} mark="under" />
          </G>
          <G o={k(1)}>
            <clipPath id="skyc">
              <path d="M0 0 H1920 V740 Q960 560 0 740Z" />
            </clipPath>
            <g clipPath="url(#skyc)">
              {[0, 1].map((i) => {
                const u = ramp(t, c[1] + 5.2 + i * 0.9, c[1] + 8.4 + i * 0.9);
                return <circle key={i} cx={1360} cy={670} r={40 + u * 340} fill="none" stroke={ink} strokeWidth={6} strokeDasharray="14 12" opacity={vis(t, c[1] + 5.2 + i * 0.9) * (1 - u) * 0.5} />;
              })}
            </g>
            <path d="M0 740 Q960 560 1920 740 V1080 H0Z" fill="#9DBBA8" stroke={ink} strokeWidth={7} />
            <G x={1360} y={640} o={0.9}>
              <ellipse rx={340} ry={220} cy={-20} fill="#FFE9A0" opacity={fl * 0.85} />
              <Cloud x={0} y={30} s={1.3} dark />
              <path d="M-40 90 L-80 150" stroke={orange} strokeWidth={14} opacity={fl} />
            </G>
            <path d="M0 740 Q960 560 1920 740 V1080 H0Z" fill="#9DBBA8" stroke={ink} strokeWidth={7} opacity={0.98} />
                        <Stamp x={520} y={330} text="HEAT LIGHTNING" rot={-4} o={vis(t, c[1] + 0.8)} />
            <G x={800} y={470} o={vis(t, c[1] + 4.6)}>
              <path d="M-40 -20 H-10 L36 -56 V56 L-10 20 H-40 Z" fill="#fff" stroke={ink} strokeWidth={6} strokeLinejoin="round" />
              <path d="M-44 -52 L52 52" stroke={RED} strokeWidth={10} strokeLinecap="round" />
            </G>
            <Scrawl x={800} y={560} size={44} fill={ink} o={vis(t, c[1] + 4.6)} t0={c[1] + 4.6}>
              too far to hear
            </Scrawl>
          </G>
          <G o={k(2)}>
            <G x={460} y={420}>
              <Cloud x={0} y={0} s={1.7} dark />
              {Array.from({ length: 9 }, (_, i) => (
                <line key={i} x1={-170 + i * 42} y1={90} x2={-186 + i * 42} y2={150} stroke={teal} strokeWidth={7} strokeLinecap="round" />
              ))}
            </G>
            <path d="M0 760 Q500 700 960 750 T1920 740 V1080 H0Z" fill="#9DBBA8" stroke={ink} strokeWidth={6} />
            <Bolt d={zig([[1230, 340], [1190, 450], [1250, 470], [1200, 630], [1240, 700]])} t0={c[2] + 1.2} t1={c[2] + 1.7} w={18} />
            <DrawOn d="M460 820 H1230 M480 800 L455 820 L480 840 M1210 800 L1235 820 L1210 840" t0={c[2] + 2.2} t1={c[2] + 3.2} w={8} color={ink} />
            <BigNumber x={850} y={215} text="MORE THAN 3 MILES" size={104} t0={c[2] + 1.8} mark="under" />
          </G>
          <G o={k(3)}>
            <ObjectCard x={800} y={450} w={960} h={400} tab="THE RULE" t0={c[3] + 0.3}>
              <Txt x={0} y={-60} size={64}>
                WHEN THUNDER ROARS,
              </Txt>
              <Txt x={0} y={50} size={96} fill={orange}>
                GO INDOORS
              </Txt>
            </ObjectCard>
            <Dial x={1500} y={500} r={140} u={wedge} wedge={wedge} />
            <BigNumber x={900} y={790} text="30 MINUTES" size={84} t0={c[3] + 1.8} mark="under" markColor={teal} />
          </G>
          <G o={k(4)}>
            <rect x={300} y={470} width={1320} height={150} rx={14} fill="#F6E3A8" stroke={ink} strokeWidth={8} />
            {Array.from({ length: 33 }, (_, i) => (
              <line key={i} x1={330 + i * 40} y1={470} x2={330 + i * 40} y2={470 + (i % 4 === 0 ? 62 : 34)} stroke={ink} strokeWidth={i % 4 === 0 ? 6 : 4} />
            ))}
            <path d="M360 400 L330 450 H358 L332 500" fill="none" stroke={orange} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
            <Pop x={1560} y={420} t0={c[4] + 0.6}>
              <path d="M-36 -20 H-8 L34 -52 V52 L-8 20 H-36 Z" fill={teal} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
            </Pop>
            <Scrawl x={960} y={330} size={66} fill={ink} o={vis(t, c[4] + 1.0)} t0={c[4] + 1.0}>
              the delay is not a flaw
            </Scrawl>
            <Scrawl x={960} y={740} size={60} fill={orange} o={vis(t, c[4] + 2.2)} t0={c[4] + 2.2}>
              it is a warning with a ruler built in
            </Scrawl>
          </G>
        </Cam>
        <Cam dur={dur} z0={1} z1={1.05} dx={10} amt={1.3}>
          {t < c[3] - 0.4 && <Mascot x={1735} y={866} s={0.85} flip mood={moodAt(t, [[c[1], "curious"], [c[2], "surprised"], [1e9, "curious"]])} look={[-10, 0]} />}
          {t >= c[3] - 0.4 && <Mascot x={1735} y={866} s={0.85} flip mood={t < c[4] ? "happy" : "thinking"} arm={t < c[4] ? "point" : "chin"} />}
        </Cam>
        <Stamp x={300} y={170} text="OUR READING" o={k(4)} color={teal} />
        <Foot2 text={NWS} o={Math.max(ft(t, c, 0), ft(t, c, 2), ft(t, c, 3))} />
        <Foot2 text="UCAR Center for Science Education" o={ft(t, c, 1)} />
        <Simplified2 o={1} />
      </SvgFrame>
    </>
  );
};

/* ------------------------------------------------------------------ close (26-28) */
const SceneClose: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const lit = Math.max(0, Math.floor((t - (c[0] + 0.9)) / 0.4) + 1);
  const u = ramp(t, c[2] + 0.7, c[2] + 2.1);
  const cs = Math.cos(Math.PI * u);
  const X0 = 700;
  const Y0 = 250;
  const mid = Y0 + 212;
  return (
    <>
      <SvgFrame>
        <Cam dur={dur} z0={1} z1={1.06} dx={-30} amt={0.6}>
          <G o={k(0)}>
            <Storm x={1120} y={470} s={0.95} t={t} fl={flash(t, c[0] + 0.3)} arc={c[0] + 2.2} id="w21c" />
            <ObjectCard x={1120} y={800} w={420} h={110} t0={c[0] + 0.8}>
              {[0, 1, 2, 3, 4].map((i) => (
                <circle key={i} cx={-140 + i * 70} cy={0} r={22} fill={i < lit ? orange : "#fff"} stroke={ink} strokeWidth={5} />
              ))}
            </ObjectCard>
          </G>
          <G o={k(1, 2)}>
            <rect x={470} y={170} width={760} height={680} rx={36} fill="#EBD3A6" stroke={ink} strokeWidth={8} />
            {[250, 330, 410, 490, 570, 650, 730, 790].map((y) => (
              <path key={y} d={`M490 ${y} Q850 ${y - 14} 1210 ${y}`} fill="none" stroke="#C9AE7C" strokeWidth={3} />
            ))}
            <g opacity={vis(t, c[1] + 0.4)}>
              <circle cx={1080} cy={300} r={42} fill="#fff" stroke={ink} strokeWidth={6} />
              <circle cx={1080} cy={300} r={26} fill="#6B4A1E" />
              <rect x={520} y={780} width={170} height={24} rx={12} fill={orange} stroke={ink} strokeWidth={5} />
            </g>
            <rect x={X0} y={Y0} width={300} height={424} fill="none" stroke={ink} strokeWidth={4} strokeDasharray="12 10" opacity={ramp(t, c[2] + 1.0, c[2] + 1.6)} />
            <rect x={X0} y={mid} width={300} height={212} fill={u > 0.98 ? "#fff" : "#fff"} stroke={ink} strokeWidth={6} />
            <g transform={`translate(0 ${mid}) scale(1 ${cs}) translate(0 ${-mid})`}>
              <rect x={X0} y={Y0} width={300} height={212} fill={u > 0.5 ? "#EDE6D6" : "#fff"} stroke={ink} strokeWidth={6} />
            </g>
            <g transform={`translate(${X0 + 150} ${mid + 106}) rotate(-90) scale(0.7071)`} opacity={ramp(t, c[2] + 2.3, c[2] + 2.9)}>
              <rect x={-150} y={-212} width={300} height={424} fill="none" stroke={orange} strokeWidth={10} strokeDasharray="1 0" />
            </g>
            <Scrawl x={950} y={760} size={46} fill={teal} o={vis(t, c[1] + 0.6)} t0={c[1] + 0.6}>
              {t < c[2] ? "your desk" : "same shape"}
            </Scrawl>
          </G>
          <ObjectCard x={1520} y={500} w={560} h={450} tab="THE QUESTION" t0={c[2] + 0.15} o={k(2)}>
            <text y={10} textAnchor="middle" dominantBaseline="central" fontFamily={"Georgia, Cambria, serif"} fontWeight={700} fontSize={150} fill={orange}>
              WHY?
            </text>
            <Scrawl x={0} y={140} size={36} fill={teal} o={vis(t, c[2] + 1.4)} t0={c[2] + 1.4}>
              the shape stays the same
            </Scrawl>
          </ObjectCard>
        </Cam>
        <Cam dur={dur} z0={1} z1={1.05} dx={10} amt={1.3}>
          <Mascot x={260} y={866} s={1.25} mood={moodAt(t, [[c[1], "happy"], [c[2] + 2.4, "curious"], [1e9, "thinking"]])} arm={t < c[1] || t >= c[2] ? "point" : "down"} look={[10, 0]} />
        </Cam>
      </SvgFrame>
    </>
  );
};

export const SCENES021V2: Record<string, React.FC<SceneProps>> = {
  hook: SceneHook,
  cause: SceneCause,
  race: SceneRace,
  count: SceneCount,
  rumble: SceneRumble,
  warning: SceneWarning,
  close: SceneClose,
};
