import React from "react";
import { getLength, getPointAtLength } from "@remotion/paths";
import { noise2D } from "@remotion/noise";
import rough from "roughjs";
import { interpolate, staticFile, useCurrentFrame } from "remotion";
import { AVAILABLE } from "../illustrations";
import { ramp } from "../utils/anim";
import { theme } from "../themes/brand";
import { bg, G, GREY, ink, orange, RED, teal, useT } from "./kit";

/** Kit de estilo v2: papel con textura, camara, objeto-metafora, mascota, tarjetas de cifra, indicador de capitulo, subtitulo pequeno. */
export const HAND = '"Segoe Script", "Ink Free", "Bradley Hand ITC", cursive';
const CARD = "#FFFDF6";

const clamp = (v: number) => Math.max(0, Math.min(1, v));
/** Rebote de entrada 0 -> 1 con sobrepaso (back-out). */
export const pop = (t: number, t0: number, d = 0.55): number => {
  const u = clamp((t - t0) / d);
  const c = 2.2;
  return u <= 0 ? 0 : 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2);
};

/** Fondo de papel: grano (feTurbulence), manchas suaves, curvas de nivel tenues y vineta. Va una sola vez, bajo las escenas. */
export const PaperBg: React.FC = () => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
    <defs>
      <filter id="grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={3} seed={7} />
        <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.27  0 0 0 0 0.15  0.5 0 0 0 -0.12" />
      </filter>
      <filter id="blot" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.0035" numOctaves={2} seed={11} />
        <feColorMatrix values="0 0 0 0 0.62  0 0 0 0 0.45  0 0 0 0 0.2  0.9 0 0 0 -0.3" />
      </filter>
      <radialGradient id="vig" cx="50%" cy="48%" r="75%">
        <stop offset="0.55" stopColor="#6B4A1E" stopOpacity={0} />
        <stop offset="1" stopColor="#6B4A1E" stopOpacity={0.26} />
      </radialGradient>
    </defs>
    <rect width={1920} height={1080} fill={bg} />
    <rect width={1920} height={1080} filter="url(#blot)" opacity={0.55} />
    <g fill="none" stroke={teal} strokeWidth={2} opacity={0.07}>
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M-40 ${200 + i * 190} C 300 ${120 + i * 190}, 520 ${330 + i * 190}, 900 ${210 + i * 190} S 1500 ${120 + i * 190}, 1960 ${260 + i * 190}`} />
      ))}
    </g>
    <rect width={1920} height={1080} filter="url(#grain)" opacity={0.5} />
    <rect width={1920} height={1080} fill="url(#vig)" />
  </svg>
);

/** Camara suave: zoom z0 -> z1 y desplazamiento (dx, dy) a lo largo de la escena. amt escala el efecto (paralaje: capas lejanas con amt menor). */
export const Cam: React.FC<{ dur: number; z0?: number; z1?: number; dx?: number; dy?: number; amt?: number; children: React.ReactNode }> = ({ dur, z0 = 1, z1 = 1.06, dx = 0, dy = 0, amt = 1, children }) => {
  const t = useT();
  const u = clamp(t / Math.max(dur, 0.1));
  const z = 1 + (z0 + (z1 - z0) * u - 1) * amt;
  const nx = noise2D("camx", t * 0.35, 0) * 5 * amt;
  const ny = noise2D("camy", t * 0.35, 3) * 4 * amt;
  return <g transform={`translate(960 540) scale(${z}) translate(-960 -540) translate(${dx * u * amt + nx} ${dy * u * amt + ny})`}>{children}</g>;
};

/** Trazo dibujado en vivo (pathLength + dashoffset). */
export const DrawOn: React.FC<{ d: string; t0: number; t1: number; w?: number; color?: string; o?: number; fill?: string; pen?: boolean }> = ({ d, t0, t1, w = 8, color = ink, o = 1, fill = "none", pen }) => {
  const t = useT();
  const u = ramp(t, t0, t1);
  if (u <= 0) return null;
  const tip = pen && u < 1 ? getPointAtLength(d, getLength(d) * u) : null;
  return (
    <>
      <path d={d} pathLength={1} fill={fill} stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - u} opacity={o} />
      {tip && <Pencil x={tip.x} y={tip.y} color={color} />}
    </>
  );
};

/** Lapiz que sigue el trazo (la punta en x, y). */
export const Pencil: React.FC<{ x: number; y: number; color?: string }> = ({ x, y, color = orange }) => (
  <g transform={`translate(${x} ${y}) rotate(40)`}>
    <path d="M0 0 L-9 -26 H9 Z" fill="#F1D5B0" stroke={ink} strokeWidth={4} strokeLinejoin="round" />
    <path d="M0 0 L-3.5 -10 H3.5 Z" fill={color} />
    <rect x={-9} y={-100} width={18} height={74} fill="#F2C94C" stroke={ink} strokeWidth={4} />
    <rect x={-9} y={-114} width={18} height={14} rx={4} fill={RED} stroke={ink} strokeWidth={4} />
  </g>
);

/** Contorno a mano (roughjs) de un rectangulo centrado en 0,0; semilla fija para que no tiemble solo. */
const roughRect = (w: number, h: number, seed: number) => {
  const g = rough.generator();
  return g.toPaths(g.rectangle(-w / 2, -h / 2, w, h, { seed, roughness: 1.1, bowing: 1, disableMultiStroke: false })).map((p) => p.d);
};

/** Aparicion con rebote de un grupo (escala desde su punto). */
export const Pop: React.FC<{ x: number; y: number; t0: number; s?: number; rot?: number; o?: number; children: React.ReactNode }> = ({ x, y, t0, s = 1, rot = 0, o = 1, children }) => {
  const t = useT();
  const p = pop(t, t0);
  return p > 0 ? (
    <G x={x} y={y} s={s * p} rot={rot} o={o * clamp(p * 2)}>
      {children}
    </G>
  ) : null;
};

/** Texto manuscrito. */
export const Scrawl: React.FC<{ x: number; y: number; size?: number; fill?: string; o?: number; rot?: number; anchor?: "start" | "middle" | "end"; t0?: number; children: React.ReactNode }> = ({ x, y, size = 46, fill = ink, o = 1, rot = 0, anchor = "middle", t0, children }) => {
  const t = useT();
  if (o <= 0) return null;
  const txt = typeof children === "string" ? children : null;
  // t0 definido: el texto se escribe letra a letra (~28 por segundo)
  const n = txt && t0 !== undefined ? Math.max(1, Math.floor((t - t0) * 28) + 1) : 1e9;
  return (
    <text x={x} y={y} textAnchor={anchor} fontFamily={HAND} fontSize={size} fontWeight={700} fill={fill} opacity={o} transform={`rotate(${rot} ${x} ${y})`}>
      {txt ? <>{txt.slice(0, n)}<tspan fillOpacity={0}>{txt.slice(n)}</tspan></> : children}
    </text>
  );
};

/** Tarjeta-objeto: papel con contorno grueso de tinta, sombra plana y pestana opcional. */
export const ObjectCard: React.FC<{ x: number; y: number; w: number; h: number; tab?: string; tabColor?: string; rot?: number; o?: number; t0?: number; children?: React.ReactNode }> = ({ x, y, w, h, tab, tabColor = orange, rot = 0, o = 1, t0, children }) => {
  const t = useT();
  const p = t0 === undefined ? 1 : pop(t, t0);
  if (p <= 0 || o <= 0) return null;
  return (
    <G x={x} y={y} s={p} rot={rot} o={o * clamp(p * 2)}>
      <rect x={-w / 2 + 12} y={-h / 2 + 14} width={w} height={h} rx={24} fill={ink} opacity={0.16} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={24} fill={CARD} stroke={ink} strokeWidth={7} />
      <g fill="none" stroke={ink} strokeWidth={3} opacity={0.55} strokeLinecap="round">
        {roughRect(w - 26, h - 26, Math.round(w + h)).map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      {tab && (
        <g>
          <rect x={-w / 2 + 28} y={-h / 2 - 26} width={tab.length * 20 + 44} height={52} rx={26} fill={tabColor} stroke={ink} strokeWidth={5} />
          <text x={-w / 2 + 28 + (tab.length * 20 + 44) / 2} y={-h / 2 + 2} textAnchor="middle" dominantBaseline="central" fontFamily={theme.font} fontWeight={800} fontSize={28} letterSpacing={2} fill="#fff">
            {tab}
          </text>
        </g>
      )}
      {children}
    </G>
  );
};

/** Cifra enorme con subrayado o tachon a mano (dibujado en vivo). Centrada en (x, y). */
export const BigNumber: React.FC<{ x: number; y: number; text: string; size?: number; fill?: string; t0: number; mark?: "under" | "strike" | "circle" | "none"; markColor?: string; sub?: string }> = ({ x, y, text, size = 150, fill = ink, t0, mark = "under", markColor = orange, sub }) => {
  const t = useT();
  const p = pop(t, t0, 0.5);
  if (p <= 0) return null;
  const w = text.length * size * 0.58;
  return (
    <G x={x} y={y} s={p} o={clamp(p * 2)}>
      <text textAnchor="middle" dominantBaseline="central" fontFamily={theme.font} fontWeight={900} fontSize={size} fill={fill} letterSpacing={-2}>
        {text}
      </text>
      {mark === "under" && <DrawOn d={`M${-w / 2} ${size * 0.62} C ${-w / 4} ${size * 0.5}, ${w / 4} ${size * 0.74}, ${w / 2} ${size * 0.58}`} t0={t0 + 0.4} t1={t0 + 0.9} w={size / 14} color={markColor} pen />}
      {mark === "strike" && <DrawOn d={`M${-w / 2 - 10} ${size * 0.25} L ${w / 2 + 10} ${-size * 0.28}`} t0={t0 + 0.4} t1={t0 + 0.8} w={size / 11} color={RED} pen />}
      {mark === "circle" && <DrawOn d={`M${w / 2} ${-size * 0.1} C ${w / 2} ${-size * 0.75}, ${-w / 2} ${-size * 0.75}, ${-w / 2 - 14} ${size * 0.05} C ${-w / 2} ${size * 0.8}, ${w / 2 + 20} ${size * 0.7}, ${w / 2 - 10} ${-size * 0.4}`} t0={t0 + 0.4} t1={t0 + 1.0} w={size / 14} color={markColor} />}
      {sub && (
        <text y={size * 0.95} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={Math.max(34, size / 3.4)} fill={teal}>
          {sub}
        </text>
      )}
    </G>
  );
};

export type Mood = "curious" | "surprised" | "thinking" | "happy";

/** Mascota "Pip": cabeza de papel con cara, bufanda teal y un rizo naranja en forma de interrogante. Pies en (x, y). */
export const Mascot: React.FC<{ x: number; y: number; s?: number; mood?: Mood; look?: [number, number]; arm?: "down" | "point" | "chin" | "ear"; flip?: boolean; o?: number; jump?: number }> = ({ x, y, s = 1.1, mood = "curious", look = [0, 0], arm = "down", flip = false, o = 1, jump = 0 }) => {
  const t = useT();
  const bob = Math.sin(t * 2.2) * 4;
  const blink = (t % 3.4) > 3.28 ? 0.1 : 1;
  const wide = mood === "surprised";
  const eyeRy = (wide ? 25 : 19) * blink;
  const [lx, ly] = mood === "thinking" ? [-6, -9] : look;
  const brow = {
    curious: ["M-46 -286 Q-30 -300 -12 -290", "M14 -300 Q32 -316 50 -302"],
    surprised: ["M-48 -308 Q-30 -322 -10 -310", "M12 -310 Q30 -322 48 -308"],
    thinking: ["M-46 -292 Q-28 -298 -12 -290", "M14 -296 Q32 -310 50 -298"],
    happy: ["M-46 -296 Q-30 -306 -12 -298", "M12 -298 Q30 -306 46 -296"],
  }[mood];
  const mouth = {
    curious: <ellipse cx={4} cy={-214} rx={9} ry={11} fill={ink} />,
    surprised: <ellipse cx={0} cy={-210} rx={17} ry={24} fill={ink} stroke={ink} strokeWidth={4} />,
    thinking: <path d="M-14 -210 Q2 -206 17 -217" fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" />,
    happy: <path d="M-24 -218 Q2 -190 28 -218 Z" fill="#fff" stroke={ink} strokeWidth={6} strokeLinejoin="round" />,
  }[mood];
  const armPath = { down: "M52 -150 Q80 -100 66 -60", point: "M52 -160 Q110 -190 170 -250", chin: "M46 -150 Q70 -190 20 -196", ear: "M52 -160 Q92 -230 66 -270" }[arm];
  return (
    <G x={x} y={y + bob - jump} s={s} o={o}>
      <g transform={flip ? "scale(-1 1)" : undefined}>
        <ellipse cx={0} cy={6 + jump * 0.3} rx={90 - jump * 0.1} ry={14} fill={ink} opacity={0.14} />
        {/* piernas y pies */}
        <path d="M-30 -60 V-8 M30 -60 V-8" stroke={ink} strokeWidth={14} strokeLinecap="round" />
        <path d="M-52 -4 H-16 M16 -4 H52" stroke={ink} strokeWidth={14} strokeLinecap="round" />
        {/* abrigo */}
        <path d="M-62 -66 Q-70 -170 -40 -192 H40 Q70 -170 62 -66 Z" fill={teal} stroke={ink} strokeWidth={7} strokeLinejoin="round" />
        <path d="M0 -190 V-70" stroke={ink} strokeWidth={5} opacity={0.5} />
        {/* brazos */}
        <path d={arm === "down" ? "M-52 -150 Q-80 -100 -66 -60" : "M-52 -150 Q-80 -100 -66 -60"} fill="none" stroke={ink} strokeWidth={12} strokeLinecap="round" />
        <path d={armPath} fill="none" stroke={ink} strokeWidth={12} strokeLinecap="round" />
        <circle cx={arm === "point" ? 172 : arm === "chin" ? 18 : arm === "ear" ? 66 : 66} cy={arm === "point" ? -252 : arm === "chin" ? -196 : arm === "ear" ? -272 : -58} r={14} fill="#F1D5B0" stroke={ink} strokeWidth={5} />
        {/* bufanda */}
        <path d="M-50 -192 Q0 -168 50 -192 L46 -170 Q0 -148 -46 -170 Z" fill={orange} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
        {/* cabeza */}
        <circle cx={0} cy={-250} r={76} fill="#FBEBD2" stroke={ink} strokeWidth={8} />
        <path d="M-6 -324 C -4 -352 30 -358 34 -336 C 36 -322 18 -318 14 -306" fill="none" stroke={orange} strokeWidth={9} strokeLinecap="round" />
        <circle cx={14} cy={-297} r={3} fill={orange} />
        {[-30, 30].map((ex, i) => (
          <g key={ex}>
            <ellipse cx={ex} cy={-254} rx={17} ry={eyeRy} fill="#fff" stroke={ink} strokeWidth={5} />
            <circle cx={ex + lx} cy={-254 + ly} r={9 * blink + 2} fill={ink} />
            <circle cx={ex + lx + 3} cy={-258 + ly} r={3} fill="#fff" />
            <path d={brow[i]} fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" />
          </g>
        ))}
        <circle cx={-52} cy={-226} r={9} fill={orange} opacity={0.3} />
        <circle cx={56} cy={-226} r={9} fill={orange} opacity={0.3} />
        {mouth}
        {mood === "thinking" &&
          [0, 1, 2].map((i) => <circle key={i} cx={96 + i * 24} cy={-330 - i * 26} r={6 + i * 4} fill="#fff" stroke={ink} strokeWidth={4} />)}
        {mood === "surprised" && ["M-96 -300 L-122 -318", "M-102 -262 L-132 -268", "M96 -300 L122 -318", "M102 -262 L132 -268"].map((d) => <path key={d} d={d} stroke={orange} strokeWidth={7} strokeLinecap="round" />)}
      </g>
    </G>
  );
};

/** Indicador de capitulos arriba a la derecha: los capitulos hechos con marca, el actual en naranja. active = -1 lo oculta. */
export const Tracker: React.FC<{ items: string[]; active: number; show: number }> = ({ items, active, show }) =>
  show <= 0 ? null : (
    <g opacity={show} transform={`translate(${1500 + (1 - show) * 40} 0)`}>
      <rect x={6} y={30} width={376} height={52 + items.length * 44} rx={18} fill={ink} opacity={0.14} />
      <rect x={0} y={24} width={376} height={52 + items.length * 44} rx={18} fill={CARD} stroke={ink} strokeWidth={5} />
      <text x={22} y={56} fontFamily={theme.font} fontWeight={800} fontSize={20} letterSpacing={3} fill={GREY}>
        IN THIS VIDEO
      </text>
      {items.map((it, i) => {
        const on = i === active;
        const done = i < active;
        return (
          <g key={it} transform={`translate(0 ${84 + i * 44})`}>
            <circle cx={36} cy={0} r={15} fill={on ? orange : done ? teal : "none"} stroke={on ? ink : done ? teal : GREY} strokeWidth={4} />
            <text x={36} y={1} textAnchor="middle" dominantBaseline="central" fontFamily={theme.font} fontWeight={800} fontSize={18} fill={on || done ? "#fff" : GREY}>
              {done ? "✓" : i + 1}
            </text>
            <text x={64} y={1} dominantBaseline="central" fontFamily={theme.font} fontWeight={on ? 800 : 600} fontSize={24} fill={on ? ink : GREY}>
              {it}
            </text>
          </g>
        );
      })}
    </g>
  );

/** Subtitulo pequeno (maximo 2 lineas, ~58 % del cuerpo anterior). Se monta dentro de un <Sequence> por frase. */
export const Subtitle: React.FC<{ text: string; durationInFrames: number; size?: number; fade?: number; bottom?: number }> = ({ text, durationInFrames, size = 30, fade = 6, bottom }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, fade, durationInFrames - fade, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const big = size > 30; // size > 30: subtitulo grande para movil (EM-025); por defecto no cambia nada
  return (
    <div
      style={{
        position: "absolute",
        left: size >= 56 ? 100 : big ? 130 : 210,
        right: size >= 56 ? 100 : big ? 130 : 210,
        bottom: bottom ?? (size >= 56 ? 34 : big ? 26 : 34),
        textAlign: "center",
        fontFamily: theme.font,
        fontWeight: 700,
        fontSize: size,
        textWrap: "balance",
        lineHeight: size >= 56 ? 1.1 : big ? 1.15 : 1.2,
        color: ink,
        WebkitTextStroke: `${Math.round(size * 0.27)}px ${bg}`,
        paintOrder: "stroke fill",
        opacity: o,
      }}
    >
      {text}
    </div>
  );
};

/** Pie de fuente (abajo-izquierda) y rotulo "Simplified illustration" (abajo-derecha), sobre la zona de subtitulos. */
export const Foot2: React.FC<{ text?: string; o: number }> = ({ text, o }) =>
  text && o > 0 ? (
    <g opacity={o}>
      <rect x={52} y={884} width={(text.length + 8) * 14 + 52} height={44} rx={22} fill={CARD} stroke={teal} strokeWidth={3} />
      <text x={76} y={907} dominantBaseline="central" fontFamily={theme.font} fontWeight={700} fontSize={24} fill={teal}>
        Source: {text}
      </text>
    </g>
  ) : null;

export const Simplified2: React.FC<{ o: number }> = ({ o }) =>
  o > 0 ? (
    <text x={1868} y={907} textAnchor="end" dominantBaseline="central" fontFamily={theme.font} fontWeight={600} fontSize={26} fill={ink} opacity={0.85 * o}>
      Simplified illustration, not a simulation
    </text>
  ) : null;

/** Filtro "hervor" de dibujo a mano: ligera deformacion que cambia cada 4 fotogramas. Se aplica con style={{ filter: "url(#boil)" }} a las escenas. */
export const BoilDefs: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg width={0} height={0} style={{ position: "absolute" }}>
      <filter id="boil" x="-2%" y="-2%" width="104%" height="104%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={2} seed={1 + (Math.floor(f / 4) % 4)} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={4} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
};

/** Ilustracion: si el id esta en AVAILABLE usa la foto public/illustrations/<id>.png (cuadrada, sin transparencia) como "foto pegada en el papel": marco blanco, sombra, esquinas redondeadas, ligera inclinacion (rot, grados) y Ken Burns lento (zoom de 1 a 1.07 durante `dur` segundos desde el inicio de la escena); si no, el dibujo vectorial de reserva (children). Centrada en (x, y), lado = size px. */
export const Illustration: React.FC<{ id: string; x: number; y: number; size?: number; o?: number; rot?: number; dur?: number; children: React.ReactNode }> = ({ id, x, y, size = 600, o = 1, rot = 0, dur = 12, children }) => {
  const f = useCurrentFrame();
  if (!AVAILABLE.includes(id)) return <G o={o}>{children}</G>;
  const k = 1 + 0.07 * clamp(f / (dur * 30));
  const border = 16;
  const s = size - border * 2;
  const clip = `ill-${id}`;
  return (
    <g opacity={o} transform={`rotate(${rot} ${x} ${y})`}>
      <rect x={x - size / 2 + 8} y={y - size / 2 + 12} width={size} height={size} rx={14} fill="#3A2A12" opacity={0.28} />
      <rect x={x - size / 2} y={y - size / 2} width={size} height={size} rx={14} fill="#FFFFFF" />
      <clipPath id={clip}>
        <rect x={x - s / 2} y={y - s / 2} width={s} height={s} rx={6} />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <image
          href={staticFile(`illustrations/${id}.png`)}
          x={x - (s * k) / 2}
          y={y - (s * k) / 2}
          width={s * k}
          height={s * k}
          preserveAspectRatio="xMidYMid slice"
        />
      </g>
    </g>
  );
};
