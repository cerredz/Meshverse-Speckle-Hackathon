import { redirect } from "next/dist/server/api-utils";

export const navLinks = () => [
  {
    title: "Home",
    redirect: "/",
  },
  {
    title: "Generate",
    redirect: "/create",
  },
  {
    title: "Collection",
    redirect: "/collection",
  },
  {
    title: "Speckle",
    redirect: "/speckle",
  },
];

export const cardsData = [
  {
    title: "Convert Any Photo",
    subtitle: "Use any .jpg or .png image to create precise 3d-Meshes",
    src: "/images/camera.webp",
    alt: "camera icon",
    width: 150,
    height: 150,
  },
  {
    title: "Fast and Efficient",
    subtitle: "Generate high-resolution 3d meshes within seconds",
    src: "/images/rocket.webp",
    alt: "rocket icon",
    width: 120,
    height: 120,
  },
  {
    title: "Seamless Integration",
    subtitle: "Easily integrate your 3D meshes into various platforms",
    src: "/images/speckle.webp",
    alt: "speckle icon",
    width: 100,
    height: 100,
  },
];
