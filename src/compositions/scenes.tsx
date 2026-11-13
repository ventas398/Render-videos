import React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { ObjectReveal } from "../components/ObjectReveal";
import { PhotoShot, Shot } from "../components/PhotoShot";
import { ShapeComparison } from "../components/ShapeComparison";
import { SIMPLIFIED_NOTE, TechnicalDiagram } from "../components/TechnicalDiagram";
import { Timeline } from "../components/Timeline";
import { theme, VIDEO } from "../themes/brand";
import { fade, lerp, ramp } from "../utils/anim";
import { Shape } from "../utils/shape";

const { width: W, height: H, fps: FPS } = VIDEO;
const useT = (): number => useCurrentFrame() / FPS;

/** cues[i] = inicio (s, relativo a la escena) de la parte fromPart+i; dur = duracion de la escena en s. */
export type SceneProps = { cues: number[]; dur: number };

const IMG = "images/em001/";
/** Visible entre a y b (s) con 0.5 s de fundido. */
const vis = (t: number, a: number, b = 1e6): number => fade(t, a, a + 0.5, b, b + 0.5);

const Cloud: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={theme.white} opacity={0.92}>
    <ellipse cx={0} cy={0} rx={90} ry={32} />
    <ellipse cx={-50} cy={-16} rx={44} ry={30} />
    <ellipse cx={20} cy={-30} rx={52} ry={36} />
  </g>
);

const Chip: React.FC<{ text: string; x: number; y: number; o: number; color?: string }> = ({ text, x, y, o, color = theme.teal }) =>
  o > 0 ? (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translateX(-50%)",
        opacity: o,
        padding: "10px 30px",
        borderRadius: 40,
        border: `3px solid ${color}`,
        background: theme.bg,
        color,
        fontFamily: theme.font,
        fontWeight: 800,
        fontSize: 32,
        letterSpacing: 3,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  ) : null;

const Note: React.FC<{ text: string; x: number; y: number; o: number; size?: number }> = ({ text, x, y, o, size = 30 }) =>
  o > 0 ? (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translateX(-50%)",
        opacity: o,
        fontFamily: theme.font,
        fontWeight: 600,
        fontSize: size,
        color: theme.ink,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  ) : null;

const Card: React.FC<{ left: number; top: number; width: number; height: number; o: number; children?: React.ReactNode }> = ({
  left,
  top,
  width,
  height,
  o,
  children,
}) =>
  o > 0 ? (
    <div
      style={{
        position: "absolute",
        left,
        top: top + 16 * (1 - o),
        width,
        height,
        boxSizing: "border-box",
        background: theme.panel,
        border: `3px solid ${theme.panelLine}`,
        borderRadius: 36,
        boxShadow: "0 18px 40px rgba(20,33,61,0.14)",
        opacity: o,
      }}
    >
      {children}
    </div>
  ) : null;

const Photos: React.FC<{ shots: Shot[] }> = ({ shots }) => (
  <>
    {shots.map((s, i) => (
      <PhotoShot key={i} shot={s} />
    ))}
  </>
);

// ------------------------------------------------------------------ 1: ventanilla ovalada (gancho)
const WIN: Shape = { W: 300, H: 400, R: 150 };

export const SceneOvalWindow: React.FC<SceneProps> = () => {
  const t = useT();
  const cx = 960;
  const cy = 420;
  const z = 1 + 0.14 * ramp(t, 0, 6.2);
  const pan = lerp(-30, 30, ramp(t, 0, 6.2));
  const ring = fade(t, 3.2, 3.7, 4.8, 5.4);
  const r = (g: number) => ({ x: cx - WIN.W / 2 - g, y: cy - WIN.H / 2 - g, width: WIN.W + 2 * g, height: WIN.H + 2 * g, rx: WIN.R + g });
  const drift = (base: number, speed: number): number => cx - 360 + ((base + t * speed) % 720);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <clipPath id="win1">
          <rect {...r(0)} />
        </clipPath>
        <radialGradient id="wall1" cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#FCFAF5" />
          <stop offset="1" stopColor="#E6DECD" />
        </radialGradient>
        <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2d86c4" />
          <stop offset="1" stopColor="#bfe8f0" />
        </linearGradient>
        <linearGradient id="bezel1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#C4BBA8" />
        </linearGradient>
      </defs>
      <g transform={`translate(${cx} ${cy}) scale(${z}) translate(${-cx + pan} ${-cy})`}>
        <rect x={-600} y={-600} width={3200} height={2400} fill="url(#wall1)" />
        {[-1, 1].map((k) => (
          <line key={k} x1={cx + k * 560} y1={-600} x2={cx + k * 560} y2={1800} stroke="#CFC6B3" strokeWidth={6} opacity={0.8} />
        ))}
        {[-1, 1].map((k) =>
          Array.from({ length: 30 }).map((_, i) => (
            <circle key={`${k}-${i}`} cx={cx + k * 560 + 16} cy={-200 + i * 62} r={3.5} fill="#CFC6B3" />
          )),
        )}
        <rect {...r(46)} fill="url(#bezel1)" />
        <rect {...r(22)} fill="#B3A995" />
        <rect {...r(0)} fill="url(#sky1)" />
        <g clipPath="url(#win1)">
          <Cloud x={drift(0, 36)} y={cy - 40} s={1.3} />
          <Cloud x={drift(300, 24)} y={cy + 100} s={1.0} />
          <Cloud x={drift(520, 48)} y={cy - 130} s={0.8} />
          <polygon points={`${cx - 220},${cy - 260} ${cx - 90},${cy - 260} ${cx + 60},${cy + 260} ${cx - 70},${cy + 260}`} fill="#fff" opacity={0.1} />
        </g>
        <rect {...r(0)} fill="none" stroke="#7E7664" strokeWidth={5} />
        {ring > 0 && <rect {...r(34 + 8 * Math.sin(t * 6))} fill="none" stroke={theme.teal} strokeWidth={6} opacity={ring} />}
      </g>
    </svg>
  );
};

// ------------------------------------------------------------------ 2: fotos de ventanillas reales
export const SceneWindowPhotos: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const t = useT();
  const left = { left: lerp(700, 360, ramp(t, c[1] - 0.2, c[1] + 0.8)), top: 50, width: 520, height: 690 };
  const shots: Shot[] = [
    {
      src: `${IMG}ch01-a350-window-undimmed.jpg`,
      credit: "4300streetcar, CC BY 4.0",
      box: left,
      from: 0,
      to: c[2],
      z: [1, 1.1],
      pos: [[50, 50], [50, 50]],
    },
    {
      src: `${IMG}ch01-a350-window-dimmed.jpg`,
      credit: "4300streetcar, CC BY 4.0",
      box: left,
      from: c[2],
      to: dur,
      z: [1, 1.5],
      pos: [[50, 50], [50, 50]],
      origin: "28% 80%",
    },
    {
      src: `${IMG}ch01-08-bright-skies.jpg`,
      credit: "Tim Gouw, CC0",
      box: { left: 940, top: 150, width: 680, height: 450 },
      from: c[1],
      to: dur,
      z: [1, 1.35],
      pos: [[50, 50], [50, 50]],
      origin: "52% 38%",
    },
  ];
  return (
    <>
      <Photos shots={shots} />
      <Chip text="ALMOST EVERY AIRLINER TODAY" x={1280} y={660} o={vis(t, c[1] + 0.6, c[2])} />
      <Chip text="THE TINY DETAIL" x={1280} y={660} o={vis(t, c[2] + 0.8)} color={theme.orange} />
    </>
  );
};

// ------------------------------------------------------------------ 3: cuadrada vs ovalada
export const SceneSquareVsOval: React.FC<SceneProps> = ({ cues: c }) => <ShapeComparison focusAt={c[1]} />;

// ------------------------------------------------------------------ 4: el ciclo de presion
const dotRing = (n: number, r0: number, r1: number, seed: number) =>
  Array.from({ length: n }, (_, i) => {
    const a = i * 2.39996 + seed;
    const r = r0 + (r1 - r0) * Math.sqrt((i + 0.5) / n);
    return { x: Math.cos(a) * r, y: Math.sin(a) * r };
  });
const CABIN_DOTS = dotRing(90, 0, 205, 0);
const AIR_DOTS = dotRing(16, 285, 350, 1);

export const ScenePressure: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const cx = 700;
  const cy = 400;
  const R = 250;
  const slow = 0.5 - 0.5 * Math.cos((2 * Math.PI * (t - c[1])) / (c[2] - c[1]));
  const fast = 0.5 - 0.5 * Math.cos(2 * Math.PI * (t - c[2]));
  const pulse = t < c[1] ? 0 : t < c[2] ? slow : fast;
  const on = ramp(t, c[1] - 0.2, c[1] + 0.4);
  const s = 1 + 0.045 * pulse;
  const half = (c[1] + c[2]) / 2;
  const arrow = (k: number) => {
    const a = (k * Math.PI) / 6;
    const ux = Math.cos(a);
    const uy = Math.sin(a);
    const r0 = 70;
    const r1 = r0 + 36 + 80 * pulse;
    const px = -uy * 14;
    const py = ux * 14;
    return (
      <g key={k}>
        <line x1={ux * r0} y1={uy * r0} x2={ux * r1} y2={uy * r1} stroke={theme.orange} strokeWidth={8} strokeLinecap="round" />
        <polygon points={`${ux * r1 + px},${uy * r1 + py} ${ux * r1 - px},${uy * r1 - py} ${ux * (r1 + 28)},${uy * (r1 + 28)}`} fill={theme.orange} />
      </g>
    );
  };
  const lit = Math.max(0, Math.min(50, Math.floor((t - c[2]) * 10)));
  const tally = vis(t, c[2] - 0.3);
  return (
    <>
      <svg width={W} height={780} viewBox={`0 0 ${W} 780`} style={{ position: "absolute", left: 0, top: 0 }}>
        <g opacity={ramp(t, 0.1, 0.8)}>
          <g transform={`translate(${cx} ${cy})`}>
            {AIR_DOTS.map((d, i) => (
              <circle key={i} cx={d.x + 3 * Math.sin(t * 1.7 + i)} cy={d.y + 3 * Math.cos(t * 1.3 + i)} r={4} fill={theme.ink} opacity={0.35 * ramp(t, 2.8, 3.4)} />
            ))}
          </g>
          <g transform={`translate(${cx} ${cy}) scale(${s})`}>
            <circle r={R} fill={theme.panel} stroke={theme.ink} strokeWidth={16} />
            {[-140, -40].map((deg) => (
              <ellipse
                key={deg}
                cx={Math.cos((deg * Math.PI) / 180) * R}
                cy={Math.sin((deg * Math.PI) / 180) * R}
                rx={13}
                ry={21}
                transform={`rotate(${deg + 90} ${Math.cos((deg * Math.PI) / 180) * R} ${Math.sin((deg * Math.PI) / 180) * R})`}
                fill={theme.bg}
                stroke={theme.ink}
                strokeWidth={4}
              />
            ))}
            {CABIN_DOTS.map((d, i) => (
              <circle key={i} cx={d.x + 2.5 * Math.sin(t * 2 + i)} cy={d.y + 2.5 * Math.cos(t * 1.6 + i)} r={4.5} fill={theme.teal} opacity={ramp(t, 5.0, 5.8) * (1 - 0.6 * on)} />
            ))}
            {on > 0 && <g opacity={on}>{Array.from({ length: 12 }, (_, k) => arrow(k))}</g>}
          </g>
        </g>
        {tally > 0 && (
          <g opacity={tally}>
            {Array.from({ length: 50 }, (_, i) => (
              <circle
                key={i}
                cx={1110 + (i % 10) * 46}
                cy={278 + Math.floor(i / 10) * 46}
                r={15}
                fill={i < lit ? theme.teal : "none"}
                stroke={i < lit ? theme.teal : theme.panelLine}
                strokeWidth={4}
              />
            ))}
          </g>
        )}
      </svg>
      <Chip text="NOT A HOUSE" x={cx} y={50} o={vis(t, 0.4, 2.4)} color={theme.orange} />
      <Chip text="THIN AIR OUTSIDE" x={cx} y={50} o={vis(t, 3.2, c[1])} />
      <Chip text="PRESSURIZED CABIN" x={cx} y={cy - 30} o={vis(t, 5.6, c[1] - 0.2)} />
      <Chip text="EVERY FLIGHT: PUSHED OUTWARD" x={1360} y={400} o={vis(t, c[1] + 0.2, half)} color={theme.orange} />
      <Chip text="EVERY LANDING: RELAXES" x={1360} y={400} o={vis(t, half + 0.1, c[2] - 0.2)} />
      <Chip text="FLIGHT AFTER FLIGHT" x={1317} y={170} o={tally} />
      <Note text="Each one harmless on its own" x={1317} y={540} o={vis(t, c[2] + 3.2)} />
      <Note text={SIMPLIFIED_NOTE} x={cx} y={740} o={0.6 * ramp(t, 0.8, 1.4)} size={24} />
    </>
  );
};

// ------------------------------------------------------------------ 5: el Comet (foto)
const COMET_WIN: Shape = { W: 300, H: 250, R: 40 };

export const SceneCometPhoto: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const t = useT();
  const shots: Shot[] = [
    {
      src: `${IMG}ch03-comet1-g-alyw.jpg`,
      credit: "RuthAS, CC BY 3.0",
      note: "de Havilland Comet 1",
      box: { left: 140, top: 110, width: 980, height: 590 },
      from: 0,
      to: dur,
      z: [1, 1.1],
      pos: [[50, 50], [50, 50]],
      origin: "50% 55%",
    },
  ];
  const card = vis(t, c[2]);
  const cx = 1480;
  const draw = ramp(t, c[2] + 0.3, c[2] + 1.6);
  return (
    <>
      <Photos shots={shots} />
      <Chip text="DE HAVILLAND COMET" x={cx} y={300} o={vis(t, 1.0, c[1])} />
      <Note text="BRITAIN · EARLY 1950s" x={cx} y={390} o={vis(t, 1.6, c[1])} />
      <Chip text="FAST" x={cx} y={240} o={vis(t, c[1] + 0.2, c[2])} />
      <Chip text="SMOOTH" x={cx} y={330} o={vis(t, c[1] + 1.5, c[2])} />
      <Chip text="ABOVE THE WEATHER" x={cx} y={420} o={vis(t, c[1] + 2.7, c[2])} />
      <Card left={1190} top={110} width={580} height={590} o={card}>
        <svg width={574} height={584} viewBox="0 0 574 584">
          <rect
            x={287 - COMET_WIN.W / 2}
            y={250 - COMET_WIN.H / 2}
            width={COMET_WIN.W}
            height={COMET_WIN.H}
            rx={COMET_WIN.R}
            fill={theme.bg}
            stroke={theme.ink}
            strokeWidth={9}
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - draw}
          />
          <text x={287} y={430} textAnchor="middle" fontFamily={theme.font} fontWeight={800} fontSize={34} letterSpacing={2} fill={theme.ink} opacity={draw}>
            LARGE, NEARLY SQUARE
          </text>
          <text x={287} y={474} textAnchor="middle" fontFamily={theme.font} fontWeight={700} fontSize={28} fill={theme.teal} opacity={draw}>
            only slightly rounded corners
          </text>
          <text x={287} y={548} textAnchor="middle" fontFamily={theme.font} fontSize={22} fill={theme.ink} opacity={0.55 * draw}>
            Simplified illustration
          </text>
        </svg>
      </Card>
    </>
  );
};

// ------------------------------------------------------------------ 6: avion de los anos cincuenta
const WINDOW_X = 1000;
const WINDOW_Y = 410;

export const SceneFifties: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const zoomAt = c[1] + 0.4;
  const slide = ramp(t, 0.3, 2.4);
  const zoom = ramp(t, zoomAt, zoomAt + 2.4);
  const arrows = fade(t, 2.0, 2.6, c[1] - 0.2, c[1] + 0.3);
  const corner = ramp(t, zoomAt + 2.2, zoomAt + 2.8);
  const z = lerp(1, 5.5, zoom);
  const fx = lerp(960, WINDOW_X, zoom);
  const fy = lerp(430, WINDOW_Y, zoom);
  const pulse = 1 + 0.25 * Math.sin(t * 7);
  const win = (x: number) => (
    <rect key={x} x={x - 11} y={WINDOW_Y - 13} width={22} height={26} rx={7} fill={theme.ink} stroke={x === WINDOW_X ? theme.teal : "none"} strokeWidth={x === WINDOW_X ? 1.4 : 0} />
  );
  const arrow = (x: number, up: boolean) => {
    const len = 70 + 18 * Math.sin(t * 6 + x);
    const y0 = up ? 366 : 494;
    const dir = up ? -1 : 1;
    return (
      <g key={`${x}${up}`}>
        <line x1={x} y1={y0} x2={x} y2={y0 + dir * len} stroke={theme.orange} strokeWidth={8} strokeLinecap="round" />
        <polygon points={`${x - 16},${y0 + dir * len} ${x + 16},${y0 + dir * len} ${x},${y0 + dir * (len + 28)}`} fill={theme.orange} />
      </g>
    );
  };
  const xs = Array.from({ length: 15 }, (_, k) => 580 + 60 * k);
  return (
    <>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="glow3" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
        </defs>
        <g transform={`translate(960 430) scale(${z}) translate(${-fx} ${-fy})`}>
          <g transform={`translate(${lerp(-1300, 0, slide)} 0)`} opacity={ramp(t, 0.2, 0.9)}>
            {/* cola, estabilizador, ala y motor */}
            <g opacity={1 - zoom}>
              <polygon points="420,372 340,240 420,240 560,372" fill="#9FB0C3" />
              <polygon points="900,486 1130,486 880,660 780,660" fill="#8195AB" />
              <ellipse cx={1000} cy={566} rx={70} ry={24} fill="#5F7389" />
            </g>
            <rect x={340} y={370} width={1260} height={120} rx={60} fill={theme.white} stroke="#B3A995" strokeWidth={3} />
            <rect x={380} y={452} width={1180} height={10} rx={5} fill={theme.teal} opacity={0.85} />
            {xs.map(win)}
          </g>
          {arrows > 0 && <g opacity={arrows}>{[640, 800, 1160, 1320].flatMap((x) => [arrow(x, true), arrow(x, false)])}</g>}
          {corner > 0 &&
            [
              [-11, -13],
              [11, -13],
              [-11, 13],
              [11, 13],
            ].map(([dx, dy], i) => (
              <circle key={i} cx={WINDOW_X + dx} cy={WINDOW_Y + dy} r={2.6 * pulse} fill={theme.orange} opacity={corner} filter="url(#glow3)" />
            ))}
        </g>
      </svg>
      <div style={{ position: "absolute", left: (W - 1300) / 2, top: 80, opacity: 1 - ramp(t, c[1] - 0.3, c[1] + 0.5) }}>
        <Sequence layout="none">
          <Timeline ticks={["1940s", "1950s", "1960s", "1970s", "Today"]} highlight={1} delay={0.3} />
        </Sequence>
      </div>
      <Chip text="CABIN PRESSURE" x={960} y={690} o={arrows * 0.95} color={theme.orange} />
      <Chip text="1954" x={960} y={690} o={vis(t, c[1] + 0.3)} color={theme.orange} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", fontFamily: theme.font, fontSize: 22, color: theme.ink, opacity: 0.55 * (1 - zoom) }}>
        Illustrative silhouette
      </div>
    </>
  );
};

// ------------------------------------------------------------------ 7: 1954, Elba y Napoles
const DateCard: React.FC<{ left: number; date: string; place: string; lost: string; o: number }> = ({ left, date, place, lost, o }) => (
  <Card left={left} top={120} width={560} height={500} o={o}>
    <div style={{ textAlign: "center", fontFamily: theme.font, color: theme.ink, paddingTop: 56 }}>
      <div style={{ fontSize: 54, fontWeight: 800, letterSpacing: 4 }}>{date}</div>
      <div style={{ height: 6, width: 160, margin: "22px auto", background: theme.orange, borderRadius: 3 }} />
      <div style={{ fontSize: 100, fontWeight: 900, letterSpacing: 6, color: theme.teal }}>{place}</div>
      <div style={{ marginTop: 34, fontSize: 40, fontWeight: 800, letterSpacing: 3, color: theme.orange }}>{lost}</div>
    </div>
  </Card>
);

export const SceneComet1954: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const cardsOut = c[3];
  return (
    <>
      <DateCard left={lerp(680, 330, ramp(t, c[1] - 0.1, c[1] + 0.7))} date="10 JAN 1954" place="ELBA" lost="35 LIVES LOST" o={fade(t, c[0] + 0.2, c[0] + 0.8, cardsOut, cardsOut + 0.5)} />
      <DateCard left={1030} date="8 APR 1954" place="NAPLES" lost="21 LIVES LOST" o={fade(t, c[1] + 0.2, c[1] + 0.8, cardsOut, cardsOut + 0.5)} />
      <Chip text="FLEET GROUNDED" x={960} y={690} o={vis(t, c[2] + 0.2, cardsOut)} color={theme.orange} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", opacity: vis(t, cardsOut + 0.4) }}>
        <div style={{ fontFamily: theme.font, fontWeight: 900, fontSize: 130, letterSpacing: 8, color: theme.ink }}>WHAT BROKE THEM?</div>
        <div style={{ height: 8, width: 520, margin: "18px auto 0", background: theme.orange, borderRadius: 4 }} />
      </div>
    </>
  );
};

// ------------------------------------------------------------------ 8: la investigacion
export const SceneInvestigation: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const t = useT();
  const breath = 0.5 - 0.5 * Math.cos((2 * Math.PI * (t - c[1])) / 2.0);
  const pulse = t < c[1] ? 0 : breath;
  const photoAt = c[2] + 3.0;
  const tankOp = fade(t, 0.1, 0.7, photoAt, photoAt + 0.5);
  const crack = ramp(t, c[2] + 0.3, c[2] + 1.6);
  const cy = 400;
  const sy = 1 + 0.06 * pulse;
  const sx = 1 + 0.015 * pulse;
  const windows = Array.from({ length: 8 }, (_, k) => 560 + k * 110);
  const arrow = (x: number, up: boolean) => {
    const len = 16 + 30 * pulse;
    const y0 = cy + (up ? -40 : 40);
    const dir = up ? -1 : 1;
    return (
      <g key={`${x}${up}`}>
        <line x1={x} y1={y0} x2={x} y2={y0 + dir * len} stroke={theme.orange} strokeWidth={6} strokeLinecap="round" />
        <polygon points={`${x - 11},${y0 + dir * len} ${x + 11},${y0 + dir * len} ${x},${y0 + dir * (len + 18)}`} fill={theme.orange} />
      </g>
    );
  };
  const pressurize = ramp(pulse, 0.4, 0.6);
  const run = vis(t, c[1] + 0.3, c[2]);
  const shots: Shot[] = [
    {
      src: `${IMG}ch05-comet-g-alyu-panel.jpg`,
      credit: "Clemens Vasters, CC BY 2.0",
      note: "Comet tank-test fuselage section, on display",
      box: { left: 360, top: 40, width: 1200, height: 640 },
      from: photoAt,
      to: c[3],
      z: [1, 1.6],
      pos: [[50, 50], [50, 50]],
      origin: "56% 62%",
    },
    {
      src: `${IMG}ch04-comet-wreckage.jpg`,
      credit: "Paul Hudson, CC BY 2.0",
      note: "Wreckage from a Comet jet",
      box: { left: 400, top: 40, width: 560, height: 640 },
      from: c[3],
      to: dur,
      z: [1, 1.2],
      pos: [[50, 50], [50, 50]],
      origin: "50% 45%",
    },
  ];
  return (
    <>
      {tankOp > 0 && (
        <svg width={W} height={780} viewBox={`0 0 ${W} 780`} style={{ position: "absolute", left: 0, top: 0 }}>
          <g opacity={tankOp}>
            <rect x={300} y={150} width={1320} height={500} rx={26} fill="#D5EBF0" stroke={theme.ink} strokeWidth={5} />
            <path
              d={`M300 ${196} ${Array.from({ length: 22 }, (_, i) => `L${300 + (i + 1) * 60} ${196 + 7 * Math.sin(t * 2 + i)}`).join(" ")}`}
              fill="none"
              stroke="#7FB8C6"
              strokeWidth={4}
            />
            <g transform={`translate(960 ${cy}) scale(${sx} ${sy}) translate(-960 ${-cy})`}>
              <rect x={480} y={300} width={960} height={200} rx={100} fill={theme.panel} stroke={theme.ink} strokeWidth={6} />
              {windows.map((x) => (
                <rect key={x} x={x - 18} y={cy - 16} width={36} height={32} rx={6} fill={theme.bg} stroke={theme.ink} strokeWidth={3} />
              ))}
              <path
                d="M1018 386 L1030 372 L1025 357 L1040 343 L1035 326"
                fill="none"
                stroke={theme.orange}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - crack}
              />
            </g>
            {pulse > 0 && <g opacity={ramp(t, c[1], c[1] + 0.4)}>{[620, 780, 940, 1100, 1260].flatMap((x) => [arrow(x, true), arrow(x, false)])}</g>}
          </g>
        </svg>
      )}
      <Photos shots={shots} />
      <Chip text="WATER TANK TEST" x={480} y={86} o={tankOp * vis(t, 0.8)} />
      <Chip text="A REAL COMET FUSELAGE" x={960} y={560} o={vis(t, 2.4, c[1])} />
      <Chip text="PRESSURIZE" x={960} y={560} o={run * pressurize} color={theme.orange} />
      <Chip text="RELAX" x={960} y={560} o={run * (1 - pressurize)} />
      <Chip text="CRACK AT A WINDOW CORNER" x={960} y={560} o={vis(t, c[2] + 1.0, photoAt)} color={theme.orange} />
      <Note text={SIMPLIFIED_NOTE} x={960} y={720} o={0.6 * tankOp} size={24} />
      <Chip text="SQUARISH OPENINGS" x={1420} y={250} o={vis(t, c[3] + 1.5)} />
      <Chip text="RADIO ANTENNA WINDOWS ON THE ROOF" x={1420} y={340} o={vis(t, c[3] + 5.5)} />
      <Chip text="THE METAL AROUND THE CORNERS" x={1420} y={470} o={vis(t, c[4] + 0.6)} color={theme.orange} />
    </>
  );
};

// ------------------------------------------------------------------ 9: la tension, invisible
export const SceneInvisibleStress: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const draw = ramp(t, c[1] + 0.2, c[1] + 2.5);
  return (
    <>
      <div style={{ position: "absolute", left: 160, top: 70, opacity: ramp(t, 0.2, 0.9) }}>
        <TechnicalDiagram shape={{ W: 300, H: 400, R: 150 }} progress={draw} flow={t > c[1] + 2.5} width={680} height={640} />
      </div>
      <Sequence from={Math.round((c[0] + 1.2) * FPS)} layout="none">
        <div style={{ position: "absolute", left: 960, top: 250, width: 800 }}>
          <ObjectReveal duration={1.0} y={30}>
            <div style={{ fontFamily: theme.font, fontWeight: 900, fontSize: 150, letterSpacing: 14, color: theme.ink }}>STRESS</div>
            <div style={{ height: 6, width: 420, marginTop: 8, background: theme.orange, borderRadius: 3 }} />
          </ObjectReveal>
        </div>
      </Sequence>
      <Chip text="LIKE WATER IN A RIVER" x={1330} y={520} o={vis(t, c[1] + 2.0, c[2])} />
      <Chip text="FAR FROM THE HOLE: CALM" x={1330} y={520} o={vis(t, c[2] + 0.3)} />
      <div style={{ position: "absolute", left: 160, width: 680, top: 724, textAlign: "center", fontFamily: theme.font, fontSize: 24, color: theme.ink, opacity: 0.6 * draw }}>
        {SIMPLIFIED_NOTE}
      </div>
    </>
  );
};

// ------------------------------------------------------------------ 10: la esquina brusca y la fatiga
const SHARP: Shape = { W: 300, H: 300, R: 6 };
const ROUNDED: Shape = { W: 300, H: 300, R: 70 };
const OVAL: Shape = { W: 250, H: 340, R: 125 };

export const SceneStressGeometry: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const draw = ramp(t, 0.3, 2.8);
  const hole = fade(t, 0.3, 0.9, 1.9, 2.4);
  const metal = ramp(t, 2.4, 3.0);
  const s0 = c[2] + 4.6;
  const period = 1.0;
  const bends = 5;
  const tb = s0 + bends * period;
  const amp = t < s0 ? 0 : 55 * ramp(t, s0, s0 + 0.3);
  const th = ((amp * Math.sin((2 * Math.PI * (t - s0)) / period)) * Math.PI) / 180;
  const L = 230;
  const broken = t >= tb;
  const dt = Math.min(1.5, Math.max(0, t - tb));
  const crackO = ramp(t, c[2] + 0.8, c[2] + 1.6);
  const card = vis(t, c[2] + 3.4);
  const tip = { x: 340 + L * Math.cos(th), y: 280 - L * Math.sin(th) };
  return (
    <>
      <div style={{ position: "absolute", left: 200, top: 70 }}>
        <TechnicalDiagram shape={SHARP} progress={draw} glass={hole} metal={metal} width={640} height={640} />
      </div>
      {crackO > 0 && (
        <svg width={W} height={780} viewBox={`0 0 ${W} 780`} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
          <path d="M670 230 l14 -10 l-6 -14 l16 -12 l-4 -14" fill="none" stroke={theme.orange} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={crackO} />
        </svg>
      )}
      <Chip text="THE FLOW MUST BEND" x={1420} y={330} o={vis(t, c[0] + 0.5, c[1])} />
      <Chip text="LINES CROWD AT THE CORNER" x={1420} y={330} o={vis(t, c[1] + 0.3, c[2])} color={theme.orange} />
      <Chip text="MUCH MORE STRESS" x={1420} y={440} o={vis(t, c[1] + 4.5, c[2])} color={theme.orange} />
      <Card left={1080} top={90} width={680} height={640} o={card}>
        <svg width={674} height={634} viewBox="0 0 674 634">
          <text x={337} y={96} textAnchor="middle" fontFamily={theme.font} fontWeight={900} fontSize={56} letterSpacing={6} fill={theme.orange}>
            FATIGUE
          </text>
          <text x={337} y={140} textAnchor="middle" fontFamily={theme.font} fontWeight={600} fontSize={30} fill={theme.ink} opacity={ramp(t, c[2] + 4.0, c[2] + 4.6)}>
            like bending a paperclip
          </text>
          <g transform="translate(-3 20)">
            <line x1={110} y1={300} x2={340} y2={300} stroke={theme.ink} strokeWidth={14} strokeLinecap="round" />
            {broken ? (
              <g transform={`translate(${40 * dt} ${140 * dt * dt}) rotate(${-25 * dt} 340 300)`}>
                <line x1={348} y1={300} x2={340 + L} y2={300} stroke={theme.ink} strokeWidth={14} strokeLinecap="round" />
              </g>
            ) : (
              <line x1={340} y1={300} x2={tip.x} y2={tip.y} stroke={theme.ink} strokeWidth={14} strokeLinecap="round" />
            )}
            <circle cx={340} cy={300} r={16} fill={theme.orange} opacity={0.9 * ramp(t, s0, tb)} />
          </g>
          <text x={337} y={540} textAnchor="middle" fontFamily={theme.font} fontWeight={800} fontSize={40} letterSpacing={3} fill={broken ? theme.orange : theme.ink} opacity={ramp(t, s0, s0 + 0.4)}>
            {broken ? "SNAP" : "BEND · BEND · BEND"}
          </text>
        </svg>
      </Card>
      <Note text={SIMPLIFIED_NOTE} x={520} y={724} o={0.6 * draw} size={24} />
    </>
  );
};

// ------------------------------------------------------------------ 11: la curva reparte
export const SceneCurveFix: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const draw = ramp(t, 0.3, 2.6);
  return (
    <>
      <div style={{ position: "absolute", left: 130, top: 70, display: "flex", gap: 50, opacity: ramp(t, 0.1, 0.6) }}>
        <TechnicalDiagram shape={SHARP} title="SHARP CORNERS" sub="stress piles up" progress={draw} width={520} />
        <TechnicalDiagram shape={ROUNDED} title="ROUNDED CORNERS" sub="less stress" progress={draw} width={520} />
        <TechnicalDiagram shape={OVAL} title="OVAL" sub="stress flows around" progress={draw} width={520} />
      </div>
      <Chip text="SAME METAL" x={390} y={690} o={vis(t, c[1] + 0.2)} />
      <Chip text="SAME PRESSURE" x={960} y={690} o={vis(t, c[1] + 1.3)} />
      <Chip text="SAME FLIGHTS" x={1530} y={690} o={vis(t, c[1] + 2.4)} />
      <Note text={SIMPLIFIED_NOTE} x={960} y={756} o={0.6 * draw} size={24} />
    </>
  );
};

// ------------------------------------------------------------------ 12: hoy y cierre
export const SceneToday: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const shots: Shot[] = [
    {
      src: `${IMG}ch01-a350-window-dimmed.jpg`,
      credit: "4300streetcar, CC BY 4.0",
      box: { left: 520, top: 50, width: 520, height: 690 },
      from: c[1],
      to: c[2],
      z: [1, 1.1],
      pos: [[50, 50], [50, 50]],
    },
    {
      src: `${IMG}ch08-a350-wingview.jpg`,
      credit: "Simply Aviation, CC BY 2.0",
      box: { left: 300, top: 90, width: 1320, height: 600 },
      from: c[2],
      to: c[3],
      z: [1, 1.15],
      pos: [[50, 35], [50, 35]],
      origin: "40% 45%",
    },
  ];
  return (
    <>
      <Photos shots={shots} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", opacity: vis(t, c[0] + 0.2, c[1] - 0.2) }}>
        <div style={{ fontFamily: theme.font, fontWeight: 900, fontSize: 150, letterSpacing: 10, color: theme.ink }}>4 YEARS LATER</div>
        <div style={{ height: 8, width: 460, margin: "18px auto 0", background: theme.orange, borderRadius: 4 }} />
      </div>
      <Chip text="THE COMET RETURNS, REDESIGNED" x={960} y={500} o={vis(t, c[0] + 1.6, c[1] - 0.2)} />
      <Chip text="ROUNDED WINDOWS" x={1330} y={300} o={vis(t, c[1] + 0.8, c[2])} />
      <Chip text="EVER SINCE" x={1330} y={400} o={vis(t, c[1] + 2.2, c[2])} color={theme.orange} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", opacity: vis(t, c[3] + 0.3) }}>
        <div style={{ fontFamily: theme.font, fontWeight: 900, fontSize: 96, letterSpacing: 10, color: theme.ink }}>THE EVERYDAY MYSTERY</div>
        <div style={{ height: 8, width: 520, margin: "18px auto 22px", background: theme.orange, borderRadius: 4 }} />
        <div style={{ fontFamily: theme.font, fontWeight: 700, fontSize: 44, letterSpacing: 2, color: theme.teal }}>EM-001 · Why Are Airplane Windows Round?</div>
      </div>
    </>
  );
};

export const SCENES: Record<string, React.FC<SceneProps>> = {
  "oval-window": SceneOvalWindow,
  "window-photos": SceneWindowPhotos,
  "square-vs-oval": SceneSquareVsOval,
  "pressure-cycle": ScenePressure,
  "comet-photo": SceneCometPhoto,
  "fifties-airliner": SceneFifties,
  "comet-1954": SceneComet1954,
  "investigation": SceneInvestigation,
  "invisible-stress": SceneInvisibleStress,
  "stress-geometry": SceneStressGeometry,
  "curve-fix": SceneCurveFix,
  "today": SceneToday,
};
