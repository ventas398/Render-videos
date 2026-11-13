import React from "react";
import { staticFile } from "remotion";
import { ramp } from "../utils/anim";
import { theme } from "../themes/brand";
import type { SceneProps } from "./scenes";
import { Cam } from "./kit2";
import { ink, orange, SvgFrame, teal, Txt, useT } from "./kit";
import { CEN, FULL, Kin, Ov, Pill, Reading, Sfx, sfxOf, Shots } from "./scenes023";
import type { Ev, Sh } from "./scenes023";
import { Lab, Q, Sm, Stp, thud, Tl } from "./scenes025";

/* ============ EM-029: fotos reales libres (Wikimedia Commons: PD, CC0, CC BY). Creditos y fichas: docs/EM-029-CREDITOS-FOTOS.md ============ */
const CARD = "#FFFDF6";
const GT = "Gary Todd / Wikimedia Commons / PD";
/** Credito en pantalla (pastilla Source) por foto. */
const CR: Record<string, string> = {
  "01": GT, "02": GT, "03": GT, "04": GT, "12": GT, "13": GT, "14": GT, "21": GT,
  "23": "Gary Todd / Wikimedia Commons / CC0",
  "24": "Gary Todd / Wikimedia Commons / CC0",
  "05": "Biblioteca Malatestiana / Wikimedia Commons / PD",
  "05b": "Biblioteca Malatestiana / Wikimedia Commons / PD (crop)",
  "05c": "Biblioteca Malatestiana / Wikimedia Commons / PD (crop)",
  "06": "Gell, Pompeiana (1817) / Internet Archive / PD",
  "06b": "R. Clucas, USGS / Wikimedia Commons / PD",
  "07": "Fabrizio Garrisi / Wikimedia Commons / CC0",
  "08": "Internet Archive Book Images / Wikimedia Commons / PD",
  "09": "National Library of Wales / Wikimedia Commons / CC0",
  "10": "Rijksmuseum / Wikimedia Commons / CC0",
  "11": "Yorck Project / Wikimedia Commons / PD",
  "15": "BnF Gallica / Wikimedia Commons / PD",
  "16": "Gary Todd / Wikimedia Commons / PD (crop; inscription redrawn)",
  "17": "Jebulon / Wikimedia Commons / CC0",
  "18": "Photo: Olaf Tausch / Wikimedia Commons / CC BY 3.0 (cropped)",
  "19": "Photo: S J Pinkney / Wikimedia Commons / CC BY 2.0 (cropped)",
  "20": "USDA APHIS / Wikimedia Commons / PD",
  "22": "Edmund F. Arras, via DPLA / Wikimedia Commons / PD",
};
/** Rotulo "que es esta foto" para las que no son de Pompeya ni del hecho exacto. */
const LB: Record<string, string> = {
  "05": "15th-century manuscript of Pliny's Letters",
  "05b": "15th-century Latin manuscript of Pliny (not the Vesuvius letter)",
  "05c": "15th-century Latin manuscript of Pliny (not the Vesuvius letter)",
  "04": "Storage amphorae, Pompeii (illustrative)",
  "13": "Storage amphorae (illustrative)",
  "06": "Engraving, 1817",
  "06b": "Mount Redoubt, 1990 (not Vesuvius)",
  "07": "Roman calendar fragments (Fasti Antiates)",
  "08": "Medieval scribe, 1917 book plate",
  "09": "Medieval manuscript, c. 1503",
  "10": "Printing workshop, 1676 engraving (illustrative)",
  "11": "Roman still life, c. 70 AD",
  "12": "Brazier from the Temple of Isis, Pompeii",
  "14": "Pompeii fresco (illustrative, not wool)",
  "15": "Another denarius of Titus (BnF), not the Pompeii coin",
  "16": "Pompeii wall; inscription redrawn",
  "17": "Excavation site (illustrative)",
  "18": "A Hermann's tortoise (not the Pompeii one)",
  "19": "Crater of Vesuvius",
  "20": "Lab bench (illustrative)",
  "21": "Gold bracelet from Pompeii (not the one on the cast)",
  "22": "Plaster cast, 1913 lantern slide",
  "23": "Bronze balance scale (illustrative)",
};

/** Pastilla de fuente (y=858: credito de la foto; y=804: fuente escrita), subida para no pegarse a los subtitulos. */
const Foot: React.FC<{ text: string; a: number; b: number; y?: number }> = ({ text, a, b, y = 858 }) => {
  const t = useT();
  const o = ramp(t, a, a + 0.3) * (1 - ramp(t, b - 0.3, b));
  return o > 0 ? (
    <g opacity={o}>
      <rect x={52} y={y} width={(text.length + 8) * 13 + 56} height={44} rx={22} fill={CARD} stroke={teal} strokeWidth={3} />
      <text x={76} y={y + 23} dominantBaseline="central" fontFamily={theme.font} fontWeight={700} fontSize={24} fill={teal}>
        Source: {text}
      </text>
    </g>
  ) : null;
};
const Cite = (text: string, a: number, b: number, y = 804) => <Foot key={`${text}${a}`} text={text} a={a} b={b} y={y} />;

type Out = { shots: Sh[]; ov: React.ReactNode; top?: React.ReactNode; ev?: Ev[] };
const scene = (from: number, id: string, mk: (P: (n: number, o?: number) => number) => Out): React.FC<SceneProps> => ({ cues, dur }) => {
  const P = (n: number, o = 0) => (cues[n - from] ?? dur) + o;
  const { shots, ov, top, ev = [] } = mk(P);
  return (
    <>
      <SvgFrame>
        <Cam dur={dur} z1={1.04} amt={0.6}>
          <Shots id={id} list={shots} dur={dur} asp={16 / 9} src={(k) => staticFile(`images/em029-${k}.jpg`)} />
        </Cam>
        <Cam dur={dur} z1={1.05} dx={-20} amt={1.3}>
          {ov}
        </Cam>
        {shots.map((s, i) => {
          const b = shots[i + 1]?.t ?? dur;
          return (
            <React.Fragment key={i}>
              {LB[s.id] && <Lab text={LB[s.id]} a={s.t} b={b} y={820} />}
              <Foot text={CR[s.id]} a={s.t} b={b} />
            </React.Fragment>
          );
        })}
        {top}
      </SvgFrame>
      <Sfx ev={[...sfxOf(shots), ...ev]} />
    </>
  );
};
const sh = (id: string, t: number, o: Partial<Sh> = {}): Sh => ({ id, t, r: FULL, mv: "in", tr: "wl", ...o });
const fr = (id: string, t: number, o: Partial<Sh> = {}): Sh => sh(id, t, { r: CEN, tr: "page", ...o });
/** Pastilla que dura de la parte n a la m. */
const pl = (P: (n: number, o?: number) => number, n: number, text: string, m = n + 1, o: { y?: number; size?: number; color?: string; at?: number } = {}) => (
  <Pill key={`${n}${text}`} x={960} y={o.y ?? 150} text={text} a={P(n, o.at ?? 0)} b={P(m)} size={o.size ?? 36} color={o.color} />
);
const kn = (P: (n: number, o?: number) => number, n: number, text: string, m = n + 1, y = 170, size = 80) => <Kin key={`${n}${text}`} x={960} y={y} text={text} a={P(n)} b={P(m)} size={size} />;

/* ============ ch01 gancho (0-12) ============ */
const ch01 = scene(0, "ch01", (P) => ({
  shots: [sh("01", 0, { tr: "cut" }), sh("02", P(4), { tr: "wr", mv: "pr" }), sh("01", P(9), { f: [0.55, 0.4], z: 1.5, tr: "zoom" })],
  ov: (
    <>
      {kn(P, 0, "WHY CAN'T ANYONE AGREE?", 1, 230, 80)}
      {pl(P, 0, "ON THE DAY POMPEII DISAPPEARED", 1, { y: 360, size: 40 })}
      {kn(P, 1, "AUGUST 24, AD 79", 3, 170, 100)}
      {pl(P, 1, "WHAT THE TEXTBOOKS SAY", 2, { y: 330, size: 34 })}
      {kn(P, 3, "OR OCTOBER?", 5, 170, 120)}
      {pl(P, 4, "ABOUT TWO MONTHS APART", 5, { y: 330 })}
      {["FRUIT", "WOOL", "BRAZIERS", "COIN"].map((l, i) => (
        <Q key={l} x={300 + i * 440} label={l} a={P(5, i * 0.35)} b={P(7)} rot={i % 2 ? 2 : -2} />
      ))}
      {pl(P, 6, "NOBODY HAS THE ORIGINAL LETTER", 7, { y: 560 })}
      {kn(P, 7, "WHICH MONTH?", 8, 200, 160)}
      <Stp x={420} y={620} k="D" a={P(9, 0.4)} b={P(12)} size={60} rot={-5} />
      <Stp x={960} y={620} k="P" a={P(10, 0.2)} b={P(12)} size={60} rot={3} />
      <Stp x={1440} y={620} k="M" a={P(11, 0.2)} b={P(12)} size={60} rot={-3} />
    </>
  ),
  top: <Sm a={P(5)} b={P(7)} />,
  ev: [thud(P(9, 0.4)), thud(P(10, 0.2)), thud(P(11, 0.2))],
}));

/* ============ ch02 por que importa (13-20) ============ */
const ch02 = scene(13, "ch02", (P) => ({
  shots: [sh("03", 0, { tr: "cut" }), sh("04", P(17))],
  ov: (
    <>
      {pl(P, 14, "Killgrove", 17, { color: teal })}
      {kn(P, 15, "SEASONAL PEAKS", 16, 280, 90)}
      {kn(P, 16, "TWO MONTHS MATTER", 17, 280, 90)}
      {pl(P, 17, "NOT JUST A FAMOUS RUIN")}
      {kn(P, 18, "A TIME CAPSULE", 19, 170, 110)}
      {pl(P, 19, "THE TRAIL STARTS WITH A LETTER", 21)}
    </>
  ),
  top: Cite("Killgrove, Getty Iris, 2019 (CC BY 4.0)", P(14), P(17)),
}));

/* ============ ch03 la carta de Plinio (21-36) ============ */
const Tile: React.FC<{ n: number; a: number; b: number }> = ({ n, a, b }) => (
  <Ov x={1590 - (n - 1) * 157.5} y={330} a={a} b={b} lim={1.1}>
    <rect x={-70} y={-62} width={140} height={124} rx={18} fill={CARD} stroke={n === 9 ? orange : ink} strokeWidth={n === 9 ? 9 : 4} />
    <Txt x={0} y={-16} size={54} fill={n === 9 ? orange : ink}>
      {n}
    </Txt>
    <Txt x={0} y={34} size={26} fill={teal}>
      {n === 1 ? "SEP 1" : `AUG ${33 - n}`}
    </Txt>
  </Ov>
);
/** Fondo de tarjeta para la linea de tiempo sobre fotos. */
const TlBg: React.FC<{ y: number; a: number; b: number }> = ({ y, a, b }) => (
  <Ov x={960} y={y} a={a} b={b} lim={1.04}>
    <rect x={-600} y={-130} width={1200} height={270} rx={26} fill={CARD} opacity={0.93} stroke={ink} strokeWidth={4} />
  </Ov>
);
const ch03 = scene(21, "ch03", (P) => ({
  shots: [sh("05", 0, { tr: "cut" }), sh("06", P(25)), fr("06b", P(26), { rot: -1, f: [0.5, 0.4] }), sh("09", P(27), { tr: "wr" }), fr("05", P(33), { rot: 1, f: [0.5, 0.3] })],
  ov: (
    <>
      {pl(P, 21, "Pliny the Younger", 22, { at: 0.2 })}
      {pl(P, 22, "A letter to his friend Tacitus, a historian", 23, { size: 32 })}
      {pl(P, 23, "Tacitus asked how Pliny's uncle died", 24)}
      {pl(P, 24, "A LONG LETTER", 25)}
      {pl(P, 25, "A cloud above the mountain", 26)}
      {kn(P, 26, "LIKE A PINE TREE", 27, 170, 90)}
      {kn(P, 27, "THE DATE", 29, 170, 110)}
      {pl(P, 29, "9th day before the Kalends of September", 30, { size: 34 })}
      {pl(P, 30, "Kalends = the first day of a Roman month", 31, { size: 34 })}
      {Array.from({ length: 9 }, (_, i) => (
        <Tile key={i} n={i + 1} a={P(31, 0.1 + i * 0.35)} b={P(33)} />
      ))}
      {kn(P, 32, "AUGUST 24", 33, 570, 120)}
      <TlBg y={300} a={P(33)} b={P(35)} />
      <Tl y={300} x1={500} x2={1440} pts={[{ x: 600, l: "AD 79", s: "Eruption", a: P(33) }, { x: 1320, l: "c. AD 108", s: "Letter", a: P(33, 1.3) }]} e={P(35)} />
      {kn(P, 35, "ONE MAN'S LETTER", 36, 170, 90)}
      {kn(P, 36, "AND IT HAS A PROBLEM", 37, 170, 80)}
    </>
  ),
  top: (
    <>
      <Sm a={P(31)} b={P(35)} />
      {Cite("Pliny the Younger, Letters 6.16", P(21), P(27))}
    </>
  ),
}));

/* ============ ch04 las copias (37-48) ============ */
const ch04 = scene(37, "ch04", (P) => ({
  shots: [sh("19", 0, { tr: "cut" }), sh("08", P(38)), sh("05b", P(39)), fr("10", P(41), { rot: -1 }), sh("05c", P(43), { tr: "wr" })],
  ov: (
    <>
      {kn(P, 37, "NO ORIGINAL", 38, 170, 110)}
      {pl(P, 38, "What survives: medieval copies of copies", 39, { size: 34 })}
      {pl(P, 39, "9th-century copies: AUGUST", 40)}
      {pl(P, 40, "15th-century copy, Paris: month missing", 41, { size: 34 })}
      {pl(P, 41, "Printed edition, 1474: NOVEMBER", 42)}
      {pl(P, 42, "1797 editor: late November", 43)}
      {pl(P, 43, "Some see a trace of October 24 in November", 44, { size: 32 })}
      {kn(P, 44, "HANDWRITING, NOT VOLCANOES", 45, 170, 80)}
      {pl(P, 45, "Zuchtriegel, park director", 49, { color: teal })}
      {pl(P, 46, "August: the only date in the manuscripts", 47, { y: 340, size: 32 })}
      {pl(P, 47, "...but that does not prove it", 48, { y: 340, size: 34 })}
      {kn(P, 48, "THE LETTER ALONE CANNOT SETTLE IT", 49, 340, 60)}
    </>
  ),
  top: (
    <>
      {Cite("Finestre sull'Arte, 27 Aug 2024", P(39), P(45))}
      {Cite("Getty Iris, 2019 (CC BY 4.0)", P(39), P(45), 750)}
      {Cite("ScienceDaily, 7 Nov 2024 (Zuchtriegel)", P(45), P(49))}
    </>
  ),
}));

/* ============ ch05 las pistas del suelo (49-68) ============ */
const ch05 = scene(49, "ch05", (P) => ({
  shots: [
    sh("02", 0, { tr: "cut", f: [0.8, 0.5], z: 1.25 }),
    sh("11", P(50)),
    fr("13", P(53), { rot: 1 }),
    sh("12", P(54), { tr: "wr" }),
    fr("14", P(55), { rot: -1 }),
    sh("12", P(59), { f: [0.5, 0.3], z: 1.25 }),
    fr("11", P(60), { rot: 1, f: [0.3, 0.5] }),
    sh("08", P(63), { tr: "wr", z: 1.5 }),
    sh("14", P(67), { tr: "zoom" }),
  ],
  ov: (
    <>
      {pl(P, 49, "Now let's walk the streets", 50)}
      {kn(P, 50, "FIGS, WALNUTS, CHESTNUTS", 51, 170, 70)}
      {kn(P, 51, "POMEGRANATES", 52, 170, 90)}
      {kn(P, 52, "AUTUMN FRUIT?", 53, 170, 100)}
      {pl(P, 53, "Wine jars already sealed", 54)}
      {pl(P, 54, "Braziers: bowls for hot coals", 55)}
      {pl(P, 55, "Traces of woollen clothing", 56)}
      {kn(P, 56, "THE AUTUMN CASE", 57, 170, 100)}
      {pl(P, 57, "EVERY CLUE HAS A PLAIN ANSWER", 58, { color: teal })}
      {pl(P, 58, "Fleeing people: warm clothes against the ash", 59, { size: 32 })}
      {pl(P, 59, "Braziers also cooked food", 60)}
      {pl(P, 60, "For Romans, August was already autumn", 61, { size: 34 })}
      {pl(P, 61, "So the fruit could be ripe", 62)}
      {pl(P, 62, "Plant expert: grape harvest apparently not begun", 63, { size: 30 })}
      {pl(P, 63, "Cassius Dio, Roman History 66 (Cary translation)", 67, { color: teal, size: 34 })}
      {pl(P, 64, "No day given. One translation: end of summer", 65, { y: 270, size: 32 })}
      {pl(P, 65, "His Greek word: late summer OR autumn", 66, { y: 270, size: 34 })}
      {kn(P, 66, "EVEN THE WORDING IS DISPUTED", 67, 270, 64)}
      {pl(P, 67, "Valencia: 14 casts studied, presented at a conference", 68, { size: 32 })}
      {pl(P, 68, "Only 4: garment type confirmed, heavy wool", 69, { size: 32 })}
    </>
  ),
  top: (
    <>
      {Cite("Getty Iris, 2019 (CC BY 4.0)", P(49), P(63))}
      {Cite("Finestre sull'Arte, 27 Aug 2024", P(49), P(63), 750)}
      {Cite("University of Valencia (ATROPOS)", P(67), P(69))}
    </>
  ),
}));

/* ============ ch06 la moneda (69-76) ============ */
const ch06 = scene(69, "ch06", (P) => ({
  shots: [sh("15", 0, { tr: "cut" }), sh("15", P(73), { f: [0.76, 0.5], z: 1.6, tr: "zoom", mv: "pl" })],
  ov: (
    <>
      {kn(P, 69, "A COIN", 70, 170, 140)}
      {pl(P, 70, "Silver denarius of Titus", 71)}
      {pl(P, 71, "Emperors collected titles over time", 72)}
      {pl(P, 72, "Imperator: a numbered acclamation", 73)}
      {pl(P, 73, "2006: read as the 15th acclamation", 74)}
      {pl(P, 74, "Early September documents list only the 14th", 75, { size: 32 })}
      {pl(P, 75, "If both are right, the coin is later", 76)}
      {pl(P, 76, "2013: British experts saw no proof of that number", 77, { size: 30 })}
    </>
  ),
  top: Cite("Finestre sull'Arte, 27 Aug 2024", P(70), P(77)),
}));

/* ============ ch07 el garabato (77-89) ============ */
const ch07 = scene(77, "ch07", (P) => ({
  shots: [sh("16", 0, { tr: "cut" }), sh("03", P(83), { tr: "wr", f: [0.75, 0.5], z: 1.2 }), sh("16", P(86), { f: [0.3, 0.4], z: 1.3, mv: "pl", tr: "zoom" })],
  ov: (
    <>
      {pl(P, 77, "October 2018", 78)}
      {pl(P, 78, "A house reported as a building site", 79)}
      <Ov x={960} y={430} a={P(79, 0.3)} b={P(90)} rot={-2} lim={1.08}>
        <rect x={-440} y={-120} width={880} height={240} rx={26} fill="#E6DCC6" stroke={ink} strokeWidth={6} />
        <Txt x={0} y={4} size={120} fill="#2B2B2B">
          XVI K NOV
        </Txt>
      </Ov>
      {kn(P, 80, "OCTOBER 17", 81, 660, 110)}
      {kn(P, 81, "NO YEAR", 82, 660, 130)}
      {pl(P, 82, "Osanna, then park director: a joking phrase", 83, { size: 32 })}
      {pl(P, 83, "“Extraordinary evidence of a secure date”", 84, { size: 34 })}
      {pl(P, 84, "Ministry of Culture: charcoal is fragile", 85, { size: 34 })}
      {pl(P, 85, "So: most likely written in October 79", 86)}
      {kn(P, 86, "OCTOBER, FAVORED FOR YEARS", 87, 170, 70)}
      <Reading x={300} y={110} a={P(87)} b={P(90)} />
      {pl(P, 88, "Someone wrote that day on that wall", 89, { y: 170 })}
      {pl(P, 89, "It cannot tell us the year", 90, { y: 170 })}
    </>
  ),
  top: (
    <>
      <Sm a={P(79, 0.3)} b={P(90)} />
      {Cite("Pompeii Archaeological Park, press release, 19 Oct 2018", P(77), P(84))}
      {Cite("Italian Ministry of Culture, 19 Oct 2018", P(84), P(87))}
    </>
  ),
}));

/* ============ ch08 el experimento (90-100) ============ */
const ch08 = scene(90, "ch08", (P) => ({
  shots: [sh("17", 0, { tr: "cut" }), sh("16", P(92), { mv: "pr" }), fr("17", P(95), { rot: 1 }), sh("03", P(98), { tr: "wr", f: [0.3, 0.5], z: 1.15 })],
  ov: (
    <>
      {kn(P, 90, "CAN CHARCOAL LAST 10 MONTHS?", 91, 170, 70)}
      {pl(P, 91, "The park decided to test it", 92)}
      <TlBg y={340} a={P(92)} b={P(98)} />
      <Tl y={340} x1={420} x2={1500} pts={[{ x: 520, l: "Oct 2023", s: "Written", a: P(92) }, { x: 1400, l: "Aug 2024", s: "Unaltered", a: P(96) }]} e={P(98)} />
      {pl(P, 92, "Same wall, under a rain cover", 93)}
      {pl(P, 93, "Reportedly oak charcoal", 94)}
      {pl(P, 94, "Same date + year + “experimental archaeology”", 95, { size: 32 })}
      {pl(P, 95, "Photographed every month", 96)}
      {pl(P, 96, "Aug 24, 2024: the park reports essentially unaltered", 97)}
      {kn(P, 97, "STILL LEGIBLE", 98, 170, 110)}
      {pl(P, 98, "Zuchtriegel co-authored the report, Dec 2024", 99, { size: 32 })}
      {pl(P, 99, "“We cannot exclude August 24”", 100)}
      {pl(P, 100, "It weakens one argument against August", 101, { size: 34 })}
    </>
  ),
  top: (
    <>
      <Sm a={P(92)} b={P(98)} />
      {Cite("Pompeii Archaeological Park (as reported)", P(90), P(101))}
    </>
  ),
}));

/* ============ ch09 tortuga y vulcanologos (101-114) ============ */
const ch09 = scene(101, "ch09", (P) => ({
  shots: [sh("18", 0, { tr: "cut" }), sh("19", P(107)), fr("19", P(111), { rot: 1, f: [0.5, 0.6] })],
  ov: (
    <>
      {kn(P, 101, "AN ANIMAL", 102, 170, 130)}
      {pl(P, 102, "A Hermann's tortoise, announced in 2022", 103, { size: 34 })}
      {pl(P, 103, "In a shop near the Stabian Baths, with one egg", 104, { size: 32 })}
      {kn(P, 104, "BURIED BEFORE THE ERUPTION", 105, 170, 64)}
      {pl(P, 105, "A tortoise that died earlier cannot date it", 106, { size: 34 })}
      {kn(P, 106, "NO VOTE", 107, 170, 130)}
      {pl(P, 107, "The volcanologists", 108)}
      {pl(P, 108, "A team reviewed the whole eruption", 109)}
      {pl(P, 109, "Press release: leans toward autumn", 110)}
      {kn(P, 110, "OCT 24-25", 111, 170, 130)}
      {pl(P, 111, "They cite: scribble, fruit, heavy clothes", 112, { size: 34 })}
      {pl(P, 112, "Same clues we just heard", 113)}
      {pl(P, 113, "A strong voice, not the final word", 114)}
      {kn(P, 114, "TWO CAMPS, SAME EVIDENCE", 115, 170, 70)}
    </>
  ),
  top: (
    <>
      {Cite("Pompeii Archaeological Park, press release, 24 Jun 2022", P(101), P(107))}
      {Cite("INGV press release, June 2022", P(107), P(115))}
    </>
  ),
}));

/* ============ ch10 los calcos (115-132) ============ */
const ch10 = scene(115, "ch10", (P) => ({
  shots: [
    sh("03", 0, { tr: "cut", f: [0.8, 0.5], z: 1.3 }),
    fr("22", P(118), { rot: -1 }),
    sh("03", P(119), { tr: "wr", f: [0.25, 0.5], z: 1.15 }),
    sh("20", P(122)),
    sh("21", P(125), { tr: "wr" }),
    sh("04", P(128), { f: [0.7, 0.5], z: 1.2 }),
    sh("02", P(132)),
  ],
  ov: (
    <>
      {pl(P, 115, "One more story about Pompeii", 116)}
      {kn(P, 116, "STORIES WE TOLD OURSELVES", 117, 170, 70)}
      {pl(P, 117, "The plaster casts of Pompeii", 118)}
      {pl(P, 118, "Plaster poured into hollows in the hardened ash", 119, { size: 32 })}
      {pl(P, 119, "For generations: family stories about some", 120, { size: 34 })}
      {pl(P, 120, "A mother with her child", 121)}
      {pl(P, 121, "Two sisters, hugging", 122)}
      {pl(P, 122, "2024: Florence, Harvard, Max Planck Institute", 123, { size: 32 })}
      {kn(P, 123, "14 OF 86 CASTS", 124, 170, 100)}
      {kn(P, 124, "5 USABLE GENOMES", 125, 170, 90)}
      <Pill x={960} y={150} text="Golden bracelet: long read as a mother" a={P(125)} b={P(125, 2.4)} size={34} />
      <Kin x={960} y={170} text="HE WAS A MAN" a={P(125, 2.4)} b={P(126)} size={100} />
      {pl(P, 126, "Not related to the child beside him", 127)}
      {pl(P, 127, "The embracing pair: one was male", 128)}
      {pl(P, 128, "Casts “considerably manipulated”", 129)}
      {pl(P, 129, "Restorers may have changed poses to fit a story", 130, { size: 32 })}
      {kn(P, 130, "THE FAMILY STORIES DO NOT HOLD UP", 131, 170, 60)}
      <Reading x={300} y={110} a={P(131)} b={P(132)} />
      {pl(P, 131, "The story ran ahead of the evidence", 132)}
      {kn(P, 132, "BACK TO THE DATE", 133, 170, 100)}
    </>
  ),
  top: Cite("Pilli et al., Current Biology, 2024 (CC BY 4.0)", P(122), P(132)),
}));

/* ============ ch11 veredicto (133-142) ============ */
const ROWS: [number, string, ("D" | "P" | "M")[]][] = [
  [134, "Oldest copies of Pliny: August", ["D"]],
  [135, "Other copies: other months", ["D"]],
  [136, "Fruit, wool, braziers, jars", ["D", "P"]],
  [137, "Coin of Titus", ["P"]],
  [138, "Charcoal scribble (and its year)", ["D", "P"]],
  [139, "Volcanologists' date (tortoise: no vote)", ["P"]],
  [140, "One scribble settles it", ["M"]],
  [141, "The two family stories", ["M"]],
];
const ch11 = scene(133, "ch11", (P) => ({
  shots: [sh("23", 0, { tr: "cut" }), sh("02", P(136), { tr: "wr", f: [0.75, 0.5] }), sh("23", P(140), { f: [0.5, 0.7], z: 1.25, tr: "zoom" })],
  ov: (
    <>
      {ROWS.map(([p, label, ks], i) => (
        <React.Fragment key={p}>
          <Ov x={520} y={170 + i * 76} a={P(p)} b={P(142)} lim={1.05}>
            <rect x={-360} y={-34} width={720} height={68} rx={18} fill={CARD} stroke={ink} strokeWidth={4} />
            <Txt x={0} y={2} size={32}>
              {label}
            </Txt>
          </Ov>
          {ks.map((k, j) => (
            <Stp key={j} x={1150 + j * 300} y={170 + i * 76} k={k} a={P(p, 0.3 + j * 0.3)} b={P(142)} size={26} rot={-3 + j * 3} />
          ))}
        </React.Fragment>
      ))}
      {kn(P, 142, "STILL AN OPEN QUESTION", 143, 540, 100)}
    </>
  ),
  top: <Sm a={P(134)} b={P(142)} />,
  ev: ROWS.flatMap(([p, , ks]) => ks.map((_, j) => thud(P(p, 0.3 + j * 0.3)))),
}));

/* ============ ch12 hipotesis y cierre (143-153) ============ */
const ch12 = scene(143, "ch12", (P) => ({
  shots: [sh("24", 0, { tr: "cut" }), sh("01", P(150), { f: [0.5, 0.45] })],
  ov: (
    <>
      {kn(P, 143, "OPEN HYPOTHESES", 144, 170, 110)}
      <Pill x={960} y={150} text="1  PLINY SAYS AUGUST; THE AUTUMN CLUES HAVE PLAIN ANSWERS" a={P(144)} b={P(147)} size={30} />
      <Pill x={960} y={250} text="2  IT WAS OCTOBER, AND THE LETTER WAS COPIED WRONGLY" a={P(145)} b={P(147)} size={30} />
      <Pill x={960} y={350} text="3  WE STILL LACK THE DOCUMENT THAT WOULD SETTLE IT" a={P(146)} b={P(147)} size={30} />
      <Reading x={300} y={110} a={P(147)} b={P(148)} />
      <Reading x={300} y={110} a={P(150)} b={P(151)} />
      {pl(P, 147, "Each clue has a simple alternative", 148)}
      {kn(P, 148, "A MONTH AND A YEAR, TOGETHER", 149, 170, 70)}
      {pl(P, 149, "A dated document in a sealed layer?", 150)}
      {kn(P, 150, "A TRADITION, NOT A PROOF", 151, 250, 80)}
      {pl(P, 151, "We repeat famous dates so often", 152)}
      {kn(P, 152, "WE FORGET TO CHECK", 153, 170, 90)}
    </>
  ),
}));

export const SCENES029: Record<string, React.FC<SceneProps>> = { ch01, ch02, ch03, ch04, ch05, ch06, ch07, ch08, ch09, ch10, ch11, ch12 };
