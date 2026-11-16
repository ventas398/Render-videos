import React from "react";
import { staticFile } from "remotion";
import { AVAILABLE } from "../illustrations";
import { ramp } from "../utils/anim";
import type { SceneProps } from "./scenes";
import { Cam, DrawOn, Foot2 } from "./kit2";
import { G, GOLD, ink, orange, RED, SvgFrame, teal, Txt, useT } from "./kit";
import { Ar, FULL, Kin, Num, Ov, Pill, Reading, Shots, Sfx } from "./scenes023";
import { theme } from "../themes/brand";
import type { Ev, Sh } from "./scenes023";

/* ============ EM-025: una escena por capitulo (ch01..ch15); cada plano usa imagenes em025-*; si falta, se usa un sustituto temporal ============ */
const CARD = "#FFFDF6";
const FOREST = "#2F6B3F";
const BRICK = "#A8382A";

const has = (id: string) => AVAILABLE.includes(`em025-${id}`);
const I = (id: string) => id;

/** Pastilla de fuente pegada al borde inferior (por encima del subtitulo), para no pisar rotulos a y~800. */
const Src: React.FC<{ text: string; a: number; b: number }> = ({ text, a, b }) => {
  const t = useT();
  return <g transform="translate(0 -20)"><Foot2 text={text} o={ramp(t, a, a + 0.3) * (1 - ramp(t, b - 0.3, b))} /></g>;
};

/* ============ piezas ============ */
const KIND = {
  D: ["DOCUMENTED", FOREST],
  P: ["DISPUTED", orange],
  M: ["MYTH", BRICK],
  N: ["NO EVIDENCE FOUND", "#6B7280"],
} as const;
/** Sello de veredicto con caida. */
export const Stp: React.FC<{
  x: number;
  y: number;
  k: keyof typeof KIND;
  a: number;
  b?: number;
  size?: number;
  rot?: number;
}> = ({ x, y, k, a, b, size = 70, rot = -6 }) => {
  const [text, c] = KIND[k];
  const w = text.length * size * 0.7 + 70;
  return (
    <Ov x={x} y={y} a={a} b={b} rot={rot} lim={1.12}>
      <rect x={-w / 2 + 8} y={-size * 0.95 + 10} width={w} height={size * 1.9} rx={14} fill={ink} opacity={0.16} />
      <rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.9} rx={14} fill={CARD} stroke={c} strokeWidth={size / 7} />
      <Txt x={0} y={2} size={size} fill={c} spacing={3}>
        {text}
      </Txt>
    </Ov>
  );
};
export const thud = (t: number): Ev => [t, "thud", 0.6];
/** Rotulo "Simplified illustration" con tiempos (todo vector superpuesto). */
export const Sm: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const t = useT();
  const o = ramp(t, a, a + 0.3) * (1 - ramp(t, b - 0.3, b));
  return o > 0 ? (
    <g opacity={o}>
      <rect x={1554} y={885} width={330} height={44} rx={22} fill={CARD} opacity={0.97} stroke={ink} strokeWidth={2} />
      <text x={1868} y={907} textAnchor="end" dominantBaseline="central" fontFamily={theme.font} fontWeight={600} fontSize={26} fill={ink}>
        Simplified illustration
      </text>
    </g>
  ) : null;
};
/** Credito del billete real (foto PD-USGov), en vez de "Illustrative image". */
const BILL_CREDIT = "US $1 reverse - public domain";
/** Rotulo "Illustrative image / recreation" sobre el de vector. */
export const Lab: React.FC<{ text?: string; a: number; b: number; y?: number; x?: number }> = ({ text = "Illustrative image", a, b, y = 828, x = 1884 }) => {
  const t = useT();
  const o = ramp(t, a, a + 0.3) * (1 - ramp(t, b - 0.3, b));
  const w = text.length * 12.5 + 44;
  return o > 0 ? (
    <g opacity={o}>
      <rect x={x - w} y={y} width={w} height={44} rx={22} fill={CARD} opacity={0.92} stroke={ink} strokeWidth={2} strokeOpacity={0.5} />
      <text x={x - 22} y={y + 22} textAnchor="end" dominantBaseline="central" fontFamily="Segoe UI, sans-serif" fontWeight={700} fontSize={24} fill={ink}>
        {text}
      </text>
    </g>
  ) : null;
};
/** Tarjeta "?" del gancho. */
export const Q: React.FC<{
  x: number;
  label: string;
  a: number;
  b?: number;
  rot?: number;
  s?: number;
}> = ({ x, label, a, b, rot = 0, s = 1 }) => (
  <Ov x={x} y={175} a={a} b={b} rot={rot} s={s} lim={1.08}>
    <rect x={-165} y={-120} width={340} height={250} rx={26} fill={ink} opacity={0.16} />
    <rect x={-175} y={-130} width={340} height={250} rx={26} fill={CARD} stroke={teal} strokeWidth={7} />
    <Txt x={-5} y={-50} size={130} fill={orange}>
      ?
    </Txt>
    <Txt x={-5} y={64} size={40}>
      {label}
    </Txt>
  </Ov>
);
/** Linea de tiempo horizontal en el panel: puntos con año (y subtitulo). */
export const Tl: React.FC<{
  y: number;
  x1: number;
  x2: number;
  pts: { x: number; l: string; s?: string; a: number }[];
  e: number;
}> = ({ y, x1, x2, pts, e }) => {
  const a0 = pts[0].a;
  const t = useT();
  if (t > e) return null;
  return (
    <>
      <rect x={x1 - 60} y={y - 135} width={x2 - x1 + 120} height={270} rx={26} fill={CARD} opacity={0.92 * ramp(t, a0 - 0.2, a0 + 0.2)} />
      <DrawOn d={`M${x1} ${y} L${x2} ${y}`} t0={a0} t1={a0 + 0.8} w={10} color={ink} o={1} />
      {pts.map((p) => (
        <Ov key={p.l} x={p.x} y={y} a={p.a} b={e}>
          <circle r={22} fill={orange} stroke={ink} strokeWidth={6} />
          <Txt x={0} y={-72} size={64} fill={ink}>
            {p.l}
          </Txt>
          {p.s && (
            <Txt x={0} y={72} size={32} fill={teal}>
              {p.s}
            </Txt>
          )}
        </Ov>
      ))}
    </>
  );
};
/** Halo pulsante (espacio de imagen). */
const Glow: React.FC<{
  id: string;
  x: number;
  y: number;
  r: number;
  c?: string;
  a?: number;
  e?: number;
}> = ({ id, x, y, r, c = GOLD, a = 0, e = 1e6 }) => {
  const t = useT();
  if (t < a || t > e) return null;
  const k = Math.sin((t - a) * 4.2);
  return (
    <>
      <defs>
        <radialGradient id={`gl-${id}`}>
          <stop offset="0" stopColor={c} stopOpacity={0.95} />
          <stop offset="0.45" stopColor={c} stopOpacity={0.4} />
          <stop offset="1" stopColor={c} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r * (1 + 0.1 * k)} fill={`url(#gl-${id})`} opacity={(0.55 + 0.35 * k) * ramp(t, a, a + 0.4)} />
    </>
  );
};
/** Anillos que se expanden desde un punto. */
const Pr: React.FC<{
  x: number;
  y: number;
  r: number;
  a: number;
  e: number;
  c?: string;
}> = ({ x, y, r, a, e, c = orange }) => {
  const t = useT();
  if (t < a || t > e) return null;
  return (
    <>
      {[0, 1, 2].map((i) => {
        const u = ((t - a) * 0.9 + i / 3) % 1;
        return <circle key={i} cx={x} cy={y} r={r * (0.35 + 0.65 * u)} fill="none" stroke={c} strokeWidth={9} opacity={1 - u} />;
      })}
    </>
  );
};
/** Parallax barato: copia de la imagen, recortada con borde suave, que se desplaza algo mas que el fondo. */
const Par: React.FC<{
  pic: string;
  S: number;
  x: number;
  y: number;
  r: number;
  amp?: number;
}> = ({ pic, S, x, y, r, amp = 0.012 }) => {
  const t = useT();
  const id = `pm-${pic}-${Math.round(x * 100)}`;
  const dx = Math.sin(t * 0.8) * amp * S;
  const dy = Math.cos(t * 0.6) * amp * S * 0.5;
  return (
    <>
      <defs>
        <radialGradient id={`${id}-g`}>
          <stop offset="0.6" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <mask id={id}>
          <circle cx={x * S} cy={y * S} r={r * S} fill={`url(#${id}-g)`} />
        </mask>
      </defs>
      <g mask={`url(#${id})`}>
        <g transform={`translate(${dx} ${dy}) translate(${x * S} ${y * S}) scale(1.045) translate(${-x * S} ${-y * S})`}>
          <image href={staticFile(`illustrations/em025-${pic}.png`)} x={0} y={0} width={S} height={S} preserveAspectRatio="xMidYMid slice" />
        </g>
      </g>
    </>
  );
};
/** Motas de polvo en un rayo de luz. */
const Motes: React.FC<{ S: number; n?: number }> = ({ S, n = 16 }) => {
  const t = useT();
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const x = ((i * 0.37 + 0.11) % 1) * S + Math.sin(t * 0.7 + i) * 18;
        const y = S - ((((i * 0.53 + 0.2) % 1) * S + t * (14 + (i % 5) * 5)) % S);
        return <circle key={i} cx={x} cy={y} r={3 + (i % 3) * 2} fill="#FFF3C4" opacity={0.65} />;
      })}
    </>
  );
};
/** Barrido de luz diagonal que cruza la imagen. */
const Swp: React.FC<{ S: number; a: number }> = ({ S, a }) => {
  const t = useT();
  const u = ramp(t, a, a + 2.4);
  if (u <= 0 || u >= 1) return null;
  return (
    <>
      <defs>
        <linearGradient id={`sw-${a}`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0} />
          <stop offset="0.5" stopColor="#FFF3C4" stopOpacity={0.75} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={-S * 0.3 + u * S * 1.5} y={-S * 0.2} width={S * 0.3} height={S * 1.4} fill={`url(#sw-${a})`} transform={`rotate(14 ${S / 2} ${S / 2})`} />
    </>
  );
};
/** Contorno vectorial (cerebro / tronco) dibujado sobre la imagen; se dibuja en un espacio de 1254. */
const BRAIN =
  "M-120 20 C-150 -40 -90 -110 -20 -100 C20 -140 110 -110 120 -50 C160 -20 150 60 100 80 C80 120 20 120 0 90 C-40 120 -110 100 -120 20 Z M-20 -100 C-10 -40 20 -30 10 20 M-60 -20 C-30 -10 -20 10 -40 40";
const STEM = "M-16 -70 C-22 -10 -18 40 -34 100 C-10 112 10 112 34 100 C18 40 22 -10 16 -70 Z";
const EYE = "M-60 0 Q0 -44 60 0 Q0 44 -60 0 Z M-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0";
const Outline: React.FC<{
  S: number;
  x: number;
  y: number;
  d: string;
  s: number;
  a: number;
  e?: number;
  rot?: number;
}> = ({ S, x, y, d, s, a, e = 1e6, rot = 0 }) => {
  const t = useT();
  if (t > e) return null;
  return (
    <G x={x * S} y={y * S} s={(S / 1254) * s} rot={rot} o={1 - ramp(t, e - 0.3, e)}>
      <DrawOn d={d} t0={a} t1={a + 1.4} w={9} color={orange} />
    </G>
  );
};
/** Fila del resumen final. */
const Row: React.FC<{
  y: number;
  label: string;
  k: (keyof typeof KIND)[];
  a: number;
  e: number;
}> = ({ y, label, k, a, e }) =>
  useT() > e ? null : (
    <>
      <Ov x={510} y={y} a={a}>
        <rect x={-420} y={-44} width={840} height={88} rx={20} fill={CARD} stroke={ink} strokeWidth={5} />
        <Txt x={-390 + label.length * 13.5} y={0} size={40}>
          {label}
        </Txt>
      </Ov>
      {k.map((q, i) => (
        <Stp key={i} x={k.length > 2 ? 230 + i * 290 : 320 + i * 250 + (k.length > 1 ? 0 : 150)} y={y + 78} k={q} a={a + 0.5 + i * 0.4} size={30} rot={-3 + i * 3} />
      ))}
    </>
  );

/* ============ fabrica de escenas ============ */
type Out = {
  shots: Sh[];
  ov: React.ReactNode;
  top?: React.ReactNode;
  ev?: Ev[];
};
const VAR = ["sw1", "paper", "sw2", "sw3"];
let acc = 0; // indice global rotatorio de efectos de transicion: nunca el mismo sonido dos veces seguidas
const scene = (from: number, id: string, mk: (P: (n: number, o?: number) => number) => Out): React.FC<SceneProps> => {
  const dummy = mk((n, o = 0) => n + o);
  const picks = dummy.shots.filter((s) => s.tr !== "cut" && s.tr !== "fade").filter((_, k) => k % 3 === 1);
  const off = acc;
  acc += picks.length;
  return ({ cues, dur }) => {
    const P = (n: number, o = 0) => (cues[n - from] ?? dur) + o; // partes mas alla de la escena = fin de escena
    const { shots, ov, top, ev = [] } = mk(P);
    const sw: Ev[] = shots.filter((s) => s.tr !== "cut" && s.tr !== "fade").flatMap((s, k) => (k % 3 === 1 ? [[s.t, VAR[(off + Math.floor(k / 3)) % VAR.length], 0.7] as Ev] : []));
    return (
      <>
        <SvgFrame>
          <Cam dur={dur} z1={1.04} amt={0.6}>
            <Shots id={id} list={shots} dur={dur} pfx="em025-" src={(i) => (i === "sistine-real" ? staticFile("photos/em025-sistine-real.jpg") : staticFile(`illustrations/em025-${i}.png`))} />
          </Cam>
          <Cam dur={dur} z1={1.05} dx={-20} amt={1.3}>
            {ov}
          </Cam>
          {top}
        </SvgFrame>
        <Sfx ev={[...sw, ...ev]} />
      </>
    );
  };
};
const sh = (id: string, t: number, o: Partial<Sh> = {}): Sh => ({
  id: I(id),
  t,
  mv: "in",
  tr: "page",
  ...o,
});

/** Ojo y piramide del billete (foto real del reverso del dolar, dominio publico):
 *  halo pulsante sobre el ojo, parallax del primer plano y anillos.
 *  y=0.34 es donde cae el ojo en el recorte real (antes 0.31, que era el de la imagen IA). */
const BE = (S: number, a: number, e: number) =>
  has("bill-eye") ? (
    <>
      <Par pic="bill-eye" S={S} x={0.5} y={0.62} r={0.32} />
      <Glow id={`be${a}`} x={S * 0.5} y={S * 0.34} r={S * 0.16} a={a} e={e} />
      <Pr x={S * 0.5} y={S * 0.34} r={S * 0.17} a={a} e={e} />
    </>
  ) : null;

/* ============ ch01 gancho (0-13) ============ */
const ch01 = scene(0, "ch01", (P) => ({
  shots: [
    sh("wallet", 0, {
      r: FULL,
      f: [0.5, 0.5],
      tr: "cut",
      m: (S) => (has("wallet") ? <Glow id="w" x={S * 0.5} y={S * 0.55} r={S * 0.2} c="#FFFBE0" a={P(0, 0.6)} /> : null),
    }),
    sh("bill-eye", P(1, 0.3), {
      r: FULL,
      f: [0.5, 0.4],
      tr: "zoom",
      m: (S) => BE(S, P(2, 0.2), P(4)),
    }),
    sh("ceiling", P(5), {
      r: FULL,
      f: [0.5, 0.45],
      mv: "pu",
      tr: "wl",
      m: (S) => (has("ceiling") ? <Motes S={S} /> : null),
    }),
    sh("trials-stage", P(6), { r: FULL, f: [0.5, 0.5], tr: "wr" }),
    sh("chapel-exterior", P(7), { r: FULL, f: [0.5, 0.5], tr: "wl" }),
    sh("bill-eye", P(9), { r: FULL, f: [0.5, 0.5], tr: "page" }),
    sh("ceiling", P(10), {
      r: FULL,
      f: [0.4, 0.4],
      mv: "pr",
      tr: "page",
    }),
    sh("time-machine", P(11), { r: FULL, f: [0.5, 0.5], tr: "zoom" }),
    sh("chapel-exterior", P(12), { r: FULL, f: [0.5, 0.6], z: 1.3, tr: "wr" }),
    sh("wallet", P(13), { r: FULL, f: [0.5, 0.5], mv: "out", tr: "fade" }),
  ],
  ov: (
    <>
      <Q x={300} label="THE BILL" a={P(5, 0.2)} b={P(13, 3)} rot={-2} />
      <Q x={720} label="THE CEILING" a={P(5, 1.8)} b={P(13, 3)} rot={1.5} />
      <Q x={1140} label="THE OPERA" a={P(6, 1.2)} b={P(13, 3)} rot={-1.5} />
      <Q x={1560} label="THE CHAPEL" a={P(7, 1.2)} b={P(13, 3)} rot={2} />
      <Kin x={960} y={560} text="FOUR CASES" size={130} fill={orange} a={P(8, 0.1)} b={P(9)} />
      <Pill x={960} y={560} text="ONE HAS A PAPER TRAIL" a={P(9, 0.2)} b={P(10)} color={teal} />
      <Pill x={960} y={560} text="ONE IS STILL ARGUED OVER" a={P(10, 0.2)} b={P(11)} color={orange} />
      <Pill x={960} y={560} text="ONE BREAKS THE CALENDAR" a={P(11, 0.2)} b={P(12)} color={RED} />
      <Pill x={960} y={560} text="ONE LOOKS OUT OF PLACE" a={P(12, 0.2)} b={P(13)} color={teal} />
      <Kin x={960} y={600} text="WHICH ARE REAL?" size={150} fill={orange} a={P(13, 0.2)} />
    </>
  ),
  top: (
    <>
      <Lab a={0} b={P(1, 0.3)} />
      <Lab text={BILL_CREDIT} a={P(1, 0.3)} b={P(5)} />
      <Lab a={P(5)} b={P(9)} />
      <Lab text={BILL_CREDIT} a={P(9)} b={P(10)} />
      <Lab a={P(10)} b={P(999)} />
    </>
  ),
}));

/* ============ ch02 reglas (14-24) ============ */
const ch02 = scene(14, "ch02", (P) => ({
  shots: [
    sh("stamp-desk", 0, { r: FULL, f: [0.5, 0.55], tr: "cut" }),
    sh("stamp-desk", P(20), {
      r: FULL,
      f: [0.62, 0.5],
      z: 1.5,
      mv: "pr",
      tr: "page",
    }),
    sh("bill-eye", P(24), { r: FULL, f: [0.5, 0.4], tr: "zoom" }),
  ],
  ov: (
    <>
      <Pill x={960} y={150} text="THE RULES" a={P(14, 0.2)} b={P(15)} color={teal} size={56} />
      <Kin x={960} y={230} text="PAPER TRAIL" size={110} fill={orange} a={P(15, 0.3)} b={P(19)} />
      <Kin x={500} y={480} text="NAMES" size={110} a={P(16, 0.1)} b={P(19)} />
      <Kin x={960} y={640} text="DATES" size={110} a={P(17, 0.1)} b={P(19)} />
      <Kin x={1420} y={480} text="RECORDS" size={110} a={P(18, 0.1)} b={P(19)} />
      <Kin x={960} y={430} text="THEN WE STAMP IT" size={100} fill={orange} a={P(19, 0.1)} b={P(20, -0.1)} />
      <Stp x={480} y={170} k="D" a={P(20, 0.3)} size={60} />
      <Pill x={480} y={285} text="THE RECORDS EXIST" a={P(20, 0.8)} size={30} color={FOREST} />
      <Stp x={480} y={430} k="P" a={P(21, 0.2)} size={60} rot={4} />
      <Pill x={480} y={545} text="EXPERTS STILL ARGUE" a={P(21, 0.8)} size={30} />
      <Stp x={480} y={690} k="M" a={P(22, 0.2)} size={60} />
      <Pill x={480} y={805} text="THE EVIDENCE SAYS NO" a={P(22, 0.8)} size={30} color={BRICK} />
      <Reading x={1400} y={150} a={P(23, 0.2)} b={P(24)} />
      <Pill x={1400} y={250} text="OUR CONCLUSION, NOT A HISTORIAN'S" a={P(23, 0.6)} b={P(24)} size={30} color={teal} />
    </>
  ),
  top: (
    <>
      <Lab a={0} b={P(24)} />
      <Lab text={BILL_CREDIT} a={P(24)} b={P(999)} />
    </>
  ),
  ev: [thud(P(20, 0.3)), thud(P(21, 0.2)), thud(P(22, 0.2))],
}));

/* ============ ch03 el sello nace (25-35) ============ */
const ch03 = scene(25, "ch03", (P) => ({
  shots: [
    sh("philadelphia-1776-committee-room-v2", 0, { asp: 1376 / 768, r: FULL, f: [0.75, 0.5], z: 1.25, tr: "cut" }),
    sh("artist-draft", P(30), {
      r: FULL,
      f: [0.58, 0.4],
      z: 1.6,
      tr: "page",
    }),
    sh("secretary-desk", P(32), {
      r: FULL,
      f: [0.5, 0.5],
      tr: "wl",
    }),
    sh("bill-eye", P(35), {
      r: FULL,
      f: [0.5, 0.42],
      tr: "zoom",
      m: (S) => BE(S, P(35, 0.4), P(35, 6)),
    }),
  ],
  ov: (
    <>
      <Pill x={510} y={120} text="JULY 1776" a={P(25, 0.2)} b={P(30)} size={44} />
      <Tl
        y={500}
        x1={130}
        x2={890}
        e={P(30)}
        pts={[
          { x: 200, l: "1776", s: "1st", a: P(26, 0.2) },
          { x: 510, l: "1780", s: "2nd", a: P(27, 0.2) },
          { x: 820, l: "1782", s: "3rd", a: P(28, 0.2) },
        ]}
      />
      <Pill x={510} y={760} text="3 COMMITTEES · 6 YEARS" a={P(29, 0.2)} b={P(30)} color={teal} size={44} />
      <Pill x={510} y={250} text="1776 · THE EYE" a={P(30, 0.2)} b={P(32)} size={46} />
      <Pill x={510} y={420} text="1782 · THE PYRAMID" a={P(31, 0.2)} b={P(32)} size={46} color={teal} />
      <Pill x={510} y={250} text="CHARLES THOMSON" a={P(32, 0.2)} b={P(34)} size={46} color={teal} />
      <Kin x={510} y={450} text="20 JUN 1782" size={90} fill={orange} a={P(33, 0.2)} b={P(34)} />
      {["COMMITTEE", "ARTIST", "EXPERT", "SECRETARY"].map((w, i) => (
        <Pill key={w} x={510} y={190 + i * 140} text={w} a={P(34, 0.1 + i * 0.5)} b={P(35)} size={44} color={i % 2 ? teal : orange} />
      ))}
      <Kin x={960} y={190} text="WHERE ARE THE MASONS?" size={80} a={P(35, 0.2)} />
    </>
  ),
  top: (
    <>
      <Lab text="AI illustration, not a portrait" a={P(25)} b={P(30)} />
      <Lab a={P(30)} b={P(999)} />
      <Src text="greatseal.com" a={P(25, 0.2)} b={P(35)} />
      <Sm a={P(25, 0.2)} b={P(30)} />
      <Sm a={P(35, 0.4)} b={P(35, 6)} />
    </>
  ),
}));

/* ============ ch04 el ojo (36-43) ============ */
const ch04 = scene(36, "ch04", (P) => ({
  shots: [
    sh("church-painting", 0, {
      r: FULL,
      f: [0.5, 0.35],
      z: 1.15,
      tr: "cut",
    }),
    sh("church-painting", P(38, 1.2), {
      r: FULL,
      f: [0.8, 0.14],
      z: 2.2,
      tr: "zoom",
      m: (S) => <Outline S={S} x={0.8} y={0.14} d={EYE} s={0.5} a={P(38, 1.6)} e={P(40)} />,
    }),
    sh("artist-draft", P(39), {
      r: FULL,
      f: [0.58, 0.4],
      z: 1.6,
      tr: "page",
    }),
    sh("masonic-manual", P(40), {
      r: FULL,
      f: [0.5, 0.5],
      tr: "wl",
    }),
    sh("lodge-handshake", P(42), {
      r: FULL,
      f: [0.5, 0.5],
      tr: "wr",
    }),
  ],
  ov: (
    <>
      <Kin x={510} y={260} text="THE EYE" size={150} a={P(36, 0.1)} b={P(37, 0.3)} />
      <Kin x={510} y={240} text="NOT A MASONIC" size={90} fill={RED} a={P(37, 0.3)} b={P(39)} />
      <Kin x={510} y={350} text="INVENTION" size={90} fill={RED} a={P(37, 0.6)} b={P(39)} />
      <Pill x={510} y={600} text="EYE IN A TRIANGLE = TRINITY" a={P(38, 0.4)} b={P(39)} size={34} color={teal} />
      <Pill x={1410} y={170} text="DU SIMITIÈRE: NOT A MASON" a={P(39, 0.3)} b={P(40)} size={36} />
      <Kin x={1410} y={400} text="1790s" size={170} fill={orange} a={P(40, 0.3)} b={P(42)} />
      <Pill x={510} y={780} text="YEARS AFTER THE SEAL" a={P(41, 0.1)} b={P(42)} color={teal} size={36} />
      <Pill x={1410} y={180} text="ONLY ONE KNOWN MASON" a={P(42, 0.3)} b={P(44)} size={38} />
      <Kin x={1410} y={760} text="FRANKLIN" size={120} fill={orange} a={P(43, 0.1)} b={P(44)} />
    </>
  ),
  top: (
    <>
      <Lab a={0} b={P(999)} />
      <Sm a={P(38, 1.6)} b={P(39)} />
      <Src text="greatseal.com" a={P(39, 0.2)} b={P(44)} />
    </>
  ),
}));

/* ============ ch05 del sello al billete (44-57) ============ */
const ch05 = scene(44, "ch05", (P) => ({
  shots: [
    sh("wallet", 0, { r: FULL, f: [0.5, 0.5], tr: "cut" }),
    sh("office-1934", P(45), { r: FULL, f: [0.5, 0.5], tr: "page" }),
    sh("office-1934", P(46), {
      r: FULL,
      f: [0.57, 0.78],
      z: 1.8,
      mv: "pl",
      tr: "zoom",
    }),
    sh("president-desk", P(49), {
      r: FULL,
      f: [0.5, 0.5],
      tr: "wr",
    }),
    sh("president-desk", P(51), {
      r: FULL,
      f: [0.75, 0.6],
      z: 1.5,
      tr: "wl",
    }),
    sh("bill-eye", P(52), {
      r: FULL,
      f: [0.5, 0.4],
      tr: "zoom",
      m: (S) => BE(S, P(53, 0.3), P(57)),
    }),
  ],
  ov: (
    <>
      <Pill x={960} y={150} text="SO HOW DID IT REACH YOUR WALLET?" a={P(44, 0.2)} b={P(45)} color={teal} size={44} />
      <Kin x={510} y={260} text="1934" size={200} fill={orange} a={P(45, 0.2)} b={P(46)} />
      <Pill x={510} y={440} text="A HISTORY OF THE SEAL" a={P(45, 1.2)} b={P(46)} size={34} color={teal} />
      <Kin x={510} y={230} text="NOVUS ORDO" size={90} a={P(46, 0.2)} b={P(48)} />
      <Kin x={510} y={330} text="SECLORUM" size={90} a={P(46, 0.5)} b={P(48)} />
      <Ar x1={510} y1={400} x2={510} y2={500} a={P(46, 1.3)} e={P(48)} />
      <Pill x={510} y={600} text="A NEW ORDER OF THE AGES" a={P(46, 1.6)} b={P(48)} color={teal} size={36} />
      <Kin x={510} y={300} text="COIN?" size={150} a={P(48, 0.2)} b={P(49)} />
      <Kin x={1410} y={300} text="COIN?" size={130} fill={GOLD} a={P(49, 0.1)} b={P(51)} />
      <Ar x1={1330} y1={380} x2={1330} y2={460} a={P(49, 0.8)} e={P(51)} />
      <Kin x={1410} y={600} text="THE BILL" size={130} fill={FOREST} a={P(49, 1.2)} b={P(51)} />
      <Kin x={510} y={250} text="1911" size={200} fill={orange} a={P(51, 0.2)} b={P(52)} />
      <Pill x={510} y={420} text="ROOSEVELT: A FREEMASON" a={P(51, 0.7)} b={P(52)} size={34} color={teal} />
      <Kin x={960} y={640} text="BUT THE SEAL WAS FINISHED" size={80} a={P(52, 0.3)} b={P(53)} />
      <Kin x={500} y={190} text="1782" size={150} a={P(53, 0.1)} b={P(55)} />
      <Ar x1={660} y1={190} x2={1200} y2={190} a={P(53, 0.5)} e={P(55)} />
      <Kin x={1400} y={190} text="1935" size={150} a={P(53, 1.0)} b={P(55)} />
      <Num x={960} y={430} v={153} size={260} a={P(53, 1.4)} b={P(55)} />
      <Kin x={960} y={640} text="YEARS" size={110} fill={teal} a={P(53, 1.6)} b={P(55)} />
      <Pill x={960} y={300} text="FIRST BILL WITH BOTH SIDES OF THE SEAL" a={P(54, 0.2)} b={P(55)} size={36} />
      <Stp x={1450} y={760} k="D" a={P(56, 0.3)} size={44} />
      <Stp x={620} y={760} k="M" a={P(57, 0.3)} size={90} rot={-8} />
    </>
  ),
  top: (
    <>
      <Lab a={0} b={P(52)} />
      <Lab text={BILL_CREDIT} a={P(52)} b={P(999)} />
      <Src text="FDR Presidential Library" a={P(45, 0.2)} b={P(52)} />
      <Src text="Wikipedia" a={P(52, 0.3)} b={P(55)} />
    </>
  ),
  ev: [[P(53, 1.4), "swell", 0.4], thud(P(56, 0.3)), thud(P(57, 0.3))],
}));

/* ============ ch06 Capilla Sixtina (58-68) ============ */
const ch06 = scene(58, "ch06", (P) => ({
  shots: [
    sh("ceiling", 0, {
      r: FULL,
      f: [0.5, 0.4],
      mv: "pu",
      tr: "cut",
      m: (S) => (has("ceiling") ? <Motes S={S} /> : null),
    }),
    sh("sistine-real", P(60), { r: FULL, f: [0.5, 0.5], tr: "page" }),
    sh("creation-ai", P(61), {
      r: FULL,
      f: [0.68, 0.45],
      tr: "page",
      m: (S) =>
        has("creation-ai") ? (
          <>
            <Par pic="creation-ai" S={S} x={0.76} y={0.4} r={0.34} />
            <Glow id="cr" x={S * 0.74} y={S * 0.4} r={S * 0.2} c="#FF7A6B" a={P(61, 1)} e={P(64)} />
            <Outline S={S} x={0.77} y={0.42} d={BRAIN} s={2.1} a={P(62, 0.5)} e={P(64)} />
          </>
        ) : (
          <Outline S={S} x={0.5} y={0.25} d={BRAIN} s={1.9} a={P(62, 0.5)} e={P(64)} />
        ),
    }),
    sh("separation-ai", P(63), {
      r: FULL,
      f: [0.6, 0.27],
      z: 2.2,
      tr: "wl",
      m: (S) =>
        has("separation-ai") ? (
          <>
            <Glow id="sp" x={S * 0.6} y={S * 0.26} r={S * 0.07} c="#FFF3C4" a={P(64, 0.3)} e={P(65)} />
            <Outline S={S} x={0.6} y={0.265} d={STEM} s={0.6} a={P(64, 0.6)} e={P(65)} />
          </>
        ) : (
          <Outline S={S} x={0.5} y={0.55} d={STEM} s={1.5} a={P(64, 0.6)} e={P(65)} />
        ),
    }),
    sh("creation-ai", P(65), {
      r: FULL,
      f: [0.6, 0.4],
      z: 1.15,
      mv: "in",
      tr: "fade",
    }),
    sh("hospital-sketch", P(67), {
      r: FULL,
      f: [0.5, 0.5],
      tr: "page",
    }),
  ],
  ov: (
    <>
      <Pill x={960} y={150} text="CASE TWO" a={P(58, 0.2)} b={P(59)} size={50} color={teal} />
      <Pill x={960} y={150} text="ROME · 1508-1512" a={P(59, 0.2)} b={P(61)} size={50} />
      <Kin x={510} y={260} text="JAMA, 1990" size={100} fill={orange} a={P(61, 0.2)} b={P(63)} />
      <Pill x={510} y={420} text="THE SHAPE LOOKS LIKE A BRAIN" a={P(62, 0.3)} b={P(63)} size={32} color={teal} />
      <Kin x={510} y={260} text="NEUROSURGERY" size={90} fill={orange} a={P(63, 0.2)} b={P(65)} />
      <Kin x={510} y={360} text="2010" size={150} a={P(63, 0.6)} b={P(65)} />
      <Pill x={510} y={560} text="A BRAIN STEM IN THE NECK?" a={P(64, 0.3)} b={P(65)} size={32} color={teal} />
      <Kin x={960} y={190} text="GOD GIVES ADAM INTELLIGENCE" size={80} a={P(65, 0.2)} b={P(67)} />
      <Reading x={960} y={110} a={P(65, 0.2)} b={P(67)} />
      <Pill x={510} y={200} text="CONDIVI, 1553" a={P(67, 0.2)} b={P(69)} size={50} />
      <Pill x={510} y={360} text="MICHELANGELO STUDIED ANATOMY" a={P(67, 0.6)} b={P(69)} size={32} color={teal} />
    </>
  ),
  top: (
    <>
      <Lab text="Illustrative recreation" a={P(58)} b={P(60)} />
      <Lab text="Sistine Chapel ceiling, 1508-1512 - Wikimedia Commons, public domain" a={P(60)} b={P(61)} />
      <Lab text="Illustrative recreation" a={P(61)} b={P(999)} />
      <Sm a={P(62, 0.5)} b={P(65)} />
      <Src text="JAMA, 1990" a={P(61, 0.2)} b={P(63)} />
      <Src text="Neurosurgery, 2010" a={P(63, 0.2)} b={P(65)} />
      <Src text="Wikipedia; Hektoen International" a={P(67, 0.2)} b={P(69)} />
    </>
  ),
}));

/* ============ ch07 disputed (69-77) ============ */
const ch07 = scene(69, "ch07", (P) => ({
  shots: [
    sh("creation-ai", 0, { r: FULL, f: [0.5, 0.4], tr: "cut" }),
    sh("journals-brain", P(70), {
      r: FULL,
      f: [0.5, 0.5],
      tr: "page",
    }),
    sh("clouds-faces", P(72), { r: FULL, f: [0.5, 0.5], tr: "wr" }),
    sh("moon-face", P(73), {
      r: FULL,
      f: [0.5, 0.5],
      tr: "zoom",
      m: (S) => <Glow id="mn" x={S * 0.5} y={S * 0.48} r={S * 0.3} c="#FFF3C4" a={P(73, 0.2)} />,
    }),
    sh("journals-brain", P(76), {
      r: FULL,
      f: [0.5, 0.5],
      mv: "out",
      tr: "fade",
    }),
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="BUT HOLD ON" size={110} a={P(69, 0.1)} b={P(70)} />
      <Pill x={510} y={200} text="GOITER" a={P(70, 0.4)} b={P(72)} size={50} />
      <Pill x={510} y={380} text="WOMB" a={P(71, 0.2)} b={P(72)} size={50} color={teal} />
      <Pill x={510} y={560} text="BRAIN" a={P(71, 2.0)} b={P(72)} size={50} />
      <Kin x={1410} y={250} text="PATTERN OR" size={90} a={P(72, 0.3)} b={P(73)} />
      <Kin x={1410} y={360} text="WISHFUL SEEING?" size={90} fill={orange} a={P(72, 0.7)} b={P(73)} />
      <Pill x={510} y={200} text="THE MAN IN THE MOON" a={P(73, 0.3)} b={P(75)} color={teal} size={44} />
      <Stp x={510} y={640} k="P" a={P(75, 0.3)} size={80} />
      <Kin x={960} y={190} text="NOBODY CAN PROVE IT" size={100} a={P(76, 0.2)} b={P(77, 1.5)} />
      <Kin x={1300} y={760} text="NO DOCUMENT" size={100} fill={orange} a={P(77, 0.2)} />
    </>
  ),
  top: <Lab text="Illustrative recreation" a={0} b={P(999)} />,
  ev: [thud(P(75, 0.3))],
}));

/* ============ ch08 codigo masonico (78-87) ============ */
const ch08 = scene(78, "ch08", (P) => ({
  shots: [
    sh("creation-ai", 0, { r: FULL, f: [0.4, 0.45], z: 1.4, tr: "cut" }),
    sh("stonemasons", P(80), { r: FULL, f: [0.5, 0.5], tr: "page" }),
    sh("tavern-1717", P(81), { r: FULL, f: [0.5, 0.5], tr: "wl" }),
    sh("stonemasons", P(85), { r: FULL, f: [0.5, 0.5], tr: "wr" }),
    sh("time-machine", P(86), {
      r: FULL,
      f: [0.5, 0.5],
      tr: "zoom",
      m: (S) => (has("time-machine") ? <Glow id="tm" x={S * 0.5} y={S * 0.55} r={S * 0.2} a={P(86, 0.4)} /> : null),
    }),
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="MASONIC CODE?" size={130} fill={orange} a={P(78, 0.2)} b={P(79, 1.5)} />
      <Tl
        y={500}
        x1={130}
        x2={890}
        e={P(84)}
        pts={[
          { x: 250, l: "1564", s: "MICHELANGELO DIES", a: P(80, 0.2) },
          { x: 770, l: "1717", s: "FIRST GRAND LODGE", a: P(81, 0.2) },
        ]}
      />
      <Kin x={510} y={780} text="153 YEARS" size={110} fill={orange} a={P(82, 0.2)} b={P(84)} />
      <Pill x={510} y={150} text="SAME GAP AS THE DOLLAR" a={P(83, 0.2)} b={P(84)} color={teal} size={38} />
      <Kin x={510} y={760} text="COINCIDENCE" size={100} a={P(84, 0.2)} b={P(85)} />
      <Pill x={1410} y={180} text="NO RECORD LINKS HIM TO A LODGE" a={P(85, 0.2)} b={P(86)} size={34} />
      <Pill x={960} y={150} text="153 YEARS · SAME GAP AS THE DOLLAR" a={P(86, 0.3)} b={P(87)} size={40} color={teal} />
      <Stp x={960} y={760} k="M" a={P(87, 0.3)} size={100} rot={-6} />
    </>
  ),
  top: (
    <>
      <Lab a={0} b={P(999)} />
      <Sm a={P(80, 0.2)} b={P(84)} />
      <Src text="Wikipedia" a={P(80, 0.2)} b={P(84)} />
    </>
  ),
  ev: [thud(P(87, 0.3)), [P(86, 0.3), "ding", 0.4]],
}));

/* ============ ch09 Mozart (88-97) ============ */
const ch09 = scene(88, "ch09", (P) => ({
  shots: [
    sh("lodge-handshake", 0, {
      r: FULL,
      f: [0.5, 0.5],
      tr: "cut",
      m: (S) => <Glow id="cd" x={S * 0.5} y={S * 0.4} r={S * 0.3} c="#FFD27A" a={0} />,
    }),
    sh("lodge-handshake", P(91), {
      r: FULL,
      f: [0.35, 0.45],
      z: 1.4,
      mv: "pl",
      tr: "page",
    }),
    sh("father-son", P(94), { r: FULL, f: [0.5, 0.5], tr: "wr" }),
    sh("orchestra", P(95), { r: FULL, f: [0.5, 0.5], tr: "wl" }),
    sh("temple-ceremony", P(96), {
      r: FULL,
      f: [0.5, 0.5],
      tr: "zoom",
      m: (S) => (has("temple-ceremony") ? <Motes S={S} n={10} /> : null),
    }),
  ],
  ov: (
    <>
      <Pill x={960} y={150} text="CASE THREE" a={P(88, 0.1)} b={P(89)} size={50} color={teal} />
      <Kin x={960} y={760} text="A HAPPY KIND OF PROOF" size={90} a={P(88, 0.4)} b={P(89)} />
      <Pill x={960} y={150} text="14 DEC 1784" a={P(89, 0.2)} b={P(91)} size={60} />
      <Pill x={960} y={300} text="LODGE: BENEFICENCE" a={P(90, 0.2)} b={P(91)} size={44} color={teal} />
      <Kin x={510} y={260} text="MOZART" size={160} fill={orange} a={P(91, 0.2)} b={P(94)} />
      <Pill x={510} y={500} text="WEEKS: THE NEXT DEGREE" a={P(92, 0.2)} b={P(94)} size={34} color={teal} />
      <Pill x={510} y={640} text="MONTHS: MASTER MASON" a={P(93, 0.2)} b={P(94)} size={34} />
      <Pill x={1410} y={170} text="1785 · LEOPOLD" a={P(94, 0.2)} b={P(95)} size={50} />
      <Pill x={510} y={170} text="1785 · MOURNING MUSIC" a={P(95, 0.2)} b={P(96)} size={46} color={teal} />
      <Pill x={960} y={150} text="NOV 1791 · CANTATA" a={P(96, 0.2)} b={P(97)} size={54} />
    </>
  ),
  top: (
    <>
      <Src text="Grand Lodge of British Columbia and Yukon" a={P(89, 0.2)} b={P(94)} />
      <Src text="Wikipedia" a={P(94, 0.2)} b={P(98)} />
      <Lab a={0} b={P(999)} />
    </>
  ),
}));

/* ============ ch10 la flauta magica (98-112) ============ */
const ch10 = scene(98, "ch10", (P) => ({
  shots: [
    sh("stage-ladies-boys", 0, { r: FULL, f: [0.5, 0.5], tr: "cut" }),
    sh("fortepiano-hands", P(102), {
      r: FULL,
      f: [0.5, 0.5],
      tr: "wl",
      m: (S) =>
        has("fortepiano-hands") ? (
          <>
            <Glow id="f1" x={S * 0.42} y={S * 0.58} r={S * 0.12} a={P(102, 0.6)} e={P(102, 1.3)} />
            <Glow id="f2" x={S * 0.55} y={S * 0.68} r={S * 0.12} a={P(102, 1.4)} e={P(102, 2.1)} />
            <Glow id="f3" x={S * 0.68} y={S * 0.78} r={S * 0.12} a={P(102, 2.2)} e={P(103)} />
          </>
        ) : null,
    }),
    sh("stage-ladies-boys", P(103), {
      r: FULL,
      f: [0.3, 0.55],
      z: 1.5,
      mv: "pr",
      tr: "page",
    }),
    sh("stage-ladies-boys", P(104), {
      r: FULL,
      f: [0.55, 0.65],
      z: 1.5,
      mv: "pr",
      tr: "pop",
    }),
    sh("temple-ceremony", P(105), {
      r: FULL,
      f: [0.5, 0.5],
      tr: "page",
    }),
    sh("trials-stage", P(106), {
      r: FULL,
      f: [0.5, 0.5],
      tr: "zoom",
      m: (S) => (has("trials-stage") ? <Glow id="fl" x={S * 0.08} y={S * 0.58} r={S * 0.16} c="#FF9B3D" a={P(106, 0.4)} /> : null),
    }),
    sh("fortepiano-hands", P(108), {
      r: FULL,
      f: [0.5, 0.5],
      tr: "wr",
    }),
    sh("stage-ladies-boys", P(109), {
      r: FULL,
      f: [0.5, 0.5],
      tr: "page",
    }),
    sh("stamp-desk", P(110), { r: FULL, f: [0.5, 0.55], tr: "fade" }),
  ],
  ov: (
    <>
      <Pill x={500} y={150} text="30 SEP 1791 · VIENNA" a={P(98, 0.2)} b={P(100)} size={56} />
      <Kin x={960} y={760} text="THE MAGIC FLUTE" size={120} fill={orange} a={P(100, 0.2)} b={P(101, 1)} />
      <Pill x={960} y={150} text="NOW LISTEN FOR THE PATTERN" a={P(101, 0.2)} b={P(102)} size={44} color={teal} />
      <Kin x={960} y={760} text="3 CHORDS" size={150} fill={orange} a={P(102, 0.4)} b={P(103)} />
      <Kin x={510} y={250} text="3 LADIES" size={110} a={P(103, 0.3)} b={P(104)} />
      <Kin x={510} y={250} text="3 BOYS" size={110} fill={teal} a={P(104, 0.3)} b={P(105)} />
      <Kin x={510} y={250} text="3 TEMPLES" size={110} fill={orange} a={P(105, 0.3)} b={P(106)} />
      <Kin x={960} y={190} text="SILENCE · FIRE · WATER" size={100} a={P(106, 0.3)} b={P(107)} />
      <Pill x={960} y={760} text="COMPARED TO INITIATION RITES" a={P(106, 1.5)} b={P(107)} size={36} color={teal} />
      <Kin x={960} y={190} text="BUT CAREFUL" size={130} fill={RED} a={P(107, 0.1)} b={P(108)} />
      <Pill x={1410} y={200} text="3 CHORDS IN NON-MASONIC OPERAS TOO" a={P(108, 0.3)} b={P(109)} size={32} color={RED} />
      <Pill x={510} y={150} text="FAIRY TALE · EGYPT" a={P(109, 0.3)} b={P(110)} size={40} color={teal} />
      <Pill x={510} y={290} text="ENLIGHTENMENT · FOLK COMEDY" a={P(109, 1.2)} b={P(110)} size={40} />
      <Pill x={960} y={150} text="VERDICT" a={P(110, 0.1)} b={P(113)} size={44} color={teal} />
      <Stp x={620} y={470} k="D" a={P(111, 0.3)} size={60} />
      <Pill x={620} y={580} text="MOZART'S FREEMASONRY" a={P(111, 0.7)} b={P(113)} size={30} color={FOREST} />
      <Stp x={1300} y={470} k="P" a={P(112, 0.3)} size={60} rot={5} />
      <Pill x={1300} y={580} text="HOW MASONIC IS THE OPERA" a={P(112, 0.7)} b={P(113)} size={30} />
    </>
  ),
  top: (
    <>
      <Lab a={0} b={P(999)} />
      <Src text="Mediathek.at" a={P(98, 0.2)} b={P(110)} />
      <Src text="Wikipedia" a={P(110)} b={P(113)} />
    </>
  ),
  ev: [thud(P(111, 0.3)), thud(P(112, 0.3)), [P(102, 0.6), "ding", 0.4], [P(102, 1.4), "ding", 0.4], [P(102, 2.2), "ding", 0.4]],
}));

/* ============ ch11 el rastro en papel (113-118) ============ */
const ch11 = scene(113, "ch11", (P) => ({
  shots: [
    sh("secretary-desk", 0, { r: FULL, f: [0.5, 0.5], tr: "cut" }),
    sh("ceiling", P(115), { r: FULL, f: [0.5, 0.45], tr: "page" }),
    sh("fortepiano-hands", P(116), { r: FULL, f: [0.5, 0.5], tr: "wl" }),
    sh("stonemasons", P(117), { r: FULL, f: [0.5, 0.5], tr: "zoom" }),
  ],
  ov: (
    <>
      <Reading x={960} y={110} a={P(113, 0.1)} b={P(118)} />
      <Kin x={960} y={760} text="A REAL MESSAGE LEAVES PAPER" size={90} a={P(113, 0.6)} b={P(114)} />
      <Pill x={960} y={760} text="THE BILL: A COMMITTEE AND A VOTE" a={P(114, 0.2)} b={P(115)} size={44} color={teal} />
      <Pill x={960} y={760} text="THE CEILING: NO LODGE AT ALL" a={P(115, 0.2)} b={P(116)} size={44} color={RED} />
      <Pill x={960} y={760} text="MOZART: A LODGE · A DATE · A SCORE" a={P(116, 0.2)} b={P(117)} size={44} />
      <Kin x={960} y={760} text="THE LAST CASE HAS ALMOST NO PAPER" size={70} a={P(117, 0.2)} b={P(119)} />
      <Kin x={960} y={190} text="IT HAS STONE" size={150} fill={orange} a={P(118, 0.1)} />
    </>
  ),
  top: <Lab a={0} b={P(119)} />,
}));

/* ============ ch12 Rosslyn (119-131) ============ */
const ch12 = scene(119, "ch12", (P) => ({
  shots: [
    sh("chapel-exterior", 0, {
      r: FULL,
      f: [0.5, 0.5],
      tr: "cut",
      m: (S) => (has("chapel-exterior") ? <Par pic="chapel-exterior" S={S} x={0.5} y={0.5} r={0.4} /> : null),
    }),
    sh("knights-1312", P(123), {
      r: FULL,
      f: [0.5, 0.5],
      tr: "page",
    }),
    sh("chapel-exterior", P(125), {
      r: FULL,
      f: [0.4, 0.55],
      z: 1.3,
      tr: "wr",
    }),
    sh("stonemasons", P(126), { r: FULL, f: [0.5, 0.5], tr: "wl" }),
    sh("paper-trail", P(128), {
      r: FULL,
      f: [0.3, 0.5],
      z: 1.4,
      tr: "page",
    }),
    sh("chapel-exterior", P(131), {
      r: FULL,
      f: [0.5, 0.5],
      mv: "out",
      tr: "fade",
    }),
  ],
  ov: (
    <>
      <Pill x={960} y={140} text="CASE FOUR" a={P(119, 0.1)} b={P(120)} size={50} color={teal} />
      <Pill x={960} y={140} text="NEAR EDINBURGH · SCOTLAND" a={P(120, 0.2)} b={P(121)} size={44} />
      <Pill x={960} y={140} text="ROSSLYN CHAPEL" a={P(121, 0.2)} b={P(122)} size={60} />
      <Pill x={960} y={140} text="MID-1400s" a={P(122, 0.3)} b={P(123)} size={54} color={teal} />
      <Kin x={960} y={760} text="A HIDDEN TEMPLAR SECRET?" size={80} a={P(123, 0.2)} b={P(124)} />
      <Pill x={510} y={150} text="1312 · TEMPLARS DISSOLVED" a={P(124, 0.2)} b={P(125)} size={38} color={teal} />
      <Kin x={1410} y={250} text="NO BASIS" size={120} fill={RED} a={P(125, 0.3)} b={P(126)} />
      <Pill x={510} y={180} text="FOUNDED FOR MASSES FOR THE DEAD" a={P(126, 0.2)} b={P(127)} size={32} color={teal} />
      <Stp x={1410} y={700} k="M" a={P(127, 0.3)} b={P(128)} size={80} />
      <Pill x={1410} y={170} text="1736 · GRAND MASTER MASON OF SCOTLAND" a={P(129, 0.2)} b={P(130)} size={30} />
      <Stp x={1410} y={600} k="D" a={P(130, 0.3)} size={70} rot={5} />
      <Pill x={1410} y={170} text="+ ~3 CENTURIES" a={P(131, 0.2)} b={P(132)} size={46} color={teal} />
    </>
  ),
  top: (
    <>
      <Lab a={0} b={P(999)} />
      <Src text="Rosslyn Chapel (official site)" a={P(120, 0.2)} b={P(127)} />
      <Src text="Wikipedia" a={P(128)} b={P(132)} />
    </>
  ),
  ev: [thud(P(127, 0.3)), thud(P(130, 0.3))],
}));

/* ============ ch13 el maiz (132-146) ============ */
const ch13 = scene(132, "ch13", (P) => ({
  shots: [
    sh("maize-carving", 0, {
      r: FULL,
      f: [0.5, 0.5],
      tr: "cut",
      m: (S) =>
        has("maize-carving") ? (
          <>
            <Par pic="maize-carving" S={S} x={0.5} y={0.4} r={0.3} />
            <Swp S={S} a={P(133, 0.5)} />
            <Glow id="mz" x={S * 0.5} y={S * 0.4} r={S * 0.14} a={P(134, 1)} e={P(136)} />
          </>
        ) : null,
    }),
    sh("maize-carving", P(135), {
      r: FULL,
      f: [0.5, 0.5],
      z: 1.4,
      tr: "page",
      m: (S) => (has("maize-carving") ? <Pr x={S * 0.5} y={S * 0.4} r={S * 0.2} a={P(137)} e={P(138)} /> : null),
    }),
    sh("maize-carving", P(138), { r: FULL, f: [0.3, 0.55], z: 1.6, tr: "wr" }),
    sh("botanist-plants", P(143), {
      r: FULL,
      f: [0.5, 0.5],
      tr: "wl",
    }),
    sh("restoration-1860s", P(144), {
      r: FULL,
      f: [0.5, 0.5],
      tr: "page",
    }),
    sh("paper-trail", P(145), { r: FULL, f: [0.5, 0.5], tr: "wl" }),
  ],
  ov: (
    <>
      <Pill x={960} y={140} text="NOW THE PLANT" a={P(132, 0.1)} b={P(133)} size={50} color={teal} />
      <Pill x={960} y={140} text="SOUTH AISLE" a={P(133, 0.3)} b={P(134)} size={56} />
      <Kin x={960} y={790} text="EARS OF CORN?" size={100} fill={orange} a={P(133, 1.2)} b={P(135)} />
      <Tl
        y={500}
        x1={130}
        x2={890}
        e={P(138)}
        pts={[
          { x: 250, l: "mid-1400s", s: "CHAPEL BEGUN", a: P(135, 0.3) },
          { x: 770, l: "1492", s: "COLUMBUS SAILS", a: P(136, 0.3) },
        ]}
      />
      <Pill x={510} y={780} text="MAIZE COMES FROM THE AMERICAS" a={P(135, 0.4)} b={P(137)} size={30} color={teal} />
      <Kin x={510} y={270} text="IF IT IS MAIZE..." size={90} a={P(137, 0.1)} b={P(138)} />
      <Kin x={1410} y={250} text="BUT SOME DOUBT IT" size={80} fill={RED} a={P(138, 0.2)} b={P(139)} />
      <Pill x={1410} y={420} text="STYLISED PATTERNS?" a={P(139, 0.2)} b={P(141)} size={40} color={teal} />
      <Stp x={510} y={700} k="P" a={P(141, 0.3)} size={90} rot={-6} />
      <Pill x={960} y={140} text="3 WAYS TO SETTLE IT" a={P(142, 0.1)} b={P(143)} size={50} color={teal} />
      <Pill x={510} y={170} text="ROAD 1" a={P(143, 0.2)} b={P(144)} size={50} />
      <Pill x={510} y={300} text="COMPARE WITH REAL PLANTS" a={P(143, 0.6)} b={P(144)} size={32} color={teal} />
      <Pill x={1410} y={170} text="ROAD 2" a={P(144, 0.2)} b={P(145)} size={50} />
      <Pill x={1410} y={300} text="MEDIEVAL OR 1860s RESTORATION?" a={P(144, 0.6)} b={P(145)} size={30} color={teal} />
      <Pill x={510} y={170} text="ROAD 3" a={P(145, 0.2)} b={P(146)} size={50} />
      <Pill x={510} y={300} text="WRITTEN BUILDER RECORDS" a={P(145, 0.6)} b={P(146)} size={32} color={teal} />
    </>
  ),
  top: (
    <>
      <Lab a={0} b={P(999)} />
      <Src text="Rosslyn Chapel (official site)" a={P(133, 0.2)} b={P(138)} />
      <Sm a={P(135, 0.3)} b={P(138)} />
    </>
  ),
  ev: [thud(P(141, 0.3))],
}));

/* ============ ch14 lo que si se puede probar (147-154) ============ */
const ch14 = scene(147, "ch14", (P) => ({
  shots: [
    sh("norse-site", 0, {
      r: FULL,
      f: [0.5, 0.5],
      tr: "cut",
      m: (S) => (has("norse-site") ? <Par pic="norse-site" S={S} x={0.5} y={0.5} r={0.4} /> : null),
    }),
    sh("tree-rings", P(149), {
      r: FULL,
      f: [0.5, 0.5],
      tr: "page",
      m: (S) => (has("tree-rings") ? <Pr x={S * 0.85} y={S * 0.8} r={S * 0.16} a={P(150, 0.4)} e={P(152)} /> : null),
    }),
    sh("norse-site", P(152), { r: FULL, f: [0.5, 0.5], tr: "wr" }),
    sh("stamp-desk", P(154), { r: FULL, f: [0.5, 0.5], tr: "page" }),
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="ONE THING WE CAN PROVE" size={90} a={P(147, 0.1)} b={P(148)} />
      <Pill x={960} y={140} text="L'ANSE AUX MEADOWS" a={P(148, 0.2)} b={P(149)} size={56} />
      <Pill x={960} y={260} text="NEWFOUNDLAND" a={P(148, 0.6)} b={P(149)} size={40} color={teal} />
      <Pill x={960} y={760} text="WOOD CUT WITH METAL TOOLS" a={P(148, 1.4)} b={P(149)} size={36} color={teal} />
      <Pill x={510} y={150} text="NATURE, 2021" a={P(149, 0.2)} b={P(151)} size={50} />
      <Kin x={510} y={330} text="AD 993" size={160} fill={orange} a={P(150, 0.3)} b={P(152)} />
      <Pill x={510} y={500} text="RADIOCARBON SPIKE = A CLOCK" a={P(150, 0.9)} b={P(152)} size={30} color={teal} />
      <Ar x1={510} y1={570} x2={510} y2={650} a={P(151, 0.2)} e={P(152)} />
      <Kin x={510} y={760} text="BEST FIT: AD 1021" size={90} a={P(151, 0.4)} b={P(152)} />
      <Pill x={960} y={140} text="ABOUT 470 YEARS BEFORE COLUMBUS" a={P(152, 0.2)} b={P(153)} size={50} />
      <Stp x={960} y={700} k="D" a={P(153, 0.3)} size={90} />
      <Kin x={1410} y={300} text="NOTHING ABOUT" size={90} a={P(154, 0.2)} />
      <Kin x={1410} y={420} text="ROSSLYN" size={130} fill={RED} a={P(154, 0.5)} />
    </>
  ),
  top: (
    <>
      <Lab a={0} b={P(999)} />
      <Src text="Nature, 2021" a={P(149, 0.2)} b={P(154)} />
      <Sm a={P(150, 0.9)} b={P(152)} />
    </>
  ),
  ev: [thud(P(153, 0.3))],
}));

/* ============ ch15 cierre (155-165) ============ */
const ch15 = scene(155, "ch15", (P) => ({
  shots: [
    sh("wallet", 0, { r: FULL, f: [0.5, 0.5], tr: "cut" }),
    sh("secretary-desk", P(156), { r: FULL, f: [0.5, 0.5], tr: "page" }),
    sh("ceiling", P(157), { r: FULL, f: [0.5, 0.45], tr: "fade" }),
    sh("fortepiano-hands", P(158), { r: FULL, f: [0.5, 0.5], tr: "fade" }),
    sh("chapel-exterior", P(159), { r: FULL, f: [0.5, 0.5], tr: "fade" }),
    sh("paper-trail", P(160), { r: FULL, f: [0.5, 0.5], tr: "wl" }),
    sh("paper-trail", P(162), { r: FULL, f: [0.5, 0.5], z: 1.2, tr: "zoom" }),
    sh("wallet", P(164), { r: FULL, f: [0.5, 0.5], tr: "wr" }),
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="BACK TO YOUR WALLET" size={100} a={P(155, 0.2)} b={P(156)} />
      <Row y={170} label="THE BILL" k={["M"]} a={P(156, 0.3)} e={P(160)} />
      <Row y={380} label="THE CEILING" k={["P", "M"]} a={P(157, 0.3)} e={P(160)} />
      <Row y={590} label="MOZART" k={["D"]} a={P(158, 0.3)} e={P(160)} />
      <Row y={800} label="ROSSLYN" k={["M", "D", "P"]} a={P(159, 0.3)} e={P(160)} />
      <Reading x={960} y={110} a={P(160, 0.2)} b={P(162)} />
      <Kin x={960} y={760} text="THE REAL ONES LEAVE A PAPER TRAIL" size={80} a={P(160, 0.6)} b={P(161, 0.1)} />
      <Kin x={960} y={760} text="THE REST ADD THE SECRET SOCIETY LATER" size={56} a={P(161, 0.2)} b={P(162)} />
      <Kin x={960} y={190} text="HIDDEN MESSAGE?" size={110} a={P(162, 0.2)} b={P(163)} />
      <Kin x={960} y={190} text="WHERE IS THE PAPER?" size={130} fill={orange} a={P(163, 0.2)} b={P(164)} />
      <Kin x={960} y={200} text="WHY IS THE DOLLAR GREEN?" size={110} fill={FOREST} a={P(165, 0.1)} />
    </>
  ),
  top: (
    <>
      <Lab a={0} b={P(999)} />
      <Sm a={P(156, 0.3)} b={P(160)} />
    </>
  ),
  ev: [thud(P(156, 0.3)), thud(P(157, 0.3)), thud(P(158, 0.3)), thud(P(159, 0.3))],
}));

export const SCENES025: Record<string, React.FC<SceneProps>> = {
  ch01,
  ch02,
  ch03,
  ch04,
  ch05,
  ch06,
  ch07,
  ch08,
  ch09,
  ch10,
  ch11,
  ch12,
  ch13,
  ch14,
  ch15,
};
