import { FaCamera } from "react-icons/fa6";
import { motion } from "framer-motion";
import { RiAiGenerate } from "react-icons/ri";
import Image from "next/image";
import { MdPhoneIphone } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { IoLogoReact } from "react-icons/io5";
import Link from "next/link";

export default function Camera() {
  const bulletData = [
    {
      icon: <MdPhoneIphone />,
      title: "Accessibility ",
      subtitle:
        "All you need now is a camera to create super-precise 3D meshes",
    },
    {
      icon: <IoLogoReact />,
      title: "Innovation",
      subtitle:
        "Stay ahead with cutting-edge artificial intelligence technology for creating 3D models",
    },
    {
      icon: <FiUser />,
      title: "User-Friendly",
      subtitle:
        "Designed with user experience in mind, making it easy for anyone to use",
    },
  ];
  return (
    <section
      id="camera"
      className="w-full relative py-20 flex flex-col items-center justify-center gap-16"
    >
      {/* TEXT CONTAINER */}
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="border border-sky-400 flex flex-row items-center justify-center text-sky-400 gap-2 text-xs rounded-3xl px-4 py-1 font-bold tracking-wider">
          <FaCamera />
          <p>Photography</p>
        </div>
        <h1 className="text-6xl font-bold tracking-wider text-center drop-shadow-md ">
          Generate Meshes With your{" "}
          <span className="text-sky-500 underline ">Camera</span>
        </h1>
        <p className="text-neutral-500 font-bold tracking-wider max-w-4xl text-center">
          Use your camera on your phone, laptop, computer, or any other
          compatible device anywhere, anytime, and anyplace to create unqiue 3d
          meshes. Click the button below to see the process for yourself
        </p>
        <Link href={"/create?camera=true"}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer mt-2 flex flex-row items-center justify-center gap-2 rounded-xl px-4 py-2 text-lg font-bold tracking-wider bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500"
          >
            <RiAiGenerate />
            <p>Generate</p>
          </motion.div>
        </Link>
      </div>

      {/* IMAGE CONTAINER */}
      <div className="relative w-9/12 mx-auto flex flex-row rounded-xl items-center justify-between bg-[#08030D] z-10 h-[60vh] pr-12">
        <div className="flex basis-3/5 h-full items-start justify-start relative ">
          <Image
            src={"/images/camera.png"}
            alt="camera icon"
            layout="fill"
            objectFit="contain"
            quality={100}
            priority={true}
          />
        </div>
        <div className="flex flex-col items-center justify-start gap-6 basis-2/5">
          {bulletData.map((bullet, index) => (
            <div
              key={index}
              className="flex flex-row items-start justify-start gap-4"
            >
              <div className="text-2xl flex items-start justify-start translate-y-[4px]">
                {bullet.icon}
              </div>
              <div className="flex flex-col items-start justify-start gap-2">
                <h1 className="text-3xl font-extrabold tracking-widest drop-shadow-md">
                  {bullet.title}
                </h1>
                <p className="text-neutral-500 font-bold tracking-wider text-sm max-w-md">
                  {bullet.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}