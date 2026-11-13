// EM-031 (zoo de Paris 1870): kit2 (mkScene). 17 imagenes ChatGPT em031-* ("Illustrative image" automatico). Sin diagramas: no lleva "Simplified illustration".
// Subtitulos/rotulos: un rotulo corto por parte (cap), sellos D/P/M y "NO EVIDENCE FOUND" como pastilla.
import React from "react";
import { orange, teal } from "./kit";
import type { SceneProps } from "./scenes";
import { FULL, Kin, Pill, Reading } from "./scenes023";
import { Stp } from "./scenes025";
import { Cite, mkScene } from "./v2";

const scene = mkScene("em031-", {}, ["paris-street-dec-1870-v2", "paris-street-dec-1870-v2b", "paris-boulevard-31dec1870-v2", "paris-boulevard-31dec1870-v2b"]);
const W = (id: string, t: number, f: [number, number], mv: string, tr: string, z?: number) => ({ id, asp: 1672 / 941, t, r: FULL, f, mv, tr, ...(z ? { z } : {}) }) as never;
const N = (id: string, t: number, mv: string, tr: string, f: [number, number] = [0.5, 0.5], z?: number) => ({ id, asp: 1376 / 768, t, r: FULL, f, mv, tr, ...(z ? { z } : {}) }) as never;
type PF = (part: number, o?: number) => number;

/** Rotulo corto de la parte n (tamano segun longitud); i = 0 arriba, 1 debajo. */
const cap = (P: PF, n: number, text: string, i = 0, m = n + 1, dy = 0) => (
  <Kin key={`${n}${i}`} x={960} y={(i ? 340 : 190) + dy} text={text} size={Math.max(66, Math.min(150, Math.round(2250 / text.length)))} fill={(n + i) % 2 ? orange : teal} a={P(n, 0.2 + i * 1.1)} b={P(m)} rot={(n + i) % 2 ? 3 : -3} />
);
/** Rotulo en dos lineas a un lado (x), para no tapar la cabeza del animal. */
const side = (P: PF, n: number, x: number, l1: string, l2: string) => [l1, l2].map((t, i) => (
  <Kin key={`s${n}${i}`} x={x} y={i ? 400 : 250} text={t} size={84} fill={(n + i) % 2 ? orange : teal} a={P(n, 0.2 + i * 0.6)} b={P(n + 1)} rot={(n + i) % 2 ? 3 : -3} />
));
const pill = (P: PF, n: number, text: string, y = 150, m = n + 1, size = 56) => <Pill key={`p${n}${text}`} x={960} y={y} text={text} size={size} color={n % 2 ? orange : teal} a={P(n, 0.2)} b={P(m)} />;
const none = (P: PF, n: number) => <Pill key={`n${n}`} x={1380} y={520} text="NO EVIDENCE FOUND" size={56} color={orange} a={P(n, 0.2)} b={P(n + 1)} />;
const SRC = { lab: "Labouchère, Diary of the Besieged Resident (1871)", gon: "Goncourt, Journal", hug: "Hugo, Choses vues (notebooks)" };

const ch01 = scene(0, "ch01", (P) => ({
  shots: [N("paris-street-dec-1870-v2", 0, "in", "cut"), W("empty-counter-scale", P(3), [0.5, 0.5], "in", "page"), W("empty-zoo-winter", P(5), [0.5, 0.5], "pr", "wl"), W("research-desk-cards", P(7), [0.5, 0.5], "in", "page")],
  ov: (
    <>
      {pill(P, 0, "CHRISTMAS DAY, 1870")}
      {cap(P, 0, "ELEPHANT SOUP?", 1)}
      {cap(P, 1, "ROAST CAMEL")}
      {cap(P, 2, "A CAT, SURROUNDED BY RATS", 0, 3)}
      {cap(P, 3, "SOUNDS LIKE A JOKE")}
      {cap(P, 4, "THE HUNGER WAS NOT")}
      {cap(P, 5, "ALL PARIS ATE THE ZOO?")}
      {cap(P, 5, "ONLY HALF TRUE", 1)}
      {cap(P, 6, "DID PARIS EAT THE ZOO?")}
      {cap(P, 7, "AND WHO GOT TO EAT IT?")}
      {cap(P, 8, "WE MARK EVERY CLAIM")}
      <Stp x={560} y={700} k="D" size={46} a={P(8, 1.2)} b={P(9)} />
      <Stp x={960} y={700} k="P" size={46} a={P(8, 2.4)} b={P(9)} />
      <Stp x={1360} y={700} k="M" size={46} a={P(8, 3.6)} b={P(9)} />
      {cap(P, 9, "THE EVERYDAY MYSTERY")}
    </>
  ),
}));

const ch02 = scene(10, "ch02", (P) => ({
  shots: [N("paris-street-dec-1870-v2b", P(10), "in", "cut"), W("journal-desk", P(14), [0.5, 0.5], "in", "page"), N("paris-street-dec-1870-v2", P(19), "pl", "wl", [0.85, 0.62], 1.6), W("dark-bread", P(23), [0.5, 0.5], "in", "page"), W("research-desk-cards", P(27), [0.5, 0.5], "pr", "zoom"), N("paris-boulevard-31dec1870-v2", P(28), "out", "fade")],
  ov: (
    <>
      {cap(P, 10, "FIRST, THE SIEGE")}
      {pill(P, 11, "SEPTEMBER 19, 1870")}
      {cap(P, 11, "THE RING CLOSES", 1)}
      {cap(P, 12, "ARMISTICE: JAN 28")}
      {cap(P, 13, "OVER 4 MONTHS")}
      {pill(P, 13, "OUR CALCULATION: 131 DAYS", 340)}
      {cap(P, 14, "VICTOR HUGO'S NOTES")}
      {cap(P, 15, "“WE EAT HORSE IN EVERY FORM”")}
      {cap(P, 16, "TWO MORE DIARISTS")}
      {cap(P, 17, "GONCOURT, NOVELIST")}
      {cap(P, 18, "LABOUCHÈRE, JOURNALIST")}
      {cap(P, 19, "MEAT: 100 G")}
      {cap(P, 19, "QUEUES OF ~2 HOURS", 1, 20)}
      {cap(P, 20, "MID-NOVEMBER: 30 G")}
      {cap(P, 21, "ALMOST EVERY DISTRICT")}
      {cap(P, 22, "ABOUT ONE OUNCE")}
      {cap(P, 23, "JANUARY: STRAW IN THE BREAD")}
      {cap(P, 24, "DARK, HEAVY, GRITTY")}
      {cap(P, 25, "BREAD: 300 G, HALF FOR KIDS")}
      {cap(P, 26, "EVEN HUGO'S HENS REFUSED IT")}
      {cap(P, 27, "DEATHS MORE THAN DOUBLED")}
      {pill(P, 27, "IN ONE POOR DISTRICT", 340)}
      {cap(P, 28, "ON HUNGER, THE RECORD IS CLEAR")}
      {cap(P, 29, "HUNGER: REAL")}
      <Stp x={1380} y={520} k="D" size={70} a={P(29, 0.2)} />
    </>
  ),
  src: (
    <>
      <Cite text={SRC.hug} a={P(14)} b={P(16)} y={832} />
      <Cite text={SRC.lab} a={P(19)} b={P(23)} y={832} />
      <Cite text={SRC.gon} a={P(23)} b={P(24)} y={832} />
      <Cite text={SRC.lab} a={P(24)} b={P(26)} y={832} />
      <Cite text={SRC.hug} a={P(26)} b={P(27)} y={832} />
      <Cite text="Cogneau et al., Population, 2021" a={P(27)} b={P(28)} y={832} />
    </>
  ),
}));

const ch03 = scene(30, "ch03", (P) => ({
  shots: [N("paris-street-dec-1870-v2", P(30), "in", "cut", [0.17, 0.55], 1.9), N("paris-street-dec-1870-v2b", P(34), "in", "page", [0.45, 0.6], 1.4), W("plain-silver-discs", P(36), [0.5, 0.5], "in", "zoom"), W("journal-desk", P(38), [0.5, 0.5], "in", "wl"), W("empty-counter-scale", P(39), [0.5, 0.5], "pr", "page")],
  ov: (
    <>
      {side(P, 30, 1470, "WHAT WAS", "ON THE PLATE?")}
      {side(P, 31, 1470, "HORSE, THEN", "DONKEY, MULE")}
      {side(P, 32, 1470, "HORSE CREEPS", "INTO COOKING")}
      {side(P, 33, 1470, "DONKEY: FIRM", "AND SAVORY")}
      {cap(P, 34, "A BUTCHER OF DOGS, CATS, RATS")}
      {cap(P, 35, "CUSTOMERS LOOKED AROUND")}
      {cap(P, 36, "RATS HAD A PRICE TOO")}
      {cap(P, 37, "40 CENTIMES TO 1.5 FRANCS")}
      {cap(P, 38, "“WE ARE EATING THE UNKNOWN”")}
      {cap(P, 39, "HOW MANY ATE THEM?")}
      {cap(P, 40, "NO COUNT FOUND")}
      {cap(P, 41, "DOGS, CATS, RATS")}
      <Stp x={1380} y={520} k="D" size={70} a={P(41, 0.5)} />
    </>
  ),
  src: (
    <>
      <Cite text={SRC.gon} a={P(32)} b={P(33)} y={832} />
      <Cite text={SRC.lab} a={P(33)} b={P(36)} y={832} />
      <Cite text={SRC.hug} a={P(38)} b={P(39)} y={832} />
    </>
  ),
}));

const ch04 = scene(42, "ch04", (P) => ({
  shots: [W("empty-zoo-winter", P(42), [0.5, 0.5], "in", "cut"), N("bronze-oil-lamp-library-v2", P(45), "in", "page"), W("soup-cauldron", P(48), [0.5, 0.5], "in", "fade")],
  ov: (
    <>
      {cap(P, 42, "AND THEN, THE ZOO")}
      {cap(P, 43, "JARDIN D'ACCLIMATATION")}
      {cap(P, 44, "“FORCED TO SACRIFICE ITS ANIMALS”")}
      {cap(P, 45, "DEC 5: ALMOST ALL EATEN")}
      {cap(P, 46, "~7 FRANCS A POUND")}
      {cap(P, 47, "12 FRANCS A POUND")}
      {cap(P, 48, "TO THE HIGHEST BIDDER")}
      {cap(P, 49, "THE ZOO ENDED ON PLATES")}
      {cap(P, 50, "THE ZOO ON PLATES")}
      <Stp x={1380} y={520} k="D" size={70} a={P(50, 0.5)} />
    </>
  ),
  src: (
    <>
      <Cite text="Jardin d'Acclimatation, official history" a={P(44)} b={P(45)} y={832} />
      <Cite text={SRC.lab} a={P(45)} b={P(48)} y={832} />
      <Cite text="City of Paris (paris.fr)" a={P(48)} b={P(49)} y={832} />
    </>
  ),
}));

const ch05 = scene(51, "ch05", (P) => ({
  shots: [
    W("elephant-snow", P(51), [0.5, 0.5], "in", "cut"), N("paris-boulevard-31dec1870-v2b", P(52), "pl", "page"), W("soup-cauldron", P(55), [0.5, 0.5], "in", "wl"), W("journal-desk", P(56), [0.5, 0.5], "in", "page"),
    W("elephant-snow", P(60), [0.3, 0.5], "pr", "zoom"), W("research-desk-cards", P(62), [0.5, 0.5], "in", "page"), N("bronze-oil-lamp-library-v2", P(67), "in", "wl"), W("paris-rooftops-snow", P(69), [0.5, 0.5], "in", "fade"),
    N("paris-street-dec-1870-v2b", P(72), "in", "page"), W("pink-card", P(73), [0.5, 0.5], "in", "zoom"), N("bronze-oil-lamp-library-v2b", P(76), "in", "page"), W("research-desk-cards", P(79), [0.5, 0.5], "in", "wl"), W("pink-card", P(83), [0.5, 0.5], "in", "fade"),
  ],
  ov: (
    <>
      {cap(P, 51, "CASTOR AND POLLUX")}
      {cap(P, 52, "BOULEVARD HAUSSMANN")}
      {cap(P, 53, "DEC 31: POLLUX'S TRUNK")}
      {cap(P, 54, "40 FRANCS A POUND")}
      {cap(P, 55, "THE ELEPHANT SAUSAGE")}
      {cap(P, 56, "JAN 5: A SLICE OF POLLUX")}
      {cap(P, 57, "TOUGH, COARSE, OILY")}
      {cap(P, 58, "NOT FOR ENGLISH FAMILIES")}
      {cap(P, 59, "TRUNKS: 45 FRANCS A POUND")}
      {cap(P, 60, "“WE ATE AN ELEPHANT STEAK”")}
      {cap(P, 61, "ELEPHANT ON A PLATE")}
      <Stp x={1380} y={520} k="D" size={70} a={P(61, 0.5)} b={P(62)} />
      {cap(P, 62, "BUT THE STORY GETS TANGLED")}
      {cap(P, 63, "WHICH GARDEN?")}
      {cap(P, 64, "GONCOURT: ACCLIMATATION")}
      {cap(P, 65, "HUGO: JARDIN DES PLANTES")}
      {cap(P, 66, "EVEN MODERN SOURCES SPLIT")}
      {cap(P, 67, "ACCLIMATATION: THEY WERE THEIRS")}
      {cap(P, 68, "PARIS: MOVED TO THE PLANTES")}
      {cap(P, 69, "WHEN DID THEY DIE?")}
      {cap(P, 70, "LATE NOV TO END OF DEC")}
      {cap(P, 71, "ONLY PROOF: DEAD BY DEC 31")}
      {cap(P, 72, "THE FAMOUS CHRISTMAS CARD")}
      {cap(P, 73, "VOISIN MENU, DEC 25")}
      {cap(P, 74, "DAY 99, SAYS THE CARD")}
      {cap(P, 75, "ELEPHANT, CAMEL, CAT AND RATS")}
      {cap(P, 76, "WORDS FROM A 1911 GUIDEBOOK")}
      {cap(P, 77, "A PINK SOUVENIR CARD")}
      {cap(P, 78, "THE DATES DON'T FIT")}
      {cap(P, 79, "THREE IDEAS")}
      {cap(P, 80, "THE DATE IS WRONG?")}
      {cap(P, 81, "ANOTHER ELEPHANT?")}
      {cap(P, 82, "A LATER SOUVENIR?")}
      {cap(P, 83, "NO ORIGINAL FOUND")}
      {cap(P, 84, "THE CHRISTMAS SOUP")}
      <Stp x={1380} y={520} k="P" size={70} a={P(84, 0.5)} />
      <Pill x={960} y={700} text="NOT THE REAL CARD" size={44} color={teal} a={P(73)} b={P(76)} />
      <Pill x={960} y={700} text="NOT THE REAL CARD" size={44} color={teal} a={P(83)} b={P(85)} />
    </>
  ),
  src: (
    <>
      <Cite text={SRC.gon} a={P(52)} b={P(56)} y={832} />
      <Cite text={SRC.lab} a={P(56)} b={P(60)} y={832} />
      <Cite text={SRC.hug} a={P(60)} b={P(61)} y={832} />
      <Cite text="Jardin d'Acclimatation; City of Paris" a={P(67)} b={P(69)} y={832} />
      <Cite text="Newnham-Davis, Gourmet's Guide to Europe (1911)" a={P(76)} b={P(78)} y={832} />
    </>
  ),
}));

const ch06 = scene(85, "ch06", (P) => ({
  shots: [N("bronze-oil-lamp-library-v2", P(85), "in", "cut"), W("research-desk-cards", P(88), [0.5, 0.5], "pl", "page"), N("paris-street-dec-1870-v2b", P(91), "in", "wl")],
  ov: (
    <>
      {cap(P, 85, "WAS IT PROPAGANDA?")}
      {cap(P, 86, "A MESSAGE OF DEFIANCE?")}
      {cap(P, 87, "PROOF: AN ORDER, A POSTER")}
      {cap(P, 88, "IN WHAT WE COULD OPEN: NONE")}
      {cap(P, 89, "FRENCH ARCHIVES: CLOSED TO US")}
      {cap(P, 90, "A GAP IN OUR SEARCH")}
      {cap(P, 91, "BUFFALO, ANTELOPE, KANGAROO")}
      <Reading x={960} y={700} a={P(92, 0.2)} b={P(93)} />
      {cap(P, 92, "BUSINESS AND THEATER")}
      {cap(P, 93, "A STRANGE DISH FILLS A TABLE")}
      {cap(P, 94, "PROPAGANDA")}
      {none(P, 94)}
    </>
  ),
  src: <Cite text={SRC.gon} a={P(91)} b={P(92)} y={832} />,
}));

const ch07 = scene(95, "ch07", (P) => ({
  shots: [W("plain-silver-discs", P(95), [0.5, 0.5], "in", "cut"), W("empty-counter-scale", P(99), [0.5, 0.5], "pl", "page"), N("paris-street-dec-1870-v2", P(108), "in", "wl"), N("paris-street-dec-1870-v2b", P(110), "pr", "page", [0.9, 0.55], 1.5), W("soup-cauldron", P(112), [0.5, 0.5], "in", "zoom"), W("paris-rooftops-snow", P(113), [0.5, 0.5], "in", "fade")],
  ov: (
    <>
      {cap(P, 95, "WHO COULD PAY?")}
      {cap(P, 96, "A SOLDIER: 30 SOUS A DAY")}
      {cap(P, 97, "A SOU = 1/20 OF A FRANC")}
      {cap(P, 98, "SO: 1.5 FRANCS")}
      {cap(P, 99, "THE TRUNK: 40 FRANCS A POUND")}
      {cap(P, 100, "~27 DAYS OF PAY")}
      {cap(P, 101, "OTHER CUTS: ~10 FRANCS")}
      {cap(P, 102, "ALMOST A WEEK OF PAY")}
      {cap(P, 103, "A TURKEY: 60 FRANCS")}
      {cap(P, 104, "40 DAYS OF PAY")}
      {cap(P, 105, "AN EGG: 2.75 FRANCS")}
      {cap(P, 106, "ALMOST 2 DAYS OF PAY")}
      {cap(P, 107, "THOSE SUMS: OUR CALCULATION")}
      {cap(P, 108, "HUGO GOT GIFTS: ANTELOPE")}
      {cap(P, 109, "SUPPLY UNLIMITED, SO WAS THE PRICE")}
      {cap(P, 110, "A SOU'S WORTH OF SCRAPS")}
      <Reading x={960} y={700} a={P(111, 0.2)} b={P(112)} />
      {cap(P, 111, "HUNGER CROSSED CLASSES")}
      {cap(P, 111, "THE MEAT DID NOT", 1, 112, 30)}
      {cap(P, 112, "PUBLIC CANTEENS FOR SOUP")}
      {cap(P, 113, "DID PARIS EAT THE ZOO?")}
      {cap(P, 114, "NOT ALL OF PARIS")}
      {cap(P, 115, "THOSE WHO COULD PAY")}
      {cap(P, 116, "ALL PARIS ATE THE ZOO")}
      <Stp x={1380} y={520} k="M" size={70} a={P(116, 0.6)} />
      {cap(P, 117, "FOR THOSE WHO COULD PAY")}
      <Stp x={1380} y={520} k="D" size={70} a={P(117, 0.6)} />
    </>
  ),
  src: (
    <>
      <Cite text="Wikipedia, Goncourt (calculation: ours)" a={P(96)} b={P(101)} y={832} />
      <Cite text={SRC.lab} a={P(101)} b={P(105)} y={832} />
      <Cite text={SRC.hug} a={P(105)} b={P(109)} y={832} />
      <Cite text={SRC.lab} a={P(109)} b={P(110)} y={832} />
      <Cite text={SRC.gon} a={P(110)} b={P(111)} y={832} />
      <Cite text={SRC.lab} a={P(112)} b={P(113)} y={832} />
    </>
  ),
}));

const ch08 = scene(118, "ch08", (P) => ({
  shots: [W("research-desk-cards", P(118), [0.5, 0.5], "in", "cut"), W("dark-bread", P(126), [0.5, 0.5], "in", "page")],
  ov: (
    <>
      {cap(P, 118, "NOW, THE EVIDENCE")}
      {cap(P, 119, "HUNGER WAS REAL")}
      <Stp x={1400} y={520} k="D" size={60} a={P(119, 0.6)} b={P(120)} />
      {cap(P, 120, "DOGS, CATS, RATS EATEN")}
      <Stp x={1400} y={520} k="D" size={60} a={P(120, 0.6)} b={P(121)} />
      {cap(P, 121, "ELEPHANT SOLD AND EATEN")}
      <Stp x={1400} y={520} k="D" size={60} a={P(121, 0.6)} b={P(122)} />
      {cap(P, 122, "THE CHRISTMAS CARD")}
      <Stp x={1400} y={520} k="P" size={60} a={P(122, 0.6)} b={P(123)} />
      {cap(P, 123, "WHICH GARDEN")}
      <Stp x={1400} y={520} k="P" size={60} a={P(123, 0.6)} b={P(124)} />
      {cap(P, 124, "A PROPAGANDA CAMPAIGN")}
      <Pill x={1400} y={520} text="NO EVIDENCE FOUND" size={46} color={orange} a={P(124, 0.6)} b={P(125)} />
      {cap(P, 125, "ALL PARIS ATE THE ZOO")}
      <Stp x={1400} y={520} k="M" size={60} a={P(125, 0.6)} b={P(126)} />
      {cap(P, 126, "HOW UNEQUAL THE PLATES WERE")}
      <Reading x={960} y={700} a={P(127, 0.2)} b={P(128)} />
      {cap(P, 127, "THE ZOO STORY IS STRANGE")}
      {cap(P, 128, "HORSE AND BROWN BREAD: ORDINARY")}
      {cap(P, 129, "AN ORDINARY HUNGER")}
    </>
  ),
}));

const ch09 = scene(130, "ch09", (P) => ({
  shots: [N("bronze-oil-lamp-library-v2b", P(130), "in", "cut"), W("pink-card", P(136), [0.5, 0.5], "in", "page")],
  ov: (
    <>
      {cap(P, 130, "WHAT IS STILL OPEN?")}
      {cap(P, 131, "1: WHEN DID THEY DIE?")}
      {cap(P, 132, "2: CARD: THAT DAY, OR LATER?")}
      {cap(P, 133, "3: HOW MANY ATE DOGS, CATS, RATS?")}
      {cap(P, 134, "4: DID AUTHORITIES PUSH IT?")}
      {cap(P, 135, "FRENCH NEWSPAPERS MAY KNOW")}
      {cap(P, 136, "A DATED ORIGINAL CARD")}
      <Pill x={960} y={620} text="NOT THE REAL CARD" size={44} color={teal} a={P(136)} b={P(138)} />
      <Reading x={960} y={700} a={P(137, 0.2)} />
      {cap(P, 137, "NECESSITY FOR MOST, SPECTACLE FOR A FEW")}
    </>
  ),
}));

const ch10 = scene(138, "ch10", (P) => ({
  shots: [W("envelope-windowsill", P(138), [0.5, 0.5], "in", "cut"), W("carrier-pigeon", P(140), [0.5, 0.5], "in", "page"), N("paris-boulevard-31dec1870-v2", P(142), "out", "fade", [0.78, 0.22], 1.6)],
  ov: (
    <>
      {cap(P, 138, "ONE MORE DETAIL")}
      {cap(P, 139, "MANY LETTERS LEFT BY BALLOON")}
      {side(P, 140, 1590, "THE GARDEN", "HOUSED PIGEONS")}
      {side(P, 141, 1590, "A CITY CUT OFF", "STILL SENT NEWS")}
      {cap(P, 142, "A LAST QUESTION")}
      {cap(P, 143, "DID THE ROMANS HAVE", 0, 144, -20)}
      {cap(P, 143, "A ROOM FOR VOMITING?", 1, 144, 40)}
    </>
  ),
}));

export const SCENES031: Record<string, React.FC<SceneProps>> = { ch01, ch02, ch03, ch04, ch05, ch06, ch07, ch08, ch09, ch10 };
