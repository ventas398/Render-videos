// Gancho de los TikTok con voz energica (IDEA-73G/74G/75G): planos cortos por tiempo (ep.hookScene.shots), 1-2 s cada uno.
// Cada plano: foto (zoom z0 -> z1; z0 > z1 = zoom hacia fuera) o fondo azul marino con rejilla, texto enorme con golpe, contador o calendario.
import React from "react";
import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { theme, VIDEO } from "../themes/brand";

const { fps } = VIDEO;
const NAVY = "#0A1A4A", YEL = "#FFC400", ICE = "#9FD0FF";
const IMP = "Impact, 'Arial Black', sans-serif";
const c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (x: number) => x * x * (3 - 2 * x);
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export type HookLine = { t: string; s: number; y: number; c?: "yel" | "ice"; count?: [number, number]; d?: number }; // d: retraso en fotogramas
export type HookShot = { t: number; img?: string; z0?: number; z1?: number; ox?: string; oy?: string; dim?: number; tag?: string; cal?: boolean; lines?: HookLine[] };
export type HookScene = { until: number; shots: HookShot[] };

const Line: React.FC<{ l: HookLine; n: number }> = ({ l, n }) => {
  const f = useCurrentFrame() - (l.d ?? 0);
  const k = ease(Math.min(Math.max(f, 0) / (n * 0.8), 1));
  const txt = l.count ? Math.round(l.count[0] + (l.count[1] - l.count[0]) * k).toLocaleString("en-US") : l.t;
  return <div style={{ position: "absolute", left: 20, right: 20, top: l.y, textAlign: "center", fontFamily: IMP, fontSize: l.s, lineHeight: 1.02, color: l.c === "ice" ? ICE : l.c === "yel" || !l.c ? YEL : "#fff", opacity: f < 0 ? 0 : 1, transform: `scale(${interpolate(f, [0, 5], [1.35, 1], c)})`, WebkitTextStroke: `10px ${NAVY}`, paintOrder: "stroke fill", textShadow: `0 8px 24px ${NAVY}` }}>{txt}</div>;
};

/** Calendario que pasa hojas muy deprisa: los meses vuelan y el contador de anos sube hasta 32 (ilustracion simplificada). */
const Cal: React.FC<{ n: number }> = ({ n }) => {
  const f = useCurrentFrame();
  const yr = Math.floor(32 * ease(Math.min(f / (n * 0.85), 1)));
  return (
    <div style={{ position: "absolute", left: 190, top: 560, width: 700, height: 520, borderRadius: 28, background: theme.bg, border: `14px solid ${YEL}`, boxShadow: "0 18px 0 rgba(0,0,0,.35)", transform: `perspective(900px) rotateX(${(f % 2) * -14}deg)` }}>
      <div style={{ height: 110, background: theme.orange, borderRadius: "10px 10px 0 0" }} />
      <div style={{ textAlign: "center", fontFamily: IMP, fontSize: 250, lineHeight: 1.1, color: theme.ink }}>{MONTHS[(f * 5) % 12]}</div>
      <div style={{ textAlign: "center", fontFamily: theme.font, fontWeight: 800, fontSize: 60, color: theme.teal }}>YEAR {Math.min(yr, 31) + 1}</div>
    </div>
  );
};

const Shot: React.FC<{ s: HookShot; n: number }> = ({ s, n }) => {
  const f = useCurrentFrame();
  const z = (s.z0 ?? 1.1) + ((s.z1 ?? s.z0 ?? 1.1) - (s.z0 ?? 1.1)) * ease(Math.min(f / n, 1));
  return (
    <AbsoluteFill style={{ background: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px) 0 0/60px 60px, linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px) 0 0/60px 60px, radial-gradient(circle at 50% 30%, #17358A, ${NAVY} 70%)`, overflow: "hidden" }}>
      {s.img && <Img src={staticFile(`illustrations/${s.img}.png`)} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, objectFit: "cover", transformOrigin: `${s.ox ?? "50%"} ${s.oy ?? "50%"}`, transform: `scale(${z})` }} />}
      {s.dim ? <AbsoluteFill style={{ background: `rgba(10,26,74,${s.dim})` }} /> : null}
      {s.cal && <Cal n={n} />}
      {(s.lines ?? []).map((l, i) => <Line key={i} l={l} n={n} />)}
      {s.tag && <div style={{ position: "absolute", left: 40, top: 178, background: "rgba(10,26,74,.85)", color: "#fff", fontFamily: theme.font, fontWeight: 700, fontSize: 32, padding: "6px 20px", borderRadius: 6 }}>{s.tag}</div>}
    </AbsoluteFill>
  );
};

export const HookSceneView: React.FC<{ scene: HookScene; endS: number }> = ({ scene, endS }) => (
  <>
    {scene.shots.map((s, k) => {
      const a = Math.round(s.t * fps), b = Math.round((scene.shots[k + 1]?.t ?? endS) * fps);
      return <Sequence key={k} from={a} durationInFrames={Math.max(b - a, 1)} name={`hook-${k}`}><Shot s={s} n={Math.max(b - a, 1)} /></Sequence>;
    })}
  </>
);
