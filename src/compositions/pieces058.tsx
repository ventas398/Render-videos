// EM-058 Tunguska 1908: piezas propias (paso 2 del P1 de 09/11 14:33). Sin voz todavia: cada pieza recibe su progreso p (0..1)
// y la escena la anima cuando exista EM-058.timing. Fondo de taiga oscura (nunca crema). Rotulo "Simplified illustration".
// Datos solo de docs/EM-058-GUION.md: Vanavara ~60 km al sur del epicentro, cristales rotos a ~200 km, mariposa ~2,150 km2,
// franja 5-14 km (DISPUTED), roce 2020 a ~10-15 km (DISPUTED), fechas 1908-1921-1927-1938-1975-2013-2020.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../themes/brand";

const BG = "#0B1712";
const CARD = "#FFFDF6";
const TEAL = "#2EC4B6";
const ORANGE = "#F28C28";
const GREY = "#6F7F78";
const cl = (x: number) => Math.max(0, Math.min(1, x));
const seg = (p: number, a: number, b: number) => cl((p - a) / (b - a));

const T: React.FC<{ x: number; y: number; s?: number; c?: string; a?: "start" | "middle" | "end"; w?: number; children: React.ReactNode }> = ({ x, y, s = 40, c = CARD, a = "middle", w = 700, children }) => (
  <text x={x} y={y} textAnchor={a} dominantBaseline="central" fontFamily={theme.font} fontWeight={w} fontSize={s} fill={c} paintOrder="stroke" stroke={BG} strokeWidth={s / 6}>
    {children}
  </text>
);

/** Fondo de taiga oscura: degradado + copas de abeto esquematicas (sin personas). */
export const Taiga: React.FC = () => (
  <>
    <defs>
      <radialGradient id="tg058" cx="50%" cy="45%" r="75%">
        <stop offset="0%" stopColor="#173126" />
        <stop offset="100%" stopColor={BG} />
      </radialGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#tg058)" />
    {Array.from({ length: 34 }, (_, i) => {
      const x = (i * 57 + (i % 3) * 19) % 1920;
      const h = 70 + ((i * 37) % 60);
      return <path key={i} d={`M${x} 1080 L${x + 22} ${1080 - h} L${x + 44} 1080 Z`} fill="#0F241B" />;
    })}
  </>
);

const Label: React.FC = () => (
  <g>
    <rect x={1340} y={1000} width={540} height={44} rx={22} fill={BG} opacity={0.85} />
    <T x={1856} y={1022} s={26} a="end">Simplified illustration, not to scale</T>
  </g>
);

/** Mapa propio: rio Podkamennaya Tunguska, Vanavara, epicentro ~60 km al norte y circulo de ~200 km.
 *  p: 0-0.3 rio y Vanavara, 0.3-0.5 epicentro, 0.5-0.75 onda (sin hongo), 0.75-1 circulo 200 km. grey = zona sin caminos (parte 15). */
export const MapTunguska: React.FC<{ p: number; grey?: boolean }> = ({ p, grey }) => {
  const K = 2; // px por km
  const E = { x: 960, y: 470 };
  const V = { x: E.x + 30, y: E.y + 60 * K };
  const river = `M120 760 C 420 700, 640 690, 820 640 S ${V.x + 40} ${V.y + 30}, 1180 600 S 1560 520, 1800 560`;
  const r = seg(p, 0, 0.3);
  const ep = seg(p, 0.3, 0.5);
  const wave = seg(p, 0.5, 0.75);
  const ring = seg(p, 0.75, 1);
  return (
    <>
      <Taiga />
      {grey ? <rect width={1920} height={1080} fill={GREY} opacity={0.35} /> : null}
      <path d={river} fill="none" stroke="#3E7CA6" strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - r} />
      <g opacity={r}>
        <T x={300} y={800} s={34} c="#9CC3DD" w={600}>Podkamennaya Tunguska river</T>
        <circle cx={V.x} cy={V.y} r={12} fill={CARD} />
        <T x={V.x + 28} y={V.y + 4} s={40} a="start">Vanavara</T>
      </g>
      <g opacity={ep}>
        <line x1={V.x} y1={V.y - 18} x2={E.x + 4} y2={E.y + 26} stroke={CARD} strokeWidth={3} strokeDasharray="10 10" />
        <T x={(V.x + E.x) / 2 - 24} y={(V.y + E.y) / 2} s={32} a="end" w={600}>~60 km</T>
        <path d={`M${E.x - 18} ${E.y - 18} L${E.x + 18} ${E.y + 18} M${E.x + 18} ${E.y - 18} L${E.x - 18} ${E.y + 18}`} stroke={ORANGE} strokeWidth={8} strokeLinecap="round" />
        <T x={E.x} y={E.y - 52} s={40} c={ORANGE}>Epicenter</T>
      </g>
      {wave > 0 && wave < 1
        ? [0, 0.33, 0.66].map((d) => {
            const k = cl(wave * 1.5 - d);
            return k > 0 ? <circle key={d} cx={E.x} cy={E.y} r={20 + k * 380} fill="none" stroke={CARD} strokeWidth={6} opacity={(1 - k) * 0.8} /> : null;
          })
        : null}
      <g opacity={ring}>
        <circle cx={E.x} cy={E.y} r={200 * K} fill="none" stroke={TEAL} strokeWidth={6} strokeDasharray="22 14" pathLength={1} />
        <line x1={E.x} y1={E.y} x2={E.x + 200 * K} y2={E.y} stroke={TEAL} strokeWidth={3} />
        <T x={E.x + 100 * K} y={E.y - 30} s={36} c={TEAL}>~200 km</T>
      </g>
      <Label />
    </>
  );
};

/** Vista cenital: arboles tumbados en radial con silueta de alas de mariposa (~2,150 km2) y centro en pie sin ramas.
 *  p: 0-0.6 caen los arboles, 0.6-0.8 se dibuja la silueta, 0.8-1 rotulo. zoom (0..1) acerca al centro (parte 26). */
export const Butterfly: React.FC<{ p: number; zoom?: number }> = ({ p, zoom = 0 }) => {
  const C = { x: 960, y: 540 };
  const ax = (-20 * Math.PI) / 180; // eje de simetria inclinado
  // radio de la silueta segun angulo relativo al eje: dos lobulos grandes ("alas") y cintura estrecha en el eje
  const R = (th: number) => {
    const rel = th - ax;
    return 0.78 * (150 + 260 * Math.pow(Math.abs(Math.sin(rel)), 0.8) + 70 * Math.cos(rel));
  };
  const fall = seg(p, 0, 0.6);
  const out = seg(p, 0.6, 0.8);
  const lab = seg(p, 0.8, 1);
  const N = 140;
  const trees = [];
  for (let i = 0; i < N; i++) {
    const th = (i / N) * Math.PI * 2;
    for (let j = 1; j <= 5; j++) {
      const rr = 60 + (R(th) - 60) * (j / 5.4);
      const show = cl(fall * 6 - (rr / 420) * 5);
      if (show <= 0) continue;
      const x = C.x + Math.cos(th) * rr;
      const y = C.y + Math.sin(th) * rr;
      const L = 16 * show;
      trees.push(<line key={`${i}-${j}`} x1={x} y1={y} x2={x + Math.cos(th) * L} y2={y + Math.sin(th) * L} stroke="#B9A27A" strokeWidth={3} strokeLinecap="round" />);
    }
  }
  const pts = Array.from({ length: 121 }, (_, i) => {
    const th = (i / 120) * Math.PI * 2;
    return `${C.x + Math.cos(th) * (R(th) + 14)},${C.y + Math.sin(th) * (R(th) + 14)}`;
  }).join(" ");
  const z = 1 + zoom * 2.2;
  return (
    <>
      <Taiga />
      <g transform={`translate(${C.x} ${C.y}) scale(${z}) translate(${-C.x} ${-C.y})`}>
        {trees}
        {/* centro: troncos en pie sin ramas (puntos verticales vistos desde arriba) */}
        {Array.from({ length: 14 }, (_, i) => (
          <circle key={i} cx={C.x + Math.cos(i * 2.4) * (8 + (i % 4) * 9)} cy={C.y + Math.sin(i * 2.4) * (8 + (i % 4) * 9)} r={4} fill={CARD} opacity={fall} />
        ))}
        <polyline points={pts} fill="none" stroke={ORANGE} strokeWidth={6 / z} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - out} />
      </g>
      <g opacity={lab * (1 - zoom)}>
        <T x={C.x} y={90} s={64} c={ORANGE}>THE BUTTERFLY</T>
        <T x={C.x} y={980} s={48}>~2,150 km² of flattened forest</T>
      </g>
      <Label />
    </>
  );
};

/** Vista lateral: objeto rasante, franja de rotura 5-14 km (DISPUTED), onda de choque hacia abajo (NO hongo) y arboles del centro.
 *  p: 0-0.35 trayectoria, 0.35-0.5 franja, 0.5-0.85 onda y flechas verticales, 0.85-1 arboles en pie / tumbados.
 *  graze = variante 2020: trayectoria baja a ~10-15 km y vuelve a subir. */
export const SideShock: React.FC<{ p: number; graze?: boolean }> = ({ p, graze }) => {
  const G = 900; // suelo
  const km = 40; // px por km de altura
  const tr = seg(p, 0, 0.35);
  const band = seg(p, 0.35, 0.5);
  const wv = seg(p, 0.5, 0.85);
  const tz = seg(p, 0.85, 1);
  const B = { x: 960, y: G - (graze ? 12.5 : 9) * km };
  const path = graze ? `M80 ${G - 19 * km} Q ${B.x} ${G - 6 * km} 1840 ${G - 19 * km}` : `M80 ${G - 19 * km} L ${B.x} ${B.y}`;
  return (
    <>
      <Taiga />
      <rect x={0} y={G} width={1920} height={180} fill="#14281E" />
      {/* escala de altura */}
      {[0, 5, 10, 15].map((h) => (
        <g key={h}>
          <line x1={60} y1={G - h * km} x2={84} y2={G - h * km} stroke={CARD} strokeWidth={3} />
          <T x={96} y={G - h * km} s={28} a="start" w={600}>{`${h} km`}</T>
        </g>
      ))}
      {graze ? null : (
        <g opacity={band}>
          <rect x={220} y={G - 14 * km} width={1640} height={9 * km} fill={TEAL} opacity={0.16} />
          <T x={1840} y={G - 14 * km + 34} s={38} c={TEAL} a="end">Broke apart 5-14 km up · DISPUTED</T>
        </g>
      )}
      <path d={path} fill="none" stroke={ORANGE} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tr} />
      {graze ? (
        <g opacity={band}>
          <line x1={B.x} y1={B.y} x2={B.x} y2={G} stroke={TEAL} strokeWidth={3} strokeDasharray="10 10" />
          <T x={B.x + 24} y={B.y - 40} s={38} c={TEAL} a="start">Lowest point ~10-15 km · DISPUTED</T>
        </g>
      ) : null}
      {/* onda: arcos semicirculares hacia abajo desde el punto de energia */}
      {wv > 0
        ? [0, 0.3, 0.6].map((d) => {
            const k = cl(wv * 1.6 - d);
            const rr = 30 + k * (G - B.y);
            return k > 0 ? <path key={d} d={`M${B.x - rr} ${B.y} A ${rr} ${rr} 0 0 0 ${B.x + rr} ${B.y}`} fill="none" stroke={CARD} strokeWidth={6} opacity={(1 - k) * 0.85} /> : null;
          })
        : null}
      <g opacity={wv}>
        {[-60, 0, 60].map((dx) => (
          <path key={dx} d={`M${B.x + dx} ${B.y + 60} L${B.x + dx} ${G - 90} M${B.x + dx - 14} ${G - 110} L${B.x + dx} ${G - 90} L${B.x + dx + 14} ${G - 110}`} fill="none" stroke={CARD} strokeWidth={5} strokeLinecap="round" />
        ))}
      </g>
      {/* arboles: en pie bajo el punto, tumbados hacia fuera a los lados */}
      {Array.from({ length: 19 }, (_, i) => {
        const x = B.x + (i - 9) * 70;
        const d = Math.abs(i - 9);
        const ang = d <= 1 ? 0 : Math.sign(i - 9) * Math.min(90, 30 + d * 12) * tz;
        return (
          <g key={i} transform={`rotate(${ang} ${x} ${G})`}>
            <line x1={x} y1={G} x2={x} y2={G - 60} stroke="#B9A27A" strokeWidth={6} strokeLinecap="round" />
            {d <= 1 ? null : <path d={`M${x - 16} ${G - 30} L${x} ${G - 70} L${x + 16} ${G - 30} Z`} fill="#2C5A3E" opacity={1 - tz * 0.4} />}
          </g>
        );
      })}
      <g opacity={tz}>
        <T x={B.x} y={G + 70} s={36}>Center: still standing, branches stripped</T>
      </g>
      <Label />
    </>
  );
};

const EVENTS: [string, string][] = [
  ["1908", "The blast"],
  ["1921", "Kulik's first try"],
  ["1927", "Kulik reaches the site"],
  ["1938", "Aerial photos"],
  ["1975", "Negatives lost in a fire"],
  ["2013", "Peat grains study"],
  ["2020", "Grazing-iron proposal"],
];
/** Linea de tiempo 1908 -> 2020. n = numero de hitos visibles (1..7); el ultimo resaltado. p anima la entrada del ultimo. */
export const Timeline058: React.FC<{ n: number; p?: number }> = ({ n, p = 1 }) => {
  const x0 = 170;
  const x1 = 1660; // margen: el rotulo del ultimo hito no pasa de ~1820
  const X = (y: number) => x0 + ((y - 1908) / (2020 - 1908)) * (x1 - x0);
  const lastX = X(Number(EVENTS[n - 1][0]));
  return (
    <>
      <Taiga />
      <line x1={x0} y1={540} x2={Math.max(x0 + 40, lastX)} y2={540} stroke={CARD} strokeWidth={6} strokeLinecap="round" />
      {EVENTS.slice(0, n).map(([y, txt], i) => {
        const x = X(Number(y));
        const last = i === n - 1;
        const o = last ? cl(p * 2) : 1;
        const up = i % 2 === 0;
        return (
          <g key={y} opacity={o}>
            <circle cx={x} cy={540} r={last ? 18 : 12} fill={last ? ORANGE : TEAL} />
            <line x1={x} y1={up ? 520 : 560} x2={x} y2={up ? 440 : 640} stroke={last ? ORANGE : TEAL} strokeWidth={3} />
            <T x={x} y={up ? 400 : 680} s={last ? 64 : 44} c={last ? ORANGE : CARD}>{y}</T>
            <T x={x} y={up ? 340 : 740} s={last ? 34 : 28} w={600}>{txt}</T>
          </g>
        );
      })}
    </>
  );
};

/** Composicion de revision (no va al episodio): 4 piezas x 5 s a 30 fps. */
export const PIECES058_FRAMES = 600;
export const Pieces058: React.FC = () => {
  const f = useCurrentFrame();
  const i = Math.min(3, Math.floor(f / 150));
  const p = interpolate(f - i * 150, [0, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        {i === 0 ? <MapTunguska p={p} /> : i === 1 ? <Butterfly p={p} /> : i === 2 ? <SideShock p={p} /> : <Timeline058 n={7} p={p} />}
      </svg>
    </AbsoluteFill>
  );
};
