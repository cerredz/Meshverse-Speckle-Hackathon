"use client";
import { useEffect, useState } from "react";
import GLBViewer from "../../widgets/GLBViewer";
import { usePathname } from "next/navigation";
import { getUser } from "./utils";
import { AnimatePresence, motion } from "framer-motion";
import { downloadMesh } from "../../utils/globals";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isHoveringImage, setIsHoveringImage] = useState(null);
  useEffect(() => {
    console.log(pathname);
    const username = pathname.slice(1);
    const fetchData = async () => {
      await getUser(username, setUser);
    };

    fetchData();
  }, [pathname]);
  return (
    <section id="username" className="w-full relative min-h-screen px-[10%]">
      {/* BACKGROUND IMAGE */}
      <Image
        src={"/images/usernameBackground.png"}
        alt="neon glow background"
        layout="fill"
        quality={100}
        priority={true}
      />
      <div className="flex flex-row items-start justify-start gap-8 pt-32">
        {user !== null ? (
          user.files.map((url, index) => (
            <div
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
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </section>
  );
}
