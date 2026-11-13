import React from "react";
import { Chip, vis } from "../components/ui";
import { lerp, ramp } from "../utils/anim";
import type { SceneProps } from "./scenes";
import { Hand } from "./scenes009";
import { Arrow, Calendar, G, GOLD, GREEN, GREY, ink, orange, Person, RED, SAND, seg, SimpleNote, SOFT, Speech, Stamp, SvgFrame, teal, Txt, useT, WARM } from "./kit";

const PAPER = "#FFFDF4";
const CONCRETE = ["#E8A8A0", "#F2D27A", "#9BD1C7", "#A9C3E8", "#C9B3E3", "#F0B27A", "#B5D99C"];
const TINT = ["#E4E7EC", "#F3D6D2", "#D6E3F3", "#F6E4C8", "#DCEBD6"];

/* ------------------------------------------------------------------ piezas locales */
export const Note: React.FC<{ x: number; y: number; text: string; o: number; size?: number; fill?: string }> = ({ x, y, text, o, size = 30, fill = GREY }) => (
  <G o={o}>
    <Txt x={x} y={y} size={size} weight={600} fill={fill}>
      {text}
    </Txt>
  </G>
);

export const Chips: React.FC<{ t: number; c: number[]; list: ([string] | [string, boolean])[] }> = ({ t, c, list }) => (
  <>
    {list.map(([text, hot], k) => (
      <Chip key={k} text={text} x={960} y={50} o={seg(t, c, k)} color={hot ? orange : undefined} />
    ))}
  </>
);

/** Puente generico de 5 estilos (0 clasico, 1 romanico, 2 gotico, 3 renacentista, 4 barroco). Cubierta en y=0, ancho 300. */
export const Bridge: React.FC<{ x: number; y: number; s?: number; o?: number; style: number; color?: string; w?: number }> = ({ x, y, s = 1, o = 1, style, color = teal, w = 6 }) => {
  const arches: string[] = [];
  const add = (d: string) => arches.push(d);
  if (style === 0) [-100, 0, 100].forEach((cx) => add(`M${cx - 45} 0 V58 A45 45 0 0 1 ${cx + 45} 58 V0`));
  if (style === 1) [-75, 75].forEach((cx) => add(`M${cx - 65} 0 V80 A65 65 0 0 1 ${cx + 65} 80 V0`));
  if (style === 2) [-100, 0, 100].forEach((cx) => add(`M${cx - 45} 0 V62 Q${cx - 42} 22 ${cx} 8 Q${cx + 42} 22 ${cx + 45} 62 V0`));
  if (style === 3) [-100, 0, 100].forEach((cx) => add(`M${cx - 48} 0 V60 Q${cx} 4 ${cx + 48} 60 V0`));
  if (style === 4) add("M-130 0 V90 Q-130 20 0 20 Q130 20 130 90 V0");
  return (
    <G x={x} y={y} s={s} o={o}>
      {arches.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={color} strokeWidth={style === 1 ? w + 3 : w} strokeLinejoin="round" />
      ))}
      <line x1={-150} y1={0} x2={150} y2={0} stroke={color} strokeWidth={w + 2} strokeLinecap="round" />
      {style === 3 && [-120, -80, -40, 0, 40, 80, 120].map((bx) => <line key={bx} x1={bx} y1={-26} x2={bx} y2={0} stroke={color} strokeWidth={4} />)}
      {style === 4 && [-60, 60].map((bx) => <circle key={bx} cx={bx} cy={-18} r={10} fill="none" stroke={color} strokeWidth={4} />)}
    </G>
  );
};

/** Billete generico. flip 0 = anverso (ventana y puerta), 1 = reverso (puente). */
export const BillCard: React.FC<{ x: number; y: number; s?: number; o?: number; flip?: number; style?: number; tint?: string; val?: string; hi?: number; cross?: number }> = ({
  x,
  y,
  s = 1,
  o = 1,
  flip = 0,
  style = 0,
  tint = TINT[0],
  val,
  hi = 0,
  cross = 0,
}) => {
  const sx = Math.max(Math.abs(Math.cos(flip * Math.PI)), 0.02);
  const back = flip > 0.5;
  const hc = hi > 0.5 ? orange : ink;
  return (
    <G x={x} y={y} s={s} o={o}>
      <g transform={`scale(${sx} 1)`}>
        <rect x={-260} y={-135} width={520} height={270} rx={14} fill={tint} stroke={ink} strokeWidth={7} />
        <rect x={-236} y={-111} width={472} height={222} rx={8} fill="none" stroke={GREY} strokeWidth={3} strokeDasharray="10 8" />
        {back ? (
          <>
            <Bridge x={0} y={44} style={style} />
            <path d="M-200 60 Q-100 84 0 60 T200 60" fill="none" stroke={GREY} strokeWidth={4} />
            {cross > 0 && <line x1={-200} y1={-90} x2={200} y2={90} stroke={RED} strokeWidth={14} strokeLinecap="round" opacity={cross} />}
          </>
        ) : (
          <>
            <path d="M-170 70 V-40 Q-170 -80 -130 -80 Q-90 -80 -90 -40 V70 Z" fill="#fff" stroke={hc} strokeWidth={hi > 0.5 ? 9 : 5} />
            <line x1={-130} y1={-80} x2={-130} y2={70} stroke={hc} strokeWidth={4} />
            <rect x={-60} y={-30} width={90} height={100} fill="#fff" stroke={hc} strokeWidth={hi > 0.5 ? 9 : 5} />
            <rect x={60} y={-80} width={110} height={150} rx={4} fill="none" stroke={GREY} strokeWidth={4} />
            {val && (
              <text x={190} y={92} textAnchor="end" fontFamily="Georgia, serif" fontWeight={800} fontSize={60} fill={ink}>
                {val}
              </text>
            )}
          </>
        )}
      </g>
    </G>
  );
};

const Magnifier: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <circle r={52} fill="#fff" fillOpacity={0.5} stroke={ink} strokeWidth={8} />
    <line x1={36} y1={36} x2={92} y2={92} stroke={ink} strokeWidth={14} strokeLinecap="round" />
  </G>
);

const Sheet: React.FC<{ x: number; y: number; w: number; h: number; o?: number }> = ({ x, y, w, h, o = 1 }) => (
  <G x={x} y={y} o={o}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} fill={PAPER} stroke={ink} strokeWidth={6} />
  </G>
);

const Sign: React.FC<{ x: number; y: number; text: string; w: number; o?: number; color?: string }> = ({ x, y, text, w, o = 1, color = ink }) => (
  <G x={x} y={y} o={o}>
    <rect x={-w / 2} y={-46} width={w} height={92} rx={10} fill="#fff" stroke={color} strokeWidth={6} />
    <Txt x={0} y={2} size={42} fill={color} spacing={3}>
      {text}
    </Txt>
  </G>
);

const Houses: React.FC<{ x: number; y: number; s?: number; o?: number; n?: number }> = ({ x, y, s = 1, o = 1, n = 3 }) => (
  <G x={x} y={y} s={s} o={o}>
    {Array.from({ length: n }, (_, i) => (
      <g key={i} transform={`translate(${i * 70} 0)`}>
        <rect x={0} y={-60} width={60} height={60} fill={i % 2 ? SAND : WARM} stroke={ink} strokeWidth={4} />
        <polygon points="-6,-60 30,-92 66,-60" fill={GREY} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
        <rect x={22} y={-34} width={16} height={34} fill="#fff" stroke={ink} strokeWidth={3} />
      </g>
    ))}
  </G>
);

/** Bloque de viviendas esquematico. */
const Block: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-60} y={-130} width={120} height={130} fill={SAND} stroke={ink} strokeWidth={4} />
    {[-100, -60, -20].map((wy) => (
      <g key={wy}>
        <rect x={-40} y={wy} width={24} height={24} fill="#fff" stroke={ink} strokeWidth={3} />
        <rect x={16} y={wy} width={24} height={24} fill="#fff" stroke={ink} strokeWidth={3} />
      </g>
    ))}
  </G>
);

export const Cart: React.FC<{ x: number; y: number; s?: number; o?: number; rot?: number }> = ({ x, y, s = 1, o = 1, rot = 0 }) => (
  <G x={x} y={y} s={s} o={o} rot={rot}>
    <path d="M-150 -170 H-110 L-80 -30 H110 L150 -130 H-96" fill="none" stroke={ink} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M-96 -130 L-80 -30 H110 L150 -130 Z" fill="#fff" fillOpacity={0.6} />
    {[-90, -50, -10, 30, 70, 110].map((gx) => (
      <line key={gx} x1={gx} y1={-130} x2={gx + 8} y2={-32} stroke={ink} strokeWidth={4} />
    ))}
    <line x1={-80} y1={-30} x2={-70} y2={20} stroke={ink} strokeWidth={8} />
    <line x1={100} y1={-30} x2={90} y2={20} stroke={ink} strokeWidth={8} />
    {[-70, 90].map((wx) => (
      <circle key={wx} cx={wx} cy={36} r={20} fill={teal} stroke={ink} strokeWidth={6} />
    ))}
  </G>
);

const Wallet: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-150} y={-90} width={300} height={180} rx={18} fill="#C9A27A" stroke={ink} strokeWidth={7} />
    <path d="M-150 -30 H150" stroke={ink} strokeWidth={5} />
    <circle cx={110} cy={20} r={16} fill={GOLD} stroke={ink} strokeWidth={4} />
  </G>
);

const Salt: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-50 40 L-60 -60 H60 L50 40 Z" fill="#fff" fillOpacity={0.8} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
    <path d="M-60 -60 Q0 -130 60 -60 Z" fill={SOFT} stroke={ink} strokeWidth={6} />
    {[-20, 0, 20].map((dx) => (
      <circle key={dx} cx={dx} cy={-78} r={4} fill={ink} />
    ))}
    {[[-14, 10], [10, 20], [-4, -20], [20, -6]].map(([dx, dy]) => (
      <circle key={dx} cx={dx} cy={dy} r={3} fill={GREY} />
    ))}
  </G>
);

const Pin: React.FC<{ x: number; y: number; o?: number; color?: string }> = ({ x, y, o = 1, color = RED }) => (
  <G x={x} y={y} o={o}>
    <path d="M0 0 Q-26 -34 -26 -52 A26 26 0 0 1 26 -52 Q26 -34 0 0 Z" fill={color} stroke={ink} strokeWidth={4} />
    <circle cy={-52} r={9} fill="#fff" />
  </G>
);

const MapBox: React.FC<{ x: number; y: number; w: number; h: number; o?: number }> = ({ x, y, w, h, o = 1 }) => (
  <G x={x} y={y} o={o}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill="#EDF3E6" stroke={ink} strokeWidth={6} />
    {[0.25, 0.5, 0.75].map((f) => (
      <g key={f}>
        <line x1={-w / 2} y1={-h / 2 + h * f} x2={w / 2} y2={-h / 2 + h * f} stroke={GREY} strokeWidth={2} opacity={0.6} />
        <line x1={-w / 2 + w * f} y1={-h / 2} x2={-w / 2 + w * f} y2={h / 2} stroke={GREY} strokeWidth={2} opacity={0.6} />
      </g>
    ))}
  </G>
);

const Vase: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-60 -190 H60 Q70 -150 50 -110 Q130 -60 100 40 Q70 110 40 130 H-40 Q-70 110 -100 40 Q-130 -60 -50 -110 Q-70 -150 -60 -190 Z" fill="#D9885A" stroke={ink} strokeWidth={6} strokeLinejoin="round" />
    <path d="M-40 -170 H40" stroke={ink} strokeWidth={4} />
    <ellipse cx={0} cy={-20} rx={50} ry={70} fill="#F2C9A5" stroke={ink} strokeWidth={4} />
    <path d="M-12 -70 Q-26 -50 -12 -34 Q-20 -22 -8 -8 Q8 0 8 28" fill="none" stroke={ink} strokeWidth={5} strokeLinecap="round" />
    <circle cx={-6} cy={-52} r={4} fill={ink} />
  </G>
);

/** Mapa-pastilla de Rotterdam / Spijkenisse con siete puentes. */
const Canal: React.FC<{ x: number; y: number; w: number; o?: number }> = ({ x, y, w, o = 1 }) => (
  <G x={x} y={y} o={o}>
    <rect x={-w / 2} y={-60} width={w} height={120} fill="#BFDDF0" stroke={ink} strokeWidth={5} />
  </G>
);

/* ------------------------------------------------------------------ hook (0-4) */
const SceneHook: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const flip = ramp(t, c[0] + 1.0, c[0] + 1.8);
  const reach = ramp(t, c[0] + 0.2, c[0] + 1.0);
  const fake = ramp(t, c[4] + 2.0, c[4] + 2.5);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <BillCard x={900} y={420} s={1.15} flip={flip} style={1} val="20" />
          <Hand x={lerp(1450, 1300, reach)} y={lerp(240, 300, reach)} s={1.3} rot={-35} />
        </G>
        <G o={k(1)}>
          {[0, 1, 2, 3, 4].map((i) => (
            <BillCard key={i} x={290 + i * 335} y={420} s={0.56} flip={1} style={i} tint={TINT[i]} o={vis(t, c[1] + 0.5 + i * 0.3)} />
          ))}
          <Note x={960} y={640} text="five notes, five bridges" o={vis(t, c[1] + 2.5)} size={48} fill={ink} />
        </G>
        <G o={k(2)}>
          <rect x={300} y={560} width={1320} height={26} rx={8} fill={SAND} stroke={ink} strokeWidth={5} />
          <Sign x={960} y={360} text="NOT REAL BRIDGES" w={720} o={vis(t, c[2] + 2.5)} color={RED} />
          <Bridge x={560} y={500} s={0.9} style={2} color={GREY} o={vis(t, c[2] + 1.0)} />
          <G x={1360} y={520} rot={-18} o={vis(t, c[2] + 1.0)}>
            <rect x={-110} y={-10} width={220} height={20} rx={4} fill={GOLD} stroke={ink} strokeWidth={4} />
            <polygon points="110,-10 150,0 110,10" fill={ink} />
          </G>
          <Note x={960} y={650} text="the bank says" o={vis(t, c[2] + 1.6)} size={44} fill={ink} />
        </G>
        <G o={k(3)}>
          <BillCard x={1180} y={420} s={1.0} flip={1} style={0} />
          <Person x={480} y={600} s={2} body={SOFT} />
          <Magnifier x={760} y={400} s={1.5} />
          <Note x={480} y={160} text="BRIDGE MAGAZINE EDITOR" o={vis(t, c[3] + 1.0)} size={38} fill={ink} />
          <G o={vis(t, c[3] + 3.4)}>
            <Txt x={1560} y={250} size={190} serif fill={orange}>
              ?
            </Txt>
          </G>
          <Note x={960} y={700} text="according to a podcast" o={vis(t, c[3] + 1.9)} size={40} fill={teal} />
        </G>
        <G o={k(4)}>
          <BillCard x={560} y={430} s={1.1} flip={1} style={3} cross={fake} />
          <Txt x={1380} y={330} size={280} serif fill={orange}>
            WHY?
          </Txt>
          <Stamp x={560} y={650} text="FAKE?" o={vis(t, c[4] + 2.4)} size={60} color={RED} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(3), k(4))} />
      <Chips t={t} c={c} list={[["TURN IT OVER"], ["FIVE BANKNOTES"], ["THE BANK SAYS"], ["A BRIDGE EDITOR"], ["WHY FAKE BRIDGES?", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ design (5-9) */
const STYLES = ["Classical", "Romanesque", "Gothic", "Renaissance", "Baroque"];
const VALS = ["5", "10", "20", "50", "100"];
const SceneDesign: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const hi = t > c[0] + 1.9 ? 1 : 0;
  const ex = ramp(t, c[2] + 5.2, c[2] + 6.6);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <BillCard x={960} y={400} s={1.5} val="20" hi={hi} tint={TINT[2]} />
          <Note x={640} y={140} text="WINDOWS" o={vis(t, c[0] + 2.0)} size={50} fill={orange} />
          <Note x={1280} y={140} text="DOORWAYS" o={vis(t, c[0] + 2.7)} size={50} fill={orange} />
        </G>
        <G o={k(1)}>
          <G x={620} y={440}>
            <rect x={-150} y={-220} width={300} height={440} rx={14} fill="#fff" stroke={ink} strokeWidth={9} />
            <line x1={0} y1={-220} x2={0} y2={220} stroke={ink} strokeWidth={7} />
            <line x1={-150} y1={0} x2={150} y2={0} stroke={ink} strokeWidth={7} />
            <path d="M-150 -220 L-190 -150 V150 L-150 220" fill={SOFT} stroke={ink} strokeWidth={7} />
            <path d="M150 -220 L190 -150 V150 L150 220" fill={SOFT} stroke={ink} strokeWidth={7} />
          </G>
          <Note x={1290} y={330} text="openness" o={vis(t, c[1] + 2.3)} size={80} fill={teal} />
          <Note x={1290} y={450} text="cooperation" o={vis(t, c[1] + 3.0)} size={80} fill={ink} />
          <Note x={960} y={720} text="the European Central Bank says" o={vis(t, c[1] + 0.2)} size={40} fill={GREY} />
        </G>
        <G o={k(2)}>
          <rect x={200} y={500} width={420} height={40} fill={SAND} stroke={ink} strokeWidth={5} />
          <rect x={1300} y={500} width={420} height={40} fill={SAND} stroke={ink} strokeWidth={5} />
          <Bridge x={960} y={470} s={2.4} style={0} o={vis(t, c[2] + 0.7)} />
          <Person x={330} y={500} s={0.8} body={SOFT} o={vis(t, c[2] + 0.7)} />
          <Person x={1590} y={500} s={0.8} body={WARM} o={vis(t, c[2] + 0.7)} />
          <Note x={960} y={300} text="COMMUNICATION" o={vis(t, c[2] + 2.9)} size={64} fill={teal} />
          <Arrow x1={960} y1={640} x2={lerp(960, 1700, ex)} y2={640} color={orange} o={vis(t, c[2] + 5.2)} />
          <Note x={960} y={700} text="to the rest of the world" o={vis(t, c[2] + 5.8)} size={40} fill={orange} />
        </G>
        <G o={k(3)}>
          {[0, 1, 2, 3, 4].map((i) => (
            <G key={i} o={vis(t, c[3] + 1.7 + i * 0.15)}>
              <BillCard x={250 + i * 355} y={360} s={0.62} flip={1} style={i} tint={TINT[i]} />
              <G o={vis(t, c[3] + [3.1, 4.2, 5.5, 6.5, 7.8][i])}>
                <Txt x={250 + i * 355} y={530} size={60} serif>
                  {VALS[i]}
                </Txt>
                <Txt x={250 + i * 355} y={590} size={34} fill={teal}>
                  {STYLES[i]}
                </Txt>
              </G>
            </G>
          ))}
        </G>
        <G o={k(4)}>
          <line x1={240} y1={330} x2={1680} y2={330} stroke={GREY} strokeWidth={6} strokeLinecap="round" />
          {[0, 1, 2, 3, 4].map((i) => (
            <Bridge key={i} x={300 + i * 330} y={290} s={0.7} style={i} o={vis(t, c[4] + 0.6 + i * 0.35)} />
          ))}
          <Note x={960} y={470} text="a tour of European history" o={vis(t, c[4] + 1.8)} size={56} fill={ink} />
          <Stamp x={960} y={620} text="NOT AN EXISTING MONUMENT" o={vis(t, c[4] + 6.3)} size={46} color={RED} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(2), k(3), k(4))} />
      <Chips t={t} c={c} list={[["THE FRONT"], ["WHAT THEY MEAN"], ["THE BACK"], ["FIVE STYLES"], ["A TOUR OF HISTORY"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ rule (10-14) */
const FLAGS = ["#D64545", "#3E7BD6", "#F2C14E", "#3E9B6A", "#8A5CD0"];
const SceneRule: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const pts: [number, number][] = [[520, 280], [700, 200], [880, 310], [1040, 220], [1240, 280], [600, 450], [820, 500], [1060, 450], [1280, 500]];
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          {pts.map(([px, py], i) => (
            <circle key={i} cx={px + 140} cy={py} r={48} fill={FLAGS[i % 5]} fillOpacity={0.55} stroke={ink} strokeWidth={5} opacity={vis(t, c[0] + 3.0 + i * 0.15)} />
          ))}
          <BillCard x={960} y={650} s={0.5} flip={1} style={1} o={vis(t, c[0] + 0.4)} />
        </G>
        <G o={k(1)}>
          <BillCard x={960} y={560} s={0.9} flip={1} style={2} />
          {FLAGS.map((fc, i) => (
            <G key={i} o={vis(t, c[1] + 0.4 + i * 0.35)}>
              <Person x={300 + i * 330} y={400} s={0.9} body={fc} />
              <Arrow x1={300 + i * 330} y1={420} x2={300 + i * 330 + (960 - (300 + i * 330)) * 0.45} y2={480} color={fc} w={7} />
            </G>
          ))}
          <Note x={960} y={150} text="MY bridge! MY bridge!" o={vis(t, c[1] + 2.0)} size={54} fill={orange} />
        </G>
        <G o={k(2)}>
          <Sheet x={960} y={400} w={820} h={520} o={vis(t, c[2] + 0.8)} />
          <Txt x={960} y={190} size={44} spacing={4}>
            CONTEST RULES
          </Txt>
          {["national heroes", "national symbols", "national monuments"].map((txt, i) => (
            <G key={txt} o={vis(t, c[2] + [4.5, 5.6, 6.8][i])}>
              <Txt x={960} y={310 + i * 110} size={58} fill={ink} weight={600}>
                {txt}
              </Txt>
              <line x1={640} y1={322 + i * 110} x2={1280} y2={322 + i * 110} stroke={RED} strokeWidth={9} strokeLinecap="round" />
            </G>
          ))}
          <Note x={960} y={700} text="according to the podcast" o={vis(t, c[2] + 0.8)} size={40} fill={teal} />
        </G>
        <G o={k(3)}>
          <line x1={240} y1={330} x2={900} y2={330} stroke={GREY} strokeWidth={6} strokeLinecap="round" />
          <circle cx={560} cy={330} r={16} fill={orange} stroke={ink} strokeWidth={5} />
          <Txt x={560} y={270} size={90} serif>
            1996
          </Txt>
          <Person x={420} y={640} s={1.3} body={SOFT} o={vis(t, c[3] + 1.9)} />
          <Note x={660} y={510} text="Robert Kalina" o={vis(t, c[3] + 2.1)} size={44} fill={ink} />
          <Note x={660} y={560} text="Austrian national bank" o={vis(t, c[3] + 3.0)} size={32} fill={GREY} />
          <Stamp x={1000} y={650} text="WINNER" o={vis(t, c[3] + 4.3)} size={54} color={teal} />
          <Calendar x={1420} y={420} month="DECEMBER" year="1996" s={1.0} o={vis(t, c[3] + 6.0)} />
        </G>
        <G o={k(4)}>
          <line x1={960} y1={250} x2={960} y2={600} stroke={ink} strokeWidth={8} />
          <line x1={560} y1={290} x2={1360} y2={290} stroke={ink} strokeWidth={10} strokeLinecap="round" />
          {[0, 1].map((i) => (
            <G key={i} x={i ? 1260 : 660} y={290}>
              <line x1={-70} y1={0} x2={-40} y2={140} stroke={ink} strokeWidth={4} />
              <line x1={70} y1={0} x2={40} y2={140} stroke={ink} strokeWidth={4} />
              <rect x={-90} y={140} width={180} height={16} rx={6} fill={SAND} stroke={ink} strokeWidth={4} />
              {[0, 1, 2].map((f) => (
                <rect key={f} x={-80 + f * 56} y={96} width={48} height={40} fill={FLAGS[(f + i * 2) % 5]} stroke={ink} strokeWidth={3} />
              ))}
            </G>
          ))}
          <Bridge x={960} y={230} s={0.5} style={4} o={vis(t, c[4] + 1.6)} />
          <Note x={960} y={700} text="no country wins, no country loses" o={vis(t, c[4] + 3.0)} size={50} fill={ink} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1))} />
      <Chips t={t} c={c} list={[["ONE CURRENCY, MANY COUNTRIES"], ["WHO GETS THEIR BRIDGE?"], ["THE CONTEST RULES"], ["THE WINNING DESIGN"], ["INVENTED = FAIR", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ twist (15-20) */
const SceneTwist: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const lose = 1 - ramp(t, c[1] + 0.3, c[1] + 1.3);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Bridge x={960} y={470} s={2.6} style={3} />
          <Houses x={770} y={470} s={1.2} n={5} o={vis(t, c[0] + 3.6)} />
          <Note x={960} y={300} text="EARLY DESIGN" o={vis(t, c[0] + 2.5)} size={50} fill={ink} />
          <Note x={960} y={730} text="Rialto, Venice" o={vis(t, c[0] + 5.1)} size={64} fill={orange} />
          <Note x={1500} y={300} text="Wikipedia" o={vis(t, c[0] + 1.6)} size={36} fill={GREY} />
        </G>
        <G o={k(1)}>
          <Bridge x={560} y={470} s={1.6} style={3} />
          <Houses x={380} y={470} s={0.75} n={5} o={lose} />
          <Arrow x1={820} y1={440} x2={1100} y2={440} color={orange} />
          <Note x={960} y={400} text="redrawn" o={vis(t, c[1] + 0.5)} size={56} fill={orange} />
          <Bridge x={1400} y={470} s={1.6} style={0} o={vis(t, c[1] + 1.4)} />
          <Note x={1400} y={620} text="more generic" o={vis(t, c[1] + 1.5)} size={44} fill={ink} />
        </G>
        <G o={k(2)}>
          <Person x={420} y={620} s={2} body={SOFT} />
          <Magnifier x={680} y={420} s={1.4} />
          <BillCard x={1180} y={400} s={0.9} flip={1} style={2} />
          <G x={1620} y={450} rot={6}>
            <rect x={-100} y={-140} width={200} height={280} rx={8} fill={PAPER} stroke={ink} strokeWidth={6} />
            <rect x={-80} y={-120} width={160} height={56} fill={teal} />
            <Txt x={0} y={-103} size={22} fill="#fff" spacing={2}>
              BRIDGE
            </Txt>
            <Txt x={0} y={-80} size={22} fill="#fff" spacing={2}>
              MAGAZINE
            </Txt>
            {[-30, 0, 30, 60].map((ly) => (
              <line key={ly} x1={-70} y1={ly} x2={70} y2={ly} stroke={GREY} strokeWidth={6} />
            ))}
          </G>
          <Note x={420} y={170} text="Russ Swan, editor" o={vis(t, c[2] + 3.2)} size={42} fill={ink} />
          <Note x={960} y={700} text="according to the podcast" o={vis(t, c[2] + 0.3)} size={40} fill={teal} />
        </G>
        <G o={k(3)}>
          <G x={620} y={400} o={vis(t, c[3] + 1.0)}>
            <path d="M-120 -220 L60 -230 L170 -120 L160 20 L90 140 L-30 230 L-120 150 L-190 40 L-150 -80 Z" fill="#EDF3E6" stroke={ink} strokeWidth={6} strokeLinejoin="round" />
            <circle cx={30} cy={-170} r={18} fill={orange} stroke={ink} strokeWidth={5} />
            <Txt x={30} y={-120} size={40}>
              north
            </Txt>
          </G>
          <Note x={620} y={690} text="northern France" o={vis(t, c[3] + 1.4)} size={48} fill={ink} />
          <Calendar x={1290} y={380} month="WEEKS" year="?" s={1.1} o={vis(t, c[3] + 3.0)} />
          <Note x={1290} y={620} text="visited just weeks before" o={vis(t, c[3] + 3.4)} size={40} fill={teal} />
        </G>
        <G o={k(4)}>
          <Person x={540} y={620} s={2} body={WARM} />
          <G o={vis(t, c[4] + 1.9)}>
            <rect x={780} y={230} width={820} height={250} rx={36} fill="#fff" stroke={ink} strokeWidth={6} />
            <polygon points="800,420 700,500 860,470" fill="#fff" stroke={ink} strokeWidth={6} strokeLinejoin="round" />
            <line x1={806} y1={440} x2={850} y2={458} stroke="#fff" strokeWidth={9} />
            <Txt x={1190} y={320} size={56} weight={700}>
              &quot;Generic enough...
            </Txt>
            <Txt x={1190} y={410} size={56} weight={700}>
              but apparently not.&quot;
            </Txt>
          </G>
          <Note x={540} y={170} text="Kalina" o={vis(t, c[4] + 0.1)} size={48} fill={ink} />
          <Note x={1190} y={560} text="according to the podcast" o={vis(t, c[4] + 0.8)} size={40} fill={teal} />
        </G>
        <G o={k(5)}>
          <Salt x={480} y={440} s={2} />
          <Stamp x={1180} y={280} text="ONE SOURCE" o={vis(t, c[5] + 1.2)} size={64} color={orange} />
          <G o={vis(t, c[5] + 4.3)}>
            <rect x={780} y={450} width={800} height={150} rx={16} fill="#fff" stroke={ink} strokeWidth={6} />
            <Txt x={1180} y={500} size={36} fill={GREY} weight={600}>
              THE BANK
            </Txt>
            <Txt x={1180} y={560} size={56} fill={RED}>
              NOT REAL BRIDGES
            </Txt>
          </G>
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(2))} />
      <Chips t={t} c={c} list={[["THE TWIST", true], ["REDRAWN"], ["A MAGAZINE EDITOR"], ["A BRIDGE IN FRANCE"], ["THE DESIGNER REPLIES"], ["A PINCH OF SALT"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ real (21-26) */
const SceneReal: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const solid = ramp(t, c[0] + 1.7, c[0] + 2.6);
  const walk = ramp(t, c[3] + 0.2, c[3] + 2.4);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Bridge x={960} y={440} s={2.6} style={0} color={GREY} />
          <Bridge x={960} y={440} s={2.6} style={0} color={ink} o={solid} />
          <rect x={160} y={440} width={400} height={60} fill={SAND} stroke={ink} strokeWidth={5} />
          <rect x={1360} y={440} width={400} height={60} fill={SAND} stroke={ink} strokeWidth={5} />
          <Note x={960} y={740} text="someone decided to make them real" o={vis(t, c[0] + 0.9)} size={52} fill={orange} />
        </G>
        <G o={k(1)}>
          <MapBox x={780} y={400} w={1120} h={500} />
          <G o={vis(t, c[1] + 3.0)}>
            <circle cx={900} cy={550} r={20} fill={orange} stroke={ink} strokeWidth={5} />
            <Txt x={900} y={602} size={44} fill={orange}>
              Spijkenisse
            </Txt>
          </G>
          <G o={vis(t, c[1] + 4.6)}>
            <line x1={1180} y1={310} x2={910} y2={530} stroke={GREY} strokeWidth={5} strokeDasharray="14 10" />
            <circle cx={1180} cy={290} r={20} fill={ink} />
            <Txt x={1180} y={242} size={44}>
              Rotterdam
            </Txt>
          </G>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <G key={i} o={vis(t, c[1] + 2.1 + i * 0.25)}>
              <circle cx={1520} cy={200 + i * 70} r={26} fill={CONCRETE[i]} stroke={ink} strokeWidth={5} />
              <Txt x={1520} y={202 + i * 70} size={30}>
                {String(i + 1)}
              </Txt>
            </G>
          ))}
          <Note x={1520} y={140} text="7 bridges" o={vis(t, c[1] + 2.1)} size={44} fill={ink} />
          <Note x={780} y={700} text="a Dutch artist: Robin Stam" o={vis(t, c[1] + 0.3)} size={40} fill={teal} />
        </G>
        <G o={k(2)}>
          {[0, 1, 2].map((i) => (
            <Block key={i} x={260 + i * 700} y={350} s={1.3} o={vis(t, c[2] + 0.6)} />
          ))}
          <Canal x={960} y={430} w={1700} o={vis(t, c[2] + 0.4)} />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <G key={i} o={vis(t, c[2] + 0.9 + i * 0.3)}>
              <rect x={300 + i * 220 - 56} y={396} width={112} height={68} fill={CONCRETE[i]} stroke={ink} strokeWidth={5} />
            </G>
          ))}
          <Note x={960} y={650} text="colored concrete" o={vis(t, c[2] + 1.0)} size={60} fill={ink} />
        </G>
        <G o={k(3)}>
          <Canal x={960} y={470} w={1700} />
          <rect x={440} y={436} width={150} height={68} fill={CONCRETE[0]} stroke={ink} strokeWidth={5} />
          <rect x={1330} y={436} width={150} height={68} fill={CONCRETE[3]} stroke={ink} strokeWidth={5} />
          <Person x={lerp(520, 1400, walk)} y={436} s={0.9} body={SOFT} />
          <G x={lerp(1400, 520, walk)} y={436} s={0.9}>
            {[-50, 50].map((wx) => (
              <circle key={wx} cx={wx} cy={-30} r={34} fill="none" stroke={ink} strokeWidth={6} />
            ))}
            <path d="M-50 -30 L0 -90 L50 -30 M0 -90 L-14 -110" fill="none" stroke={teal} strokeWidth={7} strokeLinecap="round" />
          </G>
          <Arrow x1={620} y1={620} x2={1300} y2={620} color={orange} o={vis(t, c[3] + 3.7)} />
          <Note x={960} y={690} text="walking distance" o={vis(t, c[3] + 3.8)} size={50} fill={orange} />
          <Note x={960} y={250} text="Euronews" o={vis(t, c[3] + 2.6)} size={40} fill={GREY} />
        </G>
        <G o={k(4)}>
          <Calendar x={560} y={420} month="OPENED" year="2011" s={1.2} o={vis(t, c[4] + 2.2)} />
          <Calendar x={1360} y={420} month="OPENED" year="2013" s={1.2} o={vis(t, c[4] + 3.5)} />
          <G o={vis(t, c[4] + 1.3)}>
            <Txt x={960} y={420} size={190} serif fill={orange}>
              ?
            </Txt>
          </G>
          <Stamp x={960} y={700} text="SOURCES DISAGREE" o={vis(t, c[4] + 0.7)} size={50} />
        </G>
        <G o={k(5)}>
          <BillCard x={500} y={420} s={0.95} flip={1} style={1} />
          <Bridge x={1400} y={470} s={1.7} style={1} color={CONCRETE[4]} w={8} />
          <rect x={1085} y={470} width={60} height={110} fill={CONCRETE[2]} stroke={ink} strokeWidth={5} />
          <rect x={1655} y={470} width={60} height={110} fill={CONCRETE[2]} stroke={ink} strokeWidth={5} />
          <Arrow x1={800} y1={420} x2={1130} y2={420} color={orange} />
          <Note x={500} y={640} text="the money came first" o={vis(t, c[5] + 2.4)} size={44} fill={ink} />
          <Note x={1400} y={640} text="the concrete came later" o={vis(t, c[5] + 3.8)} size={44} fill={ink} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(1), k(2), k(3), k(5))} />
      <Chips t={t} c={c} list={[["MAKE THEM REAL"], ["SPIJKENISSE"], ["COLORED CONCRETE"], ["WALK OR BIKE"], ["WHEN? NOBODY AGREES"], ["MONEY FIRST", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ future (27-30) */
const SceneFuture: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <BillCard x={480} y={300} s={0.7} tint={TINT[1]} val="20" />
          <BillCard x={480} y={560} s={0.7} flip={1} style={2} tint={TINT[1]} />
          <BillCard x={1180} y={300} s={0.7} tint={TINT[2]} val="20" o={vis(t, c[0] + 0.6)} />
          <BillCard x={1180} y={560} s={0.7} flip={1} style={2} tint={TINT[2]} o={vis(t, c[0] + 0.6)} />
          <Note x={480} y={160} text="FIRST SERIES" o={vis(t, c[0] + 0.3)} size={40} fill={ink} />
          <Note x={1180} y={160} text="EUROPA SERIES" o={vis(t, c[0] + 0.7)} size={40} fill={teal} />
          <G o={vis(t, c[0] + 1.8)}>
            <Txt x={830} y={430} size={70} fill={GREEN}>
              =
            </Txt>
          </G>
          <Note x={830} y={300} text="front" o={vis(t, c[0] + 3.0)} size={34} fill={teal} />
          <Note x={830} y={560} text="back" o={vis(t, c[0] + 4.6)} size={34} fill={teal} />
        </G>
        <G o={k(1)}>
          <Vase x={600} y={420} s={1.8} />
          <Note x={1280} y={330} text="EUROPA" o={vis(t, c[1] + 1.3)} size={110} fill={ink} />
          <Note x={1280} y={450} text="the portrait comes from a vase" o={vis(t, c[1] + 2.0)} size={42} fill={teal} />
          <Note x={1280} y={510} text="in the Louvre" o={vis(t, c[1] + 3.2)} size={42} fill={teal} />
          <Note x={960} y={725} text="the bank says" o={vis(t, c[1] + 0.1)} size={52} fill={ink} />
        </G>
        <G o={k(2)}>
          <G o={vis(t, c[2] + 0.5, c[2] + 4.6)}>
            <Sheet x={960} y={420} w={520} h={380} />
            <Txt x={960} y={420} size={260} serif fill={orange}>
              ?
            </Txt>
            <Note x={960} y={660} text="a design for the next series" o={1} size={46} fill={ink} />
          </G>
          <Note x={960} y={180} text="SHORTLIST" o={vis(t, c[2] + 3.0)} size={60} fill={ink} />
          <G x={560} y={450} o={vis(t, c[2] + 4.7)}>
            <rect x={-250} y={-200} width={500} height={420} rx={20} fill="#fff" stroke={ink} strokeWidth={7} />
            {[-120, -40, 40, 120].map((cx) => (
              <rect key={cx} x={cx - 18} y={-100} width={36} height={190} fill={SAND} stroke={ink} strokeWidth={4} />
            ))}
            <polygon points="-170,-100 0,-170 170,-100" fill={SAND} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
            <Txt x={0} y={160} size={40} fill={ink}>
              European culture
            </Txt>
          </G>
          <G x={1360} y={450} o={vis(t, c[2] + 5.8)}>
            <rect x={-250} y={-200} width={500} height={420} rx={20} fill="#fff" stroke={ink} strokeWidth={7} />
            <path d="M-210 -30 Q-120 -80 -40 -30 T140 -30 T230 -30 V60 H-210 Z" fill="#BFDDF0" stroke={teal} strokeWidth={5} />
            <path d="M-60 -110 Q-20 -150 20 -120 Q50 -150 90 -110 Q50 -100 20 -90 Q-20 -90 -60 -110 Z" fill={SOFT} stroke={ink} strokeWidth={5} />
            <Txt x={0} y={160} size={40} fill={ink}>
              Rivers and birds
            </Txt>
          </G>
        </G>
        <G o={k(3)}>
          <line x1={200} y1={330} x2={1000} y2={330} stroke={GREY} strokeWidth={6} strokeLinecap="round" />
          <circle cx={300} cy={330} r={18} fill={orange} stroke={ink} strokeWidth={5} />
          <G o={vis(t, c[3] + 1.6)}>
            <Txt x={300} y={260} size={44}>
              end of 2026
            </Txt>
          </G>
          <Note x={300} y={400} text="a decision" o={vis(t, c[3] + 2.0)} size={40} fill={ink} />
          <Arrow x1={380} y1={330} x2={900} y2={330} color={orange} o={vis(t, c[3] + 3.9)} />
          <G o={vis(t, c[3] + 4.9)}>
            <Txt x={900} y={260} size={44} fill={orange}>
              several years
            </Txt>
          </G>
          <Note x={900} y={400} text="before new notes arrive" o={vis(t, c[3] + 5.6)} size={40} fill={ink} />
          <BillCard x={1420} y={400} s={0.75} tint={TINT[3]} val="50" o={vis(t, c[3] + 7.2)} />
          <G x={1660} y={290} o={vis(t, c[3] + 8.3)}>
            <circle r={40} fill={GREEN} stroke={ink} strokeWidth={5} />
            <polyline points="-18,2 -4,16 20,-14" fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
          </G>
          <Note x={1420} y={600} text="YOUR NOTES KEEP THEIR VALUE" o={vis(t, c[3] + 8.3)} size={36} fill={GREEN} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(3))} />
      <Chips t={t} c={c} list={[["THE NEWER NOTES"], ["EUROPA"], ["THE NEXT SERIES"], ["WHEN?"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ game (31-33) */
const SceneGame: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <BillCard x={780} y={420} s={1.2} val="20" tint={TINT[2]} />
          <Hand x={1170} y={330} s={1.3} rot={-15} />
          <Speech x={1380} y={230} text="Gothic?" size={60} o={vis(t, c[0] + 3.6)} />
        </G>
        <G o={k(1)}>
          <BillCard x={500} y={290} s={0.62} flip={1} style={2} tint={TINT[2]} />
          <BillCard x={500} y={560} s={0.62} flip={1} style={3} tint={TINT[3]} />
          <Note x={880} y={290} text="Gothic: 20" o={vis(t, c[1] + 0.4)} size={44} fill={teal} />
          <Note x={880} y={560} text="Renaissance: 50" o={vis(t, c[1] + 1.4)} size={44} fill={teal} />
          <MapBox x={1380} y={420} w={640} h={460} o={vis(t, c[1] + 3.1)} />
          <Bridge x={1380} y={380} s={0.9} style={2} o={vis(t, c[1] + 3.6)} />
          {[[1220, 520], [1500, 330], [1560, 560]].map(([px, py], i) => (
            <Pin key={i} x={px} y={py} o={vis(t, c[1] + 5.2 + i * 0.3)} />
          ))}
        </G>
        <G o={k(2)}>
          <MapBox x={1260} y={420} w={760} h={520} />
          <Bridge x={1260} y={420} s={1.4} style={4} color={teal} />
          <Txt x={560} y={330} size={150} serif fill={orange}>
            ?
          </Txt>
          <Note x={560} y={470} text="probably" o={vis(t, c[2] + 0.3)} size={64} fill={orange} />
          <Note x={560} y={540} text="no exact match" o={vis(t, c[2] + 1.0)} size={44} fill={ink} />
          <Note x={1260} y={710} text="that is the idea" o={vis(t, c[2] + 2.5)} size={50} fill={teal} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(2))} />
      <Chips t={t} c={c} list={[["PLAY A GAME"], ["FIND ITS TWIN"], ["NO MATCH", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ close (34-36) */
const SceneClose: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const into = ramp(t, c[1] + 0.9, c[1] + 2.0);
  const zoom = ramp(t, c[2] + 0.2, c[2] + 1.6);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <BillCard x={760} y={420} s={1.25} flip={1} style={0} tint={TINT[4]} />
          <G x={1360} y={420} rot={8} o={vis(t, c[0] + 4.6)}>
            <path d="M-180 -48 H130 L180 0 L130 48 H-180 Z" fill="#fff" stroke={orange} strokeWidth={7} strokeLinejoin="round" />
            <circle cx={138} cy={0} r={8} fill={orange} />
            <Txt x={-24} y={2} size={42} fill={ink}>
              NO ADDRESS
            </Txt>
          </G>
          <Note x={760} y={680} text="a careful fiction" o={vis(t, c[0] + 1.4)} size={50} fill={ink} />
        </G>
        <G o={k(1)}>
          <BillCard x={lerp(760, 560, into)} y={lerp(380, 520, into)} s={lerp(0.95, 0.4, into)} flip={1} style={0} tint={TINT[4]} />
          <Wallet x={560} y={560} s={lerp(0.8, 1.1, into)} o={vis(t, c[1] + 0.4)} />
          <G o={vis(t, c[1] + 2.1)}>
            <rect x={1000} y={300} width={760} height={300} fill="#fff" fillOpacity={0.6} stroke={ink} strokeWidth={6} />
            {[1080, 1260, 1440, 1620].map((sx) => (
              <rect key={sx} x={sx} y={330} width={110} height={160} fill={SAND} stroke={ink} strokeWidth={5} />
            ))}
            <line x1={1000} y1={600} x2={1760} y2={600} stroke={ink} strokeWidth={6} />
            <Cart x={1380} y={560} s={0.9} o={vis(t, c[1] + 3.4)} />
          </G>
          <Note x={1380} y={680} text="a supermarket" o={vis(t, c[1] + 2.2)} size={44} fill={ink} />
        </G>
        <G o={k(2)}>
          <Cart x={800} y={520} s={lerp(1.3, 1.9, zoom)} />
          <G o={vis(t, c[2] + 1.4)}>
            <Txt x={1500} y={380} size={420} serif fill={orange}>
              ?
            </Txt>
          </G>
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1))} />
      <Chips t={t} c={c} list={[["A CAREFUL FICTION"], ["INTO THE WALLET, INTO THE STORE"], ["SHOPPING CART", true]]} />
    </>
  );
};

export const SCENES011: Record<string, React.FC<SceneProps>> = {
  "hook": SceneHook,
  "design": SceneDesign,
  "rule": SceneRule,
  "twist": SceneTwist,
  "real": SceneReal,
  "future": SceneFuture,
  "game": SceneGame,
  "close": SceneClose,
};
