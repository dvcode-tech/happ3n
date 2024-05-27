/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { useAuth, useRestActor } from "@bundly/ares-react";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const backend = useRestActor("backend");
  const { isAuthenticated, identity } = useAuth();
  const router = useRouter();

  const fetchUserInfo = async () => {
    try {
      const userInfo = await backend.get("/user/me");
      console.log("userInfo", userInfo);
      return true;
    } catch (error) {
      console.error({ error });
      return false;
    }
  };

  useEffect(() => {
    const checkAuthUser = async () => {
      if (!isAuthenticated) return;

      if (await fetchUserInfo()) {
        router.push("/home");
      } else {
        router.push("/register");
      }
    };

    checkAuthUser();
  }, [isAuthenticated]);

  return (
    <div className="bg-black min-h-screen bg-[url('/assets/bg.png')] bg-cover bg-no-repeat md:bg-center">
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
                Delightful events <br />
                <span className="via-19% bg-gradient-to-r from-[#099ef1] from-0% via-[#6863f8] to-[#d84ffa] to-90% bg-clip-text text-transparent">
                  {" "}
                  starts here.
                </span>
              </h1>
              <p className="mt-[24px] text-center text-[16px] text-white md:text-left md:text-[20px]">
                Set up an event page, invite friends and sell tickets. Host a
                memorable event today.
              </p>
              <button className="mx-auto mt-[32px] rounded-lg bg-white px-4 py-2 text-[16px] md:mx-0 md:text-[18px]">
                Create Your First Event
              </button>
            </div>
          </div>

          <div className="flex w-[620px] items-center"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;
