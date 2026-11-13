import React from "react";
import { Chip, Note, vis } from "../components/ui";
import { lerp, ramp } from "../utils/anim";
import type { SceneProps } from "./scenes";
import {
  AMBER, Arrow, bg, Car, G, GOLD, GREY, Ground, orange, Person, Plaque, RED, SAND, seg, SimpleNote, SOFT, Speech, Stamp, SvgFrame, teal, Txt, useT, WARM, ink,
} from "./kit";

const BLUE = "#4A7FD6";
const PAPER = "#FFFDF4";

/** Silueta generica (todo del mismo color), sin retrato real. */
const Sil: React.FC<{ x: number; y: number; s?: number; o?: number; hat?: boolean; glasses?: boolean; fist?: number; color?: string }> = ({ x, y, s = 1, o = 1, hat = false, glasses = false, fist = 0, color = ink }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-52 0 V-30 Q-52 -64 -20 -64 H20 Q52 -64 52 -30 V0 Z" fill={color} />
    <rect x={-10} y={-80} width={20} height={20} fill={color} />
    <circle cx={0} cy={-102} r={30} fill={color} />
    {hat && (
      <>
        <rect x={-42} y={-134} width={84} height={9} rx={3} fill={color} />
        <rect x={-26} y={-190} width={52} height={60} fill={color} />
      </>
    )}
    {glasses && (
      <g fill="none" stroke={bg} strokeWidth={3}>
        <circle cx={-12} cy={-104} r={9} />
        <circle cx={12} cy={-104} r={9} />
      </g>
    )}
    {fist > 0 && (
      <g stroke={color} strokeWidth={14} strokeLinecap="round">
        <line x1={38} y1={-50} x2={62} y2={-130 - fist * 12} />
        <circle cx={62} cy={-136 - fist * 12} r={11} fill={color} />
      </g>
    )}
  </G>
);

/** Tarjeta tipografica de abreviatura: frase, version mal escrita a proposito, iniciales. */
const Card: React.FC<{ x: number; y: number; s?: number; o?: number; t: number; t0: number; a: string; b?: string; mid?: React.ReactNode; big: string; at?: [number, number, number] }> = ({ x, y, s = 1, o = 1, t, t0, a, b, mid, big, at = [0, 1.6, 0.8] }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-220} y={-150} width={440} height={300} rx={14} fill={PAPER} stroke={ink} strokeWidth={5} />
    <rect x={-190} y={-130} width={380} height={5} fill={ink} opacity={0.5} />
    <G o={vis(t, t0 + at[0])}>
      <Txt x={0} y={-80} size={46} serif>
        {a}
      </Txt>
    </G>
    <G o={vis(t, t0 + at[1])}>
      {mid ?? (
        <Txt x={0} y={-10} size={46} serif fill={orange}>
          {b}
        </Txt>
      )}
    </G>
    <G o={vis(t, t0 + at[2])}>
      <Txt x={0} y={82} size={104} serif fill={teal} spacing={4}>
        {big}
      </Txt>
    </G>
  </G>
);

const Phone: React.FC<{ x: number; y: number; s?: number; o?: number; msgs: string[] }> = ({ x, y, s = 1, o = 1, msgs }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-90} y={-170} width={180} height={340} rx={26} fill="#fff" stroke={ink} strokeWidth={6} />
    <rect x={-32} y={-152} width={64} height={9} rx={4} fill={ink} />
    {msgs.map((m, i) => (
      <g key={m}>
        <rect x={-70 + (i % 2) * 20} y={-110 + i * 80} width={110} height={56} rx={22} fill={i % 2 ? SOFT : teal} stroke={ink} strokeWidth={3} />
        <Txt x={-15 + (i % 2) * 20} y={-82 + i * 80} size={34} fill={i % 2 ? ink : "#fff"}>
          {m}
        </Txt>
      </g>
    ))}
  </G>
);

const Newsprint: React.FC<{ x: number; y: number; w?: number; h?: number; o?: number; rot?: number; head?: string }> = ({ x, y, w = 420, h = 520, o = 1, rot = 0, head }) => (
  <G x={x} y={y} o={o} rot={rot}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={PAPER} stroke={ink} strokeWidth={5} />
    {head && (
      <Txt x={0} y={-h / 2 + 50} size={34} serif spacing={2}>
        {head}
      </Txt>
    )}
    {Array.from({ length: Math.floor((h - 150) / 32) }, (_, i) => (
      <rect key={i} x={-w / 2 + 30} y={-h / 2 + 100 + i * 32} width={i % 3 === 2 ? w * 0.5 : w - 60} height={12} rx={6} fill={GREY} opacity={0.45} />
    ))}
  </G>
);

const Bin: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <G x={x} y={y} s={s}>
    <path d="M-80 -120 H80 L66 80 H-66 Z" fill={SOFT} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
    <rect x={-96} y={-146} width={192} height={26} rx={8} fill={ink} />
    {[-30, 0, 30].map((lx) => (
      <line key={lx} x1={lx} y1={-90} x2={lx * 0.8} y2={50} stroke={ink} strokeWidth={4} opacity={0.5} />
    ))}
  </G>
);

const Globe: React.FC<{ x: number; y: number; r: number; t: number }> = ({ x, y, r, t }) => (
  <G x={x} y={y}>
    <circle r={r} fill={SOFT} stroke={ink} strokeWidth={7} />
    <ellipse rx={r * 0.48} ry={r} fill="none" stroke={ink} strokeWidth={3} opacity={0.5} />
    <ellipse rx={r} ry={r * 0.38} fill="none" stroke={ink} strokeWidth={3} opacity={0.5} />
    <line x1={0} y1={-r} x2={0} y2={r} stroke={ink} strokeWidth={3} opacity={0.5} />
    {[[-0.55, -0.35], [0.4, -0.5], [-0.2, 0.25], [0.6, 0.2], [-0.65, 0.5], [0.1, -0.1], [0.25, 0.62], [-0.35, -0.7]].map(([a, b], i) => (
      <g key={i}>
        <circle cx={a * r} cy={b * r} r={22 + 10 * Math.sin(t * 3 + i)} fill={GOLD} opacity={0.35} />
        <circle cx={a * r} cy={b * r} r={9} fill={AMBER} stroke={ink} strokeWidth={2} />
      </g>
    ))}
  </G>
);

/** Letras O y K como trazos, para animar el dibujo. */
const OKStroke: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => {
  const L = 2 * Math.PI * 120;
  return (
    <G x={x} y={y}>
      <circle cx={-170} cy={0} r={120} fill="none" stroke={ink} strokeWidth={38} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - Math.min(1, p * 2))} transform="rotate(-90 -170 0)" />
      <g fill="none" stroke={ink} strokeWidth={38} strokeLinecap="round" strokeLinejoin="round">
        <path d="M60 -120 V120" strokeDasharray={240} strokeDashoffset={240 * (1 - Math.min(1, Math.max(0, p * 2 - 1) * 2))} />
        <path d="M230 -120 L70 10 L240 120" strokeDasharray={420} strokeDashoffset={420 * (1 - Math.max(0, p * 2 - 1.5) * 2)} opacity={p > 0.75 ? 1 : 0} />
      </g>
    </G>
  );
};

const Cart: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-150 -170 H-100 L-60 40 H120" fill="none" stroke={ink} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M-92 -110 H150 L120 20 H-62 Z" fill={SOFT} stroke={ink} strokeWidth={7} strokeLinejoin="round" />
    {[-30, 20, 70].map((lx) => (
      <line key={lx} x1={lx} y1={-104} x2={lx - 10} y2={14} stroke={ink} strokeWidth={3} opacity={0.5} />
    ))}
    {[-40, 100].map((wx) => (
      <circle key={wx} cx={wx} cy={72} r={20} fill={ink} />
    ))}
  </G>
);

const Priced: React.FC<{ x: number; y: number; label: string; hi?: boolean; fill: string; o?: number }> = ({ x, y, label, hi = false, fill, o = 1 }) => (
  <G x={x} y={y} o={o}>
    <rect x={-70} y={-110} width={140} height={110} rx={8} fill={fill} stroke={ink} strokeWidth={5} />
    <rect x={-50} y={-86} width={100} height={20} rx={4} fill="#fff" opacity={0.6} />
    <rect x={-84} y={14} width={168} height={72} rx={8} fill="#fff" stroke={hi ? orange : ink} strokeWidth={hi ? 6 : 4} />
    <text x={0} y={52} textAnchor="middle" dominantBaseline="central" fontFamily="Segoe UI, sans-serif" fontWeight={800} fontSize={44} fill={ink}>
      {hi ? label.slice(0, -1) : label}
      {hi && <tspan fill={orange}>{label.slice(-1)}</tspan>}
    </text>
  </G>
);

const MiniMap: React.FC<{ x: number; y: number; s?: number; dot: [number, number]; poly: string; extra?: string }> = ({ x, y, s = 1, dot, poly, extra }) => (
  <G x={x} y={y} s={s}>
    <polygon points={poly} fill={SAND} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
    {extra && <path d={extra} fill={SAND} stroke={ink} strokeWidth={5} strokeLinejoin="round" />}
    <circle cx={dot[0]} cy={dot[1]} r={22} fill={orange} opacity={0.3} />
    <circle cx={dot[0]} cy={dot[1]} r={11} fill={orange} stroke={ink} strokeWidth={3} />
  </G>
);

// ---------------------------------------------------------------- 1: gancho
export const SceneHook: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const s0 = seg(t, c, 0);
  const s1 = seg(t, c, 1);
  const s2 = seg(t, c, 2);
  const s3 = seg(t, c, 3);
  const fall = ramp(t, c[0] + 1.6, c[0] + 2.4);
  const split = ramp(t, c[2] + 0.3, c[2] + 1.2);
  const vig = [380, 960, 1540];
  return (
    <>
      <SvgFrame>
        <G o={s0}>
          <Txt x={960} y={250} size={46} serif fill={GREY}>
            OLL KORRECT
          </Txt>
          <line x1={730} y1={252} x2={1190} y2={252} stroke={orange} strokeWidth={6} strokeLinecap="round" opacity={ramp(t, c[0] + 2.6, c[0] + 3.2)} />
          <G x={1250} y={222} rot={35} o={ramp(t, c[0] + 2.4, c[0] + 3.0)}>
            <polygon points="-14,-60 14,-60 14,30 0,52 -14,30" fill={AMBER} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
            <polygon points="-14,30 14,30 0,52" fill={ink} />
          </G>
          <Txt x={960} y={470} size={400} weight={900}>
            OK
          </Txt>
          <G x={0} y={lerp(-160, 0, fall)} o={fall}>
            <Txt x={1420} y={250} size={220} serif fill={orange}>
              ?
            </Txt>
          </G>
        </G>
        <G o={s1}>
          {vig.map((x, i) => (
            <G key={x} o={vis(t, c[1] + 0.2 + i * 0.9)}>
              <rect x={x - 230} y={170} width={460} height={400} rx={18} fill="#fff" stroke={ink} strokeWidth={5} />
              {i === 0 && (
                <>
                  <rect x={x - 170} y={460} width={340} height={16} fill={SAND} stroke={ink} strokeWidth={4} />
                  <rect x={x + 20} y={370} width={130} height={90} rx={8} fill={SOFT} stroke={ink} strokeWidth={5} />
                  <Person x={x - 80} y={540} body={teal} />
                  <Speech x={x - 20} y={270} text="OK" size={46} />
                </>
              )}
              {i === 1 && (
                <>
                  <rect x={x + 10} y={410} width={170} height={130} rx={8} fill={WARM} stroke={ink} strokeWidth={5} />
                  <circle cx={x + 60} cy={410} r={22} fill={SOFT} stroke={ink} strokeWidth={4} />
                  <circle cx={x + 130} cy={410} r={22} fill={SOFT} stroke={ink} strokeWidth={4} />
                  <Person x={x - 90} y={540} body={orange} />
                  <Speech x={x - 20} y={270} text="OK" size={46} />
                </>
              )}
              {i === 2 && (
                <>
                  <Phone x={x} y={380} s={0.8} msgs={[]} />
                  <rect x={x - 48} y={344} width={100} height={50} rx={22} fill={teal} stroke={ink} strokeWidth={3} />
                  <Txt x={x + 2} y={370} size={34} fill="#fff">
                    ok
                  </Txt>
                </>
              )}
              <Txt x={x} y={610} size={36}>
                {["AT WORK", "AT HOME", "IN A TEXT"][i]}
              </Txt>
            </G>
          ))}
        </G>
        <G o={s2}>
          <Txt x={lerp(900, 680, split)} y={440} size={400} weight={900}>
            O
          </Txt>
          <Txt x={lerp(1020, 1240, split)} y={440} size={400} weight={900}>
            K
          </Txt>
          {[680, 1240].map((x) => (
            <G key={x} o={vis(t, c[2] + 1.0)}>
              <Txt x={x} y={185} size={150} serif fill={orange}>
                ?
              </Txt>
            </G>
          ))}
        </G>
        <G o={s3}>
          <MiniMap
            x={760}
            y={150}
            dot={[352, 92]}
            poly="0,0 330,0 340,60 360,70 350,110 300,130 290,180 330,200 320,260 270,300 290,360 240,420 260,470 220,520 0,520"
            extra="M358 70 Q430 70 450 130 Q440 150 420 130 Q400 100 358 100 Z"
          />
          <G o={vis(t, c[3] + 1.0)}>
            <Txt x={1380} y={246} size={56} fill={orange}>
              BOSTON
            </Txt>
          </G>
        </G>
      </SvgFrame>
      <Chip text="A JOKE ABOUT BAD SPELLING" x={960} y={50} o={seg(t, c, 0)} color={orange} />
      <Chip text="YOU SAY IT EVERY DAY" x={960} y={50} o={seg(t, c, 1)} />
      <Chip text="WHAT DO O AND K STAND FOR?" x={960} y={50} o={seg(t, c, 2)} color={orange} />
      <Chip text="BOSTON, ALMOST 200 YEARS AGO" x={960} y={50} o={seg(t, c, 3)} />
      <SimpleNote o={s3} />
    </>
  );
};

// ---------------------------------------------------------------- 2: tres trabajos
export const SceneJobs: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const j0 = seg(t, c, 0);
  const j1 = seg(t, c, 1);
  const j2 = seg(t, c, 2);
  const st = [c[2] + 0.2, c[2] + 2.6, c[2] + 4.2];
  const conv = ramp(t, c[2] + 6.0, c[2] + 7.0);
  const px = [420, 960, 1500];
  const labels = ["is it fine?", "yes", "not broken"];
  return (
    <>
      <SvgFrame>
        <G o={j0}>
          <G o={vis(t, c[0] + 1.6)}>
            <rect x={310} y={400} width={220} height={24} fill={SAND} stroke={ink} strokeWidth={5} />
            <line x1={335} y1={424} x2={335} y2={540} stroke={ink} strokeWidth={8} />
            <line x1={505} y1={424} x2={505} y2={540} stroke={ink} strokeWidth={8} />
          </G>
          <G o={vis(t, c[0] + 2.0)}>
            <Person x={960} y={540} body={teal} s={1.1} />
            {[0, 1, 2].map((i) => (
              <line key={i} x1={860 - i * 6} y1={470 + i * 26} x2={810 - i * 6} y2={470 + i * 26} stroke={GREY} strokeWidth={6} strokeLinecap="round" />
            ))}
          </G>
          <G o={vis(t, c[0] + 2.4)}>
            <circle cx={1500} cy={450} r={100} fill={BLUE} stroke={ink} strokeWidth={6} />
          </G>
          {[["Table", 420], ["Run", 960], ["Blue", 1500]].map(([w, x], i) => (
            <G key={w} o={vis(t, c[0] + [1.7, 2.1, 2.5][i])}>
              <Txt x={x as number} y={650} size={72} serif>
                {w}
              </Txt>
            </G>
          ))}
        </G>
        <G o={j1}>
          <Txt x={960} y={450} size={280} weight={900}>
            OK
          </Txt>
          {([["yes", 520, 270], ["I agree", 1420, 270], ["go on", 500, 620], ["I'm listening", 1420, 620]] as [string, number, number][]).map(([w, x, y], i) => (
            <Speech key={w} x={x} y={y} text={w} size={44} o={vis(t, c[1] + [2.5, 2.8, 3.2, 3.6][i])} />
          ))}
        </G>
        <G o={j2}>
          {px.map((x, i) => (
            <G key={x} o={vis(t, st[i]) * (1 - 0.85 * conv)}>
              <rect x={x - 230} y={170} width={460} height={380} rx={18} fill="#fff" stroke={ink} strokeWidth={5} />
              {i === 0 && (
                <>
                  <Person x={x - 80} y={520} body={ink} />
                  <path d="M-10 0 H120" transform={`translate(${x} 390)`} stroke={ink} strokeWidth={7} strokeLinecap="round" />
                  <path d={`M${x + 20} 388 Q${x + 65} 330 ${x + 110} 388`} fill={SOFT} stroke={ink} strokeWidth={5} />
                </>
              )}
              {i === 1 && (
                <>
                  <Person x={x - 90} y={520} body={teal} />
                  <Person x={x + 80} y={520} body={orange} />
                </>
              )}
              {i === 2 && (
                <>
                  <Car x={x + 50} y={510} s={0.85} color={SOFT} />
                  <Person x={x - 130} y={520} body={orange} />
                </>
              )}
              <Speech x={x - 20} y={250} text="OK" size={44} />
            </G>
          ))}
          {px.map((x, i) => (
            <G key={labels[i]} x={lerp(x, 700 + i * 260, conv)} y={lerp(610, 660, conv)} o={vis(t, st[i] + 0.6)} s={1 - 0.15 * conv}>
              <rect x={-120} y={-34} width={240} height={68} rx={34} fill={WARM} stroke={orange} strokeWidth={4} />
              <Txt x={0} y={2} size={34} fill={orange}>
                {labels[i]}
              </Txt>
            </G>
          ))}
          <G o={conv}>
            <Txt x={960} y={380} size={300} weight={900}>
              OK
            </Txt>
          </G>
        </G>
      </SvgFrame>
      <Chip text="MOST WORDS POINT AT SOMETHING" x={960} y={50} o={seg(t, c, 0)} />
      <Chip text="OK POINTS AT NOTHING" x={960} y={50} o={seg(t, c, 1)} color={orange} />
      <Chip text="THREE JOBS, SAME TWO LETTERS" x={960} y={50} o={seg(t, c, 2)} />
    </>
  );
};

// ---------------------------------------------------------------- 3: la moda de Boston
export const SceneBoston: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const b0 = seg(t, c, 0);
  const b1 = seg(t, c, 1);
  const b25 = seg(t, c, 2, 5);
  const d1 = c[2] - c[1];
  const m = ramp(t, c[5] + 0.2, c[5] + 1.3);
  const cards = [
    { a: "no go", b: "know go", big: "K.G.", t0: c[2] + 0.2, k: 2, x: 420, at: [0, 1.8, 0.8] as [number, number, number] },
    { a: "small potatoes", mid: <ellipse cx={0} cy={-8} rx={56} ry={34} fill="#C9A06A" stroke={ink} strokeWidth={4} />, big: "S.P.", t0: c[3] + 0.2, k: 3, x: 960, at: [0, 0.3, 1.3] as [number, number, number] },
    { a: "all right", b: "oll wright", big: "O.W.", t0: c[4] + 0.2, k: 4, x: 1500, at: [3.0, 1.7, 0.6] as [number, number, number] },
  ];
  return (
    <>
      <SvgFrame>
        <G o={b0}>
          <Ground y={700} />
          {[260, 520, 780, 1040, 1300, 1560].map((x, i) => {
            const h = 330 + (i % 3) * 50;
            return (
              <g key={x}>
                <rect x={x} y={700 - h} width={250} height={h} fill={i % 2 ? SAND : WARM} stroke={ink} strokeWidth={5} />
                <rect x={x - 6} y={700 - h - 20} width={262} height={20} fill={ink} />
                {[0, 1].map((cx) =>
                  [0, 1].map((cy) => <rect key={`${cx}${cy}`} x={x + 40 + cx * 110} y={700 - h + 40 + cy * 100} width={60} height={70} fill={SOFT} stroke={ink} strokeWidth={4} />),
                )}
                <rect x={x + 95} y={610} width={60} height={90} fill={ink} />
              </g>
            );
          })}
          <rect x={1448} y={560} width={10} height={140} fill={ink} />
          <circle cx={1453} cy={548} r={18} fill={GOLD} stroke={ink} strokeWidth={4} />
        </G>
        <G o={b1}>
          <rect x={300} y={560} width={1020} height={40} fill={SAND} stroke={ink} strokeWidth={5} />
          <rect x={330} y={600} width={24} height={140} fill={ink} />
          <rect x={1266} y={600} width={24} height={140} fill={ink} />
          <rect x={560} y={170} width={500} height={390} fill={PAPER} stroke={ink} strokeWidth={5} />
          <G o={vis(t, c[1] + 0.4)}>
            <Txt x={810} y={250} size={52} serif>
              all right
            </Txt>
          </G>
          <G o={vis(t, c[1] + d1 * 0.35)}>
            <Arrow x1={810} y1={285} x2={810} y2={325} color={GREY} w={6} />
            <Txt x={810} y={370} size={52} serif fill={orange}>
              oll wright
            </Txt>
          </G>
          <G o={vis(t, c[1] + d1 * 0.65)}>
            <Arrow x1={810} y1={405} x2={810} y2={445} color={GREY} w={6} />
            <Txt x={810} y={495} size={64} serif fill={teal} spacing={4}>
              O.W.
            </Txt>
          </G>
          <G x={1140} y={400} rot={30}>
            <path d="M0 -150 Q60 -110 30 -20 L0 70 L-20 -20 Q-40 -100 0 -150Z" fill={PAPER} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
            <line x1={0} y1={-140} x2={-10} y2={60} stroke={ink} strokeWidth={3} />
            <polygon points="-14,60 6,60 -4,100" fill={ink} />
          </G>
        </G>
        <G o={b25}>
          {cards.map((cd) => (
            <Card
              key={cd.big}
              x={lerp(cd.x, 520, m)}
              y={lerp(430, 300 + (cd.k - 2) * 170, m)}
              s={lerp(1, 0.56, m)}
              o={vis(t, cd.t0 - 0.1)}
              t={t}
              t0={cd.t0}
              a={cd.a}
              b={cd.b}
              mid={cd.mid}
              big={cd.big}
              at={cd.at}
            />
          ))}
          <G o={m}>
            <Phone x={1350} y={470} s={1.4} msgs={["lol", "brb", "k"]} />
            <Txt x={1350} y={160} size={44} fill={orange}>
              NOW
            </Txt>
            <Txt x={520} y={160} size={44} fill={teal}>
              THEN
            </Txt>
          </G>
        </G>
      </SvgFrame>
      <Chip text="BOSTON, LATE 1830s" x={960} y={50} o={seg(t, c, 0)} />
      <Chip text="A GAME: MISSPELL ON PURPOSE" x={960} y={50} o={seg(t, c, 1)} color={orange} />
      <Chip text="THEN SHORTEN IT TO INITIALS" x={960} y={50} o={seg(t, c, 2, 4)} />
      <Chip text="THE TEXT-MESSAGE SLANG OF ITS DAY" x={960} y={50} o={seg(t, c, 5)} color={orange} />
    </>
  );
};

// ---------------------------------------------------------------- 4: el primer OK
export const SceneFirst: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const f0 = seg(t, c, 0);
  const f1 = seg(t, c, 1);
  const tl = seg(t, c, 2, 3);
  const prof = seg(t, c, 3, 4);
  const f4 = seg(t, c, 4);
  const grow = ramp(t, c[1] + 0.2, c[1] + 1.0);
  const flip = (t - c[4]) * 0.9;
  return (
    <>
      <SvgFrame>
        <G o={f0}>
          <G x={480} y={410}>
            <rect x={-170} y={-150} width={340} height={300} rx={16} fill="#fff" stroke={ink} strokeWidth={5} />
            <path d="M-170 -134 Q-170 -150 -154 -150 H154 Q170 -150 170 -134 V-62 H-170 Z" fill={teal} />
            <Txt x={0} y={-104} size={46} fill="#fff" spacing={5}>
              MARCH
            </Txt>
            <Txt x={0} y={30} size={150} serif fill={orange}>
              23
            </Txt>
          </G>
          <Txt x={480} y={640} size={70} serif>
            1839
          </Txt>
        </G>
        <G o={f0 > 0 ? f0 : f1}>
          <G x={f1 > 0 ? lerp(1300, 960, grow) : 1300} y={f1 > 0 ? lerp(410, 220, grow) : 410} s={f1 > 0 ? lerp(1, 0.7, grow) : 1}>
            <rect x={-300} y={-110} width={600} height={220} fill={PAPER} stroke={ink} strokeWidth={5} />
            <rect x={-300} y={-110} width={600} height={14} fill={ink} />
            <Txt x={0} y={-30} size={56} serif spacing={3}>
              BOSTON
            </Txt>
            <Txt x={0} y={30} size={56} serif spacing={3}>
              MORNING POST
            </Txt>
            {[0, 1].map((i) => (
              <rect key={i} x={-260} y={74 + i * 14} width={i ? 300 : 520} height={7} rx={3} fill={GREY} opacity={0.5} />
            ))}
          </G>
        </G>
        <G o={f1}>
          <G o={grow}>
            <Txt x={960} y={470} size={300} serif fill={ink} spacing={10}>
              O.K.
            </Txt>
          </G>
          <G o={vis(t, c[1] + 1.0)}>
            <Txt x={600} y={650} size={64} serif fill={orange}>
              oll korrect
            </Txt>
          </G>
          <G o={vis(t, c[1] + 2.4)}>
            <Arrow x1={800} y1={650} x2={1060} y2={650} color={GREY} w={8} />
            <Txt x={1300} y={650} size={64} serif fill={teal}>
              all correct
            </Txt>
          </G>
        </G>
        <G o={tl}>
          <line x1={260} y1={700} x2={1660} y2={700} stroke={ink} strokeWidth={7} strokeLinecap="round" />
          <line x1={940} y1={680} x2={900} y2={720} stroke={ink} strokeWidth={6} />
          <line x1={990} y1={680} x2={950} y2={720} stroke={ink} strokeWidth={6} />
          <circle cx={520} cy={700} r={20} fill={orange} stroke={ink} strokeWidth={4} />
          <Txt x={520} y={760} size={40}>
            1839
          </Txt>
          <G o={vis(t, c[2] + 0.4)}>
            <Txt x={520} y={560} size={44} fill={orange}>
              earliest printed
            </Txt>
            <Txt x={520} y={610} size={44} fill={orange}>
              example found
            </Txt>
          </G>
          <G o={0.45 * vis(t, c[2] + 2.0)}>
            <Txt x={330} y={650} size={70} serif fill={GREY}>
              ?
            </Txt>
          </G>
          <G o={vis(t, c[3] + 1.3)}>
            <circle cx={1420} cy={700} r={20} fill={teal} stroke={ink} strokeWidth={4} />
            <Txt x={1420} y={760} size={40}>
              100+ years
            </Txt>
          </G>
        </G>
        <G o={prof}>
          <G o={vis(t, c[3] + 2.5)}>
            <Sil x={1500} y={640} s={1.5} glasses />
          </G>
        </G>
        <G o={f4}>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={460 - i * 6} y={610 - i * 34} width={400} height={32} fill={i % 2 ? SAND : PAPER} stroke={ink} strokeWidth={4} />
          ))}
          <G x={660} y={475} rot={-8 + 14 * Math.sin(flip * 3)}>
            <rect x={-200} y={-14} width={400} height={20} fill={PAPER} stroke={ink} strokeWidth={4} />
          </G>
          <G o={vis(t, c[4] + 3.8)}>
            <rect x={960} y={330} width={190} height={240} rx={8} fill={teal} stroke={ink} strokeWidth={5} />
            <Txt x={1055} y={410} size={50} fill="#fff" serif>
              1960s
            </Txt>
            <rect x={990} y={470} width={130} height={8} rx={4} fill="#fff" opacity={0.7} />
            <rect x={990} y={495} width={90} height={8} rx={4} fill="#fff" opacity={0.7} />
          </G>
        </G>
        <G o={vis(t, c[3] + 4.5) * seg(t, c, 3)}>
          <Plaque x={1160} y={200} text="ALLEN WALKER READ" w={620} />
        </G>
        <G o={vis(t, c[3] + 3.2) * seg(t, c, 3)}>
          <Txt x={1160} y={310} size={38} fill={teal}>
            Columbia University
          </Txt>
        </G>
      </SvgFrame>
      <Chip text="MARCH 23, 1839" x={960} y={50} o={seg(t, c, 0)} />
      <Chip text="O.K. = OLL KORRECT" x={960} y={50} o={seg(t, c, 1)} color={orange} />
      <Note text="Illustration, not the original page" x={960} y={730} o={seg(t, c, 0, 1)} size={28} />
      <Chip text="EARLIEST PRINTED EXAMPLE FOUND" x={960} y={50} o={seg(t, c, 2)} />
      <Chip text="DUG UP 100+ YEARS LATER" x={960} y={50} o={seg(t, c, 3)} color={orange} />
      <Chip text="BY HAND, PAPER BY PAPER" x={960} y={50} o={seg(t, c, 4)} />
      <SimpleNote o={Math.max(tl, f4)} />
    </>
  );
};

// ---------------------------------------------------------------- 5: la eleccion
export const SceneElection: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const t = useT();
  const e0 = seg(t, c, 0);
  const e1 = seg(t, c, 1);
  const e2 = seg(t, c, 2);
  const e3 = seg(t, c, 3);
  const e4 = seg(t, c, 4);
  const e5 = seg(t, c, 5);
  const e6 = seg(t, c, 6);
  const d3 = c[4] - c[3];
  const d4 = c[5] - c[4];
  const d6 = dur - c[6];
  const fly = ramp(t, c[0] + 0.5, c[0] + 1.8);
  const fall = ramp(t, c[5] + 0.3, c[5] + 1.3);
  const glow = 0.5 + 0.5 * Math.sin(t * 4);
  return (
    <>
      <SvgFrame>
        <G o={e0}>
          <Bin x={1300} y={560} s={1.3} />
          {[0, 1, 2].map((i) => (
            <Newsprint key={i} x={lerp(500 + i * 90, 1300 + (i - 1) * 20, ramp(t, c[0] + 0.4 + i * 0.5, c[0] + 1.6 + i * 0.5))} y={lerp(380, 420 - fly * 50, ramp(t, c[0] + 0.4 + i * 0.5, c[0] + 1.6 + i * 0.5)) + i * 10}
              w={200} h={260} rot={i * 25 + ramp(t, c[0] + 0.4 + i * 0.5, c[0] + 1.6 + i * 0.5) * 140}
              o={1 - ramp(t, c[0] + 1.4 + i * 0.5, c[0] + 1.8 + i * 0.5) * 0.95} />
          ))}
        </G>
        <G o={e1}>
          {[["K.G.", 380], ["S.P.", 700], ["O.W.", 1020]].map(([w, x], i) => (
            <G key={w} x={x as number} y={430} o={1 - ramp(t, c[1] + 0.6 + i * 0.6, c[1] + 1.2 + i * 0.6)}>
              <rect x={-130} y={-90} width={260} height={180} rx={12} fill={PAPER} stroke={ink} strokeWidth={5} />
              <Txt x={0} y={0} size={84} serif fill={GREY}>
                {w as string}
              </Txt>
            </G>
          ))}
          <G x={1500} y={430}>
            <circle r={190} fill={GOLD} opacity={0.18 * glow + 0.1} />
            <rect x={-150} y={-100} width={300} height={200} rx={14} fill={PAPER} stroke={orange} strokeWidth={8} />
            <Txt x={0} y={0} size={110} serif fill={orange} spacing={4}>
              O.K.
            </Txt>
          </G>
        </G>
        <G o={e2}>
          <rect x={640} y={380} width={640} height={340} rx={14} fill={SOFT} stroke={ink} strokeWidth={6} />
          <rect x={760} y={400} width={400} height={26} rx={10} fill={ink} />
          <Txt x={960} y={560} size={130} serif>
            1840
          </Txt>
          <G x={960} y={vis(t, c[2] + 0.4) > 0 ? lerp(180, 300, ramp(t, c[2] + 0.4, c[2] + 1.2)) : 180} o={vis(t, c[2] + 0.4)}>
            <circle r={150} fill={GOLD} opacity={0.2 * glow + 0.1} />
            <rect x={-95} y={-60} width={190} height={120} rx={8} fill={PAPER} stroke={orange} strokeWidth={6} />
            <Txt x={0} y={2} size={76} serif fill={orange}>
              O.K.
            </Txt>
          </G>
        </G>
        <G o={e3}>
          <G o={vis(t, c[3] + 0.2)}>
            <Sil x={380} y={700} s={2.0} hat />
            <Plaque x={380} y={185} text="MARTIN VAN BUREN" w={560} s={0.8} />
          </G>
          <G o={vis(t, c[3] + d3 * 0.45)}>
            <MiniMap
              x={1010}
              y={190}
              s={1.2}
              dot={[352, 182]}
              poly="20,120 120,90 170,50 300,20 360,40 350,120 380,150 360,260 380,300 300,330 240,300 120,310 60,260 20,200"
            />
            <Txt x={1640} y={190 + 182 * 1.2} size={40} fill={orange}>
              Kinderhook
            </Txt>
            <Txt x={1190} y={640} size={36} fill={GREY}>
              New York
            </Txt>
          </G>
          <Speech x={760} y={330} text="Old Kinderhook" size={40} o={vis(t, c[3] + d3 * 0.8)} />
        </G>
        <G o={e4}>
          <G o={vis(t, c[4] + 0.2)}>
            {Array.from({ length: 8 }, (_, i) => (
              <polygon key={i} points={`${240 + i * 205},170 ${340 + i * 205},170 ${290 + i * 205},250`} fill={i % 2 ? orange : teal} stroke={ink} strokeWidth={4} />
            ))}
            <line x1={240} y1={170} x2={1780} y2={170} stroke={ink} strokeWidth={5} />
          </G>
          <G o={vis(t, c[4] + d4 * 0.2)}>
            <rect x={640} y={300} width={640} height={300} rx={10} fill={teal} stroke={ink} strokeWidth={8} />
            <Txt x={960} y={370} size={64} fill="#fff" serif spacing={6}>
              VOTE FOR
            </Txt>
            <Txt x={960} y={500} size={170} fill="#fff" serif spacing={8}>
              O.K.
            </Txt>
          </G>
          <G o={vis(t, c[4] + d4 * 0.45)}>
            <rect x={270} y={330} width={14} height={300} fill={ink} />
            <rect x={470} y={330} width={14} height={300} fill={ink} />
            <rect x={262} y={340} width={230} height={110} rx={8} fill={WARM} stroke={orange} strokeWidth={6} />
            <Txt x={377} y={380} size={44} fill={orange} serif>
              O.K.
            </Txt>
            <Txt x={377} y={420} size={34} fill={ink} serif>
              CLUB
            </Txt>
          </G>
          <G o={vis(t, c[4] + d4 * 0.65)}>
            {[330, 560, 800, 1120, 1360, 1600].map((x, i) => (
              <Sil key={x} x={x} y={770} s={1.15} fist={0.5 + 0.5 * Math.sin(t * 5 + i)} color={i % 2 ? DIMC : ink} />
            ))}
          </G>
        </G>
        <G o={e5}>
          <G x={560} y={lerp(380, 640, fall)} rot={fall * 40} o={1 - 0.6 * fall}>
            <rect x={-200} y={-120} width={400} height={240} rx={10} fill={SOFT} stroke={ink} strokeWidth={6} />
            <Txt x={0} y={0} size={60} serif>
              VAN BUREN
            </Txt>
          </G>
          <G x={1300} y={400}>
            <circle r={200} fill={GOLD} opacity={0.18 * glow + 0.1} />
            <Txt x={0} y={0} size={240} serif fill={orange} spacing={8}>
              O.K.
            </Txt>
          </G>
        </G>
        <G o={e6}>
          <Newsprint x={560} y={420} w={700} h={400} head="THE RIVAL GAZETTE" />
          <G o={vis(t, c[6] + d6 * 0.15)}>
            <Txt x={560} y={390} size={44} serif>
              JACKSON'S SPELLING?
            </Txt>
          </G>
          <Stamp x={620} y={500} text="NO EVIDENCE" size={60} rot={-9} o={vis(t, c[6] + d6 * 0.15)} color={RED} />
          {[["O.K.?", 1330, 250], ["O.K.?", 1620, 340], ["O.K.?", 1450, 470]].map(([w, x, y], i) => (
            <Speech key={i} x={x as number} y={y as number} text={w as string} size={46} o={vis(t, c[6] + d6 * (0.6 + i * 0.1))} />
          ))}
          <Sil x={1250} y={730} s={1.3} color={DIMC} />
          <Sil x={1480} y={730} s={1.3} />
          <Sil x={1700} y={730} s={1.3} color={DIMC} />
        </G>
      </SvgFrame>
      <Chip text="A JOKE IS NOT YET A WORD" x={960} y={50} o={seg(t, c, 0)} />
      <Chip text="MANY ABBREVIATIONS VANISHED" x={960} y={50} o={seg(t, c, 1)} />
      <Chip text="THEN CAME AN ELECTION" x={960} y={50} o={seg(t, c, 2)} color={orange} />
      <Chip text="1840: OLD KINDERHOOK" x={960} y={50} o={seg(t, c, 3)} />
      <Chip text="SIGNS, CLUBS, A SLOGAN" x={960} y={50} o={seg(t, c, 4)} color={orange} />
      <Chip text="HE LOST. THE LETTERS STAYED." x={960} y={50} o={seg(t, c, 5)} />
      <Chip text="A MADE-UP STORY" x={960} y={50} o={seg(t, c, 6)} color={RED} />
      <SimpleNote o={e3} />
    </>
  );
};

const DIMC = "#3B4A6B";

// ---------------------------------------------------------------- 6: otras teorias
export const SceneTheories: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const o0 = seg(t, c, 0);
  const o1 = seg(t, c, 1);
  const o2 = seg(t, c, 2);
  const o3 = seg(t, c, 3);
  return (
    <>
      <SvgFrame>
        <G o={o0}>
          <polygon points="960,170 1110,430 810,430" fill={WARM} stroke={orange} strokeWidth={10} strokeLinejoin="round" />
          <Txt x={960} y={365} size={130} fill={orange}>
            !
          </Txt>
          <G o={vis(t, c[0] + 1.6)}>
            <Txt x={960} y={560} size={70} serif>
              best documented
            </Txt>
            <Txt x={960} y={650} size={70} serif fill={orange}>
              ≠ the only one
            </Txt>
          </G>
        </G>
        <G o={o1}>
          {[["okeh", "(Choctaw)", 600], ["words from", "West Africa", 1320]].map(([a, b, x], i) => (
            <G key={a} o={vis(t, c[1] + 0.8 + i * 1.8)}>
              <rect x={(x as number) - 250} y={250} width={500} height={320} rx={16} fill={PAPER} stroke={ink} strokeWidth={5} />
              <Txt x={x as number} y={360} size={66} serif>
                {a as string}
              </Txt>
              <Txt x={x as number} y={470} size={62} serif fill={teal}>
                {b as string}
              </Txt>
              <Txt x={(x as number) + 200} y={230} size={110} serif fill={orange}>
                ?
              </Txt>
            </G>
          ))}
        </G>
        <G o={o2}>
          <circle cx={420} cy={450} r={46} fill={SOFT} stroke={ink} strokeWidth={6} />
          <circle cx={1500} cy={450} r={46} fill={SOFT} stroke={ink} strokeWidth={6} />
          <Txt x={420} y={560} size={38}>
            those words
          </Txt>
          <Txt x={1500} y={560} size={38}>
            the 1839 newspapers
          </Txt>
          <line x1={480} y1={450} x2={800} y2={450} stroke={GREY} strokeWidth={8} strokeDasharray="6 18" strokeLinecap="round" />
          <line x1={1120} y1={450} x2={1440} y2={450} stroke={GREY} strokeWidth={8} strokeDasharray="6 18" strokeLinecap="round" opacity={vis(t, c[2] + 1.6)} />
          <G o={vis(t, c[2] + 2.4)}>
            <Txt x={960} y={450} size={150} serif fill={orange}>
              ?
            </Txt>
          </G>
        </G>
        <G o={o3}>
          <G x={560} y={450}>
            <rect x={-150} y={-210} width={300} height={420} rx={8} fill={teal} stroke={ink} strokeWidth={6} />
            <rect x={-150} y={-210} width={34} height={420} rx={8} fill={ink} opacity={0.35} />
            <Txt x={20} y={-120} size={34} fill="#fff" serif>
              DICTIONARY
            </Txt>
            <G x={-133} y={0} rot={-90}>
              <Txt x={0} y={0} size={34} fill="#fff" serif spacing={4}>
                Boston
              </Txt>
            </G>
          </G>
          <G o={vis(t, c[3] + 0.4)}>
            <Stamp x={1300} y={330} text="CASE CLOSED" size={52} rot={-5} o={1} color={GREY} />
            <line x1={1010} y1={330} x2={1590} y2={330} stroke={RED} strokeWidth={9} strokeLinecap="round" opacity={vis(t, c[3] + 3.4)} />
          </G>
          <Stamp x={1300} y={560} text="BEST EXPLANATION" size={52} rot={-4} o={vis(t, c[3] + 4.0)} color={teal} />
        </G>
      </SvgFrame>
      <Chip text="A FAIR WARNING" x={960} y={50} o={seg(t, c, 0)} color={orange} />
      <Chip text="SOME PEOPLE SAY" x={960} y={50} o={seg(t, c, 1)} />
      <Chip text="NO CLEAR WRITTEN TRAIL" x={960} y={50} o={seg(t, c, 2)} color={orange} />
      <Chip text="MOST DICTIONARIES: BOSTON" x={960} y={50} o={seg(t, c, 3)} />
    </>
  );
};

// ---------------------------------------------------------------- 7: por que se quedo
export const SceneStuck: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const w0 = seg(t, c, 0);
  const w1 = seg(t, c, 1);
  const w2 = seg(t, c, 2);
  const w3 = seg(t, c, 3);
  const w4 = seg(t, c, 4);
  const d2 = c[3] - c[2];
  const draw = ramp(t, c[1] + 0.3, c[1] + 2.4);
  const rows: [string, string, string, number][] = [["Is everything", "?", "", 300], ["", ", let's go", "", 450], ["The car is", ".", "", 600]];
  return (
    <>
      <SvgFrame>
        <G o={w0}>
          <rect x={430} y={190} width={1060} height={520} rx={16} fill="#fff" stroke={ink} strokeWidth={8} />
          {[["K.G.", 610], ["S.P.", 800], ["O.W.", 1330]].map(([w, x]) => (
            <G key={w} x={x as number} y={440} o={0.8}>
              <rect x={-80} y={-60} width={160} height={120} rx={10} fill={PAPER} stroke={GREY} strokeWidth={4} />
              <Txt x={0} y={0} size={52} serif fill={GREY}>
                {w as string}
              </Txt>
            </G>
          ))}
          <G x={1070} y={440} s={1.25}>
            <rect x={-95} y={-75} width={190} height={150} rx={10} fill={WARM} stroke={orange} strokeWidth={7} />
            <Txt x={0} y={0} size={72} serif fill={orange}>
              O.K.
            </Txt>
          </G>
        </G>
        <G o={w1}>
          <OKStroke x={960} y={420} p={draw} />
          <G o={vis(t, c[1] + 1.4)}>
            <ellipse cx={420} cy={600} rx={80} ry={44} fill={WARM} stroke={ink} strokeWidth={6} />
            <path d="M345 600 Q420 628 495 600" fill="none" stroke={ink} strokeWidth={5} />
            <Txt x={420} y={690} size={36}>
              easy to say
            </Txt>
          </G>
          <G o={vis(t, c[1] + 1.9)}>
            <G x={1500} y={590} rot={35}>
              <polygon points="-16,-70 16,-70 16,30 0,56 -16,30" fill={AMBER} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
              <polygon points="-16,30 16,30 0,56" fill={ink} />
            </G>
            <Txt x={1500} y={690} size={36}>
              easy to write
            </Txt>
          </G>
        </G>
        <G o={w2}>
          {rows.map(([l, r, , y], i) => {
            const at = c[2] + 0.8 + d2 * (0.3 + i * 0.22);
            const slide = ramp(t, at, at + 0.7);
            return (
              <g key={y}>
                <text x={850} y={y} textAnchor="end" dominantBaseline="central" fontFamily="Segoe UI, sans-serif" fontWeight={700} fontSize={54} fill={ink}>
                  {l}
                </text>
                <rect x={875} y={y - 36} width={170} height={72} rx={14} fill={slide > 0.95 ? WARM : bg} stroke={orange} strokeWidth={4} strokeDasharray={slide > 0.95 ? undefined : "10 8"} />
                <text x={1060} y={y} textAnchor="start" dominantBaseline="central" fontFamily="Segoe UI, sans-serif" fontWeight={700} fontSize={54} fill={ink}>
                  {r}
                </text>
                <G x={lerp(1450, 960, slide)} y={y} o={ramp(t, at, at + 0.2)}>
                  <rect x={-76} y={-30} width={152} height={60} rx={12} fill={orange} />
                  <circle cx={-76} cy={0} r={12} fill={bg} />
                  <circle cx={76} cy={0} r={12} fill={orange} />
                  <Txt x={0} y={2} size={44} fill="#fff">
                    OK
                  </Txt>
                </G>
              </g>
            );
          })}
        </G>
        <G o={w3}>
          <rect x={460} y={560} width={420} height={50} rx={10} fill={SAND} stroke={ink} strokeWidth={6} />
          <rect x={520} y={510} width={40} height={50} fill={ink} />
          <G x={540} y={510} rot={-6 * Math.sin(t * 7) ** 2}>
            <rect x={-80} y={-14} width={320} height={16} rx={8} fill={ink} />
            <circle cx={-80} cy={-30} r={26} fill={orange} stroke={ink} strokeWidth={5} />
          </G>
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M${930 + i * 70} 530 Q${975 + i * 70} ${470 - i * 12} ${1020 + i * 70} 530`} fill="none" stroke={teal} strokeWidth={7} strokeLinecap="round" opacity={vis(t, c[3] + 0.6 + i * 0.5) * 0.9} />
          ))}
          <Plaque x={1190} y={290} text="ALLAN METCALF" w={540} />
          <Txt x={1190} y={380} size={36} fill={teal}>
            author of a book on OK
          </Txt>
        </G>
        <G o={w4}>
          <Globe x={960} y={450} r={270} t={t} />
          <G x={960} y={450} o={vis(t, c[4] + 1.0)}>
            <circle r={110} fill={GOLD} opacity={0.35} />
            <Txt x={0} y={0} size={140} weight={900}>
              OK
            </Txt>
          </G>
        </G>
      </SvgFrame>
      <Chip text="WHY DID O.K. SURVIVE?" x={960} y={50} o={seg(t, c, 0)} color={orange} />
      <Chip text="TINY, EASY TO SAY AND WRITE" x={960} y={50} o={seg(t, c, 1)} />
      <Chip text="IT FITS ALMOST ANY SENTENCE" x={960} y={50} o={seg(t, c, 2)} color={orange} />
      <Chip text="EVEN A TELEGRAPH SIGNAL" x={960} y={50} o={seg(t, c, 3)} />
      <Chip text="ONE OF THE MOST USED TERMS" x={960} y={50} o={seg(t, c, 4)} />
      <SimpleNote o={Math.max(w3, w4)} />
    </>
  );
};

// ---------------------------------------------------------------- 8: cierre
export const SceneClose: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const x0 = seg(t, c, 0);
  const x1 = seg(t, c, 1);
  const x2 = seg(t, c, 2);
  const x3 = seg(t, c, 3);
  const x4 = seg(t, c, 4);
  const morph = ramp(t, c[0] + 1.8, c[0] + 3.0);
  const roll = ramp(t, c[2] + 0.3, c[2] + 2.6);
  const items = [["$4.99", "#D9C27A"], ["$9.99", WARM], ["$19.99", SOFT]] as const;
  return (
    <>
      <SvgFrame>
        <G o={x0}>
          <G x={560} y={420} s={1.3} o={1 - morph}>
            <rect x={-150} y={-100} width={300} height={200} rx={12} fill={PAPER} stroke={ink} strokeWidth={5} />
            <Txt x={0} y={0} size={96} serif fill={orange} spacing={4}>
              O.K.
            </Txt>
          </G>
          <Arrow x1={800} y1={420} x2={1060} y2={420} color={GREY} o={morph} w={9} />
          <Phone x={1350} y={420} s={1.4} o={morph} msgs={[]} />
          <G o={morph}>
            <rect x={1288} y={345} width={130} height={70} rx={28} fill={teal} stroke={ink} strokeWidth={3} />
            <Txt x={1353} y={380} size={46} fill="#fff">
              ok
            </Txt>
          </G>
        </G>
        <G o={x1}>
          <Txt x={480} y={430} size={120} serif>
            1839
          </Txt>
          <Arrow x1={700} y1={430} x2={1160} y2={430} color={GREY} w={8} />
          <Txt x={1480} y={430} size={120} serif fill={teal}>
            TODAY
          </Txt>
          <Txt x={960} y={620} size={260} weight={900} fill={orange}>
            OK
          </Txt>
        </G>
        <G o={x2}>
          <Ground y={720} />
          <Cart x={lerp(-200, 900, roll)} y={600} s={1.6} />
        </G>
        <G o={x3}>
          <rect x={300} y={400} width={1320} height={16} fill={ink} />
          <rect x={300} y={700} width={1320} height={16} fill={ink} />
          <rect x={320} y={416} width={14} height={284} fill={ink} />
          <rect x={1586} y={416} width={14} height={284} fill={ink} />
          {items.map(([l, f], i) => (
            <Priced key={l} x={600 + i * 360} y={400} label={l} fill={f} hi={i > 0} o={vis(t, c[3] + 0.3 + i * 0.5)} />
          ))}
          {items.map(([l, f], i) => (
            <Priced key={`b${l}`} x={600 + i * 360} y={700} label={l} fill={f} hi={i > 0} o={vis(t, c[3] + 1.8 + i * 0.4)} />
          ))}
        </G>
        <G o={x4}>
          <G x={960} y={500}>
            <path d="M-420 -160 H320 L460 0 L320 160 H-420 Z" fill="#fff" stroke={ink} strokeWidth={9} strokeLinejoin="round" />
            <circle cx={380} cy={0} r={22} fill={bg} stroke={ink} strokeWidth={6} />
            <Txt x={-40} y={6} size={250} weight={900}>
              $9.99
            </Txt>
          </G>
          <G o={vis(t, c[4] + 1.6)}>
            <Txt x={1130} y={215} size={110} fill={GREY} serif>
              $10
            </Txt>
            <line x1={1030} y1={215} x2={1230} y2={215} stroke={RED} strokeWidth={10} strokeLinecap="round" />
          </G>
        </G>
      </SvgFrame>
      <Chip text="FROM A JOKE TO EVERY PHONE" x={960} y={50} o={seg(t, c, 0)} />
      <Chip text="1839 TO TODAY" x={960} y={50} o={seg(t, c, 1)} />
      <Chip text="ANOTHER EVERYDAY THING" x={960} y={50} o={seg(t, c, 2)} color={orange} />
      <Chip text="LOOK AT THE PRICES" x={960} y={50} o={seg(t, c, 3)} />
      <Chip text="WHY?" x={960} y={50} o={seg(t, c, 4)} color={orange} />
    </>
  );
};

export const SCENES006: Record<string, React.FC<SceneProps>> = {
  "ok-hook": SceneHook,
  "three-jobs": SceneJobs,
  "boston-fad": SceneBoston,
  "first-ok": SceneFirst,
  "election": SceneElection,
  "other-theories": SceneTheories,
  "why-stuck": SceneStuck,
  "close": SceneClose,
};
