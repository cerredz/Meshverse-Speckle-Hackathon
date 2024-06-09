"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SpecklePopup from "../../widgets/SpecklePopup";
import { useSelector, useDispatch } from "react-redux";
import { AnimatePresence } from "framer-motion";
import "./styles.css";

import GLBViewer from "../../widgets/GLBViewer";
import OBJViewer from "../../widgets/OBJViewer";
import { handleChange, handleSubmit } from "./utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { handleReset } from "../create/utils";
import Send from "./send";
import Receive from "./receive";

export default function Page() {
  const searchParams = useSearchParams();
  const [option, setOption] = useState("Send");
  const speckleAuthToken = useSelector(
    (state) => state.auth.speckle_auth_token
  );
  const [showPopup, setShowPopup] = useState(false);
  const [streamID, setStreamID] = useState("");
  const [streamName, setStreamName] = useState("");
  const [fileUrl, setFileUrl] = useState(null);
  const [isLoadingMesh, setIsLoadingMesh] = useState(false);
  const [isLoadingAddingToSpeckle, setIsLoadingAddingToSpeckle] =
    useState(false);
  const [isLoadingReceive, setIsLoadingReceive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState({});

  useEffect(() => {
    const receive = searchParams.get("receive");
    if (receive) setOption("Receive");
  }, [searchParams]);

  useEffect(() => {
    if (speckleAuthToken === null) {
      setShowPopup(true);
      console.log(speckleAuthToken);
    }
  }, [speckleAuthToken]);

  return (
    <section
      id="speckle"
      className="min-h-screen w-full px-[10%] relative flex items-center justify-center"
    >
      <Image
        src={"/images/specklebg.png"}
        alt="neon background glows"
        layout="fill"
        quality={100}
        priority={true}
      />
      {/* CONTENT CONTAINER */}
      <div className="flex flex-col items-center justify-start w-full pt-32 min-h-screen">
        {/* TEXT CONTAINER */}
        <div className="flex flex-col items-center justify-center gap-2 ">
          <h1 className="text-3xl md:text-7xl font-bold tracking-wider drop-shadow-md relative speckle-title z-10">
            Speckle
          </h1>
          {option == "Send" ? (
            <p className="text-neutral-500 font-bold tracking-wider text-md z-10 max-w-2xl text-center">
              Select any image in the following format(.obj) and insert it below
              to add it into the Speckle Client. Fill out the Stream Name to
              insert your 3D Mesh into a new Stream on Speckle.
            </p>
          ) : (
            <p className="text-neutral-500 font-bold tracking-wider text-md z-10 max-w-lg text-center">
              Fill out the below Stream ID to recieve information about the
              corresponding 3D Mesh in Speckle
            </p>
          )}
        </div>
        {/* OPTIONS */}
        <div className="mt-4 text-neutral-500 flex flex-row items-center justify-center  rounded-2xl option-container z-10 border-2 border-[rgba(255,255,255,.1)] overflow-hidden">
          <p
            className={` cursor-pointer font-bold text-md tracking-wider transition px-8 py-2 duration-500 ${
              option == "Send"
                ? "text-white bg-sky-500"
                : "hover:bg-[rgba(255,255,255,.1)]"
            } z-10`}
            onClick={() => {
              setOption("Send");
            }}
          >
            Send
          </p>
          <p
            className={`text-neutral-500 cursor-pointer font-bold text-md tracking-wider transition px-8 py-2 duration-500 hover:bg-[rgba(255,255,255,.1)] ${
              option == "Receive"
                ? "text-white bg-sky-500"
                : "hover:bg-[rgba(255,255,255,.1)]"
            }`}
            onClick={() => {
              setOption("Receive");
            }}
          >
            Receive
          </p>
        </div>
        {/* INPUTS CONTAINER */}
        {option === "Send" ? (
          <Send
            streamID={streamID}
            setStreamID={setStreamID}
            streamName={streamName}
            setStreamName={setStreamName}
            fileUrl={fileUrl}
            setFileUrl={setFileUrl}
            isLoadingMesh={isLoadingMesh}
            setIsLoadingMesh={setIsLoadingMesh}
            isLoadingAddingToSpeckle={isLoadingAddingToSpeckle}
            isCompleted={isCompleted}
            handleSubmit={(e) =>
              handleSubmit(
                e,
                fileUrl,
                speckleAuthToken,
                streamName,
                setIsLoadingAddingToSpeckle,
                setIsCompleted,
                setError,
                setStreamID,
                setStreamName
              )
            }
            handleReset={() => {
              setStreamID("");
              setStreamName("");
              setFileUrl(null);
              setIsLoadingMesh(false);
              setIsLoadingAddingToSpeckle(false);
              setIsCompleted(false);
              setError({});
            }}
          />
        ) : (
          <Receive
            streamID={streamID}
            setStreamID={setStreamID}
            setIsLoadingReceive={setIsLoadingReceive}
            setIsCompleted={setIsCompleted}
            authToken={speckleAuthToken}
            isLoadingReceive={isLoadingReceive}
            isCompleted={isCompleted}
          />
        )}
      </div>

      <AnimatePresence>
        {showPopup && (
          <SpecklePopup required="true" close={() => setShowPopup(false)} />
        )}
      </AnimatePresence>
    </section>
  );
}
