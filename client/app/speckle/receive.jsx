import { FaDatabase } from "react-icons/fa";
import "./styles.css";
import { motion } from "framer-motion";
import { handleDownloadAllData, handleReceiveSubmit } from "./utils";
import { useState } from "react";
import { GiLightningBranches, GiSplashyStream } from "react-icons/gi";
import { SiNintendogamecube } from "react-icons/si";
import { HiMiniIdentification } from "react-icons/hi2";
import { IoPersonOutline } from "react-icons/io5";
import { GiFamilyHouse } from "react-icons/gi";
import { IoMdPaper } from "react-icons/io";
import { MdNumbers } from "react-icons/md";
import { FaHashnode } from "react-icons/fa6";
import { FaConnectdevelop } from "react-icons/fa";
import { IoMdColorPalette } from "react-icons/io";
import { FaRegFolderOpen } from "react-icons/fa";

export default function Receive({
  streamID,
  setStreamID,
  isLoadingReceive,
  setIsLoadingReceive,
  isCompleted,
  setIsCompleted,
  authToken,
}) {
  const [data, setData] = useState(null);
  return (
    <div className="flex flex-col items-center justify-center mt-8 w-full">
      <form
        onSubmit={(e) =>
          handleReceiveSubmit(
            e,
            streamID,
            setIsLoadingReceive,
            setIsCompleted,
            authToken,
            setData
          )
        }
        className="w-full relative gap-8"
      >
        {/* INPUTS CONTAINER */}
        <div className="flex flex-row items-center justify-between gap-4 w-1/2 mx-auto mb-8">
          <div className="flex w-full flex-col item-center justify-start gap-2 mt-8">
            <label className="text-xs text-neutral-500 tracking-wider font-extrabold">
              Stream ID
            </label>

            <input
              placeholder="Enter Stream ID"
              className="z-10 w-full py-3 px-6 bg-transparent focus:outline-none rounded-xl border-2 border-[rgba(255,255,255,.1)] text-white placeholder:text-neutral-500 tracking-wider font-bold text-xl"
              value={streamID}
              onChange={(e) => setStreamID(e.target.value)}
            />
          </div>
        </div>
        <div className=" mx-auto flex items-center justify-center gap-8 my-8 flex-wrap">
          {data === null ? (
            isLoadingReceive ? (
              <span className="loader"></span>
            ) : (
              <></>
            )
          ) : (
            <>
              <div className="flex flex-col items-center w-[300px] h-[450px] justify-start rounded-xl card">
                <GiSplashyStream className="text-6xl fill-sky-300 mt-8" />
                <h1 className="text-2xl font-extrabold tracking-widest drop-shadow-md text-white mt-6">
                  Stream Info
                </h1>
                <hr className="w-full h-[2px] rounded-xl bg-[rgba(255,255,255,.05)] border-none px-8"></hr>
                <div className="flex flex-col items-start justify-start gap-2 mt-3 w-full px-8">
                  {/* STREAM ID */}
                  <div className="flex flex-row items-start justify-center gap-4">
                    <HiMiniIdentification className="fill-white text-xl translate-y-[3px]" />
                    <div className="flex flex-col items-start justify-start">
                      <h1 className="text-lg tracking-wider font-bold text-white drop-shadow-md">
                        Stream ID
                      </h1>
                      <p className="text-neutral-500 tracking-wider font-bold text-sm">
                        {data.stream_info.stream_id}
                      </p>
                    </div>
                  </div>
                  {/* STREAM NAME */}
                  <div className="flex flex-row items-start justify-center gap-4">
                    <IoPersonOutline className="fill-white text-xl translate-y-[3px]" />
                    <div className="flex flex-col items-start justify-start">
                      <h1 className="text-lg tracking-wider font-bold text-white drop-shadow-md">
                        Stream Name
                      </h1>
                      <p className="text-neutral-500 tracking-wider font-bold text-sm">
                        {data.stream_info.stream_name}
                      </p>
                    </div>
                  </div>
                  {/* STREAM OWNER */}
                  <div className="flex flex-row items-start justify-center gap-4">
                    <GiFamilyHouse className="fill-white text-xl translate-y-[3px]" />
                    <div className="flex flex-col items-start justify-start">
                      <h1 className="text-lg tracking-wider font-bold text-white drop-shadow-md">
                        Stream Owner
                      </h1>
                      <p className="text-neutral-500 tracking-wider font-bold text-sm">
                        {data.stream_info.stream_owner}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center w-[300px] h-[450px] justify-start rounded-xl card">
                <GiLightningBranches className="text-6xl fill-sky-300 mt-8 " />
                <h1 className="text-2xl font-extrabold tracking-widest drop-shadow-md text-white mt-6">
                  Branch Info
                </h1>
                <hr className="w-full h-[2px] rounded-xl bg-[rgba(255,255,255,.05)] border-none px-8"></hr>
                <div className="flex flex-col items-start justify-center gap-2 mt-3 w-full px-8">
                  {Object.keys(data.branch_info).map((branchKey) => {
                    const branch = data.branch_info[branchKey];
                    return (
                      <div
                        key={branch.branch_id}
                        className="mb-4 flex flex-col items-start justify-center"
                      >
                        {/* BRANCH ID */}
                        <div className="flex flex-row items-start justify-center gap-4">
                          <HiMiniIdentification className="fill-white text-xl translate-y-[3px]" />
                          <div className="flex flex-col items-start justify-start">
                            <h1 className="text-lg tracking-wider font-bold text-white drop-shadow-md">
                              Branch ID
                            </h1>
                            <p className="text-neutral-500 tracking-wider font-bold text-sm">
                              {branch.branch_id}
                            </p>
                          </div>
                        </div>
                        {/* BRANCH NAME */}
                        <div className="flex flex-row items-start justify-center gap-4">
                          <IoPersonOutline className="fill-white text-xl translate-y-[3px]" />
                          <div className="flex flex-col items-start justify-start">
                            <h1 className="text-lg tracking-wider font-bold text-white drop-shadow-md">
                              Branch Name
                            </h1>
                            <p className="text-neutral-500 tracking-wider font-bold text-sm">
                              {branch.branch_name}
                            </p>
                          </div>
                        </div>
                        {/* BRANCH DESCRIPTION */}
                        <div className="flex flex-row items-start justify-center gap-4">
                          <IoMdPaper className="fill-white text-xl translate-y-[3px]" />
                          <div className="flex flex-col items-start justify-start">
                            <h1 className="text-lg tracking-wider font-bold text-white drop-shadow-md">
                              Branch Description
                            </h1>
                            <p className="text-neutral-500 tracking-wider font-bold text-sm">
                              {branch.branch_description}
                            </p>
                          </div>
                        </div>
                        {/* NUM COMMITS */}
                        <div className="flex flex-row items-start justify-center gap-4">
                          <MdNumbers className="fill-white text-xl translate-y-[3px]" />
                          <div className="flex flex-col items-start justify-start">
                            <h1 className="text-lg tracking-wider font-bold text-white drop-shadow-md">
                              Num Commits
                            </h1>
                            <p className="text-neutral-500 tracking-wider font-bold text-sm">
                              {branch.num_commits}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col items-center w-[300px] h-[450px] justify-start rounded-xl card">
                <SiNintendogamecube className="text-6xl fill-sky-300 mt-8" />
                <h1 className="text-2xl font-extrabold tracking-widest drop-shadow-md text-white mt-6">
                  Object Info
                </h1>
                <hr className="w-full h-[2px] rounded-xl bg-[rgba(255,255,255,.05)] border-none px-8"></hr>

                <div className="flex flex-col items-start justify-center gap-2 mt-3 px-8">
                  {/* OBJECT ID */}
                  <div className="flex flex-row items-start justify-center gap-4">
                    <HiMiniIdentification className="fill-white text-xl translate-y-[3px]" />
                    <div className="flex flex-col items-start justify-start relative">
                      <h1 className="text-lg tracking-wider font-bold text-white drop-shadow-md">
                        Object ID
                      </h1>
                      <p className="text-neutral-500 tracking-wider font-bold text-sm break-all ">
                        {data.current_object_info.object_id}
                      </p>
                    </div>
                  </div>
                  {/* NUM VERTICES */}
                  <div className="flex flex-row items-start justify-center gap-4">
                    <FaHashnode className="fill-white text-xl translate-y-[3px]" />
                    <div className="flex flex-col items-start justify-start">
                      <h1 className="text-lg tracking-wider font-bold text-white drop-shadow-md">
                        Num Vertices
                      </h1>
                      <p className="text-neutral-500 tracking-wider font-bold text-sm">
                        {data.current_object_info.num_vertices}
                      </p>
                    </div>
                  </div>
                  {/* NUM FACES */}
                  <div className="flex flex-row items-start justify-center gap-4">
                    <FaConnectdevelop className="fill-white text-xl translate-y-[3px]" />
                    <div className="flex flex-col items-start justify-start">
                      <h1 className="text-lg tracking-wider font-bold text-white drop-shadow-md">
                        Stream Owner
                      </h1>
                      <p className="text-neutral-500 tracking-wider font-bold text-sm">
                        {data.current_object_info.num_faces}
                      </p>
                    </div>
                  </div>
                  {/* NUM COLORS */}
                  <div className="flex flex-row items-start justify-center gap-4">
                    <IoMdColorPalette className="fill-white text-xl translate-y-[3px]" />
                    <div className="flex flex-col items-start justify-start">
                      <h1 className="text-lg tracking-wider font-bold text-white drop-shadow-md">
                        Num Colors
                      </h1>
                      <p className="text-neutral-500 tracking-wider font-bold text-sm">
                        {data.current_object_info.num_colors}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        {!isCompleted ? (
          <motion.button
            whileHover={{ scale: 1.05, opacity: 0.8 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer mx-auto data-btn gap-2 flex items-center justify-center px-6 py-2 rounded-xl text-lg tracking-wider font-bold text-white bg-gradient-to-r from-sky-500 to-blue-500 fill-white"
          >
            <FaDatabase />
            <p>Get Data</p>
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => handleDownloadAllData(e, data)}
            className="flex flex-row items-center justify-center mx-auto gap-2 bg-gradient-to-r from-sky-500 to-blue-500 px-4 py-2 rounded-xl tracking-wider text-lg font-bold text-white mb-20 cursor-pointer"
          >
            <FaRegFolderOpen />
            <p>Download All Data</p>
          </motion.button>
        )}
      </form>
    </div>
  );
}
