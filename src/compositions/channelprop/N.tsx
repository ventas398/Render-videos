import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Grain } from "./shared";

// Propuestas N1-N5 (11/11): mismo contenido y estructura firmada, cinco ideas visuales distintas.
export type Cat = { name: string; promise: string; col: string; ink: string; items: [string, string][] };
export const LEMA = "Facts worth repeating at dinner.";
export const HANDLE = "@TheEverydayMystery";
export const DESC = "Everyday things, explained and fact-checked. Documented, disputed or myth? Sources in every video.";
const img = (f: string) => staticFile(`channelprop/${f}`);

export const mk = (cols: [string, string, string, string], inks: [string, string, string, string]): Cat[] => [
  { name: "Case Files", promise: "Famous claims, checked.", col: cols[0], ink: inks[0], items: [["c025.jpg", "Hidden in Plain Sight: Which Secret Symbols Are Real?"], ["c029.jpg", "Why Can't Anyone Agree on the Day Pompeii Disappeared?"], ["c026.jpg", "Why Is the Wedding Ring on That Finger?"], ["c035.jpg", "Toilet Paper: Over or Under? The Answer Is Not in the Patent"]] },
  { name: "Things You Touch", promise: "The odd reasons objects look the way they do.", col: cols[1], ink: inks[1], items: [["c010.jpg", "Why Do Jeans Have a Tiny Pocket Inside the Pocket?"], ["c022.jpg", "Why Is Printer Paper This Exact Shape?"], ["c003.jpg", "Why Is There a Barcode on Everything?"], ["c012.jpg", "Why Did Nobody Want Shopping Carts at First?"]] },
  { name: "Rules You Follow", promise: "Who set the prices, dates and laws.", col: cols[2], ink: inks[2], items: [["c004.jpg", "Why Is Popcorn at the Movies So Expensive?"], ["c005.jpg", "Why Does Red Mean Stop?"], ["c008.jpg", "Why Is a Marathon 26.2 Miles?"], ["c023.jpg", "The Morning an Entire Country Changed Sides of the Road"]] },
  { name: "Science Around You", promise: "The physics hiding in ordinary moments.", col: cols[3], ink: inks[3], items: [["c021.jpg", "Why Do We Hear Thunder After Lightning?"], ["c053.jpg", "One Scene, Four Moods"], ["c020.jpg", "Why Can Some Insects Walk on Water?"], ["c018.jpg", "How Does a Gas Meter Measure What You Use Today?"]] },
];
const SHORTS: [string, number][] = [["s035.jpg", 0], ["s01.jpg", 1], ["s02.jpg", 1], ["s03.jpg", 2], ["s04.jpg", 3]];
const TABS = ["Home", "Videos", "Shorts", "Playlists", "Community"];

export const Icon: React.FC<{ k: number; c: string; s: number; w?: number }> = ({ k, c, s, w = 3.5 }) => (
  <svg viewBox="0 0 48 48" width={s} height={s} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
    {k === 0 && <><circle cx={20} cy={20} r={13} /><path d="M30 30L43 43" /></>}
    {k === 1 && <path d="M16 30V14a3 3 0 0 1 6 0v12M22 24V8a3 3 0 0 1 6 0v16M28 24V11a3 3 0 0 1 6 0v18M34 20v-4a3 3 0 0 1 6 0v14c0 8-6 14-14 14h-2c-6 0-9-3-12-8l-5-8a3 3 0 0 1 5-3l4 5" />}
    {k === 2 && <g transform="rotate(-30 24 24)"><rect x={2} y={15} width={44} height={18} rx={2} /><path d="M12 15v7M19 15v10M26 15v7M33 15v10M40 15v7" /></g>}
    {k === 3 && <path d="M27 4L10 27h13l-4 17 19-25H25z" />}
  </svg>
);

export const clamp: React.CSSProperties = { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" };
export const Play: React.FC<{ s?: number }> = ({ s = 50 }) => (
  <div style={{ position: "absolute", left: "50%", top: "50%", width: s, height: s, marginLeft: -s / 2, marginTop: -s / 2, borderRadius: s, background: "rgba(0,0,0,.65)", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ borderLeft: `${s * 0.34}px solid #fff`, borderTop: `${s * 0.22}px solid transparent`, borderBottom: `${s * 0.22}px solid transparent`, marginLeft: s * 0.08 }} />
  </div>
);
export const Pic: React.FC<{ f: string; w: number; h: number; dur?: string; play?: boolean }> = ({ f, w, h, dur, play }) => (
  <div style={{ position: "relative", width: w, height: h }}>
    <Img src={img(f)} style={{ width: w, height: h, display: "block", objectFit: "cover" }} />
    {dur && <div style={{ position: "absolute", right: 5, bottom: 5, background: "rgba(0,0,0,.82)", color: "#fff", fontSize: 15, fontWeight: 700, padding: "1px 6px", borderRadius: 4, fontFamily: "Segoe UI" }}>{dur}</div>}
    {play && <Play />}
  </div>
);

export type Th = {
  cats: Cat[]; pitch: number; bg: React.CSSProperties; bgx?: React.ReactNode; font: string; ink: string; sub: string;
  banner: React.ReactNode; avatar: React.ReactNode; nameStyle: React.CSSProperties; subscribe: React.CSSProperties; tab: (active: boolean) => React.CSSProperties; tabsBar?: React.CSSProperties;
  Row: React.FC<{ c: Cat; i: number; children: React.ReactNode }>;
  Item: React.FC<{ f: string; t: string; i: number; j: number; c: Cat }>;
  frame: (inner: React.ReactNode, i: number, c?: Cat) => React.ReactNode;
  head: (text: string) => React.ReactNode;
  card: React.CSSProperties; chip: (c: Cat) => React.CSSProperties; trailerLabel: React.CSSProperties; grain?: number; desc?: React.CSSProperties;
};

export const X0 = 60, Y0 = 368, RX = 1110;

export const Page: React.FC<{ th: Th }> = ({ th }) => {
  const stamp = th.cats[0];
  return (
    <AbsoluteFill style={{ fontFamily: th.font, color: th.ink, ...th.bg }}>
      {th.bgx}
      <div style={{ position: "absolute", left: X0, top: 16, width: 1800, height: 200 }}>{th.banner}</div>
      <div style={{ position: "absolute", left: X0 + 10, top: 228, width: 84, height: 84 }}>{th.avatar}</div>
      <div style={{ position: "absolute", left: X0 + 116, top: 222 }}>
        <div style={{ ...th.nameStyle, lineHeight: 1.1 }}>The Everyday Mystery</div>
        <div style={{ fontSize: 21, color: th.sub, marginTop: 4, display: "inline-block", ...th.desc }}>{HANDLE} &nbsp;·&nbsp; {DESC}</div>
      </div>
      <div style={{ position: "absolute", right: X0, top: 238, fontWeight: 800, fontSize: 24, padding: "11px 32px", ...th.subscribe }}>Subscribe</div>
      <div style={{ position: "absolute", left: X0, top: 322, width: 1800, display: "flex", gap: 8, alignItems: "flex-end", ...th.tabsBar }}>
        {TABS.map((n, i) => <div key={n} style={{ fontSize: 22, padding: "6px 18px", ...th.tab(i === 0) }}>{n}</div>)}
      </div>
      {th.cats.map((c, i) => (
        <th.Row key={c.name} c={c} i={i}>
          {c.items.map(([f, t], j) => <th.Item key={f} f={f} t={t} i={i} j={j} c={c} />)}
        </th.Row>
      ))}
      <div style={{ position: "absolute", left: RX, top: Y0, width: 750, display: "flex", gap: 20 }}>
        {th.frame(<Pic f="c025.jpg" w={350} h={197} dur="0:38" play />, 0, stamp)}
        <div style={{ paddingTop: 6, width: 360 }}>
          <div style={{ fontSize: 21, fontWeight: 800, ...th.trailerLabel }}>CHANNEL TRAILER</div>
          <div style={{ fontWeight: 800, fontSize: 25, lineHeight: 1.2, marginTop: 6 }}>The Everyday Mystery: facts worth repeating at dinner</div>
          <div style={{ display: "flex", gap: 6, marginTop: 12 }}>{th.cats.map((c) => <div key={c.name} style={{ width: 46, height: 10, borderRadius: 5, background: c.col }} />)}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: RX, top: Y0 + 224, width: 750 }}>
        {th.head("Shorts")}
        <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
          {SHORTS.map(([f, k], i) => (
            <div key={f}>{th.frame(<div style={{ position: "relative" }}><Pic f={f} w={104} h={185} /><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, background: th.cats[k].col }} /></div>, i + 1, th.cats[k])}</div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: RX, top: Y0 + 498, width: 750, height: 178, boxSizing: "border-box", padding: "14px 22px", ...th.card }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: 1.5, padding: "3px 12px", ...th.chip(stamp) }}>CASE FILES · Stamp it</span>
          <span style={{ fontSize: 17, opacity: 0.7 }}>Community · pinned</span>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.25, marginTop: 10 }}>A vein runs straight from the ring finger to the heart. Documented, disputed or myth?</div>
        <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
          {["Documented", "Disputed", "Myth"].map((o) => <div key={o} style={{ flex: 1, textAlign: "center", fontSize: 19, fontWeight: 700, padding: "6px 0", border: "2px solid currentColor", borderRadius: 24, opacity: 0.85 }}>{o}</div>)}
        </div>
      </div>
      {th.grain ? <Grain w={1920} h={1080} opacity={th.grain} /> : null}
    </AbsoluteFill>
  );
};

export const Dots: React.FC<{ cats: Cat[]; size?: number; gap?: number; style?: React.CSSProperties; txt?: React.CSSProperties }> = ({ cats, size = 22, gap = 28, style, txt }) => (
  <div style={{ display: "flex", gap, alignItems: "center", ...style }}>
    {cats.map((c, i) => <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: size, letterSpacing: 2, ...txt }}><Icon k={i} c={c.col} s={size * 1.5} />{["CASE FILES", "THINGS", "RULES", "SCIENCE"][i]}</div>)}
  </div>
);
