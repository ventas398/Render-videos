// EM-012 v2 (kit2): patente real de Watson (dominio publico), fotos CC BY 2.0 de carros actuales, 5 imagenes ChatGPT y un dibujo vectorial del encaje.
import React from "react";
import { staticFile } from "remotion";
import { teal, orange, ink } from "./kit";
import type { SceneProps } from "./scenes";
import { FULL, Kin, Ov, Pill, Pip } from "./scenes023";
import { Cite, mkScene } from "./v2";
import { Lab } from "./scenes025";
import { T } from "./scenes009v2";

const CARD = "#FFFDF6";
const CR = "Polycart, Wikimedia Commons (CC BY 2.0)";
const WATSON_CR = "US Patent 2,479,530 (public domain)";
const WATSON_LAB = "Patent drawing, US 2,479,530 (1949)";
const scene = mkScene("em012-", {
  watson: { f: "em012-watson.jpg", asp: 0.663, cr: WATSON_CR, lab: WATSON_LAB },
  nest: { f: "em012-nested.jpg", asp: 1.5, cr: CR, lab: "Modern carts" },
  carts: { f: "em012-carts.jpg", asp: 1.5, cr: CR, lab: "Modern carts" },
}, ["baskets-1937"], []);
const W = (id: string) => ({ id, asp: 1672 / 941 });

/** Dibujo real de la patente de Watson (dominio publico) en tarjeta blanca sobre foto desenfocada; sin fondo crema. Lleva su propia pastilla de credito (una sola, nunca compite con la del fondo). */
const WatsonDoc: React.FC<{ x: number; y: number; w: number; a: number; b: number }> = ({ x, y, w, a, b }) => {
  const h = w / 0.663;
  return (
    <>
      <Ov x={x} y={y} a={a} b={b}>
        <rect x={-w / 2 + 10} y={-h / 2 + 14} width={w} height={h} rx={14} fill="#000" opacity={0.3} />
        <rect x={-w / 2 - 8} y={-h / 2 - 8} width={w + 16} height={h + 16} rx={14} fill="#fff" />
        <image href={staticFile("images/em012-watson.jpg")} x={-w / 2} y={-h / 2} width={w} height={h} preserveAspectRatio="xMidYMid slice" />
      </Ov>
      <Lab text={WATSON_LAB} a={a} b={b} y={770} />
    </>
  );
};

/** Un carro de lado: cesta, asa y ruedas. */
const Cart: React.FC<{ x: number; y: number; color: string }> = ({ x, y, color }) => (
  <g transform={`translate(${x} ${y})`} stroke={color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none">
    <path d="M -150 -80 L 150 -80 L 110 30 L -110 30 Z" fill={CARD} />
    <path d="M -150 -80 L -190 -130 H -150" />
    <path d="M -90 30 L -90 80 M 90 30 L 90 80" />
    <circle cx={-90} cy={100} r={20} fill={color} />
    <circle cx={90} cy={100} r={20} fill={color} />
  </g>
);

/** Dos carros encajados con la compuerta trasera. Esquema, no a escala. */
const Nest: React.FC<{ a: number; b?: number; s?: number }> = ({ a, b, s = 1 }) => (
  <Ov x={960} y={480} a={a} b={b} s={s}>
    <rect x={-640} y={-250} width={1280} height={500} rx={30} fill={CARD} stroke={ink} strokeWidth={6} />
    <Cart x={-60} y={10} color={teal} />
    <Cart x={80} y={10} color={orange} />
    <path d="M 215 -75 q 40 10 40 60" fill="none" stroke={ink} strokeWidth={7} strokeLinecap="round" />
    <T x={380} y={-30} s={40} w={900} fill={ink}>SWINGING</T>
    <T x={380} y={14} s={40} w={900} fill={ink}>GATE</T>
    <T x={0} y={-195} s={46} w={900} fill={teal}>ONE CART FITS INSIDE ANOTHER</T>
  </Ov>
);

const hook = scene(0, "hook", (P) => ({
  shots: [
    { id: "carts", t: 0, r: FULL, f: [0.5, 0.5], mv: "in", tr: "cut" },
    { ...W("baskets-1937"), t: P(1), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page" },
    { ...W("baskets-1937"), t: P(2), r: FULL, f: [0.85, 0.5], z: 1.25, mv: "pl", tr: "wl" },
    { ...W("folding-chair"), t: P(3), r: FULL, f: [0.5, 0.5], mv: "in", tr: "fade" },
    { ...W("baskets-1937"), t: P(4), r: FULL, f: [0.1, 0.4], z: 1.5, mv: "in", tr: "zoom" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="YOU GRABBED A CART" size={130} fill={teal} a={P(0, 0.2)} b={P(0, 2.8)} rot={-3} />
      <Kin x={960} y={350} text="NOBODY CONVINCED YOU" size={110} fill={orange} a={P(0, 2.6)} b={P(1)} rot={3} />
      <Kin x={960} y={560} text="1937" size={220} fill={orange} a={P(1, 0.3)} b={P(2)} rot={-3} />
      <Pill x={960} y={780} text="SHOPPERS DID NOT WANT THEM" size={56} color={teal} a={P(1, 2.0)} b={P(2)} />
      <Kin x={960} y={480} text="THE CREDITED INVENTOR" size={100} fill={teal} a={P(2, 0.3)} b={P(2, 3.0)} rot={-3} />
      <Kin x={960} y={480} text="HIRED PEOPLE TO PUSH IT" size={100} fill={orange} a={P(2, 3.2)} b={P(3)} rot={3} />
      <Kin x={960} y={520} text="DID SHOPPERS LOVE IT?" size={100} fill={teal} a={P(3, 0.3)} b={P(3, 3.0)} rot={-3} />
      <Kin x={960} y={350} text="BLUNT ANSWER" size={130} fill={orange} a={P(3, 3.2)} b={P(4)} rot={3} />
      <Kin x={960} y={190} text="WHY?" size={230} fill={orange} rot={-4} a={P(4, 0.6)} />
      <Pip x={1660} y={780} a={P(4, 1.4)} s={0.9} arm="chin" />
    </>
  ),
}));

const problem = scene(5, "problem", (P) => ({
  shots: [
    { ...W("baskets-1937"), t: P(5), r: FULL, f: [0.1, 0.5], z: 1.5, mv: "in", tr: "page" },
    { ...W("baskets-1937"), t: P(6, 4.0), r: FULL, f: [0.4, 0.5], z: 1.3, mv: "in", tr: "pop" },
    { ...W("folding-chair"), t: P(7), r: FULL, f: [0.5, 0.5], mv: "in", tr: "wl" },
    { ...W("folding-chair"), t: P(8), r: FULL, f: [0.7, 0.5], z: 1.3, mv: "pr", tr: "wr" },
  ],
  ov: (
    <>
      <Kin x={960} y={560} text="BEFORE CARTS" size={150} fill={orange} a={P(5, 0.2)} b={P(6)} rot={-3} />
      <Pill x={960} y={780} text="ONLY WHAT YOU CAN CARRY" size={56} color={teal} a={P(5, 1.2)} b={P(6)} />
      <Kin x={960} y={560} text="SYLVAN GOLDMAN" size={130} fill={teal} a={P(6, 0.3)} b={P(6, 3.6)} rot={-3} />
      <Pill x={960} y={780} text="OKLAHOMA SUPERMARKET CHAIN" size={52} color={orange} a={P(6, 1.0)} b={P(6, 3.6)} />
      <Kin x={500} y={250} text="THE GREAT" size={110} fill={orange} a={P(6, 4.4)} b={P(7)} rot={-3} />
      <Kin x={500} y={400} text="DEPRESSION" size={110} fill={teal} a={P(6, 5.0)} b={P(7)} rot={3} />
      <Pill x={500} y={620} text="ARMS FULL = STOP BUYING" size={48} color={orange} a={P(6, 7.0)} b={P(7)} />
      <Kin x={960} y={190} text="1936: A FOLDING CHAIR" size={110} fill={orange} a={P(7, 0.2)} b={P(8)} rot={-3} />
      <Pill x={960} y={640} text="REPORTEDLY" size={52} color={orange} a={P(7, 1.2)} b={P(7, 3.0)} />
      <Pill x={960} y={640} text="BASKETS ADDED" size={56} color={teal} a={P(7, 3.0)} b={P(8)} />
      <Pill x={960} y={780} text="WHEELS ON THE LEGS" size={56} color={orange} a={P(7, 5.0)} b={P(8)} />
      <Kin x={500} y={250} text="WITH FRED YOUNG" size={78} fill={teal} a={P(8, 0.3)} b={P(9)} rot={-3} />
      <Pill x={500} y={440} text="TWO WIRE BASKETS" size={52} color={teal} a={P(8, 2.4)} b={P(9)} />
    </>
  ),
  src: <Cite text="NPR + Wikipedia" a={P(5, 0.3)} b={P(9)} y={832} />,
}));

const launch = scene(9, "launch", (P) => ({
  shots: [
    { ...W("baskets-1937"), t: P(9), r: FULL, f: [0.3, 0.5], mv: "in", tr: "page" },
    { ...W("folding-chair"), t: P(10), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "fade" },
    { ...W("baskets-1937"), t: P(11), r: FULL, f: [0.2, 0.5], z: 1.4, mv: "in", tr: "wl" },
    { ...W("baskets-1937"), t: P(12), r: FULL, f: [0.6, 0.5], z: 1.3, mv: "pr", tr: "pop" },
    { ...W("baskets-1937"), t: P(13), r: FULL, f: [0.7, 0.5], mv: "pl", tr: "wr" },
  ],
  ov: (
    <>
      <Kin x={960} y={560} text="JUNE 1937" size={150} fill={orange} a={P(9, 0.3)} b={P(10)} rot={-3} />
      <Pill x={960} y={690} text="OKLAHOMA CITY" size={60} color={teal} a={P(9, 1.5)} b={P(10)} />
      <Pill x={960} y={790} text="ONE OF THE FIRST CARTS" size={52} color={orange} a={P(9, 3.5)} b={P(10)} />
      <Kin x={960} y={190} text="NO BASKET" size={150} fill={teal} a={P(10, 0.3)} b={P(11)} rot={-3} />
      <Kin x={960} y={350} text="CARRYING PLAN" size={130} fill={orange} a={P(10, 1.2)} b={P(11)} rot={3} />
      <Kin x={960} y={470} text="SHOPPERS SAID NO" size={130} fill={orange} a={P(11, 0.3)} b={P(12)} rot={-3} />
      <Pill x={960} y={640} text="MEN: 'EFFEMINATE'" size={56} color={teal} a={P(11, 2.4)} b={P(12)} />
      <Pill x={960} y={780} text="WOMEN: 'A BABY CARRIAGE'" size={56} color={orange} a={P(11, 4.2)} b={P(12)} />
      <Kin x={500} y={250} text="ANOTHER ACCOUNT:" size={90} fill={teal} a={P(12, 0.3)} b={P(13)} rot={-3} />
      <Pill x={500} y={440} text="SHOPPERS: WE CAN MANAGE" size={44} color={orange} a={P(12, 2.0)} b={P(13)} />
      <Pill x={500} y={570} text="A BASKET ON WHEELS?" size={48} color={teal} a={P(12, 4.0)} b={P(13)} />
      <Kin x={960} y={560} text="1977 INTERVIEW" size={120} fill={teal} a={P(13, 0.3)} b={P(13, 4.4)} rot={-3} />
      <Kin x={960} y={565} text="'THAT'S A BIG LIE'" size={130} fill={orange} a={P(13, 4.6)} b={P(14)} rot={3} />
      <Pill x={960} y={700} text="GOLDMAN, AS REPORTED BY NPR" size={52} color={teal} a={P(13, 5.0)} b={P(14)} />
    </>
  ),
  src: <Cite text="NPR + Wikipedia + Metropolitan Library (OK)" a={P(9, 0.3)} b={P(14)} y={832} />,
}));

const persuade = scene(14, "persuade", (P) => ({
  shots: [
    { ...W("baskets-1937"), t: P(14), r: FULL, f: [0.6, 0.4], z: 1.15, mv: "in", tr: "page" },
    { ...W("baskets-1937"), t: P(14, 3.0), r: FULL, f: [0.85, 0.5], z: 1.3, mv: "pl", tr: "wl" },
    { ...W("folding-chair"), t: P(15), r: FULL, f: [0.8, 0.5], z: 1.3, mv: "pl", tr: "pop" },
    { ...W("baskets-1937"), t: P(16), r: FULL, f: [0.15, 0.6], z: 1.3, mv: "pr", tr: "fade" },
    { ...W("folding-chair"), t: P(17), r: FULL, f: [0.3, 0.6], z: 1.25, mv: "in", tr: "wl" },
    { ...W("folding-chair"), t: P(18), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "wr" },
  ],
  ov: (
    <>
      <Kin x={960} y={480} text="SO HE TURNED TO THEATER" size={100} fill={orange} a={P(14, 0.3)} b={P(15)} rot={-3} />
      <Pill x={960} y={650} text="HIRED MODELS AND ACTORS" size={56} color={teal} a={P(14, 2.0)} b={P(15)} />
      <Pill x={960} y={780} text="TO PUSH CARTS AROUND" size={52} color={orange} a={P(14, 4.6)} b={P(15)} />
      <Kin x={500} y={250} text="AND GREETERS" size={130} fill={teal} a={P(15, 0.3)} b={P(16)} rot={-3} />
      <Pill x={500} y={440} text="TO EXPLAIN HOW IT WORKS" size={44} color={orange} a={P(15, 1.4)} b={P(16)} />
      <Kin x={960} y={600} text="OUR READING" size={120} fill={teal} a={P(16, 0.2)} b={P(17)} rot={-3} />
      <Kin x={960} y={720} text="SEEING OTHERS USE IT" size={84} fill={orange} a={P(16, 1.2)} b={P(16, 3.8)} rot={3} />
      <Kin x={960} y={720} text="MADE IT FEEL NORMAL" size={84} fill={orange} a={P(16, 3.8)} b={P(17)} rot={3} />
      <Pill x={960} y={840} text="SOURCES: THEN IT CAUGHT ON" size={48} color={teal} a={P(16, 4.6)} b={P(17)} />
      <Kin x={1420} y={250} text="IT CAUGHT ON" size={110} fill={teal} a={P(17, 0.3)} b={P(18)} rot={-3} />
      <Pill x={1420} y={440} text="ROYALTIES" size={56} color={orange} a={P(17, 2.4)} b={P(18)} />
      <Pill x={1420} y={570} text="A MULTIMILLIONAIRE" size={56} color={teal} a={P(17, 3.6)} b={P(18)} />
      <Pill x={1420} y={700} text="REPORTEDLY" size={48} color={orange} a={P(17, 4.4)} b={P(18)} />
      <Kin x={960} y={190} text="1977: HE ALSO SAID" size={110} fill={teal} a={P(18, 0.3)} b={P(19)} rot={-3} />
      <Kin x={960} y={350} text="SOMEBODY ELSE WOULD HAVE" size={90} fill={orange} a={P(18, 2.2)} b={P(19)} rot={3} />
    </>
  ),
  src: <Cite text="NPR + Wikipedia" a={P(14, 0.3)} b={P(19)} y={832} />,
}));

const nest = scene(19, "nest", (P) => ({
  shots: [
    { ...W("baskets-1937"), t: P(19), r: FULL, f: [0.3, 0.6], z: 1.15, mv: "in", tr: "page" },
    { ...W("baskets-1937"), t: P(19, 3.0), r: FULL, f: [0.85, 0.5], z: 1.3, mv: "pl", tr: "wl" },
    { ...W("baskets-1937"), t: P(20), r: FULL, f: [0, 0.5], z: 1.6, mv: "pl", tr: "fade", bl: 3 },
    { ...W("baskets-1937"), t: P(21), r: FULL, f: [0.5, 0.5], bl: 10, mv: "in", tr: "pop" },
    { ...W("folding-chair"), t: P(21, 2.6), r: FULL, f: [0.3, 0.5], z: 1.2, mv: "pr", tr: "wl" },
    { ...W("baskets-1937"), t: P(22), r: FULL, f: [0.6, 0.5], bl: 10, mv: "pr", tr: "wl" },
    { ...W("baskets-1937"), t: P(22, 2.6), r: FULL, f: [0.4, 0.5], z: 1.3, mv: "pl", tr: "wl" },
    { ...W("folding-chair"), t: P(23), r: FULL, f: [0.6, 0.5], mv: "in", tr: "wr" },
  ],
  ov: (
    <>
      <Kin x={960} y={590} text="SUCCESS, THEN A PROBLEM" size={100} fill={orange} a={P(19, 0.3)} b={P(20)} rot={-3} />
      <Pill x={960} y={750} text="TWO-BASKET CARTS TOOK TOO MUCH SPACE" size={44} color={teal} a={P(19, 2.0)} b={P(20)} />
      <Kin x={960} y={100} text="ORLA WATSON" size={100} fill={teal} a={P(20, 0.3)} b={P(21)} rot={-3} />
      <Nest a={P(20, 2.0)} b={P(21)} s={0.72} />
      <Pill x={960} y={850} text="KANSAS CITY INVENTOR" size={44} color={orange} a={P(20, 0.8)} b={P(20, 4.4)} />
      <Pill x={960} y={780} text="A GATE LETS CARTS NEST" size={52} color={orange} a={P(20, 4.6)} b={P(21)} />
      <WatsonDoc x={960} y={470} w={520} a={P(21)} b={P(22, 2.6)} />
      <Kin x={500} y={250} text="1946" size={200} fill={orange} a={P(21, 0.5)} b={P(22)} rot={-3} />
      <Pill x={500} y={470} text="WATSON INTRODUCES HIS DESIGN" size={38} color={teal} a={P(21, 0.8)} b={P(22)} />
      <Pill x={500} y={600} text="GOLDMAN: A SIMILAR DESIGN, LATER" size={34} color={orange} a={P(21, 3.0)} b={P(22)} />
      <Kin x={1400} y={190} text="THE DISPUTE" size={110} fill={teal} a={P(22, 0.2)} b={P(23)} rot={-3} />
      <Pill x={1400} y={400} text="WATSON: THE PATENT" size={50} color={orange} a={P(22, 1.6)} b={P(23)} />
      <Pill x={1400} y={530} text="GOLDMAN: A LICENSE" size={50} color={teal} a={P(22, 3.4)} b={P(23)} />
      <Kin x={960} y={190} text="THE EXACT TERMS?" size={110} fill={orange} a={P(23, 0.3)} b={P(24)} rot={-3} />
      <Kin x={960} y={350} text="SOURCES DIFFER" size={130} fill={teal} a={P(23, 1.6)} b={P(24)} rot={3} />
    </>
  ),
  src: <Cite text="NPR + Wikipedia" a={P(19, 0.3)} b={P(24)} y={832} />,
  simp: [P(20, 2.0), P(21)],
}));

const why = scene(24, "why", (P) => ({
  shots: [
    { id: "nest", t: P(24), r: FULL, f: [0.5, 0.5], mv: "in", tr: "page" },
    { ...W("baskets-1937"), t: P(25), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "fade" },
    { ...W("baskets-1937"), t: P(26), r: FULL, f: [0.4, 0.5], z: 1.3, mv: "in", tr: "wl" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="OUR READING" size={120} fill={teal} a={P(24, 0.2)} b={P(24, 2.6)} rot={-3} />
      <Kin x={960} y={190} text="NESTED CARTS SAVE SPACE" size={100} fill={orange} a={P(24, 2.8)} b={P(25)} rot={3} />
      <Pill x={960} y={780} text="EASIER TO MOVE IN A ROW" size={52} color={teal} a={P(24, 3.2)} b={P(25)} />
      <Kin x={960} y={510} text="ANDREW WARNES, LEEDS" size={100} fill={orange} a={P(25, 0.3)} b={P(26)} rot={-3} />
      <Pill x={960} y={640} text="CARS + FREEZERS + CARTS" size={52} color={teal} a={P(25, 2.6)} b={P(26)} />
      <Pill x={960} y={760} text="HE ARGUES: HELPED FUEL IMPULSE BUYING" size={46} color={orange} a={P(25, 5.0)} b={P(26)} />
      <Kin x={1400} y={250} text="CARRY MORE," size={110} fill={teal} a={P(26, 0.3)} b={P(27)} rot={-3} />
      <Kin x={1400} y={400} text="BUY MORE?" size={130} fill={orange} a={P(26, 1.4)} b={P(27)} rot={3} />
      <Pill x={1400} y={600} text="AN ARGUMENT, NOT A NUMBER" size={44} color={teal} a={P(26, 3.8)} b={P(27)} />
    </>
  ),
  src: <Cite text="NPR (Andrew Warnes, University of Leeds)" a={P(25, 0.3)} b={P(27)} y={832} />,
}));

const practical = scene(27, "practical", (P) => ({
  shots: [
    { id: "nest", t: P(27), r: FULL, f: [0.4, 0.5], mv: "in", tr: "page" },
    { id: "carts", t: P(27, 4.0), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "fade" },
    { ...W("baskets-1937"), t: P(28), r: FULL, f: [0.5, 0.5], bl: 10, mv: "in", tr: "pop" },
    { ...W("baskets-1937"), t: P(28, 2.6), r: FULL, f: [0.8, 0.5], z: 1.3, mv: "pl", tr: "wl" },
  ],
  ov: (
    <>
      <Kin x={960} y={190} text="NEXT TIME YOU TAKE A CART" size={90} fill={teal} a={P(27, 0.2)} b={P(27, 3.6)} rot={-3} />
      <Kin x={960} y={190} text="LOOK AT THE BACK" size={130} fill={orange} a={P(27, 3.8)} b={P(28)} rot={3} />
      <Pill x={960} y={640} text="ON MANY CARTS" size={52} color={orange} a={P(27, 3.6)} b={P(28)} />
      <Pill x={960} y={780} text="THE BASKET SWINGS OPEN" size={56} color={teal} a={P(27, 4.6)} b={P(28)} />
      <WatsonDoc x={960} y={540} w={480} a={P(28)} b={P(29)} />
      <Kin x={470} y={320} text="THAT SWINGING GATE" size={72} fill={teal} a={P(28, 0.3)} b={P(29)} rot={-3} />
      <Pill x={500} y={440} text="TRACES BACK TO THE 1940S" size={44} color={orange} a={P(28, 1.6)} b={P(29)} />
      <Pill x={500} y={570} text="THE NESTING DESIGN" size={52} color={teal} a={P(28, 2.8)} b={P(29)} />
    </>
  ),
  src: <Cite text="NPR + Wikipedia" a={P(28)} b={P(29)} y={832} />,
}));

const close = scene(29, "close", (P) => ({
  shots: [
    { ...W("folding-chair"), t: P(29), r: FULL, f: [0.5, 0.5], mv: "in", tr: "cut" },
    { id: "carts", t: P(29, 3.4), r: FULL, f: [0.5, 0.5], mv: "pr", tr: "fade" },
    { ...W("baskets-1937"), t: P(30), r: FULL, f: [0.5, 0.5], mv: "pl", tr: "wl" },
    { id: "nest", t: P(31), r: FULL, f: [0.5, 0.5], mv: "in", tr: "zoom" },
  ],
  ov: (
    <>
      <Kin x={960} y={470} text="FIRST: REFUSED" size={140} fill={orange} a={P(29, 0.3)} b={P(29, 3.4)} rot={-3} />
      <Kin x={960} y={190} text="NOW: NO SUPERMARKET" size={110} fill={teal} a={P(29, 3.6)} b={P(30)} rot={-3} />
      <Kin x={960} y={350} text="WITHOUT ONE" size={130} fill={orange} a={P(29, 4.8)} b={P(30)} rot={3} />
      <Kin x={960} y={340} text="A GOOD IDEA" size={130} fill={teal} a={P(30, 0.3)} b={P(30, 3.6)} rot={-3} />
      <Kin x={960} y={470} text="DOESN'T ALWAYS SELL ITSELF" size={90} fill={orange} a={P(30, 1.4)} b={P(30, 3.6)} rot={3} />
      <Kin x={960} y={340} text="THE CALENDAR ON YOUR WALL" size={100} fill={teal} a={P(30, 4.2)} b={P(31)} rot={-3} />
      <Kin x={960} y={190} text="WHY ONLY 28 DAYS?" size={130} fill={orange} a={P(31, 0.2)} rot={-3} />
      <Pip x={1660} y={780} a={P(31, 1.0)} s={0.9} arm="point" />
    </>
  ),
}));

export const SCENES012V2: Record<string, React.FC<SceneProps>> = { hook, problem, launch, persuade, nest, why, practical, close };
