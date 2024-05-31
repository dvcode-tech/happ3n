/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { useHappenContext } from "@/context/HappenContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { LoginButton } from "@/components/AuthButton";

const Home: NextPage = () => {
  const router = useRouter();
  const { restoreSession, ctxAccount, isAuthenticated } = useHappenContext();

  useEffect(() => {
    if (!ctxAccount) {
      restoreSession();
    } else {
      router.push("/home");
    }
  }, [ctxAccount]);

  return (
    <div className="min-h-screen bg-black bg-[url('/assets/bg.png')] bg-cover bg-no-repeat md:bg-center">
      <Header />
      <Navbar />
      <section className="mx-auto h-screen max-w-[1080px] px-[16px] pb-[14px] pt-[20px] md:h-[727px] md:px-[14px] md:pt-[48px]">
        <div className="flex h-full flex-1 flex-col md:flex-row md:justify-between">
          <div className="flex flex-1 md:w-[380px] md:items-center">
            <div className="mt-[16px] flex flex-col md:items-start">
              <img
                className="mb-[24px] h-7 object-scale-down px-1 md:h-8"
                src="/assets/logo/logo-main.png"
                alt=""
              />
              <h1 className="text-center text-[40px] font-semibold leading-none text-white md:text-left md:text-[64px]">
                Where Great <br />
                <span className="via-19% bg-gradient-to-r from-[#099ef1] from-0% via-[#6863f8] to-[#d84ffa] to-90% bg-clip-text text-transparent">
                  {" "}
                  Events Begin!
                </span>
              </h1>
              <p className="mt-[24px] text-center text-[16px] text-white md:text-left md:text-[20px]">
                Set up an event page, invite friends and sell tickets. Host a
                memorable event today.
              </p>
              {ctxAccount && (
                <button
                  onClick={() => {
                    router.push("/create");
                  }}
                  className="mx-auto mt-[32px] rounded-lg bg-white px-4 py-2 text-[16px] md:mx-0 md:text-[18px]"
                >
                  Create Your First Event
                </button>
              )}
              {!isAuthenticated && (
                <LoginButton className="mx-auto mt-[32px] rounded-lg bg-white px-4 py-2 text-[16px] md:mx-0 md:text-[18px]">
                  Create Your First Event
                </LoginButton>
              )}
            </div>
          </div>

          <div className="flex w-[620px] items-center"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;
