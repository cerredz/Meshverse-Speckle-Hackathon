"use client";
import { useEffect, useState } from "react";
import "./styles.css";
import {
  handleSubmit,
  handleChange,
  handleReset,
  handleDownload,
  handleUseCamera,
} from "./utils";
import { LuUpload } from "react-icons/lu";
import { motion } from "framer-motion";
import Image from "next/image";
import GLBViewer from "../../widgets/GLBViewer";
import { usePathname, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MdCameraAlt } from "react-icons/md";
import { downloadMesh } from "../../utils/globals";
import { useCameraSteps } from "./data";

export default function Page() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [isLoading2D, setIsLoading2D] = useState(true);
  const [isLoading3D, setIsLoading3D] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [option, setOption] = useState("Input Image");
  const [cameraSteps, setCameraSteps] = useState([]);
  const searchParams = useSearchParams();
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();
  useEffect(() => {
    const camera = searchParams.get("camera");
    if (camera) setOption("Use Camera");
  }, [fileUrl, searchParams]);

  useEffect(() => {
    if (!user) router.push("/signin");
    setCameraSteps(useCameraSteps);
  }, []);

  return (
    <section
      id="create"
      className="min-h-screen w-full flex flex-col items-center justify-start px-[10%] py-32 gap-12"
    >
      {/* BACKGROUND IMAGE */}
      <Image
        src={"/images/createBackground.png"}
        alt="neon glow background "
        layout="fill"
        quality={100}
        priority={true}
      ></Image>
      {/* TEXT CONTAINER */}
      <div className="flex flex-col items-center justify- gap-2">
        <h1 className="text-3xl md:text-7xl font-bold tracking-wider drop-shadow-md relative create-title">
          Import Image
        </h1>
        {option === "Input Image" ? (
          <p className="text-neutral-500 font-bold tracking-wider text-md z-10">
            Select any image in the following format (.jpg, .png, .jpeg) and
            insert it in the box below
          </p>
        ) : (
          <p className="text-neutral-500 font-bold tracking-wider text-md z-10">
            Create your own custom 3D meshes LIVE! Featuring integration from
            OpenCV&apos;s live camera technology
          </p>
        )}
      </div>
      {/* Option */}
      <div className="text-neutral-500 flex flex-row items-center justify-center  rounded-2xl option-container z-10 border-2 border-[rgba(255,255,255,.1)] overflow-hidden">
        <p
          className={` cursor-pointer font-bold text-md tracking-wider transition px-8 py-2 duration-500 ${
            option == "Input Image"
              ? "text-white bg-sky-500"
              : "hover:bg-[rgba(255,255,255,.1)]"
          } z-10`}
          onClick={() => {
            setOption("Input Image");
          }}
        >
          Input Image
        </p>
        <p
          className={`text-neutral-500 cursor-pointer font-bold text-md tracking-wider transition px-8 py-2 duration-500 hover:bg-[rgba(255,255,255,.1)] ${
            option == "Use Camera"
              ? "text-white bg-sky-500"
              : "hover:bg-[rgba(255,255,255,.1)]"
          }`}
          onClick={() => {
            setOption("Use Camera");
          }}
        >
          Use Camera
        </p>
      </div>
      {/* File Input */}
      {option === "Input Image" ? (
        <form
          onSubmit={(e) =>
            handleSubmit(e, user.email, fileUrl, setCompleted, setIsLoading3D)
          }
          className="w-full relative"
        >
          {file === null ? (
            <>
              <div className="w-1/2 mx-auto h-[40vh] border-2 border-neutral-500 border-dashed rounded-xl relative flex items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleChange(e, setIsLoading2D, setFile, setFileUrl)
                  }
                  className="opacity-0 absolute w-full h-full z-10"
                />
                <div className="absolute flex flex-col items-center justify-center gap-2">
                  <LuUpload className="text-6xl text-neutral-600 " />
                  <p className="font-bold tracking-wider text-sm">
                    Drop File Here
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="w-1/2 mx-auto h-[40vh] border-dashed rounded-xl relative flex items-center justify-center">
              {isLoading2D ? (
                <>
                  {/* uploading 2d image */}
                  <span className="loader"></span>
                </>
              ) : (
                <>
                  {/* User uploaded 2d image, display it back to them */}
                  {fileUrl != null && !completed && !isLoading3D && (
                    <Image
                      src={`/images/user/${fileUrl}`}
                      alt="user uploaded image"
                      layout="fill"
                      objectFit="contain"
                    />
                  )}
                  {/* loading 3d image */}
                  {fileUrl != null && isLoading3D && (
                    <span className="loader"></span>
                  )}
                  {/* 3d image is loaded, display it */}
                  {fileUrl != null && completed && !isLoading3D && (
                    <GLBViewer
                      fileUrl={`/images/collection/${fileUrl}.glb`}
                      scale={2}
                      height="500px"
                    />
                  )}
                </>
              )}
            </div>
          )}

          {!completed ? (
            <div className="w-full flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                type="submit"
                className="mx-auto bg-gradient-to-r from-sky-400 via-sky-500 to-sky-500 mt-12 px-6 py-2 rounded-xl text-lg font-bold tracking-wider text-white"
              >
                Convert Image
              </motion.button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  handleReset(
                    setCompleted,
                    setFile,
                    setFileUrl,
                    setIsLoading2D,
                    setIsLoading3D
                  )
                }
                className=" bg-gradient-to-r from-sky-400 via-sky-500 to-sky-500 mt-12 px-6 py-2 rounded-xl text-lg font-bold tracking-wider text-white"
              >
                Convert Next
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  handleDownload(
                    fileUrl,
                    setFile,
                    setFileUrl,
                    setIsLoading2D,
                    setIsLoading3D,
                    setCompleted
                  )
                }
                className=" bg-gradient-to-r from-blue-400 via-blue-500 to-blue-500 mt-12 px-6 py-2 rounded-xl text-lg font-bold tracking-wider text-white"
              >
                Download
              </motion.button>
              <Link href={`/speckle?receive=true`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className=" bg-gradient-to-r from-sky-500 via-sky-600 to-sky-500 mt-12 px-6 py-2 rounded-xl text-lg font-bold tracking-wider text-white "
                >
                  View Speckle Data
                </motion.button>
              </Link>
            </div>
          )}
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2">
          {!completed && !isLoading3D && (
            <div className="flex flex-row items-center justify-center gap-6 flex-wrap">
              {cameraSteps.map((step, index) => (
                <div
                  key={index}
                  className="w-[250px] h-[200px] p-8 rounded-xl step-card border-2 border-[rgba(255,255,255,.05)] flex items-start justify-start flex-col z-10"
                >
                  <h1 className="text-2xl font-extrabold tracking-wider drop-shadow-md">
                    {step.title}
                  </h1>
                  <p className="text-sm tracking-wider text-neutral-500 font-bold">
                    {step.subtitle}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* LOADING THE 3D OBJECT*/}
          {!completed && isLoading3D && <span className="loader mt-8"></span>}
          {!completed && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={() =>
                handleUseCamera(
                  user.email,
                  setFileUrl,
                  setCompleted,
                  setIsLoading3D
                )
              }
              className="z-10 mx-auto mt-8 tracking-wider text-white fill-white font-bold flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-lg"
            >
              <MdCameraAlt />
              <p>Use Camera</p>
            </motion.button>
          )}

          {completed && (
            <>
              <GLBViewer
                fileUrl={`/images/collection/${fileUrl}.glb`}
                scale={2.2}
                height="300px"
              />

              <div className="w-full flex items-center justify-center gap-8 z-10">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    handleReset(
                      setCompleted,
                      setFile,
                      setFileUrl,
                      setIsLoading2D,
                      setIsLoading3D
                    )
                  }
                  className=" bg-gradient-to-r from-sky-400 via-sky-500 to-sky-500 mt-12 px-6 py-2 rounded-xl text-lg font-bold tracking-wider "
                >
                  Reset
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => downloadMesh(fileUrl)}
                  className=" bg-gradient-to-r from-purple-400 to-purple-500 mt-12 px-6 py-2 rounded-xl text-lg font-bold tracking-wider "
                >
                  Download
                </motion.button>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
