import React from "react";
import { vis } from "../components/ui";
import { lerp, ramp } from "../utils/anim";
import type { SceneProps } from "./scenes";
import { Chips, Note } from "./scenes011";
import { Arrow, Bulb, G, GOLD, GREEN, GREY, ink, orange, Person, Plaque, RED, SAND, seg, SimpleNote, SOFT, Stamp, SvgFrame, teal, Txt, useT, WARM } from "./kit";
import { Map as CityMap, Sheet, Tick } from "./scenes015";

const YELLOW = "#EBDFA6";
const DARK_Y = "#D6BF4A";

/** Nota adhesiva generica (sin logo ni marca): cuadrado amarillo suave con rayas; curl = esquina levantada. */
const SNote: React.FC<{ x: number; y: number; s?: number; o?: number; rot?: number; curl?: boolean; lines?: boolean }> = ({ x, y, s = 1, o = 1, rot = 0, curl = false, lines = true }) => (
  <G x={x} y={y} s={s} o={o} rot={rot}>
    <rect x={-100} y={-100} width={200} height={200} fill={YELLOW} stroke={ink} strokeWidth={5} />
    {curl && <path d="M100 40 L40 100 L100 100 Z" fill={DARK_Y} stroke={ink} strokeWidth={4} strokeLinejoin="round" />}
    {lines &&
      [-50, -10, 30].map((ly) => <line key={ly} x1={-66} y1={ly} x2={ly === 30 ? 0 : 66} y2={ly} stroke={DARK_Y} strokeWidth={7} strokeLinecap="round" />)}
  </G>
);

const Monitor: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-270} y={-230} width={540} height={330} rx={18} fill="#fff" stroke={ink} strokeWidth={9} />
    <rect x={-244} y={-204} width={488} height={278} rx={8} fill="#EAF3F3" />
    <rect x={-50} y={100} width={100} height={56} fill="#E4E7EC" stroke={ink} strokeWidth={6} />
    <rect x={-170} y={154} width={340} height={24} rx={11} fill="#E4E7EC" stroke={ink} strokeWidth={6} />
  </G>
);

const Jar: React.FC<{ x: number; y: number; s?: number; o?: number; arm?: boolean }> = ({ x, y, s = 1, o = 1, arm = false }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-80} y={-120} width={160} height={230} rx={22} fill="#fff" stroke={ink} strokeWidth={7} />
    <rect x={-60} y={-160} width={120} height={46} rx={10} fill={teal} stroke={ink} strokeWidth={6} />
    <rect x={-60} y={-60} width={120} height={100} rx={8} fill={SOFT} stroke={ink} strokeWidth={4} />
    <Txt x={0} y={-8} size={34} fill={ink} weight={700}>
      GLUE
    </Txt>
    {arm && (
      <>
        <path d="M110 40 C160 40 190 0 190 -40" fill="none" stroke="#F1D5B0" strokeWidth={34} strokeLinecap="round" />
        <path d="M110 40 C160 40 190 0 190 -40" fill="none" stroke={ink} strokeWidth={4} strokeLinecap="round" opacity={0.3} />
        <circle cx={190} cy={-64} r={26} fill="#F1D5B0" stroke={ink} strokeWidth={5} />
        <circle cx={156} cy={14} r={26} fill="#F1D5B0" stroke={ink} strokeWidth={4} />
      </>
    )}
  </G>
);

const Book: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-220 -130 L0 -100 L0 140 L-220 110 Z" fill="#fff" stroke={ink} strokeWidth={6} strokeLinejoin="round" />
    <path d="M220 -130 L0 -100 L0 140 L220 110 Z" fill="#fff" stroke={ink} strokeWidth={6} strokeLinejoin="round" />
    {[-60, -20, 20, 60].map((ly) => (
      <React.Fragment key={ly}>
        <line x1={-180} y1={ly - 70} x2={-30} y2={ly - 52} stroke={GREY} strokeWidth={6} strokeLinecap="round" />
        <line x1={30} y1={ly - 52} x2={180} y2={ly - 70} stroke={GREY} strokeWidth={6} strokeLinecap="round" />
      </React.Fragment>
    ))}
  </G>
);

const Strip: React.FC<{ x: number; y: number; rot?: number; o?: number; glue?: boolean; w?: number }> = ({ x, y, rot = 0, o = 1, glue = false, w = 40 }) => (
  <G x={x} y={y} rot={rot} o={o}>
    <rect x={-w / 2} y={-90} width={w} height={180} fill={WARM} stroke={ink} strokeWidth={5} />
    <path d={`M${-w / 2} -90 L0 -60 L${w / 2} -90`} fill={orange} />
    {glue && <rect x={-w / 2} y={-90} width={w} height={46} fill={YELLOW} stroke={ink} strokeWidth={4} />}
  </G>
);

const Bar: React.FC<{ x: number; y: number; w: number; fill: string; label: string; o?: number; dash?: boolean }> = ({ x, y, w, fill, label, o = 1, dash = false }) => (
  <G x={x} y={y} o={o}>
    <rect x={0} y={-30} width={w} height={60} rx={14} fill={fill} stroke={ink} strokeWidth={6} strokeDasharray={dash ? "14 10" : undefined} />
    <Txt x={w + 330} y={0} size={44} fill={ink}>
      {label}
    </Txt>
  </G>
);

const Desk: React.FC<{ x: number; y: number; w?: number; o?: number }> = ({ x, y, w = 560, o = 1 }) => (
  <G x={x} y={y} o={o}>
    <rect x={-w / 2} y={0} width={w} height={26} rx={8} fill={SAND} stroke={ink} strokeWidth={6} />
    <rect x={-w / 2 + 30} y={26} width={26} height={110} fill={SAND} stroke={ink} strokeWidth={5} />
    <rect x={w / 2 - 56} y={26} width={26} height={110} fill={SAND} stroke={ink} strokeWidth={5} />
  </G>
);

/* ------------------------------------------------------------------ hook (0-4) */
const SceneHook: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Monitor x={760} y={400} s={1.1} />
          <SNote x={1000} y={240} s={0.45} rot={4} curl />
          <Arrow x1={1280} y1={300} x2={1100} y2={260} color={orange} o={vis(t, c[0] + 2.0)} />
          <Note x={1560} y={310} text="barely holds on" o={vis(t, c[0] + 2.0)} size={48} fill={orange} />
        </G>
        <G o={k(1)}>
          <Monitor x={560} y={400} s={0.9} />
          <SNote x={760} y={270} s={0.4} rot={4} curl o={1 - ramp(t, c[1] + 1.0, c[1] + 1.8)} />
          <Book x={1380} y={430} s={0.9} />
          <SNote x={1330} y={420} s={0.4} rot={-6} o={vis(t, c[1] + 2.8)} />
          <Arrow x1={880} y1={260} x2={1180} y2={300} color={teal} o={vis(t, c[1] + 1.6)} w={14} />
          <Note x={1030} y={200} text="peel" o={vis(t, c[1] + 1.2)} size={46} fill={teal} />
          <Note x={1380} y={650} text="stick again" o={vis(t, c[1] + 3.2)} size={46} fill={teal} />
        </G>
        <G o={k(2)}>
          <Jar x={520} y={460} s={1.2} />
          <Note x={520} y={190} text="STRONG" o={vis(t, c[2] + 0.6)} size={64} fill={orange} />
          <Arrow x1={880} y1={400} x2={1160} y2={400} color={orange} w={14} o={vis(t, c[2] + 1.8)} />
          <SNote x={1380} y={400} s={1.3} rot={3} curl o={vis(t, c[2] + 2.4)} />
          <Note x={520} y={690} text="made to be strong" o={vis(t, c[2] + 1.0)} size={44} fill={ink} />
        </G>
        <G o={k(3)}>
          <Jar x={960} y={440} s={0.9} />
          {[560, 1360, 1660].map((px, i) => (
            <G key={px} o={vis(t, c[3] + 0.8 + i * 0.6)}>
              <Person x={px} y={560} s={1.4} body={SOFT} />
              <Note x={px} y={290} text="?" o={1} size={110} fill={orange} />
            </G>
          ))}
        </G>
        <G o={k(4)}>
          <Txt x={640} y={300} size={380} serif fill={ink}>
            WHY
          </Txt>
          <Txt x={1160} y={290} size={380} serif fill={orange}>
            ?
          </Txt>
          <SNote x={960} y={600} s={0.9} rot={-3} curl o={vis(t, c[4] + 1.0)} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(1), k(2), k(3))} />
      <Chips t={t} c={c} list={[["THE LITTLE SQUARE"], ["PEEL AND STICK"], ["A GLUE MEANT TO BE STRONG"], ["NO USE FOR IT"], ["WHY?", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ failure (5-8) */
const SceneFailure: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Stamp x={560} y={230} text="1968" o={vis(t, c[0] + 1.0)} size={64} color={orange} rot={-3} />
          <Person x={720} y={640} s={1.6} body={SOFT} />
          <Plaque x={720} y={700} text="Spencer Silver" w={420} s={0.8} o={vis(t, c[0] + 2.6)} />
          <G x={1250} y={520} o={vis(t, c[0] + 1.6)}>
            <path d="M-60 -200 H60 V-80 L140 100 Q150 150 100 150 H-100 Q-150 150 -140 100 L-60 -80 Z" fill="#fff" stroke={ink} strokeWidth={7} strokeLinejoin="round" />
            <path d="M-100 40 H100 L140 100 Q150 150 100 150 H-100 Q-150 150 -140 100 Z" fill={teal} fillOpacity={0.4} />
          </G>
          <Note x={1250} y={260} text="the company 3M" o={vis(t, c[0] + 3.2)} size={44} fill={ink} />
          <Note x={1250} y={730} text="a very strong adhesive" o={vis(t, c[0] + 4.0)} size={38} fill={teal} />
        </G>
        <G o={k(1)}>
          <Bar x={360} y={300} w={900} fill={teal} label="expected: very strong" dash o={1} />
          <Bar x={360} y={420} w={260} fill={orange} label="made: weak" o={vis(t, c[1] + 1.4)} />
          <G o={vis(t, c[1] + 4.0)}>
            <rect x={420} y={640} width={300} height={100} fill="#fff" stroke={ink} strokeWidth={5} />
            <g transform={`translate(0 ${lerp(0, -70, ramp(t, c[1] + 4.2, c[1] + 5.4))}) rotate(${lerp(0, -8, ramp(t, c[1] + 4.2, c[1] + 5.4))} 420 640)`}>
              <rect x={420} y={620} width={300} height={100} fill="#fff" stroke={ink} strokeWidth={5} />
              <rect x={420} y={700} width={300} height={20} fill={YELLOW} />
            </g>
            <Note x={1150} y={660} text="peels off without tearing" o={vis(t, c[1] + 5.0)} size={40} fill={teal} />
          </G>
        </G>
        <G o={k(2)}>
          <G x={560} y={440}>
            {[0, 1, 2].map((r) =>
              [0, 1, 2, 3].map((cc) => <circle key={`${r}${cc}`} cx={-120 + cc * 80} cy={-80 + r * 80} r={34} fill={YELLOW} stroke={ink} strokeWidth={5} />),
            )}
            <line x1={-190} y1={140} x2={190} y2={140} stroke={ink} strokeWidth={8} />
            <Note x={0} y={210} text="tiny acrylic spheres, enlarged" o={vis(t, c[2] + 1.0)} size={34} fill={ink} />
          </G>
          <G x={1180} y={450} o={vis(t, c[2] + 3.4)}>
            <rect x={-40} y={-100} width={80} height={200} rx={18} fill="#fff" stroke={ink} strokeWidth={6} />
            <rect x={-18} y={-134} width={36} height={34} rx={6} fill={teal} stroke={ink} strokeWidth={5} />
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={50 + i * 26} cy={-120 + i * 14} r={8} fill={GREY} />
            ))}
            <Note x={0} y={160} text="a spray" o={1} size={38} fill={ink} />
          </G>
          <G x={1560} y={450} o={vis(t, c[2] + 4.4)}>
            <rect x={-130} y={-100} width={260} height={200} fill={SAND} stroke={ink} strokeWidth={8} />
            {[[-70, -40], [20, 20], [70, -50], [-30, 50]].map(([px, py]) => (
              <circle key={`${px}${py}`} cx={px} cy={py} r={10} fill={RED} />
            ))}
            <Note x={0} y={160} text="a bulletin board" o={1} size={38} fill={ink} />
          </G>
          <Note x={960} y={720} text="Lemelson-MIT Program" o={vis(t, c[2] + 2.0)} size={34} fill={teal} />
        </G>
        <G o={k(3)}>
          <Stamp x={960} y={260} text="A SOLUTION WITHOUT A PROBLEM" o={vis(t, c[3] + 1.0)} size={50} pad={80} color={orange} rot={-2} />
          {[0, 1, 2, 3, 4].map((i) => (
            <G key={i} o={vis(t, c[3] + 2.6 + i * 0.5)}>
              <rect x={400 + i * 240} y={400} width={190} height={170} rx={12} fill="#fff" stroke={ink} strokeWidth={6} />
              <rect x={400 + i * 240} y={400} width={190} height={46} rx={12} fill={teal} />
              <Txt x={495 + i * 240} y={423} size={30} fill="#fff" spacing={3}>
                {`YEAR ${i + 1}`}
              </Txt>
              <Txt x={495 + i * 240} y={510} size={70} fill={GREY}>
                ?
              </Txt>
            </G>
          ))}
          <Note x={960} y={690} text="Wikipedia" o={vis(t, c[3] + 1.4)} size={36} fill={teal} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(2), k(3))} />
      <Chips t={t} c={c} list={[["1968, AN ACCIDENT"], ["A WEAK GLUE"], ["TINY SPHERES"], ["ABOUT FIVE YEARS"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ fry (9-13) */
const SceneFry: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Person x={500} y={610} s={1.6} body={SOFT} />
          <Plaque x={500} y={680} text="Arthur Fry" w={340} s={0.8} o={vis(t, c[0] + 1.6)} />
          <Book x={1180} y={440} s={1.0} />
          {[0, 1, 2].map((i) => (
            <Strip key={i} x={1060 + i * 120} y={330 + lerp(0, 150 + i * 30, ramp(t, c[0] + 3.0 + i * 0.5, c[0] + 4.2 + i * 0.5))} rot={lerp(0, 20 - i * 18, ramp(t, c[0] + 3.0 + i * 0.5, c[0] + 4.2 + i * 0.5))} />
          ))}
          <Note x={1180} y={680} text="a hymn book, bookmarks slipping" o={vis(t, c[0] + 3.0)} size={38} fill={ink} />
        </G>
        <G o={k(1)}>
          <Bulb x={500} y={330} on={vis(t, c[1] + 1.0)} s={1.4} />
          <Tick x={730} y={300} s={1.2} o={vis(t, c[1] + 2.2)} />
          <Sheet x={1150} y={430} w={340} h={440} lines={4} />
          <Strip x={1120} y={380} glue w={60} />
          <Note x={1150} y={700} text="a gentle grip, no torn page" o={vis(t, c[1] + 3.4)} size={40} fill={teal} />
        </G>
        <G o={k(2)}>
          <Txt x={560} y={420} size={190} serif fill={ink}>
            1973
          </Txt>
          <Txt x={960} y={410} size={120} serif fill={orange}>
            ?
          </Txt>
          <Txt x={1360} y={420} size={190} serif fill={ink}>
            1974
          </Txt>
          <Stamp x={960} y={650} text="SOURCES DIFFER" o={vis(t, c[2] + 2.4)} size={60} color={teal} rot={-2} />
        </G>
        <G o={k(3)}>
          <Desk x={600} y={560} w={760} />
          <rect x={290} y={470} width={240} height={90} fill="#fff" stroke={ink} strokeWidth={5} />
          <Txt x={410} y={515} size={28} fill={ink} weight={700}>
            OWN PROJECT
          </Txt>
          <Person x={760} y={560} s={1.1} body={SOFT} />
          <Arrow x1={900} y1={420} x2={1380} y2={420} color={GREY} w={8} o={vis(t, c[3] + 2.2)} />
          {[0, 1, 2].map((i) => (
            <SNote key={i} x={1000 + i * 120} y={490} s={0.3} rot={i * 8 - 8} lines={false} o={vis(t, c[3] + 2.4 + i * 0.6)} />
          ))}
          <Person x={1500} y={600} s={1.1} body={WARM} o={vis(t, c[3] + 3.0)} />
          <Person x={1700} y={600} s={1.1} body={WARM} o={vis(t, c[3] + 3.4)} />
          <Note x={960} y={725} text="Wikipedia" o={vis(t, c[3] + 1.4)} size={36} fill={teal} />
          <Note x={960} y={220} text="company policy: time for your own projects" o={vis(t, c[3] + 0.6)} size={38} fill={ink} />
        </G>
        <G o={k(4)}>
          <Desk x={520} y={600} w={420} />
          <Desk x={1400} y={600} w={420} />
          {[0, 1, 2].map((i) => (
            <SNote key={i} x={lerp(520, 1400, ramp(t, c[4] + 1.0 + i * 0.9, c[4] + 2.6 + i * 0.9))} y={430 - Math.sin(ramp(t, c[4] + 1.0 + i * 0.9, c[4] + 2.6 + i * 0.9) * Math.PI) * 120} s={0.4} rot={-6 + i * 6} o={vis(t, c[4] + 1.0 + i * 0.9)} />
          ))}
          <Strip x={520} y={500} o={1 - vis(t, c[4] + 4.0)} />
          <SNote x={520} y={500} s={0.3} o={vis(t, c[4] + 4.4)} />
          <Note x={960} y={700} text="a second life" o={vis(t, c[4] + 4.8)} size={46} fill={teal} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(3), k(4))} />
      <Chips t={t} c={c} list={[["THE HYMN BOOK"], ["A GENTLE GRIP"], ["THE YEAR", true], ["TIME FOR OWN PROJECTS"], ["MESSAGES"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ market (14-18) */
const SceneMarket: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <CityMap x={620} y={420} w={720} h={440} dots={[[-200, -90, orange], [-30, 60, orange], [140, -120, orange], [240, 90, orange], [20, -20, GREY]]} />
          <Stamp x={620} y={190} text="1977" o={vis(t, c[0] + 1.0)} size={56} color={orange} rot={-3} />
          <Plaque x={1470} y={420} text="Press and Peel" w={560} s={0.9} o={vis(t, c[0] + 2.4)} />
          <Note x={1470} y={540} text="a test in several cities" o={vis(t, c[0] + 3.6)} size={38} fill={teal} />
        </G>
        <G o={k(1)}>
          <rect x={460} y={400} width={1000} height={70} rx={30} fill="#fff" stroke={ink} strokeWidth={7} />
          <rect x={466} y={406} width={496} height={58} rx={26} fill={orange} />
          <Stamp x={960} y={260} text="MIXED" o={vis(t, c[1] + 1.4)} size={80} color={orange} rot={-3} />
          <Note x={960} y={600} text="Wikipedia: disappointing" o={vis(t, c[1] + 3.0)} size={46} fill={teal} />
        </G>
        <G o={k(2)}>
          <CityMap x={620} y={430} w={720} h={440} dots={[[-100, -60, teal]]} />
          <Txt x={780} y={450} size={40} fill={ink} weight={700}>
            Boise, Idaho
          </Txt>
          <Stamp x={620} y={190} text="1978" o={vis(t, c[2] + 1.0)} size={56} color={orange} rot={-3} />
          {[0, 1, 2].map((i) => (
            <G key={i} o={vis(t, c[2] + 2.2 + i * 0.6)}>
              <rect x={1180 + i * 190} y={330} width={150} height={200} fill="#fff" stroke={ink} strokeWidth={6} />
              {[0, 1].map((r) => [0, 1].map((cc) => <rect key={`${r}${cc}`} x={1204 + i * 190 + cc * 62} y={360 + r * 70} width={38} height={46} fill={SOFT} stroke={ink} strokeWidth={3} />))}
              <SNote x={1255 + i * 190} y={290} s={0.3} rot={i * 8 - 8} lines={false} />
            </G>
          ))}
          <Note x={1470} y={620} text="free samples in offices" o={vis(t, c[2] + 3.0)} size={42} fill={teal} />
        </G>
        <G o={k(3)}>
          {Array.from({ length: 10 }, (_, i) => (
            <G key={i} o={vis(t, c[3] + 0.8 + i * 0.12)}>
              <Person x={410 + i * 120} y={560} s={0.9} body={i < 9 ? SOFT : "#E4E7EC"} />
              {i < 9 && <Tick x={410 + i * 120} y={610} s={0.4} />}
            </G>
          ))}
          <Stamp x={960} y={290} text="ABOUT 9 IN 10" o={vis(t, c[3] + 2.0)} size={72} color={teal} rot={-2} />
          <Note x={960} y={700} text="Wikipedia" o={vis(t, c[3] + 2.6)} size={38} fill={teal} />
        </G>
        <G o={k(4)}>
          <Stamp x={560} y={230} text="1980" o={vis(t, c[4] + 1.0)} size={64} color={orange} rot={-3} />
          <path d="M360 330 L560 290 L900 310 L1360 290 L1500 380 L1450 520 L1280 560 L1100 640 L900 600 L640 620 L430 560 L330 450 Z" fill="#EAF3F3" stroke={ink} strokeWidth={7} strokeLinejoin="round" />
          {[[480, 420], [620, 480], [760, 380], [900, 500], [1040, 400], [1180, 480], [1320, 400], [700, 560], [1100, 580]].map(([px, py], i) => (
            <SNote key={i} x={px} y={py} s={0.26} rot={(i % 3) * 8 - 8} lines={false} o={vis(t, c[4] + 2.4 + i * 0.35)} />
          ))}
          <Plaque x={1080} y={200} text="Post-it Note" w={420} s={0.9} o={vis(t, c[4] + 0.8)} />
          <Note x={960} y={710} text="on sale across the country" o={vis(t, c[4] + 2.0)} size={42} fill={teal} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(2), k(3), k(4))} />
      <Chips t={t} c={c} list={[["1977, TEST MARKETS"], ["MIXED RESULTS", true], ["1978, FREE SAMPLES"], ["ABOUT 9 IN 10"], ["1980, ON SALE"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ dispute (19-22) */
const SceneDispute: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Stamp x={960} y={260} text="THE COMPANY'S STORY" o={vis(t, c[0] + 0.8)} size={64} color={teal} rot={-2} />
          <Person x={640} y={640} s={1.6} body={SOFT} />
          <Person x={1280} y={640} s={1.6} body={WARM} />
          <Note x={960} y={480} text="?" o={vis(t, c[0] + 2.4)} size={200} fill={orange} />
        </G>
        <G o={k(1)}>
          <Person x={620} y={620} s={1.6} body={WARM} />
          <Plaque x={620} y={690} text="Alan Amron" w={380} s={0.8} o={vis(t, c[1] + 1.6)} />
          <Stamp x={1300} y={260} text="1973" o={vis(t, c[1] + 2.4)} size={72} color={orange} rot={-3} />
          <Stamp x={1300} y={450} text="SECOND-HAND" o={vis(t, c[1] + 0.6)} size={60} color={teal} rot={-3} />
          <Note x={1300} y={560} text="Wikipedia notes" o={vis(t, c[1] + 0.8)} size={44} fill={teal} />
        </G>
        <G o={k(2)}>
          <Sheet x={620} y={400} w={420} h={400} lines={3} />
          <Txt x={620} y={250} size={34} fill={ink} weight={700}>
            SETTLEMENT
          </Txt>
          <Note x={620} y={300} text="(CONFIDENTIAL)" o={vis(t, c[2] + 0.4)} size={30} fill={GREY} />
          <G o={vis(t, c[2] + 3.4)}>
            <Sheet x={1300} y={400} w={420} h={400} lines={3} />
            <Txt x={1300} y={250} size={34} fill={ink} weight={700}>
              DISMISSED, 2016
            </Txt>
            <line x1={1130} y1={290} x2={1470} y2={520} stroke={RED} strokeWidth={10} strokeLinecap="round" opacity={0.5} />
          </G>
          <Stamp x={960} y={660} text="SECOND-HAND" o={vis(t, c[2] + 0.6)} size={44} color={teal} rot={-2} />
          <Note x={960} y={725} text="Wikipedia" o={vis(t, c[2] + 0.8)} size={34} fill={teal} />
        </G>
        <G o={k(3)}>
          <line x1={960} y1={250} x2={960} y2={600} stroke={ink} strokeWidth={10} />
          <line x1={520} y1={330} x2={1400} y2={330} stroke={ink} strokeWidth={10} strokeLinecap="round" />
          {[520, 1400].map((px) => (
            <G key={px}>
              <line x1={px} y1={330} x2={px - 100} y2={470} stroke={ink} strokeWidth={5} />
              <line x1={px} y1={330} x2={px + 100} y2={470} stroke={ink} strokeWidth={5} />
              <path d={`M${px - 120} 470 H${px + 120} Q${px + 100} 530 ${px} 530 Q${px - 100} 530 ${px - 120} 470 Z`} fill={SOFT} stroke={ink} strokeWidth={6} />
              <circle cx={px} cy={440} r={30} fill={GOLD} stroke={ink} strokeWidth={5} />
            </G>
          ))}
          <rect x={860} y={600} width={200} height={26} rx={8} fill={SAND} stroke={ink} strokeWidth={6} />
          <Stamp x={960} y={690} text="DISPUTED CREDIT" o={vis(t, c[3] + 2.0)} size={58} color={orange} rot={-2} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(1), k(2), k(3))} />
      <Chips t={t} c={c} list={[["THE COMPANY'S STORY", true], ["ANOTHER CLAIM"], ["TWO LAWSUITS"], ["WE CANNOT SETTLE IT", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ practical (23-25) */
const ScenePractical: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <rect x={360} y={250} width={400} height={360} rx={14} fill="#fff" stroke={ink} strokeWidth={7} />
          <rect x={1160} y={250} width={400} height={360} rx={14} fill="#fff" stroke={ink} strokeWidth={7} />
          <SNote x={lerp(560, 1360, ramp(t, c[0] + 2.0, c[0] + 3.8))} y={430 - Math.sin(ramp(t, c[0] + 2.0, c[0] + 3.8) * Math.PI) * 130} s={0.9} rot={-4} curl />
          <Arrow x1={800} y1={330} x2={1120} y2={330} color={teal} w={12} o={vis(t, c[0] + 1.6)} />
          <Tick x={1360} y={680} s={1} o={vis(t, c[0] + 4.2)} />
          <Note x={960} y={200} text="peel it off, stick it somewhere else" o={vis(t, c[0] + 1.0)} size={42} fill={ink} />
        </G>
        <G o={k(1)}>
          <Stamp x={960} y={250} text="OUR READING: AN INFERENCE" o={vis(t, c[1] + 0.6)} size={44} pad={80} color={teal} rot={-2} />
          <G x={560} y={500}>
            <rect x={-150} y={-60} width={300} height={120} rx={14} fill={WARM} stroke={RED} strokeWidth={7} />
            <Txt x={0} y={4} size={64} fill={RED} weight={800}>
              FLAW
            </Txt>
          </G>
          <Arrow x1={760} y1={500} x2={1100} y2={500} color={orange} w={14} o={vis(t, c[1] + 2.4)} />
          <G x={1360} y={500} o={vis(t, c[1] + 3.2)}>
            <rect x={-200} y={-60} width={400} height={120} rx={14} fill={SOFT} stroke={GREEN} strokeWidth={7} />
            <Txt x={0} y={4} size={64} fill={GREEN} weight={800}>
              FEATURE
            </Txt>
          </G>
          <Note x={560} y={620} text="a weak grip in a glue" o={vis(t, c[1] + 1.4)} size={36} fill={ink} />
          <Note x={1360} y={620} text="the point of a note" o={vis(t, c[1] + 3.6)} size={36} fill={ink} />
        </G>
        <G o={k(2)}>
          <Bulb x={520} y={330} on={0} s={1.5} />
          <Jar x={520} y={620} s={0.5} />
          <Txt x={lerp(1500, 1080, ramp(t, c[2] + 1.6, c[2] + 3.2))} y={400} size={280} serif fill={orange}>
            ?
          </Txt>
          <Note x={1100} y={640} text="an idea nobody wants yet" o={vis(t, c[2] + 1.0)} size={44} fill={ink} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(2))} />
      <Chips t={t} c={c} list={[["PEEL AND RESTICK"], ["OUR READING", true], ["AN IDEA WAITING"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ close (26-28) */
/** Pasillo generico: lampara de techo (lit 0..1) e interruptor de pared. */
const Hall: React.FC<{ lit: number }> = ({ lit }) => (
  <G y={70}>
    <line x1={200} y1={170} x2={1720} y2={170} stroke={ink} strokeWidth={6} />
    <line x1={200} y1={640} x2={1720} y2={640} stroke={ink} strokeWidth={6} />
    <circle cx={960} cy={250} r={170} fill={GOLD} fillOpacity={0.35 * lit} />
    <line x1={960} y1={170} x2={960} y2={210} stroke={ink} strokeWidth={6} />
    <path d="M900 250 Q900 210 960 210 Q1020 210 1020 250 Z" fill={lit > 0.5 ? GOLD : "#E4E7EC"} stroke={ink} strokeWidth={6} />
    <rect x={1400} y={380} width={100} height={150} rx={10} fill="#fff" stroke={ink} strokeWidth={6} />
    <rect x={1430} y={415} width={40} height={80} rx={8} fill={teal} stroke={ink} strokeWidth={5} />
  </G>
);

const SceneClose: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <SNote x={760} y={440} s={2.1} rot={-4} curl />
          <Note x={1400} y={400} text="meant to be strong" o={vis(t, c[0] + 1.0)} size={50} fill={ink} />
          <Note x={1400} y={480} text="famous for being weak" o={vis(t, c[0] + 2.4)} size={50} fill={orange} />
        </G>
        <G o={k(1)}>
          <Hall lit={1} />
        </G>
        <G o={k(2)}>
          <Hall lit={vis(t, c[2] + 2.6, c[2] + 5.2)} />
          <Txt x={960} y={470} size={150} serif fill={orange} spacing={4}>
            WHY?
          </Txt>
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(2))} />
      <Chips t={t} c={c} list={[["MEANT TO BE STRONG"], ["HIDDEN IN PLAIN SIGHT"], ["NEXT: THE HALLWAY LIGHT", true]]} />
    </>
  );
};

export const SCENES016: Record<string, React.FC<SceneProps>> = {
  "hook": SceneHook,
  "failure": SceneFailure,
  "fry": SceneFry,
  "market": SceneMarket,
  "dispute": SceneDispute,
  "practical": ScenePractical,
  "close": SceneClose,
};
