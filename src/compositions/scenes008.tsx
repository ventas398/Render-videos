import React from "react";
import { Chip, vis } from "../components/ui";
import { lerp, ramp } from "../utils/anim";
import type { SceneProps } from "./scenes";
import { Bulb, Calendar, G, GOLD, GREEN, GREY, ink, orange, Person, Plaque, RED, SAND, seg, SERIF, SimpleNote, SOFT, Speech, Stamp, SvgFrame, Tag, teal, Txt, useT, WARM } from "./kit";

const PAPER = "#FFFDF4";

/* ------------------------------------------------------------------ piezas locales */
/** Cifra 26.2 con el ".2" resaltable. */
const Big: React.FC<{ x: number; y: number; size: number; o?: number; dot?: number; fill?: string; s?: number }> = ({ x, y, size, o = 1, dot = 1, fill = ink, s = 1 }) => (
  <G x={x} y={y} o={o} s={s}>
    <text textAnchor="middle" dominantBaseline="central" fontFamily={SERIF} fontWeight={800} fontSize={size} fill={fill}>
      26
      <tspan fill={dot > 0.5 ? orange : fill}>.2</tspan>
    </text>
  </G>
);

const Runner: React.FC<{ x: number; y: number; s?: number; o?: number; rot?: number; ph?: number; color?: string; scroll?: boolean }> = ({ x, y, s = 1, o = 1, rot = 0, ph = 0, color = teal, scroll = false }) => {
  const a = Math.sin(ph) * 34;
  const b = -a;
  return (
    <G x={x} y={y} s={s} o={o} rot={rot}>
      <g stroke={ink} strokeWidth={9} strokeLinecap="round" fill="none">
        <line x1={0} y1={-48} x2={a} y2={0} />
        <line x1={0} y1={-48} x2={b} y2={0} />
        <line x1={0} y1={-90} x2={b * 0.8} y2={-56} />
        <line x1={0} y1={-90} x2={a * 0.8} y2={-56} />
      </g>
      <rect x={-14} y={-98} width={28} height={54} rx={10} fill={color} stroke={ink} strokeWidth={4} />
      <circle cx={0} cy={-118} r={17} fill="#F1D5B0" stroke={ink} strokeWidth={4} />
      {scroll && <rect x={20} y={-84} width={16} height={34} rx={3} fill="#fff" stroke={ink} strokeWidth={3} />}
    </G>
  );
};

const Cup: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-60 -130 Q-104 -130 -92 -96 Q-80 -72 -50 -76" fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" />
    <path d="M60 -130 Q104 -130 92 -96 Q80 -72 50 -76" fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" />
    <path d="M-62 -150 H62 Q62 -60 0 -40 Q-62 -60 -62 -150 Z" fill="#D9DDE3" stroke={ink} strokeWidth={6} strokeLinejoin="round" />
    <rect x={-9} y={-42} width={18} height={44} fill="#D9DDE3" stroke={ink} strokeWidth={5} />
    <rect x={-46} y={0} width={92} height={22} rx={5} fill="#D9DDE3" stroke={ink} strokeWidth={5} />
  </G>
);

/** Pista de estadio vista desde arriba. th = anchura de la pista. */
const Track: React.FC<{ cx: number; cy: number; rx: number; ry: number; th?: number; o?: number }> = ({ cx, cy, rx, ry, th = 90, o = 1 }) => (
  <G o={o}>
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={SAND} stroke={ink} strokeWidth={6} />
    <ellipse cx={cx} cy={cy} rx={rx - th} ry={ry - th} fill={SOFT} stroke={ink} strokeWidth={5} />
  </G>
);

const Castle: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-110} y={-110} width={220} height={110} fill={SAND} stroke={ink} strokeWidth={5} />
    {[-130, 70].map((tx) => (
      <rect key={tx} x={tx} y={-180} width={60} height={180} fill={SAND} stroke={ink} strokeWidth={5} />
    ))}
    {[-130, -105, 70, 95].map((tx) => (
      <rect key={tx} x={tx} y={-198} width={22} height={20} fill={SAND} stroke={ink} strokeWidth={4} />
    ))}
    <path d="M-30 0 V-50 A30 30 0 0 1 30 -50 V0 Z" fill={ink} />
  </G>
);

/** Ventana de palacio con dos ninos (kids 0..1). */
const Win: React.FC<{ x: number; y: number; s?: number; o?: number; kids?: number }> = ({ x, y, s = 1, o = 1, kids = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-150} y={-190} width={300} height={380} rx={8} fill={SAND} stroke={ink} strokeWidth={6} />
    <path d="M-100 150 V-60 A100 100 0 0 1 100 -60 V150 Z" fill={SOFT} stroke={ink} strokeWidth={6} />
    <line x1={0} y1={-160} x2={0} y2={150} stroke={ink} strokeWidth={5} />
    <line x1={-100} y1={-20} x2={100} y2={-20} stroke={ink} strokeWidth={5} />
    {kids > 0.5 &&
      [-50, 50].map((kx) => (
        <g key={kx}>
          <rect x={kx - 24} y={70} width={48} height={80} rx={14} fill={WARM} stroke={ink} strokeWidth={4} />
          <circle cx={kx} cy={46} r={26} fill="#F1D5B0" stroke={ink} strokeWidth={4} />
        </g>
      ))}
  </G>
);

const Card: React.FC<{ x: number; y: number; w: number; h: number; o?: number; hot?: boolean }> = ({ x, y, w, h, o = 1, hot = false }) => (
  <G x={x} y={y} o={o}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill={PAPER} stroke={hot ? orange : ink} strokeWidth={6} />
  </G>
);

const Star: React.FC<{ x: number; y: number; o?: number; s?: number }> = ({ x, y, o = 1, s = 1 }) => (
  <G x={x} y={y} o={o} s={s}>
    <polygon points="0,-34 10,-11 35,-11 15,5 22,30 0,16 -22,30 -15,5 -35,-11 -10,-11" fill={GOLD} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
  </G>
);

const Tick: React.FC<{ x: number; y: number; o?: number }> = ({ x, y, o = 1 }) => (
  <G x={x} y={y} o={o}>
    <circle r={34} fill={GREEN} />
    <polyline points="-16,2 -4,16 18,-14" fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
  </G>
);

const Note: React.FC<{ x: number; y: number; text: string; o: number; size?: number; fill?: string }> = ({ x, y, text, o, size = 30, fill = GREY }) => (
  <G o={o}>
    <Txt x={x} y={y} size={size} weight={600} fill={fill}>
      {text}
    </Txt>
  </G>
);

const Chips: React.FC<{ t: number; c: number[]; list: ([string] | [string, boolean])[] }> = ({ t, c, list }) => (
  <>
    {list.map(([text, hot], k) => (
      <Chip key={k} text={text} x={960} y={50} o={seg(t, c, k)} color={hot ? orange : undefined} />
    ))}
  </>
);

/** Mapa simplificado Maraton-Atenas. */
const M = { x: 1400, y: 330 };
const A = { x: 520, y: 560 };
const bez = (u: number) => ({
  x: (1 - u) * (1 - u) * M.x + 2 * u * (1 - u) * 960 + u * u * A.x,
  y: (1 - u) * (1 - u) * M.y + 2 * u * (1 - u) * 270 + u * u * A.y,
});
const GreekMap: React.FC<{ o: number }> = ({ o }) => (
  <G o={o}>
    <Txt x={960} y={170} size={32} fill={GREY}>
      not to scale
    </Txt>
    <path d={`M${M.x} ${M.y} Q960 270 ${A.x} ${A.y}`} fill="none" stroke={GREY} strokeWidth={8} strokeDasharray="22 16" strokeLinecap="round" />
    {[M, A].map((p) => (
      <circle key={p.x} cx={p.x} cy={p.y} r={18} fill={orange} stroke={ink} strokeWidth={5} />
    ))}
    <Txt x={M.x} y={M.y + 62} size={44}>
      MARATHON
    </Txt>
    <Txt x={A.x} y={A.y + 62} size={44}>
      ATHENS
    </Txt>
  </G>
);

/* ------------------------------------------------------------------ hook (0-4) */
const SceneHook: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const [s0, s1, s2, s3, s4] = [0, 1, 2, 3, 4].map((k) => seg(t, c, k));
  return (
    <>
      <SvgFrame>
        <G o={s0}>
          <rect x={288} y={300} width={24} height={360} fill={ink} />
          <rect x={1608} y={300} width={24} height={360} fill={ink} />
          <rect x={312} y={412} width={1296} height={40} fill={orange} />
          <Txt x={640} y={433} size={26} fill="#fff" spacing={10}>
            FINISH
          </Txt>
          <Txt x={1280} y={433} size={26} fill="#fff" spacing={10}>
            FINISH
          </Txt>
          <Txt x={960} y={250} size={300} serif fill={ink}>
            ?
          </Txt>
          <Runner x={170} y={660} s={2.2} ph={t * 11} />
          <line x1={150} y1={660} x2={1770} y2={660} stroke={ink} strokeWidth={5} />
        </G>
        <G o={s1}>
          <Big x={960} y={310} size={340} dot={ramp(t, c[1] + 0.6, c[1] + 0.9)} />
          <Txt x={960} y={510} size={64} fill={GREY} spacing={14}>
            MILES
          </Txt>
          <G o={vis(t, c[1] + 2.2)}>
            <Txt x={960} y={640} size={110} fill={teal}>
              = 42.195 km
            </Txt>
          </G>
        </G>
        <G o={s2}>
          {[[560, "25", 1.3], [960, "30", 2.2], [1360, "40", 3.5]].map(([px, tx, tt]) => (
            <G key={tx as string} o={vis(t, c[2] + (tt as number))}>
              <Txt x={px as number} y={220} size={200} serif fill={GREY}>
                {tx}
              </Txt>
              <G o={vis(t, c[2] + (tt as number) + 0.5)}>
                <line x1={(px as number) - 110} y1={300} x2={(px as number) + 110} y2={150} stroke={RED} strokeWidth={14} strokeLinecap="round" />
              </G>
            </G>
          ))}
          <Big x={960} y={560} size={260} />
        </G>
        <G o={s3}>
          <Win x={560} y={420} s={1.3} o={vis(t, c[3] + 1.5)} kids={0} />
          <Note x={560} y={720} text="HOW THE RACE BEGAN: A POPULAR STORY" o={vis(t, c[3] + 1.6)} size={36} />
          <Stamp x={1250} y={420} text="CERTAINLY FALSE" o={vis(t, c[3] + 5.7)} size={52} color={RED} />
        </G>
        <G o={s4}>
          <Txt x={960} y={270} size={320} serif fill={orange}>
            WHY?
          </Txt>
          <Big x={960} y={600} size={230} o={vis(t, c[4] + 1.1)} />
        </G>
      </SvgFrame>
      <Chips t={t} c={c} list={[["QUICK QUESTION"], ["THE MARATHON"], ["A STRANGE NUMBER"], ["WHO PICKED IT?"], ["WHY 26.2 MILES?", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ legend (5-7) */
const SceneLegend: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const [s0, s1, s2] = [0, 1, 2].map((k) => seg(t, c, k));
  const u = ramp(t, c[0] + 1.7, c[0] + 5.9);
  const p = bez(u);
  const lying = ramp(t, c[0] + 5.9, c[0] + 6.3);
  return (
    <>
      <SvgFrame>
        <GreekMap o={s0} />
        <G o={s0}>
          <Runner x={p.x} y={p.y} s={1.1} ph={u < 1 ? t * 12 : 0} rot={lying * 82} scroll o={vis(t, c[0] + 1.2)} />
          <Note x={960} y={690} text="OR SO THE STORY GOES" o={vis(t, c[0] + 6.9)} size={56} fill={orange} />
        </G>
        <G o={s1}>
          <Person x={620} y={600} s={2} body={SAND} />
          <Bulb x={620} y={200} on={ramp(t, c[1] + 1.9, c[1] + 2.2)} />
          <Plaque x={620} y={700} text="MICHEL BRÉAL" w={480} s={0.9} o={vis(t, c[1] + 0.5)} />
          <Note x={1330} y={290} text="ATHENS" o={vis(t, c[1] + 5.0)} size={70} fill={teal} />
          <Note x={1330} y={430} text="1896" o={vis(t, c[1] + 5.6)} size={170} fill={ink} />
          <Note x={1330} y={560} text="FIRST MODERN OLYMPICS" o={vis(t, c[1] + 2.9)} size={40} />
        </G>
        <G o={s2}>
          <GreekMap o={1} />
          <G o={vis(t, c[2] + 3.5)}>
            <Txt x={960} y={650} size={90} fill={teal}>
              about 40 km
            </Txt>
          </G>
          <Note x={960} y={730} text="25 miles" o={vis(t, c[2] + 4.8)} size={56} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(s0, s2)} />
      <Chips t={t} c={c} list={[["THE LEGEND"], ["AN IDEA FROM A FRENCH SCHOLAR"], ["ATHENS, 1896"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ distances (8-10) */
const SceneDistances: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const [s0, s1, s2] = [0, 1, 2].map((k) => seg(t, c, k));
  const hi = ramp(t, c[1] + 4.1, c[1] + 4.5);
  return (
    <>
      <SvgFrame>
        <G o={s0}>
          <Big x={960} y={400} size={300} fill={GREY} />
          <G o={vis(t, c[0] + 2.0)}>
            <line x1={640} y1={560} x2={1280} y2={240} stroke={RED} strokeWidth={16} strokeLinecap="round" />
          </G>
          <Note x={960} y={640} text="NOT EVEN CLOSE" o={vis(t, c[0] + 2.4)} size={90} fill={orange} />
        </G>
        <G o={s1}>
          {[[300, 760, "GAMES 1"], [430, 980, "GAMES 2"], [560, 640, "GAMES 3"]].map(([ry, len, lb], i) => (
            <G key={lb as string} o={vis(t, c[1] + 2.2 + i * 0.6)}>
              <Txt x={330} y={ry as number} size={40} fill={GREY}>
                {lb}
              </Txt>
              <line x1={480} y1={ry as number} x2={480 + (len as number)} y2={ry as number} stroke={ink} strokeWidth={8} strokeLinecap="round" />
              {[480, 480 + (len as number)].map((cx) => (
                <circle key={cx} cx={cx} cy={ry as number} r={18} fill={hi > 0.5 ? orange : "#fff"} stroke={ink} strokeWidth={6} />
              ))}
            </G>
          ))}
          <Note x={1560} y={430} text="?" o={vis(t, c[1] + 4.1)} size={200} fill={orange} />
        </G>
        <G o={s2}>
          <Card x={560} y={380} w={680} h={320} o={vis(t, c[2] + 0.3)} />
          <Card x={1360} y={380} w={680} h={320} o={vis(t, c[2] + 3.0)} />
          <Note x={560} y={320} text="PARIS 1900" o={vis(t, c[2] + 0.6)} size={70} fill={ink} />
          <Note x={560} y={430} text="a little over 40 km" o={vis(t, c[2] + 1.4)} size={46} fill={teal} />
          <Note x={1360} y={320} text="ST. LOUIS 1904" o={vis(t, c[2] + 3.3)} size={70} fill={ink} />
          <Note x={1360} y={430} text="about 40 km" o={vis(t, c[2] + 4.4)} size={46} fill={teal} />
          <Stamp x={960} y={650} text="NO STANDARD" o={vis(t, c[2] + 6.0)} size={64} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(s1, s2)} />
      <Chips t={t} c={c} list={[["ALWAYS 26.2?"], ["GAMES TO GAMES"], ["EARLY OLYMPICS", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ london (11-15) */
const SceneLondon: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const [s0, s1, s2] = [0, 1, 2].map((k) => seg(t, c, k));
  const s34 = seg(t, c, 3, 4);
  const go = ramp(t, c[1] + 7.5, c[1] + 11);
  const rm = { x: 515, y: 195 };
  const cx = 960;
  const cy = 420;
  const gateB = { x: cx + rm.x * 0.5, y: cy + rm.y * 0.866 };
  const route = (d: string, col: string, w: number, p: number, o = 1) => (
    <path d={d} pathLength={1} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" strokeDasharray="1" strokeDashoffset={1 - p} opacity={o} />
  );
  return (
    <>
      <SvgFrame>
        <G o={s0}>
          <Calendar x={960} y={410} month="JULY" year="1908" s={1.5} />
        </G>
        <G o={s1}>
          <Castle x={380} y={520} s={1.2} o={vis(t, c[1] + 1.9)} />
          <Note x={380} y={600} text="WINDSOR CASTLE" o={vis(t, c[1] + 2.0)} size={40} fill={ink} />
          <Track cx={1520} cy={430} rx={210} ry={120} th={34} o={vis(t, c[1] + 2.9)} />
          <rect x={1496} y={296} width={48} height={22} fill={orange} stroke={ink} strokeWidth={3} opacity={vis(t, c[1] + 3.6)} />
          <Note x={1520} y={600} text="STADIUM" o={vis(t, c[1] + 3.0)} size={40} fill={ink} />
          <Note x={1520} y={260} text="ROYAL BOX" o={vis(t, c[1] + 3.6)} size={32} fill={orange} />
          <line x1={860} y1={500} x2={1290} y2={450} stroke={GREY} strokeWidth={7} strokeDasharray="20 14" opacity={vis(t, c[1] + 7.2)} />
          <G x={700} y={600} o={vis(t, c[1] + 5.4)}>
            <Person x={0} y={0} s={1.2} body={WARM} />
            <path d="M-28 -150 Q-28 -192 0 -192 Q28 -192 28 -150 Z" fill={teal} stroke={ink} strokeWidth={3} />
            <rect x={-46} y={-156} width={92} height={10} rx={5} fill={teal} stroke={ink} strokeWidth={3} />
            <line x1={48} y1={-60} x2={74} y2={-150 - 14 * Math.sin(t * 8)} stroke={ink} strokeWidth={8} strokeLinecap="round" />
            <rect x={60} y={-190 - 14 * Math.sin(t * 8)} width={40} height={34} fill="#fff" stroke={ink} strokeWidth={3} />
          </G>
          {[0, 1, 2].map((i) => (
            <Runner key={i} x={lerp(860, 1290, go) - i * 36} y={540 + i * 20 - 12 * go} s={0.55} ph={t * 12 + i} color={i === 1 ? orange : teal} o={vis(t, c[1] + 7.5)} />
          ))}
        </G>
        <G o={s2}>
          <rect x={240} y={430} width={1300} height={64} rx={8} fill={teal} stroke={ink} strokeWidth={5} opacity={vis(t, c[2] + 0.8)} />
          <rect x={1540} y={430} width={170} height={64} rx={8} fill={orange} stroke={ink} strokeWidth={5} opacity={vis(t, c[2] + 2.4)} />
          <Note x={890} y={360} text="about 26 miles" o={vis(t, c[2] + 0.9)} size={72} fill={teal} />
          <Note x={1625} y={360} text="+ 385 yards" o={vis(t, c[2] + 2.5)} size={56} fill={orange} />
          <Note x={1625} y={560} text="on the stadium track" o={vis(t, c[2] + 4.3)} size={34} fill={ink} />
          <Note x={960} y={650} text="Not to scale" o={vis(t, c[2] + 1.2)} size={30} />
        </G>
        <G o={s34}>
          <Track cx={cx} cy={cy} rx={560} ry={240} />
          <rect x={950} y={180} width={20} height={90} fill={ink} />
          <Note x={cx} y={140} text="ROYAL BOX / FINISH" o={1} size={34} />
          <G o={vis(t, c[3] + 1.5)}>
            <rect x={cx - rm.x - 24} y={cy - 40} width={48} height={80} rx={6} fill={SAND} stroke={ink} strokeWidth={5} />
            <Txt x={250} y={cy + 86} size={28} fill={GREY}>
              ROYAL ENTRANCE
            </Txt>
          </G>
          {route(`M${cx - rm.x} ${cy} A${rm.x} ${rm.y} 0 1 0 ${cx} ${cy - rm.y}`, GREY, 10, ramp(t, c[3] + 1.5, c[3] + 3.2), 1 - 0.7 * vis(t, c[3] + 3.4))}
          <G o={vis(t, c[3] + 3.4)}>
            <line x1={cx - rm.x - 40} y1={cy - 50} x2={cx - rm.x + 40} y2={cy + 50} stroke={RED} strokeWidth={12} strokeLinecap="round" />
            <line x1={cx - rm.x + 40} y1={cy - 50} x2={cx - rm.x - 40} y2={cy + 50} stroke={RED} strokeWidth={12} strokeLinecap="round" />
          </G>
          <G o={vis(t, c[3] + 5.0)}>
            <rect x={gateB.x - 24} y={gateB.y - 40} width={48} height={80} rx={6} fill="#fff" stroke={orange} strokeWidth={6} transform={`rotate(-30 ${gateB.x} ${gateB.y})`} />
            <Txt x={gateB.x + 40} y={gateB.y + 80} size={28} fill={orange}>
              OTHER ENTRANCE
            </Txt>
          </G>
          {route(`M${gateB.x} ${gateB.y} A${rm.x} ${rm.y} 0 0 0 ${cx} ${cy - rm.y}`, orange, 16, ramp(t, c[3] + 5.0, c[3] + 6.6))}
          <Note x={cx} y={400} text="DIRECTION REVERSED" o={vis(t, c[3] + 6.4, c[4] + 1.9)} size={56} fill={orange} />
          <Note x={cx} y={400} text="385 yards" o={vis(t, c[4] + 2.0)} size={110} fill={orange} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(s1, s2, s34)} />
      <Chips t={t} c={c} list={[["LONDON, 1908"], ["WINDSOR TO THE STADIUM"], ["THE ROUTE"], ["ONE ACCOUNT SAYS", true], ["ONLY 385 YARDS", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ myth (16-18) */
const SceneMyth: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const s01 = seg(t, c, 0, 1);
  const s2 = seg(t, c, 2);
  return (
    <>
      <SvgFrame>
        <G o={s01}>
          <Win x={620} y={450} s={1.6} kids={vis(t, c[0] + 5.4) > 0.5 ? 1 : 0} />
          <Note x={1320} y={230} text="AS THE STORY GOES" o={vis(t, c[0] + 1.7)} size={64} fill={orange} />
          {[1100, 1220, 1340, 1460, 1580].map((rx, i) => (
            <Runner key={rx} x={rx} y={620} s={0.9} ph={t * 9 + i} o={vis(t, c[0] + 3.8 + i * 0.1)} color={i % 2 ? orange : teal} />
          ))}
          <line x1={1030} y1={620} x2={1660} y2={620} stroke={ink} strokeWidth={5} opacity={vis(t, c[0] + 3.8)} />
          <Note x={1320} y={730} text="Source: Olympedia" o={vis(t, c[1] + 0.2)} size={34} />
          <Stamp x={1250} y={370} text="CERTAINLY FALSE" o={vis(t, c[1] + 1.7)} size={52} color={RED} />
        </G>
        <G o={s2}>
          <Card x={560} y={410} w={560} h={440} o={vis(t, c[2] + 0.3)} />
          <Txt x={560} y={270} size={30} fill={GREY} spacing={8}>
            NEWSPAPER, 1907
          </Txt>
          <Txt x={560} y={350} size={62} serif>
            Start at
          </Txt>
          <Txt x={560} y={425} size={62} serif fill={orange}>
            Windsor?
          </Txt>
          {[490, 530, 570, 610].map((ly) => (
            <line key={ly} x1={340} y1={ly} x2={780} y2={ly} stroke={GREY} strokeWidth={5} opacity={0.6} />
          ))}
          <Note x={560} y={662} text="Illustration, not the original page" o={vis(t, c[2] + 1.0)} size={28} />
          <G o={vis(t, c[2] + 5.4)}>
            <Card x={1360} y={410} w={500} h={300} hot />
            <Txt x={1360} y={305} size={40} fill={GREY} spacing={6}>
              ROYAL REQUEST
            </Txt>
            <Txt x={1360} y={430} size={150} serif fill={GREY}>
              ?
            </Txt>
          </G>
          <Stamp x={1360} y={475} text="NONE" o={vis(t, c[2] + 6.8)} size={80} color={RED} rot={-10} />
          <Stamp x={1360} y={650} text="NOT IN THE RECORDS" o={vis(t, c[2] + 9.8)} size={52} rot={-6} />
        </G>
      </SvgFrame>
      <Chips t={t} c={c} list={[["THE FAMOUS STORY"], ["OLYMPEDIA", true], ["WHAT THE RECORDS SHOW"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ dorando (19-24) */
const SceneDorando: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const [s0, s1, s2, s3, s4, s5] = [0, 1, 2, 3, 4, 5].map((k) => seg(t, c, k));
  const u2 = t - c[2];
  const fall = ramp(u2, 2.3, 2.7) * (1 - ramp(u2, 2.9, 3.3)) + ramp(u2, 3.4, 3.8);
  const wob = u2 < 2.3 ? 10 * Math.sin(u2 * 7) : 0;
  const walk = ramp(t, c[3] + 0.4, c[3] + 2.8);
  const gy = 690;
  return (
    <>
      <SvgFrame>
        <G o={s0}>
          <Track cx={960} cy={400} rx={560} ry={230} />
          <Note x={960} y={400} text="THE REAL STORY" o={1} size={92} fill={orange} />
        </G>
        <G o={s1}>
          <line x1={150} y1={gy} x2={1770} y2={gy} stroke={ink} strokeWidth={5} />
          <Runner x={600} y={gy} s={1.7} ph={t * 12 + 1} color={GREY} />
          <Runner x={780} y={gy} s={1.7} ph={t * 12 + 2} color={GREY} />
          <Runner x={1130} y={gy} s={1.9} ph={t * 12} color={teal} />
          <Plaque x={1130} y={320} text="DORANDO PIETRI" w={560} o={vis(t, c[1] + 1.1)} />
          <rect x={1736} y={gy - 160} width={14} height={160} fill={ink} />
          <rect x={1750} y={gy - 160} width={80} height={50} fill={orange} />
          <Note x={1440} y={490} text="about a mile to go" o={vis(t, c[1] + 2.8)} size={48} fill={orange} />
        </G>
        <G o={s2}>
          <line x1={150} y1={gy} x2={1770} y2={gy} stroke={ink} strokeWidth={5} />
          <rect x={1396} y={gy - 330} width={16} height={330} fill={ink} />
          <Note x={1404} y={gy - 370} text="FINISH" o={1} size={40} />
          <Runner x={800} y={gy} s={2.2} ph={u2 < 2.3 ? u2 * 5 : 0} rot={wob + fall * 85} />
        </G>
        <G o={s3}>
          <line x1={150} y1={gy} x2={1770} y2={gy} stroke={ink} strokeWidth={5} />
          <rect x={1396} y={gy - 330} width={16} height={330} fill={ink} />
          <Note x={1404} y={gy - 370} text="FINISH" o={1} size={40} />
          <Runner x={lerp(900, 1560, walk)} y={gy} s={2.2} ph={t * 4} color={teal} />
          <Person x={lerp(900, 1560, walk) - 150} y={gy} s={1.3} body={SAND} hat />
          <Person x={lerp(900, 1560, walk) + 150} y={gy} s={1.3} body={SAND} hat />
        </G>
        <G o={s4}>
          <Stamp x={620} y={250} text="DISQUALIFIED" o={vis(t, c[4] + 1.5)} size={60} color={RED} />
          <Person x={470} y={720} s={1.2} body={SOFT} o={vis(t, c[4] + 0.5)} />
          <Speech x={680} y={470} text="PROTEST" o={vis(t, c[4] + 0.7)} />
          <G x={1400} y={430} o={vis(t, c[4] + 3.2)}>
            <rect x={-60} y={-260} width={44} height={170} fill={orange} transform="rotate(12 -38 -175)" />
            <rect x={16} y={-260} width={44} height={170} fill={teal} transform="rotate(-12 38 -175)" />
            <circle r={100} fill={GOLD} stroke={ink} strokeWidth={8} />
            <Txt x={0} y={4} size={110} serif>
              1
            </Txt>
          </G>
          <Note x={1400} y={620} text="JOHNNY HAYES" o={vis(t, c[4] + 3.4)} size={56} fill={ink} />
          <Note x={1400} y={690} text="USA" o={vis(t, c[4] + 4.4)} size={46} fill={teal} />
        </G>
        <G o={s5}>
          <Cup x={960} y={520} s={2.2} o={vis(t, c[5] + 2.2)} />
          <Plaque x={960} y={670} text="QUEEN ALEXANDRA" w={620} o={vis(t, c[5] + 0.6)} s={0.9} />
          {[[600, 300], [1320, 300], [520, 480], [1400, 480]].map(([sx, sy], i) => (
            <Star key={sx} x={sx} y={sy} o={vis(t, c[5] + 3.6 + i * 0.15)} />
          ))}
        </G>
      </SvgFrame>
      <Chips t={t} c={c} list={[["WHAT REALLY HAPPENED"], ["AN ITALIAN RUNNER"], ["INTO THE STADIUM"], ["HELPED ACROSS THE LINE"], ["THE RESULT", true], ["THE NEXT DAY"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ official (25-27) */
const SceneOfficial: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const [s0, s1, s2] = [0, 1, 2].map((k) => seg(t, c, k));
  const x = (y: number) => 380 + (y - 1908) * 76;
  return (
    <>
      <SvgFrame>
        <G o={s0}>
          <Card x={960} y={400} w={820} h={520} />
          <Note x={960} y={200} text="1921" o={vis(t, c[0] + 0.2)} size={110} fill={ink} />
          <Note x={960} y={310} text="OFFICIAL MARATHON DISTANCE" o={vis(t, c[0] + 1.5)} size={40} fill={teal} />
          <Note x={960} y={420} text="26 miles 385 yards" o={vis(t, c[0] + 3.6)} size={80} fill={ink} />
          <Note x={960} y={520} text="26.2 mi = 42.195 km" o={vis(t, c[0] + 5.0)} size={52} fill={GREY} />
          <Stamp x={1200} y={640} text="OFFICIAL" o={vis(t, c[0] + 7.4)} size={60} rot={-12} />
        </G>
        <G o={s1}>
          <Card x={620} y={400} w={520} h={520} />
          <Txt x={620} y={210} size={56} serif>
            MINUTES
          </Txt>
          {[300, 360, 420, 480, 540, 600].map((ly) => (
            <line key={ly} x1={410} y1={ly} x2={830} y2={ly} stroke={GREY} strokeWidth={5} opacity={0.5} />
          ))}
          <Note x={620} y={440} text="?" o={vis(t, c[1] + 1.0)} size={240} fill={orange} />
          <Note x={620} y={690} text="reportedly silent" o={vis(t, c[1] + 1.0)} size={44} fill={ink} />
          <Txt x={1230} y={330} size={90}>
            WHO
          </Txt>
          <Tick x={1490} y={330} o={vis(t, c[1] + 3.4)} />
          <Txt x={1230} y={500} size={90}>
            WHY
          </Txt>
          <Note x={1490} y={500} text="?" o={vis(t, c[1] + 4.6)} size={130} fill={orange} />
        </G>
        <G o={s2}>
          <line x1={340} y1={420} x2={1640} y2={420} stroke={ink} strokeWidth={8} strokeLinecap="round" />
          {[[1908, "LONDON", 0.1], [1921, "OFFICIAL", 0.5], [1924, "EVERY GAMES SINCE", 2.0]].map(([yr, lb, tt]) => {
            const hot = yr === 1924 && t - c[2] > 2.0;
            return (
              <G key={yr as number} o={vis(t, c[2] + (tt as number))}>
                <circle cx={x(yr as number)} cy={420} r={20} fill={hot ? orange : "#fff"} stroke={ink} strokeWidth={6} />
                <Txt x={x(yr as number)} y={320} size={74} serif fill={hot ? orange : ink}>
                  {String(yr)}
                </Txt>
                <Txt x={x(yr as number) - (yr === 1924 ? 30 : 0)} y={yr === 1924 ? 610 : 520} size={36} fill={GREY}>
                  {lb as string}
                </Txt>
              </G>
            );
          })}
        </G>
      </SvgFrame>
      <Chips t={t} c={c} list={[["1921"], ["WHO, BUT NOT WHY", true], ["1924"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ practical (28-33) */
const ROAD = "M160 640 C520 640 560 300 960 330 S1400 620 1760 330";
const SceneRealWorld: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const [s0, s3, s4, s5] = [0, 3, 4, 5].map((k) => seg(t, c, k));
  const s12 = seg(t, c, 1, 2);
  const crowd = [[820, 300], [860, 270], [900, 360], [940, 300], [880, 330], [1010, 380], [780, 340], [960, 350], [850, 400], [1050, 330], [740, 300], [920, 260]];
  const sg = 620;
  return (
    <>
      <SvgFrame>
        <G o={s0}>
          <Runner x={560} y={680} s={2.2} ph={t * 11} />
          <Person x={1360} y={680} s={1.6} body={WARM} />
          <Note x={560} y={290} text="IF YOU RUN" o={vis(t, c[0] + 1.4)} size={64} fill={teal} />
          <Note x={1360} y={290} text="IF YOU WATCH" o={vis(t, c[0] + 2.4)} size={64} fill={orange} />
          <line x1={150} y1={680} x2={1770} y2={680} stroke={ink} strokeWidth={5} />
        </G>
        <G o={s12}>
          <path d={ROAD} fill="none" stroke={ink} strokeWidth={176} strokeLinecap="round" />
          <path d={ROAD} fill="none" stroke="#E3D5B3" strokeWidth={164} strokeLinecap="round" />
          <path d="M160 610 C700 610 700 340 960 350 S1300 580 1760 360" pathLength={1} fill="none" stroke={teal} strokeWidth={10} strokeLinecap="round" strokeDasharray="1" strokeDashoffset={1 - ramp(t, c[1] + 3.0, c[1] + 7.4)} opacity={1 - 0.45 * vis(t, c[2])} />
          <path d="M160 660 C450 710 600 270 860 350 S1050 430 1250 570 S1600 470 1760 340" pathLength={1} fill="none" stroke={orange} strokeWidth={8} strokeLinecap="round" strokeDasharray="1" strokeDashoffset={1 - ramp(t, c[2] + 0.3, c[2] + 3.6)} />
          {crowd.map(([dx, dy], i) => (
            <circle key={i} cx={dx} cy={dy} r={12} fill={ink} opacity={vis(t, c[2] + 2.4 + i * 0.05) * 0.8} />
          ))}
        </G>
        <G o={s3}>
          <circle cx={700} cy={430} r={170} fill="#fff" stroke={ink} strokeWidth={10} />
          <rect x={640} y={230} width={120} height={40} fill={SAND} stroke={ink} strokeWidth={5} transform="translate(0 -60)" />
          <rect x={640} y={590} width={120} height={40} fill={SAND} stroke={ink} strokeWidth={5} transform="translate(0 60)" />
          {[...Array(12)].map((_, i) => (
            <line key={i} x1={700 + 140 * Math.sin((i * Math.PI) / 6)} y1={430 - 140 * Math.cos((i * Math.PI) / 6)} x2={700 + 156 * Math.sin((i * Math.PI) / 6)} y2={430 - 156 * Math.cos((i * Math.PI) / 6)} stroke={ink} strokeWidth={6} />
          ))}
          <Txt x={700} y={434} size={150} fill={orange}>
            +
          </Txt>
          <Note x={1280} y={330} text="a little long" o={vis(t, c[3] + 1.6)} size={80} fill={ink} />
          <Note x={1280} y={440} text="NOT A MISTAKE" o={vis(t, c[3] + 3.2)} size={60} fill={orange} />
          <Note x={1280} y={560} text="extra distance you actually ran" o={vis(t, c[3] + 4.4)} size={44} fill={teal} />
        </G>
        <G o={s4}>
          <rect x={360} y={400} width={560} height={90} rx={8} fill={PAPER} stroke={ink} strokeWidth={6} />
          {[...Array(15)].map((_, i) => (
            <line key={i} x1={400 + i * 36} y1={400} x2={400 + i * 36} y2={i % 5 ? 430 : 450} stroke={ink} strokeWidth={4} />
          ))}
          <rect x={920} y={400} width={30} height={90} fill={orange} stroke={ink} strokeWidth={5} opacity={vis(t, c[4] + 3.3)} />
          <Note x={640} y={300} text="+0.1%" o={vis(t, c[4] + 3.3)} size={100} fill={orange} />
          <Note x={640} y={580} text="never short" o={vis(t, c[4] + 5.0)} size={56} fill={teal} />
          <G x={1400} y={650} o={vis(t, c[4] + 6.4)}>
            <rect x={-7} y={-300} width={14} height={300} fill={ink} />
            <rect x={-160} y={-400} width={320} height={110} rx={10} fill="#fff" stroke={teal} strokeWidth={8} />
            <Txt x={0} y={-370} size={48}>
              MILE
            </Txt>
            <Txt x={0} y={-320} size={48}>
              MARKER
            </Txt>
          </G>
          <Tick x={1620} y={270} o={vis(t, c[4] + 8.4)} />
        </G>
        <G o={s5}>
          <line x1={150} y1={sg} x2={1770} y2={sg} stroke={ink} strokeWidth={5} />
          <rect x={513} y={sg - 300} width={14} height={300} fill={ink} />
          <rect x={360} y={sg - 400} width={320} height={110} rx={10} fill="#fff" stroke={teal} strokeWidth={8} />
          <Note x={520} y={sg - 344} text="26 MILES" o={vis(t, c[5] + 1.7)} size={56} fill={ink} />
          <rect x={1256} y={sg - 180} width={16} height={180} fill={ink} />
          <Note x={1264} y={sg - 220} text="FINISH" o={1} size={36} />
          {[760, 880, 1000, 1120].map((px, i) => (
            <Person key={px} x={px} y={sg} s={0.8} body={i % 2 ? SOFT : WARM} o={vis(t, c[5] + 5.6 + i * 0.1)} />
          ))}
          <Speech x={940} y={360} text="GO!" size={50} o={vis(t, c[5] + 5.8)} />
          <path d={`M520 ${sg + 50} V${sg + 70} H1264 V${sg + 50}`} fill="none" stroke={orange} strokeWidth={8} strokeLinecap="round" opacity={vis(t, c[5] + 3.4)} />
          <Note x={892} y={sg + 130} text="385 YARDS" o={vis(t, c[5] + 3.6)} size={64} fill={orange} />
        </G>
      </SvgFrame>
      <SimpleNote o={s12} />
      <Chips t={t} c={c} list={[["THE PRACTICAL PART"], ["SHORTEST POSSIBLE ROUTE"], ["NOBODY RUNS THAT LINE", true], ["YOUR WATCH"], ["THE SAFETY MARGIN"], ["IF YOU ARE WATCHING", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ close (34-35) */
const SceneClose: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k0 = seg(t, c, 0);
  const k1 = seg(t, c, 1);
  const sh = ramp(t, c[0] + 2.4, c[0] + 3.0);
  return (
    <>
      <SvgFrame>
        <G o={k0}>
          <Big x={960} y={lerp(380, 300, sh)} size={360} s={lerp(1, 0.55, sh)} />
          <Track cx={960} cy={600} rx={230} ry={100} th={36} o={vis(t, c[0] + 3.3)} />
          <Note x={960} y={730} text="LONDON, 1908" o={vis(t, c[0] + 3.8)} size={46} fill={teal} />
        </G>
        <G o={k1}>
          <G x={560} y={600} o={vis(t, c[1] + 3.6)}>
            <path d="M-90 -170 H90 L70 0 H-70 Z" fill="#fff" stroke={ink} strokeWidth={6} strokeLinejoin="round" />
            <rect x={-96} y={-190} width={192} height={26} rx={6} fill={teal} stroke={ink} strokeWidth={5} />
            <rect x={-60} y={-130} width={120} height={50} rx={6} fill={SOFT} />
          </G>
          <G x={1360} y={600} o={vis(t, c[1] + 4.6)}>
            <rect x={-170} y={-70} width={340} height={70} rx={12} fill={SAND} stroke={ink} strokeWidth={6} />
            <ellipse cx={0} cy={-90} rx={120} ry={56} fill={WARM} stroke={ink} strokeWidth={6} />
            <path d="M-110 -118 Q0 -190 110 -118" fill="none" stroke="#fff" strokeWidth={6} opacity={0.7} />
          </G>
          <Tag x={560} y={520} text="DATE" s={1.8} o={vis(t, c[1] + 3.9)} />
          <Tag x={1360} y={535} text="DATE" s={1.8} o={vis(t, c[1] + 4.9)} />
          <Note x={960} y={300} text="?" o={vis(t, c[1] + 5.6)} size={300} fill={orange} />
          <Note x={960} y={690} text="two different dates" o={vis(t, c[1] + 6.3)} size={56} fill={orange} />
        </G>
      </SvgFrame>
      <Chips t={t} c={c} list={[["A LEFTOVER FROM ONE RACE"], ["NUMBERS NOBODY EXPLAINS", true]]} />
    </>
  );
};

export const SCENES008: Record<string, React.FC<SceneProps>> = {
  "hook": SceneHook,
  "legend": SceneLegend,
  "distances": SceneDistances,
  "london": SceneLondon,
  "myth": SceneMyth,
  "dorando": SceneDorando,
  "official": SceneOfficial,
  "practical": SceneRealWorld,
  "close": SceneClose,
};

