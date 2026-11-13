import React from "react";
import { vis } from "../components/ui";
import { lerp, ramp } from "../utils/anim";
import type { SceneProps } from "./scenes";
import { Chips, Note } from "./scenes011";
import { Arrow, Calendar, G, GOLD, GREEN, GREY, ink, orange, Person, Puffs, RED, SAND, seg, SimpleNote, SOFT, Speech, Stamp, SvgFrame, teal, Txt, useT, WARM } from "./kit";

const PAPER = "#FFFDF4";
const NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const RLAB = NAMES.map((n) => (n === "JUL" ? "QUIN" : n === "AUG" ? "SEXT" : n));
const ROMAN = [29, 28, 31, 29, 31, 29, 31, 29, 29, 31, 29, 29];
const NOW = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const hOf = (d: number) => (d - 20) * 26;
const BX = (i: number) => 366 + i * 108;

/** Barras de 12 meses (altura exagerada, ilustracion). add = dias anadidos por mes, ex = 0..1 cuanto se ven. */
const Bars: React.FC<{ days: number[]; base?: number; add?: number[]; ex?: number; labels?: string[]; nums?: boolean; o?: number }> = ({ days, base = 580, add, ex = 0, labels = NAMES, nums = true, o = 1 }) => (
  <G o={o}>
    {days.map((d, i) => {
      const h = hOf(d);
      const a = (add ? add[i] : 0) * 26 * ex;
      const fill = i === 1 ? "#F8D3B0" : d === 31 ? "#CFE6E6" : "#E4E7EC";
      return (
        <g key={i}>
          <rect x={BX(i) - 39} y={base - h} width={78} height={h} fill={fill} stroke={i === 1 ? orange : ink} strokeWidth={i === 1 ? 6 : 4} />
          {a > 0 && <rect x={BX(i) - 39} y={base - h - a} width={78} height={a} fill="#BFE3CC" stroke={GREEN} strokeWidth={4} />}
          {nums && (
            <Txt x={BX(i)} y={base - h - a - 26} size={34} fill={i === 1 ? orange : ink}>
              {String(d + (add && ex > 0.5 ? add[i] : 0))}
            </Txt>
          )}
          <Txt x={BX(i)} y={base + 30} size={26} fill={i === 1 ? orange : ink}>
            {labels[i]}
          </Txt>
        </g>
      );
    })}
    <line x1={300} y1={base} x2={1620} y2={base} stroke={ink} strokeWidth={5} />
  </G>
);

/** Emperador / consul generico: silueta con laurel y rotulo de texto (sin retrato). */
const Laurel: React.FC<{ x: number; y: number; s?: number; label: string; o?: number; ly?: number }> = ({ x, y, s = 1, label, o = 1, ly = 60 }) => (
  <G o={o}>
    <Person x={x} y={y} s={s} body={SOFT} />
    <G x={x} y={y - 102 * s} s={s}>
      <path d="M-32 14 Q-46 -22 -18 -38" fill="none" stroke={GREEN} strokeWidth={8} strokeLinecap="round" />
      <path d="M32 14 Q46 -22 18 -38" fill="none" stroke={GREEN} strokeWidth={8} strokeLinecap="round" />
    </G>
    <Note x={x} y={y + ly} text={label} o={1} size={38} fill={ink} />
  </G>
);

const Feb: React.FC<{ x: number; y: number; n?: number; sq?: number; gap?: number; o?: number; cutFrom?: number }> = ({ x, y, n = 28, sq = 50, gap = 6, o = 1, cutFrom = 99 }) => (
  <G o={o}>
    {Array.from({ length: n }, (_, i) => (
      <rect key={i} x={x + i * (sq + gap)} y={y} width={sq} height={sq} fill={i >= cutFrom ? "none" : "#F8D3B0"} stroke={i >= cutFrom ? GREY : orange} strokeWidth={4} strokeDasharray={i >= cutFrom ? "8 6" : undefined} />
    ))}
  </G>
);

const Book: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-170} y={-130} width={340} height={260} rx={10} fill="#C9A66B" stroke={ink} strokeWidth={6} />
    <rect x={-150} y={-110} width={300} height={220} fill={PAPER} stroke={ink} strokeWidth={4} />
    <line x1={0} y1={-110} x2={0} y2={110} stroke={ink} strokeWidth={5} />
    {[-70, -40, -10, 20, 50, 80].map((ly) => (
      <g key={ly}>
        <line x1={-125} y1={ly} x2={-20} y2={ly} stroke={GREY} strokeWidth={5} />
        <line x1={20} y1={ly} x2={125} y2={ly} stroke={GREY} strokeWidth={5} />
      </g>
    ))}
  </G>
);

const Card2: React.FC<{ x: number; y: number; name: string; o?: number }> = ({ x, y, name, o = 1 }) => (
  <G x={x} y={y} o={o}>
    <rect x={-190} y={-130} width={380} height={260} rx={12} fill={PAPER} stroke={ink} strokeWidth={6} />
    <Txt x={0} y={-80} size={54} serif>
      {name}
    </Txt>
    {[-20, 20, 60, 100].map((ly) => (
      <line key={ly} x1={-150} y1={ly} x2={150} y2={ly} stroke={GREY} strokeWidth={5} />
    ))}
  </G>
);

/** Boligrafo generico de pie (tapa arriba) o tumbado. cap: 0..1 posicion de la tapa. */
export const Pen: React.FC<{ x: number; y: number; s?: number; o?: number; rot?: number; hole?: number; capOff?: number }> = ({ x, y, s = 1, o = 1, rot = 0, hole = 0, capOff = 0 }) => (
  <G x={x} y={y} s={s} o={o} rot={rot}>
    <rect x={-300} y={-26} width={420} height={52} rx={22} fill="#fff" stroke={ink} strokeWidth={6} />
    <path d="M-300 -10 L-350 0 L-300 10 Z" fill={ink} />
    <g transform={`translate(${capOff} 0)`}>
      <rect x={120} y={-30} width={170} height={60} rx={14} fill={teal} stroke={ink} strokeWidth={6} />
      <rect x={140} y={-44} width={140} height={14} rx={6} fill={ink} />
      <circle cx={210} cy={0} r={9} fill={ink} opacity={hole} />
      {hole > 0 && <circle cx={210} cy={0} r={26} fill="none" stroke={orange} strokeWidth={6} opacity={hole} />}
    </g>
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
          <Bars days={NOW} base={600} />
          <Note x={960} y={170} text="a calendar year" o={vis(t, c[0] + 0.6)} size={48} fill={ink} />
          <Stamp x={BX(1)} y={235} text="28" o={vis(t, c[0] + 4.6)} size={64} rot={-4} />
        </G>
        <G o={k(1)}>
          <Laurel x={560} y={640} s={2.2} label="Emperor Augustus" ly={64} />
          <Feb x={880} y={330} sq={30} gap={4} n={29} cutFrom={28} />
          <G o={vis(t, c[1] + 3.0)}>
            <rect x={880 + 28 * 34} y={lerp(330, 220, ramp(t, c[1] + 3.0, c[1] + 4.2))} width={30} height={30} fill="#F8D3B0" stroke={orange} strokeWidth={4} />
          </G>
          <Note x={1350} y={410} text="February" o={1} size={44} fill={orange} />
        </G>
        <G o={k(2)}>
          {[["JULY", 31, 620], ["AUGUST", 30, 1100]].map(([nm, d, bx]) => (
            <g key={nm as string}>
              <rect x={(bx as number) - 90} y={600 - hOf(d as number)} width={180} height={hOf(d as number)} fill="#CFE6E6" stroke={ink} strokeWidth={5} />
              <Txt x={bx as number} y={640} size={40}>
                {nm as string}
              </Txt>
              <Txt x={bx as number} y={600 - hOf(d as number) - 34} size={44}>
                {String(d)}
              </Txt>
            </g>
          ))}
          <G o={vis(t, c[2] + 2.8)}>
            <Arrow x1={1260} y1={340} x2={1260} y2={240} color={orange} />
            <Note x={1340} y={290} text="+1" o={1} size={56} fill={orange} />
          </G>
          <Note x={960} y={140} text="the story: as long as Caesar's month" o={vis(t, c[2] + 1.2)} size={44} fill={ink} />
        </G>
        <G o={k(3)}>
          <G x={960} y={470}>
            <circle r={110} fill="#fff" fillOpacity={0.5} stroke={ink} strokeWidth={14} />
            <line x1={78} y1={78} x2={190} y2={190} stroke={ink} strokeWidth={22} strokeLinecap="round" />
          </G>
          <Note x={960} y={470} text="?" o={vis(t, c[3] + 1.4)} size={150} fill={orange} />
        </G>
        <G o={k(4)}>
          <Txt x={640} y={300} size={380} serif fill={ink}>
            WHY
          </Txt>
          <Txt x={1160} y={290} size={380} serif fill={orange}>
            ?
          </Txt>
          <Feb x={260} y={560} sq={44} gap={6} o={vis(t, c[4] + 0.8)} />
          <Note x={960} y={680} text="only 28 days" o={vis(t, c[4] + 1.6)} size={46} fill={ink} />
        </G>
        <Stamp x={330} y={215} text="THE POPULAR STORY" o={vis(t, c[1] + 0.3, c[4] - 0.1)} size={40} color={teal} rot={-3} />
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(2), k(4))} />
      <Chips t={t} c={c} list={[["TWELVE MONTHS"], ["THE POPULAR STORY", true], ["JULY AND AUGUST"], ["DOES IT HOLD UP?"], ["WHY?", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ old calendar (5-8) */
const SceneOld: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <line x1={240} y1={420} x2={1680} y2={420} stroke={ink} strokeWidth={8} strokeLinecap="round" />
          <G o={vis(t, c[0] + 1.2)}>
            <line x1={1180} y1={340} x2={1180} y2={500} stroke={orange} strokeWidth={10} />
            <Note x={1180} y={290} text="Julius Caesar's reform" o={1} size={40} fill={orange} />
          </G>
          <G o={vis(t, c[0] + 3.2)}>
            <rect x={250} y={330} width={740} height={180} rx={14} fill={WARM} stroke={ink} strokeWidth={6} />
            <Txt x={620} y={420} size={50}>
              OLD ROMAN CALENDAR
            </Txt>
            <Arrow x1={1100} y1={560} x2={400} y2={560} color={teal} />
            <Note x={760} y={610} text="we go back" o={1} size={40} fill={teal} />
          </G>
        </G>
        <G o={k(1)}>
          <G x={760} y={430}>
            <rect x={-300} y={-190} width={600} height={380} rx={8} fill={PAPER} stroke={ink} strokeWidth={7} />
            <rect x={-326} y={-200} width={44} height={400} rx={22} fill={SAND} stroke={ink} strokeWidth={6} />
            <rect x={282} y={-200} width={44} height={400} rx={22} fill={SAND} stroke={ink} strokeWidth={6} />
            <Txt x={0} y={-60} size={190} serif>
              355
            </Txt>
            <Txt x={0} y={90} size={60} fill={GREY}>
              days
            </Txt>
          </G>
          <Note x={1400} y={330} text="Censorinus (ancient writer)" o={vis(t, c[1] + 0.8)} size={40} fill={ink} />
          <Note x={1400} y={400} text="as summarized by Wikipedia" o={vis(t, c[1] + 2.4)} size={38} fill={teal} />
          <Note x={760} y={690} text="Illustration, not the original page" o={vis(t, c[1] + 0.6)} size={30} />
        </G>
        <G o={k(2, 3)}>
          <Bars days={ROMAN} base={600} labels={RLAB} o={vis(t, c[2] + 0.3)} />
          <Note x={560} y={150} text="4 months x 31" o={vis(t, c[2] + 1.0)} size={42} fill={teal} />
          <Note x={960} y={150} text="7 months x 29" o={vis(t, c[2] + 3.6)} size={42} fill={GREY} />
          <Note x={1360} y={150} text="1 month x 28" o={vis(t, c[2] + 7.0)} size={42} fill={orange} />
          <Stamp x={560} y={725} text="ALREADY SHORT" o={vis(t, c[3] + 1.8)} size={40} rot={-4} />
          <Note x={1160} y={760 - 40} text="before Caesar, and before Augustus" o={vis(t, c[3] + 0.8)} size={40} fill={ink} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(2, 3))} />
      <Chips t={t} c={c} list={[["BEFORE CAESAR"], ["CENSORINUS"], ["THE OLD MONTHS"], ["ALREADY SHORT", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ odd numbers (9-12) */
const SceneOdd: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          {[1, 3, 5, 7].map((n, i) => (
            <G key={n} x={460 + i * 190} y={400} o={vis(t, c[0] + 1.6 + i * 0.4)}>
              <circle r={70} fill="#CFE6E6" stroke={teal} strokeWidth={7} />
              <Txt x={0} y={4} size={80} serif>
                {String(n)}
              </Txt>
            </G>
          ))}
          <G x={1400} y={400} o={vis(t, c[0] + 4.4)}>
            {[[0, -30], [30, 0], [0, 30], [-30, 0]].map(([dx, dy], i) => (
              <circle key={i} cx={dx} cy={dy} r={26} fill="#BFE3CC" stroke={GREEN} strokeWidth={5} />
            ))}
            <line x1={0} y1={40} x2={14} y2={110} stroke={GREEN} strokeWidth={8} strokeLinecap="round" />
          </G>
          <Note x={960} y={600} text="odd numbers = lucky" o={vis(t, c[0] + 3.0)} size={54} fill={ink} />
          <Note x={960} y={680} text="Wikipedia: following Pythagorean beliefs" o={vis(t, c[0] + 5.2)} size={38} fill={teal} />
        </G>
        <G o={k(1)}>
          {Array.from({ length: 12 }, (_, i) => (
            <G key={i} x={300 + i * 120} y={330} o={vis(t, c[1] + 1.6 + i * 0.18)}>
              <circle r={44} fill="#CFE6E6" stroke={teal} strokeWidth={6} />
              <Txt x={0} y={3} size={26}>
                ODD
              </Txt>
            </G>
          ))}
          <G o={vis(t, c[1] + 5.0)}>
            <Txt x={960} y={440} size={64}>
              =
            </Txt>
            <Txt x={960} y={530} size={96} fill={orange}>
              EVEN
            </Txt>
          </G>
          <Stamp x={960} y={650} text="OUR OWN ARITHMETIC" o={vis(t, c[1] + 1.0)} size={44} color={teal} rot={-2} />
          <Note x={960} y={725} text="not a documented reason" o={vis(t, c[1] + 1.4)} size={40} fill={teal} />
        </G>
        <G o={k(2)}>
          <Txt x={760} y={300} size={230} serif>
            355
          </Txt>
          <Stamp x={1340} y={300} text="ODD" o={vis(t, c[2] + 1.0)} size={80} color={teal} />
          {ROMAN.map((d, i) => (
            <G key={i} x={300 + i * 120} y={560} o={vis(t, c[2] + 2.4)}>
              <circle r={44} fill={i === 1 ? "#F8D3B0" : "#CFE6E6"} stroke={i === 1 ? orange : teal} strokeWidth={i === 1 ? 8 : 6} />
              <Txt x={0} y={3} size={34} fill={i === 1 ? orange : ink}>
                {String(d)}
              </Txt>
            </G>
          ))}
          <Note x={960} y={690} text="at least one month had to be even" o={vis(t, c[2] + 4.6)} size={46} fill={orange} />
        </G>
        <G o={k(3)}>
          <rect x={660} y={220} width={600} height={360} rx={16} fill="#fff" stroke={orange} strokeWidth={8} />
          <Txt x={960} y={290} size={64} fill={orange}>
            FEBRUARY
          </Txt>
          <Txt x={960} y={450} size={220} serif fill={ink}>
            ?
          </Txt>
          <Stamp x={960} y={650} text="SOURCES DO NOT SAY" o={vis(t, c[3] + 3.0)} size={56} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(2), k(3))} />
      <Chips t={t} c={c} list={[["LUCKY NUMBERS"], ["OUR OWN ARITHMETIC", true], ["355 IS ODD"], ["WHY FEBRUARY?"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ extra month (13-17) */
const SceneExtra: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const yr = (d: number) => (d - 300) * 14;
  return (
    <>
      <SvgFrame>
        <G o={k(0)} y={70}>
          <G x={300} y={250}>
            <circle r={70} fill={GOLD} stroke={ink} strokeWidth={6} />
            {Array.from({ length: 12 }, (_, i) => (
              <line key={i} x1={Math.cos((i * Math.PI) / 6) * 88} y1={Math.sin((i * Math.PI) / 6) * 88} x2={Math.cos((i * Math.PI) / 6) * 112} y2={Math.sin((i * Math.PI) / 6) * 112} stroke={GOLD} strokeWidth={9} strokeLinecap="round" />
            ))}
          </G>
          <rect x={460} y={200} width={yr(365)} height={80} fill={GOLD} fillOpacity={0.35} stroke={ink} strokeWidth={5} />
          <Txt x={460 + yr(365) - 70} y={240} size={56}>
            365
          </Txt>
          <rect x={460} y={400} width={yr(355) * ramp(t, c[0] + 1.8, c[0] + 3.2)} height={80} fill="#CFE6E6" stroke={ink} strokeWidth={5} />
          <G o={vis(t, c[0] + 3.2)}>
            <Txt x={460 + yr(355) - 70} y={440} size={56}>
              355
            </Txt>
          </G>
          <G o={vis(t, c[0] + 4.6)}>
            <rect x={460 + yr(355)} y={400} width={yr(365) - yr(355)} height={80} fill="none" stroke={orange} strokeWidth={6} strokeDasharray="10 8" />
            <Note x={460 + yr(365) - 30} y={540} text="about 10 days" o={1} size={52} fill={orange} />
          </G>
          <Note x={620} y={370} text="calendar" o={vis(t, c[0] + 1.6)} size={36} fill={ink} />
          <Note x={640} y={170} text="the sun's year" o={vis(t, c[0] + 0.6)} size={36} fill={ink} />
        </G>
        <G o={k(1)}>
          <Feb x={178} y={400} sq={44} gap={4} n={23} o={1} />
          <G o={vis(t, c[1] + 3.0)}>
            <rect x={178 + 23 * 48} y={387} width={210} height={70} fill={orange} fillOpacity={0.85} stroke={ink} strokeWidth={5} />
            <Txt x={178 + 23 * 48 + 105} y={422} size={26} fill="#fff">
              EXTRA MONTH
            </Txt>
          </G>
          <Feb x={178 + 23 * 48 + 230} y={400} sq={44} gap={4} n={5} o={1} />
          <Note x={960} y={280} text="February: after the 23rd day" o={vis(t, c[1] + 1.6)} size={50} fill={ink} />
          <Note x={960} y={560} text="Censorinus, as summarized by Wikipedia" o={vis(t, c[1] + 4.6)} size={36} fill={teal} />
        </G>
        <G o={k(2)}>
          <Feb x={101} y={400} sq={50} gap={6} cutFrom={t > c[2] + 2.0 ? 23 : 99} />
          <G o={vis(t, c[2] + 2.0)}>
            <path d="M101 540 H1500" stroke={GREY} strokeWidth={4} fill="none" strokeDasharray="8 8" />
            <G x={101 + 23 * 56 - 3} y={480}>
              <circle cx={-22} cy={-30} r={14} fill="none" stroke={ink} strokeWidth={6} />
              <circle cx={22} cy={-30} r={14} fill="none" stroke={ink} strokeWidth={6} />
              <line x1={-14} y1={-20} x2={26} y2={30} stroke={ink} strokeWidth={6} strokeLinecap="round" />
              <line x1={14} y1={-20} x2={-26} y2={30} stroke={ink} strokeWidth={6} strokeLinecap="round" />
            </G>
          </G>
          <Note x={960} y={280} text="23 or 24 days left" o={vis(t, c[2] + 1.0)} size={56} fill={ink} />
          <Stamp x={1400} y={640} text="REPORTEDLY" o={vis(t, c[2] + 4.0)} size={52} color={teal} />
        </G>
        <G o={k(3)}>
          {Array.from({ length: 12 }, (_, i) => (
            <G key={i} x={300 + i * 120} y={420}>
              <rect x={-48} y={-48} width={96} height={96} fill={i === 11 ? "#F8D3B0" : "#E4E7EC"} stroke={i === 11 ? orange : ink} strokeWidth={i === 11 ? 8 : 4} />
              <Txt x={0} y={3} size={i === 11 ? 30 : 36} fill={i === 11 ? orange : ink}>
                {i === 11 ? "FEB" : String(i + 1)}
              </Txt>
            </G>
          ))}
          <Note x={760} y={300} text="the Roman year" o={vis(t, c[3] + 0.6)} size={46} fill={ink} />
          <G o={vis(t, c[3] + 2.6)}>
            <Arrow x1={1500} y1={560} x2={1500} y2={490} color={orange} />
            <Note x={1500} y={610} text="the last month" o={1} size={40} fill={orange} />
          </G>
          <Note x={960} y={690} text="until about 450 BC (Wikipedia)" o={vis(t, c[3] + 5.0)} size={42} fill={teal} />
          <Stamp x={1560} y={340} text="TRADITION, DATES DEBATED" o={vis(t, c[3] + 5.0)} size={32} color={teal} rot={-3} />
        </G>
        <G o={k(4)}>
          <Calendar x={620} y={430} month="FEBRUARY" year="28" s={1.5} />
          <rect x={900} y={560} width={110} height={80} fill={SAND} stroke={ink} strokeWidth={5} transform="rotate(8 955 600)" />
          <Stamp x={1320} y={340} text="OUR READING: AN INFERENCE" o={vis(t, c[4] + 0.8)} size={36} />
          <Stamp x={1340} y={520} text="NO SOURCE" o={vis(t, c[4] + 5.6)} size={60} color={teal} rot={4} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(2), k(3), k(4))} />
      <Chips t={t} c={c} list={[["355 VS 365"], ["THE EXTRA MONTH"], ["REPORTEDLY"], ["THE ROMAN YEAR"], ["OUR READING", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ Caesar (18-21) */
const SceneCaesar: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const add = [2, 0, 0, 1, 0, 1, 0, 2, 1, 0, 1, 2];
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Laurel x={520} y={650} s={2.3} label="Julius Caesar" ly={64} />
          <Calendar x={1260} y={420} month="1 JANUARY" year="45 BC" s={1.6} o={vis(t, c[0] + 2.4)} />
          <Note x={1260} y={720} text="the new Julian calendar" o={vis(t, c[0] + 4.0)} size={42} fill={teal} />
        </G>
        <G o={k(1)}>
          <Bars days={ROMAN} base={560} add={add} labels={RLAB} ex={ramp(t, c[1] + 1.6, c[1] + 4.0)} />
          <G o={vis(t, c[1] + 1.6)}>
            <Note x={BX(0)} y={150} text="+2" o={1} size={52} fill={GREEN} />
            <Note x={BX(7)} y={150} text="+2" o={1} size={52} fill={GREEN} />
            <Note x={BX(11)} y={150} text="+2" o={1} size={52} fill={GREEN} />
          </G>
          <G o={vis(t, c[1] + 5.0)}>
            <Note x={BX(3)} y={210} text="+1" o={1} size={44} fill={GREEN} />
            <Note x={BX(5)} y={210} text="+1" o={1} size={44} fill={GREEN} />
            <Note x={BX(8)} y={210} text="+1" o={1} size={44} fill={GREEN} />
            <Note x={BX(10)} y={210} text="+1" o={1} size={44} fill={GREEN} />
          </G>
          <Txt x={960} y={690} size={64} fill={ink}>
            355 + 6 + 4 = 365
          </Txt>
          <Note x={1500} y={690} text="simple sum" o={vis(t, c[1] + 7.0)} size={34} />
        </G>
        <G o={k(2)}>
          <Bars days={NOW} base={560} nums={false} />
          <G o={vis(t, c[2] + 0.8)}>
            <Txt x={BX(1)} y={320} size={70} fill={orange}>
              28
            </Txt>
          </G>
          <G o={vis(t, c[2] + 2.8)} x={BX(1)} y={590 - hOf(28) - 160}>
            <rect x={-30} y={-30} width={60} height={60} fill="none" stroke={orange} strokeWidth={5} strokeDasharray="8 6" />
            <Txt x={0} y={2} size={30} fill={orange}>
              +1
            </Txt>
          </G>
          <Note x={BX(1) + 300} y={190} text="a leap day every 4th year" o={vis(t, c[2] + 2.8)} size={44} fill={orange} />
          <G o={vis(t, c[2] + 5.0)}>
            <rect x={1160} y={150} width={220} height={70} fill={orange} fillOpacity={0.85} stroke={ink} strokeWidth={5} />
            <Txt x={1270} y={185} size={26} fill="#fff">
              EXTRA MONTH
            </Txt>
            <line x1={1150} y1={140} x2={1390} y2={230} stroke={RED} strokeWidth={10} strokeLinecap="round" />
            <line x1={1390} y1={140} x2={1150} y2={230} stroke={RED} strokeWidth={10} strokeLinecap="round" />
          </G>
        </G>
        <G o={k(3)}>
          <rect x={540} y={520 - hOf(29)} width={180} height={hOf(29)} fill="#E4E7EC" stroke={ink} strokeWidth={5} />
          <G o={vis(t, c[3] + 2.8)}>
            <rect x={540} y={520 - hOf(31)} width={180} height={hOf(31) - hOf(29)} fill="#BFE3CC" stroke={GREEN} strokeWidth={5} />
          </G>
          <Txt x={630} y={575} size={46}>
            {t < c[3] + 6.5 ? "SEXTILIS" : "AUGUST"}
          </Txt>
          <Txt x={630} y={520 - hOf(31) - 36} size={54}>
            {t > c[3] + 2.8 ? "31" : "29"}
          </Txt>
          <Note x={1180} y={300} text="+2 in the reform" o={vis(t, c[3] + 2.4)} size={52} fill={GREEN} />
          <Note x={1180} y={420} text="already 31 days" o={vis(t, c[3] + 4.6)} size={56} fill={ink} />
          <Note x={1180} y={520} text="later renamed August" o={vis(t, c[3] + 6.4)} size={44} fill={teal} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(2), k(3))} />
      <Chips t={t} c={c} list={[["THE JULIAN CALENDAR"], ["SIX AND FOUR DAYS"], ["FEBRUARY STAYS", true], ["SEXTILIS"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ Augustus (22-26) */
const SceneAugustus: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const sw = ramp(t, c[0] + 3.0, c[0] + 4.0);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <G o={1 - sw} x={0} y={0}>
            <rect x={300} y={300} width={560} height={150} rx={12} fill={SOFT} stroke={ink} strokeWidth={6} />
            <Txt x={580} y={375} size={72} serif spacing={4}>
              SEXTILIS
            </Txt>
          </G>
          <G o={sw}>
            <rect x={300} y={300} width={560} height={150} rx={12} fill={WARM} stroke={orange} strokeWidth={7} />
            <Txt x={580} y={375} size={72} serif spacing={4}>
              AUGUSTUS
            </Txt>
          </G>
          <Arrow x1={900} y1={375} x2={1060} y2={375} color={teal} o={vis(t, c[0] + 1.8)} />
          <Laurel x={1300} y={600} s={2} label="the emperor" ly={64} o={vis(t, c[0] + 1.8)} />
          <Txt x={580} y={560} size={110} serif fill={orange}>
            8 BC
          </Txt>
        </G>
        <G o={k(1)}>
          {[["AUGUST", 31, 620, "#BFE3CC"], ["FEBRUARY", 28, 1160, "#F8D3B0"]].map(([nm, d, bx, fl]) => (
            <g key={nm as string}>
              <rect x={(bx as number) - 90} y={600 - hOf(d as number)} width={180} height={hOf(d as number)} fill={fl as string} stroke={ink} strokeWidth={5} />
              <Txt x={bx as number} y={640} size={36}>
                {nm as string}
              </Txt>
              <Txt x={bx as number} y={600 - hOf(d as number) - 36} size={52}>
                {String(d)}
              </Txt>
            </g>
          ))}
          <Stamp x={930} y={210} text="NOTHING TAKEN" o={vis(t, c[1] + 4.0)} size={48} color={teal} rot={-4} />
        </G>
        <G o={k(2)}>
          <Book x={620} y={430} s={1.5} />
          <Note x={1260} y={330} text="Sacrobosco, 13th century" o={vis(t, c[2] + 1.0)} size={48} fill={ink} />
          <Stamp x={1260} y={470} text="MYTH" o={vis(t, c[2] + 2.8)} size={80} />
          <Note x={1260} y={620} text="Wikipedia, article August" o={vis(t, c[2] + 4.4)} size={38} fill={teal} />
        </G>
        <G o={k(3)}>
          <Card2 x={520} y={400} name="Lamont" o={vis(t, c[3] + 1.0)} />
          <Card2 x={1000} y={400} name="Nothaft" o={vis(t, c[3] + 1.8)} />
          <Stamp x={760} y={620} text="SECOND-HAND" o={vis(t, c[3] + 4.0)} size={60} color={teal} rot={-3} />
          <Note x={760} y={720} text="we did not open them" o={vis(t, c[3] + 5.0)} size={44} fill={teal} />
          <Note x={1500} y={400} text="cited by Wikipedia" o={vis(t, c[3] + 1.0)} size={40} fill={teal} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1))} />
      <Chips t={t} c={c} list={[["SEXTILIS BECOMES AUGUSTUS"], ["NOTHING TAKEN", true], ["THE MYTH"], ["SECOND-HAND", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ practical (27-28) */
const ScenePractical: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Person x={480} y={660} s={2.2} body="#A9C3E8" />
          <Speech x={820} y={250} text="Augustus stole a day!" o={vis(t, c[0] + 0.6)} size={44} />
          <Person x={1300} y={660} s={2.2} body="#B5D99C" o={vis(t, c[0] + 3.4)} />
          <Note x={1300} y={300} text="13th century" o={vis(t, c[0] + 4.2)} size={54} fill={ink} />
          <G o={vis(t, c[0] + 5.4)}>
            <Stamp x={1620} y={330} text="MYTH" o={1} size={64} />
          </G>
        </G>
        <G o={k(1)}>
          <line x1={240} y1={420} x2={1680} y2={420} stroke={ink} strokeWidth={8} strokeLinecap="round" />
          {[[420, "older Roman calendar"], [1000, "Caesar"], [1400, "Augustus"]].map(([mx, nm], i) => (
            <G key={nm as string} o={vis(t, c[1] + 0.8 + i * 1.4)}>
              <circle cx={mx as number} cy={420} r={20} fill={i === 0 ? orange : "#fff"} stroke={ink} strokeWidth={6} />
              <Note x={mx as number} y={500} text={nm as string} o={1} size={40} fill={ink} />
            </G>
          ))}
          <Feb x={290} y={300} sq={20} gap={4} n={12} o={vis(t, c[1] + 1.4)} />
          <Stamp x={960} y={630} text="OLDER THAN AUGUSTUS" o={vis(t, c[1] + 4.6)} size={52} color={teal} rot={-3} />
        </G>
      </SvgFrame>
      <SimpleNote o={k(1)} />
      <Chips t={t} c={c} list={[["THE MYTH, RETOLD"], ["OLDER THAN AUGUSTUS", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ close (29-31) */
const SceneClose: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Laurel x={560} y={660} s={2.2} label="a vain emperor" ly={64} o={1 - vis(t, c[0] + 4.4) * 0.6} />
          <Puffs x={560} y={380} t={t} o={vis(t, c[0] + 4.0)} />
          <Calendar x={1260} y={430} month="FEBRUARY" year="28" s={1.5} />
          <Note x={1260} y={720} text="messier, and much older" o={vis(t, c[0] + 2.6)} size={46} fill={ink} />
        </G>
        <G o={k(1)}>
          <Pen x={960} y={400} s={1.7} />
          <Note x={960} y={640} text="a pen, and its cap" o={vis(t, c[1] + 1.6)} size={50} fill={ink} />
        </G>
        <G o={k(2)}>
          <G x={760} y={450}>
            <rect x={-130} y={-190} width={260} height={380} rx={50} fill={teal} stroke={ink} strokeWidth={8} />
            <rect x={-96} y={-230} width={192} height={44} rx={16} fill={ink} />
            <circle cx={0} cy={60} r={20} fill={PAPER} stroke={ink} strokeWidth={6} />
            <circle cx={0} cy={60} r={52} fill="none" stroke={orange} strokeWidth={8} opacity={0.5 + 0.5 * Math.sin(t * 4)} />
          </G>
          <Txt x={1260} y={420} size={420} serif fill={orange}>
            ?
          </Txt>
          <Note x={1260} y={680} text="Why does it have a tiny hole?" o={vis(t, c[2] + 0.6)} size={46} fill={ink} />
        </G>
      </SvgFrame>
      <SimpleNote o={k(0)} />
      <Chips t={t} c={c} list={[["MESSIER, AND OLDER"], ["LOOK AT THE CAP"], ["NEXT: THE TINY HOLE", true]]} />
    </>
  );
};

export const SCENES013: Record<string, React.FC<SceneProps>> = {
  "hook": SceneHook,
  "oldcalendar": SceneOld,
  "odd": SceneOdd,
  "extra": SceneExtra,
  "caesar": SceneCaesar,
  "augustus": SceneAugustus,
  "practical": ScenePractical,
  "close": SceneClose,
};
