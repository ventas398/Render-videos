import React from "react";
import { Audio, Sequence, staticFile, useDelayRender } from "remotion";
import { ramp } from "../utils/anim";
import { theme } from "../themes/brand";
import type { SceneProps } from "./scenes";
import { Cam, DrawOn, Foot2, Mascot, pop } from "./kit2";
import type { Mood } from "./kit2";
import { bg, G, GREY, ink, orange, RED, SvgFrame, teal, Txt, useT } from "./kit";

/* ============ sistema de planos: foto en ventana + camara + transicion; el audio de las transiciones se deduce solo ============ */
export type R = [number, number, number, number];
type Mv = "in" | "out" | "pl" | "pr" | "pu" | "pd";
type Tr = "cut" | "pop" | "wl" | "wr" | "zoom" | "page" | "fade";
export type Sh = { id: string; t: number; asp?: number; r?: R; f?: [number, number]; z?: number; mv: Mv; tr: Tr; rot?: number; L?: number; bl?: number; m?: (S: number) => React.ReactNode };
export type Ev = [number, string, number?];

export const FULL: R = [0, 0, 1920, 1080];
export const LEFT: R = [70, 60, 880, 810];
export const RIGHT: R = [970, 60, 880, 810];
export const CEN: R = [230, 60, 1460, 810];
const CARD = "#FFFDF6";
export const cl = (v: number) => Math.max(0, Math.min(1, v));

export const Shots: React.FC<{ id: string; list: Sh[]; dur: number; pfx?: string; asp?: number; src?: (id: string) => string }> = ({ id, list, dur, pfx = "em023-", asp, src }) => {
  const t = useT();
  const { delayRender, continueRender } = useDelayRender();
  const held = React.useRef<HTMLImageElement[]>([]); // mantiene las imagenes decodificadas (evita huecos si el navegador las descarta)
  React.useLayoutEffect(() => {
    const h = delayRender("shots " + id);
    const load = async (u: string) => { const i = new Image(); i.src = u; held.current.push(i); for (let k = 0; k < 3; k++) { try { await i.decode(); return; } catch { /* reintenta */ } } };
    Promise.all([...new Set(list.map((s) => (src ? src(s.id) : staticFile(`illustrations/${pfx}${s.id}.png`))))].map(load)).finally(() => continueRender(h));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <defs>
        <filter id={`mb-${id}`} x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="26 0" />
        </filter>
      </defs>
      {list.map((s, i) => {
        const nx = list.find((q, j) => j > i && (q.L ?? 0) === (s.L ?? 0));
        if (t < s.t - 0.6 || t > (nx ? nx.t + 0.4 : dur + 1)) return null;
        const w0 = s.r ?? CEN;
        const fr = w0 !== FULL;
        const b = fr ? 14 : 0;
        const [x, y, w, h] = [w0[0] + b, w0[1] + b, w0[2] - 2 * b, w0[3] - 2 * b];
        const u = cl((t - s.t) / Math.max(0.5, (nx ? nx.t : dur) - s.t));
        const e = u * u * (3 - 2 * u);
        const zb = s.z ?? 1;
        let [fx, fy] = s.f ?? [0.5, 0.5];
        let z = zb;
        const d = (0.5 - e) * 0.12;
        if (s.mv === "in") z = zb * (1 + 0.14 * e);
        else if (s.mv === "out") z = zb * (1.16 - 0.14 * e);
        else z = zb * 1.14;
        if (s.mv === "pl") fx += d;
        if (s.mv === "pr") fx -= d;
        if (s.mv === "pu") fy += d;
        if (s.mv === "pd") fy -= d;
        const ar = s.asp ?? asp; const S = ar ? Math.max(h, w / ar) * z : Math.max(w, h) * z; // con asp (fotos 16:9) S es el alto
        const SW = ar ? S * ar : S;
        const left = Math.max(x + w - SW, Math.min(x, x + w / 2 - fx * SW));
        const top = Math.max(y + h - S, Math.min(y, y + h / 2 - fy * S));
        const p = cl((t - s.t) / 0.45);
        const pre = t < s.t;
        const ee = 1 - Math.pow(1 - p, 3);
        let dx = 0, dy = 0, sc = 1, ro = 0, op = 1;
        if (s.tr === "pop") { sc = 0.7 + 0.3 * pop(t, s.t, 0.5); op = cl(p * 4); }
        if (s.tr === "wl") dx = -(1 - ee) * 2000;
        if (s.tr === "wr") dx = (1 - ee) * 2000;
        if (s.tr === "zoom") { sc = 1.7 - 0.7 * ee; op = cl(p * 3); }
        if (s.tr === "page") { dx = (1 - ee) * 1500; dy = (1 - ee) * 260; ro = (1 - ee) * 14; }
        if (s.tr === "fade") op = p;
        const cx = w0[0] + w0[2] / 2;
        const cy = w0[1] + w0[3] / 2;
        if (pre) op = 0.002;
        const blur = !pre && (s.tr === "wl" || s.tr === "wr") && p < 0.55;
        const cid = `${id}-${i}`;
        return (
          <g key={i} opacity={op} filter={blur ? `url(#mb-${id})` : undefined} transform={`translate(${dx} ${dy}) translate(${cx} ${cy}) rotate(${(s.rot ?? 0) + ro}) scale(${sc}) translate(${-cx} ${-cy})`}>
            {fr && (
              <>
                <rect x={w0[0] + 8} y={w0[1] + 12} width={w0[2]} height={w0[3]} rx={14} fill="#3A2A12" opacity={0.28} />
                <rect x={w0[0]} y={w0[1]} width={w0[2]} height={w0[3]} rx={14} fill="#FFFFFF" />
              </>
            )}
            <clipPath id={cid}>
              <rect x={x} y={y} width={w} height={h} rx={fr ? 6 : 0} />
            </clipPath>
            <g clipPath={`url(#${cid})`}>
              <image href={src ? src(s.id) : staticFile(`illustrations/${pfx}${s.id}.png`)} x={left - 2 * (s.bl ?? 0)} y={top - 2 * (s.bl ?? 0)} width={SW + 4 * (s.bl ?? 0)} height={S + 4 * (s.bl ?? 0)} preserveAspectRatio="xMidYMid slice" style={s.bl ? { filter: `blur(${s.bl}px)` } : undefined} />
              <g transform={`translate(${left} ${top})`}>{s.m?.(SW)}</g>
            </g>
          </g>
        );
      })}
    </>
  );
};

const VAR = ["sw1", "paper", "sw2", "sw3"];
const GAIN: Record<string, number> = { sw1: 0.06, sw2: 0.07, sw3: 0.037, paper: 0.06, whoosh: 0.1, pop: 0.12, tick: 0.2, tock: 0.2, thud: 0.04, horn: 0.06, ding: 0.04, swell: 0.12 };
// solo ~1 de cada 3 cambios con movimiento lleva un "swish" suave, variando el sonido; cortes y fundidos van mudos
export const sfxOf = (list: Sh[]): Ev[] => list.filter((s) => s.tr !== "cut" && s.tr !== "fade").flatMap((s, k) => (k % 3 === 1 ? [[s.t, VAR[(k + Math.floor(s.t)) % VAR.length], 0.7] as Ev] : []));
export const ticks = (t0: number, t1: number, dt: number, v: number): Ev[] => {
  const o: Ev[] = [];
  for (let t = t0, i = 0; t < t1; t += dt, i++) o.push([t, i % 2 ? "tock" : "tick", v]);
  return o;
};
export const Sfx: React.FC<{ ev: Ev[] }> = ({ ev }) => (
  <>
    {ev.filter(([t]) => t >= 0).map(([t, k, v = 0.4], i) => (
      <Sequence key={i} from={Math.round(t * 30)} durationInFrames={90} layout="none">
        <Audio src={staticFile(`audio/sfx/${k}.wav`)} volume={v * (GAIN[k] ?? 0.2)} />
      </Sequence>
    ))}
  </>
);

/* ============ capas de rotulos ============ */
let cv: CanvasRenderingContext2D | null = null;
/** Ancho real del texto (canvas); si no hay canvas, estimacion por caracter. */
const tw = (str: string, size: number, weight = 900, sp = 0) => {
  cv ??= typeof document === "undefined" ? null : document.createElement("canvas").getContext("2d");
  if (!cv) return str.length * size * 0.7 + str.length * sp;
  cv.font = `${weight} ${size}px ${theme.font}`;
  return cv.measureText(str).width + str.length * sp;
};
const keep = (x: number, w: number) => Math.max(110 + w / 2, Math.min(1810 - w / 2, x));
/** Aparece con rebote entre a y b; (x, y) es su centro. */
export const Ov: React.FC<{ x: number; y: number; a: number; b?: number; s?: number; rot?: number; lim?: number; children: React.ReactNode }> = ({ x, y, a, b = 1e6, s = 1, rot = 0, lim = 9, children }) => {
  const t = useT();
  if (t < a || t > b) return null;
  const p = Math.min(pop(t, a, 0.45), lim);
  return (
    <G x={x} y={y} s={s * p} rot={rot} o={Math.min(cl(p * 3), 1 - ramp(t, b - 0.25, b))}>
      {children}
    </G>
  );
};
const T2: React.FC<{ text: string; size?: number; fill?: string }> = ({ text, size = 100, fill = ink }) => (
  <text textAnchor="middle" dominantBaseline="central" fontFamily={theme.font} fontWeight={900} fontSize={size} letterSpacing={-1} fill={fill} stroke={bg} strokeWidth={size / 6} strokeLinejoin="round" paintOrder="stroke">
    {text}
  </text>
);
/** Texto cinetico: cada palabra entra con rebote, 0.1 s tras la anterior. */
export const Kin: React.FC<{ x: number; y: number; text: string; a: number; b?: number; size?: number; fill?: string; rot?: number }> = ({ x, y, text, a, b = 1e6, size = 100, fill = ink, rot = 0 }) => {
  const ws = text.split(" ");
  const wd = ws.map((w) => tw(w, size, 900, -1) + size / 6);
  const gap = size * 0.34;
  const tot = wd.reduce((p, q) => p + q, 0) + gap * (ws.length - 1);
  let cx = -tot / 2;
  return (
    <G x={keep(x, tot)} y={y} rot={rot}>
      {ws.map((w, i) => {
        const px = cx + wd[i] / 2;
        cx += wd[i] + gap;
        return (
          <Ov key={i} x={px} y={0} a={a + i * 0.1} b={b} lim={1.06}>
            <T2 text={w} size={size} fill={fill} />
          </Ov>
        );
      })}
    </G>
  );
};
export const Pill: React.FC<{ x: number; y: number; text: string; a: number; b?: number; size?: number; color?: string; rot?: number }> = ({ x, y, text, a, b, size = 40, color = orange, rot = 0 }) => {
  const w = tw(text, size, 800, 1) + 64;
  return (
    <Ov x={keep(x, w)} y={y} a={a} b={b} rot={rot} lim={1.06}>
      <rect x={-w / 2 + 8} y={-size * 0.9 + 10} width={w} height={size * 1.8} rx={size * 0.9} fill={ink} opacity={0.16} />
      <rect x={-w / 2} y={-size * 0.9} width={w} height={size * 1.8} rx={size * 0.9} fill={CARD} stroke={color} strokeWidth={6} />
      <Txt x={0} y={2} size={size} spacing={1}>
        {text}
      </Txt>
    </Ov>
  );
};
export const Reading: React.FC<{ x: number; y: number; a: number; b?: number }> = (p) => <Pill {...p} text="OUR READING" color={teal} size={38} rot={-3} />;
export const Num: React.FC<{ x: number; y: number; v: number; a: number; b?: number; size?: number; fill?: string; dur?: number }> = ({ x, y, v, a, b, size = 200, fill = orange, dur = 1.2 }) => {
  const t = useT();
  return (
    <Ov x={x} y={y} a={a} b={b}>
      <T2 text={Math.round(v * ramp(t, a, a + dur)).toLocaleString("en-US")} size={size} fill={fill} />
    </Ov>
  );
};
/** Flecha dibujada de (x1, y1) a (x2, y2); desaparece en e. */
export const Ar: React.FC<{ x1: number; y1: number; x2: number; y2: number; a: number; e?: number; color?: string; w?: number }> = ({ x1, y1, x2, y2, a, e = 1e6, color = orange, w = 12 }) => {
  const t = useT();
  const o = 1 - ramp(t, e - 0.25, e);
  if (o <= 0) return null;
  return (
    <g opacity={o}>
      <DrawOn d={`M${x1} ${y1} L${x2} ${y2}`} t0={a} t1={a + 0.5} w={w} color={color} />
      {t > a + 0.45 && (
        <g transform={`translate(${x2} ${y2}) rotate(${(Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI})`}>
          <path d="M-36 -24 L0 0 L-36 24" fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </g>
  );
};
export const Ring: React.FC<{ x: number; y: number; rx: number; ry: number; a: number; e?: number; color?: string }> = ({ x, y, rx, ry, a, e = 1e6, color = orange }) => {
  const t = useT();
  const o = 1 - ramp(t, e - 0.25, e);
  return o <= 0 ? null : <DrawOn d={`M${x - rx} ${y} A${rx} ${ry} 0 1 1 ${x + rx} ${y} A${rx} ${ry} 0 1 1 ${x - rx - 14} ${y - 10}`} t0={a} t1={a + 0.5} w={11} color={color} o={o} />;
};
export const Pip: React.FC<{ x: number; y: number; a: number; b?: number; s?: number; mood?: Mood; arm?: "down" | "point" | "chin" | "ear"; flip?: boolean; hop?: boolean }> = ({ x, y, a, b, s = 0.85, mood = "curious", arm = "down", flip, hop }) => {
  const t = useT();
  return (
    <Ov x={x} y={y} a={a} b={b}>
      <Mascot x={0} y={0} s={s} mood={mood} arm={arm} flip={flip} jump={hop ? Math.abs(Math.sin(t * 5)) * 40 : 0} />
    </Ov>
  );
};
export const Src: React.FC<{ text: string; a: number; b: number }> = ({ text, a, b }) => {
  const t = useT();
  return <g transform="translate(0 -69)"><Foot2 text={text} o={ramp(t, a, a + 0.3) * (1 - ramp(t, b - 0.3, b))} /></g>;
};
/** Rotulos fijos abajo-derecha: las 21 imagenes son IA fotorrealistas; "AI illustration, not a portrait" en los planos con caras; "Simplified illustration" mientras haya un diagrama vectorial (dia). */
const AIF = ["reporter", "calendar", "pamphlet", "song", "bus", "move", "stop", "lane-switch", "borders", "car-growth", "parliament", "ballot"];
const Chip: React.FC<{ text: string; y: number }> = ({ text, y }) => {
  const w = tw(text, 24, 700) + 44;
  return (
    <>
      <rect x={1884 - w} y={y} width={w} height={44} rx={22} fill={CARD} opacity={0.92} stroke={ink} strokeWidth={2} strokeOpacity={0.5} />
      <text x={1862} y={y + 22} textAnchor="end" dominantBaseline="central" fontFamily={theme.font} fontWeight={700} fontSize={24} fill={ink}>
        {text}
      </text>
    </>
  );
};
export const Simp: React.FC<{ shots: Sh[]; dia?: [number, number][] }> = ({ shots, dia = [] }) => {
  const t = useT();
  const cur = [...shots].reverse().find((q) => q.t <= t);
  return (
    <>
      <Chip text={cur && AIF.includes(cur.id) ? "AI illustration, not a portrait" : (cur?.id === "covered-signs" || cur?.id === "sign-pile" || cur?.id === "graph") ? "Simplified illustration" : "Illustrative image"} y={815} />
      {dia.some(([a, b]) => t >= a && t <= b) && <Chip text="Simplified illustration" y={765} />}
    </>
  );
};
export const pk = (c: number[], from: number) => (part: number, o = 0) => c[part - from] + o;

/* ============ piezas pequenas ============ */
const Waves: React.FC<{ x: number; y: number; S: number; a: number; e: number }> = ({ x, y, S, a, e }) => {
  const t = useT();
  if (t < a || t > e) return null;
  return (
    <>
      {[0, 1, 2].map((i) => {
        const u = ((t - a) * 1.3 + i / 3) % 1;
        return <circle key={i} cx={x} cy={y} r={S * (0.03 + 0.12 * u)} fill="none" stroke={orange} strokeWidth={10} opacity={1 - u} />;
      })}
    </>
  );
};
const Disc: React.FC = () => {
  const t = useT();
  return (
    <g transform={`rotate(${t * 140})`}>
      <circle r={140} fill={ink} />
      {[45, 75, 105, 128].map((r) => (
        <circle key={r} r={r} fill="none" stroke="#3B4A6B" strokeWidth={3} />
      ))}
      <circle r={46} fill={orange} />
      <circle r={8} fill={bg} />
      <path d="M0 -130 A130 130 0 0 1 92 -92" fill="none" stroke="#fff" strokeWidth={8} opacity={0.5} />
    </g>
  );
};
const Sweep: React.FC<{ a: number }> = ({ a }) => {
  const t = useT();
  const u = Math.min(0.999, ramp(t, a, a + 2.4));
  const ang = u * Math.PI * 2;
  const r = 190;
  return (
    <>
      <circle r={r + 10} fill={CARD} stroke={ink} strokeWidth={10} />
      {u > 0.01 && <path d={`M0 0 L0 ${-r} A${r} ${r} 0 ${ang > Math.PI ? 1 : 0} 1 ${r * Math.sin(ang)} ${-r * Math.cos(ang)} Z`} fill={orange} opacity={0.55} />}
      {Array.from({ length: 12 }, (_, d) => (
        <line key={d} x1={0} y1={-r + 8} x2={0} y2={-r + (d % 3 ? 24 : 40)} stroke={ink} strokeWidth={d % 3 ? 4 : 8} transform={`rotate(${d * 30})`} />
      ))}
      <line x1={0} y1={0} x2={0} y2={-r + 30} stroke={ink} strokeWidth={10} strokeLinecap="round" transform={`rotate(${u * 360})`} />
      <circle r={12} fill={ink} />
    </>
  );
};
const NightBar: React.FC<{ a: number }> = ({ a }) => {
  const u = ramp(useT(), a, a + 1.1);
  return (
    <>
      <rect x={-540} y={-70} width={1080} height={140} rx={30} fill={CARD} stroke={ink} strokeWidth={6} />
      <rect x={-480} y={-14} width={960} height={28} rx={14} fill={GREY} opacity={0.4} />
      <rect x={-480} y={-14} width={Math.max(1, 960 * u)} height={28} rx={14} fill={orange} />
      <Txt x={-480} y={-44} size={34}>
        1 AM
      </Txt>
      <Txt x={480} y={-44} size={34}>
        6 AM
      </Txt>
    </>
  );
};
const Meter: React.FC<{ a: number }> = ({ a }) => {
  const u = ramp(useT(), a, a + 0.9);
  return (
    <>
      <rect x={-350} y={-30} width={700} height={60} rx={30} fill={CARD} stroke={ink} strokeWidth={6} />
      <rect x={-344} y={-24} width={Math.max(1, 688 * 0.83 * u)} height={48} rx={24} fill={RED} />
    </>
  );
};
/** Una banda gris (lunes anteriores, 130-198) y una barra naranja (lunes del cambio, 125); escala 2 px por unidad sobre la base y=220. */
const Band: React.FC<{ a: number }> = ({ a }) => {
  const t = useT();
  const u = ramp(t, a, a + 0.7);
  const v = ramp(t, a + 0.6, a + 1.3);
  return (
    <>
      <rect x={-250} y={-176 + 136 * (1 - u)} width={500} height={136 * u} rx={8} fill={GREY} opacity={0.45} stroke={GREY} strokeWidth={4} strokeDasharray="14 10" />
      {u > 0.9 && (
        <>
          <Txt x={0} y={-142} size={26} fill={ink}>
            EARLIER MONDAYS
          </Txt>
          <Txt x={0} y={-94} size={56}>
            130-198
          </Txt>
        </>
      )}
      <rect x={-85} y={220 - 250 * v} width={170} height={250 * v} rx={10} fill={orange} stroke={ink} strokeWidth={5} />
      {v > 0.9 && (
        <Txt x={0} y={35} size={72} fill="#fff">
          125
        </Txt>
      )}
      <Txt x={0} y={264} size={34}>
        NEXT MONDAY
      </Txt>
    </>
  );
};
/** Vista cenital, circulacion por la izquierda: el conductor (volante a la izquierda) queda junto al bordillo y el camion le tapa el campo de vision. */
const RoadDiagram: React.FC = () => (
  <>
    <rect x={-190} y={-330} width={380} height={660} rx={18} fill={CARD} stroke={ink} strokeWidth={6} />
    <rect x={-150} y={-300} width={300} height={600} fill={GREY} />
    <line x1={0} y1={-300} x2={0} y2={300} stroke="#fff" strokeWidth={6} strokeDasharray="30 24" />
    <rect x={-166} y={-300} width={16} height={600} fill={orange} />
    <rect x={150} y={-300} width={16} height={600} fill={orange} />
    <path d="M-98 190 L-20 -300 L120 -300 Z" fill={orange} opacity={0.3} />
    <rect x={-120} y={-90} width={90} height={150} rx={8} fill="#E8A317" stroke={ink} strokeWidth={5} />
    <rect x={-115} y={140} width={80} height={140} rx={14} fill={teal} stroke={ink} strokeWidth={5} />
    <circle cx={-98} cy={190} r={13} fill={orange} stroke={ink} strokeWidth={3} />
    <rect x={40} y={-250} width={80} height={140} rx={14} fill={RED} stroke={ink} strokeWidth={5} />
    <Txt x={80} y={-180} size={64} fill="#fff">
      ?
    </Txt>
  </>
);

/* ============ escena 1: hook (partes 0-3) ============ */
const CLOCK_N = "clock-night";
const SceneHook: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const P = pk(c, 0);
  const shots: Sh[] = [
    { id: "clock", t: 0, r: FULL, f: [0.5, 0.3], mv: "in", tr: "cut", m: (S) => <Ring x={S * 0.51} y={S * 0.28} rx={S * 0.17} ry={S * 0.17} a={P(0, 3.2)} e={P(1, 0.2)} /> },
    { id: "stop", t: P(1), f: [0.5, 0.6], mv: "pr", tr: "wl", rot: -1.5 },
    { id: "stop", t: P(1, 2.9), f: [0.2, 0.62], z: 1.5, mv: "in", tr: "zoom", rot: -1.5 },
    { id: "lane-switch", t: P(2), r: FULL, f: [0.5, 0.6], mv: "pl", tr: "page", rot: 2 },
    { id: "move", t: P(3), f: [0.45, 0.6], mv: "out", tr: "pop", rot: -1 },
  ];
  const ev: Ev[] = [...sfxOf(shots), ...ticks(P(0, 2.9), P(0, 4.4), 0.25, 0.22), [P(1, 3.45), "thud", 0.6]];
  return (
    <>
      <SvgFrame>
        <Cam dur={dur} z1={1.04} amt={0.6}>
          <Shots id="hook" list={shots} dur={dur} />
        </Cam>
        <Cam dur={dur} z1={1.05} dx={-20} amt={1.3}>
          <Pill x={1500} y={230} text="3 SEP 1967" size={56} a={P(0, 0.1)} b={P(1)} rot={-4} />
          <Kin x={1480} y={750} text="04:50" size={170} fill={orange} a={P(0, 3.0)} b={P(1, 0.2)} />
          <Pill x={520} y={130} text="MOST ROADS" a={P(1, 0.3)} b={P(2)} color={teal} />
          <Kin x={1480} y={250} text="STOP" size={170} fill={RED} rot={6} a={P(1, 3.4)} b={P(2, 0.1)} />
          <Kin x={250} y={330} text="LEFT" size={100} a={P(2, 0.3)} b={P(3, 0.1)} />
          <Ar x1={410} y1={330} x2={545} y2={330} a={P(2, 0.9)} e={P(3, 0.1)} />
          <Kin x={740} y={330} text="RIGHT" size={100} fill={orange} a={P(2, 1.4)} b={P(3, 0.1)} />
          <Pip x={230} y={790} a={P(3)} s={0.9} arm="chin" />
          <Kin x={480} y={150} text="WHY?" size={170} fill={orange} rot={5} a={P(3, 0.1)} />
        </Cam>
        <Simp shots={shots} />
      </SvgFrame>
      <Sfx ev={ev} />
    </>
  );
};

/* ============ escena 2: reasons (partes 4-12) ============ */
const SceneReasons: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const P = pk(c, 4);
  const shots: Sh[] = [
    { id: "lane-switch", t: 0, f: [0.62, 0.5], z: 1.25, mv: "pl", tr: "cut", rot: -1 },
    { id: "borders", t: P(5, 0.1), r: FULL, f: [0.5, 0.4], mv: "in", tr: "wr", rot: 1.5 },
    { id: "borders", t: P(5, 3.5), r: FULL, f: [0.25, 0.78], z: 1.7, mv: "pu", tr: "zoom", rot: 1.5 },
    { id: "steering", t: P(6), r: FULL, f: [0.4, 0.7], mv: "in", tr: "page", rot: -2, m: (S) => <Ring x={S * 0.39} y={S * 0.76} rx={S * 0.2} ry={S * 0.17} a={P(6, 3.3)} e={P(7)} /> },
    { id: "lane-switch", t: P(7), r: FULL, f: [0.3, 0.72], z: 1.9, mv: "in", tr: "pop", rot: 2 },
    { id: "ballot", t: P(8), r: FULL, f: [0.6, 0.3], z: 1.75, mv: "in", tr: "page", rot: -2 },
    { id: "ballot", t: P(9), r: FULL, f: [0.6, 0.3], z: 1.9, mv: "in", tr: "zoom", rot: -2 },
    { id: "parliament", t: P(10), r: FULL, f: [0.55, 0.4], mv: "out", tr: "wr" },
    { id: "car-growth", t: P(11), r: FULL, f: [0.55, 0.6], mv: "in", tr: "wl", rot: 2 },
    { id: "car-growth", t: P(11, 3.9), r: FULL, f: [0.3, 0.68], z: 1.6, mv: "pl", tr: "fade", rot: 2 },
    { id: "clock", t: P(12), r: FULL, f: [0.5, 0.28], z: 1.3, mv: "pu", tr: "page", rot: -2 },
  ];
  const ev: Ev[] = [...sfxOf(shots), [P(9, 1.4), "thud", 0.5], [P(10, 2.3), "ding", 0.4], [P(12, 2.1), "thud", 0.5]];
  return (
    <>
      <SvgFrame>
        <Cam dur={dur} z1={1.04} amt={0.6}>
          <Shots id="reasons" list={shots} dur={dur} />
        </Cam>
        <Cam dur={dur} z1={1.05} dx={-20} amt={1.3}>
          <Pill x={700} y={130} text="UNTIL THAT MORNING" a={P(4, 0.3)} b={P(5)} color={teal} />
          <Kin x={1380} y={190} text="LEFT" size={150} a={P(4, 2.2)} b={P(5)} />
          <Ar x1={1500} y1={310} x2={1150} y2={310} a={P(4, 2.5)} e={P(5)} />
          <Pill x={500} y={200} text="EVERY NEIGHBOr: FULL" a={P(5, 0.3)} b={P(5, 3.3)} color={teal} />
          <Kin x={500} y={420} text="5 MILLION" size={120} fill={orange} a={P(5, 3.7)} b={P(6)} />
          <Kin x={500} y={530} text="VEHICLES PER YEAR" size={60} a={P(5, 4.4)} b={P(6)} />
          <Kin x={1410} y={300} text="9 IN 10" size={190} fill={orange} a={P(6, 1.0)} b={P(7)} />
          {Array.from({ length: 10 }, (_, i) => (
            <Ov key={i} x={1050 + i * 80} y={520} a={P(6, 1.2) + i * 0.07} b={P(7)}>
              <circle r={34} fill={i < 9 ? teal : "none"} stroke={i < 9 ? ink : GREY} strokeWidth={5} />
            </Ov>
          ))}
          <Pill x={1410} y={690} text="STEERING WHEEL ON THE LEFT" size={36} a={P(6, 3.2)} b={P(7)} />
          <Reading x={510} y={100} a={P(7, 0.2)} b={P(8)} />
          <Ov x={510} y={480} a={P(7, 1.0)} b={P(8)}>
            <RoadDiagram />
          </Ov>
          <Pill x={510} y={860} text="POOR VIEW" a={P(7, 3.6)} b={P(8)} color={RED} />
          <Kin x={1410} y={330} text="1955" size={250} fill={orange} a={P(8, 0.3)} b={P(9)} />
          <Pill x={1410} y={520} text="A NATIONAL VOTE" a={P(8, 2.0)} b={P(9)} color={teal} />
          <Kin x={1410} y={300} text="83 %" size={250} a={P(9, 0.2)} b={P(10)} />
          <Ov x={1410} y={520} a={P(9, 0.3)} b={P(10)}>
            <Meter a={P(9, 0.4)} />
          </Ov>
          <Kin x={1410} y={700} text="NO" size={220} fill={RED} a={P(9, 1.4)} b={P(10)} />
          <Kin x={700} y={180} text="APPROVED" size={130} fill={teal} a={P(10, 0.5)} b={P(11)} />
          <Kin x={1100} y={330} text="ANYWAY" size={110} fill={orange} rot={-4} a={P(10, 1.5)} b={P(11)} />
          <Pill x={1500} y={160} text="MAY 1963" size={64} a={P(10, 2.2)} b={P(11)} />
          <Pill x={510} y={150} text="CARS IN SWEDEN" a={P(11, 0.2)} b={P(12, -0.3)} color={teal} />
          <Kin x={510} y={250} text="500,000" size={110} a={P(11, 0.5)} b={P(12, -0.3)} />
          <Ar x1={510} y1={330} x2={510} y2={500} a={P(11, 1.3)} e={P(12, -0.3)} />
          <Kin x={800} y={400} text="x3" size={150} fill={teal} rot={8} a={P(11, 1.5)} b={P(12, -0.3)} />
          <Kin x={510} y={600} text="1.5 MILLION" size={120} fill={orange} a={P(11, 2.0)} b={P(12, -0.3)} />
          <Reading x={1410} y={110} a={P(12, -0.3)} />
          <Kin x={1410} y={300} text="WAIT?" size={190} a={P(12, 0.9)} />
          <Ar x1={1410} y1={420} x2={1410} y2={560} a={P(12, 1.5)} />
          <Kin x={1410} y={690} text="HARDER" size={190} fill={orange} a={P(12, 2.0)} />
        </Cam>
        <Simp shots={shots} dia={[[P(6, 1.0), P(7)], [P(7, 1.0), P(8)], [P(9, 0.3), P(10)]]} />
        <Src text="Wikipedia" a={P(5, 0.3)} b={P(7)} />
        <Src text="Wikipedia" a={P(11, 0.2)} b={P(12, -0.3)} />
      </SvgFrame>
      <Sfx ev={ev} />
    </>
  );
};

/* ============ escena 3: preparation (partes 13-19) ============ */
const ScenePrep: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const P = pk(c, 13);
  const shots: Sh[] = [
    { id: "calendar", t: 0, r: FULL, f: [0.55, 0.4], mv: "in", tr: "cut", rot: 1 },
    { id: "calendar", t: P(13, 2.8), r: FULL, f: [0.35, 0.5], z: 1.8, mv: "pr", tr: "zoom", rot: 1 },
    { id: "pamphlet", t: P(14), r: FULL, f: [0.5, 0.55], mv: "pl", tr: "wl", rot: -2 },
    { id: "h-logo-v2", t: P(15), f: [0.5, 0.5], mv: "in", tr: "pop", rot: 1, m: (S) => <Ring x={S * 0.3} y={S * 0.6} rx={S * 0.08} ry={S * 0.11} a={P(15, 2.1)} e={P(15, 3.1)} /> },
    { id: "h-logo-v2", t: P(15, 3.1), f: [0.76, 0.2], z: 1.4, mv: "pd", tr: "wr", rot: 1, m: (S) => <Ring x={S * 0.76} y={S * 0.2} rx={S * 0.1} ry={S * 0.09} a={P(15, 3.4)} e={P(16)} /> },
    { id: "song", t: P(16), r: FULL, f: [0.5, 0.5], mv: "pr", tr: "zoom", rot: -2 },
    { id: "sign-pile", t: P(17), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page", rot: 1.5 },
    { id: "bus", t: P(18), r: FULL, f: [0.7, 0.45], mv: "in", tr: "wl", rot: 1.5 },
    { id: "bus", t: P(18, 3.4), r: FULL, f: [0.72, 0.5], z: 1.45, mv: "pr", tr: "fade", rot: 1.5, m: (S) => <Ring x={S * 0.85} y={S * 0.5} rx={S * 0.075} ry={S * 0.26} a={P(18, 3.9)} e={P(19)} /> },
    { id: "covered-signs", t: P(19), f: [0.5, 0.3], mv: "out", tr: "zoom", rot: -1 },
  ];
  const ev: Ev[] = [...sfxOf(shots), [P(19, 3.0), "swell", 0.28]];
  return (
    <>
      <SvgFrame>
        <Cam dur={dur} z1={1.04} amt={0.6}>
          <Shots id="prep" list={shots} dur={dur} />
        </Cam>
        <Cam dur={dur} z1={1.05} dx={-20} amt={1.3}>
          <Kin x={510} y={230} text="1963" size={120} a={P(13, 0.5)} b={P(14)} />
          <Ar x1={510} y1={310} x2={510} y2={410} a={P(13, 1.0)} e={P(14)} />
          <Kin x={510} y={510} text="1967" size={120} fill={orange} a={P(13, 1.5)} b={P(14)} />
          <Pill x={510} y={720} text="SPECIAL COMMISSION" size={46} a={P(13, 2.9)} b={P(14)} color={teal} />
          <Kin x={510} y={170} text="EVERY HOUSEHOLD" size={76} a={P(14, 0.2)} b={P(15)} />
          {Array.from({ length: 9 }, (_, i) => (
            <Ov key={i} x={510 + (i % 3 - 1) * 170} y={535 + (Math.floor(i / 3) - 1) * 175} a={P(14, 2.5) + i * 0.08} b={P(15)} rot={(i % 3 - 1) * 3} s={0.9}>
              <rect x={-65} y={-85} width={130} height={170} rx={10} fill={CARD} stroke={ink} strokeWidth={5} />
              <rect x={-65} y={-85} width={130} height={46} rx={10} fill={i % 2 ? orange : teal} stroke={ink} strokeWidth={5} />
              <line x1={-40} y1={-10} x2={40} y2={-10} stroke={GREY} strokeWidth={6} />
              <line x1={-40} y1={20} x2={40} y2={20} stroke={GREY} strokeWidth={6} />
              <line x1={-40} y1={50} x2={10} y2={50} stroke={GREY} strokeWidth={6} />
            </Ov>
          ))}
          <Ov x={330} y={220} a={P(15, 1.1)} b={P(16)} rot={-8}>
            <T2 text="H" size={300} fill={teal} />
          </Ov>
          <Pill x={600} y={770} text="MILK CARTONS" a={P(15, 2.0)} b={P(15, 3.1)} />
          <Pill x={960} y={770} text="UNDERWEAR" a={P(15, 3.3)} b={P(16)} color={teal} />
          <Ov x={1220} y={300} a={P(16, 0.3)} b={P(17)}>
            <Disc />
          </Ov>
          <Kin x={1410} y={560} text="KEEP TO THE RIGHT," size={62} a={P(16, 0.9)} b={P(17)} />
          <Kin x={1410} y={660} text="SVENSSON" size={100} fill={orange} a={P(16, 1.6)} b={P(17)} />
          <Num x={510} y={250} v={350000} a={P(17, 0.35)} b={P(18)} size={150} dur={1.3} />
          <Pill x={510} y={390} text="ROAD SIGNS" size={52} a={P(17, 2.0)} b={P(18)} color={teal} />
          <Pill x={510} y={730} text="REMOVED OR REPLACED" size={42} a={P(17, 2.9)} b={P(18)} />
          <Pip x={510} y={600} a={P(18, 0.1)} b={P(18, 1.4)} s={0.95} mood="curious" arm="point" />
          <Kin x={510} y={260} text="1,000+ NEW" size={120} fill={teal} a={P(18, 1.5)} b={P(19)} />
          <Pill x={510} y={380} text="BUSES, DOORS ON THE RIGHT" size={36} a={P(18, 2.4)} b={P(19)} />
          <Kin x={510} y={560} text="8,000" size={170} fill={orange} a={P(18, 4.2)} b={P(19)} />
          <Kin x={510} y={700} text="MODIFIED" size={90} a={P(18, 5.0)} b={P(19)} />
          <Pill x={960} y={130} text="WRAPPED IN BLACK PLASTIC" size={56} a={P(19, 1.5)} />
        </Cam>
        <Simp shots={shots} dia={[[P(14, 2.5), P(15)]]} />
        <Src text="Wikipedia" a={P(13, 0.3)} b={P(14)} />
        <Src text="Popular Science" a={P(14, 0.3)} b={P(15)} />
        <Src text="Wikipedia" a={P(15, 0.3)} b={P(16)} />
        <Src text="Popular Science" a={P(16, 0.3)} b={P(17)} />
        <Src text="Wikipedia" a={P(17, 0.3)} b={dur + 1} />
      </SvgFrame>
      <Sfx ev={ev} />
    </>
  );
};

/* ============ escena 4: night (partes 20-24) ============ */
const SceneNight: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const P = pk(c, 20);
  const t = useT();
  const dim = 0.38 * ramp(t, 0, 1.5) * (1 - ramp(t, P(24) - 0.1, P(24) + 0.2));
  const flash = t >= P(24) ? 0.9 * (1 - ramp(t, P(24), P(24) + 0.35)) : 0;
  const shots: Sh[] = [
    { id: CLOCK_N, t: 0, r: FULL, f: [0.5, 0.5], mv: "in", tr: "fade", rot: 1.5 },
    { id: "stop", t: P(21), f: [0.5, 0.6], mv: "pr", tr: "page", rot: -1 },
    { id: "horn", t: P(22), r: FULL, f: [0.4, 0.3], mv: "in", tr: "zoom", m: (S) => <Waves x={S * 0.43} y={S * 0.2} S={S} a={P(22, 2.7)} e={P(22, 4.5)} /> },
    { id: "horn", t: P(22, 4.5), r: FULL, f: [0.32, 0.18], z: 1.8, mv: "pr", tr: "zoom" },
    { id: "lane-switch", t: P(23), r: FULL, f: [0.72, 0.4], z: 1.35, mv: "pu", tr: "page", rot: -2 },
    { id: "move", t: P(24), r: FULL, f: [0.3, 0.6], mv: "in", tr: "zoom" },
    { id: "move", t: P(24, 2.4), r: FULL, f: [0.7, 0.62], z: 1.3, mv: "pl", tr: "wr", m: (S) => <Ar x1={S * 0.45} y1={S * 0.9} x2={S * 0.85} y2={S * 0.9} a={P(24, 2.5)} w={20} /> },
  ];
  const ev: Ev[] = [...sfxOf(shots), [P(20, 2.7), "thud", 0.6], [P(22, 2.7), "horn", 0.5], ...ticks(P(23, 0.2), P(24), 0.5, 0.3), [P(24, 0.05), "ding", 0.3]];
  return (
    <>
      <SvgFrame>
        <Cam dur={dur} z1={1.04} amt={0.6}>
          <Shots id="night" list={shots} dur={dur} />
        </Cam>
        <rect width={1920} height={1080} fill="#0B1530" opacity={dim} />
        <Cam dur={dur} z1={1.05} dx={-20} amt={1.3}>
          <Pill x={510} y={200} text="NON-ESSENTIAL TRAFFIC" size={42} a={P(20, 1.5)} b={P(21)} color={teal} />
          <Kin x={510} y={380} text="BANNED" size={150} fill={RED} rot={-6} a={P(20, 2.6)} b={P(21)} />
          <Ov x={510} y={640} s={0.74} a={P(20, 3.1)} b={P(21)}>
            <NightBar a={P(20, 3.2)} />
          </Ov>
          <Kin x={700} y={150} text="04:50" size={200} fill={orange} a={P(21, 0.3)} b={P(22)} />
          <Pill x={960} y={800} text="TRAFFIC HALTED" a={P(21, 1.9)} b={P(22)} />
          <Kin x={1460} y={210} text="HORN!" size={200} fill={orange} rot={5} a={P(22, 2.6)} b={P(22, 4.4)} />
          <Pill x={960} y={730} text="CHANGE OVER" a={P(22, 5.7)} b={P(23)} color={teal} />
          <Pill x={1410} y={130} text="DRIVERS CROSS OVER" a={P(23, 0.3)} b={P(24)} />
          <Ov x={1410} y={380} a={P(23, 1.0)} b={P(24)}>
            <Sweep a={P(23, 1.7)} />
          </Ov>
          <Kin x={1410} y={680} text="10 MIN" size={170} fill={orange} a={P(23, 1.7)} b={P(24)} />
          <Kin x={960} y={190} text="05:00" size={260} fill={orange} a={P(24, 0.15)} b={P(24, 2.4)} />
          <Pill x={1100} y={700} text="ON THE RIGHT" size={56} a={P(24, 2.5)} color={teal} />
          <Pip x={230} y={790} a={P(24, 0.6)} s={0.8} mood="happy" hop />
        </Cam>
        <rect width={1920} height={1080} fill="#fff" opacity={flash} />
        <Simp shots={shots} dia={[[P(20, 3.1), P(21)], [P(23, 1.0), P(24)]]} />
        <Src text="Wikipedia" a={P(20, 0.3)} b={P(22)} />
        <Src text="99% Invisible (podcast)" a={P(22, 0.3)} b={P(23)} />
        <Src text="Popular Science" a={P(23, 0.3)} b={dur + 1} />
      </SvgFrame>
      <Sfx ev={ev} />
    </>
  );
};

/* ============ escena 5: aftermath (partes 25-30) ============ */
const SceneAfter: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const P = pk(c, 25);
  const shots: Sh[] = [
    { id: "car-growth", t: 0, f: [0.7, 0.5], z: 1.3, mv: "pu", tr: "cut", rot: -1 },
    { id: "move", t: P(26), r: FULL, f: [0.78, 0.55], z: 1.4, mv: "pu", tr: "wr", rot: 2 },
    { id: "steering", t: P(27), r: FULL, f: [0.37, 0.72], z: 1.2, mv: "in", tr: "zoom", m: (S) => <Ring x={S * 0.2} y={S * 0.68} rx={S * 0.12} ry={S * 0.09} a={P(27, 2.4)} e={P(28)} /> },
    { id: "graph", t: P(28), r: FULL, f: [0.5, 0.5], mv: "pd", tr: "wr", rot: 1.5 },
    { id: "graph", t: P(28, 3.4), r: FULL, f: [0.55, 0.35], z: 1.7, mv: "pl", tr: "zoom", rot: 1.5, m: (S) => <DrawOn d={`M${S * 0.28} ${S * 0.32} L${S * 0.79} ${S * 0.32}`} t0={P(28, 3.8)} t1={P(28, 4.5)} w={9} color={teal} /> },
    { id: "reporter", t: P(29), r: FULL, f: [0.5, 0.5], mv: "pr", tr: "page", rot: 1.5 },
    { id: "ballot", t: P(30), r: FULL, f: [0.6, 0.3], z: 1.75, mv: "in", tr: "zoom", rot: -1.5 },
  ];
  const ev: Ev[] = [...sfxOf(shots), [P(25, 0.7), "pop", 0.25], [P(26, 1.2), "pop", 0.25], [P(28, 2.2), "thud", 0.4]];
  return (
    <>
      <SvgFrame>
        <Cam dur={dur} z1={1.04} amt={0.6}>
          <Shots id="after" list={shots} dur={dur} />
        </Cam>
        <Cam dur={dur} z1={1.05} dx={-20} amt={1.3}>
          <Num x={1400} y={200} v={157} a={P(25, 0.5)} b={P(26)} size={260} dur={1.0} />
          <Pill x={1400} y={360} text="ACCIDENTS REPORTED" a={P(25, 1.8)} b={P(26)} />
          <Pill x={480} y={800} text="FEW SERIOUS" a={P(25, 3.5)} b={P(26)} color={teal} />
          <Pip x={1700} y={790} a={P(25, 3.6)} b={P(26)} s={0.7} mood="happy" />
          <Ov x={510} y={470} a={P(26, 0.6)} b={P(27)}>
            <rect x={-290} y={-260} width={580} height={590} rx={26} fill={CARD} stroke={ink} strokeWidth={6} />
            <Band a={P(26, 0.9)} />
          </Ov>
          <Pill x={720} y={838} text="FEWER THAN EARLIER MONDAYS" size={34} a={P(26, 2.8)} b={P(27)} />
          <Pill x={1500} y={150} text="EXPERTS" a={P(27, 1.0)} b={P(28)} color={teal} />
          <Kin x={960} y={820} text="EXTRA CAUTION" size={130} fill={orange} a={P(27, 2.2)} b={P(28)} />
          <Pill x={510} y={130} text="GAINS FADED" a={P(28, 0.6)} b={P(29)} color={RED} />
          <Kin x={510} y={260} text="1967" size={160} a={P(28, 0.3)} b={P(29)} />
          <Ar x1={510} y1={360} x2={510} y2={470} a={P(28, 1.0)} e={P(29)} />
          <Kin x={510} y={600} text="1969" size={160} fill={orange} a={P(28, 2.2)} b={P(29)} />
          <Pill x={510} y={735} text="BACK TO THE START" size={46} a={P(28, 4.4)} b={P(29)} color={teal} />
          <Pill x={1410} y={150} text="NOT EVERYONE WANTED IT" size={50} a={P(29, 0.8)} b={P(30)} color={RED} />
          <Kin x={1410} y={400} text="1955" size={170} a={P(30, 0.8)} />
          <Pill x={1410} y={580} text="MOST VOTERS SAID NO" size={52} a={P(30, 1.6)} color={RED} />
          <Pill x={1410} y={720} text="THE SWITCH WENT AHEAD" size={46} a={P(30, 3.4)} color={teal} />
        </Cam>
        <Simp shots={shots} dia={[[P(26, 0.6), P(27)]]} />
        <Src text="Popular Science" a={P(25, 0.3)} b={P(26)} />
        <Src text="Wikipedia" a={P(26, 0.3)} b={P(30, -0.2)} />
      </SvgFrame>
      <Sfx ev={ev} />
    </>
  );
};

/* ============ escena 6: close (partes 31-34) ============ */
/** Tarjeta final: titulo elegido sobre papel, en los ultimos segundos. */
const EndCard: React.FC<{ a: number }> = ({ a }) => {
  const o = ramp(useT(), a, a + 0.5);
  const tx = { textAnchor: "middle" as const, fontFamily: theme.font, fontWeight: 900 };
  return o > 0 ? (
    <g opacity={o}>
      <image href={staticFile("illustrations/em023-bug.png")} x={0} y={0} width={1920} height={1080} preserveAspectRatio="xMidYMid slice" />
      <rect width={1920} height={1080} fill="#10151C" opacity={0.62} />
      <text x={960} y={430} fontSize={88} fill="#FFFFFF" {...tx}>THE MORNING AN ENTIRE COUNTRY</text>
      <text x={960} y={540} fontSize={88} fill="#FFFFFF" {...tx}>CHANGED SIDES OF THE ROAD</text>
      <rect x={860} y={600} width={200} height={8} fill={orange} />
      <text x={960} y={690} fontSize={44} fill={CARD} {...tx}>THE EVERYDAY MYSTERY</text>
    </g>
  ) : null;
};
const SceneClose: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const P = pk(c, 31);
  const shots: Sh[] = [
    { id: "calendar", t: 0, r: FULL, f: [0.6, 0.3], z: 1.3, mv: "pl", tr: "cut", rot: -1 },
    { id: "move", t: P(32), r: FULL, f: [0.25, 0.5], z: 1.3, mv: "pd", tr: "pop", rot: -1.5 },
    { id: "calendar", t: P(32, 1.8), r: FULL, f: [0.8, 0.3], z: 1.7, mv: "in", tr: "zoom" },
    { id: "bug", t: P(33, 1.4), r: FULL, f: [0.22, 0.46], z: 1.6, mv: "in", tr: "zoom", m: (S) => <Ring x={S * 0.22} y={S * 0.46} rx={S * 0.05} ry={S * 0.04} a={P(33, 1.9)} /> },
    { id: "bug", t: P(34), r: FULL, f: [0.34, 0.35], mv: "out", tr: "wl", rot: 2 },
  ];
  const ev: Ev[] = [...sfxOf(shots), [P(33, 1.45), "pop", 0.3], [P(34, 0.3), "ding", 0.35]];
  return (
    <>
      <SvgFrame>
        <Cam dur={dur} z1={1.04} amt={0.6}>
          <Shots id="close" list={shots} dur={dur} />
        </Cam>
        <Cam dur={dur} z1={1.05} dx={-20} amt={1.3}>
          <Reading x={400} y={100} a={P(31, 0.1)} b={P(32)} />
          <Kin x={960} y={830} text="PLANNED FOR YEARS" size={84} a={P(31, 2.3)} b={P(32)} fill={orange} />
          <Kin x={510} y={250} text="WELL-PLANNED" size={100} a={P(32, 0.2)} b={P(32, 1.9)} />
          <Kin x={510} y={360} text="SYSTEM" size={100} fill={teal} a={P(32, 0.6)} b={P(32, 1.9)} />
          <Pip x={360} y={780} a={P(32, 0.8)} b={P(32, 1.9)} s={1} mood="thinking" arm="chin" />
          <Kin x={960} y={150} text="TINY FAULT" size={160} fill={orange} a={P(32, 2.0)} b={P(33)} />
          <Pill x={960} y={150} text="IN MACHINES" size={56} a={P(33, 0.15)} b={P(33, 1.4)} color={teal} />
          <Kin x={1300} y={220} text="BUGS" size={260} fill={orange} a={P(33, 1.45)} b={P(34)} />
          <Pip x={1650} y={790} a={P(33, 1.6)} b={P(34)} s={0.8} mood="surprised" />
          <Kin x={520} y={300} text="WHERE FROM?" size={100} fill={orange} a={P(34, 0.2)} />
          <Pip x={300} y={790} a={P(34, 0.4)} s={1.1} arm="chin" />
          
        </Cam>
        <Simp shots={shots} />
        <EndCard a={P(34, 1.5)} />
      </SvgFrame>
      <Sfx ev={ev} />
    </>
  );
};

export const SCENES023: Record<string, React.FC<SceneProps>> = {
  hook: SceneHook,
  reasons: SceneReasons,
  preparation: ScenePrep,
  night: SceneNight,
  aftermath: SceneAfter,
  close: SceneClose,
};
