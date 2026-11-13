import React from "react";
import { useCurrentFrame } from "remotion";
import { SIMPLIFIED_NOTE } from "../components/TechnicalDiagram";
import { Card, Chip, Note, vis } from "../components/ui";
import { theme, VIDEO } from "../themes/brand";
import { fade, lerp, ramp } from "../utils/anim";
import type { SceneProps } from "./scenes";

const { width: W, height: H, fps: FPS } = VIDEO;
const useT = (): number => useCurrentFrame() / FPS;

/** Chip visible durante las partes k..k2 de la escena, sin solaparse con el siguiente (entra 0.1 s tras el inicio, sale 0.4 s antes del fin). */
const seg = (t: number, c: number[], k: number, k2 = k): number => vis(t, c[k] + 0.1, c[k2 + 1] === undefined ? 1e6 : c[k2 + 1] - 0.4);

// ---------------------------------------------------------------- seccion de la ventanilla (esquema simplificado, fuera de escala)
const XI = 700; // x de cada capa: interior, media, exterior
const XM = 920;
const XO = 1140;
const TH = [26, 40, 52] as const;
const XS = [XI, XM, XO] as const;
const PT = 150;
const PB = 640;
const HOLE_Y = 565;
const HOLE_H = 20;
const PANE_FILL = ["#D5E0EA", "#B3C6D8", "#8EA9C3"] as const;

type Tri = [number, number, number];

const Section: React.FC<{
  dx?: number;
  e?: Tri;
  glow?: Tri;
  gap1?: number;
  gap2?: number;
  hole?: number;
  crack?: number;
  children?: React.ReactNode;
}> = ({ dx = 0, e = [1, 1, 1], glow = [0, 0, 0], gap1 = 0, gap2 = 0, hole = 1, crack = 0, children }) => {
  const hh = HOLE_H * hole;
  const pane = (i: number, y: number, h: number, key: string) => (
    <rect key={key} x={XS[i]} y={y} width={TH[i]} height={h} rx={5} fill={PANE_FILL[i]} stroke={theme.ink} strokeWidth={3} />
  );
  return (
    <g transform={`translate(${dx} 0)`}>
      <rect x={XI - 470} y={PT} width={470} height={PB - PT} fill={theme.teal} opacity={0.07} />
      <rect x={XO + TH[2]} y={PT} width={470} height={PB - PT} fill={theme.ink} opacity={0.05} />
      <rect x={XI + TH[0]} y={PT} width={XM - XI - TH[0]} height={PB - PT} fill={theme.orange} opacity={0.2 * gap1} />
      <rect x={XM + TH[1]} y={PT} width={XO - XM - TH[1]} height={PB - PT} fill={theme.orange} opacity={0.2 * gap2} />
      {[0, 1, 2].map((i) => (
        <g key={i} opacity={e[i]} transform={`translate(0 ${-50 * (1 - e[i])})`}>
          {glow[i] > 0 && (
            <rect x={XS[i] - 10} y={PT - 10} width={TH[i] + 20} height={PB - PT + 20} rx={12} fill="none" stroke={theme.teal} strokeWidth={8} opacity={glow[i]} />
          )}
          {i === 1 && hh > 0.5 ? (
            <>
              {pane(1, PT, HOLE_Y - hh / 2 - PT, "a")}
              {pane(1, HOLE_Y + hh / 2, PB - HOLE_Y - hh / 2, "b")}
            </>
          ) : (
            pane(i, PT, PB - PT, "p")
          )}
        </g>
      ))}
      {crack > 0 && (
        <polyline
          points={`${XO + 4},300 ${XO + 40},340 ${XO + 12},385 ${XO + 46},430 ${XO + 16},480`}
          fill="none"
          stroke={theme.orange}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - crack}
        />
      )}
      {children}
    </g>
  );
};

const Arrows: React.FC<{ x: number; len: number; o: number; color?: string; ys?: number[]; sw?: number }> = ({
  x,
  len,
  o,
  color = theme.orange,
  ys = [220, 320, 420, 520],
  sw = 9,
}) => (
  <g opacity={o}>
    {ys.map((y) => (
      <g key={y}>
        <line x1={x} y1={y} x2={x + len} y2={y} stroke={color} strokeWidth={sw} strokeLinecap="round" />
        <polygon points={`${x + len},${y - 2 * sw} ${x + len},${y + 2 * sw} ${x + len + 3.2 * sw},${y}`} fill={color} />
      </g>
    ))}
  </g>
);

/** Puntos pseudoaleatorios deterministas (aire). */
const mkDots = (n: number, x0: number, x1: number, seed: number) =>
  Array.from({ length: n }, (_, i) => {
    const r = (k: number) => {
      const v = Math.sin((i + 1) * 12.9898 * k + seed) * 43758.5453;
      return v - Math.floor(v);
    };
    return { x: lerp(x0, x1, r(1)), y: lerp(PT + 20, PB - 20, r(2)) };
  });
const DOTS_CABIN = mkDots(64, XI - 440, XI - 20, 1);
const DOTS_SKY = mkDots(8, XO + TH[2] + 30, XO + TH[2] + 440, 2);
const DOTS_GAP2 = mkDots(26, XM + TH[1] + 14, XO - 14, 3);

const Dots: React.FC<{ pts: { x: number; y: number }[]; t: number; o: number; color: string; r?: number }> = ({ pts, t, o, color, r = 5 }) => (
  <g opacity={o}>
    {pts.map((d, i) => (
      <circle key={i} cx={d.x + 4 * Math.sin(t * 1.8 + i)} cy={d.y + 4 * Math.cos(t * 1.5 + i)} r={r} fill={color} />
    ))}
  </g>
);

const SvgFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    {children}
  </svg>
);

// ---------------------------------------------------------------- 1: gancho, la ventanilla y su agujero
const HX = 960;
const HY = 548;

const WindowFace: React.FC = () => (
  <>
    <defs>
      <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#BFE0F0" />
        <stop offset="1" stopColor="#F4FAFD" />
      </linearGradient>
    </defs>
    <rect x={560} y={110} width={800} height={600} rx={70} fill="#EFE8D6" stroke={theme.panelLine} strokeWidth={4} />
    <rect x={800} y={190} width={320} height={420} rx={160} fill="#FFFFFF" stroke={theme.ink} strokeWidth={10} />
    <rect x={822} y={212} width={276} height={376} rx={138} fill="url(#skyG)" stroke={theme.ink} strokeWidth={4} />
    <circle cx={HX} cy={HY} r={4.5} fill={theme.ink} />
    <circle cx={HX - 1.4} cy={HY - 1.4} r={1.3} fill="#FFFFFF" opacity={0.8} />
  </>
);

export const SceneHoleHook: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const zr = ramp(t, c[1] + 0.3, c[1] + 3.4);
  const z = 1 + 5 * zr;
  const ring = fade(t, c[2] - 0.2, c[2] + 0.4, 1e6, 1e6 + 1);
  const pulse = 1 + 0.18 * Math.sin(t * 5);
  return (
    <>
      <SvgFrame>
        <g transform={`translate(${HX} ${lerp(HY, 400, zr)}) scale(${z}) translate(${-HX} ${-HY})`}>
          <WindowFace />
          <circle cx={HX} cy={HY} r={17 * pulse} fill="none" stroke={theme.orange} strokeWidth={4} opacity={ring} style={{ vectorEffect: "non-scaling-stroke" }} />
        </g>
      </SvgFrame>
      <Chip text="LOOK CLOSER" x={960} y={50} o={vis(t, 0.5, c[1])} />
      <Chip text="A TINY HOLE" x={960} y={50} o={seg(t, c, 1)} />
      <Chip text="A MISTAKE?" x={960} y={50} o={seg(t, c, 2)} color={theme.orange} />
      <Chip text="IT'S ON PURPOSE" x={960} y={50} o={seg(t, c, 3)} color={theme.orange} />
      <Chip text="STRENGTH" x={700} y={50} o={vis(t, c[4] + 0.8)} />
      <Chip text="A CLEAR VIEW" x={1230} y={50} o={vis(t, c[4] + 2.0)} />
    </>
  );
};

// ---------------------------------------------------------------- 2: las tres capas
export const SceneThreePanes: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const e: Tri = [ramp(t, c[1], c[1] + 0.9), ramp(t, c[1] + 0.8, c[1] + 1.7), ramp(t, c[1] + 1.6, c[1] + 2.5)];
  const g = (a: number, b: number) => fade(t, a, a + 0.5, b, b + 0.5);
  const glow: Tri = [g(c[2] + 1.5, c[3] - 0.2), g(c[3] + 0.3, c[3] + 2.2), g(c[3] + 2.3, 1e6)];
  return (
    <>
      <SvgFrame>
        <Section e={e} glow={glow} hole={0} />
      </SvgFrame>
      <Chip text="NOT ONE PIECE OF GLASS" x={960} y={50} o={vis(t, 0.4, c[1] - 0.4)} color={theme.orange} />
      <Chip text="THREE LAYERS OF ACRYLIC" x={960} y={50} o={seg(t, c, 1)} />
      <Chip text="CABIN" x={XI - 235} y={96} o={vis(t, c[1] + 2.5)} />
      <Chip text="SKY" x={XO + TH[2] + 235} y={96} o={vis(t, c[1] + 2.5)} />
      <Chip text="INNER" x={XI + TH[0] / 2} y={665} o={vis(t, c[2] + 0.3)} />
      <Note text="scratch pane, not structural" x={XI + TH[0] / 2} y={735} o={vis(t, c[2] + 0.8)} size={26} />
      <Chip text="MIDDLE" x={XM + TH[1] / 2} y={665} o={vis(t, c[3] + 0.3)} />
      <Chip text="OUTER" x={XO + TH[2] / 2} y={665} o={vis(t, c[3] + 2.3)} />
      <Note text={SIMPLIFIED_NOTE} x={960} y={768} o={0.6 * vis(t, c[1] + 2.8)} size={24} />
    </>
  );
};

// ---------------------------------------------------------------- 3: la presion empuja hacia fuera
export const ScenePushOutward: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const push = vis(t, c[1] + 0.1);
  const len = 150 + 45 * Math.sin(t * 3);
  const outer = fade(t, c[3] + 0.2, c[3] + 0.8, 1e6, 1e6 + 1);
  return (
    <>
      <SvgFrame>
        <Section hole={0} glow={[0, 0, outer]}>
          <Dots pts={DOTS_CABIN} t={t} o={ramp(t, 0.3, 1.0)} color={theme.teal} />
          <Dots pts={DOTS_SKY} t={t} o={ramp(t, 0.3, 1.0)} color={theme.ink} />
          <Arrows x={XI - 360} len={len} o={push} />
        </Section>
      </SvgFrame>
      <Chip text="CABIN: DENSE AIR" x={XI - 235} y={96} o={seg(t, c, 0)} />
      <Chip text="OUTSIDE: THIN AIR" x={XO + TH[2] + 235} y={96} o={seg(t, c, 0)} color={theme.ink} />
      <Chip text="PUSHING OUTWARD" x={XI - 235} y={96} o={seg(t, c, 1, 2)} color={theme.orange} />
      <Chip text="EVERY FLIGHT" x={XO + TH[2] + 235} y={96} o={seg(t, c, 1, 2)} color={theme.ink} />
      <Note text="a little like a balloon" x={XI - 235} y={665} o={seg(t, c, 2)} />
      <Chip text="THE OUTER PANE" x={XO + TH[2] / 2} y={665} o={seg(t, c, 3)} />
      <Note text={SIMPLIFIED_NOTE} x={960} y={768} o={0.6 * ramp(t, 0.8, 1.4)} size={24} />
    </>
  );
};

// ---------------------------------------------------------------- 4: el agujero reparte la carga
export const SceneTheHole: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const hole = ramp(t, c[0] + 0.3, c[0] + 1.3);
  const ring = fade(t, c[0] + 0.5, c[0] + 1.0, c[1] + 2, c[1] + 2.5);
  const gap1 = ramp(t, c[1] + 0.3, c[1] + 1.2);
  const gap2 = ramp(t, c[1] + 2.0, c[1] + 4.0);
  const outer = fade(t, c[3] + 0.2, c[3] + 0.8, 1e6, 1e6 + 1);
  const flow = (i: number) => {
    const p = (((t - c[1] - 0.8) * 0.45 + i / 5) % 1 + 1) % 1;
    return { x: lerp(XI + TH[0] + 24, XO - 24, p), y: lerp(HOLE_Y - 70, HOLE_Y, Math.min(1, p * 2.2)) };
  };
  const dotsO = fade(t, c[1] + 0.8, c[1] + 1.4, c[2] - 0.3, c[2] + 0.2);
  const load = vis(t, c[3] + 0.4);
  return (
    <>
      <SvgFrame>
        <Section hole={hole} gap1={gap1} gap2={gap2} glow={[0, 0, outer]}>
          <circle cx={XM + TH[1] / 2} cy={HOLE_Y} r={24 + 4 * Math.sin(t * 5)} fill="none" stroke={theme.orange} strokeWidth={5} opacity={ring} />
          <g opacity={dotsO}>
            {[0, 1, 2, 3, 4].map((i) => {
              const d = flow(i);
              return <circle key={i} cx={d.x} cy={d.y} r={7} fill={theme.orange} />;
            })}
          </g>
          <Arrows x={XM + TH[1] + 24} len={50} o={load} ys={[240, 340, 440]} />
        </Section>
      </SvgFrame>
      <Chip text="A TINY HOLE" x={XM + TH[1] / 2} y={665} o={seg(t, c, 0)} color={theme.orange} />
      <Chip text="CABIN PRESSURE REACHES THE GAP" x={XM + TH[1] / 2} y={665} o={seg(t, c, 1)} color={theme.orange} />
      <Chip text="SAME PRESSURE BOTH SIDES" x={XM + TH[1] / 2} y={665} o={seg(t, c, 2)} />
      <Chip text="THE OUTER PANE TAKES THE LOAD" x={XM + TH[1] / 2} y={665} o={seg(t, c, 3)} />
      <Note text={SIMPLIFIED_NOTE} x={960} y={768} o={0.6 * ramp(t, 0.8, 1.4)} size={24} />
    </>
  );
};

// ---------------------------------------------------------------- 5: respaldo (fail-safe)
export const SceneBackup: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const crack = ramp(t, c[0] + 3.2, c[0] + 4.2);
  const take = fade(t, c[0] + 5.2, c[0] + 5.9, 1e6, 1e6 + 1);
  const outer = fade(t, 0.5, 1.0, c[0] + 3.4, c[0] + 4.0);
  return (
    <>
      <SvgFrame>
        <Section gap1={1} gap2={1} crack={crack} glow={[0, take, outer * 0]}>
          <Arrows x={XM - 150} len={70} o={take} ys={[240, 340, 440]} color={theme.teal} />
        </Section>
      </SvgFrame>
      <Chip text="IF THE OUTER PANE FAILED" x={XM + TH[1] / 2} y={665} o={vis(t, c[0] + 2.8, c[0] + 5.0)} color={theme.orange} />
      <Chip text="THE MIDDLE PANE TAKES OVER" x={XM + TH[1] / 2} y={665} o={vis(t, c[0] + 5.5, c[1] - 0.4)} />
      <Chip text="ASSUME SOMETHING CAN FAIL" x={XM + TH[1] / 2} y={665} o={seg(t, c, 1)} />
      <Chip text="FAIL-SAFE DESIGN" x={XM + TH[1] / 2} y={665} o={seg(t, c, 2)} color={theme.orange} />
      <Note text={SIMPLIFIED_NOTE} x={960} y={768} o={0.6 * ramp(t, 0.8, 1.4)} size={24} />
    </>
  );
};

// ---------------------------------------------------------------- 6: la fuga minuscula
export const SceneTinyLeak: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const supply = vis(t, c[1] + 0.2);
  const sw = 22 + 4 * Math.sin(t * 3);
  const leak = (i: number) => {
    const p = (((t - c[1]) * 0.2 + i / 3) % 1 + 1) % 1;
    return { x: lerp(XM + TH[1] / 2, XM + TH[1] + 90, p), y: lerp(HOLE_Y, HOLE_Y + 50, p), o: 1 - p };
  };
  return (
    <>
      <SvgFrame>
        <Section gap1={1} gap2={0.5}>
          <Arrows x={XI - 430} len={170} o={supply} ys={[300, 420]} color={theme.teal} sw={sw / 2} />
          {[0, 1, 2].map((i) => {
            const d = leak(i);
            return <circle key={i} cx={d.x} cy={d.y} r={4} fill={theme.orange} opacity={d.o * vis(t, c[1] + 0.2)} />;
          })}
        </Section>
      </SvgFrame>
      <Chip text="A HOLE IN A WINDOW?" x={960} y={50} o={seg(t, c, 0)} color={theme.orange} />
      <Chip text="TINY LEAK" x={XM + TH[1] / 2} y={665} o={seg(t, c, 1)} color={theme.orange} />
      <Chip text="PRESSURIZATION KEEPS UP" x={XI - 235} y={96} o={seg(t, c, 1)} />
      <Note text={SIMPLIFIED_NOTE} x={960} y={768} o={0.6 * ramp(t, 0.8, 1.4)} size={24} />
    </>
  );
};

// ---------------------------------------------------------------- 7: niebla
const FDX = -330;
export const SceneFog: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const drop = ramp(t, c[1] + 0.3, c[1] + 1.3);
  const fog = ramp(t, c[1] + 0.6, c[1] + 5) * (1 - ramp(t, c[2] + 1.2, c[2] + 4.2));
  const exit = (i: number) => {
    const p = ramp(t, c[2] + 0.4 + i * 0.07, c[2] + 2.6 + i * 0.07);
    const d = DOTS_GAP2[i];
    const toHole = Math.min(1, p * 2);
    const out = Math.max(0, p * 2 - 1);
    const x = lerp(lerp(d.x, XM + TH[1] / 2, toHole), XI + TH[0] + 14, out);
    const y = lerp(lerp(d.y, HOLE_Y, toHole), HOLE_Y - 30 - (i % 5) * 26, out);
    return { x, y, o: 1 - out * 0.9 };
  };
  const frost = vis(t, c[3] + 0.4);
  return (
    <>
      <SvgFrame>
        <Section dx={FDX}>
          <g opacity={drop}>
            {DOTS_GAP2.map((_, i) => {
              const d = exit(i);
              return <circle key={i} cx={d.x + 3 * Math.sin(t * 2 + i)} cy={d.y} r={6} fill={theme.teal} opacity={0.85 * d.o} />;
            })}
          </g>
          <circle cx={XM + TH[1] / 2} cy={HOLE_Y} r={34} fill="none" stroke="#9CC4E0" strokeWidth={7} strokeDasharray="4 11" strokeLinecap="round" opacity={frost} />
        </Section>
        <g transform="translate(1380 150)">
          <rect x={0} y={0} width={380} height={490} rx={40} fill={theme.panel} stroke={theme.panelLine} strokeWidth={3} />
          <rect x={60} y={50} width={260} height={390} rx={130} fill="url(#skyG2)" stroke={theme.ink} strokeWidth={8} />
          <rect x={60} y={50} width={260} height={390} rx={130} fill="#FFFFFF" opacity={0.92 * fog} />
          <defs>
            <linearGradient id="skyG2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#BFE0F0" />
              <stop offset="1" stopColor="#F4FAFD" />
            </linearGradient>
          </defs>
        </g>
      </SvgFrame>
      <Chip text="THE SECOND JOB: NO FOG" x={800} y={50} o={seg(t, c, 0)} color={theme.orange} />
      <Chip text="MOISTURE GETS TRAPPED" x={800} y={50} o={seg(t, c, 1)} />
      <Chip text="IT ESCAPES THROUGH THE HOLE" x={800} y={50} o={seg(t, c, 2)} />
      <Chip text="SOMETIMES A RING OF FROST" x={800} y={50} o={seg(t, c, 3)} color={theme.orange} />
      <Chip text="FOGGED" x={1570} y={665} o={vis(t, c[1] + 2.5, c[2] + 1.0)} color={theme.orange} />
      <Chip text="CLEAR" x={1570} y={665} o={vis(t, c[2] + 4.0)} />
      <Note text={SIMPLIFIED_NOTE} x={800} y={768} o={0.6 * ramp(t, 0.8, 1.4)} size={24} />
    </>
  );
};

// ---------------------------------------------------------------- 8: resumen
const CARD_W = 480;
const CARD_X = [180, 720, 1260];

const MiniPane: React.FC<{ x: number; w: number; fill: string; gap?: boolean }> = ({ x, w, fill, gap }) => (
  <>
    <rect x={x} y={gap ? 40 : 40} width={w} height={gap ? 150 : 270} rx={5} fill={fill} stroke={theme.ink} strokeWidth={3} />
    {gap && <rect x={x} y={230} width={w} height={90} rx={5} fill={fill} stroke={theme.ink} strokeWidth={3} />}
  </>
);

export const SceneRecap: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const d = c[1] - c[0];
  const at = [c[0] + 0.25 * d, c[0] + 0.5 * d, c[0] + 0.72 * d];
  const o = at.map((a) => ramp(t, a, a + 0.7));
  const titles = [
    ["ROUNDED CORNERS", "spread the stress"],
    ["THREE LAYERS", "share the load"],
    ["A TINY HOLE", "puts pressure where it belongs"],
  ];
  return (
    <>
      {[0, 1, 2].map((k) => (
        <Card key={k} left={CARD_X[k]} top={150} width={CARD_W} height={470} o={o[k]}>
          <svg width={CARD_W} height={340} viewBox={`0 0 ${CARD_W} 340`}>
            {k === 0 && (
              <>
                {[-1, 1].map((s) =>
                  [0, 1, 2, 3].map((i) => (
                    <path key={`${s}${i}`} d={`M${240 + s * (140 + i * 22)} 20 V120 Q${240 + s * (100 + i * 18)} 170 ${240 + s * (140 + i * 22)} 220 V320`} fill="none" stroke={theme.teal} strokeWidth={3} opacity={0.7} />
                  )),
                )}
                <rect x={170} y={80} width={140} height={190} rx={62} fill={theme.bg} stroke={theme.ink} strokeWidth={6} />
              </>
            )}
            {k === 1 && (
              <>
                <MiniPane x={150} w={34} fill={PANE_FILL[0]} />
                <MiniPane x={223} w={44} fill={PANE_FILL[1]} />
                <MiniPane x={306} w={54} fill={PANE_FILL[2]} />
              </>
            )}
            {k === 2 && (
              <>
                <rect x={150} y={40} width={36} height={270} rx={5} fill={PANE_FILL[0]} stroke={theme.ink} strokeWidth={3} />
                <MiniPane x={222} w={46} fill={PANE_FILL[1]} gap />
                <rect x={304} y={40} width={56} height={270} rx={5} fill={PANE_FILL[2]} stroke={theme.ink} strokeWidth={3} />
                <circle cx={245} cy={210} r={9} fill={theme.orange} />
              </>
            )}
          </svg>
          <div style={{ textAlign: "center", fontFamily: theme.font, marginTop: -6 }}>
            <div style={{ fontWeight: 900, fontSize: 36, letterSpacing: 3, color: theme.ink }}>{titles[k][0]}</div>
            <div style={{ fontWeight: 600, fontSize: 27, color: theme.teal, marginTop: 6 }}>{titles[k][1]}</div>
          </div>
        </Card>
      ))}
      <Chip text="WHAT IF SOMETHING GOES WRONG?" x={960} y={680} o={seg(t, c, 1)} color={theme.orange} />
    </>
  );
};

// ---------------------------------------------------------------- 9: cierre
export const SceneClose: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const zr = 1 - ramp(t, 0.3, 4.0);
  const win = 1 - ramp(t, c[2] - 0.4, c[2] + 0.6);
  const title = ramp(t, c[2] + 0.8, c[2] + 1.8);
  return (
    <>
      <SvgFrame>
        <g opacity={win} transform={`translate(${HX} ${lerp(HY, 400, zr)}) scale(${1 + 5 * zr}) translate(${-HX} ${-HY})`}>
          <WindowFace />
        </g>
      </SvgFrame>
      <Chip text="NOT A FLAW" x={960} y={745} o={vis(t, c[0] + 0.3, c[1] - 0.4)} />
      <Chip text="QUIET ENGINEERING" x={960} y={745} o={seg(t, c, 1)} />
      {title > 0 && (
        <div style={{ position: "absolute", left: 0, top: 280, width: W, textAlign: "center", opacity: title, fontFamily: theme.font }}>
          <div style={{ fontWeight: 900, fontSize: 92, letterSpacing: 8, color: theme.ink }}>THE EVERYDAY MYSTERY</div>
          <div style={{ width: 360, height: 6, background: theme.orange, margin: "22px auto" }} />
          <div style={{ fontWeight: 700, fontSize: 38, color: theme.teal }}>EM-002 · Why Do Airplane Windows Have a Tiny Hole?</div>
        </div>
      )}
    </>
  );
};

export const SCENES002: Record<string, React.FC<SceneProps>> = {
  "hole-hook": SceneHoleHook,
  "three-panes": SceneThreePanes,
  "push-outward": ScenePushOutward,
  "the-hole": SceneTheHole,
  "backup": SceneBackup,
  "tiny-leak": SceneTinyLeak,
  "fog": SceneFog,
  "recap": SceneRecap,
  "close": SceneClose,
};
