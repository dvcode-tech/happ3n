import { NextPage } from "next";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Signin: NextPage = () => {
  return (
    <div className="min-h-screen bg-black bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat">
      <Header />
      <Navbar />
      <section className="mx-auto h-[727px] max-w-[1080px] px-[14px] pb-[14px] pt-[48px]">
        <div className="flex h-full flex-1 items-center justify-center">
          <div className="flex w-[360px] flex-col rounded-2xl border border-gray-600 bg-gray-500/40 backdrop-blur-md">
            <div className="mb-[16px] flex flex-col gap-0.5 px-[24px] pt-[24px]">
              <div className="text-[22px] font-semibold text-slate-200">
                Welcome to happ3n
              </div>
              <p className="py-[2px] text-[14px] text-slate-200">
                Please sign in or sign up below.
              </p>
            </div>
            <div className="flex flex-col gap-2 px-[24px] pb-[20px] text-white">
              <Input type="text" placeholder="Name" />
              <Input type="text" placeholder="Username" />
              <Input type="email" placeholder="Email" />
              <Button type="submit">Register</Button>
            </div>
            <div className="border-t border-t-gray-600 py-[20px]">
              <div className="px-[24px]">
                <a
                  href="/signin"
                  className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md bg-[#404953] py-2.5 text-sm font-medium text-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950  dark:focus-visible:ring-slate-300"
                >
                  Sign In
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signin;
