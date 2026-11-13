import React from "react";
import { useCurrentFrame } from "remotion";
import { theme, VIDEO } from "../themes/brand";
import { fade, ramp } from "../utils/anim";

/** Sello de canal: marca + linea que se dibuja. Esquina superior izquierda, se retira solo. */
export const BrandIntro: React.FC<{ duration?: number; light?: boolean }> = ({ duration = 3, light = false }) => {
  const t = useCurrentFrame() / VIDEO.fps;
  const o = fade(t, 0.2, 0.8, duration - 0.6, duration);
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 72, top: 56, opacity: o, fontFamily: theme.font }}>
      <div style={{ color: light ? theme.bg : theme.ink, fontWeight: 800, fontSize: 30, letterSpacing: 9, textShadow: light ? "0 0 6px #14213DCC, 0 2px 4px #14213D" : undefined }}>THE EVERYDAY MYSTERY</div>
      <div style={{ height: 4, marginTop: 12, width: 420 * ramp(t, 0.3, 1.3), background: theme.teal, borderRadius: 2 }} />
    </div>
  );
};
