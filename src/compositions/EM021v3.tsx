import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import ep from "../episodes/EM-021.json";
import timing from "../episodes/EM-021.timing.json";
import { theme, VIDEO } from "../themes/brand";
import { fade, ramp } from "../utils/anim";
import { buildEpisode, OVERLAP } from "../utils/timing";
import { PaperBg, Subtitle } from "./kit2";
import { SCENES021V3 as SCENES } from "./scenes021v3";

const { fps } = VIDEO;
const END = 3.9; // s de pantalla final
export const EM021V3_EPISODE = buildEpisode(ep, timing, fps, 4.7);

/** La escena entrante se funde sobre la saliente (que sigue opaca debajo): cruce limpio, sin hueco de papel. La ultima se apaga al final. */
const SceneFrame: React.FC<{ frames: number; first: boolean; last: boolean; children: React.ReactNode }> = ({ frames, first, last, children }) => {
  const f = useCurrentFrame();
  const ov = Math.round((last ? 0.8 : OVERLAP) * fps);
  const o = Math.min(first ? 1 : ramp(f / fps, 0, OVERLAP), last ? 1 - ramp(f / fps, (frames - ov) / fps, frames / fps) : 1);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

/** Sello de canal legible sobre foto (blanco con sombra), arriba a la izquierda los 3 primeros segundos. */
const Brand: React.FC = () => {
  const t = useCurrentFrame() / fps;
  const o = fade(t, 0.2, 0.8, 2.4, 3);
  return (
    <div style={{ position: "absolute", left: 56, top: 40, opacity: o, fontFamily: theme.font, textShadow: "0 2px 10px rgba(0,0,0,.8)", background: "rgba(20,33,61,.72)", padding: "18px 28px 16px", borderRadius: 18 }}>
      <div style={{ color: "#fff", fontWeight: 800, fontSize: 30, letterSpacing: 9 }}>THE EVERYDAY MYSTERY</div>
      <div style={{ height: 4, marginTop: 12, width: 420 * ramp(t, 0.3, 1.3), background: theme.orange, borderRadius: 2 }} />
    </div>
  );
};

/** Pantalla final: ultima foto con velo azul tinta, cierre hablado, marca y eslogan. Entra 0,8 s tras la ultima palabra. */
const EndCard: React.FC = () => {
  const t = useCurrentFrame() / fps;
  const o = ramp(t, 0, 0.3);
  const tx: React.CSSProperties = { position: "absolute", width: "100%", textAlign: "center", fontFamily: theme.font, color: "#fff", textShadow: "0 3px 14px rgba(0,0,0,.6)" };
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Img src={staticFile("illustrations/em022-fold-hook.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ background: "rgba(20,33,61,.68)" }} />
      <div style={{ ...tx, top: 270, fontSize: 84, fontWeight: 900 }}>FOLD AN A4 SHEET IN HALF.</div>
      <div style={{ ...tx, top: 380, fontSize: 84, fontWeight: 900, color: "#FFC400" }}>THE SHAPE STAYS THE SAME. WHY?</div>
      <div style={{ position: "absolute", left: 860, top: 530, width: 200, height: 8, background: theme.orange }} />
      <div style={{ ...tx, top: 600, fontSize: 48, fontWeight: 800, letterSpacing: 10 }}>THE EVERYDAY MYSTERY</div>
      <div style={{ ...tx, top: 690, fontSize: 40, fontWeight: 500, fontStyle: "italic" }}>Look again at what you stopped seeing.</div>
      <div style={{ position: "absolute", right: 36, top: 828, background: "rgba(255,253,246,.92)", border: "2px solid rgba(20,33,61,.5)", borderRadius: 22, padding: "7px 22px", fontFamily: theme.font, fontWeight: 700, fontSize: 24, color: theme.ink }}>Illustrative image</div>
    </AbsoluteFill>
  );
};

/** Subtitulos a tamano 60: maximo 2 lineas (~100 car.). Partes mas largas se parten en bloques temporizados por caracteres (mismo criterio que scripts/srt.mjs). */
const splitSub = (s: string, max = 100): string[] => {
  if (s.length <= max) return [s];
  const mid = s.length / 2;
  const idx = (re: RegExp) => [...s.matchAll(re)].map((m) => m.index ?? 0);
  const best = (a: number[]) => a.reduce((p, q) => (Math.abs(q - mid) < Math.abs(p - mid) ? q : p), a[0]);
  const cuts = idx(/[.?!;:,] /g).map((i) => i + 1).filter((c) => Math.abs(c - mid) < s.length * 0.25);
  const c = cuts.length ? best(cuts) : best(idx(/ /g));
  return [...splitSub(s.slice(0, c).trim(), max), ...splitSub(s.slice(c).trim(), max)];
};

/** Voz + musica con ducking (mezcla EM-021-mix.wav); los efectos suaves van en cada escena. */
export const EM021V3: React.FC = () => {
  const { scenes, parts, start, speechEnd } = EM021V3_EPISODE;
  return (
    <AbsoluteFill>
      <PaperBg />
      <Audio src={staticFile("audio/EM-021-mix.wav")} />
      {scenes.map((s, k) => {
        const Scene = SCENES[s.id];
        const cues = Array.from({ length: s.toPart - s.fromPart + 1 }, (_, i) => start(s.fromPart + i) - s.from);
        return (
          <Sequence key={s.id} from={s.fromFrame} durationInFrames={s.frames} name={s.id}>
            <SceneFrame frames={s.frames} first={k === 0} last={k === scenes.length - 1}>
              <Scene cues={cues} dur={s.frames / fps} />
            </SceneFrame>
          </Sequence>
        );
      })}
      <Sequence from={EM021V3_EPISODE.totalFrames - Math.round(END * fps)} name="end-card">
        <EndCard />
      </Sequence>
      <Sequence durationInFrames={3 * fps} name="brand">
        <Brand />
      </Sequence>
      {parts.flatMap((text, i) =>
        splitSub(text).map((bit, j, all) => {
          const t0 = start(i);
          const span = speechEnd(i) + 0.1 - t0;
          const used = all.slice(0, j).reduce((n, b) => n + b.length + 1, 0);
          const from = Math.round((t0 + (span * used) / text.length) * fps);
          const to = Math.round((t0 + (span * Math.min(used + bit.length + 1, text.length)) / text.length) * fps);
          return (
            <Sequence key={`${i}-${j}`} from={from} durationInFrames={to - from} name={`sub-${i}-${j}`}>
              <Subtitle text={bit} durationInFrames={to - from} size={60} />
            </Sequence>
          );
        }),
      )}
    </AbsoluteFill>
  );
};

const NAVY = "#0A1A4A";
const YEL = "#FFC400";
const IMPACT = 'Impact, "Arial Black", "Segoe UI", sans-serif';
const outline = (w: number): React.CSSProperties => ({ WebkitTextStroke: `${w}px ${NAVY}`, paintOrder: "stroke fill", textShadow: `0 8px 0 ${NAVY}, 0 14px 28px rgba(0,0,0,.55)` });

/** Portada v3 (mismo sistema que thumb3.tsx, que deforma fotos 16:9; aqui object-fit cover). 1280x720. */
export const ThumbEM021V3: React.FC<{ photo?: string; fx?: number; fy?: number; zoom?: number; sub?: string; tag?: string }> = ({ photo = "em021-bolt-longexp", fx = 0.62, fy = 0.4, zoom = 1.12, sub = "THUNDER ARRIVES LATE", tag = "~5 SEC = 1 MILE" }) => {
  const w = 1280 * zoom;
  const h = 720 * zoom;
  return (
    <AbsoluteFill style={{ background: NAVY, overflow: "hidden", fontFamily: IMPACT }}>
      <Img
        src={staticFile(`illustrations/${photo}.png`)}
        style={{ position: "absolute", width: w, height: h, objectFit: "cover", left: Math.min(0, Math.max(1280 - w, 640 - fx * w)), top: Math.min(0, Math.max(720 - h, 360 - fy * h)), filter: "contrast(1.18) saturate(1.3) brightness(1.02)" }}
      />
      <AbsoluteFill style={{ background: `linear-gradient(100deg, ${NAVY}F2 0%, ${NAVY}D0 30%, ${NAVY}00 62%)` }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 160px 30px rgba(5,10,40,.55)" }} />
      <div style={{ position: "absolute", left: 44, top: 10, fontSize: 330, lineHeight: 1.05, color: "#fff", letterSpacing: 2, transform: "rotate(-3deg)", transformOrigin: "left center", whiteSpace: "nowrap", ...outline(14) }}>
        WHY<span style={{ color: YEL, fontSize: 380, ...outline(14) }}>?</span>
      </div>
      <div style={{ position: "absolute", left: -30, top: 400, width: 760, transform: "rotate(-4deg)", background: YEL, padding: "14px 30px 14px 74px", boxShadow: `0 10px 0 ${NAVY}, 0 18px 30px rgba(0,0,0,.5)`, fontSize: 82, lineHeight: 1.02, color: NAVY, letterSpacing: 1 }}>
        {sub}
      </div>
      <div style={{ position: "absolute", left: 44, top: 640, background: "#E8261C", color: "#fff", fontSize: 44, padding: "2px 22px", transform: "rotate(-3deg)", boxShadow: `0 6px 0 ${NAVY}`, letterSpacing: 2 }}>{tag}</div>
    </AbsoluteFill>
  );
};
