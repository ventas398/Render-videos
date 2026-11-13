import React from "react";
import { useCurrentFrame } from "remotion";
import { theme, VIDEO } from "../themes/brand";
import { ramp } from "../utils/anim";

/** Linea de tiempo horizontal con un hito resaltado. ticks: etiquetas equiespaciadas. */
export const Timeline: React.FC<{ ticks: string[]; highlight: number; delay?: number; width?: number }> = ({
  ticks,
  highlight,
  delay = 0,
  width = 1300,
}) => {
  const t = useCurrentFrame() / VIDEO.fps;
  const line = ramp(t, delay, delay + 1.0);
  const mark = ramp(t, delay + 0.9, delay + 1.5);
  const x = (i: number): number => 60 + ((width - 120) * i) / (ticks.length - 1);
  return (
    <svg width={width} height={130} viewBox={`0 0 ${width} 130`}>
      <line x1={60} y1={60} x2={60 + (width - 120) * line} y2={60} stroke={theme.panelLine} strokeWidth={6} strokeLinecap="round" />
      {ticks.map((label, i) => {
        const on = i === highlight;
        const p = ramp(t, delay + 0.2 + i * 0.1, delay + 0.7 + i * 0.1);
        return (
          <g key={label} opacity={p}>
            <circle cx={x(i)} cy={60} r={on ? 12 + 8 * mark : 9} fill={on ? theme.orange : theme.panelLine} />
            <text
              x={x(i)}
              y={on ? 118 : 108}
              textAnchor="middle"
              fontFamily={theme.font}
              fontWeight={on ? 800 : 600}
              fontSize={on ? 40 : 30}
              fill={on ? theme.orange : theme.ink}
              opacity={on ? 1 : 0.7}
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
