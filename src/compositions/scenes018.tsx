import React from "react";
import { vis } from "../components/ui";
import { ramp } from "../utils/anim";
import type { SceneProps } from "./scenes";
import { Chips, Note } from "./scenes011";
import { Arrow, Car, G, GOLD, GREY, ink, orange, Person, Plaque, RED, SAND, seg, SimpleNote, SOFT, Stamp, SvgFrame, teal, Txt, useT, WARM } from "./kit";
import { Map as GenericMap, Sheet } from "./scenes015";

/* ------------------------------------------------------------------ piezas genericas (sin marcas ni cifras reales) */
/** Ruedas numeradas (cuentakilometros). */
const Wheels: React.FC<{ x: number; y: number; s?: number; value: number; n?: number; o?: number }> = ({ x, y, s = 1, value, n = 5, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    {String(Math.floor(value))
      .padStart(n, "0")
      .split("")
      .map((d, i) => (
        <G key={i} x={(i - (n - 1) / 2) * 74}>
          <rect x={-32} y={-48} width={64} height={96} rx={8} fill="#fff" stroke={ink} strokeWidth={5} />
          <Txt x={0} y={2} size={64}>
            {d}
          </Txt>
        </G>
      ))}
  </G>
);

/** Caja de contador generica. */
const Meter: React.FC<{ x: number; y: number; s?: number; o?: number; value: number }> = ({ x, y, s = 1, o = 1, value }) => (
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

/** Corte esquematico de un contador de diafragma: dos camaras que se llenan por turnos. ph -1..1. */
const Section: React.FC<{ x: number; y: number; s?: number; o?: number; ph: number; lab?: number }> = ({ x, y, s = 1, o = 1, ph, lab = 0 }) => {
  const xl = -175 + 70 * ph;
  const xr = 175 + 70 * ph;
  return (
    <G x={x} y={y} s={s} o={o}>
      <rect x={-20} y={-265} width={40} height={50} fill="#E4E7EC" stroke={ink} strokeWidth={5} />
      <rect x={-20} y={215} width={40} height={50} fill="#E4E7EC" stroke={ink} strokeWidth={5} />
      <rect x={-350} y={-170} width={700} height={340} rx={18} fill="#fff" stroke={ink} strokeWidth={8} />
      <path d={`M-330 -150 H${xl} Q${xl + 40 * ph} 0 ${xl} 150 H-330 Z`} fill={teal} fillOpacity={0.35} />
      <path d={`M330 -150 H${xr} Q${xr + 40 * ph} 0 ${xr} 150 H330 Z`} fill={teal} fillOpacity={0.35} />
      <path d={`M${xl} -150 Q${xl + 40 * ph} 0 ${xl} 150 M${xr} -150 Q${xr + 40 * ph} 0 ${xr} 150`} fill="none" stroke={ink} strokeWidth={6} />
      <line x1={0} y1={-170} x2={0} y2={170} stroke={ink} strokeWidth={8} />
      <G x={0} y={-190} rot={ph * 30}>
        <line x1={-40} y1={0} x2={40} y2={0} stroke={orange} strokeWidth={8} strokeLinecap="round" />
      </G>
      <G x={0} y={190} rot={-ph * 30}>
        <line x1={-40} y1={0} x2={40} y2={0} stroke={orange} strokeWidth={8} strokeLinecap="round" />
      </G>
      <Arrow x1={-60} y1={-110} x2={-200} y2={-110} color={teal} w={8} o={Math.max(0, ph)} />
      <Arrow x1={60} y1={-110} x2={200} y2={-110} color={teal} w={8} o={Math.max(0, -ph)} />
      <Arrow x1={-200} y1={110} x2={-60} y2={110} color={orange} w={8} o={Math.max(0, -ph)} />
      <Arrow x1={200} y1={110} x2={60} y2={110} color={orange} w={8} o={Math.max(0, ph)} />
      <G o={lab}>
        <rect x={-250} y={-26} width={150} height={52} rx={8} fill="#fff" />
        <Note x={-175} y={0} text="chamber" o={1} size={38} fill={ink} />
        <rect x={100} y={-26} width={150} height={52} rx={8} fill="#fff" />
        <Note x={175} y={0} text="chamber" o={1} size={38} fill={ink} />
        <Note x={150} y={-235} text="valves" o={1} size={38} fill={ink} />
      </G>
    </G>
  );
};

const Flame: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M0 -70 C30 -30 46 -4 24 30 Q0 54 -24 30 C-46 -4 -14 -30 0 -70Z" fill={orange} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
    <path d="M0 -20 C14 0 18 14 8 28 Q0 36 -8 28 C-18 14 -6 0 0 -20Z" fill={GOLD} />
  </G>
);

/** Cubo isometrico (volumen). */
const Cube: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M0 -60 L70 -30 L0 0 L-70 -30 Z" fill={SOFT} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
    <path d="M-70 -30 L0 0 L0 80 L-70 50 Z" fill="#fff" stroke={ink} strokeWidth={5} strokeLinejoin="round" />
    <path d="M70 -30 L0 0 L0 80 L70 50 Z" fill={SAND} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
  </G>
);

const House: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-170 -120 L0 -260 L170 -120 Z" fill={WARM} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
    <rect x={-140} y={-120} width={280} height={220} fill="#fff" stroke={ink} strokeWidth={6} />
    <rect x={-30} y={-30} width={60} height={130} fill={SOFT} stroke={ink} strokeWidth={5} />
  </G>
);

const Tower: React.FC<{ x: number; y: number; t: number; o?: number; cut?: number }> = ({ x, y, t, o = 1, cut = 0 }) => (
  <G x={x} y={y} o={o}>
    <path d="M-50 150 L0 -80 L50 150 M-30 70 H30" fill="none" stroke={ink} strokeWidth={7} strokeLinejoin="round" />
    <circle cy={-90} r={14} fill={orange} />
    {cut < 0.5 &&
      [0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${-50 - i * 34} ${-90 - i * 20} Q${-90 - i * 34} ${-90} ${-50 - i * 34} ${-90 + i * 20}`}
          fill="none"
          stroke={teal}
          strokeWidth={6}
          strokeLinecap="round"
          opacity={Math.floor(t * 3) % 3 === i ? 1 : 0.3}
        />
      ))}
  </G>
);

const Flag: React.FC<{ x: number; y: number; text: string; o?: number; s?: number }> = ({ x, y, text, o = 1, s = 1 }) => (
  <G x={x} y={y} o={o} s={s}>
    <Txt x={0} y={0} size={44} fill={ink}>
      {text}
    </Txt>
  </G>
);

/* ------------------------------------------------------------------ hook (0-2) */
const SceneHook: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <rect x={620} y={190} width={680} height={520} rx={16} fill={SAND} fillOpacity={0.5} stroke={ink} strokeWidth={6} />
          <line x1={260} y1={330} x2={900} y2={330} stroke={GREY} strokeWidth={26} strokeLinecap="round" />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={260 + ((t * 150 + i * 200) % 600)} cy={330} r={16} fill={teal} fillOpacity={0.85} />
          ))}
          <Meter x={960} y={500} s={1.3} value={t * 0.7} />
          <Note x={1500} y={330} text="one gulp at a time" o={vis(t, c[0] + 1.6)} size={44} fill={orange} />
        </G>
        <G o={k(1)}>
          <Meter x={640} y={500} s={1.7} value={t * 0.7} />
          <Arrow x1={900} y1={440} x2={1130} y2={440} color={orange} w={12} o={vis(t, c[1] + 2.4)} />
          <Sheet x={1400} y={440} w={340} h={440} lines={4} o={vis(t, c[1] + 2.4)} />
          <Note x={640} y={730} text="those little numbers" o={vis(t, c[1] + 1.2)} size={38} fill={teal} />
        </G>
        <G o={k(2)}>
          <Txt x={820} y={330} size={280} serif>
            WHY
          </Txt>
          <Txt x={1230} y={320} size={280} serif fill={orange}>
            ?
          </Txt>
          <Meter x={960} y={680} s={0.8} value={t * 0.7} />
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["THE LITTLE NUMBERS"], ["EVERY BILL STARTS HERE"], ["WHY?", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ inside (3-9) */
const SceneInside: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const ph = Math.sin(t * 1.6);
  const a = t * 2;
  const px = 1240 + 70 * Math.cos(a);
  const py = 440 + 70 * Math.sin(a);
  const bx = px - Math.sqrt(330 * 330 - (py - 440) ** 2);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Plaque x={960} y={200} text="DIAPHRAGM METER" w={720} o={vis(t, c[0] + 0.4)} />
          <Section x={960} y={470} s={0.7} ph={ph} />
          <Note x={960} y={680} text="also called a bellows meter" o={vis(t, c[0] + 2.6)} size={40} fill={teal} />
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[0] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(1)}>
          <Plaque x={960} y={200} text="OTHER DESIGNS" w={640} o={vis(t, c[1] + 0.4)} />
          {["HOME", "ROTARY: HIGHER VOLUMES", "ULTRASONIC: PIPELINES"].map((label, i) => (
            <G key={label} x={480 + i * 480} y={470} o={vis(t, c[1] + 1.0 + i * 0.8)}>
              <rect x={-190} y={-150} width={380} height={310} rx={14} fill="#fff" stroke={ink} strokeWidth={6} />
              {i === 0 && <Meter x={0} y={-5} s={0.65} value={0} />}
              {i === 1 && (
                <>
                  <rect x={-90} y={-90} width={180} height={150} rx={14} fill={SOFT} stroke={ink} strokeWidth={5} />
                  <ellipse cx={-28} cy={-15} rx={26} ry={52} fill="#fff" stroke={ink} strokeWidth={5} transform={`rotate(${t * 60} -28 -15)`} />
                  <ellipse cx={28} cy={-15} rx={26} ry={52} fill="#fff" stroke={ink} strokeWidth={5} transform={`rotate(${-t * 60 + 90} 28 -15)`} />
                </>
              )}
              {i === 2 && (
                <>
                  <rect x={-150} y={-40} width={300} height={70} fill="#E4E7EC" stroke={ink} strokeWidth={5} />
                  <rect x={-60} y={-70} width={30} height={30} fill={teal} stroke={ink} strokeWidth={4} />
                  <rect x={30} y={30} width={30} height={30} fill={teal} stroke={ink} strokeWidth={4} />
                  <line x1={-45} y1={-40} x2={45} y2={30} stroke={orange} strokeWidth={5} strokeDasharray="10 8" />
                </>
              )}
              <Txt x={0} y={98} size={30} weight={700}>
                {label.split(": ")[0] + (label.includes(": ") ? ":" : "")}
              </Txt>
              <Txt x={0} y={136} size={30} weight={700}>
                {label.split(": ")[1] ?? ""}
              </Txt>
            </G>
          ))}
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[1] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(2)}>
          <Section x={960} y={470} s={0.85} ph={ph} lab={vis(t, c[2] + 0.6)} />
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[2] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(3)}>
          <G x={960} y={250} rot={ph * 12}>
            <rect x={-320} y={-9} width={640} height={18} rx={6} fill={SAND} stroke={ink} strokeWidth={5} />
            {[-320, 320].map((cx) => (
              <circle key={cx} cx={cx} cy={-30} r={26} fill={teal} stroke={ink} strokeWidth={5} />
            ))}
          </G>
          <path d="M920 310 L960 250 L1000 310 Z" fill={SAND} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
          <Section x={960} y={520} s={0.62} ph={ph} />
          <Note x={960} y={735} text="one chamber fills while the other empties" o={vis(t, c[3] + 2.4)} size={38} fill={ink} />
        </G>
        <G o={k(4)}>
          <G x={bx - 110} y={440}>
            <rect x={-70} y={-50} width={140} height={100} rx={10} fill={SOFT} stroke={ink} strokeWidth={6} />
          </G>
          <line x1={bx} y1={440} x2={px} y2={py} stroke={ink} strokeWidth={10} strokeLinecap="round" />
          <circle cx={1240} cy={440} r={70} fill="#fff" stroke={ink} strokeWidth={6} />
          <line x1={1240} y1={440} x2={px} y2={py} stroke={orange} strokeWidth={8} strokeLinecap="round" />
          <circle cx={px} cy={py} r={12} fill={orange} />
          <circle cx={1240} cy={440} r={14} fill={ink} />
          <Note x={bx - 110} y={560} text="back and forth" o={vis(t, c[4] + 0.8)} size={40} fill={teal} />
          <Note x={1240} y={590} text="spinning shaft" o={vis(t, c[4] + 1.6)} size={40} fill={orange} />
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[4] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(5)}>
          <G x={460} y={430}>
            <circle r={70} fill="#fff" stroke={ink} strokeWidth={6} />
            <line x1={0} y1={0} x2={0} y2={-60} stroke={orange} strokeWidth={8} strokeLinecap="round" transform={`rotate(${t * 120})`} />
          </G>
          <Arrow x1={560} y1={430} x2={640} y2={430} color={teal} w={10} />
          <Wheels x={960} y={430} value={t * 0.8} o={vis(t, c[5] + 0.8)} />
          <Note x={960} y={540} text="a counter" o={vis(t, c[5] + 1.0)} size={40} fill={teal} />
          <Car x={1580} y={600} s={1} color={teal} o={vis(t, c[5] + 2.4)} />
          <Wheels x={1580} y={400} s={0.55} value={t * 0.8 + 2} o={vis(t, c[5] + 2.4)} />
          <Note x={1580} y={720} text="like a car's odometer" o={vis(t, c[5] + 2.8)} size={34} fill={ink} />
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[5] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(6)}>
          {[
            ["1  GAS IN", 1],
            ["2  VALVES SWITCH", 0],
            ["3  COUNTER +1", -1],
          ].map(([label, p], i) => (
            <G key={String(label)} x={480 + i * 480} y={460} o={vis(t, c[6] + 0.4 + i * 1.2)}>
              <rect x={-210} y={-190} width={420} height={380} rx={14} fill="#fff" stroke={ink} strokeWidth={6} />
              <Section x={0} y={-20} s={0.42} ph={Number(p)} />
              {i === 2 && <Wheels x={0} y={125} s={0.45} value={t * 0.8} />}
              <Txt x={0} y={172} size={30} weight={700}>
                {String(label)}
              </Txt>
            </G>
          ))}
          <Arrow x1={700} y1={460} x2={740} y2={460} color={orange} w={8} o={vis(t, c[6] + 1.6)} />
          <Arrow x1={1180} y1={460} x2={1220} y2={460} color={orange} w={8} o={vis(t, c[6] + 2.8)} />
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["THE DIAPHRAGM METER"], ["OTHER DESIGNS"], ["TWO CHAMBERS"], ["OUR COMPARISON", true], ["LEVERS AND CRANKS"], ["THE COUNTER"], ["ONE STEP"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ counting (10-12) */
const SceneCounting: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const n = Math.min(8, Math.max(0, Math.floor((t - c[0] - 1.6) * 0.9)));
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Stamp x={960} y={220} text="OUR READING: AN INFERENCE" o={vis(t, c[0] + 0.6)} size={44} pad={80} color={teal} rot={-2} />
          <G x={560} y={470} o={vis(t, c[0] + 1.0)}>
            <circle r={110} fill="#fff" stroke={ink} strokeWidth={8} />
            <line x1={0} y1={0} x2={0} y2={-80} stroke={ink} strokeWidth={8} strokeLinecap="round" />
            <line x1={0} y1={0} x2={60} y2={20} stroke={ink} strokeWidth={8} strokeLinecap="round" />
            <line x1={-130} y1={-130} x2={130} y2={130} stroke={RED} strokeWidth={14} strokeLinecap="round" />
          </G>
          <G x={1100} y={470}>
            {Array.from({ length: n }, (_, i) => (
              <line key={i} x1={-260 + i * 70} y1={-70} x2={-260 + i * 70} y2={70} stroke={ink} strokeWidth={12} strokeLinecap="round" />
            ))}
          </G>
          <Note x={560} y={650} text="not a clock" o={vis(t, c[0] + 1.4)} size={40} fill={RED} />
          <Note x={1100} y={650} text="one mark per filling" o={vis(t, c[0] + 2.0)} size={40} fill={teal} />
        </G>
        <G o={k(1)}>
          <Wheels x={960} y={360} s={1.3} value={t * 0.8} />
          <Txt x={960} y={560} size={130} serif fill={orange}>
            m³ / ft³
          </Txt>
          <Note x={960} y={680} text="volume, depending on the meter" o={vis(t, c[1] + 1.6)} size={42} fill={ink} />
        </G>
        <G o={k(2)}>
          <G x={440} y={440}>
            <Wheels x={0} y={0} s={0.7} value={457} />
            <Note x={0} y={110} text="NEW" o={1} size={44} fill={teal} />
          </G>
          <Txt x={760} y={440} size={120} fill={orange}>
            −
          </Txt>
          <G x={1080} y={440} o={vis(t, c[2] + 1.4)}>
            <Wheels x={0} y={0} s={0.7} value={412} />
            <Note x={0} y={110} text="OLD" o={1} size={44} fill={GREY} />
          </G>
          <Txt x={1400} y={440} size={120} fill={orange}>
            =
          </Txt>
          <G x={1650} y={440} o={vis(t, c[2] + 2.8)}>
            <rect x={-110} y={-45} width={220} height={90} rx={14} fill={SOFT} stroke={ink} strokeWidth={6} />
            <Txt x={0} y={2} size={44}>
              USED
            </Txt>
            <Note x={0} y={110} text="the bill" o={1} size={40} fill={teal} />
          </G>
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["OUR READING", true], ["VOLUME"], ["A RUNNING TOTAL"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ reading (13-15) */
const SceneReading: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const tilt = 12 * Math.sin(t * 1.4);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Person x={400} y={650} s={1.5} body={SOFT} />
          <rect x={470} y={520} width={90} height={60} rx={6} fill="#fff" stroke={ink} strokeWidth={5} />
          <Meter x={820} y={470} s={1.1} value={2 + t * 0.2} />
          <Arrow x1={620} y1={520} x2={690} y2={480} color={teal} w={8} o={vis(t, c[0] + 1.0)} />
          <Sheet x={1420} y={440} w={340} h={440} lines={4} o={vis(t, c[0] + 2.0)} />
          <Stamp x={1420} y={440} text="ESTIMATE" o={vis(t, c[0] + 3.6)} size={52} color={orange} rot={-12} />
          <Note x={400} y={720} text="a reading" o={vis(t, c[0] + 1.0)} size={38} fill={teal} />
          <Note x={1420} y={700} text="no recent reading" o={vis(t, c[0] + 3.0)} size={36} fill={ink} />
          <Note x={960} y={735} text="Supplier page" o={vis(t, c[0] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(1)}>
          <path d="M900 580 L960 380 L1020 580 Z" fill={SAND} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
          <G x={960} y={380} rot={tilt}>
            <line x1={-340} y1={0} x2={340} y2={0} stroke={ink} strokeWidth={10} strokeLinecap="round" />
            {[-340, 340].map((cx) => (
              <G key={cx} x={cx} y={0} rot={-tilt}>
                <line x1={0} y1={0} x2={-70} y2={110} stroke={ink} strokeWidth={4} />
                <line x1={0} y1={0} x2={70} y2={110} stroke={ink} strokeWidth={4} />
                <path d="M-90 110 H90 Q70 160 0 160 Q-70 160 -90 110 Z" fill={SOFT} stroke={ink} strokeWidth={6} />
              </G>
            ))}
          </G>
          <Note x={620} y={650} text="too much" o={vis(t, c[1] + 1.0)} size={44} fill={orange} />
          <Note x={1300} y={650} text="or too little" o={vis(t, c[1] + 1.6)} size={44} fill={orange} />
          <Note x={960} y={240} text="an estimate" o={vis(t, c[1] + 0.6)} size={46} fill={ink} />
          <Note x={960} y={735} text="Supplier page" o={vis(t, c[1] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(2)}>
          <Meter x={480} y={500} s={1.1} value={t * 0.2} />
          <Tower x={1400} y={440} t={t} cut={ramp(t, c[2] + 4.0, c[2] + 4.1)} />
          {t > c[2] + 4.0 && <line x1={760} y1={340} x2={1100} y2={540} stroke={RED} strokeWidth={12} strokeLinecap="round" />}
          <Note x={940} y={290} text="smart meter: automatic readings" o={vis(t, c[2] + 0.8)} size={40} fill={teal} />
          <Stamp x={960} y={620} text="ESTIMATE" o={vis(t, c[2] + 5.0)} size={56} color={orange} rot={-3} />
          <Note x={960} y={735} text="Supplier page" o={vis(t, c[2] + 0.6)} size={36} fill={teal} />
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["WHY METERS GET READ"], ["ESTIMATES"], ["SMART METERS"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ energy (16-22) */
const SceneEnergy: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const bal = 1 + 0.12 * Math.sin(t * 1.5);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Cube x={560} y={430} s={1.6} />
          <Txt x={560} y={650} size={70} fill={teal}>
            m³
          </Txt>
          <Arrow x1={760} y1={450} x2={1140} y2={450} color={orange} w={12} o={vis(t, c[0] + 1.6)} />
          <Flame x={1360} y={440} s={2.2} o={vis(t, c[0] + 1.6)} />
          <Txt x={1360} y={650} size={70} fill={orange}>
            kWh
          </Txt>
          <Note x={960} y={240} text="billed for energy, not for volume" o={vis(t, c[0] + 0.8)} size={44} fill={ink} />
          <Note x={960} y={735} text="Belgian guide / Guide (UK)" o={vis(t, c[0] + 0.6)} size={34} fill={teal} />
        </G>
        <G o={k(1)}>
          <Cube x={620} y={470} s={1.5} />
          <Cube x={1300} y={470} s={1.5} />
          <Flame x={620} y={330} s={2.4 * bal} o={vis(t, c[1] + 1.0)} />
          <Flame x={1300} y={370} s={0.9} o={vis(t, c[1] + 1.8)} />
          <Note x={960} y={675} text="same volume, different heat" o={vis(t, c[1] + 2.4)} size={44} fill={orange} />
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[1] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(2)}>
          <Plaque x={960} y={210} text="CALORIFIC VALUE" w={700} o={vis(t, c[2] + 0.4)} />
          <Flame x={560} y={470} s={2.4 * bal} />
          <G x={760} y={470}>
            <rect x={-14} y={-130} width={28} height={200} rx={14} fill="#fff" stroke={ink} strokeWidth={6} />
            <circle cx={0} cy={86} r={30} fill="#fff" stroke={ink} strokeWidth={6} />
            <rect x={-8} y={-40} width={16} height={116} fill={RED} />
            <circle cx={0} cy={86} r={20} fill={RED} />
          </G>
          <Note x={660} y={650} text="the heat released when it burns" o={vis(t, c[2] + 1.6)} size={38} fill={ink} />
          <G x={1400} y={470} o={vis(t, c[2] + 3.4)}>
            <rect x={-130} y={-120} width={260} height={230} rx={12} fill="#fff" stroke={ink} strokeWidth={6} />
            <rect x={-130} y={-120} width={260} height={56} rx={12} fill={teal} />
            <path d="M-60 20 A60 60 0 1 1 -10 70" fill="none" stroke={orange} strokeWidth={10} strokeLinecap="round" transform={`rotate(${t * 90} 0 20)`} />
            <Note x={0} y={150} text="each billing cycle" o={1} size={36} fill={ink} />
          </G>
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[2] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(3)}>
          <GenericMap
            x={560}
            y={450}
            w={640}
            h={400}
            dots={[
              [-150, -70, teal],
              [150, 80, orange],
            ]}
          />
          <Txt x={410} y={335} size={36} weight={800} fill={ink}>
            ORIGIN A
          </Txt>
          <Txt x={710} y={485} size={36} weight={800} fill={ink}>
            ORIGIN B
          </Txt>
          <Arrow x1={900} y1={380} x2={1100} y2={340} color={teal} w={8} o={vis(t, c[3] + 1.8)} />
          <Arrow x1={900} y1={530} x2={1100} y2={560} color={orange} w={8} o={vis(t, c[3] + 2.6)} />
          <Cube x={1250} y={380} s={1.1} o={vis(t, c[3] + 1.8)} />
          <Flame x={1250} y={290} s={1.6} o={vis(t, c[3] + 1.8)} />
          <Cube x={1250} y={600} s={1.1} o={vis(t, c[3] + 2.6)} />
          <Flame x={1250} y={530} s={0.9} o={vis(t, c[3] + 2.6)} />
          <Note x={1600} y={470} text="different origin, different energy" o={vis(t, c[3] + 3.4)} size={34} fill={ink} />
          <Note x={960} y={735} text="Belgian guide" o={vis(t, c[3] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(4)}>
          <Stamp x={960} y={250} text="TYPICAL" o={vis(t, c[4] + 0.6)} size={56} color={teal} rot={-3} />
          <Txt x={960} y={450} size={120} serif>
            1 m³ ≈ 11.5 kWh
          </Txt>
          <Note x={960} y={570} text="(typical, Brussels)" o={vis(t, c[4] + 1.6)} size={48} fill={orange} />
          <Note x={960} y={735} text="Belgian guide, typical" o={vis(t, c[4] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(5)}>
          <Stamp x={960} y={200} text="CORRECTION" o={vis(t, c[5] + 0.6)} size={56} color={orange} rot={-2} />
          <G x={600} y={440}>
            <ellipse rx={150 + 25 * Math.sin(t * 1.5)} ry={150 + 25 * Math.sin(t * 1.5)} fill={WARM} stroke={ink} strokeWidth={7} />
            <line x1={0} y1={175} x2={0} y2={225} stroke={ink} strokeWidth={5} />
          </G>
          <Note x={600} y={690} text="warm gas takes more room" o={vis(t, c[5] + 1.0)} size={36} fill={RED} />
          <G x={1320} y={450}>
            <ellipse rx={110 - 18 * Math.sin(t * 1.5)} ry={110 - 18 * Math.sin(t * 1.5)} fill={SOFT} stroke={ink} strokeWidth={7} />
            <line x1={0} y1={130} x2={0} y2={180} stroke={ink} strokeWidth={5} />
          </G>
          <Note x={1320} y={690} text="cold gas takes less" o={vis(t, c[5] + 1.8)} size={36} fill={teal} />
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[5] + 0.6)} size={36} fill={teal} />
        </G>
        <G o={k(6)}>
          <Sheet x={440} y={450} w={340} h={440} lines={4} />
          <Note x={960} y={735} text="Belgian guide" o={vis(t, c[6] + 0.6)} size={36} fill={teal} />
          {["kWh", "×  UNIT PRICE", "+  OTHER CHARGES"].map((txt, i) => (
            <G key={txt} o={vis(t, c[6] + 0.6 + i * 1.0)}>
              <Txt x={1100} y={330 + i * 120} size={72} fill={i === 0 ? orange : i === 1 ? teal : ink}>
                {txt}
              </Txt>
            </G>
          ))}
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["A TWIST"], ["SAME VOLUME, DIFFERENT HEAT"], ["CALORIFIC VALUE"], ["ORIGIN MATTERS"], ["TYPICAL, BRUSSELS"], ["CORRECTIONS"], ["THE UNIT PRICE"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ practical (23-24) */
const ScenePractical: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Meter x={560} y={480} s={1.3} value={t * 0.5} />
          <Txt x={960} y={450} size={220} fill={orange}>
            ≠
          </Txt>
          <Sheet x={1360} y={440} w={340} h={440} lines={4} o={vis(t, c[0] + 1.4)} />
          <Note x={560} y={700} text="a running total of gas" o={vis(t, c[0] + 2.4)} size={38} fill={teal} />
          <Note x={1360} y={700} text="the bill" o={vis(t, c[0] + 1.6)} size={40} fill={ink} />
        </G>
        <G o={k(1)}>
          <Stamp x={960} y={220} text="OUR READING: AN INFERENCE" o={vis(t, c[1] + 0.6)} size={44} pad={80} color={teal} rot={-2} />
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={260 + ((t * 120 + i * 100) % 500)} cy={470} r={10} fill={GREY} fillOpacity={0.6} />
          ))}
          <Meter x={960} y={500} s={1.1} value={t * 0.5} />
          <Arrow x1={1160} y1={470} x2={1330} y2={470} color={orange} w={10} o={vis(t, c[1] + 2.0)} />
          <G x={1480} y={470} o={vis(t, c[1] + 2.0)}>
            <circle r={80} fill={GOLD} stroke={ink} strokeWidth={7} />
            <circle r={54} fill="none" stroke={ink} strokeWidth={4} />
          </G>
          <Note x={420} y={600} text="invisible gas" o={vis(t, c[1] + 1.0)} size={38} fill={GREY} />
          <Note x={1480} y={620} text="something you can pay for" o={vis(t, c[1] + 2.6)} size={36} fill={ink} />
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["NOT YOUR BILL"], ["OUR READING", true]]} />
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
          <House x={1440} y={500} />
          <path d="M240 400 H1180 V470" fill="none" stroke={GREY} strokeWidth={28} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M240 560 C500 520 700 620 960 560 S1180 540 1270 540" fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" />
          <Flag x={460} y={340} text="a pipe" o={vis(t, c[0] + 1.0)} />
          <Flag x={460} y={620} text="a wire" o={vis(t, c[0] + 2.4)} />
          <Note x={960} y={735} text="today, you never think about either" o={vis(t, c[0] + 4.4)} size={38} fill={teal} />
        </G>
        <G o={k(1)}>
          <G x={212} y={150} s={0.85}>
            <path d="M240 520 C340 300 520 760 640 460 S860 220 960 540 S1160 760 1260 440 S1400 300 1500 520" fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" />
            <path d="M240 560 C380 380 560 700 700 520 S900 300 1000 500 S1200 700 1300 520 S1420 380 1520 560" fill="none" stroke={teal} strokeWidth={6} strokeLinecap="round" />
            <path d="M260 480 C400 640 520 340 680 560 S880 700 980 460 S1180 300 1280 600 S1400 660 1500 480" fill="none" stroke={orange} strokeWidth={6} strokeLinecap="round" />
          </G>
          <Txt x={960} y={280} size={190} serif fill={orange} spacing={4}>
            WHY?
          </Txt>
        </G>
      </SvgFrame>
      <SimpleNote o={1} />
      <Chips t={t} c={c} list={[["PIPE AND WIRE"], ["NEXT: THE PHONE CALL", true]]} />
    </>
  );
};

export const SCENES018: Record<string, React.FC<SceneProps>> = {
  hook: SceneHook,
  inside: SceneInside,
  counting: SceneCounting,
  reading: SceneReading,
  energy: SceneEnergy,
  practical: ScenePractical,
  close: SceneClose,
};
