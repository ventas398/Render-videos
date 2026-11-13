import React from "react";
import { AbsoluteFill } from "remotion";

/** Paleta de escaparate del canal (clara, la del video). Independiente de src/themes/brand.ts. */
const D = {
  light: "#FFFDF8", // luz suave en el centro
  paper: "#F7F3EA",
  edge: "#EFE6D2", // borde calido, nunca gris
  ink: "#14213D",
  teal: "#0A8F8D",
  orange: "#E56B0F",
  serif: 'Georgia, Cambria, "Times New Roman", serif',
  sans: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
} as const;

const W = 2560;
const H = 1440;

/** Curvas de nivel: lineas suaves superpuestas, muy tenues. */
const contour = (i: number) => {
  const y0 = 80 + i * 62;
  const a = 38 + (i % 5) * 14;
  const f = 0.0016 + (i % 3) * 0.0004;
  const p = i * 0.7;
  return `M0 ${y0} ` + Array.from({ length: 65 }, (_, k) => `L${k * 40} ${(y0 + a * Math.sin(k * 40 * f + p) + a * 0.5 * Math.sin(k * 40 * f * 2.3 + p * 1.7)).toFixed(1)}`).join(" ");
};

/** Signo de interrogacion construido con compas: arco, tallo y punto, con lineas de construccion. Caja ~ 280x400 centrada en 0,0. */
const Construct: React.FC<{ s?: number }> = ({ s = 1 }) => {
  const R = 70;
  const cy = -70;
  const thin = { fill: "none", stroke: D.teal, strokeWidth: 1.5, opacity: 0.55 } as const;
  return (
    <g transform={`scale(${s})`}>
      {/* construccion */}
      <circle cx={0} cy={cy} r={R} {...thin} strokeDasharray="6 6" />
      <circle cx={0} cy={cy} r={R + 46} {...thin} opacity={0.3} />
      <circle cx={0} cy={112} r={22} {...thin} strokeDasharray="4 5" />
      <line x1={-150} y1={cy} x2={150} y2={cy} {...thin} strokeDasharray="22 6 3 6" />
      <line x1={0} y1={-190} x2={0} y2={185} {...thin} strokeDasharray="22 6 3 6" />
      <line x1={-150} y1={112} x2={150} y2={112} {...thin} opacity={0.3} />
            <path d="M-70 -70 A70 70 0 1 1 45 -16 C26 0 0 10 0 40 V58" stroke={D.orange} strokeWidth={4} fill="none" />
      <circle cx={0} cy={112} r={7} fill={D.orange} />
      <circle cx={0} cy={cy} r={3} fill={D.orange} />
      <circle cx={0} cy={112} r={2} fill={D.paper} />
    </g>
  );
};

/** Lupa en plano tecnico: lente, mango, ejes y cota. */
const Lens: React.FC = () => {
  const line = { fill: "none", stroke: D.ink, strokeWidth: 2, opacity: 0.7 } as const;
  const dim = { stroke: D.teal, strokeWidth: 1.5, fill: "none" } as const;
  return (
    <g>
      <circle r={150} {...line} strokeWidth={3} />
      <circle r={128} {...line} opacity={0.4} />
      <path d="M-96 -52 A110 110 0 0 1 -30 -108" stroke={D.ink} strokeWidth={3} fill="none" opacity={0.5} />
      <path d="M106 106 L220 220" stroke={D.ink} strokeWidth={26} strokeLinecap="round" opacity={0.75} />
      <path d="M106 106 L220 220" stroke={D.paper} strokeWidth={20} strokeLinecap="round" />
      <line x1={-190} y1={0} x2={190} y2={0} stroke={D.teal} strokeWidth={1.5} strokeDasharray="26 7 4 7" opacity={0.6} />
      <line x1={0} y1={-185} x2={0} y2={190} stroke={D.teal} strokeWidth={1.5} strokeDasharray="26 7 4 7" opacity={0.6} />
      <line x1={-150} y1={-205} x2={150} y2={-205} {...dim} />
      <line x1={-150} y1={-205} x2={-150} y2={-170} {...dim} opacity={0.6} />
      <line x1={150} y1={-205} x2={150} y2={-170} {...dim} opacity={0.6} />
      <path d="M-150 -205 l14 -5 v10 Z M150 -205 l-14 -5 v10 Z" fill={D.teal} />
      <text x={0} y={-216} textAnchor="middle" fontFamily={D.sans} fontSize={26} letterSpacing={3} fill={D.teal}>Ø 300</text>
      <circle r={5} fill={D.orange} />
    </g>
  );
};

const Backdrop: React.FC = () => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="bg" cx="50%" cy="50%" r="75%">
        <stop offset="0" stopColor={D.light} />
        <stop offset="0.55" stopColor={D.paper} />
        <stop offset="1" stopColor={D.edge} />
      </radialGradient>
      <radialGradient id="calm" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor={D.light} stopOpacity={0.8} />
        <stop offset="1" stopColor={D.light} stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill="url(#bg)" />
    {Array.from({ length: 65 }, (_, i) => (
      <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={H} stroke={D.ink} strokeWidth={1} opacity={i % 5 === 0 ? 0.07 : 0.03} />
    ))}
    {Array.from({ length: 37 }, (_, i) => (
      <line key={`h${i}`} x1={0} y1={i * 40} x2={W} y2={i * 40} stroke={D.ink} strokeWidth={1} opacity={i % 5 === 0 ? 0.07 : 0.03} />
    ))}
    {Array.from({ length: 22 }, (_, i) => (
      <path key={i} d={contour(i)} fill="none" stroke={D.teal} strokeWidth={1.5} opacity={0.1} />
    ))}
    <ellipse cx={W / 2} cy={H / 2} rx={1250} ry={480} fill="url(#calm)" />
  </svg>
);

/** Portada de canal, 2560x1440. Zona segura de todos los dispositivos: 1546x423 centrada. */
export const ChannelBanner: React.FC = () => (
  <AbsoluteFill style={{ background: D.paper }}>
    <Backdrop />
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(185 ${H / 2 + 8}) scale(0.88)`}>
        <Lens />
      </g>
      <g transform={`translate(${W - 180} ${H / 2 + 8})`}>
        <Construct s={1.05} />
      </g>
    </svg>
    <div style={{ position: "absolute", left: (W - 1546) / 2, top: (H - 423) / 2, width: 1546, height: 423, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div style={{ fontFamily: D.serif, fontWeight: 400, fontSize: 88, letterSpacing: 16, whiteSpace: "nowrap", color: D.ink, lineHeight: 1, paddingLeft: 16 }}>THE EVERYDAY MYSTERY</div>
      <svg width={420} height={20} viewBox="0 0 420 20" style={{ margin: "34px 0 30px" }}>
        <line x1={0} y1={10} x2={180} y2={10} stroke={D.ink} strokeWidth={2} />
        <line x1={240} y1={10} x2={420} y2={10} stroke={D.ink} strokeWidth={2} />
        <rect x={203} y={3} width={14} height={14} transform="rotate(45 210 10)" fill={D.orange} />
      </svg>
      <div style={{ fontFamily: D.serif, fontStyle: "italic", fontWeight: 400, fontSize: 56, letterSpacing: 3, whiteSpace: "nowrap", color: D.teal }}>Look again at what you stopped seeing.</div>
    </div>
  </AbsoluteFill>
);

/** Avatar del canal, 800x800 (YouTube lo recorta en circulo): monograma EM con aro cobre fino. */
export const ChannelAvatar: React.FC = () => (
  <AbsoluteFill style={{ background: D.paper }}>
    <svg width={800} height={800} viewBox="0 0 800 800" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="av" cx="50%" cy="42%" r="70%">
          <stop offset="0" stopColor={D.light} />
          <stop offset="1" stopColor={D.edge} />
        </radialGradient>
      </defs>
      <rect width={800} height={800} fill="url(#av)" />
      <circle cx={400} cy={400} r={366} fill="none" stroke={D.orange} strokeWidth={13} />
      <circle cx={400} cy={400} r={346} fill="none" stroke={D.orange} strokeWidth={2} opacity={0.6} />
      {Array.from({ length: 72 }, (_, i) => {
        const a = (i * Math.PI) / 36;
        const r1 = 320;
        const r2 = i % 6 === 0 ? 342 : 332;
        return <line key={i} x1={400 + r1 * Math.cos(a)} y1={400 + r1 * Math.sin(a)} x2={400 + r2 * Math.cos(a)} y2={400 + r2 * Math.sin(a)} stroke={D.ink} strokeWidth={i % 6 === 0 ? 3 : 2} opacity={0.4} />;
      })}
      <text x={400} y={412} textAnchor="middle" dominantBaseline="central" fontFamily={D.serif} fontWeight={400} fontSize={310} letterSpacing={30} fill={D.ink}>
        EM
      </text>
      <line x1={250} y1={582} x2={365} y2={582} stroke={D.ink} strokeWidth={4} />
      <line x1={435} y1={582} x2={550} y2={582} stroke={D.ink} strokeWidth={4} />
      <circle cx={400} cy={582} r={13} fill={D.orange} />
    </svg>
  </AbsoluteFill>
);
