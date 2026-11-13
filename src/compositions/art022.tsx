// EM-022: dibujo propio (sin personas, sin IA) que sustituye a la foto em022-un-docs. Se exporta a PNG 2048x2048 con
// `npx remotion still src/index-channel.tsx Art-EM022-docs public/illustrations/em022-un-docs2.png`.
import React from "react";

const INK = "#14213D", TEAL = "#0A8F8D", PAPER = "#FBFAF5", BAR = "#A9B0BA";
const W = 525, H = 742; // A4 (210 x 297) a escala 2,5

const Sheet: React.FC<{ x: number; y: number; rot: number; band?: boolean; lines?: number; children?: React.ReactNode }> = ({ x, y, rot, band, lines = 0, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-W / 2 + 10} y={-H / 2 + 16} width={W} height={H} fill="#000" opacity={0.35} filter="url(#a22-sh)" />
    <rect x={-W / 2} y={-H / 2} width={W} height={H} fill={PAPER} stroke="#D8D4C8" strokeWidth={2} />
    {band ? <rect x={-W / 2 + 50} y={-H / 2 + 56} width={W - 100} height={46} fill={TEAL} /> : null}
    {Array.from({ length: lines }, (_, i) => (
      <rect key={i} x={-W / 2 + 50} y={-H / 2 + 150 + i * 44} width={(W - 100) * (i % 4 === 3 ? 0.6 : 1)} height={12} rx={6} fill={BAR} />
    ))}
    {children}
  </g>
);

export const Art022Docs: React.FC = () => (
  <svg viewBox="0 0 2048 2048" width={2048} height={2048}>
    <defs>
      <linearGradient id="a22-wood" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#7A4B2A" />
        <stop offset="1" stopColor="#4A2A16" />
      </linearGradient>
      <radialGradient id="a22-vig" cx="0.5" cy="0.5" r="0.75">
        <stop offset="0.55" stopColor="#000" stopOpacity={0} />
        <stop offset="1" stopColor="#000" stopOpacity={0.55} />
      </radialGradient>
      <filter id="a22-sh" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="14" />
      </filter>
    </defs>
    <rect width={2048} height={2048} fill="url(#a22-wood)" />
    {Array.from({ length: 46 }, (_, i) => {
      const y = 20 + i * 45 + ((i * 37) % 23);
      return <path key={i} d={`M0 ${y} C 500 ${y + ((i * 13) % 30) - 15}, 1500 ${y - ((i * 7) % 26) + 13}, 2048 ${y + ((i * 5) % 18) - 9}`} stroke={i % 3 ? "#2E1A0D" : "#9A6A42"} strokeWidth={i % 4 ? 3 : 6} opacity={0.28} fill="none" />;
    })}
    <Sheet x={700} y={1030} rot={-7} lines={11} />
    <Sheet x={1300} y={1050} rot={9} />
    <Sheet x={1345} y={1020} rot={2} />
    <Sheet x={1330} y={1010} rot={5} band lines={9}>
      <circle cx={130} cy={230} r={62} fill="none" stroke="#B3261E" strokeWidth={9} opacity={0.75} />
      <circle cx={130} cy={230} r={42} fill="none" stroke="#B3261E" strokeWidth={4} opacity={0.75} />
      <path d="M-262 -300 v-90 a22 22 0 0 1 44 0 v120 a13 13 0 0 1 -26 0 v-100" fill="none" stroke="#8C939C" strokeWidth={7} strokeLinecap="round" />
    </Sheet>
    <g transform="translate(1010 1490) rotate(-14)">
      <rect x={-250} y={-6} width={500} height={34} rx={17} fill="#000" opacity={0.35} filter="url(#a22-sh)" />
      <rect x={-250} y={-17} width={400} height={34} rx={17} fill={INK} />
      <rect x={90} y={-17} width={22} height={34} fill="#C9A227" />
      <path d="M150 -15 L250 0 L150 15 Z" fill="#C9A227" />
      <path d="M190 0 L250 0" stroke={INK} strokeWidth={3} />
    </g>
    <rect width={2048} height={2048} fill="url(#a22-vig)" />
  </svg>
);
