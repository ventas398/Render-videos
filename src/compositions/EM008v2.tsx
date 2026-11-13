import ep from "../episodes/EM-008.json";
import timing from "../episodes/EM-008.timing.json";
import { SCENES008V2 } from "./scenes008v2";
import { makeV2 } from "./v2";

export const [EM008V2_EPISODE, EM008v2] = makeV2(ep, timing, SCENES008V2);
