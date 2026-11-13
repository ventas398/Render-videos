import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../themes/brand";
import { ChannelAvatar, ChannelBanner } from "./Brand";

const T = { ...theme, serif: 'Georgia, Cambria, "Times New Roman", serif', pane: "#DDEEEE" };

/** Miniaturas 1280x720: gancho WHY? + diagrama vectorial limpio sobre papel. */
const ThumbFrame: React.FC<{ lines: string[]; children: React.ReactNode }> = ({ lines, children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 35% 40%, #FFFDF8 0%, ${T.bg} 55%, #EFE6D2 100%)`, fontFamily: T.font }}>
    <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 33 }, (_, i) => (
        <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={720} stroke={T.ink} strokeWidth={1} opacity={i % 5 === 0 ? 0.06 : 0.025} />
      ))}
      {Array.from({ length: 19 }, (_, i) => (
        <line key={`h${i}`} x1={0} y1={i * 40} x2={1280} y2={i * 40} stroke={T.ink} strokeWidth={1} opacity={i % 5 === 0 ? 0.06 : 0.025} />
      ))}
      {children}
      <text x={40} y={694} textAnchor="start" fontFamily={T.font} fontSize={20} fill={T.ink} opacity={0.55}>
        Simplified illustration
      </text>
    </svg>
    <div style={{ position: "absolute", left: 64, top: 70, fontFamily: T.serif, fontWeight: 700, fontSize: 205, lineHeight: 1, color: T.ink, letterSpacing: -2 }}>
      WHY<span style={{ color: T.orange }}>?</span>
    </div>
    <div style={{ position: "absolute", left: 76, top: 340, width: 70, height: 6, background: T.orange }} />
    <div style={{ position: "absolute", left: 76, top: 372, fontWeight: 600, fontSize: 52, letterSpacing: 5, lineHeight: 1.25, color: T.teal }}>
      {lines.map((l) => (
        <div key={l}>{l}</div>
      ))}
    </div>
  </AbsoluteFill>
);

const Cross: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g stroke={T.orange} strokeWidth={9} strokeLinecap="round">
    <line x1={x - 22} y1={y - 22} x2={x + 22} y2={y + 22} />
    <line x1={x + 22} y1={y - 22} x2={x - 22} y2={y + 22} />
  </g>
);

export const ThumbEM001: React.FC = () => {
  const bursts = [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ].flatMap(([sx, sy]) => [0, 1, 2].map((k) => ({ sx, sy, a: 15 + k * 30 })));
  return (
    <ThumbFrame lines={["ROUND", "AIRPLANE", "WINDOWS"]}>
      {/* ventana cuadrada: la tension se concentra en las esquinas */}
      <g transform="translate(830 420)">
        <rect x={-95} y={-125} width={190} height={250} rx={8} fill="#fff" stroke={T.ink} strokeWidth={7} />
        <rect x={-68} y={-98} width={136} height={196} rx={4} fill={T.pane} stroke={T.ink} strokeWidth={4} />
        {bursts.map((b, i) => {
          const r = (b.a * Math.PI) / 180;
          const cx = b.sx * 95;
          const cy = b.sy * 125;
          const dx = b.sx * Math.cos(r);
          const dy = b.sy * Math.sin(r);
          return <line key={i} x1={cx + dx * 14} y1={cy + dy * 14} x2={cx + dx * 46} y2={cy + dy * 46} stroke={T.orange} strokeWidth={6} strokeLinecap="round" />;
        })}
      </g>
      <Cross x={830} y={625} />
      {/* ventana redonda: la tension se reparte */}
      <g transform="translate(1100 420)">
        <ellipse rx={100} ry={135} fill="#fff" stroke={T.ink} strokeWidth={7} />
        <ellipse rx={73} ry={108} fill={T.pane} stroke={T.ink} strokeWidth={4} />
        <ellipse rx={128} ry={163} fill="none" stroke={T.teal} strokeWidth={5} strokeDasharray="4 14" strokeLinecap="round" />
      </g>
      <g stroke={T.teal} strokeWidth={9} strokeLinecap="round" fill="none">
        <path d="M1076 628 l18 20 l38 -42" />
      </g>
    </ThumbFrame>
  );
};

export const ThumbEM002: React.FC = () => (
  <ThumbFrame lines={["A TINY HOLE", "IN THE", "WINDOW"]}>
    <g transform="translate(930 400)">
      <ellipse rx={135} ry={195} fill="#fff" stroke={T.ink} strokeWidth={8} />
      <ellipse rx={105} ry={165} fill={T.pane} stroke={T.ink} strokeWidth={5} />
      <circle cx={0} cy={105} r={11} fill="none" stroke={T.orange} strokeWidth={5} />
      <circle cx={0} cy={105} r={3.5} fill={T.ink} />
      <line x1={9} y1={113} x2={110} y2={190} stroke={T.orange} strokeWidth={4} strokeDasharray="2 9" strokeLinecap="round" />
    </g>
    <g transform="translate(1135 540)">
      <circle r={105} fill="#fff" stroke={T.orange} strokeWidth={8} />
      <rect x={-85} y={-18} width={170} height={36} rx={4} fill={T.pane} stroke={T.ink} strokeWidth={4} />
      <circle r={27} fill="#fff" stroke={T.ink} strokeWidth={5} />
      <circle r={9} fill={T.ink} />
    </g>
  </ThumbFrame>
);

const BARS = [3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2];

export const ThumbEM003: React.FC = () => {
  let x = 0;
  const bars = BARS.map((w, i) => {
    const r = i % 2 === 0 ? <rect key={i} x={x * 6} y={0} width={w * 6} height={i === 0 || i === BARS.length - 1 ? 245 : 215} fill={T.ink} /> : null;
    x += w;
    return r;
  });
  return (
    <ThumbFrame lines={["BARCODES", "ON", "EVERYTHING"]}>
      <g transform="translate(780 150)">
        <rect x={-30} y={-30} width={x * 6 + 60} height={340} rx={14} fill="#fff" stroke={T.ink} strokeWidth={7} />
        {bars}
        <text x={(x * 6) / 2} y={278} textAnchor="middle" fontFamily={T.font} fontWeight={700} fontSize={30} letterSpacing={9} fill={T.ink}>
          1 23456 78905
        </text>
      </g>
      <g transform="translate(1085 560) rotate(-9)">
        <rect x={-120} y={-62} width={240} height={124} rx={12} fill="#8FD0CD" stroke={T.ink} strokeWidth={7} />
        <polygon points="-120,-20 -30,-62 20,-62 -120,24" fill="#fff" opacity={0.5} />
        <text x={-40} y={4} textAnchor="middle" dominantBaseline="central" fontFamily={T.serif} fontWeight={700} fontSize={46} letterSpacing={3} fill={T.ink}>
          GUM
        </text>
        <rect x={30} y={-34} width={76} height={68} rx={4} fill="#fff" stroke={T.orange} strokeWidth={5} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={40 + i * 10} y={-24} width={i % 2 ? 4 : 7} height={48} fill={T.ink} />
        ))}
      </g>
    </ThumbFrame>
  );
};

export const ThumbEM004: React.FC = () => (
  <ThumbFrame lines={["MOVIE", "POPCORN", "PRICES"]}>
    <g transform="translate(955 460) scale(1.75)">
      <path d="M-90 -70 L90 -70 L72 100 L-72 100 Z" fill="#fff" />
      {[
        [-90, -54],
        [-18, 18],
        [54, 90],
      ].map(([a, b]) => (
        <polygon key={a} points={`${a},-70 ${b},-70 ${b * 0.8},100 ${a * 0.8},100`} fill={T.orange} opacity={0.88} />
      ))}
      <path d="M-90 -70 L90 -70 L72 100 L-72 100 Z" fill="none" stroke={T.ink} strokeWidth={5} strokeLinejoin="round" />
      {[
        [-60, -78, 30],
        [-25, -98, 34],
        [15, -100, 36],
        [55, -82, 32],
        [-5, -70, 28],
        [35, -68, 26],
        [-80, -62, 22],
        [80, -62, 22],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#FFF3C9" stroke={T.ink} strokeWidth={4} />
      ))}
    </g>
    <g transform="translate(1150 290) rotate(12)">
      <path d="M-70 -34 H46 L80 0 L46 34 H-70 Z" fill="#fff" stroke={T.orange} strokeWidth={7} strokeLinejoin="round" />
      <circle cx={50} cy={0} r={7} fill={T.orange} />
      <text x={-12} y={2} textAnchor="middle" dominantBaseline="central" fontFamily={T.font} fontWeight={800} fontSize={44} fill={T.ink}>
        $$$
      </text>
    </g>
  </ThumbFrame>
);

export const ThumbEM005: React.FC = () => (
  <ThumbFrame lines={["RED MEANS", "STOP"]}>
    <g transform="translate(955 560) scale(1.9)">
      <rect x={-9} y={0} width={18} height={80} fill={T.ink} />
      <rect x={-52} y={-190} width={104} height={200} rx={16} fill={T.ink} />
      <circle cx={0} cy={-140} r={58} fill="#D64545" opacity={0.3} />
      <circle cx={0} cy={-140} r={28} fill="#D64545" />
      <circle cx={0} cy={-80} r={28} fill="#3B4A6B" />
      <circle cx={0} cy={-20} r={28} fill="#3B4A6B" />
    </g>
    <g transform="translate(1110 230) scale(0.85)">
      <polygon points="0,-110 30,-44 100,-76 58,-14 118,28 44,36 66,106 0,58 -66,106 -44,36 -118,28 -58,-14 -100,-76 -30,-44" fill="#FFE69A" stroke={T.orange} strokeWidth={8} strokeLinejoin="round" />
    </g>
  </ThumbFrame>
);

export const ThumbEM006: React.FC = () => (
  <ThumbFrame lines={["THE WORD OK"]}>
    <g transform="translate(1010 370) rotate(-6) scale(0.85)">
      <rect x={-250} y={-290} width={500} height={580} fill="#FFFDF4" stroke={T.ink} strokeWidth={7} />
      <text x={0} y={-228} textAnchor="middle" fontFamily={T.serif} fontWeight={700} fontSize={50} letterSpacing={4} fill={T.ink}>
        NEWS
      </text>
      <rect x={-220} y={-196} width={440} height={7} fill={T.ink} />
      {Array.from({ length: 11 }, (_, i) => (
        <rect key={i} x={-220} y={-166 + i * 42} width={i % 4 === 3 ? 240 : 440} height={13} rx={6} fill="#9AA4B2" opacity={0.5} />
      ))}
    </g>
    <text x={1010} y={420} textAnchor="middle" fontFamily={T.font} fontWeight={900} fontSize={215} fill={T.ink} stroke="#FFFDF4" strokeWidth={14} paintOrder="stroke">
      OK
    </text>
  </ThumbFrame>
);

export const ThumbEM007: React.FC = () => (
  <ThumbFrame lines={["PRICES", "ENDING", "IN NINE"]}>
    <g transform="translate(940 480) rotate(-8) scale(0.8)">
      <path d="M-330 -170 H250 L370 0 L250 170 H-330 Z" fill="#FFFDF4" stroke={T.ink} strokeWidth={9} strokeLinejoin="round" />
      <circle cx={300} cy={0} r={22} fill={T.bg} stroke={T.ink} strokeWidth={8} />
      <text x={-40} y={10} textAnchor="middle" dominantBaseline="central" fontFamily={T.font} fontWeight={900} fontSize={200} fill={T.ink}>
        $2
        <tspan fill={T.orange}>.99</tspan>
      </text>
    </g>
  </ThumbFrame>
);

export const ThumbEM008: React.FC = () => (
  <ThumbFrame lines={["THE MARATHON", "NUMBER"]}>
    <rect x={799} y={420} width={22} height={220} fill={T.ink} />
    <rect x={1199} y={420} width={22} height={220} fill={T.ink} />
    <line x1={770} y1={640} x2={1250} y2={640} stroke={T.ink} strokeWidth={6} />
    <path d="M821 490 Q1010 520 1199 490" fill="none" stroke={T.orange} strokeWidth={38} />
    <text x={1010} y={340} textAnchor="middle" dominantBaseline="central" fontFamily={T.serif} fontWeight={800} fontSize={210} fill={T.ink} stroke="#FFFDF4" strokeWidth={12} paintOrder="stroke">
      26<tspan fill={T.orange}>.2</tspan>
    </text>
    <text x={1010} y={598} textAnchor="middle" fontFamily={T.font} fontWeight={800} fontSize={50} letterSpacing={16} fill={T.teal}>
      MILES
    </text>
  </ThumbFrame>
);

const ThumbLabel: React.FC<{ x: number; y: number; rot: number; text: string; color: string }> = ({ x, y, rot, text, color }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-210} y={-84} width={420} height={168} rx={20} fill="#fff" stroke={color} strokeWidth={10} />
    <text x={0} y={-24} textAnchor="middle" dominantBaseline="central" fontFamily={T.font} fontWeight={800} fontSize={56} letterSpacing={3} fill={color}>
      {text}
    </text>
    <text x={0} y={38} textAnchor="middle" dominantBaseline="central" fontFamily={T.font} fontWeight={800} fontSize={62} fill={T.ink}>
      00/00
    </text>
  </g>
);

export const ThumbEM009: React.FC = () => (
  <ThumbFrame lines={["FOOD", "TWO DATES"]}>
    <ThumbLabel x={990} y={305} rot={-4} text="BEST BEFORE" color={T.ink} />
    <ThumbLabel x={930} y={525} rot={3} text="USE BY" color={T.teal} />
    <g transform="translate(1150 200) scale(0.7)">
      <path d="M-70 -150 H70 L55 0 H-55 Z" fill="#fff" stroke={T.ink} strokeWidth={6} strokeLinejoin="round" />
      <rect x={-78} y={-170} width={156} height={26} rx={8} fill={T.teal} stroke={T.ink} strokeWidth={5} />
    </g>
    <g transform="translate(1140 700) scale(0.55)">
      <rect x={-120} y={-70} width={240} height={70} rx={12} fill="#EBDDBB" stroke={T.ink} strokeWidth={6} />
      <ellipse cx={0} cy={-84} rx={84} ry={42} fill="#FBE3CF" stroke={T.ink} strokeWidth={6} />
    </g>
  </ThumbFrame>
);

export const ThumbEM010: React.FC = () => (
  <ThumbFrame lines={["JEANS", "TINY POCKET"]}>
    <rect x={720} y={90} width={500} height={90} rx={8} fill="#5E84B8" stroke={T.ink} strokeWidth={7} />
    <path d="M720 180 H1220 V600 Q1220 640 1180 640 H760 Q720 640 720 600 Z" fill="#7FA3CF" stroke={T.ink} strokeWidth={7} strokeLinejoin="round" />
    <path d="M880 180 Q900 470 1220 420" fill="none" stroke={T.ink} strokeWidth={6} strokeDasharray="16 11" />
    <rect x={1010} y={210} width={160} height={140} rx={10} fill="#FFD2A8" stroke={T.orange} strokeWidth={10} />
    <rect x={1022} y={222} width={136} height={116} rx={6} fill="none" stroke={T.orange} strokeWidth={3} strokeDasharray="9 7" />
  </ThumbFrame>
);

const ThumbBill: React.FC<{ x: number; y: number; rot: number; fill: string; bridge?: boolean }> = ({ x, y, rot, fill, bridge }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-250} y={-130} width={500} height={260} rx={14} fill={fill} stroke={T.ink} strokeWidth={8} />
    <rect x={-226} y={-106} width={452} height={212} rx={8} fill="none" stroke={T.ink} strokeWidth={3} strokeDasharray="10 8" opacity={0.4} />
    {bridge ? (
      <g fill="none" stroke={T.teal} strokeWidth={10} strokeLinecap="round">
        <line x1={-170} y1={30} x2={170} y2={30} />
        {[-100, 0, 100].map((cx) => (
          <path key={cx} d={`M${cx - 45} 30 V92 A45 45 0 0 1 ${cx + 45} 92 V30`} />
        ))}
      </g>
    ) : (
      <g fill="#fff" stroke={T.ink} strokeWidth={6}>
        <path d="M-170 70 V-30 Q-170 -70 -130 -70 Q-90 -70 -90 -30 V70 Z" />
        <rect x={-50} y={-20} width={80} height={90} />
      </g>
    )}
  </g>
);

export const ThumbEM011: React.FC = () => (
  <ThumbFrame lines={["EURO NOTES", "FAKE BRIDGES"]}>
    <ThumbBill x={930} y={210} rot={-7} fill="#D6E3F3" />
    <ThumbBill x={980} y={470} rot={5} fill="#F6E4C8" bridge />
    <g transform="translate(1060 470) rotate(-8)">
      <rect x={-130} y={-48} width={260} height={96} rx={14} fill={T.bg} fillOpacity={0.9} stroke="#D64545" strokeWidth={8} />
      <text x={0} y={4} textAnchor="middle" dominantBaseline="central" fontFamily={T.font} fontWeight={800} fontSize={62} letterSpacing={4} fill="#D64545">
        FAKE?
      </text>
    </g>
  </ThumbFrame>
);

export const ThumbEM012: React.FC = () => (
  <ThumbFrame lines={["CARTS NOBODY", "WANTED"]}>
    <g transform="translate(1010 440) scale(1.7)">
      <path d="M-150 -170 H-110 L-80 -30 H110 L150 -130 H-96" fill="none" stroke={T.ink} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M-96 -130 L-80 -30 H110 L150 -130 Z" fill="#fff" fillOpacity={0.6} />
      {[-90, -50, -10, 30, 70, 110].map((gx) => (
        <line key={gx} x1={gx} y1={-130} x2={gx + 8} y2={-32} stroke={T.ink} strokeWidth={4} />
      ))}
      <line x1={-80} y1={-30} x2={-70} y2={20} stroke={T.ink} strokeWidth={8} />
      <line x1={100} y1={-30} x2={90} y2={20} stroke={T.ink} strokeWidth={8} />
      {[-70, 90].map((wx) => (
        <circle key={wx} cx={wx} cy={36} r={20} fill={T.teal} stroke={T.ink} strokeWidth={6} />
      ))}
    </g>
    <g transform="translate(1045 300) rotate(-7)">
      <rect x={-215} y={-52} width={430} height={104} rx={16} fill={T.bg} fillOpacity={0.92} stroke="#D64545" strokeWidth={9} />
      <text x={0} y={4} textAnchor="middle" dominantBaseline="central" fontFamily={T.font} fontWeight={800} fontSize={56} letterSpacing={3} fill="#D64545">
        NO, THANKS
      </text>
    </g>
  </ThumbFrame>
);

export const ThumbEM013: React.FC = () => (
  <ThumbFrame lines={["FEBRUARY'S", "MISSING DAY"]}>
    <g transform="translate(790 600)">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <rect x={i * 76} y={i === 2 ? -250 : -330} width={64} height={i === 2 ? 250 : 330} fill={i === 2 ? "#F8D3B0" : "#CFE6E6"} stroke={i === 2 ? T.orange : T.ink} strokeWidth={i === 2 ? 7 : 5} />
        </g>
      ))}
      <line x1={-20} y1={0} x2={470} y2={0} stroke={T.ink} strokeWidth={6} />
      <text x={2 * 76 + 32} y={-290} textAnchor="middle" dominantBaseline="central" fontFamily={T.font} fontWeight={800} fontSize={64} fill={T.orange}>
        28
      </text>
    </g>
    <g transform="translate(1030 195) rotate(-8)">
      <rect x={-150} y={-52} width={300} height={104} rx={16} fill={T.bg} fillOpacity={0.92} stroke="#D64545" strokeWidth={9} />
      <text x={0} y={4} textAnchor="middle" dominantBaseline="central" fontFamily={T.font} fontWeight={800} fontSize={64} letterSpacing={3} fill="#D64545">
        MYTH?
      </text>
    </g>
  </ThumbFrame>
);

export const ThumbEM014: React.FC = () => (
  <ThumbFrame lines={["THE PEN CAP'S", "TINY HOLE"]}>
    <g transform="translate(1000 640)">
      <rect x={-130} y={-440} width={260} height={440} rx={44} fill={T.teal} stroke={T.ink} strokeWidth={12} />
      <rect x={-92} y={-476} width={184} height={36} rx={14} fill={T.ink} />
      <circle cx={0} cy={-300} r={22} fill={T.ink} />
      <circle cx={0} cy={-300} r={64} fill="none" stroke={T.orange} strokeWidth={14} />
    </g>
  </ThumbFrame>
);

export const ThumbEM015: React.FC = () => (
  <ThumbFrame lines={["EXIT DOORS", "OPEN OUTWARD"]}>
    <g transform="translate(920 640) scale(0.88)">
      <rect x={-150} y={-430} width={300} height={430} rx={10} fill="#E4E7EC" stroke={T.ink} strokeWidth={12} />
      <rect x={-110} y={-390} width={220} height={350} rx={6} fill="none" stroke={T.ink} strokeWidth={6} />
      <rect x={-130} y={-210} width={260} height={48} rx={22} fill={T.orange} stroke={T.ink} strokeWidth={8} />
      <path d="M180 -190 H330 M270 -250 L340 -190 L270 -130" fill="none" stroke={T.orange} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </ThumbFrame>
);

export const ThumbEM016: React.FC = () => (
  <ThumbFrame lines={["THE STICKY NOTE'S", "FAILED GLUE"]}>
    <g transform="translate(1010 410) rotate(-5) scale(0.95)">
      <rect x={-210} y={-210} width={420} height={420} fill="#F2DB6B" stroke={T.ink} strokeWidth={12} />
      <path d="M210 90 L90 210 L210 210 Z" fill="#D6BF4A" stroke={T.ink} strokeWidth={9} strokeLinejoin="round" />
      {[-110, -40, 30].map((ly) => (
        <line key={ly} x1={-140} y1={ly} x2={ly === 30 ? 20 : 140} y2={ly} stroke="#D6BF4A" strokeWidth={14} strokeLinecap="round" />
      ))}
    </g>
  </ThumbFrame>
);

export const ThumbEM017: React.FC = () => (
  <ThumbFrame lines={["THE HALLWAY LIGHT'S", "HIDDEN TIMER"]}>
    <g transform="translate(1010 0)">
      <circle cx={0} cy={250} r={230} fill="#D9A441" fillOpacity={0.3} />
      <line x1={0} y1={0} x2={0} y2={110} stroke={T.ink} strokeWidth={10} />
      <path d="M-120 250 Q-120 110 0 110 Q120 110 120 250 Z" fill="#D9A441" stroke={T.ink} strokeWidth={12} />
      <rect x={-90} y={400} width={180} height={250} rx={18} fill="#fff" stroke={T.ink} strokeWidth={12} />
      <circle cx={0} cy={525} r={46} fill={T.teal} stroke={T.ink} strokeWidth={9} />
      <circle cx={0} cy={525} r={96} fill="none" stroke={T.orange} strokeWidth={14} strokeDasharray="60 36" strokeLinecap="round" />
    </g>
  </ThumbFrame>
);

export const ThumbEM018: React.FC = () => (
  <ThumbFrame lines={["THE GAS METER'S", "HIDDEN COUNT"]}>
    <g transform="translate(990 50) scale(0.9)">
      {[-90, 90].map((px) => (
        <rect key={px} x={px - 26} y={90} width={52} height={110} fill="#fff" stroke={T.ink} strokeWidth={12} />
      ))}
      <rect x={-250} y={190} width={500} height={400} rx={34} fill="#fff" stroke={T.ink} strokeWidth={14} />
      <rect x={-200} y={240} width={400} height={120} rx={14} fill="#EAF3F3" stroke={T.ink} strokeWidth={8} />
      {[-150, -75, 0, 75, 150].map((dx, i) => (
        <text key={dx} x={dx} y={335} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontWeight={800} fontSize={96} fill={T.ink}>
          {[0, 4, 2, 7, 1][i]}
        </text>
      ))}
      <circle cx={0} cy={480} r={56} fill="#F7F3EA" stroke={T.ink} strokeWidth={10} />
      <line x1={0} y1={480} x2={30} y2={440} stroke={T.orange} strokeWidth={10} strokeLinecap="round" />
      <circle cx={0} cy={480} r={110} fill="none" stroke={T.orange} strokeWidth={14} strokeDasharray="60 36" strokeLinecap="round" />
    </g>
  </ThumbFrame>
);

export const ThumbEM019: React.FC = () => (
  <ThumbFrame lines={["HOW DID YOUR CALL", "FIND ITS WAY?"]}>
    <g transform="translate(1000 20)">
      <rect x={-250} y={60} width={500} height={560} rx={26} fill="#E9DFC8" stroke={T.ink} strokeWidth={14} />
      {[
        [-165, 170],
        [-55, 170],
        [55, 170],
        [165, 170],
        [-165, 300],
        [-55, 300],
        [55, 300],
        [165, 300],
        [-165, 430],
        [-55, 430],
        [55, 430],
        [165, 430],
      ].map(([jx, jy]) => (
        <g key={`${jx}-${jy}`}>
          <circle cx={jx} cy={jy - 42} r={12} fill={jx === -55 && jy === 300 ? "#D9A441" : "#fff"} stroke={T.ink} strokeWidth={6} />
          <circle cx={jx} cy={jy} r={26} fill="#fff" stroke={T.ink} strokeWidth={10} />
          <circle cx={jx} cy={jy} r={9} fill={T.ink} />
        </g>
      ))}
      <path d="M-165 300 Q-165 560 -55 560 Q55 560 55 430" fill="none" stroke={T.teal} strokeWidth={16} strokeLinecap="round" />
      <path d="M55 430 L55 430" stroke={T.orange} strokeWidth={16} />
      {[
        [-165, 300],
        [55, 430],
      ].map(([px, py]) => (
        <rect key={px} x={px - 14} y={py - 22} width={28} height={64} rx={9} fill="#fff" stroke={T.ink} strokeWidth={9} />
      ))}
      <circle cx={-165} cy={300} r={60} fill="none" stroke={T.orange} strokeWidth={12} strokeDasharray="50 30" strokeLinecap="round" />
    </g>
  </ThumbFrame>
);

export const ThumbEM020: React.FC = () => (
  <ThumbFrame lines={["WHY CAN INSECTS", "WALK ON WATER?"]}>
    <g transform="translate(1000 280) scale(1.25)">
      <path d="M-220 56 H-190 Q-158 56 -150 76 Q-142 56 -110 56 H-50 Q-18 56 -10 76 Q-2 56 30 56 H110 Q142 56 150 76 Q158 56 190 56 H220 V250 H-220 Z" fill={T.teal} fillOpacity={0.18} />
      <path
        d="M-220 56 H-190 Q-158 56 -150 76 Q-142 56 -110 56 H-50 Q-18 56 -10 76 Q-2 56 30 56 H110 Q142 56 150 76 Q158 56 190 56 H220"
        fill="none"
        stroke={T.teal}
        strokeWidth={6}
        strokeLinecap="round"
      />
      {["M35 6 L100 -20 L150 74", "M5 8 L-30 -28 L-10 74", "M-35 6 L-110 -20 L-150 74"].map((d) => (
        <path key={d} d={d} fill="none" stroke={T.ink} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      <ellipse rx={70} ry={16} fill={T.ink} />
      <circle cx={78} cy={-4} r={11} fill={T.ink} />
      <path d="M86 -12 L106 -28" stroke={T.ink} strokeWidth={5} strokeLinecap="round" />
      <circle cx={150} cy={76} r={34} fill="none" stroke={T.orange} strokeWidth={7} strokeDasharray="22 12" strokeLinecap="round" />
    </g>
  </ThumbFrame>
);

export const ThumbEM021: React.FC = () => (
  <ThumbFrame lines={["THUNDER ARRIVES", "AFTER THE FLASH"]}>
    <g transform="translate(990 330)">
      {[110, 190, 270].map((r) => (
        <circle key={r} cx={0} cy={80} r={r} fill="none" stroke={T.teal} strokeWidth={7} strokeDasharray="26 16" strokeLinecap="round" opacity={1 - r / 400} />
      ))}
      <g>
        <ellipse cx={0} cy={-150} rx={190} ry={56} fill="#9AA6B5" />
        <ellipse cx={-80} cy={-182} rx={100} ry={50} fill="#9AA6B5" />
        <ellipse cx={60} cy={-190} rx={110} ry={54} fill="#8D99AA" />
      </g>
      <path d="M10 -110 L-40 20 L20 20 L-50 150" fill="none" stroke={T.orange} strokeWidth={26} strokeLinejoin="round" strokeLinecap="round" />
      <path d="M10 -110 L-40 20 L20 20 L-50 150" fill="none" stroke="#fff" strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" />
    </g>
  </ThumbFrame>
);

export const ThumbEM022: React.FC = () => (
  <ThumbFrame lines={["THIS EXACT", "PAPER SHAPE"]}>
    <g transform="translate(960 330)">
      <rect x={-150} y={-210} width={300} height={424} fill="#fff" stroke={T.ink} strokeWidth={8} />
      <rect x={-150} y={2} width={300} height={212} fill="none" stroke={T.teal} strokeWidth={7} />
      <rect x={-150} y={108} width={212} height={106} fill="none" stroke={T.teal} strokeWidth={6} opacity={0.7} />
      <line x1={-190} y1={2} x2={190} y2={2} stroke={T.orange} strokeWidth={9} strokeDasharray="26 14" strokeLinecap="round" />
      <text y={-60} textAnchor="middle" fontFamily={T.serif} fontWeight={700} fontSize={110} fill={T.orange}>
        {"√2"}
      </text>
    </g>
  </ThumbFrame>
);

/** Maqueta de la pagina del canal en YouTube (escritorio, tema claro). */
const BW = 1680;
const BH = Math.round((BW * 423) / 2560);
const GW = 544;
const GH = Math.round((GW * 9) / 16);
const Dur: React.FC<{ t: string }> = ({ t }) => (
  <div style={{ position: "absolute", right: 8, bottom: 8, background: "rgba(0,0,0,0.85)", color: "#fff", fontSize: 14, fontWeight: 600, padding: "2px 6px", borderRadius: 4 }}>{t}</div>
);
const Card: React.FC<{ title: string; meta: string; children: React.ReactNode }> = ({ title, meta, children }) => (
  <div style={{ width: GW }}>
    <div style={{ position: "relative", width: GW, height: GH, borderRadius: 12, overflow: "hidden", background: "#E9E9E9" }}>{children}</div>
    <div style={{ fontSize: 18, fontWeight: 600, color: "#0F0F0F", marginTop: 12, lineHeight: 1.3 }}>{title}</div>
    <div style={{ fontSize: 14, color: "#606060", marginTop: 4 }}>{meta}</div>
  </div>
);
const Scaled: React.FC<{ w: number; h: number; k: number; children: React.ReactNode }> = ({ w, h, k, children }) => (
  <div style={{ width: w * k, height: h * k, position: "relative", overflow: "hidden" }}>
    <div style={{ width: w, height: h, transform: `scale(${k})`, transformOrigin: "0 0", position: "absolute", left: 0, top: 0 }}>{children}</div>
  </div>
);

export const ChannelMockup: React.FC = () => {
  const k = BW / 2560;
  const chip = (t: string, on: boolean) => (
    <div key={t} style={{ padding: "8px 14px", borderRadius: 8, fontSize: 14, fontWeight: 500, background: on ? "#0F0F0F" : "#F2F2F2", color: on ? "#fff" : "#0F0F0F" }}>
      {t}
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#fff", fontFamily: '"Segoe UI", Roboto, Arial, sans-serif', alignItems: "center" }}>
      <div style={{ width: BW, marginTop: 28 }}>
        <div style={{ width: BW, height: BH, borderRadius: 18, overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: -508 * k }}>
            <Scaled w={2560} h={1440} k={k}>
              <ChannelBanner />
            </Scaled>
          </div>
        </div>
        <div style={{ display: "flex", gap: 32, marginTop: 24, alignItems: "center" }}>
          <div style={{ width: 160, height: 160, borderRadius: 80, overflow: "hidden", flex: "none" }}>
            <Scaled w={800} h={800} k={0.2}>
              <ChannelAvatar />
            </Scaled>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: "#0F0F0F" }}>The Everyday Mystery</div>
            <div style={{ fontSize: 14, color: "#606060", marginTop: 6 }}>@TheEverydayMystery · 0 suscriptores · 2 vídeos</div>
            <div style={{ fontSize: 14, color: "#606060", marginTop: 6 }}>Why does that everyday thing work the way it does? The answer is usually hidden engineering.</div>
            <div style={{ display: "inline-block", marginTop: 14, background: "#0F0F0F", color: "#fff", fontSize: 14, fontWeight: 600, padding: "10px 16px", borderRadius: 20 }}>Suscribirse</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 32, marginTop: 24, borderBottom: "1px solid #E5E5E5", fontSize: 15, fontWeight: 600, color: "#606060" }}>
          <div style={{ padding: "12px 0", color: "#0F0F0F", borderBottom: "2px solid #0F0F0F" }}>Vídeos</div>
          <div style={{ padding: "12px 0" }}>Publicaciones</div>
        </div>
        <div style={{ display: "flex", gap: 10, margin: "16px 0 20px" }}>{[chip("Más recientes", true), chip("Populares", false), chip("Más antiguos", false)]}</div>
        <div style={{ display: "flex", gap: 24 }}>
          <Card title="Why Are Airplane Windows Round?" meta="0 visualizaciones · hace 1 día">
            <Scaled w={1280} h={720} k={GW / 1280}>
              <ThumbEM001 />
            </Scaled>
            <Dur t="3:31" />
          </Card>
          <Card title="Why Do Airplane Windows Have a Tiny Hole?" meta="0 visualizaciones · hace 1 día">
            <Scaled w={1280} h={720} k={GW / 1280}>
              <ThumbEM002 />
            </Scaled>
            <Dur t="2:51" />
          </Card>
          <Card title="Próximamente" meta="EM-003 · hueco reservado">
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#8A8A8A", fontSize: 26, fontWeight: 600, letterSpacing: 4 }}>
              PRÓXIMAMENTE
            </div>
          </Card>
        </div>
        <div style={{ marginTop: 14, fontSize: 12, color: "#9A9A9A", textAlign: "right" }}>MAQUETA ilustrativa, no es la página real</div>
      </div>
    </AbsoluteFill>
  );
};
