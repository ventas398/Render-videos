import React from "react";
import { useCurrentFrame } from "remotion";
import { theme, VIDEO } from "../themes/brand";
import { corners, Shape } from "../utils/shape";
import { fade, lerp, ramp } from "../utils/anim";

const SQUARE: Shape = { W: 300, H: 300, R: 4 };
const OVAL: Shape = { W: 250, H: 340, R: 125 };

const Opening: React.FC<{
  cx: number;
  cy: number;
  shape: Shape;
  color: string;
  draw: number;
  label: string;
  scale: number;
  dim: number;
  markers: boolean;
  t: number;
}> = ({ cx, cy, shape, color, draw, label, scale, dim, markers, t }) => (
  <g opacity={dim} transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}>
    <rect x={cx - 290} y={cy - 280} width={580} height={560} rx={40} fill={theme.panel} stroke={theme.panelLine} strokeWidth={3} />
    <rect
      x={cx - shape.W / 2}
      y={cy - shape.H / 2}
      width={shape.W}
      height={shape.H}
      rx={shape.R}
      fill={color}
      fillOpacity={0.1 * draw}
      stroke={color}
      strokeWidth={8}
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - draw}
    />
    {markers &&
      corners(cx, cy, shape).map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r={12 + 4 * Math.sin(t * 6 + i)} fill={theme.orange} opacity={ramp(t, 1.2, 1.7)} />
      ))}
    <text x={cx} y={cy + 330} textAnchor="middle" fontFamily={theme.font} fontWeight={800} fontSize={34} letterSpacing={3} fill={color}>
      {label}
    </text>
  </g>
);

/** Abertura cuadrada frente a abertura ovalada. `focusAt` (s): la cuadrada se apaga y la ovalada gana protagonismo. */
export const ShapeComparison: React.FC<{ focusAt?: number }> = ({ focusAt = 3.4 }) => {
  const t = useCurrentFrame() / VIDEO.fps;
  const focus = ramp(t, focusAt, focusAt + 0.9);
  return (
    <svg width={VIDEO.width} height={780} viewBox={`0 0 ${VIDEO.width} 780`} style={{ position: "absolute", left: 0, top: 0 }}>
      <Opening
        cx={560}
        cy={400}
        shape={SQUARE}
        color={theme.orange}
        draw={ramp(t, 0.3, 1.4)}
        label="SHARP CORNERS"
        scale={lerp(1, 0.9, focus)}
        dim={lerp(1, 0.3, focus)}
        markers
        t={t}
      />
      <Opening
        cx={1360}
        cy={400}
        shape={OVAL}
        color={theme.teal}
        draw={ramp(t, 1.8, 3.0)}
        label="NO SHARP CORNERS"
        scale={lerp(1, 1.08, focus)}
        dim={1}
        markers={false}
        t={t}
      />
      <circle cx={1360} cy={400} r={250 + 10 * Math.sin(t * 4)} fill="none" stroke={theme.teal} strokeWidth={4} opacity={0.5 * fade(t, focusAt, focusAt + 0.6, 99, 100)} />
    </svg>
  );
};
