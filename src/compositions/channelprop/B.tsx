import React from "react";
import { AbsoluteFill } from "remotion";
import { Grain } from "./shared";

export const B = { night: "#050914", navy: "#0A1A4A", blue: "#16337A", yellow: "#FFC400", red: "#E8261C", white: "#F2F5FF", mute: "#8F9BC2" };
export const CONDENSED = 'Bahnschrift, "Arial Narrow", "Segoe UI", sans-serif';
const IMPACT = 'Impact, "Arial Black", sans-serif';
const SERIF = '"Georgia Pro", Georgia, serif';

const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export const BannerB: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${B.night} 0%, #08122E 50%, ${B.night} 100%)` }}>
    <svg width={2560} height={1440} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <radialGradient id="bglow" cx="50%" cy="50%" r="55%"><stop offset="0" stopColor="#1B3F9A" stopOpacity={0.75} /><stop offset="0.55" stopColor="#0F2260" stopOpacity={0.35} /><stop offset="1" stopColor="#050914" stopOpacity={0} /></radialGradient>
        <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#BFD2FF" stopOpacity={0.30} /><stop offset="1" stopColor="#BFD2FF" stopOpacity={0} /></linearGradient>
        <linearGradient id="streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={B.yellow} stopOpacity={0} /><stop offset="0.5" stopColor="#FFE58A" stopOpacity={1} /><stop offset="1" stopColor={B.yellow} stopOpacity={0} /></linearGradient>
        <radialGradient id="lens" cx="38%" cy="34%" r="75%"><stop offset="0" stopColor="#7FA6FF" stopOpacity={0.9} /><stop offset="0.45" stopColor="#1B3F9A" stopOpacity={0.9} /><stop offset="1" stopColor="#060D26" /></radialGradient>
        <filter id="b6"><feGaussianBlur stdDeviation="6" /></filter>
        <filter id="b16"><feGaussianBlur stdDeviation="16" /></filter>
        <filter id="b40"><feGaussianBlur stdDeviation="40" /></filter>
      </defs>
      <rect width={2560} height={1440} fill="url(#bglow)" />
      {/* haces de luz */}
      <g filter="url(#b16)" opacity={0.85}>
        <polygon points="260,-40 520,-40 1500,1100 1180,1100" fill="url(#beam)" />
        <polygon points="760,-40 900,-40 1900,1100 1760,1100" fill="url(#beam)" opacity={0.6} />
        <polygon points="2300,-40 2440,-40 1700,1100 1580,1100" fill="url(#beam)" opacity={0.5} />
      </g>
      {/* interrogante fantasma (derecha) */}
      <g>
        <text x={2240} y={1000} textAnchor="middle" fontFamily={IMPACT} fontSize={840} fill="none" stroke={B.yellow} strokeWidth={14} opacity={0.4} filter="url(#b16)">?</text>
        <text x={2240} y={1000} textAnchor="middle" fontFamily={IMPACT} fontSize={840} fill="#0B1A48" stroke={B.yellow} strokeWidth={3} opacity={0.95}>?</text>
      </g>
      {/* objetivo de camara (izquierda) */}
      <g transform="translate(262,716)">
        <circle r={190} fill="#050914" stroke="#24366E" strokeWidth={4} />
        <circle r={168} fill="none" stroke={B.yellow} strokeWidth={3} opacity={0.8} />
        <circle r={146} fill="url(#lens)" stroke="#9DB6FF" strokeWidth={2} />
        <circle r={104} fill="none" stroke="#9DB6FF" strokeWidth={1.5} opacity={0.5} />
        <circle r={62} fill="#02050F" stroke="#2A4390" strokeWidth={2} />
        <ellipse cx={-48} cy={-56} rx={44} ry={20} fill="#fff" opacity={0.55} transform="rotate(-38 -48 -56)" />
        <circle cx={58} cy={52} r={11} fill={B.yellow} opacity={0.9} />
        <g stroke="#9DB6FF" strokeWidth={2} opacity={0.5}>{Array.from({ length: 36 }, (_, i) => { const a = (i / 36) * 6.283; return <line key={i} x1={Math.cos(a) * 176} y1={Math.sin(a) * 176} x2={Math.cos(a) * (i % 3 ? 184 : 190)} y2={Math.sin(a) * (i % 3 ? 184 : 190)} />; })}</g>
      </g>
      {/* destello anamorfico */}
      <ellipse cx={1280} cy={816} rx={1180} ry={22} fill="url(#streak)" filter="url(#b16)" opacity={0.65} />
      <rect x={110} y={814} width={2340} height={4} fill="url(#streak)" opacity={0.95} />
      <circle cx={1280} cy={816} r={26} fill="#FFF3C2" filter="url(#b6)" />
      {/* polvo en suspension */}
      {Array.from({ length: 70 }, (_, i) => <circle key={i} cx={rnd(i) * 2560} cy={rnd(i + 90) * 1440} r={1.5 + rnd(i + 200) * 4} fill="#CFE0FF" opacity={0.15 + rnd(i + 300) * 0.4} filter={i % 4 === 0 ? "url(#b6)" : undefined} />)}
      {/* perforaciones de pelicula (TV) */}
      {[28, 1392].map((y) => Array.from({ length: 46 }, (_, i) => <rect key={`${y}-${i}`} x={20 + i * 56} y={y} width={30} height={20} rx={5} fill="#050914" stroke="#1B2A5C" strokeWidth={2} />))}
    </svg>
    {/* titulo */}
    <div style={{ position: "absolute", left: 0, width: 2560, top: 518, textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", gap: 36, fontFamily: CONDENSED, fontWeight: 600, fontSize: 54, letterSpacing: "0.62em", paddingLeft: "0.62em", color: B.white }}>
      <span style={{ width: 120, height: 7, background: B.red }} />THE EVERYDAY<span style={{ width: 120, height: 7, background: B.red }} />
    </div>
    <div style={{ position: "absolute", left: 0, width: 2560, top: 538, textAlign: "center", fontFamily: IMPACT, fontSize: 262, lineHeight: 1.12, letterSpacing: "0.045em", paddingLeft: "0.045em", background: "linear-gradient(180deg, #FFFFFF 15%, #C9D6F7 100%)", WebkitBackgroundClip: "text", color: "transparent", filter: "drop-shadow(0 0 28px rgba(255,196,0,.28)) drop-shadow(0 8px 0 rgba(0,0,0,.35))" }}>MYSTERY</div>
    <div style={{ position: "absolute", left: 0, width: 2560, top: 840, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 50, color: B.white }}>Look again at what you <span style={{ color: B.yellow }}>stopped seeing.</span></div>
    <div style={{ position: "absolute", left: 60, top: 78, fontFamily: CONDENSED, fontSize: 24, letterSpacing: "0.3em", color: B.mute }}>TC 00:00:00:00</div>
    <div style={{ position: "absolute", right: 60, top: 78, fontFamily: CONDENSED, fontSize: 24, letterSpacing: "0.3em", color: B.red }}>● REC</div>
    {/* vineta */}
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.72) 100%)" }} />
    <Grain w={2560} h={1440} opacity={0.12} blend="screen" tint="1 1 1" freq={0.9} />
  </AbsoluteFill>
);

export const AvatarB: React.FC = () => (
  <AbsoluteFill style={{ background: "transparent" }}>
    <svg width={800} height={800} viewBox="0 0 800 800">
      <defs>
        <radialGradient id="ab" cx="50%" cy="42%" r="70%"><stop offset="0" stopColor="#1E46A8" /><stop offset="0.55" stopColor="#0A1A4A" /><stop offset="1" stopColor="#030610" /></radialGradient>
        <filter id="g8"><feGaussianBlur stdDeviation="9" /></filter>
        <linearGradient id="emg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#C9D6F7" /></linearGradient>
      </defs>
      <circle cx={400} cy={400} r={400} fill="url(#ab)" />
      {/* regla de cuenta atras: anillo con cuatro arcos */}
      <circle cx={400} cy={400} r={362} fill="none" stroke={B.yellow} strokeWidth={22} strokeDasharray="500 68.5" strokeDashoffset={-34} />
      <circle cx={400} cy={400} r={322} fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={2} />
      <g stroke="#fff" strokeOpacity={0.30} strokeWidth={2}><line x1={30} y1={400} x2={770} y2={400} /><line x1={400} y1={30} x2={400} y2={770} /></g>
      <circle cx={400} cy={400} r={250} fill="#050A1E" fillOpacity={0.88} stroke="#fff" strokeOpacity={0.25} strokeWidth={2} />
      <text x={400} y={522} textAnchor="middle" fontFamily={IMPACT} fontSize={340} fill={B.yellow} opacity={0.5} filter="url(#g8)" letterSpacing={6}>EM</text>
      <text x={412} y={534} textAnchor="middle" fontFamily={IMPACT} fontSize={340} fill="#02040C" letterSpacing={6}>EM</text>
      <text x={400} y={522} textAnchor="middle" fontFamily={IMPACT} fontSize={340} fill="url(#emg)" letterSpacing={6}>EM</text>
      <circle cx={400} cy={118} r={22} fill={B.red} /><circle cx={400} cy={118} r={36} fill="none" stroke={B.red} strokeWidth={3} opacity={0.6} />
    </svg>
  </AbsoluteFill>
);
