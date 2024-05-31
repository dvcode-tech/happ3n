/* eslint-disable @next/next/no-img-element */

import { NextPage } from "next";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import * as clipboard from "clipboard-polyfill";

import {
  LuArrowUpRight,
  LuMapPin,
  LuShare,
  LuScanLine,
  LuQrCode,
  LuChevronsRight,
  LuSearch,
  LuVideo,
  LuChevronsUpDown,
  LuCheck,
  LuX,
  LuImage,
  LuLoader,
  LuCopy,
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
import { PLUS8HOURS, formatDate, removeNullValues, urlify } from "@/lib/utils";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileDialog } from "@/components/ui/file-dialog";
import Link from "next/link";

type Checked = DropdownMenuCheckboxItemProps["checked"];

const formSchema = z.object({
  name: z.string().min(1),
  start_at: z.string(),
  end_at: z.string(),
  location: z.string().min(1),
  type: z.string(),
  banner: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false;
      if (val.some((file) => !(file instanceof File))) return false;
      return true;
    }, "Must be an array of File")
    .optional()
    .nullable()
    .default(null),
  description: z.string().min(1),
});

const ManageEvent: NextPage = () => {
  const { isAuthenticated, ctxAccount, backend } = useHappenContext();
  const router = useRouter();
  const slug = router?.query?.q;

  const [data, setData] = useState<any>(null);
  const [guest, setGuest] = useState(45);
  const [guestList, setGuestList] = useState<any[]>([]);
  const [searchList, setSearchList] = useState<any[]>([]);

  const [type, setType] = useState("0");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [showPublic, setPublic] = React.useState<Checked>(true);
  const [showPrivate, setPrivate] = React.useState<Checked>(false);
  const [locationType, setLocationType] = useState("OFFLINE");

  const getGuestList = async () => {
    try {
      const response: any = (
        await backend.post(`/event/${data?.id}/guests/list`)
      ).data;

      setGuestList(response.data);
      setSearchList(response.data);

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
      start_at: "",
      end_at: "",
      location: "",
      banner: "",
      description: "",

      // description: "asasasd",
      // end_at: "2024-06-07T23:46",
      // banner: "",
      // location: "Tier One Entertainment HQ",
      // name: "ICP Hackaton 2024",
      // start_at: "2024-06-06T23:46",
      // type: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let banner_url = null;
      console.log("values: ", values);
      const handleUpload = async () => {
        //@ts-ignore
        if (!values.banner?.[0]) return null;

        const file = (values.banner as unknown as any)[0];
        const reference = (
          new Date().getTime().toString(36) +
          Math.random().toString(36).slice(2)
        ).toLowerCase();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              filename: `${reference}${path.extname(file.name)}`,
              contents: (reader.result as any)?.split(",")[1],
            });
          };
          reader.onerror = (error) => {
            reject(error);
          };
          reader.readAsDataURL(file);
        });
      };

      const bannerRessult = await handleUpload();

      if (bannerRessult) {
        const imagePost = await backend.post(
          "/upload",
          { file: bannerRessult },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        banner_url = (imagePost.data as any)?.data;
      }

      const locationData = {
        type: locationType,
        location: values.location,
      };

      const locationJson = JSON.stringify(locationData);

      const dataSubmit = {
        type: Number(type),
        banner: banner_url,
        name: values.name,
        start_at: new Date(values.start_at).getTime(),
        end_at: new Date(values.end_at).getTime(),
        location: locationJson,
        description: values.description,
      };

      console.log(dataSubmit);

      const eventPost = await backend.post(
        `/event/update/${data?.id}`,
        removeNullValues(dataSubmit),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      dialogClose();

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
      console.log("Data: ", data?.data);
      const saveData = data?.data;
      setData(saveData);

      setType(`${saveData?.type}`);
      setLocationType(JSON.parse(saveData?.location)?.type);

      console.log(JSON.parse(saveData?.location)?.type);

      const formresetData = {
        name: saveData?.name,
        start_at: new Date(saveData?.start_at + PLUS8HOURS)
          .toISOString()
          .slice(0, 16),
        end_at: new Date(saveData?.end_at + PLUS8HOURS)
          .toISOString()
          .slice(0, 16),
        location: JSON.parse(saveData?.location)?.location,
        description: saveData?.description,
        type: "",
      };

      console.log(formresetData);
      form.reset(formresetData);
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

  const onHandleSearch = (search: string) => {
    if (search.length < 1) {
      setSearchList(guestList);
      return;
    }

    setSearchList(
      guestList.filter(
        (item) =>
          item?.user?.name.includes(search) ||
          item?.user?.email.includes(search) ||
          item?.user?.username.includes(search),
      ),
    );
  };

  useEffect(() => {
    if (!slug) return;
    fetchEvent(slug);
  }, [slug]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated]);

  const dialogClose = () => {
    document.getElementById("closeDialog")?.click();
  };

  return (
    <div className="min-h-screen bg-black bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat">
      <Header />
      <Navbar />
      {!data && (
        <div className="mb-[48px] mt-[64px] flex h-[348px] flex-col items-center justify-center">
          <LuLoader className="h-10 w-10 animate-spin text-white" />
        </div>
      )}
      {data && (
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
            <Link
              target="_blank"
              href={`/event?q=${slug}`}
              className="flex h-9 items-center justify-center gap-1 rounded-md bg-[#FFFFFF14] px-[12px] py-[11px] text-[14px] font-medium leading-none text-[#FFFFFFA3] hover:bg-gray-400"
            >
              <p className="hidden md:block">Event Page</p>
              <LuArrowUpRight />
            </Link>
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
              </TabsList>

              <TabsContent
                value="overview"
                className="border-t border-gray-600/30"
              >
                <div className="mx-auto mt-[28px] flex max-w-[788px] flex-col gap-[20px] px-4 lg:px-0">
                  {/* <div>
                    <a
                      href="#"
                      className="flex w-fit items-center gap-2 rounded-lg border border-gray-600/30 bg-gray-800/40 px-[22px] py-[9px] text-[18px] font-semibold text-white backdrop-blur-sm"
                    >
                      <LuShare /> Share Event
                    </a>
                  </div> */}

                  <div className="flex flex-col gap-x-[20px] rounded-lg border border-gray-600/30 bg-gray-800/40 p-[12px] text-white backdrop-blur-sm md:flex-row">
                    <div className="flex flex-1">
                      <div
                        className="relative aspect-[1/1] h-[257px] w-[332px] overflow-hidden rounded-lg bg-gray-800/40 bg-contain bg-center bg-no-repeat md:h-[280px] md:w-[371px]"
                        style={{
                          // background: `${urlify(data?.banner)}`,
                          backgroundImage: `url(${urlify(data?.banner)})`,
                        }}
                      >
                        <div className="absolute bottom-2 left-1/2 mx-auto flex w-[355px] -translate-x-1/2 justify-between rounded-md bg-[#13151752] py-2 backdrop-blur-md">
                          <div className="flex items-center gap-1 pl-4 text-[14px] text-[#FFFFFFCC]">
                            {`${data?.slug}`} <LuArrowUpRight />
                          </div>

                          <button
                            id="copy"
                            // data-clipboard-text={`${location.origin}/event?q=${data?.slug}`}

                            onClick={() => {
                              clipboard.writeText(
                                `${location.origin}/event?q=${data?.slug}`,
                              );
                              toast({
                                variant: "default",
                                title: "Copied",
                                duration: 2000,
                              });
                            }}
                            className="pr-4 text-[14px] uppercase text-[#FFFFFF7A]"
                          >
                            <LuCopy />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="mb-[16px] mt-[8px]">
                        <h3 className="text-[18px] font-medium">
                          When & Where
                        </h3>
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
                          <Link
                            // target="_blank"
                            href={`/check-in?q=${slug}`}
                            className="mt-[16px] flex items-center justify-center gap-1 rounded-lg bg-[#FFFFFF14] px-[10px] py-[6px] text-[14px] font-medium text-[#FFFFFFA3]"
                          >
                            <LuScanLine /> Check In Guests
                          </Link>
                        </div>

                        <div className="flex  flex-1 gap-2">
                          <Sheet>
                            <SheetTrigger asChild>
                              <div className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg bg-[#FFFFFF14] px-[10px] py-[6px] text-[14px] font-medium text-[#FFFFFFA3]">
                                Edit Event
                              </div>
                            </SheetTrigger>

                            <SheetContent className="z-[900] w-full bg-[#1C1E20] md:w-[550px]">
                              <SheetHeader className="sticky">
                                <SheetTitle className="border-b border-gray-600/30">
                                  <div className="flex flex-row items-center gap-3 p-[16px] pb-4">
                                    <LuChevronsRight
                                      onClick={() => dialogClose()}
                                    />
                                    <p className="text-[16px]">Edit Event</p>
                                  </div>
                                </SheetTitle>
                                <SheetDescription className="h-[90vh] overflow-y-auto">
                                  <Form {...form}>
                                    <form
                                      onSubmit={form.handleSubmit(handleSubmit)}
                                      className="space-y-8 p-[16px]"
                                    >
                                      <div className="">
                                        <div className="flex flex-1 items-center justify-center">
                                          <FormItem>
                                            <FormControl>
                                              <FileDialog
                                                setValue={form.setValue}
                                                name="banner"
                                                maxFiles={1}
                                                maxSize={1024 * 1024 * 1}
                                                accept={{ "image/*": [] }}
                                                isUploading={false}
                                                disabled={false}
                                              >
                                                <Button
                                                  variant="outline"
                                                  style={{
                                                    backgroundImage: `url(${urlify(data?.banner)})`,
                                                  }}
                                                  className="relative flex aspect-[1/1] h-[358px] flex-col items-center justify-center rounded-xl bg-cover bg-no-repeat md:h-[280px] lg:h-[330px]"
                                                >
                                                  <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border border-black bg-white hover:text-gray-700">
                                                    <LuImage className="h-5 w-5" />
                                                  </div>
                                                </Button>
                                              </FileDialog>
                                            </FormControl>
                                          </FormItem>
                                        </div>

                                        <div className="my-[16px] text-left text-[18px] font-bold text-white">
                                          Basic Info
                                        </div>

                                        <div className="flex flex-col gap-8">
                                          <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormControl>
                                                  <Input
                                                    type="text"
                                                    className="py-[8px] text-[18px] font-semibold text-white dark:border-white/30 dark:bg-[#131517] placeholder:dark:text-[#FFFFFFC9]"
                                                    placeholder="Event Name"
                                                    {...field}
                                                  />
                                                </FormControl>
                                              </FormItem>
                                            )}
                                          />

                                          <div className="grid grid-cols-1 gap-2">
                                            <div className="text-left text-[14px] font-semibold text-[#FFFFFFc8]">
                                              Description
                                            </div>
                                            <FormField
                                              control={form.control}
                                              name="description"
                                              render={({ field }) => (
                                                <FormItem>
                                                  <FormControl>
                                                    <Textarea
                                                      className="h-[100px] resize-none text-[16px] text-white outline-none placeholder:text-[14px] dark:border-white/30 dark:bg-[#131517]  placeholder:dark:text-[#FFFFFFC9]"
                                                      placeholder="Who should come? What's the event about?"
                                                      {...field}
                                                    />
                                                  </FormControl>
                                                </FormItem>
                                              )}
                                            />
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
                                                    setType("0");
                                                    setPrivate(false);
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
                                                    setType("1");
                                                    setPublic(false);
                                                  }}
                                                  disabled={Boolean(
                                                    showPrivate,
                                                  )}
                                                  className="flex flex-col items-start justify-start gap-1"
                                                >
                                                  Private
                                                  <p className="text-[#FFFFFF80]">
                                                    Unlisted. Only people with
                                                    the link can register.
                                                  </p>
                                                </DropdownMenuCheckboxItem>
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          </div>

                                          <div className="grid grid-cols-1 gap-2">
                                            <div className="text-left text-[14px] font-semibold text-[#FFFFFFc8]">
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
                                                        <FormField
                                                          control={form.control}
                                                          name="start_at"
                                                          render={({
                                                            field,
                                                          }) => (
                                                            <FormItem>
                                                              <FormControl>
                                                                <input
                                                                  defaultValue={new Date().toISOString()}
                                                                  type="datetime-local"
                                                                  className="w-[230px] rounded-lg px-4 py-1 md:rounded-sm dark:bg-[#FFFFFF14] dark:text-[#FFFFFF]"
                                                                  {...field}
                                                                  onChange={(
                                                                    e,
                                                                  ) => {
                                                                    field.onChange(
                                                                      e.target
                                                                        .value,
                                                                    );
                                                                    setStartAt(
                                                                      e.target
                                                                        .value,
                                                                    );
                                                                  }}
                                                                />
                                                              </FormControl>
                                                            </FormItem>
                                                          )}
                                                        />
                                                      </div>

                                                      <div className="flex items-center justify-between gap-4">
                                                        <div className="block text-[#FFFFFFA3] md:hidden">
                                                          End
                                                        </div>
                                                        <FormField
                                                          control={form.control}
                                                          name="end_at"
                                                          render={({
                                                            field,
                                                          }) => (
                                                            <FormItem>
                                                              <FormControl>
                                                                <input
                                                                  defaultValue={new Date().toISOString()}
                                                                  type="datetime-local"
                                                                  className="w-[230px] rounded-lg px-4 py-1 md:rounded-sm dark:bg-[#FFFFFF14] dark:text-[#FFFFFF]"
                                                                  {...field}
                                                                  onChange={(
                                                                    e,
                                                                  ) => {
                                                                    field.onChange(
                                                                      e.target
                                                                        .value,
                                                                    );
                                                                    setEndAt(
                                                                      e.target
                                                                        .value,
                                                                    );
                                                                  }}
                                                                />
                                                              </FormControl>
                                                            </FormItem>
                                                          )}
                                                        />
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="grid grid-cols-1 gap-2">
                                            <div className="text-left text-[14px] font-semibold text-[#FFFFFFc8]">
                                              Location
                                            </div>
                                            <div className="flex flex-1 gap-2">
                                              <div
                                                onClick={() =>
                                                  setLocationType("OFFLINE")
                                                }
                                                className="relative flex h-[45px] w-full cursor-pointer items-center justify-start gap-2 rounded-md border border-white/30 bg-slate-900 p-2 font-semibold hover:bg-transparent md:h-[56px] dark:border-white/30 dark:bg-transparent dark:text-[#FFFFFF] dark:hover:bg-transparent"
                                              >
                                                <div className="flex items-center justify-center rounded-lg border border-gray-600/30 bg-[#29804e]/25 p-1 text-center md:p-3">
                                                  <LuMapPin className="text-xl text-[#50bd7d]" />
                                                </div>
                                                In Person
                                                {locationType === "OFFLINE" && (
                                                  <div className="absolute right-2 rounded-full bg-[#50bd7d] p-1 md:right-4">
                                                    <LuCheck className="text-sm text-gray-950" />
                                                  </div>
                                                )}
                                              </div>

                                              <div
                                                onClick={() =>
                                                  setLocationType("VIRTUAL")
                                                }
                                                className="relative flex h-[45px] w-full items-center justify-start gap-2 rounded-md border border-white/30 bg-slate-900 p-2 font-semibold hover:bg-transparent md:h-[56px] dark:border-white/30 dark:bg-transparent dark:text-[#FFFFFF] dark:hover:bg-transparent"
                                              >
                                                <div className="flex items-center justify-center rounded-lg border border-gray-600/30 bg-[#3787ff]/25 p-1 text-center md:p-3">
                                                  <LuVideo className="text-xl text-[#3787ff] md:text-base" />
                                                </div>
                                                Virtual
                                                {locationType === "VIRTUAL" && (
                                                  <div className="absolute right-2 rounded-full bg-[#3787ff] p-1 md:right-4">
                                                    <LuCheck className="text-sm text-gray-950 md:text-xl" />
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>

                                          {locationType === "OFFLINE" && (
                                            <div className="grid grid-cols-1 gap-2">
                                              <div className="text-left text-[14px] font-semibold text-[#FFFFFFc8]">
                                                Event Location
                                              </div>
                                              <FormField
                                                control={form.control}
                                                name="location"
                                                render={({ field }) => (
                                                  <FormItem>
                                                    <FormControl>
                                                      <Input
                                                        type="text"
                                                        className="py-[8px] text-[15px] font-semibold text-white dark:border-white/30 dark:bg-[#131517] placeholder:dark:text-[#ffffff86]"
                                                        placeholder="Whats the address?"
                                                        {...field}
                                                      />
                                                    </FormControl>
                                                  </FormItem>
                                                )}
                                              />
                                            </div>
                                          )}

                                          {locationType === "VIRTUAL" && (
                                            <div className="grid grid-cols-1 gap-2">
                                              <div className="text-left text-[14px] font-semibold text-[#FFFFFFc8]">
                                                Join URL
                                              </div>
                                              <FormField
                                                control={form.control}
                                                name="location"
                                                render={({ field }) => (
                                                  <FormItem>
                                                    <FormControl>
                                                      <Input
                                                        type="text"
                                                        className="py-[8px] text-[15px] font-semibold text-white dark:border-white/30 dark:bg-[#131517] placeholder:dark:text-[#ffffff86]"
                                                        placeholder="https://meet.google.com/abc-defg-hij"
                                                        {...field}
                                                      />
                                                    </FormControl>
                                                  </FormItem>
                                                )}
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <Button type="submit">
                                        Update Event
                                      </Button>
                                    </form>
                                  </Form>
                                </SheetDescription>
                              </SheetHeader>
                            </SheetContent>
                          </Sheet>
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

              <TabsContent
                value="guest"
                className="border-t border-gray-600/30"
              >
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
                        <span className="text-[16px]">cap</span>{" "}
                        {data?.capacity}
                      </div>
                    </div>

                    <progress
                      value={guestList.length}
                      max={data?.capacity}
                      className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                    />
                  </div>

                  <div className="flex gap-4 border-b border-gray-600/30 pb-[32px]">
                    <Link
                      href={`/check-in?q=${slug}`}
                      className="flex w-fit items-center gap-2 rounded-lg border border-gray-600/30 bg-gray-800/40 py-[9px] pl-[10px] pr-[40px] text-[18px] font-semibold text-white backdrop-blur-sm"
                    >
                      <div className="rounded-md bg-[#29804e]/25 p-2">
                        <LuQrCode className="text-[25px] text-[#50bd7d]" />
                      </div>
                      Check In Guests
                    </Link>
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
                        onChange={(event) => {
                          onHandleSearch(event.target.value);
                        }}
                        className="pl-10 text-[18px] font-semibold text-[#939597] dark:bg-transparent placeholder:dark:text-[#939597]"
                        placeholder="Search..."
                      />
                      <LuSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#939597]" />
                    </div>
                  </div>

                  <Table className="border-gray-600/30">
                    <TableBody className="rounded-lg border-gray-600/30">
                      {searchList?.map((guest, index) => (
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
                            {guest?.going_status === 1 &&
                              guest?.status === 1 && (
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
      )}
    </div>
  );
};

export default ManageEvent;
