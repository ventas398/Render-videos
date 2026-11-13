import ep from "../episodes/EM-041.json";
import timing from "../episodes/EM-041.timing.json";
import { SCENES041 } from "./scenes041";
import { makeV2 } from "./v2";

export const [EM041_EPISODE, EM041] = makeV2(ep, timing, SCENES041, true, 3.0);
