import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BallCrossSection, BallKind } from "../components/BallCrossSection";
import { VIDEO, theme } from "../themes/brand";

const KINDS: { kind: BallKind; title: string }[] = [
  { kind: "football", title: "FUTBOL" },
  { kind: "basketball", title: "BALONCESTO" },
  { kind: "tennis", title: "TENIS" },
  { kind: "pingpong", title: "PING PONG" },
  { kind: "nfl", title: "FUTBOL AMERICANO" },
];

/** Dev-only: previsualiza los 5 cortes transversales de EM-041. Verificacion con `npx remotion still`, no forma parte del episodio. */
export const BallPilot: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, frame / (VIDEO.fps * 1.5));
  return (
    <AbsoluteFill style={{ background: theme.bg, display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start" }}>
      {KINDS.map(({ kind, title }) => (
        <BallCrossSection key={kind} kind={kind} progress={progress} width={900} height={540} title={title} />
      ))}
    </AbsoluteFill>
  );
};
