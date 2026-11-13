import ep from "../episodes/EM-011.json";
import timing from "../episodes/EM-011.timing.json";
import { SCENES011V2 } from "./scenes011v2";
import { makeV2 } from "./v2";

export const [EM011V2_EPISODE, EM011v2] = makeV2(ep, timing, SCENES011V2);
