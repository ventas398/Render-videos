import React from "react";
import { vis } from "../components/ui";
import { lerp, ramp } from "../utils/anim";
import type { SceneProps } from "./scenes";
import { Chips, Note } from "./scenes011";
import { Arrow, G, GREEN, GREY, ink, orange, Plaque, SAND, seg, SimpleNote, SOFT, Stamp, SvgFrame, teal, Txt, useT, WARM } from "./kit";

/* ------------------------------------------------------------------ piezas genericas (papel, escritorio) */
const SKIN = "#F1D5B0";
const BACK = "#EDE6D6";
const OLD = "#EFE0B8";
const R2 = Math.SQRT2;

const Foot: React.FC<{ t: number; c: number[]; k: number; text: string }> = ({ t, c, k, text }) => (
  <Note x={960} y={735} text={text} o={vis(t, c[k] + 0.6, c[k + 1] === undefined ? 1e6 : c[k + 1] - 0.4)} size={36} fill={teal} />
);

/** Folio con lineas de texto (relleno blanco, borde tinta). */
const Page: React.FC<{ x: number; y: number; w: number; h: number; fill?: string; lines?: boolean; stroke?: string; sw?: number; dash?: string }> = ({ x, y, w, h, fill = "#fff", lines = true, stroke = ink, sw = 5, dash }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} />
    {lines &&
      [0.2, 0.32, 0.44, 0.56, 0.68, 0.8].map((f) => <line key={f} x1={x + w * 0.14} y1={y + h * f} x2={x + w * (f === 0.8 ? 0.55 : 0.86)} y2={y + h * f} stroke={GREY} strokeWidth={Math.max(2, w / 70)} strokeLinecap="round" opacity={0.55} />)}
  </g>
);

const Hand: React.FC<{ x: number; y: number; o?: number }> = ({ x, y, o = 1 }) => (o > 0 ? <circle cx={x} cy={y} r={24} fill={SKIN} stroke={ink} strokeWidth={4} opacity={o} /> : null);

const Desk: React.FC = () => <rect x={200} y={140} width={1520} height={550} rx={26} fill="#F3E7CF" stroke={ink} strokeWidth={6} />;

/** Siluetas sin retrato: cabeza y hombros. */
const Silhouette: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <circle cx={x} cy={y - 100} r={52} fill={ink} />
    <path d={`M${x - 130} ${y + 140} Q${x - 130} ${y - 20} ${x} ${y - 30} Q${x + 130} ${y - 20} ${x + 130} ${y + 140} Z`} fill={ink} />
  </g>
);

/** Cuatro formas encajadas en la esquina inferior izquierda: A4 vertical, A5, A6, A7 (cada una la mitad de la anterior). */
const Nest: React.FC<{ x: number; y: number; n: number[]; w?: number }> = ({ x, y, n, w = 315 }) => {
  const h = w * R2;
  const bottom = y + h;
  const r = [
    { x, y, w, h },
    { x, y: y + h / 2, w, h: h / 2 },
    { x, y: y + h / 2, w: w / 2, h: h / 2 },
    { x, y: y + h * 0.75, w: w / 2, h: h / 4 },
  ];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#fff" stroke={ink} strokeWidth={6} />
      {r.slice(1).map((q, i) => (
        <rect key={i} x={q.x} y={q.y} width={q.w} height={q.h} fill={orange} fillOpacity={0.12 * n[i + 1]} stroke={orange} strokeWidth={7} opacity={n[i + 1]} />
      ))}
      <line x1={x} y1={bottom} x2={x + w} y2={bottom} stroke={ink} strokeWidth={6} />
    </g>
  );
};

/** Dos pliegues sucesivos de un folio vertical en (X0,Y0) con ancho SW; u1 = primer pliegue (mitad de arriba cae abajo), u2 = segundo (mitad derecha cae a la izquierda). */
const Folding: React.FC<{ x0: number; y0: number; sw: number; u1: number; u2: number }> = ({ x0, y0, sw, u1, u2 }) => {
  const sh = sw * R2;
  const mid = y0 + sh / 2;
  const mx = x0 + sw / 2;
  const c1 = Math.cos(Math.PI * u1);
  const c2 = Math.cos(Math.PI * u2);
  return (
    <g>
      {u2 === 0 ? (
        <>
          <rect x={x0} y={mid} width={sw} height={sh / 2} fill="#fff" stroke={ink} strokeWidth={5} />
          <g transform={`translate(0 ${mid}) scale(1 ${c1}) translate(0 ${-mid})`}>
            <rect x={x0} y={y0} width={sw} height={sh / 2} fill={u1 > 0.5 ? BACK : "#fff"} stroke={ink} strokeWidth={5} />
          </g>
        </>
      ) : (
        <>
          <rect x={x0} y={mid} width={sw / 2} height={sh / 2} fill={BACK} stroke={ink} strokeWidth={5} />
          <g transform={`translate(${mx} 0) scale(${c2} 1) translate(${-mx} 0)`}>
            <rect x={mx} y={mid} width={sw / 2} height={sh / 2} fill={u2 > 0.5 ? "#F8F2E4" : BACK} stroke={ink} strokeWidth={5} />
          </g>
        </>
      )}
      {u2 === 0 && u1 > 0.02 && u1 < 0.98 && [x0, x0 + sw].map((hx) => <Hand key={hx} x={hx} y={mid + (y0 - mid) * c1} />)}
      {u2 > 0.02 && u2 < 0.98 && [mid, mid + sh / 2].map((hy) => <Hand key={hy} x={mx + (sw / 2) * c2} y={hy} />)}
    </g>
  );
};

/* ------------------------------------------------------------------ hook (0-2) */
const SceneHook: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const u1 = ramp(t, c[0] + 1.6, c[0] + 3.0);
  const u2 = ramp(t, c[1] + 0.4, c[1] + 1.7);
  const n = [1, ramp(t, c[0] + 3.0, c[0] + 3.5), ramp(t, c[1] + 1.7, c[1] + 2.2), 0];
  return (
    <>
      <SvgFrame>
        <Desk />
        <G o={k(0, 1)}>
          <Folding x0={560} y0={185} sw={315} u1={u1} u2={u2} />
        </G>
        <G o={k(0, 2)}>
          <Nest x={1180} y={185} n={n} />
          <Note x={1337} y={657} text="same shape, again and again" o={vis(t, c[1] + 2.2)} size={34} fill={teal} />
        </G>
        <G o={k(2)}>
          <Txt x={770} y={410} size={200} serif fill={orange}>
            WHY?
          </Txt>
        </G>
      </SvgFrame>
      <Chips t={t} c={c} list={[["FOLD A SHEET"], ["FOLD AGAIN"], ["PRINTER PAPER", true]]} />
    </>
  );
};

/* ------------------------------------------------------------------ ratio (3-7) */
const RX = 810;
const RY = 188;
const RW = 300;
const RH = 424;

const SceneRatio: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const arc = ramp(t, c[1] + 2.4, c[1] + 4.6);
  const cut = ramp(t, c[2] + 0.8, c[2] + 1.4);
  const mv = ramp(t, c[2] + 2.6, c[2] + 4.4);
  return (
    <>
      <SvgFrame>
        <G o={k(0, 1)}>
          <Page x={RX} y={RY} w={RW} h={RH} lines={false} />
        </G>
        <G o={k(0)}>
          <Txt x={960} y={648} size={44} fill={teal}>
            1
          </Txt>
          <Txt x={735} y={400} size={44} fill={teal}>
            1.414
          </Txt>
          <Txt x={1450} y={320} size={210} serif fill={orange}>
            √2
          </Txt>
          <Txt x={1450} y={470} size={58}>
            1 : 1.414
          </Txt>
        </G>
        <G o={k(1)}>
          <rect x={RX} y={RY + RH - RW} width={RW} height={RW} fill={SOFT} fillOpacity={0.8} stroke={teal} strokeWidth={5} />
          <line x1={RX} y1={RY + RH} x2={RX + RW} y2={RY + RH - RW} stroke={orange} strokeWidth={8} strokeLinecap="round" />
          <G x={935} y={437} rot={-45}>
            <Txt x={0} y={0} size={40} fill={orange}>
              1.414x
            </Txt>
          </G>
          <path d={`M${RX + RW} ${RY + RH - RW} A${RW * R2} ${RW * R2} 0 0 0 ${RX} ${RY}`} fill="none" stroke={ink} strokeWidth={6} strokeDasharray="1" pathLength={1} strokeDashoffset={1 - arc} strokeLinecap="round" />
          <Note x={1450} y={400} text="diagonal = long side" o={vis(t, c[1] + 4.2)} size={44} fill={ink} />
          <Stamp x={330} y={175} text="OUR ARITHMETIC" o={k(1)} />
        </G>
        <G o={k(2)}>
          <Page x={RX} y={RY} w={RW} h={RH} lines={false} dash="14 10" fill="none" />
          <rect x={RX} y={RY + RH / 2} width={RW} height={RH / 2} fill="#fff" stroke={ink} strokeWidth={5} />
          <g transform={`translate(${lerp(960, 916, mv)} ${lerp(294, 462, mv)}) rotate(${lerp(0, -90, mv)})`}>
            <rect x={-RW / 2} y={-RH / 4} width={RW} height={RH / 2} fill="#fff" stroke={orange} strokeWidth={7} />
          </g>
          <line x1={RX - 30} y1={RY + RH / 2} x2={RX + RW + 30} y2={RY + RH / 2} stroke={orange} strokeWidth={6} strokeDasharray="16 10" opacity={cut * (1 - mv)} />
          <Note x={1450} y={400} text="same shape" o={vis(t, c[2] + 4.3)} size={52} fill={teal} />
        </G>
        <G o={k(3)}>
          <Page x={520} y={RY} w={RW} h={RH} lines={false} />
          <rect x={520} y={RY + RH / 2} width={RW} height={RH / 2} fill={teal} fillOpacity={0.35} />
          <Page x={1100} y={RY + RH - RW} w={RW / R2} h={RW} lines={false} />
          <Arrow x1={850} y1={500} x2={1070} y2={500} color={orange} o={vis(t, c[3] + 1)} w={9} />
          <Txt x={960} y={440} size={84} fill={orange}>
            × ½
          </Txt>
          <Note x={670} y={650} text="area" o={1} size={40} fill={ink} />
          <Note x={1206} y={650} text="next size" o={1} size={40} fill={ink} />
        </G>
        <G o={k(4)}>
          {[
            [380, 300],
            [740, 212],
            [1040, 150],
            [1280, 106],
          ].map(([x, w], i) => (
            <g key={x} opacity={vis(t, c[4] + 0.6 + i * 0.7)}>
              <Page x={x} y={640 - w * R2} w={w} h={w * R2} lines={false} stroke={i === 0 ? ink : orange} sw={6} />
              {i < 3 && <Arrow x1={x + w + 18} y1={540} x2={x + w + 40 + (i === 0 ? 20 : 0)} y2={540} color={orange} w={7} />}
            </g>
          ))}
          <Note x={1580} y={430} text="one shape," o={vis(t, c[4] + 3)} size={48} fill={ink} />
          <Note x={1580} y={490} text="many sizes" o={vis(t, c[4] + 3)} size={48} fill={ink} />
          <Stamp x={330} y={165} text="OUR READING" o={k(4)} color={teal} />
        </G>
        <Foot t={t} c={c} k={0} text="Wikipedia" />
        <Foot t={t} c={c} k={2} text="Wikipedia" />
        <Foot t={t} c={c} k={3} text="Wikipedia" />
        <SimpleNote o={1} />
      </SvgFrame>
      <Chips t={t} c={c} list={[["SQUARE ROOT OF TWO"], ["THE DIAGONAL TRICK"], ["HALVES KEEP THE SHAPE"], ["HALF THE AREA"], ["NEXT SIZE DOWN"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ sizes (8-11) */
const SceneSizes: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const fold = (i: number) => ramp(t, c[2] + 1.2 + i * 1.2, c[2] + 1.7 + i * 1.2);
  const GX = 792;
  const GY = 170;
  const GW = 336;
  const GH = 476;
  const land = ramp(t, c[3] + 0.5, c[3] + 1.5);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <rect x={540} y={250} width={300} height={300} fill={teal} fillOpacity={0.25} stroke={teal} strokeWidth={6} />
          <Txt x={690} y={400} size={70} fill={teal}>
            1 m²
          </Txt>
          <Txt x={960} y={400} size={90}>
            =
          </Txt>
          <rect x={1080} y={193} width={252} height={357} fill={orange} fillOpacity={0.15} stroke={orange} strokeWidth={6} />
          <Txt x={1206} y={372} size={80} fill={orange}>
            A0
          </Txt>
          <Txt x={960} y={630} size={56} fill={ink}>
            A0 = 1 m²
          </Txt>
        </G>
        <G o={k(1)}>
          <Page x={700} y={200} w={294} h={416} />
          <line x1={700} y1={172} x2={994} y2={172} stroke={teal} strokeWidth={5} />
          {[700, 994].map((x) => (
            <line key={x} x1={x} y1={158} x2={x} y2={186} stroke={teal} strokeWidth={5} />
          ))}
          <Txt x={847} y={140} size={48} fill={teal}>
            210
          </Txt>
          <line x1={668} y1={200} x2={668} y2={616} stroke={teal} strokeWidth={5} />
          {[200, 616].map((y) => (
            <line key={y} x1={654} y1={y} x2={682} y2={y} stroke={teal} strokeWidth={5} />
          ))}
          <G x={612} y={408} rot={-90}>
            <Txt x={0} y={0} size={48} fill={teal}>
              297
            </Txt>
          </G>
          <Txt x={1400} y={340} size={150} fill={orange}>
            A4
          </Txt>
          <Txt x={1400} y={480} size={50}>
            210 × 297 mm
          </Txt>
        </G>
        <G o={k(2)}>
          <rect x={GX} y={GY} width={GW} height={GH} fill="#fff" stroke={ink} strokeWidth={6} />
          {[
            { f: 1, ls: [[GX, GY + GH / 2, GX + GW, GY + GH / 2]] },
            { f: 2, ls: [[GX + GW / 2, GY, GX + GW / 2, GY + GH]] },
            {
              f: 3,
              ls: [
                [GX, GY + GH / 4, GX + GW, GY + GH / 4],
                [GX, GY + (GH * 3) / 4, GX + GW, GY + (GH * 3) / 4],
              ],
            },
            {
              f: 4,
              ls: [
                [GX + GW / 4, GY, GX + GW / 4, GY + GH],
                [GX + (GW * 3) / 4, GY, GX + (GW * 3) / 4, GY + GH],
              ],
            },
          ].map(({ f, ls }) =>
            ls.map(([x1, y1, x2, y2], j) => <line key={`${f}${j}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={teal} strokeWidth={6} strokeDasharray="14 9" opacity={fold(f - 1)} />),
          )}
          <rect x={GX} y={GY} width={GW / 4} height={GH / 4} fill={orange} fillOpacity={0.35 * fold(3)} />
          <Txt x={400} y={400} size={60} fill={ink}>
            4 FOLDS
          </Txt>
          <Txt x={400} y={475} size={60} fill={orange}>
            = 16 SHEETS
          </Txt>
          <Stamp x={330} y={175} text="OUR ARITHMETIC" o={k(2)} />
        </G>
        <G o={k(3)}>
          <rect x={780} y={556} width={360} height={110} rx={20} fill={SOFT} stroke={ink} strokeWidth={6} />
          <rect x={930} y={500} width={60} height={56} fill={GREY} stroke={ink} strokeWidth={5} />
          <rect x={800} y={470} width={320} height={30} rx={8} fill={GREY} stroke={ink} strokeWidth={5} />
          <rect x={870} y={578} width={180} height={64} rx={8} fill={ink} />
          <Txt x={960} y={611} size={46} fill={SAND}>
            {land > 0.9 ? "5 g" : "0 g"}
          </Txt>
          <polygon points="840,470 1080,470 1112,420 872,420" fill="#fff" stroke={ink} strokeWidth={5} transform={`translate(0 ${lerp(-170, 0, land)})`} />
          <Note x={1440} y={440} text="one sheet of" o={1} size={46} fill={ink} />
          <Note x={1440} y={500} text="common A4" o={1} size={46} fill={ink} />
        </G>
        <Foot t={t} c={c} k={0} text="Wikipedia" />
        <Foot t={t} c={c} k={1} text="Wikipedia" />
        <Foot t={t} c={c} k={3} text="Cambridge University (Markus Kuhn)" />
        <SimpleNote o={1} />
      </SvgFrame>
      <Chips t={t} c={c} list={[["A0 IS ONE SQUARE METER"], ["A4 IN MILLIMETERS"], ["COUNTING THE FOLDS"], ["THE WEIGHT OF A SHEET"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ letter (12-16) */
const Scribble: React.FC<{ x: number; y: number; n: number; w?: number }> = ({ x, y, n, w = 252 }) => (
  <g fill="none" stroke={ink} strokeWidth={3} opacity={0.45} strokeLinecap="round">
    {Array.from({ length: n }, (_, i) => (
      <path key={i} d={`M${x} ${y + i * 40} q9 -10 18 0${" t18 0".repeat(Math.round(w / 18) - (i % 3 === 2 ? 5 : 1))}`} />
    ))}
  </g>
);

const SceneLetter: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const sc = ramp(t, c[2] + 1.2, c[2] + 3.4);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <G x={880} y={400} rot={-3}>
            <rect x={-180} y={-235} width={360} height={470} fill={OLD} stroke={ink} strokeWidth={5} />
            <Txt x={0} y={-185} size={52} serif>
              25 OCT 1786
            </Txt>
            <Scribble x={-130} y={-130} n={9} />
            <circle cx={110} cy={185} r={26} fill="#C0504D" stroke={ink} strokeWidth={4} />
          </G>
          <Note x={1400} y={400} text="first mention" o={vis(t, c[0] + 4)} size={52} fill={ink} />
          <Note x={1400} y={466} text="of the shape" o={vis(t, c[0] + 4)} size={52} fill={ink} />
        </G>
        <G o={k(1)}>
          <Silhouette x={700} y={400} />
          <path d="M790 520 L1000 340" stroke={ink} strokeWidth={8} strokeLinecap="round" />
          <ellipse cx={1030} cy={310} rx={22} ry={95} transform="rotate(49 1030 310)" fill={GREY} stroke={ink} strokeWidth={4} />
          <Plaque x={700} y={625} text="Lichtenberg" w={380} />
          <Note x={1400} y={420} text="German" o={1} size={52} fill={ink} />
          <Note x={1400} y={486} text="physics professor" o={1} size={52} fill={ink} />
        </G>
        <G o={k(2)}>
          <Page x={700} y={188} w={380} h={424} fill="#fff" />
          <line x1={1000} y1={176} x2={1000} y2={624} stroke={orange} strokeWidth={7} strokeDasharray="14 10" />
          <rect x={1000} y={188} width={80} height={424} fill={BACK} opacity={0.75 * sc} />
          <G x={1000} y={lerp(170, 590, sc)}>
            <circle cx={-16} cy={-44} r={15} fill="none" stroke={ink} strokeWidth={6} />
            <circle cx={16} cy={-44} r={15} fill="none" stroke={ink} strokeWidth={6} />
            <path d="M-12 -30 L10 44 M12 -30 L-10 44" stroke={ink} strokeWidth={7} strokeLinecap="round" />
          </G>
          <Note x={1450} y={400} text="ordinary" o={1} size={48} fill={ink} />
          <Note x={1450} y={460} text="writing paper" o={1} size={48} fill={ink} />
        </G>
        <G o={k(3)}>
          <Page x={RX} y={RY} w={RW} h={RH} />
          <rect x={RX} y={RY} width={RW} height={RH} fill="none" stroke={orange} strokeWidth={8} strokeDasharray="14 10" />
          <circle cx={1180} cy={220} r={46} fill={GREEN} />
          <path d="M1158 220 L1174 238 L1204 202" fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          <Note x={1450} y={430} text="already that shape" o={vis(t, c[3] + 1.2)} size={46} fill={ink} />
        </G>
        <G o={k(4)}>
          <rect x={610} y={170} width={700} height={480} fill={OLD} stroke={ink} strokeWidth={5} />
          <Scribble x={660} y={225} n={4} w={600} />
          <Scribble x={660} y={500} n={3} w={600} />
          <Stamp x={960} y={380} text="NOT BY ACCIDENT" rot={-4} o={k(4)} size={52} />
        </G>
        <Foot t={t} c={c} k={0} text="Wikipedia" />
        <Foot t={t} c={c} k={1} text="Cambridge University (Markus Kuhn)" />
        <Foot t={t} c={c} k={2} text="Cambridge University (Markus Kuhn)" />
        <Foot t={t} c={c} k={4} text="Cambridge University (Markus Kuhn)" />
        <SimpleNote o={1} />
      </SvgFrame>
      <Chips t={t} c={c} list={[["A LETTER FROM 1786"], ["THE WRITER"], ["THE PLAN"], ["THE SURPRISE"], ["HIS CONCLUSION"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ standard (17-20) */
const Cal: React.FC<{ x: number; y: number; text: string; o?: number }> = ({ x, y, text, o = 1 }) => (
  <G x={x} y={y} o={o}>
    <rect x={-120} y={-130} width={240} height={260} rx={14} fill="#fff" stroke={ink} strokeWidth={6} />
    <rect x={-120} y={-130} width={240} height={66} rx={14} fill={orange} />
    {[-60, 60].map((rx) => (
      <circle key={rx} cx={rx} cy={-130} r={9} fill={ink} />
    ))}
    <Txt x={0} y={20} size={78} serif>
      {text}
    </Txt>
  </G>
);

const SceneStandard: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Silhouette x={520} y={400} />
          <Plaque x={520} y={615} text="Walter Porstmann" w={540} />
          <Cal x={960} y={360} text="1918" />
          <rect x={1300} y={260} width={220} height={220} fill={teal} fillOpacity={0.25} stroke={teal} strokeWidth={6} />
          <Txt x={1410} y={370} size={50} fill={teal}>
            AREA
          </Txt>
          <Note x={1410} y={530} text="formats based on area" o={1} size={34} fill={ink} />
        </G>
        <G o={k(1)}>
          <Page x={780} y={170} w={360} h={470} />
          <rect x={780} y={170} width={360} height={64} fill={teal} />
          <Txt x={960} y={202} size={28} fill={SAND} serif>
            GERMAN STANDARD
          </Txt>
          <Stamp x={960} y={470} text="EARLY 1920s" rot={-6} o={1} size={42} />
        </G>
        <G o={k(2)}>
          <Cal x={680} y={360} text="1975" />
          <Arrow x1={850} y1={360} x2={1030} y2={360} color={orange} w={9} />
          <Page x={1060} y={170} w={280} h={396} />
          <Txt x={1200} y={236} size={54} serif>
            ISO 216
          </Txt>
          <Note x={1200} y={640} text="international standard" o={1} size={38} fill={ink} />
        </G>
        <G o={k(3)}>
          {[2, 1, 0].map((i) => (
            <Page key={i} x={640 + i * 22} y={180 + i * 20} w={260} h={368} />
          ))}
          <g>
            <circle cx={1250} cy={370} r={130} fill={SOFT} stroke={ink} strokeWidth={6} />
            <ellipse cx={1250} cy={370} rx={55} ry={130} fill="none" stroke={ink} strokeWidth={4} />
            <ellipse cx={1250} cy={370} rx={110} ry={130} fill="none" stroke={ink} strokeWidth={3} opacity={0.5} />
            <line x1={1120} y1={370} x2={1380} y2={370} stroke={ink} strokeWidth={4} />
            <path d="M1135 300 H1365 M1135 440 H1365" stroke={ink} strokeWidth={3} opacity={0.5} />
          </g>
          <Note x={1250} y={560} text="official UN document format" o={1} size={38} fill={ink} />
          <Note x={770} y={620} text="documents" o={1} size={38} fill={ink} />
        </G>
        <Foot t={t} c={c} k={0} text="Wikipedia" />
        <Foot t={t} c={c} k={1} text="Wikipedia; Cambridge University" />
        <Foot t={t} c={c} k={2} text="Wikipedia" />
        <Foot t={t} c={c} k={3} text="Cambridge University (Markus Kuhn)" />
        <SimpleNote o={1} />
      </SvgFrame>
      <Chips t={t} c={c} list={[["PORSTMANN'S IDEA"], ["A NATIONAL RULE"], ["GOING INTERNATIONAL"], ["UNITED NATIONS"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ use (21-25) */
type Pt = [number, number];
const MAP: { id: string; p: Pt[] }[] = [
  { id: "na", p: [[-168, 66], [-141, 70], [-110, 72], [-80, 72], [-62, 58], [-53, 47], [-70, 42], [-76, 35], [-81, 25], [-97, 26], [-117, 32], [-124, 40], [-125, 49], [-140, 60], [-155, 58]] },
  { id: "la", p: [[-117, 32], [-97, 26], [-97, 17], [-88, 15], [-83, 9], [-78, 8], [-72, 12], [-60, 10], [-50, 0], [-35, -6], [-40, -22], [-48, -27], [-58, -38], [-65, -42], [-68, -52], [-74, -50], [-75, -40], [-71, -18], [-81, -5], [-80, 3], [-77, 8], [-83, 8], [-92, 15], [-105, 20], [-110, 24]] },
  { id: "eu", p: [[-10, 36], [-9, 43], [-1, 46], [-5, 48], [5, 52], [8, 57], [12, 55], [20, 60], [30, 70], [60, 70], [100, 78], [140, 72], [180, 68], [170, 60], [140, 52], [135, 43], [122, 40], [121, 30], [110, 20], [105, 10], [100, 2], [98, 16], [92, 22], [80, 8], [72, 20], [60, 25], [57, 24], [50, 30], [43, 13], [34, 28], [35, 36], [26, 38], [20, 40], [12, 44], [8, 44], [3, 43]] },
  { id: "af", p: [[-17, 21], [-10, 32], [10, 37], [32, 31], [43, 12], [51, 12], [40, -15], [35, -25], [20, -35], [12, -18], [9, -1], [-8, 5], [-17, 14]] },
  { id: "au", p: [[113, -22], [130, -12], [142, -11], [153, -27], [147, -39], [130, -32], [115, -34]] },
];
const mx = (lon: number) => 260 + ((lon + 180) / 360) * 1400;
const my = (lat: number) => 170 + ((80 - lat) / 138) * 500;
const d = (p: Pt[]) => p.map(([lo, la], i) => `${i ? "L" : "M"}${mx(lo).toFixed(0)} ${my(la).toFixed(0)}`).join(" ") + "Z";

const SceneUse: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const fl = ramp(t, c[2] + 1.0, c[2] + 2.4);
  const fc = Math.cos(Math.PI * fl);
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Page x={460} y={188} w={300} h={424} />
          <Page x={1010} y={400} w={150} h={212} />
          <Arrow x1={785} y1={500} x2={985} y2={500} color={orange} w={9} />
          <Arrow x1={985} y1={540} x2={785} y2={540} color={orange} w={9} />
          <Txt x={1490} y={400} size={100} serif fill={orange}>
            SCALING
          </Txt>
        </G>
        <G o={k(1)}>
          <rect x={700} y={430} width={520} height={170} rx={18} fill={SOFT} stroke={ink} strokeWidth={6} />
          <rect x={680} y={400} width={560} height={40} rx={10} fill={GREY} stroke={ink} strokeWidth={5} />
          <Page x={885} y={188} w={150} h={212} />
          <Arrow x1={690} y1={515} x2={610} y2={515} color={orange} w={9} />
          <Arrow x1={1230} y1={515} x2={1310} y2={515} color={orange} w={9} />
          <Page x={474} y={450} w={106} h={150} />
          <Page x={1330} y={300} w={212} h={300} />
          <Note x={527} y={415} text="reduce" o={1} size={40} fill={teal} />
          <Note x={1436} y={262} text="enlarge" o={1} size={40} fill={teal} />
        </G>
        <G o={k(2)}>
          <rect x={560} y={200} width={212} height={300} fill="#fff" stroke={ink} strokeWidth={5} />
          <g transform={`translate(772 0) scale(${fc} 1) translate(-772 0)`}>
            <rect x={772} y={200} width={212} height={300} fill={fl > 0.5 ? BACK : "#fff"} stroke={ink} strokeWidth={5} />
          </g>
          {fl < 0.5 && <line x1={772} y1={200} x2={772} y2={500} stroke={orange} strokeWidth={5} strokeDasharray="10 8" />}
          {fl > 0.02 && fl < 0.98 && [200, 500].map((hy) => <Hand key={hy} x={772 + 212 * fc} y={hy} />)}
          <Arrow x1={1040} y1={350} x2={1200} y2={350} color={orange} o={vis(t, c[2] + 2.4)} w={9} />
          <G o={vis(t, c[2] + 2.4)}>
            <rect x={1250} y={200} width={212} height={300} fill="#fff" stroke={ink} strokeWidth={5} />
            <rect x={1250} y={200} width={14} height={300} fill={teal} />
            <rect x={1290} y={250} width={140} height={34} fill={teal} fillOpacity={0.35} />
            <Page x={1250} y={310} w={212} h={190} stroke="none" sw={0} />
          </G>
          <Note x={1356} y={560} text="a brochure of half-size pages" o={vis(t, c[2] + 2.8)} size={34} fill={ink} />
        </G>
        <G o={k(3)}>
          <defs>
            <pattern id="hatch22" width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1={0} y1={0} x2={0} y2={14} stroke={GREY} strokeWidth={4} />
            </pattern>
          </defs>
          {MAP.map(({ id, p }) => (
            <path key={id} d={d(p)} fill={id === "na" ? GREY : id === "la" ? "url(#hatch22)" : teal} fillOpacity={id === "na" || id === "la" ? 1 : 0.5} stroke={id === "eu" || id === "af" || id === "au" ? teal : GREY} strokeWidth={4} strokeLinejoin="round" />
          ))}
          <circle cx={mx(122)} cy={my(12)} r={9} fill={GREY} stroke={ink} strokeWidth={3} />
          <Note x={mx(122) + 20} y={my(12) + 34} text="Philippines" o={1} size={26} fill={ink} />
          <Txt x={mx(-102)} y={my(55)} size={34} fill={ink}>
            NORTH AMERICA
          </Txt>
          <Note x={960} y={676} text="We found no source that explains why." o={vis(t, c[3] + 5)} size={36} fill={orange} />
        </G>
        <G o={k(4)}>
          <Nest x={900} y={195} n={[1, vis(t, c[4] + 0.8), vis(t, c[4] + 1.6), vis(t, c[4] + 2.4)]} />
          <Note x={1450} y={380} text="not a fashion:" o={vis(t, c[4] + 2.8)} size={48} fill={ink} />
          <Note x={1450} y={446} text="a rule" o={vis(t, c[4] + 2.8)} size={48} fill={orange} />
          <Stamp x={420} y={215} text="OUR READING: AN INFERENCE" o={k(4)} color={teal} size={38} />
        </G>
        <Foot t={t} c={c} k={0} text="Wikipedia" />
        <Foot t={t} c={c} k={1} text="Wikipedia" />
        <Foot t={t} c={c} k={2} text="Wikipedia" />
        <Foot t={t} c={c} k={3} text="Wikipedia" />
        <SimpleNote o={1} />
      </SvgFrame>
      <Chips t={t} c={c} list={[["THE MAIN ADVANTAGE"], ["COPIERS"], ["BROCHURES"], ["WHERE IT IS USED"], ["WHY IT STAYS"]]} />
    </>
  );
};

/* ------------------------------------------------------------------ close (26-28) */
const SceneClose: React.FC<SceneProps> = ({ cues: c }) => {
  const t = useT();
  const k = (a: number, b = a) => seg(t, c, a, b);
  const u1 = ramp(t, c[0] + 1.0, c[0] + 2.4);
  const u2 = ramp(t, c[0] + 3.2, c[0] + 4.6);
  const arr = (y: number, x1: number, x2: number) => <Arrow key={y} x1={x1} y1={y} x2={x2} y2={y} color={orange} w={10} o={vis(t, c[2] + 0.4 + (y - 530) / 300)} />;
  return (
    <>
      <SvgFrame>
        <G o={k(0)}>
          <Desk />
          <G x={1380} y={420} rot={-3} o={0.55}>
            <rect x={-170} y={-230} width={340} height={460} fill={OLD} stroke={ink} strokeWidth={5} />
            <Txt x={0} y={-180} size={50} serif>
              1786
            </Txt>
            <Scribble x={-120} y={-120} n={8} w={230} />
          </G>
          <Folding x0={740} y0={185} sw={315} u1={u1} u2={u2} />
          <Stamp x={330} y={175} text="OUR READING" o={k(0)} color={teal} />
        </G>
        <G o={k(1)}>
          {[4, 3, 2, 1, 0].map((i) => (
            <rect key={i} x={450 + i * 16} y={200 - i * 14} width={260} height={320} rx={12} fill="#fff" stroke={ink} strokeWidth={5} />
          ))}
          <rect x={450} y={200} width={260} height={64} rx={12} fill={orange} />
          <Note x={580} y={640} text="years of agreeing" o={1} size={44} fill={ink} />
          <G x={1300} y={360} o={vis(t, c[1] + 2.2)}>
            <rect x={-130} y={-160} width={260} height={320} rx={12} fill="#fff" stroke={ink} strokeWidth={6} />
            <rect x={-130} y={-160} width={260} height={64} rx={12} fill={orange} />
            <circle cx={0} cy={30} r={60} fill={orange} fillOpacity={0.3} stroke={orange} strokeWidth={6} />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <line key={a} x1={Math.cos((a * Math.PI) / 180) * 80} y1={30 + Math.sin((a * Math.PI) / 180) * 80} x2={Math.cos((a * Math.PI) / 180) * 104} y2={30 + Math.sin((a * Math.PI) / 180) * 104} stroke={orange} strokeWidth={6} strokeLinecap="round" />
            ))}
          </G>
          <Note x={1300} y={640} text="one morning" o={vis(t, c[1] + 2.2)} size={44} fill={ink} />
        </G>
        <G o={k(2)}>
          <defs>
            <linearGradient id="dawn22" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={WARM} />
              <stop offset="1" stopColor="#FBEBD0" />
            </linearGradient>
            <clipPath id="clip22">
              <rect x={200} y={140} width={1520} height={550} rx={26} />
            </clipPath>
          </defs>
          <g clipPath="url(#clip22)">
            <rect x={200} y={140} width={1520} height={320} fill="url(#dawn22)" />
            <rect x={200} y={460} width={1520} height={230} fill={SAND} />
            <circle cx={960} cy={460} r={70} fill={orange} />
            <polygon points="910,460 1010,460 1500,690 420,690" fill="#B8BFC9" />
            {[[475, 490, 4], [510, 535, 6], [565, 600, 9], [640, 690, 13]].map(([y1, y2, w]) => (
              <line key={y1} x1={960} y1={y1} x2={960} y2={y2} stroke="#fff" strokeWidth={w} />
            ))}
            {arr(530, 790, 1130)}
            {arr(590, 660, 1260)}
            {arr(650, 540, 1380)}
          </g>
          <rect x={200} y={140} width={1520} height={550} rx={26} fill="none" stroke={ink} strokeWidth={6} />
          <Txt x={960} y={265} size={190} serif fill={orange}>
            <tspan opacity={vis(t, c[2] + 0.6)}>WHY?</tspan>
          </Txt>
        </G>
      </SvgFrame>
      <Chips t={t} c={c} list={[["A SHAPE FROM 1786"], ["YEARS VS ONE MORNING"], ["NEXT: A WHOLE COUNTRY", true]]} />
    </>
  );
};

export const SCENES022: Record<string, React.FC<SceneProps>> = {
  hook: SceneHook,
  ratio: SceneRatio,
  sizes: SceneSizes,
  letter: SceneLetter,
  standard: SceneStandard,
  use: SceneUse,
  close: SceneClose,
};
