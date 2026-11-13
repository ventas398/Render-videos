import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { theme, VIDEO } from "../themes/brand";
import { fade } from "../utils/anim";

export type Box = { left: number; top: number; width: number; height: number };

export type Shot = {
  src: string; // ruta dentro de public/
  credit: string; // "Autor, licencia"
  note?: string; // descripcion neutra opcional, encima del credito
  box: Box;
  from: number; // s, relativo a la escena
  to: number;
  z: [number, number]; // zoom inicial -> final (Ken Burns)
  pos: [[number, number], [number, number]]; // object-position % inicial -> final (paneo)
  origin?: string; // transform-origin del zoom
};

const PAD = 14;
const FADE = 0.5;

/** Foto enmarcada en tarjeta "papel" con Ken Burns lento y credito discreto debajo. */
export const PhotoShot: React.FC<{ shot: Shot }> = ({ shot }) => {
  const t = useCurrentFrame() / VIDEO.fps;
  const { box, from, to } = shot;
  const o = fade(t, from, from + FADE, to, to + FADE);
  if (o <= 0) return null;
  const p = interpolate(t, [from, to + FADE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = shot.z[0] + (shot.z[1] - shot.z[0]) * p;
  const px = shot.pos[0][0] + (shot.pos[1][0] - shot.pos[0][0]) * p;
  const py = shot.pos[0][1] + (shot.pos[1][1] - shot.pos[0][1]) * p;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: box.left,
          top: box.top,
          width: box.width,
          height: box.height,
          boxSizing: "border-box",
          padding: PAD,
          background: theme.panel,
          border: `3px solid ${theme.panelLine}`,
          borderRadius: 28,
          boxShadow: "0 18px 40px rgba(20,33,61,0.16)",
          opacity: o,
        }}
      >
        <div style={{ width: "100%", height: "100%", overflow: "hidden", borderRadius: 16, position: "relative" }}>
          <Img
            src={staticFile(shot.src)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: `${px}% ${py}%`,
              transform: `scale(${z})`,
              transformOrigin: shot.origin ?? "50% 50%",
            }}
          />
        </div>
      </div>
      {shot.note && (
        <div
          style={{
            position: "absolute",
            left: box.left,
            top: box.top + box.height + 8,
            width: box.width,
            textAlign: "center",
            fontFamily: theme.font,
            fontWeight: 700,
            fontSize: 26,
            color: theme.ink,
            opacity: 0.8 * o,
          }}
        >
          {shot.note}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          left: box.left,
          top: box.top + box.height + (shot.note ? 42 : 10),
          width: box.width,
          textAlign: "right",
          fontFamily: theme.font,
          fontSize: 20,
          color: theme.ink,
          opacity: 0.55 * o,
        }}
      >
        Photo: {shot.credit} - Wikimedia Commons
      </div>
    </>
  );
};
