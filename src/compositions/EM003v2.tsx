import ep from "../episodes/EM-003.json";
import timing from "../episodes/EM-003.timing.json";
import { SCENES003V2 } from "./scenes003v2";
import { makeV2 } from "./v2";

export const [EM003V2_EPISODE, EM003v2] = makeV2(ep, timing, SCENES003V2);
