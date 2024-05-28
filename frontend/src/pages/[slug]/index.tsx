import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import React from "react";
import { LuArrowUpRight, LuMapPin, LuUserCheck2 } from "react-icons/lu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  fullname: z.string().min(2, {
    message: "This is required.",
  }),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: "Please enter a valid email address",
  }),
});

const EventPage = () => {
  //   const { events, slug } = props;
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      fullname: values.fullname,
      email: values.email,
    };
    console.log(data);

    // await onRequest(data);
  }
  return (
    <div className="min-h-screen overflow-hidden bg-black bg-[url('/assets/bg.png')] bg-cover bg-fixed bg-center bg-no-repeat">
      <Header />
      <Navbar />
      <section className="mx-auto flex max-w-[950px] flex-col-reverse md:flex-row">
        <div className="flex h-full flex-col gap-5 p-4 lg:gap-8">
          <img
            className="hidden aspect-[1/1] h-[358px] flex-col items-center justify-center rounded-xl md:flex md:h-[280px] lg:h-[330px]"
            src="/assets/placeholder/placeholder-event.png"
            alt=""
          />

          <div className="flex max-w-[362px] flex-col gap-2">
            <div className="flex w-full items-center gap-2">
              <img
                className="h-6 rounded-full"
                src="assets/logo/icon.png"
                alt=""
              />
              <div className="ml-2 flex w-full justify-between">
                <div className="flex flex-col">
                  <p className="text-[12px] text-[#FFFFFFC8]">Presented by</p>
                  <h1 className="line-clamp-1 text-[#FFFFFF]">
                    DvCode Technologies Inc.
                  </h1>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#404953]/20 p-2 text-[#a0a2a2]">
                  <LuUserCheck2 />
                </div>
              </div>
            </div>
            <div className=" text-[14px] text-[#FFFFFF]">
              Innovation in Every Step
            </div>
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
              <p className="text-[16px] text-[#FFFFFF]">Jirumaa</p>
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
              <p className="text-[16px] text-[#FFFFFF]">Jirumaa</p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col space-y-4">
          <div className="flex w-full flex-col gap-4 p-[16px]">
            <img
              className="flex aspect-[1/1] h-[358px] flex-col items-center justify-center rounded-xl md:hidden md:h-[280px] lg:h-[330px]"
              src="/assets/placeholder/placeholder-event.png"
              alt=""
            />
            <div className="flex flex-col gap-8 text-left">
              <div className="flex flex-col gap-4 pt-2">
                <h3 className="text-[38px] font-semibold leading-8 text-white">
                  Shardeum Builders Meet-up
                </h3>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex">
                  <div className="h-[50px] w-[50px] rounded-lg border border-gray-600/30 text-center">
                    <div className="rounded-t-md bg-[#262729] py-1 text-[9px] font-medium uppercase text-gray-300">
                      May
                    </div>
                    <div className="flex flex-1 items-center justify-center rounded-b-md p-0.5 text-[16px] font-medium uppercase text-gray-300">
                      10
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col justify-center gap-0.5 text-white">
                    <div className="text-[16px] font-medium">
                      Friday, May 10
                    </div>
                    <div className="text-[14px] font-medium text-[#818384]">
                      {"3:00 PM - 6:00 PM"} GMT+8
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
                      San Jose Delmonte Bulacan, Central Luzon
                    </div>
                  </a>
                </div>
              </div>

              <div className="container flex flex-col gap-2 overflow-hidden rounded-md border border-gray-600/30 bg-gray-500/20 backdrop-blur-md">
                <div className="bg-[#404953] px-4 py-2 text-white">
                  <p className="text-[14px]">Registration</p>
                </div>
                <div className="flex items-center border-b border-gray-600/30 px-4 py-2 text-white">
                  <div className="flex items-center rounded-md bg-[#404953]/30 p-2 text-[#a0a2a2]">
                    <LuUserCheck2 />
                  </div>
                  <div>
                    <h3 className="px-4 text-[16px] font-medium">
                      Approval Required
                    </h3>
                    <p className="px-4 text-[14px] text-[#818384]">
                      Your registration is subject to approval by the host.
                    </p>
                  </div>
                </div>
                <div className="py-2 text-white">
                  <h3 className="px-4 text-[16px]">
                    Welcome! To join the event, please register below.
                  </h3>
                  <div className="flex items-center p-4 text-[14px] text-[#818384]">
                    <img
                      className="h-5 rounded-full"
                      src="/assets/logo/icon.png"
                      alt=""
                    />
                    <h1 className="ml-2 text-[16px] font-medium text-white">
                      Jirumaa Dev
                    </h1>
                    <p className="ml-2 text-[16px] font-light text-white">
                      dev.jirumaa@gmail.com
                    </p>
                  </div>
                  <div className="px-4">
                    <Dialog>
                      <DialogTrigger className="w-full">
                        <Button className="w-full text-[16px]">
                          Request to Join
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="overflow-hidden rounded-md border bg-gray-500/40 p-0 py-8 backdrop-blur-md md:rounded-3xl">
                        <DialogHeader className="">
                          <DialogDescription className="flex w-full flex-1 flex-col px-4">
                            <div className="p-4 text-left text-[17px] text-white">
                              Your Info
                            </div>
                            <Form {...form}>
                              <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="flex max-h-[87vh] flex-col gap-4 overflow-y-auto md:max-h-[100vh]"
                              >
                                <FormField
                                  control={form.control}
                                  name="fullname"
                                  render={({ field }) => (
                                    <FormItem className="px-4">
                                      <div className="grid grid-cols-1 gap-2 text-left">
                                        <Label>
                                          Fullname{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </Label>
                                        <FormControl>
                                          <Input
                                            placeholder="Fullname"
                                            className="col-span-3"
                                            {...field}
                                          />
                                        </FormControl>
                                      </div>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="email"
                                  render={({ field }) => (
                                    <FormItem className="px-4">
                                      <div className="grid grid-cols-1 gap-2 text-left">
                                        <Label>
                                          Email{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </Label>
                                        <FormControl>
                                          <Input
                                            placeholder="Email"
                                            className="col-span-3"
                                            {...field}
                                          />
                                        </FormControl>
                                      </div>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <div className="px-4">
                                  <Button
                                    type="submit"
                                    className="w-full hover:bg-[#2F3136] hover:text-[#2F3136] active:bg-[#141414] dark:text-black"
                                  >
                                    Request to Join
                                  </Button>
                                </div>
                              </form>
                            </Form>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-[16px] border-b border-gray-600/30 pb-[8px] text-[14px] font-medium text-[#818384]">
                  About Event
                </h3>
                <p className="text-[17px] leading-6 text-[#FFFFFF]">
                  Shardeum is the worlds first EVM-based L1 blockchain that
                  scales linearly i.e., the network can scale up by simply
                  adding more nodes. Further, it can auto-scale up or down
                  depending on the traffic in the network. It aims to be the
                  first Web3 platform to overcome the blockchain trilemma.
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
                  Km. 31 Quirino Hwy, San Jose del Monte City, 3023 Bulacan,
                  Philippines
                </p>
                <iframe
                  className="mt-[16px] aspect-[2/1] w-full rounded-md bg-gray-400 invert-[90%] filter"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.093497007274!2d120.98312537533448!3d14.707304374454834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b3e239aafdd7%3A0x9f7ee6ff84f9adfd!2sV.%20Matias%2C%20Valenzuela%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1699341419611!5m2!1sen!2sph"
                  allowFullScreen={false}
                  aria-hidden="false"
                  tabIndex={0}
                ></iframe>
              </div>

              {/* <div>
                <h3 className="mb-[16px] border-b border-gray-600/30 pb-[8px] text-[14px] font-medium text-[#818384]">
                  Hosted by
                </h3>
                <div className="flex items-center gap-2">
                  <img
                    className="h-6 rounded-full"
                    src="assets/logo/icon.png"
                    alt=""
                  />
                  <p className="text-[16px] text-[#FFFFFF]">Jirumaa</p>
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
                  <p className="text-[16px] text-[#FFFFFF]">Jirumaa</p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default EventPage;
