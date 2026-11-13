import ep from "../episodes/EM-012.json";
import timing from "../episodes/EM-012.timing.json";
import { SCENES012V2 } from "./scenes012v2";
import { makeV2 } from "./v2";

// subBottom=50: margen de subtitulos de EM-012 medido <24px en pantalla con el valor global 34 (LOTE-CB); override solo para este episodio.
export const [EM012V2_EPISODE, EM012v2] = makeV2(ep, timing, SCENES012V2, true, undefined, 6, 0, 50);
