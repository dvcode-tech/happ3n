//TODO:Mobile View

import { NextPage } from "next";
import { useRouter } from "next/router";
import Header from "@/components/Header";

import { LuCamera, LuSearch, LuUsers } from "react-icons/lu";
import { Input } from "@/components/ui/input";

const CheckIn: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#131517] from-10% via-[#00071C] via-50% to-[#00071C] to-90% bg-fixed">
      <Header />

      <section className="flex flex-col">
        <div className="mx-auto flex w-full max-w-[788px] items-center justify-between py-[10px]">
          <div className="flex items-center justify-center gap-2">
            <img
              onClick={() => router.push("/home")}
              className="h-5 cursor-pointer rounded-full"
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
            href={`/check-in/${slug}/scan`}
            className="flex h-fit w-fit items-center gap-2 rounded-lg border border-gray-600/30 bg-[#FFFFFF14] px-[10px] py-[7px] text-[14px] font-semibold leading-none text-[#FFFFFFA3] backdrop-blur-sm"
          >
            <LuCamera /> Scan
          </a>
        </div>

        <div className="w-full bg-[#212325]">
          <div className="relative mx-auto max-w-[788px] py-[4px]">
            <Input
              className="flex h-10 w-full rounded-md border border-none bg-transparent px-3 py-2 pl-10 text-[16px] font-semibold ring-offset-transparent file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-none dark:bg-transparent dark:ring-offset-transparent dark:placeholder:text-[#939597] dark:focus-visible:ring-transparent"
              placeholder="Search for a Guest..."
            />
            <LuSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#ffffff85]" />
          </div>
        </div>

        <div className="mx-auto mt-[64px] flex max-w-[788px] flex-col items-center justify-center">
          <LuUsers className="h-[64px] w-[64px] text-[#FFFFFF80]" />
          <h1 className="mt-[24px] text-[18px] font-bold text-[#FFFFFFC9]">
            No Guests found
          </h1>
          <p className="mt-[8px] text-[16px] font-semibold text-[#FFFFFF80]">
            Share your event page to collect registrations.
          </p>
        </div>
      </section>
    </div>
  );
};

export default CheckIn;
