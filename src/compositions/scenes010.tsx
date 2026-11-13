import React from "react";
import { Chip, vis } from "../components/ui";
import { lerp, ramp } from "../utils/anim";
import type { SceneProps } from "./scenes";
import { DENIM, DENIM2, Hand, Jeans } from "./scenes009";
import { G, GOLD, GREEN, GREY, ink, orange, Person, RED, SAND, seg, SimpleNote, SOFT, Speech, Stamp, SvgFrame, teal, Txt, useT, WARM } from "./kit";

const PAPER = "#FFFDF4";
const COPPER = "#C77B45";

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

const Line: React.FC<{ y: number; x: number; label: string; o: number }> = ({ y, x, label, o }) => (
  <G o={o}>
    <line x1={x - 260} y1={y} x2={x + 260} y2={y} stroke={GREY} strokeWidth={6} strokeLinecap="round" />
    <circle cx={x} cy={y} r={16} fill={orange} stroke={ink} strokeWidth={5} />
    <Txt x={x} y={y + 50} size={44} fill={ink}>
      {label}
    </Txt>
  </G>
);

const PocketWatch: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <circle cy={-100} r={26} fill="none" stroke={GOLD} strokeWidth={10} />
    <rect x={-12} y={-86} width={24} height={20} rx={5} fill={GOLD} stroke={ink} strokeWidth={4} />
    <circle r={74} fill={GOLD} stroke={ink} strokeWidth={6} />
    <circle r={56} fill="#fff" stroke={ink} strokeWidth={4} />
    {[0, 90, 180, 270].map((a) => (
      <line key={a} x1={0} y1={-46} x2={0} y2={-38} stroke={ink} strokeWidth={4} transform={`rotate(${a})`} />
    ))}
    <line x1={0} y1={0} x2={0} y2={-38} stroke={ink} strokeWidth={5} strokeLinecap="round" />
    <line x1={0} y1={0} x2={24} y2={10} stroke={ink} strokeWidth={5} strokeLinecap="round" />
  </G>
);

const Wrist: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-60} y={-40} width={120} height={80} rx={26} fill="#F1D5B0" stroke={ink} strokeWidth={5} />
    <rect x={-60} y={-18} width={120} height={36} fill={teal} stroke={ink} strokeWidth={4} />
    <circle r={34} fill="#fff" stroke={ink} strokeWidth={5} />
    <line x1={0} y1={0} x2={0} y2={-22} stroke={ink} strokeWidth={4} strokeLinecap="round" />
    <line x1={0} y1={0} x2={14} y2={6} stroke={ink} strokeWidth={4} strokeLinecap="round" />
  </G>
);

const Breeches: React.FC<{ x: number; y: number; s?: number; o?: number; hi?: number }> = ({ x, y, s = 1, o = 1, hi = 0 }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-110 -120 H110 L124 60 H20 L0 -20 L-20 60 H-124 Z" fill={SAND} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
    <rect x={-110} y={-140} width={220} height={32} rx={5} fill={WARM} stroke={ink} strokeWidth={5} />
    <rect x={-124} y={44} width={104} height={18} fill={GREY} />
    <rect x={20} y={44} width={104} height={18} fill={GREY} />
    <rect x={44} y={-100} width={44} height={40} rx={4} fill={hi > 0.5 ? "#FFD2A8" : "#fff"} stroke={hi > 0.5 ? orange : ink} strokeWidth={hi > 0.5 ? 6 : 4} />
  </G>
);

const Vest: React.FC<{ x: number; y: number; s?: number; o?: number; hi?: number }> = ({ x, y, s = 1, o = 1, hi = 0 }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-110 -160 L-50 -210 L0 -140 L50 -210 L110 -160 V80 Q0 110 -110 80 Z" fill={SOFT} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
    <line x1={0} y1={-140} x2={0} y2={90} stroke={ink} strokeWidth={4} />
    <rect x={40} y={-40} width={52} height={34} rx={4} fill={hi > 0.5 ? "#FFD2A8" : "#fff"} stroke={hi > 0.5 ? orange : ink} strokeWidth={hi > 0.5 ? 6 : 4} />
  </G>
);

const Rivet: React.FC<{ x: number; y: number; r?: number; o?: number }> = ({ x, y, r = 14, o = 1 }) => (
  <G x={x} y={y} o={o}>
    <circle r={r} fill={COPPER} stroke={ink} strokeWidth={Math.max(2, r / 5)} />
    <circle r={r * 0.45} fill="#E8A66E" />
  </G>
);

/** Esquina de bolsillo trasero (cuadrado con remaches en las esquinas superiores). */
const BackPocket: React.FC<{ x: number; y: number; s?: number; o?: number; riv?: number; cover?: number; wear?: number }> = ({ x, y, s = 1, o = 1, riv = 1, cover = 0, wear = 0 }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-120 -120 H120 V60 L0 130 L-120 60 Z" fill={DENIM} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
    <path d="M-96 -96 H96 V50 L0 106 L-96 50 Z" fill="none" stroke={ink} strokeWidth={3} strokeDasharray="10 8" />
    {riv > 0 && (
      <>
        <Rivet x={-120} y={-120} r={18} o={riv} />
        <Rivet x={120} y={-120} r={18} o={riv} />
      </>
    )}
    {cover > 0 && (
      <G o={cover}>
        <path d="M-150 -150 H-90 L-150 -90 Z" fill={DENIM2} stroke={ink} strokeWidth={4} />
        <path d="M150 -150 H90 L150 -90 Z" fill={DENIM2} stroke={ink} strokeWidth={4} />
      </G>
    )}
    {wear > 0 && (
      <G o={wear}>
        {[[-120, -120], [120, -120]].map(([wx, wy]) => (
          <g key={wx} stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.85}>
            <line x1={wx - 22} y1={wy + 16} x2={wx + 14} y2={wy + 40} />
            <line x1={wx - 8} y1={wy + 4} x2={wx + 28} y2={wy + 28} />
            <line x1={wx - 30} y1={wy + 34} x2={wx} y2={wy + 52} />
          </g>
        ))}
      </G>
    )}
  </G>
);

/** Vaquero visto por detras (sin arco de costura): dos bolsillos traseros lisos. */
const BackJeans: React.FC<{ x: number; y: number; s?: number; o?: number; hi?: number }> = ({ x, y, s = 1, o = 1, hi = 0 }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-150 -240 H150 L172 290 H24 L0 -10 L-24 290 H-172 Z" fill={DENIM} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
    <rect x={-150} y={-262} width={300} height={50} rx={6} fill={DENIM2} stroke={ink} strokeWidth={6} />
    {[[-130, "L"], [30, "R"]].map(([px, id]) => (
      <path key={id as string} d={`M${px} -170 H${(px as number) + 100} V-70 L${(px as number) + 50} -40 L${px} -70 Z`} fill={id === "L" && hi > 0.5 ? "#FFD2A8" : "#9BB9DE"} stroke={id === "L" && hi > 0.5 ? orange : ink} strokeWidth={id === "L" && hi > 0.5 ? 8 : 4} strokeLinejoin="round" />
    ))}
  </G>
);

const Woman: React.FC<{ x: number; y: number; s?: number; o?: number; slit?: number; pouch?: number; ribbon?: number }> = ({ x, y, s = 1, o = 1, slit = 0, pouch = 0, ribbon = 0 }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-40 -250 H40 L52 -150 L170 0 H-170 L-52 -150 Z" fill={WARM} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
    <rect x={-12} y={-276} width={24} height={30} fill="#F1D5B0" stroke={ink} strokeWidth={4} />
    <circle cy={-308} r={34} fill="#F1D5B0" stroke={ink} strokeWidth={4} />
    <path d="M-38 -318 Q0 -370 38 -318 Z" fill={ink} />
    {slit > 0 && <line x1={-70} y1={-80} x2={-70} y2={-10} stroke={orange} strokeWidth={10} strokeLinecap="round" opacity={slit} />}
    {ribbon > 0 && <line x1={-52} y1={-150} x2={52} y2={-150} stroke={teal} strokeWidth={10} strokeLinecap="round" opacity={ribbon} />}
    {pouch > 0 && (
      <G o={pouch}>
        <path d="M0 -150 Q-30 -130 -36 -110" fill="none" stroke={teal} strokeWidth={6} />
        <rect x={-72} y={-112} width={70} height={84} rx={14} fill="#fff" stroke={ink} strokeWidth={5} />
        <line x1={-64} y1={-90} x2={-10} y2={-90} stroke={GREY} strokeWidth={4} strokeDasharray="8 6" />
      </G>
    )}
  </G>
);

const Sheet: React.FC<{ x: number; y: number; w: number; h: number; o?: number; hot?: boolean }> = ({ x, y, w, h, o = 1, hot = false }) => (
  <G x={x} y={y} o={o}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} fill={PAPER} stroke={hot ? orange : ink} strokeWidth={6} />
  </G>
);

const Coin: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <circle r={34} fill={GOLD} stroke={ink} strokeWidth={5} />
    <circle r={22} fill="none" stroke={ink} strokeWidth={3} />
  </G>
);

const Key: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <circle cx={-30} r={24} fill="none" stroke={ink} strokeWidth={8} />
    <line x1={-6} y1={0} x2={56} y2={0} stroke={ink} strokeWidth={8} strokeLinecap="round" />
    <line x1={40} y1={0} x2={40} y2={18} stroke={ink} strokeWidth={7} strokeLinecap="round" />
    <line x1={54} y1={0} x2={54} y2={14} stroke={ink} strokeWidth={7} strokeLinecap="round" />
  </G>
);

const Envelope: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-44} y={-30} width={88} height={60} rx={5} fill="#fff" stroke={ink} strokeWidth={5} />
    <polyline points="-44,-30 0,6 44,-30" fill="none" stroke={ink} strokeWidth={4} />
  </G>
);

const Hanky: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-40 -34 Q0 -50 40 -34 Q52 0 40 34 Q0 50 -40 34 Q-52 0 -40 -34 Z" fill={SOFT} stroke={ink} strokeWidth={5} />
  </G>
);

const Sewing: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <circle r={32} fill={orange} stroke={ink} strokeWidth={5} />
    <line x1={-10} y1={-50} x2={10} y2={14} stroke={ink} strokeWidth={5} strokeLinecap="round" />
  </G>
);

/** Billete generico (franjas y un puente propio en el reverso). side 0 = anverso, 1 = reverso. */
const Bill: React.FC<{ x: number; y: number; s?: number; o?: number; flip: number }> = ({ x, y, s = 1, o = 1, flip }) => {
  const sx = Math.abs(Math.cos(flip * Math.PI));
  const back = flip > 0.5;
  return (
    <G x={x} y={y} s={s} o={o}>
      <g transform={`scale(${Math.max(sx, 0.02)} 1)`}>
        <rect x={-260} y={-135} width={520} height={270} rx={14} fill={back ? "#E8F3EE" : "#EFE6D2"} stroke={ink} strokeWidth={7} />
        <rect x={-236} y={-111} width={472} height={222} rx={8} fill="none" stroke={GREY} strokeWidth={3} strokeDasharray="10 8" />
        {back ? (
          <>
            <path d="M-170 40 Q0 -70 170 40" fill="none" stroke={teal} strokeWidth={10} />
            <line x1={-170} y1={40} x2={170} y2={40} stroke={teal} strokeWidth={8} />
            {[-110, -50, 10, 70, 130].map((bx) => (
              <line key={bx} x1={bx} y1={40 - (60 - Math.abs(bx) * 0.22)} x2={bx} y2={40} stroke={teal} strokeWidth={5} />
            ))}
          </>
        ) : (
          <>
            <circle cx={-130} cy={0} r={52} fill="none" stroke={teal} strokeWidth={8} />
            <line x1={-40} y1={-40} x2={190} y2={-40} stroke={GREY} strokeWidth={8} strokeLinecap="round" />
            <line x1={-40} y1={0} x2={190} y2={0} stroke={GREY} strokeWidth={8} strokeLinecap="round" />
            <line x1={-40} y1={40} x2={120} y2={40} stroke={GREY} strokeWidth={8} strokeLinecap="round" />
          </>
        )}
      </g>
    </G>
  );
};

/* ------------------------------------------------------------------ hook (0-4) */
const SceneHook: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const all = seg(t, c, 0, 4);
  const reach = ramp(t, c[0] + 0.7, c[0] + 1.9);
  const hi = t > c[0] + 3.0 ? 1 : 0;
  const mv = ramp(t, c[4] + 0.1, c[4] + 0.7);
  const ph = ramp(t, c[2] + 1.0, c[2] + 1.6) - ramp(t, c[2] + 1.8, c[2] + 2.3) * 0.55;
  return (
    <>
      <SvgFrame>
        <G o={all}>
          <Jeans x={lerp(960, 560, mv)} y={450} s={1.05} hi={hi} />
          <G o={seg(t, c, 0)}>
            <Hand x={lerp(1250, 1070, reach)} y={lerp(260, 300, reach)} s={1.3} rot={-35} />
          </G>
        </G>
        <G o={seg(t, c, 1)}>
          <Coin x={1380} y={250} s={1.4} o={vis(t, c[1] + 0.7)} />
          <Key x={1380} y={400} s={1.4} o={vis(t, c[1] + 1.7)} />
          <G o={vis(t, c[1] + 2.4)}>
            <circle cx={1380} cy={550} r={44} fill="none" stroke={GREY} strokeWidth={6} strokeDasharray="12 9" />
            <Txt x={1380} y={630} size={34} fill={GREY}>
              nothing
            </Txt>
          </G>
        </G>
        <G o={seg(t, c, 2)}>
          <G x={lerp(1500, 1180, ph)} y={lerp(300, 330, ph)} rot={-12 * ph}>
            <rect x={-46} y={-84} width={92} height={168} rx={14} fill={ink} />
            <rect x={-38} y={-70} width={76} height={132} rx={6} fill={SOFT} />
          </G>
          <Note x={1380} y={560} text="too small, too awkward" o={vis(t, c[2] + 1.6)} size={40} fill={ink} />
        </G>
        <G o={seg(t, c, 3)}>
          <PocketWatch x={380} y={260} s={0.9} o={vis(t, c[3] + 1.1)} />
          <G x={380} y={440} o={vis(t, c[3] + 2.1)}>
            <rect x={-60} y={-70} width={120} height={150} rx={6} fill={PAPER} stroke={ink} strokeWidth={5} />
            {[-40, -14, 12, 38].map((ly) => (
              <line key={ly} x1={-38} y1={ly} x2={38} y2={ly} stroke={GREY} strokeWidth={5} />
            ))}
          </G>
          <G x={380} y={620} o={vis(t, c[3] + 2.8)}>
            <path d="M-70 20 Q-70 -60 0 -60 Q70 -60 70 20 Z" fill={SAND} stroke={ink} strokeWidth={5} />
            <rect x={-80} y={20} width={160} height={16} rx={4} fill={ink} />
          </G>
          <Txt x={1500} y={420} size={340} serif fill={orange}>
            ?
          </Txt>
        </G>
        <G o={seg(t, c, 4)}>
          <Txt x={1320} y={330} size={280} serif fill={orange}>
            WHY?
          </Txt>
        </G>
      </SvgFrame>
      <Chips t={t} c={c} list={[["YOUR JEANS"], ["WHAT DO YOU KEEP IN IT?"], ["TOO SMALL FOR A PHONE"], ["A WATCH, A PATENT, A WAR"], ["WHY A POCKET INSIDE A POCKET?", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ watch (5-9) */
const SceneWatch: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const rise = ramp(t, c[0] + 2.2, c[0] + 3.2);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Txt x={960} y={180} size={88} fill={ink} spacing={6}>
            WATCH POCKET
          </Txt>
          <Jeans x={560} y={505} s={0.85} hi={1} />
          <PocketWatch x={lerp(660, 1200, rise)} y={lerp(325, 495, rise)} s={1.5} o={vis(t, c[0] + 2.2)} />
        </G>
        <G o={k(1)}>
          <PocketWatch x={1260} y={440} s={1.9} o={vis(t, c[1] + 0.8)} />
          <Note x={1260} y={620} text="POCKET WATCH" o={vis(t, c[1] + 0.9)} size={46} fill={ink} />
          <Wrist x={560} y={440} s={2.4} o={vis(t, c[1] + 3.0)} />
          <Note x={560} y={620} text="WRIST WATCH" o={vis(t, c[1] + 3.1)} size={46} fill={ink} />
        </G>
        <G o={k(2)}>
          <Note x={960} y={160} text="the company's own article" o={vis(t, c[2] + 0.3)} size={40} fill={teal} />
          <Txt x={960} y={290} size={58} serif fill={ink}>
            <tspan>"intended to store a pocket watch"</tspan>
          </Txt>
          {[480, 960, 1440].map((px, i) => (
            <G key={px} o={vis(t, c[2] + 5.0 + i * 0.3)}>
              <Person x={px} y={620} s={1.5} body={i === 1 ? teal : SAND} />
              <PocketWatch x={px + 36} y={560} s={0.28} />
            </G>
          ))}
          <Note x={960} y={730} text="LATE 1800s" o={vis(t, c[2] + 6.4)} size={60} fill={orange} />
        </G>
        <G o={k(3)}>
          <G o={vis(t, c[3] + 0.4)}>
            <Txt x={480} y={330} size={210} serif fill={ink}>
              FOB
            </Txt>
          </G>
          <Note x={480} y={520} text="mid 1600s" o={vis(t, c[3] + 4.6)} size={80} fill={teal} />
          <Note x={960} y={730} text="Oxford Dictionary of Word Origins, via Wikipedia" o={vis(t, c[3] + 3.0)} size={34} fill={GREY} />
          <Breeches x={1330} y={480} s={1.7} o={vis(t, c[3] + 6.0)} hi={t > c[3] + 7.0 ? 1 : 0} />
          <Note x={1330} y={680} text="BREECHES" o={vis(t, c[3] + 8.4)} size={44} fill={ink} />
        </G>
        <G o={k(4)}>
          <G o={vis(t, c[4] + 1.3)}>
            <Jeans x={420} y={500} s={0.8} fill="#C9C2AC" band="#A9A28C" hi={1} />
            <Note x={420} y={200} text="TROUSERS" o={1} size={44} fill={ink} />
          </G>
          <G o={vis(t, c[4] + 2.1)}>
            <Vest x={960} y={500} s={1.3} hi={1} />
            <Note x={960} y={200} text="WAISTCOATS" o={1} size={44} fill={ink} />
          </G>
          <G o={vis(t, c[4] + 3.2)}>
            <Jeans x={1500} y={500} s={0.8} hi={1} />
            <Note x={1500} y={200} text="TRADITIONAL JEANS" o={1} size={44} fill={ink} />
          </G>
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(3), k(4))} />
      <Chips t={t} c={c} list={[["A POCKET FOR A WATCH"], ["WHAT IS A POCKET WATCH?"], ["THE COMPANY'S EXPLANATION"], ["WHAT IS A FOB?"], ["STILL AROUND"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ patent (10-15) */
const ScenePatent: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const split = ramp(t, c[3] + 1.9, c[3] + 2.3);
  const panel = Math.max(0, Math.min(1, (t - (c[3] + 1.9)) * 2));
  void panel;
  const back = 1 - vis(t, c[3] + 1.9) * 0 - ramp(t, c[3] + 1.9, c[3] + 2.3);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Line x={960} y={170} label="1873" o={vis(t, c[0] + 1.4)} />
          <Person x={560} y={600} s={1.8} body={SAND} o={vis(t, c[0] + 2.6)} />
          <Note x={560} y={690} text="JACOB DAVIS" o={vis(t, c[0] + 2.8)} size={46} fill={ink} />
          <Person x={1360} y={600} s={1.8} body={teal} o={vis(t, c[0] + 3.6)} />
          <Note x={1360} y={690} text="LEVI STRAUSS" o={vis(t, c[0] + 3.7)} size={46} fill={ink} />
          <Stamp x={960} y={420} text="PATENT" o={vis(t, c[0] + 5.1)} size={80} />
        </G>
        <G o={k(1)}>
          <Sheet x={960} y={400} w={760} h={480} hot o={vis(t, c[1] + 0.2)} />
          <G o={vis(t, c[1] + 0.8)}>
            <Txt x={960} y={290} size={42} fill={ink} spacing={1}>
              IMPROVEMENT IN FASTENING
            </Txt>
            <Txt x={960} y={350} size={42} fill={ink} spacing={1}>
              POCKET-OPENINGS
            </Txt>
            {[430, 470, 510].map((ly) => (
              <line key={ly} x1={680} y1={ly} x2={1240} y2={ly} stroke={GREY} strokeWidth={6} strokeLinecap="round" />
            ))}
          </G>
          <Note x={960} y={690} text="Illustration, not the original patent" o={vis(t, c[1] + 0.4)} size={30} />
        </G>
        <G o={k(2)}>
          <Person x={480} y={600} s={1.7} body={SAND} o={vis(t, c[2] + 0.1)} />
          <G o={vis(t, c[2] + 0.8)}>
            <Sewing x={650} y={480} s={1.3} />
          </G>
          <Note x={480} y={690} text="DAVIS, TAILOR" o={vis(t, c[2] + 0.9)} size={42} fill={ink} />
          <G o={vis(t, c[2] + 1.6)}>
            <Person x={1440} y={600} s={1.7} body={teal} />
            {[[1200, GOLD], [1260, orange], [1320, teal]].map(([rx, col]) => (
              <rect key={rx as number} x={(rx as number) - 24} y={420} width={48} height={180} rx={10} fill={col as string} stroke={ink} strokeWidth={5} />
            ))}
          </G>
          <Note x={1330} y={690} text="STRAUSS, DRY GOODS" o={vis(t, c[2] + 1.8)} size={42} fill={ink} />
          <Note x={960} y={150} text="SAN FRANCISCO" o={vis(t, c[2] + 2.5)} size={50} fill={teal} />
          <Note x={960} y={300} text="1853" o={vis(t, c[2] + 3.6)} size={140} fill={orange} />
        </G>
        <G o={k(3)}>
          <G o={(1 - vis(t, c[3] + 1.9)) * vis(t, c[3] + 0.6)}>
            <Rivet x={960} y={420} r={120} />
            <Note x={960} y={620} text="COPPER RIVETS" o={1} size={56} fill={ink} />
          </G>
          <G o={vis(t, c[3] + 2.0)}>
            <path d="M360 260 H860 V600 H360 Z" fill={DENIM} stroke={ink} strokeWidth={6} />
            <path d="M1060 260 H1560 V600 H1060 Z" fill={DENIM} stroke={ink} strokeWidth={6} />
            <path d="M360 400 H600 L640 460 L690 400 H860" fill="none" stroke="#fff" strokeWidth={9} strokeLinejoin="round" opacity={vis(t, c[3] + 2.8)} />
            <Rivet x={1310} y={430} r={40} o={1} />
            <Note x={610} y={660} text="WITHOUT: RIPS" o={vis(t, c[3] + 2.9)} size={44} fill={RED} />
            <Note x={1310} y={660} text="WITH: HOLDS" o={vis(t, c[3] + 3.8)} size={44} fill={GREEN} />
          </G>
        </G>
        <G o={k(4)}>
          <Note x={960} y={730} text="schematic positions, our drawing" o={vis(t, c[4] + 0.4)} size={34} fill={GREY} />
          <g transform="translate(720 430) scale(0.85) translate(-720 -480)">
          <Jeans x={720} y={480} s={1.0} small={1} />
          {[[420, 300, "1", 2.2, 640, 340], [1060, 400, "2", 2.5, 900, 380], [1060, 230, "3", 2.8, 851, 298]].map(([bx, by, n, tt, lx, ly]) => (
            <G key={n as string} o={vis(t, c[4] + (tt as number))}>
              <line x1={bx as number} y1={by as number} x2={lx as number} y2={ly as number} stroke={ink} strokeWidth={4} />
              <circle cx={bx as number} cy={by as number} r={34} fill={PAPER} stroke={ink} strokeWidth={5} />
              <Txt x={bx as number} y={(by as number) + 2} size={42} fill={ink}>
                {n as string}
              </Txt>
              <G o={vis(t, c[4] + 3.6)}>
                <Rivet x={lx as number} y={ly as number} r={13} />
              </G>
            </G>
          ))}
          </g>
          <G o={vis(t, c[4] + 3.1)}>
            <path d="M1300 340 H1460 V450 L1380 490 L1300 450 Z" fill={DENIM} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
            <circle cx={1380} cy={290} r={34} fill={PAPER} stroke={ink} strokeWidth={5} />
            <Txt x={1380} y={292} size={42} fill={ink}>
              4
            </Txt>
            <Note x={1380} y={560} text="BACK" o={1} size={36} fill={GREY} />
            <G o={vis(t, c[4] + 3.8)}>
              <Rivet x={1300} y={340} r={13} />
              <Rivet x={1460} y={340} r={13} />
            </G>
          </G>
        </G>
        <G o={k(5)}>
          <Note x={960} y={140} text="Wikipedia, citing a news report" o={vis(t, c[5] + 0.3)} size={38} fill={teal} />
          <Jeans x={560} y={430} s={0.85} hi={1} small={1 - vis(t, c[5] + 3.4) * 0.7} />
          <Note x={800} y={280} text="?" o={vis(t, c[5] + 3.4)} size={200} fill={orange} />
          <Line x={1380} y={380} label="late 1870s" o={vis(t, c[5] + 4.4)} />
          <Stamp x={1380} y={560} text="DATE: FUZZY" o={vis(t, c[5] + 6.3)} size={56} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(2), k(3), k(4), k(5))} />
      <Chips t={t} c={c} list={[["THE PATENT"], ["THE TITLE"], ["WHO WAS WHO"], ["THE TRICK: RIVETS"], ["FOUR POCKETS"], ["THE WATCH POCKET: WHEN?", true]]} />
      {void split}
      {void back}
    </>
  );
};

/* ------------------------------------------------------------------ fifth (16-18) */
const SceneFifth: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Jeans x={700} y={430} s={0.85} hi={1} />
          <Speech x={1300} y={300} text="the fifth pocket?" o={vis(t, c[0] + 2.6)} size={48} />
        </G>
        <G o={k(1)}>
          <BackJeans x={620} y={430} s={0.85} hi={t > c[1] + 2.1 ? 1 : 0} />
          <Note x={1180} y={330} text="5TH POCKET" o={vis(t, c[1] + 2.5)} size={64} fill={orange} />
          <Note x={1180} y={410} text="the back left pocket" o={vis(t, c[1] + 2.2)} size={40} fill={ink} />
          <Note x={1180} y={560} text="1901" o={vis(t, c[1] + 5.0)} size={170} fill={ink} />
        </G>
        <G o={k(2)}>
          <Person x={700} y={620} s={2.1} body={SAND} hat />
          <circle cx={724} cy={400} r={20} fill="none" stroke={ink} strokeWidth={5} />
          <G o={vis(t, c[2] + 1.6)}>
            <rect x={1000} y={260} width={520} height={170} rx={16} fill={PAPER} stroke={orange} strokeWidth={7} />
            <Txt x={1260} y={345} size={80} fill={ink}>
              Actually...
            </Txt>
          </G>
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1))} />
      <Chips t={t} c={c} list={[["A FUNNY THING"], ["THE COMPANY SAYS"], ["POLITELY CORRECTED"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ rivets (19-22) */
const SceneRivets: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const fly = ramp(t, c[2] + 2.8, c[2] + 4.4);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Line x={960} y={160} label="1937" o={vis(t, c[0] + 2.1)} />
          <BackPocket x={500} y={430} s={1.2} cover={vis(t, c[0] + 5.0)} />
          <G x={1130} y={520} o={vis(t, c[0] + 7.4)}>
            <rect x={-120} y={-150} width={20} height={150} fill={SAND} stroke={ink} strokeWidth={5} />
            <rect x={-120} y={-170} width={240} height={30} fill={SAND} stroke={ink} strokeWidth={5} />
            <rect x={-120} y={-140} width={240} height={30} rx={4} fill={SAND} stroke={ink} strokeWidth={5} />
            <rect x={100} y={-110} width={20} height={110} fill={SAND} stroke={ink} strokeWidth={5} />
            <line x1={-60} y1={-150} x2={-10} y2={-134} stroke={orange} strokeWidth={6} opacity={vis(t, c[0] + 8.0)} strokeLinecap="round" />
            <line x1={-30} y1={-160} x2={40} y2={-130} stroke={orange} strokeWidth={6} opacity={vis(t, c[0] + 8.2)} strokeLinecap="round" />
          </G>
          <G x={1580} y={520} o={vis(t, c[0] + 8.7)}>
            <path d="M-110 -40 Q-80 -110 0 -90 Q60 -100 100 -40 L90 0 H-100 Z" fill={WARM} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
            <line x1={-20} y1={-70} x2={40} y2={-52} stroke={orange} strokeWidth={6} strokeLinecap="round" />
          </G>
          <Note x={1130} y={600} text="FURNITURE" o={vis(t, c[0] + 8.0)} size={36} fill={GREY} />
          <Note x={1580} y={600} text="SADDLES" o={vis(t, c[0] + 8.9)} size={36} fill={GREY} />
          <Note x={500} y={630} text="covered rivets" o={vis(t, c[0] + 5.4)} size={40} fill={ink} />
        </G>
        <G o={k(1)}>
          <Line x={960} y={160} label="1966" o={vis(t, c[1] + 0.2)} />
          <BackPocket x={960} y={520} s={1.8} riv={1 - vis(t, c[1] + 2.4)} wear={vis(t, c[1] + 4.0)} />
          <Stamp x={1450} y={400} text="DROPPED" o={vis(t, c[1] + 2.6)} size={64} />
        </G>
        <G o={k(2)}>
          <Note x={960} y={172} text="THE SECOND WORLD WAR" o={vis(t, c[2] + 0.5)} size={62} fill={ink} />
          <Jeans x={520} y={470} s={0.85} hi={1} />
          <Rivet x={lerp(900, 1330, fly)} y={lerp(300, 470, fly) - Math.sin(fly * Math.PI) * 90} r={22} o={vis(t, c[2] + 2.3)} />
          <G x={1400} y={620} o={vis(t, c[2] + 2.4)}>
            <path d="M-120 -170 H120 L90 0 H-90 Z" fill="#fff" stroke={ink} strokeWidth={6} strokeLinejoin="round" />
            <rect x={-130} y={-190} width={260} height={26} rx={6} fill={GREY} stroke={ink} strokeWidth={5} />
          </G>
          <Note x={1400} y={690} text="metal for the war effort" o={vis(t, c[2] + 4.6)} size={36} fill={ink} />
        </G>
        <G o={k(3)}>
          <rect x={720} y={240} width={480} height={330} rx={16} fill={DENIM} stroke={orange} strokeWidth={9} />
          <Txt x={1230} y={240} size={150} fill={orange}>
            *
          </Txt>
          <Note x={960} y={660} text="* a wartime footnote" o={vis(t, c[3] + 1.8)} size={50} fill={ink} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(2), k(3))} />
      <Chips t={t} c={c} list={[["THE RIVETS HAVE A STORY"], ["REAR RIVETS DROPPED"], ["WARTIME SAVINGS"], ["THE SMALLEST POCKET", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ pockets (23-25) */
const ScenePockets: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const items: [React.ReactNode, number][] = [
    [<Envelope key="e" x={1180} y={420} s={1.3} />, 2.6],
    [<Coin key="c" x={1330} y={420} s={1.3} />, 3.2],
    [<Key key="k" x={1480} y={420} s={1.3} />, 3.6],
    [<Hanky key="h" x={1180} y={560} s={1.3} />, 3.9],
    [<Sewing key="s" x={1340} y={560} s={1.3} />, 4.7],
  ];
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Line x={560} y={160} label="1700s" o={vis(t, c[0] + 2.3)} />
          <Woman x={1000} y={720} s={1.6} pouch={vis(t, c[0] + 5.6)} ribbon={vis(t, c[0] + 7.4)} />
          <Note x={1500} y={330} text="V&A MUSEUM" o={vis(t, c[0] + 3.4)} size={44} fill={teal} />
          <Note x={1500} y={420} text="separate garments" o={vis(t, c[0] + 6.2)} size={44} fill={ink} />
          <Note x={1500} y={480} text="tied at the waist" o={vis(t, c[0] + 7.2)} size={44} fill={ink} />
        </G>
        <G o={k(1)}>
          <Woman x={600} y={720} s={1.6} slit={vis(t, c[1] + 0.3)} pouch={1} ribbon={1} />
          <Note x={1330} y={290} text="openings in the gown" o={vis(t, c[1] + 1.2)} size={40} fill={orange} />
          {items.map(([el, tt], i) => (
            <G key={i} o={vis(t, c[1] + tt)}>
              {el}
            </G>
          ))}
        </G>
        <G o={k(2)}>
          <G o={vis(t, c[2] + 1.7)}>
            <Woman x={520} y={720} s={1.4} pouch={1} ribbon={1} />
            <Note x={520} y={780} text="TIED ON" o={vis(t, c[2] + 2.8)} size={50} fill={teal} />
          </G>
          <G o={vis(t, c[2] + 1.7)}>
            <Jeans x={1300} y={470} s={0.9} hi={1} />
          </G>
          <Note x={1300} y={780} text="SEWN IN" o={vis(t, c[2] + 4.0)} size={50} fill={GREY} />
          <G o={vis(t, c[2] + 3.0)}>
            <circle cx={800} cy={300} r={34} fill={GREEN} />
            <polyline points="786,300 797,312 816,286" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
          </G>
          <G o={vis(t, c[2] + 4.2)}>
            <line x1={1580} y1={250} x2={1640} y2={310} stroke={RED} strokeWidth={10} strokeLinecap="round" />
            <line x1={1640} y1={250} x2={1580} y2={310} stroke={RED} strokeWidth={10} strokeLinecap="round" />
          </G>
        </G>
      </SvgFrame>
      <Chips t={t} c={c} list={[["POCKETS HAVE A HISTORY"], ["THE GOWN OPENING"], ["TIED ON, NOT SEWN IN"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ why (26-28) */
const SceneWhy: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Jeans x={560} y={430} s={0.85} hi={1} />
          <Sheet x={1300} y={420} w={520} h={400} o={vis(t, c[0] + 2.4)} />
          <Note x={1300} y={420} text="?" o={vis(t, c[0] + 2.8)} size={260} fill={orange} />
          <Stamp x={1300} y={650} text="NO REASON GIVEN" o={vis(t, c[0] + 4.3)} size={46} />
        </G>
        <G o={k(1)}>
          {[400, 680, 960, 1240, 1520].map((jx, i) => (
            <Jeans key={jx} x={jx} y={370} s={0.45} hi={1} o={vis(t, c[1] + 1.8 + i * 0.35)} />
          ))}
          <Note x={960} y={545} text="copying beats changing" o={vis(t, c[1] + 2.8)} size={54} fill={ink} />
          <Stamp x={960} y={685} rot={-2} text="OUR READING: AN INFERENCE" o={vis(t, c[1] + 5.3)} size={40} />
        </G>
        <G o={k(2)}>
          <G o={vis(t, c[2] + 1.0)}>
            <rect x={340} y={260} width={380} height={330} rx={10} fill="#fff" fillOpacity={0.7} stroke={ink} strokeWidth={7} />
            <PocketWatch x={530} y={440} s={1.1} />
            <Stamp x={530} y={640} text="ANTIQUE" o={vis(t, c[2] + 1.6)} size={44} color={teal} rot={-4} />
          </G>
          <G o={vis(t, c[2] + 3.6)}>
            <rect x={1130} y={250} width={420} height={340} rx={16} fill={DENIM} stroke={orange} strokeWidth={9} />
            <Coin x={1230} y={380} o={vis(t, c[2] + 5.2)} />
            <Key x={1390} y={380} o={vis(t, c[2] + 5.6)} />
            <G x={1300} y={500} o={vis(t, c[2] + 6.0)}>
              <circle cx={-30} r={16} fill="#fff" stroke={ink} strokeWidth={4} />
              <circle cx={30} r={16} fill="#fff" stroke={ink} strokeWidth={4} />
              <path d="M-30 16 Q0 70 30 16" fill="none" stroke={ink} strokeWidth={4} />
            </G>
          </G>
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(2))} />
      <Chips t={t} c={c} list={[["WHY IS IT STILL THERE?"], ["OUR READING", true], ["A SAFE GUESS"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ close (29-30) */
const SceneClose: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const flip = ramp(t, c[1] + 2.8, c[1] + 3.5);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Jeans x={380} y={480} s={0.9} hi={1} />
          <G o={vis(t, c[0] + 1.3)}>
            <rect x={760} y={240} width={900} height={360} rx={14} fill="#fff" fillOpacity={0.75} stroke={ink} strokeWidth={7} />
            <rect x={740} y={216} width={940} height={36} rx={6} fill={ink} />
            <Txt x={1210} y={234} size={26} fill="#fff" spacing={8}>
              MUSEUM OF OLD HABITS
            </Txt>
          </G>
          <PocketWatch x={900} y={430} s={1.1} o={vis(t, c[0] + 3.0)} />
          <G x={1210} y={430} o={vis(t, c[0] + 4.6)}>
            <rect x={-70} y={-100} width={140} height={190} rx={6} fill={PAPER} stroke={ink} strokeWidth={5} />
            {[-60, -30, 0, 30].map((ly) => (
              <line key={ly} x1={-46} y1={ly} x2={46} y2={ly} stroke={GREY} strokeWidth={5} />
            ))}
          </G>
          <Rivet x={1520} y={430} r={50} o={vis(t, c[0] + 5.8)} />
          <Note x={900} y={560} text="a watch" o={vis(t, c[0] + 3.2)} size={34} fill={ink} />
          <Note x={1210} y={560} text="a patent" o={vis(t, c[0] + 4.8)} size={34} fill={ink} />
          <Note x={1520} y={560} text="a war footnote" o={vis(t, c[0] + 6.0)} size={34} fill={ink} />
        </G>
        <G o={k(1)}>
          <Jeans x={380} y={480} s={0.9} hi={1} />
          <Hand x={560} y={300} s={1.1} rot={-20} />
          <Bill x={1060} y={400} s={1.0} o={vis(t, c[1] + 1.0)} flip={flip} />
          <Note x={1060} y={620} text="EURO BANKNOTE" o={vis(t, c[1] + 0.9) * (1 - flip)} size={40} fill={ink} />
          <Note x={1060} y={620} text="THE BRIDGE" o={vis(t, c[1] + 3.8)} size={50} fill={teal} />
          <G o={vis(t, c[1] + 4.7)}>
            <Txt x={1640} y={400} size={330} serif fill={orange}>
              ?
            </Txt>
          </G>
        </G>
      </SvgFrame>
      <SimpleNote o={k(0)} />
      <Chips t={t} c={c} list={[["A LITTLE MUSEUM"], ["TURN IT OVER", true]]} />
    </>
  );
};

export const SCENES010: Record<string, React.FC<SceneProps>> = {
  "hook": SceneHook,
  "watch": SceneWatch,
  "patent": ScenePatent,
  "fifth": SceneFifth,
  "rivets": SceneRivets,
  "pockets": ScenePockets,
  "why": SceneWhy,
  "close": SceneClose,
};
