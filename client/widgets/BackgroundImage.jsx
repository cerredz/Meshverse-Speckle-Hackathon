import Image from "next/image";

export default function BackgroundImage(props) {
  return (
    <Image
      src={props.src}
      alt={props.alt}
      layout="fill"
      quality={100}
      priority={true}
      className={`${props.className}`}
    />
  );
}
