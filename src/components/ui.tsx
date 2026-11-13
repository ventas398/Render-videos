import React from "react";
import { theme } from "../themes/brand";
import { fade } from "../utils/anim";

/** Visible entre a y b (s) con 0.5 s de fundido. */
export const vis = (t: number, a: number, b = 1e6): number => fade(t, a, a + 0.5, b, b + 0.5);

export const Chip: React.FC<{ text: string; x: number; y: number; o: number; color?: string }> = ({ text, x, y, o, color = theme.teal }) =>
  o > 0 ? (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translateX(-50%)",
        opacity: o,
        padding: "10px 30px",
        borderRadius: 40,
        border: `3px solid ${color}`,
        background: theme.bg,
        color,
        fontFamily: theme.font,
        fontWeight: 800,
        fontSize: 32,
        letterSpacing: 3,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  ) : null;

export const Note: React.FC<{ text: string; x: number; y: number; o: number; size?: number }> = ({ text, x, y, o, size = 30 }) =>
  o > 0 ? (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translateX(-50%)",
        opacity: o,
        fontFamily: theme.font,
        fontWeight: 600,
        fontSize: size,
        color: theme.ink,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  ) : null;

export const Card: React.FC<{ left: number; top: number; width: number; height: number; o: number; children?: React.ReactNode }> = ({
  left,
  top,
  width,
  height,
  o,
  children,
}) =>
  o > 0 ? (
    <div
      style={{
        position: "absolute",
        left,
        top: top + 16 * (1 - o),
        width,
        height,
        boxSizing: "border-box",
        background: theme.panel,
        border: `3px solid ${theme.panelLine}`,
        borderRadius: 36,
        boxShadow: "0 18px 40px rgba(20,33,61,0.14)",
        opacity: o,
      }}
    >
      {children}
    </div>
  ) : null;
