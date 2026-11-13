import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { theme, VIDEO } from "../themes/brand";
import { OVERLAP } from "../utils/timing";
import { EM008_EPISODE } from "./EM008";
import { SCENES008 } from "./scenes008";

const { fps } = VIDEO;
const LAST_PART = 7; // EM-008: gancho + leyenda, 0 a 46,5 s seguidos
const EP = EM008_EPISODE;
const SPEECH_END = EP.speechEnd(LAST_PART);
const OUTRO_AT = SPEECH_END + 0.3;
const OUTRO_S = 2.4;
export const SHORT_FRAMES = Math.round((OUTRO_AT + OUTRO_S) * fps);

/** Trozos de subtitulo de unas 64 letras como maximo, cortando por frases y comas. */
const chunk = (s: string, max = 64): string[] => {
  const sentences = s.match(/[^.?!]+[.?!]*\s*/g) ?? [s];
  const split = (x: string): string[] => {
    x = x.trim();
    if (x.length <= max) return [x];
    const mid = x.length / 2;
    const cuts = [...x.matchAll(/[,:;] |\s/g)].map((m) => m.index! + (m[0].length > 1 ? 1 : 0)).sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid));
    const c = cuts[0] ?? Math.floor(mid);
    return [...split(x.slice(0, c)), ...split(x.slice(c))];
  };
  return sentences.flatMap(split);
};

const Caption: React.FC<{ text: string; frames: number }> = ({ text, frames }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 5, frames - 4, frames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: 1090,
        height: 330,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        textAlign: "center",
        fontFamily: theme.font,
        fontWeight: 800,
        fontSize: 68,
        lineHeight: 1.18,
        color: theme.ink,
        WebkitTextStroke: `12px ${theme.bg}`,
        paintOrder: "stroke fill",
        opacity: o,
      }}
    >
      <div>{text.split(/(\S+-\S+)/).map((w, i) => (i % 2 ? <span key={i} style={{ whiteSpace: "nowrap" }}>{w}</span> : w))}</div>
    </div>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 12, OUTRO_S * fps - 6, OUTRO_S * fps], [0, 1, 1, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: o, backgroundColor: theme.bg, alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: theme.font }}>
      <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 800, fontSize: 250, color: theme.ink, lineHeight: 1 }}>
        26<span style={{ color: theme.orange }}>.2</span>
      </div>
      <div style={{ fontSize: 56, fontWeight: 700, color: theme.teal, letterSpacing: 6, marginTop: 10 }}>MILES</div>
      <div style={{ fontSize: 84, fontWeight: 800, color: theme.ink, lineHeight: 1.15, margin: "90px 90px 0" }}>
        Do you want to know
        <br />
        the rest?
      </div>
      <div style={{ fontSize: 44, fontWeight: 600, color: theme.orange, marginTop: 50 }}>The full video explains it.</div>
    </AbsoluteFill>
  );
};

export const ShortVertical: React.FC = () => {
  const scenes = EP.scenes.filter((s) => s.toPart <= LAST_PART);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        backgroundImage: "linear-gradient(rgba(20,33,61,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(20,33,61,0.05) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }}
    >
      <Audio src={staticFile("audio/EM-008.wav")} endAt={Math.round((SPEECH_END + 0.4) * fps)} volume={(fr) => interpolate(fr, [(SPEECH_END + 0.05) * fps, (SPEECH_END + 0.4) * fps], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontFamily: theme.font, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: theme.teal }}>THE EVERYDAY MYSTERY</div>
      {/* ventana 1080x756: la escena 16:9 al 0,7 recortada por los lados (x 189-1731 de la escena; ahi cabe todo el contenido) */}
      <div style={{ position: "absolute", top: 200, left: 0, width: 1080, height: 756, overflow: "hidden" }}>
        {scenes.map((s, k) => {
          const Scene = SCENES008[s.id];
          const cues = Array.from({ length: s.toPart - s.fromPart + 1 }, (_, i) => EP.start(s.fromPart + i) - s.from);
          return (
            <Sequence key={s.id} from={s.fromFrame} durationInFrames={s.frames} name={s.id}>
              <Fade frames={s.frames} first={k === 0}>
                <div style={{ position: "absolute", left: -132, top: 0, width: 1920, height: 1080, transform: `scale(0.7)`, transformOrigin: "0 0" }}>
                  <Scene cues={cues} dur={s.frames / fps} />
                </div>
              </Fade>
            </Sequence>
          );
        })}
      </div>
      {EP.parts.slice(0, LAST_PART + 1).flatMap((text, i) => {
        const a = EP.start(i);
        const b = EP.speechEnd(i) + (i === LAST_PART ? 0.05 : 0.1);
        const ch = chunk(text);
        const total = ch.reduce((n, c) => n + c.length, 0);
        let acc = 0;
        return ch.map((c, j) => {
          const from = Math.round((a + ((b - a) * acc) / total) * fps);
          acc += c.length;
          const to = Math.round((a + ((b - a) * acc) / total) * fps);
          return (
            <Sequence key={`${i}-${j}`} from={from} durationInFrames={Math.max(to - from, 6)} name={`cap-${i}-${j}`}>
              <Caption text={c} frames={Math.max(to - from, 6)} />
            </Sequence>
          );
        });
      })}
      <Sequence from={Math.round(OUTRO_AT * fps)} durationInFrames={Math.round(OUTRO_S * fps)} name="outro">
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};

const Fade: React.FC<{ frames: number; first: boolean; children: React.ReactNode }> = ({ frames, first, children }) => {
  const f = useCurrentFrame();
  const ov = Math.round(OVERLAP * fps);
  const o = interpolate(f, [0, ov, frames - ov, frames], [first ? 1 : 0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
