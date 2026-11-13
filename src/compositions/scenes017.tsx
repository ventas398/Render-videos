import React from "react";
import { vis } from "../components/ui";
import { lerp, ramp } from "../utils/anim";
import type { SceneProps } from "./scenes";
import { Chips, Note } from "./scenes011";
import { Arrow, Bulb, G, GOLD, GREEN, GREY, ink, orange, Person, Plaque, RED, SAND, seg, SimpleNote, SOFT, Stamp, SvgFrame, teal, Txt, useT, WARM } from "./kit";
import { Sheet, Tick } from "./scenes015";

/* ------------------------------------------------------------------ piezas genericas (sin marcas) */
/** Lampara de techo; el origen es el punto del techo. lit 0..1. */
const Lamp: React.FC<{ x: number; y: number; lit: number; s?: number }> = ({ x, y, lit, s = 1 }) => (
  <G x={x} y={y} s={s}>
    <circle cx={0} cy={100} r={170} fill={GOLD} fillOpacity={0.35 * lit} />
    <line x1={0} y1={0} x2={0} y2={40} stroke={ink} strokeWidth={6} />
    <path d="M-60 100 Q-60 40 0 40 Q60 40 60 100 Z" fill={lit > 0.5 ? GOLD : "#E4E7EC"} stroke={ink} strokeWidth={6} />
  </G>
);

/** Pulsador de pared. */
const Btn: React.FC<{
  x: number;
  y: number;
  s?: number;
  o?: number;
  push?: number;
}> = ({ x, y, s = 1, o = 1, push = 0 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-50} y={-75} width={100} height={150} rx={10} fill="#fff" stroke={ink} strokeWidth={6} />
    <circle r={30 - 7 * push} fill={teal} stroke={ink} strokeWidth={5} />
  </G>
);

/** Caja de temporizador: esfera con aguja y piloto. */
const TimerBox: React.FC<{
  x: number;
  y: number;
  s?: number;
  o?: number;
  hand?: number;
}> = ({ x, y, s = 1, o = 1, hand = 0 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-120} y={-85} width={240} height={170} rx={14} fill="#fff" stroke={ink} strokeWidth={7} />
    <circle cx={-40} cy={0} r={50} fill={SOFT} stroke={ink} strokeWidth={5} />
    <line x1={-40} y1={0} x2={-40} y2={-38} stroke={orange} strokeWidth={6} strokeLinecap="round" transform={`rotate(${hand} -40 0)`} />
    <circle cx={65} cy={-40} r={12} fill={GREEN} stroke={ink} strokeWidth={4} />
    <rect x={40} y={10} width={60} height={30} rx={6} fill={SAND} stroke={ink} strokeWidth={4} />
  </G>
);

/** Pasillo generico: techo, suelo, lampara y pulsador; dark 0..1 lo oscurece. */
const Hall: React.FC<{ lit: number; dark?: number; btn?: number }> = ({ lit, dark = 0, btn = 0 }) => (
  <>
    <line x1={200} y1={170} x2={1720} y2={170} stroke={ink} strokeWidth={6} />
    <line x1={200} y1={650} x2={1720} y2={650} stroke={ink} strokeWidth={6} />
    <Lamp x={960} y={170} lit={lit} />
    <Btn x={1500} y={420} push={btn} />
    <rect x={200} y={170} width={1520} height={480} fill={ink} fillOpacity={0.55 * dark} />
  </>
);

/** Escalera que sube hacia la derecha; pies de la persona en stairY(i). */
const Stairs: React.FC<{
  x: number;
  y: number;
  n: number;
  w: number;
  h: number;
  o?: number;
}> = ({ x, y, n, w, h, o = 1 }) => {
  let d = `M${x} ${y}`;
  for (let i = 0; i < n; i++) d += ` V${y - (i + 1) * h} H${x + (i + 1) * w}`;
  return (
    <g opacity={o}>
      <path d={`${d} V${y} Z`} fill={SAND} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
    </g>
  );
};

/** Caja de contador generica con digitos que suben. */
const Meter: React.FC<{
  x: number;
  y: number;
  s?: number;
  o?: number;
  value: number;
}> = ({ x, y, s = 1, o = 1, value }) => (
  <G x={x} y={y} s={s} o={o}>
    {[-60, 60].map((px) => (
      <rect key={px} x={px - 14} y={-150} width={28} height={64} fill="#fff" stroke={ink} strokeWidth={6} />
    ))}
    <rect x={-130} y={-90} width={260} height={190} rx={18} fill="#fff" stroke={ink} strokeWidth={8} />
    <rect x={-100} y={-62} width={200} height={64} rx={8} fill="#EAF3F3" stroke={ink} strokeWidth={4} />
    <Txt x={0} y={-30} size={50} spacing={6}>
      {String(Math.floor(value)).padStart(5, "0")}
    </Txt>
    <circle cx={0} cy={56} r={26} fill={SOFT} stroke={ink} strokeWidth={5} />
    <line x1={0} y1={56} x2={0} y2={36} stroke={orange} strokeWidth={5} strokeLinecap="round" transform={`rotate(${value * 40} 0 56)`} />
  </G>
);

/** Corte del pulsador neumatico: boton, vastago, piston, muelle y contactos. push 0..1. */
const Dashpot: React.FC<{
  x: number;
  y: number;
  push: number;
  o?: number;
  air?: number;
  lab?: number;
}> = ({ x, y, push, o = 1, air = 0, lab = 0 }) => {
  const hx = -120 + 260 * push; // centro del piston
  const zig = Array.from({ length: 9 }, (_, i) => `${hx + 20 + ((i + 1) / 9) * (300 - hx - 20)} ${20 + (i % 2 ? 36 : -36)}`).join(" L");
  return (
    <G x={x} y={y} s={1.25} o={o}>
      <rect x={-260} y={-80} width={560} height={200} rx={10} fill="#fff" stroke={ink} strokeWidth={7} />
      <rect x={hx - 360} y={8} width={360} height={24} fill={GREY} stroke={ink} strokeWidth={4} />
      <rect x={hx - 420} y={-30} width={60} height={100} rx={10} fill={teal} stroke={ink} strokeWidth={6} />
      <rect x={hx - 20} y={-70} width={40} height={180} fill={SOFT} stroke={ink} strokeWidth={6} />
      <path d={`M${hx + 20} 20 L${zig} L300 20`} fill="none" stroke={ink} strokeWidth={5} strokeLinejoin="round" />
      <circle cx={300} cy={-40} r={7} fill={orange} />
      {air > 0 && <Arrow x1={310} y1={-40} x2={400} y2={-90} color={orange} w={6} o={air} />}
      {[140, 260].map((px) => (
        <rect key={px} x={px - 8} y={-140} width={16} height={60} fill={GREY} stroke={ink} strokeWidth={4} />
      ))}
      <rect x={140} y={push > 0.3 ? -150 : -170} width={120} height={14} rx={4} fill={push > 0.3 ? GOLD : "#E4E7EC"} stroke={ink} strokeWidth={4} />
      <G o={lab}>
        <Note x={-410} y={160} text="button" o={1} size={34} fill={ink} />
        <Note x={0} y={160} text="piston" o={1} size={34} fill={ink} />
        <Note x={200} y={160} text="spring" o={1} size={34} fill={ink} />
        <Note x={350} y={-165} text="contacts" o={1} size={34} fill={ink} />
      </G>
    </G>
  );
};

/** Sensor de movimiento generico (cupula + ondas). */
const Sensor: React.FC<{
  x: number;
  y: number;
  s?: number;
  o?: number;
  t: number;
}> = ({ x, y, s = 1, o = 1, t }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-60 0 A60 60 0 0 1 60 0 Z" fill="#fff" stroke={ink} strokeWidth={6} />
    <rect x={-80} y={0} width={160} height={24} fill={SAND} stroke={ink} strokeWidth={6} />
    {[0, 1, 2].map((i) => (
      <path
        key={i}
        d={`M${-50 - i * 36} ${60 + i * 36} Q0 ${100 + i * 50} ${50 + i * 36} ${60 + i * 36}`}
        fill="none"
        stroke={teal}
        strokeWidth={6}
        strokeLinecap="round"
        opacity={0.3 + 0.7 * (Math.floor(t * 3) % 3 === i ? 1 : 0.2)}
      />
    ))}
  </G>
);

/** Barra de cuenta atras. */
const Bar: React.FC<{
  x: number;
  y: number;
  w: number;
  frac: number;
  o?: number;
  warn?: number;
}> = ({ x, y, w, frac, o = 1, warn = 0 }) => (
  <G x={x} y={y} o={o}>
    <rect x={0} y={-30} width={w} height={60} rx={14} fill="#fff" stroke={ink} strokeWidth={6} strokeDasharray="14 10" />
    <rect x={6} y={-24} width={Math.max(0, (w - 12) * frac)} height={48} rx={10} fill={warn > 0 && frac < 0.3 ? orange : teal} />
  </G>
);

/* ------------------------------------------------------------------ hook (0-3) */
const SceneHook: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const walk = ramp(t, c[1] + 1.6, c[1] + 3.6);
  const dark = ramp(t, c[1] + 3.7, c[1] + 3.8);
  const sx = 480 + (walk * 4 + 0.5) * 130;
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Hall lit={1} />
          <circle cx={1500} cy={420} r={115} fill="none" stroke={GREY} strokeWidth={5} strokeDasharray="10 14" opacity={0.5} />
          <G x={1500} y={290} o={0.45}>
            <Txt x={0} y={0} size={80} fill={GREY}>
              {String(9 - (Math.floor((t - c[0]) * 1.2) % 10))}
            </Txt>
          </G>
        </G>
        <G o={k(1)}>
          <Stairs x={480} y={660} n={8} w={130} h={50} />
          <Btn x={380} y={520} s={0.8} push={ramp(t, c[1] + 0.4, c[1] + 0.5) * (1 - ramp(t, c[1] + 0.8, c[1] + 0.9))} />
          <Lamp x={800} y={160} lit={ramp(t, c[1] + 1.0, c[1] + 1.1) * (1 - dark)} />
          <rect x={200} y={170} width={1520} height={540} fill={ink} fillOpacity={0.55 * dark} />
          <Person x={sx} y={660 - (walk * 4 + 1) * 50} s={1.1} body={SOFT} o={ramp(t, c[1] + 1.2, c[1] + 1.6)} />
        </G>
        <G o={k(2)}>
          <Hall lit={1} />
          <TimerBox x={960} y={520} s={1.2} hand={t * 60} />
          <Stamp x={960} y={330} text="NOT A GLITCH" o={vis(t, c[2] + 0.8)} size={64} color={orange} rot={-3} />
          <Note x={960} y={705} text="a staircase timer, doing what it was built to do" o={vis(t, c[2] + 2.4)} size={40} fill={teal} />
        </G>
        <G o={k(3)}>
          <Hall lit={1 - ramp(t, c[3] + 1.4, c[3] + 1.6)} />
          <Txt x={820} y={430} size={230} serif>
            WHY
          </Txt>
          <Txt x={1220} y={420} size={230} serif fill={orange}>
            ?
          </Txt>
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(2))} />
      <Chips t={t} c={c} list={[["THE HIDDEN COUNTDOWN"], ["CLICK. DARKNESS."], ["NOT A GLITCH"], ["WHY?", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ what (4-10) */
const SceneWhat: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const lvl = 1 - ramp(t, c[1] + 1.4, c[1] + 3.6);
  const walk = ramp(t, c[2] + 0.8, c[2] + 4.4);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Plaque x={960} y={220} text="STAIRCASE TIMER" w={640} o={vis(t, c[0] + 0.4)} />
          {[
            ["STAIRS", 480],
            ["CORRIDORS", 960],
            ["LOBBIES", 1440],
          ].map(([label, px], i) => (
            <G key={label} x={Number(px)} y={500} o={vis(t, c[0] + 1.2 + i * 0.7)}>
              <rect x={-170} y={-130} width={340} height={300} rx={14} fill="#fff" stroke={ink} strokeWidth={6} />
              {i === 0 && <Stairs x={-110} y={90} n={4} w={55} h={36} />}
              {i === 1 && <path d="M-130 -100 L-50 -40 H50 L130 -100 M-130 120 L-50 60 H50 L130 120 M-50 -40 V60 M50 -40 V60" fill="none" stroke={ink} strokeWidth={6} strokeLinejoin="round" />}
              {i === 2 && (
                <>
                  <rect x={-110} y={-90} width={90} height={190} fill={SOFT} stroke={ink} strokeWidth={5} />
                  <rect x={10} y={30} width={110} height={70} fill={SAND} stroke={ink} strokeWidth={5} />
                </>
              )}
              <Txt x={0} y={142} size={32} weight={700}>
                {label}
              </Txt>
            </G>
          ))}
        </G>
        <G o={k(1)}>
          <Btn x={380} y={440} />
          <Note x={380} y={560} text="one press" o={vis(t, c[1] + 0.4)} size={40} fill={ink} />
          <Arrow x1={470} y1={440} x2={620} y2={440} color={orange} w={10} o={vis(t, c[1] + 0.8)} />
          <Bulb x={740} y={430} on={lvl > 0.02 ? 1 : 0} s={1.2} />
          <Bar x={900} y={430} w={760} frac={lvl} o={vis(t, c[1] + 1.2)} />
          <Note x={1280} y={530} text="a set time" o={vis(t, c[1] + 1.6)} size={40} fill={teal} />
          <Note x={1280} y={330} text="then it switches off by itself" o={vis(t, c[1] + 3.6)} size={40} fill={orange} />
        </G>
        <G o={k(2)}>
          <Stairs x={420} y={680} n={7} w={150} h={40} />
          <Person x={420 + (walk * 6 + 0.5) * 150} y={680 - (walk * 6 + 1) * 40} s={1.1} body={SOFT} />
          <Bar x={420} y={175} w={1050} frac={1} />
          <Arrow x1={1550} y1={600} x2={1550} y2={420} color={teal} w={10} />
          <Arrow x1={1650} y1={420} x2={1650} y2={600} color={teal} w={10} />
          <Note x={960} y={236} text="on long enough to go up or down" o={vis(t, c[2] + 0.8)} size={40} fill={teal} />
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[2] + 0.4)} size={36} fill={teal} />
        </G>
        <G o={k(3)}>
          <path d="M520 300 L960 160 L1400 300 Z" fill={WARM} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
          <rect x={560} y={300} width={800} height={340} fill="#fff" stroke={ink} strokeWidth={6} />
          <Lamp x={960} y={300} lit={1 - ramp(t, c[3] + 3.6, c[3] + 3.8)} s={0.8} />
          <Btn x={1250} y={470} s={0.7} push={ramp(t, c[3] + 3.3, c[3] + 3.4) * (1 - ramp(t, c[3] + 3.7, c[3] + 3.8))} />
          <Person x={760} y={640} s={1.2} body={SOFT} />
          <Note x={960} y={700} text="in a single home, it stays on until someone switches it off" o={vis(t, c[3] + 0.6)} size={38} fill={ink} />
        </G>
        <G o={k(4)}>
          <rect x={700} y={170} width={520} height={470} fill="#fff" stroke={ink} strokeWidth={6} />
          {[0, 1, 2].map((r) => [0, 1, 2].map((cc) => <rect key={`${r}${cc}`} x={740 + cc * 160} y={210 + r * 140} width={100} height={90} fill={SOFT} stroke={ink} strokeWidth={4} />))}
          <Person x={380} y={640} s={1.5} body={WARM} />
          <Plaque x={380} y={700} text="LANDLORD" w={360} s={0.7} o={vis(t, c[4] + 1.6)} />
          <Arrow x1={520} y1={400} x2={680} y2={400} color={orange} w={10} o={vis(t, c[4] + 2.8)} />
          <Note x={600} y={340} text="pays" o={vis(t, c[4] + 2.8)} size={36} fill={orange} />
          {[1450, 1620, 1790].map((px, i) => (
            <Person key={px} x={px} y={640} s={1.0} body={SOFT} o={vis(t, c[4] + 4.2 + i * 0.4)} />
          ))}
          <Note x={1620} y={460} text="little reason to switch it off" o={vis(t, c[4] + 4.4)} size={34} fill={ink} />
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[4] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(5)}>
          <Stamp x={960} y={220} text="OUR READING: AN INFERENCE" o={vis(t, c[5] + 0.6)} size={44} pad={80} color={teal} rot={-2} />
          {[400, 600, 800, 1000].map((px, i) => (
            <G key={px} o={vis(t, c[5] + 1.0 + i * 0.5)}>
              <Person x={px} y={620} s={1.1} body={SOFT} />
              <Txt x={px} y={430} size={90} fill={orange}>
                ?
              </Txt>
            </G>
          ))}
          <Note x={700} y={690} text="everyone's light, nobody's job" o={vis(t, c[5] + 1.6)} size={38} fill={ink} />
          <Arrow x1={1150} y1={500} x2={1330} y2={500} color={teal} w={10} o={vis(t, c[5] + 4.0)} />
          <TimerBox x={1520} y={500} s={1.1} o={vis(t, c[5] + 4.0)} hand={t * 60} />
          <Note x={1520} y={640} text="the timer takes the job" o={vis(t, c[5] + 4.4)} size={36} fill={teal} />
        </G>
        <G o={k(6)}>
          <Note x={960} y={240} text="light left on" o={vis(t, c[6] + 0.6)} size={42} fill={ink} />
          <Bar x={460} y={310} w={1000} frac={1} o={vis(t, c[6] + 0.6)} />
          <Note x={960} y={450} text="light only when needed" o={vis(t, c[6] + 2.0)} size={42} fill={ink} />
          <G x={460} y={520} o={vis(t, c[6] + 2.0)}>
            <rect x={0} y={-30} width={1000} height={60} rx={14} fill="#fff" stroke={ink} strokeWidth={6} strokeDasharray="14 10" />
            {[70, 380, 690].map((px) => (
              <rect key={px} x={px} y={-24} width={110} height={48} rx={10} fill={teal} />
            ))}
          </G>
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[6] + 0.8)} size={36} fill={teal} />
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["THE STAIRCASE TIMER"], ["ONE PRESS"], ["LONG ENOUGH"], ["A SINGLE HOME"], ["A SHARED BUILDING"], ["OUR READING", true], ["SAVING ENERGY"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ inside (11-15) */
const SceneInside: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Btn x={560} y={440} s={2} />
          <Plaque x={1230} y={380} text="DASHPOT TIMER" w={640} o={vis(t, c[0] + 1.2)} />
          <Stamp x={1230} y={510} text="FIRST UNITS" o={vis(t, c[0] + 2.0)} size={44} color={orange} rot={-3} />
          <Note x={1230} y={620} text="pneumatic push-button" o={vis(t, c[0] + 2.8)} size={40} fill={teal} />
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[0] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(1)}>
          <Txt x={960} y={180} size={46} serif>
            PNEUMATIC DASHPOT TIMER
          </Txt>
          <Dashpot x={1100} y={440} push={ramp(t, c[1] + 1.8, c[1] + 3.2)} lab={vis(t, c[1] + 0.6)} />
          <Note x={960} y={725} text="the push holds the contacts closed" o={vis(t, c[1] + 3.6)} size={38} fill={teal} />
        </G>
        <G o={k(2)}>
          <Txt x={960} y={180} size={46} serif>
            PNEUMATIC DASHPOT TIMER
          </Txt>
          <Dashpot x={1100} y={440} push={1 - ramp(t, c[2] + 1.2, c[2] + 5.0)} air={vis(t, c[2] + 1.2, c[2] + 5.0)} lab={1} />
          <Note x={960} y={725} text="slow return = the delay" o={vis(t, c[2] + 2.4)} size={42} fill={orange} />
        </G>
        <G o={k(3)}>
          <Plaque x={960} y={220} text="ELECTRONIC TIMER" w={640} o={vis(t, c[3] + 0.4)} />
          <G x={960} y={480} s={1.3}>
            <rect x={-260} y={-130} width={520} height={260} rx={16} fill="#fff" stroke={ink} strokeWidth={7} />
            <rect x={-70} y={-60} width={140} height={110} rx={8} fill={SOFT} stroke={ink} strokeWidth={5} />
            <path d="M-220 -60 H-70 M-220 0 H-70 M-220 60 H-70 M70 -60 H220 M70 0 H220 M70 60 H220" fill="none" stroke={teal} strokeWidth={6} strokeLinecap="round" />
          </G>
          <Note x={960} y={700} text="no moving parts" o={vis(t, c[3] + 1.6)} size={46} fill={orange} />
        </G>
        <G o={k(4)}>
          <G x={160}>
            {[290, 470, 650].map((py, i) => (
              <G key={py} o={vis(t, c[4] + 1.0 + i * 0.6)}>
                <Btn x={480} y={py} s={0.7} />
                <path d={`M540 ${py} H760 V470 H830`} fill="none" stroke={teal} strokeWidth={6} strokeLinejoin="round" />
              </G>
            ))}
            <TimerBox x={1000} y={470} s={1.4} hand={t * 60} />
          </G>
          <Note x={960} y={200} text="one timer, many buttons" o={vis(t, c[4] + 0.6)} size={46} fill={orange} />
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[4] + 0.6)} size={36} fill={teal} />
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["THE FIRST UNITS"], ["THE PISTON"], ["THE SLOW RETURN"], ["ELECTRONIC"], ["MANY BUTTONS"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ settings (16-19) */
const SceneSettings: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const a3 = c[0] + 3.2;
  const lv = t < a3 ? lerp(1, 0.35, ramp(t, c[0] + 0.8, a3 - 0.2)) : t < a3 + 0.6 ? lerp(0.35, 1, ramp(t, a3, a3 + 0.6)) : lerp(1, 0.6, ramp(t, a3 + 0.9, a3 + 4));
  const needle = lerp(-120, 120, ramp(t, c[1] + 1.2, c[1] + 4.2));
  const blink = Math.floor(t * 3) % 2;
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Btn x={380} y={440} push={ramp(t, a3 - 0.1, a3) * (1 - ramp(t, a3 + 0.3, a3 + 0.4))} />
          <Note x={380} y={560} text="press again" o={vis(t, a3 - 0.4)} size={40} fill={ink} />
          <Bar x={620} y={440} w={900} frac={lv} />
          <Note x={1070} y={340} text="the countdown restarts from your last press" o={vis(t, a3)} size={40} fill={teal} />
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[0] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(1)}>
          <G x={620} y={450}>
            <circle r={180} fill="#fff" stroke={ink} strokeWidth={8} />
            {Array.from({ length: 9 }, (_, i) => (
              <line key={i} x1={0} y1={-150} x2={0} y2={-176} stroke={ink} strokeWidth={6} transform={`rotate(${-120 + i * 30})`} />
            ))}
            <line x1={0} y1={0} x2={0} y2={-130} stroke={orange} strokeWidth={9} strokeLinecap="round" transform={`rotate(${needle})`} />
            <circle r={14} fill={ink} />
            <Txt x={-120} y={215} size={34} weight={700}>
              0.5 MIN
            </Txt>
            <Txt x={120} y={215} size={34} weight={700}>
              12 MIN
            </Txt>
          </G>
          <Note x={1280} y={470} text="an adjustable delay" o={vis(t, c[1] + 1.0)} size={44} fill={teal} />
        </G>
        <G o={k(2)}>
          <Lamp x={620} y={250} lit={blink} s={1.5} />
          <Bar x={1000} y={450} w={560} frac={0.2 + 0.2 * (1 - blink)} warn={1} />
          <Note x={1280} y={560} text="a signal before the light goes out" o={vis(t, c[2] + 1.4)} size={38} fill={ink} />
        </G>
        <G o={k(3)}>
          <Lamp x={620} y={250} lit={1} s={1.5} />
          <G x={1180} y={440}>
            <rect x={-70} y={-100} width={140} height={200} rx={12} fill="#fff" stroke={ink} strokeWidth={7} />
            <circle r={30} fill={SAND} stroke={ink} strokeWidth={5} />
            <rect x={-6} y={-6} width={12} height={34} fill={ink} />
          </G>
          <Note x={1180} y={590} text="key switch" o={vis(t, c[3] + 1.4)} size={38} fill={ink} />
          <Person x={1560} y={640} s={1.2} body={SOFT} o={vis(t, c[3] + 3.0)} />
          <Note x={1560} y={700} text="cleaning" o={vis(t, c[3] + 3.2)} size={36} fill={teal} />
          <Note x={620} y={705} text="continuous light" o={vis(t, c[3] + 0.6)} size={42} fill={orange} />
        </G>
        <Stamp x={1400} y={250} text="ONE MODEL" o={Math.min(k(1, 2), vis(t, c[1] + 0.8))} size={64} color={orange} rot={-3} />
        <Note x={960} y={735} text="Manufacturer page (one model)" o={Math.min(k(1, 2), vis(t, c[1] + 0.4))} size={36} fill={teal} />
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["PRESS AGAIN"], ["ADJUSTABLE DELAY"], ["PRE-WARNING"], ["CONTINUOUS LIGHT"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ today (20-22) */
const SceneToday: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const flick = t > c[2] + 1.5 ? Math.floor(t * 4) % 2 : 1;
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Sheet x={620} y={440} w={420} h={520} title="1929" size={90} lines={4} />
          <Stamp x={1280} y={290} text="PATENT RECORD" o={vis(t, c[0] + 1.0)} size={54} color={teal} rot={-3} />
          <Note x={1280} y={440} text="translated title:" o={vis(t, c[0] + 3.4)} size={34} fill={GREY} />
          <Note x={1280} y={500} text="time switch for" o={vis(t, c[0] + 3.4)} size={44} fill={ink} />
          <Note x={1280} y={560} text="staircase lighting" o={vis(t, c[0] + 3.4)} size={44} fill={ink} />
          <Note x={960} y={735} text="Google Patents" o={vis(t, c[0] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(1)} x={150}>
          <Sensor x={620} y={230} s={1.5} t={t} />
          <Person x={620 + lerp(-200, 260, ramp(t, c[1] + 1.0, c[1] + 4.0))} y={650} s={1.2} body={SOFT} />
          <Btn x={1330} y={440} o={0.35} />
          <line x1={1250} y1={340} x2={1410} y2={540} stroke={RED} strokeWidth={10} strokeLinecap="round" />
          <Note x={1330} y={600} text="no button needed" o={vis(t, c[1] + 2.0)} size={40} fill={ink} />
          <Note x={810} y={735} text="Wikipedia" o={vis(t, c[1] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(2)}>
          <line x1={960} y1={170} x2={960} y2={650} stroke={GREY} strokeWidth={5} strokeDasharray="12 12" />
          <Lamp x={560} y={220} lit={flick} s={1.1} />
          <Lamp x={1360} y={220} lit={1} s={1.1} />
          <Note x={560} y={560} text="sensor alone" o={vis(t, c[2] + 0.8)} size={42} fill={RED} />
          <Note x={560} y={620} text="lights could flash off and on" o={vis(t, c[2] + 1.4)} size={34} fill={ink} />
          <Note x={1360} y={560} text="sensor + timer" o={vis(t, c[2] + 3.4)} size={42} fill={GREEN} />
          <Tick x={1360} y={650} s={0.7} o={vis(t, c[2] + 4.0)} />
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[2] + 0.6)} size={36} fill={teal} />
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["1929"], ["MOTION SENSOR"], ["WHY A TIMER STILL"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ practical (23-24) */
const ScenePractical: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const end = ramp(t, c[0] + 3.4, c[0] + 3.6);
  const walk = ramp(t, c[1] + 0.8, c[1] + 5);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Hall lit={1 - end} dark={end} />
          <Bar x={560} y={700} w={800} frac={1 - ramp(t, c[0] + 0.4, c[0] + 3.4)} />
          <Stamp x={960} y={420} text="NOT BROKEN" o={vis(t, c[0] + 4.4)} size={72} color={teal} rot={-3} />
          <Note x={960} y={530} text="the countdown simply ended" o={vis(t, c[0] + 5.0)} size={40} fill={ink} />
        </G>
        <G o={k(1)}>
          <Hall lit={1 - ramp(t, c[1] + 5.2, c[1] + 5.4)} />
          <Person x={380 + walk * 800} y={650} s={1.2} body={SOFT} />
          <Stamp x={960} y={330} text="OUR READING: AN INFERENCE" o={vis(t, c[1] + 0.6)} size={44} pad={80} color={teal} rot={-2} />
          <Note x={960} y={420} text="a tiny rule built into the wall" o={vis(t, c[1] + 1.4)} size={44} fill={ink} />
          <Note x={960} y={470} text="the light stays just long enough, then steps aside" o={vis(t, c[1] + 3.2)} size={36} fill={teal} />
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["NOT BROKEN"], ["OUR READING", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ close (25-26) */
const SceneClose: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <rect x={560} y={170} width={800} height={540} fill="#fff" stroke={ink} strokeWidth={7} />
          {[300, 430, 560].map((fy) => (
            <line key={fy} x1={560} y1={fy} x2={1360} y2={fy} stroke={ink} strokeWidth={5} />
          ))}
          {[0, 1, 2].map((r) => [0, 1, 2, 3].map((cc) => <rect key={`${r}${cc}`} x={620 + cc * 180} y={200 + r * 130} width={100} height={60} fill={SOFT} stroke={ink} strokeWidth={4} />))}
          <Meter x={960} y={645} s={0.7} value={400 + Math.max(0, t - c[0]) * 3} />
          <Arrow x1={1500} y1={200} x2={1500} y2={lerp(260, 650, ramp(t, c[0] + 1.0, c[0] + 5.0))} color={orange} w={12} o={vis(t, c[0] + 0.8)} />
          <Note x={1580} y={720} text="somewhere in there" o={vis(t, c[0] + 3.0)} size={36} fill={ink} />
        </G>
        <G o={k(1)}>
          <Meter x={600} y={480} s={1.8} value={417 + Math.max(0, t - c[1]) * 3} />
          <Txt x={1330} y={410} size={210} serif fill={orange} spacing={4}>
            WHY?
          </Txt>
          <Note x={1330} y={550} text="a gas meter" o={vis(t, c[1] + 0.8)} size={44} fill={ink} />
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["OTHER QUIET MACHINES"], ["NEXT: THE METER", true]]} />
    </>
  );
};

export const SCENES017: Record<string, React.FC<SceneProps>> = {
  hook: SceneHook,
  what: SceneWhat,
  inside: SceneInside,
  settings: SceneSettings,
  today: SceneToday,
  practical: ScenePractical,
  close: SceneClose,
};
