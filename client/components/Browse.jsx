import { GrGallery } from "react-icons/gr";
import "../styles/browse.css";
import { motion } from "framer-motion";
import { FaArrowRightLong } from "react-icons/fa6";
import { BsSendArrowUp } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import GLBViewer from "../widgets/GLBViewer";
import OBJViewer from "../widgets/OBJViewer";
import Link from "next/link";

export default function Browse() {
  return (
    <section
      id="browse"
      className="z-10 min-h-[80vh] mt-20 px-[10%] flex flex-col lg:flex-row items-center justify-center w-full"
    >
      {/* IMAGE CONTAINER */}
      <div className="flex basis-3/5 items-center justify-center">
        <div className="grid grid-cols-3 gap-4">
          <div className="w-[200px] h-[200px] flex items-center justify-center card">
            <OBJViewer fileUrl={`/images/browse1.obj`} scale={2} height={200} />
          </div>
          <div className="w-[200px] h-[200px] flex items-center justify-center card">
            <OBJViewer fileUrl={`/images/browse2.obj`} scale={2} height={200} />
          </div>
          <div className="w-[200px] h-[200px] flex items-center justify-center card">
            <OBJViewer fileUrl={`/images/browse3.obj`} scale={2} height={200} />
          </div>
          <div className="w-[200px] h-[200px] flex items-center justify-center card">
            <OBJViewer fileUrl={`/images/browse4.obj`} scale={2} height={200} />
          </div>
          <div className="w-[200px] h-[200px] flex items-center justify-center card">
            <OBJViewer fileUrl={`/images/browse5.obj`} scale={2} height={200} />
          </div>
          <div className="w-[200px] h-[200px] flex items-center justify-center card">
            <OBJViewer fileUrl={`/images/browse6.obj`} scale={2} height={200} />
          </div>
          <div className="w-[200px] h-[200px] flex items-center justify-center card">
            <OBJViewer fileUrl={`/images/browse7.obj`} scale={2} height={200} />
          </div>
          <div className="w-[200px] h-[200px] flex items-center justify-center card">
            <OBJViewer fileUrl={`/images/browse8.obj`} scale={2} height={200} />
          </div>
          <div className="w-[200px] h-[200px] flex items-center justify-center card">
            <OBJViewer fileUrl={`/images/browse9.obj`} scale={2} height={200} />
          </div>
        </div>
      </div>
      {/* TEXT CONTAINER */}
      <div className="flex basis-2/5 flex-col items-start justify-center">
        <div className="border border-sky-400 flex flex-row items-center justify-center text-sky-400 gap-2 text-xs rounded-3xl px-4 py-1">
          <GrGallery />
          <p>Gallary</p>
        </div>
        <h1 className="text-3xl md:text-7xl relative font-bold tracking-wider drop-shadow-md browse-title">
          Browse
        </h1>
        <p className="text-neutral-500 tracking-wider font-bold text-md max-w-lg mt-2">
          Explore the wide array of creations where users transform ordinary 2D
          images into stunning 3D masterpieces. Search, analyze, and download
          your favorite 3D meshes with Speckle.
        </p>
        {/* BULLETS */}
        <div className="flex flex-row items-center justify-center gap-2 my-1 ">
          <FaCheckCircle className="fill-fuchsia-500 p-0 m-0 " />
          <p className="font-bold tracking-wider text-sm">
            Access to 3d Data via Speckle
          </p>
        </div>
        <div className="flex flex-row items-center justify-center gap-2 my-1 ">
          <FaCheckCircle className="fill-fuchsia-500" />
          <p className="font-bold tracking-wider text-sm">
            Search Functionality
          </p>
        </div>
        <div className="flex flex-row items-center justify-center gap-2 my-1">
          <FaCheckCircle className="fill-fuchsia-500" />
          <p className="font-bold tracking-wider text-sm">
            Thoasands of 3D Meshes
          </p>
        </div>
        <Link href={"/collection"}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className="flex flex-row items-center justify-center gap-2 text-xl px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-blue-500 to-fuchsia-600 font-bold tracking-wider mt-2 cursor-pointer"
          >
            <BsSendArrowUp />
            <p>View </p>
          </motion.div>
        </Link>
      </div>
    </section>
  );
}
