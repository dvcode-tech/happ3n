import { NextPage } from "next"
import { useEffect, useState } from "react";

const Navbar: NextPage = () => {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
          const now = new Date();
          const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Asia/Singapore' };
          const formattedTime = new Intl.DateTimeFormat('en-US', ).format(now);
          setTime(formattedTime);
        };
    
        updateTime();
        const intervalId = setInterval(updateTime, 1000);
    
        return () => clearInterval(intervalId);
      }, []);
    
  return(
    <section className="flex justify-between items-center flex-1 px-[16px] py-[12px] sticky top-0">
        <a href="/">
            <img className="h-5" src="/assets/logo/icon.png" alt="" />
        </a>
        <div className="flex gap-4 font-medium text-[14px] text-[#FFFFFFA3] items-center">
            <div className="md:block hidden">{time} GMT+8</div>
            <button>Explore Events</button>
            <a href="/signin" className="rounded-3xl px-4 py-1 text-[14px] bg-gray-500/50 hover:bg-gray-400 text-[#FFFFFFA3]">Sign In</a>
        </div>
    </section>
  )
}

export default Navbar;