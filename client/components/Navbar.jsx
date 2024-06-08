"use client";
import Image from "next/image";
import { useSelector } from "react-redux";
import "../styles/navbar.css";
import { GiStarSattelites } from "react-icons/gi";
import Link from "next/link";

import { setUser } from "../app/Redux/store";
import { useEffect, useState } from "react";
import { navLinks } from "../data";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const [links, setLinks] = useState([]);
  const [activeLink, setActiveLink] = useState("Home");
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSignOut = async () => {
    localStorage.clear();
    await signOut();
    dispatch(setUser(null));
    router.push("/");
  };

  useEffect(() => {
    setLinks(navLinks);
    pathname === "/"
      ? setActiveLink("Home")
      : pathname === "/create"
      ? setActiveLink("Generate")
      : pathname === "/signin"
      ? setActiveLink("Sign in")
      : pathname === "/collection"
      ? setActiveLink("Collection")
      : pathname === "/speckle"
      ? setActiveLink("Speckle")
      : setActiveLink("");
  }, [pathname]);

  return (
    <nav className="fixed w-full py-6 px-12 xl:px-20 flex flex-row items-center justify-between z-50 backdrop-blur-xl">
      {/* LOGO CONTAINER */}
      <div className="flex flex-row items-center justify-center gap-2">
        <Image
          src={"/images/logo.png"}
          alt="logo icon"
          width={40}
          height={40}
          quality={100}
        />
        <p className="text-white tracking-widest text-xl font-bold">
          Meshverse
        </p>
      </div>
      {/* LINKS */}
      <div className="hidden md:flex flex-row items-center justify-center gap-6 px-12  links-container rounded-2xl font-bold tracking-wider">
        {links !== null &&
          links.map((link, index) => (
            <Link key={index} href={link.redirect}>
              <p
                className={`cursor-pointer font-bold tracking-widest text-lg relative py-2 px-4 overflow-hidden transition duration-300 hover:text-neutral-500 ${
                  activeLink === link.title && "text-sky-500"
                }`}
              >
                <span
                  className={`${
                    activeLink == link.title ? "active-link" : "hidden"
                  }`}
                ></span>
                {link.title}
              </p>
            </Link>
          ))}
      </div>

      {/* SIGN IN CONTAINER */}
      <div className="flex flex-row items-center justify-center gap-8 rounded-3xl">
        {user !== null ? (
          <>
            <img
              src={user.image}
              alt="user profile picture"
              className="rounded-full w-[40px]"
            />
            <button
              className={`flex flex-row items-center justify-center gap-2 text-white font-bold tracking-widest bg-red-600 rounded-xl px-6 py-2 cursor-pointer sign-out-btn`}
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </>
        ) : (
          <div
            className={`flex flex-row items-center justify-center gap-2 text-neutral-300 font-bold tracking-widest bg-[rgba(255,255,255,.05)] rounded-xl px-6 py-2 cursor-pointer sign-in-btn ${
              activeLink === "Sign In" &&
              "bg-gradient-to-r from-sky-500 via-blue-400 to-blue-500 text-white"
            } `}
            onClick={() => router.push("/signin")}
          >
            <GiStarSattelites />
            <p>Sign In</p>
          </div>
        )}
      </div>
    </nav>
  );
}
