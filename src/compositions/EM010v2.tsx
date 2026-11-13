import ep from "../episodes/EM-010.json";
import timing from "../episodes/EM-010.timing.json";
import { SCENES010V2 } from "./scenes010v2";
import { makeV2 } from "./v2";

export const [EM010V2_EPISODE, EM010v2] = makeV2(ep, timing, SCENES010V2, false, 4.7);
