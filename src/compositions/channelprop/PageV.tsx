import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BannerCrop, COVERS, Grain } from "./shared";
import { C, HAND } from "./C";
import { Verdict, Avatar1, Avatar2, Avatar3, Banner1, Banner2, Banner3, BLACK, INK, SERIF } from "./D";

export type V = "1" | "2" | "3";
const BODY = '"Candara", "Segoe UI", sans-serif';
const SANS = '"Segoe UI", Arial, sans-serif';
const M = 130, TW = 296, TH = 167;
const img = (f: string) => staticFile(`channelprop/${f}`);
const tape = [C.must, C.sage, C.blush, C.denim];
const SHELF1 = ["dollar", "pompeii", "ring"] as const;
const SHELF2 = ["pocket", "thunder", "paper"] as const;
const SHORTS = ["s01.jpg", "s03.jpg", "s04.jpg", "s02.jpg", "s035.jpg"];

const T = {
  "1": { bg: "#FBF7EE", sub: "#8A7566", line: "#E3D6C0", Banner: Banner1, Avatar: Avatar1, label: "OPTION C1", motto: "Case notebook" },
  "2": { bg: "#E6CB9A", sub: "#6B4C36", line: "#C9A872", Banner: Banner2, Avatar: Avatar2, label: "OPTION C2", motto: "Cut-and-paste collage" },
  "3": { bg: "#FFF5E2", sub: "#7A5A44", line: "#E3C9A0", Banner: Banner3, Avatar: Avatar3, label: "OPTION C3", motto: "Diner table, top view" },
} as const;

const Play: React.FC = () => (
  <div style={{ position: "absolute", left: "50%", top: "50%", width: 54, height: 54, marginLeft: -27, marginTop: -27, borderRadius: 54, background: "rgba(0,0,0,.62)", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ borderLeft: "18px solid #fff", borderTop: "12px solid transparent", borderBottom: "12px solid transparent", marginLeft: 4 }} />
  </div>
);

const rot = (v: V, i: number) => (v === "1" ? 0 : [-2.2, 1.6, -1, 2, -1.6, 1.2][i % 6] * (v === "3" ? 0.5 : 1));

const Frame: React.FC<{ v: V; i: number; w: number; h: number; pad: number; children: React.ReactNode }> = ({ v, i, w, h, pad, children }) => {
  const st: Record<V, React.CSSProperties> = {
    "1": { background: "#fff", border: `1px solid ${T[1].line}`, borderRadius: 3, boxShadow: "0 3px 0 rgba(58,38,25,.07)" },
    "2": { background: C.cream, borderRadius: 2, boxShadow: "5px 6px 0 rgba(58,38,25,.3)" },
    "3": { background: "#fff", borderRadius: 3, boxShadow: "0 14px 20px rgba(58,38,25,.4), 0 2px 4px rgba(58,38,25,.3)" },
  };
  return (
    <div style={{ position: "relative", width: w + 2 * pad, height: h + 2 * pad, boxSizing: "border-box", padding: pad - (v === "1" ? 1 : 0), transform: `rotate(${rot(v, i)}deg)`, ...st[v] }}>
      <div style={{ position: "relative", width: w, height: h }}>{children}</div>
      {v === "2" && <div style={{ position: "absolute", left: "50%", top: -12, width: 86, height: 26, marginLeft: -43, background: tape[i % 4], opacity: 0.85, transform: `rotate(${i % 2 ? 3 : -4}deg)` }} />}
      {v === "3" && <div style={{ position: "absolute", left: "50%", top: -8, width: 18, height: 18, marginLeft: -9, borderRadius: 9, background: C.terra, border: `2px solid ${C.brown}`, boxShadow: "2px 4px 4px rgba(0,0,0,.35)" }} />}
    </div>
  );
};

const Thumb: React.FC<{ v: V; f: string; w: number; h: number; i: number; dur?: string; play?: boolean }> = ({ v, f, w, h, i, dur, play }) => (
  <Frame v={v} i={i} w={w} h={h} pad={v === "1" ? 7 : 9}>
    <Img src={img(f)} style={{ width: w, height: h, display: "block" }} />
    {dur && <div style={{ position: "absolute", right: 8, bottom: 8, background: "rgba(0,0,0,.82)", color: "#fff", fontSize: 18, fontWeight: 700, padding: "2px 7px", borderRadius: 5 }}>{dur}</div>}
    {play && <Play />}
  </Frame>
);

const tagCol = [[C.sage, "#fff"], [C.blush, C.brown], [C.denim, "#fff"]];
const Title: React.FC<{ v: V; text: string; n: number }> = ({ v, text, n }) => {
  if (v === "1") return <div style={{ display: "flex", alignItems: "baseline", gap: 12, height: 40 }}><span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 28, color: C.terra }}>0{n}</span><span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 31 }}>{text}</span></div>;
  if (v === "2") return <div style={{ height: 40, filter: "drop-shadow(3px 4px 0 rgba(58,38,25,.28))" }}><div style={{ display: "inline-block", background: tagCol[n - 1][0], color: tagCol[n - 1][1], fontFamily: BLACK, fontSize: 21, letterSpacing: 1, textTransform: "uppercase", padding: "7px 18px", clipPath: "polygon(0 12%,3% 0,97% 6%,100% 0,99% 88%,100% 100%,2% 94%,0 100%)", transform: "rotate(-1deg)" }}>{text}</div></div>;
  return <div style={{ height: 40 }}><div style={{ display: "inline-block", background: "#FFFCF4", fontFamily: HAND, fontWeight: 700, fontSize: 32, color: INK, padding: "0 18px", borderRadius: 3, boxShadow: "0 6px 10px rgba(58,38,25,.3)", transform: "rotate(-0.8deg)" }}>{text}</div></div>;
};

const Shelf: React.FC<{ v: V; name: string; n: number; items: readonly (keyof typeof COVERS)[]; top: number; off: number }> = ({ v, name, n, items, top, off }) => (
  <div style={{ position: "absolute", left: M, top, width: 984 }}>
    <Title v={v} text={name} n={n} />
    <div style={{ display: "flex", gap: 14, marginTop: 12 }}>
      {items.map((k, i) => (
        <div key={k} style={{ width: TW + 18 }}>
          <Thumb v={v} f={COVERS[k].f} w={TW} h={TH} i={i + off} />
          <div style={{ marginTop: 14, fontFamily: BODY, fontWeight: 700, fontSize: 20, lineHeight: 1.2, height: 48, overflow: "hidden", paddingRight: 8 }}>{COVERS[k].t}</div>
        </div>
      ))}
    </div>
  </div>
);

const Panel: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: "rgba(255,251,240,.95)", borderRadius: 8, boxShadow: "0 12px 24px rgba(58,38,25,.28)" }} />;

export const PageV: React.FC<{ v: V }> = ({ v }) => {
  const t = T[v];
  const Banner = t.Banner, Avatar = t.Avatar;
  const RX = 1120;
  const tabs = ["Home", "Videos", "Shorts", "Playlists", "Community"];
  const tabCol = [C.terra, C.sage, C.must, C.denim, C.blush];
  const bg: React.CSSProperties = v === "1" ? { backgroundImage: "repeating-linear-gradient(180deg, transparent 0, transparent 46px, rgba(58,38,25,.06) 46px, rgba(58,38,25,.06) 48px)" }
    : v === "3" ? { backgroundImage: "repeating-linear-gradient(90deg, rgba(217,88,43,.14) 0 40px, transparent 40px 80px), repeating-linear-gradient(0deg, rgba(217,88,43,.14) 0 40px, transparent 40px 80px)" } : {};
  return (
    <AbsoluteFill style={{ background: t.bg, fontFamily: BODY, color: C.brown, ...bg }}>
      <div style={{ position: "absolute", left: M, top: 20, borderRadius: 18, overflow: "hidden", boxShadow: v === "3" ? "0 10px 22px rgba(58,38,25,.35)" : "0 0 0 1.5px rgba(0,0,0,.12)" }}><BannerCrop width={1660} height={274}><Banner /></BannerCrop></div>
      <div style={{ position: "absolute", left: 1020, top: 318, background: "rgba(10,12,20,.88)", color: "#fff", padding: "8px 16px", borderRadius: 10, fontFamily: SANS, lineHeight: 1.25 }}>
        <div style={{ fontWeight: 800, fontSize: 21, letterSpacing: 2 }}>{t.label}</div>
        <div style={{ fontSize: 19, opacity: 0.85 }}>{t.motto}</div>
      </div>
      <div style={{ position: "absolute", left: M, top: 306, width: 112, height: 112, borderRadius: 56, overflow: "hidden", boxShadow: "0 4px 10px rgba(0,0,0,.25)" }}>
        <div style={{ width: 800, height: 800, transform: "scale(0.14)", transformOrigin: "0 0" }}><Avatar /></div>
      </div>
      <div style={{ position: "absolute", left: M + 136, top: 300 }}>
        <div style={{ fontFamily: v === "1" ? SERIF : v === "2" ? BLACK : HAND, fontWeight: v === "3" ? 700 : 400, fontSize: v === "3" ? 54 : v === "2" ? 34 : 44, lineHeight: 1.1, color: v === "3" ? INK : C.brown }}>{v === "2" ? "THE EVERYDAY MYSTERY" : "The Everyday Mystery"}</div>
        <div style={{ fontSize: 24, color: t.sub, marginTop: 4 }}>@TheEverydayMystery</div>
        <div style={{ fontSize: 24, color: t.sub, marginTop: 2, whiteSpace: "nowrap" }}>Everyday things, checked: documented, disputed or myth.</div>
      </div>
      <div style={{ position: "absolute", right: M, top: 324, background: C.terra, color: C.cream, fontWeight: 800, fontSize: 26, padding: "13px 34px", borderRadius: v === "2" ? 4 : 30, fontFamily: v === "2" ? BLACK : BODY, textTransform: v === "2" ? "uppercase" : "none", boxShadow: v === "2" ? `5px 6px 0 ${C.brown}` : v === "3" ? "0 10px 16px rgba(58,38,25,.4)" : "none", transform: v === "2" ? "rotate(-2deg)" : "none" }}>Subscribe</div>
      <div style={{ position: "absolute", left: M, top: 426, width: 1920 - 2 * M, height: 44, borderBottom: `2px solid ${t.line}`, display: "flex", gap: v === "1" ? 34 : 10, alignItems: "flex-end" }}>
        {tabs.map((n, i) => v === "1" ? (
          <div key={n} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 27, color: i === 0 ? C.brown : t.sub, padding: "4px 4px 6px", borderBottom: i === 0 ? `4px solid ${C.terra}` : "4px solid transparent" }}>{n}</div>
        ) : v === "2" ? (
          <div key={n} style={{ fontFamily: BLACK, fontSize: 18, textTransform: "uppercase", padding: "8px 18px 6px", background: tabCol[i], color: i % 2 && i !== 3 ? C.brown : "#fff", transform: `rotate(${i % 2 ? 1 : -1}deg)`, boxShadow: "3px 3px 0 rgba(58,38,25,.25)", clipPath: "polygon(0 8%,4% 0,96% 5%,100% 0,100% 100%,0 100%)" }}>{n}</div>
        ) : (
          <div key={n} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 26, padding: "5px 20px 3px", background: i === 0 ? C.terra : "#FFFCF4", color: i === 0 ? C.cream : INK, borderRadius: "8px 8px 0 0", boxShadow: "0 -3px 8px rgba(58,38,25,.2)" }}>{n}</div>
        ))}
      </div>
      {v === "3" && <><Panel x={108} y={466} w={986} h={306} /><Panel x={108} y={770} w={986} h={304} /><Panel x={1100} y={466} w={702} h={316} /><Panel x={1100} y={786} w={702} h={288} /></>}
      <div style={{ position: "absolute", left: M + (v === "2" ? 690 : 530), top: 476 }}><Verdict v={v} /></div>
      <Shelf v={v} name="Documented, Disputed or Myth?" n={1} items={SHELF1} top={478} off={0} />
      <Shelf v={v} name="Why Is It Like This?" n={2} items={SHELF2} top={782} off={3} />
      {[["CHANNEL TRAILER", "dollar", "This is The Everyday Mystery.", "0:38", true], ["LATEST", "music", COVERS.music.t, "", false]].map(([lab, k, title, dur, play], i) => (
        <div key={lab as string} style={{ position: "absolute", left: RX, top: 484 + i * 154, width: 590, display: "flex", gap: 18 }}>
          <Thumb v={v} f={COVERS[k as keyof typeof COVERS].f} w={246} h={138} i={i + 1} dur={dur as string} play={play as boolean} />
          <div style={{ paddingTop: 6 }}>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 24, color: C.terra }}>{lab as string}</div>
            <div style={{ fontWeight: 700, fontSize: 24, lineHeight: 1.22, marginTop: 2 }}>{title as string}</div>
            <div style={{ fontSize: 19, color: t.sub, marginTop: 6 }}>{i === 0 ? "For new visitors" : "New"}</div>
          </div>
        </div>
      ))}
      <div style={{ position: "absolute", left: RX, top: 796 }}>
        <Title v={v} text="Shorts" n={3} />
        <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
          {SHORTS.map((f, i) => (
            <Frame key={f} v={v} i={i + 2} w={110} h={196} pad={v === "1" ? 5 : 6}><Img src={img(f)} style={{ width: 110, height: 196, display: "block", objectFit: "cover" }} /></Frame>
          ))}
        </div>
      </div>
      <Grain w={1920} h={1080} opacity={0.2} blend="multiply" tint="0.35 0.25 0.15" freq={0.9} />
    </AbsoluteFill>
  );
};
