// EM-003 v2 (kit2): fotos libres con credito (Commons PD/CC BY), dibujo real de la patente 2.612.994 (PD) y graficos vectoriales propios (codigo UPC, diana, arena).
import React from "react";
import { teal, orange, ink } from "./kit";
import type { SceneProps } from "./scenes";
import { FULL, Kin, Ov, Pill, Pip } from "./scenes023";
import { Cite, mkScene, SimpAt } from "./v2";

const CARD = "#FFFDF6";
const scene = mkScene("em003-", {
  g45: { f: "em003-grocery45.jpg", asp: 1.255, cr: "Ed Westcott, US DOE, 1945 (public domain)", lab: "Illustrative image" },
  s55: { f: "em003-store55.jpg", asp: 1.256, cr: "Seattle Municipal Archives, 1955 (CC BY 2.0)", lab: "Illustrative image" },
  s70: { f: "em003-store70.jpg", asp: 1.237, cr: "Provincial Archives of Alberta, 1970", lab: "Illustrative image" },
  eniac: { f: "em003-eniac.jpg", asp: 1.295, cr: "US Army photo of ENIAC (public domain)" },
  gum: { f: "em003-gum46-bg.jpg", asp: 16 / 9, cr: "Juicy Fruit wrapper, 1946 (public domain)", lab: "Not the original pack" },
  mia: { f: "em003-miami3.jpg", asp: 1800 / 766, cr: "Tichnor Bros. postcard (public domain)", lab: "Illustrative image" },
  co: { f: "em003-checkout02.jpg", asp: 1.524, cr: "U.S. Navy photo, 2002 (public domain)", lab: "Illustrative image" },
  pat: { f: "em003-patent-bg.jpg", asp: 16 / 9, cr: "US Patent Office, no. 2,612,994 (public domain)" },
}, ["clothing-store-1985-v2", "clothing-store-1985-v2b", "supermarket-checkout-1976-v2"]);

const L = ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"];
const upc = (d: string) => "101" + [...d.slice(0, 6)].map((c) => L[+c]).join("") + "01010" + [...d.slice(6)].map((c) => L[+c].replace(/./g, (b) => (b === "1" ? "0" : "1"))).join("") + "101";
const guard = (i: number) => i < 3 || (i >= 45 && i < 50) || i >= 92;

/** Codigo UPC-A de ejemplo (012345678905, numero de manual, no es de ningun producto), dibujado en vector; hl resalta las barras guia. */
const Bars: React.FC<{ w: number; h: number; hl?: boolean; digits?: boolean }> = ({ w, h, hl, digits }) => {
  const m = w / 95;
  const bits = upc("012345678905");
  return (
    <g>
      {[...bits].map((b, i) => (b === "1" ? <rect key={i} x={i * m} y={0} width={m + 0.4} height={h + (guard(i) ? 26 : 0)} fill={hl && guard(i) ? orange : ink} /> : null))}
      {digits && (
        <text x={w / 2} y={h + 52} textAnchor="middle" fontFamily="Consolas, monospace" fontWeight={700} fontSize={34} letterSpacing={10} fill={teal}>
          0 12345 67890 5
        </text>
      )}
    </g>
  );
};
/** Diana (bull's-eye): anillos concentricos. */
const Bull: React.FC<{ r: number; c?: string }> = ({ r, c = ink }) => (
  <g>
    {[1, 0.78, 0.58, 0.4, 0.22].map((k, i) => (
      <circle key={i} r={r * k} fill={i % 2 ? CARD : c} />
    ))}
  </g>
);
const Card: React.FC<{ x: number; y: number; w: number; h: number; a: number; b?: number; s?: number; rot?: number; fill?: string; children: React.ReactNode }> = ({ x, y, w, h, a, b, s, rot, fill = CARD, children }) => (
  <Ov x={x} y={y} a={a} b={b} s={s} rot={rot}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={26} fill={fill} stroke={ink} strokeWidth={6} />
    {children}
  </Ov>
);
const Upc: React.FC<{ x: number; y: number; a: number; b?: number; hl?: boolean; digits?: boolean; s?: number; rot?: number }> = ({ x, y, a, b, hl, digits, s = 1, rot }) => (
  <Card x={x} y={y} w={640} h={digits ? 380 : 320} a={a} b={b} s={s} rot={rot}>
    <g transform={`translate(${-285} ${-120})`}>
      <Bars w={570} h={190} hl={hl} digits={digits} />
    </g>
  </Card>
);
/** Lineas de arena: rayas largas y cortas (tipo Morse). */
const Sand: React.FC<{ a: number; b?: number; x?: number; y?: number; ring?: boolean }> = ({ a, b, x = 1410, y = 440, ring }) => (
  <Card x={x} y={y} w={760} h={440} a={a} b={b} fill="#EBD9B0">
    {!ring &&
      [-130, 0, 130].map((yy, k) => (
        <g key={yy} stroke="#8A6A3B" strokeLinecap="round" strokeWidth={22}>
          {[0, 1, 2, 3, 4].map((i) => {
            const long = (i * 3 + k * 2) % 3 === 0;
            const x0 = -300 + i * 125 - (long ? 20 : 0);
            return <path key={i} d={`M${x0} ${yy} h${long ? 100 : 22}`} />;
          })}
        </g>
      ))}
    {ring && (
      <g>
        {[1, 0.8, 0.6, 0.4, 0.2].map((k, i) => (
          <circle key={i} r={190 * k} fill="none" stroke="#8A6A3B" strokeWidth={i % 2 ? 12 : 26} />
        ))}
      </g>
    )}
  </Card>
);

const hook = scene(0, "hook", (P) => ({
  shots: [
    { id: "scan", t: 0, r: FULL, f: [0.5, 0.5], mv: "in", tr: "cut" },
    { id: "s70", t: P(2), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "pop" },
    { id: "gum", t: P(2, 3.6), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "pop" },
    { id: "scan", t: P(3), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "wl" },
    { id: "mia", t: P(4), r: FULL, f: [0.5, 0.55], mv: "in", tr: "fade" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="FIRST SCANNED" size={120} a={P(0, 0.4)} b={P(1)} fill={orange} rot={-3} />
      <Upc x={960} y={470} a={P(1, 0.3)} b={P(2)} hl rot={-2} />
      <Kin x={960} y={790} text="THE MARK OF THE BEAST?" size={76} a={P(1, 1.0)} b={P(2)} fill={teal} />
      <Kin x={500} y={110} text="SOUP" size={120} a={P(2, 0.6)} b={P(3)} fill={teal} rot={-3} />
      <Kin x={1400} y={110} text="CHARGER" size={110} a={P(2, 1.3)} b={P(3)} fill={orange} rot={2} />
      <Kin x={500} y={300} text="HOW?" size={230} a={P(3, 0.3)} b={P(4)} fill={orange} rot={-4} />
      <Kin x={960} y={190} text="A DOODLE IN THE SAND" size={110} a={P(4, 0.5)} fill={orange} rot={-2} />
      <Pip x={1660} y={780} a={P(3, 1.0)} b={P(4)} s={0.9} arm="chin" />
    </>
  ),
  simp: [P(1, 0.3), P(2)],
}));

const grocery = scene(5, "grocery", (P) => ({
  shots: [
    { id: "s55", t: P(5), r: FULL, f: [0.12, 0.85], z: 1.7, mv: "in", tr: "page" },
    { id: "g45", t: P(6), r: FULL, f: [0.75, 0.4], z: 1.4, mv: "pr", tr: "pop" },
    { id: "s55", t: P(7), r: FULL, f: [0.5, 0.45], mv: "pl", tr: "zoom" },
  ],
  ov: (
    <>
      <Kin x={500} y={300} text="EVERY PRICE" size={110} a={P(5, 0.4)} b={P(6)} fill={teal} rot={-3} />
      <Kin x={500} y={460} text="PUNCHED IN" size={120} a={P(5, 1.0)} b={P(6)} fill={orange} rot={2} />
      <Kin x={1400} y={250} text="ONE BOSS" size={120} a={P(6, 0.5)} b={P(7)} fill={orange} rot={-3} />
      <Kin x={1400} y={400} text="A WISH" size={150} a={P(6, 1.2)} b={P(7)} fill={teal} rot={3} />
      <Pill x={960} y={770} text="BERNARD SILVER + NORMAN JOSEPH WOODLAND" size={40} a={P(7, 0.8)} color={teal} />
      <Kin x={960} y={190} text="DREXEL, PHILADELPHIA" size={90} a={P(7, 0.3)} b={P(7, 4)} fill={orange} />
    </>
  ),
  src: <Cite text="Smithsonian Magazine + Wikipedia" a={P(6, 0.3)} b={P(8)} y={832} />,
}));

const sand = scene(8, "sand", (P) => ({
  shots: [
    { id: "g45", t: P(8), r: FULL, f: [0.3, 0.45], z: 1.3, mv: "pr", tr: "page" },
    { id: "mia", t: P(9), r: FULL, f: [0.5, 0.5], mv: "in", tr: "wl" },
    { id: "mia", t: P(10), r: FULL, f: [0.5, 0.5], z: 1.15, mv: "pl", tr: "cut" },
    { id: "pat", t: P(11), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page" },
    { id: "mia", t: P(11, 2.6), r: FULL, f: [0.3, 0.6], z: 1.3, mv: "pr", tr: "wl" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="SPECIAL INK" size={150} a={P(8, 0.3)} b={P(8, 3.0)} fill={teal} rot={-3} />
      <Pill x={960} y={790} text="FADED EASILY" size={50} a={P(8, 1.4)} b={P(9)} color={orange} />
      <Pill x={960} y={690} text="COST TOO MUCH" size={50} a={P(8, 2.8)} b={P(9)} color={orange} />
      <Kin x={1400} y={170} text="MIAMI BEACH" size={110} a={P(9, 0.3)} b={P(10)} fill={orange} rot={-3} />
      <Kin x={1400} y={300} text="TO THINK" size={130} a={P(9, 0.9)} b={P(10)} fill={teal} rot={3} />
      <Sand a={P(9, 3.2)} b={P(10)} x={1410} y={600} />
      <Pill x={1400} y={470} text="MORSE CODE" size={50} a={P(9, 1.6)} b={P(9, 3.2)} color={teal} />
      <Sand a={P(10, 0.4)} b={P(11)} x={1410} y={600} ring />
      <Kin x={1400} y={170} text="A TARGET" size={130} a={P(10, 0.3)} b={P(11)} fill={orange} rot={-3} />
      <Kin x={500} y={250} text="FILED 1949" size={110} a={P(11, 0.5)} b={P(12)} fill={teal} rot={-3} />
      <Kin x={500} y={420} text="GRANTED 1952" size={110} a={P(11, 1.3)} b={P(12)} fill={orange} rot={2} />
    </>
  ),
  simp: [P(9, 3.2), P(11)],
}));

const notReady = scene(12, "not-ready", (P) => ({
  shots: [
    { id: "eniac", t: P(12), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page" },
    { id: "eniac", t: P(12, 4.2), r: FULL, f: [0.7, 0.45], z: 1.3, mv: "pl", tr: "wl" },
  ],
  ov: (
    <>
      <Kin x={960} y={170} text="TOO EARLY" size={200} a={P(12, 0.3)} b={P(12, 4.0)} fill={orange} rot={-4} />
      <Pill x={960} y={780} text="NO FAST READERS, NO SMALL COMPUTERS" size={44} a={P(12, 1.6)} b={P(13)} color={teal} />
      <Kin x={500} y={300} text="NOT YET" size={230} a={P(12, 4.5)} b={P(13)} fill={teal} rot={-3} />
    </>
  ),
}));

const standard = scene(13, "standard", (P) => ({
  shots: [
    { id: "s55", t: P(13), r: FULL, f: [0.5, 0.45], mv: "in", tr: "page" },
    { id: "s70", t: P(15), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "wl" },
    { id: "s70", t: P(16), r: FULL, f: [0.7, 0.5], z: 1.3, mv: "in", tr: "pop" },
    { id: "s55", t: P(17), r: FULL, f: [0.5, 0.5], mv: "pr", tr: "zoom" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="THIN PROFITS" size={150} a={P(13, 0.4)} b={P(14)} fill={orange} rot={-3} />
      <Pill x={960} y={740} text="CHECKOUTS TOOK STAFF TIME" size={52} a={P(13, 2.2)} b={P(14)} color={teal} />
      <Card x={960} y={430} w={1100} h={380} a={P(14, 0.3)} b={P(15)}>
        {[-330, 0, 330].map((x, i) => (
          <g key={x} transform={`translate(${x} -20)`}>
            <g transform="translate(-95 -80)">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => (
                <rect key={k} x={k * 21} y={0} width={[6, 12, 5, 9, 14, 6, 10, 5, 12][(k + i * 3) % 9]} height={150} fill={i === 1 ? orange : ink} />
              ))}
            </g>
            <text y={125} textAnchor="middle" fontFamily="Consolas, monospace" fontWeight={700} fontSize={34} fill={teal}>
              {["A-1042", "7 7 3 9", "XQ-88"][i]}
            </text>
          </g>
        ))}
      </Card>
      <Kin x={960} y={110} text="EVERYONE'S OWN NUMBERS" size={80} a={P(14, 0.4)} b={P(15)} fill={orange} />
      <Kin x={500} y={250} text="1970" size={250} a={P(15, 0.4)} b={P(16)} fill={orange} rot={-4} />
      <Kin x={500} y={450} text="A COMMITTEE" size={110} a={P(15, 1.2)} b={P(16)} fill={teal} rot={-2} />
      <Pill x={1400} y={250} text="MAKERS: NOT YET" size={46} a={P(16, 0.6)} b={P(17)} color={orange} />
      <Pill x={1400} y={400} text="SHOPS: WORTH IT?" size={46} a={P(16, 1.6)} b={P(17)} color={teal} />
      <Card x={1400} y={500} w={520} h={520} a={P(17, 0.3)} b={P(18)} rot={2}>
        <g transform="translate(0 -30)">
          <Bull r={170} />
        </g>
        <text y={230} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontWeight={900} fontSize={56} fill={orange}>
          RCA
        </text>
      </Card>
      <Kin x={500} y={300} text="A ROUND" size={130} a={P(17, 0.4)} b={P(18)} fill={teal} rot={-3} />
      <Kin x={500} y={450} text="TARGET" size={170} a={P(17, 0.9)} b={P(18)} fill={orange} rot={3} />
    </>
  ),
  src: (
    <>
      <Cite text="Federal Reserve Bank of Richmond" a={P(13, 0.3)} b={P(14)} y={832} />
      <Cite text="Wikipedia, Universal Product Code" a={P(15, 0.3)} b={P(18)} y={832} />
      <SimpAt a={P(17, 0.3)} b={P(18)} />
    </>
  ),
  simp: [P(14, 0.3), P(15)],
}));

const rectangle = scene(18, "rectangle", (P) => ({
  shots: [
    { id: "s70", t: P(18), r: FULL, f: [0.3, 0.5], z: 1.15, mv: "pl", tr: "page", bl: 5 },
    { id: "s70", t: P(20), r: FULL, f: [0.8, 0.5], z: 1.25, mv: "pr", tr: "wl", bl: 5 },
    { id: "s55", t: P(21), r: FULL, f: [0.5, 0.45], mv: "in", tr: "page", bl: 5 },
  ],
  ov: (
    <>
      <Kin x={960} y={110} text="THE WINNER:" size={110} a={P(18, 0.3)} b={P(19)} fill={teal} />
      <Upc x={960} y={520} a={P(18, 0.9)} b={P(20)} s={1.2} />
      <Kin x={960} y={110} text="A RECTANGLE" size={130} a={P(19, 0.3)} b={P(20)} fill={orange} rot={-2} />
      <Pill x={960} y={782} text="GEORGE LAURER, IBM ENGINEER" size={50} a={P(19, 1.4)} b={P(20)} color={teal} />
      <Kin x={960} y={110} text="STRAIGHT BARS PRINT BETTER" size={80} a={P(20, 0.3)} b={P(21)} fill={orange} />
      <Card x={520} y={520} w={600} h={520} a={P(20, 0.6)} b={P(21)} rot={-2}>
        <g opacity={0.55} transform="translate(0 -30)">
          <Bull r={170} />
        </g>
        <text y={235} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontWeight={900} fontSize={54} fill={orange}>
          ROUND TARGET
        </text>
      </Card>
      <Card x={1400} y={520} w={600} h={520} a={P(20, 1.4)} b={P(21)} rot={2}>
        <g transform="translate(-230 -150) scale(0.8)">
          <Bars w={570} h={300} />
        </g>
        <text y={235} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontWeight={900} fontSize={54} fill={teal}>
          PRINTS BETTER
        </text>
      </Card>
      <Kin x={960} y={110} text="MARCH 1973" size={150} a={P(21, 0.3)} b={P(22)} fill={orange} rot={-3} />
      <Upc x={960} y={440} a={P(21, 0.3)} b={P(22)} digits s={1.1} />
      <Pill x={960} y={740} text="UNIVERSAL PRODUCT CODE" size={50} a={P(21, 1.4)} b={P(22)} color={teal} />
    </>
  ),
  src: <Cite text="Smithsonian Magazine + Wikipedia" a={P(19, 0.3)} b={P(22)} y={832} />,
  simp: [P(18, 0.3), P(22)],
}));

const firstScan = scene(22, "first-scan", (P) => ({
  shots: [
    { id: "supermarket-checkout-1976-v2", asp: 1376 / 768, t: P(22), r: FULL, f: [0.7, 0.45], z: 1.3, mv: "in", tr: "page" },
    { id: "supermarket-checkout-1976-v2", asp: 1376 / 768, t: P(23), r: FULL, f: [0.4, 0.5], z: 1.5, mv: "pl", tr: "wl" },
    { id: "gum", t: P(23, 3.2), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "pop" },
    { id: "supermarket-checkout-1976-v2", asp: 1376 / 768, t: P(24), r: FULL, f: [0.6, 0.55], z: 1.2, mv: "pr", tr: "cut" },
    { id: "scan", t: P(25), r: FULL, f: [0.5, 0.5], mv: "in", tr: "zoom" },
  ],
  ov: (
    <>
      <Kin x={1400} y={200} text="JUNE 26, 1974" size={90} a={P(22, 0.3)} b={P(23)} fill={orange} rot={-3} />
      <Pill x={1400} y={350} text="TROY, OHIO" size={56} a={P(22, 1.2)} b={P(23)} color={teal} />
      <Pill x={1400} y={480} text="MARSH SUPERMARKET" size={46} a={P(22, 2.2)} b={P(23)} color={teal} />
      <Pill x={960} y={770} text="CLYDE DAWSON + CASHIER SHARON BUCHANAN" size={44} a={P(23, 0.4)} b={P(24)} color={teal} />
      <Kin x={960} y={110} text="JUICY FRUIT" size={130} a={P(23, 1.0)} b={P(24)} fill={orange} rot={-3} />
      <Kin x={960} y={110} text="LEGEND SAYS" size={130} a={P(24, 0.3)} b={P(25)} fill={teal} rot={-2} />
      <Kin x={960} y={770} text="ON PURPOSE: SO SMALL" size={80} a={P(24, 2.6)} b={P(25)} fill={orange} />
      <Kin x={960} y={190} text="THE FIRST" size={200} a={P(25, 0.4)} fill={orange} rot={-4} />
      <Pip x={1660} y={780} a={P(25, 1.4)} s={0.9} arm="point" />
    </>
  ),
  src: <Cite text="Smithsonian Magazine + Make Tech Easier" a={P(23, 0.3)} b={P(26)} y={832} />,
}));

const fear = scene(26, "fear", (P) => ({
  shots: [
    { id: "s70", t: P(26), r: FULL, f: [0.45, 0.5], mv: "pl", tr: "page" },
    { id: "s55", t: P(27), r: FULL, f: [0.5, 0.4], mv: "in", tr: "wr" },
    { id: "s70", t: P(28), r: FULL, f: [0.6, 0.5], z: 1.4, mv: "in", tr: "wl" },
    { id: "supermarket-checkout-1976-v2", asp: 1376 / 768, t: P(29), r: FULL, f: [0.3, 0.5], mv: "pr", tr: "page" },
    { id: "s55", t: P(30), r: FULL, f: [0.5, 0.45], z: 1.3, mv: "pl", tr: "wl" },
    { id: "s70", t: P(31), r: FULL, f: [0.85, 0.5], mv: "in", tr: "wl" },
  ],
  ov: (
    <>
      <Kin x={500} y={300} text="NOT" size={130} a={P(26, 0.3)} b={P(27)} fill={teal} rot={-3} />
      <Kin x={500} y={450} text="EVERYBODY" size={130} a={P(26, 0.7)} b={P(27)} fill={orange} rot={2} />
      <Kin x={1400} y={250} text="UNIONS" size={170} a={P(27, 0.3)} b={P(28)} fill={orange} rot={3} />
      <Kin x={1400} y={430} text="FEARED FOR JOBS" size={90} a={P(27, 0.9)} b={P(28)} fill={teal} />
      <Kin x={450} y={250} text="WRONG PRICES?" size={100} a={P(28, 0.4)} b={P(29)} fill={orange} rot={-3} />
      <Kin x={500} y={420} text="TRACKING WHAT" size={90} a={P(28, 2.2)} b={P(29)} fill={teal} />
      <Kin x={500} y={530} text="PEOPLE BUY" size={110} a={P(28, 2.7)} b={P(29)} fill={teal} />
      <Kin x={500} y={130} text="1976" size={200} a={P(29, 0.3)} b={P(30)} fill={orange} rot={-3} />
      <Card x={500} y={470} w={620} h={340} a={P(29, 0.6)} b={P(30)} rot={-2}>
        <rect x={-190} y={-100} width={380} height={190} rx={22} fill="#FFE9A8" stroke={orange} strokeWidth={8} />
        <text x={0} y={5} textAnchor="middle" dominantBaseline="central" fontFamily="Segoe UI, sans-serif" fontWeight={900} fontSize={90} fill={ink}>
          PRICE
        </text>
      </Card>
      <Pill x={500} y={740} text="PRICE STICKERS MUST STAY ON" size={40} a={P(29, 1.4)} b={P(30)} color={teal} />
      <Kin x={500} y={130} text="A STRANGE RUMOUR" size={70} a={P(30, 0.3)} b={P(31)} fill={orange} rot={-2} />
      <Upc x={500} y={440} a={P(30, 0.6)} b={P(31)} hl rot={-2} />
      <Pill x={500} y={740} text="GUARD BARS = SIX, SIX, SIX?" size={40} a={P(30, 2.4)} b={P(31)} color={orange} />
      <Kin x={600} y={130} text="A COINCIDENCE" size={88} a={P(31, 0.3)} b={P(32)} fill={teal} rot={-3} />
      <Card x={600} y={450} w={720} h={300} a={P(31, 1.2)} b={P(32)} rot={1}>
        <text y={-50} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontWeight={900} fontSize={46} fill={ink}>
          GEORGE · JOSEPH · LAURER
        </text>
        <text y={70} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontWeight={900} fontSize={110} fill={orange}>
          6 · 6 · 6
        </text>
      </Card>
    </>
  ),
  src: (
    <>
      <Cite text="Federal Reserve Bank of Richmond" a={P(29, 0.3)} b={P(30)} y={832} />
      <Cite text="Wikipedia + NYT obituary of George Laurer" a={P(30, 0.3)} b={P(32)} y={832} />
    </>
  ),
  simp: [P(29, 0.3), P(32)],
}));

const everywhere = scene(32, "everywhere", (P) => ({
  shots: [
    { id: "clothing-store-1985-v2", asp: 1376 / 768, t: P(32), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "page" },
    { id: "clothing-store-1985-v2b", asp: 1376 / 768, t: P(33), r: FULL, f: [0.5, 0.5], mv: "in", tr: "wr" },
    { id: "scan", t: P(34), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "wl" },
  ],
  ov: (
    <>
      <Kin x={1440} y={190} text="THE 1980s" size={160} a={P(32, 0.3)} b={P(33)} fill={orange} rot={-3} />
      <Pill x={960} y={770} text="KMART + WALMART: BARCODES ON CLOTHES" size={44} a={P(32, 1.4)} b={P(33)} color={teal} />
      <Kin x={1400} y={300} text="SEE WHAT" size={140} a={P(33, 0.4)} b={P(34)} fill={teal} rot={-3} />
      <Kin x={1400} y={480} text="SELLS" size={190} a={P(33, 0.9)} b={P(34)} fill={orange} rot={3} />
      <Kin x={1420} y={130} text="THE NUMBERS UNDER" size={68} a={P(34, 0.3)} b={P(35)} fill={orange} />
      <Upc x={1400} y={450} a={P(34, 0.5)} b={P(35)} digits s={1} />
      <Pill x={1400} y={740} text="A BACKUP IF THE SCANNER CAN'T READ" size={36} a={P(34, 2.0)} b={P(35)} color={teal} />
    </>
  ),
  src: (
    <>
      <Cite text="Federal Reserve Bank of Richmond + Smithsonian" a={P(32, 0.3)} b={P(34)} y={832} />
      <Cite text="Wikipedia, Universal Product Code" a={P(34, 0.3)} b={P(35)} y={884} />
    </>
  ),
  simp: [P(34, 0.3), P(35)],
}));

const close = scene(35, "close", (P) => ({
  shots: [
    { id: "mia", t: P(35), r: FULL, f: [0.5, 0.55], mv: "in", tr: "cut" },
    { id: "s70", t: P(35, 2.6), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "page" },
    { id: "gum", t: P(35, 5.2), r: FULL, f: [0.5, 0.5], mv: "pr", tr: "wl" },
    { id: "pop", t: P(36), r: FULL, f: [0.5, 0.5], mv: "in", tr: "zoom" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="A DOODLE" size={150} a={P(35, 0.3)} b={P(35, 2.6)} fill={orange} rot={-3} />
      <Kin x={500} y={300} text="A COMMITTEE" size={110} a={P(35, 2.7)} b={P(35, 5.2)} fill={teal} />
      <Kin x={960} y={110} text="CHEWING GUM" size={150} a={P(35, 5.3)} b={P(36)} fill={orange} rot={3} />
      <Kin x={960} y={190} text="WHY SO PRICEY?" size={150} a={P(36, 1.0)} fill={orange} rot={-4} />
      <Pip x={1660} y={780} a={P(36, 2.0)} s={0.9} arm="point" />
    </>
  ),
}));

export const SCENES003V2: Record<string, React.FC<SceneProps>> = {
  "gum-hook": hook,
  grocery,
  sand,
  "not-ready": notReady,
  standard,
  rectangle,
  "first-scan": firstScan,
  fear,
  everywhere,
  close,
};
