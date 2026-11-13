import React, { useLayoutEffect, useRef, useState } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../themes/brand";

/** Subtitulo: sin barras, texto azul noche con contorno claro. Se monta dentro de un <Sequence> por frase. */
export const AnimatedCaption: React.FC<{ text: string; durationInFrames: number }> = ({ text, durationInFrames }) => {
  const f = useCurrentFrame();
  // Maximo 3 lineas: si el texto da 4, baja el cuerpo (52 -> 34 px) para no pisar la nota "Simplified illustration" (y=776).
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(52);
  useLayoutEffect(() => {
    if (ref.current && size > 34 && ref.current.offsetHeight > size * 1.2 * 3 + 4) setSize(size - 2);
  }, [size, text]);
  const o = interpolate(f, [0, 6, durationInFrames - 6, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rise = interpolate(f, [0, 8], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: 180,
        right: 180,
        bottom: 64,
        textAlign: "center",
        fontFamily: theme.font,
        fontWeight: 700,
        fontSize: size,
        textWrap: "balance",
        lineHeight: 1.2,
        color: theme.ink,
        WebkitTextStroke: `10px ${theme.bg}`,
        paintOrder: "stroke fill",
        opacity: o,
        transform: `translateY(${rise}px)`,
      }}
    >
      {text.split(/(\S+-\S+)/).map((w, i) => (i % 2 ? <span key={i} style={{ whiteSpace: "nowrap" }}>{w}</span> : w))}
    </div>
  );
};
