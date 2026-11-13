// Remake de los terminados con la estetica nueva (kit2): fabrica de escenas + composicion comun. Un episodio = scenesNNNv2.tsx + 3 lineas.
import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BrandIntro } from "../components/BrandIntro";
import { theme, VIDEO } from "../themes/brand";
import { ramp } from "../utils/anim";
import { buildEpisode, OVERLAP } from "../utils/timing";
import type { EpisodeJson, Timing } from "../utils/timing";
import { SvgFrame, teal, useT } from "./kit";
import { Cam, PaperBg, Simplified2, Subtitle } from "./kit2";
import type { SceneProps } from "./scenes";
import { Lab } from "./scenes025";
import { pk, Sfx, sfxOf, Shots } from "./scenes023";
import type { Ev, Sh } from "./scenes023";

const { fps } = VIDEO;
const CARD = "#FFFDF6";

/** Foto libre / patente: fichero en public/images, proporcion, credito en pastilla "Source:" y rotulo opcional. Las imagenes sin entrada son ChatGPT cuadradas (public/illustrations/<pfx><id>.png) y llevan "Illustrative image". */
export type Ph = { f: string; asp: number; cr: string; lab?: string };

/** Pastilla de fuente (abajo-izquierda); y=884 credito de foto, y=832 fuente escrita. */
export const Cite: React.FC<{ text: string; a: number; b: number; y?: number; x?: number }> = ({ text, a, b, y = 874, x = 52 }) => {
  const t = useT();
  const o = ramp(t, a, a + 0.3) * (1 - ramp(t, b - 0.3, b));
  return o > 0 ? (
    <g opacity={o}>
      <rect x={x} y={y} width={(text.length + 8) * 13 + 56} height={44} rx={22} fill={CARD} stroke={teal} strokeWidth={3} />
      <text x={x + 24} y={y + 23} dominantBaseline="central" fontFamily={theme.font} fontWeight={700} fontSize={24} fill={teal}>
        Source: {text}
      </text>
    </g>
  ) : null;
};
/** "Simplified illustration" entre a y b. */
export const SimpAt: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const t = useT();
  const o = ramp(t, a, a + 0.3) * (1 - ramp(t, b - 0.3, b));
  return o > 0 ? (
    <>
      <rect x={1306} y={885} width={578} height={44} rx={22} fill={CARD} opacity={0.94 * o} stroke={theme.ink} strokeWidth={2} strokeOpacity={0.5} />
      <Simplified2 o={o} />
    </>
  ) : null;
};

type Mk = (P: (part: number, o?: number) => number, dur: number) => { shots: Sh[]; ov: React.ReactNode; ev?: Ev[]; src?: React.ReactNode; simp?: [number, number] };
export const mkScene = (pfx: string, PH: Record<string, Ph> = {}, AI: string[] = [], SI: string[] = []) => (from: number, id: string, mk: Mk): React.FC<SceneProps> => ({ cues, dur }) => {
  const P0 = pk(cues, from);
  const P = (part: number, o = 0) => (part - from >= cues.length ? dur + o : P0(part, o));
  const { shots, ov, ev = [], src, simp } = mk(P, dur);
  const list = shots.map((s) => (PH[s.id] ? { ...s, asp: PH[s.id].asp } : s));
  return (
    <>
      <SvgFrame>
        <Cam dur={dur} z1={1.04} amt={0.6}>
          <Shots id={id} list={list} dur={dur} src={(k) => staticFile(PH[k] ? `images/${PH[k].f}` : `illustrations/${pfx}${k}.png`)} />
        </Cam>
        <Cam dur={dur} z1={1.05} dx={-20} amt={1.3}>
          {ov}
        </Cam>
        {list.map((s, i) => {
          const b = list[i + 1]?.t ?? dur;
          const p = PH[s.id];
          return (
            <React.Fragment key={i}>
              {p ? <Cite text={p.cr} a={s.t} b={b} /> : <Lab text={AI.includes(s.id) ? "AI illustration, not a portrait" : SI.includes(s.id) ? "Simplified illustration" : undefined} a={s.t} b={b} />}
              {p?.lab && <Lab text={p.lab} a={s.t} b={b} y={s.id === "watson" ? 895 : undefined} />}
            </React.Fragment>
          );
        })}
        {src}
        {simp && <SimpAt a={simp[0]} b={simp[1]} />}
      </SvgFrame>
      <Sfx ev={[...sfxOf(list), ...ev]} />
    </>
  );
};

const SceneFrame: React.FC<{ frames: number; first: boolean; last: boolean; children: React.ReactNode }> = ({ frames, first, last, children }) => {
  const f = useCurrentFrame();
  const ov = Math.round((last ? 0.6 : OVERLAP) * fps);
  const o = interpolate(f, [0, ov, frames - ov, frames], [first ? 1 : 0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const splitSub = (s: string, max = 100): string[] => {
  if (s.length <= max) return [s];
  const mid = s.length / 2;
  const cuts = [...s.matchAll(/[.?!;:,] /g)].map((m) => (m.index ?? 0) + 1);
  const spaces = [...s.matchAll(/ /g)].map((m) => m.index ?? 0).filter((i) => !/Salt Lake|Lake City/.test(s.slice(Math.max(0, i - 4), i + 6)));
  const best = (a: number[]) => a.reduce((p, q) => (Math.abs(q - mid) < Math.abs(p - mid) ? q : p), a[0]);
  const near = cuts.filter((c) => Math.abs(c - mid) < s.length * 0.25);
  const c = near.length ? best(near) : best(spaces.length ? spaces : [Math.round(mid)]);
  return [...splitSub(s.slice(0, c).trim(), max), ...splitSub(s.slice(c).trim(), max)];
};

/** Subtitulos de 60 px: las frases largas se parten en cues de <=100 caracteres (2 lineas), repartiendo el tiempo por longitud. */
export const subCues = ({ parts, start, speechEnd }: { parts: string[]; start: (i: number) => number; speechEnd: (i: number) => number }, fps: number, fade = 6, subBottom?: number) =>
  parts.flatMap((text, i) => {
    const bits = splitSub(text);
    const t0 = start(i);
    const span = speechEnd(i) + 0.1 - t0;
    let used = 0;
    return bits.map((bit, k) => {
      const from = Math.round((t0 + (span * used) / text.length) * fps);
      used += bit.length + 1;
      const end = k === bits.length - 1 ? Math.round((t0 + span) * fps) : Math.round((t0 + (span * used) / text.length) * fps);
      return (
        <Sequence key={`${i}-${k}`} from={from} durationInFrames={end - from} name={`sub-${i}-${k}`}>
          <Subtitle text={bit.replace("I S O", "ISO")} durationInFrames={end - from} size={60} fade={fade} bottom={subBottom} />
        </Sequence>
      );
    });
  });

/** Episodio completo: voz + musica ya mezcladas (scripts/em_audio.py mix), escenas, intro de marca y subtitulos grandes (60). */
export const makeV2 = (ep: EpisodeJson, timing: Timing, SCENES: Record<string, React.FC<SceneProps>>, lightBrand = false, tail?: number, fade = 6, brandDelay = 0, subBottom?: number) => {
  const E = buildEpisode(ep, timing, fps, tail);
  const C: React.FC = () => {
    const { scenes, start } = E;
    return (
      <AbsoluteFill>
        <PaperBg />
        <Audio src={staticFile(`audio/${ep.id}-mix.wav`)} />
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
        <Sequence from={Math.round(brandDelay * fps)} durationInFrames={Math.round(3 * fps)} name="brand">
          <BrandIntro duration={3} light={lightBrand} />
        </Sequence>
        {subCues(E, fps, fade, subBottom)}
      </AbsoluteFill>
    );
  };
  return [E, C] as const;
};
