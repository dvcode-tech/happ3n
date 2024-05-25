import { NextPage } from "next"
import Header from "@components/Header";
import Navbar from "@components/Navbar";


const Home: NextPage = () => {
  return(
    <div className="bg-gradient-to-b from-[#131517] from-10% via-[#00071C] via-50% to-[#00071C] to-90%">
      <Header />
      <Navbar/>
    <section className="max-w-[1080px] h-[727px] mx-auto px-[14px] pt-[48px] pb-[14px]">
      <div className="pt-[48px] flex justify-between">
        <div className="text-white text-[32px] font-semibold">Events</div>
        <div></div>
      </div>
    </section>
    </div>
  )
}

export default Home;