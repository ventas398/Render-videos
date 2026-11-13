import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BrandIntro } from "../components/BrandIntro";
import ep from "../episodes/EM-021.json";
import timing from "../episodes/EM-021.timing.json";
import { VIDEO } from "../themes/brand";
import { buildEpisode, OVERLAP } from "../utils/timing";
import { BoilDefs, PaperBg, Subtitle, Tracker } from "./kit2";
import { SvgFrame } from "./kit";
import { SCENES021V2 as SCENES } from "./scenes021v2";

const { fps } = VIDEO;
export const EM021V2_EPISODE = buildEpisode(ep, timing, fps);

/** Capitulo por parte global: 3-5 origen, 6-14 retraso, 15-20 retumbo, 21-25 distancia; fuera de ahi, oculto. */
const CHAPTERS = [3, 6, 15, 21, 26];
const ITEMS = ["Where from?", "Why late?", "Why rumble?", "How far?"];

const SceneFrame: React.FC<{ frames: number; first: boolean; last: boolean; children: React.ReactNode }> = ({ frames, first, last, children }) => {
  const f = useCurrentFrame();
  const ov = Math.round((last ? 0.6 : OVERLAP) * fps);
  const o = interpolate(f, [0, ov, frames - ov, frames], [first ? 1 : 0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o, filter: "url(#boil)" }}>{children}</AbsoluteFill>;
};

const GlobalTracker: React.FC = () => {
  const f = useCurrentFrame();
  const { start } = EM021V2_EPISODE;
  const s = (p: number) => Math.round(start(p) * fps);
  const fa = 8;
  const active = CHAPTERS.findIndex((p, i) => i < 4 && f >= s(p) && f < s(CHAPTERS[i + 1]));
  const show = active < 0 ? 0 : interpolate(f, [s(CHAPTERS[active]), s(CHAPTERS[active]) + fa, s(CHAPTERS[active + 1]) - fa, s(CHAPTERS[active + 1])], [0, 1, 1, active === 3 ? 0 : 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <SvgFrame>
      <Tracker items={ITEMS} active={active} show={show} />
    </SvgFrame>
  );
};

export const EM021V2: React.FC = () => {
  const { scenes, parts, start, speechEnd } = EM021V2_EPISODE;
  return (
    <AbsoluteFill>
      <PaperBg />
      <BoilDefs />
      <Audio src={staticFile("audio/EM-021.wav")} />
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
      <GlobalTracker />
      <Sequence durationInFrames={Math.round(3 * fps)} name="brand">
        <BrandIntro duration={3} />
      </Sequence>
      {parts.map((text, i) => {
        const from = Math.round(start(i) * fps);
        const dur = Math.round((speechEnd(i) + 0.1 - start(i)) * fps);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={`sub-${i}`}>
            <Subtitle text={text} durationInFrames={dur} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
