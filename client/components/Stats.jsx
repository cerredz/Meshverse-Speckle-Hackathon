"use client";

import { useEffect, useState } from "react";
import { getTotalUsers, getTotalUrls } from "../utils/Stats";
import "../styles/stats.css";
export default function Stats() {
  const [models, setModels] = useState(0);
  const [artists, setArtists] = useState(0);

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
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-8xl font-light tracking-wider ">{models}+</h1>
        <p className="text-sky-500 font-bold tracking-wider text-sm">
          Meshes Generated
        </p>
      </div>
      <span className="w-[2px] rounded-xl rotate-12 h-[150px] bg-sky-500 "></span>
      {/* USERS */}
      <div className="flex flex-col items-center justify-center gap-2 ">
        <h1 className="text-8xl font-light tracking-wider ">{artists}+</h1>
        <p className="text-sky-500 font-bold tracking-wider text-sm">Artists</p>
      </div>
    </section>
  );
}
