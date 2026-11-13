// Diagramas vectoriales de los TikTok. Rotulo "Simplified illustration" lo pone el beat (tag).
// "grid"/"bars": papel (TT-03). Resto: fondo azul marino de marca (pantalla completa) o OVERLAY transparente sobre una foto Flow (beat con img + diagram).
// Las marcas de tiempo (fotogramas desde el inicio del plano) estan medidas con IDEA-7x.timing.json: si se regraba la voz, revisarlas.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../themes/brand";

export type TTKind = "grid" | "bars" | "days" | "bills" | "zoom" | "dam" | "calendar" | "cliff" | "clock" | "clock2" | "ladder" | "bars73" | "signal";
const c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const NAVY = "#0A1A4A", YEL = "#FFC400", ICE = "#9FD0FF", RED = "#FF5A4F", GRN = "#46D17F";
const IMP = "Impact, 'Arial Black', sans-serif";
const pr = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], c);
const ease = (x: number) => x * x * (3 - 2 * x);
const SH = "0 3px 10px rgba(0,0,0,.65)";

const Head: React.FC<{ t: string; s: string }> = ({ t, s }) => (
  <div style={{ position: "absolute", left: 50, right: 50, top: 300, textAlign: "center", fontFamily: theme.font }}>
    <div style={{ fontSize: 56, fontWeight: 800, color: theme.ink, lineHeight: 1.1 }}>{t}</div>
    <div style={{ fontSize: 40, fontWeight: 700, color: theme.teal, marginTop: 10 }}>{s}</div>
  </div>
);

/** Linea de texto centrada. */
const Txt: React.FC<{ y: number; size: number; color?: string; font?: string; o?: number; x?: number; w?: number; children: React.ReactNode }> = ({ y, size, color = "#fff", font, o = 1, x = 0, w = 1080, children }) => (
  <div style={{ position: "absolute", left: x, width: w, top: y, textAlign: "center", fontFamily: font ?? theme.font, fontWeight: 800, fontSize: size, lineHeight: 1.05, color, opacity: o, textShadow: SH }}>{children}</div>
);

const NavyBg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px) 0 0/60px 60px, linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px) 0 0/60px 60px, radial-gradient(circle at 50% 30%, #17358A, ${NAVY} 70%)` }}>{children}</AbsoluteFill>
);

/** IDEA-75 p5: calendario que se llena y cuenta hasta 11,574 dias. */
const Days: React.FC = () => {
  const f = useCurrentFrame();
  const k = ease(pr(f, 4, 80));
  return (
    <>
      <Txt y={290} size={200} font={IMP} color={YEL}>{Math.round(k * 11574).toLocaleString("en-US")}</Txt>
      <Txt y={505} size={66}>DAYS</Txt>
      <Txt y={590} size={40} color={ICE}>1,000,000,000 ÷ 86,400</Txt>
      {Array.from({ length: 144 }, (_, i) => <div key={i} style={{ position: "absolute", left: 66 + (i % 16) * 60, top: 690 + Math.floor(i / 16) * 54, width: 50, height: 44, borderRadius: 8, background: i < k * 144 ? YEL : "rgba(255,255,255,.14)" }} />)}
    </>
  );
};

/** IDEA-75 p9-10: billete generico "$1" (sin retrato ni diseno oficial) que cae una vez por segundo. */
const Bills: React.FC = () => {
  const f = useCurrentFrame();
  const T0 = 64, G = 30, N = 5; // p10 empieza en el fotograma 64: el 1.er billete cae, luego uno por segundo
  const dropped = f < T0 ? 0 : Math.min(N, Math.floor((f - T0) / G) + 1);
  return (
    <>
      <Txt y={545} size={64} color={YEL}>{dropped} {dropped === 1 ? "second" : "seconds"} · ${dropped} gone</Txt>
      {Array.from({ length: N }, (_, i) => {
        const d0 = T0 + G * i, appear = i ? d0 - G + 14 : 0;
        if (f < appear) return null;
        const sgn = i % 2 ? -1 : 1, px = 540 + sgn * (20 + i * 9), py = 1090 - i * 10, pr_ = sgn * (5 + i * 3);
        const q = ease(pr(f, d0, d0 + 14)), sl = i ? ease(pr(f, appear, appear + 8)) : 1;
        const y = f < d0 ? 760 - (1 - sl) * 150 : 760 + q * (py - 760);
        return <div key={i} style={{ position: "absolute", left: 540 + q * (px - 540) - 280, top: y - 125, width: 560, height: 250, boxSizing: "border-box", borderRadius: 14, border: "8px solid #D5EFDC", background: "linear-gradient(135deg,#4C9A6A,#2F7A4D)", boxShadow: "0 14px 30px rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: IMP, fontSize: 150, color: "#fff", opacity: f < d0 ? sl : 1, transform: `rotate(${q * pr_}deg)` }}>$1</div>;
      })}
    </>
  );
};

/** IDEA-75 p14-15: un bloque de 31.7 anos que se aleja hasta ser 1 de 1,000 (una billon de segundos = 1,000 bloques). */
const Zoom: React.FC = () => {
  const f = useCurrentFrame();
  const s = Math.exp(Math.log(25) * (1 - ease(pr(f, 66, 126)))), show = pr(f, 104, 190);
  return (
    <>
      <Txt y={520} size={44} color={YEL} o={1 - pr(f, 66, 84)}>1 BILLION SECONDS = 31.7 YEARS</Txt>
      <Txt y={520} size={44} color={YEL} o={pr(f, 130, 150)}>1 TRILLION SECONDS = 1,000 BLOCKS</Txt>
      <div style={{ position: "absolute", left: 60, top: 590, width: 960, height: 600, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 600, transformOrigin: "0 0", transform: `scale(${s})` }}>
          {Array.from({ length: 1000 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i % 40) * 24, top: Math.floor(i / 40) * 24, width: 22, height: 22, borderRadius: 3, background: i === 0 ? YEL : "rgba(159,208,255,.6)", opacity: i === 0 || i < show * 1000 ? 1 : 0 }} />)}
        </div>
      </div>
    </>
  );
};

/** IDEA-74 p3-4 (sobre tt074-03 fija, aerea): linea de 600 ft sobre la ataguia y flecha del agua hacia las Horseshoe. */
const Dam: React.FC = () => {
  const f = useCurrentFrame();
  const d = ease(pr(f, 4, 34)), a = ease(pr(f, 84, 112));
  const x1 = 98, y1 = 885, x2 = 914, y2 = 787, xe = x1 + (x2 - x1) * d, ye = y1 + (y2 - y1) * d;
  return (
    <svg viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, filter: "drop-shadow(0 4px 6px rgba(0,0,0,.7))" }}>
      <line x1={x1} y1={y1} x2={xe} y2={ye} stroke={YEL} strokeWidth={12} strokeLinecap="round" />
      {[[x1, y1], [x2, y2]].map(([x, y], i) => <line key={i} x1={x} y1={y - 34} x2={x} y2={y + 34} stroke={YEL} strokeWidth={12} strokeLinecap="round" opacity={i ? pr(f, 30, 36) : 1} />)}
      <g transform="translate(506 836) rotate(-6.8)" opacity={pr(f, 26, 40)}>
        <rect x={-105} y={-48} width={210} height={96} rx={14} fill={YEL} />
        <text x={0} y={26} textAnchor="middle" fontFamily={IMP} fontSize={66} fill={NAVY}>600 FT</text>
      </g>
      <g opacity={pr(f, 84, 92)}>
        <line x1={150} y1={650} x2={150 + 770 * a} y2={650} stroke={ICE} strokeWidth={16} strokeLinecap="round" />
        <polygon points="0,-38 0,38 62,0" fill={ICE} transform={`translate(${150 + 770 * a} 650)`} />
      </g>
    </svg>
  );
};

/** IDEA-74 p10: de June 12 a Nov. 25 (166 dias, calculo nuestro con las fechas oficiales de DVIDS). */
const Calendar: React.FC = () => {
  const f = useCurrentFrame();
  const g = ease(pr(f, 6, 72)), X0 = 90, W = 900, TY = 800;
  return (
    <>
      <Txt y={330} size={56} color="#fff">THE FALLS STAYED DRY FOR</Txt>
      <Txt y={410} size={190} font={IMP} color={YEL} o={pr(f, 50, 66)}>5+ MONTHS</Txt>
      <div style={{ position: "absolute", left: X0, top: TY, width: W, height: 26, borderRadius: 13, background: "rgba(255,255,255,.18)" }} />
      <div style={{ position: "absolute", left: X0, top: TY, width: W * g, height: 26, borderRadius: 13, background: YEL }} />
      {[["JUL", 19], ["AUG", 50], ["SEP", 81], ["OCT", 111], ["NOV", 142]].map(([m, d]) => <React.Fragment key={m}>
        <div style={{ position: "absolute", left: X0 + (+d / 166) * W - 2, top: TY - 14, width: 4, height: 54, background: "rgba(255,255,255,.7)" }} />
        <Txt y={TY + 56} size={34} color={ICE} x={X0 + (+d / 166) * W - 60} w={120}>{m}</Txt>
      </React.Fragment>)}
      <Txt y={TY - 110} size={52} x={X0 - 30} w={240} o={pr(f, 4, 12)}>JUN 12</Txt>
      <Txt y={TY - 110} size={52} x={X0 + W - 210} w={240} o={pr(f, 66, 76)}>NOV 25</Txt>
      <Txt y={TY + 140} size={38} color={ICE} o={pr(f, 66, 80)}>Our calculation from the official dates</Txt>
    </>
  );
};

/** IDEA-74 p14: seccion simplificada del acantilado, montón de roca apoyado en la base. */
const Cliff: React.FC = () => {
  const f = useCurrentFrame();
  const grow = ease(pr(f, 14, 44)), nudge = Math.sin(f / 5) * 6 * pr(f, 56, 60);
  return (
    <svg viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }}>
      <g transform="translate(0 10)" opacity={pr(f, 0, 14)}>
        <rect x={90} y={640} width={470} height={530} fill="#6B7A99" />
        <rect x={90} y={610} width={470} height={30} fill={ICE} />
        <rect x={560} y={610} width={30} height={410} fill={ICE} opacity={0.8} />
        <rect x={90} y={1140} width={900} height={30} fill={ICE} opacity={0.5} />
        <text x={325} y={900} textAnchor="middle" fontFamily={theme.font} fontWeight={800} fontSize={64} fill="#fff">CLIFF</text>
        <g transform={`translate(0 1170) scale(1 ${grow}) translate(0 -1170)`}>
          <polygon points="560,1170 560,1000 820,1170" fill="#C9B38A" stroke="#fff" strokeWidth={4} />
        </g>
        <g opacity={pr(f, 56, 70)}>
          {[1085, 1122, 1156].map((y) => <g key={y} transform={`translate(${-nudge} 0)`}><line x1={680} y1={y} x2={600} y2={y} stroke={YEL} strokeWidth={12} strokeLinecap="round" /><polygon points="0,-18 0,18 -32,0" fill={YEL} transform={`translate(572 ${y})`} /></g>)}
        </g>
        <text x={900} y={1100} textAnchor="middle" fontFamily={IMP} fontSize={50} fill="#fff" opacity={pr(f, 30, 44)}>ROCK PILE</text>
      </g>
      <text x={540} y={1280} textAnchor="middle" fontFamily={theme.font} fontWeight={800} fontSize={42} fill={YEL} opacity={pr(f, 70, 90)}>PROBABLY HELPS HOLD THE CLIFF UP</text>
    </svg>
  );
};

/** IDEA-73 overlay: reloj de 24 h (n=1) o 24 h + 24 h (n=2). */
const Clock: React.FC<{ n: 1 | 2 }> = ({ n }) => {
  const f = useCurrentFrame();
  const R = n === 1 ? 190 : 150, cy = 860, cxs = n === 1 ? [540] : [300, 780], L = 2 * Math.PI * R;
  return (
    <>
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }}>
        {cxs.map((cx, i) => {
          const g = n === 1 ? ease(pr(f, 6, 84)) : ease(i ? pr(f, 44, 84) : pr(f, 4, 40));
          return <g key={i}>
            <circle cx={cx} cy={cy} r={R + 34} fill="rgba(10,26,74,.8)" />
            <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,.25)" strokeWidth={22} />
            <circle cx={cx} cy={cy} r={R} fill="none" stroke={YEL} strokeWidth={22} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={(1 - g) * L} transform={`rotate(-90 ${cx} ${cy})`} />
            {Array.from({ length: 8 }, (_, k) => <line key={k} x1={cx} y1={cy - R + 20} x2={cx} y2={cy - R + 40} stroke="#fff" strokeWidth={4} transform={`rotate(${k * 45} ${cx} ${cy})`} />)}
          </g>;
        })}
      </svg>
      {cxs.map((cx, i) => <Txt key={i} y={cy - (n === 1 ? 62 : 46)} size={n === 1 ? 124 : 92} font={IMP} color="#fff" x={cx - 150} w={300}>24 h</Txt>)}
      {n === 2 && <Txt y={cy - 52} size={100} font={IMP} color={YEL} x={490} w={100} o={pr(f, 40, 48)}>+</Txt>}
      {n === 2 && <div style={{ position: "absolute", left: 190, width: 700, top: 1090, textAlign: "center", background: YEL, borderRadius: 14, padding: "10px 0", fontFamily: IMP, fontSize: 84, color: NAVY, opacity: pr(f, 84, 96) }}>= ABOUT 2 DAYS</div>}
    </>
  );
};

/** IDEA-73 p7 (sobre tt073-05): escalera de tiempos de la luz, no a escala. */
const Ladder: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [{ n: "MOON", v: "1.3 s", w: 0.1, col: ICE }, { n: "MARS", v: "3–22 min", w: 0.45, col: ICE }, { n: "VOYAGER 1", v: "24 h", w: 1, col: YEL }];
  return (
    <>
      {rows.map((r, i) => {
        const o = pr(f, 2 + i * 9, 12 + i * 9), top = 320 + i * 140;
        return <div key={i} style={{ position: "absolute", left: 90, width: 900, top, height: 120, boxSizing: "border-box", borderRadius: 14, background: "rgba(10,26,74,.84)", opacity: o, transform: `translateX(${(1 - o) * -40}px)` }}>
          <div style={{ position: "absolute", left: 30, top: 18, fontFamily: theme.font, fontWeight: 800, fontSize: 46, color: "#fff" }}>{r.n}</div>
          <div style={{ position: "absolute", right: 30, top: 8, fontFamily: IMP, fontSize: 66, color: r.col }}>{r.v}</div>
          <div style={{ position: "absolute", left: 30, top: 92, height: 10, width: 840 * r.w * ease(pr(f, 6 + i * 9, 26 + i * 9)), borderRadius: 5, background: r.col }} />
        </div>;
      })}
      <Txt y={745} size={34} color="#fff" o={pr(f, 30, 40)}>Light travel time from Earth · not to scale</Txt>
    </>
  );
};

/** IDEA-73 p10 (sobre tt073-08, casi vacio): 3.7 frente a 16 (miles de millones de millas), a escala. */
const Bars73: React.FC = () => {
  const f = useCurrentFrame();
  const bar = (top: number, w: number, p: number, col: string, tx: string, inside: boolean) => <>
    <div style={{ position: "absolute", left: 90, top, height: 110, width: Math.max(w * p, 1), borderRadius: 12, background: col, display: "flex", alignItems: "center", paddingLeft: 24, fontFamily: IMP, fontSize: 76, color: NAVY, whiteSpace: "nowrap", overflow: "hidden" }}>{inside && p > 0.9 ? tx : ""}</div>
    {!inside && <div style={{ position: "absolute", left: 90 + w + 24, top: top + 12, fontFamily: IMP, fontSize: 76, color: "#fff", opacity: pr(f, 24, 32), whiteSpace: "nowrap" }}>{tx}</div>}
  </>;
  return (
    <>
      <Txt y={520} size={44} color="#fff" x={90} w={900} o={pr(f, 0, 8)}>PALE BLUE DOT</Txt>
      {bar(575, 208, ease(pr(f, 4, 28)), ICE, "3.7", false)}
      <Txt y={760} size={44} color="#fff" x={90} w={900} o={pr(f, 10, 18)}>ONE LIGHT-DAY</Txt>
      {bar(815, 900, ease(pr(f, 12, 52)), YEL, "16 billion miles", true)}
      <Txt y={960} size={38} color={ICE} o={pr(f, 50, 62)}>Billions of miles · our calculation</Txt>
    </>
  );
};

const Mark: React.FC<{ x: number; w: number; ok: boolean; label: string; f0: number }> = ({ x, w, ok, label, f0 }) => {
  const f = useCurrentFrame();
  const o = pr(f, f0, f0 + 5), col = ok ? GRN : RED;
  return (
    <div style={{ position: "absolute", left: x, top: 560, width: w, height: 170, boxSizing: "border-box", borderRadius: 18, border: `8px solid ${col}`, background: "rgba(10,26,74,.86)", opacity: o, transform: `scale(${interpolate(f - f0, [0, 6], [1.3, 1], c)})`, display: "flex", alignItems: "center", justifyContent: "center", gap: 22, fontFamily: theme.font, fontWeight: 800, fontSize: 44, color: "#fff" }}>
      <svg width={70} height={70} viewBox="0 0 70 70">{ok ? <polyline points="10,38 28,56 60,14" fill="none" stroke={col} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" /> : <path d="M12 12L58 58M58 12L12 58" stroke={col} strokeWidth={12} strokeLinecap="round" />}</svg>
      {label}
    </div>
  );
};

/** IDEA-73 p13-14 (sobre tt073-10): dos intentos sin senal y la senal vuelve (a los 5,08 s empieza p14). */
const Signal: React.FC = () => {
  const f = useCurrentFrame(), back = f >= 152;
  return (
    <>
      {!back && <Mark x={110} w={360} ok={false} label="NO SIGNAL" f0={24} />}
      {!back && f >= 96 && <Mark x={610} w={360} ok={false} label="NO SIGNAL" f0={96} />}
      {back && <Mark x={190} w={700} ok label="SIGNAL RETURNS" f0={152} />}
    </>
  );
};

export const TTDiagram: React.FC<{ kind: TTKind }> = ({ kind }) => {
  const f = useCurrentFrame();
  if (kind === "dam") return <Dam />;
  if (kind === "clock" || kind === "clock2") return <Clock n={kind === "clock" ? 1 : 2} />;
  if (kind === "ladder") return <Ladder />;
  if (kind === "bars73") return <Bars73 />;
  if (kind === "signal") return <Signal />;
  if (kind === "days" || kind === "bills" || kind === "zoom" || kind === "calendar" || kind === "cliff") {
    const D = { days: Days, bills: Bills, zoom: Zoom, calendar: Calendar, cliff: Cliff }[kind];
    return <NavyBg><D /></NavyBg>;
  }
  return (
    <AbsoluteFill style={{ background: theme.bg, backgroundImage: "linear-gradient(rgba(20,33,61,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(20,33,61,0.06) 1px, transparent 1px)", backgroundSize: "60px 60px" }}>
      {kind === "grid" ? (
        <>
          <Head t="STUDY IN CHINA" s="more than 3,000 people surveyed" />
          {Array.from({ length: 100 }, (_, i) => {
            const on = i % 4 === 0; // 25 de 100: "about a quarter", repartidos
            const pop = interpolate(f, [i * 0.4, i * 0.4 + 8], [0, 1], c);
            const lit = on ? interpolate(f, [50, 62], [0, 1], c) : 0;
            return <div key={i} style={{ position: "absolute", left: 120 + (i % 10) * 84, top: 480 + Math.floor(i / 10) * 76, width: 56, height: 56, borderRadius: 28, transform: `scale(${pop})`, background: lit > 0.5 ? theme.orange : "#9FB4C7", boxShadow: lit > 0.5 ? "0 0 0 8px rgba(229,107,15,.25)" : "none" }} />;
          })}
        </>
      ) : (
        <>
          <Head t="SAID THEY SNEEZE AT THE SUN" s="same study, by sex" />
          {[{ l: "MEN", v: 30, x: 170, col: theme.orange }, { l: "WOMEN", v: 21, x: 600, col: theme.teal }].map((b) => {
            const h = interpolate(f, [4, 30], [0, b.v * 16], c);
            return (
              <React.Fragment key={b.l}>
                <div style={{ position: "absolute", left: b.x, width: 310, top: 1100 - h, height: h, background: b.col, borderRadius: "14px 14px 0 0" }} />
                <div style={{ position: "absolute", left: b.x, width: 310, top: 1100 - h - 110, textAlign: "center", fontFamily: "Impact, 'Arial Black', sans-serif", fontSize: 100, color: theme.ink, opacity: interpolate(f, [26, 36], [0, 1], c) }}>{b.v}%</div>
                <div style={{ position: "absolute", left: b.x, width: 310, top: 1120, textAlign: "center", fontFamily: theme.font, fontWeight: 800, fontSize: 52, color: theme.ink }}>{b.l}</div>
              </React.Fragment>
            );
          })}
          <div style={{ position: "absolute", left: 100, right: 100, top: 1100, height: 4, background: theme.ink }} />
        </>
      )}
    </AbsoluteFill>
  );
};
