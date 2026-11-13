// EM-053 medio "El poder de la musica". kit2 (mkScene). Musica: docs/EM-053-MUSICA.md (A sintetizada + M10 caja de musica PD).
// v3 (09/11, direccion de Javier): nada de laminas sobre papel crema. Todos los planos llevan imagen a sangre: fotos IA ya usadas
// o cuadros de dominio publico (public/images/em053-art-*.jpg, credito en pantalla); los graficos van en paneles oscuros sobre la imagen oscurecida.
// Chip "NOW PLAYING" con pieza/emocion/BPM; tarjeta grande en los tramos de musica sola (narrador callado).
import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../themes/brand";
import { ramp } from "../utils/anim";
import { G, ink, orange, RED, teal, Txt as Txt0, useT } from "./kit";
import { DrawOn } from "./kit2";
import type { SceneProps } from "./scenes";
import { FULL, Kin, Num, Ov, Pill } from "./scenes023";
import type { Sh } from "./scenes023";
import { Stp } from "./scenes025";
import { Cite, mkScene } from "./v2";

const FP = "em025-fortepiano-hands";
const EAR = "em021-cupped-ear";
const SHELF = "em007-supermarket-shelf";
const HEART = "em026-hand-on-heart";
const BRAIN = "em025-journals-brain";
const PD = (f: string, w: number, h: number, cr: string) => ({ f: `em053-art-${f}.jpg`, asp: w / h, cr: `${cr} · public domain` });
const scene = mkScene("", {
  mozart: PD("mozart", 1920, 2461, "Barbara Krafft, Portrait of W. A. Mozart (1819)"),
  dance: PD("dance", 1920, 1430, "Pierre-Auguste Renoir, Bal du moulin de la Galette (1876)"),
  tandem: PD("tandem", 1920, 1671, "Ramon Casas, Casas and Pere Romeu on a Tandem (1897)"),
  cradle: PD("cradle", 1920, 2339, "Berthe Morisot, The Cradle (1872)"),
  dogs: PD("dogs", 1177, 1536, "Edwin Landseer, Dignity and Impudence (1839)"),
  cows: PD("cows", 1920, 1577, "Paulus Potter, Four Cows in a Meadow (1651)"),
}); // las fotos IA llevan "Illustrative image"; los cuadros, su credito
const ASP: Record<string, number> = { [EAR]: 1376 / 768, [HEART]: 1376 / 768, [SHELF]: 1672 / 941 };
const W = (id: string, t: number, mv: Sh["mv"], tr: Sh["tr"], f: [number, number] = [0.5, 0.5]): Sh => ({ id, t, r: FULL, f, mv, tr, ...(ASP[id] ? { asp: ASP[id] } : {}) });
const CARD = "#FFFDF6";
const DK = "#0B1020";
const TL = "#2EC4B6"; // teal claro para paneles oscuros
const Txt: typeof Txt0 = (p) => <Txt0 fill={CARD} {...p} />;
/** Plano oscurecido para poner graficos encima. */
// v4 (decision de Javier 09/11 13:53: "2, medio velo"): opacidad del velo a la mitad (0.55 -> 0.275; los 0.62 -> 0.31).
const D = (s: Sh, o = 0.275): Sh => ({ ...s, m: () => <rect x={-400} y={-400} width={6000} height={6000} fill={DK} opacity={o} /> });
/** v4: rotulo "Simplified illustration" (abajo-dcha, encima de la pastilla de fuente CiteR, y=874) mientras haya grafico. */
const Simp: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const o = vis(useT(), a, b);
  return o > 0 ? (
    <g opacity={o}>
      <rect x={1340} y={816} width={528} height={44} rx={22} fill={DK} opacity={0.85} />
      <text x={1844} y={839} textAnchor="end" dominantBaseline="central" fontFamily={theme.font} fontWeight={700} fontSize={26} fill={CARD}>
        Simplified illustration, not a simulation
      </text>
    </g>
  ) : null;
};
/** Fuente del estudio a la derecha (a la izquierda va el credito del cuadro). */
const CiteR: React.FC<{ text: string; a: number; b: number }> = ({ text, a, b }) => <Cite text={text} a={a} b={b} x={1868 - ((text.length + 8) * 13 + 56)} />;
const vis = (t: number, a: number, b: number) => ramp(t, a, a + 0.3) * (1 - ramp(t, b - 0.3, b));

/** Rotulo grande; i = 0 arriba (y0), 1 debajo (y0 + 150). Sobre la foto de la mujer, y0 = 500 para no taparle la cara. */
const K = (text: string, a: number, b: number, i = 0, y0 = 190) => (
  <Kin key={text} x={960} y={y0 + i * 150} text={text} size={Math.max(66, Math.min(150, Math.round(2250 / text.length)))} fill={i ? orange : teal} a={a} b={b} rot={i ? 3 : -3} />
);

const Eq: React.FC<{ x: number; y: number; h?: number }> = ({ x, y, h = 40 }) => {
  const t = useT();
  return (
    <>
      {[0, 1, 2, 3].map((i) => {
        const k = 0.3 + 0.7 * Math.abs(Math.sin(t * (4.3 + i * 1.9) + i * 1.3));
        return <rect key={i} x={x + i * h * 0.45} y={y - (h * k) / 2} width={h * 0.3} height={h * k} rx={h * 0.12} fill={orange} />;
      })}
    </>
  );
};

/** Chip "suena ahora": pieza · emocion · BPM (arriba-izquierda, fuera de camara). */
const Now: React.FC<{ text: string; a: number; b: number }> = ({ text, a, b }) => {
  const o = vis(useT(), a, b);
  return o > 0 ? (
    <g opacity={o}>
      <rect x={44} y={32} width={text.length * 22 + 150} height={70} rx={35} fill={CARD} stroke={teal} strokeWidth={4} />
      <Eq x={74} y={67} />
      <text x={146} y={69} dominantBaseline="central" fontFamily={theme.font} fontWeight={800} fontSize={34} fill={ink}>
        {text}
      </text>
    </g>
  ) : null;
};

/** Tarjeta de musica sola (el narrador calla). */
const Solo: React.FC<{ a: number; b: number; title: string; sub: string; note?: string; y?: number; s?: number }> = ({ a, b, title, sub, note, y = 500, s = 1 }) => (
  <Ov x={960} y={y} a={a} b={b} s={s} lim={1.04}>
    <rect x={-672} y={-192} width={1360} height={400} rx={28} fill={ink} opacity={0.18} />
    <rect x={-680} y={-200} width={1360} height={400} rx={28} fill={DK} opacity={0.92} stroke={orange} strokeWidth={8} />
    <Eq x={-300} y={-128} h={44} />
    <Txt x={0} y={-128} size={40} fill={TL} spacing={4}>
      MUSIC ONLY
    </Txt>
    <Eq x={222} y={-128} h={44} />
    <Txt x={0} y={-20} size={title.length > 16 ? 84 : 100} weight={900}>
      {title}
    </Txt>
    <Txt x={0} y={note ? 70 : 90} size={50} fill={orange}>
      {sub}
    </Txt>
    {note && (
      <Txt x={0} y={145} size={32} weight={600}>
        {note}
      </Txt>
    )}
  </Ov>
);

const Panel: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => <rect x={x} y={y} width={w} height={h} rx={18} fill={DK} opacity={0.88} stroke={CARD} strokeOpacity={0.35} strokeWidth={3} />;

/** ch02: el empujon dura 10-15 minutos. */
const Boost: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const o = vis(useT(), a, b);
  const X = (m: number) => 500 + (m / 30) * 960;
  return o > 0 ? (
    <g opacity={o}>
      <Panel x={380} y={420} w={1160} h={440} />
      <rect x={X(10)} y={470} width={X(15) - X(10)} height={310} fill={orange} opacity={0.16} />
      <DrawOn d={`M500 780 L1460 780 M500 780 L500 470`} t0={a} t1={a + 0.4} w={6} color={CARD} />
      <DrawOn d={`M500 720 C 520 720, 530 540, 560 540 L ${X(10)} 540 C ${X(12)} 540, ${X(13)} 720, ${X(15)} 720 L 1460 720`} t0={a + 0.4} t1={a + 2} w={12} color={TL} />
      <Txt x={640} y={455} size={34}>SPATIAL TEST SCORE</Txt>
      {[0, 10, 15, 30].map((m) => (
        <Txt key={m} x={X(m)} y={818} size={34}>{m === 30 ? "30 MIN" : String(m)}</Txt>
      ))}
      <Txt x={1220} y={600} size={44} fill={orange}>BACK TO NORMAL</Txt>
    </g>
  ) : null;
};

/** ch03: cerebro simplificado; caudado (antes del pico) y nucleo accumbens (en el escalofrio). */
const Brain: React.FC<{ a: number; b: number; g1: number; g2: number; burst: number }> = ({ a, b, g1, g2, burst }) => {
  const t = useT();
  const o = vis(t, a, b);
  const glow = (g: number) => ramp(t, g, g + 0.5) * (0.85 + 0.15 * Math.sin(t * 6));
  const bu = ramp(t, burst, burst + 0.7);
  return o > 0 ? (
    <g opacity={o}>
      <path d="M400 640 C 360 480, 500 400, 640 410 C 740 360, 900 380, 960 470 C 1040 520, 1030 640, 960 690 C 920 760, 800 770, 740 740 C 680 790, 560 790, 500 740 C 430 730, 390 690, 400 640 Z" fill="#F3E3DA" />
      <DrawOn d="M400 640 C 360 480, 500 400, 640 410 C 740 360, 900 380, 960 470 C 1040 520, 1030 640, 960 690 C 920 760, 800 770, 740 740 C 680 790, 560 790, 500 740 C 430 730, 390 690, 400 640 Z" t0={a} t1={a + 1.2} w={10} />
      <DrawOn d="M520 470 C 560 520, 620 500, 660 540 M760 440 C 760 500, 820 520, 860 500 M470 620 C 540 600, 560 660, 620 650 M820 620 C 860 600, 900 640, 930 610 M800 740 C 820 790, 830 820, 850 840" t0={a + 0.6} t1={a + 1.6} w={6} o={0.5} />
      {([[690, 560, g1, teal], [640, 655, g2, orange]] as [number, number, number, string][]).map(([x, y, g, c], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={20 + 40 * glow(g) + (i ? 120 * bu : 0)} fill={c} opacity={0.25 * (1 - (i ? 0.7 * bu : 0))} />
          <circle cx={x} cy={y} r={20} fill={c} opacity={0.35 + 0.65 * glow(g)} />
        </g>
      ))}
    </g>
  ) : null;
};

/** Esfera de aguja; f en 0..1. */
const Gauge: React.FC<{ x: number; y: number; r: number; f: number; band?: [number, number]; ticks?: [number, string][] }> = ({ x, y, r, f, band, ticks = [] }) => {
  const p = (q: number, rr = r) => [x + rr * Math.cos(Math.PI * (1 - q)), y - rr * Math.sin(Math.PI * (1 - q))];
  const [nx, ny] = p(f, r * 0.82);
  return (
    <>
      <path d={`M${x - r} ${y} A${r} ${r} 0 0 1 ${x + r} ${y}`} fill="none" stroke={CARD} strokeWidth={14} strokeLinecap="round" />
      {band && <path d={`M${p(band[0]).join(" ")} A${r} ${r} 0 0 1 ${p(band[1]).join(" ")}`} fill="none" stroke={orange} strokeWidth={34} />}
      {ticks.map(([q, l]) => (
        <Txt key={l} x={p(q, r + 50)[0]} y={p(q, r + 50)[1]} size={32}>{l}</Txt>
      ))}
      <line x1={x} y1={y} x2={nx} y2={ny} stroke={RED} strokeWidth={12} strokeLinecap="round" />
      <circle cx={x} cy={y} r={20} fill={CARD} />
    </>
  );
};
const Dial: React.FC<{ x: number; a: number; b: number; top: string; res: string; to: number; c: string }> = ({ x, a, b, top, res, to, c }) => {
  const t = useT();
  return (
    <Ov x={x} y={620} a={a} b={b} lim={1.04}>
      <Txt x={0} y={-190} size={46} fill={c}>{top}</Txt>
      <Gauge x={0} y={80} r={190} f={0.5 + (to - 0.5) * ramp(t, a + 0.5, a + 1.5)} ticks={[[0, "LESS"], [1, "MORE"]]} />
      <Txt x={0} y={170} size={52}>{ramp(t, a + 1.5, a + 1.8) > 0 ? res : ""}</Txt>
    </Ov>
  );
};

/** ch04: botellas vendidas (North, Hargreaves & McKendrick 1999). */
const Bars: React.FC<{ a: number; a2: number; b: number; hide: number[] }> = ({ a, a2, b, hide }) => {
  const t = useT();
  const o = hide.reduce((p, s) => p * (1 - vis(t, s, s + 3)), vis(t, a, b));
  const bar = (x: number, n: number, c: string, t0: number) => {
    const h = 6 * n * ramp(t, t0, t0 + 0.8);
    return (
      <g key={x} opacity={t >= t0 ? 1 : 0}>
        <rect x={x} y={760 - h} width={110} height={h} rx={8} fill={c} />
        <Txt x={x + 55} y={732 - h} size={44}>{String(Math.round(n * ramp(t, t0, t0 + 0.8)))}</Txt>
      </g>
    );
  };
  return o > 0 ? (
    <g opacity={o}>
      <Panel x={360} y={385} w={1200} h={480} />
      <rect x={470} y={410} width={34} height={34} rx={6} fill={TL} />
      <Txt x={620} y={428} size={34}>FRENCH WINE</Txt>
      <rect x={810} y={410} width={34} height={34} rx={6} fill={orange} />
      <Txt x={968} y={428} size={34}>GERMAN WINE</Txt>
      <Txt x={1340} y={428} size={30} weight={600}>BOTTLES SOLD</Txt>
      {bar(560, 40, TL, a + 0.3)}
      {bar(690, 12, orange, a + 0.6)}
      {bar(1100, 8, TL, a2 + 0.3)}
      {bar(1230, 22, orange, a2 + 0.6)}
      <line x1={420} y1={760} x2={1500} y2={760} stroke={CARD} strokeWidth={5} />
      <Txt x={680} y={808} size={38}>FRENCH-MUSIC DAYS</Txt>
      {t >= a2 && <Txt x={1220} y={808} size={38}>GERMAN-MUSIC DAYS</Txt>}
    </g>
  ) : null;
};

/** ch05: 16 pasos a 120 BPM (mismos patrones que GROOVE en scripts/em_audio.py). */
const GR = {
  a: { K: [0, 4, 8, 12], S: [4, 12], H: [0, 2, 4, 6, 8, 10, 12, 14], n: "TOO SIMPLE" },
  b: { K: [0, 3, 8, 10], S: [4, 7, 9, 12, 15], H: [...Array(16).keys()], n: "MEDIUM SYNCOPATION" },
  c: { K: [1, 3, 6, 9, 11, 14], S: [2, 5, 7, 10, 13, 15], H: [1, 3, 5, 6, 9, 11, 12, 15], n: "TOO COMPLEX" },
};
const Grid: React.FC<{ segs: [number, keyof typeof GR][]; a: number; b: number }> = ({ segs, a, b }) => {
  const t = useT();
  const o = vis(t, a, b);
  const [t0, k] = [...segs].reverse().find(([s]) => s <= t) ?? segs[0];
  const g = GR[k];
  const step = Math.floor(Math.max(0, t - t0) / 0.125) % 16;
  const rows: [string, number[], string][] = [["KICK", g.K, CARD], ["SNARE", g.S, orange], ["HI-HAT", g.H, TL]];
  return o > 0 ? (
    <g opacity={o}>
      <Panel x={250} y={420} w={1460} h={420} />
      <rect x={520 + step * 71 - 5} y={440} width={72} height={290} rx={10} fill={CARD} opacity={0.14} />
      {rows.map(([name, hits, c], r) => (
        <g key={name}>
          <text x={490} y={485 + r * 90} textAnchor="end" dominantBaseline="central" fontFamily={theme.font} fontWeight={800} fontSize={34} fill={CARD}>{name}</text>
          {[...Array(16).keys()].map((i) => {
            const on = hits.includes(i);
            const hit = on && i === step;
            return <rect key={i} x={520 + i * 71 - (hit ? 4 : 0)} y={452 + r * 90 - (hit ? 4 : 0)} width={62 + (hit ? 8 : 0)} height={66 + (hit ? 8 : 0)} rx={10} fill={on ? c : CARD} opacity={on ? (hit ? 1 : 0.75) : i % 4 ? 0.1 : 0.2} />;
          })}
        </g>
      ))}
      <Txt x={960} y={790} size={46} fill={k === "b" ? TL : orange}>{`${g.n} · 120 BPM`}</Txt>
    </g>
  ) : null;
};

/** ch05: U invertida (Witek et al. 2014). */
const Curve: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const t = useT();
  const o = vis(t, a, b);
  const dots: [number, number, string, string, number][] = [[624, 661, "BORING", orange, 1.6], [1296, 661, "CONFUSING", orange, 2.6], [960, 520, "SWEET SPOT", TL, 3.6]];
  return o > 0 ? (
    <g opacity={o}>
      <Panel x={380} y={420} w={1160} h={440} />
      <DrawOn d="M500 760 L1420 760 M500 760 L500 450" t0={a} t1={a + 0.4} w={6} color={CARD} />
      <DrawOn d="M540 740 Q 960 300 1380 740" t0={a + 0.3} t1={a + 1.4} w={12} color={TL} />
      <Txt x={960} y={810} size={36}>SYNCOPATION →</Txt>
      <Txt x={1330} y={470} size={34}>WANT TO MOVE ↑</Txt>
      {dots.map(([x, y, l, c, d]) => (
        <G key={l} o={ramp(t, a + d, a + d + 0.3)}>
          <circle cx={x} cy={y} r={22} fill={c} />
          <Txt x={x + (x < 900 ? -60 : x > 1000 ? 60 : 0)} y={y - 70} size={44} fill={c}>{l}</Txt>
        </G>
      ))}
    </g>
  ) : null;
};

/** ch08: ritmo cardiaco del bebe, nanas frente a otras canciones (Bainbridge et al. 2021). */
const Beats: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const o = vis(useT(), a, b);
  const line = (y0: number, y1: number) => [...Array(12).keys()].map((i) => { const x = 520 + i * 70; const y = y0 + ((y1 - y0) * i) / 11; return `${i ? "L" : "M"}${x} ${y} L${x + 20} ${y - 30} L${x + 35} ${y + 20} L${x + 45} ${y}`; }).join(" ");
  return o > 0 ? (
    <g opacity={o}>
      <Panel x={380} y={420} w={1240} h={390} />
      <Txt x={700} y={455} size={34}>BABY&apos;S HEART RATE</Txt>
      <DrawOn d={line(560, 565)} t0={a + 0.3} t1={a + 2.3} w={7} color={orange} />
      <DrawOn d={line(600, 760)} t0={a + 0.3} t1={a + 2.3} w={7} color={TL} />
      <Txt x={1400} y={492} size={38} fill={orange}>OTHER SONGS</Txt>
      <Txt x={1470} y={700} size={38} fill={TL}>LULLABIES ↓</Txt>
    </g>
  ) : null;
};

const Heart: React.FC<{ x: number; y: number; a: number; b: number }> = ({ x, y, a, b }) => {
  const s = 1 + 0.06 * Math.max(0, Math.sin(useT() * 7.5));
  return (
    <Ov x={x} y={y} a={a} b={b}>
      <G s={s * 2.2}>
        <path d="M0 40 C -70 -10, -55 -75, 0 -40 C 55 -75, 70 -10, 0 40 Z" fill={RED} />
      </G>
      <Txt x={0} y={150} size={44}>HEART RATE</Txt>
      <Txt x={0} y={205} size={52} fill={TL}>NO CHANGE</Txt>
    </Ov>
  );
};

/** ch07: aviso de salud literal (EM-053.json screenText, parte 43), fuera de camara. */
const Warn: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const o = vis(useT(), a, b);
  const L = ["Music therapy is used alongside treatment,", "not instead of it.", "If you are struggling, talk to a doctor", "or a mental health professional."];
  return o > 0 ? (
    <g opacity={o}>
      <rect x={258} y={248} width={1420} height={410} rx={26} fill={ink} opacity={0.2} />
      <rect x={250} y={240} width={1420} height={410} rx={26} fill={DK} opacity={0.94} stroke={RED} strokeWidth={8} />
      <Txt x={960} y={300} size={40} fill={RED} spacing={4}>HEALTH NOTE</Txt>
      {L.map((l, i) => (
        <Txt key={l} x={960} y={380 + i * 72 + (i > 1 ? 14 : 0)} size={58} weight={700}>{l}</Txt>
      ))}
    </g>
  ) : null;
};
const Tag: React.FC<{ text: string; a: number; b: number }> = ({ text, a, b }) => {
  const o = vis(useT(), a, b);
  const w = text.length * 20 + 60;
  return o > 0 ? (
    <g opacity={o}>
      <rect x={1876 - w} y={36} width={w} height={62} rx={31} fill={RED} />
      <text x={1876 - w / 2} y={68} textAnchor="middle" dominantBaseline="central" fontFamily={theme.font} fontWeight={800} fontSize={32} fill="#fff">{text}</text>
    </g>
  ) : null;
};

const M1 = "PIANO, MOZART-STYLE · CALM · 112 BPM";
const PH = (8 * 240) / 112; // frase de M1 (8 compases); en ch02 cambia de textura en cada frase (em_audio.py m1b)

const ch01 = scene(0, "ch01", (P) => ({
  shots: [W(FP, 0, "in", "cut"), W(EAR, P(2), "pr", "wl")],
  ov: (
    <>
      {K("MOZART MAKES BABIES SMARTER?", P(0, 0.2), P(1))}
      <Stp x={960} y={560} k="M" size={100} a={P(1, 0.05)} b={P(2)} />
      {K("THE REAL POWER IS STRANGER", P(2, 0.3), P(3), 0, 500)}
      {K("…AND IT'S WORKING ON YOU", P(2, 2.4), P(3), 1, 500)}
      {K("IN THE NEXT FEW MINUTES", P(3, 0.2), P(4), 0, 470)}
      <Pill x={620} y={640} text="CHILLS" size={60} color={teal} a={P(3, 2.0)} b={P(4)} />
      <Pill x={1300} y={640} text="SHOPPING" size={60} a={P(3, 4.0)} b={P(4)} />
      <Pill x={620} y={790} text="EXERCISE" size={60} a={P(3, 6.0)} b={P(4)} />
      <Pill x={1300} y={790} text="LULLABIES" size={60} color={teal} a={P(3, 7.8)} b={P(4)} />
      {K("ONE FAMOUS CLAIM IS FALSE", P(4, 0.2), P(5), 0, 500)}
      {K("THE REST IS STRANGER", P(4, 2.4), P(5), 1, 500)}
    </>
  ),
  src: <Now text={M1} a={0} b={P(1, 0.75)} />,
}));

const ch02 = scene(6, "ch02", (P) => ({
  shots: [W(FP, 0, "pl", "cut"), D(W("mozart", P(7) - 0.4, "in", "fade", [0.5, 0.3])), W(FP, P(12), "in", "fade")],
  ov: (
    <>
      {K("START WITH THE FAMOUS ONE", P(6, 0.2), P(7))}
      <Kin x={960} y={420} text="1993" size={200} fill={orange} a={P(7, 0.2)} b={P(8)} />
      <Pill x={620} y={640} text="~36 COLLEGE STUDENTS" size={50} color={teal} a={P(7, 1.6)} b={P(8)} />
      <Pill x={1300} y={640} text="10 MIN OF MOZART" size={50} a={P(7, 3.2)} b={P(8)} />
      <Pill x={960} y={780} text="THEN A SPATIAL TEST" size={50} color={teal} a={P(7, 5.0)} b={P(8)} />
      {K("SCORES WENT UP…", P(8, 0.2), P(9))}
      {K("…FOR 10–15 MINUTES", P(8, 1.6), P(9), 1)}
      <Boost a={P(8)} b={P(9)} />
      {K("ONE TASK. ONE SHORT WINDOW.", P(9, 0.2), P(10))}
      <Pill x={620} y={520} text="NO BABIES" size={64} a={P(9, 2.2)} b={P(10)} />
      <Pill x={1300} y={520} text="NO GENERAL IQ" size={64} a={P(9, 3.2)} b={P(10)} />
      <Num x={620} y={500} v={40} size={220} fill={teal} a={P(10, 0.6)} b={P(11)} />
      <Ov x={620} y={660} a={P(10, 0.8)} b={P(11)}><Txt x={0} y={0} size={60}>STUDIES</Txt></Ov>
      <Kin x={1260} y={500} text="3,000+" size={190} fill={orange} a={P(10, 1.8)} b={P(11)} />
      <Ov x={1260} y={660} a={P(10, 2.0)} b={P(11)}><Txt x={0} y={0} size={60}>PEOPLE</Txt></Ov>
      {K("ALMOST NOTHING SPECIAL", P(10, 4.2), P(11))}
      {K("A STORY PEOPLE ENJOYED…", P(11, 0.2), P(12))}
      {K("…GAVE THE SAME SMALL BOOST", P(11, 2.4), P(12), 1)}
      <Pill x={700} y={620} text="MOZART: +SMALL" size={58} color={teal} a={P(11, 2.6)} b={P(12)} />
      <Pill x={1260} y={620} text="A STORY: +SMALL" size={58} a={P(11, 3.0)} b={P(12)} />
      {K("LISTEN IF YOU LIKE IT", P(12, 0.2), P(13))}
      {K("DON'T EXPECT A SMARTER BRAIN", P(12, 2.8), P(13), 1)}
      <Stp x={960} y={600} k="M" size={100} a={P(13, 0.3)} />
      {K("THE EXPERIMENT WAS REAL", P(13, 1.4), P(14))}
      {K("THE LEGEND WASN'T", P(13, 2.6), P(14), 1)}
    </>
  ),
  src: (
    <>
      <Now text={M1} a={0} b={PH} />
      <Now text="FLUTE + PIZZICATO · SAME TUNE · 112 BPM" a={PH} b={2 * PH} />
      <Now text="STRINGS · SAME TUNE · 112 BPM" a={2 * PH} b={P(13)} />
      <CiteR text="Rauscher, Shaw & Ky 1993, Nature" a={P(7)} b={P(9)} />
      <Simp a={P(8)} b={P(9)} />
      <CiteR text="Pietschnig et al. 2010, Intelligence" a={P(10)} b={P(11)} />
      <CiteR text="Nantais & Schellenberg 1999" a={P(11)} b={P(12)} />
    </>
  ),
}));

const ch03 = scene(14, "ch03", (P) => ({
  shots: [W(BRAIN, 0, "in", "cut"), D(W(BRAIN, P(15) - 0.4, "pl", "fade"), 0.31), W(BRAIN, P(20), "out", "fade")],
  ov: (
    <>
      {K("IF NOT MOZART, THEN WHAT?", P(14, 0.2), P(15))}
      {K("THEIR OWN FAVORITE MUSIC", P(15, 0.2), P(16))}
      {K("THE PIECES THAT GAVE THEM CHILLS", P(15, 3.4), P(16), 1)}
      <Brain a={P(15)} b={P(19)} g1={P(17, 0.3)} g2={P(17, 3.2)} burst={P(18) - 3} />
      {K("DOPAMINE, RELEASED TWICE", P(16, 0.2), P(17))}
      <Pill x={1440} y={520} text="1 · BEFORE THE PEAK" size={46} color={teal} a={P(17, 0.3)} b={P(18) - 4} />
      <Pill x={1440} y={660} text="2 · DURING THE CHILL" size={46} a={P(17, 3.2)} b={P(18) - 4} />
      {K("CAUSE AND EFFECT?", P(18, 0.2), P(19))}
      <Dial x={620} a={P(19, 0.2)} b={P(20)} top="BOOST DOPAMINE" res="MORE PLEASURE" to={0.9} c={TL} />
      <Dial x={1300} a={P(19, 3.2)} b={P(20)} top="BLOCK DOPAMINE" res="FLATTER" to={0.12} c={orange} />
      <Stp x={960} y={600} k="D" size={90} a={P(20, 0.3)} />
      {K("NOT JUST NICE. CHEMISTRY.", P(20, 1.6), P(21))}
    </>
  ),
  src: (
    <>
      <Now text="STRINGS + DRUM · TENSION · 76 BPM ↑" a={P(15)} b={P(18) - 4} />
      <Solo a={P(18) - 4} b={P(18)} y={250} s={0.72} title="THE PEAK" sub="TENSION · PAUSE · BURST" />
      <Now text="CELLO + HARP · MELANCHOLY · 64 BPM" a={P(18)} b={P(21)} />
      <Cite text="Salimpoor et al. 2011, Nature Neuroscience" a={P(15)} b={P(18) - 4} />
      <Simp a={P(15)} b={P(20)} />
      <Cite text="Ferreri et al. 2019, PNAS" a={P(19)} b={P(20)} />
    </>
  ),
}));

const ch04 = scene(21, "ch04", (P) => ({
  shots: [W(SHELF, 0, "in", "cut"), D(W(SHELF, P(23) - 0.4, "pl", "fade", [0.6, 0.5])), W(SHELF, P(25), "pr", "fade", [0.35, 0.5])],
  ov: (
    <>
      {K("NOW, SOMETHING UNCOMFORTABLE", P(21, 0.2), P(22))}
      {K("FRENCH ACCORDION…", P(22, 0.3), P(23))}
      {K("…OR GERMAN BRASS", P(22, 3.4), P(23), 1)}
      <Pill x={960} y={620} text="RIGHT BY THE WINE" size={60} color={teal} a={P(22, 6.2)} b={P(23)} />
      {K("FRENCH MUSIC: ~3 TO 1", P(23, 0.2), P(24) - 3)}
      <Bars a={P(23)} a2={P(24)} b={P(25)} hide={[P(24) - 3, P(25) - 3]} />
      {K("GERMAN MUSIC: IT FLIPPED", P(24, 0.2), P(25) - 3)}
      {K("DID THE MUSIC INFLUENCE YOU?", P(25, 0.2), P(26))}
      {K("ALMOST NOBODY SAID YES", P(25, 3.4), P(26), 1)}
      <Pill x={960} y={600} text="ONE STORE · TWO WEEKS" size={60} color={teal} a={P(26, 0.2)} b={P(27)} />
      {K("IT NUDGED THE CHOICE", P(26, 3.0), P(27))}
      <Stp x={960} y={600} k="D" size={90} a={P(27, 0.3)} />
    </>
  ),
  src: (
    <>
      <Now text="ACCORDION WALTZ · FRENCH · 90 BPM" a={P(22)} b={P(24) - 3} />
      <Solo a={P(24) - 3} b={P(24)} title="FRENCH ACCORDION" sub="MUSETTE WALTZ · 90 BPM · 3/4" />
      <Now text="BRASS BAND · GERMAN · 116 BPM" a={P(24)} b={P(25) - 3} />
      <Solo a={P(25) - 3} b={P(25)} title="GERMAN BRASS BAND" sub="OOMPAH · 116 BPM · 2/4" />
      <Now text="BRASS BAND · GERMAN · 116 BPM" a={P(25)} b={P(27)} />
      <Cite text="North, Hargreaves & McKendrick 1999" a={P(22)} b={P(28)} />
      <Simp a={P(23)} b={P(25)} />
    </>
  ),
}));

const ch05 = scene(28, "ch05", (P) => {
  const s = P(31) - 10;
  return {
    shots: [W("dance", 0, "in", "cut"), D(W("dance", P(29) - 0.4, "pl", "fade")), D(W("dance", P(31), "pr", "fade", [0.4, 0.5]))],
    ov: (
      <>
        {K("WHY DOES YOUR FOOT TAP?", P(28, 0.2), P(29))}
        {K("SAME TEMPO: 120 BPM", P(29, 0.2), P(30))}
        {K("DIFFERENT SYNCOPATION", P(29, 3.4), P(30), 1)}
        <Grid segs={[[s - 0.6, "b"], [s, "a"], [s + 3, "c"], [s + 6, "b"]]} a={s - 0.6} b={P(31)} />
        {K("TOO SIMPLE: BORING", P(30, 0.2), s)}
        {K("TOO COMPLEX: CONFUSING", P(30, 1.9), s, 1)}
        <Curve a={P(31)} b={P(33)} />
        {K("MEDIUM = THE SWEET SPOT", P(31, 0.2), P(32))}
        {K("THAT'S GROOVE", P(32, 0.2), P(33))}
        {K("NOT LOUDER. NOT FASTER.", P(32, 1.2), P(33), 1)}
        <Stp x={960} y={640} k="D" size={80} a={P(32, 3.3)} />
      </>
    ),
    src: (
      <>
        <Now text="DRUMS · MEDIUM SYNCOPATION · 120 BPM" a={P(29)} b={s} />
        <Solo a={s} b={s + 3} y={250} s={0.72} title="1 · TOO SIMPLE" sub="SAME DRUMS · SAME 120 BPM" />
        <Solo a={s + 3} b={s + 6} y={250} s={0.72} title="2 · TOO COMPLEX" sub="SAME DRUMS · SAME 120 BPM" />
        <Solo a={s + 6} b={P(31)} y={250} s={0.72} title="3 · JUST RIGHT" sub="SAME DRUMS · SAME 120 BPM" />
        <Now text="DRUMS · MEDIUM SYNCOPATION · 120 BPM" a={P(31)} b={P(33)} />
        <CiteR text="Witek et al. 2014, PLoS One" a={P(29)} b={P(33)} />
        <Simp a={s - 0.6} b={P(33)} />
      </>
    ),
  };
});

/** ch06: tempo en esfera; sube a 138 (M7) y baja a 96 (M8). */
const Bpm: React.FC<{ a: number; b: number; down: number }> = ({ a, b, down }) => {
  const t = useT();
  const bpm = 60 + 78 * ramp(t, a + 0.3, a + 1.5) - 42 * ramp(t, down + 0.2, down + 1.4);
  return (
    <Ov x={760} y={620} a={a} b={b} lim={1.04}>
      <Gauge x={0} y={160} r={300} f={(bpm - 60) / 120} band={[75 / 120, 80 / 120]} ticks={[[0, "60"], [0.5, "120"], [1, "180"]]} />
      <Txt x={0} y={-330} size={40} fill={TL} spacing={4}>MUSIC TEMPO</Txt>
      <Txt x={0} y={-250} size={72} fill={orange}>{`${Math.round(bpm)} BPM`}</Txt>
    </Ov>
  );
};

const ch06 = scene(33, "ch06", (P) => {
  return {
    shots: [W("tandem", 0, "in", "cut"), D(W("tandem", P(34), "pl", "fade"), 0.31), D(W("tandem", P(36), "pr", "fade"), 0.31)],
    ov: (
      <>
        {K("MUSIC WON'T MAKE YOU AN ATHLETE", P(33, 0.2), P(34))}
        <Num x={620} y={500} v={139} size={220} fill={teal} a={P(34, 0.6)} b={P(34, 5.4)} />
        <Ov x={620} y={660} a={P(34, 0.8)} b={P(34, 5.4)}><Txt x={0} y={0} size={60}>STUDIES</Txt></Ov>
        <Num x={1300} y={500} v={3599} size={200} a={P(34, 1.8)} b={P(34, 5.4)} />
        <Ov x={1300} y={660} a={P(34, 2.0)} b={P(34, 5.4)}><Txt x={0} y={0} size={60}>PEOPLE</Txt></Ov>
        <Pill x={620} y={580} text="MOOD ↑" size={70} color={teal} a={P(34, 5.8)} b={P(35)} />
        <Pill x={1300} y={580} text="EFFORT FEELS LIGHTER" size={60} a={P(34, 7.2)} b={P(35)} />
        {K("PERFORMANCE: A LITTLE BETTER", P(35, 0.2), P(36))}
        {K("MORE WITH FAST MUSIC", P(35, 2.0), P(36), 1)}
        {K("CYCLISTS, WORKING HARD", P(36, 0.2), P(37))}
        <Bpm a={P(36)} b={P(37, 1.6)} down={P(37)} />
        <Pill x={1450} y={560} text="PREFERRED: 135–140" size={50} a={P(36, 3.6)} b={P(37)} />
        {K("HEART RATE?", P(37, 1.8), P(38))}
        <Heart x={1460} y={560} a={P(37, 1.2)} b={P(38, 3.2)} />
        {K("SAME HEART RATE. FEELS EASIER.", P(38, 0.2), P(39))}
        <Stp x={960} y={560} k="D" size={90} a={P(38, 3.4)} />
      </>
    ),
    src: (
      <>
        <Now text="ELECTRONIC · ENERGY · 138 BPM" a={P(34)} b={P(37)} />
        <Now text="SAME TRACK, SLOWER · 96 BPM" a={P(37)} b={P(39)} />
        <CiteR text="Terry et al. 2020, Psychological Bulletin" a={P(34)} b={P(36)} />
        <CiteR text="Karageorghis et al. 2011" a={P(36)} b={P(37)} />
        <Simp a={P(36)} b={P(38, 3.2)} />
        <CiteR text="Terry et al. 2020, Psychological Bulletin" a={P(37)} b={P(39)} />
      </>
    ),
  };
});

const ch07 = scene(39, "ch07", (P, dur) => ({
  shots: [W(HEART, 0, "in", "cut")],
  ov: (
    <>
      {K("CAN MUSIC HELP WITH DEPRESSION?", P(39, 0.2), P(40))}
      <Pill x={960} y={560} text="9 STUDIES · ~420 PEOPLE" size={66} color={teal} a={P(40, 1.0)} b={P(41)} />
      {K("THERAPY + NORMAL TREATMENT", P(40, 3.6), P(41))}
      {K("A REAL, SHORT-TERM IMPROVEMENT", P(41, 0.2), P(42))}
      {K("A TRAINED MUSIC THERAPIST", P(42, 0.2), P(43))}
      {K("NOT YOUR PLAYLIST AT HOME", P(42, 2.8), P(43), 1)}
    </>
  ),
  src: (
    <>
      <Now text="ACOUSTIC GUITAR · CALM, HOPEFUL · 68 BPM" a={0} b={dur} />
      <Tag text="NOT MEDICAL ADVICE" a={0.3} b={dur} />
      <Cite text="Aalbers et al. 2017, Cochrane Review" a={P(40)} b={dur} />
      <Warn a={P(43)} b={dur} />
      <Pill x={960} y={170} text="A SUPPORT, NOT A CURE" size={50} color={teal} a={P(44, 1.2)} b={dur} />
      <Stp x={960} y={760} k="D" size={60} a={P(44, 0.3)} />
    </>
  ),
}));

const ch08 = scene(45, "ch08", (P, dur) => ({
  shots: [W("cradle", 0, "in", "cut", [0.5, 0.45]), D(W("cradle", P(46), "pd", "fade", [0.5, 0.45])), D(W("cradle", P(48), "in", "fade", [0.5, 0.5]))],
  ov: (
    <>
      {K("AND HERE'S THE STRANGEST PART", P(45, 0.2), P(46))}
      <Num x={960} y={470} v={144} size={240} a={P(46, 0.6)} b={P(46, 4.6)} />
      <Ov x={960} y={640} a={P(46, 0.8)} b={P(46, 4.6)}><Txt x={0} y={0} size={64}>BABIES</Txt></Ov>
      <Pill x={560} y={560} text="FARAWAY CULTURES" size={58} color={teal} a={P(46, 4.8)} b={P(47) - 4} />
      <Pill x={1360} y={560} text="LANGUAGES NEVER HEARD" size={58} a={P(46, 6.8)} b={P(47) - 4} />
      {K("LULLABIES SLOWED THEIR HEART RATE", P(47, 0.2), P(48))}
      {K("CALM, NOT EXCITEMENT", P(47, 4.2), P(48), 1)}
      <Beats a={P(47)} b={P(49)} />
      {K("PARENTS NEVER HEARD THEM EITHER", P(48, 0.2), P(49))}
      {K("…YET PICKED THE LULLABY", P(48, 3.6), P(49), 1)}
      {K("CALM, NOT SLEEP", P(49, 0.2), P(50))}
      {K("ONLY BABIES FROM ONE COUNTRY", P(49, 2.2), P(50), 1)}
      <Stp x={960} y={600} k="D" size={90} a={P(50, 0.3)} />
    </>
  ),
  src: (
    <>
      <Now text="MUSIC-BOX LULLABY · CALM · ~70 BPM" a={P(46)} b={P(47) - 4} />
      <Solo a={P(47) - 4} b={P(47)} title="LULLABY" sub="MUSIC BOX · ~70 BPM · 3/4" note="Example: Brahms, op. 49 no. 4 (public domain). Not from the study." />
      <Now text="DANCE SONG · NOT A LULLABY · 124 BPM" a={P(47)} b={P(47, 3.2)} />
      <Now text="MUSIC-BOX LULLABY · CALM · ~70 BPM" a={P(47, 3.2)} b={dur} />
      <CiteR text="Bainbridge et al. 2021, Nature Human Behaviour" a={P(46)} b={dur} />
      <Simp a={P(47)} b={P(49)} />
    </>
  ),
}));

const ch09 = scene(51, "ch09", (P, dur) => {
  const hm = P(52) + 0.52 * (P(53) - P(52));
  return {
    shots: [W("dogs", 0, "in", "cut", [0.5, 0.42]), W("dogs", P(53), "pd", "fade", [0.5, 0.5]), W("cows", P(54), "in", "fade", [0.5, 0.6])],
    ov: (
      <>
        {K("WHAT ABOUT ANIMALS?", P(51, 0.2), P(52))}
        <Pill x={1340} y={520} text="CLASSICAL → MORE REST" size={52} color={teal} a={P(52, 0.6)} b={P(53)} />
        <Pill x={1340} y={680} text="HEAVY METAL → MORE BARKING" size={52} a={hm} b={P(53)} />
        {K("SAME PLAYLIST FOR A WEEK", P(53, 0.2), P(54))}
        <Pill x={1340} y={600} text="EFFECT FADED" size={64} a={P(53, 2.6)} b={P(54)} />
        {K("COWS WALKED TO THE MILKING AREA", P(54, 0.2), P(55))}
        <Pill x={600} y={520} text="MUSIC = A SIGNAL" size={58} color={teal} a={P(54, 6.4)} b={P(55)} />
        <Pill x={600} y={680} text="MILK? NOT MEASURED" size={58} a={P(54, 3.4)} b={P(55)} />
        <Stp x={960} y={600} k="P" size={90} a={P(55, 0.3)} />
        {K("INTERESTING, NOT MAGIC", P(55, 1.4), dur, 1)}
      </>
    ),
    src: (
      <>
        <Now text="HARP, MOZART-STYLE · CALM · 100 BPM" a={P(52)} b={hm} />
        <Now text="DISTORTED GUITAR · HEAVY METAL · 140 BPM" a={hm} b={hm + 2.6} />
        <Now text="HARP, MOZART-STYLE · CALM · 100 BPM" a={hm + 2.6} b={dur} />
        <CiteR text="Wells et al. 2002 · Bowman et al. 2015" a={P(52)} b={P(54)} />
        <CiteR text="Uetake et al. 1997" a={P(54)} b={dur} />
      </>
    ),
  };
});

const ch10 = scene(56, "ch10", (P, dur) => ({
  shots: [W(FP, 0, "in", "fade"), W(EAR, P(58), "pl", "wl")],
  ov: (
    <>
      {K("MOZART → SMARTER BABIES", P(56, 0.2), P(57))}
      <Stp x={960} y={560} k="M" size={100} a={P(56, 1.8)} b={P(57)} />
      {K("MUSIC IS STILL WORKING ON YOU", P(57, 0.2), P(58))}
      <Pill x={560} y={480} text="YOUR DOPAMINE" size={58} color={teal} a={P(57, 1.8)} b={P(58)} />
      <Pill x={1360} y={480} text="YOUR SHOPPING CART" size={58} a={P(57, 2.8)} b={P(58)} />
      <Pill x={560} y={640} text="YOUR WORKOUT" size={58} a={P(57, 3.8)} b={P(58)} />
      <Pill x={1360} y={640} text="A BABY'S HEARTBEAT" size={58} color={teal} a={P(57, 4.8)} b={P(58)} />
      {K("THE MYTH WAS SMALL", P(58, 0.2), P(59), 0, 500)}
      {K("THE REAL EFFECTS: QUIETER, STRANGER", P(58, 1.8), P(59), 1, 500)}
      {K("NEXT TIME A SONG GIVES YOU CHILLS…", P(59, 0.2), P(60), 0, 500)}
      {K("WHAT ELSE IS QUIETLY", P(60, 0.2), dur, 0, 500)}
      {K("DECIDING FOR YOU?", P(60, 1.4), dur, 1, 500)}
    </>
  ),
  src: <Now text="CELESTA + LOW PULSE · SUSPENSE · 84 BPM" a={0} b={dur - 0.5} />,
}));

export const SCENES053: Record<string, React.FC<SceneProps>> = { ch01, ch02, ch03, ch04, ch05, ch06, ch07, ch08, ch09, ch10 };

/* ============ miniatura sin imagen IA: vector (cascos + notas) con el sistema v3 ============ */
const NAVY = "#0A1A4A";
const YEL = "#FFC400";
const IMPACT = 'Impact, "Arial Black", "Segoe UI", sans-serif';
const out = (w: number): React.CSSProperties => ({ WebkitTextStroke: `${w}px ${NAVY}`, paintOrder: "stroke fill", textShadow: `0 8px 0 ${NAVY}, 0 14px 28px rgba(0,0,0,.55)` });
const Note: React.FC<{ x: number; y: number; s: number; c: string; r: number }> = ({ x, y, s, c, r }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={30} ry={22} transform="rotate(-20)" fill={c} stroke={NAVY} strokeWidth={6} />
    <path d="M26 -6 L26 -120 C 50 -100, 80 -90, 76 -50" fill="none" stroke={c} strokeWidth={12} strokeLinecap="round" />
  </g>
);
export const ThumbEM053: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 78% 45%, #1E3E8C 0%, ${NAVY} 62%)`, overflow: "hidden", fontFamily: IMPACT }}>
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
      <g opacity={0.5} fill="none" stroke={teal} strokeWidth={10} strokeLinecap="round">
        {[0, 1, 2].map((i) => <path key={i} d={`M${1215 + i * 30} ${250 - i * 30} Q ${1260 + i * 40} 380 ${1215 + i * 30} ${510 + i * 30}`} />)}
      </g>
      <path d="M840 430 C 840 150, 1190 150, 1190 430" fill="none" stroke={NAVY} strokeWidth={70} strokeLinecap="round" />
      <path d="M840 430 C 840 150, 1190 150, 1190 430" fill="none" stroke="#FFFFFF" strokeWidth={44} strokeLinecap="round" />
      {[790, 1140].map((x) => <rect key={x} x={x} y={350} width={100} height={200} rx={44} fill={YEL} stroke={NAVY} strokeWidth={12} />)}
      <Note x={1010} y={500} s={1.5} c={orange} r={-8} />
      <Note x={1160} y={140} s={0.9} c={YEL} r={12} />
      <g stroke={orange} strokeWidth={10} strokeLinecap="round" fill="none">
        <path d="M960 640 l20 -24 l20 24 l20 -24 l20 24" />
        <path d="M1150 610 l20 -24 l20 24 l20 -24" />
      </g>
    </svg>
    <div style={{ position: "absolute", left: 44, top: 10, fontSize: 330, lineHeight: 1.05, color: "#fff", letterSpacing: 2, transform: "rotate(-3deg)", transformOrigin: "left center", whiteSpace: "nowrap", ...out(14) }}>
      WHY
    </div>
    <div style={{ position: "absolute", left: -30, top: 425, width: 740, transform: "rotate(-4deg)", background: YEL, padding: "14px 30px 14px 74px", boxShadow: `0 10px 0 ${NAVY}, 0 18px 30px rgba(0,0,0,.5)`, fontSize: 118, lineHeight: 1.02, color: NAVY, letterSpacing: 1, whiteSpace: "nowrap" }}>
      THE CHILLS?
    </div>
  </AbsoluteFill>
);
