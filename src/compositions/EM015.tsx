import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { AnimatedCaption } from "../components/AnimatedCaption";
import { BrandIntro } from "../components/BrandIntro";
import ep from "../episodes/EM-015.json";
import timing from "../episodes/EM-015.timing.json";
import { theme, VIDEO } from "../themes/brand";
import { buildEpisode, OVERLAP } from "../utils/timing";
import { SCENES015 as SCENES } from "./scenes015";
import { splitSub } from "./v2";

const { fps } = VIDEO;
export const EM015_EPISODE = buildEpisode(ep, timing, fps, 3.0);

/** Fundido de entrada/salida; las escenas se solapan OVERLAP s para el fundido cruzado. */
const SceneFrame: React.FC<{ frames: number; first: boolean; last: boolean; children: React.ReactNode }> = ({ frames, first, last, children }) => {
  const f = useCurrentFrame();
  const ov = Math.round((last ? 0.6 : OVERLAP) * fps);
  const o = interpolate(f, [0, ov, frames - ov, frames], [first ? 1 : 0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const EM015: React.FC = () => {
  const { scenes, parts, start, speechEnd } = EM015_EPISODE;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        backgroundImage:
          "linear-gradient(rgba(20,33,61,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(20,33,61,0.05) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }}
    >
      <Audio src={staticFile("audio/EM-015-mix.wav")} />
      {scenes.map((s, k) => {
        const Scene = SCENES[s.id];
        // inicio de cada parte de la escena, relativo al inicio de la escena
        const cues = Array.from({ length: s.toPart - s.fromPart + 1 }, (_, i) => start(s.fromPart + i) - s.from);
        return (
          <Sequence key={s.id} from={s.fromFrame} durationInFrames={s.frames} name={s.id}>
            <SceneFrame frames={s.frames} first={k === 0} last={k === scenes.length - 1}>
              <Scene cues={cues} dur={s.frames / fps} />
            </SceneFrame>
          </Sequence>
        );
      })}
      <Sequence durationInFrames={Math.round(3 * fps)} name="brand">
        <BrandIntro duration={3} />
      </Sequence>
      {parts.flatMap((text, i) => {
        // frases largas (varias oraciones por parte) se parten en bloques <=100 caracteres para no desbordar a 3 lineas
        const bits = splitSub(text);
        const t0 = start(i);
        const span = speechEnd(i) + 0.1 - t0;
        let used = 0;
        return bits.map((bit, k) => {
          const from = Math.round((t0 + (span * used) / text.length) * fps);
          used += bit.length + 1;
          const dur = (k === bits.length - 1 ? Math.round((t0 + span) * fps) : Math.round((t0 + (span * used) / text.length) * fps)) - from;
          return (
            <Sequence key={`${i}-${k}`} from={from} durationInFrames={dur} name={`caption-${i}-${k}`}>
              <AnimatedCaption text={bit} durationInFrames={dur} />
            </Sequence>
          );
        });
      })}
    </AbsoluteFill>
  );
};
