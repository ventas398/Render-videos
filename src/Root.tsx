import React from "react";
import { Composition } from "remotion";
import { Pieces058, PIECES058_FRAMES } from "./compositions/pieces058";
import { EM001, EM001_EPISODE } from "./compositions/EM001";
import { ChannelAvatar, ChannelBanner } from "./compositions/Brand";
import { ChannelMockup, ThumbEM001, ThumbEM002, ThumbEM003, ThumbEM004, ThumbEM005, ThumbEM006, ThumbEM007, ThumbEM008, ThumbEM009, ThumbEM010, ThumbEM011, ThumbEM012, ThumbEM013, ThumbEM014, ThumbEM015, ThumbEM016, ThumbEM017, ThumbEM018, ThumbEM019, ThumbEM020, ThumbEM021, ThumbEM022 } from "./compositions/Channel";
import { EM002, EM002_EPISODE } from "./compositions/EM002";
import { EM003, EM003_EPISODE } from "./compositions/EM003";
import { EM004, EM004_EPISODE } from "./compositions/EM004";
import { EM005, EM005_EPISODE } from "./compositions/EM005";
import { EM006, EM006_EPISODE } from "./compositions/EM006";
import { EM007, EM007_EPISODE } from "./compositions/EM007";
import { EM008, EM008_EPISODE } from "./compositions/EM008";
import { EM009, EM009_EPISODE } from "./compositions/EM009";
import { EM010, EM010_EPISODE } from "./compositions/EM010";
import { EM011, EM011_EPISODE } from "./compositions/EM011";
import { EM012, EM012_EPISODE } from "./compositions/EM012";
import { EM013, EM013_EPISODE } from "./compositions/EM013";
import { EM014, EM014_EPISODE } from "./compositions/EM014";
import { EM015, EM015_EPISODE } from "./compositions/EM015";
import { EM016, EM016_EPISODE } from "./compositions/EM016";
import { EM017, EM017_EPISODE } from "./compositions/EM017";
import { EM018, EM018_EPISODE } from "./compositions/EM018";
import { EM019, EM019_EPISODE } from "./compositions/EM019";
import { EM020, EM020_EPISODE } from "./compositions/EM020";
import { EM021, EM021_EPISODE } from "./compositions/EM021";
import { EM021V2, EM021V2_EPISODE } from "./compositions/EM021v2";
import { EM022, EM022_EPISODE } from "./compositions/EM022";
import { EM023, EM023_EPISODE, ThumbEM023 } from "./compositions/EM023";
import { EM025, EM025_EPISODE } from "./compositions/EM025";
import { EM026, EM026_EPISODE } from "./compositions/EM026";
import { EM029, EM029_EPISODE } from "./compositions/EM029";
import { EM041, EM041_EPISODE } from "./compositions/EM041";
import { EM042, EM042_EPISODE } from "./compositions/EM042";
import { EM052, EM052_EPISODE, ThumbEM052 } from "./compositions/EM052";
import { EM053, EM053_EPISODE, ThumbEM053 } from "./compositions/EM053";
import { EM053B, EM053B_EPISODE, ThumbEM053B } from "./compositions/EM053B";
import { ThumbEM053Bcover } from "./compositions/thumbEM053Bcover";
import { ThumbEM053Bcover2 } from "./compositions/thumbEM053Bcover2";
import { BrandBoard } from "./compositions/BrandBoard";
import { EM052L, EM052L_EPISODE, ThumbEM052L } from "./compositions/EM052L";
import { ThumbEM035A, ThumbEM035B } from "./compositions/thumbEM035";
import { ThumbV3, ThumbV3EM022, ThumbV3EM023, ThumbV3EM023B, ThumbV3EM023C, ThumbV3EM026, ThumbV3EM029, ThumbV3EM010, ThumbV3EM003, ThumbV3EM032, ThumbV3EM004, ThumbV3EM031, ThumbV3EM005, ThumbV3EM035, ThumbV3EM041 } from "./compositions/thumb3";
import { EM022v2, EM022V2_EPISODE } from "./compositions/EM022v2";
import { EM004v2, EM004V2_EPISODE } from "./compositions/EM004v2";
import { EM010v2, EM010V2_EPISODE } from "./compositions/EM010v2";
import { EM003v2, EM003V2_EPISODE } from "./compositions/EM003v2";
import { EM009v2, EM009V2_EPISODE } from "./compositions/EM009v2";
import { EM008v2, EM008V2_EPISODE } from "./compositions/EM008v2";
import { EM011v2, EM011V2_EPISODE } from "./compositions/EM011v2";
import { EM032, EM032_EPISODE } from "./compositions/EM032";
import { EM035, EM035_EPISODE } from "./compositions/EM035";
import { EM031, EM031_EPISODE } from "./compositions/EM031";
import { EM005v2, EM005V2_EPISODE } from "./compositions/EM005v2";
import { EM012v2, EM012V2_EPISODE } from "./compositions/EM012v2";
import { SHORT_FRAMES, ShortVertical } from "./compositions/ShortVertical";
import { Short08v2, SHORT08V2_FRAMES } from "./compositions/Short08v2";
import { COVERS, SHORTS, ShortCover, ShortGeneric, shortFrames } from "./compositions/ShortGeneric";
import { VIDEO } from "./themes/brand";
import { AnimPilot } from "./compositions/Pilot";
import { BallPilot } from "./compositions/BallPilot";
import { ColorPrototype, COLOR_PROTOTYPE_FRAMES } from "./compositions/ColorPrototype";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="EM-001"
        component={EM001}
        durationInFrames={EM001_EPISODE.totalFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="EM-002"
        component={EM002}
        durationInFrames={EM002_EPISODE.totalFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="EM-003"
        component={EM003}
        durationInFrames={EM003_EPISODE.totalFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="EM-004"
        component={EM004}
        durationInFrames={EM004_EPISODE.totalFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="EM-005"
        component={EM005}
        durationInFrames={EM005_EPISODE.totalFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="EM-006"
        component={EM006}
        durationInFrames={EM006_EPISODE.totalFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="EM-007"
        component={EM007}
        durationInFrames={EM007_EPISODE.totalFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="EM-008"
        component={EM008}
        durationInFrames={EM008_EPISODE.totalFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="EM-009"
        component={EM009}
        durationInFrames={EM009_EPISODE.totalFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="EM-010"
        component={EM010}
        durationInFrames={EM010_EPISODE.totalFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="EM-011"
        component={EM011}
        durationInFrames={EM011_EPISODE.totalFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="EM-012"
        component={EM012}
        durationInFrames={EM012_EPISODE.totalFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="EM-013"
        component={EM013}
        durationInFrames={EM013_EPISODE.totalFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="EM-014"
        component={EM014}
        durationInFrames={EM014_EPISODE.totalFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="EM-015"
        component={EM015}
        durationInFrames={EM015_EPISODE.totalFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="EM-016"
        component={EM016}
        durationInFrames={EM016_EPISODE.totalFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="EM-017"
        component={EM017}
        durationInFrames={EM017_EPISODE.totalFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition id="ThumbEM017" component={ThumbEM017} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition
        id="EM-018"
        component={EM018}
        durationInFrames={EM018_EPISODE.totalFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition id="ThumbEM018" component={ThumbEM018} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition
        id="EM-019"
        component={EM019}
        durationInFrames={EM019_EPISODE.totalFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition id="ThumbEM019" component={ThumbEM019} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="EM-020" component={EM020} durationInFrames={EM020_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="ThumbEM020" component={ThumbEM020} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="EM-021" component={EM021} durationInFrames={EM021_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="EM-021-v2" component={EM021V2} durationInFrames={EM021V2_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="ThumbEM021"component={ThumbEM021} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="EM-022" component={EM022} durationInFrames={EM022_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="ThumbEM022" component={ThumbEM022} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="EM-023" component={EM023} durationInFrames={EM023_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="EM-025" component={EM025} durationInFrames={EM025_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="EM-026" component={EM026} durationInFrames={EM026_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="EM-029" component={EM029} durationInFrames={EM029_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="ThumbEM023" component={ThumbEM023} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="EM-022-v2" component={EM022v2} durationInFrames={EM022V2_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="EM-004-v2" component={EM004v2} durationInFrames={EM004V2_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="EM-010-v2" component={EM010v2} durationInFrames={EM010V2_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="ThumbV3EM010" component={ThumbV3EM010} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="EM-009-v2" component={EM009v2} durationInFrames={EM009V2_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="EM-008-v2" component={EM008v2} durationInFrames={EM008V2_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="EM-011-v2" component={EM011v2} durationInFrames={EM011V2_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="EM-032" component={EM032} durationInFrames={EM032_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />

      <Composition id="EM-035" component={EM035} durationInFrames={EM035_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="EM-031" component={EM031} durationInFrames={EM031_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="EM-041" component={EM041} durationInFrames={EM041_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="EM-042" component={EM042} durationInFrames={EM042_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="EM-052" component={EM052} durationInFrames={EM052_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="ThumbEM052" component={ThumbEM052} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbEM052L" component={ThumbEM052L} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="EM-052-LARGO" component={EM052L} durationInFrames={EM052L_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="EM-053" component={EM053} durationInFrames={EM053_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="ThumbEM053" component={ThumbEM053} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="EM-053B" component={EM053B} durationInFrames={EM053B_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="ThumbEM053B" component={ThumbEM053B} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbEM053Bcover" component={ThumbEM053Bcover} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbEM053Bcover2" component={ThumbEM053Bcover2} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="BrandBoard" component={BrandBoard} durationInFrames={1} fps={VIDEO.fps} width={1920} height={1080} />
      <Composition id="ThumbV3EM023C" component={ThumbV3EM023C} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbV3EM031" component={ThumbV3EM031} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbV3EM005" component={ThumbV3EM005} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbV3EM035" component={ThumbV3EM035} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbV3EM041" component={ThumbV3EM041} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbEM035A" component={ThumbEM035A} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbEM035B" component={ThumbEM035B} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbV3EM004" component={ThumbV3EM004} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbV3EM032" component={ThumbV3EM032} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="EM-005-v2" component={EM005v2} durationInFrames={EM005V2_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="EM-012-v2" component={EM012v2} durationInFrames={EM012V2_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="EM-003-v2" component={EM003v2} durationInFrames={EM003V2_EPISODE.totalFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="ThumbV3EM003" component={ThumbV3EM003} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbV3EM022" component={ThumbV3EM022} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbV3EM023" component={ThumbV3EM023} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbV3EM026" component={ThumbV3EM026} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbV3EM029" component={ThumbV3EM029} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbV3EM023B" component={ThumbV3EM023B} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="AnimPilot" component={AnimPilot} durationInFrames={210} fps={VIDEO.fps} width={1920} height={1080} />
      <Composition id="BallPilot" component={BallPilot} durationInFrames={60} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="ColorPrototype" component={ColorPrototype} durationInFrames={COLOR_PROTOTYPE_FRAMES} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
      <Composition id="ThumbV3" component={ThumbV3} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} defaultProps={{ photo: "em023-lane-switch", sub: "A COUNTRY SWITCHED SIDES" }} />
      <Composition id="ThumbEM008" component={ThumbEM008} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbEM009" component={ThumbEM009} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbEM010" component={ThumbEM010} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbEM011" component={ThumbEM011} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbEM012" component={ThumbEM012} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbEM013" component={ThumbEM013} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbEM014" component={ThumbEM014} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbEM015" component={ThumbEM015} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbEM016" component={ThumbEM016} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      {Object.entries(SHORTS).map(([id, p]) => <Composition key={id} id={id} component={ShortGeneric} defaultProps={p} durationInFrames={shortFrames(p.timing)} fps={VIDEO.fps} width={1080} height={1920} />)}
      {Object.keys(COVERS).map((id) => <Composition key={id + "-COVER"} id={id + "-COVER"} component={ShortCover} defaultProps={{ id }} durationInFrames={1} fps={VIDEO.fps} width={1080} height={1920} />)}
      <Composition id="SHORT-08V2" component={Short08v2} durationInFrames={SHORT08V2_FRAMES} fps={VIDEO.fps} width={1080} height={1920} />
      <Composition id="EM-008-SHORT" component={ShortVertical} durationInFrames={SHORT_FRAMES} fps={VIDEO.fps} width={1080} height={1920} />
      <Composition id="ThumbEM007" component={ThumbEM007} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbEM006" component={ThumbEM006} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbEM005" component={ThumbEM005} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbEM003"component={ThumbEM003} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbEM004" component={ThumbEM004} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ChannelBanner" component={ChannelBanner} durationInFrames={1} fps={VIDEO.fps} width={2560} height={1440} />
      <Composition id="ChannelAvatar" component={ChannelAvatar} durationInFrames={1} fps={VIDEO.fps} width={800} height={800} />
      <Composition id="ThumbEM001" component={ThumbEM001} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ThumbEM002" component={ThumbEM002} durationInFrames={1} fps={VIDEO.fps} width={1280} height={720} />
      <Composition id="ChannelMockup" component={ChannelMockup} durationInFrames={1} fps={VIDEO.fps} width={1840} height={1080} />
      <Composition id="Pieces058" component={Pieces058} durationInFrames={PIECES058_FRAMES} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    </>
  );
};

