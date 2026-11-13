import ep from "../episodes/EM-053.json";
import timing from "../episodes/EM-053.timing.mix.json";
import { GAP } from "../utils/timing";
import { SCENES053 } from "./scenes053";
import { makeV2 } from "./v2";

export { ThumbEM053 } from "./scenes053";
// Timing desplazado por los tramos de musica sola (scripts/em_audio.py mix053). Marca en la parte 5; cola 3 s.
export const [EM053_EPISODE, EM053] = makeV2(ep, timing, SCENES053, true, 3.0, 6, timing.ends[4]);
// Subtitulos: no se quedan durante la musica sola.
const solo = timing.solo as Record<string, number>;
EM053_EPISODE.speechEnd = (i) => timing.ends[i] - (solo[i] ?? 0) - GAP;
