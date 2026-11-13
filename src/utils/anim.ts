import { Easing, interpolate } from "remotion";

export const ease = Easing.inOut(Easing.cubic);

/** 0 -> 1 entre a y b (segundos), suavizado. */
export const ramp = (t: number, a: number, b: number): number =>
  interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

/** 0 -> 1 -> 1 -> 0 (entrada a..b, salida c..d). */
export const fade = (t: number, a: number, b: number, c: number, d: number): number =>
  interpolate(t, [a, b, c, d], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
