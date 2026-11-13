import ep from "../episodes/EM-009.json";
import timing from "../episodes/EM-009.timing.json";
import { SCENES009V2 } from "./scenes009v2";
import { makeV2 } from "./v2";

export const [EM009V2_EPISODE, EM009v2] = makeV2(ep, timing, SCENES009V2);
