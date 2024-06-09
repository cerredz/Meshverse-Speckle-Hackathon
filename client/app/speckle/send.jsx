import { LuUpload } from "react-icons/lu";
import OBJViewer from "../../widgets/OBJViewer";
import Image from "next/image";
import { PiMoonStars } from "react-icons/pi";
import { TbTopologyStar3 } from "react-icons/tb";
import { handleChange } from "./utils";

import { motion } from "framer-motion";
export default function Send({
  streamID,
  setStreamID,
  streamName,
  setStreamName,
  fileUrl,
  setFileUrl,
  isLoadingMesh,
  setIsLoadingMesh,
  handleSubmit,
  isLoadingAddingToSpeckle,
  isCompleted,
  handleReset,
}) {
  return (
    <div className="flex flex-col items-center justify-center mt-8 w-full">
      <form onSubmit={(e) => handleSubmit(e)} className="w-full relative gap-8">
        {/* INPUTS CONTAINER */}
        <div className="flex flex-row items-center justify-between gap-4 w-1/2 mx-auto mb-8">
          <div className="flex w-full flex-col item-center justify-start gap-2">
            <label className="text-xs text-neutral-500 tracking-wider font-extrabold">
              Stream Name
            </label>
            <input
              placeholder="Enter Stream Name"
              className="py-2 px-4 bg-transparent focus:outline-none rounded-xl border-2 border-[rgba(255,255,255,.1)] text-white placeholder:text-neutral-500 tracking-wider font-bold"
              value={streamName}
              onChange={(e) => setStreamName(e.target.value)}
            />
          </div>
        </div>
        {/* INSERT IMAGE CONTAINER */}
        {!isCompleted && (
          <div className="w-1/2 mx-auto h-[40vh] border-2 border-neutral-500 border-dashed rounded-xl relative flex items-center justify-center">
            {fileUrl == null && !isLoadingMesh && (
              <>
                <input
                  type="file"
                  accept=".obj"
                  className="opacity-0 absolute w-full h-full z-10"
                  onChange={(e) =>
                    handleChange(e, setIsLoadingMesh, setFileUrl)
                  }
                />
                <div className="absolute flex flex-col items-center justify-center gap-2">
                  <LuUpload className="text-6xl text-neutral-600 " />
                  <p className="font-bold tracking-wider text-sm">
                    Drop File Here
                  </p>
                </div>
              </>
            )}
            {/* LOADING THE FRONTEND DISPLAY OF THE OBJ */}
            {fileUrl == null && isLoadingMesh && (
              <span className="loader"></span>
            )}
            {/* DISPLAYING THE OBJ THE USER WANTS TO ADD TO SPECKLE */}
            {fileUrl !== null &&
              !isLoadingMesh &&
              !isLoadingAddingToSpeckle &&
              !isCompleted && (
                <OBJViewer
                  fileUrl={`/images/meshes/${fileUrl}`}
                  height="420px"
                  scale={2}
                />
              )}
            {/* LOADING THE MESH INTO SPECKLE */}
            {fileUrl !== null && !isLoadingMesh && isLoadingAddingToSpeckle && (
              <span className="loader"></span>
            )}
          </div>
        )}

        {/* DISPLAYING THE SUCCESSFULLY ADDED IMAGE TO SPECKLE SCREEN */}
        {isCompleted && (
          <div className="w-1/2 mx-auto flex flex-col items-center gap-2 justify-center p-8 rounded-xl bg-[rgba(255,255,255,.05)] backdrop-blur-md border-2 border-[rgba(255,255,255,.1)]">
            <Image
              src={"/images/success.png"}
              alt="confetti icon"
              width={75}
              height={75}
              quality={100}
            />
            <h1 className="text-4xl tracking-widest font-bold drop-shadow-md">
              Success!!!
            </h1>
            <p className="text-md text-neutral-500 text-center font-bold tracking-wider">
              You Have successfully added the 3D Mesh into Speckle
            </p>
            <p className="text-sm text-neutral-500 font-bold tracking-wider">
              <span className="text-neutral-300">Stream ID: </span> {streamID}
            </p>
            <p className="text-sm text-neutral-500 font-bold tracking-wider">
              <span className="text-neutral-300">Stream Name: </span> {streamID}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleReset()}
              className="px-6 py-2 rounded-lg flex items-center justify-center gap-2 font-bold text-white text-lg tracking-wider bg-gradient-to-r from-sky-500 to-blue-500 mt-6"
            >
              <PiMoonStars />
              <p>Add Another Mesh</p>
            </motion.button>
          </div>
        )}
        {!isCompleted && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className="mt-8 bg-gradient-to-r from-sky-500 to-blue-500 mx-auto px-6 py-2 rounded-lg tracking-wider flex items-center justify-center gap-2 text-lg font-bold text-white"
            type="submit"
          >
            <TbTopologyStar3 />
            <p>Add to Speckle</p>
          </motion.button>
        )}
      </form>
    </div>
  );
}
