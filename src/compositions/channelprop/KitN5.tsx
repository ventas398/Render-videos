import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

// Kit de canal N5 (P5 11/11): marca de agua 150x150 y plantillas de miniatura 1280x720 por categoria.
// Colores = BrandN5 (orden de categorias de ESTRUCTURA_CANAL.md). Sin IA: solo formas y texto.
const COLS = ["#E4501C", "#F7B500", "#12A15C", "#1E5FD8"];
const NAVY = "#14213D";
const BLACK = '"Segoe UI Black", "Segoe UI", sans-serif';
export const CATS = [
  { id: "CaseFiles", tab: "CASE FILES", col: COLS[0], ink: "#fff" },
  { id: "Things", tab: "THINGS YOU TOUCH", col: COLS[1], ink: NAVY },
  { id: "Rules", tab: "RULES YOU FOLLOW", col: COLS[2], ink: "#fff" },
  { id: "Science", tab: "SCIENCE AROUND YOU", col: COLS[3], ink: "#fff" },
];

// P6 11/11: miniaturas reales por episodio (imagen del propio episodio + capa N5). Texto = el de la hoja de subida que pasa lint.
export const EP_THUMBS = [
  { id: "EM-035", cat: 0, photo: "illustrations/em035-portada-B-hero-v1.png", pos: "60% 50%", word: "WHY?" },
  { id: "EM-025", cat: 0, photo: "illustrations/em025-bill-eye.png", pos: "50% 30%", word: "REAL?" },
  { id: "EM-010", cat: 1, photo: "illustrations/em010-pocket.png", pos: "50% 45%", word: "WHY?" },
  { id: "EM-021", cat: 3, photo: "illustrations/em021-bolt-hills.png", pos: "70% 40%", word: "WHY?" },
];

// P8 11/11: v2 sin IA. Solo episodios con imagen real con licencia (patentes US, dominio publico).
// EM-021 y EM-025 no tienen foto real: no se hacen (anotado en COLA para pensador).
export const EP_THUMBS_V2 = [
  { id: "EM-035", cat: 0, word: "WHY?", doc: { src: "images/em035-us465588-p0.png", w: 1000, x: 300, y: -290 } },
  { id: "EM-010", cat: 1, word: "WHY?", doc: { src: "images/em010-patent-fig.jpg", w: 1700, x: 100, y: -810 } },
  // P1/P10 11/11 09:40: fotos DP descargadas por relevo20 (public\photos\_descarga.txt).
  { id: "EM-021", cat: 3, word: "WHY?", doc: { src: "photos/em021-noaa-nssl0010.jpg", w: 1280, x: 0, y: -70, plain: true }, credit: "NOAA photo · public domain" },
  // EM-025: solo recorte ampliado de la cara de la piramide del Gran Sello, monocromo (nota legal jefe 09:03, 18 USC 504).
  { id: "EM-025", cat: 0, word: "REAL?", doc: { src: "photos/em025-reverso-billete-1usd.jpg", w: 5400, x: -428, y: -642, mono: true }, credit: "Great Seal detail, US $1 reverse · public domain" },
  // 12/11: EM-011 puente real de Spijkenisse (10 EUR), foto Roel van Deursen CC BY 2.0 (Commons), recortada. Sin billete.
  { id: "EM-011", cat: 1, word: "WHY?", doc: { src: "images/em011-spijk10.jpg", w: 1400, x: 80, y: -46, plain: true }, credit: "Photo: Roel van Deursen · CC BY 2.0" },
  // 12/11: EM-012 carros encajados, foto Polycart CC BY 2.0 (Commons, 'Nested Plastic Shopping Carts'), recortada. Sin logos.
  { id: "EM-012", cat: 1, word: "WHY?", doc: { src: "images/em012-nested.jpg", w: 1400, x: -120, y: -170, plain: true }, credit: "Photo: Polycart · CC BY 2.0" },
];

// P11 11/11: v2.1 EM-010 reencuadrada al bolsillo delantero con remaches (aviso 3 de LOTE-FC). La figura de 1873 no dibuja el bolsillo pequeno.
export const EP_THUMBS_V21 = [
  { id: "EM-010", cat: 1, word: "WHY?", doc: { src: "images/em010-patent-fig.jpg", w: 2800, x: -140, y: -1510 } },
];

type DocT ={ src: string; w: number; x: number; y: number; plain?: boolean; mono?: boolean };
// Documento real a gran tamano en modo plano (invertido: linea clara sobre azul marino), a la derecha.
// plain = foto tal cual; mono = escala de grises con contraste.
export const DocLayer: React.FC<DocT> = ({ src, w, x, y, plain, mono }) => (
  <AbsoluteFill style={{ background: NAVY, overflow: "hidden" }}>
    <Img src={staticFile(src)} style={{ position: "absolute", left: x, top: y, width: w, ...(plain ? {} : mono ? { filter: "grayscale(1) contrast(1.35) brightness(0.95)" } : { filter: "invert(1)", mixBlendMode: "screen", opacity: 0.92 }) }} />
    <AbsoluteFill style={{ background: "linear-gradient(90deg, #14213Dee 0%, #14213D88 30%, #14213D00 55%)" }} />
  </AbsoluteFill>
);

// P2 11/11 23:1x: EM-022 (papel A4). No hay foto real con licencia y la IA no vale en miniatura: solo formas.
// Hoja grande con la linea de doblez y su mitad girada encima: misma forma (proporcion 1:1,414 en ambas).
const Sheet: React.FC<{ x: number; y: number; w: number; rot: number; fold?: boolean }> = ({ x, y, w, rot, fold }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: w * 1.414, transform: `rotate(${rot}deg)`, background: "linear-gradient(135deg, #FFFFFF 0%, #E9EEF7 100%)", boxShadow: "0 24px 50px #000b", borderRadius: 3 }}>
    {fold && <div style={{ position: "absolute", left: 0, right: 0, top: "50%", borderTop: `8px dashed ${COLS[1]}` }} />}
  </div>
);
export const A4Art: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 75% 45%, #2A3F6E 0%, ${NAVY} 65%)` }}>
    <Sheet x={745} y={50} w={350} rot={-6} fold />
    <Sheet x={995} y={245} w={247} rot={8} />
  </AbsoluteFill>
);

// P2 11/11 23:4x: EM-026 (anillo en el anular). Sin foto real con licencia: solo formas, sin mano.
// Alianza dorada + linea roja a trazos hasta un corazon (la "vena del amor" que el video desmiente).
export const RingArt: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 72% 40%, #2A3F6E 0%, ${NAVY} 65%)` }}>
    <svg width={1280} height={720} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFE9A6" /><stop offset="0.45" stopColor="#F7B500" /><stop offset="1" stopColor="#9C6A00" />
        </linearGradient>
      </defs>
      <path d="M 985 430 C 1040 520, 1090 470, 1125 520" fill="none" stroke="#E4501C" strokeWidth={9} strokeDasharray="20 14" strokeLinecap="round" />
      <g transform="translate(1085 500) scale(1.25)">
        <path d="M0,30 C0,-10 50,-10 50,22 C50,-10 100,-10 100,30 C100,62 62,82 50,100 C38,82 0,62 0,30Z" fill="#E4501C" />
      </g>
      <g transform="rotate(-14 900 250)" style={{ filter: "drop-shadow(0 22px 30px #000b)" }}>
        <ellipse cx={900} cy={250} rx={150} ry={185} fill="none" stroke="url(#gold)" strokeWidth={50} />
        <ellipse cx={900} cy={250} rx={168} ry={203} fill="none" stroke="#FFF6D6" strokeWidth={4} opacity={0.8} />
        <ellipse cx={900} cy={250} rx={127} ry={162} fill="none" stroke="#7A5200" strokeWidth={5} opacity={0.7} />
      </g>
    </svg>
  </AbsoluteFill>
);

// P3 12/11: EM-004 (palomitas de cine). Solo formas: cubeta a rayas + etiqueta de precio con '?'. Sin logotipos ni cifras.
const POP: [number, number, number][] = [
  [830, 292, 36], [884, 286, 38], [940, 290, 38], [996, 286, 38], [1050, 290, 37], [1092, 294, 34],
  [858, 244, 36], [912, 238, 38], [968, 240, 38], [1024, 240, 37], [1068, 250, 33],
  [896, 198, 34], [950, 190, 36], [1004, 198, 34], [952, 152, 30],
];
export const PopcornArt: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 75% 45%, #2A3F6E 0%, ${NAVY} 65%)` }}>
    <svg width={1280} height={720} style={{ position: "absolute" }}>
      <defs><clipPath id="tub"><polygon points="800,300 1120,300 1070,620 850,620" /></clipPath></defs>
      <g style={{ filter: "drop-shadow(0 22px 30px #000b)" }}>
        {POP.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={["#FFF6D6", "#FFE28A", "#FFFFFF"][i % 3]} stroke="#C99A2E" strokeWidth={4} />)}
        <g clipPath="url(#tub)">
          <rect x={800} y={300} width={320} height={320} fill="#fff" />
          {[0, 2, 4, 6].map((i) => (
            <polygon key={i} points={`${800 + (i * 320) / 7},300 ${800 + ((i + 1) * 320) / 7},300 ${850 + ((i + 1) * 220) / 7},620 ${850 + (i * 220) / 7},620`} fill="#D7263D" />
          ))}
          <rect x={800} y={300} width={320} height={22} fill="#0003" />
        </g>
      </g>
      <path d="M 1100 330 Q 1150 300 1178 352" fill="none" stroke="#fff" strokeWidth={5} />
      <g transform="rotate(12 1180 430)" style={{ filter: "drop-shadow(0 12px 18px #000b)" }}>
        <path d="M1120,372 L1150,340 L1210,340 L1240,372 L1240,520 L1120,520Z" fill="#FFF6D6" stroke={COLS[2]} strokeWidth={7} strokeLinejoin="round" />
        <circle cx={1180} cy={364} r={10} fill={NAVY} />
        <text x={1180} y={500} textAnchor="middle" fontFamily={BLACK} fontSize={130} fill={COLS[2]}>?</text>
      </g>
    </svg>
  </AbsoluteFill>
);

// P4 12/11: EM-003 (codigo de barras). Solo formas: paquete de chicle generico con un bloque de rayas negras. Sin marca ni cifras.
const BARS = [6, 3, 10, 4, 3, 8, 3, 5, 12, 3, 6, 3, 9, 4, 3, 7, 11, 3];
export const GumArt: React.FC = () => {
  let x = 800;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 75% 45%, #2A3F6E 0%, ${NAVY} 65%)` }}>
      <svg width={1280} height={720} style={{ position: "absolute" }}>
        <g transform="rotate(-9 970 350)" style={{ filter: "drop-shadow(0 24px 32px #000b)" }}>
          {[0, 1, 2].map((i) => <rect key={i} x={1150} y={232 + i * 82} width={78 - i * 14} height={72} rx={5} fill="#D9DEE8" stroke="#8E9AB8" strokeWidth={4} />)}
          <rect x={730} y={215} width={450} height={270} rx={16} fill="#12A15C" />
          <rect x={730} y={215} width={450} height={34} rx={16} fill="#fff3" />
          <rect x={770} y={255} width={370} height={190} rx={8} fill="#fff" />
          {BARS.map((w, i) => { const r = <rect key={i} x={x} y={275} width={w * 1.9} height={150} fill="#111" />; x += w * 1.9 + (BARS[(i + 5) % BARS.length] > 6 ? 9 : 5); return r; })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// 12/11: EM-031 (el zoo de Paris en el asedio de 1870). Todas las imagenes del episodio son IA: solo formas.
// Carta de restaurante con la silueta de un elefante + tenedor y cuchillo. Sin sangre, sin animal muerto, sin cifras.
export const ZooMenuArt: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 75% 45%, #2A3F6E 0%, ${NAVY} 65%)` }}>
    <svg width={1280} height={720} style={{ position: "absolute" }}>
      <g transform="rotate(-6 950 360)" style={{ filter: "drop-shadow(0 24px 32px #000b)" }}>
        <rect x={770} y={95} width={370} height={520} rx={8} fill="#FFF6D6" />
        <rect x={788} y={113} width={334} height={484} rx={4} fill="none" stroke={COLS[0]} strokeWidth={5} />
        <text x={955} y={205} textAnchor="middle" fontFamily={BLACK} fontSize={78} letterSpacing={6} fill={NAVY}>MENU</text>
        <rect x={895} y={228} width={120} height={7} fill={COLS[0]} />
        <g transform="translate(822 268) scale(0.98)" fill={NAVY}>
          <ellipse cx={110} cy={90} rx={95} ry={62} />
          <circle cx={205} cy={75} r={48} />
          {[38, 82, 136, 172].map((lx) => <rect key={lx} x={lx} y={115} width={34} height={88} rx={8} />)}
          <path d="M 238 85 C 274 100 270 150 258 178 C 254 190 266 197 277 188" fill="none" stroke={NAVY} strokeWidth={22} strokeLinecap="round" />
          <path d="M 18 78 Q 0 108 8 136" fill="none" stroke={NAVY} strokeWidth={8} strokeLinecap="round" />
          <ellipse cx={178} cy={80} rx={25} ry={36} stroke="#FFF6D6" strokeWidth={5} />
          <path d="M 232 110 Q 252 126 264 112" fill="none" stroke="#FFF6D6" strokeWidth={8} strokeLinecap="round" />
          <circle cx={220} cy={60} r={5} fill="#FFF6D6" />
        </g>
        {[0, 1, 2].map((i) => <rect key={i} x={835 + i * 20} y={505 + i * 30} width={240 - i * 40} height={9} rx={4} fill="#8E9AB8" />)}
      </g>
      <g fill="#D9DEE8" stroke="#8E9AB8" strokeWidth={3} style={{ filter: "drop-shadow(0 14px 20px #000b)" }}>
        <g transform="rotate(8 1195 380)">
          {[0, 1, 2].map((i) => <rect key={i} x={1172 + i * 16} y={170} width={9} height={95} rx={4} />)}
          <rect x={1170} y={250} width={45} height={50} rx={14} />
          <rect x={1184} y={290} width={17} height={300} rx={8} />
        </g>
      </g>
    </svg>
  </AbsoluteFill>
);

// 12/11: EM-023 (Suecia cambia de lado, 1967). Todas las imagenes del episodio son IA: solo formas.
// Carretera vista desde arriba: el coche pasa del carril izquierdo al derecho con una flecha. Sin banderas ni logo de la H.
const TopCar: React.FC<{ x: number; y: number; ghost?: boolean }> = ({ x, y, ghost }) => (
  <g transform={`translate(${x} ${y}) scale(1.25)`} opacity={ghost ? 0.7 : 1}>
    <rect x={-45} y={-85} width={90} height={170} rx={24} fill={ghost ? "none" : COLS[0]} stroke={ghost ? "#fff" : "#7A2A0C"} strokeWidth={5} strokeDasharray={ghost ? "14 10" : undefined} />
    {!ghost && <>
      <rect x={-34} y={-46} width={68} height={30} rx={8} fill="#BFD7FF" />
      <rect x={-32} y={36} width={64} height={22} rx={8} fill="#BFD7FF" />
      <circle cx={-28} cy={-76} r={7} fill="#FFE28A" /><circle cx={28} cy={-76} r={7} fill="#FFE28A" />
    </>}
  </g>
);
export const LaneSwitchArt: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 75% 45%, #2A3F6E 0%, ${NAVY} 65%)` }}>
    <svg width={1280} height={720} style={{ position: "absolute" }}>
      <g transform="rotate(-8 930 360)">
        <rect x={760} y={-120} width={340} height={960} fill="#3A3F4B" />
        <rect x={772} y={-120} width={7} height={960} fill="#fff" />
        <rect x={1081} y={-120} width={7} height={960} fill="#fff" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={925} y={-100 + i * 115} width={10} height={62} fill="#fff" />)}
        <TopCar x={845} y={540} ghost />
        <g style={{ filter: "drop-shadow(0 14px 18px #000b)" }}>
          <TopCar x={1015} y={170} />
          <path d="M 845 425 C 845 325, 1015 430, 1015 345" fill="none" stroke={COLS[1]} strokeWidth={24} strokeLinecap="round" />
          <polygon points="975,350 1055,350 1015,290" fill={COLS[1]} stroke={COLS[1]} strokeWidth={8} strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  </AbsoluteFill>
);

// 12/11: EM-005 (por que el rojo es parar). Todas las imagenes del episodio son IA: solo formas.
// Semaforo con la luz roja encendida y las otras dos apagadas (HOJA_SUBIDA_EM005). Sin cifras ni senales de un pais.
export const StopLightArt: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 75% 45%, #2A3F6E 0%, ${NAVY} 65%)` }}>
    <svg width={1280} height={720} style={{ position: "absolute" }}>
      <defs>
        <radialGradient id="redglow"><stop offset="0" stopColor="#FF3B30" stopOpacity={0.75} /><stop offset="1" stopColor="#FF3B30" stopOpacity={0} /></radialGradient>
        <radialGradient id="redlamp" cx="0.4" cy="0.35"><stop offset="0" stopColor="#FFB3A8" /><stop offset="0.35" stopColor="#FF3B30" /><stop offset="1" stopColor="#C01208" /></radialGradient>
      </defs>
      <g transform="rotate(-5 965 360)">
        <rect x={945} y={600} width={40} height={220} fill="#5B6478" />
        <circle cx={965} cy={135} r={250} fill="url(#redglow)" />
        <g style={{ filter: "drop-shadow(0 24px 32px #000b)" }}>
          <rect x={850} y={15} width={230} height={605} rx={44} fill="#1B1F29" stroke="#8E9AB8" strokeWidth={6} />
          {[135, 320, 505].map((cy, i) => (
            <g key={cy}>
              <circle cx={965} cy={cy} r={70} fill={["url(#redlamp)", "#4A3A10", "#123A22"][i]} stroke="#0A0C12" strokeWidth={8} />
              <path d={`M ${965 - 84} ${cy - 10} A 84 84 0 0 1 ${965 + 84} ${cy - 10}`} fill="none" stroke="#0A0C12" strokeWidth={18} strokeLinecap="round" />
            </g>
          ))}
        </g>
      </g>
    </svg>
  </AbsoluteFill>
);

// 12/11: EM-006 (por que todo el mundo dice OK). Solo formas y tipografia (HOJA_SUBIDA_EM006): las letras O y K
// grandes dentro de un bocadillo. Sin foto, sin IA, sin cifras, sin pagina de periodico.
export const OkArt: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 75% 45%, #2A3F6E 0%, ${NAVY} 65%)` }}>
    <svg width={1280} height={720} style={{ position: "absolute" }}>
      <g transform="rotate(-5 990 300)" style={{ filter: "drop-shadow(0 24px 32px #000b)" }}>
        <polygon points="840,440 960,440 800,585" fill="#FFF6D6" />
        <rect x={750} y={95} width={480} height={365} rx={70} fill="#FFF6D6" />
        <rect x={768} y={113} width={444} height={329} rx={54} fill="none" stroke={COLS[2]} strokeWidth={7} />
        <text x={990} y={372} textAnchor="middle" fontFamily={BLACK} fontSize={290} letterSpacing={-6} fill={NAVY}>OK</text>
      </g>
    </svg>
  </AbsoluteFill>
);

// 12/11: EM-009 (por que la comida lleva dos fechas). Las imagenes del episodio son IA: solo formas y tipografia.
// Carton generico con dos etiquetas: USE BY y BEST BEFORE. Sin marca, sin cifras ni fechas, sin foto.
const DateTag: React.FC<{ x: number; y: number; w: number; rot: number; col: string; ink: string; t: string }> = ({ x, y, w, rot, col, ink, t }) => (
  <g transform={`rotate(${rot} ${x + w / 2} ${y + 55})`} style={{ filter: "drop-shadow(0 12px 16px #000b)" }}>
    <rect x={x} y={y} width={w} height={110} rx={14} fill={col} stroke="#fff" strokeWidth={6} />
    <text x={x + w / 2} y={y + 78} textAnchor="middle" fontFamily={BLACK} fontSize={66} fill={ink}>{t}</text>
  </g>
);
export const TwoDatesArt: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 75% 45%, #2A3F6E 0%, ${NAVY} 65%)` }}>
    <svg width={1280} height={720} style={{ position: "absolute" }}>
      <g transform="rotate(-5 960 380)" style={{ filter: "drop-shadow(0 24px 32px #000b)" }}>
        <rect x={885} y={60} width={150} height={34} rx={4} fill="#D9DEE8" />
        <polygon points="850,190 1070,190 1035,90 885,90" fill="#E9EEF7" />
        <rect x={850} y={190} width={220} height={470} fill="#FFFFFF" />
        <rect x={850} y={190} width={220} height={16} fill="#0002" />
        <rect x={850} y={560} width={220} height={100} fill={COLS[3]} />
      </g>
      <DateTag x={860} y={225} w={330} rot={-8} col={COLS[0]} ink="#fff" t="USE BY" />
      <DateTag x={740} y={400} w={500} rot={5} col={COLS[1]} ink={NAVY} t="BEST BEFORE" />
    </svg>
  </AbsoluteFill>
);

// 12/11: EM-015 (por que las puertas de emergencia abren hacia fuera). Las imagenes del episodio son IA: solo formas
// y tipografia. Puerta entreabierta hacia fuera con barra PUSH y rotulo EXIT generico. Sin pictograma de ningun pais, sin cifras.
export const ExitDoorArt: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 75% 45%, #2A3F6E 0%, ${NAVY} 65%)` }}>
    <svg width={1280} height={720} style={{ position: "absolute" }}>
      <defs><linearGradient id="exitlight" x1="0" x2="1"><stop offset="0" stopColor="#FFE28A" /><stop offset="1" stopColor="#FFFDF2" /></linearGradient></defs>
      <g transform="rotate(-4 940 380)" style={{ filter: "drop-shadow(0 24px 32px #000b)" }}>
        <rect x={850} y={28} width={180} height={84} rx={12} fill="#C01208" stroke="#fff" strokeWidth={6} />
        <text x={940} y={94} textAnchor="middle" fontFamily={BLACK} fontSize={66} fill="#fff">EXIT</text>
        <rect x={770} y={150} width={340} height={640} fill="#8E9AB8" />
        <rect x={788} y={168} width={304} height={640} fill="url(#exitlight)" />
        <polygon points="788,168 1000,212 1000,808 788,808" fill="#3D5A99" stroke="#1B2C55" strokeWidth={6} />
        <polygon points="796,426 994,440 994,518 796,508" fill="#C01208" stroke="#fff" strokeWidth={6} strokeLinejoin="round" />
        <text x={895} y={496} textAnchor="middle" fontFamily={BLACK} fontSize={60} fill="#fff" transform="rotate(3 895 474)">PUSH</text>
      </g>
    </svg>
  </AbsoluteFill>
);

// 12/11 (decision del jefe 14:08): EM-011 v3, variante. La misma foto real de Spijkenisse dentro de un billete
// generico dibujado: simbolo del euro, sin diseno oficial, sin cifras, sin estrellas de la UE. No sustituye a la v2.
export const EuroNoteArt: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 72% 40%, #2A3F6E 0%, ${NAVY} 65%)` }}>
    <div style={{ position: "absolute", left: 560, top: 118, width: 680, height: 360, transform: "rotate(-4deg)", background: "linear-gradient(135deg, #FFF6D6 0%, #F6D9C4 100%)", borderRadius: 14, boxShadow: "0 26px 40px #000b" }}>
      <div style={{ position: "absolute", inset: 12, border: `4px solid ${COLS[0]}`, borderRadius: 8, opacity: 0.55 }} />
      <div style={{ position: "absolute", left: 30, top: 14, fontFamily: BLACK, fontSize: 150, lineHeight: 1, color: COLS[0] }}>€</div>
      <svg width={150} height={130} style={{ position: "absolute", left: 28, top: 200 }}>
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M 0 ${20 + i * 28} q 18 -18 36 0 t 36 0 t 36 0 t 36 0`} fill="none" stroke={COLS[0]} strokeWidth={5} opacity={0.5} />)}
      </svg>
      <div style={{ position: "absolute", left: 190, top: 28, width: 462, height: 304, overflow: "hidden", borderRadius: 6, border: `4px solid ${NAVY}` }}>
        <Img src={staticFile("images/em011-spijk10.jpg")} style={{ position: "absolute", left: -100, top: -96, width: 730 }} />
      </div>
    </div>
    <div style={{ position: "absolute", right: 24, top: 24, color: "#fffc", fontSize: 22, fontWeight: 600, background: "#0008", padding: "4px 12px", borderRadius: 6 }}>Photo: Roel van Deursen · CC BY 2.0</div>
  </AbsoluteFill>
);

// 13/11: EM-032 (que era el vomitorium romano). Solo formas: arco de piedra de anfiteatro con luz calida dentro y
// siluetas de gente entrando. Sin IA, sin foto, sin personas enfermas, sin cifras. Esquina inferior derecha libre.
export const VomitoriumArt: React.FC = () => {
  const cx = 940, base = 540, R = 180;
  const stones = Array.from({ length: 11 }, (_, i) => {
    const a0 = Math.PI + (i * Math.PI) / 11, a1 = Math.PI + ((i + 1) * Math.PI) / 11;
    const ro = R + 70, ri = R;
    const p = (r: number, a: number) => `${cx + r * Math.cos(a)},${base - 0 + r * Math.sin(a)}`;
    return { d: `${p(ri, a0)} ${p(ro, a0)} ${p(ro, a1)} ${p(ri, a1)}`, tone: i % 2 ? "#B9A98C" : "#CDBD9F" };
  });
  const walkers = [
    { x: 850, h: 118 }, { x: 900, h: 136 }, { x: 950, h: 150 }, { x: 1000, h: 132 }, { x: 1045, h: 116 },
  ];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 70% 45%, #2A3F6E 0%, ${NAVY} 65%)` }}>
      <svg width={1280} height={720} style={{ position: "absolute" }}>
        <defs>
          <radialGradient id="vomlight" cx="50%" cy="85%" r="80%">
            <stop offset="0" stopColor="#FFF3C2" /><stop offset="1" stopColor="#F7B500" />
          </radialGradient>
        </defs>
        <g style={{ filter: "drop-shadow(0 24px 32px #000b)" }}>
          <rect x={cx - R - 70} y={base - 40} width={70} height={40} fill="#A89878" stroke="#6E6048" strokeWidth={4} />
          <rect x={cx + R} y={base - 40} width={70} height={40} fill="#A89878" stroke="#6E6048" strokeWidth={4} />
          <path d={`M ${cx - R} ${base} L ${cx - R} ${base - 0} A ${R} ${R} 0 0 1 ${cx + R} ${base} Z`} fill="url(#vomlight)" />
          {stones.map((s, i) => <polygon key={i} points={s.d} fill={s.tone} stroke="#6E6048" strokeWidth={4} />)}
          <rect x={cx - R - 70} y={base} width={2 * (R + 70)} height={34} fill="#8C7D62" />
        </g>
        {walkers.map((w, i) => (
          <g key={i} fill="#14213D">
            <circle cx={w.x} cy={base - w.h + 14} r={15} />
            <path d={`M ${w.x - 20} ${base} L ${w.x - 14} ${base - w.h + 34} Q ${w.x} ${base - w.h + 26} ${w.x + 14} ${base - w.h + 34} L ${w.x + 20} ${base} Z`} />
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// Marca de agua: circulo, cuatro bandas y EM grande (legible a 40 px). Fondo transparente fuera del circulo.
export const WatermarkN5: React.FC = () => (
  <AbsoluteFill>
    <svg width={150} height={150} style={{ position: "absolute" }}>
      <defs><clipPath id="c"><circle cx={75} cy={75} r={75} /></clipPath></defs>
      <g clipPath="url(#c)">
        {COLS.map((c, i) => <rect key={c} x={i * 37.5} y={0} width={37.5} height={150} fill={c} />)}
        <circle cx={75} cy={75} r={60} fill={NAVY} />
      </g>
    </svg>
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BLACK, fontSize: 64, color: "#fff", letterSpacing: -3 }}>
      E<span style={{ color: COLS[1] }}>M</span>
    </div>
  </AbsoluteFill>
);

// Miniatura: banda vertical inclinada del color de la categoria a la izquierda, pestana arriba, WHY? grande.
// Esquina inferior derecha libre (YouTube pone la duracion). capa=true: sin hueco de foto (PNG transparente para poner encima).
export const ThumbN5: React.FC<{ cat: number; capa?: boolean; photo?: string; pos?: string; word?: string; doc?: DocT; credit?: string; children?: React.ReactNode }> = ({ cat, capa, photo, pos, word = "WHY?", doc, credit = "Original patent drawing", children }) => {
  const k = CATS[cat];
  return (
    <AbsoluteFill style={{ fontFamily: '"Segoe UI", Arial, sans-serif' }}>
      {children}
      {doc && <DocLayer {...doc} />}
      {doc && (
        <div style={{ position: "absolute", right: 24, top: 24, color: "#fffc", fontSize: 22, fontWeight: 600, background: "#0008", padding: "4px 12px", borderRadius: 6 }}>{credit}</div>
      )}
      {photo && (
        <AbsoluteFill>
          <Img src={staticFile(photo)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos ?? "center" }} />
          <AbsoluteFill style={{ background: "linear-gradient(90deg, #000a 0%, #0005 30%, #0000 55%)" }} />
        </AbsoluteFill>
      )}
      {!capa && !photo && !doc && (
        <AbsoluteFill style={{ background: "#2B3550", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 24, border: "6px dashed #8E9AB8", borderRadius: 12 }} />
          <div style={{ color: "#C9D2E8", fontSize: 44, fontWeight: 700, textAlign: "center", marginLeft: 260 }}>
            FOTO REAL AQUI, A SANGRE<br /><span style={{ fontSize: 30, fontWeight: 500 }}>1280x720 · sin IA · el objeto grande y a la derecha</span>
          </div>
        </AbsoluteFill>
      )}
      <svg width={1280} height={720} style={{ position: "absolute" }}>
        <polygon points="0,0 150,0 80,720 0,720" fill={k.col} />
      </svg>
      <div style={{ position: "absolute", left: 40, top: 36, background: k.col, color: k.ink, fontFamily: BLACK, fontSize: 40, padding: "10px 26px", borderRadius: 10, letterSpacing: 1 }}>
        {k.tab}
      </div>
      <div style={{ position: "absolute", left: 40, bottom: 40, fontFamily: BLACK, fontSize: 230, lineHeight: 0.9, color: "#fff", textShadow: "0 6px 0 #0008, 0 0 30px #000a", WebkitTextStroke: `4px ${NAVY}` }}>
        {word.slice(0, -1)}<span style={{ color: k.col }}>{word.slice(-1)}</span>
      </div>
    </AbsoluteFill>
  );
};
