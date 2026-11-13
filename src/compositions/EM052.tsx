import ep from "../episodes/EM-052.json";
import timing from "../episodes/EM-052.timing.json";
import { SCENES052 } from "./scenes052";
import { makeV2 } from "./v2";

export { ThumbEM052 } from "./scenes052";
// Cola de 6 s: pantalla final (~15 s desde la ultima frase) sobre la rejilla de paletas. Marca en la parte 7.
export const [EM052_EPISODE, EM052] = makeV2(ep, timing, SCENES052, false, 6, 6, 45.5);
