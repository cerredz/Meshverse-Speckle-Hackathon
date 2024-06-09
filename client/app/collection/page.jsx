"use client";

import { useEffect, useState } from "react";
import { getModelUrls } from "./utils";
import "./styles.css";
import { FaSearch } from "react-icons/fa";
import { TiPlus } from "react-icons/ti";
import { easeInOut, motion } from "framer-motion";
import Link from "next/link";
import { IoMdArrowDropdown } from "react-icons/io";
import GLBViewer from "../../widgets/GLBViewer";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { downloadMesh } from "../../utils/globals";

export default function Page() {
  const [models, setModels] = useState([]);
  const [isHoveringImage, setIsHoveringImage] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      await getModelUrls(setModels);
    };

    fetchData();
  }, []);

  return (
    <section id="browse" className="min-h-screen w-full relative">
      {/* BACKGROUND IMAGE */}
      <Image
        src={"/images/collectionBackground.png"}
        alt="background image"
        layout="fill"
        quality={100}
        priority
      />
      {/* CONTENT CONTAINER */}
      <div className="w-full flex flex-row items-center justify-center gap-12">
        {/* SIDEBAR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            stiffness: 100,
            damping: 25,
          }}
          className="flex-none basis-1/12 flex flex-col min-h-screen items-center justify-between sidebar"
        >
          <span className="absolute top-0 w-[4px] h-[196px] rounded-3xl bg-[rgba(255,255,255,.1)]"></span>
          <h1 className="absolute top-1/2 rotate-90 tracking-extra-widest font-light text-2xl whitespace-nowrap font-futuristic">
            2024 Technology
          </h1>
          <span className="absolute bottom-0 w-[4px] h-[100px] rounded-3xl bg-[rgba(255,255,255,.1)]"></span>
        </motion.div>

        <div className="relative flex basis-11/12 h-full flex-col mt-32 pr-[3%] min-h-screen">
          {/* TOP BAR */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            transition={{
              duration: 1,
              stiffness: 100,
              damping: 25,
              delay: 0.2,
            }}
            className="flex flex-row items-center justify-between"
          >
            <div className="flex flex-row items-center justify-center gap-4">
              {/* SEARCH */}
              <div className="flex flex-row items-center justify-start gap-1 input-container py-1 ">
                <FaSearch className="fill-neutral-600 text-neutral-600 text-2xl font-bold" />
                <input className="input" />
              </div>
              {/* CREATE BUTTON */}
              <Link href={"/create"}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className="cursor-pointer flex flex-row items-center justify-center font-bold tracking-wider gap-2 px-4 py-2 text-md rounded-lg bg-gradient-to-r from-blue-400 via-blue-500 to-blue-500"
                >
                  <TiPlus />
                  <p>Create</p>
                </motion.div>
              </Link>
            </div>

            <div className="flex flex-row items-center justify-center border-2 border-[rgba(255,255,255,.1)] rounded-3xl px-4 py-1 text-sm font-bold tracking-wider gap-2">
              <p className="text-neutral-500">Sort by: </p>
              <div className="flex flex-row items-center justify-center">
                <p>Newest</p>
                <IoMdArrowDropdown />
              </div>
            </div>
          </motion.div>
          {/* MODELS CONTAINER */}
          <div className="flex flex-wrap flex-row items-start justify-start w-full h-full gap-8 mt-12 z-10">
            {models.map((url, index) => (
              <motion.div
                initial={{ y: 75, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                transition={{
                  duration: 0.3,
                  stiffness: 100,
                  damping: 25,
                  delay: 0.2 * index + 0.3,
                }}
                key={index}
                className="cursor-pointer overflow-hidden relative w-[250px] h-[250px] flex items-center justify-center rounded-xl border-2 border-[rgba(255,255,255,.1)] bg-gradient-to-b from-[rgba(0,0,0,.1)] to-[rgba(255,255,255,.05)] shadow-md shadow-black"
                onMouseEnter={() => setIsHoveringImage(url)}
                onMouseLeave={() => setIsHoveringImage(null)}
              >
                <GLBViewer
                  fileUrl={`/images/collection/${url}.glb`}
                  scale={2}
                  height={250}
                />
                <AnimatePresence>
                  {isHoveringImage == url && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "30%" }}
                      exit={{ height: 0 }}
                      className="absolute bottom-0 left-0  right-0 bg-[rgba(255,255,255,.1)] backdrop-blur-lg z-10 border-inherit flex flex-row items-center justify-between px-6 text-sm font-bold tracking-wider"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => downloadMesh(url)}
                        className="bg-gradient-to-r from-sky-500 via-blue-500 to-blue-600 px-3 py-1 rounded-md"
                      >
                        Download
                      </motion.button>
                      <Link href={`/collection/${url}`}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-gradient-to-r from-purple-500 via-purple-700 to-fuchsia-500 px-3 py-1 rounded-md"
                        >
                          View
                        </motion.button>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
