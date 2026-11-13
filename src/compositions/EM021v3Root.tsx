// Entrada propia de EM-021 v3 (Root.tsx es de otro escritor). Uso: npx remotion render src/compositions/EM021v3Root.tsx EM-021-v3 out/EM-021-v3-preview.mp4
import React from "react";
import { Composition, registerRoot } from "remotion";
import { VIDEO } from "../themes/brand";
import { EM021V3, EM021V3_EPISODE, ThumbEM021V3 } from "./EM021v3";

const Root: React.FC = () => (
  <>
    <Composition id="EM-021-v3" component={EM021V3} durationInFrames={EM021V3_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="ThumbEM021V3" component={ThumbEM021V3} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
  </>
);

registerRoot(Root);
