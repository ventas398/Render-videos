import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { theme } from "../themes/brand";
import { corners, flowLines, Shape, sharpness, toPath } from "../utils/shape";
import { lerp } from "../utils/anim";

/**
 * Diagrama esquematico de flujo de tension alrededor de una abertura (NO es una simulacion).
 * progress 0..1: dibuja las lineas. glass/metal 0..1: resalta el cristal o el metal. flow: lineas en movimiento.
 */
export const TechnicalDiagram: React.FC<{
  shape: Shape;
  title?: string;
  sub?: string;
  progress: number;
  glass?: number;
  metal?: number;
  flow?: boolean;
  width?: number;
  height?: number;
}> = ({
  shape,
  title,
  sub,
  progress,
  glass = 0,
  metal = 0,
  flow = false,
  width = 560,
  height = 600,
}) => {
  const f = useCurrentFrame();
  const cx = width / 2;
  const cy = height / 2 - 10;
  const sharp = sharpness(shape);
  const lines = useMemo(
    () => flowLines(cx, cy, shape, 10, 26),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cx, cy, shape.W, shape.H, shape.R],
  );
  const cs = corners(cx, cy, shape);
  const pulse = 0.8 + 0.2 * Math.sin(f / 5);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <filter
          id={`b-${shape.R}-${width}`}
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <clipPath id={`c-${shape.R}-${width}-${height}`}>
          <rect x={2} y={2} width={width - 4} height={height - 4} rx={36} />
        </clipPath>
      </defs>
      <rect
        x={2}
        y={2}
        width={width - 4}
        height={height - 4}
        rx={36}
        fill={theme.panel}
        stroke={theme.panelLine}
        strokeWidth={3}
      />
      <g clipPath={`url(#c-${shape.R}-${width}-${height})`}>
        {lines.map((l, i) => (
          <path
            key={i}
            d={toPath(l.pts)}
            fill="none"
            stroke={theme.teal}
            strokeWidth={3.5}
            strokeLinecap="round"
            opacity={0.75}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - progress}
          />
        ))}
        {flow &&
          lines.map((l, i) => (
            <path
              key={`f${i}`}
              d={toPath(l.pts)}
              fill="none"
              stroke={theme.ink}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.55}
              strokeDasharray="10 26"
              strokeDashoffset={-f * 1.8}
            />
          ))}
        {lines.map((l, i) =>
          l.hot.map((run, j) => (
            <path
              key={`h${i}-${j}`}
              d={toPath(run)}
              fill="none"
              stroke={theme.orange}
              strokeWidth={6}
              strokeLinecap="round"
              opacity={progress}
            />
          )),
        )}
      </g>
      {/* abertura */}
      <rect
        x={cx - shape.W / 2}
        y={cy - shape.H / 2}
        width={shape.W}
        height={shape.H}
        rx={shape.R}
        fill={theme.bg}
        stroke={theme.ink}
        strokeWidth={4}
      />
      {glass > 0 && (
        <rect
          x={cx - shape.W / 2}
          y={cy - shape.H / 2}
          width={shape.W}
          height={shape.H}
          rx={shape.R}
          fill={theme.teal}
          fillOpacity={0.55 * glass}
          stroke={theme.teal}
          strokeWidth={8}
          strokeOpacity={glass}
        />
      )}
      {metal > 0 && (
        <rect
          x={cx - shape.W / 2 - 46}
          y={cy - shape.H / 2 - 46}
          width={shape.W + 92}
          height={shape.H + 92}
          rx={shape.R + 46}
          fill="none"
          stroke={theme.orange}
          strokeWidth={7}
          strokeDasharray="3 15"
          strokeLinecap="round"
          opacity={metal}
        />
      )}
      {progress > 0.6 &&
        sharp > 0.3 &&
        cs.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={lerp(30, 46, sharp)}
            fill={theme.orange}
            opacity={0.55 * sharp * pulse * Math.min(1, (progress - 0.6) * 4)}
            filter={`url(#b-${shape.R}-${width})`}
          />
        ))}
      {(title || sub) && (
        <rect
          x={4}
          y={height - 96}
          width={width - 8}
          height={92}
          rx={32}
          fill={theme.panel}
        />
      )}
      {title && (
        <text
          x={cx}
          y={height - 54}
          textAnchor="middle"
          fontFamily={theme.font}
          fontWeight={800}
          fontSize={34}
          letterSpacing={2}
          fill={theme.ink}
        >
          {title}
        </text>
      )}
      {sub && (
        <text
          x={cx}
          y={height - 16}
          textAnchor="middle"
          fontFamily={theme.font}
          fontWeight={700}
          fontSize={28}
          fill={sharp > 0.3 ? theme.orange : theme.teal}
        >
          {sub}
        </text>
      )}
    </svg>
  );
};

export const SIMPLIFIED_NOTE = "Simplified illustration, not a simulation";
