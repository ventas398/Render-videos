import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { ramp } from "../utils/anim";
import { ink, orange, RED, SvgFrame, teal, useT } from "./kit";
import { theme } from "../themes/brand";
import type { SceneProps } from "./scenes";
import { cl, Kin, Ov, pk, Pill, Reading, Sfx, Src, ticks } from "./scenes023";
import type { Ev } from "./scenes023";
import { Lab } from "./scenes025";

/* ============ EM-021 v3: fotos a sangre + parallax 2.5D lento + fundidos suaves (sin Pip, sin diagramas vectoriales sobre foto) ============ */
type Sh = { id: string; t: number; f?: [number, number]; to?: [number, number]; z?: [number, number]; mask?: string; blur?: number[][] };
const FADE = 1.1;
const CARD = "#FFFDF6";
/** Primer plano (abajo) que se separa del fondo: mascara vertical con el horizonte en h (fraccion de la altura de la foto). */
const V = (h: number) => `linear-gradient(to bottom, transparent ${(h - 0.16) * 100}%, #000 ${(h + 0.12) * 100}%)`;
const BLOB = (x: number, y: number, rx: number, ry: number) => `radial-gradient(ellipse ${rx * 100}% ${ry * 100}% at ${x * 100}% ${y * 100}%, #000 45%, transparent 100%)`;

/** Cada foto cruza a la siguiente en FADE s; zoom y deriva lentos; el primer plano (mask) crece algo mas que el fondo = paralaje. */
const Photos: React.FC<{ list: Sh[]; dur: number }> = ({ list, dur }) => {
  const t = useT();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {list.map((s, i) => {
        const nx = list[i + 1];
        const end = nx ? nx.t + FADE : dur + 1;
        if (t < s.t - 0.05 || t > end) return null;
        const u = cl((t - s.t) / ((nx ? nx.t + FADE : dur) - s.t));
        const [z0, z1] = s.z ?? [1.03, 1.12];
        const f0 = s.f ?? [0.5, 0.5];
        const f1 = s.to ?? f0;
        const fx = f0[0] + (f1[0] - f0[0]) * u;
        const fy = f0[1] + (f1[1] - f0[1]) * u;
        const box = (k: number): React.CSSProperties => {
          const w = 1920 * (z0 + (z1 - z0) * u) * k;
          const h = 1080 * (z0 + (z1 - z0) * u) * k;
          return { position: "absolute", width: w, height: h, left: Math.min(0, Math.max(1920 - w, 960 - fx * w)), top: Math.min(0, Math.max(1080 - h, 540 - fy * h)) };
        };
        const img = <Img src={staticFile(`illustrations/${s.id}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />;
        return (
          <div key={i} style={{ position: "absolute", inset: 0, opacity: i === 0 ? 1 : ramp(t, s.t, s.t + FADE) }}>
            <div style={box(1)}>
              {img}
              {s.blur?.map(([x, y, w, h], j) => (
                <div key={j} style={{ position: "absolute", left: `${x * 100}%`, top: `${y * 100}%`, width: `${w * 100}%`, height: `${h * 100}%`, backdropFilter: "blur(7px)" }} />
              ))}
            </div>
            {s.mask && (
              <div style={{ ...box(1 + 0.03 * u), WebkitMaskImage: s.mask, maskImage: s.mask }}>{img}</div>
            )}
          </div>
        );
      })}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 58%, rgba(8,14,32,0.38) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Destello suave (nunca estroboscopico): pulsos blancos de poca intensidad en los instantes at (s). */
const Flash: React.FC<{ at: number[] }> = ({ at }) => {
  const t = useT();
  const o = Math.max(0, ...at.map((a) => ramp(t, a - 0.05, a) * (1 - ramp(t, a, a + 0.7))));
  return o > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: 0.3 * o }} /> : null;
};

const Wrap: React.FC<{ shots: Sh[]; dur: number; ev?: Ev[]; flash?: number[]; children: React.ReactNode }> = ({ shots, dur, ev = [], flash, children }) => (
  <>
    <Photos list={shots} dur={dur} />
    {flash && <Flash at={flash} />}
    <SvgFrame>
      {children}
      <Lab a={0} b={1e6} />
    </SvgFrame>
    <Sfx ev={ev} />
  </>
);

/* ============ graficos de datos (con su propio rotulo) ============ */
const T: React.FC<{ x: number; y: number; size: number; fill?: string; anchor?: "start" | "middle" | "end"; w?: number; o?: number; children: React.ReactNode }> = ({ x, y, size, fill = ink, anchor = "start", w = 800, o = 1, children }) => (
  <text x={x} y={y} textAnchor={anchor} dominantBaseline="central" fontFamily={theme.font} fontWeight={w} fontSize={size} fill={fill} opacity={o}>
    {children}
  </text>
);
const SIMPL = "Simplified illustration";

/** Luz frente a sonido, a escala: la barra del sonido seria una millonesima de la de la luz. */
const RaceCard: React.FC<{ a: number }> = ({ a }) => {
  const u = ramp(useT(), a + 0.4, a + 1.8);
  return (
    <>
      <rect x={-600} y={-165} width={1200} height={340} rx={26} fill={CARD} stroke={ink} strokeWidth={6} />
      <T x={-560} y={-110} size={34} fill={orange}>
        LIGHT
      </T>
      <T x={560} y={-110} size={34} fill={orange} anchor="end">
        300,000 KM/S
      </T>
      <rect x={-560} y={-72} width={1120} height={30} rx={15} fill={ink} opacity={0.08} />
      <rect x={-560} y={-72} width={Math.max(1, 1120 * u)} height={30} rx={15} fill={orange} />
      <T x={-560} y={0} size={34} fill={teal}>
        SOUND
      </T>
      <T x={560} y={0} size={34} fill={teal} anchor="end">
        0.3 KM/S
      </T>
      <rect x={-560} y={38} width={1120} height={30} rx={15} fill={ink} opacity={0.08} />
      <rect x={-560} y={38} width={6} height={30} rx={3} fill={teal} />
      <T x={-560} y={122} size={24} w={600} fill={ink} o={0.75}>
        Not to scale. Real sound bar: a millionth as long (our arithmetic)
      </T>
      <T x={560} y={150} size={26} w={600} fill={ink} anchor="end" o={0.6}>
        {SIMPL}
      </T>
    </>
  );
};

/** Traza de presion simplificada: pulsos que decaen en las posiciones hits (px). */
const trace = (len: number, hits: number[], amp: number, prog: number) => {
  const pts: string[] = [];
  for (let x = 0; x <= len * prog; x += 3) {
    let v = 0;
    for (const h of hits) {
      const d = x - h;
      if (d >= -6) v += Math.exp(-Math.max(d, 0) / 55) * Math.sin(d * 0.8) * (d < 0 ? 0.3 : 1);
    }
    pts.push(`${pts.length ? "L" : "M"}${-len / 2 + x} ${Math.max(-1, Math.min(1, v / 2.4)) * amp}`);
  }
  return pts.join(" ");
};
const clap = [60];
const rumble = Array.from({ length: 14 }, (_, i) => 60 + i * 34 + ((i * 13) % 17));
const longer = Array.from({ length: 34 }, (_, i) => 40 + i * 20 + ((i * 19) % 13));
const WaveCard: React.FC<{ x: number; y: number; a: number; b?: number; hits: number[]; label: string; color?: string; len?: number }> = ({ x, y, a, b, hits, label, color = orange, len = 620 }) => {
  const t = useT();
  return (
    <Ov x={x} y={y} a={a} b={b}>
      <rect x={-380} y={-115} width={760} height={230} rx={22} fill={CARD} stroke={ink} strokeWidth={6} />
      <T x={-345} y={-80} size={30} fill={color}>
        {label}
      </T>
      <line x1={-len / 2} y1={10} x2={len / 2} y2={10} stroke={ink} strokeWidth={2} opacity={0.3} />
      <g transform="translate(0 10)">
        <path d={trace(len, hits, 62, cl((t - a - 0.4) / (len / 260)))} fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round" />
      </g>
      <T x={345} y={92} size={26} w={600} anchor="end" o={0.6}>
        {SIMPL}
      </T>
    </Ov>
  );
};

/* ============ hook (partes 0-2) ============ */
const SceneHook: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const P = pk(c, 0);
  const shots: Sh[] = [
    { id: "em021-pond-storm", t: 0, f: [0.5, 0.5], z: [1.02, 1.12], mask: V(0.58) },
    { id: "em021-bolt-hills", t: P(1), f: [0.62, 0.4], to: [0.7, 0.4], z: [1.05, 1.2], mask: V(0.62) },
    { id: "em021-window-flash", t: P(2), f: [0.6, 0.5], z: [1.0, 1.12], mask: BLOB(0.25, 0.85, 0.5, 0.7) },
  ];
  const ev: Ev[] = [...ticks(P(0, 2.1), P(0, 4.3), 0.4, 0.22), [P(1, 1.2), "swell", 0.5]];
  return (
    <Wrap shots={shots} dur={dur} ev={ev} flash={[P(0, 0.6), P(2, 0.1)]}>
      <Kin x={640} y={250} text="1" size={280} fill={orange} a={P(0, 3.0)} b={P(0, 3.5)} />
      <Kin x={640} y={250} text="5" size={280} fill={orange} a={P(0, 3.5)} b={P(0, 3.9)} />
      <Kin x={640} y={250} text="10" size={280} fill={orange} a={P(0, 3.9)} b={P(1, 0.2)} />
      <Kin x={1380} y={230} text="THEN... THUNDER" size={110} a={P(1, 1.2)} b={P(2)} />
      <Kin x={1400} y={230} text="WHY?" size={240} fill={orange} rot={4} a={P(2, 1.4)} />
    </Wrap>
  );
};

/* ============ cause (partes 3-5) ============ */
const SceneCause: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const P = pk(c, 3);
  const shots: Sh[] = [
    { id: "em021-bolt-longexp", t: 0, f: [0.6, 0.4], z: [1.02, 1.1], mask: V(0.58) },
    { id: "em021-bolt-longexp", t: P(4), f: [0.58, 0.3], to: [0.6, 0.34], z: [1.3, 1.45], mask: V(0.62) },
    { id: "em021-storm-offcenter", t: P(5), f: [0.55, 0.55], z: [1.0, 1.12], mask: V(0.68) },
  ];
  return (
    <Wrap shots={shots} dur={dur} flash={[P(3, 4.6)]}>
      <Pill x={700} y={110} text="WHERE DOES THUNDER COME FROM?" a={P(3, 0.3)} b={P(3, 4.4)} color={teal} />
      <Kin x={620} y={300} text="LIGHTNING PASSES" size={90} a={P(3, 4.0)} b={P(4)} />
      <Kin x={620} y={400} text="THROUGH THE AIR" size={90} fill={orange} a={P(3, 4.5)} b={P(4)} />
      <Kin x={620} y={230} text="THE AIR HEATS FAST" size={90} fill={orange} a={P(4, 0.3)} b={P(5)} />
      <Kin x={620} y={340} text="...AND EXPANDS" size={90} a={P(4, 1.9)} b={P(5)} />
      <Kin x={980} y={250} text="SHOCKWAVE" size={160} fill={orange} a={P(5, 0.7)} />
      <Pill x={980} y={420} text="THUNDER = THE SOUND OF IT" a={P(5, 2.6)} color={teal} />
      <Src text="National Weather Service" a={P(3, 0.3)} b={P(5)} />
      <Src text="Environment and Climate Change Canada" a={P(5, 0.3)} b={dur + 1} />
    </Wrap>
  );
};

/* ============ race (partes 6-9) ============ */
const SceneRace: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const P = pk(c, 6);
  const shots: Sh[] = [
    { id: "em021-country-milepost", t: 0, f: [0.5, 0.55], z: [1.0, 1.12], mask: V(0.5) },
    { id: "em021-rolling-storm", t: P(7), f: [0.5, 0.42], z: [1.0, 1.1], mask: V(0.62) },
    { id: "em021-cupped-ear", t: P(8), f: [0.47, 0.45], z: [1.03, 1.2], mask: BLOB(0.47, 0.6, 0.3, 0.6) },
    { id: "em021-stopwatch", t: P(9), f: [0.58, 0.5], z: [1.0, 1.15], mask: BLOB(0.5, 0.55, 0.45, 0.6) },
  ];
  return (
    <Wrap shots={shots} dur={dur}>
      <Pill x={960} y={120} text="ROUGHLY THE SAME TIME" a={P(6, 0.4)} b={P(6, 4.2)} color={teal} />
      <Kin x={1300} y={230} text="A RACE" size={220} fill={orange} a={P(6, 4.6)} b={P(7)} />
      <Kin x={1300} y={420} text="NOT CLOSE" size={130} a={P(6, 6.0)} b={P(7)} />
      <Ov x={960} y={290} a={P(7, 0.8)} b={P(8)}>
        <RaceCard a={P(7, 0.8)} />
      </Ov>
      <Pill x={470} y={130} text="OUR ARITHMETIC" a={P(8, 0.3)} b={P(9)} color={teal} />
      <Kin x={1360} y={175} text="~1,000,000x" size={170} fill={orange} a={P(8, 1.0)} b={P(9)} />
      <Kin x={1500} y={440} text="FASTER" size={120} a={P(8, 2.4)} b={P(9)} />
      <Kin x={1500} y={330} text="5" size={340} fill={orange} a={P(9, 1.1)} />
      <Kin x={1500} y={540} text="SECONDS" size={92} a={P(9, 1.5)} />
      <Kin x={1500} y={640} text="PER MILE" size={92} a={P(9, 2.0)} />
      <Src text="UCAR Center for Science Education" a={P(6, 0.3)} b={P(7)} />
      <Src text="Environment and Climate Change Canada" a={P(7, 0.3)} b={P(8)} />
      <Src text="National Weather Service" a={P(9, 0.3)} b={dur + 1} />
    </Wrap>
  );
};

/* ============ count (partes 10-14) ============ */
const SceneCount: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const P = pk(c, 10);
  const shots: Sh[] = [
    { id: "em021-tape-meadow", t: 0, f: [0.6, 0.62], z: [1.0, 1.14], mask: V(0.42) },
    { id: "em021-stopwatch", t: P(11), f: [0.64, 0.56], z: [1.35, 1.5], mask: BLOB(0.5, 0.55, 0.45, 0.6) },
    { id: "em021-thermometers", t: P(14), f: [0.5, 0.5], z: [1.0, 1.1], blur: [[0.314, 0.35, 0.02, 0.35], [0.346, 0.35, 0.02, 0.35], [0.629, 0.35, 0.027, 0.35], [0.665, 0.35, 0.021, 0.35]] },
  ];
  const ev: Ev[] = ticks(P(11, 0.5), P(11, 3.2), 0.5, 0.22);
  return (
    <Wrap shots={shots} dur={dur} ev={ev}>
      <Pill x={560} y={120} text="OUR COMPARISON" a={P(10, 0.3)} b={P(11)} color={teal} />
      <Kin x={960} y={250} text="THE DELAY IS A TAPE MEASURE" size={96} a={P(10, 1.0)} b={P(11)} />
      <Pill x={960} y={860} text="COUNT FROM FLASH TO THUNDER" a={P(10, 3.4)} b={P(11)} />
      <Kin x={1400} y={290} text="SECONDS ÷ 5" size={130} a={P(11, 0.6)} b={P(12)} />
      <Kin x={1400} y={450} text="= MILES" size={150} fill={orange} a={P(11, 1.6)} b={P(12)} />
      <Kin x={1400} y={290} text="SECONDS ÷ 3" size={130} a={P(12, 0.6)} b={P(13)} />
      <Kin x={1400} y={450} text="= KILOMETERS" size={130} fill={orange} a={P(12, 1.6)} b={P(13)} />
      <Pill x={1400} y={130} text="OUR ARITHMETIC" a={P(13, 0.2)} b={P(14)} color={teal} />
      <Kin x={1400} y={290} text="10 SECONDS" size={110} a={P(13, 0.6)} b={P(14)} />
      <Kin x={1400} y={420} text="≈ 2 MILES" size={130} fill={orange} a={P(13, 1.8)} b={P(14)} />
      <Kin x={1400} y={560} text="≈ 3 KM" size={130} fill={teal} a={P(13, 3.0)} b={P(14)} />
      <Pill x={1300} y={130} text="HOT AIR: FASTER" a={P(14, 0.5)} b={P(14, 5.2)} color={orange} />
      <Pill x={620} y={130} text="COLD AIR: SLOWER" a={P(14, 1.6)} b={P(14, 5.2)} color={teal} />
      <Reading x={620} y={130} a={P(14, 5.0)} />
      <Kin x={960} y={690} text="AN ESTIMATE" size={120} fill={orange} a={P(14, 5.4)} />
      <Src text="National Weather Service" a={P(11, 0.3)} b={P(12)} />
      <Src text="Environment and Climate Change Canada" a={P(12, 0.3)} b={dur + 1} />
    </Wrap>
  );
};

/* ============ rumble (partes 15-20) ============ */
const SceneRumble: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const P = pk(c, 15);
  const shots: Sh[] = [
    { id: "em021-rolling-storm", t: 0, f: [0.5, 0.35], z: [1.0, 1.1], mask: V(0.62) },
    { id: "em021-bolt-hills", t: P(16), f: [0.62, 0.4], to: [0.7, 0.38], z: [1.2, 1.4], mask: V(0.65) },
    { id: "em021-clap-startled", t: P(17), f: [0.6, 0.45], z: [1.0, 1.12], mask: "linear-gradient(to right, transparent 40%, #000 66%)" },
    { id: "em021-rolling-storm", t: P(18), f: [0.3, 0.4], to: [0.45, 0.4], z: [1.12, 1.3], mask: V(0.62) },
    { id: "em021-bolt-longexp", t: P(19), f: [0.5, 0.45], z: [1.0, 1.12], mask: V(0.6) },
  ];
  return (
    <Wrap shots={shots} dur={dur} flash={[P(16, 0.3)]}>
      <Kin x={960} y={250} text="ONE BANG?" size={170} a={P(15, 0.8)} b={P(15, 2.5)} />
      <Kin x={960} y={250} text="OR A RUMBLE" size={170} fill={teal} a={P(15, 2.5)} b={P(16)} />
      <Pill x={960} y={120} text="EACH PART OF THE STRIKE" a={P(16, 0.4)} b={P(17)} color={teal} />
      <Kin x={1000} y={260} text="A DIFFERENT TIME" size={120} fill={orange} a={P(16, 2.0)} b={P(17)} />
      <Pill x={560} y={120} text="ACROSS YOUR LINE OF SIGHT" a={P(17, 0.3)} b={P(18)} color={teal} />
      <Kin x={560} y={300} text="CLAP" size={190} fill={orange} a={P(17, 1.6)} b={P(18)} />
      <WaveCard x={520} y={660} a={P(17, 1.4)} b={P(18)} hits={clap} label="CLAP" />
      <Pill x={560} y={120} text="ALONG YOUR LINE OF SIGHT" a={P(18, 0.3)} b={P(19)} color={teal} />
      <Kin x={560} y={300} text="RUMBLE" size={190} fill={teal} a={P(18, 1.5)} b={P(19)} />
      <WaveCard x={1400} y={660} a={P(18, 1.2)} b={P(19)} hits={rumble} label="RUMBLE" color={teal} />
      <Kin x={640} y={230} text="MORE THAN" size={80} a={P(19, 1.4)} b={P(20, 5.5)} />
      <Kin x={640} y={350} text="30 SECONDS" size={170} fill={orange} a={P(19, 1.8)} b={P(20, 5.5)} />
      <WaveCard x={1400} y={660} a={P(19, 2.0)} b={P(20, 5.5)} hits={longer} label="A LONG RUMBLE" color={teal} />
      <Reading x={560} y={560} a={P(20, 0.3)} b={P(20, 5.5)} />
      <Kin x={580} y={700} text="SPREAD OUT IN TIME" size={76} a={P(20, 2.0)} b={P(20, 5.5)} />
      <Src text="Environment and Climate Change Canada" a={P(16, 0.3)} b={P(19)} />
      <Src text="Wikipedia" a={P(19, 0.3)} b={dur + 1} />
    </Wrap>
  );
};

/* ============ warning (partes 21-25) ============ */
const SceneWarning: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const P = pk(c, 21);
  const shots: Sh[] = [
    { id: "em021-village-circle", t: 0, f: [0.5, 0.6], z: [1.0, 1.15], mask: V(0.5) },
    { id: "em021-heat-lightning", t: P(22), f: [0.65, 0.5], to: [0.72, 0.45], z: [1.0, 1.14], mask: V(0.55) },
    { id: "em021-storm-offcenter", t: P(23), f: [0.55, 0.5], z: [1.0, 1.15], mask: V(0.66) },
    { id: "em021-indoors-window", t: P(24), f: [0.55, 0.55], z: [1.0, 1.12], mask: BLOB(0.6, 0.7, 0.45, 0.5) },
    { id: "em021-tape-meadow", t: P(25), f: [0.35, 0.7], z: [1.05, 1.2], mask: V(0.42) },
  ];
  return (
    <Wrap shots={shots} dur={dur} flash={[P(22, 3.4)]}>
      <Pill x={960} y={120} text="HOW FAR CAN YOU HEAR IT?" a={P(21, 0.3)} b={P(22)} color={teal} />
      <Kin x={960} y={260} text="ABOUT 10 MILES" size={170} fill={orange} a={P(21, 3.4)} b={P(22)} />
      <Kin x={960} y={220} text="HEAT LIGHTNING" size={140} fill={orange} a={P(22, 0.6)} b={P(23)} />
      <Pill x={960} y={380} text="CLOUD-TO-CLOUD, BEYOND THE HORIZON" size={36} a={P(22, 2.8)} b={P(23)} color={teal} />
      <Kin x={960} y={520} text="TOO FAR TO HEAR" size={110} a={P(22, 6.0)} b={P(23)} />
      <Kin x={620} y={200} text="MORE THAN" size={80} a={P(23, 0.8)} b={P(24)} />
      <Kin x={620} y={320} text="3 MILES" size={190} fill={orange} a={P(23, 1.2)} b={P(24)} />
      <Pill x={620} y={470} text="FROM THE STORM'S CENTER" a={P(23, 2.6)} b={P(24)} color={teal} />
      <Pill x={560} y={120} text="THE RULE" a={P(24, 0.2)} b={P(25)} color={teal} />
      <Kin x={560} y={250} text="WHEN THUNDER ROARS," size={80} a={P(24, 0.8)} b={P(25)} />
      <Kin x={480} y={390} text="GO INDOORS" size={140} fill={orange} a={P(24, 1.8)} b={P(25)} />
      <Kin x={480} y={540} text="30 MINUTES" size={120} fill={teal} a={P(24, 3.6)} b={P(25)} />
      <Reading x={960} y={120} a={P(25, 0.3)} />
      <Kin x={960} y={260} text="A WARNING" size={190} fill={orange} a={P(25, 1.4)} />
      <Kin x={960} y={420} text="WITH A RULER BUILT IN" size={96} a={P(25, 2.8)} />
      <Src text="National Weather Service" a={P(21, 0.3)} b={P(22)} />
      <Src text="UCAR Center for Science Education" a={P(22, 0.3)} b={P(23)} />
      <Src text="National Weather Service (Lightning Myths)" a={P(23, 0.3)} b={P(24)} />
      <Src text="National Weather Service (NOAA JetStream)" a={P(24, 0.3)} b={P(25)} />
    </Wrap>
  );
};

/* ============ close (partes 26-28) ============ */
const SceneClose: React.FC<SceneProps> = ({ cues: c, dur }) => {
  const P = pk(c, 26);
  const shots: Sh[] = [
    { id: "em021-window-flash", t: 0, f: [0.6, 0.5], z: [1.0, 1.1], mask: BLOB(0.25, 0.85, 0.5, 0.7) },
    { id: "em022-fold-hook", t: P(27), f: [0.5, 0.5], z: [1.0, 1.12] },
  ];
  const ev: Ev[] = ticks(P(26, 1.0), P(26, 3.0), 0.5, 0.22);
  return (
    <Wrap shots={shots} dur={dur} ev={ev} flash={[P(26, 0.6)]}>
      {[1, 2, 3, 4].map((n, i) => (
        <Kin key={n} x={1400} y={260} text={String(n)} size={280} fill={orange} a={P(26, 0.9 + i * 0.5)} b={P(26, 1.4 + i * 0.5)} />
      ))}
      <Kin x={1400} y={430} text="COUNT THE SECONDS" size={80} a={P(26, 1.0)} b={P(27)} />
      <Kin x={960} y={200} text="NOT EVERY CLUE HIDES IN THE SKY" size={74} a={P(27, 0.2)} b={P(28)} />
      <Kin x={960} y={330} text="SOME SIT ON YOUR DESK" size={74} fill={orange} a={P(27, 2.0)} b={P(28)} />
      <Kin x={620} y={260} text="A4" size={300} fill={orange} a={P(28, 0.3)} />
      <Kin x={1300} y={690} text="WHY?" size={280} fill={RED} rot={4} a={P(28, 3.1)} />
    </Wrap>
  );
};

export const SCENES021V3: Record<string, React.FC<SceneProps>> = {
  hook: SceneHook,
  cause: SceneCause,
  race: SceneRace,
  count: SceneCount,
  rumble: SceneRumble,
  warning: SceneWarning,
  close: SceneClose,
};
