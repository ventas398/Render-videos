import React from "react";

// Grano de papel / pelicula: ruido fractal superpuesto.
export const Grain: React.FC<{ w: number; h: number; opacity?: number; blend?: React.CSSProperties["mixBlendMode"]; tint?: string; freq?: number }> = ({ w, h, opacity = 0.18, blend = "multiply", tint = "0.35 0.25 0.15", freq = 0.8 }) => {
  const [r, g, b] = tint.split(" ");
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, mixBlendMode: blend, opacity, pointerEvents: "none" }}>
      <filter id="grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={3} seed={7} stitchTiles="stitch" />
        <feColorMatrix values={`0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  0 0 0 1.4 -0.35`} />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
};

// Recorte de la banda visible de un banner 2560x1440 (centro) para el mockup.
export const BannerCrop: React.FC<{ width: number; height: number; children: React.ReactNode }> = ({ width, height, children }) => {
  const s = width / 2560;
  const srcH = height / s;
  const top = 720 - srcH / 2;
  return (
    <div style={{ width, height, overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: -top * s, width: 2560, height: 1440, transform: `scale(${s})`, transformOrigin: "0 0" }}>{children}</div>
    </div>
  );
};

export const COVERS = {
  dollar: { f: "c025.jpg", t: "Secret Symbols on Your Dollar: Which Hold Up?" },
  pompeii: { f: "c029.jpg", t: "Why Can't Anyone Agree on the Day Pompeii Disappeared?" },
  ring: { f: "c026.jpg", t: "Why Is the Wedding Ring on That Finger?" },
  pocket: { f: "c010.jpg", t: "Why Do Jeans Have a Tiny Pocket Inside the Pocket?" },
  thunder: { f: "c021.jpg", t: "Why Do We Hear Thunder After Lightning?" },
  paper: { f: "c035.jpg", t: "Toilet Paper: Over or Under? The Answer Is Not in the Patent" },
  music: { f: "c053.jpg", t: "One Scene, Four Moods" },
} as const;
