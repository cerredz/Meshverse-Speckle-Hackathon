"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import GLBViewer from "../../../widgets/GLBViewer";
import { downloadMesh } from "../../../utils/globals";
import { motion, AnimatePresence } from "framer-motion";
import "./styles.css";
import { useSelector, useDispatch } from "react-redux";
//import { setSpeckleAuthToken, setSpeckleStreamID } from "../../Redux/Store";
import SpecklePopup from "../../../widgets/SpecklePopup";
import Image from "next/image";

export default function Page() {
  const pathname = usePathname();
  const [meshUrl, setMeshUrl] = useState(null);

  const speckleAuthToken = useSelector(
    (state) => state.auth.speckle_auth_token
  );
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    const parts = pathname.split("/");
    const url = parts[2];
    setMeshUrl(url);
  }, [pathname]);

  useEffect(() => {
    if (speckleAuthToken !== null) {
      setShowPopup(false);
    } else {
      setShowPopup(true);
    }

    console.log(speckleAuthToken);
  }, [speckleAuthToken]);
  return (
    <section className="w-full min-h-screen relative px-[10%] flex flex-col lg:flex-row items-center justify-center gap-12">
      <Image
        src={"/images/collectionUrl.png"}
        alt="neon background glows"
        layout="fill"
        quality={100}
        priority={true}
      />
      <div className="flex basis-1/2 relative">
        {meshUrl !== null ? (
          <div className="w-full flex flex-col items-center justify-center gap-4 relative">
            <div className="w-full rounded-xl border-2 border-[rgba(255,255,255,.1)]">
              <GLBViewer
                fileUrl={`/images/collection/${meshUrl}.glb`}
                scale={2}
                height={600}
              />
            </div>
            <motion.button
              onClick={() => downloadMesh(meshUrl)}
              className="bg-gradient-to-r from-sky-500 via-blue-400 to-sky-500 rounded-md w-full py-2 text-md tracking-widest font-bold text-white transition duration-300 hover:opacity-50"
            >
              Download
            </motion.button>
          </div>
        ) : (
          <span className="loader"></span>
        )}
      </div>
    </section>
  );
}
