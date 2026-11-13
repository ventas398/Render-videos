import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BrandIntro } from "../components/BrandIntro";
import ep from "../episodes/EM-004.json";
import timing from "../episodes/EM-004.timing.json";
import { VIDEO } from "../themes/brand";
import { buildEpisode, OVERLAP } from "../utils/timing";
import { PaperBg } from "./kit2";
import { ink } from "./kit";
import { theme } from "../themes/brand";
import { SCENES004V2 as SCENES } from "./scenes004v2";

const { fps } = VIDEO;
export const EM004V2_EPISODE = buildEpisode(ep, timing, fps);

const SceneFrame: React.FC<{ frames: number; first: boolean; last: boolean; children: React.ReactNode }> = ({ frames, first, last, children }) => {
  const f = useCurrentFrame();
  const ov = Math.round((last ? 0.6 : OVERLAP) * fps);
  const o = interpolate(f, [0, ov, frames - ov, frames], [first ? 1 : 0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

/** Voz + musica original con ducking ya mezcladas (scripts/em_audio.py mix); los efectos de sonido van en cada escena. */
export const EM004v2: React.FC = () => {
  const { scenes, parts, start, speechEnd } = EM004V2_EPISODE;
  return (
    <AbsoluteFill>
      <PaperBg />
      <Audio src={staticFile("audio/EM-004-mix.wav")} />
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
        <BrandIntro duration={3} light />
      </Sequence>
      {parts.map((text, i) => {
        const from = Math.round(start(i) * fps);
        const dur = Math.round((speechEnd(i) + 0.1 - start(i)) * fps);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={`sub-${i}`}>
            <Sub text={text} frames={dur} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};


/** Subtitulo de EM-004 v2: mas grande y con banda de papel para leerse sobre foto. */
const Sub: React.FC<{ text: string; frames: number }> = ({ text, frames }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 6, frames - 6, frames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 150, right: 150, bottom: 26, textAlign: "center", opacity: o }}>
      <span style={{ display: "inline-block", maxWidth: 1620, padding: "8px 28px", borderRadius: 24, background: "rgba(247,243,234,0.94)", boxShadow: "0 4px 14px rgba(20,33,61,0.35)", fontFamily: theme.font, fontWeight: 700, fontSize: 38, lineHeight: 1.22, color: ink, textWrap: "balance" }}>{text}</span>
    </div>
  );
};
