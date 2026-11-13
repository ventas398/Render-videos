import ep from "../episodes/EM-042.json";
import timing from "../episodes/EM-042.timing.json";
import { SCENES042 } from "./scenes042";
import { makeV2 } from "./v2";

export const [EM042_EPISODE, EM042] = makeV2(ep, timing, SCENES042, true, 3.0);
