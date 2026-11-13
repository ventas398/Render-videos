import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BrandIntro } from "../components/BrandIntro";
import ep from "../episodes/EM-023.json";
import timing from "../episodes/EM-023.timing.json";
import { theme, VIDEO } from "../themes/brand";
import { buildEpisode, OVERLAP } from "../utils/timing";
import { PaperBg, Subtitle } from "./kit2";
import { SCENES023 as SCENES } from "./scenes023";

const { fps } = VIDEO;
export const EM023_EPISODE = buildEpisode(ep, timing, fps, 3.0);

const SceneFrame: React.FC<{ frames: number; first: boolean; last: boolean; children: React.ReactNode }> = ({ frames, first, last, children }) => {
  const f = useCurrentFrame();
  const ov = Math.round((last ? 0.6 : OVERLAP) * fps);
  const o = interpolate(f, [0, ov, frames - ov, frames], [first ? 1 : 0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

/** Voz + musica original con ducking ya mezcladas (scripts/em_audio.py mix); los efectos de sonido van en cada escena. */
export const EM023: React.FC = () => {
  const { scenes, parts, start, speechEnd } = EM023_EPISODE;
  return (
    <AbsoluteFill>
      <PaperBg />
      <Audio src={staticFile("audio/EM-023-mix.wav")} />
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
      {parts.map((text, i) => {
        const from = Math.round(start(i) * fps);
        const dur = Math.round((speechEnd(i) + 0.1 - start(i)) * fps);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={`sub-${i}`}>
            <Subtitle text={text} durationInFrames={dur} size={text.length > 105 ? 50 : 60} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

/** Caratula 1280x720: gancho WHY? + la foto del carril cruzando, pegada en el papel. */
export const ThumbEM023: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 35% 40%, #FFFDF8 0%, ${theme.bg} 55%, #EFE6D2 100%)`, fontFamily: theme.font }}>
    <div style={{ position: "absolute", left: 64, top: 70, fontFamily: 'Georgia, Cambria, "Times New Roman", serif', fontWeight: 700, fontSize: 190, lineHeight: 1, color: theme.ink, letterSpacing: -2 }}>
      WHY<span style={{ color: theme.orange }}>?</span>
    </div>
    <div style={{ position: "absolute", left: 76, top: 340, width: 70, height: 6, background: theme.orange }} />
    <div style={{ position: "absolute", left: 76, top: 372, fontWeight: 600, fontSize: 52, letterSpacing: 5, lineHeight: 1.25, color: theme.teal }}>
      <div>A COUNTRY</div>
      <div>SWITCHED SIDES</div>
      <div>OVERNIGHT</div>
    </div>
    <div style={{ position: "absolute", left: 760, top: 60, width: 480, height: 500, padding: 14, background: "#fff", borderRadius: 14, transform: "rotate(3deg)", boxShadow: "8px 12px 0 rgba(58,42,18,0.28)" }}>
      <Img src={staticFile("illustrations/em023-lane-switch.png")} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }} />
    </div>
    <div style={{ position: "absolute", left: 900, top: 540, whiteSpace: "nowrap", transform: "rotate(-5deg)", background: "#FFFDF6", border: `6px solid ${theme.orange}`, borderRadius: 40, padding: "6px 30px", fontWeight: 900, fontSize: 56, color: theme.ink }}>
      3 SEP 1967
    </div>
  </AbsoluteFill>
);
