import React from "react";
import { staticFile } from "remotion";
import { vis } from "../components/ui";
import { lerp, ramp } from "../utils/anim";
import type { SceneProps } from "./scenes";
import { Chips, Note } from "./scenes011";
import { Arrow, G, GOLD, GREEN, GREY, ink, orange, Plaque, RED, SAND, seg, SimpleNote, SOFT, Stamp, SvgFrame, teal, Txt, useT, WARM } from "./kit";
import { ExitDoor } from "./scenes014";
import { Cam } from "./kit2";
import { FULL, Shots } from "./scenes023";
import type { Sh } from "./scenes023";
import { Lab } from "./scenes025";

const IMG = (id: string) => staticFile(`illustrations/em015-${id}.png`);
const ASP = 1672 / 941;

const PAPER = "#FFFDF4";
const NOTE_YELLOW = "#F2DB6B";

export const Tick: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <circle r={44} fill="#fff" stroke={GREEN} strokeWidth={8} />
    <path d="M-20 2 L-6 18 L22 -16" fill="none" stroke={GREEN} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
  </G>
);

export const Sheet: React.FC<{ x: number; y: number; w?: number; h?: number; title?: string; o?: number; size?: number; lines?: number }> = ({ x, y, w = 380, h = 460, title, o = 1, size = 70, lines = 5 }) => (
  <G x={x} y={y} o={o}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill={PAPER} stroke={ink} strokeWidth={6} />
    {title && (
      <Txt x={0} y={-h / 2 + 90} size={size} serif>
        {title}
      </Txt>
    )}
    {Array.from({ length: lines }, (_, i) => (
      <line key={i} x1={-w / 2 + 40} y1={-h / 2 + 170 + i * 50} x2={i === lines - 1 ? 0 : w / 2 - 40} y2={-h / 2 + 170 + i * 50} stroke={GREY} strokeWidth={6} strokeLinecap="round" />
    ))}
  </G>
);

/** Vista cenital: muro con hueco, hoja que gira (open grados, hacia fuera = arriba) y circulos neutros que empujan desde dentro (abajo). */
const Swing: React.FC<{ x: number; y: number; s?: number; o?: number; open?: number; inward?: boolean; push?: number }> = ({ x, y, s = 1, o = 1, open = 0, inward = false, push = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-420} y={-12} width={310} height={24} fill={SAND} stroke={ink} strokeWidth={5} />
    <rect x={110} y={-12} width={310} height={24} fill={SAND} stroke={ink} strokeWidth={5} />
    {inward && <rect x={-110} y={-32} width={220} height={20} fill={GREY} />}
    <g transform={`translate(-110 0) rotate(${inward ? open : -open})`}>
      <rect x={0} y={-8} width={220} height={16} rx={6} fill={teal} stroke={ink} strokeWidth={4} />
    </g>
    {[0, 1, 2].map((r) =>
      [-1, 0, 1].map((c) => <circle key={`${r}${c}`} cx={c * 64} cy={150 + r * 62} r={22} fill={SOFT} stroke={ink} strokeWidth={4} />),
    )}
    {[-64, 0, 64].map((ax) => (
      <Arrow key={ax} x1={ax} y1={110} x2={ax} y2={40} color={orange} o={push} w={8} />
    ))}
    <Txt x={-300} y={-70} size={30} fill={GREY}>
      outside
    </Txt>
    <Txt x={-300} y={110} size={30} fill={GREY}>
      inside
    </Txt>
  </G>
);

export const Map: React.FC<{ x: number; y: number; o?: number; dots?: [number, number, string][]; w?: number; h?: number }> = ({ x, y, o = 1, dots = [], w = 560, h = 380 }) => (
  <G x={x} y={y} o={o}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={20} fill="#EAF3F3" stroke={ink} strokeWidth={6} />
    {[-2, -1, 0, 1, 2].map((i) => (
      <line key={`v${i}`} x1={i * (w / 5)} y1={-h / 2} x2={i * (w / 5)} y2={h / 2} stroke="#CFE0E0" strokeWidth={4} />
    ))}
    {[-1, 0, 1].map((i) => (
      <line key={`h${i}`} x1={-w / 2} y1={i * (h / 4)} x2={w / 2} y2={i * (h / 4)} stroke="#CFE0E0" strokeWidth={4} />
    ))}
    {dots.map(([dx, dy, col], i) => (
      <circle key={i} cx={dx} cy={dy} r={22} fill={col} stroke={ink} strokeWidth={4} />
    ))}
  </G>
);

const Key: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <circle cx={-100} cy={0} r={46} fill={GOLD} stroke={ink} strokeWidth={6} />
    <circle cx={-100} cy={0} r={16} fill={PAPER} stroke={ink} strokeWidth={4} />
    <rect x={-56} y={-12} width={190} height={24} fill={GOLD} stroke={ink} strokeWidth={5} />
    <rect x={80} y={12} width={22} height={40} fill={GOLD} stroke={ink} strokeWidth={5} />
    <rect x={116} y={12} width={22} height={30} fill={GOLD} stroke={ink} strokeWidth={5} />
  </G>
);

const Knob: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-100} y={-200} width={200} height={400} rx={10} fill="#E4E7EC" stroke={ink} strokeWidth={6} />
    <circle r={46} fill={GOLD} stroke={ink} strokeWidth={6} />
    <circle r={16} fill={PAPER} stroke={ink} strokeWidth={4} />
  </G>
);

const Seats: React.FC<{ x: number; y: number; cols?: number; rows?: number; o?: number }> = ({ x, y, cols = 7, rows = 3, o = 1 }) => (
  <G x={x} y={y} o={o}>
    {Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, i) => <rect key={`${r}-${i}`} x={i * 100} y={r * 90} width={70} height={56} rx={14} fill={SOFT} stroke={ink} strokeWidth={5} />))}
  </G>
);

/* ------------------------------------------------------------------ hook (0-4) */
const HOOK_SHOTS: Sh[] = [
  { id: "cinema-exit-doors", t: 0, asp: ASP, r: FULL, f: [0.5, 0.42], z: 1.1, mv: "in", tr: "page" },
  { id: "cinema-exit-doors", t: 1, asp: ASP, r: FULL, f: [0.28, 0.6], z: 1.3, mv: "pr", tr: "wl" },
  { id: "cinema-exit-doors", t: 2, asp: ASP, r: FULL, f: [0.72, 0.5], z: 1.35, mv: "pl", tr: "wr" },
  { id: "cinema-exit-doors", t: 3, asp: ASP, r: FULL, f: [0.5, 0.3], z: 1.15, mv: "in", tr: "fade" },
  { id: "cinema-exit-doors", t: 4, asp: ASP, r: FULL, f: [0.62, 0.68], z: 1.45, mv: "pr", tr: "zoom" },
];

const SceneHook: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const shots = HOOK_SHOTS.map((s, i) => ({ ...s, t: c[i] ?? s.t }));
  return (
    <>
      <SvgFrame>
        <Cam dur={dur} z1={1.05} amt={0.6}>
          <Shots id="hook" list={shots} dur={dur} src={(id) => IMG(id)} />
        </Cam>
        <Lab text="AI illustration, not a portrait" a={0.3} b={dur} />
        <G o={k(0)}>
          <rect x={300} y={170} width={800} height={44} rx={8} fill={WARM} stroke={ink} strokeWidth={6} />
          <Txt x={700} y={193} size={26} fill={ink} spacing={4}>
            SCREEN
          </Txt>
          <Seats x={310} y={290} />
          <ExitDoor x={1480} y={470} s={1} o={vis(t, c[0] + 1.6)} />
          <Note x={1480} y={730} text="at the back" o={vis(t, c[0] + 2.4)} size={38} fill={teal} />
        </G>
        <G o={k(1)}>
          <ExitDoor x={760} y={480} s={1.2} bar={vis(t, c[1] + 2.4)} />
          <Arrow x1={1180} y1={250} x2={900} y2={220} color={teal} o={vis(t, c[1] + 1.0)} />
          <Note x={1380} y={260} text="a sign" o={vis(t, c[1] + 1.0)} size={48} fill={teal} />
          <Arrow x1={1180} y1={470} x2={920} y2={480} color={orange} o={vis(t, c[1] + 2.4)} />
          <Note x={1400} y={480} text="a long bar" o={vis(t, c[1] + 2.4)} size={48} fill={orange} />
        </G>
        <G o={k(2)}>
          <ExitDoor x={760} y={480} s={1.1} bar={1} />
          <circle cx={300} cy={480} r={40} fill={SOFT} stroke={ink} strokeWidth={6} />
          <Note x={300} y={570} text="you" o={1} size={40} fill={ink} />
          <Arrow x1={350} y1={480} x2={620} y2={480} color={GREY} />
          <Arrow x1={920} y1={480} x2={1380} y2={480} color={orange} w={16} o={vis(t, c[2] + 2.4)} />
          <Note x={1150} y={430} text="swings away" o={vis(t, c[2] + 2.4)} size={44} fill={orange} />
        </G>
        <G o={k(3)}>
          <Sheet x={700} y={430} w={420} h={500} title="RULES" size={80} />
          <Tick x={960} y={260} s={1.5} o={vis(t, c[3] + 2.0)} />
          <ExitDoor x={1400} y={480} s={0.9} bar={1} />
        </G>
        <G o={k(4)}>
          <Txt x={640} y={300} size={380} serif fill={ink}>
            WHY
          </Txt>
          <Txt x={1160} y={290} size={380} serif fill={orange}>
            ?
          </Txt>
          <ExitDoor x={760} y={640} s={0.45} bar={1} />
          <Arrow x1={880} y1={650} x2={1180} y2={650} color={orange} w={14} o={vis(t, c[4] + 1.2)} />
          <Note x={1400} y={650} text="pushes outward" o={vis(t, c[4] + 1.6)} size={46} fill={ink} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(2), k(3), k(4))} />
      <Chips t={t} c={c} list={[["THE DOOR AT THE BACK"], ["A SIGN AND A BAR"], ["IT SWINGS AWAY"], ["SHAPED BY RULES", true], ["WHY?", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ mechanics (5-8) */
const MECHANICS_SHOTS: Sh[] = [
  { id: "hip-push", t: 0, asp: ASP, r: FULL, f: [0.6, 0.45], z: 1.15, mv: "in", tr: "page" },
  { id: "hip-push", t: 1, asp: ASP, r: FULL, f: [0.75, 0.55], z: 1.35, mv: "pr", tr: "wl" },
  { id: "hip-push", t: 2, asp: ASP, r: FULL, f: [0.4, 0.4], z: 1.3, mv: "pl", tr: "wr" },
  { id: "hip-push", t: 3, asp: ASP, r: FULL, f: [0.68, 0.6], z: 1.2, mv: "in", tr: "fade" },
];

const SceneMechanics: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const shots = MECHANICS_SHOTS.map((s, i) => ({ ...s, t: c[i] ?? s.t }));
  return (
    <>
      <SvgFrame>
        <Cam dur={dur} z1={1.05} amt={0.6}>
          <Shots id="mechanics" list={shots} dur={dur} src={(id) => IMG(id)} />
        </Cam>
        <Lab text="AI illustration, not a portrait" a={0.3} b={dur} />
        <G o={k(0)}>
          <Swing x={760} y={270} s={1.15} inward open={0} push={vis(t, c[0] + 2.4)} />
          <Note x={1400} y={300} text="opens inward" o={vis(t, c[0] + 1.0)} size={48} fill={ink} />
          <Note x={1400} y={370} text="the push keeps it shut" o={vis(t, c[0] + 3.4)} size={42} fill={RED} />
          <Stamp x={1400} y={560} text="OUR READING: AN INFERENCE" o={vis(t, c[0] + 5.0)} size={34} pad={70} color={teal} rot={-2} />
        </G>
        <G o={k(1)}>
          <Swing x={760} y={270} s={1.15} open={lerp(0, 55, ramp(t, c[1] + 0.8, c[1] + 2.6))} push={1} />
          <Note x={1400} y={300} text="opens outward" o={vis(t, c[1] + 0.6)} size={48} fill={ink} />
          <Note x={1400} y={370} text="the same push helps open it" o={vis(t, c[1] + 2.2)} size={40} fill={teal} />
        </G>
        <G o={k(2)}>
          <Swing x={960} y={250} s={0.8} open={55} push={0} />
          <Stamp x={960} y={600} text="OUR EXPLANATION, NOT A QUOTE" o={vis(t, c[2] + 1.8)} size={40} pad={70} color={orange} rot={-2} />
        </G>
        <G o={k(3)}>
          <Sheet x={760} y={420} w={420} h={480} title="RULES" size={74} />
          <circle cx={1300} cy={420} r={150} fill={WARM} fillOpacity={0.5} />
          <circle cx={1300} cy={420} r={90} fill={WARM} />
          <circle cx={1300} cy={420} r={40} fill={GOLD} />
          <Note x={1300} y={640} text="calm, and just the design" o={vis(t, c[3] + 2.0)} size={44} fill={teal} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(2))} />
      <Chips t={t} c={c} list={[["OUR READING", true], ["THE SAME PUSH"], ["NOT A QUOTE", true], ["A STORY ABOUT RULES"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ history (9-13) */
const HISTORY_SHOTS: Sh[] = [
  { id: "sunderland-1883", t: 0, asp: ASP, r: FULL, f: [0.5, 0.42], z: 1.1, mv: "in", tr: "page" },
  { id: "sunderland-1883", t: 1, asp: ASP, r: FULL, f: [0.3, 0.58], z: 1.3, mv: "pr", tr: "wl" },
  { id: "briggs-workshop-1890s", t: 2, asp: ASP, r: FULL, f: [0.68, 0.48], z: 1.35, mv: "pl", tr: "wr" },
  { id: "briggs-workshop-1890s", t: 3, asp: ASP, r: FULL, f: [0.45, 0.35], z: 1.15, mv: "in", tr: "fade" },
  { id: "sunderland-1883", t: 4, asp: ASP, r: FULL, f: [0.55, 0.65], z: 1.4, mv: "pr", tr: "zoom" },
];

const SceneHistory: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const shots = HISTORY_SHOTS.map((s, i) => ({ ...s, t: c[i] ?? s.t }));
  return (
    <>
      <SvgFrame>
        <Cam dur={dur} z1={1.05} amt={0.6}>
          <Shots id="history" list={shots} dur={dur} src={(id) => IMG(id)} />
        </Cam>
        <Lab text="AI illustration, not a portrait" a={0.3} b={dur} />
        <G o={k(0)}>
          <rect x={420} y={190} width={960} height={500} rx={12} fill="none" stroke={ink} strokeWidth={8} />
          <path d="M470 240 H640 V300 H720 V360 H800 V420 H880 V480 H960 V540 H1040 V610" fill="none" stroke={GREY} strokeWidth={14} strokeLinejoin="round" />
          <G x={1090} y={540}>
            <rect x={-30} y={-80} width={60} height={160} fill="#E4E7EC" stroke={ink} strokeWidth={6} />
            <rect x={-16} y={-10} width={32} height={26} rx={4} fill={GOLD} stroke={ink} strokeWidth={4} />
            <path d="M-9 -10 V-26 A9 9 0 0 1 9 -26 V-10" fill="none" stroke={ink} strokeWidth={5} />
          </G>
          <Arrow x1={1290} y1={540} x2={1150} y2={540} color={RED} o={vis(t, c[0] + 4.0)} />
          <Note x={1240} y={450} text="opens inward" o={vis(t, c[0] + 4.0)} size={34} fill={RED} />
          <Note x={1280} y={620} text="bolted" o={vis(t, c[0] + 5.0)} size={38} fill={ink} />
          <Note x={960} y={140} text="Sunderland, England, 1883" o={vis(t, c[0] + 1.0)} size={50} fill={ink} />
        </G>
        <G o={k(1)}>
          <rect x={560} y={250} width={800} height={400} rx={14} fill="#fff" stroke={ink} strokeWidth={8} />
          {[[560, 350, -1], [560, 520, -1], [1360, 350, 1], [1360, 520, 1], [960, 250, 0]].map(([dx, dy, side], i) => (
            <G key={i} o={vis(t, c[1] + 1.2 + i * 0.5)}>
              <rect x={(dx as number) - 8} y={(dy as number) - 8} width={16} height={16} fill={teal} />
              <Arrow x1={(dx as number) + (side as number) * 20} y1={(dy as number) - (side === 0 ? 20 : 0)} x2={(dx as number) + (side as number) * 110} y2={(dy as number) - (side === 0 ? 110 : 0)} color={orange} w={9} />
            </G>
          ))}
          <Txt x={960} y={450} size={44} fill={GREY}>
            a venue
          </Txt>
          <Note x={960} y={715} text="Wikipedia" o={vis(t, c[1] + 4.5)} size={40} fill={teal} />
        </G>
        <G o={k(2)}>
          <Sheet x={600} y={430} w={420} h={520} lines={4} />
          <G x={600} y={470}>
            <rect x={-130} y={-50} width={260} height={20} fill="#E4E7EC" stroke={ink} strokeWidth={4} />
            <rect x={-130} y={-24} width={260} height={30} rx={6} fill={orange} stroke={ink} strokeWidth={4} />
            <circle cx={-130} cy={-14} r={10} fill={teal} />
          </G>
          <Txt x={600} y={220} size={44} fill={ink} weight={700}>
            PATENT
          </Txt>
          <Stamp x={1280} y={320} text="1892, UNITED KINGDOM" o={vis(t, c[2] + 3.0)} size={36} pad={70} color={teal} rot={-3} />
          <Plaque x={1280} y={480} text="Robert Alexander Briggs" s={1} w={700} o={vis(t, c[2] + 1.6)} />
          <Note x={1280} y={600} text="Illustration, not the original patent" o={vis(t, c[2] + 4.4)} size={30} fill={GREY} />
        </G>
        <G o={k(3)}>
          <Map x={700} y={400} dots={[[40, 20, orange]]} />
          <Txt x={760} y={360} size={36} fill={ink}>
            Chicago
          </Txt>
          <Stamp x={700} y={240} text="1903" o={vis(t, c[3] + 1.4)} size={56} color={orange} rot={-3} />
          <G x={1360} y={420} o={vis(t, c[3] + 3.4)}>
            <rect x={-150} y={-190} width={300} height={380} rx={12} fill={WARM} stroke={ink} strokeWidth={6} />
            <rect x={-150} y={-190} width={40} height={380} fill={orange} />
            <Txt x={20} y={-100} size={46} serif>
              CODES
            </Txt>
            {[-30, 10, 50, 90].map((ly) => (
              <line key={ly} x1={-90} y1={ly} x2={110} y2={ly} stroke={GREY} strokeWidth={6} />
            ))}
          </G>
          <Stamp x={1360} y={680} text="CODES REFORMED" o={vis(t, c[3] + 4.4)} size={44} color={teal} rot={-3} />
        </G>
        <G o={k(4)}>
          <Map x={960} y={400} w={900} h={440} dots={[[-300, -80, orange], [-120, 100, teal], [60, -120, GOLD], [200, 80, orange], [340, -60, teal], [-20, 20, GREY]]} />
          <Stamp x={960} y={690} text="VARIES BY PLACE" o={vis(t, c[4] + 1.8)} size={56} color={teal} rot={-2} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(2), k(3), k(4))} />
      <Chips t={t} c={c} list={[["SUNDERLAND, 1883"], ["WHAT CHANGED"], ["THE PATENT"], ["CHICAGO, 1903"], ["VARIES BY PLACE", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ bar (14-18) */
const BarCut: React.FC<{ x: number; y: number; s?: number; press?: number; o?: number }> = ({ x, y, s = 1, press = 0, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={30} y={-230} width={50} height={470} fill="#E4E7EC" stroke={ink} strokeWidth={6} />
    <rect x={120} y={-230} width={30} height={200} fill={SAND} stroke={ink} strokeWidth={6} />
    <rect x={120} y={50} width={30} height={190} fill={SAND} stroke={ink} strokeWidth={6} />
    <rect x={80 - 40 * press + 40} y={-20} width={46 + 40 * press} height={30} rx={4} fill={teal} stroke={ink} strokeWidth={5} />
    <rect x={-210 + 60 * press} y={-24} width={240} height={46} rx={20} fill={orange} stroke={ink} strokeWidth={6} />
    <path d={`M${40} 60 l12 -14 l-24 -14 l24 -14 l-24 -14 l12 -14`} fill="none" stroke={GREY} strokeWidth={5} transform={`translate(${-20 + 50 * press} 70) rotate(0)`} />
  </G>
);

const BAR_SHOTS: Sh[] = [
  { id: "crash-bar-closeup", t: 0, asp: ASP, r: FULL, f: [0.45, 0.5], z: 1.15, mv: "in", tr: "page" },
  { id: "crash-bar-closeup", t: 1, asp: ASP, r: FULL, f: [0.6, 0.4], z: 1.35, mv: "pr", tr: "wl" },
  { id: "crash-bar-closeup", t: 2, asp: ASP, r: FULL, f: [0.3, 0.65], z: 1.3, mv: "pl", tr: "wr" },
  { id: "crash-bar-closeup", t: 3, asp: ASP, r: FULL, f: [0.65, 0.35], z: 1.4, mv: "in", tr: "fade" },
  { id: "crash-bar-closeup", t: 4, asp: ASP, r: FULL, f: [0.5, 0.6], z: 1.2, mv: "pr", tr: "zoom" },
];

const SceneBar: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const shots = BAR_SHOTS.map((s, i) => ({ ...s, t: c[i] ?? s.t }));
  return (
    <>
      <SvgFrame>
        <Cam dur={dur} z1={1.05} amt={0.6}>
          <Shots id="bar" list={shots} dur={dur} src={(id) => IMG(id)} />
        </Cam>
        <Lab text="AI illustration, not a portrait" a={0.3} b={dur} />
        <G o={k(0)}>
          <BarCut x={700} y={450} s={1.15} press={0} />
          <Arrow x1={1100} y1={300} x2={1400} y2={300} color={orange} w={14} o={vis(t, c[0] + 4.0)} />
          <Note x={1330} y={230} text="direction of the exit" o={vis(t, c[0] + 4.0)} size={42} fill={orange} />
          <Note x={1330} y={440} text="spring-loaded bar" o={vis(t, c[0] + 1.0)} size={46} fill={ink} />
          <Note x={1330} y={510} text="fixed across the door" o={vis(t, c[0] + 2.4)} size={40} fill={teal} />
        </G>
        <G o={k(1)}>
          <BarCut x={640} y={450} s={1.15} press={ramp(t, c[1] + 0.8, c[1] + 2.0)} />
          <Note x={1280} y={300} text="crash bar" o={vis(t, c[1] + 3.6)} size={54} fill={ink} />
          <Note x={1280} y={390} text="panic bar" o={vis(t, c[1] + 4.6)} size={54} fill={teal} />
          <Note x={1280} y={480} text="panic exit device" o={vis(t, c[1] + 5.6)} size={54} fill={orange} />
        </G>
        <G o={k(2)}>
          <Knob x={420} y={420} s={1} />
          <Note x={640} y={330} text="?" o={vis(t, c[2] + 1.4)} size={120} fill={orange} />
          <Sheet x={1060} y={420} w={300} h={400} lines={4} />
          <Sheet x={1400} y={420} w={300} h={400} lines={4} o={vis(t, c[2] + 5.0)} />
          <Note x={1230} y={660} text="Wikipedia" o={vis(t, c[2] + 3.0)} size={40} fill={teal} />
          <Note x={1230} y={716} text="Illustration, not the original patent" o={vis(t, c[2] + 3.4)} size={28} fill={GREY} />
        </G>
        <G o={k(3)}>
          <rect x={360} y={420} width={1200} height={50} rx={22} fill={orange} stroke={ink} strokeWidth={6} />
          {[[560, "a hand", 28], [960, "a hip", 44], [1360, "a whole body", 70]].map(([px, label, r], i) => (
            <G key={label as string} o={vis(t, c[3] + 1.2 + i * 1.2)}>
              <circle cx={px as number} cy={560} r={r as number} fill={SOFT} stroke={ink} strokeWidth={5} />
              <Arrow x1={px as number} y1={560 - (r as number) - 10} x2={px as number} y2={490} color={teal} w={9} />
              <Txt x={px as number} y={680} size={42} fill={ink}>
                {label as string}
              </Txt>
            </G>
          ))}
          <Stamp x={960} y={250} text="OUR READING: AN INFERENCE" o={vis(t, c[3] + 0.4)} size={38} pad={70} color={teal} rot={-2} />
        </G>
        <G o={k(4)}>
          <Knob x={560} y={420} s={0.9} />
          <path d="M470 220 A110 110 0 1 1 460 280" fill="none" stroke={RED} strokeWidth={10} strokeLinecap="round" />
          <Note x={560} y={680} text="grip and twist" o={vis(t, c[4] + 1.0)} size={44} fill={RED} />
          <rect x={1060} y={400} width={500} height={50} rx={22} fill={orange} stroke={ink} strokeWidth={6} />
          <Arrow x1={1310} y1={260} x2={1310} y2={380} color={teal} w={14} o={vis(t, c[4] + 2.6)} />
          <Note x={1310} y={680} text="just push" o={vis(t, c[4] + 3.2)} size={52} fill={teal} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(3), k(4))} />
      <Chips t={t} c={c} list={[["THE CRASH BAR"], ["MANY NAMES"], ["SOME LATCH DESIGNS"], ["OUR READING", true], ["KNOB VS BAR"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ rules (19-23) */
const RULES_SHOTS: Sh[] = [
  { id: "cinema-exit-doors", t: 0, asp: ASP, r: FULL, f: [0.35, 0.55], z: 1.2, mv: "in", tr: "page" },
  { id: "cinema-exit-doors", t: 1, asp: ASP, r: FULL, f: [0.65, 0.4], z: 1.4, mv: "pr", tr: "wl" },
  { id: "cinema-exit-doors", t: 2, asp: ASP, r: FULL, f: [0.45, 0.68], z: 1.3, mv: "pl", tr: "wr" },
  { id: "cinema-exit-doors", t: 3, asp: ASP, r: FULL, f: [0.3, 0.35], z: 1.15, mv: "in", tr: "fade" },
  { id: "cinema-exit-doors", t: 4, asp: ASP, r: FULL, f: [0.7, 0.6], z: 1.45, mv: "pr", tr: "zoom" },
];

const SceneRules: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const shots = RULES_SHOTS.map((s, i) => ({ ...s, t: c[i] ?? s.t }));
  return (
    <>
      <SvgFrame>
        <Cam dur={dur} z1={1.05} amt={0.6}>
          <Shots id="rules" list={shots} dur={dur} src={(id) => IMG(id)} />
        </Cam>
        <Lab text="AI illustration, not a portrait" a={0.3} b={dur} />
        <G o={k(0)}>
          <Sheet x={620} y={440} w={460} h={540} lines={0} />
          <Txt x={620} y={230} size={28} fill={ink} weight={700}>
            GUIDANCE, UPDATED 2024
          </Txt>
          {[300, 360, 420, 540, 600].map((ly) => (
            <line key={ly} x1={420} y1={ly} x2={820} y2={ly} stroke={GREY} strokeWidth={8} strokeLinecap="round" />
          ))}
          <rect x={410} y={450} width={420} height={60} rx={8} fill={orange} fillOpacity={0.35} stroke={orange} strokeWidth={4} />
          <Note x={620} y={742} text="Home Office guidance, UK" o={vis(t, c[0] + 1.0)} size={38} fill={teal} />
          <ExitDoor x={1340} y={450} s={0.9} bar={1} />
          <Arrow x1={1500} y1={630} x2={1820} y2={630} color={orange} w={14} o={vis(t, c[0] + 5.0)} />
          <Note x={1660} y={570} text="in the direction of travel" o={vis(t, c[0] + 5.0)} size={36} fill={orange} />
        </G>
        <G o={k(1)}>
          <ExitDoor x={1260} y={460} s={1.1} bar={1} />
          <Key x={560} y={440} s={1.5} />
          <line x1={330} y1={300} x2={800} y2={580} stroke={RED} strokeWidth={18} strokeLinecap="round" />
          <line x1={800} y1={300} x2={330} y2={580} stroke={RED} strokeWidth={18} strokeLinecap="round" />
          <Stamp x={700} y={700} text="NO KEY NEEDED" o={vis(t, c[1] + 2.4)} size={56} color={teal} rot={-3} />
        </G>
        <G o={k(2)}>
          {[["healthcare", 520], ["education", 960], ["assembly", 1400]].map(([label, px], i) => (
            <G key={label as string} y={-30} o={vis(t, c[2] + 1.2 + i * 1.2)}>
              <rect x={(px as number) - 110} y={250} width={220} height={190} fill="#fff" stroke={ink} strokeWidth={6} />
              {i === 0 && <path d={`M${px} 290 v90 M${(px as number) - 45} 335 h90`} stroke={RED} strokeWidth={18} strokeLinecap="round" />}
              {i === 1 && <path d={`M${(px as number) - 130} 250 L${px} 170 L${(px as number) + 130} 250 Z`} fill={SAND} stroke={ink} strokeWidth={6} strokeLinejoin="round" />}
              {i === 2 && [-60, 0, 60].map((cx) => <rect key={cx} x={(px as number) + cx - 14} y={270} width={28} height={170} fill={SOFT} stroke={ink} strokeWidth={4} />)}
              <rect x={(px as number) - 70} y={500} width={140} height={22} rx={10} fill={orange} stroke={ink} strokeWidth={4} />
              <Txt x={px as number} y={580} size={40} fill={ink}>
                {label as string}
              </Txt>
            </G>
          ))}
          <Stamp x={960} y={672} text="ADOPTION VARIES" o={vis(t, c[2] + 6.0)} size={48} color={teal} rot={-2} />
          <Note x={960} y={735} text="Wikipedia" o={vis(t, c[2] + 6.4)} size={34} fill={teal} />
        </G>
        <G o={k(3)}>
          <Sheet x={600} y={420} w={420} h={500} title="EN 1125" size={84} />
          <Note x={600} y={712} text="Europe, per Wikipedia" o={vis(t, c[3] + 1.0)} size={38} fill={teal} />
          <Stamp x={1280} y={400} text="SECOND-HAND" o={vis(t, c[3] + 4.6)} size={60} color={teal} rot={-3} />
          <Note x={1280} y={510} text="we did not open it" o={vis(t, c[3] + 5.6)} size={46} fill={teal} />
        </G>
        <G o={k(4)}>
          <Stamp x={960} y={380} text="NOT A GUIDE TO ANY BUILDING'S RULES" o={vis(t, c[4] + 0.8)} size={44} color={orange} rot={-2} />
          <Plaque x={960} y={600} text="LOCAL FIRE AUTHORITY" s={1} w={700} o={vis(t, c[4] + 3.0)} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(2), k(3))} />
      <Chips t={t} c={c} list={[["A MODERN EXAMPLE"], ["NO KEY NEEDED"], ["UNITED STATES"], ["EUROPE"], ["NOT A GUIDE", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ practical (24-26) */
const PRACTICAL_SHOTS: Sh[] = [
  { id: "cinema-exit-doors", t: 0, asp: ASP, r: FULL, f: [0.4, 0.3], z: 1.25, mv: "in", tr: "page" },
  { id: "cinema-exit-doors", t: 1, asp: ASP, r: FULL, f: [0.6, 0.65], z: 1.4, mv: "pl", tr: "wl" },
  { id: "cinema-exit-doors", t: 2, asp: ASP, r: FULL, f: [0.5, 0.45], z: 1.15, mv: "pr", tr: "wr" },
];

const ScenePractical: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const shots = PRACTICAL_SHOTS.map((s, i) => ({ ...s, t: c[i] ?? s.t }));
  return (
    <>
      <SvgFrame>
        <Cam dur={dur} z1={1.05} amt={0.6}>
          <Shots id="practical" list={shots} dur={dur} src={(id) => IMG(id)} />
        </Cam>
        <Lab text="AI illustration, not a portrait" a={0.3} b={dur} />
        <G o={k(0)}>
          <rect x={340} y={200} width={1240} height={480} rx={14} fill="#fff" stroke={ink} strokeWidth={8} />
          <Seats x={520} y={380} cols={8} rows={3} />
          {[1280, 1500].map((dx) => (
            <rect key={dx} x={dx - 60} y={190} width={120} height={20} fill={teal} stroke={ink} strokeWidth={5} />
          ))}
          <Arrow x1={960} y1={640} x2={1390} y2={290} color={orange} w={12} o={vis(t, c[0] + 2.0)} />
          <Arrow x1={1500} y1={260} x2={1500} y2={140} color={orange} w={12} o={vis(t, c[0] + 3.4)} />
          <Note x={960} y={725} text="which way do the exit doors swing?" o={vis(t, c[0] + 1.0)} size={44} fill={ink} />
        </G>
        <G o={k(1)}>
          <ExitDoor x={420} y={440} s={0.8} bar={1} />
          <Arrow x1={540} y1={440} x2={700} y2={440} color={orange} w={10} />
          <ExitDoor x={960} y={440} s={0.8} bar={1} />
          <Arrow x1={1080} y1={440} x2={1240} y2={440} color={orange} w={10} />
          <G x={1500} y={440} o={vis(t, c[1] + 2.4)}>
            <rect x={-96} y={-184} width={192} height={368} rx={6} fill="#E4E7EC" stroke={ink} strokeWidth={6} />
            <circle r={26} fill={GOLD} stroke={ink} strokeWidth={5} />
          </G>
          <Stamp x={960} y={690} text="RULES DIFFER BY PLACE" o={vis(t, c[1] + 4.6)} size={46} color={teal} rot={-2} />
        </G>
        <G o={k(2)}>
          <rect x={620} y={260} width={680} height={300} rx={20} fill={GREEN} stroke={ink} strokeWidth={8} />
          <circle cx={960} cy={410} r={230} fill={GREEN} fillOpacity={0.15} />
          <Txt x={900} y={410} size={150} fill="#fff" spacing={6}>
            EXIT
          </Txt>
          <Arrow x1={1130} y1={410} x2={1240} y2={410} color="#fff" w={16} />
          <Tick x={1480} y={290} s={1.4} o={vis(t, c[2] + 1.6)} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1))} />
      <Chips t={t} c={c} list={[["NOTICE THE DOORS"], ["NOT EVERY DOOR", true], ["NOTICE THE EXITS"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ close (27-29) */
const CLOSE_SHOTS: Sh[] = [
  { id: "cinema-exit-doors", t: 0, asp: ASP, r: FULL, f: [0.55, 0.5], z: 1.2, mv: "pl", tr: "fade" },
  { id: "cinema-exit-doors", t: 1, asp: ASP, r: FULL, f: [0.32, 0.4], z: 1.35, mv: "in", tr: "zoom" },
  { id: "cinema-exit-doors", t: 2, asp: ASP, r: FULL, f: [0.68, 0.35], z: 1.3, mv: "pr", tr: "wl" },
];

const SceneClose: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const shots = CLOSE_SHOTS.map((s, i) => ({ ...s, t: c[i] ?? s.t }));
  return (
    <>
      <SvgFrame>
        <Cam dur={dur} z1={1.05} amt={0.6}>
          <Shots id="close" list={shots} dur={dur} src={(id) => IMG(id)} />
        </Cam>
        <Lab text="AI illustration, not a portrait" a={0.3} b={dur} />
        <G o={k(0)}>
          <ExitDoor x={760} y={470} s={1.1} bar={1} />
          <Arrow x1={920} y1={480} x2={1280} y2={480} color={orange} w={14} />
          <Sheet x={1500} y={420} w={300} h={380} title="RULES" size={56} lines={3} />
          <Note x={1250} y={640} text="design shaped by rules" o={vis(t, c[0] + 2.0)} size={46} fill={ink} />
        </G>
        <G o={k(1)}>
          <rect x={560} y={190} width={800} height={460} rx={26} fill="#fff" stroke={ink} strokeWidth={10} />
          <rect x={590} y={220} width={740} height={400} rx={10} fill="#EAF3F3" />
          <rect x={900} y={650} width={120} height={60} fill="#E4E7EC" stroke={ink} strokeWidth={6} />
          <rect x={780} y={706} width={360} height={26} rx={12} fill="#E4E7EC" stroke={ink} strokeWidth={6} />
          <G x={1230} y={290} o={vis(t, c[1] + 6.0)} rot={4}>
            <rect x={-60} y={-60} width={120} height={120} fill={NOTE_YELLOW} stroke={ink} strokeWidth={5} />
          </G>
        </G>
        <G o={k(2)}>
          <G x={760} y={450} rot={-4}>
            <rect x={-230} y={-230} width={460} height={460} fill={NOTE_YELLOW} stroke={ink} strokeWidth={7} />
            <path d="M230 120 L120 230 L230 230 Z" fill="#D6BF4A" stroke={ink} strokeWidth={5} strokeLinejoin="round" />
            {[-120, -60, 0].map((ly) => (
              <line key={ly} x1={-170} y1={ly} x2={150} y2={ly} stroke="#D6BF4A" strokeWidth={8} strokeLinecap="round" />
            ))}
          </G>
          <Txt x={1300} y={440} size={380} serif fill={orange}>
            ?
          </Txt>
          <Note x={1300} y={680} text="strong glue, barely sticks" o={vis(t, c[2] + 1.0)} size={42} fill={ink} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(2))} />
      <Chips t={t} c={c} list={[["SHAPED BY RULES"], ["SOMETIMES, AN ACCIDENT"], ["NEXT: THE YELLOW SQUARE", true]]} />
    </>
  );
};

export const SCENES015: Record<string, React.FC<SceneProps>> = {
  "hook": SceneHook,
  "mechanics": SceneMechanics,
  "history": SceneHistory,
  "bar": SceneBar,
  "rules": SceneRules,
  "practical": ScenePractical,
  "close": SceneClose,
};
