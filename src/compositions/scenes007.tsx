import React from "react";
import { Chip, vis } from "../components/ui";
import { theme } from "../themes/brand";
import { lerp, ramp } from "../utils/anim";
import type { SceneProps } from "./scenes";
import { Arrow, bg, Car, G, GOLD, GREEN, GREY, Ground, ink, orange, Person, Plaque, RED, SAND, seg, SimpleNote, SOFT, Speech, Stamp, SvgFrame, teal, Txt, useT, WARM } from "./kit";

const PAPER = "#FFFDF4";

/** Etiqueta de precio vectorial. hi: resalta el digito `mark`; lead: agranda el primer digito. */
const PriceTag: React.FC<{ x: number; y: number; s?: number; o?: number; text: string; hi?: number; lead?: number; rot?: number; w?: number; fs?: number; mark?: number }> = ({
  x, y, s = 1, o = 1, text, hi = 0, lead = 0, rot = 0, w = 340, fs, mark,
}) => {
  const size = fs ?? (text.length > 5 ? 80 : 96);
  const m = mark ?? text.length - 1;
  const lit = hi > 0.5 || lead > 0.5;
  return (
    <G x={x} y={y} s={s * (1 + 0.05 * hi)} o={o} rot={rot}>
      <path d={`M${140 - w} -70 H140 L210 0 L140 70 H${140 - w} Z`} fill={PAPER} stroke={lit ? orange : ink} strokeWidth={7} strokeLinejoin="round" />
      <circle cx={165} cy={0} r={12} fill={bg} stroke={lit ? orange : ink} strokeWidth={6} />
      <text x={140 - w / 2} y={4} textAnchor="middle" dominantBaseline="central" fontFamily={theme.font} fontWeight={900} fontSize={size} fill={ink}>
        {text.split("").map((ch, i) => (
          <tspan
            key={i}
            fill={(i === m && hi > 0.5) || (i === 1 && lead > 0) ? orange : ink}
            fillOpacity={lead > 0 && i >= 2 ? 1 - 0.6 * lead : 1}
            fontSize={i === 1 && lead > 0 ? size * (1 + 0.5 * lead) : size}
          >
            {ch}
          </tspan>
        ))}
      </text>
    </G>
  );
};

const Src: React.FC<{ x: number; y: number; text: string; o: number }> = ({ x, y, text, o }) => (
  <G o={o}>
    <Txt x={x} y={y} size={28} weight={600} fill={GREY}>
      {text}
    </Txt>
  </G>
);

const Tick: React.FC<{ x: number; y: number; o?: number; s?: number }> = ({ x, y, o = 1, s = 1 }) => (
  <G x={x} y={y} o={o} s={s}>
    <circle r={34} fill={GREEN} />
    <polyline points="-16,2 -4,16 18,-14" fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
  </G>
);

const Cart: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M-110 -120 H110 L80 10 H-80 Z" fill="#fff" stroke={ink} strokeWidth={6} strokeLinejoin="round" />
    <path d="M-110 -120 L-140 -170 H-180" fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={-50} cy={46} r={20} fill={ink} />
    <circle cx={50} cy={46} r={20} fill={ink} />
  </G>
);

const Box: React.FC<{ x: number; y: number; s?: number; o?: number; color?: string; label?: string }> = ({ x, y, s = 1, o = 1, color = SAND, label }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-60} y={-90} width={120} height={90} rx={8} fill={color} stroke={ink} strokeWidth={5} />
    <rect x={-60} y={-90} width={120} height={22} rx={8} fill="#fff" opacity={0.5} />
    {label && (
      <Txt x={0} y={-36} size={30}>
        {label}
      </Txt>
    )}
  </G>
);

const Register: React.FC<{ x: number; y: number; drawer?: number }> = ({ x, y, drawer = 0 }) => (
  <G x={x} y={y}>
    <rect x={-150} y={10} width={300} height={50 + drawer * 56} rx={8} fill={SAND} stroke={ink} strokeWidth={5} />
    {drawer > 0.4 && <rect x={-110} y={24} width={220} height={30} fill={GREEN} opacity={0.6} />}
    <rect x={-170} y={-110} width={340} height={120} rx={14} fill={SOFT} stroke={ink} strokeWidth={6} />
    <rect x={-120} y={-250} width={240} height={120} rx={10} fill="#fff" stroke={ink} strokeWidth={6} />
    <Txt x={0} y={-190} size={54} fill={teal}>
      $ 0.00
    </Txt>
    {[-90, -30, 30, 90].map((kx) => (
      <circle key={kx} cx={kx} cy={-60} r={14} fill={ink} />
    ))}
  </G>
);

const Stairs: React.FC<{ o?: number; t: number; times: [number, number, number, number, number]; lbl: [string, string]; cent?: boolean }> = ({ o = 1, t, times, lbl, cent = false }) => (
  <G o={o}>
    <path d="M300 620 H960 V520 H1620 V548 H990 V648 H300 Z" fill={SAND} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
    <PriceTag x={630} y={550} s={0.9} text="$2.99" o={vis(t, times[0])} />
    <PriceTag x={1290} y={450} s={0.9} text="$3.00" o={vis(t, times[1])} />
    <G o={vis(t, times[2])}>
      <Txt x={630} y={430} size={50} fill={teal}>
        {lbl[0]}
      </Txt>
    </G>
    <G o={vis(t, times[3])}>
      <Txt x={1290} y={330} size={50} fill={orange}>
        {lbl[1]}
      </Txt>
    </G>
    {cent && (
      <G o={vis(t, times[4])}>
        <Txt x={975} y={715} size={44} fill={RED}>
          1 cent
        </Txt>
      </G>
    )}
  </G>
);

/* ------------------------------------------------------------------ price-hook */
const SceneHook: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const s0 = seg(t, c, 0);
  const s1 = seg(t, c, 1);
  const s2 = seg(t, c, 2);
  const s3 = seg(t, c, 3);
  const s4 = seg(t, c, 4);
  const rowA = ["$4.99", "$9.99", "$2.99", "$5.00", "$19.99"];
  const rowB = ["$12.00", "$14.99", "$3.50", "$7.99", "$8.00"];
  // 6 de 10 acaban en 9: los indices 0,1,2,4 de la fila A y 1,3 de la B
  const nines = [true, true, true, false, true, false, true, false, true, false];
  return (
    <>
      <SvgFrame>
        <G o={Math.max(s0, s1)}>
          <PriceTag x={960} y={420} s={1.5} text="$4.99" hi={ramp(t, c[1] + 1.7, c[1] + 2.1)} />
          <G o={vis(t, c[0] + 1.9, c[1] - 0.4)}>
            <Arrow x1={1560} y1={620} x2={1330} y2={500} color={orange} />
          </G>
        </G>
        <G o={s1}>
          {[[330, 220, "$9.99"], [1590, 220, "$19.99"], [330, 640, "$2.99"], [1590, 640, "$14.99"]].map(([px, py, tx], i) => (
            <PriceTag key={tx as string} x={px as number} y={py as number} s={0.75} text={tx as string} hi={ramp(t, c[1] + 1.9 + i * 0.15, c[1] + 2.3 + i * 0.15)} o={vis(t, c[1] + 0.5 + i * 0.2)} />
          ))}
        </G>
        <G o={s2}>
          {[...rowA, ...rowB].map((tx, i) => {
            const lit = nines[i] ? ramp(t, c[2] + 5.7 + (i % 5) * 0.12 + (i > 4 ? 0.12 : 0), c[2] + 6.1 + (i % 5) * 0.12) : 0;
            return <PriceTag key={i} x={400 + (i % 5) * 280} y={i < 5 ? 270 : 470} s={0.6} text={tx} hi={lit} o={vis(t, c[2] + 0.3 + i * 0.1)} />;
          })}
          <Src x={960} y={650} text="Holdershaw, Gendall & Garland, 1997 (advertising)" o={vis(t, c[2] + 3.6)} />
        </G>
        <G o={s3}>
          <G o={vis(t, c[3] + 2.3)}>
            <Txt x={1240} y={250} size={130} serif fill={GREY}>
              $10
            </Txt>
          </G>
          <PriceTag x={900} y={430} s={1.4} text="$9.99" hi={1} />
          <G x={330} y={440} o={vis(t, c[3] + 0.2)}>
            <circle r={80} fill="#FFE69A" stroke={ink} strokeWidth={6} />
            <circle cx={-26} cy={-18} r={8} fill={ink} />
            <line x1={14} y1={-18} x2={42} y2={-18} stroke={ink} strokeWidth={7} strokeLinecap="round" />
            <path d="M-34 24 Q4 56 40 22" fill="none" stroke={ink} strokeWidth={7} strokeLinecap="round" />
          </G>
        </G>
        <G o={s4}>
          <PriceTag x={960} y={600} s={1.4} text="$9.99" hi={1} />
          <Txt x={1230} y={440} size={120} serif fill={GREY}>
            $10
          </Txt>
          <line x1={1110} y1={440} x2={1350} y2={440} stroke={RED} strokeWidth={12} strokeLinecap="round" />
          <G o={vis(t, c[4] + 0.2)}>
            <Txt x={960} y={250} size={150} serif fill={orange}>
              WHY?
            </Txt>
          </G>
        </G>
      </SvgFrame>
      <Chip text="THE LAST THING YOU BOUGHT" x={960} y={50} o={s0} />
      <Chip text="THERE IS A GOOD CHANCE" x={960} y={50} o={s1} />
      <Chip text="ABOUT SIX IN TEN ADS" x={960} y={50} o={s2} color={orange} />
      <Chip text="YOU KNOW THE TRICK" x={960} y={50} o={s3} />
      <Chip text="WHY DOES IT STILL WORK?" x={960} y={50} o={s4} color={orange} />
      <SimpleNote o={s2} />
    </>
  );
};

/* ------------------------------------------------------------------ left-digit */
const SceneLeft: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const s5 = seg(t, c, 0);
  const s6 = seg(t, c, 1);
  const s7 = seg(t, c, 2);
  const s8 = seg(t, c, 3);
  const s9 = seg(t, c, 4);
  const s10 = seg(t, c, 5);
  const flip = ramp(t, c[4] + 3.5, c[4] + 3.8);
  const pupil = lerp(-18, 18, ramp(t, c[0] + 2.8, c[0] + 3.9));
  return (
    <>
      <SvgFrame>
        <G o={s5}>
          <PriceTag x={800} y={420} s={1.5} text="$2.99" />
          <line x1={520} y1={580} x2={lerp(520, 1080, ramp(t, c[0] + 2.6, c[0] + 3.8))} y2={580} stroke={orange} strokeWidth={10} strokeLinecap="round" />
          <Txt x={800} y={640} size={44} fill={orange}>
            left to right
          </Txt>
          <G x={1500} y={430} o={vis(t, c[0] + 1.4)}>
            <circle r={110} fill="#F1D5B0" stroke={ink} strokeWidth={6} />
            <ellipse cx={-30} cy={-10} rx={42} ry={32} fill="#fff" stroke={ink} strokeWidth={5} />
            <circle cx={-30 + pupil} cy={-10} r={15} fill={ink} />
          </G>
        </G>
        <G o={s6}>
          <PriceTag x={960} y={430} s={1.6} text="$2.99" lead={ramp(t, c[1] + 1.0, c[1] + 1.6)} />
        </G>
        <G o={s7}>
          <Stairs t={t} times={[c[2] + 0.6, c[2] + 2.5, c[2] + 1.7, c[2] + 3.7, c[2] + 4.6]} lbl={["2-something", "3"]} cent />
        </G>
        <G o={s8}>
          <Txt x={960} y={330} size={150} serif>
            left-digit effect
          </Txt>
          <G o={vis(t, c[3] + 1.4)}>
            <PriceTag x={960} y={560} s={1.1} text="$2.99" lead={1} />
          </G>
        </G>
        <G o={s9}>
          <PriceTag x={960} y={430} s={1.6} text={flip > 0.5 ? "$3.00" : "$2.99"} lead={flip > 0.5 ? 1 : ramp(t, c[4] + 2.0, c[4] + 2.6)} />
          <G o={flip > 0 && flip < 1 ? 0.5 : 0}>
            <circle cx={800} cy={430} r={120} fill={GOLD} opacity={0.5} />
          </G>
        </G>
        <G o={s10}>
          <G o={vis(t, c[5] + 0.3)}>
            <PriceTag x={420} y={290} s={0.7} text="$2.99" />
            <Txt x={720} y={290} size={50} fill={GREY}>
              vs
            </Txt>
            <PriceTag x={1010} y={290} s={0.7} text="$3.00" />
          </G>
          <G o={vis(t, c[5] + 2.1)}>
            <Arrow x1={1360} y1={340} x2={1560} y2={240} color={GREEN} w={12} />
            <Txt x={1560} y={190} size={54} fill={GREEN}>
              jump
            </Txt>
          </G>
          <G o={vis(t, c[5] + 2.8)}>
            <PriceTag x={420} y={510} s={0.7} text="$2.90" />
            <Txt x={720} y={510} size={50} fill={GREY}>
              vs
            </Txt>
            <PriceTag x={1010} y={510} s={0.7} text="$2.99" />
          </G>
          <G o={vis(t, c[5] + 4.6)}>
            <Arrow x1={1360} y1={510} x2={1580} y2={510} color={GREY} w={12} />
            <Txt x={1500} y={450} size={54} fill={GREY}>
              no jump
            </Txt>
          </G>
          <Src x={960} y={655} text="Thomas & Morwitz, 2005" o={vis(t, c[5] + 1.0)} />
        </G>
      </SvgFrame>
      <Chip text="THE SHORT ANSWER" x={960} y={50} o={s5} />
      <Chip text="THE FIRST DIGIT WINS" x={960} y={50} o={s6} color={orange} />
      <Chip text="ONE CENT, TWO LEVELS" x={960} y={50} o={s7} />
      <Chip text="RESEARCHERS' NAME FOR IT" x={960} y={50} o={s8} />
      <Chip text="THE KEY DETAIL" x={960} y={50} o={s9} color={orange} />
      <Chip text="JUMP OR NO JUMP" x={960} y={50} o={s10} />
      <SimpleNote o={Math.max(s5, s6, s7, s8, s9, s10)} />
    </>
  );
};

/* ------------------------------------------------------------------ evidence */
const SceneEvidence: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const q = seg(t, c, 0);
  const exp = seg(t, c, 1, 2);
  const dress = seg(t, c, 3);
  const odo = seg(t, c, 4);
  const cars = seg(t, c, 5);
  const chg = ramp(t, c[1] + 2.7, c[1] + 3.5);
  const spin = ramp(t, c[4] + 1.4, c[4] + 1.7);
  return (
    <>
      <SvgFrame>
        <G o={q}>
          <Box x={640} y={560} s={1.5} />
          <Box x={1280} y={560} s={1.5} />
          <PriceTag x={640} y={340} s={0.9} text="$4.99" o={vis(t, c[0] + 0.5)} />
          <PriceTag x={1280} y={340} s={0.9} text="$5.00" o={vis(t, c[0] + 0.9)} />
          <Txt x={960} y={220} size={160} serif fill={orange}>
            ?
          </Txt>
        </G>
        <G o={exp}>
          {[0, 1, 2].map((i) => (
            <G key={i} x={420 + i * 540} y={330} o={vis(t, c[1] + 0.4 + i * 0.5)}>
              <rect x={-190} y={-170} width={380} height={360} rx={16} fill={PAPER} stroke={ink} strokeWidth={5} />
              <Txt x={0} y={-124} size={40} fill={teal}>
                {`Experiment ${i + 1}`}
              </Txt>
              <PriceTag x={0} y={-30} s={0.8} text={chg > 0.5 ? "$4.99" : "$5.00"} hi={chg > 0.5 ? 1 : 0} />
              <G o={vis(t, c[2] + 1.0 + i * 0.2)}>
                <rect x={-110} y={78} width={60} height={40} fill={GREY} />
                <rect x={50} y={48} width={60} height={70} fill={orange} />
                <line x1={-140} y1={118} x2={140} y2={118} stroke={ink} strokeWidth={4} />
                <Txt x={-80} y={142} size={28} fill={GREY}>
                  $5.00
                </Txt>
                <Txt x={80} y={142} size={28} fill={orange}>
                  $4.99
                </Txt>
                <Txt x={0} y={174} size={22} weight={600} fill={GREY}>
                  example prices
                </Txt>
              </G>
            </G>
          ))}
          <G o={vis(t, c[1] + 3.8)}>
            <Txt x={960} y={728} size={40} fill={GREY}>
              real products
            </Txt>
          </G>
          <G o={vis(t, c[2] + 1.8)}>
            <Txt x={960} y={565} size={56} fill={GREEN}>
              all three
            </Txt>
          </G>
          <Src x={960} y={635} text="Anderson & Simester, 2003" o={vis(t, c[1] + 1.0)} />
          <Src x={960} y={680} text="bars not to scale" o={vis(t, c[2] + 1.0)} />
        </G>
        <G o={dress}>
          <path d="M-36 -170 Q-50 -110 -26 -60 L-100 150 H100 L26 -60 Q50 -110 36 -170 L18 -170 L0 -140 L-18 -170 Z" transform="translate(420 480) scale(1.5)" fill={SOFT} stroke={ink} strokeWidth={5} />
          <PriceTag x={420} y={720} s={0.7} text="$34" w={200} o={vis(t, c[3] + 5.9)} />
          <G o={vis(t, c[3] + 5.9)}>
            <rect x={900} y={460} width={170} height={180} fill={GREY} />
            <Txt x={985} y={680} size={60}>
              $34
            </Txt>
          </G>
          <G o={vis(t, c[3] + 4.6)}>
            <rect x={1220} y={400} width={170} height={240} fill={orange} />
            <Txt x={1305} y={680} size={60} fill={orange}>
              $39
            </Txt>
          </G>
          <G o={vis(t, c[3] + 4.0)}>
            <Txt x={1305} y={350} size={46} fill={orange}>
              about a third more
            </Txt>
          </G>
          <Src x={1150} y={735} text="according to the researchers; bars not to scale" o={vis(t, c[3] + 1.6)} />
        </G>
        <G o={odo}>
          <rect x={560} y={330} width={800} height={200} rx={20} fill={ink} />
          <Txt x={960} y={430} size={150} fill="#fff" spacing={8}>
            {spin > 0.5 ? "80,000" : "79,999"}
          </Txt>
          <Txt x={960} y={600} size={50} fill={GREY}>
            miles
          </Txt>
        </G>
        <G o={cars}>
          <G y={130}>
          <G o={vis(t, c[5] + 0.2)}>
            <Txt x={960} y={148} size={80} serif fill={teal}>
              more than 22 million sales
            </Txt>
          </G>
          <G o={vis(t, c[5] + 3.8)}>
            <Car x={520} y={600} s={1.4} color={teal} />
            <Plaque x={520} y={330} text="" w={420} />
            <Txt x={520} y={338} size={34}>
              just under 80,000 miles
            </Txt>
          </G>
          <G o={vis(t, c[5] + 8.2)}>
            <Car x={1400} y={600} s={1.4} color={orange} />
            <Plaque x={1400} y={330} text="" w={420} />
            <Txt x={1400} y={338} size={34}>
              just over 80,000 miles
            </Txt>
          </G>
          <G o={vis(t, c[5] + 6.3)}>
            <Arrow x1={1180} y1={450} x2={740} y2={450} color={GREEN} w={10} />
            <Txt x={960} y={400} size={64} fill={GREEN}>
              about $210
            </Txt>
          </G>
          <Src x={960} y={245} text="Lacetera, Pope & Sydnor (NBER, 2011)" o={vis(t, c[5] + 1.5)} />
          </G>
        </G>
      </SvgFrame>
      <Chip text="DOES IT CHANGE WHAT WE BUY?" x={960} y={50} o={q} />
      <Chip text="THREE FIELD EXPERIMENTS" x={960} y={50} o={seg(t, c, 1)} />
      <Chip text="A NINE ENDING RAISED DEMAND" x={960} y={50} o={seg(t, c, 2)} color={orange} />
      <Chip text="THE RESEARCHERS WROTE" x={960} y={50} o={dress} />
      <Chip text="EVEN ON NUMBERS THAT ARE NOT PRICES" x={960} y={50} o={odo} color={orange} />
      <Chip text="USED CARS AT AUCTION" x={960} y={50} o={cars} />
      <SimpleNote o={Math.max(exp, dress, odo, cars)} />
    </>
  );
};

/* ------------------------------------------------------------------ legend */
const SceneLegend: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const reg = seg(t, c, 0, 3);
  const line = seg(t, c, 4, 5);
  const drawer = ramp(t, c[2] + 2.4, c[2] + 2.9);
  const slip = ramp(t, c[1] + 2.9, c[1] + 3.9);
  return (
    <>
      <SvgFrame>
        <G o={reg}>
          <G x={1180} y={630}>
            <Person x={0} y={0} s={1.5} body={teal} />
          </G>
          <G o={vis(t, c[1] + 0.3, c[2] - 0.4)}>
            <rect x={lerp(1060, 1190, slip) - 40} y={lerp(600, 560, slip) - 20} width={80} height={40} rx={4} fill={GREEN} stroke={ink} strokeWidth={4} />
          </G>
          <rect x={260} y={630} width={1240} height={34} fill={SAND} stroke={ink} strokeWidth={5} />
          <rect x={300} y={664} width={1160} height={110} fill="#E3D5B3" stroke={ink} strokeWidth={5} />
          <Register x={700} y={570} drawer={drawer} />
          <G o={vis(t, c[2] + 2.5, c[3] - 0.4)}>
            <Txt x={1000} y={280} size={90} fill={orange}>
              DING!
            </Txt>
          </G>
          <G o={vis(t, c[2] + 3.4, c[3] - 0.4)}>
            <circle cx={820} cy={700} r={20} fill={GOLD} stroke={ink} strokeWidth={4} />
            <circle cx={870} cy={716} r={20} fill={GOLD} stroke={ink} strokeWidth={4} />
          </G>
          <G o={vis(t, c[2] + 5.0, c[3] - 0.4)}>
            <Txt x={1090} y={380} size={50} fill={teal}>
              announces the sale
            </Txt>
          </G>
                    <Stamp x={1500} y={230} text="AS THE STORY GOES" o={vis(t, c[0] + 2.2, c[3] - 0.4)} size={34} rot={-6} />
          <Stamp x={1150} y={290} text="NOT PROVEN" o={vis(t, c[3] + 2.9)} size={64} rot={-8} color={RED} />
          <G o={vis(t, c[3] + 3.3)}>
            <Txt x={1580} y={330} size={190} serif fill={orange}>
              ?
            </Txt>
          </G>
        </G>
        <G o={line}>
          <line x1={300} y1={280} x2={1640} y2={280} stroke={ink} strokeWidth={7} />
          {([[430, "1875", 4.9], [960, "1880s", 9.2], [1490, "1920", 3.7]] as [number, string, number][]).map(([px, lb, tt], i) => (
            <G key={lb} o={vis(t, (i === 2 ? c[5] : c[4]) + tt - 0.3)}>
              <circle cx={px} cy={280} r={20} fill={i === 2 ? teal : orange} stroke={ink} strokeWidth={5} />
              <Txt x={px} y={222} size={46} serif>
                {lb}
              </Txt>
            </G>
          ))}
          <G o={vis(t, c[4] + 1.3, c[4] + 3.3)}>
            <Txt x={700} y={420} size={140} serif fill={orange}>
              ?
            </Txt>
          </G>
          <G o={vis(t, c[4] + 3.3)}>
            <Speech x={430} y={430} text="a Chicago newspaper?" size={30} />
            <Src x={430} y={560} text="Morris (1979)" o={vis(t, c[4] + 3.8)} />
          </G>
          <G o={vis(t, c[4] + 6.3)}>
            <Speech x={960} y={430} text="nine endings: still rare" size={30} />
            <Src x={960} y={560} text="Adams (1992)" o={vis(t, c[4] + 6.8)} />
          </G>
          <G o={vis(t, c[5] + 0.9)}>
            <Person x={1490} y={690} s={1.0} body={ink} hat />
            <Txt x={1490} y={735} size={34} fill={teal}>
              Tomas Bata
            </Txt>
          </G>
          <G o={vis(t, c[5] + 6.4)}>
            <Plaque x={1490} y={440} text="BATA'S PRICE" w={420} />
          </G>
        </G>
      </SvgFrame>
      <Chip text="THE STORY ABOUT CASH REGISTERS" x={960} y={50} o={seg(t, c, 0)} />
      <Chip text="ACCORDING TO THE STORY" x={960} y={50} o={seg(t, c, 1, 2)} color={orange} />
      <Chip text="A NICE STORY, NOT PROVEN" x={960} y={50} o={seg(t, c, 3)} color={RED} />
      <Chip text="THE REAL ORIGIN IS MURKY" x={960} y={50} o={seg(t, c, 4)} />
      <Chip text="A CZECH BUSINESSMAN, 1920" x={960} y={50} o={seg(t, c, 5)} color={orange} />
      <SimpleNote o={line} />
    </>
  );
};

/* ------------------------------------------------------------------ shop */
const SceneShop: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const s23 = seg(t, c, 0);
  const s24 = seg(t, c, 1);
  const s25 = seg(t, c, 2);
  const s26 = seg(t, c, 3);
  const s27 = seg(t, c, 4);
  const s28 = seg(t, c, 5);
  return (
    <>
      <SvgFrame>
        <G o={s23}>
          <Ground y={720} />
          <rect x={440} y={300} width={760} height={420} fill={SAND} stroke={ink} strokeWidth={6} />
          <path d="M420 300 H1220 L1200 220 H440 Z" fill={teal} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <rect key={i} x={440 + i * 108} y={222} width={54} height={78} fill="#fff" opacity={0.85} />
          ))}
          <rect x={500} y={380} width={380} height={240} fill={SOFT} stroke={ink} strokeWidth={5} />
          <rect x={960} y={400} width={170} height={320} fill={ink} />
          <rect x={940} y={330} width={110} height={50} rx={8} fill="#fff" stroke={orange} strokeWidth={5} />
          <Txt x={995} y={356} size={34} fill={orange}>
            OPEN
          </Txt>
          <Stamp x={1560} y={330} text="YOUR TURN" o={vis(t, c[0] + 1.6)} size={56} rot={-6} />
        </G>
        <G o={s24}>
          <line x1={300} y1={560} x2={1620} y2={560} stroke={ink} strokeWidth={6} />
          <PriceTag x={520} y={410} s={0.8} text="$4.90" o={vis(t, c[1] + 0.3)} />
          <PriceTag x={960} y={410} s={0.8} text="$4.99" hi={ramp(t, c[1] + 1.1, c[1] + 1.5)} o={vis(t, c[1] + 0.3)} />
          <PriceTag x={1400} y={410} s={0.8} text="$5.00" o={vis(t, c[1] + 0.3)} />
          <G o={vis(t, c[1] + 2.0)}>
            <line x1={520} y1={600} x2={960} y2={600} stroke={GREY} strokeWidth={8} strokeLinecap="round" />
            <Txt x={740} y={650} size={44} fill={GREY}>
              no jump
            </Txt>
          </G>
          <G o={vis(t, c[1] + 3.0)}>
            <line x1={1180} y1={300} x2={1180} y2={640} stroke={GREEN} strokeWidth={6} strokeDasharray="14 10" />
            <Arrow x1={960} y1={600} x2={1400} y2={600} color={GREEN} w={10} />
            <Txt x={1200} y={680} size={44} fill={GREEN}>
              the first digit changes
            </Txt>
          </G>
        </G>
        <G o={s25}>
          <rect x={300} y={540} width={1320} height={26} fill={SAND} stroke={ink} strokeWidth={5} />
          <rect x={360} y={566} width={22} height={170} fill={ink} />
          <rect x={1540} y={566} width={22} height={170} fill={ink} />
          <G x={640} y={540}>
            <rect x={-60} y={-120} width={120} height={120} rx={18} fill={teal} stroke={ink} strokeWidth={5} />
            <rect x={-44} y={-84} width={88} height={40} fill="#fff" />
          </G>
          <Box x={1220} y={540} s={1.4} color={WARM} />
          <G o={vis(t, c[2] + 2.6)}>
            <Plaque x={640} y={320} text="everyday" w={360} />
          </G>
          <G o={vis(t, c[2] + 3.7)}>
            <Plaque x={1220} y={320} text="new" w={300} />
            <Stamp x={1400} y={470} text="NEW" o={vis(t, c[2] + 3.9)} size={44} rot={10} />
            <Tick x={1220} y={640} />
          </G>
        </G>
        <G o={s26}>
          <G o={vis(t, c[3] + 0.5)}>
            <circle cx={520} cy={290} r={70} fill="#fff" stroke={ink} strokeWidth={7} />
            <line x1={520} y1={290} x2={520} y2={245} stroke={ink} strokeWidth={7} strokeLinecap="round" />
            <line x1={520} y1={290} x2={555} y2={310} stroke={ink} strokeWidth={7} strokeLinecap="round" />
            <Txt x={520} y={390} size={36} fill={GREY}>
              luxury
            </Txt>
          </G>
          <G o={vis(t, c[3] + 1.0)}>
            <path d="M760 330 L840 250 Q870 220 910 240 L880 270 L900 290 L930 262 Q950 300 920 330 Q890 350 860 320 L790 390 Z" fill={GREY} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
            <Txt x={850} y={420} size={36} fill={GREY}>
              services
            </Txt>
          </G>
          <G o={vis(t, c[3] + 3.3)}>
            <PriceTag x={640} y={610} s={0.9} text="$99.99" hi={1} />
            <Speech x={860} y={510} text="hmm?" size={44} />
          </G>
          <G o={vis(t, c[3] + 5.2)}>
            <PriceTag x={1380} y={560} s={1.2} text="$100" w={300} />
            <Tick x={1380} y={410} />
          </G>
          <Src x={1380} y={700} text="Schindler (Rutgers)" o={vis(t, c[3] + 3.0)} />
        </G>
        <G o={s27}>
          <G o={vis(t, c[4] + 1.0)}>
            <rect x={380} y={260} width={520} height={200} rx={16} fill={RED} stroke={ink} strokeWidth={6} transform="rotate(-6 640 360)" />
            <Txt x={640} y={360} size={120} fill="#fff">
              SALE!
            </Txt>
          </G>
          <PriceTag x={1280} y={400} s={1.1} text="$9.99" hi={1} o={vis(t, c[4] + 1.4)} />
          <G o={vis(t, c[4] + 5.0)}>
            <Arrow x1={1280} y1={500} x2={1280} y2={640} color={orange} w={12} />
            <Txt x={1280} y={690} size={46} fill={orange}>
              works less well
            </Txt>
          </G>
          <G o={vis(t, c[4] + 3.5)}>
            <Txt x={780} y={600} size={44} fill={GREY}>
              some evidence
            </Txt>
          </G>
        </G>
        <G o={s28}>
          <PriceTag x={1120} y={400} s={1.1} text="$9.99 / month" w={640} fs={78} mark={4} o={vis(t, c[5] + 0.5)} hi={ramp(t, c[5] + 3.0, c[5] + 3.3)} />
          <G o={vis(t, c[5] + 3.2)}>
            <Txt x={960} y={540} size={60} fill={teal}>
              sounds like $9
            </Txt>
          </G>
        </G>
      </SvgFrame>
      <Chip text="IF YOU RUN A SMALL SHOP" x={960} y={50} o={s23} />
      <Chip text="TIP 1: JUST UNDER A ROUND NUMBER" x={960} y={50} o={s24} color={orange} />
      <Chip text="TIP 2: EVERYDAY AND NEW" x={960} y={50} o={s25} color={orange} />
      <Chip text="BUT LUXURY AND QUALITY: BE CAREFUL" x={960} y={50} o={s26} />
      <Chip text="GO EASY ON LOUD SALE SIGNS" x={960} y={50} o={s27} />
      <Chip text="TIP: SUBSCRIPTIONS USE IT TOO" x={960} y={50} o={s28} />
      <SimpleNote o={Math.max(s24, s25, s26, s27, s28)} />
    </>
  );
};

/* ------------------------------------------------------------------ defend */
const SceneDefend: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const d0 = seg(t, c, 0);
  const d1 = seg(t, c, 1);
  const d2 = seg(t, c, 2);
  const d3 = seg(t, c, 3);
  const d4 = seg(t, c, 4);
  return (
    <>
      <SvgFrame>
        <G o={d0}>
          <Person x={640} y={720} s={1.7} body={teal} />
          <G x={940} y={480} s={1.4} o={vis(t, c[0] + 1.6)}>
            <path d="M0 -110 L90 -80 V10 Q90 90 0 130 Q-90 90 -90 10 V-80 Z" fill={PAPER} stroke={ink} strokeWidth={7} strokeLinejoin="round" />
            <Txt x={0} y={4} size={110} fill={teal}>
              $
            </Txt>
          </G>
        </G>
        <G o={d1}>
          <G o={vis(t, c[1] + 2.4)}>
            <PriceTag x={520} y={330} s={0.9} text="$9.99" hi={1} />
            <Arrow x1={760} y1={330} x2={1120} y2={330} color={orange} w={12} />
            <PriceTag x={1380} y={330} s={0.9} text="$10" w={300} />
          </G>
          <G o={vis(t, c[1] + 3.9)}>
            <PriceTag x={520} y={560} s={0.9} text="$19.99" hi={1} />
            <Arrow x1={760} y1={560} x2={1120} y2={560} color={orange} w={12} />
            <PriceTag x={1380} y={560} s={0.9} text="$20" w={300} />
          </G>
        </G>
        <G o={d2}>
          <PriceTag x={640} y={430} s={0.9} text="$9.99 / month" w={640} fs={78} mark={4} hi={1} />
          <G o={vis(t, c[2] + 1.7)}>
            <circle cx={1010} cy={430} r={70} fill={orange} />
            <Txt x={1010} y={432} size={60} fill="#fff">
              x 12
            </Txt>
          </G>
          <G o={vis(t, c[2] + 2.5)}>
            <Arrow x1={1100} y1={430} x2={1260} y2={430} color={orange} w={10} />
            <Txt x={1500} y={430} size={70} fill={orange}>
              about $120
            </Txt>
          </G>
        </G>
        <G o={d3}>
          <G o={vis(t, c[3] + 0.3)}>
            <rect x={600} y={330} width={720} height={300} rx={16} fill={PAPER} stroke={ink} strokeWidth={6} />
            <Txt x={960} y={420} size={100}>
              2.40
            </Txt>
            <line x1={640} y1={490} x2={1280} y2={490} stroke={GREY} strokeWidth={3} />
            <Txt x={960} y={550} size={46} fill={GREY}>
              4.80 per kilo
            </Txt>
          </G>
          <G o={vis(t, c[3] + 1.0)}>
            <circle cx={1380} cy={540} r={70} fill="none" stroke={teal} strokeWidth={12} />
            <line x1={1430} y1={590} x2={1500} y2={660} stroke={teal} strokeWidth={16} strokeLinecap="round" />
          </G>
          <G o={vis(t, c[3] + 2.3)}>
            <Plaque x={960} y={215} text="EUROPEAN UNION" w={600} />
          </G>
          <G o={vis(t, c[3] + 5.9)}>
            <Txt x={960} y={668} size={46} fill={teal}>
              or per liter
            </Txt>
          </G>
          <Src x={960} y={735} text="Directive 98/6/EC; exceptions exist" o={vis(t, c[3] + 4.0)} />
        </G>
        <G o={d4}>
          <Person x={620} y={720} s={1.6} body={teal} />
          <G o={vis(t, c[4] + 0.9)}>
            <circle cx={760} cy={470} r={14} fill="#fff" stroke={ink} strokeWidth={4} />
            <circle cx={810} cy={420} r={22} fill="#fff" stroke={ink} strokeWidth={4} />
            <ellipse cx={1000} cy={320} rx={190} ry={100} fill="#fff" stroke={ink} strokeWidth={5} />
            <Txt x={1000} y={322} size={64}>
              worth: $?
            </Txt>
          </G>
          <G o={vis(t, c[4] + 3.0)}>
            <PriceTag x={1480} y={560} s={0.9} text="$9.99" />
          </G>
        </G>
      </SvgFrame>
      <Chip text="HOW DO YOU DEFEND YOURSELF?" x={960} y={50} o={d0} />
      <Chip text="TRICK 1: ROUND UP" x={960} y={50} o={d1} color={orange} />
      <Chip text="TRICK 2: MULTIPLY BY TWELVE" x={960} y={50} o={d2} color={orange} />
      <Chip text="TRICK 3: THE SMALL PRINT" x={960} y={50} o={d3} color={orange} />
      <Chip text="TRICK 4: KNOW WHAT IT IS WORTH" x={960} y={50} o={d4} color={orange} />
      <SimpleNote o={Math.max(d1, d2, d3)} />
    </>
  );
};

/* ------------------------------------------------------------------ recap */
const SceneRecap: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const r0 = seg(t, c, 0);
  const r1 = seg(t, c, 1);
  return (
    <>
      <SvgFrame>
        <G o={r0}>
          <Stairs t={t} times={[c[0] + 1.6, c[0] + 2.4, c[0] + 3.7, c[0] + 4.1, 0]} lbl={["lower level", "higher level"]} />
        </G>
        <G o={r1}>
          <G o={vis(t, c[1] + 0.3)}>
            <Box x={560} y={520} s={1.6} color={WARM} label="NEW" />
            <Txt x={560} y={600} size={50} fill={teal}>
              little info
            </Txt>
            <Tick x={560} y={300} s={1.4} />
          </G>
          <G o={vis(t, c[1] + 3.5)}>
            <polygon points="1360,260 1500,500 1220,500" fill={GOLD} stroke={ink} strokeWidth={7} strokeLinejoin="round" />
            <Txt x={1360} y={420} size={110}>
              !
            </Txt>
            <Txt x={1360} y={600} size={50} fill={orange}>
              quality matters
            </Txt>
          </G>
        </G>
      </SvgFrame>
      <Chip text="A LOWER LEVEL" x={960} y={50} o={r0} />
      <Chip text="WHEN IT WORKS BEST" x={960} y={50} o={r1} />
      <SimpleNote o={Math.max(r0, r1)} />
    </>
  );
};

/* ------------------------------------------------------------------ close */
const SceneClose: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k0 = seg(t, c, 0);
  const k1 = seg(t, c, 1);
  return (
    <>
      <SvgFrame>
        <G o={k0}>
          <Cart x={960} y={620} s={1.7} />
          <PriceTag x={950} y={480} s={0.6} text="$9.99" o={vis(t, c[0] + 0.4)} />
          <G o={vis(t, c[0] + 1.6)}>
            <line x1={820} y1={525} x2={1086} y2={430} stroke={RED} strokeWidth={10} strokeLinecap="round" />
          </G>
          {[[330, 300, "365", 2.4], [1590, 300, "24", 2.9], [420, 640, "7", 3.4], [1500, 640, "100", 3.9]].map(([nx, ny, tx, tt]) => (
            <G key={tx as string} o={vis(t, c[0] + (tt as number))}>
              <Txt x={nx as number} y={ny as number} size={130} serif fill={GREY}>
                {tx as string}
              </Txt>
            </G>
          ))}
        </G>
        <G o={k1}>
          <G o={vis(t, c[1] + 2.1)}>
            <Txt x={960} y={400} size={440} serif fill={orange}>
              ?
            </Txt>
          </G>
          {[[400, 420, "$9.99", 0.2], [1520, 420, "$4.99", 0.5], [960, 730, "26.2", 0.9]].map(([ix, iy, tx, tt]) => (
            <PriceTag key={tx as string} x={ix as number} y={iy as number} s={tx === "26.2" ? 0.95 : 0.6} text={tx as string} o={vis(t, c[1] + (tt as number))} mark={tx === "26.2" ? 3 : undefined} hi={tx === "26.2" ? 1 : 0} />
          ))}
        </G>
      </SvgFrame>
      <Chip text="ONE DIGIT, ONE NUDGE" x={960} y={50} o={k0} />
      <Chip text="WHY 26.2?" x={960} y={50} o={k1} color={orange} />
    </>
  );
};

export const SCENES007: Record<string, React.FC<SceneProps>> = {
  "price-hook": SceneHook,
  "left-digit": SceneLeft,
  "evidence": SceneEvidence,
  "legend": SceneLegend,
  "shop": SceneShop,
  "defend": SceneDefend,
  "recap": SceneRecap,
  "close": SceneClose,
};
