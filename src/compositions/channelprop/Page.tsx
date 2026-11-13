import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BannerCrop, COVERS, Grain } from "./shared";
import { A, BannerA, AvatarA, SERIF } from "./A";
import { B, BannerB, AvatarB, CONDENSED } from "./B";
import { C, BannerC, AvatarC, SLAB, HAND } from "./C";

type V = "A" | "B" | "C";
const SANS = '"Segoe UI", Arial, sans-serif';
const M = 130;
const TW = 296, TH = 167;

const TK = {
  A: { bg: A.paper, text: A.ink, sub: "#5B6272", line: A.line, accent: A.orange, btnBg: A.ink, btnFg: "#fff", head: SERIF, body: SANS, label: "A · DOSIER / ARCHIVO", motto: "Cada tema es un caso con sello." },
  B: { bg: B.night, text: B.white, sub: B.mute, line: "#1B2A5C", accent: B.yellow, btnBg: B.yellow, btnFg: B.navy, head: CONDENSED, body: SANS, label: "B · CINE / DOCUMENTAL", motto: "Mira otra vez, en pantalla grande." },
  C: { bg: C.paper, text: C.brown, sub: C.mute, line: "#D9BE8F", accent: C.terra, btnBg: C.terra, btnFg: C.cream, head: SLAB, body: '"Candara", "Segoe UI", sans-serif', label: "C · CUADERNO / SOBREMESA", motto: "Curiosidades para comentar en la mesa." },
} as const;

const SHELF1 = ["dollar", "pompeii", "ring"] as const;
const SHELF2 = ["pocket", "thunder", "paper"] as const;
const SHORTS = ["s01.jpg", "s03.jpg", "s04.jpg", "s02.jpg", "s035.jpg"];

const img = (f: string) => staticFile(`channelprop/${f}`);
const tapeCols = [C.must, C.sage, C.blush];

const Play: React.FC<{ s?: number }> = ({ s = 54 }) => (
  <div style={{ position: "absolute", left: "50%", top: "50%", width: s, height: s, marginLeft: -s / 2, marginTop: -s / 2, borderRadius: s, background: "rgba(0,0,0,.62)", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: 0, height: 0, borderLeft: `${s * 0.34}px solid #fff`, borderTop: `${s * 0.22}px solid transparent`, borderBottom: `${s * 0.22}px solid transparent`, marginLeft: s * 0.08 }} />
  </div>
);

const Thumb: React.FC<{ v: V; f: string; w: number; h: number; i: number; dur?: string; play?: boolean }> = ({ v, f, w, h, i, dur, play }) => {
  const base: React.CSSProperties = { position: "relative", width: w, height: h };
  const pic = <Img src={img(f)} style={{ width: w, height: h, display: "block", borderRadius: v === "B" ? 10 : 4 }} />;
  const chip = dur ? <div style={{ position: "absolute", right: 8, bottom: 8, background: "rgba(0,0,0,.82)", color: "#fff", fontSize: 18, fontWeight: 700, padding: "2px 7px", borderRadius: 5 }}>{dur}</div> : null;
  if (v === "A") return <div style={{ ...base, width: w + 14, height: h + 14, background: "#fff", border: `1.5px solid ${A.line}`, padding: 6, boxSizing: "border-box", borderRadius: 6, boxShadow: "0 5px 0 rgba(20,33,61,.07)" }}><div style={{ position: "relative", width: w, height: h }}>{pic}{chip}{play && <Play />}</div></div>;
  if (v === "B") return <div style={{ ...base, boxShadow: "0 14px 30px rgba(0,0,0,.7), 0 0 0 1.5px rgba(255,196,0,.14)", borderRadius: 10 }}>{pic}{chip}{play && <Play />}<div style={{ position: "absolute", left: 0, bottom: 0, height: 5, width: `${[0, 55, 0, 30, 0, 80][i % 6]}%`, background: B.red, borderRadius: "0 0 0 10px" }} /></div>;
  const rot = [-1.4, 0.9, -0.6, 1.1, -0.9, 0.7][i % 6];
  return (
    <div style={{ ...base, width: w + 18, height: h + 18, background: C.cream, padding: 9, boxSizing: "border-box", transform: `rotate(${rot}deg)`, boxShadow: `4px 5px 0 rgba(58,38,25,.22)`, borderRadius: 3 }}>
      <div style={{ position: "relative", width: w, height: h }}>{pic}{chip}{play && <Play />}</div>
      <div style={{ position: "absolute", left: "50%", top: -12, width: 86, height: 26, marginLeft: -43, background: tapeCols[i % 3], opacity: 0.8, transform: `rotate(${i % 2 ? 3 : -4}deg)`, boxShadow: "0 1px 2px rgba(0,0,0,.15)" }} />
    </div>
  );
};

const ShelfTitle: React.FC<{ v: V; text: string; n: string }> = ({ v, text, n }) => {
  const t = TK[v];
  if (v === "A") return <div style={{ display: "flex", alignItems: "center", gap: 14, height: 40 }}><span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 17, letterSpacing: 3, color: "#fff", background: A.orange, padding: "3px 9px", borderRadius: 3 }}>FILE {n}</span><span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 30, color: t.text }}>{text}</span><span style={{ flex: 1, height: 2, background: A.line }} /></div>;
  if (v === "B") return <div style={{ display: "flex", alignItems: "center", gap: 14, height: 40 }}><span style={{ width: 8, height: 30, background: B.red }} /><span style={{ fontFamily: CONDENSED, fontWeight: 700, fontSize: 31, letterSpacing: 3, textTransform: "uppercase", color: t.text }}>{text}</span></div>;
  return <div style={{ display: "flex", alignItems: "center", gap: 12, height: 40 }}><span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 36, color: t.text, borderBottom: `5px solid ${C.must}`, lineHeight: 1.0 }}>{text}</span></div>;
};

const Shelf: React.FC<{ v: V; name: string; n: string; items: readonly (keyof typeof COVERS)[]; top: number; off: number }> = ({ v, name, n, items, top, off }) => {
  const t = TK[v];
  return (
    <div style={{ position: "absolute", left: M, top, width: 3 * TW + 2 * 18 + 28 }}>
      <ShelfTitle v={v} text={name} n={n} />
      <div style={{ display: "flex", gap: v === "A" ? 4 : 14, marginTop: 10 }}>
        {items.map((k, i) => (
          <div key={k} style={{ width: TW + 18 }}>
            <Thumb v={v} f={COVERS[k].f} w={TW} h={TH} i={i + off} />
            <div style={{ marginTop: v === "C" ? 14 : 10, fontFamily: t.body, fontWeight: 700, fontSize: 20, lineHeight: 1.2, color: t.text, height: 48, overflow: "hidden", paddingRight: 8 }}>{COVERS[k].t}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Page: React.FC<{ v: V }> = ({ v }) => {
  const t = TK[v];
  const Banner = v === "A" ? BannerA : v === "B" ? BannerB : BannerC;
  const Avatar = v === "A" ? AvatarA : v === "B" ? AvatarB : AvatarC;
  const RX = M + 3 * (TW + 18) + 2 * 4 + 40;
  const tabs = ["Home", "Videos", "Shorts", "Playlists", "Community"];
  const tabCol = [C.terra, C.sage, C.must, C.denim, C.blush];
  return (
    <AbsoluteFill style={{ background: v === "B" ? `linear-gradient(180deg, #060A19, #0A1330)` : t.bg, fontFamily: t.body, color: t.text }}>
      {v === "C" && <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(122,90,68,.22) 1.6px, transparent 1.7px)", backgroundSize: "30px 30px" }} />}
      <div style={{ position: "absolute", left: M, top: 20, borderRadius: 18, overflow: "hidden", boxShadow: v === "B" ? "0 0 0 2px #1B2A5C" : "0 0 0 1.5px rgba(0,0,0,.12)" }}><BannerCrop width={1660} height={274}><Banner /></BannerCrop></div>
      <div style={{ position: "absolute", left: 1020, top: 318, background: "rgba(10,12,20,.88)", color: "#fff", padding: "8px 16px", borderRadius: 10, fontFamily: SANS, lineHeight: 1.25 }}>
        <div style={{ fontWeight: 800, fontSize: 21, letterSpacing: 2 }}>{t.label}</div>
        <div style={{ fontSize: 19, opacity: 0.85 }}>{t.motto}</div>
      </div>
      {/* cabecera */}
      <div style={{ position: "absolute", left: M, top: 306, width: 112, height: 112, borderRadius: 56, overflow: "hidden", boxShadow: v === "B" ? "0 0 0 3px #1B2A5C" : "0 4px 10px rgba(0,0,0,.22)" }}>
        <div style={{ width: 800, height: 800, transform: "scale(0.14)", transformOrigin: "0 0" }}><Avatar /></div>
      </div>
      <div style={{ position: "absolute", left: M + 136, top: 302 }}>
        <div style={{ fontFamily: v === "B" ? CONDENSED : v === "C" ? SLAB : SANS, fontWeight: 800, fontSize: 40, letterSpacing: v === "B" ? 2 : 0.5, textTransform: v === "B" ? "uppercase" : "none" }}>{v === "A" ? "THE EVERYDAY MYSTERY" : v === "B" ? "The Everyday Mystery" : "The Everyday Mystery"}</div>
        <div style={{ fontSize: 24, color: t.sub, marginTop: 4 }}>@TheEverydayMystery</div>
        <div style={{ fontSize: 24, color: t.sub, marginTop: 4, width: 1050, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Everyday things, checked: documented, disputed or myth.</div>
      </div>
      <div style={{ position: "absolute", right: M, top: 324, background: t.btnBg, color: t.btnFg, fontWeight: 800, fontSize: 26, padding: "13px 34px", borderRadius: v === "A" ? 30 : v === "B" ? 8 : 30, fontFamily: v === "B" ? CONDENSED : t.body, letterSpacing: v === "B" ? 2 : 0, textTransform: v === "B" ? "uppercase" : "none", boxShadow: v === "C" ? `4px 5px 0 ${C.brown}` : v === "B" ? "0 0 24px rgba(255,196,0,.35)" : "none" }}>Subscribe</div>
      {/* pestanas */}
      <div style={{ position: "absolute", left: M, top: 426, width: 1920 - 2 * M, height: 44, borderBottom: `2px solid ${t.line}`, display: "flex", gap: v === "C" ? 10 : 34, alignItems: "flex-end" }}>
        {tabs.map((n, i) => v === "C" ? (
          <div key={n} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 26, padding: "5px 20px 3px", background: i === 0 ? tabCol[i] : tabCol[i] + "99", color: i === 0 ? C.cream : C.brown, borderRadius: "12px 12px 0 0", border: `2px solid ${C.brown}`, borderBottom: "none", transform: `rotate(${i % 2 ? 0.6 : -0.6}deg)` }}>{n}</div>
        ) : (
          <div key={n} style={{ fontWeight: 700, fontSize: 24, color: i === 0 ? t.text : t.sub, padding: "6px 4px 8px", borderBottom: i === 0 ? `4px solid ${t.accent}` : "4px solid transparent", textTransform: v === "B" ? "uppercase" : "none", letterSpacing: v === "B" ? 1.5 : 0, fontFamily: v === "B" ? CONDENSED : SANS }}>{n}</div>
        ))}
      </div>
      {/* estantes */}
      <Shelf v={v} name="Documented, Disputed or Myth?" n="01" items={SHELF1} top={478} off={0} />
      <Shelf v={v} name="Why Is It Like This?" n="02" items={SHELF2} top={782} off={3} />
      {/* columna derecha */}
      {[["CHANNEL TRAILER", "dollar", "This is The Everyday Mystery.", "0:38", true], ["LATEST", "music", COVERS.music.t, "", false]].map(([lab, k, title, dur, play], i) => (
        <div key={lab as string} style={{ position: "absolute", left: RX, top: 480 + i * 154, width: 590, display: "flex", gap: 18 }}>
          <Thumb v={v} f={COVERS[k as keyof typeof COVERS].f} w={246} h={138} i={i + 1} dur={dur as string} play={play as boolean} />
          <div style={{ paddingTop: 6 }}>
            <div style={{ fontFamily: v === "C" ? HAND : t.head, fontWeight: 800, fontSize: v === "C" ? 24 : 18, letterSpacing: v === "C" ? 0 : 3, color: t.accent, textTransform: v === "B" ? "uppercase" : "none" }}>{lab as string}</div>
            <div style={{ fontWeight: 700, fontSize: 24, lineHeight: 1.22, marginTop: 4 }}>{title as string}</div>
            <div style={{ fontSize: 19, color: t.sub, marginTop: 6 }}>{i === 0 ? "For new visitors" : "New"}</div>
          </div>
        </div>
      ))}
      <div style={{ position: "absolute", left: RX, top: 792 }}>
        {v === "A" && <div style={{ display: "flex", alignItems: "center", gap: 14, height: 40, width: 590 }}><span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 17, letterSpacing: 3, color: "#fff", background: A.ink, padding: "3px 9px", borderRadius: 3 }}>QUICK</span><span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 30 }}>Shorts</span><span style={{ flex: 1, height: 2, background: A.line }} /></div>}
        {v === "B" && <div style={{ display: "flex", alignItems: "center", gap: 14, height: 40 }}><span style={{ width: 8, height: 30, background: B.red }} /><span style={{ fontFamily: CONDENSED, fontWeight: 700, fontSize: 31, letterSpacing: 3, textTransform: "uppercase" }}>Shorts</span></div>}
        {v === "C" && <div style={{ height: 40 }}><span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 36, borderBottom: `5px solid ${C.sage}` }}>Shorts</span></div>}
        <div style={{ display: "flex", gap: v === "C" ? 16 : 14, marginTop: 14 }}>
          {SHORTS.map((f, i) => {
            const w = 110, h = 196;
            const card = <Img src={img(f)} style={{ width: w, height: h, display: "block", borderRadius: v === "B" ? 12 : 6, objectFit: "cover" }} />;
            if (v === "A") return <div key={f} style={{ background: "#fff", border: `1.5px solid ${A.line}`, padding: 4, borderRadius: 6, boxShadow: "0 4px 0 rgba(20,33,61,.07)" }}>{card}</div>;
            if (v === "B") return <div key={f} style={{ boxShadow: "0 12px 26px rgba(0,0,0,.7), 0 0 0 1.5px rgba(255,196,0,.14)", borderRadius: 12, height: h }}>{card}</div>;
            return <div key={f} style={{ background: C.cream, padding: 6, transform: `rotate(${[-2, 1.4, -1, 2, -1.4][i]}deg)`, boxShadow: "3px 4px 0 rgba(58,38,25,.22)" }}>{card}</div>;
          })}
        </div>
      </div>
      <Grain w={1920} h={1080} opacity={v === "C" ? 0.22 : v === "A" ? 0.14 : 0.07} blend={v === "B" ? "screen" : "multiply"} tint={v === "B" ? "1 1 1" : "0.35 0.25 0.15"} freq={0.9} />
    </AbsoluteFill>
  );
};
