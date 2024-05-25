import { NextPage } from "next"
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";

const Home: NextPage = () => {
  return(
    <div className="bg-[url('/assets/bg.png')] bg-center bg-cover bg-no-repeat bg-black">
      <Header />
      <Navbar/>
    <section className="max-w-[1080px] h-[727px] mx-auto px-[14px] pt-[48px] pb-[14px]">
      <div className="flex justify-between flex-1 h-full">
        <div className="flex w-[380px] items-center">
          <div className="flex flex-col items-start">
            <img className="h-10 object-scale-down mb-[24px]" src="/assets/logo/logo-main.png" alt="" />
            <h1 className="text-[64px] leading-none text-white font-semibold">Delightful events <br />
            <span className="bg-gradient-to-r from-[#099ef1] from-0% via-[#6863f8] via-19% to-[#d84ffa] to-90% bg-clip-text text-transparent"> starts here.</span></h1>
            <p className="text-[20px] mt-[24px] text-white">Set up an event page, invite friends and sell tickets. Host a memorable event today.</p>
            <button className="mt-[32px] py-2 px-4 rounded-lg text-[18px] bg-white">Create Your First Event</button>
          </div>
        </div>
        
        <div className="flex items-center w-[620px]"></div>
      </div>
    </section>
    </div>
  )
}

export default Home;