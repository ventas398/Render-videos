import React from "react";
import { Chip, vis } from "../components/ui";
import { lerp, ramp } from "../utils/anim";
import type { SceneProps } from "./scenes";
import {
  AMBER, Arrow, Boom, Bulb, Car, Calendar, Cop, G, GOLD, GREEN, GREY, Ground, LensLamp, Loco, panelLine, Person, Plaque, Puffs, RED, SAND, seg, SimpleNote, SOFT, Speech, Stamp,
  SvgFrame, teal, TLight, Txt, useT, W, WARM, ink, orange,
} from "./kit";

const BLUE = "#4A7FD6";

/** Carruaje con caballo, generico. */
const Carriage: React.FC<{ x: number; y: number; s?: number; o?: number; flip?: boolean }> = ({ x, y, s = 1, o = 1, flip = false }) => (
  <G x={x} y={y} s={s} o={o}>
    <g transform={flip ? "scale(-1 1)" : undefined}>
    <rect x={-120} y={-150} width={190} height={100} rx={14} fill={WARM} stroke={ink} strokeWidth={5} />
    <rect x={-96} y={-130} width={60} height={50} rx={6} fill={SOFT} stroke={ink} strokeWidth={3} />
    <rect x={-20} y={-130} width={60} height={50} rx={6} fill={SOFT} stroke={ink} strokeWidth={3} />
    {[-80, 30].map((cx) => (
      <g key={cx}>
        <circle cx={cx} cy={-38} r={38} fill="#fff" stroke={ink} strokeWidth={6} />
        <line x1={cx - 38} y1={-38} x2={cx + 38} y2={-38} stroke={ink} strokeWidth={3} />
        <line x1={cx} y1={-76} x2={cx} y2={0} stroke={ink} strokeWidth={3} />
      </g>
    ))}
    <line x1={70} y1={-70} x2={160} y2={-84} stroke={ink} strokeWidth={5} />
    <ellipse cx={230} cy={-100} rx={72} ry={38} fill="#8A5A3C" stroke={ink} strokeWidth={5} />
    <path d="M280 -118 L318 -178 L352 -160 L318 -108 Z" fill="#8A5A3C" stroke={ink} strokeWidth={5} strokeLinejoin="round" />
    <path d="M165 -112 Q130 -90 140 -50" fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" />
    {[190, 215, 255, 280].map((lx) => (
      <line key={lx} x1={lx} y1={-68} x2={lx} y2={0} stroke={ink} strokeWidth={9} strokeLinecap="round" />
    ))}
    </g>
  </G>
);

/** Edificio gotico generico (no reproduce ningun monumento exacto). */
const Gothic: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <rect x={-300} y={-260} width={600} height={260} fill={SAND} stroke={ink} strokeWidth={5} />
    {[-250, 250].map((tx) => (
      <g key={tx}>
        <rect x={tx - 40} y={-400} width={80} height={140} fill={SAND} stroke={ink} strokeWidth={5} />
        <polygon points={`${tx - 50},-400 ${tx},-500 ${tx + 50},-400`} fill={GREY} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
      </g>
    ))}
    {[-180, -90, 0, 90, 180].map((wx) => (
      <path key={wx} d={`M${wx - 22} -150 V-200 Q${wx - 22} -230 ${wx} -250 Q${wx + 22} -230 ${wx + 22} -200 V-150 Z`} fill={SOFT} stroke={ink} strokeWidth={4} />
    ))}
    <rect x={-40} y={-110} width={80} height={110} rx={4} fill={ink} />
  </G>
);

/** Senal de brazos. down 0..1 baja los brazos; night enciende el farol rojo/verde; flame dibuja una llama de gas. */
const ArmSignal: React.FC<{ x: number; y: number; s?: number; o?: number; down?: number; night?: number; flame?: number; rot?: number }> = ({ x, y, s = 1, o = 1, down = 0, night = 0, flame = 0, rot = 0 }) => (
  <G x={x} y={y} s={s} o={o} rot={rot}>
    <rect x={-12} y={-300} width={24} height={300} fill={ink} />
    {[[-1, -150], [1, 0]].map(([d, x0]) => (
      <g key={d} transform={`rotate(${d * 45 * down} 0 -250)`}>
        <rect x={x0} y={-262} width={150} height={24} fill={RED} stroke={ink} strokeWidth={4} />
        <rect x={x0 + 55} y={-262} width={26} height={24} fill="#fff" />
      </g>
    ))}
    <rect x={-40} y={-380} width={80} height={80} rx={8} fill={ink} />
    {night > 0 && (
      <>
        <circle cx={-20} cy={-340} r={66} fill={RED} opacity={0.25 * night} />
        <circle cx={20} cy={-340} r={66} fill={GREEN} opacity={0.25 * night} />
      </>
    )}
    <circle cx={-20} cy={-340} r={16} fill={night > 0.5 ? RED : "#5A4A56"} />
    <circle cx={20} cy={-340} r={16} fill={night > 0.5 ? GREEN : "#3F5A52"} />
    {flame > 0 && <path d="M0 -392 Q26 -430 4 -470 Q-6 -440 -22 -430 Q-30 -410 0 -392 Z" fill={orange} stroke={GOLD} strokeWidth={4} opacity={flame} />}
  </G>
);

const SadFace: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <circle r={80} fill="#FFE69A" stroke={ink} strokeWidth={6} />
    <circle cx={-28} cy={-14} r={9} fill={ink} />
    <circle cx={28} cy={-14} r={9} fill={ink} />
    <path d="M-34 42 Q0 8 34 42" fill="none" stroke={ink} strokeWidth={6} strokeLinecap="round" />
    <path d="M62 -10 Q76 14 62 28 Q50 14 62 -10 Z" fill={BLUE} />
  </G>
);

const Bolt: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <G x={x} y={y} s={s} o={o}>
    <polygon points="0,-40 -22,6 -4,6 -12,40 22,-10 2,-10" fill={GOLD} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
  </G>
);

const Tick: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (
  <G x={x} y={y} o={o} s={0.7 + 0.3 * o}>
    <circle r={50} fill={GREEN} stroke={ink} strokeWidth={5} />
    <polyline points="-24,2 -6,22 26,-18" fill="none" stroke="#fff" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
  </G>
);

const Badge: React.FC<{ x: number; y: number; o?: number }> = ({ x, y, o = 1 }) => (
  <G x={x} y={y} o={o}>
    <circle r={42} fill="#fff" stroke={ink} strokeWidth={5} />
    <rect x={-8} y={-26} width={16} height={52} fill={GREEN} />
    <rect x={-26} y={-8} width={52} height={16} fill={GREEN} />
  </G>
);

/** Suelo de calle con pasos de cebra. */
const Street: React.FC<{ o?: number }> = ({ o = 1 }) => (
  <G o={o}>
    <Ground y={720} />
  </G>
);

/* ------------------------------------------------------------------ light-hook */
export const SceneLightHook: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const s01 = seg(t, c, 0, 1);
  const s1 = seg(t, c, 1);
  const s2 = seg(t, c, 2);
  const s3 = seg(t, c, 3);
  const s4 = seg(t, c, 4);
  const boom = vis(t, c[0] + 1.6, c[2] - 0.4);
  const pulse = 1 + 0.05 * Math.sin(t * 6);
  return (
    <>
      <SvgFrame>
        <G o={s01}>
          <TLight x={700} y={640} s={1.5} lit="r" />
          <Street />
          <Boom x={700} y={270} s={pulse * 0.8} o={boom} />
          <Puffs x={700} y={385} t={t} o={vis(t, c[1] + 0.1, c[2] - 0.4)} />
          <Cop x={1080} y={720} s={1.5} o={s1} />
          <Badge x={1190} y={440} o={s1} />
        </G>
        <G o={s2}>
          <Street />
          <TLight x={1500} y={640} s={1.2} lit="r" />
          <Car x={780} y={712} s={1.1} color={teal} />
          <Car x={1180} y={712} s={1.1} color={orange} />
          {[0, 1].map((i) => (
            <Person key={i} x={1680 + i * 90} y={720} s={0.8} body={i ? GREY : ink} />
          ))}
        </G>
        <G o={s3}>
          <TLight x={640} y={680} s={1.6} lit={t < c[3] + 2.0 ? "r" : "g"} />
          <Street />
          <G x={1180} y={330}>
            <circle cx={-16} r={26} fill={RED} />
            <Txt x={190} y={0} size={58}>
              RED = STOP
            </Txt>
            <G y={110}>
              <circle cx={-16} r={26} fill={GREEN} />
              <Txt x={198} y={0} size={58}>
                GREEN = GO
              </Txt>
            </G>
          </G>
          <Stamp x={1280} y={600} text="WHY RED?" rot={-6} o={vis(t, c[3] + 2.2)} size={64} />
        </G>
        <G o={s4}>
          <Street />
          <Carriage x={620} y={720} s={1.3} />
          <Plaque x={1240} y={300} text="LONDON, 1868" w={560} />
        </G>
      </SvgFrame>
      <Chip text="THE FIRST TRAFFIC LIGHT" x={960} y={50} o={seg(t, c, 0)} color={orange} />
      <Chip text="THE OFFICER WAS INJURED" x={960} y={50} o={seg(t, c, 1)} />
      <Chip text="WE OBEY ITS DESCENDANTS" x={960} y={50} o={seg(t, c, 2)} />
      <Chip text="BUT WHO DECIDED THAT?" x={960} y={50} o={seg(t, c, 3)} />
      <Chip text="BACK TO THE AGE OF HORSES" x={960} y={50} o={seg(t, c, 4)} />
    </>
  );
};

/* ------------------------------------------------------------------ london */
export const SceneLondon: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const st = seg(t, c, 0, 1);
  const park = seg(t, c, 1);
  const s0 = seg(t, c, 0);
  const idea = seg(t, c, 2);
  const day = seg(t, c, 3);
  const night = seg(t, c, 4);
  const lever = seg(t, c, 5);
  const roll = (t - c[0]) * 24;
  const sway = Math.sin((t - c[5]) * 3);
  const hats: [number, string][] = [[200, ink], [310, "#5A4E7C"], [1740, GREY], [1840, ink]];
  return (
    <>
      <SvgFrame>
        <G o={st}>
          <Street />
          <G o={s0}>
            <Carriage x={((roll + 200) % 2300) - 300} y={716} s={1.1} />
            <Carriage x={W + 200 - ((roll * 0.8 + 400) % 2500)} y={716} s={1.1} flip />
          </G>
          {hats.map(([hx, col], i) => (
            <Person key={i} x={hx} y={720} s={0.9} body={col} hat />
          ))}
        </G>
        <G o={park}>
          <Gothic x={1330} y={720} s={1.1} />
          <Person x={760} y={720} s={1.3} body="#5A4E7C" hat />
          <Txt x={760} y={470} size={64} fill={orange}>
            ?
          </Txt>
        </G>
        <G o={idea}>
          <rect x={300} y={190} width={420} height={540} rx={14} fill="#fff" stroke={ink} strokeWidth={6} />
          <rect x={330} y={220} width={360} height={380} fill={SOFT} stroke={panelLine} strokeWidth={3} />
          <Person x={510} y={600} s={2} body="#5A4E7C" hat />
          <Txt x={510} y={648} size={34}>
            John Peake Knight
          </Txt>
          <Txt x={510} y={690} size={28} fill={teal}>
            railway man
          </Txt>
          <G o={vis(t, c[2] + 2.0)}>
            <Loco x={1030} y={420} s={0.8} />
            <Arrow x1={1030} y1={470} x2={1030} y2={560} color={orange} />
            <Carriage x={920} y={700} s={0.7} />
          </G>
        </G>
        <G o={day}>
          <ArmSignal x={600} y={650} s={1.1} o={vis(t, c[3] + 0.3)} />
          <Txt x={600} y={700} size={52} fill={RED}>
            STOP
          </Txt>
          <ArmSignal x={1320} y={650} s={1.1} down={ramp(t, c[3] + 4.9, c[3] + 5.6)} o={vis(t, c[3] + 4.6)} />
          <G o={vis(t, c[3] + 5.2)}>
            <Txt x={1320} y={700} size={52} fill={GREEN}>
              GO
            </Txt>
          </G>
          <Txt x={600} y={175} size={44} weight={700}>
            arms level
          </Txt>
          <G o={vis(t, c[3] + 4.6)}>
            <Txt x={1320} y={175} size={44} weight={700}>
              arms lowered
            </Txt>
          </G>
        </G>
        <G o={night}>
          <rect x={560} y={140} width={800} height={600} rx={20} fill="#1B2A4D" />
          {[[640, 200], [760, 260], [1240, 190], [1300, 300], [1160, 240]].map(([sx, sy], i) => (
            <circle key={i} cx={sx} cy={sy} r={5} fill="#fff" opacity={0.8} />
          ))}
          <rect x={560} y={700} width={800} height={40} fill="#26365C" />
          <ArmSignal x={960} y={700} s={1.1} night={vis(t, c[4] + 0.6)} down={0.5} />
        </G>
        <G o={lever}>
          <Street />
          <Cop x={720} y={720} s={1.5} />
          <G x={920} y={720}>
            <rect x={-40} y={-30} width={80} height={30} fill={ink} />
            <line x1={0} y1={-30} x2={sway * 40} y2={-170} stroke={GREY} strokeWidth={14} strokeLinecap="round" />
            <circle cx={sway * 40} cy={-175} r={18} fill={orange} stroke={ink} strokeWidth={4} />
          </G>
          <line x1={960} y1={712} x2={1360} y2={712} stroke={ink} strokeWidth={5} strokeDasharray="14 10" />
          <ArmSignal x={1400} y={720} s={0.9} night={1} down={0.5 + 0.5 * sway} />
        </G>
      </SvgFrame>
      <Chip text="LONDON, 1860s" x={960} y={50} o={s0} />
      <Chip text="CROSSING WAS RISKY" x={960} y={50} o={park} color={orange} />
      <Chip text="AN IDEA FROM THE RAILWAYS" x={960} y={50} o={idea} />
      <Chip text="BY DAY: TWO ARMS" x={960} y={50} o={day} />
      <Chip text="AT NIGHT: GAS LAMPS" x={960} y={50} o={night} />
      <Chip text="WORKED BY HAND" x={960} y={50} o={lever} />
      <SimpleNote o={Math.max(day, night, lever)} />
    </>
  );
};

/* ------------------------------------------------------------------ boom */
export const SceneBoom: React.FC<{ cues: number[]; dur: number }> = ({ cues: c }) => {
  const t = useT();
  const dec = seg(t, c, 0);
  const jan = seg(t, c, 1);
  const hurt = seg(t, c, 2);
  const flop = seg(t, c, 3);
  const gap = seg(t, c, 4);
  const fall = ramp(t, c[2] + 0.5, c[2] + 2.5);
  const line = ramp(t, c[4] + 0.2, c[4] + 2.2);
  return (
    <>
      <SvgFrame>
        <G o={Math.max(dec, jan)}>
          <Calendar x={520} y={400} month={t < c[1] ? "DECEMBER" : "JANUARY"} year={t < c[1] ? "1868" : "1869"} s={1.2} />
          <Street />
          <ArmSignal x={1340} y={720} s={1.1} night={vis(t, c[0] + 0.3)} flame={vis(t, c[1] + 2.5, c[1] + 4.4)} down={0.5} />
          <Boom x={1340} y={310} s={0.8 + 0.04 * Math.sin(t * 6)} o={vis(t, c[1] + 4.4)} />
        </G>
        <G o={hurt}>
          <Street />
          <Cop x={560} y={720} s={1.5} rot={-4} />
          <Badge x={680} y={440} />
          <ArmSignal x={1250} y={720} s={1.1} rot={-fall * 20} o={1 - fall} down={0.5} />
          <Person x={1050} y={720} s={1.1} body={GREY} />
          <Person x={1500} y={720} s={1.1} body={ink} />
        </G>
        <G o={flop}>
          <SadFace x={960} y={330} s={1.6} />
          <Stamp x={960} y={600} text="PRODUCT LAUNCH" o={vis(t, c[3] + 0.6)} color={RED} size={58} rot={-5} />
        </G>
        <G o={gap}>
          <line x1={420} y1={420} x2={lerp(420, 1500, line)} y2={420} stroke={ink} strokeWidth={8} strokeDasharray="6 22" strokeLinecap="round" />
          <circle cx={420} cy={420} r={22} fill={orange} />
          <Txt x={420} y={500} size={64} serif>
            1869
          </Txt>
          <G o={vis(t, c[4] + 2.0)}>
            <circle cx={1500} cy={420} r={22} fill={teal} />
            <Txt x={1500} y={500} size={64} serif>
              1929
            </Txt>
            <TLight x={1500} y={320} s={0.5} lit="g" pole={50} />
          </G>
        </G>
      </SvgFrame>
      <Chip text="DECEMBER 1868: IT GOES UP" x={960} y={50} o={dec} />
      <Chip text="EARLY JANUARY 1869" x={960} y={50} o={jan} color={orange} />
      <Chip text="THE SIGNAL CAME DOWN" x={960} y={50} o={hurt} />
      <Chip text="NOT THE BEST LAUNCH" x={960} y={50} o={flop} color={orange} />
      <Chip text="BACK IN BRITAIN: 1929" x={960} y={50} o={gap} />
      <SimpleNote o={Math.max(dec, jan, hurt)} />
    </>
  );
};

/* ------------------------------------------------------------------ railway */
export const SceneRailway: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const loco = seg(t, c, 0);
  const room = seg(t, c, 1);
  const three = seg(t, c, 2);
  const why = seg(t, c, 3);
  const brk = seg(t, c, 4);
  const sw = seg(t, c, 5);
  const crack = ramp(t, c[4] + 3.0, c[4] + 3.6);
  const white = t > c[4] + 5.0;
  const swap = ramp(t, c[5] + 2.0, c[5] + 2.6);
  return (
    <>
      <SvgFrame>
        <G o={loco}>
          <Ground y={720} />
          <line x1={0} y1={716} x2={W} y2={716} stroke={ink} strokeWidth={8} />
          <Loco x={lerp(520, 640, ramp(t, c[0], c[1]))} y={705} s={1.5} />
          <circle cx={lerp(520, 640, ramp(t, c[0], c[1])) - 312} cy={564} r={30} fill={RED} opacity={0.9} />
          <Plaque x={1300} y={330} text="RAILWAYS" w={460} />
        </G>
        <G o={room}>
          <Plaque x={960} y={190} text="JANUARY 1841" w={520} />
          <rect x={440} y={470} width={1040} height={50} rx={10} fill={SAND} stroke={ink} strokeWidth={5} />
          <rect x={480} y={520} width={30} height={170} fill={ink} />
          <rect x={1410} y={520} width={30} height={170} fill={ink} />
          {[560, 760, 960, 1160, 1360].map((px, i) => (
            <Person key={px} x={px} y={470} s={1.1} body={i % 2 ? "#5A4E7C" : ink} hat />
          ))}
          {[620, 900, 1250].map((px) => (
            <rect key={px} x={px - 40} y={456} width={80} height={14} fill="#fff" stroke={ink} strokeWidth={3} />
          ))}
        </G>
        <G o={three}>
          {([[560, RED, "red = danger", 0], [960, "#FFFFFF", "white = safe", 1], [1360, GREEN, "green = caution", 2]] as [number, string, string, number][]).map(([lx, col, label, i]) => (
            <G key={label} o={vis(t, c[2] + [2.3, 3.4, 4.3][i])}>
              <LensLamp x={lx} y={380} color={col} s={0.95} />
              <Txt x={lx} y={705} size={44}>
                {label}
              </Txt>
            </G>
          ))}
        </G>
        <G o={why}>
          <LensLamp x={760} y={400} color={RED} />
          <Txt x={760} y={215} size={110} fill={orange}>
            ?
          </Txt>
          <G o={vis(t, c[3] + 3.2)}>
            <polygon points="1360,260 1480,470 1240,470" fill={GOLD} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
            <Txt x={1360} y={410} size={96}>
              !
            </Txt>
            <Txt x={1360} y={540} size={40}>
              red felt like danger
            </Txt>
          </G>
        </G>
        <G o={brk}>
          <LensLamp x={640} y={400} color={white ? "#FFFFFF" : RED} crack={crack} glow={white ? 1.4 : 1} />
          <G o={vis(t, c[4] + 5.9)}>
            <Txt x={1260} y={360} size={86} serif>
              danger = safe?
            </Txt>
          </G>
        </G>
        <G o={sw}>
          <LensLamp x={760} y={400} color="#FFFFFF" o={1 - swap} />
          <LensLamp x={760} y={400} color={GREEN} o={swap} />
          <Tick x={1220} y={400} o={vis(t, c[5] + 2.7)} />
          <G o={vis(t, c[5] + 2.5)}>
            <Txt x={1220} y={500} size={50}>
              green = go
            </Txt>
          </G>
        </G>
      </SvgFrame>
      <Chip text="WHERE DID THE COLOURS COME FROM?" x={960} y={50} o={loco} />
      <Chip text="PARLIAMENT IS INVESTIGATING" x={960} y={50} o={vis(t, c[1] + 0.1, c[1] + 5.2)} color={orange} />
      <Chip text="SO THE MANAGERS AGREE ON SIGNALS" x={960} y={50} o={vis(t, c[1] + 5.6, c[2] - 0.4)} />
      <Chip text="HENRY BOOTH, REPORTEDLY" x={960} y={50} o={three} />
      <Chip text="WHY RED?" x={960} y={50} o={vis(t, c[3] + 0.1, c[3] + 2.6)} />
      <Chip text="NOBODY KNOWS FOR SURE" x={960} y={50} o={vis(t, c[3] + 3.1, c[4] - 0.4)} color={orange} />
      <Chip text="WHITE WAS A BAD IDEA" x={960} y={50} o={vis(t, c[4] + 0.1, c[4] + 2.0)} />
      <Chip text="A BROKEN RED LENS SHOWS WHITE" x={960} y={50} o={vis(t, c[4] + 2.5, c[5] - 0.4)} color={orange} />
      <Chip text="SOME RAILWAYS MOVED TO GREEN" x={960} y={50} o={sw} />
      <SimpleNote o={Math.max(three, why, brk, sw)} />
    </>
  );
};

/* ------------------------------------------------------------------ fog-myth */
export const SceneFogMyth: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const fog = seg(t, c, 0, 1);
  const drops = seg(t, c, 2);
  const hist = seg(t, c, 3);
  const grow = ramp(t, c[2] + 0.3, c[2] + 1.3);
  const out = ramp(t, c[2] + 1.2, c[2] + 1.8);
  const rays = [RED, GREEN, BLUE];
  const angles = [-65, 15, 70, 150, 205];
  return (
    <>
      <SvgFrame>
        <G o={fog}>
          <TLight x={800} y={680} s={1.4} lit="r" />
          <Street />
          {[[600, 420, 200], [820, 380, 250], [1000, 470, 210], [760, 560, 230], [940, 600, 190]].map(([fx, fy, r], i) => (
            <ellipse key={i} cx={fx + 24 * Math.sin(t * 0.8 + i)} cy={fy} rx={r * 1.3} ry={r * 0.55} fill="#fff" opacity={0.4} />
          ))}
          <Speech x={1380} y={290} text="I heard that..." o={vis(t, c[0] + 0.6, c[1] - 0.4)} size={44} />
          <Person x={1500} y={720} s={1.3} body={GREY} />
          <Stamp x={800} y={430} text="MYTH" rot={-10} color={RED} size={120} o={vis(t, c[1] + 1.5)} />
        </G>
        <G o={drops}>
          {rays.map((col, i) => (
            <line key={i} x1={300} y1={380 + i * 40} x2={lerp(300, 840, grow)} y2={380 + i * 40} stroke={col} strokeWidth={12} strokeLinecap="round" />
          ))}
          <circle cx={960} cy={420} r={110} fill={SOFT} stroke={ink} strokeWidth={6} />
          <Txt x={960} y={420} size={34} weight={700}>
            fog droplet
          </Txt>
          <G o={out}>
            {angles.map((a) =>
              rays.map((col, i) => {
                const rad = (a * Math.PI) / 180;
                const dx = Math.cos(rad);
                const dy = Math.sin(rad);
                const off = (i - 1) * 16;
                return (
                  <line
                    key={`${a}${i}`}
                    x1={960 + dx * 125 - dy * off}
                    y1={420 + dy * 125 + dx * off}
                    x2={960 + dx * 280 - dy * off}
                    y2={420 + dy * 280 + dx * off}
                    stroke={col}
                    strokeWidth={8}
                    strokeLinecap="round"
                  />
                );
              }),
            )}
          </G>
        </G>
        <G o={hist}>
          <Ground y={720} />
          <TLight x={540} y={700} s={1.3} lit="r" />
          <Loco x={1360} y={705} s={1.3} />
          <line x1={640} y1={560} x2={1090} y2={560} stroke={orange} strokeWidth={8} strokeDasharray="14 12" />
          <Txt x={890} y={300} size={66} serif fill={orange}>
            history, not nature
          </Txt>
        </G>
      </SvgFrame>
      <Chip text="RED CUTS THROUGH FOG?" x={960} y={50} o={vis(t, c[0] + 0.1, c[1] + 1.0)} />
      <Chip text="IT IS A MYTH" x={960} y={50} o={vis(t, c[1] + 1.4, c[2] - 0.4)} color={RED} />
      <Chip text="FOG SCATTERS ALL COLOURS ABOUT EQUALLY" x={960} y={50} o={drops} />
      <Chip text="RED WON BY HISTORY" x={960} y={50} o={hist} color={orange} />
      <SimpleNote o={drops} />
    </>
  );
};

/* ------------------------------------------------------------------ electric-amber */
export const SceneElectricAmber: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const strip = vis(t, c[0] + 0.1);
  const years = [1868, 1912, 1914, 1920];
  const active = t < c[0] + 3 ? 0 : t < c[2] ? 1 : t < c[4] ? 2 : 3;
  const back = seg(t, c, 0);
  const wire = seg(t, c, 1);
  const clev = seg(t, c, 2);
  const two = seg(t, c, 3);
  const potts = seg(t, c, 4);
  const borrow = seg(t, c, 5);
  const flip = t > c[3] + 2.0;
  const amberMove = ramp(t, c[4] + 1.5, c[4] + 3.0);
  const brake = flip ? Math.exp(-(t - c[3] - 2.0) * 3) : 0;
  const drive = (t - c[2]) * 90;
  return (
    <>
      <SvgFrame>
        <G o={strip}>
          <line x1={440} y1={160} x2={1480} y2={160} stroke={ink} strokeWidth={6} />
          {years.map((y, i) => (
            <g key={y}>
              <circle cx={520 + i * 293} cy={160} r={i === active ? 20 : 13} fill={i <= active ? orange : panelLine} stroke={ink} strokeWidth={4} />
              <Txt x={520 + i * 293} y={208} size={32} serif fill={i === active ? orange : ink}>
                {String(y)}
              </Txt>
            </g>
          ))}
        </G>
        <G o={back}>
          <rect x={540} y={450} width={24} height={270} fill={ink} />
          <rect x={518} y={410} width={68} height={60} rx={6} fill={SAND} stroke={ink} strokeWidth={5} />
          <path d="M552 440 Q580 410 556 372 Q548 396 534 404 Q524 424 552 440 Z" fill={orange} stroke={GOLD} strokeWidth={4} />
          <Txt x={552} y={760} size={34} weight={700}>
            gas
          </Txt>
          <Arrow x1={700} y1={480} x2={1060} y2={480} color={orange} />
          <Bolt x={880} y={400} s={1.6} />
          <Bulb x={1300} y={440} on={vis(t, c[0] + 2.5)} />
          <Txt x={1300} y={640} size={34} weight={700}>
            electric
          </Txt>
        </G>
        <G o={wire}>
          <Street />
          <Cop x={600} y={720} s={1.5} />
          <Txt x={600} y={320} size={58} serif>
            Lester Wire, 1912
          </Txt>
          <Txt x={600} y={376} size={30} fill={teal}>
            Salt Lake City police officer
          </Txt>
          <rect x={1250} y={470} width={22} height={250} fill={ink} />
          <rect x={1195} y={400} width={132} height={86} rx={12} fill={ink} />
          <circle cx={1232} cy={443} r={26} fill={RED} />
          <circle cx={1292} cy={443} r={26} fill={GREEN} opacity={0.4} />
          <circle cx={1232} cy={443} r={60} fill={RED} opacity={0.2} />
          <Arrow x1={900} y1={500} x2={1130} y2={450} color={orange} o={vis(t, c[1] + 2.0)} />
        </G>
        <G o={clev}>
          <rect x={0} y={400} width={W} height={150} fill="#E3D5B3" />
          <rect x={760} y={250} width={150} height={540} fill="#E3D5B3" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <rect key={i} x={i * 280} y={472} width={140} height={8} fill="#fff" />
          ))}
          <Car x={((drive + 200) % 2200) - 300} y={520} s={0.8} color={teal} />
          <TLight x={1080} y={420} s={0.9} lit="r" pole={80} />
          <Plaque x={1380} y={330} text="CLEVELAND" w={400} />
          <Txt x={1380} y={445} size={56} serif fill={orange}>
            1914
          </Txt>
        </G>
        <G o={two}>
          <Street />
          <TLight x={1300} y={700} s={1.5} lit={flip ? "r" : "g"} two />
          <Car x={720} y={712} s={1.1} color={teal} rot={-brake * 6} />
          <Car x={330} y={712} s={1.1} color={orange} rot={-brake * 6} />
          <Speech x={760} y={470} text="!" o={vis(t, c[3] + 2.2, c[4] - 0.4)} size={56} />
          <G o={vis(t, c[3] + 0.4)}>
            <Txt x={1000} y={300} size={58} serif>
              green -&gt; red, no warning
            </Txt>
          </G>
        </G>
        <G o={potts}>
          <Street />
          <Cop x={500} y={720} s={1.5} />
          <Txt x={500} y={320} size={52} serif>
            William Potts, 1920
          </Txt>
          <Txt x={500} y={376} size={30} fill={teal}>
            Detroit police officer
          </Txt>
          {amberMove < 1 && <circle cx={lerp(640, 1300, amberMove)} cy={lerp(500, 540, amberMove)} r={28} fill={AMBER} stroke={ink} strokeWidth={4} />}
          <TLight x={1300} y={700} s={1.5} two={amberMove < 1} lit={amberMove < 1 ? "g" : "a"} />
        </G>
        <G o={borrow}>
          <LensLamp x={520} y={400} color={AMBER} />
          <TLight x={1400} y={500} s={1.1} lit="a" pole={140} />
          <Arrow x1={700} y1={440} x2={1240} y2={440} color={orange} />
          <Txt x={950} y={350} size={44} serif fill={orange}>
            an old railway idea
          </Txt>
        </G>
      </SvgFrame>
      <Chip text="MORE THAN FORTY YEARS LATER" x={960} y={50} o={back} />
      <Chip text="AMONG THE FIRST ELECTRIC LIGHTS" x={960} y={50} o={wire} color={orange} />
      <Chip text="A BUSY CORNER" x={960} y={50} o={clev} />
      <Chip text="ONLY RED AND GREEN" x={960} y={50} o={vis(t, c[3] + 0.1, c[3] + 2.9)} />
      <Chip text="NOTHING IN BETWEEN" x={960} y={50} o={vis(t, c[3] + 3.4, c[4] - 0.4)} color={orange} />
      <Chip text="A THIRD LIGHT: AMBER" x={960} y={50} o={potts} color={orange} />
      <Chip text="CAUTION SIGNALS ALREADY EXISTED" x={960} y={50} o={borrow} />
      <SimpleNote o={Math.max(two, potts)} />
    </>
  );
};

/* ------------------------------------------------------------------ close */
export const SceneClose: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const sum = seg(t, c, 0);
  const blow = seg(t, c, 1);
  const wild = seg(t, c, 2);
  const go = seg(t, c, 3);
  const ok = seg(t, c, 4);
  const globe = seg(t, c, 5);
  const fadeBoom = ramp(t, c[1] + 1.4, c[1] + 2.6);
  const move = ramp(t, c[3] + 0.8, c[3] + 3.8);
  const okS = 1 + 0.06 * Math.sin((t - c[4]) * 5);
  const bubbles: [number, number][] = [[560, 340], [1340, 320], [430, 600], [1480, 610], [1230, 190]];
  return (
    <>
      <SvgFrame>
        <G o={sum}>
          <Loco x={420} y={560} s={0.8} o={vis(t, c[0] + 1.2)} />
          <circle cx={310} cy={472} r={26} fill={RED} opacity={vis(t, c[0] + 1.2)} />
          <Cop x={1500} y={600} s={1.4} o={vis(t, c[0] + 3.2)} />
          <circle cx={1400} cy={420} r={28} fill={AMBER} stroke={ink} strokeWidth={4} opacity={vis(t, c[0] + 3.2)} />
          <TLight x={960} y={640} s={1.5} lit={t < c[0] + 3.2 ? "r" : "a"} />
          <Txt x={420} y={700} size={42} fill={RED}>
            railways
          </Txt>
          <G o={vis(t, c[0] + 3.2)}>
            <Txt x={1500} y={700} size={42} fill={orange}>
              Detroit police officer
            </Txt>
          </G>
        </G>
        <G o={blow}>
          <Gothic x={480} y={720} s={0.9} />
          <Ground y={720} />
          <Boom x={1080} y={400} s={1.2} o={1 - fadeBoom} />
          <TLight x={1080} y={660} s={1.5} lit="r" o={fadeBoom} />
        </G>
        <G o={wild}>
          <TLight x={520} y={680} s={1.4} lit="g" />
          <Street />
          <rect x={900} y={190} width={780} height={450} rx={16} fill="#fff" stroke={ink} strokeWidth={6} />
          <Txt x={1290} y={250} size={50} serif spacing={4}>
            BACKSTORY
          </Txt>
          <Loco x={1020} y={520} s={0.45} />
          <ArmSignal x={1290} y={600} s={0.5} down={0.5} />
          <TLight x={1530} y={560} s={0.55} lit="r" pole={60} />
        </G>
        <G o={go}>
          <Street />
          <TLight x={1500} y={700} s={1.5} lit="g" />
          <Car x={lerp(520, 1000, move)} y={712} s={1.2} color={teal} />
          <Speech x={lerp(540, 1020, move)} y={420} text="OK, let's go" o={vis(t, c[3] + 1.4, c[4] - 0.4)} size={44} />
        </G>
        <G o={ok}>
          <Txt x={870} y={430} size={330} serif fill={ink}>
            OK
          </Txt>
          <G x={1360} y={430} s={okS}>
            <Txt x={0} y={0} size={300} serif fill={orange}>
              ?
            </Txt>
          </G>
        </G>
        <G o={globe}>
          <circle cx={960} cy={470} r={230} fill={SOFT} stroke={ink} strokeWidth={7} />
          <ellipse cx={960} cy={470} rx={110} ry={230} fill="none" stroke={teal} strokeWidth={4} />
          <ellipse cx={960} cy={470} rx={230} ry={90} fill="none" stroke={teal} strokeWidth={4} />
          <line x1={960} y1={240} x2={960} y2={700} stroke={teal} strokeWidth={4} />
          {bubbles.map(([bx, by], i) => (
            <Speech key={i} x={bx} y={by} text="OK" size={36} o={vis(t, c[5] + 0.3 + i * 0.35)} />
          ))}
        </G>
      </SvgFrame>
      <Chip text="THE WHOLE STORY" x={960} y={50} o={sum} />
      <Chip text="IT BEGAN WITH A LAMP THAT BLEW UP" x={960} y={50} o={blow} color={orange} />
      <Chip text="A WILD BACKSTORY" x={960} y={50} o={wild} />
      <Chip text="GREEN MEANS GO" x={960} y={50} o={go} />
      <Chip text="WHAT DOES OK STAND FOR?" x={960} y={50} o={ok} color={orange} />
      <Chip text="NEXT: WHY?" x={960} y={50} o={globe} color={orange} />
    </>
  );
};

export const SCENES005: Record<string, React.FC<SceneProps>> = {
  "light-hook": SceneLightHook,
  "london": SceneLondon,
  "boom": SceneBoom,
  "railway": SceneRailway,
  "fog-myth": SceneFogMyth,
  "electric-amber": SceneElectricAmber,
  "close": SceneClose,
};
