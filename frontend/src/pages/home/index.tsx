import { NextPage } from "next"
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Home: NextPage = () => {
  return(
    <div className="bg-gradient-to-b from-[#131517] from-10% via-[#00071C] via-50% to-[#00071C] to-90%">
      <Header />
      <Navbar/>
    <section className="max-w-[1080px] h-[727px] mx-auto px-[14px] pt-[48px] pb-[14px]">
      <div className="max-w-[820px] mx-auto">
        <Tabs defaultValue="upcoming">
          <div className="flex justify-between items-center w-full">
            <div className="text-white text-[32px] font-semibold">Events</div>
              <TabsList className="grid grid-cols-2 bg-[#252F3A]">
                <TabsTrigger className="" value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger className="" value="past">Past</TabsTrigger>
              </TabsList>
          </div>

          <TabsContent className="text-white" value="upcoming">
            <div>Upcoming</div>
          </TabsContent>
          <TabsContent className="text-white" value="past">
            <div>Past</div>
          </TabsContent>
        </Tabs>
      </div>
      

    </section>
    </div>
  )
}

export default Home;