import ep from "../episodes/EM-052-LARGO.json";
import timing from "../episodes/EM-052-LARGO.timing.json";
import { SCENESL052 } from "./scenesL052";
import { makeV2 } from "./v2";

// EM-052 LARGO (7:54). Cola de 6 s para pantalla final. Audio: public/audio/EM-052-LARGO-mix.wav (em_audio.py mix).
export { ThumbEM052L } from "./scenesL052";
export const [EM052L_EPISODE, EM052L] = makeV2(ep, timing, SCENESL052, false, 6);
