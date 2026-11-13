import React from "react";
import { Cat, Dots, Icon, LEMA, Pic, Th, X0, Y0, clamp, mk } from "./N";

const SERIF = '"Georgia Pro", Georgia, serif';
const SANS = '"Segoe UI", Arial, sans-serif';
const BLACK = '"Segoe UI Black", "Segoe UI", sans-serif';
const TYPE = '"Courier New", monospace';
const COMIC = '"Comic Sans MS", "Segoe Print", cursive';
const DIN = 'Bahnschrift, "Segoe UI", sans-serif';
const HAND = '"Ink Free", "Segoe Print", cursive';
const rotA = (n: number, m = 1.6) => [-1, 0.8, -0.5, 1][n % 4] * m;

const Wrap: React.FC<{ i: number; children: React.ReactNode; h: number; w?: number }> = ({ i, children, h, w = 1016 }) => (
  <div style={{ position: "absolute", left: X0, top: Y0 + i * (h + 8), width: w, height: h }}>{children}</div>
);

// ---------- N1: galeria de museo ----------
const P1 = ["#C8501E", "#D49A00", "#2F7D55", "#2A5FB8"] as const;
const c1 = mk([...P1], ["#fff", "#fff", "#fff", "#fff"]);
export const N1: Th = {
  cats: c1, pitch: 166, font: SANS, ink: "#1d1d1f", sub: "#6b665c",
  bg: { background: "linear-gradient(#F7F4EE, #ECE7DC)" },
  bgx: <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 700px 260px at 50% 0, rgba(255,255,255,.9), transparent)" }} />,
  banner: (
    <div style={{ width: 1800, height: 200, position: "relative", background: "linear-gradient(#FBFAF7,#EFEBE2)", borderRadius: 6, overflow: "hidden", boxShadow: "0 6px 14px rgba(0,0,0,.18)", textAlign: "center" }}>
      {[300, 900, 1500].map((x) => <div key={x} style={{ position: "absolute", left: x - 200, top: -10, width: 400, height: 230, background: "radial-gradient(ellipse at 50% 0, rgba(255,240,200,.75), transparent 70%)" }} />)}
      <div style={{ paddingTop: 22, fontFamily: SANS, fontWeight: 300, fontSize: 70, letterSpacing: 16, color: "#161616" }}>THE EVERYDAY MYSTERY</div>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 33, color: "#555", marginTop: 4 }}>{LEMA}</div>
      <Dots cats={c1} size={18} gap={44} style={{ justifyContent: "center", marginTop: 16 }} txt={{ color: "#333" }} />
    </div>
  ),
  avatar: <div style={{ width: 84, height: 84, borderRadius: 84, background: "#1d1d1f", border: "4px solid #E8D9B0", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: SERIF, fontSize: 36, letterSpacing: 1 }}>EM</div>,
  nameStyle: { fontFamily: SERIF, fontSize: 44, fontWeight: 700 }, subscribe: { background: "#1d1d1f", color: "#fff", borderRadius: 4, letterSpacing: 1 },
  tab: (a) => ({ fontWeight: a ? 800 : 500, letterSpacing: 3, textTransform: "uppercase", fontSize: 18, borderBottom: a ? "3px solid #1d1d1f" : "3px solid transparent", color: a ? "#111" : "#777" }),
  Row: ({ c, i, children }) => (
    <Wrap i={i} h={158}>
      <div style={{ position: "absolute", left: 0, top: 4, width: 168 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 40, background: c.col, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Icon k={i} c="#fff" s={26} /></div>
          <div style={{ fontSize: 12, letterSpacing: 3, color: "#888", fontWeight: 700 }}>PLAYLIST</div>
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 26, lineHeight: 1.05, marginTop: 8, fontWeight: 700 }}>{c.name}</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 14, lineHeight: 1.2, color: "#666", marginTop: 6 }}>{c.promise}</div>
      </div>
      <div style={{ position: "absolute", left: 180, top: 0, display: "flex", gap: 12 }}>{children}</div>
    </Wrap>
  ),
  Item: ({ f, t, c }) => (
    <div style={{ width: 200 }}>
      <div style={{ background: "#fff", border: "3px solid #1a1a1a", padding: 6, boxShadow: "0 10px 14px rgba(0,0,0,.28)" }}><Pic f={f} w={176} h={99} /></div>
      <div style={{ ...clamp, marginTop: 8, fontSize: 14, lineHeight: 1.2, fontWeight: 600, borderLeft: `4px solid ${c.col}`, paddingLeft: 7 }}>{t}</div>
    </div>
  ),
  frame: (inner) => <div style={{ background: "#fff", border: "3px solid #1a1a1a", padding: 6, boxShadow: "0 10px 14px rgba(0,0,0,.28)" }}>{inner}</div>,
  head: (t) => <div style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 700, borderBottom: "2px solid #1a1a1a", paddingBottom: 2, width: 140 }}>{t}</div>,
  card: { background: "#fff", border: "1px solid #bbb", boxShadow: "0 8px 16px rgba(0,0,0,.18)", borderTop: "8px solid #1a1a1a" },
  chip: (c) => ({ background: c.col, color: "#fff", borderRadius: 2 }), trailerLabel: { color: "#C8501E", letterSpacing: 3, fontSize: 18 }, grain: 0.1,
};

// ---------- N2: tablero de corcho con hilos ----------
const P2 = ["#D8362B", "#E5A100", "#2E9A5B", "#2E6FD0"] as const;
const c2 = mk([...P2], ["#fff", "#fff", "#fff", "#fff"]);
const Pin: React.FC<{ c: string }> = ({ c }) => (
  <div style={{ position: "absolute", left: "50%", top: -9, marginLeft: -11, width: 22, height: 22, borderRadius: 22, background: `radial-gradient(circle at 35% 30%, #fff8, ${c} 40%, #0006)`, boxShadow: "2px 5px 5px rgba(0,0,0,.45)", zIndex: 3 }} />
);
export const N2: Th = {
  cats: c2, pitch: 166, font: SANS, ink: "#2b1d12", sub: "#4d3722",
  bg: { background: "#C79C66", backgroundImage: "radial-gradient(rgba(80,45,15,.4) 1px, transparent 1.6px), radial-gradient(rgba(255,235,190,.4) 1px, transparent 1.6px), radial-gradient(rgba(80,45,15,.25) 2.2px, transparent 3px)", backgroundSize: "9px 9px, 13px 13px, 27px 27px", backgroundPosition: "0 0, 5px 6px, 9px 3px" },
  bgx: <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 160px rgba(60,30,5,.55)" }} />,
  banner: (
    <div style={{ width: 1800, height: 200, position: "relative", background: "rgba(120,78,35,.35)", borderRadius: 10, border: "10px solid #8A5A2B", boxSizing: "border-box", boxShadow: "inset 0 4px 12px rgba(0,0,0,.35)" }}>
      <svg width={1780} height={180} style={{ position: "absolute", left: 0, top: 0 }}><path d="M170 40 Q500 110 760 70 T 1000 60 M1000 60 Q1300 120 1620 40" stroke="#D8362B" strokeWidth={4} fill="none" /></svg>
      <div style={{ position: "absolute", left: 130, top: 22, width: 160, transform: "rotate(-5deg)", background: "#fff", padding: "8px 8px 28px", boxShadow: "3px 6px 8px rgba(0,0,0,.4)" }}><Pin c="#D8362B" /><Pic f="c010.jpg" w={144} h={81} /></div>
      <div style={{ position: "absolute", right: 130, top: 22, width: 160, transform: "rotate(4deg)", background: "#fff", padding: "8px 8px 28px", boxShadow: "3px 6px 8px rgba(0,0,0,.4)" }}><Pin c="#2E6FD0" /><Pic f="c021.jpg" w={144} h={81} /></div>
      <div style={{ position: "absolute", left: 420, top: 20, width: 940, transform: "rotate(-0.8deg)", background: "#FFFDF5", padding: "14px 0 12px", textAlign: "center", boxShadow: "4px 8px 10px rgba(0,0,0,.4)" }}>
        <Pin c="#D8362B" />
        <div style={{ fontFamily: TYPE, fontWeight: 700, fontSize: 56, letterSpacing: 2 }}>THE EVERYDAY MYSTERY</div>
        <div style={{ fontFamily: HAND, fontSize: 36, color: "#D8362B", marginTop: 2, fontWeight: 700 }}>{LEMA}</div>
      </div>
    </div>
  ),
  avatar: <div style={{ width: 84, height: 84, borderRadius: 84, background: "#FFFDF5", border: "5px solid #D8362B", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: TYPE, fontWeight: 700, fontSize: 38 }}>EM</div>,
  nameStyle: { fontFamily: TYPE, fontWeight: 700, fontSize: 42, background: "#FFFDF5", padding: "0 12px", display: "inline-block", boxShadow: "3px 4px 6px rgba(0,0,0,.3)", transform: "rotate(-0.6deg)" },
  subscribe: { background: "#D8362B", color: "#fff", borderRadius: 4, boxShadow: "3px 5px 6px rgba(0,0,0,.4)", fontFamily: TYPE },
  tab: (a) => ({ background: a ? "#FFFDF5" : "rgba(255,253,245,.55)", fontFamily: TYPE, fontWeight: 700, boxShadow: "2px 3px 4px rgba(0,0,0,.3)", transform: `rotate(${a ? -1 : 0.6}deg)` }),
  Row: ({ c, i, children }) => (
    <Wrap i={i} h={158}>
      <svg width={1016} height={158} style={{ position: "absolute", left: 0, top: 0, zIndex: 0 }}>
        <path d={`M84 2 ${[0, 1, 2, 3].map((j) => `Q${180 + j * 208 + 100} 36 ${180 + j * 208 + 102} 3`).join(" ")}`} stroke={c.col} strokeWidth={5} fill="none" opacity={0.95} />
      </svg>
      <div style={{ position: "absolute", left: 4, top: 0, width: 160, background: "#FFFDF5", transform: `rotate(${rotA(i + 1, 2)}deg)`, boxShadow: "3px 6px 8px rgba(0,0,0,.4)", zIndex: 1 }}>
        <Pin c={c.col} />
        <div style={{ height: 12, background: c.col }} />
        <div style={{ padding: "6px 8px 8px" }}>
          <div style={{ fontFamily: TYPE, fontWeight: 700, fontSize: 21, lineHeight: 1.05 }}>{c.name.toUpperCase()}</div>
          <div style={{ fontFamily: HAND, fontSize: 15, lineHeight: 1.15, marginTop: 6, color: "#4d3722", fontWeight: 700 }}>{c.promise}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 180, top: 4, display: "flex", gap: 8, zIndex: 1 }}>{children}</div>
    </Wrap>
  ),
  Item: ({ f, t, c, i, j }) => (
    <div style={{ position: "relative", width: 202, background: "#fff", padding: "7px 7px 0", height: 152, boxSizing: "border-box", boxShadow: "3px 6px 8px rgba(0,0,0,.4)", transform: `rotate(${rotA(i + j)}deg)` }}>
      <Pin c={c.col} />
      <Pic f={f} w={188} h={106} />
      <div style={{ ...clamp, fontFamily: HAND, fontWeight: 700, fontSize: 14.5, lineHeight: 1.15, marginTop: 4 }}>{t}</div>
    </div>
  ),
  frame: (inner, i, c) => <div style={{ position: "relative", background: "#fff", padding: 6, boxShadow: "3px 6px 8px rgba(0,0,0,.4)", transform: `rotate(${rotA(i)}deg)` }}><Pin c={c?.col ?? "#D8362B"} />{inner}</div>,
  head: (t) => <div style={{ display: "inline-block", background: "#FFFDF5", fontFamily: TYPE, fontWeight: 700, fontSize: 24, padding: "2px 14px", boxShadow: "3px 5px 6px rgba(0,0,0,.35)", transform: "rotate(-1deg)" }}>{t.toUpperCase()}</div>,
  card: { background: "#FFF3A8", boxShadow: "4px 8px 10px rgba(0,0,0,.4)", transform: "rotate(0.5deg)", fontFamily: HAND },
  desc: { background: "#FFFDF5", padding: "0 10px", boxShadow: "2px 3px 4px rgba(0,0,0,.3)", fontFamily: TYPE, fontSize: 17 } as React.CSSProperties,
  chip: (c) => ({ background: c.col, color: "#fff", fontFamily: TYPE }), trailerLabel: { color: "#fff", background: "#D8362B", display: "inline-block", padding: "0 10px", fontFamily: TYPE, fontSize: 18, transform: "rotate(-1deg)" }, grain: 0.14,
};

// ---------- N3: comic pop-art ----------
const P3 = ["#E8322B", "#FF9D00", "#1FAA59", "#1E6BFF"] as const;
const c3 = mk([...P3], ["#fff", "#111", "#fff", "#fff"]);
const OUT = "3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 0 3px 0 #000, 0 -3px 0 #000, 3px 0 0 #000, -3px 0 0 #000, 7px 8px 0 #000";
const Burst: React.FC<{ c: string; s: number; r?: number }> = ({ c, s, r = 0 }) => {
  const pts = Array.from({ length: 24 }, (_, k) => { const a = (k / 24) * Math.PI * 2, d = k % 2 ? 0.62 : 1; return `${50 + Math.cos(a) * 50 * d},${50 + Math.sin(a) * 50 * d}`; }).join(" ");
  return <svg width={s} height={s} viewBox="0 0 100 100" style={{ transform: `rotate(${r}deg)` }}><polygon points={pts} fill={c} stroke="#000" strokeWidth={3} strokeLinejoin="round" /></svg>;
};
export const N3: Th = {
  cats: c3, pitch: 166, font: COMIC, ink: "#111", sub: "#111",
  bg: { background: "#FFE24A", backgroundImage: "radial-gradient(#F2B500 24%, transparent 26%)", backgroundSize: "16px 16px" },
  banner: (
    <div style={{ width: 1800, height: 200, position: "relative", background: "#1E6BFF", backgroundImage: "radial-gradient(#0F4FD0 24%, transparent 26%)", backgroundSize: "16px 16px", border: "6px solid #000", boxSizing: "border-box", boxShadow: "8px 8px 0 #000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 40, top: 8 }}><Burst c="#FFE24A" s={190} r={-8} /></div>
      <div style={{ position: "absolute", left: 62, top: 66, width: 150, textAlign: "center", fontFamily: "Impact", fontSize: 48, transform: "rotate(-10deg)", color: "#E8322B" }}>WHY?!</div>
      <div style={{ position: "absolute", left: 270, top: 22, fontFamily: "Impact", fontSize: 92, letterSpacing: 3, color: "#fff", textShadow: OUT, whiteSpace: "nowrap" }}>THE EVERYDAY MYSTERY</div>
      <div style={{ position: "absolute", left: 1380, top: 112, width: 380, background: "#fff", border: "4px solid #000", borderRadius: 24, padding: "8px 16px", fontFamily: COMIC, fontWeight: 700, fontSize: 24, lineHeight: 1.15, textAlign: "center" }}>{LEMA}<div style={{ position: "absolute", left: 40, top: -20, width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "34px solid transparent", borderBottom: "22px solid #000" }} /></div>
      <div style={{ position: "absolute", left: 270, top: 140, display: "flex", gap: 16 }}>
        {c3.map((c, i) => <div key={i} style={{ background: c.col, color: c.ink, border: "3px solid #000", fontFamily: "Impact", fontSize: 24, padding: "0 14px", boxShadow: "3px 3px 0 #000", transform: `rotate(${[-2, 1, -1, 2][i]}deg)` }}>{["CASE FILES", "THINGS", "RULES", "SCIENCE"][i]}</div>)}
      </div>
    </div>
  ),
  avatar: <div style={{ width: 84, height: 84, borderRadius: 84, background: "#FFE24A", border: "5px solid #000", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Impact", fontSize: 40, color: "#E8322B", textShadow: "2px 2px 0 #000" }}>EM</div>,
  nameStyle: { fontFamily: "Impact", fontSize: 50, letterSpacing: 2, color: "#fff", textShadow: "3px 3px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000" }, subscribe: { background: "#E8322B", color: "#fff", border: "4px solid #000", boxShadow: "5px 5px 0 #000", fontFamily: "Impact", letterSpacing: 2, borderRadius: 6 },
  tab: (a) => ({ fontFamily: "Impact", fontWeight: 400, letterSpacing: 1, background: a ? "#000" : "#fff", color: a ? "#FFE24A" : "#000", border: "3px solid #000", boxShadow: "3px 3px 0 #000" }),
  Row: ({ c, i, children }) => (
    <Wrap i={i} h={158}>
      <div style={{ position: "absolute", left: 0, top: 2, width: 164, background: c.col, color: c.ink, border: "4px solid #000", boxShadow: "6px 6px 0 #000", transform: `rotate(${[-2, 1.5, -1.5, 2][i]}deg)`, padding: "8px 10px 10px" }}>
        <div style={{ fontFamily: "Impact", fontSize: 26, lineHeight: 1, letterSpacing: 1, marginTop: 2, textTransform: "uppercase" }}>{c.name}</div>
        <div style={{ fontFamily: COMIC, fontWeight: 700, fontSize: 13, lineHeight: 1.15, marginTop: 6 }}>{c.promise}</div>
      </div>
      <div style={{ position: "absolute", left: 186, top: 0, display: "flex", gap: 14 }}>{children}</div>
    </Wrap>
  ),
  Item: ({ f, t, i, j }) => (
    <div style={{ width: 196 }}>
      <div style={{ border: "5px solid #000", boxShadow: "6px 6px 0 #000", transform: `rotate(${rotA(i + j, 1.1)}deg)`, background: "#000" }}><Pic f={f} w={186} h={105} /></div>
      <div style={{ ...clamp, marginTop: 10, fontWeight: 700, fontSize: 13.5, lineHeight: 1.15 }}>{t}</div>
    </div>
  ),
  frame: (inner, i) => <div style={{ border: "5px solid #000", boxShadow: "6px 6px 0 #000", transform: `rotate(${rotA(i, 1.1)}deg)`, background: "#000" }}>{inner}</div>,
  head: (t) => <div style={{ display: "inline-block", fontFamily: "Impact", fontSize: 30, background: "#fff", border: "4px solid #000", padding: "0 16px", boxShadow: "4px 4px 0 #000", transform: "rotate(-1.5deg)" }}>{t.toUpperCase()}</div>,
  card: { background: "#fff", border: "5px solid #000", boxShadow: "8px 8px 0 #000", borderRadius: 26, fontFamily: COMIC },
  chip: (c) => ({ background: c.col, color: "#fff", border: "3px solid #000", fontFamily: "Impact", fontWeight: 400 }), trailerLabel: { fontFamily: "Impact", fontWeight: 400, fontSize: 24, background: "#E8322B", color: "#fff", display: "inline-block", padding: "0 12px", border: "3px solid #000" },
};

// ---------- N4: mapa de metro ----------
const P4 = ["#E5531B", "#F2B400", "#1FA463", "#2D6CDF"] as const;
const c4 = mk([...P4], ["#fff", "#111", "#fff", "#fff"]);
export const N4: Th = {
  cats: c4, pitch: 170, font: DIN, ink: "#14213D", sub: "#5b6578",
  bg: { background: "#F7F3EA", backgroundImage: "linear-gradient(rgba(20,33,61,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(20,33,61,.05) 1px, transparent 1px)", backgroundSize: "40px 40px" },
  banner: (
    <div style={{ width: 1800, height: 200, position: "relative", background: "#FFFDF8", borderRadius: 14, border: "3px solid #14213D", boxSizing: "border-box", overflow: "hidden" }}>
      <svg width={1800} height={200} style={{ position: "absolute", left: 0, top: 0 }}>
        {c4.map((c, i) => { const y = 36 + i * 42; return <path key={i} d={`M0 ${y + 70 - i * 0} H${120 + i * 40} L${200 + i * 40} ${y} H1600 L${1680 - i * 40} ${y + 70} H1800`} stroke={c.col} strokeWidth={14} fill="none" strokeLinejoin="round" opacity={0.95} />; })}
      </svg>
      <div style={{ position: "absolute", left: 360, top: 22, width: 1080, height: 150, background: "#fff", border: "6px solid #14213D", borderRadius: 22, textAlign: "center", boxShadow: "0 8px 0 rgba(20,33,61,.2)" }}>
        <div style={{ fontFamily: DIN, fontWeight: 700, fontSize: 72, letterSpacing: 2, marginTop: 8 }}>THE EVERYDAY MYSTERY</div>
        <div style={{ fontFamily: DIN, fontSize: 31, color: "#5b6578", marginTop: -2 }}>{LEMA}</div>
      </div>
    </div>
  ),
  avatar: <div style={{ width: 84, height: 84, borderRadius: 84, background: "#14213D", border: "5px solid #fff", boxShadow: "0 0 0 4px #E5531B", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: DIN, fontWeight: 700, fontSize: 36 }}>EM</div>,
  nameStyle: { fontFamily: DIN, fontWeight: 700, fontSize: 44 }, subscribe: { background: "#14213D", color: "#fff", borderRadius: 40, fontFamily: DIN },
  tab: (a) => ({ fontFamily: DIN, fontWeight: 700, borderBottom: a ? "4px solid #E5531B" : "4px solid transparent", color: a ? "#14213D" : "#7a8294" }),
  Row: ({ c, i, children }) => (
    <Wrap i={i} h={162}>
      <div style={{ position: "absolute", left: 170, top: 117, width: 830, height: 12, background: c.col, borderRadius: 6 }} />
      <div style={{ position: "absolute", left: 990, top: 109, width: 28, height: 28, borderRadius: 28, background: "#fff", border: `7px solid ${c.col}`, boxSizing: "border-box" }} />
      <div style={{ position: "absolute", left: 0, top: 85, height: 60, width: 190, background: c.col, color: c.ink, borderRadius: 30, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", boxSizing: "border-box", boxShadow: "0 4px 0 rgba(0,0,0,.2)" }}>
        <div style={{ width: 38, height: 38, borderRadius: 38, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Icon k={i} c={c.col} s={26} w={4} /></div>
        <div style={{ fontFamily: DIN, fontWeight: 700, fontSize: 17.5, lineHeight: 1 }}>{c.name}</div>
      </div>
      <div style={{ position: "absolute", left: 4, top: 26, width: 170, fontSize: 14, lineHeight: 1.15, color: "#5b6578" }}>{c.promise}</div>
      <div style={{ position: "absolute", left: 204, top: 0, display: "flex", gap: 26 }}>{children}</div>
    </Wrap>
  ),
  Item: ({ f, t, c }) => (
    <div style={{ width: 174, position: "relative", height: 162 }}>
      <div style={{ border: `3px solid ${c.col}`, background: "#fff", borderRadius: 6, overflow: "hidden", width: 174, boxSizing: "border-box", height: 101 }}><Pic f={f} w={168} h={95} /></div>
      <div style={{ position: "absolute", left: 75, top: 105, width: 24, height: 24, borderRadius: 24, background: "#fff", border: "6px solid #14213D", boxSizing: "border-box" }} />
      <div style={{ ...clamp, position: "absolute", top: 134, left: 0, width: 174, fontSize: 13.5, lineHeight: 1.1, fontWeight: 600 }}>{t}</div>
    </div>
  ),
  frame: (inner) => <div style={{ border: "3px solid #14213D", borderRadius: 6, overflow: "hidden", background: "#fff" }}>{inner}</div>,
  head: (t) => <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#14213D", color: "#fff", borderRadius: 30, padding: "2px 22px", fontFamily: DIN, fontWeight: 700, fontSize: 26 }}><span style={{ width: 14, height: 14, borderRadius: 14, background: "#fff", display: "inline-block" }} />{t}</div>,
  card: { background: "#fff", border: "3px solid #14213D", borderRadius: 16, borderLeft: "16px solid #E5531B" },
  chip: (c) => ({ background: c.col, color: "#fff", borderRadius: 20, fontFamily: DIN }), trailerLabel: { color: "#E5531B", letterSpacing: 2, fontFamily: DIN }, grain: 0.05,
};

// ---------- N5: cuatro bandas de color ----------
const P5 = ["#E4501C", "#F7B500", "#12A15C", "#1E5FD8"] as const;
const c5 = mk([...P5], ["#fff", "#14213D", "#fff", "#fff"]);
export const N5: Th = {
  cats: c5, pitch: 166, font: SANS, ink: "#14213D", sub: "#5a6376",
  bg: { background: "#FBF8F1" },
  banner: (
    <div style={{ width: 1800, height: 200, position: "relative", background: "#14213D", borderRadius: 16, overflow: "hidden" }}>
      {c5.map((c, i) => <div key={i} style={{ position: "absolute", left: i * 62, top: 0, width: 70, height: 200, background: c.col, transform: "skewX(-18deg)", transformOrigin: "0 100%" }} />)}
      {c5.map((c, i) => <div key={i} style={{ position: "absolute", right: i * 62 - 10, top: 0, width: 70, height: 200, background: c5[3 - i].col, transform: "skewX(-18deg)", transformOrigin: "0 100%" }} />)}
      <div style={{ position: "absolute", left: 0, width: 1800, top: 12, textAlign: "center", fontFamily: BLACK, fontSize: 80, color: "#fff", letterSpacing: 1 }}>THE EVERYDAY <span style={{ color: "#F7B500" }}>MYSTERY</span></div>
      <div style={{ position: "absolute", left: 0, width: 1800, top: 104, textAlign: "center", fontSize: 38, color: "#fff", fontWeight: 600 }}>{LEMA}</div>
      <Dots cats={c5} size={15} gap={34} style={{ position: "absolute", left: 0, width: 1800, top: 160, justifyContent: "center" }} txt={{ color: "#fff", fontSize: 15 }} />
    </div>
  ),
  avatar: <div style={{ width: 84, height: 84, borderRadius: 84, overflow: "hidden", position: "relative", background: "#14213D" }}>{c5.map((c, i) => <div key={i} style={{ position: "absolute", left: (i % 2) * 42, top: i < 2 ? 0 : 42, width: 42, height: 42, background: c.col }} />)}<div style={{ position: "absolute", inset: 14, borderRadius: 60, background: "#14213D", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BLACK, fontSize: 28 }}>EM</div></div>,
  nameStyle: { fontFamily: BLACK, fontSize: 42 }, subscribe: { background: "#E4501C", color: "#fff", borderRadius: 10 },
  tab: (a) => ({ fontWeight: 800, color: a ? "#fff" : "#14213D", background: a ? "#14213D" : "transparent", borderRadius: 8 }),
  Row: ({ c, i, children }) => (
    <Wrap i={i} h={158}>
      <div style={{ position: "absolute", inset: 0, background: c.col, borderRadius: 18 }} />
      <div style={{ position: "absolute", left: -6, top: 4, opacity: 0.16 }}><Icon k={i} c={c.ink} s={150} w={3} /></div>
      <div style={{ position: "absolute", left: 14, top: 12, width: 164, color: c.ink }}>
        <div style={{ fontFamily: BLACK, fontSize: 23, lineHeight: 1.02, textTransform: "uppercase" }}>{c.name}</div>
        <div style={{ fontSize: 14, lineHeight: 1.2, marginTop: 8, fontWeight: 600 }}>{c.promise}</div>
      </div>
      <div style={{ position: "absolute", left: 184, top: 6, display: "flex", gap: 8 }}>{children}</div>
    </Wrap>
  ),
  Item: ({ f, t, c }) => (
    <div style={{ width: 198 }}>
      <div style={{ border: "4px solid #fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 6px 10px rgba(0,0,0,.25)", width: 198, boxSizing: "border-box" }}><Pic f={f} w={190} h={107} /></div>
      <div style={{ ...clamp, marginTop: 3, fontSize: 14, lineHeight: 1.15, fontWeight: 700, color: c.ink }}>{t}</div>
    </div>
  ),
  frame: (inner) => <div style={{ border: "4px solid #fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 0 0 2px #14213D, 0 6px 10px rgba(0,0,0,.25)" }}>{inner}</div>,
  head: (t) => <div style={{ display: "inline-block", fontFamily: BLACK, fontSize: 26, textTransform: "uppercase", background: "#14213D", color: "#fff", padding: "2px 18px", borderRadius: 8 }}>{t}</div>,
  card: { background: "#fff", border: "3px solid #14213D", borderRadius: 18 }, chip: (c) => ({ background: c.col, color: c.ink, borderRadius: 6 }), trailerLabel: { color: "#E4501C", letterSpacing: 3 },
};

export type { Cat };
