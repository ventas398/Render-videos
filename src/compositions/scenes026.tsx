import React from "react";
import { staticFile } from "remotion";
import { geoConicConformal, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import world from "world-atlas/countries-110m.json";
import { ramp } from "../utils/anim";
import { theme } from "../themes/brand";
import type { SceneProps } from "./scenes";
import { Cam, DrawOn } from "./kit2";
import { ink, orange, RED, SvgFrame, teal, Txt, useT } from "./kit";
import { FULL, Kin, Ov, Pill, Reading, Sfx, sfxOf, Shots, Src } from "./scenes023";
import type { Ev, Sh } from "./scenes023";
import { Lab, Q, Sm, Stp, thud, Tl } from "./scenes025";

/* ============ EM-026: imagenes IA em026-* (16:9) + em025-stamp-desk. Rotulos "Illustrative image" por plano; manos/linea/mapa son vector encima ============ */
const CARD = "#FFFDF6";
const IMG = "Illustrative image";
const AI = "AI illustration, not a portrait";
/** Planos con rotulo "Illustrative image" (escenas historicas). celtic-hands: dudosa, solo en ventana y sin valor de prueba. */
const LB: Record<string, string> = {
  "roman-study": AI, "roman-iron-ring-hand-v4": IMG, "lab-2000-crt-v3b": AI, "jewish-wedding-chuppah-v3": AI, "apothecary-7th-century-v3": AI, "egypt-papyrus": IMG, "visigoth-scriptorium-v2": AI, "lawyer-1620s": AI, "heart-wax-1628-v2": IMG,
  "physician-1646-falling-band-v2": AI, "medieval-wedding-sarum-v2": AI, "medieval-couple-hands-v2": IMG, "prayer-book-1662": IMG, "orthodox-wedding": IMG, "em003-scan": IMG, "celtic-hands": IMG, "apothecary-ointments": IMG, "lab-generic": IMG, "scroll-desk": IMG, "index-ring": IMG, "anatomy-class": IMG, "wedding-couple-hands": IMG,
};
const imgSrc = (k: string) => staticFile(`illustrations/${k.startsWith("em0") ? k : `em026-${k}`}.png`);

type Out = { shots: Sh[]; ov: React.ReactNode; top?: React.ReactNode; ev?: Ev[] };
const scene = (from: number, id: string, mk: (P: (n: number, o?: number) => number) => Out): React.FC<SceneProps> => ({ cues, dur }) => {
  const P = (n: number, o = 0) => (cues[n - from] ?? dur) + o;
  const { shots, ov, top, ev = [] } = mk(P);
  return (
    <>
      <SvgFrame>
        <Cam dur={dur} z1={1.04} amt={0.6}>
          <Shots id={id} list={shots} dur={dur} asp={16 / 9} src={imgSrc} />
        </Cam>
        <Cam dur={dur} z1={1.05} dx={-20} amt={1.3}>
          {ov}
        </Cam>
        {shots.map((s, i) => (LB[s.id] ? <Lab key={i} text={LB[s.id]} a={s.t} b={shots[i + 1]?.t ?? dur} /> : null))}
        {top}
      </SvgFrame>
      <Sfx ev={[...sfxOf(shots), ...ev]} />
    </>
  );
};
const sh = (id: string, t: number, o: Partial<Sh> = {}): Sh => ({ id, t, r: FULL, mv: "in", tr: "wl", ...o });
type PF = (n: number, o?: number) => number;
const pl = (P: PF, n: number, text: string, m = n + 1, o: { y?: number; size?: number; color?: string; at?: number } = {}) => (
  <Pill key={`${n}${text}`} x={960} y={o.y ?? 150} text={text} a={P(n, o.at ?? 0)} b={P(m)} size={o.size ?? 36} color={o.color} />
);
const kn = (P: PF, n: number, text: string, m = n + 1, y = 170, size = 80) => <Kin key={`${n}${text}`} x={960} y={y} text={text} a={P(n)} b={P(m)} size={size} />;
/** Veredicto: rotulo + sello; la linea dedo-corazon se rompe aparte (ver HeartLine). */
const vd = (P: PF, n: number, label: string, k: "D" | "P" | "M", m = n + 1, x = 960) => (
  <React.Fragment key={`v${n}`}>
    {pl(P, n, label, m, { y: 150 })}
    <Stp x={x} y={560} k={k} a={P(n, 0.5)} b={P(m)} size={90} rot={-4} />
  </React.Fragment>
);
const vev = (P: PF, ...n: number[]): Ev[] => n.map((p) => thud(P(p, 0.5)));

/* ============ vector en espacio de imagen (1376 px de ancho) ============ */
const Img: React.FC<{ S: number; children: React.ReactNode }> = ({ S, children }) => <g transform={`scale(${S / 1376})`}>{children}</g>;
/** Latido en un punto, con numero opcional. */
const Beat: React.FC<{ x: number; y: number; a: number; b: number; n?: string; dx?: number; dy?: number; r?: number }> = ({ x, y, a, b, n, dx = 0, dy = -48, r = 26 }) => {
  const t = useT();
  if (t < a || t > b) return null;
  const k = ((t - a) * 1.4) % 1;
  return (
    <g opacity={ramp(t, a, a + 0.15) * (1 - ramp(t, b - 0.2, b))}>
      <circle cx={x} cy={y} r={r * (0.6 + 0.9 * k)} fill="none" stroke={orange} strokeWidth={7} opacity={1 - k} />
      <circle cx={x} cy={y} r={9} fill={orange} stroke={CARD} strokeWidth={3} />
      {n && (
        <g transform={`translate(${x + dx} ${y + dy})`}>
          <rect x={n.length * -20 - 14} y={-30} width={n.length * 40 + 28} height={60} rx={30} fill={CARD} stroke={orange} strokeWidth={5} />
          <Txt x={0} y={2} size={34}>
            {n}
          </Txt>
        </g>
      )}
    </g>
  );
};
const HEART = "M935 372 C935 352 900 352 900 376 C900 396 935 414 935 414 C935 414 970 396 970 376 C970 352 935 352 935 372 Z";
/** Linea dedo anular -> corazon (vector, "Simplified illustration"); si brk, se rompe y se separa. */
const HeartLine: React.FC<{ a: number; brk?: number }> = ({ a, brk }) => {
  const t = useT();
  const u = brk !== undefined ? ramp(t, brk, brk + 0.5) : 0;
  const hs = 1 + 0.07 * Math.sin(t * 6);
  return (
    <>
      <g transform={`translate(${-u * 14} ${u * 10})`}>
        <DrawOn d="M822 337 C850 300 860 330 890 365" t0={a} t1={a + 0.5} w={9} color={orange} />
      </g>
      <g transform={`translate(${u * 14} ${u * 10})`} opacity={1 - 0.45 * u}>
        <DrawOn d="M890 365 L905 380" t0={a + 0.5} t1={a + 0.7} w={9} color={orange} />
      </g>
      <g transform={`translate(935 392) scale(${hs}) translate(-935 -392)`} opacity={ramp(t, a + 0.4, a + 0.7)}>
        <path d={HEART} fill={RED} stroke={CARD} strokeWidth={5} />
      </g>
      {brk !== undefined && u > 0 && (
        <g opacity={u} transform="translate(884 368)">
          <path d="M-18 -18 L18 18 M18 -18 L-18 18" stroke={RED} strokeWidth={11} strokeLinecap="round" />
        </g>
      )}
    </>
  );
};
/** Flechas "levantar solo el anular": sube el anular, los vecinos se arrastran un poco. */
const Lift: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const t = useT();
  if (t < a || t > b) return null;
  const k = Math.abs(Math.sin((t - a) * 3));
  const arrow = (x: number, y: number, s: number, c: string) => (
    <g transform={`translate(${x} ${y - k * 26 * s}) scale(${s})`}>
      <path d="M0 40 V-30 M-26 -4 L0 -34 L26 -4" fill="none" stroke={c} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
  return (
    <g opacity={ramp(t, a, a + 0.3) * (1 - ramp(t, b - 0.3, b))}>
      {arrow(615, 218, 0.95, orange)}
      {arrow(690, 196, 0.55, teal)}
      {arrow(775, 210, 0.5, teal)}
      <circle cx={615} cy={235} r={50} fill="none" stroke={orange} strokeWidth={8} opacity={0.8} />
    </g>
  );
};

/* ============ mapa vectorial propio (d3-geo + world-atlas): rotulado "Simplified illustration" y "Examples, not a full list" ============ */
const PROJ = geoConicConformal().parallels([40, 60]).rotate([-22, 0]).center([0, 52]).scale(2300).translate([960, 450]);
const GEO = feature(world as never, (world as never as { objects: { countries: never } }).objects.countries) as unknown as { features: { properties: { name: string }; geometry: never }[] };
const CRIMEA = geoPath(PROJ)({ type: "Polygon", coordinates: [[[33.6, 46.15], [34.8, 46.05], [35.1, 45.8], [35.4, 45.25], [36.4, 45.4], [35.6, 45.05], [35.0, 44.85], [34.2, 44.45], [33.55, 44.6], [33.1, 44.95], [32.6, 45.4], [32.6, 45.65], [33.6, 46.15]]] } as never) ?? "";
const PATHS = GEO.features.map((f) => ({ n: f.properties.name, d: geoPath(PROJ)(f.geometry) ?? "" }));
const LBL: Record<string, [number, number]> = { Russia: [48, 57], Poland: [19.3, 52.1], Bulgaria: [25, 42.7], Netherlands: [4.6, 52.3] };
const MapLayer: React.FC<{ a: number; b: number; on: Record<string, number>; col?: Record<string, string> }> = ({ a, b, on, col = {} }) => {
  const t = useT();
  if (t < a || t > b) return null;
  const o = ramp(t, a, a + 0.35) * (1 - ramp(t, b - 0.35, b));
  return (
    <g opacity={o}>
      <rect width={1920} height={1080} fill="#F2EEE3" />
      {PATHS.map((p) => {
        const s = on[p.n] !== undefined ? ramp(t, on[p.n], on[p.n] + 0.4) : 0;
        return <path key={p.n} d={p.d} fill={s > 0 ? col[p.n] ?? orange : "#DAD5C6"} fillOpacity={0.35 + 0.65 * s} stroke="#FFFDF6" strokeWidth={1.5} />;
      })}
      {on.Russia !== undefined && t > on.Russia && <path d={CRIMEA} fill="#EAE5D9" stroke="#EAE5D9" strokeWidth={9} strokeLinejoin="round" />}
      {Object.entries(on).map(([n, ta]) => {
        const [x, y] = PROJ(LBL[n]) ?? [0, 0];
        return t > ta ? (
          <Ov key={n} x={x} y={y} a={ta + 0.2} lim={1.05}>
            <rect x={-n.length * 13 - 20} y={-26} width={n.length * 26 + 40} height={52} rx={26} fill={CARD} stroke={col[n] ?? orange} strokeWidth={5} />
            <Txt x={0} y={2} size={30}>
              {n}
            </Txt>
          </Ov>
        ) : null;
      })}
    </g>
  );
};
/** Nota inferior izquierda (como Source, sin prefijo). */
const Note: React.FC<{ text: string; a: number; b: number }> = ({ text, a, b }) => {
  const t = useT();
  const o = ramp(t, a, a + 0.3) * (1 - ramp(t, b - 0.3, b));
  return o > 0 ? (
    <g opacity={o}>
      <rect x={52} y={884} width={text.length * 13 + 50} height={44} rx={22} fill={CARD} stroke={teal} strokeWidth={3} />
      <text x={76} y={907} dominantBaseline="central" fontFamily={theme.font} fontWeight={700} fontSize={24} fill={teal}>
        {text}
      </text>
    </g>
  ) : null;
};

/* ============ ch01 gancho (0-14) ============ */
const ch01 = scene(0, "ch01", (P) => ({
  shots: [
    sh("hand-left", 0, { tr: "cut" }),
    sh("rings-tray", P(2)),
    sh("hand-on-heart", P(4), { f: [0.62, 0.45], z: 1.5, tr: "zoom", m: (S) => <Img S={S}><HeartLine a={P(4, 1.6)} /></Img> }),
    sh("wedding-couple-hands", P(7), { tr: "wr" }),
  ],
  ov: (
    <>
      {pl(P, 1, "THE FINGER NEXT TO THE LITTLE ONE", 2, { size: 34 })}
      {pl(P, 4, "THEY BELIEVED IN A VEIN OF LOVE", 5, { size: 34, y: 150 })}
      {kn(P, 6, "IS IT TRUE?", 7, 170, 110)}
      {kn(P, 7, "WHY?", 8, 190, 200)}
      {["HEART", "CHURCH", "PRACTICAL", "COUNTRY", "NAME"].map((l, i) => (
        <Q key={l} x={334 + i * 313} s={0.85} label={l} a={P(9 + i)} b={P(14)} rot={i % 2 ? 2 : -2} />
      ))}
      {kn(P, 14, "WHICH ONE IS REAL?", 15, 130, 100)}
    </>
  ),
  top: <Sm a={P(4, 1.6)} b={P(7)} />,
}));

/* ============ ch02 reglas (15-25) ============ */
const ch02 = scene(15, "ch02", (P) => ({
  shots: [sh("em025-stamp-desk", 0, { tr: "cut" })],
  ov: (
    <>
      {pl(P, 16, "FOLLOW THE PAPER TRAIL", 17)}
      {kn(P, 17, "NAMES", 18, 170, 130)}
      {kn(P, 18, "DATES", 19, 170, 130)}
      {kn(P, 19, "BOOKS", 20, 170, 130)}
      {kn(P, 20, "THEN WE STAMP IT", 21, 170, 90)}
      <Stp x={440} y={560} k="D" a={P(21, 0.3)} b={P(24)} size={56} rot={-5} />
      <Stp x={960} y={560} k="P" a={P(22, 0.3)} b={P(24)} size={56} rot={3} />
      <Stp x={1480} y={560} k="M" a={P(23, 0.3)} b={P(24)} size={56} rot={-3} />
      {pl(P, 21, "THE RECORDS EXIST", 22, { y: 760, size: 32 })}
      {pl(P, 22, "EXPERTS ARGUE, OR THE EVIDENCE IS THIN", 23, { y: 760, size: 32 })}
      {pl(P, 23, "THE EVIDENCE SAYS NO", 24, { y: 760, size: 32 })}
      <Reading x={300} y={150} a={P(24)} b={P(25)} />
      {kn(P, 25, "CASE 1: THE HEART", 26, 170, 90)}
    </>
  ),
  ev: vev(P, 21, 22, 23).map(([t, k, v]) => [t - 0.2, k, v] as Ev),
}));

/* ============ ch03 caso 1: Gelio (26-38) ============ */
const ch03 = scene(26, "ch03", (P) => ({
  shots: [
    sh("roman-study", 0, { tr: "cut" }),
    sh("roman-iron-ring-hand-v4", P(29)),
    sh("scroll-desk", P(33), { tr: "wr" }),
    sh("egypt-papyrus", P(34)),
    sh("scroll-desk", P(36), { tr: "wr" }),
  ],
  ov: (
    <>
      {kn(P, 26, "CASE 1: THE HEART", 28, 170, 90)}
      {pl(P, 28, "2nd century: Aulus Gellius", 29)}
      {pl(P, 29, "Greeks: a ring on the left hand", 30, { size: 34 })}
      {pl(P, 30, "The finger next to the little one", 31, { size: 34 })}
      {pl(P, 31, "Romans did the same", 32)}
      {kn(P, 32, "NOT A WEDDING RING", 33, 170, 80)}
      {pl(P, 33, "The reason, he says, comes from Apion", 34, { size: 34 })}
      {pl(P, 34, "Apion: a history of Egypt", 35)}
      {kn(P, 35, "A VERY FINE NERVE", 36, 170, 90)}
      {pl(P, 36, "Gellius only passes on what Apion wrote", 37, { size: 32 })}
      {kn(P, 37, "A NERVE. NOT A VEIN.", 38, 170, 90)}
      {pl(P, 38, "NO EGYPTIAN TEXT FOUND THAT SAYS THIS", 39, { size: 32, color: teal })}
    </>
  ),
  top: <Src text="Gellius, Attic Nights X.10" a={P(28)} b={P(39)} />,
}));

/* ============ ch04 nervio -> vena -> "vena amoris" (39-47) ============ */
const TLBG = (y: number, a: number, b: number) => (
  <Ov x={960} y={y} a={a} b={b} lim={1.04}>
    <rect x={-600} y={-130} width={1200} height={270} rx={26} fill={CARD} opacity={0.93} stroke={ink} strokeWidth={4} />
  </Ov>
);
const ch04 = scene(39, "ch04", (P) => ({
  shots: [sh("scroll-desk", 0, { tr: "cut" }), sh("visigoth-scriptorium-v2", P(40)), sh("lawyer-1620s", P(44), { tr: "wr" })],
  ov: (
    <>
      {pl(P, 39, "c. AD 400: Macrobius repeats the nerve", 40, { size: 34 })}
      {pl(P, 40, "7th century: Isidore of Seville", 41, { size: 34 })}
      {kn(P, 41, "THE NERVE BECAME A VEIN", 42, 170, 80)}
      {kn(P, 42, "WHERE IS THE NAME FROM?", 43, 170, 80)}
      {kn(P, 43, "VENA AMORIS", 44, 170, 140)}
      {pl(P, 44, "Henry Swinburne, English lawyer", 45, { size: 34 })}
      {TLBG(640, P(45), P(46))}
      <Tl y={640} x1={420} x2={1500} pts={[{ x: 520, l: "d. 1624", s: "Died", a: P(45) }, { x: 1400, l: "1686", s: "Printed", a: P(45, 1.2) }]} e={P(46)} />
      <Kin x={420} y={130} text="NOT AN OLD" a={P(46)} b={P(47)} size={84} />
      <Kin key="n2" x={420} y={250} text="ROMAN PHRASE" a={P(46, 0.3)} b={P(47)} size={84} />
      <Sm a={P(45)} b={P(46)} />
      {pl(P, 47, "MUCH YOUNGER, AS FAR AS WE FOUND", 48, { size: 34, color: teal })}
    </>
  ),
}));

/* ============ ch05 evidencia + veredicto 1 (48-59) ============ */
const ch05 = scene(48, "ch05", (P) => ({
  shots: [
    sh("heart-wax-1628-v2", 0, { tr: "cut" }),
    sh("physician-1646-falling-band-v2", P(51), { tr: "wr" }),
    sh("anatomy-class", P(54), { tr: "wl" }),
    sh("hand-on-heart", P(55), { f: [0.62, 0.45], z: 1.5, tr: "zoom", m: (S) => <Img S={S}><HeartLine a={P(55)} brk={P(56)} /></Img> }),
  ],
  ov: (
    <>
      {kn(P, 48, "NOW, THE EVIDENCE", 49, 170, 90)}
      {pl(P, 49, "1628: William Harvey describes the circulation", 50, { size: 32 })}
      {pl(P, 50, "Anyone could check where blood really goes", 51, { size: 32 })}
      {pl(P, 51, "1646: Thomas Browne, a book of popular errors", 52, { size: 32 })}
      {pl(P, 52, "He lists the old reasons, one by one", 53, { size: 34 })}
      {pl(P, 53, "Browne: inspection does not confirm a special vessel", 54, { size: 32 })}
      {pl(P, 54, "An anatomy teaching site", 55)}
      {kn(P, 55, "NO SINGLE VEIN", 56, 170, 110)}
      {vd(P, 57, "THE CUSTOM", "D")}
      {vd(P, 58, "THE BELIEF", "D")}
      {vd(P, 59, "THE VEIN OF LOVE", "M", 60)}
    </>
  ),
  top: (
    <>
      <Src text="Thomas Browne, Pseudodoxia Epidemica, 1646" a={P(51)} b={P(54)} />
      <Sm a={P(55)} b={P(60)} />
    </>
  ),
  ev: vev(P, 57, 58, 59),
}));

/* ============ ch06 caso 2: la iglesia (60-75) ============ */
const ch06 = scene(60, "ch06", (P) => ({
  shots: [
    sh("medieval-wedding-sarum-v2", 0, { tr: "cut" }),
    sh("medieval-couple-hands-v2", P(62), {
      f: [0.52, 0.55],
      z: 1.5,
      tr: "wr",
      m: (S) => (
        <Img S={S}>
          <Beat x={752} y={388} a={P(62)} b={P(66)} n="1" dx={50} dy={-50} />
          <Beat x={692} y={402} a={P(63)} b={P(66)} n="2" dx={-30} dy={-60} />
          <Beat x={668} y={432} a={P(64)} b={P(66)} n="3" dx={-80} dy={0} />
          <Beat x={715} y={508} a={P(65)} b={P(70)} n="AMEN" dx={150} dy={0} r={34} />
        </Img>
      ),
    }),
    sh("prayer-book-1662", P(70), { tr: "wl" }),
  ],
  ov: (
    <>
      {kn(P, 60, "CASE 2: THE CHURCH", 61, 170, 90)}
      {pl(P, 61, "Medieval southern England: the Sarum rite", 62, { size: 32 })}
      {pl(P, 62, "Thumb: “In the name of the Father”", 63, { size: 32, y: 830 })}
      {pl(P, 63, "Next finger: “and of the Son”", 64, { size: 32, y: 830 })}
      {pl(P, 64, "Next: “and of the Holy Ghost”", 65, { size: 32, y: 830 })}
      {pl(P, 65, "Fourth finger: “Amen”. The ring stays", 66, { size: 32, y: 830 })}
      {pl(P, 67, "The belief: a vein runs from that finger to the heart", 68, { size: 28 })}
      {kn(P, 68, "THE COUNT LEADS TO THE VEIN", 70, 170, 64)}
      {pl(P, 70, "16th century: Book of Common Prayer", 71, { size: 32 })}
      {pl(P, 71, "The fourth finger of the left hand", 72, { size: 34 })}
      {pl(P, 72, "The 1662 edition still says so", 73, { size: 34 })}
      {vd(P, 74, "THE RITUAL", "D", 75)}
      {kn(P, 75, "HOW THE RING GOT THERE, NOT WHY THAT FINGER", 76, 170, 48)}
    </>
  ),
  top: <Src text="Sarum Manual (English translation)" a={P(66)} b={P(70)} />,
  ev: vev(P, 74),
}));

/* ============ ch07 caso 3: el dedo practico (76-91) ============ */
const ch07 = scene(76, "ch07", (P) => ({
  shots: [
    sh("physician-1646-falling-band-v2", 0, { tr: "cut" }),
    sh("lab-2000-crt-v3b", P(81), { tr: "wr" }),
    sh("hand-fingers-wiggle", P(83), { tr: "wl", f: [0.5, 0.5], z: 1.1, m: (S) => <Img S={S}><Lift a={P(84)} b={P(86)} /></Img> }),
    sh("hand-left", P(86), { tr: "wr" }),
    sh("rings-both-hands", P(89)),
  ],
  ov: (
    <>
      {kn(P, 76, "CASE 3: THE PRACTICAL FINGER", 77, 170, 80)}
      {pl(P, 77, "Browne lists another reason, from Macrobius", 78, { size: 32 })}
      {pl(P, 78, "The right hand did most of the work", 79, { size: 34 })}
      {pl(P, 79, "The fourth finger: least used, guarded on both sides", 80, { size: 30 })}
      {kn(P, 80, "CAN WE TEST IT?", 81, 170, 110)}
      {pl(P, 81, "2000: how independently can each finger move?", 82, { size: 30 })}
      {kn(P, 82, "LEAST INDEPENDENT", 83, 100, 84)}
      <Pill x={1330} y={760} text="NOT THE SAME AS LEAST USED" a={P(82)} b={P(83)} size={34} color={teal} />
      {kn(P, 83, "TRY IT", 84, 170, 140)}
      {pl(P, 84, "Palm down. Lift only the ring finger", 85, { size: 36 })}
      {pl(P, 85, "It drags a neighbour along", 86)}
      <Reading x={300} y={150} a={P(86)} b={P(89)} />
      {pl(P, 87, "A finger that is hard to move is a quiet place for a ring", 88, { size: 28, y: 250 })}
      {pl(P, 88, "No ancient document says that is why", 89, { size: 34 })}
      {vd(P, 90, "THE PRACTICAL REASON", "P", 92)}
      {pl(P, 91, "IT FITS. IT IS NOT PROVEN.", 92, { y: 760, color: teal })}
    </>
  ),
  top: <Src text="Hager-Ross & Schieber, J Neurosci, 2000" a={P(81)} b={P(83)} />,
  ev: vev(P, 90),
}));

/* ============ ch08 caso 4: segun el pais (92-103) ============ */
const ch08 = scene(92, "ch08", (P) => ({
  shots: [
    sh("rings-both-hands", 0, { tr: "cut" }),
    sh("orthodox-wedding", P(95), { tr: "wr" }),
    sh("rings-both-hands", P(96), { tr: "wl", f: [0.5, 0.5] }),
    sh("jewish-wedding-chuppah-v3", P(97), { tr: "wr", f: [0.55, 0.5], z: 1.1 }),
    sh("physician-1646-falling-band-v2", P(98), { tr: "page", f: [0.5, 0.4], z: 1.1 }),
    sh("rings-both-hands", P(99), { tr: "wl", f: [0.3, 0.5] }),
  ],
  ov: (
    <>
      <MapLayer a={P(94)} b={P(95)} on={{ Russia: P(94, 0.2), Poland: P(94, 0.9), Bulgaria: P(94, 1.6) }} />
      <MapLayer a={P(96)} b={P(97)} on={{ Netherlands: P(96, 0.4) }} col={{ Netherlands: teal }} />
      {kn(P, 92, "CASE 4: THE SAME EVERYWHERE?", 93, 170, 70)}
      {kn(P, 93, "NO", 94, 170, 200)}
      {pl(P, 94, "RIGHT HAND: RUSSIA, POLAND, BULGARIA", 95, { size: 34 })}
      {pl(P, 95, "Eastern Orthodox weddings: also the right", 96, { size: 34 })}
      {pl(P, 96, "Netherlands: Catholics left, Protestants right", 97, { size: 32 })}
      {pl(P, 97, "Traditional Jewish ceremony: the bride's right index finger", 98, { size: 28 })}
      {pl(P, 98, "Browne: ancient Gauls and Britons, the middle finger", 99, { size: 28 })}
      <Reading x={300} y={150} a={P(99)} b={P(102)} />
      {pl(P, 99, "Other fingers did fine without the vein", 100, { y: 250, size: 32 })}
      {kn(P, 100, "A BODY DOES NOT CHANGE AT THE BORDER", 101, 262, 60)}
      {kn(P, 101, "A CUSTOM DOES", 102, 170, 110)}
      {vd(P, 103, "THE ONE NATURAL FINGER", "M", 104)}
    </>
  ),
  top: (
    <>
      <Sm a={P(94)} b={P(95)} />
      <Sm a={P(96)} b={P(97)} />
      <Note text="Examples, not a full list" a={P(94)} b={P(95)} />
      <Note text="Examples, not a full list" a={P(96)} b={P(97)} />
    </>
  ),
  ev: vev(P, 103),
}));

/* ============ ch09 caso 5: el nombre del dedo (104-126) ============ */
const ch09 = scene(104, "ch09", (P) => ({
  shots: [
    sh("apothecary-7th-century-v3", 0, { tr: "cut", f: [0.62, 0.62], z: 1.05 }),
    sh("hand-ring-name", P(107), { tr: "wr" }),
    sh("visigoth-scriptorium-v2", P(110), { tr: "wl" }),
    sh("apothecary-7th-century-v3", P(111), { tr: "wr", f: [0.62, 0.65], z: 1.2 }),
    sh("roman-study", P(113), { tr: "wl" }),
    sh("scroll-desk", P(117), { tr: "wr" }),
    sh("hand-ring-name", P(120), { tr: "wl", f: [0.55, 0.5] }),
    sh("em025-stamp-desk", P(124), { tr: "zoom" }),
  ],
  ov: (
    <>
      {kn(P, 104, "CASE 5: THE NAME OF THE FINGER", 105, 170, 70)}
      {pl(P, 106, "THIS ONE IS ABOUT MEDICINE", 107, { size: 34 })}
      <Ov x={560} y={330} a={P(108)} b={P(109)} lim={1.06}>
        <rect x={-300} y={-52} width={600} height={104} rx={26} fill={CARD} stroke={teal} strokeWidth={6} />
        <Txt x={0} y={4} size={52}>
          Digitus medicinalis
        </Txt>
      </Ov>
      {kn(P, 108, "THE MEDICINE FINGER", 109, 560, 90)}
      {kn(P, 109, "WHY?", 110, 170, 200)}
      {pl(P, 110, "Isidore, 7th century: doctors collected medicinal powders", 111, { size: 28 })}
      {pl(P, 111, "One translation: applying ointments", 112, { size: 34 })}
      {pl(P, 112, "We only read Isidore through later writers", 113, { size: 32 })}
      {pl(P, 113, "Another answer: the vein itself", 114, { size: 34 })}
      {pl(P, 114, "Macrobius: a banquet, a doctor, the vein", 116, { size: 34 })}
      {pl(P, 116, "The text itself doubts: an idle tale?", 117, { size: 34 })}
      {pl(P, 117, "A third idea: Magyar, 1990", 118, { size: 36 })}
      {pl(P, 118, "A sign of an old belief that it was magical", 119, { size: 32 })}
      {pl(P, 119, "WE COULD NOT OPEN THE ORIGINAL", 120, { color: teal })}
      <Ov x={560} y={330} a={P(121)} b={P(123)} lim={1.06}>
        <rect x={-240} y={-52} width={480} height={104} rx={26} fill={CARD} stroke={teal} strokeWidth={6} />
        <Txt x={0} y={4} size={52}>
          anularis
        </Txt>
      </Ov>
      {kn(P, 121, "THE RING FINGER", 122, 560, 90)}
      {pl(P, 122, "Isidore: so called because we wear a ring on it", 123, { size: 30 })}
      <Reading x={300} y={150} a={P(123)} b={P(124)} />
      {pl(P, 123, "The name may follow the custom, not cause it", 124, { y: 250, size: 32 })}
      {vd(P, 125, "THE NAMES", "D", 126, 560)}
      {vd(P, 126, "THE REASONS", "P", 127, 1360)}
    </>
  ),
  top: (
    <>
      <Src text="Isidore, via later writers" a={P(110)} b={P(111)} />
      <Src text="Magyar 1990, via Wikipedia (Ring finger)" a={P(117)} b={P(120)} />
    </>
  ),
  ev: vev(P, 125, 126),
}));

/* ============ ch10 recuento (127-137) ============ */
const ROWS: [number, string, ("D" | "P" | "M")[]][] = [
  [128, "Romans: rings on that finger", ["D"]],
  [129, "Sarum rite: the vein in the service", ["D"]],
  [130, "English prayer book: the finger", ["D"]],
  [131, "The finger's old names; why?", ["D", "P"]],
  [132, "The vein itself", ["M"]],
  [133, "The one natural finger", ["M"]],
  [134, "The practical reason", ["P"]],
];
const ch10 = scene(127, "ch10", (P) => ({
  shots: [sh("em025-stamp-desk", 0, { tr: "cut" })],
  ov: (
    <>
      {kn(P, 127, "SO WHAT DO WE REALLY KNOW?", 128, 110, 70)}
      <Sm a={P(127)} b={P(138)} />
      {ROWS.map(([p, label, ks], i) => (
        <React.Fragment key={p}>
          <Ov x={520} y={250 + i * 90} a={P(p)} b={P(138)} lim={1.05}>
            <rect x={-390} y={-38} width={780} height={76} rx={20} fill={CARD} stroke={ink} strokeWidth={4} />
            <Txt x={0} y={2} size={34}>
              {label}
            </Txt>
          </Ov>
          {ks.map((k, j) => (
            <Stp key={j} x={1180 + j * 320} y={250 + i * 90} k={k} a={P(p, 0.3 + j * 0.3)} b={P(138)} size={28} rot={-3 + j * 3} />
          ))}
        </React.Fragment>
      ))}
      {kn(P, 135, "WHO PICKED IT FIRST?", 136, 110, 80)}
      {pl(P, 136, "A reference work: origin not definitively known", 137, { y: 150, size: 32 })}
      {kn(P, 137, "THE QUESTION STAYS OPEN", 138, 110, 80)}
    </>
  ),
  ev: ROWS.flatMap(([p, , ks]) => ks.map((_, j) => thud(P(p, 0.3 + j * 0.3)))),
}));

/** Tarjeta final de 6 s sobre papel, tras el ultimo subtitulo. */
const EndCard: React.FC<{ a: number }> = ({ a }) => {
  const o = ramp(useT(), a, a + 0.3);
  const tx = { textAnchor: "middle" as const, fontFamily: theme.font, fontWeight: 900 };
  return o > 0 ? (
    <g opacity={o}>
      <rect width={1920} height={1080} fill={CARD} />
      <text x={960} y={430} fontSize={88} fill={ink} {...tx}>WHY IS THE WEDDING RING</text>
      <text x={960} y={540} fontSize={88} fill={ink} {...tx}>ON THAT FINGER?</text>
      <rect x={860} y={600} width={200} height={8} fill={orange} />
      <text x={960} y={690} fontSize={44} fill={teal} {...tx}>THE EVERYDAY MYSTERY</text>
    </g>
  ) : null;
};

/* ============ ch11 cierre (138-146) ============ */
const ch11 = scene(138, "ch11", (P) => ({
  shots: [
    sh("wedding-couple-hands", 0, { tr: "cut" }),
    sh("rings-tray", P(140), { tr: "wr" }),
    sh("hand-left", P(142), { tr: "wl" }),
    sh("wedding-couple-hands", P(144), { tr: "wr", f: [0.55, 0.55], z: 1.2 }),
    sh("em003-scan", P(145), { tr: "zoom", asp: 1 }),
  ],
  ov: (
    <>
      <Reading x={300} y={150} a={P(138)} b={P(140)} />
      {pl(P, 138, "Two old habits met on one finger", 139, { y: 250, size: 34 })}
      {pl(P, 139, "A ring on that finger. A ring for marriage.", 140, { size: 34 })}
      {["A NERVE", "A VEIN", "A TRINITY COUNT", "A PRAYER BOOK", "A NAME"].map((l, i) => (
        <Pill key={l} x={960} y={150 + i * 78} text={l} a={P(140, 0.2 + i * 0.5)} b={P(142)} size={36} color={i % 2 ? teal : orange} />
      ))}
      {kn(P, 142, "THE FINGER NEVER MOVED", 143, 170, 90)}
      {kn(P, 143, "A CUSTOM CAN OUTLIVE EVERY REASON", 144, 170, 62)}
      {pl(P, 144, "A RING IS A PROMISE YOU CAN SEE", 145, { size: 40 })}
      {pl(P, 145, "Look at almost anything you buy", 146, { size: 38 })}
      {kn(P, 146, "WHY THE BLACK STRIPES?", 147, 170, 90)}
    </>
  ),
  top: <EndCard a={P(147, -6)} />,
}));

export const SCENES026: Record<string, React.FC<SceneProps>> = { ch01, ch02, ch03, ch04, ch05, ch06, ch07, ch08, ch09, ch10, ch11 };
