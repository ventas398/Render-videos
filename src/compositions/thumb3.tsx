// Sistema de portada v3 (miniatura moderna): foto a sangre + degradado azul profundo + "WHY?" Impact + banda amarilla + circulo de enganche.
// Parametrizable: npx remotion still src/index.ts ThumbV3 out/x.png --props='{"photo":"em023-lane-switch","sub":"A COUNTRY SWITCHED SIDES",...}'
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

export type T3 = {
  photo: string; // nombre en public/illustrations sin .png
  sub: string; // subtitulo corto (4-5 palabras)
  tag?: string; // etiqueta pequena ("3 SEP 1967")
  why?: string; // por defecto "WHY?"
  fx?: number; // foco de la foto (0-1)
  fy?: number;
  zoom?: number; // 1 = foto cubre justo el ancho
  rot?: number; // inclinacion de la foto (grados)
  hook?: [number, number, number, number]; // circulo: centro x,y y radios rx,ry en px de 1280x720
  layout?: "A" | "B";
  bright?: number; // brillo de la foto (1.02 por defecto)
  qdy?: number; // baja el signo ? (px)
  asp?: number; // proporcion de la imagen si no es cuadrada (1672/941 para las 16:9 de ChatGPT)
  subSize?: number; // tamano del subtitulo (82 por defecto, layout A)
  lab?: string; // rotulo de imagen (esquina inferior derecha)
  src?: string; // ruta en public/ (foto real 16:9); se recorta al cuadrado central
};

const NAVY = "#0A1A4A";
const YEL = "#FFC400";
const RED = "#E8261C";
const IMPACT = 'Impact, "Arial Black", "Segoe UI", sans-serif';
const outline = (w: number): React.CSSProperties => ({ WebkitTextStroke: `${w}px ${NAVY}`, paintOrder: "stroke fill", textShadow: `0 8px 0 ${NAVY}, 0 14px 28px rgba(0,0,0,.55)` });

export const Thumb3: React.FC<T3> = ({ photo, sub, tag, why = "WHY?", fx = 0.5, fy = 0.5, zoom = 1.25, rot = -2, hook, layout = "A", src, bright = 1.02, qdy = 0, asp = 1, lab, subSize = 82 }) => {
  const size = 1280 * zoom * 1.06;
  const w = asp === 1 ? size : 720 * zoom * 1.06 * asp;
  const h = asp === 1 ? size : 720 * zoom * 1.06;
  const left = Math.min(0, Math.max(1280 - w, 640 - fx * w));
  const top = Math.min(0, Math.max(720 - h, 360 - fy * h));
  const A = layout === "A";
  const words = why.slice(0, -1);
  return (
    <AbsoluteFill style={{ background: NAVY, overflow: "hidden", fontFamily: IMPACT }}>
      <Img src={src ? staticFile(src) : staticFile(`illustrations/${photo}.png`)} style={{ objectFit: "cover", position: "absolute", left, top, width: w, height: h, transform: `rotate(${rot}deg)`, filter: `contrast(1.18) saturate(1.35) brightness(${bright})` }} />
      <AbsoluteFill style={{ background: A ? `linear-gradient(100deg, ${NAVY}F2 0%, ${NAVY}D0 30%, ${NAVY}00 62%)` : `linear-gradient(180deg, ${NAVY}F0 0%, ${NAVY}8A 26%, ${NAVY}00 46%, ${NAVY}00 62%, ${NAVY}E6 100%)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 88% 6%, rgba(255,196,0,.55) 0%, rgba(255,160,0,.18) 28%, rgba(255,160,0,0) 55%)", mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 160px 30px rgba(5,10,40,.55)" }} />
      {hook && (
        <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0 }}>
          <ellipse cx={hook[0]} cy={hook[1]} rx={hook[2]} ry={hook[3]} fill="none" stroke={NAVY} strokeWidth={22} transform={`rotate(-8 ${hook[0]} ${hook[1]})`} />
          <ellipse cx={hook[0]} cy={hook[1]} rx={hook[2]} ry={hook[3]} fill="none" stroke={RED} strokeWidth={13} strokeLinecap="round" strokeDasharray="2200" transform={`rotate(-8 ${hook[0]} ${hook[1]})`} />
        </svg>
      )}
      {A ? (
        <>
          <div style={{ position: "absolute", left: 44, top: 10, fontSize: 330, lineHeight: 1.05, color: "#fff", letterSpacing: 2, transform: "rotate(-3deg)", transformOrigin: "left center", whiteSpace: "nowrap", ...outline(14) }}>
            {words}<span style={{ color: YEL, fontSize: 380, ...outline(8) }}>?</span>
          </div>
          <div style={{ position: "absolute", left: -30, top: 400, width: 760, transform: "rotate(-4deg)", background: YEL, padding: "14px 30px 14px 74px", boxShadow: `0 10px 0 ${NAVY}, 0 18px 30px rgba(0,0,0,.5)`, fontSize: subSize, lineHeight: 1.02, color: NAVY, letterSpacing: 1 }}>
            {sub}
          </div>
          {tag && (
            <div style={{ position: "absolute", left: 44, top: 640, background: RED, color: "#fff", fontSize: 44, padding: "2px 22px", transform: "rotate(-3deg)", boxShadow: `0 6px 0 ${NAVY}`, letterSpacing: 2 }}>{tag}</div>
          )}
        </>
      ) : (
        <>
          <div style={{ position: "absolute", left: 0, width: 1280, top: -40, textAlign: "center", fontSize: 400, lineHeight: 1.05, color: "#fff", letterSpacing: 4, transform: "rotate(-3deg)", whiteSpace: "nowrap", ...outline(16) }}>
            {words}<span style={{ color: YEL, fontSize: 450, position: "relative", top: qdy, ...outline(16) }}>?</span>
          </div>
          <div style={{ position: "absolute", left: -40, width: 1360, top: 560, transform: "rotate(-2deg)", background: YEL, padding: "10px 0", textAlign: "center", boxShadow: `0 8px 0 ${NAVY}, 0 16px 30px rgba(0,0,0,.5)`, fontSize: 88, lineHeight: 1.05, color: NAVY, letterSpacing: 2, whiteSpace: "nowrap" }}>
            {sub}
          </div>
          {tag && (
            <div style={{ position: "absolute", right: 36, top: 470, background: RED, color: "#fff", fontSize: 46, padding: "2px 22px", transform: "rotate(4deg)", boxShadow: `0 6px 0 ${NAVY}`, letterSpacing: 2 }}>{tag}</div>
          )}
        </>
      )}
      {lab && <div style={{ position: "absolute", right: 22, bottom: 16, background: "rgba(255,255,255,.88)", color: NAVY, fontFamily: "Segoe UI, sans-serif", fontSize: 24, padding: "2px 14px", borderRadius: 14 }}>{lab}</div>}
    </AbsoluteFill>
  );
};

export const T3_EM023: T3 = { photo: "em023-lane-switch", sub: "A COUNTRY SWITCHED SIDES", tag: "3 SEP 1967", fx: 0.6, fy: 0.5, zoom: 1.12, rot: -2, hook: [935, 470, 125, 95] };
export const ThumbV3: React.FC<T3> = (p) => <Thumb3 {...p} />;
export const ThumbV3EM023: React.FC = () => <Thumb3 {...T3_EM023} layout="A" />;
export const ThumbV3EM023C: React.FC = () => <Thumb3 {...T3_EM023} layout="A" sub="THE MORNING AN ENTIRE COUNTRY CHANGED SIDES OF THE ROAD" subSize={50} lab="AI illustration, not a portrait" hook={[935, 470, 125, 95]} />;
export const ThumbV3EM023B: React.FC = () => <Thumb3 {...T3_EM023} layout="B" fx={0.5} fy={0.5} zoom={1.2} hook={[720, 525, 120, 62]} />;
export const ThumbV3EM022: React.FC = () => <Thumb3 photo="em022-diagonal" sub="PAPER'S EXACT SHAPE" tag="1 : 1.414" fx={0.5} fy={0.55} zoom={1.15} rot={-2} hook={[760, 400, 150, 100]} />;
export const ThumbV3EM029: React.FC = () => <Thumb3 photo="" src="images/em029-01-thumb.jpg" sub="WHEN DID POMPEII END?" tag="AUG 24 OR OCT?" fx={0.62} fy={0.5} zoom={1.1} rot={-2} hook={[1000, 305, 200, 85]} />;
export const ThumbV3EM026: React.FC = () => <Thumb3 photo="em026-hand-on-heart" sub="THE VEIN OF LOVE?" tag="TRUE OR MYTH" fx={0.3} fy={0.44} zoom={1.25} rot={-2} hook={[1100, 345, 170, 120]} />;
export const ThumbV3EM010: React.FC = () => <Thumb3 photo="em010-pocket" sub="A POCKET INSIDE THE POCKET" tag="JEANS" fx={0.5} fy={0.4} zoom={0.94} rot={-2} hook={[790, 330, 230, 95]} />;
export const ThumbV3EM003 = () => <Thumb3 photo="cov003-barcode" sub="STRIPES ON EVERYTHING" fx={0.5} fy={0.5} zoom={1.1} rot={-2} hook={[1030, 410, 190, 120]} />;
export const ThumbV3EM032: React.FC = () => <Thumb3 photo="em032-arena-tunnel" sub="A ROOM FOR VOMITING" tag="VOMITORIUM" why="MYTH?" fx={0.5} fy={0.5} zoom={1.1} rot={-2} hook={[900, 380, 170, 110]} />;
export const ThumbV3EM004: React.FC = () => <Thumb3 photo="em004-bucket" sub="MOVIE POPCORN PRICES" tag="$$$" fx={0.6} fy={0.55} zoom={1.08} rot={-2} hook={[880, 470, 190, 130]} />;
export const ThumbV3EM031: React.FC = () => <Thumb3 photo="em031-elephant-snow" asp={1672 / 941} why="REALLY?" sub="DID PARIS EAT ITS ZOO?" tag="1870" fx={0.5} fy={0.5} zoom={1.0} rot={-1} lab="Illustrative image" />;
export const ThumbV3EM005: React.FC = () => <Thumb3 photo="em005-cleveland-1914-signal-v3" asp={1376 / 768} sub="RED MEANS STOP" tag="1914" fx={0.4726} fy={0.3977} zoom={1.6} rot={-1} lab="Illustrative image" hook={[1000, 330, 95, 135]} />;
export const ThumbV3EM035: React.FC = () => <Thumb3 photo="em035-46-wall-roll-detail-v1" asp={1376 / 768} layout="A" sub="OVER OR UNDER?" tag="1891 PATENT" fx={0.3} fy={0.55} zoom={1.3} rot={-1} lab="Illustrative image" hook={[1000, 345, 200, 160]} />;
export const ThumbV3EM041: React.FC = () => <Thumb3 photo="em041-pingpong-photo-h" asp={1672 / 941} sub="THE ONE BALL WITH NO AIR TEST" tag="TABLE TENNIS" fx={0.3} fy={0.48} zoom={1.3} rot={-2} hook={[970, 290, 200, 160]} />;
