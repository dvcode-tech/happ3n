/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
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
} from "@/components/ui/sheet";

const timelineData = [
  {
    date: "May 1",
    time: "3:00 PM",
    title: "Bridging Web2 and Web3 for Philippine Innovation",
    location: "San Jose Delmonte Bulacan",
  },
  {
    date: "May 1",
    time: "3:00 PM",
    title: "Bridging Web2 and Web3 for Philippine Innovation",
    location: "San Jose Delmonte Bulacan",
  },
  {
    date: "May 1",
    time: "3:00 PM",
    title: "Bridging Web2 and Web3 for Philippine Innovation",
    location: "San Jose Delmonte Bulacan",
  },
  {
    date: "May 1",
    time: "3:00 PM",
    title: "Bridging Web2 and Web3 for Philippine Innovation",
    location: "San Jose Delmonte Bulacan",
  },
  {
    date: "May 1",
    time: "3:00 PM",
    title: "Bridging Web2 and Web3 for Philippine Innovation",
    location: "San Jose Delmonte Bulacan",
  },
];

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#131517] from-10% via-[#00071C] via-50% to-[#00071C] to-90% bg-fixed">
      <Header />
      <Navbar />
      <section className="mx-auto max-w-[1080px] px-[14px] pb-[14px] pt-[48px]">
        <div className="mx-auto max-w-[820px]">
          <Tabs defaultValue="past">
            <div className="flex w-full items-center justify-between">
              <div className="text-[32px] font-semibold text-white">Events</div>
              <TabsList className="grid grid-cols-2 bg-[#252F3A]">
                <TabsTrigger className="" value="upcoming">
                  Upcoming
                </TabsTrigger>
                <TabsTrigger className="" value="past">
                  Past
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent className="text-white" value="upcoming">
              <div>Upcoming</div>
            </TabsContent>
            <TabsContent className="text-white" value="past">
              <div className="container mx-auto py-4">
                <div className="relative ml-[150px] border-l-[2px] border-dashed border-[#262729]">
                  {timelineData.map((event, index) => (
                    <Sheet key={index}>
                      <div key={index} className="mb-10 ml-4">
                        <div className="absolute -left-[150px] ">
                          <h3 className="text-[17px] font-semibold text-white">
                            {event.date}
                          </h3>
                          <h3 className="text-[16px] font-semibold text-[#88898A]">
                            {'Friday'}
                          </h3>
                        </div>
                        <div className="absolute -left-[6.2px] h-3 w-3 rounded-full bg-[#5F6062]"></div>
                        <SheetTrigger className="w-full">
                          <a className="ml-6 flex flex-row justify-between rounded-md border border-gray-600/30 bg-gray-500/20 px-5 py-3 backdrop-blur-md">
                            <div className="flex flex-col items-start">
                              <h3 className="text-[18px] font-semibold text-[#88898A]">
                                {event.time}
                              </h3>
                              <h3 className="text-[18px] font-semibold text-white">
                                {event.title}
                              </h3>
                              <h3 className="text-[16px] font-semibold text-[#88898A]">
                                {event.location}
                              </h3>
                            </div>
                            <img
                              className="aspect-[1/1] h-[120px] rounded-md"
                              src="/assets/placeholder/placeholder.png"
                              alt=""
                            />
                          </a>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader className="sticky">
                            <SheetTitle className="border-b border-gray-600/30">
                              <div className="flex flex-row gap-3 p-[16px] pb-4">
                                <a
                                  href="#"
                                  className="rounded-md bg-gray-500/50 px-4 py-1 text-[14px] text-[#FFFFFFA3] hover:bg-gray-400"
                                >
                                  Copy Link
                                </a>
                                <a
                                  href="#"
                                  className="rounded-md bg-gray-500/50 px-4 py-1 text-[14px] text-[#FFFFFFA3] hover:bg-gray-400"
                                >
                                  Event Page
                                </a>
                              </div>
                            </SheetTitle>
                            <SheetDescription className="flex flex-col gap-6 overflow-y-auto p-[16px]">
                              <div className="mx-[16px] mb-[8px] mt-[16px] flex flex-1 items-center justify-center">
                                <img
                                  className="h-[280px] rounded-lg"
                                  src="/assets/placeholder/placeholder.png"
                                  alt=""
                                />
                              </div>
                              <div className="flex flex-col gap-4">
                                <h3 className="text-[32px] font-semibold text-white">
                                  Shardeum Builders Meet-up
                                </h3>
                                <p className="text-[16px] font-semibold text-[#818384]">
                                  Hosted by Web3 Bulacan & 3 others
                                </p>
                                <div className="flex">
                                  <div className="h-[50px] w-[50px] rounded-lg border border-gray-600/30 text-center">
                                    <div className="rounded-t-md bg-[#262729] text-[8px] font-medium uppercase text-gray-300">
                                      May
                                    </div>
                                    <div className="flex flex-1 items-center justify-center rounded-b-md p-1 text-[16px] font-medium uppercase text-gray-300">
                                      10
                                    </div>
                                  </div>
                                  <div className="ml-4 flex flex-col justify-center gap-0.5 text-white">
                                    <div className="text-[16px] font-medium">
                                      Friday, May 10
                                    </div>
                                    <div className="text-[14px] font-medium text-[#818384]">
                                      3:00 PM - 6:00 PM
                                    </div>
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
  );
};

export default Home;
