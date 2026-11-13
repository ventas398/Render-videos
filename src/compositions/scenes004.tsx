import React from "react";
import { useCurrentFrame } from "remotion";
import { SIMPLIFIED_NOTE } from "../components/TechnicalDiagram";
import { Chip, Note, vis } from "../components/ui";
import { theme, VIDEO } from "../themes/brand";
import { lerp, ramp } from "../utils/anim";
import type { SceneProps } from "./scenes";

const { width: W, height: H, fps: FPS } = VIDEO;
const useT = (): number => useCurrentFrame() / FPS;
const { ink, teal, orange, bg, panelLine } = theme;
const SERIF = 'Georgia, Cambria, "Times New Roman", serif';
const SAND = "#EBDDBB";
const SOFT = "#DDEEEE";
const WARM = "#FBE3CF";
const GOLD = "#D9A441";
const GREY = "#9AA4B2";
const RED = "#D64545";

/** Visible durante las partes k..k2 (entra 0.1 s tras el inicio, sale 0.4 s antes del siguiente). */
const seg = (t: number, c: number[], k: number, k2 = k): number => vis(t, c[k] + 0.1, c[k2 + 1] === undefined ? 1e6 : c[k2 + 1] - 0.4);

const SvgFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <clipPath id="tkL">
        <rect x={-170} y={-100} width={170} height={200} />
      </clipPath>
      <clipPath id="tkR">
        <rect x={0} y={-100} width={170} height={200} />
      </clipPath>
      <clipPath id="tkA">
        <rect x={6} y={-70} width={144} height={140} />
      </clipPath>
    </defs>
    {children}
  </svg>
);

const G: React.FC<{ x: number; y: number; s?: number; o?: number; rot?: number; children: React.ReactNode }> = ({ x, y, s = 1, o = 1, rot = 0, children }) =>
  o > 0 ? (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
      {children}
    </g>
  ) : null;

const Txt: React.FC<{ x: number; y: number; size: number; children: React.ReactNode; fill?: string; serif?: boolean; weight?: number; spacing?: number }> = ({
  x,
  y,
  size,
  children,
  fill = ink,
  serif = false,
  weight = 800,
  spacing = 0,
}) => (
  <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontFamily={serif ? SERIF : theme.font} fontWeight={weight} fontSize={size} letterSpacing={spacing} fill={fill}>
    {children}
  </text>
);

const Stamp: React.FC<{ x: number; y: number; text: string; rot?: number; color?: string; o: number; size?: number }> = ({ x, y, text, rot = -8, color = orange, o, size = 44 }) => {
  const w = text.length * size * 0.72 + 50;
  return (
    <G x={x} y={y} rot={rot} o={o} s={1 + 0.25 * (1 - o)}>
      <rect x={-w / 2} y={-size * 0.85} width={w} height={size * 1.7} rx={14} fill={bg} fillOpacity={0.85} stroke={color} strokeWidth={6} />
      <Txt x={0} y={2} size={size} fill={color} spacing={4}>
        {text}
      </Txt>
    </G>
  );
};

const SimpleNote: React.FC<{ o: number }> = ({ o }) => <Note text={SIMPLIFIED_NOTE} x={960} y={776} o={0.6 * o} size={24} />;

// ---------------------------------------------------------------- objetos genericos (sin marcas)
const KERNELS: [number, number, number][] = [[-60, -78, 30], [-25, -98, 34], [15, -100, 36], [55, -82, 32], [-5, -70, 28], [35, -68, 26], [-80, -62, 22], [80, -62, 22]];

/** Cubo de palomitas generico: rayas y granos, sin logotipo. */
const Bucket: React.FC<{ x: number; y: number; s?: number; o?: number; stripe?: string; face?: number }> = ({ x, y, s = 1, o = 1, stripe = orange, face = 0 }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-90 -70 L90 -70 L72 100 L-72 100 Z" fill="#fff" />
    {[[-90, -54], [-18, 18], [54, 90]].map(([a, b]) => (
      <polygon key={a} points={`${a},-70 ${b},-70 ${b * 0.8},100 ${a * 0.8},100`} fill={stripe} opacity={0.88} />
    ))}
    <path d="M-90 -70 L90 -70 L72 100 L-72 100 Z" fill="none" stroke={ink} strokeWidth={5} strokeLinejoin="round" />
    {KERNELS.map(([kx, ky, r], i) => (
      <circle key={i} cx={kx} cy={ky} r={r} fill="#FFF3C9" stroke={ink} strokeWidth={4} />
    ))}
    {face > 0 && (
      <g opacity={face} stroke={ink} strokeWidth={6} strokeLinecap="round" fill="none">
        <circle cx={-30} cy={5} r={7} fill={ink} />
        <path d="M20 5 H44" />
        <path d="M-36 38 Q0 68 36 38" />
      </g>
    )}
  </G>
);

const Cup: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <G x={x} y={y} s={s}>
    <path d="M26 -60 L40 -110" stroke={orange} strokeWidth={8} strokeLinecap="round" />
    <path d="M-34 -56 H34 L24 66 H-24 Z" fill={teal} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
    <rect x={-40} y={-70} width={80} height={16} rx={6} fill="#fff" stroke={ink} strokeWidth={5} />
  </G>
);

const TicketBody: React.FC = () => (
  <>
    <rect x={-150} y={-70} width={300} height={140} rx={14} fill="#fff" stroke={ink} strokeWidth={5} />
    <circle cx={-150} cy={0} r={18} fill={bg} stroke={ink} strokeWidth={5} />
    <circle cx={150} cy={0} r={18} fill={bg} stroke={ink} strokeWidth={5} />
    <Txt x={0} y={-12} size={32} serif spacing={3}>
      ADMIT ONE
    </Txt>
    <rect x={-100} y={26} width={200} height={10} rx={5} fill={panelLine} />
  </>
);

/** Entrada: entera, o dos mitades (side) que se pueden separar. */
const Ticket: React.FC<{ x: number; y: number; s?: number; o?: number; hi?: number; split?: number; dr?: number; half?: "L" | "R"; ro?: number }> = ({ x, y, s = 1, o = 1, hi = 0, split = 0, dr = 0, half, ro = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    {!half && split === 0 && <TicketBody />}
    {(half === "L" || (!half && split > 0)) && (
      <g clipPath="url(#tkL)">
        <TicketBody />
      </g>
    )}
    {(half === "R" || (!half && split > 0)) && (
      <g transform={`translate(${dr} 0)`} clipPath="url(#tkR)" opacity={ro}>
        <TicketBody />
      </g>
    )}
    {hi > 0 && (
      <g opacity={hi * 0.55} clipPath="url(#tkA)">
        <rect x={-160} y={-80} width={320} height={160} fill={orange} />
      </g>
    )}
  </G>
);

const Plaque: React.FC<{ x: number; y: number; text: string; s?: number; o?: number }> = ({ x, y, text, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-130} y={-60} width={260} height={120} rx={10} fill={SOFT} stroke={ink} strokeWidth={5} />
    <rect x={-130} y={-60} width={260} height={30} rx={10} fill={ink} />
    <Txt x={0} y={14} size={40} serif spacing={4}>
      {text}
    </Txt>
  </G>
);

const Person: React.FC<{ x: number; y: number; s?: number; body?: string; tie?: boolean; o?: number }> = ({ x, y, s = 1, body = ink, tie = false, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-52 0 V-30 Q-52 -64 -20 -64 H20 Q52 -64 52 -30 V0 Z" fill={body} stroke={ink} strokeWidth={4} />
    <rect x={-10} y={-80} width={20} height={20} fill="#F1D5B0" stroke={ink} strokeWidth={3} />
    <circle cx={0} cy={-102} r={30} fill="#F1D5B0" stroke={ink} strokeWidth={4} />
    {tie && <polygon points="0,-62 -9,-42 0,-8 9,-42" fill={orange} />}
  </G>
);

const Tag: React.FC<{ x: number; y: number; text: string; s?: number; o?: number; rot?: number }> = ({ x, y, text, s = 1, o = 1, rot = 0 }) => (
  <G x={x} y={y} s={s} o={o} rot={rot}>
    <path d="M-48 -22 H30 L52 0 L30 22 H-48 Z" fill="#fff" stroke={orange} strokeWidth={5} strokeLinejoin="round" />
    <circle cx={34} cy={0} r={5} fill={orange} />
    <Txt x={-8} y={1} size={28}>
      {text}
    </Txt>
  </G>
);

const Coin: React.FC<{ x: number; y: number; o?: number; s?: number }> = ({ x, y, o = 1, s = 1 }) => (
  <G x={x} y={y} o={o} s={s}>
    <circle r={22} fill={GOLD} stroke={ink} strokeWidth={4} />
    <Txt x={0} y={1} size={24}>
      $
    </Txt>
  </G>
);

const Desk: React.FC<{ x0: number; x1: number; y?: number }> = ({ x0, x1, y = 640 }) => (
  <>
    <rect x={x0} y={y} width={x1 - x0} height={20} fill={ink} />
    <rect x={x0 + 20} y={y + 20} width={x1 - x0 - 40} height={120} fill="#fff" stroke={panelLine} strokeWidth={4} />
  </>
);

const Register: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <G x={x} y={y}>
    <rect x={-60} y={-70} width={120} height={70} rx={8} fill="#fff" stroke={ink} strokeWidth={5} />
    <rect x={-44} y={-110} width={88} height={34} rx={6} fill={ink} />
    <Txt x={0} y={-93} size={20} fill="#9BE3D6" weight={700}>
      0.00
    </Txt>
  </G>
);

const Bulb: React.FC<{ x: number; y: number; on: number; s?: number }> = ({ x, y, on, s = 1 }) => (
  <G x={x} y={y} s={s}>
    {on > 0 && (
      <>
        <circle r={150} fill={GOLD} opacity={0.2 * on} />
        <circle r={105} fill={GOLD} opacity={0.25 * on} />
      </>
    )}
    <circle r={52} fill={on > 0.5 ? "#FFE69A" : "#fff"} stroke={ink} strokeWidth={5} />
    <path d="M-20 50 H20 V82 H-20 Z" fill={SAND} stroke={ink} strokeWidth={5} />
    <path d="M-16 -4 L-6 16 L4 -4 L14 16" fill="none" stroke={ink} strokeWidth={4} strokeLinecap="round" />
  </G>
);

const Bubble: React.FC<{ x: number; y: number; text: string; o: number; r?: number }> = ({ x, y, text, o, r = 40 }) => (
  <G x={x} y={y} o={o} s={0.9 + 0.1 * o}>
    <circle r={r} fill="#fff" stroke={ink} strokeWidth={4} />
    <Txt x={0} y={2} size={r * 1.15} fill={orange}>
      {text}
    </Txt>
  </G>
);

const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; color?: string; o?: number; w?: number }> = ({ x1, y1, x2, y2, color = teal, o = 1, w = 10 }) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const hx = (d: number) => x2 + Math.cos(a + d) * 34;
  const hy = (d: number) => y2 + Math.sin(a + d) * 34;
  return (
    <g opacity={o}>
      <line x1={x1} y1={y1} x2={x2 - Math.cos(a) * 20} y2={y2 - Math.sin(a) * 20} stroke={color} strokeWidth={w} strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${hx(Math.PI - 0.45)},${hy(Math.PI - 0.45)} ${hx(Math.PI + 0.45)},${hy(Math.PI + 0.45)}`} fill={color} />
    </g>
  );
};

const Cross: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (
  <g opacity={o} stroke={orange} strokeWidth={14} strokeLinecap="round">
    <line x1={x - 38} y1={y - 38} x2={x + 38} y2={y + 38} />
    <line x1={x + 38} y1={y - 38} x2={x - 38} y2={y + 38} />
  </g>
);

const Icon: React.FC<{ k: "building" | "screen" | "staff" | "broom"; x: number; y: number; o: number }> = ({ k, x, y, o }) => (
  <G x={x} y={y} o={o} s={0.9 + 0.1 * o}>
    {k === "building" && (
      <>
        <rect x={-60} y={-40} width={120} height={110} fill={SAND} stroke={ink} strokeWidth={5} />
        <polygon points="-72,-40 0,-92 72,-40" fill={ink} />
        {[-36, 12].map((wx) => (
          <rect key={wx} x={wx} y={-18} width={24} height={30} fill="#fff" stroke={ink} strokeWidth={3} />
        ))}
        <rect x={-14} y={28} width={28} height={42} fill={teal} stroke={ink} strokeWidth={3} />
      </>
    )}
    {k === "screen" && (
      <>
        <rect x={-85} y={-55} width={170} height={105} rx={8} fill={SOFT} stroke={ink} strokeWidth={5} />
        <rect x={-8} y={50} width={16} height={28} fill={ink} />
        <rect x={-44} y={76} width={88} height={10} rx={5} fill={ink} />
      </>
    )}
    {k === "staff" && <Person x={0} y={70} s={1.1} body={teal} tie />}
    {k === "broom" && (
      <>
        <line x1={0} y1={-84} x2={0} y2={30} stroke={ink} strokeWidth={9} strokeLinecap="round" />
        <polygon points="-40,30 40,30 56,86 -56,86" fill="#E8B56B" stroke={ink} strokeWidth={5} strokeLinejoin="round" />
      </>
    )}
  </G>
);

const Wallet: React.FC<{ x: number; y: number; s?: number; color: string }> = ({ x, y, s = 1, color }) => (
  <G x={x} y={y} s={s}>
    <rect x={-90} y={-60} width={180} height={120} rx={16} fill={color} stroke={ink} strokeWidth={5} />
    <rect x={-90} y={-60} width={180} height={44} rx={16} fill="#fff" fillOpacity={0.35} />
    <circle cx={56} cy={6} r={14} fill="#fff" stroke={ink} strokeWidth={4} />
  </G>
);

const TLight: React.FC<{ x: number; y: number; s?: number; red: number }> = ({ x, y, s = 1, red }) => (
  <G x={x} y={y} s={s}>
    <rect x={-10} y={0} width={20} height={300} fill={ink} />
    <rect x={-52} y={-190} width={104} height={200} rx={16} fill={ink} />
    <circle cx={0} cy={-140} r={28} fill={red > 0.5 ? RED : "#3B4A6B"} />
    <circle cx={0} cy={-80} r={28} fill="#3B4A6B" />
    <circle cx={0} cy={-20} r={28} fill="#3B4A6B" />
  </G>
);

// ---------------------------------------------------------------- 1: gancho
export const SceneHook: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const a = seg(t, c, 0, 1);
  const tk = seg(t, c, 2, 3);
  const grow = ramp(t, c[1] + 0.6, c[1] + 2.0);
  const split = ramp(t, c[2] + 0.8, c[2] + 1.8);
  const fly = ramp(t, c[2] + 1.2, c[2] + 3.4);
  const shrink = ramp(t, c[3] + 0.3, c[3] + 1.3);
  const glow = ramp(t, c[3] + 0.6, c[3] + 1.6);
  const title = ramp(t, c[4] + 0.6, c[4] + 1.6);
  const u = ramp(t, c[4] + 1.6, c[4] + 4.2);
  const cx = (1 - u) * (1 - u) * 420 + 2 * (1 - u) * u * 960 + u * u * 1480;
  const cy = (1 - u) * (1 - u) * 640 + 2 * (1 - u) * u * 520 + u * u * 640;
  const s4 = seg(t, c, 4);
  return (
    <>
      <SvgFrame>
        <G x={0} y={0} o={a}>
          {[220, 380, 540, 700].map((x, i) => (
            <Person key={x} x={x} y={720} s={1.15} body={i % 2 ? GREY : "#B8C0CC"} />
          ))}
          <rect x={940} y={150} width={600} height={220} rx={14} fill="#fff" stroke={ink} strokeWidth={5} />
          <rect x={940} y={150} width={600} height={56} rx={14} fill={teal} />
          {[0, 1, 2].map((r) =>
            [0, 1].map((k) => <rect key={`${r}${k}`} x={980 + k * 290} y={236 + r * 44} width={150 + ((r + k) % 2) * 50} height={20} rx={10} fill={panelLine} opacity={0.7} />)
          )}
          <Desk x0={880} x1={1580} />
          <Bucket x={1230} y={540} />
          <Tag x={1420} y={520} text="?" s={1 + 0.7 * grow} />
        </G>
        <G x={0} y={0} o={tk}>
          <Plaque x={1610} y={250} text="STUDIO" o={vis(t, c[2] + 0.5)} />
          {split === 0 ? <Ticket x={760} y={440} s={1.5} /> : <Ticket x={760} y={440} s={1.5 - 0.5 * shrink} split={split} dr={split * 20 + fly * 493} ro={1 - shrink} />}
          <G x={1150} y={520} o={ramp(t, c[3] + 0.5, c[3] + 1.4)} s={1.2}>
            <circle r={170} fill={GOLD} opacity={0.22 * glow} />
            <circle r={125} fill={GOLD} opacity={0.22 * glow} />
          </G>
          <Bucket x={1150} y={520} s={1.2} o={ramp(t, c[3] + 0.5, c[3] + 1.4)} />
        </G>
        <G x={0} y={0} o={s4}>
          <path d="M420 640 Q960 520 1480 640" fill="none" stroke="#B89A5E" strokeWidth={6} strokeDasharray="4 16" strokeLinecap="round" />
          <rect x={1460} y={560} width={150} height={120} rx={8} fill={SOFT} stroke={ink} strokeWidth={5} />
          <rect x={1485} y={590} width={100} height={40} rx={6} fill={ink} />
          <Coin x={cx} y={cy - 30} />
        </G>
      </SvgFrame>
      <Chip text="THE QUEUE" x={960} y={50} o={seg(t, c, 0)} />
      <Chip text="HOW CAN IT COST THIS MUCH?" x={960} y={50} o={seg(t, c, 1)} color={orange} />
      <Note text="corn + heat + salt" x={1230} y={700} o={seg(t, c, 1)} size={40} />
      <Chip text="AT AMC: ABOUT HALF TO THE STUDIO" x={960} y={50} o={seg(t, c, 2)} color={orange} />
      <Note text="AMC annual results, 2025 · calculated" x={960} y={660} o={vis(t, c[2] + 2.4, c[3] - 0.4)} size={28} />
      <Chip text="ANOTHER WAY TO PAY THE BILLS" x={960} y={50} o={seg(t, c, 3)} />
      {title > 0 && (
        <div style={{ position: "absolute", left: 0, top: 170, width: W, textAlign: "center", opacity: title * s4, fontFamily: theme.font }}>
          <div style={{ fontWeight: 900, fontSize: 92, letterSpacing: 8, color: ink }}>THE EVERYDAY MYSTERY</div>
          <div style={{ width: 360, height: 6, background: orange, margin: "22px auto" }} />
          <div style={{ fontWeight: 700, fontSize: 38, color: teal }}>EM-004 · Why Is Popcorn at the Movies So Expensive?</div>
        </div>
      )}
      <Chip text="FOLLOW THE MONEY" x={960} y={50} o={s4 * (1 - title)} />
    </>
  );
};

// ---------------------------------------------------------------- 2: la entrada
export const SceneTicket: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const s0 = seg(t, c, 0);
  const s1 = seg(t, c, 1);
  const s2 = seg(t, c, 2);
  const s3 = seg(t, c, 3);
  const s4 = seg(t, c, 4);
  const coin = ramp(t, c[0] + 0.3, c[0] + 1.2);
  const out = ramp(t, c[0] + 1.2, c[0] + 2.2);
  const hi = ramp(t, c[2] + 0.6, c[2] + 1.8);
  const spread = ramp(t, c[4] + 0.5, c[4] + 2.2);
  const cols = [560, 810, 1110, 1360];
  const kinds = ["building", "screen", "staff", "broom"] as const;
  return (
    <>
      <SvgFrame>
        <G x={0} y={0} o={s0}>
          <Person x={330} y={640} body={teal} />
          <rect x={560} y={300} width={300} height={340} fill={SOFT} stroke={ink} strokeWidth={5} />
          <rect x={540} y={270} width={340} height={40} fill={ink} />
          <rect x={620} y={400} width={180} height={100} rx={8} fill={ink} />
          <rect x={600} y={500} width={220} height={16} fill={SAND} stroke={ink} strokeWidth={4} />
          <Coin x={lerp(430, 710, coin)} y={lerp(520, 450, coin) - Math.sin(coin * Math.PI) * 60} o={1 - out} />
          <Ticket x={lerp(710, 1180, out)} y={500} s={0.8} o={out} />
        </G>
        <G x={0} y={0} o={s1}>
          <Ticket x={520} y={440} s={1.1} />
          <Plaque x={1500} y={440} text="STUDIO" o={vis(t, c[1] + 0.3)} />
          <Arrow x1={720} y1={400} x2={1290} y2={340} color={GREY} o={0.7 * vis(t, c[1] + 0.5)} w={8} />
          <Cross x={1000} y={370} o={vis(t, c[1] + 1.5)} />
          <Arrow x1={720} y1={490} x2={1290} y2={530} o={vis(t, c[1] + 2.3)} w={14} />
        </G>
        <G x={0} y={0} o={s2}>
          <Ticket x={960} y={420} s={1.9} hi={hi} />
          <Txt x={1108} y={236} size={44} fill={orange}>
            studio
          </Txt>
        </G>
        <G x={0} y={0} o={s3}>
          <Ticket x={960} y={440} s={1.4} half="L" />
          {[[500, 300], [1420, 300], [500, 590], [1420, 590]].map(([x, y], i) => (
            <g key={i} opacity={vis(t, c[3] + 0.6 + i * 0.8)}>
              <line x1={x + (x < 960 ? 100 : -100)} y1={y + (y < 440 ? 30 : -30)} x2={x < 960 ? 830 : 1090} y2={y < 440 ? 400 : 480} stroke={GREY} strokeWidth={5} strokeDasharray="10 10" />
              <Icon k={kinds[i]} x={x} y={y} o={1} />
              <Txt x={x} y={y + 112} size={28}>
                {["THE BUILDING", "THE SCREENS", "THE STAFF", "THE CLEANING"][i]}
              </Txt>
            </g>
          ))}
        </G>
        <G x={0} y={0} o={s4}>
          <Ticket x={lerp(960, 900, spread)} y={300} s={1.3} split={1} dr={lerp(0, 230, spread)} ro={lerp(1, 0.3, spread)} />
          <G x={0} y={0} o={spread}>
            <Txt x={780} y={170} size={34} fill={teal}>
              about half is left
            </Txt>
            <Txt x={1290} y={170} size={34} fill={orange}>
              to the studio
            </Txt>
          </G>
          {cols.map((x, i) => (
            <g key={x} opacity={spread}>
              <line x1={780} y1={400} x2={x} y2={590} stroke={GREY} strokeWidth={5} strokeDasharray="10 10" />
              <Icon k={kinds[i]} x={x} y={660} o={spread} />
            </g>
          ))}
        </G>
      </SvgFrame>
      <Chip text="YOU PAY FOR YOUR TICKET" x={960} y={50} o={seg(t, c, 0)} />
      <Chip text="NOT A FLAT FEE" x={990} y={250} o={vis(t, c[1] + 0.5, c[2] - 0.4)} color={orange} />
      <Chip text="A SHARE OF TICKET SALES" x={990} y={600} o={vis(t, c[1] + 2.3, c[2] - 0.4)} />
      <Chip text="ABOUT 48% TO THE STUDIO" x={960} y={600} o={vis(t, c[2] + 0.8, c[3] - 0.4)} color={orange} />
      <Note text="AMC annual results, 2025 · calculated from company figures" x={960} y={690} o={seg(t, c, 2)} size={28} />
      <Chip text="THE BILLS KEEP COMING" x={960} y={50} o={seg(t, c, 3)} />
      <Chip text="ABOUT HALF IS LEFT" x={960} y={50} o={seg(t, c, 4)} color={orange} />
      <SimpleNote o={Math.max(s1, s2, s3, s4)} />
    </>
  );
};

// ---------------------------------------------------------------- 3: el mostrador
export const SceneCounter: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const base = seg(t, c, 0, 2);
  const menu = seg(t, c, 0);
  const sh = seg(t, c, 1);
  const drop = ramp(t, c[2] + 0.3, c[2] + 1.2);
  const stay = vis(t, c[2] + 1.2);
  const bar = seg(t, c, 3, 4);
  const four = vis(t, c[4] + 0.3);
  const sc = seg(t, c, 5);
  const ch = seg(t, c, 6);
  const lit = seg(t, c, 7);
  const grow = ramp(t, c[6] + 0.6, c[6] + 2.2);
  const tilt = Math.sin((t - c[5]) * 2) * 2 * Math.exp(-(t - c[5]) * 0.3);
  const bars: [string, number, number, string, string][] = [["AMC", 51, 49, "51%", "49%"], ["CINEMARK", 40, 60, "at least 40%", "up to 60%"]];
  return (
    <>
      <SvgFrame>
        <G x={0} y={0} o={menu}>
          <rect x={1000} y={170} width={600} height={220} rx={14} fill="#fff" stroke={ink} strokeWidth={5} />
          <rect x={1000} y={170} width={600} height={52} rx={14} fill={orange} />
          {[0, 1, 2].map((r) => (
            <rect key={r} x={1040} y={248 + r * 44} width={300 + r * 50} height={18} rx={9} fill={panelLine} />
          ))}
        </G>
        <G x={0} y={0} o={base}>
          <Desk x0={900} x1={1760} />
          <Register x={1050} y={640} />
          <Bucket x={1360} y={540} />
          <Cup x={1560} y={580} />
          <Person x={760} y={720} body={GREY} s={1.1} />
        </G>
        <G x={0} y={0} o={sh}>
          <Plaque x={300} y={240} text="STUDIO" />
          <Ticket x={300} y={640} s={0.7} />
          <Arrow x1={300} y1={320} x2={300} y2={540} />
          <path d="M440 240 Q900 120 1200 500" fill="none" stroke={orange} strokeWidth={7} strokeDasharray="14 12" />
          <Cross x={860} y={245} o={vis(t, c[1] + 1.2)} />
        </G>
        <G x={0} y={0} o={base}>
          <Coin x={1050} y={lerp(200, 560, drop)} o={vis(t, c[2] + 0.1) * (1 - stay)} />
          {stay > 0 && [0, 1, 2].map((i) => <Coin key={i} x={1000 + i * 26} y={612 - i * 3} o={stay} s={0.7} />)}
        </G>
        <G x={0} y={0} o={bar}>
          <Bucket x={330} y={510} s={1.2} />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <rect x={560 + i * 150} y={400} width={150} height={130} fill={i === 0 ? teal : SAND} stroke={ink} strokeWidth={5} />
              {i === 0 && (
                <Txt x={635} y={465} size={36} fill="#fff">
                  1/5
                </Txt>
              )}
            </g>
          ))}
          <Txt x={635} y={375} size={26}>
            cost of food and drink
          </Txt>
          <g opacity={four}>
            <path d="M710 560 V580 H1310 V560" fill="none" stroke={ink} strokeWidth={5} />
            <Txt x={1010} y={615} size={34} fill={orange}>
              about four-fifths left
            </Txt>
          </g>
        </G>
        <G x={0} y={0} o={sc}>
          <G x={960} y={420} rot={tilt}>
            <line x1={-330} y1={0} x2={330} y2={0} stroke={ink} strokeWidth={12} strokeLinecap="round" />
            {[-330, 330].map((px, i) => (
              <g key={px} transform={`translate(${px} 0)`}>
                <path d="M0 0 L-90 150 M0 0 L90 150" stroke={ink} strokeWidth={4} />
                <path d="M-110 150 H110 Q90 205 0 205 Q-90 205 -110 150Z" fill={SOFT} stroke={ink} strokeWidth={5} />
                {i === 0 ? <Ticket x={0} y={100} s={0.5} /> : <Bucket x={0} y={92} s={0.5} />}
              </g>
            ))}
          </G>
          <rect x={950} y={420} width={20} height={290} fill={ink} />
          <rect x={900} y={700} width={120} height={20} rx={8} fill={ink} />
        </G>
        <G x={0} y={0} o={ch}>
          {bars.map(([name, tk, sn, tkLabel, snLabel], i) => {
            const y = 240 + i * 170;
            const wt = 1000 * (tk / 100) * grow;
            const ws = 1000 * (sn / 100) * grow;
            return (
              <g key={name}>
                <Txt x={310} y={y + 55} size={36}>
                  {name}
                </Txt>
                <rect x={460} y={y} width={wt} height={110} fill={teal} stroke={ink} strokeWidth={4} />
                <rect x={460 + wt} y={y} width={ws} height={110} fill={orange} stroke={ink} strokeWidth={4} />
                {grow > 0.95 && (
                  <>
                    <Txt x={460 + wt / 2} y={y + 55} size={44} fill="#fff">
                      {tkLabel}
                    </Txt>
                    <Txt x={460 + wt + ws / 2} y={y + 55} size={44} fill="#fff">
                      {snLabel}
                    </Txt>
                  </>
                )}
              </g>
            );
          })}
        </G>
        <G x={0} y={0} o={lit}>
          <Bulb x={960} y={230} on={ramp(t, c[7] + 0.8, c[7] + 1.4)} />
          <Bucket x={960} y={570} s={1.5} />
        </G>
      </SvgFrame>
      <Chip text="THE SNACK COUNTER" x={960} y={50} o={seg(t, c, 0)} />
      <Chip text="THE STUDIO'S SHARE: TICKET SALES" x={960} y={50} o={seg(t, c, 1)} />
      <Note text="ticket sales" x={150} y={440} o={vis(t, c[1] + 0.8, c[2] - 0.4)} size={32} />
      <Note text="snack sales" x={860} y={300} o={vis(t, c[1] + 1.4, c[2] - 0.4)} size={32} />
      <Chip text="STAYS WITH THE CINEMA" x={960} y={50} o={seg(t, c, 2)} />
      <Chip text="WHAT THE FOOD COST IT" x={960} y={50} o={seg(t, c, 3)} />
      <Note text="food and drink sold: cost about a fifth of sales (AMC 2025, calculated)" x={960} y={690} o={seg(t, c, 3)} size={28} />
      <Chip text="WHAT IS LEFT" x={960} y={50} o={seg(t, c, 4)} color={orange} />
      {["STAFF", "RENT", "PROFIT"].map((w, i) => (
        <Chip key={w} text={w} x={780 + i * 230} y={650} o={vis(t, c[4] + 0.8 + i * 0.7, c[5] - 0.4)} />
      ))}
      <Chip text="ADD IT ALL UP" x={960} y={50} o={seg(t, c, 5)} />
      <Chip text="TICKETS MINUS STUDIO" x={600} y={650} o={vis(t, c[5] + 1.0, c[6] - 0.4)} />
      <Chip text="SNACKS MINUS FOOD COST" x={1340} y={650} o={vis(t, c[5] + 3.0, c[6] - 0.4)} color={orange} />
      <Chip text="HALF OR MORE FROM FOOD AND DRINK" x={960} y={50} o={seg(t, c, 6)} color={orange} />
      <Chip text="TICKETS AFTER STUDIO" x={600} y={550} o={seg(t, c, 6)} />
      <Chip text="SNACKS AFTER FOOD COST" x={1260} y={550} o={seg(t, c, 6)} color={orange} />
      <Note text="Shares of what is left after studio and ingredients, not profit." x={960} y={662} o={seg(t, c, 6)} size={28} />
      <Note text="AMC and Cinemark annual results, 2025 · calculated from company figures" x={960} y={700} o={seg(t, c, 6)} size={28} />
      <Note text="Cinemark's film cost line includes advertising." x={960} y={738} o={seg(t, c, 6)} size={28} />
      <Chip text="IT KEEPS THE LIGHTS ON" x={960} y={50} o={seg(t, c, 7)} />
      <SimpleNote o={Math.max(sh, seg(t, c, 2), bar, sc, ch)} />
    </>
  );
};

// ---------------------------------------------------------------- 4: los economistas
export const SceneEconomists: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const e0 = seg(t, c, 0);
  const e12 = seg(t, c, 1, 2);
  const e3 = seg(t, c, 3);
  const e4 = seg(t, c, 4);
  const e5 = seg(t, c, 5);
  const e6 = seg(t, c, 6);
  const e7 = seg(t, c, 7);
  const e8 = seg(t, c, 8);
  const walk = ramp(t, c[3] + 0.4, c[3] + 3.8);
  const px = lerp(460, 1640, walk);
  const dots = Array.from({ length: 8 }, (_, i) => {
    const ph = (t * 0.35 + i / 8) % 1;
    const topX = 760 + ((i * 57) % 400);
    const orangeDot = i % 2 === 0;
    const x = ph < 0.5 ? lerp(topX, 960, ph / 0.5) : 960 + (orangeDot ? 1 : -1) * (ph - 0.5) * 2 * 330;
    return { x, y: 170 + ph * 430, orangeDot, i };
  });
  return (
    <>
      <SvgFrame>
        <G x={0} y={0} o={e0}>
          <Bucket x={560} y={500} s={1.3} />
          <Tag x={560} y={310} text="$$$" s={1.3} />
          <Bucket x={1160} y={500} s={1.3} />
          <Tag x={1160} y={310} text="$" s={1.3} />
          <Txt x={1560} y={330} size={150} fill={orange} serif>
            ?
          </Txt>
        </G>
        <G x={0} y={0} o={e12}>
          <line x1={960} y1={180} x2={960} y2={740} stroke={GREY} strokeWidth={6} strokeDasharray="14 14" />
          <Person x={480} y={700} s={1.6} body={ink} tie />
          <Person x={1440} y={700} s={1.6} body={teal} />
          <Ticket x={1230} y={600} s={0.6} />
          <Bucket x={690} y={560} s={1.6} o={vis(t, c[2] + 0.5)} />
          <Cup x={885} y={610} />
        </G>
        <G x={0} y={0} o={e3}>
          <Desk x0={1000} x1={1800} />
          <Bucket x={1400} y={540} />
          <Tag x={1400} y={400} text="$$$" />
          <Person x={px} y={835} s={1.15} body={teal} />
          <Ticket x={px + 88} y={800} s={0.4} />
        </G>
        <G x={0} y={0} o={e4}>
          <polygon points="700,180 1220,180 1060,420 860,420" fill={SOFT} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
          <rect x={900} y={420} width={120} height={50} fill={SOFT} stroke={ink} strokeWidth={6} />
          {dots.map((d) => (
            <circle key={d.i} cx={d.x} cy={d.y} r={18} fill={d.orangeDot ? orange : teal} stroke={ink} strokeWidth={3} />
          ))}
          <Arrow x1={900} y1={520} x2={640} y2={610} color={teal} />
          <Arrow x1={1020} y1={520} x2={1280} y2={610} color={orange} />
        </G>
        <G x={0} y={0} o={e5}>
          <Wallet x={560} y={470} s={1.6} color={orange} />
          {[0, 1, 2, 3, 4].map((i) => (
            <Coin key={i} x={470 + i * 48} y={330 - (i % 2) * 36} o={vis(t, c[5] + 0.8 + i * 0.4)} />
          ))}
          <Wallet x={1020} y={500} s={0.9} color={teal} />
          <Coin x={1020} y={405} o={vis(t, c[5] + 1.4)} />
          <Ticket x={1520} y={440} />
          <line x1={1380} y1={560} x2={1660} y2={560} stroke={ink} strokeWidth={8} strokeLinecap="round" />
        </G>
        <G x={0} y={0} o={e6}>
          <rect x={300} y={230} width={440} height={300} rx={16} fill={WARM} stroke={ink} strokeWidth={5} />
          <Txt x={520} y={290} size={64} serif spacing={4}>
            COMBO
          </Txt>
          <Bucket x={450} y={440} s={0.7} />
          <Cup x={620} y={450} s={0.9} />
          <Person x={1400} y={650} s={1.5} body={ink} tie />
          <Bubble x={1400} y={330} text="?" o={1} r={50} />
          {[1100, 1200, 1300, 1400, 1500, 1600, 1700].map((x) => (
            <rect key={x} x={x - 9} y={500} width={18} height={200} fill="#C9B58A" stroke={ink} strokeWidth={3} />
          ))}
          {[550, 640].map((y) => (
            <rect key={y} x={1090} y={y} width={630} height={14} rx={7} fill="#C9B58A" stroke={ink} strokeWidth={3} />
          ))}
        </G>
        <G x={0} y={0} o={e7}>
          <rect x={780} y={250} width={200} height={450} fill={SAND} stroke={ink} strokeWidth={5} />
          <rect x={800} y={290} width={70} height={410} fill="#fff" stroke={ink} strokeWidth={4} />
          <rect x={890} y={290} width={70} height={410} fill="#fff" stroke={ink} strokeWidth={4} />
          <path d="M440 520 H560 L548 660 H452 Z" fill={teal} stroke={ink} strokeWidth={5} />
          <path d="M470 520 Q500 440 530 520" fill="none" stroke={ink} strokeWidth={6} />
          <circle cx={500} cy={590} r={100} fill="none" stroke={orange} strokeWidth={14} />
          <line x1={430} y1={520} x2={570} y2={660} stroke={orange} strokeWidth={14} strokeLinecap="round" />
          <Desk x0={1100} x1={1800} />
          <Bucket x={1450} y={540} />
        </G>
        <G x={0} y={0} o={e8}>
          <rect x={540} y={200} width={380} height={480} rx={10} fill="#fff" stroke={ink} strokeWidth={5} />
          <Txt x={730} y={260} size={32}>
            ECONOMISTS'
          </Txt>
          <Txt x={730} y={302} size={32}>
            REASONING
          </Txt>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={580} y={350 + i * 56} width={i === 4 ? 160 : 300} height={14} rx={7} fill={panelLine} />
          ))}
          <circle cx={960} cy={460} r={120} fill={SOFT} fillOpacity={0.4} stroke={ink} strokeWidth={14} />
          <line x1={1046} y1={546} x2={1190} y2={690} stroke={ink} strokeWidth={22} strokeLinecap="round" />
          <Stamp x={1400} y={330} text="EXPLANATION, NOT PROOF" size={34} rot={-6} o={vis(t, c[8] + 1.5)} />
        </G>
      </SvgFrame>
      <Chip text="WHY NOT CHEAP POPCORN?" x={960} y={50} o={seg(t, c, 0)} color={orange} />
      <Note text="more sales?" x={1560} y={410} o={vis(t, c[0] + 1.5, c[1] - 0.4)} size={40} />
      <Chip text="ECONOMISTS' IDEA" x={960} y={50} o={seg(t, c, 1, 2)} />
      <Note text="two kinds of moviegoers" x={960} y={130} o={seg(t, c, 1, 2)} size={38} />
      <Chip text="SPLURGER" x={480} y={740} o={seg(t, c, 1, 2)} color={orange} />
      <Chip text="JUST THE MOVIE" x={1440} y={740} o={seg(t, c, 1, 2)} />
      <Chip text="A HIGH PRICE: WALK PAST" x={960} y={50} o={seg(t, c, 3)} />
      <Note text="no, thanks" x={px} y={470} o={seg(t, c, 3) * ramp(t, c[3] + 1.8, c[3] + 2.4)} size={38} />
      <Chip text="THE COUNTER SORTS YOU OUT" x={960} y={50} o={seg(t, c, 4)} />
      <Chip text="JUST THE TICKET" x={600} y={650} o={seg(t, c, 4)} />
      <Chip text="SPLURGE" x={1320} y={650} o={seg(t, c, 4)} color={orange} />
      <Chip text="SPLURGERS" x={560} y={640} o={seg(t, c, 5)} color={orange} />
      <Chip text="EVERYONE ELSE" x={1020} y={640} o={seg(t, c, 5)} />
      <Chip text="STEADY TICKET PRICE" x={1520} y={640} o={seg(t, c, 5)} />
      <Chip text="THE COMBO DEAL" x={960} y={50} o={seg(t, c, 6)} />
      <Chip text="A LITTLE DISCOUNT" x={520} y={590} o={seg(t, c, 6)} color={orange} />
      <Chip text="ON THE FENCE" x={1400} y={760} o={seg(t, c, 6)} />
      <Chip text="NO OUTSIDE SNACKS" x={960} y={50} o={seg(t, c, 7)} color={orange} />
      <Chip text="LITTLE COMPETITION" x={1450} y={700} o={seg(t, c, 7)} />
      <Chip text="ECONOMISTS SAY" x={960} y={50} o={seg(t, c, 8)} />
      <SimpleNote o={Math.max(e4, e5)} />
    </>
  );
};

// ---------------------------------------------------------------- 5: la historia
const Facade: React.FC<{ x: number; y: number; w?: number; h?: number; text?: string; off?: number }> = ({ x, y, w = 520, h = 440, text, off = 0 }) => (
  <G x={x} y={y}>
    <rect x={0} y={0} width={w} height={h} fill={SAND} stroke={ink} strokeWidth={5} />
    <rect x={0} y={0} width={w} height={Math.min(80, h * 0.25)} fill={ink} />
    {text && (
      <Txt x={w / 2} y={Math.min(80, h * 0.25) / 2} size={Math.min(54, w * 0.16)} fill={GOLD} serif spacing={6}>
        {text}
      </Txt>
    )}
    {[0, 1].map((i) => (
      <g key={i}>
        <rect x={w * (0.12 + i * 0.5)} y={h * 0.38} width={w * 0.26} height={h * 0.28} fill={GOLD} stroke={ink} strokeWidth={4} />
        <rect x={w * (0.12 + i * 0.5)} y={h * 0.38} width={w * 0.26} height={h * 0.28} fill={GREY} opacity={off} />
      </g>
    ))}
    <rect x={w * 0.42} y={h * 0.7} width={w * 0.16} height={h * 0.3} fill={ink} />
  </G>
);

export const SceneHistory: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const h0 = seg(t, c, 0);
  const h1 = seg(t, c, 1);
  const h2 = seg(t, c, 2);
  const h3 = seg(t, c, 3);
  const h4 = seg(t, c, 4);
  const h5 = seg(t, c, 5);
  const h6 = seg(t, c, 6);
  const morph = ramp(t, c[6] + 0.8, c[6] + 2.2);
  return (
    <>
      <SvgFrame>
        <G x={0} y={0} o={h0}>
          <Facade x={620} y={260} text="CINEMA" />
          <circle cx={1500} cy={450} r={115} fill="#fff" stroke={ink} strokeWidth={6} />
          <Bucket x={1500} y={455} s={0.5} stripe="#B89A5E" />
          <circle cx={1500} cy={450} r={115} fill="none" stroke={orange} strokeWidth={14} />
          <line x1={1420} y1={370} x2={1580} y2={530} stroke={orange} strokeWidth={14} strokeLinecap="round" />
        </G>
        <G x={0} y={0} o={h1}>
          <rect x={460} y={160} width={1000} height={620} fill={SAND} stroke={ink} strokeWidth={5} />
          <polygon points="800,780 1120,780 1060,470 860,470" fill={orange} opacity={0.85} stroke={ink} strokeWidth={4} />
          {[620, 1300].map((x) => (
            <g key={x}>
              <line x1={x} y1={160} x2={x} y2={250} stroke={ink} strokeWidth={5} />
              <path d={`M${x - 60} 330 Q${x} 240 ${x + 60} 330 Z`} fill={GOLD} stroke={ink} strokeWidth={5} />
            </g>
          ))}
          {[760, 1160].map((x) => (
            <g key={x}>
              <rect x={x - 8} y={620} width={16} height={130} fill={ink} />
              <circle cx={x} cy={612} r={16} fill={GOLD} stroke={ink} strokeWidth={4} />
            </g>
          ))}
          <Person x={560} y={740} s={1.2} body={ink} tie />
          <Person x={1360} y={740} s={1.2} body={teal} />
        </G>
        <G x={0} y={0} o={h2}>
          {[0, 1, 2, 3, 4].map((i) => {
            const off = ramp(t, c[2] + 0.6 + i * 0.5, c[2] + 1.1 + i * 0.5);
            return (
              <g key={i}>
                <Facade x={250 + i * 300} y={340} w={230} h={300} off={off} />
                <G x={250 + i * 300 + 115} y={660} o={off}>
                  <rect x={-50} y={-18} width={100} height={36} rx={6} fill="#fff" stroke={orange} strokeWidth={4} />
                  <Txt x={0} y={1} size={22} fill={orange}>
                    CLOSED
                  </Txt>
                </G>
              </g>
            );
          })}
        </G>
        <G x={0} y={0} o={h3}>
          <Facade x={240} y={250} w={380} h={440} text="CINEMA" />
          <rect x={900} y={640} width={420} height={110} rx={8} fill={WARM} stroke={ink} strokeWidth={5} />
          <rect x={920} y={520} width={380} height={120} fill="#fff" stroke={ink} strokeWidth={5} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle key={i} cx={960 + i * 60} cy={500 + (i % 2) * 14} r={30} fill="#FFF3C9" stroke={ink} strokeWidth={4} />
          ))}
          <line x1={1110} y1={350} x2={1110} y2={520} stroke={ink} strokeWidth={8} />
          <polygon points="930,350 1290,350 1110,260" fill={teal} stroke={ink} strokeWidth={5} />
          {[960, 1260].map((x) => (
            <circle key={x} cx={x} cy={770} r={30} fill={ink} />
          ))}
          <Person x={1420} y={750} s={1.3} body={orange} />
          {[720, 810].map((x, i) => (
            <Person key={x} x={x} y={760} s={1.1} body={i ? GREY : "#B8C0CC"} />
          ))}
        </G>
        <G x={0} y={0} o={h4}>
          <Ticket x={520} y={400} s={1.2} />
          <Tag x={520} y={560} text="LOW" />
          <Arrow x1={700} y1={420} x2={1000} y2={420} color={GREY} />
          <rect x={1030} y={420} width={460} height={290} fill={WARM} stroke={ink} strokeWidth={5} />
          <polygon points="1000,420 1520,420 1490,330 1030,330" fill={teal} stroke={ink} strokeWidth={5} />
          <Bucket x={1260} y={560} s={0.9} />
          {[0, 1, 2, 3, 4].map((i) => (
            <Coin key={i} x={1640} y={690 - i * 34} o={vis(t, c[4] + 0.8 + i * 0.5)} />
          ))}
        </G>
        <G x={0} y={0} o={h6}>
          <Bucket x={560} y={440} s={1.3} stripe="#B89A5E" o={1 - 0.65 * morph} />
          <Arrow x1={760} y1={440} x2={1100} y2={440} color={GREY} o={morph} />
          <Bucket x={1340} y={440} s={1.3} o={morph} />
          <line x1={420} y1={700} x2={1500} y2={700} stroke={ink} strokeWidth={6} />
          <circle cx={560} cy={700} r={14} fill={ink} />
          <circle cx={1340} cy={700} r={14} fill={orange} />
          <Txt x={560} y={750} size={34}>
            1930s
          </Txt>
          <Txt x={1340} y={750} size={34} fill={orange}>
            TODAY
          </Txt>
        </G>
      </SvgFrame>
      <Chip text="A CENTURY AGO" x={960} y={50} o={seg(t, c, 0)} />
      <Note text="no snacks allowed" x={1500} y={600} o={vis(t, c[0] + 1.0, c[1] - 0.4)} size={36} />
      <Chip text="RUGS ON THE FLOOR. NO SNACKING." x={960} y={50} o={seg(t, c, 1)} />
      <Chip text="THE GREAT DEPRESSION" x={960} y={50} o={seg(t, c, 2)} color={orange} />
      <Note text="closed by the thousands" x={960} y={720} o={vis(t, c[2] + 1.8, c[3] - 0.4)} size={36} />
      <Chip text="VENDORS OUTSIDE THE DOORS" x={960} y={50} o={seg(t, c, 3)} />
      <Chip text="KEEP THE TICKET LOW. EARN AT THE STAND." x={960} y={50} o={seg(t, c, 4)} />
      {h5 > 0 && (
        <>
          <Chip text="ONE HISTORIAN SAYS" x={960} y={50} o={h5} color={orange} />
          <div style={{ position: "absolute", left: 0, top: 230, width: W, textAlign: "center", opacity: h5, fontFamily: SERIF }}>
            <div style={{ fontStyle: "italic", fontWeight: 700, fontSize: 120, color: ink }}>
              <span style={{ color: orange }}>“</span>really saved theaters<span style={{ color: orange }}>”</span>
            </div>
            <div style={{ fontFamily: theme.font, fontWeight: 800, fontSize: 44, color: teal, marginTop: 40 }}>Andrew F. Smith, historian</div>
            <div style={{ fontFamily: theme.font, fontWeight: 600, fontSize: 34, color: ink, marginTop: 14 }}>on popcorn during the Depression</div>
          </div>
        </>
      )}
      <Chip text="THE SAME IDEA TODAY" x={960} y={50} o={seg(t, c, 6)} />
      <SimpleNote o={h6} />
    </>
  );
};

// ---------------------------------------------------------------- 6: cierre
export const SceneClose: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const a = seg(t, c, 0);
  const b = seg(t, c, 1);
  const d = seg(t, c, 2);
  const e = seg(t, c, 3);
  const f = seg(t, c, 4);
  const car = ramp(t, c[3] + 0.3, c[3] + 3.5);
  const puff = ramp(t, c[4] + 0.8, c[4] + 1.8);
  return (
    <>
      <SvgFrame>
        <G x={0} y={0} o={a}>
          {[400, 620, 840, 1060].map((x, i) => (
            <Person key={x} x={x} y={720} s={1.2} body={i % 2 ? GREY : "#B8C0CC"} />
          ))}
          <Person x={1280} y={720} s={1.2} body={teal} />
          <Bulb x={1280} y={330} on={ramp(t, c[0] + 1.0, c[0] + 1.6)} s={0.9} />
          <Desk x0={1480} x1={1880} />
          <Bucket x={1680} y={540} s={0.9} />
        </G>
        <G x={0} y={0} o={b}>
          <Ticket x={450} y={330} s={0.85} o={vis(t, c[1] + 0.5)} />
          <Arrow x1={680} y1={330} x2={1060} y2={330} o={vis(t, c[1] + 1.0)} />
          <Plaque x={1250} y={330} text="STUDIO" o={vis(t, c[1] + 1.0)} />
          <Bucket x={450} y={570} s={0.75} o={vis(t, c[1] + 2.5)} />
          <Arrow x1={680} y1={570} x2={1060} y2={570} color={orange} o={vis(t, c[1] + 3.0)} />
          <Plaque x={1250} y={570} text="CINEMA" o={vis(t, c[1] + 3.0)} />
        </G>
        <G x={0} y={0} o={d}>
          <Bucket x={960} y={540} s={1.6} face={ramp(t, c[2] + 0.8, c[2] + 1.4)} />
          <Stamp x={1500} y={330} text="MAKES SENSE" color={teal} rot={-7} o={vis(t, c[2] + 2.4)} size={44} />
        </G>
        <G x={0} y={0} o={e}>
          <circle cx={300} cy={210} r={50} fill="#FFF3C9" stroke={ink} strokeWidth={4} />
          <rect x={0} y={700} width={W} height={90} fill={ink} opacity={0.88} />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={40 + i * 170} y={742} width={80} height={8} fill="#fff" opacity={0.8} />
          ))}
          <G x={lerp(260, 900, car)} y={700}>
            <path d="M-120 0 V-50 Q-120 -64 -104 -64 H-70 L-40 -108 H50 L80 -64 H110 Q124 -64 124 -50 V0 Z" fill={teal} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
            <rect x={-114} y={-40} width={16} height={14} fill={RED} />
            {[-64, 66].map((x) => (
              <circle key={x} cx={x} cy={4} r={26} fill={ink} />
            ))}
          </G>
          <TLight x={1250} y={380} red={1} />
          <Txt x={1480} y={340} size={230} fill={orange} serif>
            ?
          </Txt>
        </G>
        <G x={0} y={0} o={f}>
          <rect x={0} y={700} width={W} height={90} fill={ink} opacity={0.88} />
          <polygon
            points="0,-150 40,-60 140,-100 80,-20 160,40 60,50 90,150 0,80 -90,150 -60,50 -160,40 -80,-20 -140,-100 -40,-60"
            fill={GOLD}
            opacity={0.45 * puff}
            transform={`translate(960 400) scale(${0.6 + 0.6 * puff})`}
          />
          <TLight x={960} y={400} red={1} />
          {[[-30, 150, 46], [30, 130, 56], [-70, 120, 38], [80, 140, 40], [10, 100, 44]].map(([px, py, r], i) => (
            <circle key={i} cx={960 + px} cy={py + 150 - puff * 60} r={r * puff} fill="#fff" stroke={ink} strokeWidth={4} />
          ))}
        </G>
      </SvgFrame>
      <Chip text="NOW YOU KNOW THE GAME" x={960} y={50} o={seg(t, c, 0)} />
      <Chip text="ROUGHLY SPEAKING" x={960} y={50} o={seg(t, c, 1)} />
      <Chip text="STILL A LOT FOR CORN?" x={960} y={50} o={seg(t, c, 2)} color={orange} />
      <Chip text="WHO DECIDED RED MEANS STOP?" x={960} y={50} o={seg(t, c, 3)} color={orange} />
      <Chip text="NEXT: WHY?" x={960} y={50} o={seg(t, c, 4)} color={orange} />
      <SimpleNote o={b} />
    </>
  );
};

export const SCENES004: Record<string, React.FC<SceneProps>> = {
  "popcorn-hook": SceneHook,
  "ticket": SceneTicket,
  "counter": SceneCounter,
  "economists": SceneEconomists,
  "history": SceneHistory,
  "close": SceneClose,
};
