import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import ep from "../episodes/EM-025.json";
import timing from "../episodes/EM-025.timing.json";
import { theme, VIDEO } from "../themes/brand";
import { fade, ramp } from "../utils/anim";
import { buildEpisode, OVERLAP } from "../utils/timing";
import { PaperBg, Subtitle } from "./kit2";
import { SCENES025 as SCENES } from "./scenes025";

const { fps } = VIDEO;
const END = 3.9; // s de pantalla final
export const EM025_EPISODE = buildEpisode(ep, timing, fps, 4.7);

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

/** Pantalla final: ultima foto con velo azul tinta, cierre hablado, marca y eslogan. */
const EndCard: React.FC = () => {
  const t = useCurrentFrame() / fps;
  const tx: React.CSSProperties = { position: "absolute", width: "100%", textAlign: "center", fontFamily: theme.font, color: "#fff", textShadow: "0 3px 14px rgba(0,0,0,.6)" };
  return (
    <AbsoluteFill style={{ opacity: ramp(t, 0, 0.3) }}>
      <Img src={staticFile("illustrations/em025-wallet.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ background: "rgba(20,33,61,.68)" }} />
      <div style={{ ...tx, top: 270, fontSize: 84, fontWeight: 900 }}>ONE MORE QUESTION.</div>
      <div style={{ ...tx, top: 380, fontSize: 84, fontWeight: 900, color: "#FFC400" }}>WHY IS THE DOLLAR GREEN?</div>
      <div style={{ position: "absolute", left: 860, top: 530, width: 200, height: 8, background: theme.orange }} />
      <div style={{ ...tx, top: 600, fontSize: 48, fontWeight: 800, letterSpacing: 10 }}>THE EVERYDAY MYSTERY</div>
      <div style={{ ...tx, top: 690, fontSize: 40, fontWeight: 500, fontStyle: "italic" }}>Look again at what you stopped seeing.</div>
      <div style={{ position: "absolute", right: 36, top: 828, background: "rgba(255,253,246,.92)", border: "2px solid rgba(20,33,61,.5)", borderRadius: 22, padding: "7px 22px", fontFamily: theme.font, fontWeight: 700, fontSize: 24, color: theme.ink }}>Illustrative image</div>
    </AbsoluteFill>
  );
};

/** Voz + musica original con ducking ya mezcladas (scripts/em_audio.py mix); los efectos van en cada escena. */
export const EM025: React.FC = () => {
  const { scenes, parts, start, speechEnd } = EM025_EPISODE;
  return (
    <AbsoluteFill>
      <PaperBg />
      <Audio src={staticFile("audio/EM-025-mix.wav")} />
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
      <Sequence from={EM025_EPISODE.totalFrames - Math.round(END * fps)} name="end-card">
        <EndCard />
      </Sequence>
      <Sequence durationInFrames={Math.round(3 * fps)} name="brand">
        <Intro />
      </Sequence>
      {parts.map((text, i) => {
        const from = Math.round(start(i) * fps);
        const dur = Math.round((speechEnd(i) + 0.1 - start(i)) * fps);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={`sub-${i}`}>
            <Subtitle text={text} durationInFrames={dur} size={48} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
