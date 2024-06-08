import { FaRobot, FaPlay } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { GiStarSattelites, GiStarProminences } from "react-icons/gi";
import { motion } from "framer-motion";
import Cards from "./Cards";
import Image from "next/image";
import "../styles/landing.css";
import Link from "next/link";

export default function Landing() {
  return (
    <section
      id="landing"
      className="flex flex-col lg:flex-row items-center justify-center gap-10 w-full min-h-screen z-10 px-[10%]"
    >
      {/* TEXT CONTAINER */}
      <div className="flex flex-col items-start justify-center gap-2 basis-5/12 ">
        <div className="border border-sky-400 flex flex-row items-center justify-center text-sky-400 gap-2 text-xs rounded-3xl px-4 py-1 mb-1">
          <FaRobot />
          <p className="font-bold tracking-wider"> Artificial Intelligence</p>
        </div>
        <h1 className="text-3xl xl:text-6xl tracking-wider font-bold drop-shadow-md backdrop-blur-md">
          Discover, Create & Transform Images Into{" "}
          <span className="text-blue-500 underline">3d Meshes </span>
        </h1>
        <p className="text-neutral-500 tracking-wider text-md font-bold w-3/4 mt-2">
          Utilize the power of diffusion to innovate the process of creating and
          analyzing 3d objects from scratch
        </p>
        {/* BULLETS */}
        <div className="flex flex-row items-center justify-center gap-2 mt-1 ">
          <FaCheckCircle className="fill-fuchsia-500 p-0 m-0 " />
          <p className="font-bold tracking-wider text-sm">
            Generate Results in Seconds
          </p>
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          <FaCheckCircle className="fill-fuchsia-500" />
          <p className="font-bold tracking-wider text-sm">
            Super Accurate 3d Meshes
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-row items-center justify-center gap-3 mt-1">
          <Link href={"/create"}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className="flex flex-row items-center justify-center gap-3 text-xl px-6 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-blue-700 cursor-pointer font-bold tracking-widest mt-3"
            >
              <GiStarProminences />
              <p>Create</p>
            </motion.div>
          </Link>
          <div className="flex flex-row items-center justify-center gap-2 ml-4 mt-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              className="rounded-full p-3 border-2 border-neutral-300 cursor-pointer"
            >
              <FaPlay />
            </motion.div>
            <p className="text-lg tracking-widest font-black text-transparent bg-gradient-to-r from-sky-400 to-blue-700 bg-clip-text">
              Play Demo
            </p>
          </div>
        </div>
      </div>
      {/* IMG CONTAINER */}
      <div className="flex flex-col items-center justify-end gap-2 basis-7/12 relative h-screen">
        <Image
          src="/images/metaverse.png"
          alt="main picture icon"
          width={500}
          height={500}
          quality={100}
          className="translate-y-[-200px] translate-x-20 w-[1200px] z-0 "
        />
        <div className="absolute bottom-[100px] translate-x-20 left-0 w-full h-[125px] bg-[rgba(255,255,255,.025)] rounded-2xl  backdrop-blur-3xl z-10 flex flex-row items-center justify-between px-8">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-5xl tracking-widest font-black text-sky-500">
              Speckle
            </h1>
            <p className="font-bold text-md tracking-widest text-neutral-500 opacity-75 text-start w-full">
              powered by
            </p>
          </div>
          <span className="w-[2px] h-[90px] rounded-3xl bg-[rgba(255,255,255,.1)]"></span>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-sky-500 text-2xl font-extrabold tracking-wider drop-shadow-md">
              Speckle Python SDK
            </h1>
            <div className="flex flex-row items-start justify-center gap-4">
              <p className="text-center max-w-[120px] text-xs text-neutral-500 tracking-wider font-bold">
                <span className="text-neutral-300">Send</span> 3D Meshes
                Directly to Your Speckle Client
              </p>
              <p className="text-center max-w-[120px] text-xs text-neutral-500 tracking-wider font-bold">
                <span className="text-neutral-300">Receive</span> data from your
                own custom data streams
              </p>
            </div>
          </div>
          <span className="w-[2px] h-[90px] rounded-3xl bg-[rgba(255,255,255,.1)]"></span>
          <div className="flex flex-col items-center justify-center gap-4">
            <Link
              href={"https://www.linkedin.com/in/michael-cerreto-b3348524b/"}
              target="_blank"
            >
              <button className="w-[200px] text-blue-500 border-2 border-blue-500 tracking-wider font-bold px-4 py-1 rounded-md transition duration-300 hover:bg-blue-500 hover:text-white">
                Michael Cerreto
              </button>
            </Link>
            <Link
              href={"https://www.linkedin.com/in/nick-disalvo-5b807424b/"}
              target="_blank"
            >
              <button className="w-[200px] text-purple-500 border-2 border-purple-500 tracking-wider font-bold px-4 py-1 rounded-md transition duration-300 hover:bg-purple-500 hover:text-white">
                Nick Disalvo
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
