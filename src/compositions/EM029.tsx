import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import ep from "../episodes/EM-029.json";
import timing from "../episodes/EM-029.timing.json";
import { theme, VIDEO } from "../themes/brand";
import { fade } from "../utils/anim";
import { buildEpisode, OVERLAP } from "../utils/timing";
import { PaperBg, Subtitle } from "./kit2";
import { SCENES029 as SCENES } from "./scenes029";

const { fps } = VIDEO;
export const EM029_EPISODE = buildEpisode(ep, timing, fps);

const SceneFrame: React.FC<{ frames: number; first: boolean; last: boolean; children: React.ReactNode }> = ({ frames, first, last, children }) => {
  const f = useCurrentFrame();
  const ov = Math.round((last ? 0.6 : OVERLAP) * fps);
  const o = interpolate(f, [0, ov, frames - ov, frames], [first ? 1 : 0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

/** Sello de canal con fondo de tarjeta para que se lea sobre cualquier foto. */
const Intro: React.FC = () => {
  const t = useCurrentFrame() / fps;
  const o = fade(t, 0.2, 0.7, 2.4, 3);
  return (
    <div style={{ position: "absolute", left: 60, top: 48, opacity: o, fontFamily: theme.font, background: "#FFFDF6", border: `5px solid ${theme.teal}`, borderRadius: 22, padding: "12px 28px", boxShadow: "6px 8px 0 rgba(58,42,18,0.25)" }}>
      <div style={{ color: theme.ink, fontWeight: 800, fontSize: 32, letterSpacing: 8 }}>THE EVERYDAY MYSTERY</div>
    </div>
  );
};

/** Voz + musica original con ducking ya mezcladas (scripts/em_audio.py mix); los efectos van en cada escena. */
export const EM029: React.FC = () => {
  const { scenes, parts, start, speechEnd } = EM029_EPISODE;
  return (
    <AbsoluteFill>
      <PaperBg />
      <Audio src={staticFile("audio/EM-029-mix.wav")} />
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
        <Intro />
      </Sequence>
      {parts.map((text, i) => {
        const from = Math.round(start(i) * fps);
        const dur = Math.round((speechEnd(i) + 0.1 - start(i)) * fps);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={`sub-${i}`}>
            <Subtitle text={text} durationInFrames={dur} size={60} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
