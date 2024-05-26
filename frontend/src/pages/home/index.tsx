import { NextPage } from "next"
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const timelineData = [
  { date: 'May 1', time: '3:00 PM', title: 'Bridging Web2 and Web3 for Philippine Innovation', location: 'San Jose Delmonte Bulacan'},
  { date: 'May 1', time: '3:00 PM', title: 'Bridging Web2 and Web3 for Philippine Innovation', location: 'San Jose Delmonte Bulacan'},
  { date: 'May 1', time: '3:00 PM', title: 'Bridging Web2 and Web3 for Philippine Innovation', location: 'San Jose Delmonte Bulacan'},
  { date: 'May 1', time: '3:00 PM', title: 'Bridging Web2 and Web3 for Philippine Innovation', location: 'San Jose Delmonte Bulacan'},
  { date: 'May 1', time: '3:00 PM', title: 'Bridging Web2 and Web3 for Philippine Innovation', location: 'San Jose Delmonte Bulacan'},
];

const Home: NextPage = () => {
  return(
    <div className="bg-gradient-to-b min-h-screen bg-fixed from-[#131517] from-10% via-[#00071C] via-50% to-[#00071C] to-90%">
      <Header />
      <Navbar/>
    <section className="max-w-[1080px] mx-auto px-[14px] pt-[48px] pb-[14px]">
      <div className="max-w-[820px] mx-auto">
        <Tabs defaultValue="past">
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
            <div className="container mx-auto py-4">
              <div className="relative border-l-[2px] border-[#262729] border-dashed">
                {timelineData.map((event, index) => (
                <Sheet>
                  <div key={index} className="mb-10 ml-4">
                    <div className="absolute -left-[6.2px] w-3 h-3 bg-[#5F6062] rounded-full"></div>  
                      <SheetTrigger className="w-full">
                        <a className="ml-6 px-5 py-3 flex flex-row justify-between rounded-md backdrop-blur-md bg-gray-500/20 border border-gray-600/30">
                          <div className="flex flex-col items-start">
                            <h3 className="text-[18px] font-semibold text-[#88898A]">{event.time}</h3>
                            <h3 className="text-[18px] font-semibold text-white">{event.title}</h3>
                            <h3 className="text-[16px] font-semibold text-[#88898A]">{event.location}</h3>
                          </div>
                          <img className="aspect-[1/1] h-[120px] rounded-md" src="/assets/placeholder/placeholder.png" alt="" />
                        </a>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader className="sticky">
                          <SheetTitle className="border-b border-gray-600/30">
                            <div  className="flex flex-row gap-3 pb-4 p-[16px]">
                              <a href="#" className="rounded-md px-4 py-1 text-[14px] bg-gray-500/50 hover:bg-gray-400 text-[#FFFFFFA3]">Copy Link</a>
                              <a href="#" className="rounded-md px-4 py-1 text-[14px] bg-gray-500/50 hover:bg-gray-400 text-[#FFFFFFA3]">Event Page</a>
                            </div>
                          </SheetTitle>
                          <SheetDescription className="p-[16px] flex flex-col gap-6 overflow-y-auto">
                            <div className="flex flex-1 items-center justify-center mt-[16px] mx-[16px] mb-[8px]">
                              <img className="h-[280px] rounded-lg" src="/assets/placeholder/placeholder.png" alt="" />
                            </div>
                            <div className="flex flex-col gap-4">
                              <h3 className="text-[32px] font-semibold text-white">Shardeum Builders Meet-up</h3>
                              <p className="text-[16px] font-semibold text-[#818384]">Hosted by Web3 Bulacan & 3 others</p>
                              <div className="flex">
                                <div className="w-[50px] h-[50px] border border-gray-600/30 text-center rounded-lg">
                                  <div className="text-[8px] font-medium bg-[#262729] rounded-t-md uppercase text-gray-300">
                                    May
                                  </div>
                                  <div className="text-[16px] font-medium uppercase flex flex-1 p-1 items-center justify-center text-gray-300 rounded-b-md">
                                    10
                                  </div>
                                </div>
                                <div className="flex flex-col ml-4 justify-center text-white gap-0.5">
                                  <div className="text-[16px] font-medium">Friday, May 10</div>
                                  <div className="text-[14px] text-[#818384] font-medium">3:00 PM - 6:00 PM</div>
                                </div>
                              </div>
                            </div>
                            
                          </SheetDescription>
                        </SheetHeader>
                      </SheetContent>
                  </div>
                </Sheet>
                ))}
              </div>
            </div>  
          </TabsContent>
        </Tabs>
      </div>
      

    </section>
    </div>
  )
}

export default Home;