import React from "react";
import { useCurrentFrame } from "remotion";
import { VIDEO } from "../themes/brand";
import { lerp, ramp } from "../utils/anim";

/** Entrada suave (fundido + subida + desenfoque) de cualquier contenido HTML. */
export const ObjectReveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  scale?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, duration = 0.8, y = 24, scale = 0.96, style }) => {
  const t = useCurrentFrame() / VIDEO.fps;
  const p = ramp(t, delay, delay + duration);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * y}px) scale(${lerp(scale, 1, p)})`,
        filter: `blur(${(1 - p) * 8}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
