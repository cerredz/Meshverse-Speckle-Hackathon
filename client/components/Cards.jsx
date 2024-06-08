import Image from "next/image";
import { cardsData } from "../data";
import { useScroll, motion, useTransform } from "framer-motion";
import { useRef } from "react";
export default function Cards() {
  const cardsRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardsRef,
    offset: ["0 1", "1.33 1"],
  });

  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.5, 1]);
  return (
    <section
      id="cards"
      ref={cardsRef}
      className="z-10 w-full px-[10%] flex flex-col gap-8 lg:flex-row items-center justify-between flex-wrap lg:mt-[50px]"
    >
      {cardsData.map((card, index) => (
        <motion.div
          key={index}
          style={{
            scale: scaleProgress,
            opacity: scrollYProgress,
          }}
          className={`flex flex-col items-center justify-between bg-[rgba(255,255,255,.05)] rounded-sm p-8 max-w-md w-[400px] h-[250px] ${
            index == 0 && "mt-[-75px] mb-[75px] lg:mt-0 lg:mb-0"
          }`}
        >
          <div
            className={`flex  
            ${index == 0 && "mt-[-50px]"}
            ${index == 1 && "mt-[-25px] "} 
            ${index == 2 && "mt-[-15px]"} basis-1/2 `}
          >
            <Image
              src={card.src}
              alt={card.alt}
              width={card.width}
              height={card.height}
              quality={100}
              priority={true}
            />
          </div>
          <div
            className={`flex flex-col items-center justify-center gap-2 basis-1/2 `}
          >
            <h1 className={`text-2xl font-bold tracking-wider drop-shadow-md`}>
              {card.title}
            </h1>
            <p className="text-center w-3/4 mx-auto font-bold tracking-wider text-neutral-500">
              {card.subtitle}
            </p>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
