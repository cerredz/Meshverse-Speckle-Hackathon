import Image from "next/image";
import { FaBook } from "react-icons/fa";
import { motion, useSpring, useScroll, useTransform } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";
import { useRef } from "react";
import "../styles/SendAndReceive.css";

export default function SendAndRecieve() {
  const viewport = { margin: "-150px" };
  // framer motion animations
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const rawOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const rawScale = useTransform(scrollYProgress, [0, 1], [0.2, 1]);
  const springConfig = { damping: 25, stiffness: 100, delay: 0.1 };
  const opacity = useSpring(rawOpacity, springConfig);
  const scale = useSpring(rawScale, springConfig);
  return (
    <section
      id="speckle"
      ref={ref}
      className="w-full min-h-screen flex items-center justify-center py-20 flex-col lg:flex-row gap-12 relative z-10 px-[10%]"
    >
      {/* TEXT CONTAINER */}
      <div className="flex flex-col basis-2/5 items-start justify-center">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, stiffness: 200, damping: 20 }}
          className="border border-sky-400 flex flex-row items-center justify-center text-sky-400 gap-2 text-xs rounded-3xl px-4 py-1 mb-1 tracking-wider"
        >
          <FaBook />
          <p>Speckle</p>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport}
          transition={{
            duration: 0.6,
            stiffness: 200,
            damping: 20,
            delay: 0.05,
          }}
          className="text-3xl: md:text-6xl font-extrabold tracking-widest drop-shadow-md"
        >
          <span className="text-blue-400">Send</span> &{" "}
          <span className="text-fuchsia-500">Receive</span> Data to Speckle
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: 45 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport}
          transition={{
            duration: 0.6,
            stiffness: 200,
            damping: 20,
            delay: 0.1,
          }}
          className="font-bold text-md text-neutral-500 tracking-wider"
        >
          Send your generated 3D Meshes into Speckle&apos;s Client{" "}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, x: 55 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport}
          transition={{
            duration: 0.6,
            stiffness: 200,
            damping: 20,
            delay: 0.15,
          }}
          className="font-bold text-md text-neutral-500 tracking-wider"
        >
          Recieve extensive data on your generated 3D Meshes using
          Speckle&apos;s API
        </motion.p>
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport}
          transition={{
            duration: 0.6,
            stiffness: 200,
            damping: 20,
            delay: 0.2,
          }}
          className="flex flex-row items-center justify-center gap-2 mt-1 "
        >
          <FaCheckCircle className="fill-fuchsia-500 p-0 m-0 tracking-wide" />
          <p className="font-bold tracking-wider text-sm">
            Upload Models into Speckle&apos;s Client
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 65 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport}
          transition={{
            duration: 0.6,
            stiffness: 200,
            damping: 20,
            delay: 0.25,
          }}
          className="flex flex-row items-center justify-center gap-2"
        >
          <FaCheckCircle className="fill-fuchsia-500 tracking-wide" />
          <p className="font-bold tracking-wider text-sm">User Friendly</p>
        </motion.div>
        <div className="flex flex-row items-center justify-center gap-4 mt-4">
          <Link href={"/speckle?send=true"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{
                duration: 0.6,
                stiffness: 200,
                damping: 20,
                delay: 0.3,
              }}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-500 tracking-wider font-bold text-white text-lg "
            >
              Send
            </motion.button>
          </Link>
          <Link href={"/speckle?receive=true"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: 70 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewport}
              transition={{
                duration: 0.6,
                stiffness: 200,
                damping: 20,
                delay: 0.35,
              }}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-400 tracking-wider font-bold text-white text-lg "
            >
              Receive
            </motion.button>
          </Link>
        </div>
      </div>
      {/* IMAGE CONTAINER */}
      <motion.div
        style={{ scale, opacity }}
        className="flex relative basis-3/5 items-center justify-center rounded-full h-[60vh] bg-black speckle-image-container overflow-hidden"
      >
        <Image
          src={"/Images/speckle.png"}
          alt="speckle icon"
          layout="fill"
          quality={100}
          priority={true}
          objectFit="contain"
          className="z-10 flex items-center justify-center"
        />
      </motion.div>
    </section>
  );
}
