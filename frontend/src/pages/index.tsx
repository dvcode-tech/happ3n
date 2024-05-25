import { NextPage } from "next"
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";

const Home: NextPage = () => {
  return(
    <div className="bg-[url('/assets/bg.png')] md:bg-center bg-cover bg-no-repeat bg-black">
      <Header />
      <Navbar/>
    <section className="max-w-[1080px] h-screen md:h-[727px] mx-auto px-[16px] md:px-[14px] pt-[20px] md:pt-[48px] pb-[14px]">
      <div className="flex flex-1 flex-col md:flex-row md:justify-between h-full">
        <div className="flex flex-1 md:w-[380px] md:items-center">
          <div className="flex flex-col md:items-start mt-[16px]">
            <img className="h-7 md:h-8 object-scale-down mb-[24px] px-1" src="/assets/logo/logo-main.png" alt="" />
            <h1 className="text-[40px] md:text-[64px] leading-none text-white text-center md:text-left font-semibold">Delightful events <br />
            <span className="bg-gradient-to-r from-[#099ef1] from-0% via-[#6863f8] via-19% to-[#d84ffa] to-90% bg-clip-text text-transparent"> starts here.</span></h1>
            <p className="text-[16px] md:text-[20px] mt-[24px] text-center md:text-left text-white">Set up an event page, invite friends and sell tickets. Host a memorable event today.</p>
            <button className="mt-[32px] py-2 px-4 rounded-lg text-[16px] md:text-[18px] mx-auto md:mx-0 bg-white">Create Your First Event</button>
          </div>
        </div>
        
        <div className="flex items-center w-[620px]"></div>
      </div>
    </section>
    </div>
  )
}

export default Home;