/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAuth } from "@bundly/ares-react";
import { LoginButton, LogoutButton } from "../AuthButton";
import Link from "next/link";

const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const Navbar: NextPage = () => {
  const { isAuthenticated } = useAuth();
  const [time, setTime] = useState("");
  const currentTime = new Date();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = new Intl.DateTimeFormat("en-US").format(now);
      setTime(formattedTime);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="sticky top-0 z-[98] flex flex-1 items-center justify-between bg-[#131517]/50 px-[16px] py-[12px]">
      <Link href="/">
        <img className="h-5" src="/assets/logo/icon.png" alt="" />
      </Link>
      <div className="flex items-center gap-4 text-[14px] font-medium text-[#FFFFFFA3]">
        <div className="hidden md:block">{formatTime(currentTime)} GMT+8</div>
        {/* <button>Explore Events</button> */}
        <Link href="/create" className="text-[14px]">
          Create Event
        </Link>
        {isAuthenticated ? (
          <LogoutButton className="rounded-3xl bg-gray-500/50 px-4 py-1 text-[14px] text-[#FFFFFFA3] hover:bg-gray-400" />
        ) : (
          <LoginButton className="rounded-3xl bg-gray-500/50 px-4 py-1 text-[14px] text-[#FFFFFFA3] hover:bg-gray-400" />
        )}
      </div>
    </section>
  );
};

export default Navbar;
