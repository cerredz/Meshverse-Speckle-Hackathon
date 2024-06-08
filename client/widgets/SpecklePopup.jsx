"use client";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { setSpeckleAuthToken } from "../app/Redux/store";

export default function SpecklePopup({ required, close }) {
  const [authToken, setAuthToken] = useState("");
  const dispatch = useDispatch();

  const handleUpdate = () => {
    dispatch(setSpeckleAuthToken({ speckle_auth_token: authToken }));
    close();
    localStorage.setItem(
      "meshverse-speckle-auth-token",
      JSON.stringify(authToken)
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      className="w-full h-screen fixed z-50 backdrop-blur-md flex items-center justify-center"
    >
      {/* CONTENT CONTAINER */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: { duration: 0.5, delay: 0.4 },
        }}
        className="origin-center p-16 rounded-xl bg-black border-2 border-[rgba(255,255,255,.1)] flex flex-col items-center justify-start gap-4"
      >
        <h1 className="text-5xl font-extrabold drop-shadow-md text-white tracking-widest speckle-data-title relative">
          Speckle Data Required
        </h1>
        <p className="text-neutral-500 tracking-wider text-sm font-bold max-w-xl text-center">
          In order to view 3D Meshes&apos; corresponding Speckle Data you must
          provide your Speckle authorization token so that we can fetch the
          data.
        </p>
        <input
          className="font-bold tracking-wider px-8 focus:outline-none py-2 placeholder:text-neutral-500 text-md bg-transparent border-2 border-[rgba(255,255,255,.1)] rounded-xl w-[400px]"
          placeholder="Enter Auth Token"
          value={authToken}
          onChange={(e) => setAuthToken(e.target.value)}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleUpdate()}
          className="px-6 py-2 text-md tracking-widest font-bold text-white rounded-lg bg-gradient-to-r from-red-500 to-red-600"
        >
          Update
        </motion.button>
      </motion.div>
    </motion.section>
  );
}
