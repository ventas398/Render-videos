// EM-052 LARGO "The Power of Color" (7:54). Tabla de planos: cada plano empieza en una parte de la voz y dura hasta el siguiente.
// 70/30: casi todo es cuadro de dominio publico a sangre; diagramas solo en Chevreul (gris sobre rojo/verde) y en la lista de pruebas.
// Retintados en CSS (mixBlendMode color) siempre con 'Color digitally altered'. Creditos: docs/EM-052-LARGO-OBRAS-DP.md.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { theme, VIDEO } from "../themes/brand";
import type { SceneProps } from "./scenes";
import ep from "../episodes/EM-052-LARGO.json";
import { STAMP } from "./scenes052";

const { fps } = VIDEO;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fade = (t: number, a: number, d = 0.5) => interpolate(t, [a, a + d], [0, 1], clamp);
const shadow = "0 2px 18px rgba(0,0,0,0.8)";
const art = (n: string) => staticFile(`images/em052-art-${n}.jpg`);
const ai = (i: number) => staticFile(`images/em052-v2-${i === 1 ? "2r" : i + 1}-h.png`);
const col = (i: number) => staticFile(`images/em052-color-${i}-h.png`); // "c:<n>" = foto IA de color dominante

const CREDIT: Record<string, string> = {
  rain: "Gustave Caillebotte, Paris Street; Rainy Day (1877) · Art Institute of Chicago · public domain",
  "rouen-blue": "Claude Monet, Rouen Cathedral, the Portal, Morning Sun (Blue Harmony) (1892–93) · Musée d'Orsay · public domain",
  "rouen-sun": "Claude Monet, Rouen Cathedral, West Facade, Sunlight (1894) · National Gallery of Art · public domain",
  "rouen-sunset": "Claude Monet, Rouen Cathedral series (1892–1894) · public domain",
  "rouen-grey": "Claude Monet, Rouen Cathedral, the Portal, Grey Weather (1892–94) · Musée d'Orsay · public domain",
  nightcafe: "Vincent van Gogh, The Night Café (1888) · public domain",
  wave: "Katsushika Hokusai, Under the Wave off Kanagawa (c. 1830–32) · The Met · public domain",
  bedroom: "Vincent van Gogh, The Bedroom (1888) · Van Gogh Museum · public domain",
  pearl: "Johannes Vermeer, Girl with a Pearl Earring (c. 1665) · Mauritshuis · public domain",
  battersea: "J. M. Whistler, Nocturne: Blue and Gold – Old Battersea Bridge (c. 1872–75) · Tate · public domain",
  rocket: "J. M. Whistler, Nocturne in Black and Gold: The Falling Rocket (1875) · DIA · public domain",
};

const RED = "#D4121F";
const GREEN = "#1F9A4B";
const YELLOW = "#F0BE00";
const COLD = "#2F5FA8";
const DAY = "#E9D48A";
const PINK = "#F08CB4";
// Paredes del dormitorio (sin cama, suelo ni silla): poligono en % del cuadro 1920x1080.
const WALLS = "polygon(0% 0%, 100% 0%, 100% 82.5%, 90.9% 82.5%, 90.9% 13.5%, 46.4% 13.5%, 46.4% 50.4%, 15.8% 50.4%, 13.9% 53.7%, 0% 53.7%)";

type Shot = {
  p: number; // parte (indice absoluto) en la que entra
  img: string; // nombre de art() o "ai:<n>"
  tint?: string; // retintado (mixBlendMode color)
  stampOk?: boolean; // sello visible aunque haya retinte (solo DISPUTED/MYTH, LOTE-EY 1)
  mask?: [number, number, number]; // tinte solo en un circulo (x %, y %, radio px)
  walls?: boolean; // tinte solo en las paredes (Bedroom, imagen a 1920x1080 con cover centrado)
  title?: string; // rotulo grande abajo-izquierda
  label?: string; // rotulo pequeno (fecha, carta, fuente)
  pos?: string; // objectPosition
  zoom?: [number, number];
  f?: number; // entra a esta fraccion de la parte (0-1): varios cortes dentro de una frase
  late?: number; // segundos de retraso del credito (no pisar la marca al inicio)
};

// Placa oscura: el credito y el aviso se leen sobre fondos claros (QA v1, punto 11).
const Pill: React.FC<{ text: string; right?: boolean; bottom?: boolean; o?: number }> = ({ text, right, bottom, o = 1 }) => (
  <div style={{ position: "absolute", [right ? "right" : "left"]: 28, [bottom ? "bottom" : "top"]: bottom ? 190 : 22, maxWidth: right ? 700 : 1150,
    padding: "4px 14px", background: "rgba(0,0,0,0.62)", borderRadius: 6, opacity: o,
    fontSize: 28, fontFamily: theme.font, color: "#fff", textShadow: shadow }}>{text}</div>
);

const StampAt: React.FC<{ v: string; at: number }> = ({ v, at }) => {
  const t = useCurrentFrame() / fps;
  const o = fade(t, at, 0.2);
  return o > 0 ? (
    <div style={{ position: "absolute", right: 40, top: 80, padding: "6px 24px", fontSize: 44, fontWeight: 900, letterSpacing: 3, color: "#fff", fontFamily: theme.font,
      background: STAMP[v as keyof typeof STAMP] ?? "#5B4E9A", border: "4px solid #fff", borderRadius: 10, opacity: o,
      transform: `rotate(-4deg) scale(${interpolate(t, [at, at + 0.27], [1.5, 1], clamp)})` }}>{v}</div>
  ) : null;
};

const ShotView: React.FC<{ s: Shot; a: number; b: number }> = ({ s, a, b }) => {
  const t = useCurrentFrame() / fps;
  const o = interpolate(t, [a - 0.2, a + 0.3, b - 0.1, b + 0.3], [0, 1, 1, 0], clamp);
  if (o <= 0) return null;
  const isAi = s.img.startsWith("ai:") || s.img.startsWith("c:");
  const src = s.img.startsWith("c:") ? col(Number(s.img.slice(2))) : isAi ? ai(Number(s.img.slice(3))) : art(s.img);
  const [z0, z1] = s.zoom ?? [1.02, 1.09];
  const maskCss = s.mask ? `radial-gradient(circle at ${s.mask[0]}% ${s.mask[1]}%, #000 ${s.mask[2] * 0.7}px, transparent ${s.mask[2]}px)` : undefined;
  return (
    <AbsoluteFill style={{ opacity: o, background: "#000", fontFamily: theme.font, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${interpolate(t, [a, b], [z0, z1], clamp)})` }}>
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: s.pos ?? "50% 50%" }} />
        {s.tint && <div style={{ position: "absolute", inset: 0, background: s.tint, mixBlendMode: "color", WebkitMaskImage: maskCss, maskImage: maskCss, clipPath: s.walls ? WALLS : undefined }} />}
      </AbsoluteFill>
      {s.title && (
        <>
          <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 40%, transparent 60%)" }} />
          <div style={{ position: "absolute", left: 80, right: 80, bottom: 240, color: "#fff", textShadow: shadow, fontSize: 92, fontWeight: 900, lineHeight: 1.05, opacity: fade(t, a + 0.3) }}>{s.title}</div>
        </>
      )}
      {s.label && <div style={{ position: "absolute", left: 80, bottom: s.title && s.title.length > 30 ? 480 : 380, padding: "8px 20px", background: "rgba(0,0,0,0.6)", borderRadius: 8, color: "#FFD9A0", fontSize: 38, fontWeight: 700, opacity: fade(t, a + 0.4) }}>{s.label}</div>}
      <Pill text={isAi ? "Illustrative image" : CREDIT[s.img]} o={s.late ? fade(t, s.late) : 1} />
      {s.tint && <Pill text="Color digitally altered" right bottom />}
    </AbsoluteFill>
  );
};

const STAMPS = ep.stamps as { part: number; stamp: string }[];

/** Escena = lista de planos + sellos de sus partes. `extra` dibuja diagramas encima. */
const scene = (from: number, to: number, shots: Shot[], extra?: (c: (p: number) => number, t: number, dur: number) => React.ReactNode): React.FC<SceneProps> => ({ cues, dur }) => {
  const t = useCurrentFrame() / fps;
  const c = (p: number) => cues[p - from] ?? dur;
  const start = (k: number) => (k === 0 ? 0 : c(shots[k].p) + (shots[k].f ?? 0) * (c(shots[k].p + 1) - c(shots[k].p)));
  // Sin sello encima de un cuadro retintado (QA v1, punto 5): el sello se corta al entrar el retinte.
  let cur = 0;
  shots.forEach((_, k) => { if (start(k) <= t) cur = k; });
  const tinted = !!shots[cur]?.tint && !shots[cur]?.stampOk;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {shots.map((s, k) => <ShotView key={k} s={s} a={start(k)} b={k + 1 < shots.length ? start(k + 1) : dur + 1} />)}
      {extra?.(c, t, dur)}
      {!tinted && STAMPS.filter((x) => x.part >= from && x.part <= to).map((x) => {
        const nxt = STAMPS.find((y) => y.part > x.part && y.part <= to);
        const end = nxt ? c(nxt.part) : c(Math.min(x.part + 2, to + 1));
        return t < end ? <StampAt key={x.part} v={x.stamp} at={c(x.part) + 0.3} /> : null;
      })}
    </AbsoluteFill>
  );
};

/** Chevreul: el mismo gris sobre rojo y sobre verde (diagrama, cuenta en el 30 %). */
const GreyTest: React.FC<{ a: number; b: number; split: number }> = ({ a, b, split }) => {
  const t = useCurrentFrame() / fps;
  const o = interpolate(t, [a, a + 0.4, b - 0.2, b + 0.2], [0, 1, 1, 0], clamp);
  const bridge = fade(t, split, 0.6);
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{ opacity: o, background: "#0B0B0F", fontFamily: theme.font, flexDirection: "row" }}>
      {[RED, GREEN].map((bg) => (
        <div key={bg} style={{ flex: 1, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 300, height: 300, background: "#808080" }} />
        </div>
      ))}
      <div style={{ position: "absolute", left: "25%", right: "25%", top: 390, height: 300, opacity: bridge, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", left: 150, right: 150, height: 60, background: "#808080" }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", color: "#fff", fontSize: 64, fontWeight: 800, textShadow: shadow }}>
        {bridge > 0.5 ? "Same grey. Joined." : "Same grey?"}
      </div>
      <Pill text="Simplified illustration · after Chevreul (1839)" right bottom />
    </AbsoluteFill>
  );
};

/** Lista de pruebas sobre foto IA: frase corta + sello (los sellos los pone `scene`). */
const Claim: React.FC<{ a: number; b: number; text: string }> = ({ a, b, text }) => {
  const t = useCurrentFrame() / fps;
  // Sale antes de que entre la siguiente (QA LOTE-EX: solape 5:47-5:49).
  const d = Math.min(0.35, (b - a) / 3);
  const o = interpolate(t, [a + 0.05, a + 0.05 + d, b - 0.05 - d, b - 0.05], [0, 1, 1, 0], clamp);
  return o > 0 ? (
    <div style={{ position: "absolute", left: 80, top: 300, width: 1100, color: "#fff", fontFamily: theme.font, fontSize: 70, fontWeight: 800, lineHeight: 1.1, textShadow: shadow, opacity: o }}>{text}</div>
  ) : null;
};

/** Taxi amarillo junto a taxi azul (Singapur): dibujo simplificado, sin marcas ni matriculas (QA LOTE-EX punto 2). */
const Taxi: React.FC<{ body: string; label: string }> = ({ body, label }) => (
  <div style={{ textAlign: "center" }}>
    <svg width={400} height={180} viewBox="0 0 200 90">
      <rect x={84} y={6} width={32} height={11} rx={2} fill="#fff" />
      <path d="M48 42 L66 18 L136 18 L156 42 Z" fill={body} />
      <path d="M58 40 L70 23 L98 23 L98 40 Z M104 23 L132 23 L146 40 L104 40 Z" fill="#9FC3D6" />
      <rect x={10} y={40} width={182} height={32} rx={10} fill={body} />
      <rect x={10} y={58} width={182} height={3} fill="rgba(0,0,0,0.25)" />
      <circle cx={50} cy={72} r={14} fill="#1A1A1A" /><circle cx={50} cy={72} r={6} fill="#888" />
      <circle cx={152} cy={72} r={14} fill="#1A1A1A" /><circle cx={152} cy={72} r={6} fill="#888" />
    </svg>
    <div style={{ color: "#fff", fontSize: 44, fontWeight: 800, textShadow: shadow }}>{label}</div>
  </div>
);

const TaxiPair: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const t = useCurrentFrame() / fps;
  const d = Math.min(0.35, (b - a) / 3);
  const o = interpolate(t, [a + 0.05, a + 0.05 + d, b - 0.05 - d, b - 0.05], [0, 1, 1, 0], clamp);
  return o > 0 ? (
    <div style={{ position: "absolute", left: 460, right: 460, top: 450, padding: "24px 30px 18px", background: "rgba(0,0,0,0.6)", borderRadius: 16, opacity: o, fontFamily: theme.font }}>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Taxi body="#F0BE00" label="Yellow" />
        <Taxi body="#2F6FD0" label="Blue" />
      </div>
      <div style={{ marginTop: 10, textAlign: "center", color: "#fff", fontSize: 28 }}>Simplified illustration</div>
    </div>
  ) : null;
};

const CLAIMS: [number, string][] = [[86, "“Red wins fights.”"], [87, "“Blue sparks ideas.”"], [88, "“Green relaxes you.”"], [89, "“Yellow is safer.”"], [90, "“Pink calms prisoners.”"], [91, "“Color = +80% recognition.”"]];

export const SCENESL052: Record<string, React.FC<SceneProps>> = {
  ch00: scene(0, 5, [
    { p: 0, img: "rain", pos: "50% 45%", title: "Same painting.", late: 3.2 },
    { p: 1, img: "rain", pos: "50% 45%", title: "Only the color changes." },
    { p: 2, img: "rain", pos: "50% 45%", tint: RED, title: "RED" },
    { p: 3, img: "rain", pos: "50% 45%", tint: GREEN, title: "GREEN" },
    { p: 4, img: "rain", pos: "50% 45%", tint: YELLOW, title: "YELLOW" },
    { p: 5, img: "rain", pos: "50% 45%" },
  ]),
  ch01: scene(6, 10, [
    { p: 6, img: "rouen-sun" },
    { p: 7, img: "nightcafe" },
    { p: 8, img: "wave", title: "What color really does" },
    { p: 9, img: "bedroom" },
    { p: 10, img: "pearl", pos: "50% 35%" },
  ]),
  ch02: scene(11, 19, [
    { p: 11, img: "rouen-grey", title: "Rouen, 1892", pos: "50% 30%" },
    { p: 12, img: "rouen-blue", pos: "50% 30%" },
    { p: 13, img: "rouen-sun", title: "About 30 times", pos: "50% 30%" },
    { p: 14, img: "rouen-sunset", pos: "50% 30%" },
    { p: 15, img: "rouen-grey", pos: "50% 60%" },
    { p: 16, img: "rouen-sun", pos: "50% 60%" },
    { p: 17, img: "rouen-blue", pos: "50% 40%" },
    { p: 18, img: "rouen-sunset", label: "Durand-Ruel gallery, Paris, 1895", pos: "50% 40%" },
    { p: 19, img: "rouen-sun", title: "Same building. Twenty buildings.", pos: "50% 40%" },
  ]),
  ch03: scene(20, 27, [
    { p: 20, img: "nightcafe", title: "Arles, 1888" },
    { p: 21, img: "nightcafe", zoom: [1.1, 1.2] },
    { p: 22, img: "nightcafe", label: "Letter 676, 8 September 1888" },
    { p: 23, img: "nightcafe", title: "“…the terrible passions of humanity”" },
    { p: 24, img: "nightcafe", zoom: [1.05, 1.0] },
    { p: 25, img: "nightcafe", tint: COLD },
    { p: 26, img: "nightcafe", tint: COLD, title: "Cold. Almost calm." },
    { p: 27, img: "nightcafe", title: "The tension returns." },
  ]),
  ch03b: scene(28, 38, [
    { p: 28, img: "wave", title: "Japan, c. 1830" },
    { p: 29, img: "wave", zoom: [1.0, 1.1] },
    { p: 30, img: "wave", zoom: [1.3, 1.45], pos: "30% 40%" },
    { p: 31, img: "wave", label: "Prussian blue", zoom: [1.3, 1.4], pos: "30% 40%" },
    { p: 32, img: "wave" },
    { p: 34, img: "wave", label: "Prussian blue + indigo", zoom: [1.2, 1.3], pos: "40% 50%" },
    { p: 35, img: "wave", tint: RED },
    { p: 36, img: "wave", tint: RED, title: "Fire. Or a warning." },
    { p: 37, img: "wave", title: "Water again." },
    { p: 38, img: "wave", zoom: [1.1, 1.0] },
  ]),
  ch03c: scene(39, 50, [
    { p: 39, img: "bedroom", title: "Six weeks after the café" },
    { p: 40, img: "bedroom", title: "His bedroom, Arles" },
    { p: 41, img: "bedroom", label: "Letter 705, 16 October 1888" },
    { p: 42, img: "bedroom", label: "Walls were violet. The red pigment faded.", zoom: [1.15, 1.25], title: "Violet. Red. Yellow. Scarlet. Green." },
    { p: 43, img: "bedroom" },
    { p: 44, img: "bedroom", title: "Rest. Or sleep." },
    { p: 45, img: "bedroom", zoom: [1.1, 1.2] },
    { p: 46, img: "nightcafe", title: "Passion…" },
    { p: 47, img: "bedroom", title: "…or rest?" },
    { p: 48, img: "bedroom", tint: RED, walls: true },
    { p: 49, img: "bedroom", tint: RED, walls: true, title: "Not a place to sleep." },
    { p: 50, img: "bedroom", label: "Walls were violet. The red pigment faded.", title: "The room settles down." },
  ]),
  ch04: scene(51, 55, [
    { p: 51, img: "rain", pos: "50% 45%" },
    { p: 52, img: "rain", pos: "50% 45%", tint: RED, mask: [62, 22, 380], title: "One umbrella. Red." },
    { p: 53, img: "rain", pos: "50% 45%", tint: RED, mask: [62, 22, 380], zoom: [1.09, 1.15] },
    { p: 54, img: "rain", pos: "50% 45%", tint: GREEN, mask: [62, 22, 380], title: "Green." },
    { p: 55, img: "rain", pos: "50% 45%", title: "Color decides where you look." },
  ]),
  ch04b: scene(56, 66, [
    { p: 56, img: "pearl", pos: "50% 30%" },
    { p: 57, img: "pearl", pos: "50% 30%", title: "Delft, c. 1665" },
    { p: 58, img: "pearl", pos: "50% 20%", zoom: [1.2, 1.35], label: "Ultramarine" },
    { p: 59, img: "pearl", pos: "50% 20%", zoom: [1.3, 1.4] },
    { p: 60, img: "pearl", pos: "50% 30%", label: "Lapis lazuli" },
    { p: 61, img: "pearl", pos: "50% 30%", label: "Mauritshuis, 2018" },
    { p: 62, img: "pearl", pos: "50% 20%", zoom: [1.25, 1.35] },
    { p: 63, img: "pearl", pos: "50% 50%" },
    { p: 64, img: "pearl", pos: "50% 50%", title: "Almost black." },
    { p: 65, img: "pearl", pos: "50% 40%", tint: "#1E6B3A", title: "A rough guess. Not a restoration." },
    { p: 66, img: "pearl", pos: "50% 40%", tint: "#1E6B3A" },
  ]),
  ch04c: scene(67, 76, [
    { p: 67, img: "battersea", title: "London, 1870s" },
    { p: 68, img: "battersea", label: "Nocturne in Blue and Gold" },
    { p: 69, img: "rocket", title: "Colors first." },
    { p: 70, img: "rocket", title: "Ruskin, 1877" },
    { p: 71, img: "rocket", label: "John Ruskin, 1877", title: "“…flinging a pot of paint in the public's face”" },
    { p: 72, img: "rocket", title: "Sued for libel." },
    { p: 73, img: "rocket", label: "1 farthing = 1/4 penny", title: "Won. One farthing." },
    { p: 74, img: "battersea", title: "Broke." },
    { p: 75, img: "battersea", tint: DAY, title: "Daylight colors" },
    { p: 76, img: "battersea", tint: DAY, title: "The night is gone." },
  ]),
  ch05: scene(77, 84, [
    { p: 77, img: "ai:2", title: "The first real clue: a factory" },
    { p: 78, img: "ai:2", title: "Paris, 1820s · Gobelins", zoom: [1.08, 1.15] },
    { p: 79, img: "ai:2", title: "Weak blacks?", zoom: [1.2, 1.3], pos: "70% 60%" },
    { p: 80, img: "ai:2", title: "The dye was fine.", zoom: [1.1, 1.0] },
  ], (c, t, d) => <GreyTest a={c(81)} b={d + 1} split={c(83)} />),
  ch06: scene(85, 92, [
    { p: 85, img: "ai:5", title: "Seeing vs. feeling" },
    { p: 86, img: "ai:0" },
    { p: 87, img: "c:2" },
    { p: 88, img: "c:3" },
    { p: 89, img: "rain", pos: "50% 45%", tint: YELLOW, stampOk: true },
    { p: 90, img: "c:6", tint: PINK, stampOk: true },
    { p: 91, img: "ai:5" },
    { p: 92, img: "rain", pos: "50% 45%", title: "Eyes: solid. Mood: mostly a story." },
  ], (c) => <>{CLAIMS.map(([p, txt]) => <Claim key={p} a={c(p)} b={c(p + 1)} text={txt} />)}<TaxiPair a={c(89)} b={c(90)} /></>),
  ch07: scene(93, 101, [
    { p: 93, img: "rouen-sun", title: "The painters knew." },
    { p: 94, img: "nightcafe" },
    { p: 95, img: "rouen-blue" },
    { p: 96, img: "wave" },
    { p: 97, img: "pearl", pos: "50% 30%" },
    { p: 98, img: "rocket" },
    { p: 99, img: "bedroom" },
    { p: 100, img: "rain", pos: "50% 45%", title: "What you notice." },
    { p: 101, img: "rain", pos: "50% 45%", title: "Feelings follow. Sometimes." },
  ]),
  ch08: scene(102, 111, [
    { p: 102, img: "rain", pos: "50% 45%", title: "Try it yourself." },
    { p: 103, img: "rain", pos: "50% 45%", tint: RED },
    { p: 104, img: "rain", pos: "50% 45%", tint: GREEN },
    { p: 105, img: "rain", pos: "50% 45%", tint: YELLOW },
    { p: 106, img: "rain", pos: "50% 45%", title: "Same street. Same rain." },
    { p: 107, img: "rain", pos: "50% 45%" },
    { p: 108, img: "wave", f: 0.35 },
    { p: 108, img: "wave", tint: RED, f: 0.75 },
    { p: 109, img: "pearl", pos: "50% 40%" },
    { p: 109, img: "pearl", pos: "50% 40%", tint: "#1E6B3A", f: 0.65 },
    { p: 110, img: "battersea" },
    { p: 110, img: "battersea", tint: DAY, f: 0.65 },
    { p: 111, img: "rain", pos: "50% 45%", title: "Only the color moved." },
  ]),
  ch09: scene(112, 121, [
    { p: 112, img: "rouen-sun", title: "Color has power." },
    { p: 113, img: "nightcafe", title: "Not the posters' power." },
    { p: 114, img: "rain", pos: "50% 45%", title: "It directs your eyes." },
    { p: 115, img: "rouen-blue" },
    { p: 115, img: "nightcafe", f: 0.38 },
    { p: 115, img: "bedroom", f: 0.72, label: "Walls were violet. The red pigment faded." },
    { p: 116, img: "wave" },
    { p: 116, img: "pearl", pos: "50% 30%", f: 0.36 },
    { p: 116, img: "battersea", f: 0.7 },
    { p: 117, img: "bedroom" },
    { p: 118, img: "pearl", pos: "50% 30%", title: "Ask which study." },
    { p: 119, img: "nightcafe", title: "Ask which color." },
    { p: 120, img: "ai:5" },
    { p: 121, img: "ai:5", title: "Next: the eye on the dollar bill" },
  ]),
};

/** Portada propia del LARGO (P2 01:28): la misma pintura (dominio publico) en tres tintes, 3 palabras. 1280x720. */
export const ThumbEM052L: React.FC = () => (
  <AbsoluteFill style={{ background: "#0B0B0F", fontFamily: theme.font }}>
    <div style={{ display: "flex", height: 720 }}>
      {(["hue-rotate(0deg)", "sepia(1) saturate(4) hue-rotate(-35deg)", "sepia(1) saturate(4) hue-rotate(170deg)"] as const).map((f, i) => (
        <div key={i} style={{ flex: 1, overflow: "hidden", borderRight: i < 2 ? "6px solid #0B0B0F" : "none" }}>
          <Img src={staticFile("images/em052-art-rain.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: f }} />
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 56, textAlign: "center" }}>
      <span style={{ display: "inline-block", padding: "8px 40px", fontSize: 128, fontWeight: 900, letterSpacing: 2, color: "#fff", background: "rgba(11,11,15,0.82)", borderRadius: 14 }}>
        SAME <span style={{ color: "#FFB000" }}>PAINTING?</span>
      </span>
    </div>
  </AbsoluteFill>
);
