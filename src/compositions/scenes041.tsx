// EM-041 (por que botan tan distinto las pelotas): kit2 (mkScene). 8 fotos horizontales em041-* reutilizadas en los 12 capitulos
// (solo 8 imagenes para 50 partes). Genericas, sin personas/equipos reconocibles -> sin "Illustrative image" ni AI/SI arrays.
// Cortes de pelota (football/basketball/tenis/ping-pong) pendientes: deben ser diagrama vectorial propio, nunca foto/IA (orden de Javier,
// ver EM-041-GUION.md) -- no abordado en esta pasada, paso acotado.
import React from "react";
import { orange, teal } from "./kit";
import type { SceneProps } from "./scenes";
import { FULL, Kin, Pill, Reading } from "./scenes023";
import { Stp } from "./scenes025";
import { mkScene } from "./v2";

const scene = mkScene("em041-", {}, [], []);
const W = (id: string, t: number, f: [number, number], mv: string, tr: string, z?: number) => ({ id, asp: 1672 / 941, t, r: FULL, f, mv, tr, ...(z ? { z } : {}) }) as never;
type PF = (part: number, o?: number) => number;

/** Rotulo corto de la parte n; i = 0 arriba, 1 debajo. */
const cap = (P: PF, n: number, text: string, i = 0, m = n + 1, dy = 0) => (
  <Kin key={`${n}${i}`} x={960} y={(i ? 340 : 190) + dy} text={text} size={Math.max(66, Math.min(150, Math.round(2250 / text.length)))} fill={(n + i) % 2 ? orange : teal} a={P(n, 0.2 + i * 1.1)} b={P(m)} rot={(n + i) % 2 ? 3 : -3} />
);

const ch01 = scene(0, "ch01", (P) => ({
  shots: [W("five-balls-photo-h", 0, [0.5, 0.5], "in", "cut"), W("bounce-lab-setting-h", P(3), [0.5, 0.5], "pr", "page")],
  ov: (
    <>
      {cap(P, 0, "A TENNIS BALL: WAIST HIGH")}
      {cap(P, 1, "A FOOTBALL: BARELY BOUNCES")}
      {cap(P, 2, "BOTH JUST RUBBER AND AIR")}
      {cap(P, 3, "WHY SO DIFFERENT?")}
      {cap(P, 4, "NOT JUST “MORE AIR”", 1)}
    </>
  ),
}));

const ch02 = scene(5, "ch02", (P) => ({
  shots: [W("bounce-lab-setting-h", P(5), [0.5, 0.5], "in", "wl")],
  ov: (
    <>
      {cap(P, 5, "FIVE SPORTS. ONE SCANDAL.")}
      {cap(P, 5, "ONE PHYSICS IDEA.", 1)}
    </>
  ),
}));

const ch03 = scene(6, "ch03", (P) => ({
  shots: [W("football-photo-h", P(6), [0.5, 0.5], "in", "cut"), W("material-closeup-h", P(8), [0.5, 0.5], "pl", "page")],
  ov: (
    <>
      {cap(P, 6, "START WITH FOOTBALL")}
      {cap(P, 7, "SIZE, WEIGHT, PRESSURE, SHAPE")}
      {cap(P, 8, "A RANGE, NOT ONE NUMBER")}
      <Stp x={960} y={700} k="D" size={60} a={P(9, 0.3)} />
    </>
  ),
}));

const ch04 = scene(10, "ch04", (P) => ({
  shots: [W("basketball-photo-h", P(10), [0.5, 0.5], "in", "cut"), W("bounce-lab-setting-h", P(13), [0.5, 0.5], "pr", "wl")],
  ov: (
    <>
      {cap(P, 10, "BASKETBALL IS DIFFERENT")}
      {cap(P, 11, "DROP IT. MEASURE THE BOUNCE.")}
      {cap(P, 12, "SOME SAY THERE'S A PSI RANGE...")}
      {cap(P, 13, "...OTHERS SAY THERE'S NONE", 1)}
      <Stp x={960} y={700} k="P" size={60} a={P(14, 0.3)} />
    </>
  ),
}));

const ch05 = scene(15, "ch05", (P) => ({
  shots: [W("tennis-photo-h", P(15), [0.5, 0.5], "in", "cut"), W("bounce-lab-setting-h", P(17), [0.5, 0.5], "pl", "page")],
  ov: (
    <>
      {cap(P, 15, "TENNIS IS STRICTER")}
      {cap(P, 16, "ONLY APPROVED BALLS PLAY")}
      {cap(P, 17, "WARMED, SQUEEZED, WEIGHED, DROPPED")}
      <Stp x={960} y={700} k="D" size={60} a={P(18, 0.3)} />
    </>
  ),
}));

const ch06 = scene(19, "ch06", (P) => ({
  shots: [W("pingpong-photo-h", P(19), [0.5, 0.5], "in", "cut"), W("material-closeup-h", P(21), [0.5, 0.5], "pr", "zoom")],
  ov: (
    <>
      {cap(P, 19, "TABLE TENNIS: MATERIAL MATTERS")}
      {cap(P, 20, "CELLULOID → PLASTIC, ~2014")}
      {cap(P, 21, "SAME TEST: DROP ON STEEL")}
      {cap(P, 22, "THE MATERIAL CHANGED THE GAME")}
      <Stp x={760} y={700} k="P" size={54} a={P(23, 0.3)} />
      <Stp x={1160} y={700} k="D" size={54} a={P(23, 0.6)} />
    </>
  ),
}));

const ch07 = scene(24, "ch07", (P) => ({
  shots: [W("nfl-photo-h", P(24), [0.5, 0.5], "in", "cut"), W("nfl-photo-h", P(27), [0.5, 0.5], "pl", "page")],
  ov: (
    <>
      {cap(P, 24, "FOOTBALL'S MOST FAMOUS CONTROVERSY")}
      <Pill x={960} y={150} text="12.5–13.5 PSI" size={56} color={teal} a={P(25, 0.2)} b={P(26)} />
      {cap(P, 26, "DEFLATEGATE, 2015", 1)}
      {cap(P, 27, "EVERY BALL LOGGED BY HAND")}
      <Stp x={760} y={700} k="D" size={54} a={P(28, 0.3)} />
      <Stp x={1160} y={700} k="P" size={54} a={P(28, 0.6)} />
    </>
  ),
}));

const ch08 = scene(29, "ch08", (P) => ({
  shots: [W("bounce-lab-setting-h", P(29), [0.5, 0.5], "in", "cut"), W("five-balls-photo-h", P(32), [0.5, 0.5], "pr", "wl")],
  ov: (
    <>
      {cap(P, 29, "SO WHY FIGHT OVER PRESSURE?")}
      {cap(P, 30, "HERE'S THE PHYSICS", 1)}
      {cap(P, 31, "COEFFICIENT OF RESTITUTION")}
      {cap(P, 32, "MORE PRESSURE, MORE BOUNCE...")}
      {cap(P, 33, "...BUT WITH DIMINISHING RETURNS", 1)}
      <Stp x={960} y={700} k="D" size={60} a={P(34, 0.3)} />
    </>
  ),
}));

const ch09 = scene(35, "ch09", (P) => ({
  shots: [W("material-closeup-h", P(35), [0.5, 0.5], "in", "cut")],
  ov: (
    <>
      {cap(P, 35, "PRESSURE ISN'T EVERYTHING")}
      {cap(P, 36, "MATERIAL AND TEMPERATURE MATTER TOO")}
      {cap(P, 37, "COLD RUBBER BOUNCES LESS")}
      {cap(P, 38, "A HOT SQUASH BALL: MOSTLY THE RUBBER", 1)}
      {cap(P, 39, "IT WAS NEVER JUST THE AIR")}
    </>
  ),
}));

const ch10 = scene(40, "ch10", (P) => ({
  shots: [W("football-photo-h", P(40), [0.5, 0.5], "in", "cut"), W("basketball-photo-h", P(42), [0.5, 0.5], "pr", "wl"), W("pingpong-photo-h", P(43), [0.5, 0.5], "pl", "page"), W("nfl-photo-h", P(44), [0.5, 0.5], "pr", "wl")],
  ov: (
    <>
      {cap(P, 40, "THAT'S WHY NO SPORT TRUSTS ONE NUMBER")}
      {cap(P, 41, "FOOTBALL: SHAPE + WATER + PRESSURE", 1)}
      {cap(P, 42, "BASKETBALL & TENNIS: DROP HEIGHT")}
      {cap(P, 43, "TABLE TENNIS: STEEL BLOCK", 1)}
      {cap(P, 44, "EVEN THE NFL CHECKS BY HAND")}
      {cap(P, 45, "THEY TEST BEHAVIOR, NOT AIR", 1)}
    </>
  ),
}));

const ch11 = scene(46, "ch11", (P) => ({
  shots: [W("five-balls-photo-h", P(46), [0.5, 0.5], "in", "cut")],
  ov: (
    <>
      {cap(P, 46, "“JUST MORE AIR”? ONLY HALF TRUE")}
      {cap(P, 47, "AIR VS. SHELL: A CONSTANT FIGHT", 1)}
      {cap(P, 48, "FIVE SPORTS, FIVE WAYS TO TEST IT")}
    </>
  ),
}));

const ch12 = scene(49, "ch12", (P) => ({
  shots: [W("pingpong-photo-h", P(49), [0.5, 0.5], "in", "fade")],
  ov: (
    <>
      <Reading x={960} y={700} a={P(49, 0.3)} />
      {cap(P, 49, "WHICH ONE IS WINNING RIGHT NOW?")}
    </>
  ),
}));

export const SCENES041: Record<string, React.FC<SceneProps>> = { ch01, ch02, ch03, ch04, ch05, ch06, ch07, ch08, ch09, ch10, ch11, ch12 };
