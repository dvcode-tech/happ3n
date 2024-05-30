/* eslint-disable @next/next/no-img-element */
//TODO:Mobile View
//TODO:Registration Tab

import { NextPage } from "next";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";

import {
  LuArrowUpRight,
  LuMapPin,
  LuShare,
  LuScanLine,
  LuQrCode,
  LuUsers,
  LuSearch,
  LuVideo,
  LuChevronsUpDown,
  LuCheck,
  LuX,
} from "react-icons/lu";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/router";
import { useHappenContext } from "@/context/HappenContext";
import { formatDate, urlify } from "@/lib/utils";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import slugify from "react-slugify";
import path from "path";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import React from "react";

type Checked = DropdownMenuCheckboxItemProps["checked"];

const formSchema = z.object({
  name: z.string().min(1),
  slug: z.string(),
  start_at: z.string(),
  end_at: z.string(),
  location_type: z.string().min(1),
  location: z.string().min(1),
  // required_approval: z.boolean(),
  // capacity: z.string(),
  // banner: z
  //   .unknown()
  //   .refine((val) => {
  //     if (!Array.isArray(val)) return false;
  //     if (val.some((file) => !(file instanceof File))) return false;
  //     return true;
  //   }, "Must be an array of File")
  //   .optional()
  //   .nullable()
  //   .default(null),
  type: z.string(),
  description: z.string().min(1),
});

const GuestList = [
  {
    name: "Juan Dela Cruz",
    email: "jdcruz@me.com",
    status: 0,
    date: "Sept 20, 2024",
  },
  {
    name: "Jirumaa Dev",
    email: "dev.jirumaa@me.com",
    status: 0,
    date: "Sept 20, 2024",
  },
  {
    name: "Sandugo Dimagiba",
    email: "jdcruz@me.com",
    status: 1,
    date: "Sept 20, 2024",
  },
  {
    name: "Juan Dela Cruz",
    email: "jdcruz@me.com",
    status: 0,
    date: "Sept 20, 2024",
  },
  {
    name: "Juan Dela Cruz",
    email: "jdcruz@me.com",
    status: 0,
    date: "Sept 20, 2024",
  },
  {
    name: "Juan Dela Cruz",
    email: "jdcruz@me.com",
    status: 0,
    date: "Sept 20, 2024",
  },
  {
    name: "Juan Dela Cruz",
    email: "jdcruz@me.com",
    status: 0,
    date: "Sept 20, 2024",
  },
  {
    name: "Juan Dela Cruz",
    email: "jdcruz@me.com",
    status: 0,
    date: "Sept 20, 2024",
  },
  {
    name: "Juan Dela Cruz",
    email: "jdcruz@me.com",
    status: 0,
    date: "Sept 20, 2024",
  },
  {
    name: "Juan Dela Cruz",
    email: "jdcruz@me.com",
    status: 0,
    date: "Sept 20, 2024",
  },
];

const ManageEvent: NextPage = () => {
  const { isAuthenticated, ctxAccount, backend } = useHappenContext();
  const router = useRouter();
  const slug = router?.query?.q;

  const [data, setData] = useState<any>(null);
  const [guest, setGuest] = useState(45);
  const [guestList, setGuestList] = useState<any[]>([]);

  const [showPublic, setPublic] = React.useState<Checked>(true);
  const [showPrivate, setPrivate] = React.useState<Checked>(false);

  const getGuestList = async () => {
    try {
      const response: any = (
        await backend.post(`/event/${data?.id}/guests/list`)
      ).data;

      setGuestList(response.data);

      console.log(response);
    } catch (e: any) {
      const error = e?.data?.message || e.message;

      console.error(error);

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error,
        duration: 1000,
      });
    }
  };

  useEffect(() => {
    if (!ctxAccount || !data) return;
    getGuestList();
  }, [ctxAccount, data]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      name: "",
      slug: "",
      start_at: "",
      end_at: "",
      location: "",
      // required_approval: false,
      // capacity: "",
      // banner: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const handleUpload = async () => {
        // @ts-ignore
        // if (!values.banner[0]) return;
        // const file = (values.banner as unknown as any)[0];
        // const reference = (
        //   new Date().getTime().toString(36) +
        //   Math.random().toString(36).slice(2)
        // ).toLowerCase();
        // return new Promise((resolve, reject) => {
        //   const reader = new FileReader();
        //   reader.onloadend = () => {
        //     resolve({
        //       filename: `${reference}${path.extname(file.name)}`,
        //       contents: (reader.result as any)?.split(",")[1],
        //     });
        //   };
        //   reader.onerror = (error) => {
        //     reject(error);
        //   };
        //   reader.readAsDataURL(file);
        // });
      };

      const bannerRessult = await handleUpload();

      const imagePost = await backend.post(
        "/upload",
        { file: bannerRessult },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const slug = slugify(values.name);

      const locationData = {
        type: values.location_type,
        location: values.location,
      };

      const locationJson = JSON.stringify(locationData);

      // const data = {
      //   type: Number(type),
      //   banner: (imagePost.data as any)?.data,
      //   name: values.name,
      //   slug: slug,
      //   start_at: Number(new Date(startAt).getTime()),
      //   end_at: Number(new Date(endAt).getTime()),
      //   location: locationJson,
      //   required_approval: approvalStatus,
      //   capacity: Number(capacity),
      //   description: descriptionValue,
      // };

      console.log(data);

      const eventPost = await backend.post("/event/create", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast({
        variant: "default",
        title: "Success",
        description: (eventPost.data as any)?.message,
        duration: 2000,
      });
    } catch (e: any) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: e?.message || e?.data?.message,
        duration: 1000,
      });
    }
  }

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values);
  };

  const fetchEvent = async (q: any) => {
    try {
      const data: any = (await backend.get(`/event/slug/${q}`)).data;
      console.log(data?.data);
      setData(data?.data);
    } catch (error) {
      console.error({ error });
    }
  };

  const manageGuestStatus = async (status: number, guestId: number) => {
    try {
      const response: any = await backend.post(
        `/event/${data?.id}/guests/${guestId}/manage`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      toast({
        variant: "default",
        title: "Success",
        description: (response?.data as any)?.message,
        duration: 2000,
      });
    } catch (error: any) {
      console.error({ error });
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error?.message || error?.data?.message,
        duration: 1000,
      });
    } finally {
      getGuestList();
    }
  };

  useEffect(() => {
    if (!slug) return;
    fetchEvent(slug);
  }, [slug]);

  return (
    <div className="min-h-screen bg-black bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat">
      <Header />
      <Navbar />
      <section className="pb-[14px] pt-[28px] md:pt-[48px]">
        <div className="mx-auto flex max-w-[788px] items-center justify-between px-4 lg:px-0">
          <div className="flex items-center justify-center gap-2">
            <img
              className="h-5 rounded-full"
              src="/assets/logo/icon.png"
              alt=""
            />
            <div className="text-[32px] font-medium leading-8 text-[#FFFFFFC8]">
              {data?.name}
            </div>
          </div>
          <a
            href={`/${slug}`}
            className="flex h-9 items-center justify-center gap-1 rounded-md bg-[#FFFFFF14] px-[12px] py-[11px] text-[14px] font-medium leading-none text-[#FFFFFFA3] hover:bg-gray-400"
          >
            <p className="hidden md:block">Event Page</p>
            <LuArrowUpRight />
          </a>
        </div>

        <div>
          <Tabs defaultValue="overview" className="pt-[8px]">
            <TabsList className="mx-auto flex max-w-[788px] items-start justify-start px-4 lg:px-0 dark:bg-transparent dark:text-[#818384]">
              <TabsTrigger
                value="overview"
                className="mr-3 items-start rounded-none text-[16px] dark:data-[state=active]:border-b dark:data-[state=active]:bg-transparent"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="guest"
                className="mr-3 items-start rounded-none text-[16px] dark:data-[state=active]:border-b dark:data-[state=active]:bg-transparent"
              >
                Guests
              </TabsTrigger>
              {/* <TabsTrigger
                value="registration"
                className="mr-3 items-start rounded-none text-[16px] dark:data-[state=active]:border-b dark:data-[state=active]:bg-transparent"
              >
                Registration
              </TabsTrigger> */}
            </TabsList>

            <TabsContent
              value="overview"
              className="border-t border-gray-600/30"
            >
              <div className="mx-auto mt-[28px] flex max-w-[788px] flex-col gap-[20px] px-4 lg:px-0">
                <div>
                  <a
                    href="#"
                    className="flex w-fit items-center gap-2 rounded-lg border border-gray-600/30 bg-gray-800/40 px-[22px] py-[9px] text-[18px] font-semibold text-white backdrop-blur-sm"
                  >
                    <LuShare /> Share Event
                  </a>
                </div>

                <div className="flex flex-col gap-x-[20px] rounded-lg border border-gray-600/30 bg-gray-800/40 p-[12px] text-white backdrop-blur-sm md:flex-row">
                  <div className="flex flex-1">
                    {/* TODO: Overview Banner */}
                    <div className="relative h-[257px] w-[332px] overflow-hidden rounded-lg bg-blue-950 md:h-[280px] md:w-[371px]">
                      <div className="absolute bottom-2 left-1/2 mx-auto flex w-[355px] -translate-x-1/2 justify-between rounded-md bg-[#13151752] py-2 backdrop-blur-md">
                        <div className="flex items-center gap-1 pl-4 text-[14px] text-[#FFFFFFCC]">
                          {`happ3n/${slug}`} <LuArrowUpRight />
                        </div>
                        <div className="pr-4 text-[14px] uppercase text-[#FFFFFF7A]">
                          Copy
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="mb-[16px] mt-[8px]">
                      <h3 className="text-[18px] font-medium">When & Where</h3>
                    </div>

                    <div className="flex flex-col gap-[20px]">
                      <div className="flex gap-4">
                        <div className="h-[50px] w-[50px] rounded-lg border border-gray-600/30 text-center">
                          <div className="rounded-t-md bg-[#FFFFFF14] py-1 text-[9px] font-medium uppercase text-gray-300">
                            {formatDate(data?.start_at).monthLongName}
                          </div>
                          <div className="flex flex-1 items-center justify-center rounded-b-md p-0.5 text-[16px] font-medium uppercase text-gray-300">
                            {formatDate(data?.start_at).day}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="text-[16px] font-medium">
                            {formatDate(data?.start_at).dayName},{" "}
                            {formatDate(data?.start_at).monthLongName}{" "}
                            {formatDate(data?.start_at).day}
                          </div>
                          <div className="text-[14px] text-[#FFFFFFC9]">
                            {formatDate(data?.start_at).time}
                            {" - "}
                            {data?.end_at - data?.start_at >= 24 * 60 * 60
                              ? `${formatDate(data?.end_at).monthLongName} ${formatDate(data?.end_at).day}, `
                              : ""}
                            {formatDate(data?.end_at).time} GMT+8
                          </div>
                        </div>
                      </div>

                      <div className="flex">
                        <div className="flex h-[50px] w-[50px] items-center justify-center rounded-lg border border-gray-600/30 text-center">
                          {JSON.parse(data?.location || "{}")?.type ===
                          "VIRTUAL" ? (
                            <LuVideo className="text-xl text-gray-300" />
                          ) : (
                            <LuMapPin className="text-xl text-gray-300" />
                          )}
                        </div>
                        <a
                          href="#"
                          className="ml-4 flex flex-col justify-center gap-0.5 text-white"
                        >
                          <div className="flex gap-1 text-[16px] font-medium">
                            {JSON.parse(data?.location || "{}")?.type}{" "}
                          </div>
                          <div className="text-[14px] font-medium text-[#FFFFFFC9]">
                            {JSON.parse(data?.location || "{}")?.location}
                          </div>
                        </a>
                      </div>

                      <div className="flex flex-col">
                        <div className="text-[13px] text-[#FFFFFFC9]">
                          The Address is shown publicly on the event page.
                        </div>
                        <a
                          href={`/check-in/${slug}`}
                          className="mt-[16px] flex items-center justify-center gap-1 rounded-lg bg-[#FFFFFF14] px-[10px] py-[6px] text-[14px] font-medium text-[#FFFFFFA3]"
                        >
                          <LuScanLine /> Check In Guests
                        </a>
                      </div>

                      <div className="flex  flex-1 gap-2">
                        <Sheet>
                          <SheetTrigger asChild>
                            <div className="mt-[16px] flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg bg-[#FFFFFF14] px-[10px] py-[6px] text-[14px] font-medium text-[#FFFFFFA3]">
                              Edit Event
                            </div>
                          </SheetTrigger>

                          <SheetContent className="z-[998] w-full bg-[#1C1E20] md:w-[550px]">
                            <SheetHeader className="sticky">
                              <SheetTitle className="border-b border-gray-600/30">
                                <div className="flex flex-row gap-3 p-[16px] pb-4">
                                  <p className="text-[16px]">Edit Event</p>
                                </div>
                              </SheetTitle>
                              <SheetDescription className="h-[80vh] overflow-y-auto">
                                <div className="p-[16px]">
                                  <div className="mb-[16px] text-[18px] font-bold text-white">
                                    Basic Info
                                  </div>

                                  <div className="flex flex-col gap-8">
                                    <Input
                                      type="text"
                                      className="py-[8px] text-[18px] font-semibold text-white dark:border-white/30 dark:bg-[#131517] placeholder:dark:text-[#FFFFFFC9]"
                                      placeholder="Event Name"
                                    />

                                    <div className="grid grid-cols-1 gap-2">
                                      <div className="text-[14px] font-semibold text-[#FFFFFFc8]">
                                        Description
                                      </div>
                                      <div className="">
                                        <Textarea
                                          // className="h-[200px] resize-none bg-[#131517] text-[16px] outline-none placeholder:font-semibold placeholder:text-[#4c4d4f]"
                                          className="h-[100px] resize-none text-[16px] text-white outline-none placeholder:text-[14px] dark:border-white/30 dark:bg-[#131517]  placeholder:dark:text-[#FFFFFFC9]"
                                          placeholder="Who should come? What's the event about?"
                                        />
                                      </div>
                                    </div>

                                    <div className="w-full">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger
                                          asChild
                                          className="flex w-full flex-1"
                                        >
                                          <Button
                                            variant="outline"
                                            className="flex justify-between gap-2 dark:border-[#FFFFFF14] dark:bg-[#FFFFFF14]"
                                          >
                                            <div className="text-[16px] text-[#FFFFFFC9]">
                                              Visibility
                                            </div>
                                            <div className="flex items-center text-[16px] text-[#FFFFFF80]">
                                              {showPublic
                                                ? "Public"
                                                : "Private"}{" "}
                                              <LuChevronsUpDown className="ml-2" />
                                            </div>
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="z-[999] w-56 dark:border-[#FFFFFF14] dark:bg-[#1C1E20]">
                                          <DropdownMenuCheckboxItem
                                            checked={showPublic}
                                            onCheckedChange={(e) => {
                                              setPublic(e);
                                              setPrivate(false);
                                              console.log(
                                                "Public: ",
                                                showPublic,
                                              );
                                              console.log(
                                                "Private: ",
                                                showPrivate,
                                              );
                                            }}
                                            disabled={Boolean(showPublic)}
                                            className="flex flex-col items-start justify-start gap-1"
                                          >
                                            Public
                                            <p className="text-[#FFFFFF80]">
                                              Shown on your calendar and
                                              eligible to be featured.
                                            </p>
                                          </DropdownMenuCheckboxItem>
                                          <DropdownMenuCheckboxItem
                                            checked={showPrivate}
                                            onCheckedChange={(e) => {
                                              setPrivate(e);
                                              setPublic(false);
                                              console.log(
                                                "Public: ",
                                                showPublic,
                                              );
                                              console.log(
                                                "Private: ",
                                                showPrivate,
                                              );
                                            }}
                                            disabled={Boolean(showPrivate)}
                                            className="flex flex-col items-start justify-start gap-1"
                                          >
                                            Private
                                            <p className="text-[#FFFFFF80]">
                                              Unlisted. Only people with the
                                              link can register.
                                            </p>
                                          </DropdownMenuCheckboxItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2">
                                      <div className="text-[14px] font-semibold text-[#FFFFFFc8]">
                                        Time
                                      </div>
                                      <div className="bg-[#131517]/ flex flex-row justify-between gap-1 rounded-md border border-gray-600/30 px-5 py-3 backdrop-blur-md">
                                        <div className="relative w-full">
                                          <div className="absolute top-5 hidden h-8 border-l-[1px] border-dashed border-[#5F6062] md:block"></div>
                                          <div className="absolute -left-[5.8px] top-[5px] hidden h-3 w-3 rounded-full bg-[#5F6062] md:block"></div>
                                          <div className="absolute -left-[5.8px] bottom-[5px] hidden h-3 w-3 rounded-full border border-[#5F6062] md:block"></div>

                                          <div className="flex w-full flex-1 justify-between">
                                            <div className="ml-6 hidden flex-col justify-between gap-1 md:flex dark:text-[#FFFFFFA3]">
                                              <div>Start</div>
                                              <div>End</div>
                                            </div>
                                            <div className="flex w-full flex-col gap-1 md:w-[221px]">
                                              <div className="grid w-full grid-cols-1 gap-1">
                                                <div className="flex items-center justify-between gap-4">
                                                  <div className="block text-[#FFFFFFA3] md:hidden">
                                                    Start
                                                  </div>

                                                  <input
                                                    defaultValue={new Date().toISOString()}
                                                    type="datetime-local"
                                                    className="w-[267px] rounded-lg px-4 py-1 md:rounded-sm dark:bg-[#FFFFFF14] dark:text-[#FFFFFF]"
                                                  />
                                                </div>

                                                <div className="flex items-center justify-between gap-4">
                                                  <div className="block text-[#FFFFFFA3] md:hidden">
                                                    End
                                                  </div>

                                                  <input
                                                    defaultValue={new Date().toISOString()}
                                                    type="datetime-local"
                                                    className="w-[267px] rounded-lg px-4 py-1 md:rounded-sm dark:bg-[#FFFFFF14] dark:text-[#FFFFFF]"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2">
                                      <div className="text-[14px] font-semibold text-[#FFFFFFc8]">
                                        Location
                                      </div>
                                      <div className="flex flex-1 gap-2">
                                        <a className="flex h-[56px] w-full items-center justify-start gap-2 rounded-md border border-white/30 bg-slate-900 p-2 font-semibold hover:bg-transparent dark:border-white/30 dark:bg-transparent dark:text-[#FFFFFF] dark:hover:bg-transparent">
                                          <div className="flex items-center justify-center rounded-lg border border-gray-600/30 bg-[#29804e]/25 p-3 text-center">
                                            <LuMapPin className="text-xl text-[#50bd7d]" />
                                          </div>
                                          In Person
                                        </a>
                                        <a className="flex h-[56px] w-full items-center justify-start gap-2 rounded-md border border-white/30 bg-slate-900 p-2 font-semibold hover:bg-transparent dark:border-white/30 dark:bg-transparent dark:text-[#FFFFFF] dark:hover:bg-transparent">
                                          <div className="flex items-center justify-center rounded-lg border border-gray-600/30 bg-[#3787ff]/25 p-3 text-center">
                                            <LuVideo className="text-xl text-[#3787ff]" />
                                          </div>
                                          Virtual
                                        </a>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2">
                                      <div className="text-[14px] font-semibold text-[#FFFFFFc8]">
                                        Event Location
                                      </div>
                                      <Input
                                        type="text"
                                        className="py-[8px] text-[15px] font-semibold text-white dark:border-white/30 dark:bg-[#131517] placeholder:dark:text-[#ffffff86]"
                                        placeholder="Whats the address"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </SheetDescription>
                              <SheetFooter className="flex items-start px-[16px] sm:justify-start">
                                <SheetClose asChild>
                                  <Button type="submit">Update Event</Button>
                                </SheetClose>
                              </SheetFooter>
                            </SheetHeader>
                          </SheetContent>
                        </Sheet>

                        <a
                          href={"#"}
                          className="mt-[16px] flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#FFFFFF14] px-[10px] py-[6px] text-[14px] font-medium text-[#FFFFFFA3]"
                        >
                          Change Photo
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="mb-[10px] text-[20px] font-medium text-[#FFFFFF]">
                    Host
                  </h2>
                  <div className="flex gap-x-[20px] rounded-lg border border-gray-600/30 bg-gray-800/40 p-[12px] text-white backdrop-blur-sm">
                    <div className="flex items-center text-[14px] text-[#818384]">
                      <img
                        className="h-5 rounded-full"
                        src={
                          urlify(data?.user?.profile_photo) ||
                          "/assets/logo/icon.png"
                        }
                        alt=""
                      />
                      <h1 className="ml-2 line-clamp-1 text-[14px] font-medium text-white md:text-[16px]">
                        {data?.user?.name} {data?.user?.email}
                      </h1>

                      <div className="ml-2 flex items-center justify-center rounded-2xl bg-[#07A46022] px-[7px] py-[4px] text-[12px] font-medium leading-none text-[#47C97E]">
                        Creator
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="guest" className="border-t border-gray-600/30">
              <div className="mx-auto mt-[28px] flex max-w-[788px] flex-col gap-[20px] px-4 lg:px-0">
                <div className="flex text-[20px] font-semibold text-white">
                  At a Glance
                </div>
                <div className="flex flex-col">
                  <div className="flex w-full justify-between pb-[8px]">
                    <div className="text-[24px] text-[#939597]">
                      {guestList.length}{" "}
                      <span className="text-[16px]">guests</span>
                    </div>
                    <div className="text-[24px] text-[#939597]">
                      <span className="text-[16px]">cap</span> {data?.capacity}
                    </div>
                  </div>

                  <progress
                    value={guestList.length}
                    max={data?.capacity}
                    className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                  />
                </div>

                <div className="flex gap-4 border-b border-gray-600/30 pb-[32px]">
                  <a
                    href={`/check-in/${slug}/scan`}
                    className="flex w-fit items-center gap-2 rounded-lg border border-gray-600/30 bg-gray-800/40 py-[9px] pl-[10px] pr-[40px] text-[18px] font-semibold text-white backdrop-blur-sm"
                  >
                    <div className="rounded-md bg-[#29804e]/25 p-2">
                      <LuQrCode className="text-[25px] text-[#50bd7d]" />
                    </div>
                    Check In Guests
                  </a>
                  {/* <a
                    href="#"
                    className="flex w-fit items-center gap-2 rounded-lg border border-gray-600/30 bg-gray-800/40 py-[9px] pl-[10px] pr-[40px] text-[18px] font-semibold text-white backdrop-blur-sm"
                  >
                    <div className="rounded-md bg-[#FBD85B]/25 p-2">
                      <LuUsers className="text-[25px] text-[#FBD85B]" />
                    </div>
                    <div className="flex flex-col">
                      <p className="flex">Guest List</p>
                      <span className="text-[13px] text-[#939597]">
                        Shown to guests
                      </span>
                    </div>
                  </a> */}
                </div>

                <div>
                  <div className="flex pb-[12px] text-[20px] font-semibold text-white">
                    Guest List
                  </div>
                  <div className="relative">
                    <Input
                      className="pl-10 text-[18px] font-semibold text-[#939597] dark:bg-transparent placeholder:dark:text-[#939597]"
                      placeholder="Search..."
                    />
                    <LuSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#939597]" />
                  </div>
                </div>

                <Table className="border-gray-600/30">
                  <TableBody className="rounded-lg border-gray-600/30">
                    {guestList?.map((guest, index) => (
                      <TableRow
                        key={index}
                        className="border-gray-600/30 bg-gray-800/40"
                      >
                        <TableCell className="flex gap-2 ">
                          <img
                            className="h-5 rounded-full"
                            src={
                              urlify(guest?.user?.profile_photo) ||
                              "/assets/logo/icon.png"
                            }
                            alt=""
                          />
                          <p className="text-[16px] font-medium text-[#FFFFFF]">
                            {guest?.user?.name}{" "}
                            <span className="ml-2 text-[15px] text-[#FFFFFF80]">
                              {guest?.user?.email}
                            </span>
                          </p>
                        </TableCell>
                        <TableCell className="text-right">
                          {guest?.going_status === 1 && guest?.status === 1 && (
                            <div className="rounded-md bg-[#29804e]/25 text-center text-[12px] font-medium text-[#29804e] ">
                              Going
                            </div>
                          )}
                          {guest?.status === 2 && (
                            <div className="rounded-md bg-red-500/25 text-center text-[12px] font-medium text-red-500">
                              Rejected
                            </div>
                          )}
                          {guest?.status === 0 && (
                            <div className="flex items-center">
                              <Button
                                onClick={() => {
                                  manageGuestStatus(1, guest?.id);
                                }}
                                variant="ghost"
                                size="sm"
                                className="h-fit text-green-500"
                              >
                                <LuCheck className="mr-2 h-4 w-4 text-green-500" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => {
                                  manageGuestStatus(2, guest?.id);
                                }}
                                variant="ghost"
                                size="sm"
                                className="h-fit text-red-500"
                              >
                                <LuX className="mr-2 h-4 w-4 text-red-500" />
                                Decline
                              </Button>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-[14px] font-medium text-[#FFFFFF80]">
                          {new Date(guest?.created_at).toDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            {/* <TabsContent
              value="registration"
              className="border-t border-gray-600/30"
            >
              <div className="mx-auto mt-[28px] flex max-w-[788px] px-4 text-white lg:px-0">
                Registration
              </div>
            </TabsContent> */}
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default ManageEvent;
