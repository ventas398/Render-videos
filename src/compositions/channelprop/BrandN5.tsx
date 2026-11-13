import React from "react";
import { AbsoluteFill } from "remotion";
import { LEMA } from "./N";

// Banner (2560x1440, zona segura 1546x423 centrada) y avatar (800x800) del look N5: cuatro bandas macizas.
const COLS = ["#E4501C", "#F7B500", "#12A15C", "#1E5FD8"];
const NAVY = "#14213D";
const BLACK = '"Segoe UI Black", "Segoe UI", sans-serif';
const W = 2560, H = 1440, SLANT = H * Math.tan((18 * Math.PI) / 180);

const Stripes: React.FC<{ mirror?: boolean }> = ({ mirror }) => (
  <>
    {COLS.map((c, i) => {
      const x = 60 + i * 120;
      const pts = [[x, 0], [x + 120, 0], [x + 120 - SLANT, H], [x - SLANT, H]].map(([px, py]) => `${mirror ? W - px : px},${py}`).join(" ");
      return <polygon key={i} points={pts} fill={COLS[mirror ? 3 - i : i]} />;
    })}
  </>
);

export const BannerN5: React.FC = () => (
  <AbsoluteFill style={{ background: NAVY, fontFamily: '"Segoe UI", Arial, sans-serif' }}>
    <svg width={W} height={H} style={{ position: "absolute" }}><Stripes /><Stripes mirror /></svg>
    {/* zona segura: x 507-2053, y 508-931 */}
    <div style={{ position: "absolute", left: 507, top: 508, width: 1546, height: 423, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: BLACK, fontSize: 110, lineHeight: 1, color: "#fff", whiteSpace: "nowrap" }}>THE EVERYDAY <span style={{ color: COLS[1] }}>MYSTERY</span></div>
      <div style={{ fontSize: 60, fontWeight: 600, color: "#fff", marginTop: 34 }}>{LEMA}</div>
      <div style={{ display: "flex", marginTop: 44, width: 1100, height: 26, borderRadius: 13, overflow: "hidden" }}>
        {COLS.map((c) => <div key={c} style={{ flex: 1, background: c }} />)}
      </div>
    </div>
  </AbsoluteFill>
);

export const AvatarN5: React.FC = () => (
  <AbsoluteFill style={{ background: NAVY }}>
    <svg width={800} height={800} style={{ position: "absolute" }}>
      {COLS.map((c, i) => {
        const s = 800 * Math.tan((18 * Math.PI) / 180), x = i * 265;
        return <polygon key={i} points={`${x},0 ${x + 265},0 ${x + 265 - s},800 ${x - s},800`} fill={c} />;
      })}
    </svg>
    <div style={{ position: "absolute", left: 130, top: 130, width: 540, height: 540, borderRadius: 540, background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BLACK, fontSize: 300, color: "#fff", letterSpacing: -6 }}>
      E<span style={{ color: COLS[1] }}>M</span>
    </div>
  </AbsoluteFill>
);
