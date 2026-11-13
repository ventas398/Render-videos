// Piloto de animacion: parallax 2.5D con capas de profundidad (scripts/depth_layers.py) + zoom dirigido + pulso/brillo en el elemento clave.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const S = 1920, FOCUS = [0.477, 0.69], SHIFT = [0, 4, 9, 15];
const ease = Easing.inOut(Easing.cubic);

export const AnimPilot: React.FC<{ photo?: string }> = ({ photo = "em023-lane-switch" }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const cam = interpolate(t, [0, 7], [-1, 1], { easing: Easing.inOut(Easing.sin) });
  const zoom = 1.1 + 0.3 * interpolate(t, [2.2, 5.2], [0, 1], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 0.5 + 0.5 * Math.sin(t * 5.5);
  const on = interpolate(t, [3.4, 4.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const place = (k: number): React.CSSProperties => ({
    position: "absolute", left: 0, top: 540 - 0.62 * S, width: S, height: S,
    transformOrigin: `${FOCUS[0] * S}px ${FOCUS[1] * S}px`,
    transform: `translateX(${cam * SHIFT[k] * 1.6}px) scale(${1 + (zoom - 1) * (1 + 0.08 * k)})`,
  });
  const fx = FOCUS[0] * S + 70, fy = FOCUS[1] * S + 20;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {[0, 1, 2, 3].map((k) => <Img key={k} src={staticFile(`illustrations/_pilot/${photo}-L${k}.png`)} style={place(k)} />)}
      <div style={place(1)}>
        <div style={{ position: "absolute", left: fx - 520, top: fy - 520, width: 1040, height: 1040, borderRadius: "50%", opacity: on * (0.55 + 0.45 * pulse), background: "radial-gradient(closest-side, rgba(255,214,90,0.55), rgba(255,170,0,0) 100%)", mixBlendMode: "screen" }} />
        <svg width={S} height={S} style={{ position: "absolute", left: 0, top: 0, opacity: on }}>
          <ellipse cx={fx} cy={fy} rx={270 + 14 * pulse} ry={290 + 10 * pulse} fill="none" stroke="#14213D" strokeWidth={22} transform={`rotate(-8 ${fx} ${fy})`} />
          <ellipse cx={fx} cy={fy} rx={270 + 14 * pulse} ry={290 + 10 * pulse} fill="none" stroke="#FFC400" strokeWidth={12} strokeLinecap="round" transform={`rotate(-8 ${fx} ${fy})`} />
        </svg>
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 55%, rgba(0,0,0,0) 55%, rgba(0,0,20,0.5) 100%)" }} />
    </AbsoluteFill>
  );
};
