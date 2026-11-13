// Portadas EM-035 v2: el papel higienico es el heroe (foto a sangre, sin ovalo). A = dos rollos (over/under); B = un rollo gigante a la derecha.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

const NAVY = "#0A1A4A";
const YEL = "#FFC400";
const IMPACT = 'Impact, "Arial Black", "Segoe UI", sans-serif';
const stroke = (w: number): React.CSSProperties => ({ WebkitTextStroke: `${w}px ${NAVY}`, paintOrder: "stroke fill", textShadow: `0 8px 0 ${NAVY}, 0 14px 24px rgba(0,0,0,.45)` });

const Photo: React.FC<{ photo: string }> = ({ photo }) => <Img src={staticFile(`illustrations/${photo}.png`)} style={{ position: "absolute", left: 0, top: 0, width: 1280, height: 720, objectFit: "cover" }} />;
const Lab: React.FC = () => <div style={{ position: "absolute", left: 20, bottom: 22, background: "rgba(255,255,255,.85)", color: NAVY, fontFamily: "Segoe UI, sans-serif", fontSize: 18, padding: "1px 12px", borderRadius: 12 }}>Illustrative image</div>;
const Band: React.FC<{ top: number; w: number; size: number; children: React.ReactNode }> = ({ top, w, size, children }) => (
  <div style={{ position: "absolute", left: -30, top, width: w, transform: "rotate(-4deg)", background: YEL, padding: "10px 24px 12px 60px", boxShadow: `0 8px 0 ${NAVY}, 0 16px 26px rgba(0,0,0,.45)`, fontSize: size, lineHeight: 1.02, color: NAVY, letterSpacing: 1 }}>{children}</div>
);
const Tag: React.FC<{ x: number; text: string; color: string }> = ({ x, text, color }) => (
  <div style={{ position: "absolute", left: x, top: 638, transform: "translateX(-50%)", background: color, color: "#fff", fontSize: 44, padding: "0 20px", borderRadius: 10, boxShadow: `0 5px 0 ${NAVY}`, letterSpacing: 2 }}>{text}</div>
);

export const ThumbEM035A: React.FC = () => (
  <AbsoluteFill style={{ background: NAVY, fontFamily: IMPACT, overflow: "hidden" }}>
    <Photo photo="em035-portada-A-over-under-v1" />
    <AbsoluteFill style={{ background: `linear-gradient(90deg, ${NAVY}CC 0%, ${NAVY}66 26%, ${NAVY}00 38%)` }} />
    <div style={{ position: "absolute", left: 24, fontSize: 182, top: 40, lineHeight: 1.05, color: "#fff", letterSpacing: 1, transform: "rotate(-3deg)", transformOrigin: "left center", whiteSpace: "nowrap", ...stroke(12) }}>WHY<span style={{ color: YEL }}>?</span></div>
    <Band top={290} w={440} size={92}>OVER OR<br />UNDER?</Band>
    <Tag x={615} text="OVER" color="#0A8F8D" />
    <Tag x={1070} text="UNDER" color="#E56B0F" />
    <Lab />
  </AbsoluteFill>
);

export const ThumbEM035B: React.FC = () => (
  <AbsoluteFill style={{ background: NAVY, fontFamily: IMPACT, overflow: "hidden" }}>
    <Photo photo="em035-portada-B-hero-v1" />
    <AbsoluteFill style={{ background: `linear-gradient(90deg, ${NAVY}CC 0%, ${NAVY}66 32%, ${NAVY}00 46%)` }} />
    <div style={{ position: "absolute", left: 28, top: 70, fontSize: 245, lineHeight: 1.05, color: "#fff", letterSpacing: 1, transform: "rotate(-3deg)", transformOrigin: "left center", whiteSpace: "nowrap", ...stroke(14) }}>WHY<span style={{ color: YEL }}>?</span></div>
    <Band top={380} w={560} size={110}>OVER OR<br />UNDER?</Band>
    <Lab />
  </AbsoluteFill>
);
