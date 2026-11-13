import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { theme as T } from "../themes/brand";

const SERIF = 'Georgia, Cambria, "Times New Roman", serif';
const IMPACT = 'Impact, "Arial Black", "Segoe UI", sans-serif';
const NAVY = "#0A1A4A", YEL = "#FFC400", RED = "#E8261C";
const card: React.CSSProperties = { position: "absolute", background: T.panel, border: `2px solid ${T.panelLine}`, borderRadius: 18, boxShadow: "0 6px 0 rgba(20,33,61,.06)", overflow: "hidden" };
const tag: React.CSSProperties = { position: "absolute", left: 24, top: 16, fontSize: 22, fontWeight: 800, letterSpacing: 4, color: T.orange };
const img = (f: string) => staticFile(`brandboard/${f}`);

const LISTS = [
  ["5", "Documented, Disputed or Myth?", "first row", T.orange],
  ["1", "Why Is It Like This?", "Vol. I", T.teal],
  ["2", "How Does It Work?", "Vol. II", T.teal],
  ["3", "Where Does It Come From?", "Vol. III", T.teal],
  ["4", "Who Decided This?", "Vol. IV", T.teal],
  ["6", "Shorts", "last row", T.ink],
] as const;

const SWATCHES = [
  ["Paper", T.bg, "#F7F3EA", T.ink], ["Ink", T.ink, "#14213D", "#fff"], ["Teal", T.teal, "#0A8F8D", "#fff"], ["Orange", T.orange, "#E56B0F", "#fff"],
  ["Navy", NAVY, "#0A1A4A", "#fff"], ["Yellow", YEL, "#FFC400", NAVY], ["Red", RED, "#E8261C", "#fff"],
] as const;

const STAMPS = [
  ["DOCUMENTED", "The records exist.", T.teal],
  ["DISPUTED", "Experts still argue.", T.orange],
  ["MYTH", "The dates or the evidence say no.", RED],
] as const;

export const BrandBoard: React.FC = () => (
  <AbsoluteFill style={{ background: T.bg, fontFamily: T.font, color: T.ink }}>
    {/* 1. Cabecera del canal */}
    <div style={{ ...card, left: 28, top: 28, width: 1000, height: 330 }}>
      <div style={{ height: 168, overflow: "hidden", position: "relative" }}>
        <Img src={img("banner-2560x1440-v3.png")} style={{ position: "absolute", left: 0, top: -(1440 - 423) / 2 * (1000 / 2560), width: 1000, height: 1440 * (1000 / 2560) }} />
      </div>
      <div style={{ ...tag, left: "auto", right: 24, top: 270, fontSize: 22 }}>1 / HEADER</div>
      <Img src={img("avatar-800-v3.png")} style={{ position: "absolute", left: 28, top: 124, width: 150, height: 150, borderRadius: 75, border: `6px solid ${T.panel}`, boxShadow: "0 4px 10px rgba(0,0,0,.2)" }} />
      <div style={{ position: "absolute", left: 200, top: 184 }}>
        <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: 1 }}>THE EVERYDAY MYSTERY</div>
        <div style={{ fontSize: 26, color: "#555", marginTop: 2 }}>@TheEverydayMystery</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 30, color: T.teal, marginTop: 8 }}>Look again at what you stopped seeing.</div>
      </div>
      <div style={{ position: "absolute", right: 24, top: 192, background: T.ink, color: "#fff", fontWeight: 700, fontSize: 24, padding: "10px 24px", borderRadius: 30 }}>Subscribe</div>
    </div>

    {/* 2. Estructura de Home */}
    <div style={{ ...card, left: 28, top: 380, width: 1000, height: 672 }}>
      <div style={tag}>2 / HOME PAGE STRUCTURE</div>
      <div style={{ position: "absolute", left: 24, top: 56, width: 440, height: 168, background: "#EDE7D8", borderRadius: 12, border: `2px dashed ${T.panelLine}` }}>
        <div style={{ position: "absolute", left: 18, top: 14, fontSize: 24, fontWeight: 800 }}>TRAILER</div>
        <div style={{ position: "absolute", left: 18, top: 50, fontSize: 24, color: "#555", width: 400, lineHeight: 1.25 }}>For visitors who are not subscribed. 38 s, shows 3 real videos.</div>
        <div style={{ position: "absolute", right: 18, bottom: 14, width: 0, height: 0, borderLeft: `30px solid ${T.orange}`, borderTop: "20px solid transparent", borderBottom: "20px solid transparent" }} />
      </div>
      <div style={{ position: "absolute", left: 484, top: 56, width: 492, height: 168, background: "#EDE7D8", borderRadius: 12, border: `2px dashed ${T.panelLine}` }}>
        <Img src={img("c025.png")} style={{ position: "absolute", left: 14, top: 14, width: 214, height: 120, borderRadius: 8 }} />
        <div style={{ position: "absolute", left: 244, top: 14, fontSize: 24, fontWeight: 800 }}>FEATURED VIDEO</div>
        <div style={{ position: "absolute", left: 244, top: 50, fontSize: 24, color: "#555", width: 232, lineHeight: 1.25 }}>Newest video, for returning subscribers.</div>
      </div>
      {LISTS.map(([n, name, sub, col], i) => (
        <div key={n} style={{ position: "absolute", left: 24, top: 246 + i * 70, width: 952, height: 60, background: "#F4EFE2", borderRadius: 12, borderLeft: `10px solid ${col}`, display: "flex", alignItems: "center" }}>
          <div style={{ fontSize: 30, fontWeight: 800, marginLeft: 20, width: 590 }}>{name}</div>
          <div style={{ fontSize: 26, color: "#555", width: 130 }}>{sub}</div>
          {[0, 1, 2].map((k) => <div key={k} style={{ width: 62, height: 36, borderRadius: 5, background: "#DDD5C0", marginRight: 10 }} />)}
        </div>
      ))}
    </div>

    {/* 3. Miniaturas */}
    <div style={{ ...card, left: 1056, top: 28, width: 836, height: 290 }}>
      <div style={tag}>3 / THUMBNAILS (REAL)</div>
      {[["c025.png", "EM-025", "Pinned for new visitors"], ["c010.png", "EM-010", "Why Is It Like This?"], ["c053.png", "EM-053B", "Music video"]].map(([f, id, cap], i) => (
        <div key={id} style={{ position: "absolute", left: 22 + i * 270, top: 56, width: 256 }}>
          <Img src={img(f)} style={{ width: 256, height: 144, borderRadius: 8, boxShadow: "0 3px 10px rgba(0,0,0,.25)" }} />
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 8 }}>{id}</div>
          <div style={{ fontSize: 23, color: "#555" }}>{cap}</div>
        </div>
      ))}
    </div>

    {/* 4. Sellos */}
    <div style={{ ...card, left: 1056, top: 338, width: 836, height: 258 }}>
      <div style={tag}>4 / STAMPS ON EVERY CLAIM</div>
      {STAMPS.map(([w, d, c], i) => (
        <div key={w} style={{ position: "absolute", left: 24 + i * 270, top: 70, width: 246 }}>
          <div style={{ border: `5px solid ${c}`, color: c, borderRadius: 10, fontFamily: IMPACT, fontSize: w === "DOCUMENTED" ? 38 : 46, letterSpacing: 2, textAlign: "center", padding: "6px 0", transform: `rotate(${i === 1 ? 1.5 : -2.5}deg)`, background: "#fff" }}>{w}</div>
          <div style={{ fontSize: 25, marginTop: 14, lineHeight: 1.25 }}>{d}</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 24, bottom: 16, fontSize: 25, color: "#444" }}>Our own conclusion is labelled <b style={{ fontFamily: SERIF, fontStyle: "italic", color: T.teal }}>our reading</b>.</div>
    </div>

    {/* 5. Paleta y tipografias */}
    <div style={{ ...card, left: 1056, top: 616, width: 836, height: 436 }}>
      <div style={tag}>5 / PALETTE AND TYPEFACES</div>
      {SWATCHES.map(([n, c, hex, tc], i) => (
        <div key={n} style={{ position: "absolute", left: 22 + i * 114, top: 56, width: 104, height: 104, borderRadius: 12, background: c, border: `2px solid ${T.panelLine}`, color: tc, padding: 8, boxSizing: "border-box" }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{n}</div>
          <div style={{ fontSize: 18, position: "absolute", bottom: 8 }}>{hex}</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 24, top: 176, width: 788, fontSize: 24, color: "#555" }}>First four: video and banner. Last three: thumbnails.</div>
      <div style={{ position: "absolute", left: 24, top: 218, display: "flex", gap: 14 }}>
        {[["Georgia", "Banner, titles", SERIF, "italic 700"], ["Segoe UI", "Video text, labels", T.font, "700"], ["Impact", "Thumbnails", IMPACT, "400"]].map(([n, use, ff, w]) => (
          <div key={n} style={{ width: 252, background: "#F4EFE2", borderRadius: 12, padding: "12px 16px", boxSizing: "border-box", height: 164 }}>
            <div style={{ fontFamily: ff, fontSize: 70, lineHeight: 1.05, fontStyle: w.startsWith("italic") ? "italic" : "normal", fontWeight: Number(w.replace("italic ", "")) }}>{n === "Impact" ? "WHY?" : "Aa"}</div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{n}</div>
            <div style={{ fontSize: 23, color: "#555" }}>{use}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 24, bottom: 12, fontSize: 23, color: "#555" }}>Labels: "Illustrative image" (AI), "Simplified illustration" (own)</div>
    </div>
  </AbsoluteFill>
);
