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

/** Visible durante las partes k..k2 (entra 0.1 s tras el inicio, sale 0.4 s antes del siguiente). */
const seg = (t: number, c: number[], k: number, k2 = k): number => vis(t, c[k] + 0.1, c[k2 + 1] === undefined ? 1e6 : c[k2 + 1] - 0.4);

const SvgFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    {children}
  </svg>
);

const G: React.FC<{ x: number; y: number; s?: number; o?: number; rot?: number; children: React.ReactNode }> = ({ x, y, s = 1, o = 1, rot = 0, children }) =>
  o > 0 ? (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
      {children}
    </g>
  ) : null;

const Txt: React.FC<{ x: number; y: number; size: number; children: React.ReactNode; fill?: string; serif?: boolean; weight?: number; italic?: boolean; spacing?: number }> = ({
  x,
  y,
  size,
  children,
  fill = ink,
  serif = false,
  weight = 800,
  italic = false,
  spacing = 0,
}) => (
  <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontFamily={serif ? SERIF : theme.font} fontWeight={weight} fontSize={size} fontStyle={italic ? "italic" : "normal"} letterSpacing={spacing} fill={fill}>
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

// ---------------------------------------------------------------- codigo de barras generico (codificacion UPC-A de ejemplo 0 12345 67890 5)
const L = ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"];
const flip = (s: string): string => s.replace(/[01]/g, (b) => (b === "1" ? "0" : "1"));
const DIG = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 5];
const BITS = "101" + DIG.slice(0, 6).map((d) => L[d]).join("") + "01010" + DIG.slice(6).map((d) => flip(L[d])).join("") + "101";
const isGuard = (i: number): boolean => i < 3 || (i >= 45 && i < 50) || i >= 92;
const RUNS: [number, number][] = (() => {
  const r: [number, number][] = [];
  let i = 0;
  while (i < 95) {
    if (BITS[i] === "1") {
      let j = i;
      while (j < 95 && BITS[j] === "1") j++;
      r.push([i, j - i]);
      i = j;
    } else i++;
  }
  return r;
})();

const Barcode: React.FC<{ x: number; y: number; w: number; h: number; reveal?: number; color?: string; nums?: number; guard?: number }> = ({
  x,
  y,
  w,
  h,
  reveal = 1,
  color = ink,
  nums = 0,
  guard = 0,
}) => {
  const m = w / 95;
  const lim = reveal * w;
  const bars = RUNS.filter(([s]) => s * m < lim).map(([s, n]) => ({ s, wd: Math.min(n * m, lim - s * m), g: isGuard(s) }));
  const fs = Math.max(14, h * 0.2);
  const digit = (d: number, mod: number) => (
    <text key={mod} x={x + mod * m} y={y + h + fs * 0.95} textAnchor="middle" fontFamily={theme.font} fontWeight={700} fontSize={fs} fill={ink} opacity={nums}>
      {d}
    </text>
  );
  return (
    <g>
      {bars.map((b) => (
        <rect key={b.s} x={x + b.s * m} y={y} width={b.wd} height={b.g ? h + fs * 0.45 : h} fill={color} />
      ))}
      {guard > 0 &&
        bars
          .filter((b) => b.g)
          .map((b) => <rect key={`g${b.s}`} x={x + b.s * m} y={y} width={b.wd} height={h + fs * 0.45} fill={orange} opacity={guard} />)}
      {nums > 0 && (
        <>
          {digit(DIG[0], -6)}
          {DIG.slice(1, 6).map((d, i) => digit(d, 10 + i * 7))}
          {DIG.slice(6, 11).map((d, i) => digit(d, 54 + i * 7))}
          {digit(DIG[11], 101)}
        </>
      )}
    </g>
  );
};

// ---------------------------------------------------------------- objetos genericos
type Kind = "can" | "gum" | "charger" | "box" | "bottle";

const Patch: React.FC<{ x: number; y: number; w: number; h: number; bars?: number; hl?: number; t?: number }> = ({ x, y, w, h, bars = 1, hl = 0, t = 0 }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={3} fill="#fff" stroke={panelLine} strokeWidth={2} />
    <Barcode x={x + 7} y={y + 5} w={w - 14} h={h - 10} reveal={bars} />
    {hl > 0 && <rect x={x - 8} y={y - 8} width={w + 16} height={h + 16} rx={8} fill="none" stroke={orange} strokeWidth={6} opacity={hl * (0.75 + 0.25 * Math.sin(t * 6))} />}
  </g>
);

const Thing: React.FC<{ k: Kind; x: number; y: number; s?: number; o?: number; hl?: number; bars?: number; rot?: number; t?: number }> = ({ k, x, y, s = 1, o = 1, hl = 0, bars = 1, rot = 0, t = 0 }) => (
  <G x={x} y={y} s={s} o={o} rot={rot}>
    {k === "can" && (
      <>
        <rect x={-70} y={-90} width={140} height={180} rx={14} fill="#fff" stroke={ink} strokeWidth={5} />
        <rect x={-67} y={-44} width={134} height={62} fill={teal} />
        <ellipse cx={0} cy={-90} rx={70} ry={13} fill="#E3E8EE" stroke={ink} strokeWidth={5} />
        <Txt x={0} y={-12} size={36} fill="#fff" spacing={4}>
          SOUP
        </Txt>
        <Patch x={-46} y={30} w={92} h={50} bars={bars} hl={hl} t={t} />
      </>
    )}
    {k === "gum" && (
      <>
        <rect x={-120} y={-56} width={240} height={112} rx={12} fill="#8FD0CD" stroke={ink} strokeWidth={5} />
        <polygon points="-120,-20 -30,-56 20,-56 -120,24" fill="#fff" opacity={0.5} />
        <Txt x={-46} y={-4} size={40} fill={ink} serif spacing={3}>
          GUM
        </Txt>
        <Patch x={26} y={-10} w={84} h={52} bars={bars} hl={hl} t={t} />
      </>
    )}
    {k === "charger" && (
      <>
        <rect x={-24} y={-104} width={12} height={34} fill={ink} />
        <rect x={12} y={-104} width={12} height={34} fill={ink} />
        <rect x={-58} y={-76} width={116} height={106} rx={18} fill="#fff" stroke={ink} strokeWidth={5} />
        <path d="M0 30 V60 Q0 90 30 90" fill="none" stroke={ink} strokeWidth={9} strokeLinecap="round" />
        <Patch x={-40} y={-56} w={80} h={56} bars={bars} hl={hl} t={t} />
      </>
    )}
    {k === "box" && (
      <>
        <rect x={-66} y={-96} width={132} height={192} rx={8} fill={WARM} stroke={ink} strokeWidth={5} />
        <rect x={-63} y={-70} width={126} height={44} fill={orange} />
        <Patch x={-46} y={30} w={92} h={50} bars={bars} hl={hl} t={t} />
      </>
    )}
    {k === "bottle" && (
      <>
        <rect x={-24} y={-124} width={48} height={18} rx={4} fill={ink} />
        <path d="M-20 -106 H20 V-62 Q54 -50 54 -14 V80 Q54 96 38 96 H-38 Q-54 96 -54 80 V-14 Q-54 -50 -20 -62 Z" fill={SOFT} stroke={ink} strokeWidth={5} />
        <Patch x={-40} y={20} w={80} h={50} bars={bars} hl={hl} t={t} />
      </>
    )}
  </G>
);

const KINDS: Kind[] = ["can", "gum", "charger", "box", "bottle"];

// ---------------------------------------------------------------- personas y objetos de escena
const Person: React.FC<{ x: number; y: number; s?: number; body?: string; tie?: boolean; cap?: string; o?: number; skin?: string }> = ({ x, y, s = 1, body = ink, tie = false, cap, o = 1, skin = "#F1D5B0" }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-52 0 V-30 Q-52 -64 -20 -64 H20 Q52 -64 52 -30 V0 Z" fill={body} stroke={ink} strokeWidth={4} />
    <rect x={-10} y={-80} width={20} height={20} fill={skin} stroke={ink} strokeWidth={3} />
    <circle cx={0} cy={-102} r={30} fill={skin} stroke={ink} strokeWidth={4} />
    {tie && <polygon points="0,-62 -9,-42 0,-8 9,-42" fill={orange} />}
    {cap && <path d="M-32 -110 Q0 -146 32 -110 Z" fill={cap} stroke={ink} strokeWidth={4} />}
  </G>
);

const Counter: React.FC<{ x0?: number; x1?: number; y?: number }> = ({ x0 = 260, x1 = 1560, y = 620 }) => (
  <>
    <rect x={x0} y={y} width={x1 - x0} height={18} fill={ink} />
    <rect x={x0 + 20} y={y + 18} width={x1 - x0 - 40} height={120} fill="#fff" stroke={panelLine} strokeWidth={4} />
  </>
);

const Register: React.FC<{ x: number; y: number; s?: number; o?: number; digits?: string; key1?: number }> = ({ x, y, s = 1, o = 1, digits = "0.00", key1 = 0 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-110} y={-130} width={220} height={130} rx={14} fill="#fff" stroke={ink} strokeWidth={5} />
    <rect x={-90} y={-170} width={180} height={50} rx={8} fill={ink} />
    <Txt x={0} y={-145} size={32} fill="#9BE3D6" weight={700}>
      {digits}
    </Txt>
    {Array.from({ length: 9 }, (_, i) => (
      <rect key={i} x={-84 + (i % 3) * 58} y={-104 + Math.floor(i / 3) * 32} width={46} height={22} rx={5} fill={i === key1 % 9 ? orange : SOFT} stroke={ink} strokeWidth={2.5} />
    ))}
  </G>
);

const Tag: React.FC<{ x: number; y: number; text: string; o?: number; rot?: number; color?: string }> = ({ x, y, text, o = 1, rot = 0, color = orange }) => (
  <G x={x} y={y} o={o} rot={rot}>
    <path d="M-48 -22 H30 L52 0 L30 22 H-48 Z" fill="#fff" stroke={color} strokeWidth={5} strokeLinejoin="round" />
    <circle cx={34} cy={0} r={5} fill={color} />
    <Txt x={-8} y={1} size={28} fill={ink} weight={800}>
      {text}
    </Txt>
  </G>
);

const Clock: React.FC<{ x: number; y: number; r?: number; angle: number; o?: number }> = ({ x, y, r = 40, angle, o = 1 }) => (
  <G x={x} y={y} o={o}>
    <circle r={r} fill="#fff" stroke={ink} strokeWidth={5} />
    {Array.from({ length: 12 }, (_, i) => (
      <line key={i} x1={0} y1={-r + 5} x2={0} y2={-r + (i % 3 === 0 ? 14 : 10)} stroke={ink} strokeWidth={3} transform={`rotate(${i * 30})`} />
    ))}
    <line x1={0} y1={0} x2={0} y2={-r * 0.72} stroke={orange} strokeWidth={5} strokeLinecap="round" transform={`rotate(${angle})`} />
    <line x1={0} y1={0} x2={0} y2={-r * 0.45} stroke={ink} strokeWidth={5} strokeLinecap="round" transform={`rotate(${angle / 12})`} />
  </G>
);

/** Diana (bull's-eye) de anillos; no es el dibujo de la patente. */
const Target: React.FC<{ x: number; y: number; r: number; o?: number; rot?: number; smear?: number }> = ({ x, y, r, o = 1, rot = 0, smear = 0 }) => {
  const rings = [[1, 0.2], [0.76, 0.12], [0.55, 0.16], [0.34, 0.1], [0.16, 0.16]] as const;
  const draw = (dx: number, op: number) => (
    <g transform={`translate(${dx} 0)`} opacity={op}>
      {rings.map(([k, w], i) => (
        <circle key={i} r={r * k - (r * w) / 2} fill="none" stroke={ink} strokeWidth={r * w * 0.55} />
      ))}
    </g>
  );
  return (
    <G x={x} y={y} o={o} rot={rot}>
      <circle r={r} fill="#fff" />
      {smear > 0 && [18, 12, 6].map((d, i) => <React.Fragment key={i}>{draw(d * smear, 0.28)}</React.Fragment>)}
      {draw(0, 1)}
    </G>
  );
};

const Gap: React.FC<{ x: number; y: number; text: string; o: number }> = ({ x, y, text, o }) => <Note text={text} x={x} y={y} o={o} size={26} />;
const SimpleNote: React.FC<{ o: number }> = ({ o }) => <Note text={SIMPLIFIED_NOTE} x={960} y={776} o={0.6 * o} size={24} />;

const Bubble: React.FC<{ x: number; y: number; text: string; o: number; r?: number }> = ({ x, y, text, o, r = 36 }) => (
  <G x={x} y={y} o={o} s={0.9 + 0.1 * o}>
    <circle r={r} fill="#fff" stroke={ink} strokeWidth={4} />
    <Txt x={0} y={2} size={r * 1.15} fill={orange}>
      {text}
    </Txt>
  </G>
);

const Ground: React.FC<{ y: number; o?: number }> = ({ y, o = 1 }) => <rect x={0} y={y} width={W} height={H - y} fill={SAND} opacity={o} />;

// ---------------------------------------------------------------- 1: gancho
export const SceneGumHook: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const mv = ramp(t, c[2] + 0.2, c[2] + 1.2);
  const pack = { x: lerp(960, 1400, mv), y: lerp(430, 470, mv), s: lerp(1.9, 1.15, mv) };
  const sweep = (t * 0.55) % 1;
  const beam = seg(t, c, 0, 1);
  const originals = 1 - ramp(t, c[3] + 0.1, c[3] + 0.8);
  const hl = ramp(t, c[2] + 0.8, c[2] + 1.6) * originals;
  const grid = Array.from({ length: 18 }, (_, i) => ({ i, x: 300 + (i % 6) * 264, y: 250 + Math.floor(i / 6) * 220, k: KINDS[i % 5] })).filter((g) => g.i < 7 || g.i > 10);
  const gridO = ramp(t, c[3] + 0.1, c[3] + 1.2) * (1 - ramp(t, c[4] - 0.3, c[4] + 0.3));
  const why = ramp(t, c[3] + 0.5, c[3] + 1.2) * (1 - ramp(t, c[4] - 0.3, c[4] + 0.3));
  const sand = ramp(t, c[4] - 0.2, c[4] + 0.8);
  const title = ramp(t, c[4] + 0.6, c[4] + 1.6);
  const line = ramp(t, c[4] + 1.4, c[4] + 4.0);
  return (
    <>
      <SvgFrame>
        <Ground y={640} o={sand} />
        <path d="M0 640 Q480 612 960 640 T1920 630" fill="none" stroke="#C9B58A" strokeWidth={5} opacity={sand} />
        <Thing k="can" x={520} y={430} o={ramp(t, c[2] + 0.4, c[2] + 1.2) * originals} hl={hl} t={t} />
        <Thing k="charger" x={960} y={440} o={ramp(t, c[2] + 0.6, c[2] + 1.4) * originals} hl={hl} t={t} />
        <Thing k="gum" x={pack.x} y={pack.y} s={pack.s} o={originals} hl={hl} t={t} />
        {beam > 0 && (
          <g opacity={beam}>
            <rect x={960 - 230 + 460 * sweep - 14} y={290} width={28} height={280} fill={orange} opacity={0.18} />
            <line x1={960 - 230 + 460 * sweep} y1={290} x2={960 - 230 + 460 * sweep} y2={570} stroke={orange} strokeWidth={5} />
          </g>
        )}
        {grid.map((g) => (
          <Thing key={g.i} k={g.k} x={g.x} y={g.y} s={0.62} o={gridO * ramp(t, c[3] + 0.1 + g.i * 0.05, c[3] + 0.6 + g.i * 0.05) * 0.55} />
        ))}
        {why > 0 && (
          <g opacity={why}>
            <rect x={380} y={230} width={1160} height={330} rx={40} fill={bg} fillOpacity={0.9} />
            <text x={960} y={400} textAnchor="middle" dominantBaseline="central" fontFamily={SERIF} fontWeight={700} fontSize={270} fill={ink}>
              WHY<tspan fill={orange}>?</tspan>
            </text>
          </g>
        )}
        {line > 0 && <path d="M520 760 Q700 700 880 760 T1240 750 T1500 770" fill="none" stroke="#B89A5E" strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - line} />}
      </SvgFrame>
      <Chip text="FIRST EVER SCANNED" x={960} y={50} o={vis(t, 0.5, c[1] - 0.2)} />
      <Chip text="A RUMOUR" x={960} y={50} o={seg(t, c, 1)} color={orange} />
      {seg(t, c, 1) > 0 && (
        <div style={{ position: "absolute", left: 0, top: 130, width: W, textAlign: "center", opacity: seg(t, c, 1), fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 120, color: orange, letterSpacing: 10 }}>
          ? 666 ?
        </div>
      )}
      <Chip text="THE SAME STRIPES" x={960} y={50} o={seg(t, c, 2)} />
      {title > 0 && (
        <div style={{ position: "absolute", left: 0, top: 230, width: W, textAlign: "center", opacity: title, fontFamily: theme.font }}>
          <div style={{ fontWeight: 900, fontSize: 92, letterSpacing: 8, color: ink }}>THE EVERYDAY MYSTERY</div>
          <div style={{ width: 360, height: 6, background: orange, margin: "22px auto" }} />
          <div style={{ fontWeight: 700, fontSize: 38, color: teal }}>EM-003 · Why Is There a Barcode on Everything?</div>
        </div>
      )}
    </>
  );
};

// ---------------------------------------------------------------- 2: la tienda
export const SceneGrocery: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const shop = seg(t, c, 0);
  const desk = seg(t, c, 1);
  const boss = seg(t, c, 2);
  const duo = seg(t, c, 3);
  const key = Math.floor(t * 4);
  const dig = ["0.12", "0.47", "0.55", "1.02"][Math.floor(t * 1.5) % 4];
  return (
    <>
      <SvgFrame>
        <G x={0} y={50} o={shop}>
          <rect x={560} y={210} width={800} height={500} fill="#EFE8D6" stroke={ink} strokeWidth={5} />
          <rect x={700} y={110} width={520} height={80} rx={10} fill="#fff" stroke={ink} strokeWidth={5} />
          <Txt x={960} y={150} size={46} serif fill={ink} spacing={8}>
            GROCERY
          </Txt>
          {Array.from({ length: 10 }, (_, i) => (
            <path key={i} d={`M${540 + i * 84} 210 h84 v60 a42 42 0 0 1 -84 0 Z`} fill={i % 2 ? "#fff" : teal} stroke={ink} strokeWidth={4} />
          ))}
          <rect x={620} y={380} width={250} height={230} fill={SOFT} stroke={ink} strokeWidth={5} />
          <rect x={1050} y={380} width={250} height={230} fill={SOFT} stroke={ink} strokeWidth={5} />
          <rect x={870} y={400} width={180} height={310} fill="#fff" stroke={ink} strokeWidth={5} />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={680 + i * 70} cy={580} r={26} fill={i === 1 ? orange : "#E8B56B"} stroke={ink} strokeWidth={3} />
          ))}
          {[0, 1, 2].map((i) => (
            <rect key={i} x={1080 + i * 70} y={540} width={50} height={70} rx={6} fill={i === 1 ? teal : WARM} stroke={ink} strokeWidth={3} />
          ))}
        </G>
        <G x={0} y={0} o={desk}>
          <Counter />
          <Register x={1000} y={620} digits={dig} key1={key} />
          <Person x={1300} y={620} body={teal} cap="#fff" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <Thing k={KINDS[[0, 3, 4][i]]} x={420 + i * 150} y={560} s={0.46} bars={0} />
              <Tag x={420 + i * 150} y={420} text={["12", "35", "8"][i]} />
            </g>
          ))}
        </G>
        <Person x={420} y={680} body={ink} tie o={boss} s={1.5} />
        <G x={760} y={300} o={boss}>
          <circle cx={-250} cy={250} r={14} fill="#fff" stroke={ink} strokeWidth={4} />
          <circle cx={-205} cy={210} r={22} fill="#fff" stroke={ink} strokeWidth={4} />
          <ellipse cx={0} cy={0} rx={260} ry={150} fill="#fff" stroke={ink} strokeWidth={5} />
          <rect x={-190} y={-20} width={150} height={90} rx={10} fill={SOFT} stroke={ink} strokeWidth={4} />
          <rect x={-170} y={-4} width={110} height={10} fill={orange} />
          <Thing k="can" x={-110} y={-70} s={0.4} bars={0} />
          <path d="M-20 25 H60" stroke={teal} strokeWidth={6} strokeLinecap="round" markerEnd="" />
          <polygon points="60,10 90,25 60,40" fill={teal} />
          <Txt x={150} y={10} size={140} fill={orange} serif>
            ?
          </Txt>
        </G>
        <Person x={500} y={600} o={duo} s={1.5} body={teal} />
        <Person x={1000} y={600} o={duo} s={1.5} body={ink} tie />
        <G x={1500} y={400} o={duo}>
          <rect x={-150} y={-110} width={300} height={220} rx={24} fill="#fff" stroke={ink} strokeWidth={5} />
          <path d="M-110 70 Q-50 30 -10 40 T80 -30 T120 -60" fill="none" stroke={panelLine} strokeWidth={8} strokeLinecap="round" />
          <circle cx={30} cy={0} r={14} fill={orange} stroke={ink} strokeWidth={4} />
        </G>
      </SvgFrame>
      <Chip text="THE 1940S" x={960} y={50} o={seg(t, c, 0)} />
      <Chip text="EVERY PRICE, BY HAND" x={960} y={50} o={seg(t, c, 1)} />
      <Chip text="ACCORDING TO THE STORY" x={960} y={50} o={seg(t, c, 2)} color={orange} />
      <Note text="a grocery boss, wishing..." x={760} y={650} o={seg(t, c, 2)} />
      <Chip text="Bernard Silver" x={500} y={650} o={vis(t, c[3] + 0.8)} />
      <Chip text="Norman Joseph Woodland" x={1040} y={650} o={vis(t, c[3] + 1.6)} />
      <Note text="Philadelphia · Drexel" x={1500} y={540} o={vis(t, c[3] + 0.3)} />
    </>
  );
};

// ---------------------------------------------------------------- 3: la arena
const MORSE = [1, 0, 1, 0, 0, 1, 1, 0, 1, 0]; // 1 = raya (larga), 0 = punto (corta)
const BARX = (i: number): number => 560 + i * 90;

export const SceneSand: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const ink1 = seg(t, c, 0);
  const beach = ramp(t, c[1] - 0.2, c[1] + 0.6) * (1 - ramp(t, c[3] - 0.2, c[3] + 0.4));
  const fadeInk = 1 - 0.85 * ramp(t, c[0] + 1.5, c[0] + 4.0);
  const m = ramp(t, c[1] + 4.2, c[1] + 6.2);
  const morse = ramp(t, c[1] + 1.2, c[1] + 2.0) * (1 - m);
  const barsO = ramp(t, c[1] + 4.2, c[1] + 4.6) * (1 - ramp(t, c[2] + 0.5, c[2] + 1.5));
  const tgt = ramp(t, c[2] + 0.6, c[2] + 1.8) * (1 - ramp(t, c[3] - 0.4, c[3] + 0.3));
  const rot = (t - c[2]) * 8;
  const doc = seg(t, c, 3);
  const finger = ramp(t, c[1] + 4.0, c[1] + 4.4) * (1 - ramp(t, c[1] + 6.4, c[1] + 6.9));
  return (
    <>
      <SvgFrame>
        <G x={0} y={0} o={ink1}>
          <rect x={620} y={350} width={180} height={200} rx={26} fill={ink} stroke={ink} strokeWidth={5} />
          <rect x={680} y={310} width={60} height={50} fill="#E3E8EE" stroke={ink} strokeWidth={5} />
          <rect x={660} y={290} width={100} height={30} rx={8} fill={orange} />
          <rect x={635} y={410} width={150} height={70} rx={8} fill="#fff" />
          <Txt x={710} y={445} size={21} fill={ink}>
            special ink
          </Txt>
          <rect x={980} y={330} width={330} height={230} rx={14} fill="#fff" stroke={ink} strokeWidth={5} />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={1015 + i * 58} y={360} width={26 - (i % 2) * 8} height={170} fill={teal} opacity={fadeInk} />
          ))}
          <circle cx={1550} cy={430} r={80} fill={WARM} stroke={orange} strokeWidth={8} />
          <Txt x={1550} y={432} size={80} fill={orange}>
            $
          </Txt>
          <polygon points="1550,290 1500,350 1530,350 1530,380 1570,380 1570,350 1600,350" fill={orange} />
        </G>
        <G x={0} y={0} o={beach}>
          <rect x={0} y={260} width={W} height={130} fill={SOFT} />
          <path d="M0 330 Q120 300 240 330 T480 330 T720 330 T960 330 T1200 330 T1440 330 T1680 330 T1920 330" fill="none" stroke={teal} strokeWidth={5} opacity={0.5} />
          <rect x={0} y={390} width={W} height={H - 390} fill={SAND} />
          <g opacity={morse}>
            {MORSE.map((d, i) => (d ? <rect key={i} x={BARX(i) - 30} y={487} width={60} height={20} rx={10} fill={ink} /> : <circle key={i} cx={BARX(i)} cy={497} r={12} fill={ink} />))}
          </g>
          <g opacity={barsO}>
            {MORSE.map((d, i) => (
              <rect key={i} x={BARX(i) - 9} y={440} width={18} height={(d ? 280 : 130) * Math.max(m, 0.001)} rx={4} fill={ink} opacity={0.85} />
            ))}
          </g>
          <G x={lerp(BARX(0), BARX(9), m) + 40} y={440 + 130 * m} o={finger} rot={-20}>
            <rect x={-18} y={-150} width={36} height={170} rx={18} fill="#F1D5B0" stroke={ink} strokeWidth={4} />
          </G>
        </G>
        <G x={0} y={0} o={tgt}>
          <Target x={960} y={500} r={230} rot={rot} />
          {[-75, 20, 160, 235].map((a) => {
            const px = 960 + 330 * Math.cos((a * Math.PI) / 180);
            const py = 500 + 330 * Math.sin((a * Math.PI) / 180);
            const qx = 960 + 255 * Math.cos((a * Math.PI) / 180);
            const qy = 500 + 255 * Math.sin((a * Math.PI) / 180);
            return <line key={a} x1={px} y1={py} x2={qx} y2={qy} stroke={orange} strokeWidth={9} strokeLinecap="round" />;
          })}
        </G>
        <G x={0} y={0} o={doc}>
          <rect x={420} y={150} width={520} height={600} rx={12} fill="#fff" stroke={ink} strokeWidth={5} />
          <rect x={420} y={150} width={520} height={80} fill={ink} />
          <Txt x={680} y={190} size={36} fill="#fff" spacing={8}>
            PATENT
          </Txt>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={460} y={270 + i * 34} width={i === 3 ? 260 : 440} height={12} rx={6} fill={panelLine} />
          ))}
          <Target x={680} y={560} r={110} />
          <Stamp x={880} y={690} text="GRANTED" rot={-14} o={vis(t, c[3] + 4.5)} size={34} />
          <Txt x={1230} y={300} size={110} serif fill={ink}>
            1949
          </Txt>
          <path d="M1230 430 V520" stroke={teal} strokeWidth={8} strokeLinecap="round" opacity={vis(t, c[3] + 2.5)} />
          <polygon points="1210,520 1250,520 1230,556" fill={teal} opacity={vis(t, c[3] + 2.5)} />
          <g opacity={vis(t, c[3] + 3.5)}>
            <Txt x={1230} y={630} size={110} serif fill={orange}>
              1952
            </Txt>
          </g>
        </G>
      </SvgFrame>
      <Chip text="TOO FAINT. TOO COSTLY." x={960} y={50} o={seg(t, c, 0)} color={orange} />
      <Chip text="MIAMI BEACH, 1949" x={960} y={50} o={seg(t, c, 1)} />
      <Chip text="MORSE CODE" x={960} y={620} o={vis(t, c[1] + 1.4, c[1] + 4.0)} />
      <Chip text="READ FROM ANY ANGLE" x={960} y={50} o={seg(t, c, 2)} />
      <Chip text="PATENT, 1949 TO 1952" x={960} y={50} o={seg(t, c, 3)} />
      <Gap x={1145} y={600} text="faded" o={vis(t, c[0] + 2.0, c[1] - 0.4)} />
      <Note text="filed" x={1230} y={350} o={vis(t, c[3] + 1.0)} size={40} />
      <Note text="granted" x={1230} y={710} o={vis(t, c[3] + 4.0)} size={40} />
      <SimpleNote o={Math.max(tgt, doc)} />
    </>
  );
};

// ---------------------------------------------------------------- 4: el mundo no estaba listo
export const SceneNotReady: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const a = seg(t, c, 0);
  const b = seg(t, c, 1);
  const flip = (i: number) => ramp(t, c[1] + 0.6 + i * 1.3, c[1] + 1.4 + i * 1.3);
  const prog = ramp(t, c[1] + 1.0, c[1] + 7.0);
  return (
    <>
      <SvgFrame>
        <G x={0} y={0} o={a}>
          <Target x={500} y={290} r={110} />
          <rect x={250} y={380} width={500} height={320} fill="#fff" stroke={ink} strokeWidth={5} />
          <rect x={275} y={410} width={450} height={120} rx={6} fill={SOFT} stroke={ink} strokeWidth={5} />
          <rect x={440} y={455} width={120} height={20} rx={10} fill={ink} />
          <rect x={470} y={560} width={60} height={50} rx={8} fill={orange} stroke={ink} strokeWidth={4} />
          <path d="M480 560 V540 a20 20 0 0 1 40 0 V560" fill="none" stroke={ink} strokeWidth={8} />
          <rect x={1000} y={420} width={260} height={150} rx={14} fill="#fff" stroke={ink} strokeWidth={5} />
          <rect x={1030} y={470} width={200} height={14} rx={7} fill={ink} />
          <rect x={1370} y={340} width={290} height={190} rx={14} fill="#fff" stroke={ink} strokeWidth={5} />
          <rect x={1390} y={360} width={250} height={150} fill={SOFT} stroke={ink} strokeWidth={3} />
          <rect x={1490} y={530} width={50} height={50} fill={ink} />
          <rect x={1440} y={580} width={150} height={20} rx={8} fill={ink} />
          {[1130, 1515].map((x, i) => (
            <g key={x} opacity={vis(t, c[0] + 4.5 + i * 0.8)} stroke={orange} strokeWidth={14} strokeLinecap="round">
              <line x1={x - 40} y1={i ? 400 : 470} x2={x + 40} y2={(i ? 400 : 470) + 80} />
              <line x1={x + 40} y1={i ? 400 : 470} x2={x - 40} y2={(i ? 400 : 470) + 80} />
            </g>
          ))}
        </G>
        <G x={0} y={0} o={b}>
          <rect x={650} y={200} width={620} height={360} rx={24} fill="#fff" stroke={ink} strokeWidth={5} />
          <rect x={650} y={200} width={620} height={80} rx={24} fill={teal} />
          <rect x={650} y={250} width={620} height={30} fill={teal} />
          <Txt x={960} y={242} size={52} serif fill="#fff" spacing={6}>
            1949
          </Txt>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(650 ${280}) scale(1 ${1 - flip(i)})`} opacity={1 - flip(i) * 0.6}>
              <rect x={0} y={0} width={620} height={280} fill="#fff" stroke={panelLine} strokeWidth={3} />
              <Txt x={310} y={140} size={110} serif fill={ink}>
                {["19", "49", "?"][i]}
              </Txt>
            </g>
          ))}
          <line x1={300} y1={680} x2={1620} y2={680} stroke={ink} strokeWidth={6} />
          <circle cx={300} cy={680} r={14} fill={ink} />
          <Txt x={300} y={730} size={34} fill={ink}>
            1949
          </Txt>
          <circle cx={lerp(300, 1500, prog)} cy={680} r={18} fill={orange} />
          <Txt x={1640} y={680} size={90} fill={orange} serif>
            ?
          </Txt>
        </G>
      </SvgFrame>
      <Chip text="NOT YET" x={960} y={50} o={seg(t, c, 0)} color={orange} />
      <Note text="reading machine" x={1130} y={600} o={vis(t, c[0] + 3.0, c[1] - 0.4)} />
      <Note text="computer" x={1515} y={620} o={vis(t, c[0] + 3.4, c[1] - 0.4)} />
      <Note text="the idea goes in a drawer" x={500} y={730} o={vis(t, c[0] + 1.0, c[1] - 0.4)} />
      <Chip text="IT HAD TO WAIT" x={960} y={50} o={seg(t, c, 1)} />
      <SimpleNote o={a} />
    </>
  );
};

// ---------------------------------------------------------------- 5: ponerse de acuerdo
export const SceneStandard: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const s1 = seg(t, c, 0);
  const s2 = seg(t, c, 1);
  const s3 = seg(t, c, 2);
  const s4 = seg(t, c, 3);
  const s5 = seg(t, c, 4);
  const phase2 = ramp(t, c[1] + 4.2, c[1] + 5.0);
  const spin = (t * 40) % 360;
  return (
    <>
      <SvgFrame>
        <G x={0} y={0} o={s1}>
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <Clock x={400 + i * 370} y={250} angle={(t * 180 + i * 70) % 360} />
              <rect x={400 + i * 370 - 130} y={520} width={260} height={18} fill={ink} />
              <rect x={400 + i * 370 - 110} y={538} width={220} height={110} fill="#fff" stroke={panelLine} strokeWidth={4} />
              <Register x={400 + i * 370 - 40} y={520} s={0.7} key1={Math.floor(t * 3) + i} digits="0.00" />
              <Person x={400 + i * 370 + 70} y={520} s={0.9} body={i % 2 ? teal : ink} />
            </g>
          ))}
          <G x={960} y={730} o={vis(t, c[0] + 3.8)}>
            <circle r={26} fill={WARM} stroke={orange} strokeWidth={6} />
            <Txt x={0} y={2} size={30} fill={orange}>
              $
            </Txt>
          </G>
        </G>
        <G x={0} y={0} o={s2}>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <Thing k={(["can", "box", "bottle"] as Kind[])[i]} x={560 + i * 400} y={340} s={1.1} bars={0} />
              <g opacity={1 - phase2}>
                <Tag x={560 + i * 400} y={580} text={["A-17", "923", "X5"][i]} />
              </g>
              <g opacity={phase2}>
                <Barcode x={560 + i * 400 - 70} y={540} w={140} h={60} />
              </g>
            </g>
          ))}
          <g opacity={1 - phase2}>
            <Txt x={760} y={340} size={110} fill={orange}>
              ≠
            </Txt>
            <Txt x={1160} y={340} size={110} fill={orange}>
              ≠
            </Txt>
          </g>
          <G x={960} y={720} o={phase2} s={0.8 + 0.2 * phase2}>
            <path d="M-60 0 L-20 44 L64 -50" fill="none" stroke={teal} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        </G>
        <G x={0} y={0} o={s3}>
          <ellipse cx={960} cy={600} rx={470} ry={110} fill="#fff" stroke={ink} strokeWidth={5} />
          {[600, 780, 960, 1140, 1320].map((x, i) => (
            <Person key={x} x={x} y={500} s={1.05} body={[ink, teal, orange, ink, teal][i]} tie={i % 2 === 0} />
          ))}
          <rect x={880} y={560} width={80} height={50} fill={bg} stroke={ink} strokeWidth={3} transform="rotate(-6 920 585)" />
          <rect x={1010} y={575} width={80} height={50} fill={bg} stroke={ink} strokeWidth={3} transform="rotate(8 1050 600)" />
        </G>
        <G x={0} y={0} o={s4}>
          <circle cx={560} cy={420} r={200} fill={WARM} stroke={ink} strokeWidth={5} />
          <circle cx={1360} cy={420} r={200} fill={SOFT} stroke={ink} strokeWidth={5} />
          <Txt x={560} y={390} size={48} fill={ink} spacing={4}>
            MAKERS
          </Txt>
          <Txt x={560} y={460} size={48} fill={orange} weight={700}>
            not yet
          </Txt>
          <Txt x={1360} y={390} size={48} fill={ink} spacing={4}>
            SHOPS
          </Txt>
          <Txt x={1360} y={460} size={48} fill={orange} weight={700}>
            worth it?
          </Txt>
          <g transform={`translate(960 420) rotate(${spin})`}>
            <path d="M-100 0 A100 100 0 0 1 90 -45" fill="none" stroke={teal} strokeWidth={14} strokeLinecap="round" />
            <polygon points="70,-80 124,-34 64,-16" fill={teal} />
            <path d="M100 0 A100 100 0 0 1 -90 45" fill="none" stroke={orange} strokeWidth={14} strokeLinecap="round" />
            <polygon points="-70,80 -124,34 -64,16" fill={orange} />
          </g>
        </G>
        <G x={0} y={0} o={s5}>
          {[0, 1, 2].map((i) => {
            const on = vis(t, c[4] + 0.6 + i * 1.2);
            return (
              <G key={i} x={480 + i * 480} y={400} o={on} s={0.9 + 0.1 * on}>
                <rect x={-170} y={-190} width={340} height={380} rx={24} fill="#fff" stroke={i === 2 ? orange : ink} strokeWidth={5} />
                {i === 0 && Array.from({ length: 5 }, (_, k) => <rect key={k} x={-110 + k * 44} y={-130} width={22} height={170} fill={ink} opacity={0.5} transform={`rotate(${k * 6 - 12} ${-99 + k * 44} -45)`} />)}
                {i === 1 && Array.from({ length: 4 }, (_, k) => Array.from({ length: 4 }, (_, j) => <rect key={`${k}${j}`} x={-90 + k * 50} y={-120 + j * 42} width={34} height={28} fill={(k + j) % 2 ? ink : panelLine} />))}
                {i === 2 && <Target x={0} y={-45} r={105} />}
                <Txt x={0} y={135} size={34} fill={i === 2 ? orange : ink} spacing={3}>
                  {["COMPANY A", "COMPANY B", "RCA TARGET"][i]}
                </Txt>
              </G>
            );
          })}
        </G>
      </SvgFrame>
      <Chip text="LOTS OF STAFF TIME" x={960} y={50} o={seg(t, c, 0)} />
      <Note text="very little profit on each sale" x={960} y={780} o={vis(t, c[0] + 4.2, c[1] - 0.4)} />
      <Chip text="EVERYONE'S OWN NUMBERS" x={960} y={50} o={vis(t, c[1] + 0.1, c[1] + 4.1)} color={orange} />
      <Chip text="ONE SHARED CODE" x={960} y={50} o={vis(t, c[1] + 4.8, c[2] - 0.4)} />
      <Chip text="1970 · THE COMMITTEE" x={960} y={50} o={seg(t, c, 2)} />
      <Note text="one code for everybody" x={960} y={720} o={vis(t, c[2] + 2.5, c[3] - 0.4)} />
      <Chip text="WHO MOVES FIRST?" x={960} y={50} o={seg(t, c, 3)} color={orange} />
      <Chip text="SEVERAL PITCHES" x={960} y={50} o={seg(t, c, 4)} />
      <SimpleNote o={s5} />
    </>
  );
};

// ---------------------------------------------------------------- 6: el rectangulo
export const SceneRectangle: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const intro = seg(t, c, 0);
  const eng = seg(t, c, 1);
  const cmp = seg(t, c, 2);
  const upc = seg(t, c, 3);
  const win = ramp(t, c[0] + 0.5, c[0] + 2.0);
  const stripe = ramp(t, c[1] + 2.5, c[1] + 6.0);
  return (
    <>
      <SvgFrame>
        <G x={0} y={0} o={intro}>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={380 + i * 480} y={210} width={330} height={330} rx={24} fill="#fff" stroke={panelLine} strokeWidth={4} opacity={1 - win} />
          ))}
          <Target x={1340} y={375} r={100} o={1 - win} />
          <G x={960} y={400} s={0.55 + 0.45 * win} o={win}>
            <rect x={-400} y={-230} width={800} height={460} rx={24} fill="#fff" stroke={orange} strokeWidth={8} />
            <Barcode x={-330} y={-170} w={660} h={290} reveal={win} />
          </G>
        </G>
        <G x={0} y={0} o={eng}>
          <Person x={560} y={650} s={1.7} body={teal} />
          <rect x={900} y={200} width={560} height={420} rx={14} fill="#fff" stroke={ink} strokeWidth={5} />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <line key={i} x1={940} y1={250 + i * 52} x2={1420} y2={250 + i * 52} stroke={panelLine} strokeWidth={2} />
          ))}
          <Barcode x={1010} y={290} w={340} h={180} reveal={stripe} />
          <g transform={`translate(${lerp(1400, 1200, stripe)} ${lerp(280, 470, stripe)}) rotate(-35)`}>
            <rect x={-10} y={-90} width={20} height={80} fill={orange} stroke={ink} strokeWidth={4} />
            <polygon points="-10,-10 10,-10 0,18" fill="#F1D5B0" stroke={ink} strokeWidth={3} />
          </g>
        </G>
        <G x={0} y={0} o={cmp}>
          <Target x={600} y={400} r={170} smear={1} />
          <rect x={1060} y={230} width={500} height={340} rx={14} fill="#fff" stroke={panelLine} strokeWidth={4} />
          <Barcode x={1110} y={270} w={400} h={220} />
        </G>
        <G x={0} y={0} o={upc}>
          <rect x={560} y={150} width={800} height={500} rx={24} fill="#fff" stroke={ink} strokeWidth={5} />
          <Barcode x={640} y={210} w={640} h={290} nums={vis(t, c[3] + 2.5)} />
        </G>
      </SvgFrame>
      <Chip text="THE WINNER" x={960} y={50} o={seg(t, c, 0)} color={orange} />
      <Chip text="George Laurer · IBM" x={560} y={690} o={vis(t, c[1] + 0.4, c[2] - 0.4)} />
      <Chip text="FROM SCRATCH" x={960} y={50} o={seg(t, c, 1)} />
      <Chip text="SMEARS" x={600} y={660} o={vis(t, c[2] + 0.8, c[3] - 0.4)} color={orange} />
      <Chip text="CLEAN" x={1310} y={660} o={vis(t, c[2] + 1.6, c[3] - 0.4)} />
      <Chip text="STRAIGHT BARS PRINT BETTER" x={960} y={50} o={seg(t, c, 2)} />
      <Chip text="UNIVERSAL PRODUCT CODE" x={960} y={688} o={vis(t, c[3] + 1.8)} />
      <SvgFrame>
        <Stamp x={1570} y={260} text="MARCH 1973" rot={-10} o={vis(t, c[3] + 0.6)} size={40} />
      </SvgFrame>
      <SimpleNote o={Math.max(cmp * 0.9, upc)} />
    </>
  );
};

// ---------------------------------------------------------------- 7: el primer escaneo
export const SceneFirstScan: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const shop = seg(t, c, 0);
  const who = seg(t, c, 1);
  const scan = seg(t, c, 2);
  const small = seg(t, c, 3);
  const first = seg(t, c, 4);
  const packX = lerp(560, 1010, ramp(t, c[2] + 0.5, c[2] + 3.0));
  const beep = ramp(t, c[2] + 3.0, c[2] + 3.4) * (1 - ramp(t, c[2] + 4.4, c[2] + 5.0));
  return (
    <>
      <SvgFrame>
        <G x={0} y={0} o={shop}>
          <rect x={440} y={260} width={1040} height={430} fill="#EFE8D6" stroke={ink} strokeWidth={5} />
          <rect x={440} y={200} width={1040} height={70} fill={teal} stroke={ink} strokeWidth={5} />
          <Txt x={960} y={236} size={44} fill="#fff" spacing={14}>
            SUPERMARKET
          </Txt>
          <rect x={520} y={340} width={300} height={260} fill={SOFT} stroke={ink} strokeWidth={5} />
          <rect x={1100} y={340} width={300} height={260} fill={SOFT} stroke={ink} strokeWidth={5} />
          <rect x={850} y={340} width={220} height={350} fill="#fff" stroke={ink} strokeWidth={5} />
          <line x1={960} y1={340} x2={960} y2={690} stroke={ink} strokeWidth={4} />
        </G>
        <G x={0} y={0} o={who}>
          <circle cx={290} cy={210} r={55} fill={GOLD} stroke={ink} strokeWidth={4} />
          <path d="M180 270 A110 110 0 0 1 400 270 Z" fill={WARM} opacity={0} />
          <rect x={150} y={265} width={280} height={14} fill={ink} />
          {[-60, -30, 0, 30, 60].map((a) => (
            <line key={a} x1={290 + 75 * Math.sin((a * Math.PI) / 180)} y1={210 - 75 * Math.cos((a * Math.PI) / 180)} x2={290 + 105 * Math.sin((a * Math.PI) / 180)} y2={210 - 105 * Math.cos((a * Math.PI) / 180)} stroke={GOLD} strokeWidth={6} strokeLinecap="round" />
          ))}
          <Counter x0={700} x1={1560} />
          <Register x={1250} y={620} digits="0.00" />
          <Person x={450} y={690} s={1.5} body={ink} tie />
          <G x={1620} y={420}>
            <path d="M0 0 C-60 -60 -60 -130 0 -130 C60 -130 60 -60 0 0 Z" fill={orange} stroke={ink} strokeWidth={5} />
            <circle cx={0} cy={-90} r={18} fill="#fff" />
          </G>
        </G>
        <G x={0} y={0} o={scan}>
          <Counter x0={260} x1={1660} />
          <rect x={880} y={604} width={260} height={16} rx={6} fill={ink} />
          <rect x={895} y={606} width={230} height={5} fill="#9BE3D6" />
          <line x1={1010} y1={420} x2={1010} y2={605} stroke={orange} strokeWidth={5} opacity={0.8} />
          <Register x={1330} y={620} s={0.9} digits="0.00" />
          <Person x={1500} y={620} body={teal} cap="#fff" />
          <Thing k="gum" x={packX} y={548} s={0.7} bars={1} />
          <G x={1000} y={380} o={beep} s={0.8 + 0.5 * beep}>
            <Txt x={0} y={0} size={120} fill={orange} serif>
              BEEP
            </Txt>
          </G>
        </G>
        <G x={0} y={0} o={small}>
          <Thing k="gum" x={620} y={470} s={0.75} />
          <Thing k="can" x={1250} y={400} s={2} bars={0} />
          <path d="M700 470 H960" stroke={ink} strokeWidth={4} strokeDasharray="12 10" />
          <circle cx={1010} cy={470} r={44} fill="none" stroke={orange} strokeWidth={6} />
          <path d="M1058 470 H1130" stroke={orange} strokeWidth={6} />
        </G>
        <G x={960} y={430} o={first} s={0.9 + 0.1 * first}>
          <rect x={-380} y={-250} width={760} height={470} rx={20} fill="#fff" stroke={GOLD} strokeWidth={14} />
          <rect x={-352} y={-222} width={704} height={414} rx={10} fill="none" stroke={GOLD} strokeWidth={4} />
          <Thing k="gum" x={0} y={-60} s={2.0} />
          <Txt x={0} y={135} size={66} serif fill={ink}>
            June 26, 1974
          </Txt>
        </G>
      </SvgFrame>
      <Chip text="A REAL SHOP TO TRY IT" x={960} y={50} o={seg(t, c, 0)} />
      <Chip text="Troy, Ohio" x={1620} y={440} o={seg(t, c, 1)} />
      <Chip text="Clyde Dawson" x={450} y={730} o={vis(t, c[1] + 1.2, c[2] - 0.4)} />
      <Note text="the morning of June 26, 1974" x={960} y={50} o={seg(t, c, 1)} size={34} />
      <Chip text="Sharon Buchanan" x={1450} y={672} o={vis(t, c[2] + 0.2, c[3] - 0.4)} />
      <Note text="Would it fit?" x={700} y={300} o={seg(t, c, 3)} size={56} />
      <SvgFrame>
        <Stamp x={1560} y={720} text="LEGEND" rot={-9} o={vis(t, c[3] + 1.2, c[4] - 0.4)} />
      </SvgFrame>
      <Chip text="THE FIRST EVER" x={960} y={50} o={seg(t, c, 4)} />
    </>
  );
};

// ---------------------------------------------------------------- 8: el miedo
export const SceneFear: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const a = seg(t, c, 0);
  const b = seg(t, c, 1);
  const d = seg(t, c, 2);
  const e = seg(t, c, 3);
  const f = seg(t, c, 4);
  const g = seg(t, c, 5);
  const gr = vis(t, c[4] + 1.0);
  return (
    <>
      <SvgFrame>
        <G x={0} y={0} o={a}>
          <Counter x0={560} x1={1360} />
          <Register x={960} y={620} />
          {[360, 520, 1400, 1560].map((x, i) => (
            <g key={x}>
              <Person x={x} y={640} s={1.3} body="#9AA4B2" />
              <Bubble x={x + (i < 2 ? 70 : -70)} y={400} text="?" o={ramp(t, c[0] + 0.8 + i * 0.5, c[0] + 1.4 + i * 0.5)} r={44} />
            </g>
          ))}
        </G>
        <G x={0} y={0} o={b}>
          <Counter x0={500} x1={1420} />
          <Register x={960} y={620} s={1.1} />
          <Person x={1260} y={620} s={1.4} body={teal} cap="#fff" />
          <Txt x={1260} y={330} size={190} fill={orange} serif>
            ?
          </Txt>
        </G>
        <G x={0} y={0} o={d}>
          <Tag x={620} y={430} text="49" rot={-8} />
          <Txt x={820} y={420} size={190} fill={orange} serif>
            ?
          </Txt>
          <rect x={1100} y={200} width={420} height={500} rx={16} fill="#fff" stroke={ink} strokeWidth={5} />
          <rect x={1100} y={200} width={420} height={60} fill={teal} />
          {[0, 1, 2, 3].map((i) => (
            <g key={i} opacity={ramp(t, c[2] + 1.8 + i * 0.7, c[2] + 2.3 + i * 0.7)}>
              <rect x={1140} y={300 + i * 90} width={36} height={36} fill="#fff" stroke={ink} strokeWidth={4} />
              <path d={`M1146 ${318 + i * 90} l10 10 l16 -22`} fill="none" stroke={orange} strokeWidth={6} />
              <rect x={1200} y={308 + i * 90} width={250 - (i % 2) * 60} height={14} rx={7} fill={panelLine} />
            </g>
          ))}
        </G>
        <G x={0} y={0} o={e}>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <Thing k={(["can", "box", "bottle"] as Kind[])[i]} x={400 + i * 300} y={420} s={1.1} bars={1} />
              <Tag x={400 + i * 300 + 20} y={510 + i * 6} text={["49", "89", "35"][i]} rot={i * 6 - 6} />
            </g>
          ))}
          <Clock x={1400} y={400} r={120} angle={20 + (t - c[3]) * 3} />
          <Txt x={1400} y={620} size={110} serif fill={ink}>
            1976
          </Txt>
        </G>
        <G x={0} y={0} o={f}>
          <rect x={460} y={200} width={1000} height={470} rx={20} fill="#fff" stroke={panelLine} strokeWidth={4} />
          <Barcode x={560} y={270} w={800} h={300} guard={gr} />
          {[560 + 1.5 * (800 / 95), 560 + 47.5 * (800 / 95), 560 + 93.5 * (800 / 95)].map((x, i) => (
            <g key={i} opacity={vis(t, c[4] + 2.0 + i * 0.7)}>
              <circle cx={x + 6} cy={200} r={50} fill="#fff" stroke={orange} strokeWidth={6} />
              <Txt x={x + 6} y={202} size={60} fill={orange} serif>
                6
              </Txt>
            </g>
          ))}
        </G>
        <G x={0} y={0} o={g}>
          <Person x={420} y={650} s={1.7} body={ink} tie />
          {["FIRST", "MIDDLE", "LAST"].map((w, r) => (
            <g key={w} opacity={vis(t, c[5] + 1.0 + r * 0.9)}>
              <Txt x={1000} y={270 + r * 130} size={34} fill={ink} spacing={4}>
                {w + " NAME"}
              </Txt>
              {Array.from({ length: 6 }, (_, k) => (
                <rect key={k} x={1250 + k * 70} y={240 + r * 130} width={56} height={56} rx={8} fill={orange} opacity={ramp(t, c[5] + 1.4 + r * 0.9 + k * 0.1, c[5] + 1.8 + r * 0.9 + k * 0.1)} />
              ))}
            </g>
          ))}
        </G>
      </SvgFrame>
      <Chip text="NOT EVERYBODY CHEERED" x={960} y={50} o={seg(t, c, 0)} />
      <Chip text="UNIONS" x={960} y={50} o={seg(t, c, 1)} color={orange} />
      <Chip text="JOBS?" x={960} y={672} o={vis(t, c[1] + 0.6, c[2] - 0.4)} color={orange} />
      <Chip text="WRONG PRICES?" x={620} y={560} o={vis(t, c[2] + 0.4, c[3] - 0.4)} color={orange} />
      <Chip text="WHO'S KEEPING TRACK?" x={1310} y={740} o={vis(t, c[2] + 1.8, c[3] - 0.4)} />
      <Chip text="STICKERS STAY ON" x={960} y={50} o={seg(t, c, 3)} />
      <Note text="slower checkouts" x={1400} y={720} o={vis(t, c[3] + 1.5, c[4] - 0.4)} />
      <Chip text="A STRANGE RUMOUR" x={960} y={50} o={seg(t, c, 4)} color={orange} />
      <SvgFrame>
        <Stamp x={1500} y={720} text="RUMOUR" rot={-8} o={vis(t, c[4] + 3.4, c[5] - 0.4)} />
        <Stamp x={1420} y={140} text="COINCIDENCE" color={teal} rot={-5} o={vis(t, c[5] + 3.6)} size={40} />
      </SvgFrame>
      <Chip text="George Laurer" x={420} y={700} o={seg(t, c, 5)} />
      <SimpleNote o={f} />
    </>
  );
};

// ---------------------------------------------------------------- 9: por todas partes
const Shirt: React.FC<{ x: number; y: number; color: string }> = ({ x, y, color }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M0 -6 V-30" stroke={ink} strokeWidth={4} />
    <path d="M0 -30 q-24 8 -40 16" fill="none" stroke={ink} strokeWidth={4} />
    <path d="M-50 -10 L-22 -22 Q0 -8 22 -22 L50 -10 L36 24 L24 16 V80 H-24 V16 L-36 24 Z" fill={color} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
  </g>
);

export const SceneEverywhere: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const a = seg(t, c, 0);
  const b = seg(t, c, 1);
  const d = seg(t, c, 2);
  const cols = [teal, orange, "#8FD0CD", WARM, SOFT, teal, orange];
  const price = ramp(t, c[1] + 1.2, c[1] + 1.8);
  const sales = ramp(t, c[1] + 4.5, c[1] + 8.0);
  const scratch = vis(t, c[2] + 1.0, c[2] + 3.0);
  const key = Math.floor((t - c[2] - 3.0) * 3);
  const typed = Math.max(0, Math.min(12, key));
  return (
    <>
      <SvgFrame>
        <G x={0} y={0} o={a}>
          <line x1={240} y1={250} x2={1680} y2={250} stroke={ink} strokeWidth={6} />
          {cols.map((col, i) => (
            <g key={i}>
              <Shirt x={330 + i * 210} y={290} color={col} />
              <g transform={`translate(${330 + i * 210} 380)`}>
                <Patch x={-30} y={0} w={60} h={46} bars={ramp(t, c[0] + 1.0 + i * 0.5, c[0] + 1.5 + i * 0.5)} />
              </g>
            </g>
          ))}
          {KINDS.map((k, i) => (
            <Thing key={k} k={k} x={400 + i * 280} y={620} s={0.72} bars={ramp(t, c[0] + 4.5 + i * 0.4, c[0] + 5.0 + i * 0.4)} />
          ))}
        </G>
        <G x={0} y={0} o={b}>
          <rect x={200} y={160} width={500} height={260} rx={16} fill={ink} />
          <Txt x={450} y={290} size={120} fill="#9BE3D6" weight={700}>
            {price < 0.5 ? "2.99" : "3.49"}
          </Txt>
          {[[1100, 200], [1500, 260], [1200, 420], [1600, 440]].map(([x, y], i) => (
            <g key={i}>
              <path d={`M700 290 Q900 ${(290 + y) / 2 - 60} ${x - 62} ${y}`} fill="none" stroke={orange} strokeWidth={4} strokeDasharray="10 10" opacity={price} />
              <Tag x={x} y={y} text={price < 0.5 ? "2.99" : "3.49"} color={price < 0.5 ? ink : orange} />
            </g>
          ))}
          <Register x={350} y={760} s={0.9} />
          <g transform="translate(960 700)" opacity={sales}>
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={-120 + i * 62} y={-30 - i * 28 * sales} width={46} height={30 + i * 28 * sales} fill={teal} />
            ))}
          </g>
          <path d="M520 700 H760" stroke={orange} strokeWidth={8} strokeLinecap="round" opacity={sales} />
          <polygon points="760,680 800,700 760,720" fill={orange} opacity={sales} />
          <g opacity={sales}>
            <rect x={1320} y={620} width={300} height={140} fill="#fff" stroke={ink} strokeWidth={5} />
            <rect x={1360} y={560} width={50} height={60} fill={ink} />
            <rect x={1450} y={580} width={50} height={40} fill={ink} />
            <polyline points="1160,700 1230,690 1300,700" fill="none" stroke={teal} strokeWidth={6} strokeLinecap="round" />
          </g>
        </G>
        <G x={0} y={0} o={d}>
          <rect x={460} y={180} width={760} height={470} rx={20} fill="#fff" stroke={panelLine} strokeWidth={4} />
          <Barcode x={540} y={240} w={600} h={250} nums={1} />
          <rect x={520} y={482} width={640} height={66} rx={14} fill="none" stroke={orange} strokeWidth={6} opacity={vis(t, c[2] + 0.4)} />
          <path d="M490 330 l60 -50 l50 80 l70 -60 l60 80 l80 -50 l60 90" fill="none" stroke={orange} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" opacity={scratch} />
          <g transform="translate(1420 400)">
            <rect x={-130} y={-190} width={260} height={400} rx={24} fill="#fff" stroke={ink} strokeWidth={5} />
            <rect x={-100} y={-160} width={200} height={70} rx={8} fill={ink} />
            <Txt x={0} y={-124} size={30} fill="#9BE3D6" weight={700}>
              {"0123456789012".slice(0, typed) || "_"}
            </Txt>
            {Array.from({ length: 9 }, (_, i) => (
              <rect key={i} x={-90 + (i % 3) * 64} y={-60 + Math.floor(i / 3) * 64} width={52} height={52} rx={10} fill={i === key % 9 && key >= 0 ? orange : SOFT} stroke={ink} strokeWidth={4} />
            ))}
          </g>
        </G>
      </SvgFrame>
      <Chip text="THE 1980S" x={960} y={50} o={seg(t, c, 0)} />
      <Chip text="BIG STORES DEMAND BARCODES" x={960} y={730} o={vis(t, c[0] + 0.6, c[0] + 3.7)} color={orange} />
      <Chip text="THE STRIPES SPREAD" x={960} y={730} o={vis(t, c[0] + 4.4, c[1] - 0.4)} />
      <Chip text="CHANGE A PRICE IN ONE PLACE" x={960} y={50} o={vis(t, c[1] + 0.1, c[1] + 3.7)} />
      <Chip text="SEE WHAT SELLS" x={960} y={50} o={vis(t, c[1] + 4.4, c[2] - 0.4)} color={orange} />
      <Chip text="A BACKUP" x={960} y={50} o={seg(t, c, 2)} />
      <Note text="can't read the stripes" x={820} y={600} o={vis(t, c[2] + 1.0, c[2] + 3.0)} />
      <SimpleNote o={d} />
    </>
  );
};

// ---------------------------------------------------------------- 10: cierre
export const SceneClose: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const a = seg(t, c, 0);
  const b = seg(t, c, 1);
  const join = ramp(t, c[0] + 5.0, c[0] + 7.0);
  const pop = (k: number) => vis(t, c[0] + 0.6 + k * 1.4, c[1] - 0.4);
  return (
    <>
      <SvgFrame>
        <G x={0} y={0} o={a}>
          <G x={480} y={240} o={pop(0)}>
            <circle r={110} fill={SAND} stroke={ink} strokeWidth={5} />
            {[-48, -24, 0, 24, 48].map((x, i) => (
              <rect key={x} x={x - 6} y={-50 + (i % 2) * 20} width={12} height={i % 2 ? 80 : 110} fill={ink} opacity={0.8} />
            ))}
          </G>
          <G x={960} y={240} o={pop(1)}>
            <ellipse cx={0} cy={30} rx={130} ry={40} fill="#fff" stroke={ink} strokeWidth={5} />
            {[-80, -27, 27, 80].map((x, i) => (
              <Person key={x} x={x} y={14} s={0.5} body={[ink, teal, orange, ink][i]} />
            ))}
          </G>
          <Thing k="gum" x={1440} y={250} s={0.95} o={pop(2)} bars={1} />
          {[480, 960, 1440].map((x, i) => (
            <g key={x} opacity={join * pop(i) * 0.9}>
              <path d={`M${x} 410 Q${x} 500 960 ${560}`} fill="none" stroke={orange} strokeWidth={5} strokeDasharray="10 10" />
            </g>
          ))}
          <G x={960} y={640} o={ramp(t, c[0] + 5.0, c[0] + 6.0)} s={0.9 + 0.1 * join}>
            <rect x={-300} y={-70} width={600} height={190} rx={16} fill="#fff" stroke={orange} strokeWidth={6} />
            <Barcode x={-250} y={-45} w={500} h={110} reveal={join} />
          </G>
        </G>
        <G x={150} y={0} o={b}>
          <path d="M520 700 L580 330 H1040 L1100 700 Z" fill="#fff" stroke={ink} strokeWidth={6} strokeLinejoin="round" />
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M${550 + i * 108} 700 L${590 + i * 97} 330 H${640 + i * 97} L${606 + i * 108} 700 Z`} fill={i % 2 ? "#fff" : orange} opacity={i % 2 ? 0 : 0.85} />
          ))}
          <path d="M520 700 L580 330 H1040 L1100 700 Z" fill="none" stroke={ink} strokeWidth={6} strokeLinejoin="round" />
          {[[600, 320], [680, 290], [760, 280], [840, 290], [920, 300], [1000, 320], [720, 330], [880, 335], [640, 350], [960, 345]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={38 + (i % 3) * 5} fill="#FFF3C9" stroke={ink} strokeWidth={4} />
          ))}
          <Tag x={1380} y={430} text="$$$" rot={-8} />
          <Txt x={1380} y={540} size={160} fill={orange} serif>
            ?
          </Txt>
        </G>
      </SvgFrame>
      <Chip text="A DOODLE IN THE SAND" x={480} y={400} o={pop(0)} />
      <Chip text="A COMMITTEE" x={960} y={400} o={pop(1)} color={orange} />
      <Chip text="A PACK OF GUM" x={1440} y={400} o={pop(2)} />
      <Chip text="NEXT: WHY?" x={960} y={50} o={seg(t, c, 1)} color={orange} />
      <Note text="movie popcorn" x={960} y={740} o={seg(t, c, 1)} />
    </>
  );
};

export const SCENES003: Record<string, React.FC<SceneProps>> = {
  "gum-hook": SceneGumHook,
  "grocery": SceneGrocery,
  "sand": SceneSand,
  "not-ready": SceneNotReady,
  "standard": SceneStandard,
  "rectangle": SceneRectangle,
  "first-scan": SceneFirstScan,
  "fear": SceneFear,
  "everywhere": SceneEverywhere,
  "close": SceneClose,
};
