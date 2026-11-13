import React from "react";
import { Chip, vis } from "../components/ui";
import { lerp, ramp } from "../utils/anim";
import type { SceneProps } from "./scenes";
import { Arrow, G, GOLD, GREEN, GREY, ink, orange, Person, RED, SAND, seg, SimpleNote, SOFT, Stamp, SvgFrame, teal, Txt, useT, WARM } from "./kit";

const PAPER = "#FFFDF4";
export const DENIM = "#7FA3CF";
export const DENIM2 = "#5E84B8";

/* ------------------------------------------------------------------ piezas locales */
const Note: React.FC<{ x: number; y: number; text: string; o: number; size?: number; fill?: string }> = ({ x, y, text, o, size = 30, fill = GREY }) => (
  <G o={o}>
    <Txt x={x} y={y} size={size} weight={600} fill={fill}>
      {text}
    </Txt>
  </G>
);

const Chips: React.FC<{ t: number; c: number[]; list: ([string] | [string, boolean])[] }> = ({ t, c, list }) => (
  <>
    {list.map(([text, hot], k) => (
      <Chip key={k} text={text} x={960} y={50} o={seg(t, c, k)} color={hot ? orange : undefined} />
    ))}
  </>
);

const Card: React.FC<{ x: number; y: number; w: number; h: number; o?: number; hot?: boolean }> = ({ x, y, w, h, o = 1, hot = false }) => (
  <G x={x} y={y} o={o}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={14} fill={PAPER} stroke={hot ? orange : ink} strokeWidth={6} />
  </G>
);

/** Etiqueta de fecha generica: palabra + "00/00". */
const Lab: React.FC<{ x: number; y: number; text: string; date?: string; s?: number; o?: number; rot?: number; color?: string }> = ({ x, y, text, date, s = 1, o = 1, rot = 0, color = ink }) => {
  const w = Math.max(text.length * 21 + 60, 150);
  return (
    <G x={x} y={y} s={s} o={o} rot={rot}>
      <rect x={-w / 2} y={-46} width={w} height={92} rx={10} fill="#fff" stroke={color} strokeWidth={5} />
      <Txt x={0} y={date ? -15 : 2} size={32} fill={color}>
        {text}
      </Txt>
      {date && (
        <Txt x={0} y={22} size={36} fill={ink}>
          {date}
        </Txt>
      )}
    </G>
  );
};

const Yogurt: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-70 -150 H70 L55 0 H-55 Z" fill="#fff" stroke={ink} strokeWidth={6} strokeLinejoin="round" />
    <rect x={-78} y={-170} width={156} height={26} rx={8} fill={teal} stroke={ink} strokeWidth={5} />
    <rect x={-48} y={-120} width={96} height={56} rx={8} fill={SOFT} />
  </G>
);

const Chicken: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-120} y={-70} width={240} height={70} rx={12} fill={SAND} stroke={ink} strokeWidth={6} />
    <ellipse cx={0} cy={-84} rx={84} ry={42} fill={WARM} stroke={ink} strokeWidth={6} />
    <path d="M-72 -104 Q0 -150 72 -104" fill="none" stroke="#fff" strokeWidth={6} opacity={0.7} />
    <circle cx={92} cy={-108} r={12} fill="#fff" stroke={ink} strokeWidth={4} />
  </G>
);

const Star: React.FC<{ x: number; y: number; o?: number; s?: number }> = ({ x, y, o = 1, s = 1 }) => (
  <G x={x} y={y} o={o} s={s}>
    <polygon points="0,-34 10,-11 35,-11 15,5 22,30 0,16 -22,30 -15,5 -35,-11 -10,-11" fill={GOLD} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
  </G>
);

const Shield: React.FC<{ x: number; y: number; o?: number; s?: number }> = ({ x, y, o = 1, s = 1 }) => (
  <G x={x} y={y} o={o} s={s}>
    <path d="M0 -36 L30 -26 V4 Q30 26 0 40 Q-30 26 -30 4 V-26 Z" fill={teal} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
    <polyline points="-12,2 -3,12 14,-10" fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
  </G>
);

const Cross: React.FC<{ x: number; y: number; w: number; o?: number }> = ({ x, y, w, o = 1 }) => (
  <G o={o}>
    <line x1={x - w} y1={y + w} x2={x + w} y2={y - w} stroke={RED} strokeWidth={12} strokeLinecap="round" />
  </G>
);

/** Linea de tiempo horizontal: pts = [x, etiqueta]; n = cuantos puntos estan encendidos (fraccion permitida). */
const Line: React.FC<{ y: number; pts: [number, string][]; n: number; o?: number }> = ({ y, pts, n, o = 1 }) => (
  <G o={o}>
    <line x1={pts[0][0] - 80} y1={y} x2={pts[pts.length - 1][0] + 80} y2={y} stroke={GREY} strokeWidth={6} strokeLinecap="round" />
    {pts.map(([px, lb], i) => (
      <G key={lb} o={Math.min(1, Math.max(0.25, n - i + 0.25))}>
        <circle cx={px} cy={y} r={n > i + 0.5 ? 16 : 11} fill={n > i + 0.5 ? orange : "#fff"} stroke={ink} strokeWidth={5} />
        <Txt x={px} y={y + 46} size={36} fill={n > i + 0.5 ? ink : GREY}>
          {lb}
        </Txt>
      </G>
    ))}
  </G>
);

/** Vaquero generico (sin costuras de marca). hi = resalta el bolsillo pequeno; pocket = visible. */
export const Jeans: React.FC<{ x: number; y: number; s?: number; o?: number; hi?: number; small?: number; fill?: string; band?: string }> = ({ x, y, s = 1, o = 1, hi = 0, small = 1, fill = DENIM, band = DENIM2 }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-150 -240 H150 L172 290 H24 L0 -10 L-24 290 H-172 Z" fill={fill} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
    <rect x={-150} y={-262} width={300} height={50} rx={6} fill={band} stroke={ink} strokeWidth={6} />
    <line x1={0} y1={-212} x2={0} y2={-10} stroke={ink} strokeWidth={4} />
    <path d="M30 -212 Q40 -96 152 -118" fill="none" stroke={ink} strokeWidth={4} strokeDasharray="12 8" />
    <path d="M-30 -212 Q-40 -96 -152 -118" fill="none" stroke={ink} strokeWidth={4} strokeDasharray="12 8" />
    {small > 0 && (
      <G o={small}>
        <rect x={62} y={-200} width={58} height={56} rx={5} fill={hi > 0.5 ? "#FFD2A8" : "#9BB9DE"} stroke={hi > 0.5 ? orange : ink} strokeWidth={hi > 0.5 ? 7 : 4} />
      </G>
    )}
  </G>
);

/** Mano generica (palma y cuatro dedos). */
export const Hand: React.FC<{ x: number; y: number; s?: number; o?: number; rot?: number }> = ({ x, y, s = 1, o = 1, rot = 0 }) => (
  <G x={x} y={y} s={s} o={o} rot={rot}>
    <rect x={-34} y={-30} width={68} height={74} rx={18} fill="#F1D5B0" stroke={ink} strokeWidth={4} />
    {[-24, -8, 8, 24].map((fx) => (
      <rect key={fx} x={fx - 7} y={-76} width={14} height={52} rx={7} fill="#F1D5B0" stroke={ink} strokeWidth={4} />
    ))}
    <rect x={30} y={-14} width={42} height={16} rx={8} fill="#F1D5B0" stroke={ink} strokeWidth={4} transform="rotate(-24 30 -6)" />
  </G>
);

/* ------------------------------------------------------------------ hook (0-4) */
const SceneHook: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const all = seg(t, c, 0, 4);
  const ic = seg(t, c, 3);
  const wB = ramp(t, c[1] + 2.3, c[1] + 2.7);
  const wU = ramp(t, c[1] + 3.4, c[1] + 3.8);
  const sh = t > c[2] + 1.2 && t < c[2] + 2.3 ? Math.sin(t * 38) * 5 : 0;
  const sep = ramp(t, c[2] + 1.5, c[2] + 2.1);
  return (
    <>
      <SvgFrame>
        <G o={all}>
          <Yogurt x={560} y={560} s={1.5} />
          <Chicken x={1360} y={560} s={1.5} />
          <line x1={240} y1={560} x2={1680} y2={560} stroke={ink} strokeWidth={5} />
          <Note x={960} y={450} text="Examples only" o={all} size={34} fill={GREY} />
          <Lab x={560} y={670} text="DATE" s={1.2} o={1 - wB} />
          <Lab x={1360} y={670} text="DATE" s={1.2} o={1 - wU} />
          <Lab x={560 - 40 * sep} y={670} text="BEST BEFORE" date="00/00" s={1.2} o={wB} rot={sh} />
          <Lab x={1360 + 40 * sep} y={670} text="USE BY" date="00/00" s={1.2} o={wU} rot={-sh} />
        </G>
        <G o={ic}>
          <Star x={560} y={125} s={2.3} o={vis(t, c[3] + 4.0)} />
          <Note x={560} y={232} text="QUALITY" o={vis(t, c[3] + 4.2)} size={50} fill={ink} />
          <Shield x={1360} y={125} s={2.3} o={vis(t, c[3] + 5.4)} />
          <Note x={1360} y={232} text="SAFETY" o={vis(t, c[3] + 5.6)} size={50} fill={teal} />
        </G>
        <G o={seg(t, c, 4)}>
          <Txt x={960} y={225} size={180} serif fill={orange}>
            WHY?
          </Txt>
        </G>
      </SvgFrame>
      <SimpleNote o={ic} />
      <Chips t={t} c={c} list={[["YOUR FRIDGE"], ["TWO DATES"], ["LOOK ALIKE"], ["QUALITY OR SAFETY?"], ["WHY TWO DATES?", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ official (5-10) */
const SceneOfficial: React.FC<{ cues: number[]; dur: number }> = ({ cues: c }) => {
  const t = useT();
  const cols = seg(t, c, 0, 2);
  const s3 = seg(t, c, 3);
  const s5 = seg(t, c, 4);
  return (
    <>
      <SvgFrame>
        <G o={cols}>
          <Note x={960} y={160} text="EUROPEAN FOOD SAFETY AUTHORITY, 2020" o={vis(t, c[0] + 0.4)} size={40} fill={teal} />
          <Card x={540} y={400} w={700} h={420} hot={false} o={vis(t, c[0] + 1.0)} />
          <Card x={1380} y={400} w={700} h={420} o={vis(t, c[0] + 1.0)} />
          <Txt x={540} y={245} size={64} fill={ink}>
            USE BY
          </Txt>
          <Txt x={1380} y={245} size={64} fill={ink}>
            BEST BEFORE
          </Txt>
          <G o={vis(t, c[1] + 0.5)}>
            <Shield x={540} y={385} s={2.0} />
            <Txt x={540} y={480} size={42} fill={ink}>
              eat until this date,
            </Txt>
            <Txt x={540} y={530} size={42} fill={ink}>
              not after
            </Txt>
          </G>
          <G o={vis(t, c[2] + 0.5)}>
            <Star x={1380} y={385} s={2.0} />
            <Txt x={1380} y={480} size={42} fill={ink}>
              safe to eat after it,
            </Txt>
            <Txt x={1380} y={530} size={42} fill={ink}>
              maybe not at its best
            </Txt>
          </G>
          <Note x={960} y={690} text="OFFICIAL DEFINITION" o={vis(t, c[1] + 0.6)} size={44} fill={orange} />
        </G>
        <G o={s3}>
          <Note x={960} y={160} text="SPAIN'S FOOD SAFETY AGENCY, 2024" o={vis(t, c[3] + 0.4)} size={40} fill={teal} />
          <Card x={960} y={400} w={1100} h={340} o={vis(t, c[3] + 0.8)} />
          <G o={vis(t, c[3] + 3.3)}>
            <Txt x={960} y={330} size={64} fill={ink}>
              consumo preferente = calidad
            </Txt>
            <Star x={240} y={330} s={1.4} />
          </G>
          <G o={vis(t, c[3] + 7.0)}>
            <Txt x={960} y={460} size={64} fill={orange}>
              caducidad = seguridad
            </Txt>
            <Shield x={1680} y={460} s={1.4} />
          </G>
        </G>
        <G o={s5}>
          <Card x={960} y={330} w={1200} h={260} hot o={vis(t, c[4] + 2.6)} />
          <G o={vis(t, c[4] + 2.8)}>
            <Txt x={960} y={300} size={72} fill={orange} spacing={3}>
              NOT MEDICAL ADVICE
            </Txt>
            <Txt x={960} y={380} size={56} fill={ink}>
              read your label
            </Txt>
          </G>
          <Lab x={960} y={600} text="STORE: ..." s={1.4} o={vis(t, c[4] + 6.4)} color={teal} />
        </G>
      </SvgFrame>
      
      <Chips t={t} c={c} list={[["OFFICIAL DEFINITIONS"], ["USE BY = SAFETY"], ["BEST BEFORE = QUALITY"], ["SPAIN SAYS THE SAME"], ["READ THE LABEL", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ chooser (11-12) */
const SceneChooser: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const all = seg(t, c, 0, 1);
  const lit = 1;
  const nodes: [number, string][] = [[760, "PRODUCT"], [1210, "HANDLING"], [1660, "STORAGE"]];
  return (
    <>
      <SvgFrame>
        <G o={all}>
          <Person x={190} y={640} s={2} body={WARM} hat />
          <Lab x={400} y={560} text="BEST BEFORE" s={0.8} o={vis(t, c[0] + 1.0)} />
          <Lab x={400} y={650} text="USE BY" s={0.8} o={vis(t, c[0] + 1.4)} color={teal} />
          <G o={vis(t, c[0] + 4.0)}>
            <rect x={1010} y={180} width={400} height={90} rx={14} fill={PAPER} stroke={ink} strokeWidth={6} />
            <Txt x={1210} y={226} size={40} fill={ink}>
              WHICH LABEL?
            </Txt>
            {nodes.map(([nx], i) => (
              <g key={nx} opacity={vis(t, c[0] + 5.0 + i * 0.3)}>
                <path d={`M1210 270 V320 H${nx + 0} V400`} fill="none" stroke={ink} strokeWidth={6} />
              </g>
            ))}
          </G>
          {nodes.map(([nx, lb], i) => (
            <G key={lb} o={vis(t, c[1] + [0.9, 2.0, 3.3][i])}>
              <rect x={nx - 190} y={400} width={380} height={140} rx={16} fill={lit > 0.5 ? "#FFE8D2" : PAPER} stroke={lit > 0.5 ? orange : ink} strokeWidth={6} />
              <Txt x={nx} y={470} size={48} fill={ink}>
                {lb}
              </Txt>
            </G>
          ))}
        </G>
        <G o={seg(t, c, 1)}>
          {/* iconos: caja, manos, nevera */}
          <G x={760} y={620} o={vis(t, c[1] + 1.0)}>
            <rect x={-50} y={-50} width={100} height={80} fill={SAND} stroke={ink} strokeWidth={5} />
            <line x1={-50} y1={-20} x2={50} y2={-20} stroke={ink} strokeWidth={4} />
          </G>
          <Hand x={1210} y={650} s={1.2} o={vis(t, c[1] + 2.1)} />
          <G x={1660} y={620} o={vis(t, c[1] + 3.4)}>
            <rect x={-44} y={-90} width={88} height={130} rx={10} fill="#fff" stroke={ink} strokeWidth={5} />
            <line x1={-44} y1={-30} x2={44} y2={-30} stroke={ink} strokeWidth={4} />
            <line x1={26} y1={-78} x2={26} y2={-48} stroke={ink} strokeWidth={5} strokeLinecap="round" />
          </G>
        </G>
      </SvgFrame>
      <SimpleNote o={all} />
      <Chips t={t} c={c} list={[["WHO CHOOSES?"], ["THE DECISION TOOL", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ history (13-20) */
const TL: [number, string][] = [[360, "1950s"], [760, "1970"], [1160, "1973"], [1560, "1980s"]];

const Crate: React.FC<{ x: number; y: number; s?: number; o?: number; tag?: boolean }> = ({ x, y, s = 1, o = 1, tag = false }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-60} y={-90} width={120} height={90} fill={SAND} stroke={ink} strokeWidth={5} />
    <line x1={-60} y1={-45} x2={60} y2={-45} stroke={ink} strokeWidth={4} />
    {tag && (
      <>
        <rect x={-34} y={-36} width={68} height={26} rx={4} fill="#fff" stroke={orange} strokeWidth={4} />
        <Txt x={0} y={-22} size={20} fill={ink}>
          00/00
        </Txt>
      </>
    )}
  </G>
);

const Store: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-150} y={-190} width={300} height={190} fill={SAND} stroke={ink} strokeWidth={6} />
    <path d="M-170 -190 H170 L150 -130 H-150 Z" fill={teal} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
    <rect x={-120} y={-110} width={150} height={90} fill={SOFT} stroke={ink} strokeWidth={5} />
    <rect x={60} y={-110} width={60} height={110} fill={WARM} stroke={ink} strokeWidth={5} />
  </G>
);

const Flask: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-24 -150 H24 V-90 L80 0 Q90 24 60 24 H-60 Q-90 24 -80 0 L-24 -90 Z" fill={SOFT} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
    <path d="M-52 -20 H52 L70 6 Q74 18 56 18 H-56 Q-74 18 -70 6 Z" fill={teal} opacity={0.6} />
  </G>
);

const SceneHistory: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
    const n = ramp(t, c[1] + 4.4, c[1] + 4.8) + ramp(t, c[2] + 3.6, c[2] + 4.0) + ramp(t, c[2] + 5.9, c[2] + 6.3) + ramp(t, c[3] + 1.0, c[3] + 1.4);
  const split = ramp(t, c[3] + 1.9, c[3] + 2.7);
  const mv = ramp(t, c[2] + 3.3, c[2] + 3.9);
  return (
    <>
      <SvgFrame>
        <Line y={150} pts={TL} n={n} o={seg(t, c, 1, 4)} />
        <G o={k(0)}>
          <Flask x={560} y={560} s={1.7} />
          <Cross x={560} y={430} w={150} o={vis(t, c[0] + 2.9)} />
          <Txt x={560} y={650} size={36} fill={GREY}>
            a food safety lab?
          </Txt>
          <G o={vis(t, c[0] + 3.2)}>
            <Crate x={1250} y={560} s={1.6} />
            <Crate x={1450} y={560} s={1.6} />
            <Crate x={1350} y={456} s={1.6} />
          </G>
          <Note x={1350} y={650} text="a warehouse door?" o={vis(t, c[0] + 3.3)} size={36} fill={GREY} />
        </G>
        <G o={k(1)}>
          <Store x={620} y={600} s={1.7} o={vis(t, c[1] + 2.4)} />
          <Note x={620} y={690} text="MARKS AND SPENCER" o={vis(t, c[1] + 3.1)} size={38} fill={ink} />
          <G o={vis(t, c[1] + 0.8)}>
            <rect x={1130} y={260} width={460} height={320} rx={8} fill={PAPER} stroke={ink} strokeWidth={6} transform="rotate(3 1360 420)" />
            <Txt x={1360} y={340} size={44} serif fill={ink}>
              The Spectator
            </Txt>
            <Txt x={1360} y={400} size={34} fill={GREY}>
              2022
            </Txt>
            {[460, 500, 540].map((ly) => (
              <line key={ly} x1={1180} y1={ly} x2={1540} y2={ly} stroke={GREY} strokeWidth={6} strokeLinecap="round" />
            ))}
          </G>
          <Note x={1360} y={640} text="Illustration, not the original page" o={vis(t, c[1] + 1.5)} size={28} />
        </G>
        <G o={k(2)}>
          <G o={1 - mv}>
            <Crate x={760} y={600} s={2} tag />
            <Crate x={940} y={600} s={2} tag />
            <Crate x={850} y={474} s={2} tag />
            <Person x={1380} y={600} s={2} body={WARM} />
            <Cross x={1160} y={420} w={46} o={vis(t, c[2] + 2.8)} />
            <Stamp x={1130} y={660} text="STOCKROOM ONLY" o={vis(t, c[2] + 2.6)} size={44} />
          </G>
          <G o={mv}>
            <rect x={380} y={470} width={1000} height={26} fill={SAND} stroke={ink} strokeWidth={5} />
            <rect x={380} y={350} width={1000} height={26} fill={SAND} stroke={ink} strokeWidth={5} />
            {[460, 640, 820, 1000, 1180].map((px, i) => (
              <Yogurt key={px} x={px} y={i % 2 ? 470 : 350} s={0.5} />
            ))}
            <Lab x={1640} y={440} text="SELL BY" date="00/00" s={1.5} o={vis(t, c[2] + 7.4)} />
          </G>
        </G>
        <G o={k(3)}>
          <Lab x={960 - 380 * split} y={420 + 0} text="SELL BY" date="00/00" s={1.5} o={1 - split} />
          <Lab x={560} y={420} text="BEST BEFORE" date="00/00" s={1.5} o={split} />
          <Lab x={1360} y={420} text="USE BY" date="00/00" s={1.5} o={split} color={teal} />
          <Note x={560} y={560} text="ADVISORY" o={vis(t, c[3] + 5.5)} size={50} fill={ink} />
          <Note x={1360} y={560} text="GENUINE RISK" o={vis(t, c[3] + 7.4)} size={50} fill={teal} />
          <Note x={960} y={690} text="The Spectator" o={vis(t, c[3] + 4.1)} size={40} fill={GREY} />
        </G>
        <G o={k(4)}>
          <Stamp x={960} y={330} text="ONE ACCOUNT" o={vis(t, c[4] + 0.6)} size={80} />
          <Card x={560} y={560} w={480} h={150} o={vis(t, c[4] + 1.6)} />
          <Card x={1360} y={560} w={480} h={150} o={vis(t, c[4] + 2.2)} />
          <Txt x={560} y={560} size={46} fill={ink}>
            a magazine
          </Txt>
          <Txt x={1360} y={560} size={46} fill={ink}>
            the store's page
          </Txt>
          <G o={vis(t, c[4] + 3.0)}>
            <Txt x={960} y={720} size={56} fill={orange}>
              dates began as a store tool?
            </Txt>
          </G>
        </G>
      </SvgFrame>
      <SimpleNote o={k(0)} />
      <Chips
        t={t}
        c={c}
        list={[["WHERE DID DATES COME FROM?"], ["THE 1950S"], ["STOCKROOM, SHELF, SELL-BY"], ["THE 1980S: TWO LABELS"], ["ONE ACCOUNT", true]]}
      />
    </>
  );
};

/* ------------------------------------------------------------------ other (21-25) */
const SceneOther: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Lab x={460} y={420} text="BEST BEFORE" date="00/00" s={1.3} />
          <Lab x={1460} y={420} text="USE BY" date="00/00" s={1.3} color={teal} />
          <Lab x={960} y={420} text="SELL BY" date="00/00" s={1.5} o={vis(t, c[0] + 1.3)} color={orange} />
          <Note x={960} y={600} text="A THIRD DATE" o={vis(t, c[0] + 0.9)} size={64} fill={orange} />
        </G>
        <G o={k(1)}>
          <Note x={960} y={140} text="USDA PUBLISHED GUIDANCE" o={vis(t, c[1] + 0.3)} size={40} fill={teal} />
          <Note x={960} y={186} text="archived 2004, reposted 2017" o={vis(t, c[1] + 0.6)} size={30} fill={GREY} />
          <rect x={380} y={470} width={1160} height={26} fill={SAND} stroke={ink} strokeWidth={5} />
          {[560, 800, 1040, 1280].map((px) => (
            <Yogurt key={px} x={px} y={470} s={0.9} />
          ))}
          <Lab x={960} y={600} text="SELL BY" date="00/00" s={1.1} o={vis(t, c[1] + 3.8)} color={orange} />
          <Note x={960} y={235} text="tells the store how long to display" o={vis(t, c[1] + 4.8)} size={44} fill={ink} />
          <Stamp x={1420} y={650} text="NOT A SAFETY DATE" o={vis(t, c[1] + 7.6)} size={44} />
        </G>
        <G o={k(2)}>
          <G x={560} y={600} o={vis(t, c[2] + 1.6)}>
            <rect x={-40} y={-210} width={80} height={210} rx={22} fill="#fff" stroke={ink} strokeWidth={6} />
            <rect x={-26} y={-250} width={52} height={44} rx={10} fill={teal} stroke={ink} strokeWidth={5} />
            <rect x={-26} y={-150} width={52} height={40} rx={6} fill={SOFT} />
          </G>
          <Note x={560} y={680} text="INFANT FORMULA" o={vis(t, c[2] + 1.8)} size={40} fill={ink} />
          <Stamp x={560} y={210} text="EXCEPTION" o={vis(t, c[2] + 2.2)} size={50} color={teal} />
          {[["meat", 1140], ["poultry", 1360], ["eggs", 1580]].map(([lb, px], i) => (
            <G key={lb as string} o={vis(t, c[2] + 2.8 + i * 0.3)}>
              <Lab x={px as number} y={470} text="OPTIONAL" date="00/00" s={0.75} color={GREY} />
              <Txt x={px as number} y={380} size={36} fill={GREY}>
                {lb}
              </Txt>
            </G>
          ))}
          <Stamp x={1300} y={650} rot={-3} text="NOT REQUIRED FEDERALLY (EXCEPT INFANT FORMULA)" o={vis(t, c[2] + 3.8)} size={26} pad={90} color={teal} />
        </G>
        <G o={k(3)}>
          <Note x={580} y={160} text="EUROPE" o={vis(t, c[3] + 4.4)} size={56} fill={ink} />
          <Note x={1340} y={160} text="USA GUIDANCE" o={vis(t, c[3] + 0.4)} size={56} fill={ink} />
          <Lab x={580} y={330} text="USE BY" date="00/00" s={1.4} o={vis(t, c[3] + 4.6)} color={teal} />
          <Lab x={1340} y={330} text="USE BY" date="00/00" s={1.4} o={vis(t, c[3] + 0.9)} color={teal} />
          <Shield x={580} y={520} s={2.4} o={vis(t, c[3] + 4.9)} />
          <Note x={580} y={660} text="SAFETY" o={vis(t, c[3] + 5.1)} size={52} fill={teal} />
          <Star x={1340} y={520} s={2.4} o={vis(t, c[3] + 1.5)} />
          <Note x={1340} y={660} text="PEAK QUALITY" o={vis(t, c[3] + 1.7)} size={52} fill={ink} />
          <G o={vis(t, c[3] + 5.4)}>
            <Txt x={960} y={420} size={90} fill={orange}>
              =/=
            </Txt>
          </G>
          <Note x={960} y={745} text="same words, different meaning" o={vis(t, c[3] + 5.4)} size={44} fill={orange} />
        </G>
        <G o={k(4)}>
          <G x={760} y={600}>
            <rect x={-130} y={-220} width={260} height={140} rx={8} fill={SOFT} stroke={ink} strokeWidth={6} />
            <path d="M-130 -160 H-170 V-210" fill="none" stroke={ink} strokeWidth={8} strokeLinecap="round" />
            <circle cx={-80} cy={-50} r={20} fill={ink} />
            <circle cx={80} cy={-50} r={20} fill={ink} />
            <line x1={-130} y1={-80} x2={130} y2={-80} stroke={ink} strokeWidth={6} />
          </G>
          <Lab x={1260} y={400} text="USE BY" date="00/00" s={1.3} color={teal} />
          <Txt x={1260} y={560} size={200} serif fill={orange}>
            ?
          </Txt>
          <Note x={960} y={730} text="check the label where you shop" o={vis(t, c[4] + 1.6)} size={46} fill={ink} />
        </G>
      </SvgFrame>
      <SimpleNote o={k(3)} />
      <Chips t={t} c={c} list={[["THE THIRD DATE"], ["SELL BY"], ["ONLY ONE EXCEPTION"], ["SAME WORDS, DIFFERENT MEANING", true], ["CHECK WHERE YOU SHOP"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ waste (26-29) */
const SceneWaste: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const bar = ramp(t, c[1] + 4.5, c[1] + 6.0);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <G x={960} y={640}>
            <path d="M-140 -250 H140 L120 0 H-120 Z" fill="#fff" stroke={ink} strokeWidth={7} strokeLinejoin="round" />
            <rect x={-160} y={-290} width={320} height={40} rx={10} fill={GREY} stroke={ink} strokeWidth={6} />
            {[-70, 0, 70].map((lx) => (
              <line key={lx} x1={lx} y1={-210} x2={lx * 0.9} y2={-40} stroke={ink} strokeWidth={5} />
            ))}
            <circle cx={-30} cy={-320} r={34} fill={orange} stroke={ink} strokeWidth={5} />
            <rect x={30} y={-340} width={60} height={26} rx={8} fill={GREEN} stroke={ink} strokeWidth={5} />
          </G>
          <Note x={960} y={730} text="WASTE" o={vis(t, c[0] + 0.4)} size={70} fill={orange} />
        </G>
        <G o={k(1, 2)}>
          <Note x={960} y={140} text="EU FOOD WASTE EACH YEAR" o={vis(t, c[1] + 0.6)} size={44} fill={teal} />
          <rect x={260} y={300} width={1400} height={100} rx={10} fill={SOFT} stroke={ink} strokeWidth={6} />
          <rect x={1520} y={300} width={140} height={100} fill={orange} stroke={ink} strokeWidth={6} opacity={bar} />
          <G o={vis(t, c[1] + 5.5)}>
            <Txt x={960} y={350} size={60} fill={ink}>
              88 million tonnes
            </Txt>
          </G>
          <G o={bar}>
            <Txt x={1590} y={250} size={64} fill={orange}>
              up to 10 %
            </Txt>
            </G>
          <G o={vis(t, c[1] + 9.4)}>
            <Txt x={1590} y={470} size={38} fill={ink}>
              linked to date marking
            </Txt>
          </G>
          <Note x={960} y={640} text="EFSA 2020, estimate by the European Commission" o={vis(t, c[1] + 8.0)} size={34} fill={GREY} />
          <Stamp x={620} y={560} text="LINKED, NOT CAUSED" o={vis(t, c[2] + 0.4)} size={52} />
          <Stamp x={1360} y={560} text="ESTIMATE" o={vis(t, c[2] + 1.5)} size={52} color={teal} rot={6} />
        </G>
        <G o={k(3)}>
          <Line y={300} pts={[[360, "1950s"], [960, "2022"]]} n={ramp(t, c[3] + 1.0, c[3] + 1.4) + ramp(t, c[3] + 2.3, c[3] + 2.7)} />
          <Note x={360} y={410} text="stockroom codes" o={vis(t, c[3] + 1.3)} size={40} fill={ink} />
          <Note x={960} y={410} text="drops sell-by dates" o={vis(t, c[3] + 5.6)} size={40} fill={ink} />
          <path d="M1060 330 Q1560 470 460 560 Q420 566 380 520" fill="none" stroke={orange} strokeWidth={9} strokeDasharray="22 14" strokeLinecap="round" opacity={vis(t, c[3] + 8.8)} />
          <Arrow x1={450} y1={560} x2={375} y2={520} color={orange} o={vis(t, c[3] + 9.2)} w={9} />
          {[1300, 1460, 1620].map((fx, i) => (
            <G key={fx} o={vis(t, c[3] + 7.1 + i * 0.3)}>
              <circle cx={fx} cy={560} r={46} fill={i === 1 ? teal : ink} stroke={ink} strokeWidth={5} />
              <Lab x={fx} y={470} text="SELL BY" s={0.5} color={GREY} />
              <Cross x={fx} y={470} w={34} />
            </G>
          ))}
          <Note x={960} y={730} text="The Spectator, 2022" o={vis(t, c[3] + 3.4)} size={36} fill={GREY} />
        </G>
      </SvgFrame>
      <SimpleNote o={k(1, 2)} />
      <Chips t={t} c={c} list={[["WHY IT MATTERS"], ["AN ESTIMATE FROM 2020"], ["LINKED, NOT CAUSED"], ["FULL CIRCLE", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ practical (30-34) */
const SceneReal: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const step = (n: number, y: number, text: string, o: number) => (
    <G o={o}>
      <circle cx={260} cy={y} r={46} fill={orange} stroke={ink} strokeWidth={6} />
      <Txt x={260} y={y + 2} size={60} fill="#fff">
        {String(n)}
      </Txt>
      <Txt x={420} y={y + 2} size={0} fill={ink}>
        {text}
      </Txt>
    </G>
  );
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Txt x={960} y={290} size={150} fill={ink} spacing={8}>
            PRACTICAL
          </Txt>
          <Card x={960} y={520} w={1160} h={150} hot o={vis(t, c[0] + 1.5)} />
          <G o={vis(t, c[0] + 1.6)}><Txt x={960} y={520} size={62} fill={orange} spacing={3}>
            NOT MEDICAL ADVICE
          </Txt></G>
        </G>
        <G o={k(1)}>
          {step(1, 360, "", 1)}
          <Lab x={900} y={420} text="BEST BEFORE" date="00/00" s={1.5} o={vis(t, c[1] + 0.8)} />
          <Lab x={1320} y={420} text="USE BY" date="00/00" s={1.5} color={teal} o={vis(t, c[1] + 0.8)} />
          <G x={1100} y={300} o={vis(t, c[1] + 1.6)}>
            <circle r={120} fill="none" stroke={orange} strokeWidth={14} />
            <line x1={86} y1={86} x2={170} y2={170} stroke={orange} strokeWidth={18} strokeLinecap="round" />
          </G>
          <Note x={1100} y={640} text="not the same message" o={vis(t, c[1] + 3.6)} size={50} fill={ink} />
        </G>
        <G o={k(2)}>
          {step(2, 360, "", 1)}
          <Lab x={620} y={440} text="STORE: ..." s={1.8} color={teal} />
          <path d="M1240 330 V400" fill="none" stroke={ink} strokeWidth={6} opacity={vis(t, c[2] + 4.4)} />
          <G o={vis(t, c[2] + 2.8)}>
            <rect x={1060} y={250} width={360} height={80} rx={12} fill={PAPER} stroke={ink} strokeWidth={6} />
            <Txt x={1240} y={292} size={36} fill={ink}>
              DECISION TOOL
            </Txt>
          </G>
          <G o={vis(t, c[2] + 4.5)}>
            <rect x={1100} y={400} width={280} height={110} rx={14} fill="#FFE8D2" stroke={orange} strokeWidth={6} />
            <Txt x={1240} y={456} size={44} fill={ink}>
              STORAGE
            </Txt>
          </G>
          <Note x={960} y={640} text="no temperatures, no days: read your pack" o={vis(t, c[2] + 5.6)} size={42} fill={ink} />
        </G>
        <G o={k(3)}>
          {step(3, 360, "", 1)}
          <Lab x={720} y={440} text="USE BY" date="00/00" s={1.5} color={teal} />
          <Shield x={1180} y={430} s={2.6} />
          <Note x={1180} y={560} text="your food agency" o={vis(t, c[3] + 2.0)} size={44} fill={teal} />
          <G o={vis(t, c[3] + 3.2)}>
            <Txt x={1500} y={430} size={200} serif fill={GREY}>
              ?
            </Txt>
            <Cross x={1500} y={430} w={110} />
          </G>
          <Note x={960} y={700} text="follow the label, not a guess" o={vis(t, c[3] + 1.2)} size={52} fill={orange} />
        </G>
      </SvgFrame>
      <Chips t={t} c={c} list={[["THE PRACTICAL PART"], ["1. READ THE WORDS"], ["2. READ THE STORAGE"], ["3. NOT A GUESS", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ close (35-37) */
const SceneClose: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const reach = ramp(t, c[1] + 3.4, c[1] + 5.0);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Lab x={560} y={380} text="BEST BEFORE" date="00/00" s={1.5} />
          <Lab x={1360} y={380} text="USE BY" date="00/00" s={1.5} color={teal} />
          <Note x={560} y={560} text="Is it at its BEST?" o={vis(t, c[0] + 3.4)} size={60} fill={ink} />
          <Note x={1360} y={560} text="Is it SAFE?" o={vis(t, c[0] + 2.3)} size={60} fill={teal} />
        </G>
        <G o={k(1)}>
          <Jeans x={960} y={470} s={1.15} />
          <Hand x={lerp(1340, 1210, reach)} y={lerp(300, 380, reach)} s={1.4} rot={-30} />
        </G>
        <G o={k(2)}>
          <rect x={560} y={160} width={800} height={520} rx={30} fill={DENIM} stroke={ink} strokeWidth={8} />
          <path d="M560 260 Q600 600 1360 560" fill="none" stroke={ink} strokeWidth={6} strokeDasharray="14 10" />
          <rect x={1030} y={200} width={230} height={190} rx={10} fill="#FFD2A8" stroke={orange} strokeWidth={9} />
          <Note x={820} y={470} text="?" o={vis(t, c[2] + 2.0)} size={240} fill={orange} />
        </G>
      </SvgFrame>
      <Chips t={t} c={c} list={[["TWO QUESTIONS"], ["YOUR JEANS POCKET"], ["WHY IS IT THERE?", true]]} />
    </>
  );
};

export const SCENES009: Record<string, React.FC<SceneProps>> = {
  "hook": SceneHook,
  "official": SceneOfficial,
  "chooser": SceneChooser,
  "history": SceneHistory,
  "other": SceneOther,
  "waste": SceneWaste,
  "practical": SceneReal,
  "close": SceneClose,
};
