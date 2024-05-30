// TODO: Add update profile

import { NextPage } from "next";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LuArrowUpRight, LuMapPin, LuPlus, LuVideo } from "react-icons/lu";

const timelineData = [
  {
    date: "May 29",
    day: "Friday",
    time: "3:00 PM",
    title: "Happ3n Development Week",
    location: "San Jose Delmonte Bulacan",
  },
  {
    date: "March 25",
    day: "Sunday",
    time: "3:00 PM",
    title: "Bridging Web2 and Web3 for Philippine Innovation",
    location: "San Jose Delmonte Bulacan",
  },
  {
    date: "May 1",
    day: "Friday",
    time: "3:00 PM",
    title: "Bridging Web2 and Web3 for Philippine Innovation",
    location: "San Jose Delmonte Bulacan",
  },
];

const User: NextPage = () => {
  return (
    <div className="min-h-screen bg-black bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat">
      <Header />
      <Navbar />
      <section className="mb-[24px] border-t-white md:px-[14px] md:py-[8px]">
        <div className="relative mx-auto max-w-[1008px]">
          <img
            className="md:rounded-xl"
            src="/assets/placeholder/cover.png"
            alt=""
          />
          <div className="absolute flex w-full flex-1 translate-y-[-40%] px-[14px] md:px-[35px]">
            <div className="flex w-full justify-between">
              <div className="rounded-lg bg-[#070419]  p-0.5 md:left-[35px] md:rounded-[18px] md:p-1.5">
                <img
                  className="aspect-[1/1] w-[64px] rounded-lg md:w-[96px] md:rounded-2xl"
                  src="/assets/placeholder/placeholder_banner.png"
                  alt=""
                />
              </div>
              <div className="flex items-end justify-end pt-1.5">
                <Button
                  variant="outline"
                  size={"sm"}
                  className="flex w-[110px] border border-white bg-gray-800/40 px-[10px] py-2 text-[12px] md:px-[14px] md:py-[10px] md:text-[16px] dark:bg-transparent dark:text-[#FFFFFF]"
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-[60px] flex max-w-[928px] flex-col gap-1 px-[14px] md:mt-[70px]">
          <h1 className="text-[22px] font-medium leading-6 text-[#FFFFFF] md:text-[32px] md:leading-8">
            Happ3n Today
          </h1>
          <p className="text-[14px] text-[#FFFFFFC9] md:text-[16px]">
            Where Great Events Begin!
          </p>
        </div>
      </section>

      <div className="w-full border-t border-gray-600/30"></div>

      <section className="mx-auto mt-[10px] flex min-h-screen max-w-[1008px] flex-1 flex-col gap-[24px] px-[14px] md:mt-[24px]">
        <Tabs defaultValue="past">
          <div className="mb-[8px] flex w-full items-center justify-between">
            <div className="text-[20px] font-semibold text-white md:text-[32px]">
              Events
            </div>
            <TabsList className="grid grid-cols-2 bg-[#252F3A]">
              <TabsTrigger className="px-2" value="upcoming">
                Upcoming
              </TabsTrigger>
              <TabsTrigger className="px-2" value="past">
                Past
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent className="text-white" value="upcoming">
            <div className="flex h-[348px] flex-col items-center justify-center">
              <div className="text-[24px] font-semibold text-[#FFFFFFC9]">
                No Upcoming Events
              </div>
              <div className="text-[16px] font-semibold text-[#FFFFFF80]">
                You have no upcoming events. Why not host one?
              </div>
              <Link
                href="/create"
                className="mt-[40px] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#FFFFFF14] px-4 py-2 text-sm font-medium text-[#FFFFFFA3] ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950  dark:focus-visible:ring-slate-300"
              >
                <LuPlus /> Create Event
              </Link>
            </div>
          </TabsContent>

          <TabsContent className="text-white md:pt-[32px]" value="past">
            <div className="container mx-auto py-4">
              <div className="relative border-l-[2px] border-dashed border-[#262729] md:ml-[150px]">
                {timelineData.map((event, index) => (
                  <Sheet key={index}>
                    <div key={index} className="mb-[30px] md:mb-10 md:ml-4">
                      <div className="absolute -left-[7.5px] h-3 w-3 rounded-full bg-[#5F6062]"></div>
                      <div className="mb-[10px] ml-4 flex items-center gap-2 md:absolute md:-left-[150px] md:ml-0 md:flex-col md:gap-0">
                        <h3 className="text-[17px] font-semibold text-white">
                          {event.date}
                        </h3>
                        <h3 className="text-[16px] font-semibold text-[#88898A]">
                          Friday
                        </h3>
                      </div>
                      <SheetTrigger className="w-full">
                        <div className="ml-4 flex flex-row justify-between gap-1 rounded-md border border-gray-600/30 bg-gray-500/20 px-5 py-3 backdrop-blur-md md:ml-6">
                          <div className="flex flex-col items-start text-left">
                            <h3 className="text-[16px] font-semibold text-[#88898A] md:text-[18px]">
                              2:00 AM
                            </h3>
                            <h3 className="text-[18px] font-semibold text-white md:text-[18px]">
                              {event?.title}
                            </h3>
                            <div className="my-1 flex items-center gap-2">
                              By
                              <img
                                className="h-4 rounded-full"
                                src={"assets/logo/icon.png"}
                                alt=""
                              />
                              <p className="line-clamp-1 text-[#FFFFFF]">
                                DvCode Technologies
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <LuMapPin className="h-7" />

                              <h3 className="line-clamp-1 text-[16px] font-semibold text-[#88898A]">
                                {event?.location}
                              </h3>
                            </div>
                          </div>
                          <img
                            className="aspect-[1/1] h-[90px] rounded-md md:h-[120px]"
                            src="/assets/placeholder/placeholder_banner.png"
                            alt=""
                          />
                        </div>
                      </SheetTrigger>
                      <SheetContent className="z-[999] w-full md:w-[550px]">
                        <SheetHeader className="sticky">
                          <SheetTitle className="border-b border-gray-600/30">
                            <div className="flex flex-row gap-3 p-[16px] pb-4">
                              <Link
                                // href={`/event?q=${event?.slug}`}
                                href={`#`}
                                target="_blank"
                                className="rounded-md bg-gray-500/50 px-4 py-1 text-[14px] text-[#FFFFFFA3] hover:bg-gray-400"
                              >
                                Event Page
                              </Link>
                            </div>
                          </SheetTitle>
                          <SheetDescription>
                            <ScrollArea className="flex h-[80vh] w-full flex-col px-[16px] md:h-[660px] xl:md:h-[800px]">
                              <div className="mb-[40px] flex flex-1 items-center justify-center md:mx-[16px] md:mt-[16px]">
                                <img
                                  className="h-[358px] rounded-lg md:h-[280px]"
                                  src="/assets/placeholder/placeholder_banner.png"
                                  alt=""
                                />
                              </div>
                              <div className="flex flex-col gap-8 text-left">
                                <div className="flex flex-col gap-4">
                                  <h3 className="text-[32px] font-semibold leading-8 text-white">
                                    Bridging Web2 and Web3 for Philippine
                                    Innovation
                                  </h3>
                                  <p className="text-[16px] font-semibold text-[#818384]">
                                    Hosted by Jirumaa
                                  </p>
                                </div>
                                <div className="flex flex-col gap-4">
                                  <div className="flex">
                                    <div className="h-[50px] w-[50px] rounded-lg border border-gray-600/30 text-center">
                                      <div className="rounded-t-md bg-[#262729] text-[8px] font-medium uppercase text-gray-300">
                                        May
                                      </div>
                                      <div className="flex flex-1 items-center justify-center rounded-b-md p-1 text-[16px] font-medium uppercase text-gray-300">
                                        22
                                      </div>
                                    </div>
                                    <div className="ml-4 flex flex-col justify-center gap-0.5 text-white">
                                      <div className="text-[16px] font-medium">
                                        Thursday, May 22
                                      </div>
                                      <div className="text-[14px] font-medium text-[#818384]">
                                        02:00 PM - May 22, 03:00 PM GMT+8
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex">
                                    <div className="flex h-[50px] w-[50px] items-center justify-center rounded-lg border border-gray-600/30 text-center">
                                      <LuMapPin className="text-xl text-gray-300" />
                                    </div>
                                    <Link
                                      href="#"
                                      className="ml-4 flex flex-col justify-center gap-0.5 text-white"
                                    >
                                      <div className="font-medium] flex gap-1 text-[16px]">
                                        OFFLINE
                                        <LuArrowUpRight className="text-[#818384]" />
                                      </div>
                                      <div className="text-[14px] font-medium text-[#818384]">
                                        San Jose Delmonte Bulacan
                                      </div>
                                    </Link>
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
                                    Sample Desc
                                  </p>
                                </div>

                                <div>
                                  <h3 className="mb-[16px] border-b border-gray-600/30 pb-[8px] text-[14px] font-medium text-[#818384]">
                                    Location
                                  </h3>
                                  <h3 className="text-[18px] leading-6 text-[#FFFFFF]">
                                    OFFLINE
                                  </h3>
                                  <p className="text-[14px] leading-6 text-[#FFFFFFC9]">
                                    San Jose Delmonte Bulacan
                                  </p>
                                </div>

                                <div>
                                  <h3 className="mb-[16px] border-b border-gray-600/30 pb-[8px] text-[14px] font-medium text-[#818384]">
                                    Hosted by
                                  </h3>
                                  <div className="flex items-center gap-2">
                                    <img
                                      className="h-6 rounded-full"
                                      src={"assets/logo/icon.png"}
                                      alt=""
                                    />
                                    <p className="text-[16px] text-[#FFFFFF]">
                                      DvCode Technologies Inc.
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
      </section>
    </div>
  );
};

export default User;
