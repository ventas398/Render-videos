import ep from "../episodes/EM-005.json";
import timing from "../episodes/EM-005.timing.json";
import { SCENES005V2 } from "./scenes005v2";
import { makeV2 } from "./v2";

export const [EM005V2_EPISODE, EM005v2] = makeV2(ep, timing, SCENES005V2, false, 3.1);
