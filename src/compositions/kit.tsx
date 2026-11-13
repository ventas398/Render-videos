import React from "react";
import { useCurrentFrame } from "remotion";
import { SIMPLIFIED_NOTE } from "../components/TechnicalDiagram";
import { Note, vis } from "../components/ui";
import { theme, VIDEO } from "../themes/brand";

/** Piezas comunes para los episodios nuevos (EM-005 en adelante). EM-003/004 mantienen sus copias. */
export const { width: W, height: H, fps: FPS } = VIDEO;
export const { ink, teal, orange, bg, panelLine } = theme;
export const SERIF = 'Georgia, Cambria, "Times New Roman", serif';
export const SAND = "#EBDDBB";
export const SOFT = "#DDEEEE";
export const WARM = "#FBE3CF";
export const GOLD = "#D9A441";
export const GREY = "#9AA4B2";
export const RED = "#D64545";
export const GREEN = "#3E9B6A";
export const AMBER = "#E8A317";
export const DIM = "#3B4A6B";

export const useT = (): number => useCurrentFrame() / FPS;

/** Visible durante las partes k..k2 (entra 0.1 s tras el inicio, sale 0.4 s antes del siguiente). */
export const seg = (t: number, c: number[], k: number, k2 = k): number => vis(t, c[k] + 0.1, c[k2 + 1] === undefined ? 1e6 : c[k2 + 1] - 0.4);

export const SvgFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    {children}
  </svg>
);

export const G: React.FC<{ x?: number; y?: number; s?: number; o?: number; rot?: number; children: React.ReactNode }> = ({ x = 0, y = 0, s = 1, o = 1, rot = 0, children }) =>
  o > 0 ? (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
      {children}
    </g>
  ) : null;

export const Txt: React.FC<{ x: number; y: number; size: number; children: React.ReactNode; fill?: string; serif?: boolean; weight?: number; spacing?: number }> = ({
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

export const Stamp: React.FC<{ x: number; y: number; text: string; rot?: number; color?: string; o: number; size?: number; pad?: number }> = ({ x, y, text, rot = -8, color = orange, o, size = 44, pad = 50 }) => {
  const w = text.length * size * 0.72 + pad;
  return (
    <G x={x} y={y} rot={rot} o={o} s={1 + 0.25 * (1 - o)}>
      <rect x={-w / 2} y={-size * 0.85} width={w} height={size * 1.7} rx={14} fill={bg} fillOpacity={0.85} stroke={color} strokeWidth={6} />
      <Txt x={0} y={2} size={size} fill={color} spacing={4}>
        {text}
      </Txt>
    </G>
  );
};

export const SimpleNote: React.FC<{ o: number }> = ({ o }) => <Note text={SIMPLIFIED_NOTE} x={960} y={776} o={0.6 * o} size={24} />;

export const Person: React.FC<{ x: number; y: number; s?: number; body?: string; o?: number; hat?: boolean }> = ({ x, y, s = 1, body = ink, o = 1, hat = false }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-52 0 V-30 Q-52 -64 -20 -64 H20 Q52 -64 52 -30 V0 Z" fill={body} stroke={ink} strokeWidth={4} />
    <rect x={-10} y={-80} width={20} height={20} fill="#F1D5B0" stroke={ink} strokeWidth={3} />
    <circle cx={0} cy={-102} r={30} fill="#F1D5B0" stroke={ink} strokeWidth={4} />
    {hat && (
      <>
        <rect x={-38} y={-132} width={76} height={8} rx={3} fill={ink} />
        <rect x={-24} y={-176} width={48} height={48} fill={ink} />
      </>
    )}
  </G>
);

/** Agente genérico (casco de bobby), sin heridas ni sangre. */
export const Cop: React.FC<{ x: number; y: number; s?: number; o?: number; rot?: number }> = ({ x, y, s = 1, o = 1, rot = 0 }) => (
  <G x={x} y={y} s={s} o={o} rot={rot}>
    <path d="M-52 0 V-30 Q-52 -64 -20 -64 H20 Q52 -64 52 -30 V0 Z" fill="#26365C" stroke={ink} strokeWidth={4} />
    {[-36, -20].map((by) => (
      <circle key={by} cx={0} cy={by} r={4} fill={GOLD} />
    ))}
    <rect x={-10} y={-80} width={20} height={20} fill="#F1D5B0" stroke={ink} strokeWidth={3} />
    <circle cx={0} cy={-102} r={30} fill="#F1D5B0" stroke={ink} strokeWidth={4} />
    <path d="M-32 -108 Q-32 -158 0 -160 Q32 -158 32 -108 Z" fill={ink} />
    <rect x={-40} y={-112} width={80} height={9} rx={4} fill={ink} />
    <circle cx={0} cy={-128} r={7} fill={GOLD} />
  </G>
);

export const Tag: React.FC<{ x: number; y: number; text: string; s?: number; o?: number; rot?: number }> = ({ x, y, text, s = 1, o = 1, rot = 0 }) => (
  <G x={x} y={y} s={s} o={o} rot={rot}>
    <path d="M-48 -22 H30 L52 0 L30 22 H-48 Z" fill="#fff" stroke={orange} strokeWidth={5} strokeLinejoin="round" />
    <circle cx={34} cy={0} r={5} fill={orange} />
    <Txt x={-8} y={1} size={28}>
      {text}
    </Txt>
  </G>
);

export const Plaque: React.FC<{ x: number; y: number; text: string; s?: number; o?: number; w?: number; sans?: boolean }> = ({ x, y, text, s = 1, o = 1, w = 260, sans }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-w / 2} y={-60} width={w} height={120} rx={10} fill={SOFT} stroke={ink} strokeWidth={5} />
    <rect x={-w / 2} y={-60} width={w} height={30} rx={10} fill={ink} />
    <Txt x={0} y={14} size={40} serif={!sans} weight={sans ? 800 : undefined} spacing={4}>
      {text}
    </Txt>
  </G>
);

export const Bulb: React.FC<{ x: number; y: number; on: number; s?: number }> = ({ x, y, on, s = 1 }) => (
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

export const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; color?: string; o?: number; w?: number }> = ({ x1, y1, x2, y2, color = teal, o = 1, w = 10 }) => {
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

export const Speech: React.FC<{ x: number; y: number; text: string; o?: number; size?: number }> = ({ x, y, text, o = 1, size = 40 }) => {
  const w = text.length * size * 0.55 + 70;
  return (
    <G x={x} y={y} o={o} s={0.9 + 0.1 * o}>
      <rect x={-w / 2} y={-46} width={w} height={92} rx={44} fill="#fff" stroke={ink} strokeWidth={5} />
      <polygon points="-34,44 -58,86 4,44" fill="#fff" stroke={ink} strokeWidth={5} strokeLinejoin="round" />
      <line x1={-30} y1={45} x2={0} y2={45} stroke="#fff" strokeWidth={7} />
      <Txt x={0} y={2} size={size} fill={ink} weight={700}>
        {text}
      </Txt>
    </G>
  );
};

/** Semaforo generico. lit: r, a o g; two oculta la luz ambar. */
export const TLight: React.FC<{ x: number; y: number; s?: number; o?: number; lit?: "r" | "a" | "g"; two?: boolean; pole?: number }> = ({ x, y, s = 1, o = 1, lit, two = false, pole }) => {
  const lens: [string, "r" | "a" | "g", number][] = [[RED, "r", -140], [AMBER, "a", -80], [GREEN, "g", -20]];
  return (
    <G x={x} y={y} s={s} o={o}>
      <rect x={-10} y={0} width={20} height={pole ?? Math.max(0, (720 - y) / s)} fill={ink} />
      <rect x={-52} y={-190} width={104} height={200} rx={16} fill={ink} />
      {lens.map(([col, k, cy]) => {
        const on = lit === k && !(two && k === "a");
        return (
          <g key={k}>
            {on && <circle cx={0} cy={cy} r={58} fill={col} opacity={0.28} />}
            <circle cx={0} cy={cy} r={28} fill={on ? col : DIM} opacity={two && k === "a" ? 0.35 : 1} />
          </g>
        );
      })}
    </G>
  );
};

/** Nube de explosion estilo comic, sin fuego realista. */
export const Boom: React.FC<{ x: number; y: number; s?: number; o: number }> = ({ x, y, s = 1, o }) => (
  <G x={x} y={y} s={s * (0.6 + 0.4 * o)} o={o}>
    <polygon points="0,-150 40,-60 140,-100 80,-20 160,40 60,50 90,150 0,80 -90,150 -60,50 -160,40 -80,-20 -140,-100 -40,-60" fill={GOLD} opacity={0.5} />
    <polygon points="0,-90 26,-36 84,-60 48,-12 96,24 36,30 54,90 0,48 -54,90 -36,30 -96,24 -48,-12 -84,-60 -26,-36" fill="#FFE69A" opacity={0.8} />
    {[[-70, -120, 40], [10, -150, 52], [80, -110, 38]].map(([px, py, r], i) => (
      <circle key={i} cx={px} cy={py} r={r} fill="#fff" stroke={ink} strokeWidth={4} />
    ))}
  </G>
);

/** Bocanadas de humo suaves que suben. */
export const Puffs: React.FC<{ x: number; y: number; t: number; o?: number }> = ({ x, y, t, o = 1 }) => (
  <G x={x} y={y} o={o}>
    {[0, 1, 2, 3].map((i) => {
      const ph = (t * 0.4 + i / 4) % 1;
      return <circle key={i} cx={(i % 2 ? 22 : -22) * (1 + ph)} cy={-ph * 150} r={16 + ph * 26} fill="#fff" stroke={GREY} strokeWidth={3} opacity={1 - ph} />;
    })}
  </G>
);

export const Car: React.FC<{ x: number; y: number; s?: number; o?: number; color?: string; rot?: number }> = ({ x, y, s = 1, o = 1, color = teal, rot = 0 }) => (
  <G x={x} y={y} s={s} o={o} rot={rot}>
    <path d="M-120 0 V-50 Q-120 -64 -104 -64 H-70 L-40 -108 H50 L80 -64 H110 Q124 -64 124 -50 V0 Z" fill={color} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
    <path d="M-52 -64 L-32 -98 H-4 V-64 Z M8 -64 V-98 H44 L68 -64 Z" fill="#fff" opacity={0.7} />
    {[-64, 66].map((cx) => (
      <circle key={cx} cx={cx} cy={4} r={26} fill={ink} />
    ))}
  </G>
);

/** Locomotora de epoca generica. */
export const Loco: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-170} y={-190} width={34} height={70} fill={ink} />
    <rect x={-182} y={-200} width={58} height={16} rx={6} fill={ink} />
    <rect x={-200} y={-135} width={210} height={78} rx={34} fill={teal} stroke={ink} strokeWidth={5} />
    <rect x={0} y={-175} width={120} height={120} fill={ink} />
    <rect x={-10} y={-188} width={140} height={16} fill={ink} />
    <rect x={22} y={-150} width={76} height={52} fill={SOFT} />
    <circle cx={-208} cy={-96} r={13} fill={GOLD} stroke={ink} strokeWidth={3} />
    {[[-150, 30], [-70, 30], [50, 40]].map(([cx, r]) => (
      <circle key={cx} cx={cx} cy={-r} r={r} fill={SAND} stroke={ink} strokeWidth={6} />
    ))}
    <line x1={-150} y1={-30} x2={50} y2={-40} stroke={ink} strokeWidth={6} />
  </G>
);

/** Lampara de senal de ferrocarril: lente de color, con grieta opcional. */
export const LensLamp: React.FC<{ x: number; y: number; s?: number; o?: number; color: string; glow?: number; crack?: number }> = ({ x, y, s = 1, o = 1, color, glow = 1, crack = 0 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-10} y={90} width={20} height={200} fill={ink} />
    <rect x={-64} y={-100} width={128} height={196} rx={18} fill={ink} />
    <circle cx={0} cy={-20} r={80} fill={color} opacity={0.22 * glow} />
    <circle cx={0} cy={-20} r={46} fill={color} stroke="#fff" strokeWidth={4} />
    {crack > 0 && <polyline points="-6,-66 8,-40 -10,-22 10,0 -2,24" fill="none" stroke={ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={crack} />}
  </G>
);

export const Calendar: React.FC<{ x: number; y: number; month: string; year: string; s?: number; o?: number }> = ({ x, y, month, year, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-170} y={-150} width={340} height={300} rx={16} fill="#fff" stroke={ink} strokeWidth={5} />
    <path d="M-170 -134 Q-170 -150 -154 -150 H154 Q170 -150 170 -134 V-62 H-170 Z" fill={teal} />
    {[-80, 80].map((rx) => (
      <rect key={rx} x={rx - 8} y={-172} width={16} height={46} rx={8} fill={ink} />
    ))}
    <Txt x={0} y={-104} size={44} fill="#fff" spacing={5}>
      {month}
    </Txt>
    <Txt x={0} y={30} size={112} serif>
      {year}
    </Txt>
  </G>
);

export const Ground: React.FC<{ y?: number; color?: string }> = ({ y = 750, color = "#E3D5B3" }) => (
  <>
    <rect x={0} y={y} width={W} height={H - y} fill={color} />
    <line x1={0} y1={y} x2={W} y2={y} stroke={ink} strokeWidth={5} />
  </>
);
