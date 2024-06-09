"use client";

import { useEffect, useState } from "react";
import { getTotalUsers, getTotalUrls } from "../utils/Stats";
import "../styles/stats.css";
import { motion } from "framer-motion";
export default function Stats() {
  const [models, setModels] = useState(0);
  const [artists, setArtists] = useState(0);
  const viewport = { once: true, margin: "-200px" };

  useEffect(() => {
    const fetchData = async () => {
      await getTotalUrls(setModels);
      await getTotalUsers(setArtists);
    };
    fetchData();
  }, []);
  return (
    <section
      id="stats"
      className="w-full mt-12 py-20 relative flex flex-row items-center justify-center gap-24"
    >
      {/* MODELS GENERATED */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1, transition: { duration: 0.6 } }}
        viewport={viewport}
        className="flex flex-col items-center justify-center gap-2"
      >
        <h1 className="text-8xl font-light tracking-wider ">{models}+</h1>
        <p className="text-sky-500 font-black tracking-widest text-sm">
          Meshes Generated
        </p>
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1, transition: { duration: 0.6 } }}
        viewport={viewport}
        className="w-[2px] rounded-xl rotate-12 h-[150px] bg-sky-500 "
      ></motion.span>
      {/* USERS */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1, transition: { duration: 0.6 } }}
        viewport={viewport}
        className="flex flex-col items-center justify-center gap-2 "
      >
        <h1 className="text-8xl font-light tracking-wider ">{artists}+</h1>
        <p className="text-sky-500 font-black tracking-widest text-sm">
          Artists
        </p>
      </motion.div>
    </section>
  );
}
