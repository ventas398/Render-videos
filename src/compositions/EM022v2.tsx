import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BrandIntro } from "../components/BrandIntro";
import ep from "../episodes/EM-022.json";
import timing from "../episodes/EM-022.timing.json";
import { VIDEO } from "../themes/brand";
import { buildEpisode, OVERLAP } from "../utils/timing";
import { PaperBg } from "./kit2";
import { subCues } from "./v2";
import { SCENES022V2 as SCENES } from "./scenes022v2";

const { fps } = VIDEO;
export const EM022V2_EPISODE = buildEpisode(ep, timing, fps, 3.0);

const SceneFrame: React.FC<{ frames: number; first: boolean; last: boolean; children: React.ReactNode }> = ({ frames, first, last, children }) => {
  const f = useCurrentFrame();
  const ov = Math.round((last ? 0.6 : OVERLAP) * fps);
  const o = interpolate(f, [0, ov, frames - ov, frames], [first ? 1 : 0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

/** Voz + musica original con ducking ya mezcladas (scripts/em_audio.py mix); los efectos de sonido van en cada escena. */
export const EM022v2: React.FC = () => {
  const { scenes, start } = EM022V2_EPISODE;
  return (
    <AbsoluteFill>
      <PaperBg />
      <Audio src={staticFile("audio/EM-022-mix.wav")} />
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
      <Sequence durationInFrames={Math.round(3 * fps)} name="brand">
        <BrandIntro duration={3} />
      </Sequence>
      {subCues(EM022V2_EPISODE, fps)}
    </AbsoluteFill>
  );
};

