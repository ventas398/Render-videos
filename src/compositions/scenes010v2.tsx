// EM-010 v2 (kit2): fotos IA a sangre (regla 70/30) + dibujo real de la patente 139.121 (dominio publico) en tarjeta sobre foto + bolsillo de siglo XVIII en vector propio.
import React from "react";
import { staticFile } from "remotion";
import { ramp } from "../utils/anim";
import { teal, orange, ink, useT } from "./kit";
import type { SceneProps } from "./scenes";
import { cl, FULL, Kin, Ov, Pill, Pip, Reading } from "./scenes023";
import { Cite, mkScene } from "./v2";

const scene = mkScene("em010-");
const CARD = "#FFFDF6";
const A169 = 1672 / 941; // fotos Flow/ChatGPT 16:9 (1901, 1937)
const PAT_CITE = "US Patent Office, no. 139,121 (public domain)";

/** Dibujo real de la patente (retrato 0,7) en tarjeta sobre la foto; pan = recorrido vertical (0 = cabecera, 1 = pie). */
const Doc: React.FC<{ x: number; y: number; w: number; h: number; a: number; b: number; pan?: [number, number] }> = ({ x, y, w, h, a, b, pan = [0, 0] }) => {
  const t = useT();
  const ih = w / 0.7;
  const u = cl((t - a) / Math.max(0.5, b - a));
  const oy = (pan[0] + (pan[1] - pan[0]) * u) * (ih - h);
  const id = `doc-${x}-${y}-${Math.round(a * 10)}`;
  return (
    <Ov x={x} y={y} a={a} b={b}>
      <rect x={-w / 2 + 10} y={-h / 2 + 14} width={w} height={h} rx={14} fill="#000" opacity={0.3} />
      <rect x={-w / 2 - 8} y={-h / 2 - 8} width={w + 16} height={h + 16} rx={14} fill="#fff" />
      <clipPath id={id}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} />
      </clipPath>
      <image href={staticFile("images/em010-patent-fig.jpg")} x={-w / 2} y={-h / 2 - oy} width={w} height={ih} clipPath={`url(#${id})`} preserveAspectRatio="none" />
    </Ov>
  );
};

/** Pantalla final: velo azul tinta sobre la ultima foto, cierre hablado, marca y eslogan. Entra 0,8 s tras la ultima palabra. */
const EndOv: React.FC<{ a: number }> = ({ a }) => {
  const t = useT();
  const o = ramp(t, a, a + 0.3);
  const tx = { textAnchor: "middle" as const, fontFamily: "Segoe UI, sans-serif", fill: "#fff" };
  return o > 0 ? (
    <g opacity={o}>
      <rect x={-100} y={-100} width={2120} height={1280} fill="rgba(20,33,61,.68)" />
      <text x={960} y={350} fontSize={110} fontWeight={900} {...tx} fill="#FFC400">
        IS IT A REAL BRIDGE?
      </text>
      <rect x={860} y={440} width={200} height={8} fill={orange} />
      <text x={960} y={560} fontSize={48} fontWeight={800} letterSpacing={10} {...tx}>
        THE EVERYDAY MYSTERY
      </text>
      <text x={960} y={650} fontSize={40} fontWeight={500} fontStyle="italic" {...tx}>
        Look again at what you stopped seeing.
      </text>
    </g>
  ) : null;
};

/** Par de bolsillos atados a la cintura (siglo XVIII), vector propio. */
const TiePockets: React.FC<{ a: number; b: number; x?: number; y?: number; k?: number }> = ({ a, b, x = 960, y = 440, k = 1 }) => {
  const pouch = "M-80 0 C-100 90 -130 170 -70 230 C-30 265 30 265 70 230 C130 170 100 90 80 0 Z";
  return (
    <Ov x={x} y={y} a={a} b={b}>
      <g transform={`scale(${k})`}>
      <rect x={-560} y={-260} width={1120} height={520} rx={30} fill={CARD} stroke={ink} strokeWidth={6} />
      <path d="M-470 -150 Q0 -70 470 -150" fill="none" stroke={teal} strokeWidth={18} strokeLinecap="round" />
      <path d="M-30 -110 L-70 -60 M30 -110 L70 -60" stroke={orange} strokeWidth={12} strokeLinecap="round" />
      <circle cx={0} cy={-112} r={24} fill={orange} stroke={ink} strokeWidth={6} />
      {[-260, 260].map((x) => (
        <g key={x} transform={`translate(${x} -120)`}>
          <path d="M-60 0 L-70 0 M60 0 L70 0" stroke={teal} strokeWidth={10} />
          <path d={pouch} fill="#F2E3C2" stroke={ink} strokeWidth={7} strokeLinejoin="round" />
          <path d="M0 40 L0 190" stroke={ink} strokeWidth={8} strokeLinecap="round" />
        </g>
      ))}
      </g>
    </Ov>
  );
};

const hook = scene(0, "hook", (P) => ({
  shots: [
    { id: "pocket", t: 0, r: FULL, f: [0.5, 0.5], mv: "in", tr: "cut" },
    { id: "jeans", t: P(1), r: FULL, f: [0.5, 0.45], mv: "pl", tr: "wl" },
    { id: "pocket", t: P(2), r: FULL, f: [0.55, 0.4], z: 1.3, mv: "in", tr: "zoom" },
    { id: "watch", t: P(3), r: FULL, f: [0.4, 0.55], mv: "pr", tr: "zoom" },
    { id: "patent", t: P(3, 1.5), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page" },
    { id: "war", t: P(3, 2.9), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "wl" },
    { id: "pocket", t: P(4), r: FULL, f: [0.6, 0.4], z: 1.3, mv: "in", tr: "fade" },
  ],
  ov: (
    <>
      <Kin x={1400} y={250} text="FOUND IT?" size={170} fill={orange} a={P(0, 0.3)} b={P(1)} rot={-4} />
      <Kin x={500} y={330} text="COINS? KEYS?" size={100} a={P(1, 0.3)} b={P(2)} rot={-2} fill={teal} />
      <Kin x={1400} y={320} text="TOO SMALL" size={120} a={P(2, 0.4)} b={P(3)} fill={orange} rot={-3} />
      <Kin x={1400} y={470} text="TOO AWKWARD" size={100} a={P(2, 1.4)} b={P(3)} />
      <Kin x={960} y={190} text="WATCH" size={170} a={P(3, 0.2)} b={P(3, 1.5)} fill={teal} rot={-3} />
      <Kin x={500} y={300} text="PATENT" size={120} a={P(3, 1.6)} b={P(3, 2.9)} fill={orange} />
      <Kin x={1400} y={300} text="WAR" size={170} a={P(3, 3.0)} b={P(4)} rot={3} />
      <Kin x={960} y={190} text="ITS NAME" size={170} fill={orange} rot={-4} a={P(4, 0.4)} />
      <Pip x={1660} y={800} a={P(4, 1.0)} s={0.9} arm="chin" />
    </>
  ),
}));

const watch = scene(5, "watch", (P) => ({
  shots: [
    { id: "watch", t: P(5), r: FULL, f: [0.4, 0.55], mv: "in", tr: "page" },
    { id: "fob", t: P(6), r: FULL, f: [0.5, 0.4], mv: "pl", tr: "wl" },
    { id: "watch", t: P(7), r: FULL, f: [0.08, 0.5], z: 1.75, mv: "in", tr: "zoom" },
    { id: "fob", t: P(7, 4.4), r: FULL, f: [0.55, 0.62], z: 1.5, mv: "pl", tr: "wr" },
    { id: "17c-breeches-pocket", t: P(8), asp: A169, r: FULL, f: [0.5, 0.45], mv: "in", tr: "wr" },
    { id: "pocket", t: P(9), r: FULL, f: [0.55, 0.4], z: 1.2, mv: "in", tr: "page" },
  ],
  ov: (
    <>
      <Kin x={1400} y={200} text="WATCH" size={170} a={P(5, 0.3)} b={P(6)} fill={teal} rot={-3} />
      <Kin x={1400} y={400} text="POCKET" size={170} a={P(5, 0.7)} b={P(6)} fill={orange} rot={-3} />
      <Kin x={500} y={300} text="NOT ON" size={110} a={P(6, 0.4)} b={P(7)} />
      <Kin x={500} y={450} text="THE WRIST" size={130} a={P(6, 0.8)} b={P(7)} fill={orange} rot={-3} />
      <Kin x={1400} y={250} text="LATE 1800s" size={140} a={P(7, 0.5)} b={P(8)} fill={orange} rot={-3} />
      <Kin x={1400} y={190} text="MID 1600s" size={120} a={P(8, 0.4)} b={P(9)} fill={orange} rot={-2} />
      <Pill x={1330} y={640} text="SLIT POCKET IN A WOOL BREECHES" size={36} a={P(8, 1.0)} b={P(9)} color={teal} />
      <Pill x={960} y={740} text="FOB = SMALL POCKET IN THE WAISTBAND" size={40} a={P(8, 1.6)} b={P(9)} color={orange} />
      <Kin x={500} y={300} text="STILL AROUND" size={110} a={P(9, 0.4)} b={P(10)} fill={teal} />
    </>
  ),
  src: (
    <>
      <Cite text="Levi Strauss & Co." a={P(7, 0.3)} b={P(8)} y={832} />
      <Cite text="Oxford Dictionary of Word Origins, via Wikipedia" a={P(8, 0.3)} b={P(9)} y={832} />
      <Cite text="Wikipedia" a={P(9, 0.3)} b={P(10)} y={832} />
    </>
  ),
}));

const patent = scene(10, "patent", (P) => ({
  shots: [
    { id: "patent", t: P(10), r: FULL, f: [0.5, 0.5], bl: 10, mv: "in", tr: "page" },
    { id: "patent", t: P(11), r: FULL, f: [0.5, 0.5], bl: 10, mv: "in", tr: "cut" },
    { id: "patent", t: P(12), r: FULL, f: [0.5, 0.5], mv: "in", tr: "fade" },
    { id: "rivets", t: P(13), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "wl" },
    { id: "rivets", t: P(14), r: FULL, f: [0.5, 0.55], z: 1.3, mv: "in", tr: "page" },
    { id: "patent", t: P(15), r: FULL, f: [0.22, 0.6], z: 1.5, mv: "pr", tr: "wr" },
  ],
  ov: (
    <>
      <Doc x={1380} y={410} w={490} h={700} a={P(10)} b={P(11)} />
      <Kin x={500} y={300} text="1873" size={230} fill={orange} a={P(10, 0.3)} b={P(11)} rot={-4} />
      <Pill x={500} y={500} text="US PATENT" size={50} a={P(10, 1.2)} b={P(11)} color={teal} />
      <Doc x={960} y={420} w={1240} h={700} a={P(11)} b={P(12)} pan={[0, 0.2]} />
      <Pill x={960} y={790} text="IMPROVEMENT IN FASTENING POCKET-OPENINGS" size={40} a={P(11, 0.4)} b={P(12)} color={orange} />
      <Kin x={500} y={300} text="DAVIS" size={140} a={P(12, 0.4)} b={P(12, 3.4)} fill={teal} rot={-3} />
      <Pill x={500} y={440} text="A TAILOR" size={50} a={P(12, 0.9)} b={P(12, 3.4)} />
      <Kin x={960} y={190} text="STRAUSS: SAN FRANCISCO, 1853" size={80} a={P(12, 3.8)} b={P(13)} fill={orange} />
      <Kin x={1400} y={190} text="COPPER" size={170} a={P(13, 0.3)} b={P(14)} fill={orange} rot={-3} />
      <Kin x={1400} y={400} text="RIVETS" size={190} a={P(13, 0.8)} b={P(14)} fill={teal} rot={-3} />
      <Kin x={500} y={300} text="4 POCKETS" size={130} a={P(14, 0.4)} b={P(15)} fill={teal} rot={-3} />
      <Kin x={500} y={450} text="ALL RIVETED" size={110} a={P(14, 1.0)} b={P(15)} fill={orange} />
      <Kin x={1400} y={300} text="LATE 1870s?" size={130} a={P(15, 0.5)} b={P(15, 5.6)} fill={orange} rot={3} />
      <Kin x={1400} y={470} text="DATE IS FUZZY" size={96} a={P(15, 5.8)} b={P(16)} fill={teal} rot={-3} />
    </>
  ),
  src: (
    <>
      <Cite text={PAT_CITE} a={P(10, 0.3)} b={P(12)} y={840} />
      <Cite text="Levi Strauss & Co. + Wikipedia" a={P(12, 0.3)} b={P(14)} y={840} />
      <Cite text="Levi Strauss & Co." a={P(14, 0.1)} b={P(15)} y={840} />
      <Cite text="Wikipedia, citing a news report" a={P(15, 0.3)} b={P(16)} y={840} />
    </>
  ),
}));

const fifth = scene(16, "fifth", (P) => ({
  shots: [
    { id: "jeans", t: P(16), r: FULL, f: [0.5, 0.62], mv: "in", tr: "page" },
    { id: "1901-two-back-pockets", t: P(17), asp: A169, r: FULL, f: [0.5, 0.5], mv: "in", tr: "wr" },
    { id: "fifth", t: P(18), r: FULL, f: [0.5, 0.6], mv: "pl", tr: "wl" },
  ],
  ov: (
    <>
      <Kin x={1400} y={240} text="THE FIFTH" size={150} a={P(16, 0.3)} b={P(17)} fill={orange} rot={-4} />
      <Kin x={1400} y={430} text="POCKET?" size={190} a={P(16, 0.8)} b={P(17)} fill={teal} rot={-3} />
      <Kin x={1400} y={250} text="BACK LEFT" size={140} a={P(17, 0.5)} b={P(18)} fill={teal} rot={-3} />
      <Kin x={1400} y={430} text="1901" size={220} a={P(17, 1.3)} b={P(18)} fill={orange} rot={3} />
      <Kin x={500} y={300} text="THE COMPANY" size={100} a={P(18, 0.5)} b={P(19)} />
      <Kin x={500} y={430} text="DISAGREES" size={130} a={P(18, 1.0)} b={P(19)} fill={orange} rot={-3} />
    </>
  ),
  src: <Cite text="Levi Strauss & Co." a={P(17, 0.3)} b={P(19)} y={832} />,
}));

const rivets = scene(19, "rivets", (P) => ({
  shots: [
    { id: "1937-covered-rivet", t: P(19), asp: A169, r: FULL, f: [0.5, 0.5], mv: "in", tr: "page" },
    { id: "1937-covered-rivet", t: P(19, 5.5), asp: A169, r: FULL, f: [0.62, 0.55], z: 1.35, mv: "pl", tr: "fade" },
    { id: "rivets", t: P(20), r: FULL, f: [0.6, 0.4], z: 1.2, mv: "in", tr: "zoom" },
    { id: "war", t: P(21), r: FULL, f: [0.5, 0.5], mv: "pr", tr: "wr" },
    { id: "war", t: P(22), r: FULL, f: [0.3, 0.5], z: 1.5, mv: "in", tr: "zoom" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="1937" size={220} a={P(19, 0.3)} b={P(19, 5.5)} fill={orange} rot={-4} />
      <Kin x={960} y={750} text="THEY SCRATCHED FURNITURE" size={80} a={P(19, 2.6)} b={P(19, 5.5)} fill={orange} />
      <Kin x={500} y={300} text="COVERED" size={130} a={P(19, 5.8)} b={P(20)} fill={teal} rot={-3} />
      <Kin x={1400} y={250} text="1966" size={230} a={P(20, 0.4)} b={P(21)} fill={orange} rot={-4} />
      <Kin x={1400} y={470} text="BACK RIVETS OUT" size={90} a={P(20, 1.4)} b={P(21)} fill={teal} />
      <Kin x={960} y={580} text="WORLD WAR II" size={130} a={P(21, 0.3)} b={P(22)} fill={orange} rot={-3} />
      <Kin x={960} y={775} text="TO SAVE METAL" size={100} a={P(21, 3.0)} b={P(22)} />
      <Kin x={1500} y={300} text="A WARTIME FOOTNOTE" size={60} a={P(22, 0.3)} b={P(23)} fill={teal} rot={-2} />
    </>
  ),
  src: <Cite text="Levi Strauss & Co." a={P(19, 0.3)} b={P(23)} y={832} />,
}));

const pockets = scene(23, "pockets", (P) => ({
  shots: [{ id: "18c-tie-pockets", t: P(23), asp: A169, r: FULL, f: [0.5, 0.5], mv: "in", tr: "cut" }],
  ov: (
    <>
      <TiePockets a={P(23, 0.3)} b={P(26)} x={1530} y={330} k={0.6} />
      <Kin x={960} y={95} text="18TH CENTURY" size={100} a={P(23, 0.5)} b={P(24)} fill={orange} />
      <Pill x={960} y={815} text="SEPARATE GARMENTS, TIED AROUND THE WAIST" size={40} a={P(23, 3.0)} b={P(24)} color={teal} />
      <Pill x={960} y={815} text="REACHED THROUGH OPENINGS IN THE GOWN" size={40} a={P(24, 0.3)} b={P(25)} color={teal} />
      <Kin x={960} y={95} text="LETTERS KEYS MONEY" size={90} a={P(24, 1.2)} b={P(25)} fill={teal} />
      <Kin x={960} y={95} text="TIED ON, NOT SEWN IN" size={90} a={P(25, 0.3)} b={P(26)} fill={orange} />
    </>
  ),
  src: <Cite text="Victoria and Albert Museum" a={P(23, 0.3)} b={P(26)} />,
  simp: [P(23, 0.3), P(26)],
}));

const why = scene(26, "why", (P) => ({
  shots: [
    { id: "pocket", t: P(26), r: FULL, f: [0.6, 0.4], mv: "in", tr: "page" },
    { id: "jeans", t: P(27), r: FULL, f: [0.5, 0.5], mv: "pr", tr: "wr" },
    { id: "watch", t: P(28), r: FULL, f: [0.4, 0.55], mv: "in", tr: "wl" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="STILL THERE?" size={180} a={P(26, 0.3)} b={P(26, 4.2)} fill={orange} rot={-3} />
      <Pill x={960} y={760} text="THE ARTICLE DOES NOT SAY" size={56} a={P(26, 3.0)} b={P(27)} color={teal} />
      <Reading x={500} y={150} a={P(27, 0.2)} b={P(28)} />
      <Kin x={500} y={350} text="COPYING IS" size={110} a={P(27, 1.0)} b={P(28)} />
      <Kin x={500} y={500} text="EASIER" size={150} a={P(27, 1.5)} b={P(28)} fill={orange} rot={-3} />
      <Pill x={1400} y={250} text="A SAFE GUESS" size={50} a={P(28, 0.3)} b={P(29)} color={teal} rot={-2} />
      <Kin x={1460} y={420} text="OTHER SMALL THINGS" size={70} a={P(28, 1.2)} b={P(29)} fill={orange} />
    </>
  ),
}));

const close = scene(29, "close", (P, dur) => ({
  shots: [
    { id: "watch", t: P(29), r: FULL, f: [0.4, 0.55], mv: "in", tr: "cut" },
    { id: "rivets", t: P(29, 2.4), r: FULL, f: [0.5, 0.5], bl: 10, mv: "pl", tr: "page" },
    { id: "war", t: P(29, 4.8), r: FULL, f: [0.5, 0.5], mv: "pr", tr: "wl" },
    { id: "euro", t: P(30), r: FULL, f: [0.5, 0.45], mv: "in", tr: "zoom" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="A LITTLE MUSEUM" size={130} a={P(29, 0.3)} b={P(29, 2.4)} fill={orange} rot={-3} />
      <Doc x={1400} y={400} w={455} h={650} a={P(29, 2.4)} b={P(29, 4.8)} />
      <Kin x={500} y={300} text="A PATENT" size={120} a={P(29, 2.5)} b={P(29, 4.8)} fill={teal} />
      <Cite text={PAT_CITE} a={P(29, 2.5)} b={P(29, 4.8)} y={840} />
      <Kin x={1400} y={300} text="A WAR" size={150} a={P(29, 4.9)} b={P(30)} fill={orange} rot={3} />
      <Kin x={960} y={190} text="A BRIDGE?" size={200} a={P(30, 1.2)} b={dur - 3.9 + 0.3} fill={orange} rot={-4} />
      <Pip x={1560} y={760} a={P(30, 2.0)} b={dur - 3.9 + 0.3} s={0.9} arm="point" />
      <EndOv a={dur - 3.9} />
    </>
  ),
}));

export const SCENES010V2: Record<string, React.FC<SceneProps>> = { hook, watch, patent, fifth, rivets, pockets, why, close };
