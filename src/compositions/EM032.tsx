import ep from "../episodes/EM-032.json";
import timing from "../episodes/EM-032.timing.json";
import { SCENES032 } from "./scenes032";
import { makeV2 } from "./v2";

export const [EM032_EPISODE, EM032] = makeV2(ep, timing, SCENES032, true);
