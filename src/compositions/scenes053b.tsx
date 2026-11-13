// EM-053B v3 "Why Does Music Change What You Feel?": imagenes Flow a sangre (rotulo "Illustrative image"); sin ilustraciones SVG.
// El pasillo (4 pasadas) y la playa (2) usan la MISMA imagen, el MISMO encuadre y el MISMO movimiento: solo cambia la musica (ver solos en EM-053B.json).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import ep from "../episodes/EM-053B.json";
import { OVERLAP } from "../utils/timing";
import { ramp } from "../utils/anim";
import { theme } from "../themes/brand";
import { ink, orange, SvgFrame, teal, useT } from "./kit";
import type { SceneProps } from "./scenes";
import { Lab } from "./scenes025";
import { Kin, Pill } from "./scenes023";

const DK = "#0B1020";
const CARD = "#FFFDF6";
const ease = (u: number) => u * u * (3 - 2 * u);
const cl = (v: number) => Math.max(0, Math.min(1, v));
const vis = (t: number, a: number, b: number) => ramp(t, a, a + 0.3) * (1 - ramp(t, b - 0.3, b));
const SOLO: Record<number, (typeof ep.solos)[number]> = Object.fromEntries(ep.solos.map((s) => [s.after, s]));

/** Progreso 0..1 de una "pasada" (mismo plano, mismo movimiento): reset = instante en que vuelve al principio; [a, b] = tramo en que se mueve (el hueco de musica). */
type Pass = { reset: number; a: number; b: number };
const passU = (t: number, ps: Pass[]) => {
  const p = [...ps].reverse().find((q) => t >= q.reset);
  return p ? cl((t - p.a) / (p.b - p.a)) : 0;
};
const blink = (t: number, ps: Pass[]) => Math.max(0, ...ps.slice(1).map((p) => 1 - Math.min(1, Math.abs(t - p.reset) / 0.18)));

type Ctx = { t: number; dur: number; P: (i: number) => number; E: (i: number) => number; W: (after: number) => [number, number]; sp: (i: number, ch: number) => number };
/** Fabrica de escena: da tiempos locales, el rotulo "Illustrative image" (arriba a la derecha) y pinta los creditos exactos en cada hueco de musica (cx = centro del credito). */
const mk = (from: number, to: number, body: (c: Ctx) => React.ReactNode, lab: string | null = "Illustrative image", cx = 960): React.FC<SceneProps> => ({ cues, dur }) => {
  const t = useT();
  const P = (i: number) => cues[i - from] ?? dur;
  const E = (i: number) => (i + 1 - from < cues.length ? cues[i + 1 - from] : dur - OVERLAP);
  const W = (after: number): [number, number] => [E(after) - SOLO[after].dur, E(after)];
  const sp = (i: number, ch: number) => P(i) + ((E(i) - (SOLO[i]?.dur ?? 0) - P(i)) * ch) / ep.parts[i].length;
  return (
    <SvgFrame>
      {body({ t, dur, P, E, W, sp })}
      {lab && <Lab text={lab} a={0} b={dur} y={24} />}
      {ep.solos.filter((s) => s.after >= from && s.after <= to).map((s) => {
        const [a, b] = W(s.after);
        return <Credit key={s.id} a={a} b={b} text={s.credit} label={"label" in s ? s.label : undefined} cx={s.id === "BONITA" ? 960 : cx} />;
      })}
      {"outro" in ep && to === 38 && <Credit a={dur - 3} b={dur - 0.2} text={ep.outro.credit} cx={cx} />}
    </SvgFrame>
  );
};

/** Placa oscura con el credito exacto de la pieza (el narrador calla mientras suena). Va en la franja inferior, bajo los pies de las figuras. */
const Credit: React.FC<{ a: number; b: number; text: string; label?: string; cx: number }> = ({ a, b, text, label, cx }) => {
  const o = vis(useT(), a, b);
  const size = Math.min(36, 1500 / (text.length * 0.56));
  const w = text.length * size * 0.56 + 150;
  return o > 0 ? (
    <g opacity={o}>
      <rect x={cx - w / 2} y={980} width={w} height={78} rx={39} fill={DK} opacity={0.92} stroke={teal} strokeWidth={4} />
      <text x={cx - w / 2 + 42} y={1019} dominantBaseline="central" fontFamily={theme.font} fontSize={44} fill={orange}>
        {"♪"}
      </text>
      <text x={cx - w / 2 + 92} y={1019} dominantBaseline="central" fontFamily={theme.font} fontWeight={700} fontSize={size} fill={CARD}>
        {text}
      </text>
      {label && (
        <g>
          <rect x={cx - 215} y={916} width={430} height={50} rx={25} fill={orange} />
          <text x={cx} y={941} textAnchor="middle" dominantBaseline="central" fontFamily={theme.font} fontWeight={800} fontSize={30} fill={DK}>
            {label}
          </text>
        </g>
      )}
    </g>
  ) : null;
};

const Dim: React.FC<{ o: number }> = ({ o }) => (o > 0 ? <rect width={1920} height={1080} fill="#000" opacity={o} /> : null);

/** Imagen Flow a sangre (1376x768 -> 1920x1080) con zoom z hacia el punto (ox, oy); los hijos (destellos B) se mueven con ella. */
const Ph: React.FC<{ id: string; z?: number; ox?: number; oy?: number; blur?: number; children?: React.ReactNode }> = ({ id, z = 1, ox = 960, oy = 540, blur = 0, children }) => (
  <g transform={`translate(${ox} ${oy}) scale(${z}) translate(${-ox} ${-oy})`}>
    <image href={staticFile(`illustrations/${id}.png`)} width={1920} height={1080} preserveAspectRatio="xMidYMid slice" style={blur ? { filter: `blur(${blur}px)` } : undefined} />
    {children}
  </g>
);

const Glow: React.FC<{ id: string; x: number; y: number; rx: number; ry: number; color: string; o: number }> = ({ id, x, y, rx, ry, color, o }) => (
  <>
    <defs>
      <radialGradient id={id}>
        <stop offset="0" stopColor={color} stopOpacity={1} />
        <stop offset="1" stopColor={color} stopOpacity={0} />
      </radialGradient>
    </defs>
    <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={`url(#${id})`} opacity={o} style={{ mixBlendMode: "screen" }} />
  </>
);

/* ===================== PASILLO (mismo plano 4 veces) ===================== */
/** u = progreso de la pasada (empuje hacia la puerta); s = segundos desde que empieza la musica (pulso de la luz de la puerta, identico en cada pasada). Sin color grading: "Not one pixel changed". */
const Hallway: React.FC<{ u: number; s: number }> = ({ u, s }) => (
  <Ph id="em053b-hallway" z={1 + 0.08 * ease(u)} ox={960} oy={700}>
    <Glow id="dr53" x={959} y={560} rx={230} ry={380} color="#FFB45A" o={0.2 * (0.5 - 0.5 * Math.cos(s * 1.7))} />
  </Ph>
);

/* ===================== PLAYA ===================== */
const Beach: React.FC<{ u: number; s: number }> = ({ u, s }) => (
  <Ph id="em053b-beach-sunrise" z={1 + 0.08 * ease(u)} ox={880} oy={520}>
    <Glow id="sn53" x={1202} y={458} rx={190} ry={140} color="#FFE9A8" o={0.1 + 0.16 * Math.abs(Math.sin(s * 0.9))} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <ellipse key={i} cx={1200 + ((i * 37) % 50) - 25} cy={545 + i * 58} rx={30 - i * 2} ry={3.5} fill="#FFF6D6" opacity={0.12 + 0.4 * Math.abs(Math.sin(s * 2.4 + i * 1.7))} />
    ))}
  </Ph>
);

/* ===================== CUEVA ===================== */
const Cave: React.FC<{ z: number; t: number; v: number }> = ({ z, t, v }) => (
  <Ph id="em053b-cave" z={z} ox={1000} oy={500}>
    {Array.from({ length: 22 }, (_, i) => (
      <circle key={i} cx={940 + ((i * 97) % 520) + Math.sin(t * 0.7 + i) * 14} cy={780 - ((i * 61 + t * 28 * v) % 520)} r={2 + (i % 3)} fill="#EAF8FF" opacity={0.25 + 0.35 * Math.abs(Math.sin(t * 1.1 + i))} />
    ))}
  </Ph>
);

/* ===================== CINTA DE CORRER Y RESTAURANTE ===================== */
const Treadmill: React.FC<{ t: number; dur: number }> = ({ t, dur }) => (
  <Ph id="em053b-treadmill" z={1 + 0.07 * cl(t / dur)} ox={1250} oy={600}>
    <defs>
      <linearGradient id="sw53" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity={0} />
        <stop offset="0.5" stopColor="#fff" stopOpacity={0.16} />
        <stop offset="1" stopColor="#fff" stopOpacity={0} />
      </linearGradient>
      <clipPath id="swc53">
        <rect width={1030} height={1080} />
      </clipPath>
    </defs>
    <g clipPath="url(#swc53)">
      <rect x={-300 + ((t * 120) % 1500)} y={-50} width={220} height={1200} fill="url(#sw53)" transform="skewX(-12)" />
    </g>
  </Ph>
);

const BOKEH: [number, number, number, string][] = [[286, 332, 34, "#FFC46B"], [1667, 386, 38, "#FFC46B"], [1960, 300, 30, "#FFC46B"]];
const Restaurant: React.FC<{ t: number; z: number; bubble: number }> = ({ t, z, bubble }) => (
  <g>
    <Ph id="em053b-restaurant" z={z} ox={720} oy={600}>
      <Glow id="cn53" x={720} y={600} rx={150} ry={170} color="#FFB347" o={0.16 + 0.08 * Math.sin(t * 7) + 0.05 * Math.sin(t * 11.3)} />
      {BOKEH.map(([x, y, r, c], i) => (
        <circle key={i} cx={x} cy={y} r={r + 4 * Math.sin(t * 1.3 + i)} fill={c} opacity={0.14 + 0.1 * Math.sin(t * 1.7 + i * 2)} style={{ mixBlendMode: "screen" }} />
      ))}
    </Ph>
    {bubble > 0 && (
      <g transform={`translate(1500 340) scale(${bubble})`}>
        <circle cx={-205} cy={175} r={22} fill={CARD} stroke={ink} strokeWidth={5} />
        <circle cx={-250} cy={230} r={12} fill={CARD} stroke={ink} strokeWidth={5} />
        <clipPath id="dsc53">
          <circle r={175} />
        </clipPath>
        <circle r={186} fill={CARD} stroke={ink} strokeWidth={5} />
        <image href={staticFile("illustrations/em053b-dessert.png")} x={-175} y={-175} width={350} height={350} preserveAspectRatio="xMidYMid slice" clipPath="url(#dsc53)" />
      </g>
    )}
  </g>
);

/* ===================== VENTANA CON LLUVIA ===================== */
const RAIN_LIGHTS: [number, number, number, string][] = [[790, 560, 30, "#FFB347"], [900, 590, 26, "#FF6B6B"], [1010, 520, 34, "#7FD0FF"], [1130, 610, 28, "#FFD27F"], [1260, 540, 30, "#7FD0FF"], [850, 650, 24, "#FFD27F"]];
const RainRoom: React.FC<{ t: number; dur: number }> = ({ t, dur }) => (
  <Ph id="em053b-rain-window" z={1 + 0.05 * cl(t / dur)} ox={1100} oy={500}>
    {Array.from({ length: 16 }, (_, i) => (
      <path key={i} d={`M${600 + ((i * 47) % 740)} ${((i * 173 + t * (60 + (i % 5) * 25)) % 1000) - 100} v${40 + (i % 4) * 14}`} stroke="#DDEBFF" strokeWidth={3} strokeLinecap="round" opacity={0.3} />
    ))}
    {RAIN_LIGHTS.map(([x, y, r, c], i) => (
      <circle key={i} cx={x} cy={y} r={r} fill={c} opacity={0.08 + 0.14 * Math.abs(Math.sin(t * 0.9 + i * 1.3))} style={{ mixBlendMode: "screen" }} />
    ))}
  </Ph>
);

/* ===================== ONDAS (suave frente a aspera): esquema "Simplified illustration" ===================== */
const Waves: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const t = useT();
  const o = vis(t, a, b);
  const wave = (rough: boolean, y: number) =>
    Array.from({ length: 91 }, (_, i) => {
      const k = i * 8;
      const v = Math.sin(k / 38 + t * 3) * 38 + (rough ? Math.sin(k * 0.9 + t * 40) * 24 + Math.sin(k * 2.3) * 20 : 0);
      return `${i ? "L" : "M"}${600 + k} ${y + v}`;
    }).join(" ");
  return (
    <>
      {o > 0 && (
        <g opacity={o} transform="translate(540 -60)">
          <rect x={560} y={200} width={800} height={470} rx={26} fill={DK} opacity={0.88} stroke={CARD} strokeOpacity={0.4} strokeWidth={3} />
          <text x={960} y={266} textAnchor="middle" fontFamily={theme.font} fontWeight={800} fontSize={42} fill="#2EC4B6">SMOOTH</text>
          <path d={wave(false, 340)} fill="none" stroke="#2EC4B6" strokeWidth={8} strokeLinecap="round" />
          <text x={960} y={468} textAnchor="middle" fontFamily={theme.font} fontWeight={800} fontSize={42} fill={orange}>SCRATCHY</text>
          <path d={wave(true, 560)} fill="none" stroke={orange} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      <Lab text="Simplified illustration" a={a} b={b} x={1884} y={624} />
    </>
  );
};

/* ===================== ESCENAS ===================== */
const Words: React.FC<{ items: [string, number, number, string?][]; y: number; x?: number }> = ({ items, y, x = 960 }) => (
  <>
    {items.map(([text, a, b, fill], i) => (
      <Kin key={text} x={x} y={y} text={text} a={a} b={b} size={Math.max(70, Math.min(150, Math.round(2300 / text.length)))} fill={fill ?? (i % 2 ? orange : teal)} rot={i % 2 ? 3 : -3} />
    ))}
  </>
);

const HP: (c: Ctx, after: number[], resets: number[]) => Pass[] = (c, after, resets) => after.map((x, i) => ({ reset: resets[i], a: c.W(x)[0], b: c.W(x)[1] }));

const hook = mk(0, 4, (c) => {
  const ps = HP(c, [0, 1], [0, c.P(1)]);
  const u = passU(c.t, ps);
  const w = c.t >= ps[1].reset ? ps[1] : ps[0];
  return (
    <>
      <Hallway u={u} s={u * (w.b - w.a)} />
      <Dim o={blink(c.t, ps)} />
      <Pill x={960} y={150} text="SAME PICTURE" a={ps[1].reset + 0.3} b={w.b} size={64} color={orange} rot={-3} />
    </>
  );
});

const promise = mk(5, 6, (c) => (
  <>
    <Hallway u={0} s={0} />
    <Dim o={0.35} />
    <Words y={190} items={[["WHO DECIDES?", c.sp(5, 4), c.P(6) - 0.2], ["4 MOVES", c.sp(6, 12), c.dur - 0.5]]} />
  </>
));

const beach = mk(7, 11, (c) => {
  const w1 = c.W(7);
  const w2 = c.W(8);
  const ps: Pass[] = [{ reset: 0, a: w1[0], b: w1[1] }, { reset: w2[0] - 0.3, a: w2[0], b: w2[1] }];
  const u = passU(c.t, ps);
  const p = c.t >= ps[1].reset ? ps[1] : ps[0];
  return (
    <>
      <Beach u={u} s={u * (p.b - p.a)} />
      <Dim o={blink(c.t, ps)} />
      <Pill x={960} y={150} text="SAME BEACH" a={w2[0]} b={w2[1]} size={64} color={orange} rot={-3} />
    </>
  );
});

/** Escena Mozart: salon vienes (Flow, desenfocado) de fondo y retrato de Krafft (dominio publico) con su rotulo. */
const mozart = mk(12, 18, (c) => {
  const t = c.t;
  const fig = c.W(13);
  const m40 = c.W(14);
  const dark = ramp(t, m40[0] - 1, m40[0]);
  const portrait = 1 - ramp(t, c.dur - 0.9, c.dur - 0.5); // el retrato se va antes del fundido a la cueva (sin fantasma)
  const bars = (x: number, col: string, on: boolean) =>
    on &&
    [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
      const h = 40 + 150 * Math.abs(Math.sin(t * (5 + i * 1.7) + i));
      return <rect key={i} x={x + i * 58} y={640 - h} width={38} height={h} rx={12} fill={col} />;
    });
  return (
    <>
      <rect width={1920} height={1080} fill="#10172E" />
      <Ph id="em053b-salon" z={1.06 + 0.04 * cl(t / c.dur)} blur={7} />
      <rect width={1920} height={1080} fill="#F8E3A6" opacity={0.28} />
      <rect width={1920} height={1080} fill="#10172E" opacity={0.78 * dark} />
      <g opacity={portrait}>
        <image href={staticFile("images/em053-art-mozart.jpg")} x={1060} y={70} width={640} height={820} preserveAspectRatio="xMidYMid slice" />
        <rect x={1060} y={70} width={640} height={820} fill="none" stroke={CARD} strokeWidth={12} />
      </g>
      <Lab text="Portrait: Barbara Krafft, 1819 (public domain)" a={0} b={c.dur - 0.5} y={24} />
      <Lab text="Illustrative image (background)" a={0} b={c.dur} x={900} y={24} />
      <Pill x={560} y={240} text="BRIGHT (major)" a={fig[0]} b={fig[1] + 1.5} size={78} color={teal} rot={-3} />
      <Pill x={560} y={240} text="DARK (minor)" a={m40[0]} b={m40[1] + 2} size={78} color={"#6B5BD2"} rot={3} />
      {bars(180, teal, t > fig[0] && t < fig[1])}
      {bars(180, "#6B5BD2", t > m40[0] && t < m40[1])}
      <Pill x={560} y={420} text="SAME SPEED" a={c.P(15) + 0.2} b={c.P(16) + 1} size={56} color={orange} rot={-2} />
      <Pill x={560} y={330} text="AGE 5: SPEED ONLY" a={c.P(18) + 0.2} b={c.dur - 0.4} size={52} color={orange} rot={-2} />
      <Pill x={560} y={500} text="FAST = HAPPY" a={c.sp(18, 51)} b={c.dur - 0.4} size={60} color={teal} rot={2} />
      <Pill x={560} y={600} text="SLOW = SAD" a={c.sp(18, 74)} b={c.dur - 0.4} size={60} color={"#6B5BD2"} rot={-2} />
    </>
  );
}, null);

const speed = mk(19, 22, (c) => {
  const w1 = c.W(19);
  const w2 = c.W(20);
  const slowOn = c.t < w2[0] - 0.5;
  const ps: Pass[] = [{ reset: 0, a: w1[0], b: w1[1] }, { reset: w2[0] - 0.3, a: w2[0], b: w2[1] }];
  const u = passU(c.t, ps);
  const z = slowOn ? 1 + 0.04 * u : 1 + 0.16 * ease(u); // lenta: empuje suave; rapida: el mismo camino, mas lejos y mas deprisa
  return (
    <>
      <Cave z={z} t={c.t} v={slowOn ? 1 : 2.2} />
      <Dim o={blink(c.t, ps)} />
      <Pill x={960} y={150} text="SAME TRACK" a={w2[0]} b={w2[1]} size={64} color={orange} rot={-3} />
      <Pill x={960} y={150} text="SLOWED DOWN" a={w1[0]} b={w1[1]} size={64} color={teal} rot={-3} />
      {c.t > c.P(22) - 0.1 && (
        <g opacity={vis(c.t, c.P(22), c.dur - 0.4)}>
          <rect x={560} y={330} width={800} height={160} rx={30} fill={DK} opacity={0.88} />
          <rect x={650} y={406} width={620} height={14} rx={7} fill={CARD} opacity={0.5} />
          <circle cx={650 + 620 * (0.5 + 0.35 * Math.sin((c.t - c.P(22)) * 2.2))} cy={413} r={26} fill={orange} />
          <text x={650} y={370} textAnchor="middle" fontFamily={theme.font} fontWeight={800} fontSize={34} fill={CARD}>SLOW</text>
          <text x={1270} y={370} textAnchor="middle" fontFamily={theme.font} fontWeight={800} fontSize={34} fill={CARD}>FAST</text>
          <text x={960} y={465} textAnchor="middle" fontFamily={theme.font} fontWeight={700} fontSize={30} fill={teal}>THE DIAL</text>
        </g>
      )}
      <Lab text="Simplified illustration" a={c.P(22)} b={c.dur - 0.4} x={1360} y={500} />
    </>
  );
});

const gym = mk(23, 26, (c) => {
  const swap = c.P(25) - 0.2;
  const k = ramp(c.t, swap - 0.4, swap + 0.4);
  const thought = ramp(c.t, c.sp(26, 84), c.sp(26, 84) + 0.5);
  return (
    <>
      <Treadmill t={c.t} dur={swap} />
      {k > 0 && (
        <g opacity={k}>
          <Restaurant t={c.t} z={1 + 0.06 * cl((c.t - swap) / (c.dur - swap))} bubble={thought} />
        </g>
      )}
    </>
  );
}, "Illustrative image", 560);

const scary = mk(27, 29, (c) => {
  const w = c.W(27);
  const ps: Pass[] = [{ reset: 0, a: w[0], b: w[1] }];
  const u = passU(c.t, ps);
  return (
    <>
      <Hallway u={u} s={u * (w[1] - w[0])} />
      <Dim o={0.4 * ramp(c.t, w[1] - 0.3, w[1])} />
      <Waves a={c.sp(28, 58)} b={c.P(29) + 3} />
    </>
  );
});

const lofi = mk(30, 33, (c) => (
  <>
    <RainRoom t={c.t} dur={c.dur} />
    <Words x={850} y={300} items={[["NOSTALGIA", c.sp(32, 77), c.P(33) + 0.5]]} />
  </>
));

const toolbox = mk(34, 34, (c) => {
  const k = (ch: number) => c.sp(34, ch);
  return (
    <>
      <Beach u={0.5} s={0} />
      <Dim o={0.45} />
      <Pill x={1500} y={130} text="BRIGHT or DARK" a={k(23)} b={c.dur - 0.5} size={58} color={teal} rot={-2} />
      <Pill x={1500} y={245} text="FAST or SLOW" a={k(39)} b={c.dur - 0.5} size={58} color={orange} rot={2} />
      <Pill x={1500} y={360} text="SMOOTH or SCRATCHY" a={k(53)} b={c.dur - 0.5} size={58} color={"#6B5BD2"} rot={-2} />
    </>
  );
});

const finale = mk(35, 38, (c) => {
  const w = c.W(35);
  const ps: Pass[] = [{ reset: 0, a: w[0], b: w[1] }];
  const u = passU(c.t, ps);
  return (
    <>
      <Hallway u={u} s={u * (w[1] - w[0])} />
      <Words y={190} items={[["MUTE THE TV", c.sp(37, 15), c.sp(37, 38)], ["ANY SONG YOU LIKE", c.sp(37, 38), c.P(38) - 0.2]]} />
      <Words y={190} items={[["SHOP MUSIC?", c.sp(38, 70), c.dur - 1]]} />
    </>
  );
});

export const SCENES053B: Record<string, React.FC<SceneProps>> = { hook, promise, beach, mozart, speed, gym, scary, lofi, toolbox, finale };

/** Marcador de la portada (la portada definitiva se hace aparte, con el titulo aprobado): solo el pasillo Flow. */
export const ThumbEM053B: React.FC = () => (
  <AbsoluteFill>
    <Img src={staticFile("illustrations/em053b-hallway.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </AbsoluteFill>
);
