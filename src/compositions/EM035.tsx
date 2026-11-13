import ep from "../episodes/EM-035.json";
import timing from "../episodes/EM-035.timing.json";
import { SCENES035 } from "./scenes035";
import { makeV2 } from "./v2";

export const [EM035_EPISODE, EM035] = makeV2(ep, timing, SCENES035, true, 6.2, 3, 0.4);
