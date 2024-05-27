/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";

import { LuMapPin, LuArrowUpRight, LuPlus } from "react-icons/lu";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    date: "March 25",
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
      <section className="mx-auto max-w-[1080px] p-[16px] md:px-[14px] md:pb-[14px] md:pt-[48px]">
        <div className="mx-auto max-w-[820px]">
          <Tabs defaultValue="past">
            <div className="mb-[8px] flex w-full items-center justify-between">
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

            <TabsContent className="pt-[32px] text-white" value="upcoming">
              <div className="mb-[48px] mt-[64px] flex h-[348px] flex-col items-center justify-center">
                <div className="text-[24px] font-semibold text-[#FFFFFFC9]">
                  No Upcoming Events
                </div>
                <div className="text-[16px] font-semibold text-[#FFFFFF80]">
                  You have no upcoming events. Why not host one?
                </div>
                <a
                  href=""
                  className="mt-[40px] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#FFFFFF14] px-4 py-2 text-sm font-medium text-[#FFFFFFA3] ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950  dark:focus-visible:ring-slate-300"
                >
                  <LuPlus /> Create Event
                </a>
              </div>
            </TabsContent>

            <TabsContent className="text-white md:pt-[16px]" value="past">
              <div className="container mx-auto py-4">
                <div className="relative border-l-[2px] border-dashed border-[#262729] md:ml-[150px]">
                  {timelineData.map((event, index) => (
                    <Sheet key={index}>
                      <div key={index} className="mb-[30px] md:mb-10 md:ml-4">
                        <div className="absolute -left-[7.5px] h-3 w-3 rounded-full bg-[#5F6062]"></div>
                        <div className="mb-[10px] ml-6 flex items-center gap-2 md:absolute md:-left-[150px] md:ml-0 md:flex-col md:gap-0">
                          <h3 className="text-[17px] font-semibold text-white">
                            {event.date}
                          </h3>
                          <h3 className="text-[16px] font-semibold text-[#88898A]">
                            {"Friday"}
                          </h3>
                        </div>
                        <SheetTrigger className="w-full">
                          <a className="ml-6 flex flex-row justify-between gap-1 rounded-md border border-gray-600/30 bg-gray-500/20 px-5 py-3 backdrop-blur-md">
                            <div className="flex flex-col items-start text-left">
                              <h3 className="text-[16px] font-semibold text-[#88898A] md:text-[18px]">
                                {event.time}
                              </h3>
                              <h3 className="text-[18px] font-semibold text-white md:text-[18px]">
                                {event.title}
                              </h3>
                              <div className="flex items-center gap-1">
                                <LuMapPin className="h-7" />
                                <h3 className="line-clamp-1 text-[16px] font-semibold text-[#88898A]">
                                  {event.location}
                                </h3>
                              </div>
                            </div>
                            <img
                              className="aspect-[1/1] h-[90px] rounded-md md:h-[120px]"
                              src="/assets/placeholder/placeholder.png"
                              alt=""
                            />
                          </a>
                        </SheetTrigger>
                        <SheetContent className="z-[999] w-full md:w-[550px]">
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
                            <SheetDescription>
                              <ScrollArea className="flex h-[750px] w-full flex-col px-[16px] md:h-[660px]">
                                <div className="mb-[40px] flex flex-1 items-center justify-center md:mx-[16px] md:mt-[16px]">
                                  <img
                                    className="h-[358px] rounded-lg md:h-[280px]"
                                    src="/assets/placeholder/placeholder.png"
                                    alt=""
                                  />
                                </div>
                                <div className="flex flex-col gap-8 text-left">
                                  <div className="flex flex-col gap-4">
                                    <h3 className="text-[32px] font-semibold leading-8 text-white">
                                      Shardeum Builders Meet-up
                                    </h3>
                                    <p className="text-[16px] font-semibold text-[#818384]">
                                      Hosted by Web3 Bulacan & 3 others
                                    </p>
                                  </div>
                                  <div className="flex flex-col gap-4">
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
                                    <div className="flex">
                                      <div className="flex h-[50px] w-[50px] items-center justify-center rounded-lg border border-gray-600/30 text-center">
                                        <LuMapPin className="text-xl text-gray-300" />
                                      </div>
                                      <a
                                        href="#"
                                        className="ml-4 flex flex-col justify-center gap-0.5 text-white"
                                      >
                                        <div className="font-medium] flex gap-1 text-[16px]">
                                          Mendez Resort and Events Place{" "}
                                          <LuArrowUpRight className="text-[#818384]" />
                                        </div>
                                        <div className="text-[14px] font-medium text-[#818384]">
                                          San Jose Delmonte Bulacan, Central
                                          Luzon
                                        </div>
                                      </a>
                                    </div>
                                  </div>

                                  <div className="container flex flex-col gap-2 rounded-md border border-gray-600/30 bg-gray-500/20 px-5 py-3 backdrop-blur-md">
                                    <img
                                      className="h-10 w-10 rounded-full"
                                      src="/assets/logo/icon.png"
                                      alt=""
                                    />
                                    <h3 className="text-[22px] font-medium text-white">
                                      Thank You for joining
                                    </h3>
                                    <p className="text-[16px] text-[#FFFFFFC9]">
                                      We hope you enjoy the event!
                                    </p>
                                  </div>

                                  <div>
                                    <h3 className="mb-[16px] border-b border-gray-600/30 pb-[8px] text-[14px] font-medium text-[#818384]">
                                      About Event
                                    </h3>
                                    <p className="text-[17px] leading-6 text-[#FFFFFF]">
                                      Shardeum is the worlds first EVM-based L1
                                      blockchain that scales linearly i.e., the
                                      network can scale up by simply adding more
                                      nodes. Further, it can auto-scale up or
                                      down depending on the traffic in the
                                      network. It aims to be the first Web3
                                      platform to overcome the blockchain
                                      trilemma.
                                    </p>
                                  </div>

                                  <div>
                                    <h3 className="mb-[16px] border-b border-gray-600/30 pb-[8px] text-[14px] font-medium text-[#818384]">
                                      Location
                                    </h3>
                                    <h3 className="text-[18px] leading-6 text-[#FFFFFF]">
                                      Mendez Resorts and Events Place
                                    </h3>
                                    <p className="text-[14px] leading-6 text-[#FFFFFFC9]">
                                      Km. 31 Quirino Hwy, San Jose del Monte
                                      City, 3023 Bulacan, Philippines
                                    </p>
                                    <iframe
                                      className="mt-[16px] aspect-[2/1] w-full rounded-md bg-gray-400 invert-[90%] filter"
                                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.093497007274!2d120.98312537533448!3d14.707304374454834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b3e239aafdd7%3A0x9f7ee6ff84f9adfd!2sV.%20Matias%2C%20Valenzuela%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1699341419611!5m2!1sen!2sph"
                                      allowFullScreen={false}
                                      aria-hidden="false"
                                      tabIndex={0}
                                    ></iframe>
                                  </div>

                                  <div>
                                    <h3 className="mb-[16px] border-b border-gray-600/30 pb-[8px] text-[14px] font-medium text-[#818384]">
                                      Hosted by
                                    </h3>
                                    <div className="flex items-center gap-2">
                                      <img
                                        className="h-6 rounded-full"
                                        src="assets/logo/icon.png"
                                        alt=""
                                      />
                                      <p className="text-[16px] text-[#FFFFFF]">
                                        Jirumaa
                                      </p>
                                    </div>
                                  </div>

                                  <div>
                                    <h3 className="mb-[16px] border-b border-gray-600/30 pb-[8px] text-[14px] font-semibold text-[#818384]">
                                      {"100 "} Going
                                    </h3>
                                    <div className="flex items-center gap-2">
                                      <img
                                        className="h-6 rounded-full"
                                        src="assets/logo/icon.png"
                                        alt=""
                                      />
                                      <p className="text-[16px] text-[#FFFFFF]">
                                        Jirumaa
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </ScrollArea>
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
