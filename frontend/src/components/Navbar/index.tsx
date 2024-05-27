import { NextPage } from "next";
import { useEffect, useState } from "react";

const Navbar: NextPage = () => {
  const [time, setTime] = useState("");

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
    <section className="sticky top-0 flex flex-1 items-center justify-between px-[16px] py-[12px]">
      <a href="/">
        <img className="h-5" src="/assets/logo/icon.png" alt="" />
      </a>
      <div className="flex items-center gap-4 text-[14px] font-medium text-[#FFFFFFA3]">
        <div className="hidden md:block">{time} GMT+8</div>
        <button>Explore Events</button>
        <a
          href="/signin"
          className="rounded-3xl bg-gray-500/50 px-4 py-1 text-[14px] text-[#FFFFFFA3] hover:bg-gray-400"
        >
          Sign In
        </a>
      </div>
    </section>
  );
};

export default Navbar;
