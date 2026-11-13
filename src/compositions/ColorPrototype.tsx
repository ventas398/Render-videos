import React from "react";
import { AbsoluteFill, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { theme } from "../themes/brand";

// EM-052 "The Power of Color" v2 (sin voz). Paletas: docs/EM052_PALETAS_Y_MOVIMIENTO_08NOV.md
// (1-3 HEX del brief; 4-6 medidos en las propias imagenes v2). Sellos: docs/EM-052-FACTS.md / EM-052-GUION.md.
type Verdict = "DOCUMENTED" | "DISPUTED" | "MYTH";
type Swatch = [name: string, hex: string];
type Palette = {
  base: Swatch; light: Swatch; accent: Swatch;
  line1: string; adj2: string; // "<base> and <light> look ..." / "Add <accent>, and they look <adj2>"
  claim: string; verdict: Verdict; note: string;
  origin: [number, number]; // % desde donde entra el acento
};

const PALETTES: Palette[] = [
  { base: ["Midnight Black", "#030308"], light: ["Off-White", "#DECEC5"], accent: ["Crimson Red", "#C40D2E"],
    line1: "Black and off-white look calm.", adj2: "urgent", claim: "“Red wins fights.”", verdict: "DISPUTED",
    note: "Only in close matches — and the effect vanished with electronic scoring.", origin: [0, 72] },
  { base: ["Night Blue", "#071A4B"], light: ["Warm Cream", "#FCE4C9"], accent: ["Signal Orange", "#FC5C0F"],
    line1: "Navy and cream look steady.", adj2: "alive", claim: "“Blue sparks ideas.”", verdict: "DOCUMENTED",
    note: "One 2009 study in Science: blue backgrounds helped idea generation. The viral percentage comes from a blog.", origin: [0, 78] },
  { base: ["Forest Green", "#104331"], light: ["Ivory", "#F0E5D3"], accent: ["Acid Lime", "#D1F906"],
    line1: "Forest green and ivory look safe.", adj2: "electric", claim: "“Green relaxes you.”", verdict: "DISPUTED",
    note: "The studies we found never separate the color from nature.", origin: [0, 85] },
  { base: ["Terracotta", "#742F1A"], light: ["Sand", "#F6EBCE"], accent: ["Turquoise", "#03E5D5"],
    line1: "Terracotta and sand look warm.", adj2: "fresh", claim: "“Blue kills your appetite.”", verdict: "MYTH",
    note: "A 2020 study found no effect of color cues on the desire to eat.", origin: [0, 80] },
  { base: ["Graphite", "#262526"], light: ["Bone", "#F5DDC6"], accent: ["Amber", "#F79C03"],
    line1: "Graphite and bone look serious.", adj2: "loud", claim: "“Yellow makes you anxious.”", verdict: "DISPUTED",
    note: "Weak evidence. Being seen is another story: yellow taxis, fewer crashes (PNAS 2017).", origin: [68, 55] },
  { base: ["Wine", "#3A0111"], light: ["Bone White", "#EFE5D7"], accent: ["Mint Green", "#31D489"],
    line1: "Wine and bone white look elegant.", adj2: "new", claim: "“Color lifts brand recognition 80%.”", verdict: "MYTH",
    note: "No original study found — just a number copied page to page.", origin: [0, 66] },
];

const STAMP: Record<Verdict, string> = { DOCUMENTED: theme.teal, DISPUTED: theme.orange, MYTH: "#C40D2E" };
const INTRO = 90;
const PAL = 210;
const GRID = 150;
const END = 90;
const img = (i: number) => staticFile(`images/em052-v2-${i + 1}-h.png`);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fade = (f: number, a: number, b = a + 15) => interpolate(f, [a, b], [0, 1], clamp);
const shadow = "0 2px 18px rgba(0,0,0,0.75)";

const Label: React.FC<{ color?: string }> = ({ color = "#fff" }) => (
  <div style={{ position: "absolute", left: 28, bottom: 22, fontSize: 28, color, opacity: 1, textShadow: shadow }}>Illustrative image</div>
);

const Card: React.FC<{ s: Swatch; o: number; big?: boolean }> = ({ s, o, big }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 20px", marginBottom: 10, borderRadius: 12,
    background: "rgba(0,0,0,0.55)", opacity: o, transform: `translateX(${(1 - o) * 40}px)` }}>
    <div style={{ width: big ? 46 : 38, height: big ? 46 : 38, borderRadius: 8, background: s[1], border: "2px solid rgba(255,255,255,0.6)" }} />
    <div style={{ color: "#fff", fontSize: big ? 32 : 28, fontWeight: big ? 700 : 500, minWidth: 230 }}>{s[0]}</div>
    <div style={{ color: "#fff", fontSize: 40, fontFamily: "Consolas, monospace", fontWeight: 700 }}>{s[1]}</div>
  </div>
);

const Still: React.FC<{ i: number; dur: number; title?: string; sub?: string }> = ({ i, dur, title, sub }) => {
  const f = useCurrentFrame();
  const o = Math.min(fade(f, 0, 12), 1 - fade(f, dur - 12, dur));
  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: theme.font, opacity: o }}>
      <Img src={img(i)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${interpolate(f, [0, dur], [1.0, 1.07])})` }} />
      <div style={{ position: "absolute", left: 90, top: 300, color: "#fff", textShadow: shadow, opacity: fade(f, 10, 30) }}>
        <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1.05 }}>{title}</div>
        <div style={{ fontSize: 40, marginTop: 18, opacity: 0.9 }}>{sub}</div>
      </div>
      <Label />
    </AbsoluteFill>
  );
};

const PaletteScene: React.FC<{ p: Palette; i: number }> = ({ p, i }) => {
  const f = useCurrentFrame();
  const o = Math.min(fade(f, 0, 10), 1 - fade(f, PAL - 12, PAL));
  const zoom = `scale(${interpolate(f, [0, PAL], [1, 1.06])})`;
  // El acento entra como tinta: mascara radial de borde muy blando que crece desde el origen + niebla del color.
  const k = interpolate(f, [55, 135], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const r = k * 2600;
  const [ox, oy] = p.origin;
  const mask = `radial-gradient(circle at ${ox}% ${oy}%, #000 ${r - 500}px, transparent ${r}px)`;
  const mistX = ox + (60 - ox) * k;
  const mistY = oy + (45 - oy) * k;
  const mist = Math.sin(Math.PI * Math.min(k * 1.15, 1)) * 0.55 + (k > 0.9 ? 0.12 : 0);
  return (
    <AbsoluteFill style={{ background: p.base[1], fontFamily: theme.font, opacity: o, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: zoom }}>
        <Img src={img(i)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) brightness(0.85)" }} />
        <AbsoluteFill style={{ background: p.base[1], mixBlendMode: "color" }} />
        <AbsoluteFill style={{ WebkitMaskImage: mask, maskImage: mask }}>
          <Img src={img(i)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: `${mistX}%`, top: `${mistY}%`, width: 1100, height: 700, marginLeft: -550, marginTop: -350,
        borderRadius: "50%", background: `radial-gradient(closest-side, ${p.accent[1]}, transparent)`, filter: "blur(60px)",
        mixBlendMode: "screen", opacity: mist, transform: `rotate(${f * 0.4}deg) scale(${1 + 0.15 * Math.sin(f / 14)}, 1)` }} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.5), rgba(0,0,0,0.25) 45%, transparent 60%)" }} />
      <div style={{ position: "absolute", right: 50, top: 50 }}>
        <Card s={p.base} o={fade(f, 8, 22)} />
        <Card s={p.light} o={fade(f, 22, 36)} />
        <Card s={p.accent} o={fade(f, 72, 86)} big />
      </div>
      <div style={{ position: "absolute", left: 90, top: 230, width: 900, color: "#fff", textShadow: shadow }}>
        <div style={{ fontSize: 50, fontWeight: 600, opacity: fade(f, 10, 25) }}>{p.line1}</div>
        <div style={{ fontSize: 50, fontWeight: 600, marginTop: 6, opacity: fade(f, 70, 85) }}>
          Add <span style={{ color: p.accent[1], fontWeight: 800 }}>{p.accent[0].toLowerCase()}</span>, and they look {p.adj2}.
        </div>
        <div style={{ fontSize: 40, marginTop: 44, fontStyle: "italic", opacity: fade(f, 112, 126) }}>{p.claim}</div>
        <div style={{ display: "inline-block", marginTop: 16, padding: "6px 22px", fontSize: 40, fontWeight: 900, letterSpacing: 3,
          background: STAMP[p.verdict], border: "3px solid #fff", borderRadius: 8, textShadow: "none", opacity: fade(f, 128, 134),
          transform: `rotate(-3deg) scale(${interpolate(f, [128, 136], [1.4, 1], clamp)})` }}>{p.verdict}</div>
        <div style={{ fontSize: 40, marginTop: 18, lineHeight: 1.25, padding: "8px 14px", marginLeft: -14, borderRadius: 8, background: "rgba(0,0,0,0.5)", opacity: fade(f, 140, 155) }}>{p.note}</div>
      </div>
      <Label />
    </AbsoluteFill>
  );
};

const Grid: React.FC = () => {
  const f = useCurrentFrame();
  const o = Math.min(fade(f, 0, 12), 1 - fade(f, GRID - 12, GRID));
  return (
    <AbsoluteFill style={{ background: "#0B0B0F", fontFamily: theme.font, opacity: o, padding: "70px 80px", display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)", gap: "36px 40px", alignContent: "center" }}>
      {PALETTES.map((p, i) => (
        <div key={p.accent[1]} style={{ opacity: fade(f, 6 + i * 8, 20 + i * 8), transform: `translateY(${(1 - fade(f, 6 + i * 8, 20 + i * 8)) * 30}px)` }}>
          <Img src={img(i)} style={{ width: "100%", height: 250, objectFit: "cover", borderRadius: 12, display: "block" }} />
          <div style={{ color: p.accent[1], fontSize: 28, fontWeight: 700, marginTop: 10 }}>{p.base[0]} · {p.light[0]} · {p.accent[0]}</div>
          <div style={{ display: "flex", marginTop: 6, gap: 8 }}>
            {[p.base, p.light, p.accent].map((s) => (
              <div key={s[1]} style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 22, height: 22, borderRadius: 5, background: s[1], border: "1px solid rgba(255,255,255,0.5)" }} />
                <div style={{ color: "#fff", fontSize: 28, fontFamily: "Consolas, monospace" }}>{s[1]}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <Label />
    </AbsoluteFill>
  );
};

/** EM-052 prototipo v2: flor (v2-6) 3 s -> 6 paletas -> rejilla de paletas -> flor final. Sin voz. */
export const ColorPrototype: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Sequence durationInFrames={INTRO}>
      <Still i={5} dur={INTRO} title="The Power of Color" sub="What the studies actually say" />
    </Sequence>
    {PALETTES.map((p, i) => (
      <Sequence key={p.accent[1]} from={INTRO + i * PAL} durationInFrames={PAL}>
        <PaletteScene p={p} i={i} />
      </Sequence>
    ))}
    <Sequence from={INTRO + PALETTES.length * PAL} durationInFrames={GRID}>
      <Grid />
    </Sequence>
    <Sequence from={INTRO + PALETTES.length * PAL + GRID} durationInFrames={END}>
      <Still i={5} dur={END} title="Look again" sub="at what you stopped seeing." />
    </Sequence>
  </AbsoluteFill>
);

export const COLOR_PROTOTYPE_FRAMES = INTRO + PALETTES.length * PAL + GRID + END;
