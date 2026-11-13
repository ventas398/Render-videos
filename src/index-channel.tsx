import React from "react";
import { Composition, registerRoot } from "remotion";
import { BannerA, AvatarA } from "./compositions/channelprop/A";
import { BannerB, AvatarB } from "./compositions/channelprop/B";
import { BannerC, AvatarC } from "./compositions/channelprop/C";
import { Banner1, Banner2, Banner3, Avatar1, Avatar2, Avatar3 } from "./compositions/channelprop/D";
import { PageV } from "./compositions/channelprop/PageV";
import { Page } from "./compositions/channelprop/Page";
import { Page as NPage } from "./compositions/channelprop/N";
import { BannerN5, AvatarN5 } from "./compositions/channelprop/BrandN5";
import { N1, N2, N3, N4, N5 } from "./compositions/channelprop/NThemes";
import { WatermarkN5, ThumbN5, ExitDoorArt, TwoDatesArt, OkArt, StopLightArt, LaneSwitchArt, A4Art, RingArt, PopcornArt, GumArt, ZooMenuArt, EuroNoteArt, VomitoriumArt, CATS, EP_THUMBS, EP_THUMBS_V2, EP_THUMBS_V21 } from "./compositions/channelprop/KitN5";
import { Art022Docs } from "./compositions/art022";

const comp =(id: string, component: React.FC, width: number, height: number) => (
  <Composition key={id} id={id} component={component} durationInFrames={1} fps={30} width={width} height={height} />
);

registerRoot(() => (
  <>
    {comp("BannerA", BannerA, 2560, 1440)}
    {comp("BannerB", BannerB, 2560, 1440)}
    {comp("BannerC", BannerC, 2560, 1440)}
    {comp("AvatarA", AvatarA, 800, 800)}
    {comp("AvatarB", AvatarB, 800, 800)}
    {comp("AvatarC", AvatarC, 800, 800)}
    {comp("PageA", () => <Page v="A" />, 1920, 1080)}
    {comp("PageB", () => <Page v="B" />, 1920, 1080)}
    {comp("PageC", () => <Page v="C" />, 1920, 1080)}
    {comp("Banner1", Banner1, 2560, 1440)}
    {comp("Banner2", Banner2, 2560, 1440)}
    {comp("Banner3", Banner3, 2560, 1440)}
    {comp("Avatar1", Avatar1, 800, 800)}
    {comp("Avatar2", Avatar2, 800, 800)}
    {comp("Avatar3", Avatar3, 800, 800)}
    {[N1, N2, N3, N4, N5].map((t, i) => comp(`PageN${i + 1}`, () => <NPage th={t} />, 1920, 1080))}
    {comp("BannerN5", BannerN5, 2560, 1440)}
    {comp("AvatarN5", AvatarN5, 800, 800)}
    {comp("WatermarkN5", WatermarkN5, 150, 150)}
    {CATS.map((k, i) => comp(`ThumbN5-${k.id}`, () => <ThumbN5 cat={i} />, 1280, 720))}
    {CATS.map((k, i) => comp(`ThumbN5capa-${k.id}`, () => <ThumbN5 cat={i} capa />, 1280, 720))}
    {EP_THUMBS.map((t) => comp(`Thumb-${t.id}`, () => <ThumbN5 cat={t.cat} photo={t.photo} pos={t.pos} word={t.word} />, 1280, 720))}
    {EP_THUMBS_V2.map((t) => comp(`Thumb2-${t.id}`, () => <ThumbN5 cat={t.cat} word={t.word} doc={t.doc} credit={t.credit} />, 1280, 720))}
      {EP_THUMBS_V21.map((t) => comp(`Thumb21-${t.id}`, () => <ThumbN5 cat={t.cat} word={t.word} doc={t.doc} />, 1280, 720))}
    {comp("Thumb2-EM-022", () => <ThumbN5 cat={1} capa><A4Art /></ThumbN5>, 1280, 720)}
    {comp("Thumb2-EM-026", () => <ThumbN5 cat={0} capa word="MYTH?"><RingArt /></ThumbN5>, 1280, 720)}
    {comp("Thumb2-EM-023", () => <ThumbN5 cat={2} capa><LaneSwitchArt /></ThumbN5>, 1280, 720)}
    {comp("Thumb2-EM-006", () => <ThumbN5 cat={2} capa><OkArt /></ThumbN5>, 1280, 720)}
    {comp("Thumb2-EM-009", () => <ThumbN5 cat={2} capa><TwoDatesArt /></ThumbN5>, 1280, 720)}
    {comp("Thumb2-EM-015", () => <ThumbN5 cat={1} capa><ExitDoorArt /></ThumbN5>, 1280, 720)}
    {comp("Thumb2-EM-005",() => <ThumbN5 cat={2} capa><StopLightArt /></ThumbN5>, 1280, 720)}
    {comp("Thumb2-EM-031", () => <ThumbN5 cat={0} capa><ZooMenuArt /></ThumbN5>, 1280, 720)}
    {comp("Thumb2-EM-032", () => <ThumbN5 cat={0} capa><VomitoriumArt /></ThumbN5>, 1280, 720)}
    {comp("Thumb3-EM-011", () => <ThumbN5 cat={1} capa><EuroNoteArt /></ThumbN5>, 1280, 720)}
    {comp("Thumb2-EM-003",() => <ThumbN5 cat={1} capa><GumArt /></ThumbN5>, 1280, 720)}
    {comp("Thumb2-EM-004",() => <ThumbN5 cat={2} capa><PopcornArt /></ThumbN5>, 1280, 720)}
    {comp("Art-EM022-docs", Art022Docs, 2048, 2048)}
    {comp("Page1",()=> <PageV v="1" />, 1920, 1080)}
    {comp("Page2", () => <PageV v="2" />, 1920, 1080)}
    {comp("Page3", () => <PageV v="3" />, 1920, 1080)}
  </>
));
