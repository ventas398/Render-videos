import React from "react";
import { vis } from "../components/ui";
import { lerp, ramp } from "../utils/anim";
import type { SceneProps } from "./scenes";
import { Chips, Note } from "./scenes011";
import { Arrow, Calendar, G, GREEN, GREY, ink, orange, Person, RED, SAND, seg, SimpleNote, SOFT, Stamp, SvgFrame, teal, Txt, useT, WARM } from "./kit";
import { Pen } from "./scenes013";

const PAPER = "#FFFDF4";

/** Tapa generica vertical con agujerito (hole 0..1). */
const Cap: React.FC<{ x: number; y: number; s?: number; o?: number; hole?: number; rot?: number }> = ({ x, y, s = 1, o = 1, hole = 1, rot = 0 }) => (
  <G x={x} y={y} s={s} o={o} rot={rot}>
    <rect x={-60} y={-100} width={120} height={200} rx={24} fill={teal} stroke={ink} strokeWidth={6} />
    <rect x={-42} y={-118} width={84} height={22} rx={9} fill={ink} />
    <circle cx={0} cy={-52} r={9} fill={ink} opacity={hole} />
    {hole > 0 && <circle cx={0} cy={-52} r={28} fill="none" stroke={orange} strokeWidth={6} opacity={hole} />}
  </G>
);

const Tick: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <circle r={44} fill="#fff" stroke={GREEN} strokeWidth={8} />
    <path d="M-20 2 L-6 18 L22 -16" fill="none" stroke={GREEN} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
  </G>
);

/** Vias respiratorias muy esquematicas: un tubo que se bifurca. cap = 0..1 si hay una tapa dentro. */
const Airway: React.FC<{ x: number; y: number; s?: number; o?: number; cap?: number; hole?: number }> = ({ x, y, s = 1, o = 1, cap = 0, hole = 0 }) => (
  <G x={x} y={y} s={s} o={o}>
    <path d="M0 -230 V40 M0 40 L-110 170 M0 40 L110 170" fill="none" stroke={ink} strokeWidth={96} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M0 -230 V40 M0 40 L-110 170 M0 40 L110 170" fill="none" stroke={SOFT} strokeWidth={74} strokeLinecap="round" strokeLinejoin="round" />
    <G o={cap}>
      <Cap x={0} y={-40} s={0.42} hole={hole} />
    </G>
  </G>
);

const Sheet: React.FC<{ x: number; y: number; o?: number; blur?: boolean }> = ({ x, y, o = 1, blur = false }) => (
  <G x={x} y={y} o={o}>
    <rect x={-210} y={-250} width={420} height={500} rx={10} fill={PAPER} stroke={ink} strokeWidth={6} />
    <Txt x={0} y={-150} size={100} serif>
      11540
    </Txt>
    {[-40, 10, 60, 110, 160, 210].map((ly) => (
      <line key={ly} x1={-160} y1={ly} x2={blur ? 160 : ly > 150 ? 20 : 160} y2={ly} stroke={blur ? "#C9CFD8" : GREY} strokeWidth={blur ? 14 : 6} strokeLinecap="round" />
    ))}
  </G>
);

const Journal: React.FC<{ x: number; y: number; o?: number }> = ({ x, y, o = 1 }) => (
  <G x={x} y={y} o={o}>
    <rect x={-250} y={-170} width={500} height={340} rx={12} fill={PAPER} stroke={ink} strokeWidth={6} />
    <rect x={-250} y={-170} width={500} height={78} rx={12} fill={ink} />
    <Txt x={0} y={-130} size={36} fill="#fff" spacing={3}>
      MEDICAL JOURNAL
    </Txt>
    <Txt x={0} y={-30} size={64} serif>
      Case series
    </Txt>
    {[40, 80, 120].map((ly) => (
      <line key={ly} x1={-190} y1={ly} x2={190} y2={ly} stroke={GREY} strokeWidth={6} />
    ))}
  </G>
);

/** Puerta de salida esquematica con barra horizontal (sin personas ni logos). */
export const ExitDoor: React.FC<{ x: number; y: number; s?: number; o?: number; bar?: number }> = ({ x, y, s = 1, o = 1, bar = 0 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-120} y={-230} width={240} height={460} rx={8} fill="#E4E7EC" stroke={ink} strokeWidth={8} />
    <rect x={-96} y={-206} width={192} height={412} fill="none" stroke={GREY} strokeWidth={5} />
    <rect x={-110} y={-20} width={220} height={28} rx={12} fill={bar ? orange : GREY} stroke={ink} strokeWidth={5} />
    <rect x={-70} y={-290} width={140} height={44} rx={8} fill={GREEN} />
    <Txt x={0} y={-268} size={30} fill="#fff" spacing={3}>
      EXIT
    </Txt>
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
          <Pen x={900} y={440} s={1.5} rot={-8} hole={vis(t, c[0] + 2.4)} />
          <Note x={1220} y={570} text="the cap" o={vis(t, c[0] + 2.0)} size={48} fill={ink} />
        </G>
        <G o={k(1)}>
          <path d="M700 520 L730 760 H1190 L1220 520 Z" fill={SAND} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
          {[-24, -12, 0, 12, 24].map((r, i) => (
            <G key={r} x={960 + r * 10} y={470} rot={r} s={0.5}>
              <Pen x={0} y={0} s={1} rot={-90} hole={i === 2 ? 0.6 + 0.4 * Math.sin(t * 6) : 0} />
            </G>
          ))}
          <Note x={960} y={200} text="seen a thousand times" o={vis(t, c[1] + 0.8)} size={52} fill={ink} />
        </G>
        <G o={k(2)}>
          <Cap x={480} y={450} s={1.8} />
          <G o={vis(t, c[2] + 1.8)} y={-70}>
            <Arrow x1={620} y1={420} x2={960} y2={360} color={GREY} />
            <path d="M1030 330 Q1070 260 1110 330 A44 44 0 1 1 1030 330 Z" fill={ink} />
            <Txt x={1070} y={345} size={30} fill="#fff">
              ink
            </Txt>
            <line x1={990} y1={260} x2={1150} y2={420} stroke={RED} strokeWidth={14} strokeLinecap="round" />
            <line x1={1150} y1={260} x2={990} y2={420} stroke={RED} strokeWidth={14} strokeLinecap="round" />
          </G>
          <G o={vis(t, c[2] + 4.2)}>
            <Arrow x1={620} y1={520} x2={960} y2={580} color={teal} />
            <Person x={1160} y={640} s={1.3} body={SOFT} />
            <Tick x={1320} y={540} s={0.9} />
            <Note x={1420} y={650} text="safety" o={1} size={42} fill={teal} />
          </G>
        </G>
        <G o={k(3)}>
          <Cap x={760} y={440} s={2.4} />
          <Stamp x={1340} y={450} text="A SERIOUS JOB" o={vis(t, c[3] + 1.8)} size={52} color={teal} rot={-3} />
        </G>
        <G o={k(4)}>
          <Txt x={640} y={300} size={380} serif fill={ink}>
            WHY
          </Txt>
          <Txt x={1160} y={290} size={380} serif fill={orange}>
            ?
          </Txt>
          <Cap x={960} y={590} s={1.1} hole={vis(t, c[4] + 0.8)} />
          <Note x={1280} y={600} text="a tiny hole" o={vis(t, c[4] + 1.6)} size={46} fill={ink} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(1), k(2), k(3))} />
      <Chips t={t} c={c} list={[["LOOK AT THE CAP"], ["A SMALL DETAIL"], ["NOT FOR THE INK"], ["A SERIOUS JOB", true], ["WHY?", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ danger (5-9) */
const SceneDanger: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Person x={640} y={560} s={2} body={SOFT} />
          <Cap x={1130} y={460} s={1.5} hole={0} />
          <Arrow x1={1000} y1={440} x2={820} y2={400} color={GREY} o={vis(t, c[0] + 2.6)} />
          <Note x={1130} y={640} text="small enough to fit" o={vis(t, c[0] + 1.6)} size={44} fill={ink} />
        </G>
        <G o={k(1)}>
          <Airway x={760} y={480} s={1.2} cap={vis(t, c[1] + 1.2)} />
          <Note x={1280} y={300} text="the airway" o={vis(t, c[1] + 0.6)} size={52} fill={ink} />
          <Note x={1280} y={380} text="very simplified" o={vis(t, c[1] + 0.8)} size={36} fill={GREY} />
          <Stamp x={1300} y={560} text="BLOCKED" o={vis(t, c[1] + 3.0)} size={56} color={RED} />
        </G>
        <G o={k(2)}>
          <Journal x={720} y={430} />
          <Note x={720} y={650} text="SAGE Open Medical Case Reports, 2024" o={vis(t, c[2] + 0.8)} size={34} fill={teal} />
          {[["4", 1260], ["13", 1460], ["14", 1660]].map(([n, px], i) => (
            <G key={n} o={vis(t, c[2] + 2.4 + i * 0.5)}>
              <Person x={px as number} y={520} s={1.1} body={SOFT} />
              <Txt x={px as number} y={650} size={56} fill={orange}>
                {n as string}
              </Txt>
            </G>
          ))}
          <Note x={1460} y={300} text="three children, aged" o={vis(t, c[2] + 2.0)} size={42} fill={ink} />
          <Note x={720} y={700} text="Illustration, not the original page" o={vis(t, c[2] + 1.2)} size={28} fill={GREY} />
        </G>
        <G o={k(3)}>
          <path d="M600 160 L840 520 V700 M1320 160 L1080 520 V700" fill="none" stroke={ink} strokeWidth={10} strokeLinecap="round" />
          <G x={960} y={lerp(260, 470, ramp(t, c[3] + 0.8, c[3] + 3.4))}>
            <polygon points="-120,-60 120,-60 40,80 -40,80" fill={teal} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
          </G>
          <Note x={1360} y={400} text="a cone shape" o={vis(t, c[3] + 1.0)} size={50} fill={ink} />
          <Note x={1360} y={470} text="can lodge" o={vis(t, c[3] + 3.2)} size={44} fill={orange} />
        </G>
        <G o={k(4)}>
          <Journal x={960} y={400} />
          <Stamp x={960} y={470} text="NO MENTION OF A HOLE" o={vis(t, c[4] + 1.8)} size={44} color={orange} rot={-5} />
          <Note x={960} y={640} text="cited only to show the danger is real" o={vis(t, c[4] + 3.4)} size={40} fill={ink} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(1), k(2), k(3))} />
      <Chips t={t} c={c} list={[["SMALL ENOUGH TO FIT"], ["THE DANGER"], ["A 2024 CASE SERIES"], ["THE CONE SHAPE"], ["NOT ABOUT THE HOLE", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ hole (10-14) */
const SceneHole: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Pen x={760} y={430} s={1.2} hole={vis(t, c[0] + 1.6)} />
          <Calendar x={1500} y={380} month="YEAR" year="1991" s={0.9} />
          <Note x={1500} y={600} text="Wikipedia" o={vis(t, c[0] + 3.0)} size={40} fill={teal} />
          <Note x={760} y={640} text="the classic Bic Cristal" o={vis(t, c[0] + 4.4)} size={38} fill={GREY} />
        </G>
        <G o={k(1)}>
          <rect x={300} y={160} width={1320} height={200} rx={26} fill="#fff" stroke={ink} strokeWidth={6} />
          <Txt x={960} y={230} size={42} fill={ink} weight={700}>
            to keep a cap from completely
          </Txt>
          <Txt x={960} y={298} size={42} fill={ink} weight={700}>
            blocking the airway if it is inhaled
          </Txt>
          <Note x={960} y={440} text="Paraphrase of the company, as reported by ScienceAlert" o={vis(t, c[1] + 2.0)} size={34} fill={teal} />
          <Airway x={960} y={630} s={0.48} cap={1} hole={1} />
        </G>
        <G o={k(2)}>
          <rect x={560} y={330} width={800} height={160} rx={60} fill={SOFT} stroke={ink} strokeWidth={8} />
          <Cap x={960} y={410} s={1} rot={90} hole={1} />
          <Arrow x1={560} y1={410} x2={880} y2={410} color={teal} o={vis(t, c[2] + 3.0)} />
          <Arrow x1={1010} y1={410} x2={1300} y2={410} color={teal} o={vis(t, c[2] + 3.6)} />
          <Note x={960} y={560} text="a little air may still get through" o={vis(t, c[2] + 4.2)} size={42} fill={teal} />
          <Stamp x={960} y={670} text="OUR READING: AN INFERENCE" o={vis(t, c[2] + 1.0)} size={38} color={teal} rot={-2} />
        </G>
        <G o={k(3)}>
          <Cap x={600} y={380} s={2} />
          <Stamp x={1200} y={330} text="REDUCES THE RISK" o={vis(t, c[3] + 2.0)} size={52} color={teal} rot={-3} />
          <Stamp x={1200} y={470} text="NOT A GUARANTEE" o={vis(t, c[3] + 3.0)} size={52} color={orange} rot={2} />
        </G>
        <G o={k(4)}>
          {[0, 1, 2, 3, 4].map((i) => (
            <G key={i}>
              <Pen x={700} y={230 + i * 100} s={0.7} hole={i === 0 ? 1 : 0} />
              <Txt x={1100} y={230 + i * 100} size={i === 0 ? 64 : 56} fill={i === 0 ? orange : GREY}>
                {i === 0 ? "1991" : "?"}
              </Txt>
            </G>
          ))}
          <Note x={1380} y={230} text="one pen" o={vis(t, c[4] + 1.4)} size={44} fill={orange} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(2), k(3), k(4))} />
      <Chips t={t} c={c} list={[["THE HOLE, SINCE 1991"], ["THE COMPANY'S REASON"], ["OUR READING", true], ["NOT A GUARANTEE"], ["ONE PEN"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ standard (15-18) */
const SceneStandard: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Sheet x={700} y={440} />
          <Note x={1300} y={380} text="an international standard" o={vis(t, c[0] + 0.8)} size={48} fill={ink} />
          <Note x={1300} y={460} text="pen caps and asphyxiation" o={vis(t, c[0] + 2.0)} size={42} fill={teal} />
        </G>
        <G o={k(1)}>
          <Sheet x={540} y={440} />
          <Note x={1250} y={300} text="Specification for caps" o={vis(t, c[1] + 2.4)} size={46} fill={ink} />
          <Note x={1250} y={360} text="to reduce the risk of asphyxiation" o={vis(t, c[1] + 2.4)} size={46} fill={ink} />
          <Calendar x={1250} y={590} month="AUGUST" year="2021" s={0.8} o={vis(t, c[1] + 0.8)} />
        </G>
        <G o={k(2)}>
          <Pen x={620} y={300} s={0.7} hole={1} />
          <G x={1100} y={300}>
            <rect x={-170} y={-24} width={340} height={48} rx={10} fill="#fff" stroke={ink} strokeWidth={6} />
            <polygon points="170,-18 230,-8 230,8 170,18" fill={orange} stroke={ink} strokeWidth={4} />
            <rect x={-170} y={-24} width={90} height={48} rx={10} fill={teal} stroke={ink} strokeWidth={6} />
          </G>
          <Person x={1560} y={300} s={1.2} body={SOFT} />
          <Note x={1560} y={430} text="around 14 or younger" o={vis(t, c[2] + 1.6)} size={40} fill={ink} />
          <G o={vis(t, c[2] + 4.0)}>
            <Pen x={600} y={620} s={0.7} hole={0} />
            <line x1={330} y1={560} x2={680} y2={680} stroke={RED} strokeWidth={14} strokeLinecap="round" />
            <line x1={680} y1={560} x2={330} y2={680} stroke={RED} strokeWidth={14} strokeLinecap="round" />
            <Note x={1250} y={620} text="adults only: not covered" o={1} size={42} fill={RED} />
          </G>
        </G>
        <G o={k(3)}>
          <Sheet x={960} y={420} blur />
          <Stamp x={960} y={720} text="WE READ ONLY THE TITLE AND SCOPE" o={vis(t, c[3] + 2.4)} size={34} pad={70} color={orange} rot={-2} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(2))} />
      <Chips t={t} c={c} list={[["THE STANDARD"], ["THE LATEST EDITION"], ["WHO IT IS FOR"], ["WHAT WE COULD NOT OPEN", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ barrel (19-22) */
const BarrelHole: React.FC<{ o: number }> = ({ o }) => (
  <G o={o}>
    <circle cx={-110} cy={0} r={7} fill={ink} />
    <circle cx={-110} cy={0} r={26} fill="none" stroke={orange} strokeWidth={6} />
  </G>
);

const SceneBarrel: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <G x={960} y={420} s={1.7}>
            <Pen x={0} y={0} capOff={lerp(0, 170, ramp(t, c[0] + 0.4, c[0] + 1.6))} hole={0.6} />
            <BarrelHole o={vis(t, c[0] + 1.8)} />
          </G>
          <Note x={960} y={640} text="another hole, another job" o={vis(t, c[0] + 2.2)} size={46} fill={ink} />
        </G>
        <G o={k(1)}>
          <rect x={480} y={360} width={960} height={150} rx={60} fill="#fff" stroke={ink} strokeWidth={8} />
          <line x1={900} y1={360} x2={1020} y2={360} stroke="#fff" strokeWidth={14} />
          <Arrow x1={925} y1={250} x2={925} y2={420} color={teal} o={vis(t, c[1] + 1.8)} />
          <Arrow x1={995} y1={440} x2={995} y2={270} color={teal} o={vis(t, c[1] + 1.8)} />
          <Note x={960} y={200} text="air outside" o={vis(t, c[1] + 1.8)} size={42} fill={teal} />
          <Txt x={700} y={438} size={52} fill={ink}>
            inside
          </Txt>
                    <Note x={960} y={600} text="same air pressure inside and out" o={vis(t, c[1] + 3.6)} size={46} fill={orange} />
          <Note x={960} y={670} text="Wikipedia, citing the company's FAQ" o={vis(t, c[1] + 5.0)} size={34} fill={teal} />
        </G>
        <G o={k(2)}>
          <G x={960} y={400} s={1.6}>
            <Pen x={0} y={0} hole={1} />
            <BarrelHole o={1} />
          </G>
          <Arrow x1={440} y1={580} x2={520} y2={440} color={orange} o={vis(t, c[2] + 0.8)} />
          <Txt x={440} y={640} size={60} fill={orange}>
            PRESSURE
          </Txt>
          <Arrow x1={1500} y1={580} x2={1410} y2={450} color={teal} o={vis(t, c[2] + 2.6)} />
          <Txt x={1500} y={640} size={60} fill={teal}>
            BREATHING
          </Txt>
        </G>
        <G o={k(3)}>
          <G x={900} y={420} s={1.6}>
            <Pen x={0} y={0} capOff={lerp(170, 0, ramp(t, c[3] + 0.6, c[3] + 2.6))} hole={1} />
          </G>
          <Note x={900} y={620} text="ScienceAlert: also helps with air pressure" o={vis(t, c[3] + 2.4)} size={38} fill={teal} />
          <Stamp x={1400} y={250} text="ADDED BY ONE ARTICLE" o={vis(t, c[3] + 3.4)} size={40} color={orange} rot={-4} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(2), k(3))} />
      <Chips t={t} c={c} list={[["ANOTHER HOLE"], ["THE BARREL HOLE"], ["TWO HOLES, TWO JOBS", true], ["ONE ARTICLE ADDS"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ link (23-24) */
export const Window: React.FC<{ x: number; y: number; s?: number; o?: number; glow?: number }> = ({ x, y, s = 1, o = 1, glow = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-120} y={-170} width={240} height={340} rx={80} fill="#DDEEF6" stroke={ink} strokeWidth={8} />
    <circle cx={0} cy={60} r={7} fill={ink} />
    {glow > 0 && <circle cx={0} cy={60} r={26} fill="none" stroke={orange} strokeWidth={6} opacity={glow} />}
  </G>
);

const SceneLink: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Cap x={960} y={400} s={2.6} />
          <Note x={960} y={690} text="A tiny hole, a quiet job" o={vis(t, c[0] + 1.0)} size={50} fill={ink} />
        </G>
        <G o={k(1)}>
          <Cap x={960} y={420} s={2.6} />
          <Note x={960} y={700} text="easy to ignore, worth noticing" o={vis(t, c[1] + 1.2)} size={50} fill={orange} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1))} />
      <Chips t={t} c={c} list={[["EASY TO MISS"], ["WORTH NOTICING", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ practical (25-26) */
const ScenePractical: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Pen x={760} y={300} s={0.9} hole={vis(t, c[0] + 1.2)} />
          <Pen x={760} y={520} s={0.9} hole={0} />
          <Note x={1380} y={300} text="has a hole" o={vis(t, c[0] + 1.6)} size={50} fill={orange} />
          <Note x={1380} y={520} text="no hole" o={vis(t, c[0] + 3.4)} size={50} fill={GREY} />
          <Note x={960} y={690} text="check the cap" o={vis(t, c[0] + 0.6)} size={48} fill={ink} />
        </G>
        <G o={k(1)}>
          <line x1={1000} y1={300} x2={1700} y2={300} stroke={ink} strokeWidth={10} strokeLinecap="round" />
          <Pen x={1360} y={252} s={0.5} hole={1} />
          <Person x={700} y={600} s={1.3} body={SOFT} />
          <Arrow x1={820} y1={480} x2={1200} y2={330} color={GREY} o={vis(t, c[1] + 1.2)} />
          <Note x={1360} y={420} text="out of reach" o={vis(t, c[1] + 1.8)} size={52} fill={teal} />
          <Note x={1360} y={500} text="helpful, but not a promise" o={vis(t, c[1] + 4.2)} size={42} fill={ink} />
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1))} />
      <Chips t={t} c={c} list={[["CHECK THE CAP"], ["KEEP CAPS OUT OF REACH", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ close (27-29) */
const SceneClose: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Cap x={760} y={440} s={2.6} />
          <Tick x={1180} y={340} s={1.6} o={vis(t, c[0] + 3.0)} />
          <Note x={1280} y={560} text="a safety feature," o={vis(t, c[0] + 1.6)} size={48} fill={ink} />
          <Note x={1280} y={625} text="quietly doing its job" o={vis(t, c[0] + 2.2)} size={48} fill={teal} />
        </G>
        <G o={k(1)}>
          <rect x={480} y={150} width={960} height={44} rx={8} fill={WARM} stroke={ink} strokeWidth={6} />
          <Txt x={960} y={173} size={26} fill={ink} spacing={4}>
            SCREEN
          </Txt>
          {[0, 1, 2].map((r) =>
            Array.from({ length: 9 }, (_, i) => <rect key={r * 9 + i} x={480 + i * 108} y={260 + r * 90} width={72} height={56} rx={14} fill={SOFT} stroke={ink} strokeWidth={5} />),
          )}
          <ExitDoor x={1620} y={470} s={0.9} o={vis(t, c[1] + 2.6)} />
          <Note x={1620} y={715} text="heavy door at the back" o={vis(t, c[1] + 3.2)} size={34} fill={teal} />
        </G>
        <G o={k(2)}>
          <ExitDoor x={760} y={480} s={1.1} bar={vis(t, c[2] + 0.8)} />
          <Arrow x1={920} y1={480} x2={1380} y2={480} color={orange} w={16} o={vis(t, c[2] + 1.8)} />
          <Note x={1150} y={430} text="outward" o={vis(t, c[2] + 2.0)} size={44} fill={orange} />
          <Txt x={1560} y={440} size={380} serif fill={orange}>
            ?
          </Txt>
        </G>
      </SvgFrame>
      <SimpleNote o={Math.max(k(0), k(1), k(2))} />
      <Chips t={t} c={c} list={[["A QUIET SAFETY FEATURE"], ["A DOOR AT THE BACK"], ["NEXT: THE EXIT DOOR", true]]} />
    </>
  );
};

export const SCENES014: Record<string, React.FC<SceneProps>> = {
  "hook": SceneHook,
  "danger": SceneDanger,
  "hole": SceneHole,
  "standard": SceneStandard,
  "barrel": SceneBarrel,
  "link": SceneLink,
  "practical": ScenePractical,
  "close": SceneClose,
};
