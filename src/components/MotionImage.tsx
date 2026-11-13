import React from "react";
import { Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";

export type MotionDir = "left" | "right" | "up";

export type MotionImageProps = {
  img: string; // nombre sin extension, dentro de illustrations/
  frames: number; // duracion del plano en fotogramas
  dir?: MotionDir; // direccion del paneo
  width?: number;
  height?: number;
  z0?: number; // zoom inicial
  z1?: number; // zoom final
  pan?: number; // desplazamiento total en px
  depth?: boolean; // capa de fondo desenfocada, mas zoom y mas lenta (falsa profundidad); solo se ve si la capa nitida no cubre el 100% (objectFit "contain" o similar) -- con "cover" a pantalla completa queda tapada, no usar depth en ese caso
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.quad);

const vec = (dir: MotionDir, u: number, amt: number): [number, number] =>
  dir === "left" ? [-amt * u, 0] : dir === "right" ? [amt * u, 0] : [0, -amt * u];

/** Zoom lento (z0->z1) + paneo segun `dir`, con easing inOut (sin saltos). depth=true anade una copia desenfocada detras, con mas zoom y a mitad de velocidad. */
export const MotionImage: React.FC<MotionImageProps> = ({ img, frames, dir = "left", width = 1080, height = 1920, z0 = 1, z1 = 1.08, pan = 46, depth = false }) => {
  const f = useCurrentFrame();
  const u = ease(interpolate(f, [0, Math.max(frames, 1)], [0, 1], clamp));
  const src = staticFile(`illustrations/${img}.png`);
  const layer = (uu: number, extraZoom: number, panAmt: number): React.CSSProperties => {
    const [dx, dy] = vec(dir, uu, panAmt);
    return { position: "absolute", left: 0, top: 0, width, height, objectFit: "cover", transform: `translate(${dx}px, ${dy}px) scale(${z0 + (z1 - z0 + extraZoom) * uu})` };
  };
  return (
    <>
      {depth && <Img src={src} style={{ ...layer(u * 0.5, 0.06, pan * 0.4), filter: "blur(20px) brightness(0.82)" }} />}
      <Img src={src} style={layer(u, 0, pan)} />
    </>
  );
};
