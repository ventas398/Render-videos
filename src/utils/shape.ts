// Geometria de la ventanilla y lineas de flujo de tension (esquema, no simulacion).
export type Shape = { W: number; H: number; R: number };

import { lerp } from "./anim";
export const clamp01 = (x: number): number => Math.min(1, Math.max(0, x));

/** m = 0 -> casi cuadrada con esquinas redondeadas (estilo 1950s); m = 1 -> ovalada. */
export const shapeAt = (m: number): Shape => ({
  W: lerp(330, 300, m),
  H: lerp(290, 380, m),
  R: lerp(26, 140, m),
});

/** Punto a 45 grados del arco de la esquina superior derecha. */
export const topRightCorner = (cx: number, cy: number, s: Shape): { x: number; y: number } => {
  const ax = cx + s.W / 2 - s.R;
  const ay = cy - s.H / 2 + s.R;
  return { x: ax + s.R * Math.SQRT1_2, y: ay - s.R * Math.SQRT1_2 };
};

/** Los cuatro centros de arco de esquina (para los brillos de tension). */
export const corners = (cx: number, cy: number, s: Shape): { x: number; y: number }[] => {
  const out: { x: number; y: number }[] = [];
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      const ax = cx + sx * (s.W / 2 - s.R);
      const ay = cy + sy * (s.H / 2 - s.R);
      out.push({ x: ax + sx * s.R * Math.SQRT1_2, y: ay + sy * s.R * Math.SQRT1_2 });
    }
  }
  return out;
};

/** 0 (esquina muy redondeada) .. 1 (esquina casi viva). */
export const sharpness = (s: Shape): number => clamp01(1 - (s.R - 20) / 120);

/** Semiancho del hueco a la altura dy (desde el centro), con zona de aproximacion suave. */
export const halfWidthAt = (dy: number, s: Shape): number => {
  const ady = Math.abs(dy);
  const hh = s.H / 2;
  const k = hh - s.R;
  if (ady <= k) return s.W / 2;
  if (ady <= hh) return s.W / 2 - s.R + Math.sqrt(Math.max(0, s.R * s.R - (ady - k) * (ady - k)));
  const ramp = 30 + s.R * 0.8;
  const top = s.W / 2 - s.R + 0.001;
  const u = clamp01((ady - hh) / ramp);
  return top * (1 - u) * (1 - u);
};

export type FlowLine = { pts: [number, number][]; hot: [number, number][][] };

/** Lineas de flujo de tension (esquema, no simulacion). Tension vertical que rodea el hueco. */
export const flowLines = (cx: number, cy: number, s: Shape, count: number, spacing: number): FlowLine[] => {
  const lines: FlowLine[] = [];
  const sharp = sharpness(s);
  const cs = corners(cx, cy, s);
  const reach = s.H / 2 + 30 + s.R * 0.8 + 90;
  for (let i = -count; i < count; i++) {
    const x0 = (i + 0.5) * spacing;
    const sign = x0 < 0 ? -1 : 1;
    const pts: [number, number][] = [];
    const hot: [number, number][][] = [];
    let run: [number, number][] = [];
    for (let y = -reach; y <= reach; y += 5) {
      const h = halfWidthAt(y, s);
      const x = sign * Math.sqrt(x0 * x0 + h * h);
      const p: [number, number] = [cx + x, cy + y];
      pts.push(p);
      let heat = 0;
      for (const c of cs) {
        const d = Math.hypot(p[0] - c.x, p[1] - c.y);
        heat = Math.max(heat, Math.exp(-(d * d) / (55 * 55)));
      }
      if (heat * sharp > 0.35) run.push(p);
      else if (run.length) {
        hot.push(run);
        run = [];
      }
    }
    if (run.length) hot.push(run);
    lines.push({ pts, hot });
  }
  return lines;
};

export const toPath = (pts: [number, number][]): string =>
  pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
