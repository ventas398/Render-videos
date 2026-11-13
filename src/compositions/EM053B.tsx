import ep from "../episodes/EM-053B.json";
import timing from "../episodes/EM-053B.timing.mix.json";
import { GAP } from "../utils/timing";
import { SCENES053B } from "./scenes053b";
import { makeV2 } from "./v2";

export { ThumbEM053B } from "./scenes053b";
// Timing desplazado por los huecos de musica sola (scripts/em053b_mix.py mix). Marca tras la parte 4; cola 3 s (musica final desvaneciendose).
export const [EM053B_EPISODE, EM053B] = makeV2(ep, timing, SCENES053B, true, 3.0, 6, timing.ends[4]);
// Subtitulos: no se quedan durante la musica sola.
const solo = timing.solo as Record<string, number>;
EM053B_EPISODE.speechEnd = (i) => timing.ends[i] - (solo[i] ?? 0) - GAP;
