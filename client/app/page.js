"use client";
import Image from "next/image";
import { useSelector } from "react-redux";
import "../styles/home.css";

import Landing from "../components/Landing";
import Cards from "../components/Cards";
import Browse from "../components/Browse";
import Stats from "../components/Stats";
import Camera from "../components/Camera";
import SendAndRecieve from "../components/SendAndRecieve";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUser } from "./Redux/store";
import { checkUser } from "../utils/home";

export default function Home() {
  const test = useSelector((state) => state.auth.test);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { data: session } = useSession();

  useEffect(() => {
    if (session && user == null) {
      console.log("entered");
      console.log(session);
      checkUser(session.user.email, session.user.image, dispatch, setUser);
    }
  }, [session]);
  return (
    <main className="flex min-h-[200vh] flex-col items-start justify-start relative ">
      <Image
        src="/Images/background.png"
        alt="background img"
        layout="fill"
        quality={100}
        priority={true}
        className="hidden md:block"
      />

      {/* MAIN CONTENT */}
      <Landing />
      <Cards />
      <Browse />
      <Stats />
      <Camera />
      <SendAndRecieve />
    </main>
  );
}
