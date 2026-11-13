// Convierte episodio (guion + escenas) + timing real del audio en tiempos de escena.
// Los tiempos salen de scripts/kokoro_synth.py; no se inventa ninguno.
export const GAP = 0.15; // hueco entre trozos; igual que scripts/kokoro_synth.py
export const TAIL = 1.2; // cola tras la ultima palabra
export const OVERLAP = 0.4; // solape de fundido entre escenas

export type EpisodeJson = {
  id: string;
  title: string;
  audio: string;
  parts: string[];
  scenes: { id: string; fromPart: number; toPart: number }[];
};
export type Timing = { ends: number[]; parts: string[] };

export const buildEpisode = (ep: EpisodeJson, timing: Timing, fps: number, tail = TAIL) => {
  const last = timing.ends.length - 1;
  const start = (i: number): number => (i === 0 ? 0 : timing.ends[i - 1]);
  const speechEnd = (i: number): number => timing.ends[i] - GAP;
  const scenes = ep.scenes.map((s, k) => {
    const from = start(s.fromPart);
    const to = s.toPart === last ? timing.ends[last] + tail : timing.ends[s.toPart];
    const lastScene = k === ep.scenes.length - 1;
    return {
      id: s.id,
      fromPart: s.fromPart,
      toPart: s.toPart,
      from,
      to,
      fromFrame: Math.round(from * fps),
      frames: Math.round((to - from + (lastScene ? 0 : OVERLAP)) * fps),
    };
  });
  const totalFrames = Math.ceil((timing.ends[last] + tail) * fps);
  return { ...ep, ends: timing.ends, start, speechEnd, scenes, totalFrames };
};
