import ep from "../episodes/EM-031.json";
import timing from "../episodes/EM-031.timing.json";
import { SCENES031 } from "./scenes031";
import { makeV2 } from "./v2";

export const [EM031_EPISODE, EM031] = makeV2(ep, timing, SCENES031, true, 3.0);
