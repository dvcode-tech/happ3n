import { NextPage } from "next";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const Signin: NextPage = () => {
  return (
    <div className="bg-black bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat">
      <Header />
      <Navbar />
      <section className="mx-auto h-[727px] max-w-[1080px] px-[14px] pb-[14px] pt-[48px]">
        <div className="flex h-full flex-1 items-center justify-center">
          <div className="flex w-[360px] flex-col rounded-2xl border border-gray-600 bg-gray-500/40 backdrop-blur-md">
            <div className="mb-[24px] flex flex-col gap-0.5 px-[24px] pt-[24px]">
              <div className="text-[22px] font-semibold text-slate-200">
                Welcome to happ3n
              </div>
              <p className="pb-[12px] pt-[1px] text-[14px] text-slate-200">
                Please sign in or sign up below.
              </p>
              <Link
                href="#"
                className="w-f rounded-md bg-gray-200 px-4 py-2 text-center text-[14px] font-medium text-black hover:bg-gray-400"
              >
                Sign In with Identity
              </Link>
            </div>

            <div className="border-t border-t-gray-600 py-[20px]">
              <div className="px-[24px]">
                <Link
                  href="/register"
                  className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md bg-gray-500 py-2 text-sm font-medium text-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950  dark:focus-visible:ring-slate-300"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signin;
