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
      <div className="bg-red-500">
        <Tabs defaultValue="account" className="flex justify-between bg-green-500">
            <div>
                <div className="text-white text-[32px] font-semibold">Events</div>
                    <div className="flex flex-col flex-1 items-end justify-center bg-red-50">
                        <TabsList className="grid grid-cols-2">
                            <TabsTrigger value="account">Account</TabsTrigger>
                            <TabsTrigger value="password">Password</TabsTrigger>
                        </TabsList>
                    </div>
            </div>
            <TabsContent className="flex flex-1 items-start justify-normal" value="account">
                <div>Helloee</div>
            </TabsContent>
        </Tabs>
      </div>
    </section>
    </div>
  )
}

export default Home;