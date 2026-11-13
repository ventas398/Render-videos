// EM-052 medio "Pink Cells, Red Jerseys, Blue Plates". Reutiliza ColorPrototype (aprobado): flor v2-6, tarjetas nombre+HEX,
// acento entrando en movimiento, sellos. 70/30: fotos IA solo en 6 paletas, flor de cierre y rejilla final.
// v3 (Javier 09/11): intro con cuadros de dominio publico (Caillebotte retintado, Monet, van Gogh) = "el color cambia la escena";
// laminas sobre fondo oscuro con el tono de cada afirmacion (nada de papel crema); paleta 2 en rojo (antes naranja).
// Cifras: docs/EM-052-FACTS.md / guion. Graficos rotulados "Simplified illustration".
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { theme, VIDEO } from "../themes/brand";
import type { SceneProps } from "./scenes";

type Verdict = "DOCUMENTED" | "DISPUTED" | "MYTH";
type Swatch = [name: string, hex: string];
type Pal = { base: Swatch; light: Swatch; accent: Swatch; line1: string; adj2: string; claim: string; origin: [number, number] };

export const PALS: Pal[] = [
  { base: ["Midnight Black", "#030308"], light: ["Off-White", "#DECEC5"], accent: ["Crimson Red", "#C40D2E"], line1: "Black and off-white look calm.", adj2: "urgent", claim: "“Red wins fights.”", origin: [0, 72] },
  { base: ["Night Blue", "#071A4B"], light: ["Warm Cream", "#FCE4C9"], accent: ["Signal Red", "#E5161A"], line1: "Navy and cream look steady.", adj2: "alive", claim: "“Red focuses you, blue sparks ideas.”", origin: [0, 78] },
  { base: ["Forest Green", "#104331"], light: ["Ivory", "#F0E5D3"], accent: ["Acid Lime", "#D1F906"], line1: "Forest green and ivory look safe.", adj2: "electric", claim: "“Green relaxes you.”", origin: [0, 85] },
  { base: ["Terracotta", "#742F1A"], light: ["Sand", "#F6EBCE"], accent: ["Cobalt Blue", "#1F4FBF"], line1: "Terracotta and sand look warm.", adj2: "cool", claim: "“Blue plates make you eat less.”", origin: [0, 80] },
  { base: ["Graphite", "#262526"], light: ["Bone", "#F5DDC6"], accent: ["Amber", "#F79C03"], line1: "Graphite and bone look serious.", adj2: "loud", claim: "“Yellow makes you anxious.”", origin: [68, 55] },
  { base: ["Wine", "#3A0111"], light: ["Bone White", "#EFE5D7"], accent: ["Mint Green", "#31D489"], line1: "Wine and bone white look elegant.", adj2: "new", claim: "“Color lifts brand recognition 80%.”", origin: [0, 66] },
];

const { fps } = VIDEO;
const RED = "#C40D2E";
const PINK = "#FF91AF"; // Baker-Miller pink (Wikipedia)
const BLUE = "#1F4FBF";
export const STAMP: Record<Verdict, string> = { DOCUMENTED: theme.teal, DISPUTED: theme.orange, MYTH: RED };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fade = (t: number, a: number, d = 0.5) => interpolate(t, [a, a + d], [0, 1], clamp);
const shadow = "0 2px 18px rgba(0,0,0,0.75)";
// La 2 es la original con la cinta naranja virada a rojo (la voz habla de rojo y azul).
export const img = (i: number) => staticFile(`images/em052-v2-${i === 1 ? "2r" : i + 1}-h.png`);
const art = (n: string) => staticFile(`images/em052-art-${n}.jpg`);
const DARK = "#0B0B0F";
const ph = (i: number): [string, string] => [img(i), "Illustrative image"];
const TEAL_L = "#45D6CF";
const BLUE_L = "#8FB2FF";
const RED_L = "#FF6B7D";
const useSec = () => useCurrentFrame() / fps;

/** Tramo [a, b) en segundos de escena, con fundido de 0.4 s. */
const Seg: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => {
  const t = useSec();
  const o = interpolate(t, [a, a + 0.4, b - 0.4, b], [0, 1, 1, 0], clamp);
  return o > 0 ? <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill> : null;
};

const Pill: React.FC<{ text: string; dark?: boolean; right?: boolean; top?: boolean }> = ({ text, dark, right, top }) => (
  <div style={{ position: "absolute", [right ? "right" : "left"]: 28, [top ? "top" : "bottom"]: top ? 22 : 190, fontSize: 28, fontFamily: theme.font,
    color: dark ? "#fff" : theme.ink, textShadow: dark ? shadow : undefined, opacity: dark ? 1 : 0.75 }}>{text}</div>
);

export const Card: React.FC<{ s: Swatch; o: number; big?: boolean; light?: boolean }> = ({ s, o, big, light }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 20px", marginBottom: 10, borderRadius: 12,
    background: light ? theme.panel : "rgba(0,0,0,0.55)", border: light ? `2px solid ${theme.panelLine}` : undefined,
    opacity: o, transform: `translateX(${(1 - o) * 40}px)` }}>
    <div style={{ width: big ? 56 : 38, height: big ? 56 : 38, borderRadius: 8, background: s[1], border: "2px solid rgba(255,255,255,0.6)" }} />
    <div style={{ color: light ? theme.ink : "#fff", fontSize: big ? 34 : 28, fontWeight: big ? 700 : 500, minWidth: 230 }}>{s[0]}</div>
    <div style={{ color: light ? theme.ink : "#fff", fontSize: 40, fontFamily: "Consolas, monospace", fontWeight: 700 }}>{s[1]}</div>
  </div>
);

export const Stamp: React.FC<{ v: Verdict | string; at: number; color?: string; size?: number }> = ({ v, at, color, size = 52 }) => {
  const t = useSec();
  return (
    <div style={{ display: "inline-block", padding: "6px 26px", fontSize: size, fontWeight: 900, letterSpacing: 3, color: "#fff", fontFamily: theme.font,
      background: color ?? STAMP[v as Verdict], border: "4px solid #fff", borderRadius: 10, boxShadow: "0 4px 18px rgba(0,0,0,0.25)",
      opacity: fade(t, at, 0.2), transform: `rotate(-4deg) scale(${interpolate(t, [at, at + 0.27], [1.5, 1], clamp)})` }}>{v}</div>
  );
};

/** Foto IA fija con titulo (flor de apertura y cierre). */
const Still: React.FC<{ i: number; a: number; b: number; title: string; sub: string }> = ({ i, a, b, title, sub }) => {
  const t = useSec();
  return (
    <Seg a={a} b={b}>
      <AbsoluteFill style={{ background: "#000", fontFamily: theme.font }}>
        <Img src={img(i)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${interpolate(t, [a, b], [1, 1.07])})` }} />
        <div style={{ position: "absolute", left: 90, top: 280, color: "#fff", textShadow: shadow, opacity: fade(t, a + 0.3) }}>
          <div style={{ fontSize: 110, fontWeight: 800, lineHeight: 1.05 }}>{title}</div>
          <div style={{ fontSize: 48, marginTop: 18, opacity: 0.92 }}>{sub}</div>
        </div>
        <Pill text="Illustrative image" dark top />
      </AbsoluteFill>
    </Seg>
  );
};

/** Paleta del prototipo: la foto en el color base y el acento entrando como tinta desde `origin`. */
const Palette: React.FC<{ i: number; a: number; b: number }> = ({ i, a, b }) => {
  const p = PALS[i];
  const t = useSec() - a;
  const f = t * fps;
  const k = interpolate(f, [45, 125], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const r = k * 2600;
  const [ox, oy] = p.origin;
  const mask = `radial-gradient(circle at ${ox}% ${oy}%, #000 ${r - 500}px, transparent ${r}px)`;
  const mist = Math.sin(Math.PI * Math.min(k * 1.15, 1)) * 0.55 + (k > 0.9 ? 0.12 : 0);
  return (
    <Seg a={a} b={b}>
      <AbsoluteFill style={{ background: p.base[1], fontFamily: theme.font, overflow: "hidden" }}>
        <AbsoluteFill style={{ transform: `scale(${interpolate(t, [0, b - a], [1, 1.07])})` }}>
          <Img src={img(i)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) brightness(0.85)" }} />
          <AbsoluteFill style={{ background: p.base[1], mixBlendMode: "color" }} />
          <AbsoluteFill style={{ WebkitMaskImage: mask, maskImage: mask }}>
            <Img src={img(i)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
        </AbsoluteFill>
        <div style={{ position: "absolute", left: `${ox + (60 - ox) * k}%`, top: `${oy + (45 - oy) * k}%`, width: 1100, height: 700, marginLeft: -550, marginTop: -350,
          borderRadius: "50%", background: `radial-gradient(closest-side, ${p.accent[1]}, transparent)`, filter: "blur(60px)",
          mixBlendMode: "screen", opacity: mist, transform: `rotate(${f * 0.4}deg) scale(${1 + 0.15 * Math.sin(f / 14)}, 1)` }} />
        <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.55), rgba(0,0,0,0.25) 45%, transparent 60%)" }} />
        <div style={{ position: "absolute", right: 50, top: 50 }}>
          <Card s={p.base} o={fade(t, 0.25)} />
          <Card s={p.light} o={fade(t, 0.7)} />
          <Card s={p.accent} o={fade(t, 2.4)} big />
        </div>
        <div style={{ position: "absolute", left: 90, top: 300, width: 940, color: "#fff", textShadow: shadow }}>
          <div style={{ fontSize: 58, fontWeight: 700, color: "#FFD9A0", opacity: fade(t, 0.2) }}>{p.claim}</div>
          <div style={{ fontSize: 46, fontWeight: 600, marginTop: 36, opacity: fade(t, 0.8) }}>{p.line1}</div>
          <div style={{ fontSize: 46, fontWeight: 600, marginTop: 6, opacity: fade(t, 2.4) }}>
            Add <span style={{ color: p.accent[1], fontWeight: 800 }}>{p.accent[0].toLowerCase()}</span>, and they look {p.adj2}.
          </div>
        </div>
        {i === 3 && (
          // v4 (calidad 12:01): la voz dice "blue plates" -> plato azul visible (antes solo terracota + turquesa).
          <div style={{ position: "absolute", right: 140, bottom: 120, width: 380, height: 380, borderRadius: "50%", opacity: fade(t, 0.6),
            background: `radial-gradient(circle, ${BLUE} 0 55%, #163C94 56% 62%, ${BLUE} 63% 100%)`, boxShadow: "0 18px 50px rgba(0,0,0,0.6)",
            border: "6px solid #0F2E78", transform: `scale(${0.9 + 0.1 * fade(t, 0.6, 0.8)})` }} />
        )}
        <Pill text="Illustrative image" dark top />
      </AbsoluteFill>
    </Seg>
  );
};

/** Foto a sangre detras de una lamina (v4, calidad 12:01: 70/30). Velo solo a la izquierda, donde va el texto; la derecha queda limpia. */
const SheetPhoto: React.FC<{ a: number; b: number; src: string; note: string; hue?: string }> = ({ a, b, src, note, hue }) => {
  const t = useSec();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${interpolate(t, [a, b], [1.02, 1.09], clamp)})` }}>
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {hue && <div style={{ ...tint(hue), opacity: 0.75 }} />}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(8,8,12,0.86) 0%, rgba(8,8,12,0.74) 48%, rgba(8,8,12,0.2) 78%, rgba(8,8,12,0.05) 100%)" }} />
      <Pill text={note} dark top right />
    </AbsoluteFill>
  );
};

/** Lamina con el tono de la afirmacion (o sobre foto a sangre): titulo + contenido + fuente (abajo-izq) + "Simplified illustration" (abajo-dcha). */
const Sheet: React.FC<{ a: number; b: number; kicker?: string; title: string; src?: string; simp?: boolean; tone?: string; photo?: [src: string, note: string, hue?: string]; children: React.ReactNode }> = ({ a, b, kicker, title, src, simp, tone = "#1B2440", photo, children }) => (
  <Seg a={a} b={b}>
    {photo && <SheetPhoto a={a} b={b} src={photo[0]} note={photo[1]} hue={photo[2]} />}
    <AbsoluteFill style={{ background: photo ? undefined : `radial-gradient(circle at 85% 12%, ${tone} 0%, ${DARK} 78%)`, fontFamily: theme.font, color: "#fff", padding: "60px 100px", textShadow: photo ? shadow : undefined }}>
      {kicker && <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: 4, color: TEAL_L }}>{kicker}</div>}
      <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.08, marginTop: kicker ? 6 : 70 }}>{title}</div>
      <div style={{ marginTop: 34, position: "relative", flex: 1 }}>{children}</div>
      {src && <Pill text={`Source: ${src}`} dark />}
      {simp && <Pill text="Simplified illustration" right dark />}
    </AbsoluteFill>
  </Seg>
);

/** Fila de texto que aparece en `at`. */
const Line: React.FC<{ at: number; children: React.ReactNode; size?: number; color?: string; mt?: number }> = ({ at, children, size = 44, color, mt = 18 }) => {
  const t = useSec();
  const o = fade(t, at);
  return <div style={{ fontSize: size, fontWeight: 600, lineHeight: 1.22, marginTop: mt, color, opacity: o, transform: `translateY(${(1 - o) * 16}px)` }}>{children}</div>;
};

/** Barra horizontal animada; `v` en 0..1 del ancho. */
const Bar: React.FC<{ at: number; label: string; v: number; color: string; value?: string; w?: number }> = ({ at, label, v, color, value, w = 1000 }) => {
  const t = useSec();
  const g = interpolate(t, [at, at + 0.9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 22, opacity: fade(t, at, 0.3) }}>
      <div style={{ width: 360, fontSize: 38, fontWeight: 700, textAlign: "right" }}>{label}</div>
      <div style={{ width: w * v * g, height: 64, background: color, borderRadius: 8 }} />
      <div style={{ fontSize: 40, fontWeight: 800, opacity: g }}>{value}</div>
    </div>
  );
};

const Strike: React.FC<{ at: number; text: string; note: string }> = ({ at, text, note }) => {
  const t = useSec();
  return (
    <div style={{ marginTop: 26, opacity: fade(t, at) }}>
      <span style={{ position: "relative", fontSize: 50, fontWeight: 800, color: "#B5B5BD" }}>
        {text}
        <span style={{ position: "absolute", left: -6, right: -6, top: "52%", height: 7, background: RED, transformOrigin: "left", transform: `scaleX(${interpolate(t, [at + 0.4, at + 0.8], [0, 1], clamp)})` }} />
      </span>
      <div style={{ fontSize: 40, fontWeight: 600, marginTop: 10, opacity: fade(t, at + 0.8) }}>{note}</div>
    </div>
  );
};

const Swatch: React.FC<{ at: number; color: string; name: string; hex?: string }> = ({ at, color, name, hex }) => {
  const t = useSec();
  const o = fade(t, at);
  return (
    <div style={{ width: 540, borderRadius: 18, overflow: "hidden", color: theme.ink, background: theme.panel, border: `2px solid ${theme.panelLine}`, opacity: o, transform: `translateY(${(1 - o) * 30}px)` }}>
      <div style={{ height: 230, background: color }} />
      <div style={{ padding: "16px 24px", fontSize: 40, fontWeight: 700 }}>{name}</div>
      {hex && <div style={{ padding: "0 24px 18px", fontSize: 40, fontFamily: hex.startsWith("#") ? "Consolas, monospace" : undefined, fontWeight: 700 }}>{hex}</div>}
    </div>
  );
};

const Row: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 50 }) => <div style={{ display: "flex", gap, alignItems: "flex-start" }}>{children}</div>;

// ---- Intro v3: cuadros de dominio publico. El espectador VE el cambio antes de oir ningun estudio. ----
const GRADES: [string, string][] = [["Red", "#D4121F"], ["Green", "#1F9A4B"], ["Yellow", "#F0BE00"]];
const tint = (color: string): React.CSSProperties => ({ position: "absolute", inset: 0, background: color, mixBlendMode: "color" });
const RAIN = "Gustave Caillebotte, Paris Street; Rainy Day (1877) · public domain";
const rainStyle: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 45%" };

/** El mismo cuadro en original + rojo + verde + amarillo, a la vez. */
const Grid4: React.FC = () => (
  <AbsoluteFill style={{ background: "#000", fontFamily: theme.font, flexDirection: "row", flexWrap: "wrap" }}>
    {([["Original", null], ...GRADES] as [string, string | null][]).map(([name, col]) => (
      <div key={name} style={{ position: "relative", width: "50%", height: "50%", overflow: "hidden", boxSizing: "border-box", border: "3px solid #000" }}>
        <Img src={art("rain")} style={rainStyle} />
        {col && <div style={tint(col)} />}
        <div style={{ position: "absolute", left: 24, top: 16, fontSize: 40, fontWeight: 800, color: "#fff", textShadow: shadow }}>{name}</div>
      </div>
    ))}
    <Pill text={`${RAIN} · color digitally altered`} dark />
  </AbsoluteFill>
);

/** Cuadro a pantalla completa; en cada `cuts[k]` entra un tinte barriendo de izquierda a derecha; en `grid`, las cuatro versiones. */
const Graded: React.FC<{ a: number; cuts: number[]; grid: number; b: number }> = ({ a, cuts, grid, b }) => {
  const t = useSec();
  const cur = cuts.filter((x) => t >= x).length;
  return (
    <>
      <Seg a={a} b={grid + 0.8}>
        <AbsoluteFill style={{ background: "#000", fontFamily: theme.font, overflow: "hidden" }}>
          <AbsoluteFill style={{ transform: `scale(${interpolate(t, [a, grid], [1.02, 1.1], clamp)})` }}>
            <Img src={art("rain")} style={rainStyle} />
            {GRADES.map(([, col], k) => {
              const w = interpolate(t, [cuts[k], cuts[k] + 0.35], [100, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
              return w < 100 ? <div key={col} style={{ ...tint(col), clipPath: `inset(0 ${w}% 0 0)` }} /> : null;
            })}
          </AbsoluteFill>
          <div style={{ position: "absolute", left: 80, bottom: 215, color: "#fff", textShadow: shadow, fontWeight: 900 }}>
            {cur === 0
              ? <div style={{ fontSize: 64, opacity: fade(t, a + 0.6) }}>Paris, 1877</div>
              : <div style={{ fontSize: 130, letterSpacing: 6, opacity: fade(t, cuts[cur - 1], 0.3) }}>{GRADES[cur - 1][0].toUpperCase()}</div>}
          </div>
          <Pill text={RAIN} dark top />
          {cur > 0 && <Pill text="Color digitally altered" dark top right />}
        </AbsoluteFill>
      </Seg>
      <Seg a={grid} b={b}><Grid4 /></Seg>
    </>
  );
};

const MONET: [string, string][] = [["rouen-blue", "Morning sun"], ["rouen-sun", "Sunlight"], ["rouen-sunset", "Sunset"], ["rouen-grey", "Grey weather"]];
const Cathedrals: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const t = useSec();
  return (
    <Seg a={a} b={b}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 30%, #23283C 0%, ${DARK} 80%)`, fontFamily: theme.font, color: "#fff", alignItems: "center" }}>
        <div style={{ fontSize: 60, fontWeight: 800, marginTop: 40, opacity: fade(t, a + 0.2) }}>Same cathedral. About 30 paintings.</div>
        <div style={{ display: "flex", gap: 36, marginTop: 28 }}>
          {MONET.map(([n, label], k) => {
            const o = fade(t, a + 0.5 + k * 0.9);
            return (
              <div key={n} style={{ opacity: o, transform: `translateY(${(1 - o) * 30}px)`, textAlign: "center" }}>
                <Img src={art(n)} style={{ width: 380, height: 570, objectFit: "cover", borderRadius: 6, boxShadow: "0 10px 40px rgba(0,0,0,0.6)" }} />
                <div style={{ fontSize: 34, fontWeight: 700, marginTop: 10 }}>{label}</div>
              </div>
            );
          })}
        </div>
        <Pill text="Claude Monet, Rouen Cathedral series (1892–1894) · public domain" dark />
      </AbsoluteFill>
    </Seg>
  );
};

const NightCafe: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const t = useSec();
  const q = fade(t, a + 1.4, 0.6);
  return (
    <Seg a={a} b={b}>
      <AbsoluteFill style={{ background: "#000", fontFamily: theme.font, overflow: "hidden" }}>
        <Img src={art("nightcafe")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${interpolate(t, [a, b], [1, 1.08], clamp)})` }} />
        <AbsoluteFill style={{ opacity: q, background: "linear-gradient(90deg, rgba(0,0,0,0.8), rgba(0,0,0,0.5) 50%, transparent 78%)" }} />
        <div style={{ position: "absolute", left: 90, top: 230, width: 1000, color: "#fff", textShadow: shadow, opacity: q }}>
          <div style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.18 }}>
            “I have tried to express the terrible passions of humanity by means of <span style={{ color: RED_L }}>red</span> and <span style={{ color: "#7BE08A" }}>green</span>.”
          </div>
          <div style={{ fontSize: 38, marginTop: 24, opacity: 0.92 }}>Vincent van Gogh, letter to his brother Theo, 1888</div>
        </div>
        <Pill text="Vincent van Gogh, The Night Café (1888) · public domain" dark top />
      </AbsoluteFill>
    </Seg>
  );
};

/** Las tres promesas como franjas de color a toda pantalla, cayendo sobre las cuatro versiones del cuadro. */
const CLAIMS3: [string, string, string][] = [[RED, "“Red makes you win.”", "#fff"], [PINK, "“Pink calms prisoners.”", theme.ink], [BLUE, "“Blue kills your appetite.”", "#fff"]];
const Bands: React.FC<{ a: number; b: number; at: number[] }> = ({ a, b, at }) => {
  const t = useSec();
  return (
    <Seg a={a} b={b}>
      <Grid4 />
      <AbsoluteFill style={{ fontFamily: theme.font, flexDirection: "row" }}>
        {CLAIMS3.map(([bg, txt, fg], k) => {
          const g = interpolate(t, [at[k], at[k] + 0.5], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          return (
            <div key={txt} style={{ flex: 1, height: "100%", background: bg, transform: `translateY(${(g - 1) * 100}%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 50px 160px", boxSizing: "border-box" }}>
              <div style={{ fontSize: 70, fontWeight: 800, lineHeight: 1.12, textAlign: "center", color: fg }}>{txt}</div>
            </div>
          );
        })}
      </AbsoluteFill>
    </Seg>
  );
};

// Fracciones dentro de la locucion (medidas sobre el WAV de Kokoro): "Yellow", rejilla, las tres promesas, el giro.
const F_YELLOW = 0.22;
const F_GRID = 0.36;
const F_BANDS = [0.49, 0.65, 0.81];
const F_TWIST = 0.39;

type Mk = (c: (p: number) => number, dur: number, t: number) => React.ReactNode;
const sc = (from: number, mk: Mk): React.FC<SceneProps> => ({ cues, dur }) => {
  const t = useSec();
  return <AbsoluteFill>{mk((p) => cues[p - from] ?? dur, dur, t)}</AbsoluteFill>;
};

export const SCENES052: Record<string, React.FC<SceneProps>> = {
  ch01: sc(0, (c, d) => {
    const p2 = c(3) - c(2);
    return (
      <>
        <Graded a={0} cuts={[c(1), c(2), c(2) + p2 * F_YELLOW]} grid={c(2) + p2 * F_GRID} b={c(3) + 0.8} />
        <Cathedrals a={c(3)} b={c(4) + 0.8} />
        <NightCafe a={c(4)} b={d + 1} />
      </>
    );
  }),
  ch02: sc(5, (c, d) => {
    const p5 = c(6);
    const p6 = c(7) - c(6);
    return (
      <>
        <Bands a={0} b={c(6) + 0.8} at={F_BANDS.map((f) => p5 * f)} />
        <Sheet a={c(6)} b={d + 1} title="Real data, or does it just sound true?" photo={[art("rain"), "Gustave Caillebotte, Paris Street; Rainy Day (1877) · public domain"]}>
          {([["DOCUMENTED", "The study says so, within its limits."], ["DISPUTED", "Mixed, narrow or contradictory evidence."], ["MYTH", "No real study behind it."]] as const).map(([v, txt], k) => (
            <div key={v} style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 30 }}>
              <div style={{ width: 400 }}><Stamp v={v} at={c(6) + 0.5 + k * 0.9} size={46} /></div>
              <Line at={c(6) + 0.7 + k * 0.9} mt={0}>{txt}</Line>
            </div>
          ))}
          <Line at={c(6) + p6 * F_TWIST} size={46} color={TEAL_L} mt={44}>Color does something. Rarely what the ads say.</Line>
        </Sheet>
      </>
    );
  }),
  ch03: sc(8, (c, d) => (
    <>
      <Palette i={0} a={0} b={c(10)} />
      <Sheet a={c(10)} b={d + 1} tone="#6A0A1E" kicker="CLAIM 1 · RED WINS FIGHTS" title="Close matches only, then it fades" photo={ph(0)} src="Hill & Barton, Nature 2005 · Apollaro et al., Sci. Rep. 2023 · Peperkoorn et al." simp>
        <Line at={c(10)} mt={0}>Athens 2004: red ahead, <b>only in close matches</b>.</Line>
        <Line at={c(10) + 2.5}>878 Olympic taekwondo bouts, manual scoring: red helped men, <span style={{ color: BLUE_L }}>blue helped women</span> in several brackets.</Line>
        <Line at={c(11)} color={TEAL_L}>Electronic scoring: the effect disappeared.</Line>
        <Bar at={c(12)} label="Red wins" v={0.505} color={RED} value="50.5%" />
        <Bar at={c(12) + 0.4} label="Coin flip" v={0.5} color="#9AA0AA" value="50%" />
        <div style={{ position: "absolute", right: 0, top: 380 }}><Stamp v="DISPUTED" at={c(13)} /></div>
      </Sheet>
    </>
  )),
  ch04: sc(14, (c, d) => (
    <>
      <Palette i={1} a={0} b={c(16)} />
      <Sheet a={c(16)} b={d + 1} tone="#1A2F7A" kicker="CLAIM 2 · SCIENCE, 2009 · 600+ PEOPLE" title="Red for detail, blue for ideas" photo={ph(1)} src="Mehta & Zhu, Science 2009">
        <Row>
          <Swatch at={c(16)} color={RED} name="Red background" hex="→ detail work" />
          <Swatch at={c(16) + 3.5} color={BLUE} name="Blue background" hex="→ new ideas" />
          <div style={{ paddingTop: 90 }}><Stamp v="DOCUMENTED" at={c(17)} /></div>
        </Row>
        <Strike at={c(18)} text="“Blue makes you X% more creative”" note="That number traces back to a blog post, not the paper." />
      </Sheet>
    </>
  )),
  ch05: sc(19, (c, d) => (
    <Sheet a={0} b={d + 1} tone="#6A2A48" kicker="CLAIM 3 · THE PINK CELL" title="A shade of pink to calm aggression?" photo={[staticFile("images/em052-color-6-h.png"), "Illustrative image · color digitally altered", PINK]} src="Schauss 1979 · Genschow et al. 2015 (Swiss prison study)" simp>
      <Row>
        <Swatch at={0.3} color={PINK} name="Baker-Miller pink" hex={PINK} />
        <div style={{ flex: 1 }}>
          <Line at={c(20)} mt={0}>1979 report: “it calms aggression.”</Line>
          <Line at={c(21)} color={TEAL_L}>Controlled study, 59 prisoners:</Line>
          <div style={{ marginLeft: -200 }}>
            <Bar at={c(21) + 1.2} label="Pink cell" v={0.5} color={PINK} w={760} />
            <Bar at={c(21) + 1.6} label="White cell" v={0.5} color="#D9D4CA" w={760} value="no difference" />
          </div>
        </div>
      </Row>
      <div style={{ display: "flex", alignItems: "center", gap: 50 }}>
        <Strike at={c(22)} text="“Big percentage drop”" note="No real study behind it." />
        <Stamp v="MYTH" at={c(22) + 3.2} />
      </div>
    </Sheet>
  )),
  ch06: sc(23, (c, d) => (
    <>
      <Palette i={3} a={0} b={c(25)} />
      <Sheet a={c(25)} b={d + 1} tone="#0E4A5C" kicker="CLAIM 4 · BLUE PLATES" title="Color cues vs. desire to eat" photo={ph(3)} src="Frontiers in Psychology 2020 (448 people)" simp>
        <Bar at={c(25) - 0.2} label="Red cue" v={0.55} color={RED} w={900} />
        <Bar at={c(25)} label="Blue cue" v={0.55} color={BLUE} w={900} value="no effect" />
        <Line at={c(25) + 3} mt={34}>What may matter: <b>contrast</b> between food and plate. Even there, two studies disagree.</Line>
        <div style={{ display: "flex", gap: 60, marginTop: 34, alignItems: "center" }}>
          <Stamp v="MYTH" at={c(26)} size={44} /><span style={{ fontSize: 38, fontWeight: 600 }}>“blue kills appetite”</span>
          <Stamp v="DISPUTED" at={c(26) + 1.8} size={44} /><span style={{ fontSize: 38, fontWeight: 600 }}>plate contrast</span>
        </div>
      </Sheet>
    </>
  )),
  ch07: sc(27, (c, d, t) => (
    <>
      <Palette i={2} a={0} b={c(29)} />
      <Sheet a={c(29)} b={d + 1} tone="#145A3C" kicker="CLAIM 5 · GREEN RELAXES YOU" title="The color, or the scene?" photo={[staticFile("images/em052-color-3-h.png"), "Illustrative image"]} src="Lee et al., J. Environ. Psychol. 2015 (40-second green roof views)" simp>
        <Row gap={40}>
          <Swatch at={c(29)} color="#2E8B57" name="Green, the color" />
          <div style={{ fontSize: 120, fontWeight: 900, color: theme.orange, paddingTop: 90, opacity: fade(t, c(29) + 1) }}>≠ ?</div>
          <Swatch at={c(29) + 1} color="linear-gradient(#9CC9E8 0 40%, #4E8C3A 40% 100%)" name="Looking at nature" />
        </Row>
        <div style={{ marginTop: 30 }}><Stamp v="DISPUTED" at={c(30) + 0.6} /></div>
      </Sheet>
    </>
  )),
  ch08: sc(31, (c, d) => (
    <>
      <Palette i={4} a={0} b={c(33)} />
      <Sheet a={c(33)} b={d + 1} tone="#6A5208" kicker="CLAIM 6 · YELLOW" title="Two claims, two levels of evidence" photo={ph(4)} src="Ho et al., PNAS 2017 (Singapore taxis)" simp>
        <Line at={c(33)} mt={0}>Anxiety: small, old, inconsistent studies.</Line>
        <Line at={c(33) + 1.5} color={TEAL_L}>Visibility: Singapore taxi fleet, accidents (blue = 100):</Line>
        <Bar at={c(33) + 3} label="Blue taxis" v={0.8} color={BLUE} w={900} value="100" />
        <Bar at={c(33) + 3.4} label="Yellow taxis" v={0.8 * 0.91} color="#F2B705" w={900} value="≈ 91" />
        <div style={{ display: "flex", gap: 50, marginTop: 30, alignItems: "center" }}>
          <Stamp v="DISPUTED" at={c(35)} size={44} /><span style={{ fontSize: 38, fontWeight: 600 }}>anxiety</span>
          <Stamp v="DOCUMENTED" at={c(35) + 1.4} size={44} /><span style={{ fontSize: 38, fontWeight: 600 }}>visibility</span>
        </div>
      </Sheet>
    </>
  )),
  ch09: sc(36, (c, d) => (
    <>
      <Palette i={5} a={0} b={c(38)} />
      <Sheet a={c(38)} b={d + 1} tone="#5A0A2A" kicker="CLAIM 7 · THE MARKETERS' FAVORITE" title="“Color lifts brand recognition 80%”" photo={ph(5)}>
        <Row gap={80}>
          <div style={{ fontSize: 260, fontWeight: 900, color: theme.orange, lineHeight: 1 }}>80%</div>
          <div>
            {["Methodology", "Year", "Named researchers"].map((x, k) => (
              <Line key={x} at={c(38) + 2.5 + k * 0.6} mt={k ? 14 : 20}><span style={{ color: RED_L, fontWeight: 900 }}>✕</span> {x}</Line>
            ))}
            <Line at={c(38) + 5}>Copied page to page, even into patents.</Line>
          </div>
        </Row>
        <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 30 }}>
          <Stamp v="MYTH" at={c(39)} />
          <Line at={c(39) + 0.8} mt={0} size={46}>Not disproven. Just never proven.</Line>
        </div>
      </Sheet>
    </>
  )),
  ch10: sc(40, (c, d, t) => {
    const steps: [string, string][] = [["Study", "narrow sample, careful limits"], ["Article", "limits shortened"], ["Blog", "sample size gone"], ["Caption / slide", "round number, no source"]];
    return (
      <Sheet a={0} b={d + 1} tone="#2A2A3E" kicker="NOTICE THE PATTERN" title="How a narrow study becomes a viral “fact”" simp photo={[art("nightcafe"), "Vincent van Gogh, The Night Café (1888) · public domain"]}>
        <div style={{ display: "flex", gap: 24, marginTop: 30 }}>
          {steps.map(([h, s], k) => (
            <div key={h} style={{ flex: 1, opacity: fade(t, c(41) - 1 + k * 1.3), color: theme.ink, background: theme.panel, border: `3px solid ${k === 3 ? theme.orange : theme.teal}`, borderRadius: 16, padding: "28px 26px" }}>
              <div style={{ fontSize: 44, fontWeight: 800, color: k === 3 ? theme.orange : theme.teal }}>{k + 1}. {h}</div>
              <div style={{ fontSize: 36, marginTop: 14, lineHeight: 1.2, opacity: 1 - k * 0.12 }}>{s}</div>
            </div>
          ))}
        </div>
        <Line at={c(42)} size={50} mt={50}>One retelling at a time, the nuance falls off.</Line>
      </Sheet>
    );
  }),
  ch11: sc(43, (c, d) => (
    <Sheet a={0} b={d + 1} tone="#103B46" kicker="WHAT SURVIVES THE CHECKING" title="What color really does" photo={[art("rouen-sun"), "Claude Monet, Rouen Cathedral (1892–1894) · public domain"]}>
      <Line at={0.4} size={56} color={TEAL_L}>✓ Changes what you notice.</Line>
      <Line at={2.2} size={56} color={TEAL_L}>✓ Sometimes, what you choose to look at.</Line>
      <Line at={c(44)} size={56} color={RED_L} mt={50}>✕ Flip a switch in how you feel.</Line>
    </Sheet>
  )),
  ch12: sc(45, (c, d) => (
    <>
      <Still i={5} a={0} b={c(46)} title="Ask which study." sub="Look again at what you stopped seeing." />
      <Seg a={c(46)} b={d + 1}>
        <AbsoluteFill style={{ background: "#0B0B0F", fontFamily: theme.font, padding: "70px 80px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "36px 40px", alignContent: "center" }}>
          {PALS.map((p, i) => (
            <div key={p.accent[1]} style={{ opacity: 0.85 }}>
              <Img src={img(i)} style={{ width: "100%", height: 250, objectFit: "cover", borderRadius: 12, display: "block" }} />
              <div style={{ color: p.accent[1], fontSize: 28, fontWeight: 700, marginTop: 10 }}>{p.base[0]} · {p.light[0]} · {p.accent[0]}</div>
            </div>
          ))}
          <Pill text="Illustrative images" dark top />
        </AbsoluteFill>
      </Seg>
    </>
  )),
};

/** Portada sin IA (EMBUDO 2.2): 3 tarjetas de color con HEX y sellos DISPUTED / MYTH / MYTH. 1280x720. */
export const ThumbEM052: React.FC = () => (
  <AbsoluteFill style={{ background: "#0B0B0F", fontFamily: theme.font, alignItems: "center", justifyContent: "center" }}>
    <div style={{ color: "#fff", fontSize: 76, fontWeight: 900, letterSpacing: 1, marginBottom: 34 }}>
      COLOR “FACTS”? <span style={{ color: "#FFB000" }}>CHECKED.</span>
    </div>
    <div style={{ display: "flex", gap: 34 }}>
      {([[RED, "Red", "DISPUTED"], [PINK, "Pink", "MYTH"], [BLUE, "Blue", "MYTH"]] as const).map(([c, n, v]) => (
        <div key={n} style={{ width: 340, background: "#fff", borderRadius: 18, overflow: "hidden", position: "relative" }}>
          <div style={{ height: 300, background: c }} />
          <div style={{ padding: "12px 20px", fontSize: 38, fontWeight: 800, color: theme.ink }}>{n} <span style={{ fontFamily: "Consolas, monospace", fontSize: 34 }}>{c}</span></div>
          <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center" }}>
            <span style={{ display: "inline-block", padding: "6px 22px", fontSize: v === "MYTH" ? 64 : 52, fontWeight: 900, letterSpacing: 3, color: "#fff",
              background: STAMP[v], border: "5px solid #fff", borderRadius: 10, transform: "rotate(-6deg)", boxShadow: "0 6px 20px rgba(0,0,0,0.45)" }}>{v}</span>
          </div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
