import React from "react";
import { vis } from "../components/ui";
import { lerp, ramp } from "../utils/anim";
import type { SceneProps } from "./scenes";
import { Chips, Note } from "./scenes011";
import { Map as GenericMap, Sheet } from "./scenes015";
import { Arrow, Calendar, G, GOLD, GREY, ink, orange, Person, Plaque, RED, SAND, seg, SimpleNote, SOFT, Speech, Stamp, SvgFrame, teal, Txt, useT, WARM } from "./kit";

/* ------------------------------------------------------------------ piezas genericas (sin marcas) */
/** Posicion de un jack en el panel (rows x 4). */
const jp = (px: number, py: number, s: number, r: number, c: number): [number, number] => [px + (-195 + 130 * c) * s, py + (-200 + 100 * r) * s];

/** Panel vertical de centralita: 5 filas de jacks con lamparas. lamps["r,c"] = 0..1. */
const Panel: React.FC<{ x: number; y: number; s?: number; o?: number; lamps?: Record<string, number> }> = ({ x, y, s = 1, o = 1, lamps = {} }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-260} y={-290} width={520} height={580} rx={20} fill={SAND} fillOpacity={0.55} stroke={ink} strokeWidth={8} />
    {Array.from({ length: 5 }, (_, r) =>
      Array.from({ length: 4 }, (_, c) => {
        const on = lamps[`${r},${c}`] ?? 0;
        const [jx, jy] = [-195 + 130 * c, -200 + 100 * r];
        return (
          <G key={`${r}${c}`}>
            {on > 0 && <circle cx={jx} cy={jy - 34} r={26} fill={GOLD} fillOpacity={0.5 * on} />}
            <circle cx={jx} cy={jy - 34} r={11} fill={on > 0 ? GOLD : "#fff"} stroke={ink} strokeWidth={4} />
            <circle cx={jx} cy={jy} r={17} fill="#fff" stroke={ink} strokeWidth={6} />
            <circle cx={jx} cy={jy} r={6} fill={ink} />
          </G>
        );
      }),
    )}
  </G>
);

/** Silueta neutra con auriculares. */
const Operator: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <Person x={0} y={0} body={SOFT} />
    <path d="M-31 -104 A31 31 0 0 1 31 -104" fill="none" stroke={ink} strokeWidth={7} strokeLinecap="round" />
    <rect x={-40} y={-112} width={14} height={30} rx={6} fill={teal} stroke={ink} strokeWidth={4} />
    <rect x={26} y={-112} width={14} height={30} rx={6} fill={teal} stroke={ink} strokeWidth={4} />
    <path d="M-33 -84 Q-30 -62 -4 -68" fill="none" stroke={ink} strokeWidth={5} strokeLinecap="round" />
  </G>
);

/** Telefono de pared generico, sin dial. lift 0..1 (auricular levantado), crank (manivela), ring (ondas). */
const Phone: React.FC<{ x: number; y: number; s?: number; o?: number; lift?: number; crank?: number; ring?: number; t?: number }> = ({ x, y, s = 1, o = 1, lift = 0, crank, ring = 0, t = 0 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-60} y={-100} width={120} height={200} rx={16} fill={SAND} stroke={ink} strokeWidth={7} />
    {[-26, 26].map((bx) => (
      <circle key={bx} cx={bx} cy={-62} r={22} fill={GOLD} stroke={ink} strokeWidth={5} />
    ))}
    <circle cx={0} cy={-6} r={16} fill="#fff" stroke={ink} strokeWidth={5} />
    <line x1={0} y1={10} x2={0} y2={60} stroke={ink} strokeWidth={6} />
    <G x={lift * 30} y={-lift * 20} rot={-lift * 35}>
      <rect x={66} y={-40} width={22} height={100} rx={11} fill="#fff" stroke={ink} strokeWidth={5} />
    </G>
    {crank !== undefined && (
      <G x={-60} y={10} rot={crank}>
        <line x1={0} y1={0} x2={-34} y2={0} stroke={ink} strokeWidth={7} strokeLinecap="round" />
        <circle cx={-40} cy={0} r={9} fill={orange} stroke={ink} strokeWidth={4} />
      </G>
    )}
    {ring > 0 &&
      [0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${100 + i * 24} ${-60 - i * 18} Q${130 + i * 24} -20 ${100 + i * 24} ${20 + i * 18}`}
          fill="none"
          stroke={orange}
          strokeWidth={6}
          strokeLinecap="round"
          opacity={ring * (Math.floor(t * 3) % 3 === i ? 1 : 0.35)}
        />
      ))}
  </G>
);

const House: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-90 -70 L0 -150 L90 -70 Z" fill={WARM} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
    <rect x={-75} y={-70} width={150} height={120} fill="#fff" stroke={ink} strokeWidth={6} />
    <rect x={-16} y={-10} width={32} height={60} fill={SOFT} stroke={ink} strokeWidth={4} />
  </G>
);

/** Reloj con sector relleno (wedge en grados) y aguja. */
const Clock: React.FC<{ x: number; y: number; r?: number; angle: number; wedge?: number; o?: number }> = ({ x, y, r = 170, angle, wedge = 0, o = 1 }) => {
  const rad = (a: number) => ((a - 90) * Math.PI) / 180;
  const ex = Math.cos(rad(wedge)) * r;
  const ey = Math.sin(rad(wedge)) * r;
  return (
    <G x={x} y={y} o={o}>
      {wedge > 0 && <path d={`M0 0 L0 ${-r} A${r} ${r} 0 ${wedge > 180 ? 1 : 0} 1 ${ex} ${ey} Z`} fill={orange} fillOpacity={0.35} />}
      <circle r={r} fill="none" stroke={ink} strokeWidth={9} />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={0} y1={-r + 10} x2={0} y2={-r + 28} stroke={ink} strokeWidth={5} transform={`rotate(${i * 30})`} />
      ))}
      <line x1={0} y1={0} x2={0} y2={-r + 40} stroke={orange} strokeWidth={10} strokeLinecap="round" transform={`rotate(${angle})`} />
      <circle r={12} fill={ink} />
    </G>
  );
};

/** Banco de contactos 10x10 con carro (r = nivel, c = contacto, fraccionarios). */
const Bank: React.FC<{ x: number; y: number; s?: number; o?: number; r?: number; c?: number }> = ({ x, y, s = 1, o = 1, r = 9, c = 0 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-215} y={-165} width={375} height={330} rx={14} fill="#fff" stroke={ink} strokeWidth={7} />
    {Array.from({ length: 100 }, (_, i) => (
      <circle key={i} cx={-135 + (i % 10) * 30} cy={-135 + Math.floor(i / 10) * 30} r={7} fill={Math.abs(Math.floor(i / 10) - r) < 0.5 && Math.abs((i % 10) - c) < 0.5 ? orange : "#C9D1D9"} />
    ))}
    <line x1={-185} y1={-150} x2={-185} y2={150} stroke={GREY} strokeWidth={8} strokeLinecap="round" />
    <rect x={-199} y={-135 + r * 30 - 12} width={28} height={24} rx={5} fill={orange} stroke={ink} strokeWidth={4} />
    <line x1={-171} y1={-135 + r * 30} x2={-135 + c * 30} y2={-135 + r * 30} stroke={orange} strokeWidth={5} strokeLinecap="round" />
  </G>
);

const along = (pts: [number, number][], u: number): [number, number] => {
  const n = pts.length - 1;
  const f = Math.min(Math.max(u, 0), 0.9999) * n;
  const i = Math.floor(f);
  const q = f - i;
  return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * q, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * q];
};

const Pin: React.FC<{ x: number; y: number; o?: number }> = ({ x, y, o = 1 }) => (
  <G x={x} y={y} o={o}>
    <path d="M0 0 C-30 -40 -28 -70 0 -70 C28 -70 30 -40 0 0Z" fill={orange} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
    <circle cy={-48} r={9} fill="#fff" />
  </G>
);

/** Cordones entre dos jacks (a, b): mitad teal (answer) y mitad naranja (ring), o ambos tinta. */
const Cords: React.FC<{ a: [number, number]; b: [number, number]; shelf: number; color?: boolean; o?: number }> = ({ a, b, shelf, color = true, o = 1 }) => {
  const mx = (a[0] + b[0]) / 2;
  return (
    <G o={o}>
      <path d={`M${a[0]} ${a[1]} Q${a[0]} ${shelf} ${mx} ${shelf}`} fill="none" stroke={color ? teal : ink} strokeWidth={9} strokeLinecap="round" />
      <path d={`M${mx} ${shelf} Q${b[0]} ${shelf} ${b[0]} ${b[1]}`} fill="none" stroke={color ? orange : ink} strokeWidth={9} strokeLinecap="round" />
      {[a, b].map(([px, py], i) => (
        <rect key={i} x={px - 9} y={py - 14} width={18} height={44} rx={6} fill="#fff" stroke={ink} strokeWidth={5} />
      ))}
    </G>
  );
};

const Mobile: React.FC<{ x: number; y: number; s?: number; o?: number; name: string }> = ({ x, y, s = 1, o = 1, name }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-80} y={-150} width={160} height={300} rx={26} fill="#fff" stroke={ink} strokeWidth={8} />
    <rect x={-62} y={-120} width={124} height={220} rx={10} fill="#EAF3F3" />
    <rect x={-50} y={-90} width={100} height={46} rx={10} fill="#fff" stroke={teal} strokeWidth={4} />
    <Txt x={0} y={-66} size={28} weight={700}>
      {name}
    </Txt>
    <circle cy={125} r={9} fill={GREY} />
  </G>
);

/* ------------------------------------------------------------------ hook (0-2) */
const SceneHook: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const plug = ramp(t, c[0] + 0.6, c[0] + 3.0);
  const [jx, jy] = jp(1380, 480, 0.8, 2, 1);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Phone x={340} y={500} s={1.3} />
          <path d="M440 560 C700 700 900 680 1120 640" fill="none" stroke={ink} strokeWidth={9} strokeLinecap="round" />
          <Panel x={1380} y={480} s={0.8} />
          <G x={lerp(1120, jx, plug)} y={lerp(640, jy + 10, plug)}>
            <rect x={-9} y={-22} width={18} height={44} rx={6} fill="#fff" stroke={ink} strokeWidth={5} />
          </G>
          <Note x={900} y={745} text="a person, a plug, a cable" o={vis(t, c[0] + 1.6)} size={40} fill={teal} />
        </G>
        <G o={k(1)}>
          <Phone x={380} y={500} s={1.3} />
          <Operator x={1000} y={680} s={1.5} />
          <Speech x={1480} y={330} text="5-4-1" size={64} o={vis(t, c[1] + 1.6)} />
          <Note x={380} y={680} text="no dial" o={vis(t, c[1] + 0.6)} size={44} fill={RED} />
          <Note x={1000} y={745} text="someone who heard you say a number" o={vis(t, c[1] + 2.4)} size={38} fill={ink} />
        </G>
        <G o={k(2)}>
          <Txt x={760} y={340} size={280} serif>
            WHY
          </Txt>
          <Txt x={1170} y={330} size={280} serif fill={orange}>
            ?
          </Txt>
          <Panel x={960} y={610} s={0.36} />
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["A PERSON, A PLUG"], ["JUST A VOICE"], ["WHY?", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ manual (3-8) */
const SceneManual: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const lamp = ramp(t, c[2] + 2.0, c[2] + 2.5);
  const pa = jp(960, 420, 0.8, 2, 1);
  const pb = jp(960, 420, 0.8, 3, 2);
  const sig = (t * 0.5) % 1;
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <GenericMap
            x={560}
            y={470}
            w={620}
            h={420}
            dots={[
              [-160, -80, teal],
              [60, 60, teal],
              [190, -100, teal],
            ]}
          />
          {[
            [-160, -80],
            [60, 60],
            [190, -100],
          ].map(([dx, dy], i) => (
            <Txt key={i} x={560 + dx + 40} y={470 + dy - 10} size={44} weight={800} fill={orange}>
              ?
            </Txt>
          ))}
          <Stamp x={1340} y={320} text="SEVERAL CLAIMS" o={vis(t, c[0] + 0.8)} size={48} color={orange} rot={-3} />
          <Txt x={1340} y={500} size={110} serif>
            1877-1878
          </Txt>
          <Note x={1340} y={590} text="the earliest dates" o={vis(t, c[0] + 2.4)} size={40} fill={teal} />
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[0] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(1)}>
          {[0, 1, 2].map((r) => {
            const [jx, jy] = jp(1100, 440, 0.85, r + 1, 0);
            const hy = 230 + r * 170;
            return (
              <G key={r} o={vis(t, c[1] + 0.6 + r * 0.7)}>
                <House x={380} y={hy + 40} s={0.8} />
                <path d={`M460 ${hy + 60} C700 ${hy + 60} 800 ${jy} ${jx} ${jy}`} fill="none" stroke={ink} strokeWidth={7} strokeLinecap="round" />
              </G>
            );
          })}
          <Panel x={1100} y={440} s={0.85} />
          <Note x={1100} y={735} text="each phone line ended in a jack" o={vis(t, c[1] + 2.4)} size={38} fill={ink} />
          <Note x={440} y={735} text="Wikipedia" o={vis(t, c[1] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(2)}>
          <Phone x={380} y={520} s={1.3} lift={ramp(t, c[2] + 0.6, c[2] + 1.6)} />
          <path d="M460 580 C640 640 800 520 952 468" fill="none" stroke={ink} strokeWidth={8} strokeLinecap="round" />
          <Panel x={1200} y={470} s={0.85} lamps={{ "1,0": lamp }} />
          <Note x={380} y={700} text="the caller lifts the receiver" o={vis(t, c[2] + 0.8)} size={36} fill={teal} />
          <Note x={1200} y={735} text="a lamp lights up" o={vis(t, c[2] + 2.4)} size={40} fill={orange} />
          <Note x={1700} y={735} text="Wikipedia" o={vis(t, c[2] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(3)}>
          <Operator x={620} y={700} s={1.6} />
          <Speech x={1000} y={330} text="NUMBER, PLEASE?" size={56} o={vis(t, c[3] + 1.0)} />
          <Panel x={1560} y={520} s={0.7} lamps={{ "1,0": 1 }} />
          <Note x={960} y={740} text="Wikipedia (Telephone exchange)" o={vis(t, c[3] + 0.6)} size={34} fill={teal} />
        </G>
        <G o={k(4)}>
          <Panel x={960} y={420} s={0.8} />
          <Cords a={pa} b={pb} shelf={700} color={false} o={vis(t, c[4] + 0.8)} />
          <circle
            {...(() => {
              const m = along([pa, [pa[0], 690], [(pa[0] + pb[0]) / 2, 700], [pb[0], 690], pb], sig);
              return { cx: m[0], cy: m[1] };
            })()}
            r={11}
            fill={GOLD}
            stroke={ink}
            strokeWidth={4}
            opacity={vis(t, c[4] + 1.6)}
          />
          <Note x={1500} y={430} text="two plugs joined by cords" o={vis(t, c[4] + 1.0)} size={40} fill={teal} />
          <Note x={1500} y={735} text="Wikipedia" o={vis(t, c[4] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(5)}>
          <Panel x={700} y={420} s={0.8} />
          <Cords a={jp(700, 420, 0.8, 2, 1)} b={jp(700, 420, 0.8, 3, 2)} shelf={690} />
          <Txt x={560} y={745} size={40} weight={800} fill={teal}>
            ANSWER
          </Txt>
          <Txt x={830} y={745} size={40} weight={800} fill={orange}>
            RING
          </Txt>
          <Arrow x1={1000} y1={620} x2={1280} y2={540} color={orange} w={8} o={vis(t, c[5] + 1.6)} />
          <Phone x={1560} y={500} s={1.3} ring={vis(t, c[5] + 1.6)} t={t} />
          <Note x={1560} y={690} text="a far phone rings" o={vis(t, c[5] + 1.8)} size={36} fill={ink} />
          <Note x={1100} y={735} text="Wikipedia" o={vis(t, c[5] + 0.6)} size={36} fill={teal} />
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["FIRST EXCHANGES"], ["A PANEL OF JACKS"], ["LAMP ON"], ["NUMBER, PLEASE?"], ["PLUGS AND CORDS"], ["ANSWER AND RING"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ longdistance (9-13) */
const SceneLong: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const sw1 = ramp(t, c[1] + 0.8, c[1] + 4.0);
  const sw2 = ramp(t, c[2] + 0.8, c[2] + 5.2);
  const env = ramp(t, c[4] + 1.6, c[4] + 5.4);
  const road = (x: number) => 560 + 50 * Math.sin(x / 140);
  const ex = lerp(300, 1560, env);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Operator x={280} y={700} s={1.2} />
          <Panel x={560} y={470} s={0.5} />
          <line x1={700} y1={470} x2={1220} y2={470} stroke={GREY} strokeWidth={26} strokeLinecap="round" />
          <Txt x={960} y={420} size={44} weight={800}>
            TRUNK
          </Txt>
          <Panel x={1360} y={470} s={0.5} />
          <Operator x={1640} y={700} s={1.2} />
          <Note x={960} y={665} text="another town, another operator" o={vis(t, c[0] + 1.6)} size={40} fill={teal} />
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[0] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(1)}>
          <Clock x={520} y={480} angle={sw1 * 90} wedge={sw1 * 90} />
          <Plaque x={1300} y={420} text="1918: ABOUT 15 MIN (AVERAGE)" sans w={880} o={vis(t, c[1] + 0.6)} />
          <Note x={1300} y={560} text="to complete a long-distance call" o={vis(t, c[1] + 1.8)} size={40} fill={ink} />
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[1] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(2)}>
          <Clock x={520} y={480} angle={sw2 * 720} wedge={sw2 >= 1 ? 359.9 : 360 * ((sw2 * 2) % 1)} />
          <Stamp x={1280} y={340} text="UP TO 2 HOURS (1943)" o={vis(t, c[2] + 0.8)} size={48} color={orange} rot={-3} />
          <G x={1000} y={560} o={vis(t, c[2] + 3.0)}>
            <circle r={44} fill="#fff" stroke={teal} strokeWidth={7} />
            <path d="M0 -26 L8 -8 L28 -8 L12 4 L18 24 L0 12 L-18 24 L-12 4 L-28 -8 L-8 -8 Z" fill={teal} />
          </G>
          <Note x={1280} y={560} text="military calls first" o={vis(t, c[2] + 3.0)} size={40} fill={teal} />
          <Note x={1280} y={640} text="some calls, manual trunks" o={vis(t, c[2] + 4.6)} size={36} fill={ink} />
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[2] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(3)}>
          {["BILLING", "BUSY-LINE CHECKS", "EMERGENCY CALLS"].map((label, i) => (
            <G key={label} x={480 + i * 480} y={450} o={vis(t, c[3] + 0.6 + i * 1.3)}>
              <rect x={-190} y={-170} width={380} height={340} rx={14} fill="#fff" stroke={ink} strokeWidth={6} />
              {i === 0 && <Sheet x={0} y={-25} w={170} h={280} lines={2} />}
              {i === 1 && (
                <>
                  <Phone x={0} y={-10} s={0.9} />
                  <circle cx={0} cy={-10} r={90} fill="none" stroke={RED} strokeWidth={10} />
                  <line x1={-64} y1={-74} x2={64} y2={54} stroke={RED} strokeWidth={10} />
                </>
              )}
              {i === 2 && (
                <>
                  <circle cx={0} cy={-20} r={80} fill={RED} fillOpacity={0.15} stroke={RED} strokeWidth={8} />
                  <rect x={-8} y={-62} width={16} height={60} rx={6} fill={RED} />
                  <circle cx={0} cy={22} r={10} fill={RED} />
                </>
              )}
              <Txt x={0} y={150} size={28} weight={800}>
                {label}
              </Txt>
            </G>
          ))}
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[3] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(4)}>
          <Stamp x={960} y={230} text="OUR READING: AN INFERENCE" o={vis(t, c[4] + 0.6)} size={44} pad={80} color={teal} rot={-2} />
          <path d={Array.from({ length: 40 }, (_, i) => `${i ? "L" : "M"}${300 + i * 33} ${road(300 + i * 33)}`).join(" ")} fill="none" stroke={teal} strokeWidth={14} strokeLinecap="round" />
          <path d={Array.from({ length: 40 }, (_, i) => `${i ? "L" : "M"}${300 + i * 33} ${road(300 + i * 33) + 18}`).join(" ")} fill="none" stroke={orange} strokeWidth={8} strokeLinecap="round" />
          <G x={ex} y={road(ex) - 52} o={vis(t, c[4] + 1.0)}>
            <rect x={-46} y={-30} width={92} height={60} rx={6} fill="#fff" stroke={ink} strokeWidth={5} />
            <path d="M-46 -30 L0 6 L46 -30" fill="none" stroke={ink} strokeWidth={4} />
          </G>
          <Note x={300} y={700} text="the number = the address" o={vis(t, c[4] + 1.4)} size={38} fill={ink} />
          <Note x={1560} y={700} text="the cords = the road" o={vis(t, c[4] + 3.0)} size={38} fill={teal} />
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["TRUNK LINES"], ["1918"], ["1943"], ["MORE THAN CONNECTING"], ["OUR READING", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ automatic (14-20) */
const SceneAutomatic: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const fade = ramp(t, c[0] + 0.6, c[0] + 2.4);
  const lv = ramp(t, c[4] + 1.6, c[4] + 3.6);
  const rot = ramp(t, c[4] + 4.6, c[4] + 6.4);
  const bal = 10 * Math.sin(t * 1.4);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Panel x={960} y={470} s={0.8} o={1 - fade} />
          <Bank x={1000} y={440} s={1.4} r={4 + 3 * Math.sin(t * 2)} c={5 + 3 * Math.cos(t * 1.7)} o={fade} />
          <Note x={960} y={735} text="the automatic exchange" o={vis(t, c[0] + 1.6)} size={42} fill={teal} />
        </G>
        <G o={k(1)}>
          <Person x={460} y={610} s={1.5} body={SOFT} />
          <Txt x={460} y={690} size={50} serif>
            Almon Strowger
          </Txt>
          <Calendar x={1000} y={400} month="" year="1888" o={vis(t, c[1] + 2.4)} />
          <Note x={1000} y={620} text="the idea" o={vis(t, c[1] + 2.6)} size={40} fill={teal} />
          <Sheet x={1520} y={420} w={340} h={440} title="PATENT" size={50} lines={3} o={vis(t, c[1] + 4.6)} />
          <Stamp x={1520} y={560} text="1891" o={vis(t, c[1] + 5.2)} size={60} color={orange} rot={-8} />
          <Note x={1520} y={680} text="awarded" o={vis(t, c[1] + 5.2)} size={40} fill={teal} />
          <Note x={460} y={745} text="an undertaker" o={vis(t, c[1] + 0.8)} size={38} fill={ink} />
          <Note x={1000} y={735} text="Wikipedia" o={vis(t, c[1] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(2)}>
          <Person x={520} y={680} s={1.5} body={SOFT} />
          {[-30, 0, 30].map((a) => (
            <line
              key={a}
              x1={520 + a * 1.4}
              y1={520 - Math.abs(a) * 0.4}
              x2={520 + a * 2.2}
              y2={490 - Math.abs(a) * 0.6}
              stroke={RED}
              strokeWidth={7}
              strokeLinecap="round"
              opacity={vis(t, c[2] + 1.0)}
            />
          ))}
          <Phone x={1000} y={500} s={1.3} />
          <Stamp x={1450} y={320} text="HIS BELIEF" o={vis(t, c[2] + 0.8)} size={52} color={orange} rot={-3} />
          <Note x={1450} y={540} text="operators were interfering" o={vis(t, c[2] + 2.2)} size={40} fill={ink} />
          <Note x={1450} y={600} text="with his calls" o={vis(t, c[2] + 2.2)} size={40} fill={ink} />
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[2] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(3)}>
          <Stamp x={500} y={250} text="RIVAL ACCOUNT" o={vis(t, c[3] + 0.8)} size={44} color={teal} rot={-3} />
          <path d="M240 520 Q480 470 720 520" fill="none" stroke={ink} strokeWidth={6} />
          <line x1={300} y1={420} x2={300} y2={700} stroke={ink} strokeWidth={9} />
          <G x={440} y={510} rot={-8} o={vis(t, c[3] + 1.4)}>
            <rect x={-90} y={-120} width={180} height={110} rx={8} fill={GREY} fillOpacity={0.5} stroke={ink} strokeWidth={6} />
            {[-70, -40, -10].map((ly) => (
              <line key={ly} x1={-60} y1={ly} x2={60} y2={ly} stroke={ink} strokeWidth={4} opacity={0.5} />
            ))}
          </G>
          <Note x={930} y={735} text="Wikipedia" o={vis(t, c[3] + 0.6)} size={36} fill={teal} />
          <Note x={500} y={730} text="a telephone company manager, 1913" o={vis(t, c[3] + 1.8)} size={34} fill={ink} />
          <path d="M1300 560 L1260 700 H1340 Z" fill={SAND} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
          <G x={1300} y={520} rot={bal} o={vis(t, c[3] + 3.4)}>
            <line x1={-240} y1={0} x2={240} y2={0} stroke={ink} strokeWidth={8} strokeLinecap="round" />
            {[-240, 240].map((cx) => (
              <G key={cx} x={cx} y={0} rot={-bal}>
                <line x1={0} y1={0} x2={-50} y2={80} stroke={ink} strokeWidth={4} />
                <line x1={0} y1={0} x2={50} y2={80} stroke={ink} strokeWidth={4} />
                <path d="M-66 80 H66 Q50 120 0 120 Q-50 120 -66 80 Z" fill={SOFT} stroke={ink} strokeWidth={5} />
              </G>
            ))}
          </G>
          <Txt x={1150} y={720} size={30} weight={700} fill={orange}>
            HIS BELIEF
          </Txt>
          <Txt x={1540} y={720} size={30} weight={700} fill={teal}>
            RIVAL ACCOUNT
          </Txt>
          <Stamp x={1300} y={330} text="DISPUTED" o={vis(t, c[3] + 5.2)} size={60} color={orange} rot={-3} />
        </G>
        <G o={k(4)}>
          <G x={400} y={480} o={vis(t, c[4] + 0.4)}>
            <circle r={150} fill="#fff" stroke={ink} strokeWidth={8} />
            {Array.from({ length: 10 }, (_, i) => (
              <circle key={i} cx={Math.cos(((i * 28 + 40) * Math.PI) / 180) * 100} cy={Math.sin(((i * 28 + 40) * Math.PI) / 180) * 100} r={20} fill={SOFT} stroke={ink} strokeWidth={4} />
            ))}
            <circle r={36} fill={SAND} stroke={ink} strokeWidth={5} />
          </G>
          <Txt x={400} y={680} size={44} weight={800} fill={teal} spacing={4}>
            {Math.floor(t * 4) % 2 ? "tic tic tic" : "tic  tic  tic"}
          </Txt>
          <Arrow x1={600} y1={480} x2={840} y2={480} color={orange} w={10} o={vis(t, c[4] + 0.8)} />
          <Bank x={1200} y={440} s={1.25} r={9 - 6 * lv} c={lerp(0, 6, rot)} />
          <Note x={1200} y={700} text={rot > 0 ? "then around to the right contact" : "up to the right level"} o={vis(t, c[4] + 1.4)} size={40} fill={orange} />
          <Note x={1750} y={735} text="Wikipedia" o={vis(t, c[4] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(5)}>
          <Bank x={500} y={420} s={0.8} />
          <Arrow x1={720} y1={420} x2={800} y2={420} color={orange} w={8} />
          {[0, 1, 2].map((i) => (
            <Bank key={i} x={1040} y={250 + i * 170} s={0.42} o={vis(t, c[5] + 0.8)} />
          ))}
          <Arrow x1={1150} y1={420} x2={1220} y2={420} color={orange} w={8} o={vis(t, c[5] + 1.6)} />
          {Array.from({ length: 9 }, (_, i) => (
            <Bank key={i} x={1480 + (i % 3) * 170 - 170} y={320 + Math.floor(i / 3) * 150} s={0.27} o={vis(t, c[5] + 2.0)} />
          ))}
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[5] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(6)}>
          <GenericMap x={560} y={460} w={640} h={420} dots={[[0, 0, orange]]} />
          <Pin x={560} y={440} o={vis(t, c[6] + 1.0)} />
          <Txt x={560} y={500} size={36} weight={800}>
            La Porte, Indiana
          </Txt>
          <Txt x={1340} y={380} size={170} serif>
            1892
          </Txt>
          <Stamp x={1340} y={550} text="ABOUT 75 SUBSCRIBERS" o={vis(t, c[6] + 3.6)} size={40} color={teal} rot={-3} />
          <Note x={1340} y={650} text="the company's first commercial exchange" o={vis(t, c[6] + 2.4)} size={38} fill={ink} />
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[6] + 0.6)} size={36} fill={teal} />
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["THE AUTOMATIC EXCHANGE"], ["ALMON STROWGER"], ["HIS BELIEF"], ["RIVAL ACCOUNT"], ["THE DIAL AND THE SHAFT"], ["MORE STAGES"], ["LA PORTE, 1892"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ fading (21-22) */
const SceneFading: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <line x1={300} y1={640} x2={1620} y2={640} stroke={ink} strokeWidth={6} />
          <line x1={300} y1={640} x2={300} y2={240} stroke={ink} strokeWidth={6} />
          {[0, 1, 2, 3].map((i) => (
            <G key={i} o={vis(t, c[0] + 0.8 + i * 0.5)}>
              <rect x={420 + i * 120} y={640 - (100 + i * 80)} width={80} height={100 + i * 80} fill={teal} stroke={ink} strokeWidth={4} />
              <rect x={1000 + i * 120} y={640 - (340 - i * 80)} width={80} height={340 - i * 80} fill={orange} stroke={ink} strokeWidth={4} />
            </G>
          ))}
          <Txt x={660} y={690} size={38} weight={800} fill={teal}>
            MORE CALLS
          </Txt>
          <Txt x={1240} y={690} size={38} weight={800} fill={orange}>
            FEWER OPERATOR POSITIONS
          </Txt>
          <Note x={1750} y={735} text="Wikipedia" o={vis(t, c[0] + 0.6)} size={36} fill={teal} />
          <Note x={960} y={735} text="schematic, no data" o={vis(t, c[0] + 1.4)} size={34} fill={ink} />
        </G>
        <G o={k(1)}>
          <Phone x={340} y={440} s={1.3} crank={t * 200} />
          <GenericMap x={960} y={420} w={460} h={340} dots={[[40, -20, orange]]} />
          <Pin x={1000} y={400} o={vis(t, c[1] + 3.0)} />
          <Txt x={960} y={500} size={36} weight={800}>
            Maine
          </Txt>
          <Txt x={960} y={640} size={80} serif fill={orange}>
            1983
          </Txt>
          <Panel x={1560} y={420} s={0.5} o={vis(t, c[1] + 6.4)} />
          <Txt x={1560} y={640} size={80} serif fill={teal}>
            {t > c[1] + 6.4 ? "1991" : ""}
          </Txt>
          <Note x={340} y={610} text="hand-crank phone" o={vis(t, c[1] + 0.8)} size={36} fill={ink} />
          <Note x={1560} y={715} text="some manual switchboards" o={vis(t, c[1] + 6.6)} size={34} fill={ink} />
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[1] + 0.6)} size={36} fill={teal} />
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["FEWER OPERATORS"], ["OUR READING", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ today (23-25) */
const NET: [number, number][] = [
  [520, 500],
  [760, 380],
  [760, 620],
  [1060, 380],
  [1060, 620],
  [1300, 500],
  [1500, 500],
];
const LINKS = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4],
  [3, 5],
  [4, 5],
  [1, 4],
  [5, 6],
];
const PATH: [number, number][] = [NET[0], NET[2], NET[4], NET[5], NET[6]];
const Network: React.FC<{ t: number; o?: number; packets?: boolean }> = ({ t, o = 1, packets = true }) => (
  <G o={o}>
    {LINKS.map(([a, b], i) => (
      <line key={i} x1={NET[a][0]} y1={NET[a][1]} x2={NET[b][0]} y2={NET[b][1]} stroke={GREY} strokeWidth={6} />
    ))}
    {NET.map(([nx, ny], i) => (
      <circle key={i} cx={nx} cy={ny} r={i === 0 || i === 6 ? 0 : 22} fill="#fff" stroke={ink} strokeWidth={6} />
    ))}
    {packets &&
      [0, 1, 2].map((i) => {
        const [px, py] = along(PATH, ((t * 0.3 + i / 3) % 1) * 1);
        return <rect key={i} x={px - 14} y={py - 14} width={28} height={28} rx={5} fill={[teal, orange, GOLD][i]} stroke={ink} strokeWidth={4} />;
      })}
  </G>
);

const SceneToday: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const wave = (x: number) => 450 + 120 * Math.sin((x + t * 80) / 110) * Math.cos((x + t * 80) / 330);
  const xs = Array.from({ length: 34 }, (_, i) => 300 + i * 40);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Plaque x={960} y={220} text="8,000 SAMPLES PER SECOND" sans w={980} o={vis(t, c[0] + 0.6)} />
          <path d={Array.from({ length: 133 }, (_, i) => `${i ? "L" : "M"}${300 + i * 10} ${wave(300 + i * 10)}`).join(" ")} fill="none" stroke={ink} strokeWidth={5} opacity={0.5} />
          <G o={vis(t, c[0] + 1.6)}>
            {xs.map((x) => (
              <G key={x}>
                <line x1={x} y1={450} x2={x} y2={wave(x)} stroke={teal} strokeWidth={10} strokeLinecap="round" />
                <circle cx={x} cy={wave(x)} r={8} fill={orange} />
              </G>
            ))}
          </G>
          <Note x={960} y={680} text="each voice call, sliced into tiny samples" o={vis(t, c[0] + 3.4)} size={40} fill={ink} />
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[0] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(1)}>
          <Phone x={380} y={500} s={1.1} />
          <Phone x={1580} y={500} s={1.1} />
          <Network t={t} />
          <Note x={960} y={690} text="switches handle the data packets in between" o={vis(t, c[1] + 1.0)} size={40} fill={ink} />
          <Note x={1750} y={735} text="Wikipedia" o={vis(t, c[1] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(2)}>
          <Stamp x={960} y={220} text="OUR READING: AN INFERENCE" o={vis(t, c[2] + 0.6)} size={44} pad={80} color={teal} rot={-2} />
          <Operator x={560} y={640} s={1.5} o={1 - 0.6 * ramp(t, c[2] + 2.4, c[2] + 3.4)} />
          <Arrow x1={800} y1={500} x2={1100} y2={500} color={orange} w={10} o={vis(t, c[2] + 2.0)} />
          <G x={1380} y={480} o={vis(t, c[2] + 2.4)}>
            <rect x={-160} y={-130} width={320} height={260} rx={18} fill="#fff" stroke={ink} strokeWidth={7} />
            <Txt x={0} y={30} size={150} weight={800} fill={orange}>
              {"{ }"}
            </Txt>
          </G>
          <Note x={1380} y={680} text="a program that picks the path" o={vis(t, c[2] + 3.6)} size={40} fill={teal} />
          <Note x={560} y={715} text="the operator's hand" o={vis(t, c[2] + 2.0)} size={36} fill={ink} />
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["DIGITAL EXCHANGES"], ["PACKETS"], ["OUR READING", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ close (26-28) */
const SceneClose: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const rip = (i: number) => (t * 0.5 + i / 3) % 1;
  const water = Array.from({ length: 49 }, (_, i) => `${i ? "L" : "M"}${i * 40} ${640 + 8 * Math.sin(i * 0.9 + t * 1.5)}`).join(" ");
  const legs = [
    [-80, 60],
    [-30, 70],
    [90, 70],
    [150, 58],
  ];
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Mobile x={420} y={470} s={1.3} name="Sam" />
          <Network t={t} />
          <Mobile x={1700} y={470} s={1.1} name="Alex" />
          <Note x={960} y={735} text="a switch somewhere does what a hand once did" o={vis(t, c[0] + 1.6)} size={40} fill={teal} />
        </G>
        <G o={k(1)}>
          <path d={`${water} V1080 H0 Z`} fill={teal} fillOpacity={0.18} />
          <path d={water} fill="none" stroke={teal} strokeWidth={8} />
          {[0, 1, 2].map((i) => (
            <ellipse key={i} cx={960} cy={648} rx={80 + rip(i) * 400} ry={6 + rip(i) * 26} fill="none" stroke={teal} strokeWidth={4} opacity={1 - rip(i)} />
          ))}
          <Note x={960} y={400} text="a pond, on a calm day" o={vis(t, c[1] + 1.0)} size={56} fill={ink} />
        </G>
        <G o={k(2)}>
          <path d={`${water} V1080 H0 Z`} fill={teal} fillOpacity={0.18} />
          <path d={water} fill="none" stroke={teal} strokeWidth={8} />
          <G x={960} y={590}>
            {[-1, 1].map((sd) =>
              legs.map(([lx, ly], i) => (
                <G key={`${sd}${i}`}>
                  <path
                    d={`M${sd * 16} 0 L${sd * (Math.abs(lx) * 0.6)} ${-30} L${sd * Math.abs(lx) * 1.5} ${ly}`}
                    fill="none"
                    stroke={ink}
                    strokeWidth={5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <ellipse cx={sd * Math.abs(lx) * 1.5} cy={ly + 6} rx={16} ry={5} fill="none" stroke={teal} strokeWidth={4} />
                </G>
              )),
            )}
            <ellipse rx={50} ry={16} fill={ink} />
            <circle cx={52} cy={-4} r={10} fill={ink} />
          </G>
          <Txt x={960} y={290} size={240} serif fill={orange}>
            WHY?
          </Txt>
          <Note x={960} y={745} text="a tiny insect, and it does not sink" o={vis(t, c[2] + 1.2)} size={40} fill={ink} />
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["OUR READING", true], ["A QUIET POND"], ["WHY?", true]]} />
    </>
  );
};

export const SCENES019: Record<string, React.FC<SceneProps>> = {
  hook: SceneHook,
  manual: SceneManual,
  longdistance: SceneLong,
  automatic: SceneAutomatic,
  fading: SceneFading,
  today: SceneToday,
  close: SceneClose,
};
