// EM-035 (papel higienico: over o under) v1.2. Patentes reales (public/images/em035-us*.png) = "Original document"; columnas/cartas = "Our recreation"; diagramas = "Simplified illustration"; fotos = "Illustrative image" / "AI illustration".
import React from "react";
import { staticFile } from "remotion";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import world from "world-atlas/countries-110m.json";
import { ramp } from "../utils/anim";
import { theme } from "../themes/brand";
import type { SceneProps } from "./scenes";
import { Cam } from "./kit2";
import { ink, orange, SvgFrame, teal, Txt, useT } from "./kit";
import { Kin, Ov, Pill, Reading, Sfx, sfxOf, Shots, FULL } from "./scenes023";
import type { Ev, Sh } from "./scenes023";
import { Lab, Stp, thud } from "./scenes025";
import { Cite } from "./v2";

const CARD = "#FFFDF6";
const GREY = "#6B7280";
const ORIG = "Original document";
const REC = "Our recreation";
const SIMP = "Simplified illustration";
const IMG = "Illustrative image";
const HL = "Highlight added by us";
const AIL = IMG; // unificado: una sola etiqueta para toda imagen generada
const WIN = { x: 170, y: 130, w: 660, h: 670 };
const RZ = 1400; // centro de la zona derecha (junto a la ventana de patente)

type PF = (n: number, o?: number) => number;
type Out = { shots?: Sh[]; ov: React.ReactNode; top?: React.ReactNode; ev?: Ev[] };
const scene = (from: number, id: string, mk: (P: PF) => Out): React.FC<SceneProps> => ({ cues, dur }) => {
  const P: PF = (n, o = 0) => (cues[n - from] ?? dur) + o;
  const { shots = [], ov, top, ev = [] } = mk(P);
  return (
    <>
      <SvgFrame>
        {shots.length > 0 && (
          <Cam dur={dur} z1={1.04} amt={0.6}>
            <Shots id={id} list={shots} dur={dur} asp={16 / 9} src={(k) => staticFile(`illustrations/${k}.png`)} />
          </Cam>
        )}
        <Cam dur={dur} z1={1.03} dx={-12} amt={1}>
          {ov}
        </Cam>
        {top}
      </SvgFrame>
      <Sfx ev={[...sfxOf(shots), ...ev]} />
    </>
  );
};
/** Foto de IA a pantalla completa (id = nombre sin "em035-" ni "-v1"). */
const ph = (id: string, t: number, o: Partial<Sh> = {}): Sh => ({ id: id.startsWith("v2-") ? `em035${id}-v1` : `em035-${id}-v1`, t, r: FULL, mv: "in", tr: "wl", ...o });
/** Tamano de texto auto-ajustado a un ancho maximo. */
const fz = (text: string, size: number, w: number, k = 0.62) => Math.min(size, Math.floor(w / (text.length * k)));
const kn = (P: PF, n: number, text: string, o: { m?: number; x?: number; y?: number; size?: number; fill?: string; at?: number; w?: number; bo?: number } = {}) => (
  <Kin key={`${n}${text}`} x={o.x ?? 960} y={o.y ?? 140} text={text} a={P(n, o.at ?? 0)} b={P(o.m ?? n + 1, o.bo ?? 0)} size={fz(text, o.size ?? 88, o.w ?? 1500, 0.66)} fill={o.fill ?? teal} />
);
const pl = (P: PF, n: number, text: string, o: { m?: number; x?: number; y?: number; size?: number; color?: string; at?: number; w?: number } = {}) => (
  <Pill key={`${n}${text}`} x={o.x ?? 960} y={o.y ?? 150} text={text} a={P(n, o.at ?? 0)} b={P(o.m ?? n + 1)} size={fz(text, o.size ?? 40, (o.w ?? 1500) - 64, 0.66)} color={o.color} />
);
const rd = (P: PF, n: number, m = n + 1, x = 960, y = 150) => <Reading key={`r${n}`} x={x} y={y} a={P(n)} b={P(m)} />;
/** v2: nunca papel. Fondo = foto Flow (a sangre, o desenfocada bajo un esquema) con velo blanco luminoso opcional entre a y b. */
const Veil: React.FC<{ a: number; b: number; o?: number }> = ({ a, b, o = 0.3 }) => {
  const t = useT();
  const v = ramp(t, a, a + 0.3) * (1 - ramp(t, b - 0.3, b)) * o;
  return v > 0 ? <rect width={1920} height={1080} fill="#fff" opacity={v} /> : null;
};
/** Fondo desenfocado (esquema/documento encima). */
const bg = (id: string, t: number, bl = 12, o: Partial<Sh> = {}): Sh => ph(id, t, { bl, z: 1.15, tr: "fade", ...o });
/** Foto nitida, cambio con fundido. */
const sh = (id: string, t: number, o: Partial<Sh> = {}): Sh => ph(id, t, { tr: "fade", ...o });

/* ============ piezas ============ */
/** Pagina de patente (PNG de Google Patents, dominio publico) en una ventana; fx/fy = punto de la pagina al centro; marks en fracciones de la pagina. */
const Pat: React.FC<{ f: string; k: string; x?: number; y?: number; w?: number; h?: number; a: number; b: number; fx?: number; fy?: number; z?: number; marks?: [number, number, number, number][]; m0?: number; veil?: boolean }> = ({ f, k, x = WIN.x, y = WIN.y, w = WIN.w, h = WIN.h, a, b, fx = 0.5, fy = 0.3, z = 1, marks = [], m0, veil }) => {
  const t = useT();
  const o = ramp(t, a, a + 0.35) * (1 - ramp(t, b - 0.35, b));
  if (o <= 0) return null;
  const u = Math.min(1, Math.max(0, (t - a) / Math.max(1, b - a)));
  const W = w * z * (1 + 0.06 * u);
  const H = (W * 3408) / 2320;
  const ix = Math.max(x + w - W, Math.min(x, x + w / 2 - fx * W));
  const iy = Math.max(y + h - H * 0.94, Math.min(y, y + h / 2 - fy * H));
  const s0 = m0 ?? a + 0.6;
  return (
    <g opacity={o}>
      <defs>
        <clipPath id={`pc-${k}`}>
          <rect x={x} y={y} width={w} height={h} rx={10} />
        </clipPath>
      </defs>
      <rect x={x + 10} y={y + 14} width={w} height={h} rx={10} fill={ink} opacity={0.2} />
      <rect x={x} y={y} width={w} height={h} rx={10} fill="#fff" />
      <g clipPath={`url(#pc-${k})`}>
        <image href={staticFile(`images/em035-${f}.png`)} x={ix} y={iy} width={W} height={H} preserveAspectRatio="none" opacity={veil ? 0.3 : 1} />
        {marks.map((m, i) => {
          const g = ramp(t, s0 + i * 0.5, s0 + 0.35 + i * 0.5);
          return <rect key={i} x={ix + m[0] * W} y={iy + m[1] * H} width={(m[2] - m[0]) * W} height={(m[3] - m[1]) * H} rx={4} fill={orange} opacity={0.2 * g} stroke={orange} strokeWidth={4} strokeOpacity={g} />;
        })}
      </g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="none" stroke={ink} strokeWidth={3} />
    </g>
  );
};
/** Vista lateral de un rollo en la pared: over = la hoja cae por delante (lado alejado de la pared); under = baja pegada a la pared. */
const Roll: React.FC<{ x: number; y: number; over: boolean; a: number; b?: number; s?: number; label?: string; q?: boolean }> = ({ x, y, over, a, b, s = 1, label, q }) => (
  <Ov x={x} y={y} a={a} b={b} s={s} lim={1.05}>
    <rect x={-190} y={-230} width={26} height={520} rx={8} fill={GREY} opacity={0.4} />
    <rect x={-164} y={-24} width={96} height={16} rx={7} fill={GREY} />
    <path d={over ? "M0 -114 Q84 -114 84 -14 L84 236" : "M0 86 Q-84 86 -84 150 L-84 236"} fill="none" stroke={ink} strokeWidth={36} strokeLinecap="butt" />
    <path d={over ? "M0 -114 Q84 -114 84 -14 L84 236" : "M0 86 Q-84 86 -84 150 L-84 236"} fill="none" stroke="#fff" strokeWidth={26} strokeLinecap="butt" />
    <circle cx={0} cy={-14} r={100} fill="#fff" stroke={ink} strokeWidth={7} />
    <circle cx={0} cy={-14} r={64} fill="none" stroke={ink} strokeWidth={3} opacity={0.45} />
    <circle cx={0} cy={-14} r={30} fill={CARD} stroke={ink} strokeWidth={5} />
    {q && (
      <Txt x={0} y={-8} size={96} fill={orange}>
        ?
      </Txt>
    )}
    {label && (
      <Txt x={0} y={322} size={fz(label, 54, 520, 0.6)} fill={over ? teal : orange}>
        {label}
      </Txt>
    )}
  </Ov>
);
/** Tarjeta de maquina de escribir ("Our recreation"): frases cortas con fecha, nunca la pagina real. */
const Typed: React.FC<{ x: number; y: number; w?: number; lines: string[]; head: string; a: number; b?: number; size?: number; rot?: number }> = ({ x, y, w = 820, lines, head, a, b, size = 38, rot = -1.5 }) => {
  const h = 130 + lines.length * size * 1.5;
  return (
    <Ov x={x} y={y} a={a} b={b} rot={rot} lim={1.05}>
      <rect x={-w / 2 + 10} y={-h / 2 + 14} width={w} height={h} rx={8} fill={ink} opacity={0.16} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} fill="#F8EFD6" stroke={GREY} strokeWidth={3} strokeDasharray="14 8" />
      <text x={-w / 2 + 34} y={-h / 2 + 54} fontFamily="Courier New, monospace" fontWeight={700} fontSize={28} fill={GREY}>
        {head}
      </text>
      {lines.map((l, i) => (
        <text key={l} x={-w / 2 + 34} y={-h / 2 + 120 + i * size * 1.5} fontFamily="Courier New, monospace" fontWeight={700} fontSize={size} fill={ink}>
          {l}
        </text>
      ))}
    </Ov>
  );
};
/** Barras animadas (valores %; 59 = 100% del ancho). */
const Bars: React.FC<{ rows: [string, number, string][]; x: number; y: number; a: number; b?: number; w?: number; s?: number }> = ({ rows, x, y, a, b, w = 940, s = 1 }) => {
  const t = useT();
  return (
    <Ov x={x} y={y} a={a} b={b} s={s} lim={1.04}>
      <rect x={-w / 2 - 40} y={-60} width={w + 80} height={rows.length * 128 + 70} rx={26} fill={CARD} stroke={ink} strokeWidth={4} />
      {rows.map(([l, v, c], i) => {
        const g = ramp(t, a + 0.4 + i * 0.5, a + 1.4 + i * 0.5);
        return (
          <g key={l} transform={`translate(${-w / 2} ${i * 128 - 30})`}>
            <text x={0} y={30} dominantBaseline="central" fontFamily={theme.font} fontWeight={800} fontSize={38} fill={ink}>
              {l}
            </text>
            <rect x={0} y={56} width={(w - 150) * (v / 59) * g} height={44} rx={10} fill={c} />
            <text x={(w - 150) * (v / 59) * g + 16} y={78} dominantBaseline="central" fontFamily={theme.font} fontWeight={900} fontSize={46} fill={ink}>
              {Math.round(v * g)}%
            </text>
          </g>
        );
      })}
    </Ov>
  );
};
/** Cadena de eslabones; el ultimo, punteado con "?". */
const Chain: React.FC<{ nodes: string[]; y: number; a: number; b?: number; step?: number }> = ({ nodes, y, a, b, step = 0.7 }) => {
  const gap = (1590 - 330) / (nodes.length - 1);
  return (
    <>
      {nodes.map((n, i) => {
        const last = i === nodes.length - 1;
        return (
          <Ov key={n} x={330 + i * gap} y={y} a={a + i * step} b={b} lim={1.05}>
            <rect x={-150} y={-70} width={300} height={140} rx={22} fill={CARD} stroke={last ? GREY : teal} strokeWidth={6} strokeDasharray={last ? "14 10" : undefined} />
            <Txt x={0} y={2} size={fz(n, 34, 270, 0.55)} fill={last ? GREY : ink}>
              {n}
            </Txt>
          </Ov>
        );
      })}
      {nodes.slice(1).map((n, i) => (
        <Ov key={`ar${n}`} x={330 + i * gap + gap / 2} y={y} a={a + (i + 1) * step} b={b}>
          <Txt x={0} y={0} size={56} fill={GREY}>
            {"→"}
          </Txt>
        </Ov>
      ))}
    </>
  );
};
/** Esquema de corte entre dos hojas: angular (con lengueta) o curvo (arco). */
const Cut: React.FC<{ x: number; y: number; curved?: boolean; a: number; b?: number; label: string }> = ({ x, y, curved, a, b, label }) => {
  const edge = curved ? "M-120 20 Q0 -22 120 20" : "M-120 20 L-18 20 L0 0 L18 20 L120 20";
  const up = curved ? "M-120 -110 L120 -110 L120 20 Q0 -22 -120 20 Z" : "M-120 -110 L120 -110 L120 20 L18 20 L0 0 L-18 20 L-120 20 Z";
  const lo = curved ? "M-120 20 Q0 -22 120 20 L120 120 L-120 120 Z" : "M-120 20 L-18 20 L0 0 L18 20 L120 20 L120 120 L-120 120 Z";
  return (
    <Ov x={x} y={y} a={a} b={b} lim={1.05}>
      <rect x={-190} y={-160} width={380} height={370} rx={20} fill={CARD} stroke={ink} strokeWidth={4} />
      <path d={up} fill="#fff" stroke={ink} strokeWidth={4} />
      <path d={lo} fill="#fff" stroke={ink} strokeWidth={4} />
      <path d={edge} fill="none" stroke={orange} strokeWidth={6} strokeDasharray="10 8" />
      <Txt x={0} y={170} size={fz(label, 32, 350, 0.6)} fill={curved ? orange : teal}>
        {label}
      </Txt>
    </Ov>
  );
};
/** Linea de tiempo de patentes de Wheeler (solo fechas y numeros). */
const TL: [string, string][] = [["1871", "US 117,355"], ["1883", "US 272,369"], ["1884", "US 297,043"], ["1890", "US 438,457"], ["1891", "US 465,588"]];
const Timeline: React.FC<{ a: number; b?: number }> = ({ a, b }) => (
  <>
    <Ov x={960} y={470} a={a} b={b} lim={1.02}>
      <rect x={-760} y={-5} width={1520} height={10} rx={5} fill={ink} opacity={0.7} />
    </Ov>
    {TL.map(([yr, n], i) => (
      <Ov key={yr} x={260 + i * 350} y={470} a={a + 0.4 + i * 0.5} b={b} lim={1.06}>
        <circle r={22} fill={i === 4 ? orange : teal} stroke={ink} strokeWidth={5} />
        <Txt x={0} y={-80} size={62} fill={ink}>
          {yr}
        </Txt>
        {i === 4 && <rect x={-70} y={-40} width={140} height={10} rx={5} fill={orange} />}
        <Txt x={0} y={86} size={36} fill={ink}>
          {n}
        </Txt>
      </Ov>
    ))}
  </>
);
/** Mapa mundial plano (Natural Earth); resalta paises y marca puntos. */
const PROJ = geoNaturalEarth1().scale(190).translate([500, 270]);
const GEO = feature(world as never, (world as never as { objects: { countries: never } }).objects.countries) as unknown as { features: { properties: { name: string }; geometry: never }[] };
const PATHS = GEO.features.filter((f) => f.properties.name !== "Antarctica").map((f) => ({ n: f.properties.name, d: geoPath(PROJ)(f.geometry) ?? "" }));
const WorldMap: React.FC<{ x: number; y: number; a: number; b?: number; hl?: string[]; dots?: [string, number, number, number, ("l" | "b")?][]; s?: number }> = ({ x, y, a, b, hl = [], dots = [], s = 1 }) => {
  const t = useT();
  return (
    <Ov x={x} y={y} a={a} b={b} s={s} lim={1.03}>
      <g transform="translate(-500 -270)">
        <rect x={-30} y={-20} width={1060} height={580} rx={26} fill={CARD} stroke={ink} strokeWidth={4} />
        {PATHS.map((p) => (
          <path key={p.n} d={p.d} fill={hl.includes(p.n) ? teal : "#D9D3C0"} stroke="#fff" strokeWidth={0.8} />
        ))}
        {dots.map(([n, lo, la, at, side]) => {
          const [px, py] = PROJ([lo, la]) ?? [0, 0];
          const g = ramp(t, at, at + 0.35);
          return (
            <g key={n} opacity={g} transform={`translate(${px} ${py})`}>
              <circle r={14} fill={orange} stroke={ink} strokeWidth={4} />
              <text x={side === "l" ? -26 : 0} y={side === "l" ? 12 : side === "b" ? 62 : -26} textAnchor={side === "l" ? "end" : "middle"} fontFamily={theme.font} fontWeight={900} fontSize={34} fill={ink} stroke={CARD} strokeWidth={8} strokeLinejoin="round" paintOrder="stroke">
                {n}
              </text>
            </g>
          );
        })}
      </g>
    </Ov>
  );
};
/** Panel pared + rollo + mano: under = la mano roza la pared; over = no. */
const WallHand: React.FC<{ x: number; y: number; under?: boolean; a: number; b?: number }> = ({ x, y, under, a, b }) => (
  <Ov x={x} y={y} a={a} b={b} lim={1.04}>
    <rect x={-290} y={-230} width={580} height={470} rx={22} fill={CARD} stroke={ink} strokeWidth={4} />
    <rect x={-200} y={-200} width={24} height={410} rx={6} fill={GREY} opacity={0.5} />
    <circle cx={-90} cy={-90} r={80} fill="#fff" stroke={ink} strokeWidth={6} />
    <circle cx={-90} cy={-90} r={24} fill={CARD} stroke={ink} strokeWidth={4} />
    <rect x={under ? -164 : -14} y={-84} width={22} height={240} rx={4} fill="#fff" stroke={ink} strokeWidth={4} />
    <ellipse cx={under ? -150 : 30} cy={190} rx={46} ry={34} fill={orange} stroke={ink} strokeWidth={4} />
    <Txt x={0} y={285} size={36} fill={under ? orange : teal}>
      {under ? "UNDER: HAND NEAR WALL" : "OVER: HAND AWAY"}
    </Txt>
  </Ov>
);
/** Tres iconos del test en columna a la izquierda (<= 35 % del ancho): hojas por tiron, perforaciones rotas, mano-pared. */
const TEST: [string, string, React.ReactNode][] = [
  ["SHEETS PER PULL", teal, [0, 1, 2].map((i) => <rect key={i} x={-90 + i * 24} y={-100 + i * 18} width={150} height={190} rx={6} fill="#fff" stroke={ink} strokeWidth={4} />)],
  ["TORN PERFORATIONS", orange, <path d="M-130 -90 H130 M-130 0 L-20 0 L0 -20 L20 0 L130 0 M-130 90 H130 M-130 -90 V90 M130 -90 V90" stroke={ink} strokeWidth={6} fill="none" strokeDasharray="12 8" />],
  ["HAND TOUCHES THE WALL", teal, <><rect x={-130} y={-120} width={22} height={240} rx={6} fill={GREY} opacity={0.5} /><ellipse cx={-60} cy={20} rx={52} ry={40} fill={orange} stroke={ink} strokeWidth={4} /></>],
];
const TestIcons: React.FC<{ a: number; b: number }> = ({ a, b }) => (
  <>
    {TEST.map(([l, c, ic], i) => (
      <Ov key={l} x={355} y={330 + i * 210} a={a + i} b={b} lim={1.05}>
        <rect x={-310} y={-85} width={620} height={170} rx={24} fill={CARD} stroke={c} strokeWidth={6} />
        <g transform="translate(-205 0) scale(0.6)">{ic}</g>
        <text x={-100} y={0} dominantBaseline="central" fontFamily={theme.font} fontWeight={800} fontSize={fz(l, 36, 390, 0.62)} fill={ink}>
          {l}
        </text>
      </Ov>
    ))}
  </>
);
/** Tarjeta final de 6 s sobre papel, tras el ultimo subtitulo. */
const EndCard: React.FC<{ a: number }> = ({ a }) => {
  const o = ramp(useT(), a, a + 0.3);
  const tx = { textAnchor: "middle" as const, fontFamily: theme.font, fontWeight: 900 };
  return o > 0 ? (
    <g opacity={o}>
      <image href={staticFile("illustrations/em035v2-13-perforation-macro-v1.png")} width={1920} height={1080} preserveAspectRatio="xMidYMid slice" style={{ filter: "blur(10px)" }} transform="translate(-96 -54) scale(1.1)" />
      <rect width={1920} height={1080} fill="#fff" opacity={0.55} />
      <text x={960} y={420} fontSize={88} fill={ink} {...tx}>TOILET PAPER: OVER OR UNDER?</text>
      <text x={960} y={530} fontSize={56} fill={ink} {...tx}>THE ANSWER IS NOT IN THE PATENT</text>
      <rect x={860} y={600} width={200} height={8} fill={orange} />
      <text x={960} y={690} fontSize={44} fill={teal} {...tx}>THE EVERYDAY MYSTERY</text>
    </g>
  ) : null;
};
const Foot = Lab;

/* ============ ch01 gancho (0-9) ============ */
const ch01 = scene(0, "ch01", (P) => ({
  shots: [ph("v2-16-old-holders-flatlay", 0, { tr: "cut" }), sh("portada-B-hero", P(5)), sh("portada-A-over-under", P(6)), sh("v2-01-stamps-desk", P(7)), sh("v2-09-pack-blue", P(9))],
  ov: (
    <>
      <Pat f="us465588-p0" k="a" a={P(0)} b={P(3)} fx={0.44} fy={0.43} z={1.3} marks={[[0.39, 0.25, 0.66, 0.63]]} m0={P(1)} />
      {kn(P, 0, "AN 1891 PATENT", { m: 1, x: RZ, y: 280, w: 860 })}
      {kn(P, 0, "SETTLES THE WAR?", { m: 1, x: RZ, y: 420, w: 860, fill: orange, at: 1.2 })}
      {kn(P, 1, "THE PAPER HANGS", { m: 2, x: RZ, y: 300, w: 860 })}
      {kn(P, 1, "OVER THE ROLL", { m: 2, x: RZ, y: 440, w: 860, fill: orange, at: 0.7 })}
      {kn(P, 2, "CASE CLOSED?", { m: 3, x: RZ, y: 380, w: 860, size: 120, fill: orange })}
      <Pat f="us465588-p1" k="b" a={P(3)} b={P(5)} fx={0.5} fy={0.42} z={1.45} marks={[[0.06, 0.325, 0.44, 0.835], [0.44, 0.325, 0.82, 0.78]]} m0={P(3, 0.4)} />
      {kn(P, 3, "WE READ IT ALL", { m: 4, x: RZ, y: 300, w: 860, size: 100 })}
      {pl(P, 4, "WALL, HOLDER, TOP, BOTTOM, OVER, UNDER: 0", { m: 5, x: RZ, y: 400, w: 860, color: orange })}
      {pl(P, 4, "0 WORDS ON HOW TO MOUNT THE ROLL", { m: 5, x: RZ, y: 540, w: 860, color: teal, at: 1.4 })}
      {kn(P, 5, "WHICH FAMOUS", { m: 6, x: 560, y: 250, w: 920, size: 120 })}
      {kn(P, 5, "PROOF", { m: 6, x: 560, y: 390, w: 920, size: 120, at: 0.5 })}
      {kn(P, 5, "IS A MYTH?", { m: 6, x: 560, y: 550, w: 920, size: 150, fill: orange, at: 1.0 })}
      {pl(P, 6, "OVER", { m: 7, x: 380, y: 800, color: teal, size: 52 })}
      {pl(P, 6, "UNDER", { m: 7, x: 1180, y: 800, color: orange, size: 52, at: 0.4 })}
      {kn(P, 6, "YOUR SIDE.", { m: 7, x: 380, y: 200, w: 560, size: 90, fill: orange, at: 0.5 })}
      {kn(P, 6, "EVIDENCE?", { m: 7, x: 380, y: 320, w: 560, size: 90, fill: orange, at: 1.0 })}
      {kn(P, 7, "FOUR BOXES", { m: 8, y: 460, size: 130 })}
      <Stp x={560} y={380} k="D" a={P(8)} b={P(9)} size={52} rot={-5} />
      <Stp x={1360} y={380} k="P" a={P(8, 0.9)} b={P(9)} size={52} rot={4} />
      <Stp x={560} y={620} k="M" a={P(8, 1.7)} b={P(9)} size={52} rot={5} />
      <Stp x={1360} y={620} k="N" a={P(8, 2.5)} b={P(9)} size={44} rot={-4} />
      {kn(P, 9, "THE EVERYDAY", { m: 10, bo: -0.6, x: 560, y: 330, w: 920, size: 120, fill: ink })}
      {kn(P, 9, "MYSTERY", { m: 10, bo: -0.6, x: 560, y: 470, w: 920, size: 120, fill: orange, at: 0.4 })}
    </>
  ),
  top: (
    <>
      <Foot text={ORIG} a={P(0)} b={P(5)} />
      <Foot text={HL} a={P(1)} b={P(3)} y={776} />
      <Foot text={HL} a={P(3, 0.4)} b={P(5)} y={776} />
      <Cite text="US Patent 465,588 (Seth Wheeler, 1891)" a={P(0)} b={P(5)} />
      <Foot text={IMG} a={P(5)} b={P(7)} />
      <Foot text={IMG} a={P(7)} b={P(10)} />
    </>
  ),
  ev: [thud(P(8)), thud(P(8, 0.9)), thud(P(8, 1.7)), thud(P(8, 2.5))],
}));

/* ============ ch02 la patente de 1891 (10-33) ============ */
const ch02 = scene(10, "ch02", (P) => ({
  shots: [ph("05-albany-street-1891", 0, { tr: "cut" }), ph("06-paper-perforating-workshop-1885", P(12)), sh("v2-02-drafting-desk-1891", P(13)), sh("v2-02-drafting-desk-1891", P(23)), sh("v2-16-old-holders-flatlay", P(26)), sh("v2-02-drafting-desk-1891", P(27)), ph("13-inventor-drafting-desk-1890", P(29), { tr: "fade" }), sh("v2-03-newsroom-2015", P(31))],
  ov: (
    <>
      <Veil a={P(23)} b={P(25)} o={0.3} />
      {kn(P, 10, "FIRST, THE PATENT", { m: 11, y: 130, size: 100 })}
      {pl(P, 11, "SETH WHEELER - ALBANY, NEW YORK", { m: 12, y: 140 })}
      {kn(P, 12, "NEARLY 100 PATENTS", { m: 13, y: 130, size: 100 })}
      <Pat f="us465588-p0" k="c" a={P(13)} b={P(16)} fx={0.5} fy={0.17} z={1.15} marks={[[0.12, 0.1, 0.8, 0.18]]} m0={P(13, 1.5)} />
      {kn(P, 13, "TOILET-PAPER ROLL", { m: 14, x: RZ, y: 300, w: 860 })}
      {pl(P, 13, "GRANTED 22 DEC 1891", { m: 14, x: RZ, y: 440, w: 860, color: orange, at: 1.6 })}
      {kn(P, 14, "ONE SHEET HANGS", { m: 16, x: RZ, y: 300, w: 860 })}
      {kn(P, 14, "FROM THE TOP", { m: 16, x: RZ, y: 440, w: 860, fill: orange, at: 0.7 })}
      <Stp x={RZ} y={620} k="D" a={P(15)} b={P(16)} size={64} />
      <Pat f="us465588-p0" k="d" a={P(16)} b={P(17)} fx={0.44} fy={0.43} z={1.3} />
      {kn(P, 16, "NO WALL.", { m: 17, x: RZ, y: 300, w: 860, size: 130, fill: orange })}
      {kn(P, 16, "NO HOLDER.", { m: 17, x: RZ, y: 480, w: 860, size: 130, fill: orange, at: 1.2 })}
      <Pat f="us465588-p1" k="e" a={P(17)} b={P(18)} fx={0.5} fy={0.42} z={1.45} />
      {kn(P, 17, "HOW TO MOUNT A ROLL:", { m: 18, x: RZ, y: 280, w: 860, size: 80 })}
      {kn(P, 17, "NOT ONCE", { m: 18, x: RZ, y: 450, w: 860, size: 150, fill: orange, at: 1.4 })}
      <Pat f="us465588-p1" k="f" a={P(18)} b={P(23)} fx={0.25} fy={0.6} z={1.7} marks={[[0.06, 0.595, 0.43, 0.62]]} m0={P(18, 0.6)} />
      {kn(P, 18, "IT IS ABOUT", { m: 19, x: RZ, y: 300, w: 860, size: 90 })}
      {kn(P, 18, "PERFORATIONS", { m: 19, x: RZ, y: 450, w: 860, size: 100, fill: orange, at: 0.7 })}
      <Cut x={1210} y={400} a={P(19)} b={P(23)} label="ANGLED CUT: CLEAN TEAR" />
      <Cut x={1650} y={400} curved a={P(20)} b={P(23)} label="CURVED: FIND THE END" />
      {kn(P, 21, "NOT THE DIRECTION", { m: 22, x: RZ, y: 700, w: 860, size: 80, fill: orange })}
      {kn(P, 22, "TORN SHEETS, NOT", { m: 23, x: RZ, y: 680, w: 860, size: 70 })}
      {kn(P, 22, "YOUR ARGUMENT", { m: 23, x: RZ, y: 770, w: 860, size: 70, fill: orange, at: 0.6 })}
      <Timeline a={P(23)} b={P(25)} />
      {kn(P, 23, "WHEELER'S EARLIER PATENTS", { m: 24, y: 150, size: 90 })}
      {kn(P, 24, "IT IMPROVED THE ROLL", { m: 25, y: 150, size: 90 })}
      {kn(P, 24, "IT DID NOT START IT", { m: 25, y: 270, size: 90, fill: orange, at: 1.0 })}
      <Pat f="us459516-p0" k="g" a={P(25)} b={P(26)} fx={0.3} fy={0.3} z={1.9} marks={[[0.1, 0.17, 0.34, 0.45]]} m0={P(25, 0.8)} />
      {pl(P, 25, "15 SEPT 1891: A ROLL ON A HOLDER", { m: 26, x: RZ, y: 330, w: 860 })}
      {kn(P, 25, "SHEET IN FRONT", { m: 26, x: RZ, y: 500, w: 860, fill: orange })}
      <Pat f="us459516-p1" k="h" a={P(26)} b={P(27)} fx={0.3} fy={0.74} z={1.6} marks={[[0.06, 0.7, 0.44, 0.765]]} m0={P(26, 0.5)} />
      {kn(P, 26, "EARLIER HOLDERS:", { m: 27, x: RZ, y: 300, w: 860, size: 80 })}
      {kn(P, 26, "COMPLICATED,", { m: 27, x: RZ, y: 420, w: 860, size: 90, fill: orange, at: 0.6 })}
      {kn(P, 26, "LITTLE USED", { m: 27, x: RZ, y: 540, w: 860, size: 90, fill: orange, at: 1.2 })}
      <Pat f="us438457-p0" k="i" a={P(27)} b={P(29)} fx={0.46} fy={0.25} z={1.15} marks={[[0.75, 0.2, 0.8, 0.42]]} m0={P(27, 1.0)} />
      {kn(P, 27, "1890: PAPER-ROLL HOLDER", { m: 28, x: RZ, y: 190, w: 860, size: 70 })}
      {kn(P, 27, "THE PAPER FALLS AWAY", { m: 28, x: RZ, y: 330, w: 860, size: 70, fill: orange, at: 0.8 })}
      {kn(P, 27, "FROM THE WALL", { m: 28, x: RZ, y: 470, w: 860, size: 70, fill: orange, at: 1.4 })}
      {kn(P, 28, "3 DRAWINGS: OVER", { m: 29, x: RZ, y: 170, w: 860, size: 80 })}
      <Pat f="us438567-p0" k="j" x={960} y={260} w={420} h={450} a={P(28)} b={P(29)} veil />
      <Pat f="us297043-p0" k="k" x={1420} y={260} w={420} h={450} a={P(28, 0.5)} b={P(29)} veil />
      {pl(P, 28, "2 DRAWINGS: CAN'T TELL", { m: 29, x: RZ - 90, y: 790, w: 860, color: GREY, at: 1.0 })}
      {rd(P, 29, 30, 960, 130)}
      {kn(P, 29, "TO SELL A CUT, SHOW A SHEET", { m: 30, y: 270, size: 90 })}
      {kn(P, 30, "NOBODY CAN KNOW WHAT", { m: 31, y: 160, size: 90 })}
      {kn(P, 30, "WHEELER THOUGHT", { m: 31, y: 290, size: 100, fill: orange, at: 0.8 })}
      <Ov x={620} y={430} a={P(31)} b={P(34)} rot={-1.5} lim={1.05}>
        <rect x={-340} y={-250} width={680} height={500} rx={24} fill={CARD} stroke={ink} strokeWidth={4} />
        <rect x={-340} y={-250} width={680} height={80} rx={24} fill={teal} />
        <Txt x={0} y={-208} size={36} fill="#fff">
          NEWS - 2015
        </Txt>
        <Txt x={0} y={200} size={34}>
          A drawing of a roll made the news
        </Txt>
      </Ov>
      <Roll x={620} y={400} over a={P(31, 0.5)} b={P(34)} s={0.5} />
      <Stp x={1350} y={320} k="D" a={P(32)} b={P(34)} size={62} />
      {pl(P, 32, "THE DRAWING SHOWS OVER", { m: 34, x: 1350, y: 430, w: 800, color: teal, size: 38 })}
      <Stp x={1350} y={600} k="M" a={P(33)} b={P(34)} size={62} />
      {pl(P, 33, "THE PATENT PROVES OVER", { m: 34, x: 1350, y: 710, w: 800, color: orange, size: 38 })}
    </>
  ),
  top: (
    <>
      <Foot text={IMG} a={0} b={P(12)} />
      <Foot text={AIL} a={P(12)} b={P(13)} />
      <Foot text={ORIG} a={P(13)} b={P(23)} />
      <Foot text={HL} a={P(13, 1.5)} b={P(16)} y={776} />
      <Foot text={HL} a={P(18, 0.6)} b={P(23)} y={826} x={830} />
      <Cite text="US Patent 465,588 (1891)" a={P(13)} b={P(23)} />
      <Foot text={SIMP} a={P(19)} b={P(23)} y={100} />
      <Foot text={SIMP} a={P(23)} b={P(25)} />
      <Foot text={ORIG} a={P(25)} b={P(29)} />
      <Foot text={HL} a={P(25, 0.8)} b={P(29)} y={826} x={830} />
      <Cite text="US Patents 459,516 and 438,457" a={P(25)} b={P(29)} />
      <Foot text={AIL} a={P(29)} b={P(31)} />
      <Foot text={REC} a={P(31)} b={P(34)} />
    </>
  ),
  ev: [thud(P(15)), thud(P(32)), thud(P(33))],
}));

/* ============ ch03 Ann Landers 1977 (34-52) ============ */
const ch03 = scene(34, "ch03", (P) => ({
  shots: [ph("15-kitchen-newspaper-1977", 0, { tr: "cut" }), sh("v2-04-typewriter-1977", P(36)), ph("18-mailroom-1977", P(39)), bg("v2-05-globe-letters", P(42), 9), sh("18-mailroom-1977", P(43, 1.5)), ph("19-kitchen-wall-holder-1977", P(44)), sh("v2-06-envelopes-pile", P(47)), sh("15-kitchen-newspaper-1977", P(51))],
  ov: (
    <>
      <Veil a={P(42)} b={P(43, 1.5)} o={0.25} />
      {kn(P, 34, "THE EARLIEST FIGHT", { m: 35, y: 130, size: 100 })}
      {kn(P, 34, "WE COULD FIND IN PRINT", { m: 35, y: 250, size: 80, fill: orange, at: 0.8 })}
      {pl(P, 35, "ANN LANDERS - JULY 15, 1977", { m: 36, y: 140, color: orange })}
      <Typed x={960} y={215} a={P(36)} b={P(38)} head="15 JULY 1977 - SIGNED: PAPER CRAZY" lines={["Argued with the relatives.", "The paper goes over the top.", "They all disagreed."]} />
      <Typed x={960} y={215} w={1240} a={P(38)} b={P(39)} head="ANN LANDERS ANSWERS, 15 JULY 1977" size={36} lines={["“There is no right or wrong way to dispense", "paper towels or toilet tissue. It's strictly", "a matter of personal preference.”"]} />
      {pl(P, 39, "READERS WROTE BACK", { m: 40, y: 140, color: teal })}
      <Typed x={540} y={730} w={640} a={P(40)} b={P(42)} head="26 SEPT 1977" lines={["She almost did not", "print the letter.", "So inconsequential."]} />
      <WorldMap x={960} y={480} a={P(42)} b={P(43, 1.5)} dots={[["Samoa", -172, -13.8, P(42, 0.4)], ["Guadalajara", -103.3, 20.7, P(42, 1.0), "l"], ["Athens", 23.7, 38, P(42, 1.6)], ["Mexico City", -99.1, 19.4, P(42, 2.2), "b"]]} />
      {kn(P, 43, "SO MUCH FOR INCONSEQUENTIAL", { m: 44, y: 130, size: 80, fill: orange })}
      {pl(P, 44, "UNDER, 1977: HER OWN CHOICE", { m: 47, x: 700, y: 85, w: 880, color: teal })}
      {pl(P, 45, "HER MOTHER DID IT THAT WAY", { m: 47, x: 700, y: 175, w: 880, color: orange })}
      {pl(P, 46, "SO, IN 1977, THE COLUMNIST CHOSE UNDER", { m: 47, x: 700, y: 265, w: 880, color: teal })}
      <Chain nodes={["15,000 letters", "A 2021 article", "A 1986 speech", "The column?"]} y={140} a={P(47, 0.4)} b={P(51)} step={1.1} />
      {kn(P, 47, "THE FAMOUS NUMBER", { m: 48, y: 330, size: 100 })}
      <Stp x={1330} y={720} k="N" a={P(50)} b={P(51)} size={64} />
      {rd(P, 51, 52)}
      {kn(P, 51, "TASTE, NOT SCIENCE", { m: 52, y: 330, size: 130 })}
      {kn(P, 52, "HER WORDS, HER CHOICE", { m: 53, y: 250, size: 100, fill: orange })}
      <Stp x={960} y={520} k="D" a={P(52)} b={P(53)} size={90} />
    </>
  ),
  top: (
    <>
      <Foot text={IMG} a={0} b={P(36)} />
      <Foot text={REC} a={0.5} b={P(36)} y={776} />
      <Foot text={REC} a={P(36)} b={P(39)} />
      <Foot text={AIL} a={P(39)} b={P(42)} />
      <Foot text={REC} a={P(40)} b={P(42)} y={776} />
      <Foot text={SIMP} a={P(42)} b={P(43, 1.4)} />
      <Foot text={IMG} a={P(43, 1.5)} b={P(44)} />
      <Foot text={IMG} a={P(44)} b={P(47)} />
      <Foot text={SIMP} a={P(47)} b={P(51)} />
      <Foot text={IMG} a={P(47)} b={P(53)} y={776} />
      <Foot text={IMG} a={P(36)} b={P(39)} y={776} />
    </>
  ),
  ev: [thud(P(50)), thud(P(52))],
}));

/* ============ ch04 encuestas (53-69) ============ */
const ch04 = scene(53, "ch04", (P) => ({
  shots: [ph("v2-07-supermarket-aisle", 0, { tr: "cut" }), sh("v2-09-pack-blue", P(61)), bg("portada-A-over-under", P(65), 14), bg("35-campus-autumn-2010", P(69), 10)],
  ov: (
    <>
      <Veil a={P(65)} b={P(70)} o={0.3} />
      {kn(P, 53, "WHO PREFERS WHAT?", { m: 54, y: 120, size: 100 })}
      {pl(P, 54, "YOUGOV, 22 FEB 2022 - 27,810 U.S. ADULTS", { m: 56, y: 130, color: orange })}
      {kn(P, 55, "OVER OR UNDER?", { m: 56, y: 810, size: 90, fill: orange })}
      <Bars x={380} y={290} w={580} a={P(56)} b={P(59)} rows={[["Over", 59, teal], ["Under", 14, orange], ["No preference", 21, GREY], ["Not sure", 6, "#B8B09A"]]} />
      {pl(P, 58, "OUR CALCULATION: ABOUT 4 IN 5 OF THOSE WHO CHOSE", { m: 59, y: 130, color: teal })}
      <WorldMap x={380} y={450} s={0.62} a={P(59)} b={P(61)} hl={["United States of America"]} />
      <Stp x={1350} y={420} k="D" a={P(59)} b={P(61)} size={58} />
      {pl(P, 60, "NO CLEAR SURVEY FOUND ELSEWHERE", { m: 61, y: 130, color: GREY })}
      {kn(P, 61, "ANOTHER FAMOUS NUMBER", { m: 62, x: 640, y: 460, w: 1000, size: 110 })}
      {pl(P, 62, "MARCH 2010: A BRAND'S PRESS RELEASE", { m: 63, x: 640, y: 130, w: 1000, color: orange })}
      <Ov x={500} y={500} s={0.9} a={P(63)} b={P(65)} lim={1.05}>
        <rect x={-460} y={-290} width={920} height={560} rx={16} fill={CARD} stroke={GREY} strokeWidth={3} strokeDasharray="14 8" />
        <text x={-420} y={-232} fontFamily="Courier New, monospace" fontWeight={700} fontSize={40} fill={ink}>
          PRESS RELEASE - MARCH 2010
        </text>
        <Txt x={0} y={-30} size={230} fill={orange}>
          72%
        </Txt>
        <Txt x={0} y={120} size={46}>
          of the votes in its own poll: over
        </Txt>
      </Ov>
      <Ov x={500} y={500} s={0.8} a={P(64)} b={P(65)} lim={1.05}>
        <rect x={-460} y={170} width={920} height={110} rx={16} fill={teal} />
        <Txt x={0} y={225} size={48} fill="#fff">
          New product: Roll Over. Subtle.
        </Txt>
      </Ov>
      <Pill x={560} y={330} text="INDEPENDENT POLL" a={P(65)} b={P(69)} size={40} color={teal} />
      <Pill x={1360} y={330} text="THE BRAND'S OWN ONLINE POLL" a={P(65, 0.6)} b={P(69)} size={40} color={orange} />
      <Ov x={560} y={480} a={P(65, 0.8)} b={P(69)}>
        <Txt x={0} y={0} size={80} fill={teal}>
          YouGov
        </Txt>
      </Ov>
      <Ov x={1360} y={480} a={P(65, 1.4)} b={P(69)}>
        <Txt x={0} y={0} size={120} fill={orange}>
          72%
        </Txt>
      </Ov>
      {pl(P, 66, "WE COULD NOT CHECK HOW IT WAS RUN", { m: 67, y: 660, color: GREY })}
      {rd(P, 67, 68, 960, 780)}
      <Stp x={960} y={730} k="P" a={P(68)} b={P(69)} size={80} />
      {kn(P, 69, "?", { m: 70, y: 470, size: 420, fill: orange, at: 0.3 })}
      {kn(P, 69, "WHAT PEOPLE DO,", { m: 70, y: 130, size: 100 })}
      {kn(P, 69, "NOT WHY", { m: 70, y: 810, size: 120, fill: orange, at: 1.2 })}
    </>
  ),
  top: (
    <>
      <Foot text={IMG} a={P(53)} b={P(56)} />
      <Foot text={SIMP} a={P(56)} b={P(61)} />
      <Foot text={IMG} a={P(61)} b={P(63)} />
      <Cite text="YouGov (U.S.), 22 Feb 2022" a={P(56)} b={P(61)} />
      <Foot text={REC} a={P(63)} b={P(65)} />
      <Foot text={SIMP} a={P(65)} b={P(69)} />
      <Foot text={IMG} a={P(69)} b={P(70)} />
    </>
  ),
  ev: [thud(P(59)), thud(P(68))],
}));

/* ============ ch05 cinco razones (70-94) ============ */
const ICONS = ["EASIER TO FIND THE END", "HYGIENE", "CHILDREN AND PETS", "PHYSICS", "LOOKS"];
const ch05 = scene(70, "ch05", (P) => ({
  shots: [bg("portada-A-over-under", 0, 14, { tr: "cut" }), sh("portada-A-over-under", P(71)), bg("portada-A-over-under", P(75), 14), ph("31-cat-streamer-1977", P(79), { tr: "cut" }), sh("v2-11-roll-unspool", P(83)), ph("33-embossed-roll-detail", P(90)), sh("portada-B-hero", P(94))],
  ov: (
    <>
      <Veil a={0} b={P(71)} o={0.25} />
      <Veil a={P(75)} b={P(79)} o={0.25} />
      {kn(P, 70, "FIVE MAIN REASONS", { m: 71, y: 200, size: 120 })}
      {ICONS.map((l, i) => (
        <Pill key={l} x={i > 2 ? 680 + (i - 3) * 560 : 400 + i * 560} y={i > 2 ? 640 : 460} text={`${i + 1}. ${l}`} a={P(70, 1.2 + i * 0.5)} b={P(71)} size={fz(l, 36, 480, 0.62)} color={i % 2 ? orange : teal} />
      ))}
      {pl(P, 71, "REASON 1", { m: 75, x: 380, y: 110, w: 560, color: orange, size: 44 })}
      {pl(P, 71, "EASIER TO FIND THE END", { m: 75, x: 380, y: 215, w: 560, color: orange, size: 30, at: 0.3 })}
      {pl(P, 71, "OVER: END IN VIEW", { m: 75, x: 380, y: 800, w: 560, color: teal, size: 34, at: 0.4 })}
      {pl(P, 71, "UNDER: END HIDDEN", { m: 75, x: 1180, y: 800, w: 560, color: orange, size: 34, at: 0.8 })}
      {rd(P, 72, 74, 380, 330)}
      <Stp x={380} y={520} k="P" a={P(74)} b={P(75)} size={44} />
      {pl(P, 75, "REASON 2: HYGIENE", { m: 79, y: 100, color: orange })}
      <WallHand x={470} y={500} under a={P(76)} b={P(79)} />
      <WallHand x={1450} y={500} a={P(76, 1.0)} b={P(79)} />
      {rd(P, 77, 78, 960, 212)}
      <Stp x={830} y={470} k="P" a={P(78)} b={P(79)} size={44} />
      {pl(P, 79, "REASON 3: CHILDREN AND PETS", { m: 83, y: 130, color: orange })}
      {kn(P, 81, "SAME WORRY.", { m: 82, y: 300, size: 130 })}
      {kn(P, 81, "OPPOSITE ADVICE.", { m: 82, y: 450, size: 130, fill: orange, at: 0.7 })}
      <Stp x={960} y={700} k="P" a={P(82)} b={P(83)} size={72} />
      {pl(P, 83, "REASON 4: PHYSICS", { m: 90, y: 130, color: orange })}
      <Ov x={430} y={470} a={P(83, 0.3)} b={P(90)} lim={1.04}>
        <rect x={-300} y={-290} width={600} height={580} rx={26} fill={CARD} stroke={ink} strokeWidth={4} />
        <circle r={150} fill="#fff" stroke={ink} strokeWidth={7} />
        <circle r={22} fill={ink} />
        <Txt x={0} y={-215} size={44} fill={teal}>
          {"↑ force"}
        </Txt>
        <Txt x={0} y={225} size={44} fill={orange}>
          {"↓ force"}
        </Txt>
      </Ov>
      <Typed x={1320} y={400} w={660} a={P(84)} b={P(86)} head="1977 - A READER, A PHYSICS PROFESSOR" size={30} lines={["Landers's way needs less force.", "Landers: I'll take your word", "for it."]} />
      <Typed x={1320} y={400} w={660} a={P(86)} b={P(90)} head="VICE, 2016 - PHYSICIST BRIAN WECHT" size={30} lines={["It does not matter.", "The forces are mirror images."]} />
      {rd(P, 87, 88, 1320, 700)}
      {kn(P, 88, "TWO OPINIONS. NO MEASUREMENTS.", { m: 89, x: 780, y: 810, w: 1100, size: 70, fill: orange })}
      <Stp x={1320} y={640} k="P" a={P(89)} b={P(90, -0.3)} size={64} />
      {pl(P, 90, "REASON 5: LOOKS", { m: 92, y: 130, color: orange })}
      {pl(P, 90, "OVER: IT SHOWS THE PATTERN", { m: 92, y: 720, color: teal, at: 0.6 })}
      {pl(P, 91, "UNDER: SAME PATTERN, SAYS ANOTHER", { m: 92, y: 720, color: orange })}
      {kn(P, 92, "SAME PATTERN.", { m: 93, y: 180, size: 120 })}
      {kn(P, 92, "OPPOSITE SIDES.", { m: 93, y: 330, size: 120, fill: orange, at: 0.7 })}
      <Stp x={960} y={560} k="P" a={P(93)} b={P(94)} size={72} />
      {rd(P, 94, 95, 560, 300)}
      {kn(P, 94, "A HABIT HUNTING", { m: 95, x: 430, y: 420, w: 920, size: 68 })}
      {kn(P, 94, "FOR REASONS", { m: 95, x: 440, y: 540, w: 920, size: 90, fill: orange, at: 0.6 })}
    </>
  ),
  top: (
    <>
      <Foot text={SIMP} a={P(70)} b={P(71)} />
      <Foot text={IMG} a={P(71)} b={P(75)} />
      <Foot text={SIMP} a={P(75)} b={P(79)} />
      <Foot text={IMG} a={P(79)} b={P(83)} />
      <Foot text={REC} a={P(84)} b={P(90)} />
      <Foot text={SIMP} a={P(83)} b={P(90)} y={776} />
      <Foot text={IMG} a={P(90)} b={P(95)} />
      <Cite text="Vice, 2016 (Brian Wecht)" a={P(86)} b={P(90)} />
    </>
  ),
  ev: [thud(P(74)), thud(P(78)), thud(P(82)), thud(P(89)), thud(P(93))],
}));

/* ============ ch06 "estudios" (95-108) ============ */
const ch06 = scene(95, "ch06", (P) => ({
  shots: [ph("v2-12-magnifier-paper", 0, { tr: "cut" }), bg("v2-12-magnifier-paper", P(96), 5), ph("35-campus-autumn-2010", P(98), { tr: "cut" }), sh("v2-12-magnifier-paper", P(101)), ph("37-home-office-crt-2005", P(103)), sh("37-home-office-crt-2005", P(106))],
  ov: (
    <>
      {kn(P, 95, "THE SO-CALLED STUDIES", { m: 96, y: 150, size: 120 })}
      <Ov x={960} y={440} a={P(96)} b={P(97)} lim={1.04}>
        <rect x={-560} y={-230} width={1120} height={440} rx={26} fill={CARD} stroke={ink} strokeWidth={4} />
        <rect x={-500} y={-180} width={1000} height={72} rx={36} fill="#fff" stroke={GREY} strokeWidth={3} />
        <Txt x={-300} y={-142} size={38}>
          Colorado study
        </Txt>
        <rect x={-444} y={-120} width={290} height={6} fill={orange} />
        <rect x={-500} y={-60} width={820} height={22} rx={8} fill="#B7C7E6" />
        <rect x={-500} y={-10} width={620} height={16} rx={8} fill="#D9D3C0" />
        <rect x={-500} y={60} width={780} height={22} rx={8} fill="#B7C7E6" />
        <rect x={-500} y={110} width={540} height={16} rx={8} fill="#D9D3C0" />
        <Txt x={440} y={120} size={190} fill={orange}>
          ?
        </Txt>
      </Ov>
      {kn(P, 96, "STUDY ONE: COLORADO", { m: 97, y: 130, size: 90, fill: orange })}
      <Ov x={960} y={440} a={P(97)} b={P(98)} lim={1.04}>
        <rect x={-560} y={-210} width={1120} height={420} rx={26} fill={CARD} stroke={ink} strokeWidth={4} />
        <Txt x={0} y={-110} size={fz("Microbial Biogeography of Public Restroom Surfaces", 58, 1000, 0.56)}>
          Microbial Biogeography of Public Restroom Surfaces
        </Txt>
        <Txt x={0} y={0} size={40} fill={teal}>
          Flores et al., PLOS ONE, 23 Nov 2011
        </Txt>
        <Txt x={0} y={90} size={34} fill={GREY}>
          The closest real paper we found
        </Txt>
      </Ov>
      {pl(P, 98, "UNIV. OF COLORADO BOULDER: 12 PUBLIC RESTROOMS", { m: 99, y: 130, color: teal })}
      {pl(P, 99, "10 SURFACES EACH", { m: 100, y: 130, color: orange })}
      {kn(P, 100, "TOILET PAPER MENTIONS: 0", { m: 101, y: 300, size: 100, fill: orange })}
      {kn(P, 100, "GOOD SCIENCE. WRONG QUESTION.", { m: 101, y: 440, size: 80, at: 1.2 })}
      {rd(P, 101, 103, 960, 130)}
      <Stp x={960} y={730} k="N" a={P(102)} b={P(103)} size={60} />
      {pl(P, 103, "STUDY TWO: A BLOG, FEB 2005", { m: 104, y: 130, color: orange })}
      {pl(P, 104, "A JOKE POST, WITH DIAGRAMS", { m: 106, y: 130, color: teal })}
      {pl(P, 105, "IT REPORTS NO MEASUREMENT", { m: 106, y: 810, color: GREY })}
      <Ov x={560} y={400} a={P(106)} b={P(109)} lim={1.05}>
        <rect x={-250} y={-110} width={500} height={220} rx={22} fill={CARD} stroke={teal} strokeWidth={6} />
        <Txt x={0} y={-30} size={44}>
          Joke blog post
        </Txt>
        <Txt x={0} y={40} size={40} fill={GREY}>
          Feb 2005
        </Txt>
      </Ov>
      <Ov x={1360} y={400} a={P(106, 0.8)} b={P(109)} lim={1.05}>
        <rect x={-250} y={-110} width={500} height={220} rx={22} fill={CARD} stroke={orange} strokeWidth={6} />
        <Txt x={0} y={-30} size={40}>
          Agency web page
        </Txt>
        <Txt x={0} y={40} size={36} fill={orange}>
          {"“independent study”"}
        </Txt>
      </Ov>
      <Ov x={960} y={400} a={P(106, 0.4)} b={P(109)}>
        <path d="M-90 0 H80 M50 -30 L90 0 L50 30" stroke={ink} strokeWidth={10} fill="none" strokeLinecap="round" />
        <path d="M-40 -50 L40 50 M40 -50 L-40 50" stroke={orange} strokeWidth={14} strokeLinecap="round" />
      </Ov>
      {kn(P, 107, "A JOKE BECAME A STUDY", { m: 108, y: 660, size: 100, fill: orange })}
      <Stp x={560} y={650} k="M" a={P(108)} b={P(109)} size={60} />
      {pl(P, 108, "AS A STUDY", { m: 109, x: 560, y: 770, w: 500, color: orange, size: 36 })}
      {pl(P, 108, "AS A JOKE: FINE", { m: 109, x: 1360, y: 650, w: 600, color: teal, at: 1.3 })}
    </>
  ),
  top: (
    <>
      <Foot text={IMG} a={P(95)} b={P(96)} />
      <Foot text={SIMP} a={P(96)} b={P(98)} />
      <Cite text="Flores et al., PLOS ONE, 23 Nov 2011 (CC BY)" a={P(97)} b={P(98)} />
      <Cite text="Flores et al., PLOS ONE, 23 Nov 2011 (CC BY)" a={P(98)} b={P(101)} y={22} />
      <Foot text="Title: PLOS ONE (CC BY)" a={P(97)} b={P(98)} />
      <Foot text="Illustrative image, not the real campus" a={P(98)} b={P(101)} />
      <Foot text={IMG} a={P(101)} b={P(103)} />
      <Foot text={IMG} a={P(103)} b={P(106)} />
      <Foot text={SIMP} a={P(106)} b={P(109)} />
    </>
  ),
  ev: [thud(P(102)), thud(P(108))],
}));

/* ============ ch07 marcas y hotel (109-117) ============ */
const ch07 = scene(109, "ch07", (P) => ({
  shots: [ph("39-archive-posters", 0, { tr: "cut" }), ph("40-hotel-corridor-1977", P(113))],
  ov: (
    <>
      <Veil a={P(117)} b={P(118)} o={0.15} />
      {kn(P, 109, "DID THE MAKERS SET A RULE?", { m: 110, y: 130, size: 90 })}
      {kn(P, 110, "NO MANUAL. NO AD", { m: 112, y: 130, size: 100, fill: orange })}
      {kn(P, 110, "THAT FIXES A DIRECTION", { m: 112, y: 250, size: 80, fill: orange, at: 0.8 })}
      {pl(P, 111, "OLD ADS: SOFTNESS AND PURITY", { m: 112, y: 800, color: teal })}
      <Stp x={960} y={560} k="N" a={P(112)} b={P(113)} size={72} />
      {kn(P, 113, "NOW, HOTELS", { m: 114, y: 100, size: 120 })}
      {pl(P, 114, "1977: A MAID WRITES TO LANDERS", { m: 116, y: 100, color: orange })}
      <Typed x={385} y={440} w={620} a={P(115)} b={P(116)} head="1977 - FROM A MAID" size={34} lines={["In several hotels, staff are", "taught to hang rolls over.", "Why? Don't ask me."]} />
      {kn(P, 116, "ONE LETTER, NOT A RULE", { m: 117, y: 95, size: 100, fill: orange })}
      {rd(P, 117, 118, 960, 300)}
      {kn(P, 117, "HOTELS REPEAT A HABIT.", { m: 118, y: 460, size: 100 })}
      {kn(P, 117, "THEY DO NOT EXPLAIN IT.", { m: 118, y: 590, size: 90, fill: orange, at: 1.0 })}
    </>
  ),
  top: (
    <>
      <Foot text={AIL} a={0} b={P(113)} />
      <Foot text={IMG} a={P(113)} b={P(118)} />
      <Foot text={REC} a={P(115)} b={P(116)} y={776} />
    </>
  ),
  ev: [thud(P(112))],
}));

/* ============ ch08 test, marcador y cierre (118-142) ============ */
const BOARD: [number, string, "D" | "P" | "M" | "N"][] = [
  [123, "The patent drawing shows over", "D"],
  [124, "The patent proves over", "M"],
  [125, "Landers: preference, chose under", "D"],
  [126, "15,000 letters", "N"],
  [127, "Most Americans prefer over, 2022", "D"],
  [128, "The brand's own poll", "P"],
  [129, "Colorado as proof", "N"],
  [130, "The paper-saving study", "M"],
  [131, "The five reasons", "P"],
  [132, "A company rule", "N"],
];
const ch08 = scene(118, "ch08", (P) => ({
  shots: [ph("v2-06-envelopes-pile", 0, { tr: "cut" }), sh("39-archive-posters", P(120)), sh("portada-B-hero", P(122)), sh("portada-A-over-under", P(133)), ph("45b-kitchen-warm-1977", P(135), { tr: "cut" }), ph("v2-13-perforation-macro", P(140), { tr: "fade" })],
  ov: (
    <>
      {kn(P, 118, "COULD ANYONE SETTLE THIS?", { m: 119, y: 460, size: 100 })}
      {rd(P, 119, 120, 960, 140)}
      {kn(P, 119, "MANY PEOPLE. BOTH DIRECTIONS. COUNT.", { m: 120, y: 330, size: 70, fill: orange })}
      <TestIcons a={P(120)} b={P(122)} />
      {pl(P, 121, "NO PUBLISHED TEST FOUND", { m: 122, x: 1130, y: 820, color: GREY })}
      {kn(P, 122, "THE SCOREBOARD", { m: 133, x: 480, y: 110, w: 800, size: 80 })}
      {BOARD.map(([n, l, k], i) => (
        <React.Fragment key={n}>
          <Ov x={480} y={205 + i * 68} s={0.75} a={P(n)} b={P(133)} lim={1.04}>
            <rect x={-560} y={-36} width={1120} height={72} rx={20} fill={CARD} stroke={ink} strokeWidth={3} />
            <text x={-530} y={3} dominantBaseline="central" fontFamily={theme.font} fontWeight={800} fontSize={40} fill={ink}>
              {l}
            </text>
          </Ov>
          <Stp x={730} y={205 + i * 68} k={k} a={P(n, 0.5)} b={P(133)} size={26} rot={-3 + (i % 3)} />
        </React.Fragment>
      ))}
      {kn(P, 133, "SO IS OVER", { m: 134, x: 380, y: 200, w: 560, size: 100 })}
      {kn(P, 133, "BETTER?", { m: 134, x: 380, y: 320, w: 560, size: 110, at: 0.4 })}
      {pl(P, 133, "OVER ?", { m: 135, x: 380, y: 800, color: teal, size: 52, at: 0.6 })}
      {pl(P, 134, "UNDER ?", { m: 135, x: 1180, y: 800, color: orange, size: 52 })}
      {kn(P, 133, "NOBODY HAS", { m: 134, x: 380, y: 520, w: 560, size: 80, fill: orange, at: 0.8 })}
      {kn(P, 133, "SHOWN IT", { m: 134, x: 380, y: 620, w: 560, size: 80, fill: orange, at: 1.2 })}
      {kn(P, 134, "IS UNDER", { m: 135, x: 380, y: 200, w: 560, size: 100 })}
      {kn(P, 134, "BETTER?", { m: 135, x: 380, y: 320, w: 560, size: 110, at: 0.4 })}
      {kn(P, 134, "SAME ANSWER.", { m: 135, x: 380, y: 560, w: 560, size: 80, fill: orange, at: 0.8 })}
      {rd(P, 135, 136, 960, 130)}
      {kn(P, 135, "A CUSTOM", { m: 137, x: 560, y: 270, size: 150, fill: orange, at: 0.3 })}
      {kn(P, 135, "WE HANG IT THE WAY SOMEBODY HUNG IT FOR US", { m: 136, y: 480, size: 56, at: 0.8 })}
      {pl(P, 136, "LANDERS, 1977: SHE DID EXACTLY THAT", { m: 137, y: 140, color: teal })}
      {kn(P, 137, "NOT WRONG. A CHOICE.", { m: 138, y: 150, size: 100 })}
      {rd(P, 138, 139, 960, 95)}
      {kn(P, 138, "THE ANSWER WAS NEVER IN THE PATENT", { m: 139, y: 175, size: 64, fill: orange })}
      {kn(P, 138, "IT WAS WHERE YOU GREW UP", { m: 139, y: 480, size: 80, at: 1.0 })}
      <Pat f="us465588-p0" k="z" a={P(139)} b={P(140)} fx={0.44} fy={0.41} z={1.25} veil />
      {kn(P, 139, "THE HONEST VERDICT", { m: 140, x: RZ, y: 220, w: 860, size: 90 })}
      <Stp x={RZ} y={380} k="P" a={P(139, 0.8)} b={P(140)} size={90} />
      <Stp x={RZ} y={600} k="M" a={P(139, 1.8)} b={P(140)} size={90} />
      {pl(P, 139, "THE FAMOUS PROOF IS A MYTH", { m: 140, x: RZ, y: 775, w: 860, color: orange, size: 34, at: 1.8 })}
      {kn(P, 140, "OVER OR UNDER?", { m: 141, x: RZ, y: 220, w: 860, size: 120, fill: orange })}
      {kn(P, 140, "WHAT IS YOUR REASON?", { m: 141, x: RZ, y: 380, w: 860, size: 80, at: 1.0 })}
      {kn(P, 141, "IF NOBODY MEASURED A REASON,", { m: 142, x: RZ, y: 170, w: 860, size: 70 })}
      {kn(P, 141, "WHY DOES A BACKWARDS ROLL", { m: 142, x: RZ, y: 260, w: 860, size: 70, fill: orange, at: 0.8 })}
      {kn(P, 141, "BOTHER US SO MUCH?", { m: 142, x: RZ, y: 350, w: 860, size: 70, fill: orange, at: 1.4 })}
      {kn(P, 142, "WHAT OTHER HABIT", { m: 143, x: 1560, y: 140, w: 860, size: 100 })}
      {kn(P, 142, "HAVE YOU NEVER", { m: 143, x: 1560, y: 235, w: 860, size: 100, fill: orange, at: 0.7 })}
      {kn(P, 142, "CHECKED?", { m: 143, x: 1560, y: 345, w: 860, size: 120, fill: orange, at: 1.3 })}
    </>
  ),
  top: (
    <>
      <Foot text={SIMP} a={P(118)} b={P(133)} y={50} />
      <Foot text={IMG} a={P(118)} b={P(139)} />
      <Foot text={ORIG} a={P(139)} b={P(140)} />
      <Foot text={IMG} a={P(139)} b={P(140)} y={776} />
      <Foot text={IMG} a={P(140)} b={P(143, -6)} />
      <EndCard a={P(143, -6)} />
    </>
  ),
  ev: [...BOARD.map(([n]) => thud(P(n, 0.5))), thud(P(139, 0.8)), thud(P(139, 1.8))],
}));

export const SCENES035: Record<string, React.FC<SceneProps>> = { ch01, ch02, ch03, ch04, ch05, ch06, ch07, ch08 };
