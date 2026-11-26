// Short vertical 1080x1920 generico: voz Kokoro + beats (imagen, rotulos, sellos) desde src/episodes/SHORT-0N.json (+ .timing.json).
import React, { useLayoutEffect, useRef, useState } from "react";
import { AbsoluteFill, Audio, cancelRender, continueRender, delayRender, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import e01 from "../episodes/SHORT-01.json";
import t01 from "../episodes/SHORT-01.timing.json";
import e02 from "../episodes/SHORT-02.json";
import t02 from "../episodes/SHORT-02.timing.json";
import e03 from "../episodes/SHORT-03.json";
import t03 from "../episodes/SHORT-03.timing.json";
import e04 from "../episodes/SHORT-04.json";
import t04 from "../episodes/SHORT-04.timing.json";
import e05 from "../episodes/SHORT-05.json";
import t05 from "../episodes/SHORT-05.timing.json";
import e08 from "../episodes/SHORT-08.json";
import t08 from "../episodes/SHORT-08.timing.json";
import e06 from "../episodes/SHORT-06.json";
import t06 from "../episodes/SHORT-06.timing.json";
import e07 from "../episodes/SHORT-07.json";
import t07 from "../episodes/SHORT-07.timing.json";
import e09 from "../episodes/SHORT-09.json";
import t09 from "../episodes/SHORT-09.timing.json";
import e10 from "../episodes/SHORT-10.json";
import t10 from "../episodes/SHORT-10.timing.json";
import e035 from "../episodes/SHORT-035.json";
import t035 from "../episodes/SHORT-035.timing.json";
import e052c from "../episodes/EM-052-CORTO.json";
import t052c from "../episodes/EM-052-CORTO.timing.json";
import e053b from "../episodes/SHORT-053B.json";
import t053b from "../episodes/SHORT-053B.timing.json";
import ttE1 from "../episodes/TT-01.json";
import ttT1 from "../episodes/TT-01.timing.json";
import ttE2 from "../episodes/TT-02.json";
import ttT2 from "../episodes/TT-02.timing.json";
import ttE3 from "../episodes/TT-03.json";
import ttT3 from "../episodes/TT-03.timing.json";
import i75 from "../episodes/IDEA-75.json";
import ti75 from "../episodes/IDEA-75.timing.json";
import i74 from "../episodes/IDEA-74.json";
import ti74 from "../episodes/IDEA-74.timing.json";
import i73 from "../episodes/IDEA-73.json";
import ti73 from "../episodes/IDEA-73.timing.json";
import g75 from "../episodes/IDEA-75G.json";
import tg75 from "../episodes/IDEA-75G.timing.json";
import g74 from "../episodes/IDEA-74G.json";
import tg74 from "../episodes/IDEA-74G.timing.json";
import g73 from "../episodes/IDEA-73G.json";
import tg73 from "../episodes/IDEA-73G.timing.json";
import n11 from "../episodes/SHORT-11.json";
import tn11 from "../episodes/SHORT-11.timing.json";
import n12 from "../episodes/SHORT-12.json";
import tn12 from "../episodes/SHORT-12.timing.json";
import n13 from "../episodes/SHORT-13.json";
import tn13 from "../episodes/SHORT-13.timing.json";
import n14 from "../episodes/SHORT-14.json";
import tn14 from "../episodes/SHORT-14.timing.json";
import n15 from "../episodes/SHORT-15.json";
import tn15 from "../episodes/SHORT-15.timing.json";
import n16 from "../episodes/SHORT-16.json";
import tn16 from "../episodes/SHORT-16.timing.json";
import n17 from "../episodes/SHORT-17.json";
import tn17 from "../episodes/SHORT-17.timing.json";
import n18 from "../episodes/SHORT-18.json";
import tn18 from "../episodes/SHORT-18.timing.json";
import e43 from "../episodes/SHORT-43.json";
import t43 from "../episodes/SHORT-43.timing.json";
import e44 from "../episodes/SHORT-44.json";
import t44 from "../episodes/SHORT-44.timing.json";
import { TTDiagram, type TTKind } from "./ttDiagram";
import { HookSceneView, type HookScene } from "./ttHook";
import { MotionImage, type MotionDir } from "../components/MotionImage";
import { theme, VIDEO } from "../themes/brand";
import { GAP } from "../utils/timing";

const { fps } = VIDEO;
const TAIL = 1.4;
const NAVY = "#0A1A4A";
const YEL = "#FFC400";
const IMPACT = 'Impact, "Arial Black", "Segoe UI", sans-serif';
const WIN = { top: 0, h: 1920 }; // imagen a sangre en todo el vertical (regla Javier: nunca banda vacia abajo); subtitulos encima de la imagen

type Label = { p: number; t: string; s?: string };
type Stamp = { p: number; t: string; s: string; c: "teal" | "orange"; y?: number };
type Mark = { t: string; x: number; y: number; c?: string; s?: number; w?: number }; // s/w opcionales: tamano de letra y ancho de caja (SHORT-17 v4: precio en la etiqueta) // letra rotulada sobre la imagen (px del vertical 1080x1920); sigue el zoom de la foto
type Beat = { from: number; to: number; img?: string; src?: string; paper?: boolean; tint?: string; tag?: string; kb?: "in" | "left" | "right" | "still"; z?: number; ox?: string; oy?: string; pan?: [number, number]; labels?: Label[]; stamps?: Stamp[]; end?: boolean; vein?: "line" | "nerve" | "break"; credit?: { p: number; t: string }; diagram?: TTKind; marks?: Mark[] };
export type ShortEp = { id: string; hookScene?: HookScene; capMax?: number; title: string; hook?: boolean; fin?: { img: string; src?: string; big: string; small: string; z?: number; ox?: string; oy?: string; at?: number }; parts: string[]; beats: Beat[]; capStarts?: Record<string, number[]> };
type Timing = { ends: number[]; gap?: number; solo?: Record<string, number>; words?: [string, number, number][][]; tail?: number }; // solo: segundos de musica sola al final de la parte (sin voz ni subtitulo)
export type ShortProps = { ep: ShortEp; timing: Timing; mov?: boolean; noSubs?: boolean }; // noSubs: solo para stills de portada

// SHORT-43F (26/11): version con fotos Flow. Mismo JSON, voz y tiempos que SHORT-43; cambian imagenes, rotulo de esquina y ficha. Los planos de varias frases se parten en la ultima (<= 6 s, reencuadre).
const f43: ShortEp = {
  ...(e43 as unknown as ShortEp),
  fin: { ...e43.fin, img: "s43f-bedside-charge", src: "images/s43f-bedside-charge.jpg", big: "Illustrative images.", z: 1.35, ox: "50%", oy: "76%" },
  beats: (e43.beats as unknown as Beat[]).flatMap((b) => {
    const y: Record<number, number> = { 3: 440, 6: 430, 7: 960 }; // sellos fuera del sujeto de la foto (pila, movil, icono de bateria)
    const stamps = b.stamps?.map((s) => ({ ...s, y: y[s.p] }));
    const base: Beat = { ...b, stamps, img: b.img!.replace("s43-", "s43f-"), src: b.src!.replace("s43-", "s43f-"), tag: "Illustrative image", z: b.kb === "left" || b.kb === "right" ? 1.12 : 1.04 }; // el paneo mueve 50 px: con menos de 1,12 asoma el fondo por la derecha
    // v1.2 (LOTE-NL): plano 9 con el cable puesto, reencuadrado; parte 8 con la bateria al 80 % pintada en una copia de la foto
    if (b.from === 9) return [{ ...base, img: "s43f-bedside-charge", src: "images/s43f-bedside-charge.jpg", z: 1.35, ox: "50%", oy: "76%" }];
    if (b.from === b.to) return [base];
    const part = (last: boolean): Beat => ({ ...base, labels: b.labels?.filter((l) => (l.p >= b.to) === last), stamps: stamps?.filter((s) => (s.p >= b.to) === last) });
    return [{ ...part(false), to: b.to - 1 }, { ...part(true), from: b.to, z: 1.25, ...(b.to === 8 && { img: "s43f-settings-generic-80", src: "images/s43f-settings-generic-80.jpg" }) }];
  }),
};

// SHORT-44F (26/11): fotos Flow sobre el JSON, voz y tiempos de SHORT-44. Un plano por frase (<= 6 s). Orden del jefe 13:27: ficha de fuentes bajo la ultima frase (fin.at) y <= 2,5 s de silencio (tail).
const L44 = (e44.beats as unknown as Beat[]).flatMap((b) => b.labels ?? []);
const S44 = (e44.beats as unknown as Beat[]).flatMap((b) => b.stamps ?? []);
const Y44: Record<number, number> = { 1: 1000, 3: 1000, 4: 440, 5: 430, 7: 440 }; // sellos fuera del sujeto de cada foto
const b44 = (p: number, name: string, o: Partial<Beat> = {}): Beat => ({ from: p, to: p, img: name, src: `images/${name}.jpg`, tag: "Illustrative image", labels: L44.filter((l) => l.p === p), stamps: S44.filter((s) => s.p === p).map((s) => ({ ...s, y: Y44[p] })), ...o });
const f44: ShortEp = {
  ...(e44 as unknown as ShortEp),
  fin: { ...e44.fin, big: "Illustrative images.", img: "s44f-fridge-night", src: "images/s44f-fridge-night.jpg", at: 29.5 },
  beats: [
    b44(0, "s44f-pot-steam"),
    b44(1, "s44f-icebox-1910s", { kb: "left", z: 1.12 }),
    b44(2, "s44f-ice-delivery-1910s"),
    b44(3, "s44f-fridge-1920s"),
    b44(4, "s44f-two-rules"),
    b44(5, "s44f-shallow-containers", { kb: "right", z: 1.12 }),
    b44(6, "s44f-shallow-containers", { z: 1.35, ox: "45%", oy: "55%" }),
    b44(7, "s44f-uk-cooling"),
    b44(8, "s44f-uk-cooling", { z: 1.35, ox: "70%", oy: "72%" }),
    b44(9, "s44f-fridge-night", { z: 1.3, ox: "66%", oy: "65%" }),
  ],
};

export const SHORTS: Record<string, ShortProps> = {
  "SHORT-43F": { ep: f43, timing: { ...t43, tail: 4.2 } as unknown as Timing },
  "SHORT-44F": { ep: f44, timing: { ...t44, tail: 2.2 } as unknown as Timing },
  "SHORT-08": { ep: e08 as unknown as ShortEp, timing: t08 },
  "SHORT-01": { ep: e01 as unknown as ShortEp, timing: t01 },
  "SHORT-02": { ep: e02 as unknown as ShortEp, timing: t02 },
  "SHORT-03": { ep: e03 as unknown as ShortEp, timing: t03 },
  "SHORT-04": { ep: e04 as unknown as ShortEp, timing: t04 },
  "SHORT-05": { ep: e05 as unknown as ShortEp, timing: t05 },
  // PRUEBA DE MOVIMIENTO (relevo15 06/11 14:20, OK de Javier): misma voz/guion/subtitulos que SHORT-05 v2, solo cambia el movimiento de las imagenes (MotionImage en vez de Photo). Comparar con SHORT-05 v2 ya entregado; no sustituye nada.
  "SHORT-05-mov": { ep: e05 as unknown as ShortEp, timing: t05, mov: true },
  "SHORT-06": { ep: e06 as unknown as ShortEp, timing: t06 },
  "SHORT-07": { ep: e07 as unknown as ShortEp, timing: t07 },
  "SHORT-09": { ep: e09 as unknown as ShortEp, timing: t09 },
  "SHORT-10": { ep: e10 as unknown as ShortEp, timing: t10 },
  "SHORT-035": { ep: e035 as unknown as ShortEp, timing: t035 },
  "EM-052-CORTO": { ep: e052c as unknown as ShortEp, timing: t052c },
  "SHORT-053B": { ep: e053b as unknown as ShortEp, timing: t053b },
  // TikTok de prueba 11/11/2026: subtitulos palabra a palabra (timing.words), titulo 3 s, pantalla final de la ficha (ep.fin) con 3,4 s de cola.
  "TT-01": { ep: { ...ttE1, hook: true } as unknown as ShortEp, timing: { ...ttT1, tail: 3.4 } as unknown as Timing },
  "TT-02": { ep: { ...ttE2, hook: true } as unknown as ShortEp, timing: { ...ttT2, tail: 3.4 } as unknown as Timing },
  "TT-03": { ep: { ...ttE3, hook: true } as unknown as ShortEp, timing: { ...ttT3, tail: 3.4 } as unknown as Timing },
  // TikTok EEUU 12/11/2026 (mismo formato que TT-01..03)
  "IDEA-75": { ep: { ...i75, hook: true } as unknown as ShortEp, timing: { ...ti75, tail: 3.4 } as unknown as Timing },
  "IDEA-74": { ep: { ...i74, hook: true } as unknown as ShortEp, timing: { ...ti74, tail: 3.4 } as unknown as Timing },
  "IDEA-73": { ep: { ...i73, hook: true } as unknown as ShortEp, timing: { ...ti73, tail: 3.4 } as unknown as Timing },
  // TikTok con gancho nuevo y voz energica 13/11/2026 (gancho por tiempo: ep.hookScene; sin titulo amarillo)
  "IDEA-75G": { ep: g75 as unknown as ShortEp, timing: { ...tg75, tail: 3.4 } as unknown as Timing },
  "IDEA-74G": { ep: g74 as unknown as ShortEp, timing: { ...tg74, tail: 3.4 } as unknown as Timing },
  "IDEA-73G": { ep: g73 as unknown as ShortEp, timing: { ...tg73, tail: 3.4 } as unknown as Timing },
  // 8 Shorts nuevos 16/11/2026 (chat #25), mismo formato que TT-01 (gancho 3 s, subtitulos palabra a palabra, ficha final)
  "SHORT-11": { ep: { ...n11, hook: true } as unknown as ShortEp, timing: { ...tn11, tail: 4.2 } as unknown as Timing }, // v2 (LOTE-HK): pausas <= 0,3 s en el wav, planos <= 6 s (from fraccionario en parte 5), ficha final 4,0 s
  "SHORT-12": { ep: { ...n12, hook: true } as unknown as ShortEp, timing: { ...tn12, tail: 4.2 } as unknown as Timing }, // v2 (LOTE-HB): pausas <= 0,3 s en el wav, ficha final 4,0 s
  "SHORT-13": { ep: { ...n13, hook: true } as unknown as ShortEp, timing: { ...tn13, tail: 4.2 } as unknown as Timing }, // v2 (LOTE-HD): pausas <= 0,3 s en el wav, diagrama 3 capas, ficha final 4,0 s
  "SHORT-14": { ep: { ...n14, hook: true } as unknown as ShortEp, timing: { ...tn14, tail: 4.2 } as unknown as Timing }, // v2 (LOTE-HE): pausas <= 0,3 s en el wav, planos <= 6 s, carro en el gancho, ficha final 4,0 s
  "SHORT-15": { ep: { ...n15, hook: true } as unknown as ShortEp, timing: { ...tn15, tail: 4.2 } as unknown as Timing }, // v2 (LOTE-HH): pausas <= 0,3 s en el wav, planos <= 6 s, 'AI illustration, not a portrait' en Silver/Fry, ficha final >= 4,0 s
  "SHORT-16": { ep: { ...n16, hook: true } as unknown as ShortEp, timing: { ...tn16, tail: 4.2 } as unknown as Timing }, // v2 (LOTE-HI): pausas <= 0,3 s en el wav, planos <= 6 s, 'AI illustration, not a portrait' en Read, creditos solo fuentes abiertas, ficha final >= 4,0 s
  "SHORT-17": { ep: { ...n17, hook: true } as unknown as ShortEp, timing: { ...tn17, tail: 4.2 } as unknown as Timing }, // v4 (LOTE-IW): pausas <= 0,3 s (tighten.py), $9.99 en la etiqueta, reencuadres >= 15 %, ficha final >= 4,0 s
  "SHORT-18": { ep: { ...n18, hook: true } as unknown as ShortEp, timing: { ...tn18, tail: 4.2 } as unknown as Timing },
};
export const shortFrames = (t: Timing) => Math.ceil((t.ends[t.ends.length - 1] + (t.tail ?? TAIL)) * fps);

export const COVERS: Record<string, { img: string; src?: string; word: string; band: string; tag?: string; fx?: number; tint?: string; ws?: number; wx?: number; mark?: Mark }> = {
  "EM-052-CORTO": { img: "", src: "images/em052-art-rain.jpg", word: "COLOR?", band: "SAME PAINTING, 3 COLORS", tag: "Caillebotte, 1877 · color digitally altered", tint: "#D4121F", fx: 0.72 },
  "SHORT-053B": { img: "em053b-hallway", word: "WHY?", band: "BLAME THE MUSIC", tag: "Illustrative image", ws: 270, wx: 90 }, // v1.1: '?' mas pequeno y a la izquierda, el gato (dcha.) queda a la vista
  "SHORT-08": { img: "em025-stamp-desk", word: "MYTH?", band: "THE EYE ON THE DOLLAR", tag: "Illustrative image" },
  "SHORT-08V2": { img: "em025-bill-eye", word: "WHO?", band: "PUT THIS EYE ON YOUR MONEY", tag: "US $1 reverse · public domain" },
  "SHORT-01": { img: "em010-pocket", word: "WHY?", band: "A POCKET INSIDE THE POCKET", tag: "Illustrative image", fx: 0.35 },
  "SHORT-02": { img: "em003-scan", word: "WHY?", band: "A BARCODE ON EVERYTHING", tag: "Illustrative image" },
  "SHORT-03": { img: "em004-depression", word: "WHY?", band: "POPCORN AT THE MOVIES", tag: "Illustrative image" },
  "SHORT-04": { img: "em021-stopwatch", word: "HOW FAR?", band: "COUNT THE THUNDER", tag: "Illustrative image", fx: 0.5 },
  "SHORT-05": { img: "em022-fold-hook", word: "WHY?", band: "THE SHAPE OF A4 PAPER", tag: "Illustrative image" },
  "SHORT-06": { img: "em023-clock-night", word: "WHY?", band: "SWEDEN SWITCHES SIDES", tag: "Illustrative image" },
  "SHORT-07": { img: "em029-24", src: "images/em029-24.jpg", word: "WHEN?", band: "POMPEII'S DISPUTED DAY", tag: "Illustrative image" },
  "SHORT-09": { img: "em026-hand-heart-v", src: "images/em026-hand-heart-v.png", word: "MYTH?", band: "THE RING FINGER'S VEIN", tag: "AI illustration, not a portrait" },
  "SHORT-10": { img: "em031-zoo-winter-v", src: "images/em031-zoo-winter-v.png", word: "MYTH?", band: "PARIS EATS ITS ZOO, 1870", tag: "Illustrative image" },
  "TT-01": { img: "tt01-hands", word: "WHY?", band: "WRINKLES COME FROM NERVES", tag: "Illustrative image", fx: 0.5 },
  "TT-02": { img: "tt02-choice", word: "WHY?", band: "MOSQUITOES PICK YOU", tag: "Illustrative image", fx: 0.5 },
  "TT-03": { img: "tt03-sun", word: "WHY?", band: "SNEEZING AT THE SUN", tag: "Illustrative image", fx: 0.5 },
  "IDEA-75": { img: "tt075-01", word: "HOW LONG?", band: "A BILLION SECONDS", tag: "Illustrative image", fx: 0.5, ws: 190 },
  "IDEA-74": { img: "tt074-01", word: "WHY?", band: "THE ARMY TURNED OFF A WATERFALL", tag: "Illustrative image", fx: 0.5 },
  "IDEA-73": { img: "tt073-02", word: "HOW FAR?", band: "A FULL DAY OF LIGHT AWAY", tag: "Illustrative image", fx: 0.5 },
  "SHORT-11": { img: "s11-cake", src: "images/s11-cake.jpg", word: "100?", band: "IRELAND PAYS", tag: "Illustrative image" },
  "SHORT-12": { img: "s12-cap-macro", src: "images/s12-cap-macro.jpg", word: "WHY?", band: "THE HOLE IN THE PEN CAP", tag: "Illustrative image" },
  "SHORT-13": { img: "s13-hole-macro", src: "images/s13-hole-macro.jpg", word: "WHY?", band: "THE HOLE IN THE PLANE WINDOW", tag: "Illustrative image" },
  "SHORT-14": { img: "s14-prototype", src: "images/s14-prototype.jpg", word: "WHO?", band: "NOBODY WANTED THE SHOPPING CART", tag: "AI illustration, not a portrait", fx: 0.6 }, // v2 (LOTE-HE): carro de 1937 en la portada
  "SHORT-15": { img: "s15-wall-of-notes", src: "images/s15-wall-of-notes.jpg", word: "WHY?", band: "THE GLUE THAT FAILED", tag: "Illustrative image" },
  "SHORT-16": { img: "s16-boston39", src: "images/s16-boston39.jpg", word: "OK?", band: "WHAT THE LETTERS STAND FOR", tag: "Illustrative image" },
  "SHORT-17": { img: "s17-tag", src: "images/s17-tag.jpg", word: "WHY $9.99?", ws: 170, band: "THE LEFT-DIGIT EFFECT", tag: "Illustrative image", mark: { t: "$9.99", x: 556, y: 782, s: 260, w: 820, c: "#C8102E" } }, // v4 (LOTE-IW): precio en la etiqueta + titulo
  "SHORT-18": { img: "s18-road", src: "images/s18-road.jpg", word: "26.2?", band: "THE ODD MARATHON DISTANCE", tag: "Illustrative image" },
  "SHORT-035": { img: "em035-portada-A-over-under-v1", word: "OVER?", band: "THE 1891 PATENT EVERYONE CITES", tag: "Illustrative image" },
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Trozos de subtitulo de 46 letras como maximo (cortando por frases y comas). */
const GLUE = /^(a|an|the|to|of|in|on|at|for|and|or|that|its|your|his|her|their|united|second|back|front|world|three|hundred|hot|cold|title)$/i;
const chunk = (s: string, max = 46): string[] => {
  const split = (x: string): string[] => {
    x = x.trim();
    if (x.length <= max) return [x];
    const mid = x.length / 2;
    const cost = (m: RegExpMatchArray) => { // corte cerca de la mitad, mejor tras coma, nunca dejando "United / States" ni una palabra suelta
      const c = m.index! + (m[0].length > 1 ? 1 : 0);
      const prev = x.slice(0, m.index!).split(" ").pop()!, next = x.slice(m.index! + m[0].length).split(" ")[0];
      return { c, k: Math.abs(c - mid) - (m[0].length > 1 ? 14 : 0) + (GLUE.test(prev) || /^states$/i.test(next) ? 25 : 0) + (Math.min(c, x.length - c) < 12 ? 40 : 0) };
    };
    const best = [...x.matchAll(/[,:;] |\s/g)].map(cost).sort((a, b) => a.k - b.k)[0];
    const c = best?.c ?? Math.floor(mid);
    return [...split(x.slice(0, c)), ...split(x.slice(c))];
  };
  const out: string[] = [];
  for (const x of (s.match(/[^.?!]+[.?!]*\s*/g) ?? [s]).flatMap(split)) { // trozos de <=6 letras ("Five.", "Ten.") se pegan al anterior
    if (x.trim().length <= 6 && out.length) out[out.length - 1] += " " + x.trim(); else out.push(x);
  }
  return out;
};

const Caption: React.FC<{ text: string; frames: number }> = ({ text, frames }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 4, frames - 3, frames], [0, 1, 1, 0], clamp);
  const ref = useRef<HTMLDivElement>(null);
  const [three, setThree] = useState(false); // subtitulo de 3 lineas: sube 10 px para no pisar la interfaz
  useLayoutEffect(() => { // medir tambien cuando la fuente ya esta cargada (si no, el 1er subtitulo sale ~27 px mas alto)
    const m = () => setThree((ref.current?.offsetHeight ?? 0) > 76 * 1.14 * 2.5);
    m();
    const h = delayRender("caption fonts");
    document.fonts.ready.then(() => { m(); continueRender(h); }).catch((e) => cancelRender(e));
  }, [text]);
  return (
    <div style={{ position: "absolute", left: 60, right: 130, top: three ? 1348 : 1375, height: 260, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: theme.font, fontWeight: 800, fontSize: 76, lineHeight: 1.14, textWrap: "balance", color: "#fff", textShadow: `0 0 10px ${NAVY}, 0 4px 14px ${NAVY}, 0 0 4px ${NAVY}`, WebkitTextStroke: `3px ${NAVY}`, paintOrder: "stroke fill", opacity: o }}>
      <div ref={ref}>{text.split(/(\w+-\w+)/).map((w, i) => (i % 2 ? <span key={i} style={{ whiteSpace: "nowrap" }}>{w}</span> : w))}</div>
    </div>
  );
};

const POP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** Subtitulo palabra a palabra: grupo de <=3 palabras con la palabra que suena resaltada en amarillo. */
export const WordGroup: React.FC<{ ws: { w: string; f: number }[]; frames: number }> = ({ ws, frames }) => {
  const f = useCurrentFrame();
  const act = ws.reduce((a, x, i) => (f >= x.f ? i : a), 0);
  const e = Math.min(2, Math.floor((frames - 1) / 2)); // grupos de <=4 fotogramas: rango siempre creciente
  const o = e < 1 ? 1 : interpolate(f, [0, e, frames - e, frames], [0, 1, 1, 0], POP);
  const longest = Math.max(...ws.map((x) => x.w.length));
  const fs = Math.min(104, Math.floor(860 / (longest * 0.72))); // una palabra larga (HUNDREDTH-BIRTHDAY) nunca se sale del cuadro
  return (
    <div style={{ position: "absolute", left: 60, right: 130, top: 1262, height: 300, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: theme.font, fontWeight: 900, fontSize: fs, lineHeight: 1.08, textTransform: "uppercase", textWrap: "balance", WebkitTextStroke: `9px ${NAVY}`, paintOrder: "stroke fill", textShadow: `0 6px 18px ${NAVY}`, opacity: o }}>
      <div>{ws.map((x, i) => <span key={i} style={{ display: "inline-block", marginRight: i < ws.length - 1 ? 36 : 0, whiteSpace: "nowrap", color: i === act ? YEL : "#fff", transform: i === act ? `scale(${interpolate(f - x.f, [0, 3], [0.9, Math.min(1.08, 1 + 36 / (x.w.length * fs * 0.72))], POP)})` : "scale(1)" }}>{x.w}</span>)}</div>
    </div>
  );
};

/** Titulo de la ficha, primeros 3,4 s. */
const HookTitle: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 6, 90, 102], [0, 1, 1, 0], POP);
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: 260, opacity: o, transform: `translateY(${(1 - o) * -30}px) rotate(-1.5deg)`, background: YEL, padding: "22px 28px", fontFamily: IMPACT, fontSize: 84, lineHeight: 1.1, color: NAVY, textAlign: "center", textWrap: "balance", boxShadow: "0 10px 0 rgba(0,0,0,.35)" }}>{text}</div>
  );
};

/** Pantalla final de la ficha: rotulo de imagen ilustrativa + fuentes. */
const FinCard: React.FC<{ fin: NonNullable<ShortEp["fin"]>; frames: number }> = ({ fin, frames }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: interpolate(f, [0, 8], [0, 1], POP) }}>
      <Photo img={fin.img} src={fin.src} frames={frames} z={fin.z} ox={fin.ox} oy={fin.oy} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,26,74,.8), rgba(10,26,74,.92))" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: theme.font, padding: "0 70px 220px", gap: 50 }}>
        <div style={{ fontSize: 76, fontWeight: 800, color: "#fff", lineHeight: 1.15, textWrap: "balance" }}>{fin.big}</div>
        <div style={{ fontSize: 42, fontWeight: 600, color: "#E8EEF9", lineHeight: 1.3, textWrap: "balance" }}>{fin.small}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Ficha de fuentes sobre la foto mientras suena la ultima frase (fin.at): los subtitulos quedan debajo y a la vista. */
const FinPanel: React.FC<{ fin: NonNullable<ShortEp["fin"]> }> = ({ fin }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 560, opacity: interpolate(f, [0, 8], [0, 1], POP), background: "rgba(10,26,74,.9)", borderRadius: 18, padding: "40px 44px", textAlign: "center", fontFamily: theme.font, textWrap: "balance" }}>
      <div style={{ fontSize: 66, fontWeight: 800, color: "#fff", lineHeight: 1.15 }}>{fin.big}</div>
      <div style={{ fontSize: 40, fontWeight: 600, color: "#E8EEF9", lineHeight: 1.3, marginTop: 28 }}>{fin.small}</div>
    </div>
  );
};

const MarkText: React.FC<{ m: Mark }> = ({ m }) => {
  const s = m.s ?? 150, w = m.w ?? 240;
  return <div style={{ position: "absolute", left: m.x - w / 2, width: w, top: m.y - s * 0.53, textAlign: "center", fontFamily: IMPACT, fontSize: s, lineHeight: `${Math.round(s * 1.07)}px`, color: m.c ?? NAVY, whiteSpace: "nowrap" }}>{m.t}</div>;
};

const Photo: React.FC<{ img?: string; src?: string; frames: number; kb?: string; z?: number; ox?: string; oy?: string; pan?: [number, number]; marks?: Mark[] }> = ({ img, src, frames, kb = "in", z = 1.04, ox = "50%", oy = "50%", pan, marks }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, frames], [0, 1], clamp);
  const sc = z + (kb === "still" ? 0 : 0.1 * k);
  const dx = kb === "left" ? -50 * k : kb === "right" ? 50 * k - 50 : 0;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: WIN.h, transformOrigin: `${ox} ${oy}`, transform: `translateX(${dx}px) scale(${sc})` }}>
      <Img src={staticFile(src ?? `illustrations/${img}.png`)} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: WIN.h, objectFit: "cover", objectPosition: pan ? `${pan[0] + (pan[1] - pan[0]) * k}% 50%` : undefined }} />
      {marks?.map((m, i) => <MarkText key={i} m={m} />)}
    </div>
  );
};

/** Panel de papel liso (sin foto) para diagramas 100% vectoriales: calendario romano, marcador de fecha. */
const PaperPanel: React.FC = () => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: WIN.h, background: theme.bg, backgroundImage: "linear-gradient(rgba(20,33,61,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(20,33,61,0.06) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
);

const LabelBox: React.FC<{ l: Label; frames: number }> = ({ l, frames }) => {
  const f = useCurrentFrame();
  const fr = Math.max(frames, 12); // plano corto (<12 fotogramas): evita rango no creciente
  const o = interpolate(f, [0, 6, fr - 4, fr], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 40, top: 270, maxWidth: 900, background: "rgba(247,243,234,0.96)", borderLeft: `16px solid ${theme.orange}`, padding: "18px 28px", borderRadius: 6, opacity: o, transform: `translateY(${(1 - o) * -24}px)`, fontFamily: theme.font, boxShadow: "0 8px 24px rgba(0,0,0,.25)" }}>
      <div style={{ fontSize: 60, fontWeight: 800, color: theme.ink, lineHeight: 1.12, whiteSpace: "pre-line", textWrap: "balance" }}>{l.t}</div>
      {l.s && <div style={{ fontSize: 36, fontWeight: 700, color: theme.teal, marginTop: 8 }}>{l.s}</div>}
    </div>
  );
};

/** Rotulo "Illustrative image"/"AI illustration..." de la esquina. Se oculta en los ultimos fotogramas
 * del solape con el siguiente plano para que no quede visible a la vez que el rotulo del plano entrante
 * (bug LOTE-DR: dos rotulos distintos superpuestos e ilegibles en la transicion). */
const TagBox: React.FC<{ tag: string; frames: number; hideTail: number }> = ({ tag, frames, hideTail }) => {
  const f = useCurrentFrame();
  if (hideTail > 0 && f >= frames - hideTail) return null;
  return (
    <div style={{ position: "absolute", left: 40, top: 178, background: "rgba(10,26,74,.85)", color: "#fff", fontFamily: theme.font, fontWeight: 700, fontSize: 32, padding: "6px 20px", borderRadius: 6 }}>{tag}</div>
  );
};

const StampBox: React.FC<{ s: Stamp; idx: number }> = ({ s, idx }) => {
  const f = useCurrentFrame();
  const sc = interpolate(f, [0, 7], [1.8, 1], clamp);
  const o = interpolate(f, [0, 4], [0, 1], clamp);
  const col = s.c === "teal" ? theme.teal : theme.orange;
  return (
    <div style={{ position: "absolute", left: 120, top: s.y ?? 560 + idx * 380, width: 840, textAlign: "center", opacity: o, transform: `rotate(${idx ? 4 : -5}deg) scale(${sc})`, border: `14px solid ${col}`, borderRadius: 18, background: "rgba(247,243,234,0.93)", padding: "14px 10px", color: col, fontFamily: IMPACT }}>
      <div style={{ fontSize: s.t.length > 6 ? 125 : 150, lineHeight: 1.05, letterSpacing: s.t.length > 6 ? 0 : 4 }}>{s.t}</div>
      <div style={{ fontFamily: theme.font, fontWeight: 800, fontSize: 52, color: theme.ink }}>{s.s}</div>
    </div>
  );
};

const EndCard: React.FC<{ title: string; img?: string; src?: string; frames: number }> = ({ title, img, src, frames }) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 6) * 12;
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      {(img || src) && <Photo img={img} src={src} frames={frames} />}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,26,74,.55) 0%, rgba(10,26,74,.82) 45%, rgba(10,26,74,.92) 100%)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: theme.font, padding: "0 60px 330px" }}>
        <div style={{ background: theme.orange, color: "#fff", fontWeight: 800, fontSize: 54, letterSpacing: 6, padding: "10px 36px", borderRadius: 60 }}>THE FULL STORY</div>
        <div style={{ fontSize: 84, fontWeight: 800, color: "#fff", lineHeight: 1.12, marginTop: 50, textShadow: `0 4px 14px ${NAVY}` }}>{title}</div>
        <div style={{ fontSize: 120, color: YEL, marginTop: 40, transform: `translateY(${bob}px)` }}>{"▼"}</div>
        <div style={{ fontSize: 56, fontWeight: 700, color: "#fff" }}>Video linked below</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Vector simplificado (plano del disenador, no viene en la foto): linea del anular al pecho, SHORT-09. */
const VeinLine: React.FC<{ variant: "line" | "nerve" | "break"; frames: number }> = ({ variant, frames }) => {
  const f = useCurrentFrame();
  const drawEnd = Math.min(18, frames);
  const draw = interpolate(f, [0, drawEnd], [0, 1], clamp);
  const fade = variant === "break" ? interpolate(f, [16, 30], [1, 0.3], clamp) : 1;
  const d = "M 660 1180 C 600 1000 560 880 500 760";
  return (
    <svg viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, width: 1080, height: WIN.h, opacity: fade }}>
      <path d={d} fill="none" stroke="#C1121F" strokeWidth={variant === "nerve" ? 5 : 9} strokeDasharray={variant === "break" ? "16 16" : 900} strokeDashoffset={900 - 900 * draw} strokeLinecap="round" />
    </svg>
  );
};

/** Grupos de <=3 palabras (corte tras puntuacion) con inicio en fotogramas desde los tiempos por palabra de Kokoro. */
export const wordGroups = (t: Timing) => {
  const all = t.words!.flatMap((ws, i) => { const a = i ? t.ends[i - 1] : 0; return ws.map(([w, s, e], j) => ({ w, s: a + s, e: a + e, last: j === ws.length - 1 })); });
  const gs: (typeof all)[] = [];
  let cur: typeof all = [];
  for (const x of all) {
    cur.push(x);
    if (cur.length >= 3 || /[.?!,;:]$/.test(x.w) || cur.reduce((n, y) => n + y.w.length, 0) > 18) { gs.push(cur); cur = []; }
  }
  if (cur.length) gs.push(cur);
  return gs.map((g, k) => {
    const from = Math.round((g[0].s - 0.04) * fps);
    const nxt = gs[k + 1]?.[0].s ?? Infinity;
    const to = Math.round(Math.min(nxt - 0.02, g[g.length - 1].e + 0.35) * fps);
    return { from, dur: Math.max(to - from, 6), ws: g.map((x) => ({ w: x.w, f: Math.round(x.s * fps) - from })) };
  }).flatMap(twoLines);
};
// 17/11 (LOTE-HF): un grupo nunca pasa de 2 lineas. Misma cuenta de ancho que WordGroup (caja 890 px, 36 px entre palabras, 0,75 por margen).
type WG = { from: number; dur: number; ws: { w: string; f: number }[] };
const wgLines = (ws: { w: string }[]) => {
  const fs = Math.min(104, Math.floor(860 / (Math.max(...ws.map((x) => x.w.length)) * 0.72)));
  let n = 1, x = 0;
  for (const { w } of ws) { const wd = w.length * fs * 0.75; if (x && x + 36 + wd > 890) { n++; x = wd; } else x += (x ? 36 : 0) + wd; }
  return n;
};
const twoLines = (g: WG): WG[] => {
  let k = g.ws.length;
  while (k > 1 && wgLines(g.ws.slice(0, k)) > 2) k--;
  if (k === g.ws.length) return [g];
  const cut = g.ws[k].f - 1;
  return [{ from: g.from, dur: cut, ws: g.ws.slice(0, k) }, ...twoLines({ from: g.from + cut, dur: g.dur - cut, ws: g.ws.slice(k).map((x) => ({ ...x, f: x.f - cut })) })];
};

const MOV_DIRS: MotionDir[] = ["left", "right", "up"];

export const ShortGeneric: React.FC<ShortProps> = ({ ep, timing, mov, noSubs }) => {
  const start0 = (i: number) => (i === 0 ? 0 : timing.ends[i - 1]);
  const start = (i: number) => { const k = Math.floor(i); return start0(k) + (i - k) * (timing.ends[k] - start0(k)); }; // from fraccionario (p. ej. 5.5) = plano partido dentro de una frase larga
  const solo = (i: number) => timing.solo?.[String(i)] ?? 0;
  const speechEnd = (i: number) => timing.ends[i] - solo(i) - (timing.gap ?? GAP);
  const total = shortFrames(timing);
  const fr = (s: number) => Math.round(s * fps);
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, backgroundImage: "linear-gradient(rgba(20,33,61,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(20,33,61,0.05) 1px, transparent 1px)", backgroundSize: "80px 80px" }}>
      <Audio src={staticFile(`audio/${ep.id}.wav`)} />
      {ep.hookScene && <HookSceneView scene={ep.hookScene} endS={start(ep.hookScene.until) + 0.3} />}
      {ep.beats.map((b, k) => {
        const a = fr(start(b.from));
        const last = k === ep.beats.length - 1;
        const frames = (last ? total : fr(start(ep.beats[k + 1].from))) - a + (last ? 0 : 9);
        const lab = b.labels ?? [];
        const fadeN = b.end ? 4 : 9; // frames de entrada del plano; label/stamp no debe empezar antes (bug LOTE-DS: doble transparencia fantasma sobre el plano saliente, aun opaco)
        return (
          <Sequence key={k} from={a} durationInFrames={frames} name={`beat-${k}`}>
            <FadeIn first={k === 0 && !ep.hookScene} n={fadeN}>
              <div style={{ position: "absolute", left: 0, top: WIN.top, width: 1080, height: WIN.h, overflow: "hidden" }}>
                {b.diagram ? <>{b.img && <Photo img={b.img} frames={frames} kb={b.kb} z={b.z} ox={b.ox} oy={b.oy} />}<TTDiagram kind={b.diagram} /></> : b.end ? <EndCard title={ep.title} img={ep.beats[k - 1]?.img} src={ep.beats[k - 1]?.src} frames={frames} /> : b.paper ? <PaperPanel /> : mov ? <MotionImage img={b.img!} frames={frames} dir={MOV_DIRS[k % MOV_DIRS.length]} /> : <Photo img={b.img} src={b.src} frames={frames} kb={b.kb} z={b.z} ox={b.ox} oy={b.oy} pan={b.pan} marks={b.marks} />}
                {b.tint && <div style={{ position: "absolute", inset: 0, background: b.tint, mixBlendMode: "color" }} />/* retintado: el tag del beat debe decir "Color digitally altered" */}
                {b.vein && <VeinLine variant={b.vein} frames={frames} />}
                {lab.map((l, j) => {
                  const l0 = Math.max(fr(start(l.p)) - a, k === 0 ? 0 : fadeN);
                  const l1 = j + 1 < lab.length ? fr(start(lab[j + 1].p)) - a : frames - (last ? 0 : 9); // el ultimo rotulo termina antes del solape de 9 fotogramas con el siguiente plano
                  return (
                    <Sequence key={j} from={l0} durationInFrames={Math.max(l1 - l0, 1)}>
                      <LabelBox l={l} frames={Math.max(l1 - l0, 1)} />
                    </Sequence>
                  );
                })}
                {(b.stamps ?? []).map((s, j) => {
                  const s0 = Math.max(fr(start(s.p)) - a, k === 0 ? 0 : fadeN);
                  const s1 = frames - (last ? 0 : 9); // el sello tampoco invade el solape con el siguiente plano
                  return (
                    <Sequence key={j} from={s0} durationInFrames={Math.max(s1 - s0, 1)}>
                      <StampBox s={s} idx={j} />
                    </Sequence>
                  );
                })}
                {b.tag && <TagBox tag={b.tag} frames={frames} hideTail={last ? 0 : 9} />}
              </div>
            </FadeIn>
          </Sequence>
        );
      })}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(10,26,74,0) 62%, rgba(10,26,74,.82) 80%, rgba(10,26,74,.9) 100%)`, pointerEvents: "none" }} />
      {ep.beats.filter((b) => b.credit).map(({ credit: c }) => { // credito exacto de la pieza mientras suena sola (narrador callado), encima del degradado
        const c0 = fr(timing.ends[c!.p] - solo(c!.p)), c1 = fr(timing.ends[c!.p]) - 2;
        return <Sequence key={`cr-${c!.p}`} from={c0} durationInFrames={Math.max(c1 - c0, 1)}><CreditBox text={c!.t} frames={Math.max(c1 - c0, 1)} /></Sequence>;
      })}
      <div style={{ position: "absolute", top: 100, left: 0, right: 0, textAlign: "center", fontFamily: theme.font, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: "#fff" }}><span style={{ background: "rgba(10,26,74,.85)", padding: "6px 26px", borderRadius: 6 }}>THE EVERYDAY MYSTERY</span></div>
      {!noSubs && timing.words && wordGroups(timing).map((g, k) => <Sequence key={`w${k}`} from={g.from} durationInFrames={g.dur} name={`words-${k}`}><WordGroup ws={g.ws} frames={g.dur} /></Sequence>)}
      {ep.hook && <Sequence durationInFrames={fr(3.4)}><HookTitle text={ep.title} /></Sequence>}
      {ep.fin?.at && <Sequence from={fr(ep.fin.at)} durationInFrames={total - fr(ep.fin.at)}><FinPanel fin={ep.fin} /></Sequence>}
      {ep.fin && !ep.fin.at && <Sequence from={fr(timing.ends[timing.ends.length - 1] + 0.2)} durationInFrames={total - fr(timing.ends[timing.ends.length - 1] + 0.2)}><FinCard fin={ep.fin} frames={total - fr(timing.ends[timing.ends.length - 1] + 0.2)} /></Sequence>}
      {!timing.words && ep.parts.flatMap((text, i) => {
        const a = start(i);
        const bnd = speechEnd(i) + (i === ep.parts.length - 1 ? 0.5 : 0.1); // el ultimo subtitulo no se apaga antes de acabar la voz
        const ch = chunk(text, ep.capMax);
        const tot = ch.reduce((n, c) => n + c.length, 0);
        const cs = ep.capStarts?.[String(i)]; // inicios de subtitulo medidos con Whisper (s desde el inicio de la parte)
        let acc = 0;
        return ch.map((c, j) => {
          const from = cs && cs.length === ch.length ? fr(a + cs[j]) : fr(a + ((bnd - a) * acc) / tot);
          acc += c.length;
          const to = cs && cs.length === ch.length ? fr(j + 1 < ch.length ? a + cs[j + 1] : bnd) : fr(a + ((bnd - a) * acc) / tot);
          return (
            <Sequence key={`${i}-${j}`} from={from} durationInFrames={Math.max(to - from, 6)} name={`cap-${i}-${j}`}>
              <Caption text={c} frames={Math.max(to - from, 6)} />
            </Sequence>
          );
        });
      })}
    </AbsoluteFill>
  );
};

const CreditBox: React.FC<{ text: string; frames: number }> = ({ text, frames }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 6, frames - 6, frames], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1420, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ background: "rgba(10,26,74,.88)", color: "#fff", fontFamily: theme.font, fontWeight: 700, fontSize: 40, lineHeight: 1.2, padding: "14px 28px", borderRadius: 8, textAlign: "center", textWrap: "balance" }}>
        <div style={{ color: YEL, fontSize: 30, letterSpacing: 4, marginBottom: 4 }}>NOW PLAYING</div>{text}
      </div>
    </div>
  );
};

const FadeIn: React.FC<{ first: boolean; n?: number; children: React.ReactNode }> = ({ first, n = 9, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: first ? 1 : interpolate(f, [0, n], [0, 1], clamp) }}>{children}</AbsoluteFill>;
};

/** Portada vertical 1080x1920 (sistema v3: foto a sangre, azul profundo + amarillo, palabra Impact). */
export const ShortCover: React.FC<{ id: string }> = ({ id }) => {
  const c = COVERS[id];
  const stroke: React.CSSProperties = { WebkitTextStroke: `14px ${NAVY}`, paintOrder: "stroke fill", textShadow: `0 10px 0 ${NAVY}, 0 18px 30px rgba(0,0,0,.55)` };
  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1500, overflow: "hidden" }}>
        <Img src={staticFile(c.src ?? `illustrations/${c.img}.png`)} style={{ position: "absolute", left: -(c.fx ?? 0.5) * 420, top: 0, width: 1500, height: 1500, objectFit: "cover" }} />
        {c.tint && <div style={{ position: "absolute", inset: 0, background: c.tint, mixBlendMode: "color" }} />}
        {c.mark && <MarkText m={c.mark} />}
      </div>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(10,26,74,.75) 0%, rgba(10,26,74,0) 28%, rgba(10,26,74,0) 55%, ${NAVY} 82%)` }} />
      <div style={{ position: "absolute", top: 90, left: 0, right: 0, textAlign: "center", fontFamily: theme.font, fontWeight: 800, fontSize: 38, letterSpacing: 8, color: "#fff" }}>THE EVERYDAY MYSTERY</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1060, textAlign: "center", fontFamily: IMPACT, fontSize: c.ws ?? (c.word.length > 6 ? 250 : 340), paddingRight: c.wx ?? 0, lineHeight: 1, color: "#fff", transform: "rotate(-2deg)", ...stroke }}>{c.word}</div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 1440, background: YEL, padding: "26px 30px", transform: "rotate(-1.5deg)", fontFamily: IMPACT, fontSize: 80, lineHeight: 1.08, color: NAVY, textAlign: "center", boxShadow: "0 10px 0 rgba(0,0,0,.35)" }}>{c.band}</div>
      {c.tag && <div style={{ position: "absolute", left: 40, top: 150, background: "rgba(10,26,74,.85)", color: "#fff", fontFamily: theme.font, fontWeight: 700, fontSize: 30, padding: "6px 18px", borderRadius: 6 }}>{c.tag}</div>}
    </AbsoluteFill>
  );
};
