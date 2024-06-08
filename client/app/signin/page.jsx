"use client";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useEffect } from "react";

export default function Page() {
  const handleSignIn = async () => {
    try {
      await signIn("google");
    } catch (error) {
      console.error("Error signing in", error);
    }
  };

  return (
    <section
      id="sign-in"
      className="relative w-full h-screen flex items-center justify-center"
    >
      {/* BACKGROUND VIDEO */}
      <video
        className="absolute top-0 left-0 h-full w-full object-cover opacity-50"
        autoPlay
        loop
        muted
      >
        <source src={"/videos/waves.mp4"} />
      </video>
      <div className="rounded-xl p-24 border-2 border-[rgba(255,255,255,.1)] bg-[rgba(0,0,0,.8)] flex flex-col items-center justify-center relative">
        <div
          onClick={() => handleSignIn()}
          className="bg-[rgba(255,255,255,.1)] px-6 py-3  rounded-xl border-2 border-[rgba(255,255,255,.1)] opacity-75 cursor-pointer hover:scale-105 transition duration-300"
        >
          <Image
            src={"/images/google.png"}
            alt="google icon"
            width={480}
            height={480}
            quality={100}
            className="w-[50px] h-[50px]"
          />
        </div>
      </div>
    </section>
  );
}
