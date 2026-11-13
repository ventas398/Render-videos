import React from "react";
import { theme } from "../themes/brand";
import { SIMPLIFIED_NOTE } from "./TechnicalDiagram";

export type BallKind = "football" | "basketball" | "tennis" | "pingpong" | "nfl";

type Layer = { name: string; rFrac: number; fill: string };

// Capas de fuera a dentro, segun docs/EM-041-PELOTAS-FACTS.md pendiente 3 (sin licencias de imagen, vector propio).
const LAYERS: Record<BallKind, Layer[]> = {
  football: [
    { name: "Synthetic panels", rFrac: 1.0, fill: theme.panel },
    { name: "Lining", rFrac: 0.82, fill: theme.ink },
    { name: "Air bladder (latex/butyl)", rFrac: 0.66, fill: theme.teal },
    { name: "Pressurized air", rFrac: 0.4, fill: theme.bg },
  ],
  basketball: [
    { name: "Rubber / composite cover", rFrac: 1.0, fill: theme.panel },
    { name: "Fiber winding", rFrac: 0.8, fill: theme.ink },
    { name: "Rubber bladder", rFrac: 0.64, fill: theme.teal },
    { name: "Pressurized air", rFrac: 0.4, fill: theme.bg },
  ],
  tennis: [
    { name: "Felt", rFrac: 1.0, fill: theme.panel },
    { name: "Rubber core (2 fused halves)", rFrac: 0.84, fill: theme.teal },
    { name: "Pressurized air", rFrac: 0.42, fill: theme.bg },
  ],
  pingpong: [
    { name: "Hollow plastic shell", rFrac: 1.0, fill: theme.panel },
    { name: "Air (not pressurized)", rFrac: 0.78, fill: theme.bg },
  ],
  nfl: [
    { name: "Leather panels", rFrac: 1.0, fill: theme.panel },
    { name: "Lining", rFrac: 0.82, fill: theme.ink },
    { name: "Urethane bladder", rFrac: 0.66, fill: theme.teal },
    { name: "Pressurized air", rFrac: 0.4, fill: theme.bg },
  ],
};

const sectorPath = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} Z`;
};

/** Surface motif outside the cutaway wedge (left 3/4 of the ball), one per ball kind. Decorative only, "Simplified illustration". */
const Surface: React.FC<{ kind: BallKind; cx: number; cy: number; r: number; clip: string }> = ({ kind, cx, cy, r, clip }) => {
  if (kind === "football") {
    const seams = [0, 72, 144, 216, 288].map((deg) => {
      const a = (deg * Math.PI) / 180;
      return `M ${cx} ${cy} L ${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)}`;
    });
    return (
      <g clipPath={clip}>
        {seams.map((d, i) => (
          <path key={i} d={d} stroke={theme.ink} strokeWidth={3} opacity={0.35} />
        ))}
        <circle cx={cx} cy={cy} r={r * 0.42} fill="none" stroke={theme.ink} strokeWidth={3} opacity={0.3} />
      </g>
    );
  }
  if (kind === "basketball") {
    return (
      <g clipPath={clip}>
        <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke={theme.ink} strokeWidth={5} opacity={0.5} />
        <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke={theme.ink} strokeWidth={5} opacity={0.5} />
        <path d={`M ${cx - r} ${cy} Q ${cx} ${cy - r * 0.55} ${cx + r} ${cy}`} fill="none" stroke={theme.ink} strokeWidth={5} opacity={0.5} />
        <path d={`M ${cx - r} ${cy} Q ${cx} ${cy + r * 0.55} ${cx + r} ${cy}`} fill="none" stroke={theme.ink} strokeWidth={5} opacity={0.5} />
      </g>
    );
  }
  if (kind === "tennis") {
    return (
      <g clipPath={clip}>
        <path d={`M ${cx - r} ${cy} Q ${cx - r * 0.25} ${cy - r * 0.8} ${cx} ${cy - r} Q ${cx + r * 0.25} ${cy - r * 0.8} ${cx + r} ${cy}`} fill="none" stroke={theme.ink} strokeWidth={4} opacity={0.4} />
        <path d={`M ${cx - r} ${cy} Q ${cx - r * 0.25} ${cy + r * 0.8} ${cx} ${cy + r} Q ${cx + r * 0.25} ${cy + r * 0.8} ${cx + r} ${cy}`} fill="none" stroke={theme.ink} strokeWidth={4} opacity={0.4} />
        {Array.from({ length: 14 }).map((_, i) => {
          const a = Math.PI * 0.55 + (i / 13) * Math.PI * 0.9;
          return <circle key={i} cx={cx + r * 0.94 * Math.cos(a)} cy={cy + r * 0.94 * Math.sin(a)} r={2.2} fill={theme.ink} opacity={0.3} />;
        })}
      </g>
    );
  }
  if (kind === "nfl") {
    return (
      <g clipPath={clip}>
        <line x1={cx - r * 0.7} y1={cy} x2={cx + r * 0.1} y2={cy} stroke={theme.ink} strokeWidth={3} opacity={0.4} />
        {[-0.45, -0.25, -0.05, 0.15].map((o, i) => (
          <rect key={i} x={cx - r * 0.5 + i * r * 0.22} y={cy - 10} width={r * 0.14} height={20} fill={theme.ink} opacity={0.35} />
        ))}
      </g>
    );
  }
  return null;
};

/**
 * Corte transversal vectorial de una pelota (sin foto, sin licencia): capas de fuera a dentro
 * reveladas en el cuadrante derecho; superficie decorativa en el resto. progress 0..1 anima el despliegue.
 */
export const BallCrossSection: React.FC<{
  kind: BallKind;
  progress: number;
  width?: number;
  height?: number;
  title?: string;
}> = ({ kind, progress, width = 900, height = 900, title }) => {
  const topMargin = 40;
  const bottomMargin = title ? 110 : 60;
  const usableHeight = height - topMargin - bottomMargin;
  const cx = width * 0.32;
  const cy = topMargin + usableHeight / 2;
  const r = Math.min(width * 0.26, usableHeight / 2);
  const layers = LAYERS[kind];
  const wedgeA0 = -Math.PI / 2;
  const wedgeA1 = 0;
  const clipId = `ball-wedge-${kind}`;
  const labelX = cx + r + 50;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <clipPath id={clipId}>
          <path d={sectorPath(cx, cy, r + 2, wedgeA0, wedgeA1)} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={theme.panel} stroke={theme.ink} strokeWidth={4} />
      <Surface kind={kind} cx={cx} cy={cy} r={r} clip={`url(#${clipId})`} />
      {/* wedge cutaway rings, outer to inner, revealed by progress */}
      <g>
        {layers.map((layer, i) => {
          const show = Math.min(1, Math.max(0, progress * layers.length - i));
          if (show <= 0) return null;
          return (
            <path
              key={layer.name}
              d={sectorPath(cx, cy, r * layer.rFrac, wedgeA0, wedgeA1)}
              fill={layer.fill}
              stroke={theme.ink}
              strokeWidth={2.5}
              opacity={show}
            />
          );
        })}
        <path d={sectorPath(cx, cy, r + 2, wedgeA0, wedgeA1)} fill="none" stroke={theme.ink} strokeWidth={4} />
      </g>
      {layers.map((layer, i) => {
        const show = Math.min(1, Math.max(0, progress * layers.length - i));
        if (show <= 0) return null;
        const midR = (r * layer.rFrac + (i === 0 ? r : r * layers[i - 1].rFrac)) / 2;
        const ly = cy - r + 36 + i * 30;
        return (
          <g key={`lbl-${layer.name}`} opacity={show}>
            <line x1={cx + midR * 0.72} y1={cy - midR * 0.72} x2={labelX - 10} y2={ly} stroke={theme.ink} strokeWidth={2} opacity={0.5} />
            <circle cx={labelX - 10} cy={ly} r={6} fill={layer.fill} stroke={theme.ink} strokeWidth={2} />
            <text x={labelX + 6} y={ly + 6} fontFamily={theme.font} fontWeight={700} fontSize={24} fill={theme.ink}>
              {layer.name}
            </text>
          </g>
        );
      })}
      {title && (
        <text x={width / 2} y={height - bottomMargin + 44} textAnchor="middle" fontFamily={theme.font} fontWeight={800} fontSize={32} letterSpacing={1} fill={theme.ink}>
          {title}
        </text>
      )}
      <text x={width / 2} y={height - 20} textAnchor="middle" fontFamily={theme.font} fontWeight={600} fontSize={20} fill={theme.teal}>
        {SIMPLIFIED_NOTE}
      </text>
    </svg>
  );
};
