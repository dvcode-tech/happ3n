//TODO:Mobile View
//TODO:Scanner

import { useState } from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import Header from "@/components/Header";
import { LuUsers, LuArrowUpRight } from "react-icons/lu";

const Scan: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [checkedIn, setCheckedIn] = useState(45);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#131517] from-10% via-[#00071C] via-50% to-[#00071C] to-90% bg-fixed">
      <Header />
      <section className="flex flex-col">
        <div className="mx-auto flex w-full max-w-[788px] items-center justify-between px-[16px] py-[10px]">
          <div className="flex items-center justify-center gap-2">
            <img
              className="h-5 rounded-full"
              src="/assets/logo/icon.png"
              alt=""
            />
            <div>
              <div className="text-[16px] font-medium text-[#FFFFFF]">
                DvCode General Assembly
              </div>
              <p className="text-[13px] text-[#FFFFFFCC]">
                Started 7 hours ago
              </p>
            </div>
          </div>
          <a
            href={`/check-in/${slug}`}
            className="flex h-fit w-fit items-center gap-2 rounded-lg border border-gray-600/30 bg-[#FFFFFF14] px-[10px] py-[7px] text-[14px] font-semibold leading-none text-[#FFFFFFA3] backdrop-blur-sm"
          >
            <LuUsers /> Guests
          </a>
        </div>
        <div className="border-t border-gray-600/30"></div>
        <div className="mx-auto max-w-[788px] space-y-6 p-[16px]">
          <div className="aspect-square h-[666px] w-[750px] rounded-lg bg-blue-900"></div>
          <div className="flex flex-row justify-between rounded-md border border-gray-600/30 bg-gray-500/20 p-4 backdrop-blur-md">
            <div className="flex w-full flex-col">
              <div className="flex w-full justify-between pb-[8px]">
                <div className="text-[20px] text-[#939597]">
                  {checkedIn} <span className="text-[14px]">Checked In</span>
                </div>
                <div className="text-[14px] text-[#939597]">
                  50 <span>Going</span>
                </div>
              </div>

              <progress
                value={checkedIn}
                max={50}
                className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
              />
              <div className="flex items-center pt-3 text-[14px] leading-none text-[#D2D4D7]">
                <span className="mr-1 inline-flex h-1 w-1 rounded-full bg-[#D2D4D7]"></span>
                {1} <span className="ml-1 text-[14px]">Not Going</span>
              </div>

              <a
                href="#"
                className="mt-[24px] flex items-center text-[14px] text-[#FFFFFF80]"
              >
                Manage Event Page <LuArrowUpRight />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Scan;
