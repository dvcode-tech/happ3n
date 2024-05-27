/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { AuthButton } from "@bundly/ares-react";

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

const Navbar: NextPage = () => {
  const [time, setTime] = useState("");
  const currentTime = new Date();
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Singapore",
      };
      const formattedTime = new Intl.DateTimeFormat("en-US").format(now);
      setTime(formattedTime);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="sticky z-[98] top-0 bg-[#131517]/50 flex flex-1 items-center justify-between px-[16px] py-[12px]">
      <a href="/">
        <img className="h-5" src="/assets/logo/icon.png" alt="" />
      </a>
      <div className="flex items-center gap-4 text-[14px] font-medium text-[#FFFFFFA3]">
        <div className="hidden md:block">{formatTime(currentTime)} GMT+8</div>
        <button>Explore Events</button>
        {/* <a
          href="/signin"
          className="rounded-3xl bg-gray-500/50 px-4 py-1 text-[14px] text-[#FFFFFFA3] hover:bg-gray-400"
        >
          Sign In
        </a> */}
        <AuthButton
          loginButtonStyle={{
            borderRadius: "1.5rem",
            backgroundColor: "rgb(107 114 128 / 0.5)",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            paddingTop: "0.25rem",
            paddingBottom: "0.25rem",
            fontSize: "14px",
            color: "#FFFFFFA3",
          }}
          logoutButtonStyle={{
            borderRadius: "1.5rem",
            backgroundColor: "rgb(107 114 128 / 0.5)",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            paddingTop: "0.25rem",
            paddingBottom: "0.25rem",
            fontSize: "14px",
            color: "#FFFFFFA3",
          }}
        />
      </div>
    </section>
  );
};

export default Navbar;
