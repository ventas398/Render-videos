import React from "react";
import { vis } from "../components/ui";
import { lerp, ramp } from "../utils/anim";
import type { SceneProps } from "./scenes";
import { Hand } from "./scenes009";
import { Cart, Chips, Note } from "./scenes011";
import { Arrow, Bulb, Calendar, Car, G, GOLD, GREEN, GREY, ink, orange, Person, RED, SAND, seg, SimpleNote, SOFT, Speech, Stamp, SvgFrame, Tag, teal, Txt, useT, WARM } from "./kit";

const FC = ["#E8A8A0", "#A9C3E8", "#F2D27A", "#B5D99C", "#C9B3E3"];
const PAPER = "#FFFDF4";

/* ------------------------------------------------------------------ piezas locales */
const Crate: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-40} y={-60} width={80} height={60} fill={SAND} stroke={ink} strokeWidth={4} />
    <line x1={-40} y1={-40} x2={40} y2={-40} stroke={ink} strokeWidth={3} />
  </G>
);

const HandBasket: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-50 -50 H50 L38 0 H-38 Z" fill={SAND} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
    <path d="M-40 -50 Q0 -120 40 -50" fill="none" stroke={ink} strokeWidth={5} />
  </G>
);

const Mic: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-40} y={-6} width={80} height={12} rx={6} fill={ink} />
    <rect x={-6} y={-120} width={12} height={116} fill={ink} />
    <circle cy={-150} r={36} fill={GREY} stroke={ink} strokeWidth={6} />
    {[-14, 0, 14].map((dx) => (
      <line key={dx} x1={dx} y1={-176} x2={dx} y2={-124} stroke={ink} strokeWidth={3} />
    ))}
  </G>
);

const Pram: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-80 -50 Q-80 -130 10 -130 V-50 Z" fill={WARM} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
    <path d="M10 -50 H80 L60 -20 H-60 L-80 -50 Z" fill={SOFT} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
    <line x1={80} y1={-50} x2={110} y2={-110} stroke={ink} strokeWidth={7} strokeLinecap="round" />
    {[-50, 50].map((wx) => (
      <circle key={wx} cx={wx} cy={0} r={22} fill={teal} stroke={ink} strokeWidth={5} />
    ))}
  </G>
);

const Shelf: React.FC<{ x: number; y: number; w: number; o?: number }> = ({ x, y, w, o = 1 }) => (
  <G x={x} y={y} o={o}>
    <rect x={-w / 2} y={-130} width={w} height={130} fill="#fff" fillOpacity={0.7} stroke={ink} strokeWidth={5} />
    <line x1={-w / 2} y1={-65} x2={w / 2} y2={-65} stroke={ink} strokeWidth={4} />
    {Array.from({ length: Math.floor(w / 60) }, (_, i) => (
      <g key={i}>
        <rect x={-w / 2 + 12 + i * 60} y={-112} width={36} height={44} fill={FC[i % 5]} stroke={ink} strokeWidth={3} />
        <rect x={-w / 2 + 12 + i * 60} y={-48} width={36} height={44} fill={FC[(i + 2) % 5]} stroke={ink} strokeWidth={3} />
      </g>
    ))}
  </G>
);

const Shop: React.FC<{ x: number; y: number; text: string; o?: number }> = ({ x, y, text, o = 1 }) => (
  <G x={x} y={y} o={o}>
    <rect x={-280} y={-260} width={560} height={260} fill="#fff" fillOpacity={0.8} stroke={ink} strokeWidth={6} />
    <rect x={-280} y={-260} width={560} height={70} fill={SOFT} stroke={ink} strokeWidth={6} />
    {[-200, -80, 40, 160].map((ax) => (
      <path key={ax} d={`M${ax} -190 H${ax + 80} L${ax + 70} -150 H${ax + 10} Z`} fill={ax % 240 === 40 ? WARM : "#F3D6D2"} stroke={ink} strokeWidth={3} />
    ))}
    <Txt x={0} y={-226} size={40} spacing={4}>
      {text}
    </Txt>
    <rect x={-60} y={-130} width={120} height={130} fill={SAND} stroke={ink} strokeWidth={5} />
    <rect x={-250} y={-130} width={150} height={90} fill="#EAF3F3" stroke={ink} strokeWidth={5} />
    <rect x={100} y={-130} width={150} height={90} fill="#EAF3F3" stroke={ink} strokeWidth={5} />
  </G>
);

const Poster: React.FC<{ x: number; y: number; s?: number; o?: number; rot?: number }> = ({ x, y, s = 1, o = 1, rot = 0 }) => (
  <G x={x} y={y} s={s} o={o} rot={rot}>
    <rect x={-260} y={-190} width={520} height={380} fill={PAPER} stroke={ink} strokeWidth={7} />
    <rect x={-260} y={-190} width={520} height={30} fill={orange} />
    {["NO BASKET", "CARRYING", "PLAN"].map((line, i) => (
      <Txt key={line} x={0} y={-90 + i * 90} size={72} serif>
        {line}
      </Txt>
    ))}
    <line x1={-200} y1={150} x2={200} y2={150} stroke={GREY} strokeWidth={5} />
  </G>
);

const Patent: React.FC<{ x: number; y: number; s?: number; o?: number; label: string; hi?: number }> = ({ x, y, s = 1, o = 1, label, hi = 0 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-150} y={-200} width={300} height={400} fill={PAPER} stroke={ink} strokeWidth={6} />
    <Txt x={0} y={-160} size={34} spacing={3}>
      {label}
    </Txt>
    {[-110, -80, -50].map((ly) => (
      <line key={ly} x1={-110} y1={ly} x2={110} y2={ly} stroke={GREY} strokeWidth={4} />
    ))}
    <Cart x={0} y={90} s={0.6} />
    {hi > 0 && <rect x={-160} y={-210} width={320} height={420} fill="none" stroke={GREEN} strokeWidth={10} opacity={hi} />}
  </G>
);

const Eyes: React.FC<{ x: number; y: number; o?: number; s?: number }> = ({ x, y, o = 1, s = 1 }) => (
  <G x={x} y={y} o={o} s={s}>
    {[-22, 22].map((ex) => (
      <g key={ex}>
        <ellipse cx={ex} cy={0} rx={18} ry={22} fill="#fff" stroke={ink} strokeWidth={4} />
        <circle cx={ex + 5} cy={2} r={8} fill={ink} />
      </g>
    ))}
  </G>
);

const Bag: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-80 -150 H80 L100 0 H-100 Z" fill={SAND} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
    <path d="M-40 -150 Q-40 -210 0 -210 Q40 -210 40 -150" fill="none" stroke={ink} strokeWidth={6} />
  </G>
);

const Fridge: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-60} y={-170} width={120} height={170} rx={12} fill="#fff" stroke={ink} strokeWidth={6} />
    <line x1={-60} y1={-100} x2={60} y2={-100} stroke={ink} strokeWidth={5} />
    <line x1={40} y1={-150} x2={40} y2={-120} stroke={ink} strokeWidth={6} strokeLinecap="round" />
    <line x1={40} y1={-90} x2={40} y2={-60} stroke={ink} strokeWidth={6} strokeLinecap="round" />
  </G>
);

/** Silueta con rotulo de texto; hat para el emprendedor. */
const Who: React.FC<{ x: number; y: number; s?: number; o?: number; body?: string; hat?: boolean; label?: string; ly?: number }> = ({ x, y, s = 1, o = 1, body = ink, hat, label, ly = 40 }) => (
  <G o={o}>
    <Person x={x} y={y} s={s} body={body} hat={hat} />
    {label && (
      <Txt x={x} y={y + ly} size={30} weight={600} fill={ink}>
        {label}
      </Txt>
    )}
  </G>
);

/** Carros encajados: n carros en fila con el mismo paso. */
const Nested: React.FC<{ x: number; y: number; n: number; step: number; s?: number; o?: number; show?: number }> = ({ x, y, n, step, s = 1, o = 1, show = n }) => (
  <G o={o}>
    {Array.from({ length: n }, (_, i) => n - 1 - i).map((i) => (
      <Cart key={i} x={x + i * step} y={y} s={s} o={i < show ? 1 : 0} />
    ))}
  </G>
);

/** Calendario de pared generico, sin ano. rows filas de 7 casillas; hiRow resalta una fila en naranja. */
const WallCal: React.FC<{ x: number; y: number; s?: number; o?: number; month?: string; rows: number; hiRow?: number }> = ({ x, y, s = 1, o = 1, month, rows, hiRow = -1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-250} y={-200} width={500} height={400} rx={14} fill="#fff" stroke={ink} strokeWidth={6} />
    <path d="M-250 -186 Q-250 -200 -236 -200 H236 Q250 -200 250 -186 V-130 H-250 Z" fill={teal} />
    {month && (
      <Txt x={0} y={-166} size={44} fill="#fff" spacing={6}>
        {month}
      </Txt>
    )}
    {Array.from({ length: rows * 7 }, (_, i) => (
      <rect key={i} x={-224 + (i % 7) * 66} y={-110 + Math.floor(i / 7) * 68} width={54} height={56} rx={6} fill={Math.floor(i / 7) === hiRow ? "#F6C79E" : "#F3F5F7"} stroke={Math.floor(i / 7) === hiRow ? orange : GREY} strokeWidth={Math.floor(i / 7) === hiRow ? 4 : 2} />
    ))}
  </G>
);

/* ------------------------------------------------------------------ hook (0-4) */
const SceneHook: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Person x={640} y={640} s={2.2} body={FC[1]} />
          <Cart x={1100} y={540} s={1.7} />
          <Note x={1100} y={700} text="nobody had to convince you" o={vis(t, c[0] + 2.4)} size={46} fill={ink} />
        </G>
        <G o={k(1)}>
          <Cart x={960} y={470} s={1.5} />
          <Tag x={960} y={210} text="1937" s={3} o={vis(t, c[1] + 2.0)} />
          {[420, 1500, 1260].map((px, i) => (
            <G key={px} o={vis(t, c[1] + 3.4 + i * 0.2)}>
              <Person x={px} y={640} s={1.8} body={FC[i]} />
              <line x1={px - 56} y1={520} x2={px + 56} y2={580} stroke={ink} strokeWidth={10} strokeLinecap="round" />
              <line x1={px + 56} y1={520} x2={px - 56} y2={580} stroke={ink} strokeWidth={10} strokeLinecap="round" />
            </G>
          ))}
        </G>
        <G o={k(2)}>
          <Who x={420} y={620} s={2} hat label="Sylvan Goldman" ly={50} />
          <Shelf x={1000} y={400} w={540} />
          <Shelf x={1560} y={400} w={240} />
          {[0, 1, 2].map((i) => (
            <G key={i} o={vis(t, c[2] + 3.0 + i * 0.3)}>
              <Person x={lerp(780, 1000, ramp(t, c[2] + 3.0, c[2] + 5.4)) + i * 260} y={680} s={1.1} body={FC[i + 2]} hat={i === 1} />
              <Cart x={lerp(780, 1000, ramp(t, c[2] + 3.0, c[2] + 5.4)) + i * 260 + 110} y={650} s={0.5} />
            </G>
          ))}
          <Note x={1100} y={720} text="hired to push" o={vis(t, c[2] + 3.4)} size={40} fill={ink} />
        </G>
        <G o={k(3)}>
          <Mic x={600} y={650} s={2} />
          <Who x={1000} y={650} s={1.7} hat body={ink} />
          <G o={vis(t, c[3] + 1.5)}>
            <Speech x={1460} y={260} text="Did they love it?" size={44} />
          </G>
          <Stamp x={1400} y={450} text="A BLUNT ANSWER" o={vis(t, c[3] + 3.6)} color={orange} size={40} />
        </G>
        <G o={k(4)}>
          <Txt x={640} y={340} size={400} serif fill={ink}>
            WHY
          </Txt>
          <Txt x={1100} y={330} size={400} serif fill={orange}>
            ?
          </Txt>
          <Cart x={1400} y={620} s={1.2} o={vis(t, c[4] + 0.8)} />
          <Stamp x={1500} y={330} text="NO, THANKS" rot={-6} o={vis(t, c[4] + 1.6)} size={56} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(2), k(3), k(4))} />
      <Chips t={t} c={c} list={[["THE EASY CART"], ["1937"], ["THE INVENTOR"], ["A BLUNT ANSWER"], ["WHY?", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ problem (5-8) */
const SceneProblem: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const drop = ramp(t, c[0] + 2.4, c[0] + 3.2);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Person x={760} y={680} s={2.3} body={FC[1]} />
          <Crate x={760} y={640} s={2} />
          <Crate x={760} y={525} s={2} />
          <HandBasket x={560} y={660} s={1.3} />
          <Bag x={1010} y={660} s={0.9} />
          <circle cx={900} cy={lerp(300, 700, drop)} r={30} fill={FC[2]} stroke={ink} strokeWidth={5} opacity={vis(t, c[0] + 2.4)} />
          <Note x={1340} y={420} text="only what you can carry" o={vis(t, c[0] + 1.6)} size={52} fill={ink} />
        </G>
        <G o={k(1)}>
          <G x={620} y={330} o={1}>
            <path d="M-300 -100 H300 V100 H-170 V-45 H-300 Z" fill="#EDF3E6" stroke={ink} strokeWidth={6} strokeLinejoin="round" />
            <Txt x={80} y={0} size={56} serif>
              Oklahoma
            </Txt>
          </G>
          <Person x={1400} y={600} s={1.7} body={FC[1]} />
          <Crate x={1400} y={560} s={1.5} />
          <Shelf x={1400} y={310} w={360} o={vis(t, c[1] + 6.6)} />
          <G o={vis(t, c[1] + 6.6)}>
            <rect x={1560} y={400} width={16} height={56} fill={orange} />
            <rect x={1590} y={400} width={16} height={56} fill={orange} />
          </G>
          <Note x={1400} y={700} text="National Public Radio" o={vis(t, c[1] + 3.5)} size={34} />
          <Who x={620} y={700} s={1.3} hat label="Sylvan Goldman" ly={44} o={vis(t, c[1] + 0.2)} />
        </G>
        <G o={k(2)}>
          <Tag x={360} y={190} text="1936" s={3} o={vis(t, c[2] + 0.3)} />
          <G x={960} y={640} o={vis(t, c[2] + 2.8)}>
            <rect x={-130} y={-190} width={20} height={190} fill={ink} />
            <rect x={-130} y={-190} width={260} height={24} fill={ink} />
            <rect x={-130} y={-290} width={26} height={110} fill={ink} />
            {[-110, 110].map((lx) => (
              <line key={lx} x1={lx} y1={-166} x2={lx} y2={0} stroke={ink} strokeWidth={14} />
            ))}
            <G o={vis(t, c[2] + 4.4)}>
              <HandBasket x={0} y={-190} s={1.6} />
            </G>
            {[-110, 110].map((wx) => (
              <circle key={wx} cx={wx} cy={22} r={26} fill={teal} stroke={ink} strokeWidth={6} opacity={vis(t, c[2] + 5.4)} />
            ))}
          </G>
          <Note x={960} y={730} text="a folding chair" o={vis(t, c[2] + 3.2)} size={40} fill={ink} />
        </G>
        <G o={k(3)}>
          <Who x={420} y={620} s={1.8} label="Fred Young, mechanic" ly={50} o={vis(t, c[3] + 0.8)} />
          <G x={1100} y={640} o={vis(t, c[3] + 2.3)}>
            <path d="M-200 -250 H-150 L-120 -40 H150 L190 -210" fill="none" stroke={ink} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
            <line x1={-120} y1={-40} x2={-130} y2={20} stroke={ink} strokeWidth={10} />
            <line x1={140} y1={-40} x2={130} y2={20} stroke={ink} strokeWidth={10} />
            {[-130, 130].map((wx) => (
              <circle key={wx} cx={wx} cy={36} r={22} fill={teal} stroke={ink} strokeWidth={6} />
            ))}
            <G o={vis(t, c[3] + 3.5)}>
              <rect x={-120} y={-110} width={270} height={70} fill="#fff" fillOpacity={0.6} stroke={ink} strokeWidth={6} />
            </G>
            <G o={vis(t, c[3] + 3.9)}>
              <rect x={-130} y={-190} width={290} height={70} fill="#fff" fillOpacity={0.6} stroke={ink} strokeWidth={6} />
            </G>
          </G>
          <Note x={1100} y={730} text="a metal frame, two wire baskets" o={vis(t, c[3] + 3.0)} size={40} fill={ink} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(2), k(3))} />
      <Chips t={t} c={c} list={[["ARMS FULL"], ["OKLAHOMA"], ["A FOLDING CHAIR"], ["TWO WIRE BASKETS"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ launch (9-13) */
const SceneLaunch: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Calendar x={520} y={400} s={1.5} month="JUNE" year="1937" o={vis(t, c[0] + 1.9)} />
          <Shop x={1300} y={640} text="OKLAHOMA CITY" o={vis(t, c[0] + 4.4)} />
          <Cart x={1300} y={690} s={0.8} o={vis(t, c[0] + 5.0)} />
        </G>
        <G o={k(1)}>
          <Poster x={960} y={400} s={1.4} rot={-3} o={vis(t, c[1] + 1.3)} />
          <Note x={960} y={720} text="Illustration, not the original page" o={vis(t, c[1] + 1.4)} size={34} />
        </G>
        <G o={k(2)}>
          <Person x={420} y={640} s={2} body={FC[1]} />
          <Speech x={500} y={230} text="not for me" o={vis(t, c[2] + 2.3)} />
          <Cart x={960} y={560} s={1.5} />
          <G o={vis(t, c[2] + 4.0)}>
            <Txt x={1230} y={470} size={120} fill={orange}>
              =
            </Txt>
            <Pram x={1530} y={620} s={1.7} />
          </G>
          <Note x={1530} y={730} text="like a baby carriage" o={vis(t, c[2] + 4.2)} size={38} fill={ink} />
          <Note x={960} y={730} text="according to accounts" o={vis(t, c[2] + 1.3)} size={34} fill={teal} />
        </G>
        <G o={k(3)}>
          {[380, 700, 1020].map((px, i) => (
            <G key={px} o={vis(t, c[3] + 1.4 + i * 0.5)}>
              <Person x={px} y={650} s={1.7} body={FC[i + 1]} />
              <HandBasket x={px + 80} y={650} s={1} />
              <Txt x={px} y={470} size={44} fill={RED}>NO</Txt>
            </G>
          ))}
          <Cart x={1500} y={560} s={1.4} />
          <G o={vis(t, c[3] + 3.9)}><Txt x={1500} y={300} size={220} serif fill={orange}>
            ?
          </Txt></G>
          <Note x={700} y={310} text="we can carry our own baskets" o={vis(t, c[3] + 1.6)} size={44} fill={ink} />
        </G>
        <G o={k(4)}>
          <Mic x={520} y={650} s={2} />
          <Tag x={520} y={190} text="1977" s={3} o={vis(t, c[4] + 1.9)} />
          <G o={vis(t, c[4] + 6.1)} x={1250} y={380}>
            <rect x={-420} y={-130} width={840} height={260} rx={50} fill="#fff" stroke={ink} strokeWidth={7} />
            <polygon points="-300,128 -360,200 -220,128" fill="#fff" stroke={ink} strokeWidth={7} strokeLinejoin="round" />
            <line x1={-290} y1={129} x2={-230} y2={129} stroke="#fff" strokeWidth={10} />
            <Txt x={0} y={-50} size={72} fill={ink}>
              &quot;No, no.
            </Txt>
            <Txt x={0} y={44} size={72} fill={ink}>
              That&apos;s a big lie.&quot;
            </Txt>
          </G>
          <Note x={1250} y={640} text="1977 interview, as reported by National Public Radio" o={vis(t, c[4] + 6.3)} size={32} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(2))} />
      <Chips t={t} c={c} list={[["JUNE 1937"], ["THE PLAN"], ["SHOPPERS SAID NO", true], ["OTHER REASONS"], ["1977 INTERVIEW"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ persuade (14-18) */
const ScenePersuade: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const walk = ramp(t, c[0] + 1.6, c[0] + 6.8);
  const grab = ramp(t, c[2] + 3.8, c[2] + 5.4);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Shelf x={560} y={330} w={420} />
          <Shelf x={1360} y={330} w={420} />
          {[0, 1, 2].map((i) => (
            <G key={i}>
              <Person x={lerp(300, 820, walk) + i * 230} y={690} s={1.3} body={FC[i + 1]} hat={i !== 1} />
              <Cart x={lerp(300, 820, walk) + i * 230 + 130} y={660} s={0.6} />
            </G>
          ))}
          <Eyes x={1560} y={560} o={vis(t, c[0] + 2.6)} s={1.4} />
          <Eyes x={1720} y={600} o={vis(t, c[0] + 3.0)} s={1.2} />
          <Note x={760} y={160} text="models and actors" o={vis(t, c[0] + 2.4)} size={44} fill={ink} />
        </G>
        <G o={k(1)}>
          <Person x={520} y={650} s={2.1} body={FC[3]} hat />
          <Txt x={520} y={720} size={32} weight={600} fill={ink}>
            greeter
          </Txt>
          <G x={960} y={330} o={vis(t, c[1] + 0.9)}>
            <rect x={-230} y={-60} width={460} height={120} rx={14} fill="#fff" stroke={ink} strokeWidth={6} />
            <Txt x={0} y={0} size={56}>
              How it works
            </Txt>
          </G>
          <Arrow x1={1100} y1={400} x2={1330} y2={500} color={orange} o={vis(t, c[1] + 1.8)} />
          <Cart x={1440} y={600} s={1.6} o={vis(t, c[1] + 1.5)} />
        </G>
        <G o={k(2)}>
          <Person x={440} y={660} s={1.9} body={FC[0]} />
          <Eyes x={440} y={460} o={vis(t, c[2] + 1.0)} s={1.3} />
          <Person x={1080} y={640} s={1.4} body={FC[1]} />
          <Cart x={1300} y={610} s={0.9} />
          <Person x={1560} y={640} s={1.4} body={FC[4]} />
          <Cart x={lerp(1700, 700, grab)} y={620} s={lerp(0.7, 1.1, grab)} o={vis(t, c[2] + 3.8)} />
          <Stamp x={960} y={250} text="OUR READING: AN INFERENCE" o={vis(t, c[2] + 0.3)} color={teal} size={36} />
        </G>
        <G o={k(3)}>
          <Nested x={460} y={560} n={5} step={240} s={0.9} show={Math.min(5, Math.max(0, Math.floor((t - c[3] - 0.4) * 1.1)))} />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={1500 + (i % 2) * 70} cy={lerp(230, 150, ramp(t, c[3] + 3.1 + i * 0.4, c[3] + 4.4 + i * 0.4)) + i * 20} r={40} fill={GOLD} stroke={ink} strokeWidth={6} opacity={vis(t, c[3] + 3.1 + i * 0.4)} />
          ))}
          <Note x={1420} y={355} text="royalties, reportedly" o={vis(t, c[3] + 3.4)} size={44} fill={ink} />
        </G>
        <G o={k(4)}>
          <Who x={560} y={650} s={2} hat label="Sylvan Goldman" ly={50} />
          <Speech x={680} y={200} text="somebody else would have" size={44} o={vis(t, c[4] + 3.4)} />
          <Tag x={230} y={430} text="1977" s={2.4} o={vis(t, c[4] + 0.2)} />
          <Person x={1500} y={650} s={1.8} body={GREY} />
          <Bulb x={1500} y={330} on={ramp(t, c[4] + 4.4, c[4] + 5.4)} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(3), k(4))} />
      <Chips t={t} c={c} list={[["THEATER"], ["GREETERS"], ["OUR READING", true], ["ROYALTIES"], ["SOMEBODY ELSE"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ nest (19-23) */
const SceneNest: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const push = ramp(t, c[1] + 3.6, c[1] + 6.0);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <rect x={300} y={160} width={1320} height={560} fill="#fff" fillOpacity={0.5} stroke={ink} strokeWidth={6} />
          <rect x={1200} y={330} width={20} height={390} fill={SAND} stroke={ink} strokeWidth={5} />
          <rect x={1200} y={160} width={20} height={80} fill={SAND} stroke={ink} strokeWidth={5} />
          <Cart x={800} y={640} s={1.3} />
          <Cart x={1130} y={600} s={1.5} rot={-12} o={vis(t, c[0] + 1.6)} />
          <Cart x={540} y={640} s={1.0} o={vis(t, c[0] + 2.4)} />
          <Txt x={960} y={230} size={46} fill={ink}>
            TOO MUCH SPACE
          </Txt>
        </G>
        <G o={k(1)}>
          <Who x={300} y={640} s={1.9} label="Orla Watson, Kansas City" ly={50} o={vis(t, c[1] + 1.6)} />
          <Cart x={1260} y={560} s={1.5} />
          <Cart x={lerp(520, 1070, push)} y={560} s={1.5} />
          <G o={vis(t, c[1] + 5.0)}>
            <line x1={1130} y1={430} x2={1146} y2={530} stroke={orange} strokeWidth={14} strokeLinecap="round" />
            <Txt x={1070} y={240} size={36} fill={orange}>
              swinging gate
            </Txt>
          </G>
        </G>
        <G o={k(2)}>
          <Tag x={960} y={205} text="1946" s={3} o={vis(t, c[2] + 1.8)} />
          <Patent x={620} y={430} label="WATSON" o={vis(t, c[2] + 0.6)} s={1.1} />
          <Patent x={1300} y={430} label="GOLDMAN" o={vis(t, c[2] + 3.4)} s={1.1} />
          <Note x={960} y={730} text="Illustration, not the original patent" o={vis(t, c[2] + 0.8)} size={32} />
        </G>
        <G o={k(3)}>
          <Who x={480} y={640} s={1.8} label="Watson" ly={50} body={FC[1]} />
          <Who x={1440} y={640} s={1.8} label="Goldman" ly={50} hat />
          <rect x={800} y={390} width={320} height={220} fill={PAPER} stroke={ink} strokeWidth={6} transform="rotate(-4 960 500)" />
          <G o={vis(t, c[3] + 2.0)}>
            <Patent x={960} y={470} label="PATENT" s={0.5} hi={1} />
          </G>
          <Stamp x={1440} y={250} text="LICENSE" o={vis(t, c[3] + 3.5)} color={teal} size={52} />
          <G o={vis(t, c[3] + 2.1)}><Txt x={480} y={330} size={140} fill={GREEN}>
            ✓
          </Txt></G>
        </G>
        <G o={k(4)}>
          <rect x={660} y={200} width={600} height={460} fill={PAPER} stroke={ink} strokeWidth={7} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={710} y={250 + i * 56} width={i % 3 === 2 ? 300 : 500} height={26} rx={8} fill={GREY} opacity={0.35} />
          ))}
          <Stamp x={960} y={430} text="SOURCES DIFFER" o={vis(t, c[4] + 2.7)} color={orange} size={56} rot={-10} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1))} />
      <Chips t={t} c={c} list={[["A NEW PROBLEM"], ["THE NESTING CART"], ["THE PATENT YEAR"], ["A DISPUTE"], ["SOURCES DIFFER", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ why (24-26) */
const SceneWhy: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const slide = ramp(t, c[0] + 1.2, c[0] + 3.2);
  const grow = ramp(t, c[1] + 4.8, c[1] + 7.2);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Nested x={lerp(300, 420, slide)} y={500} n={5} step={lerp(300, 90, slide)} s={1.3} />
          <Hand x={lerp(300, 270, slide)} y={470} s={1.6} rot={90} />
          <Stamp x={960} y={190} text="OUR READING" o={vis(t, c[0] + 0.3)} color={teal} size={40} />
          <Note x={960} y={700} text="compact in a row" o={vis(t, c[0] + 3.0)} size={44} fill={ink} />
        </G>
        <G o={k(1)}>
          <Cart x={420} y={400} s={1} o={vis(t, c[1] + 3.6)} />
          <Car x={420} y={620} s={0.8} o={vis(t, c[1] + 4.4)} />
          <Fridge x={700} y={600} s={1.1} o={vis(t, c[1] + 5.2)} />
          <Arrow x1={800} y1={400} x2={1140} y2={430} color={orange} o={vis(t, c[1] + 6.0)} />
          <Bag x={1440} y={640} s={lerp(1, 2, grow)} />
          <Note x={420} y={730} text="National Public Radio" o={vis(t, c[1] + 3.6)} size={32} />
          <G o={vis(t, c[1] + 2.0)}><Txt x={1000} y={170} size={36} weight={600} fill={ink}>
            Andrew Warnes, University of Leeds
          </Txt></G>
        </G>
        <G o={k(2)}>
          <HandBasket x={520} y={620} s={1.8} />
          <Cart x={1300} y={640} s={1.9} />
          {[1180, 1260, 1340, 1420].map((px, i) => (
            <circle key={px} cx={px} cy={500 + (i % 2) * 20} r={26} fill={FC[i]} stroke={ink} strokeWidth={5} opacity={vis(t, c[2] + 1.4 + i * 0.3)} />
          ))}
          <Stamp x={960} y={190} text="AN ARGUMENT, NOT A MEASURE" o={vis(t, c[2] + 4.2)} color={orange} size={40} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(2))} />
      <Chips t={t} c={c} list={[["NESTED CARTS", true], ["IMPULSE BUYING"], ["AN ARGUMENT", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ practical (27-28) */
const ScenePractical: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const out = ramp(t, c[0] + 1.2, c[0] + 2.4);
  const open = ramp(t, c[0] + 4.5, c[0] + 5.2) * (1 - ramp(t, c[0] + 6.8, c[0] + 7.2));
  return (
    <>
      <SvgFrame>
        <G o={vis(t, c[0] + 0.1, c[0] + 3.4)}>
          <Nested x={420} y={560} n={4} step={110} s={1.2} />
          <Cart x={lerp(420 + 330, 900, out)} y={lerp(560, 600, out)} s={1.2} />
          <Hand x={lerp(420 + 150, 720, out)} y={420} s={1.4} rot={90} />
        </G>
        <G o={vis(t, c[0] + 3.4, c[1] - 0.4)}>
          <Cart x={1000} y={520} s={2.2} />
          <Cart x={lerp(300, 760, ramp(t, c[0] + 5.2, c[0] + 6.8))} y={520} s={1.9} o={vis(t, c[0] + 5.0)} />
          <G x={1000 - 96 * 2.2} y={520 - 80 * 2.2} rot={-open * 50}>
            <line x1={0} y1={-50 * 2.2} x2={16 * 2.2} y2={50 * 2.2} stroke={orange} strokeWidth={22} strokeLinecap="round" />
          </G>
          <Note x={1000} y={730} text="the back swings open" o={vis(t, c[0] + 4.0)} size={44} fill={ink} />
        </G>
        <G o={k(1)}>
          <Cart x={560} y={500} s={2.4} />
          <line x1={560 - 96 * 2.4} y1={500 - 130 * 2.4} x2={560 - 80 * 2.4} y2={500 - 30 * 2.4} stroke={orange} strokeWidth={22} strokeLinecap="round" />
          <Arrow x1={1060} y1={420} x2={1300} y2={420} color={orange} o={vis(t, c[1] + 1.4)} />
          <Tag x={1560} y={420} text="1940s" s={3.4} o={vis(t, c[1] + 3.2)} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1))} />
      <Chips t={t} c={c} list={[["LOOK AT THE BACK"], ["THE SWINGING GATE", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ close (29-31) */
const SceneClose: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const real = ramp(t, c[1] + 1.4, c[1] + 3.0);
  const cal = ramp(t, c[2] + 0.2, c[2] + 1.4);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Shelf x={560} y={380} w={420} />
          <Shelf x={1300} y={380} w={420} />
          <Nested x={500} y={650} n={4} step={150} s={0.8} />
          <Person x={1640} y={660} s={1.1} body={GREY} o={vis(t, c[0] + 3.0)} />
          <HandBasket x={1740} y={660} s={0.8} o={vis(t, c[0] + 3.0)} />
          <Note x={960} y={730} text="a supermarket without carts?" o={vis(t, c[0] + 3.6)} size={44} fill={ink} />
        </G>
        <G o={vis(t, c[1] + 0.1, c[2] - 0.2)}>
          {[0, 1, 2, 3, 4].map((i) => (
            <G key={i}>
              <Person x={260 + i * 230} y={560} s={1.4} body={real > 0.5 ? FC[i] : GREY} />
              <G o={1 - real}>
                <Txt x={260 + i * 230} y={335} size={28} fill={orange}>
                  HIRED
                </Txt>
              </G>
              <Cart x={260 + i * 230 + 100} y={540} s={0.5} />
            </G>
          ))}
          <Note x={760} y={290} text="a good idea does not always sell itself" o={vis(t, c[1] + 0.2)} size={44} fill={ink} />
          <Note x={760} y={690} text="some things we never question" o={vis(t, c[1] + 2.5)} size={44} fill={orange} />
        </G>
        <G o={vis(t, c[1] + 4.4, c[2] - 0.2)}>
          <WallCal x={1560} y={440} s={0.9} rows={5} />
        </G>
        <G o={vis(t, c[2] + 0.1)}>
          <WallCal x={lerp(1560, 760, cal)} y={lerp(440, 420, cal)} s={lerp(0.9, 1.45, cal)} month="FEBRUARY" rows={4} hiRow={3} />
          <G o={vis(t, c[2] + 1.6)}><Txt x={1500} y={420} size={260} serif fill={orange}>
            28?
          </Txt></G>
        </G>
      </SvgFrame>
      <SimpleNote o={k(0)} />
      <Chips t={t} c={c} list={[["FROM REFUSED TO NORMAL"], ["THE CALENDAR"], ["FEBRUARY", true]]} />
    </>
  );
};

export const SCENES012: Record<string, React.FC<SceneProps>> = {
  "hook": SceneHook,
  "problem": SceneProblem,
  "launch": SceneLaunch,
  "persuade": ScenePersuade,
  "nest": SceneNest,
  "why": SceneWhy,
  "practical": ScenePractical,
  "close": SceneClose,
};
