/* eslint-disable @next/next/no-img-element */

import { NextPage } from "next";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LuArrowUpRight,
  LuLoader,
  LuMapPin,
  LuPlus,
  LuInstagram,
  LuTwitter,
  LuFacebook,
  LuGlobe,
  LuVideo,
  LuChevronsRight,
  LuImage,
} from "react-icons/lu";
import { FaTiktok } from "react-icons/fa";
import { useHappenContext } from "@/context/HappenContext";
import useUserEvent from "@/hooks/useUserEvent";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { formatDate, removeNullValues, urlify } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileDialog } from "@/components/ui/file-dialog";
import path from "path";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  tiktok: z.string().optional(),
  instagram: z.string().optional(),
  website: z.string().optional(),
  profile_photo: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false;
      if (val.some((file) => !(file instanceof File))) return false;
      return true;
    }, "Must be an array of File")
    .optional()
    .nullable()
    .default(null),
  banner_photo: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false;
      if (val.some((file) => !(file instanceof File))) return false;
      return true;
    }, "Must be an array of File")
    .optional()
    .nullable()
    .default(null),
  // banner_photo: z.string().optional(),
});

const User: NextPage = () => {
  const router = useRouter();
  const { ctxAccount, isAuthenticated, backend } = useHappenContext();
  const [eventState, eventFunction] = useUserEvent();
  const slug = router?.query?.p;
  const [submittingLoading, setSubmittingLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;
    eventFunction.fetchEvents?.(slug);
  }, [slug]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
      facebook: "facebook.com/",
      twitter: "twitter.com/",
      tiktok: "",
      instagram: "instagram.com/",
      website: "",
      profile_photo: "",
      banner_photo: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setSubmittingLoading(true);
      let banner_url = null;
      let cover_url = null;

      const handleUploadProfile = async () => {
        //@ts-ignore
        if (!values.profile_photo?.[0]) return null;

        const file = (values.profile_photo as unknown as any)[0];
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

      const handleUploadCover = async () => {
        //@ts-ignore
        if (!values.banner_photo?.[0]) return null;

        const file = (values.banner_photo as unknown as any)[0];
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

      const bannerRessult = await handleUploadProfile();

      const coverResult = await handleUploadCover();

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

      if (coverResult) {
        const imagePost = await backend.post(
          "/upload",
          { file: coverResult },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        cover_url = (imagePost.data as any)?.data;
      }

      const dataSubmit = {
        name: values.name,
        bio: values.bio,
        facebook: values.facebook,
        twitter: values.twitter,
        tiktok: values.tiktok,
        instagram: values.instagram,
        website: values.website,
        profile_photo: banner_url,
        banner_photo: cover_url,
      };
      console.log(dataSubmit);

      const userPost = await backend.post(
        `/user/update`,
        removeNullValues(dataSubmit),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      toast({
        variant: "default",
        title: "Success",
        description: (userPost.data as any)?.message,
        duration: 2000,
      });
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: e?.message || e?.data?.message,
        duration: 1000,
      });
    } finally {
      dialogClose();
      eventFunction.fetchEvents?.(slug).finally(() => {
        setSubmittingLoading(false);
      });
    }
  }

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values);
  };

  const dialogClose = () => {
    document.getElementById("closeDialog")?.click();
  };

  useEffect(() => {
    if (!eventState?.userInfo) return;

    form.reset({
      name: eventState?.userInfo?.name || "",
      bio: eventState?.userInfo?.bio || "",
      facebook: eventState?.userInfo?.facebook || "",
      twitter: eventState?.userInfo?.twitter || "",
      tiktok: eventState?.userInfo?.tiktok || "",
      instagram: eventState?.userInfo?.instagram || "",
      website: eventState?.userInfo?.website || "",
      profile_photo: "",
      banner_photo: "",
    });
  }, [eventState?.userInfo]);

  return (
    <div className="min-h-screen bg-black bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat">
      <Header />
      <Navbar />
      {eventState?.loading && (
        <div className="flex h-[348px] flex-col items-center justify-center">
          <LuLoader className="h-10 w-10 animate-spin text-white" />
        </div>
      )}
      {!eventState?.loading && (
        <>
          <section className="mb-[24px] border-t-white lg:px-[14px] lg:py-[8px]">
            <div className="relative mx-auto max-w-[1008px]">
              <img
                className="max-h-[357px] w-full bg-no-repeat object-cover object-top lg:rounded-xl"
                src={
                  urlify(eventState?.userInfo?.banner_photo) ||
                  "/assets/placeholder/cover.png"
                }
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = "/assets/placeholder/cover.png";
                }}
                alt=""
              />
              <div className="absolute flex w-full flex-1 translate-y-[-40%] px-[14px] md:px-[35px]">
                <div className="flex w-full justify-between">
                  <div className="rounded-lg bg-[#070419] p-0.5 md:left-[35px] md:rounded-[12px] md:p-[4px] lg:rounded-[20px] lg:p-1.5">
                    <img
                      className="aspect-[1/1] w-[64px] rounded-lg md:w-[96px] lg:rounded-2xl"
                      src={
                        urlify(eventState?.userInfo?.profile_photo) ||
                        "/assets/placeholder/placeholder_banner.png"
                      }
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src =
                          "/assets/placeholder/placeholder_banner.png";
                      }}
                      alt=""
                    />
                  </div>
                  {isAuthenticated &&
                    eventState?.userInfo?.username === ctxAccount?.username && (
                      <div className="flex items-end justify-end pt-1.5">
                        <Dialog>
                          <DialogTrigger>
                            <Button
                              variant="outline"
                              size={"sm"}
                              className="flex w-[110px] border border-white bg-gray-800/40 px-[10px] py-2 text-[12px] md:px-[14px] md:py-[10px] md:text-[16px] dark:bg-transparent dark:text-[#FFFFFF]"
                            >
                              Edit Profile
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="z-[999] max-h-[90vh] overflow-y-auto border border-gray-600/30 bg-[#1F1E21]/60 px-5 py-3 backdrop-blur-md sm:max-w-[480px] md:max-w-[700px]">
                            <DialogHeader className="flex flex-col space-y-[80px]">
                              <Form {...form}>
                                <form
                                  onSubmit={form.handleSubmit(handleSubmit)}
                                  className="space-y-8"
                                >
                                  <DialogTitle className="relative overflow-hidden text-left">
                                    <div className="mb-[20px] flex flex-col gap-2">
                                      <h1 className="text-left text-[20px] text-[#FFFFFF]">
                                        Your Profile
                                      </h1>
                                      <p className="text-left text-[16px] font-normal text-[#D2D4D7]">
                                        Choose how you are displayed as a host
                                        or guest.
                                      </p>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                      <div className="flex flex-col items-center gap-4">
                                        <div className="flex w-full flex-col gap-2">
                                          <div className="text-[14px] text-[#FFFFFFC9]">
                                            Cover photo
                                          </div>
                                          <FormItem>
                                            <div className="flex flex-row items-center justify-center gap-1.5">
                                              <FormControl>
                                                <FileDialog
                                                  size="h-24 md:h-44"
                                                  setValue={form.setValue}
                                                  name="banner_photo"
                                                  maxFiles={1}
                                                  maxSize={1024 * 1024 * 0.8}
                                                  accept={{ "image/*": [] }}
                                                  isUploading={false}
                                                  disabled={false}
                                                >
                                                  <Button
                                                    variant="outline"
                                                    style={{
                                                      backgroundImage: `url(${urlify(eventState?.userInfo?.banner_photo)})`,
                                                    }}
                                                    className="relative flex h-[187px] max-w-full flex-1 flex-col items-center justify-center rounded-xl bg-cover bg-no-repeat"
                                                  >
                                                    <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border border-black bg-white hover:text-gray-700">
                                                      <LuImage className="h-5 w-5" />
                                                    </div>
                                                  </Button>
                                                </FileDialog>
                                              </FormControl>
                                            </div>
                                          </FormItem>
                                        </div>

                                        <div className="flex w-full flex-1 flex-col gap-2">
                                          <div className="text-[14px] text-[#FFFFFFC9]">
                                            Profile photo
                                          </div>
                                          <div className="flex items-center justify-center">
                                            <FormItem>
                                              <div className="flex flex-row gap-1.5">
                                                <FormControl>
                                                  <FileDialog
                                                    size="h-40"
                                                    setValue={form.setValue}
                                                    name="profile_photo"
                                                    maxFiles={1}
                                                    maxSize={1024 * 1024 * 0.8}
                                                    accept={{ "image/*": [] }}
                                                    isUploading={false}
                                                    disabled={false}
                                                  >
                                                    <Button
                                                      variant="outline"
                                                      style={{
                                                        backgroundImage: `url(${urlify(eventState?.userInfo?.profile_photo)})`,
                                                      }}
                                                      className="relative flex aspect-[1/1] h-40 w-40 flex-col items-center justify-center rounded-xl bg-cover bg-no-repeat"
                                                    >
                                                      <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border border-black bg-white hover:text-gray-700">
                                                        <LuImage className="h-5 w-5" />
                                                      </div>
                                                    </Button>
                                                  </FileDialog>
                                                </FormControl>
                                              </div>
                                            </FormItem>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-col gap-4 md:mt-[20px] md:flex-row">
                                        <div className="flex flex-1 flex-col space-y-3">
                                          <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel className="text-[#FFFFFFC9]">
                                                  Name
                                                </FormLabel>
                                                <FormControl>
                                                  <Input
                                                    className="text-white outline-none dark:border dark:border-gray-600/30"
                                                    {...field}
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                          <FormField
                                            control={form.control}
                                            name="bio"
                                            render={({ field }) => (
                                              <FormItem>
                                                <FormLabel className="text-[#FFFFFFC9]">
                                                  Bio
                                                </FormLabel>
                                                <FormControl>
                                                  <Textarea
                                                    className="h-[100px] resize-none text-[16px] text-white outline-none placeholder:text-[14px] dark:border-gray-600/30 dark:bg-[#131517]  placeholder:dark:text-[#FFFFFFC9]"
                                                    placeholder="Share a litte about background amd interest."
                                                    {...field}
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                        </div>
                                        <div className="flex flex-1 flex-col space-y-3">
                                          <div className="text-[14px] text-[#FFFFFFC9]">
                                            Socials
                                          </div>
                                          <FormField
                                            control={form.control}
                                            name="instagram"
                                            render={({ field }) => (
                                              <FormItem className="flex items-center space-x-2 space-y-0">
                                                <LuInstagram className="text-[#FFFFFF80]" />
                                                <FormControl>
                                                  <Input
                                                    className="text-white outline-none dark:border dark:border-gray-600/30"
                                                    {...field}
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                          <FormField
                                            control={form.control}
                                            name="facebook"
                                            render={({ field }) => (
                                              <FormItem className="flex items-center space-x-2 space-y-0">
                                                <LuFacebook className="text-[#FFFFFF80]" />
                                                <FormControl>
                                                  <Input
                                                    className="text-white outline-none dark:border dark:border-gray-600/30"
                                                    {...field}
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                          <FormField
                                            control={form.control}
                                            name="twitter"
                                            render={({ field }) => (
                                              <FormItem className="flex items-center space-x-2 space-y-0">
                                                <LuTwitter className="text-[#FFFFFF80]" />
                                                <FormControl>
                                                  <Input
                                                    className="text-white outline-none dark:border dark:border-gray-600/30"
                                                    {...field}
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                          <FormField
                                            control={form.control}
                                            name="website"
                                            render={({ field }) => (
                                              <FormItem className="flex items-center space-x-2 space-y-0">
                                                <LuGlobe className="text-[#FFFFFF80]" />
                                                <FormControl>
                                                  <Input
                                                    className="text-white outline-none dark:border dark:border-gray-600/30 dark:placeholder:text-[#4f4f4f]"
                                                    placeholder="Your Website"
                                                    {...field}
                                                  />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </DialogTitle>

                                  <div>
                                    {!submittingLoading && (
                                      <Button type="submit">
                                        Save Changes
                                      </Button>
                                    )}
                                    {submittingLoading && (
                                      <LuLoader className="mx-auto h-6 w-6 animate-spin text-white" />
                                    )}
                                  </div>
                                </form>
                              </Form>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="mx-auto mt-[60px] flex max-w-[928px] flex-col gap-1 px-[14px] md:mt-[70px]">
              <h1 className="text-[22px] font-medium leading-6 text-[#FFFFFF] md:text-[32px] md:leading-8">
                {eventState?.userInfo?.name}
              </h1>
              <p className="text-[14px] text-[#FFFFFFC9] md:text-[16px]">
                {eventState?.userInfo?.bio || "Where Great Events Begin!"}
              </p>
            </div>
          </section>
          <div className="w-full border-t border-gray-600/30"></div>
          <div className="mx-auto mt-[10px] flex min-h-screen max-w-[1008px] flex-1 flex-col gap-[24px] px-[14px] md:mt-[24px]">
            <Tabs defaultValue="upcoming">
              <div className="mb-[8px] flex w-full items-center justify-between">
                <div className="text-[32px] font-semibold text-white">
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

              <TabsContent className="pt-[32px] text-white" value="upcoming">
                {eventState?.upcomingEvent?.length === 0 && (
                  <div className="mb-[48px] mt-[64px] flex h-[348px] flex-col items-center justify-center">
                    <div className="text-[24px] font-semibold text-[#FFFFFFC9]">
                      No Upcoming Events
                    </div>
                  </div>
                )}
                {eventState?.upcomingEvent?.length > 0 && (
                  <div className="container mx-auto py-4">
                    <div className="relative border-l-[2px] border-dashed border-[#262729] md:ml-[150px]">
                      {eventState?.upcomingEvent?.map(
                        (event: any, index: number) => (
                          <Sheet key={index}>
                            <div
                              key={index}
                              className="mb-[30px] md:mb-10 md:ml-4"
                            >
                              <div className="absolute -left-[7.5px] h-3 w-3 rounded-full bg-[#5F6062]"></div>
                              <div className="mb-[10px] ml-6 flex items-center gap-2 md:absolute md:-left-[150px] md:ml-0 md:flex-col md:gap-0">
                                <h3 className="text-[17px] font-semibold text-white">
                                  {formatDate(event?.start_at).monthLongName}{" "}
                                  {formatDate(event?.start_at).day}
                                </h3>
                                <h3 className="text-[16px] font-semibold text-[#88898A]">
                                  {formatDate(event?.start_at).dayName}
                                </h3>
                              </div>
                              <SheetTrigger className="w-full">
                                <div className="ml-6 flex flex-row justify-between gap-1 rounded-md border border-gray-600/30 bg-gray-500/20 px-5 py-3 backdrop-blur-md">
                                  <div className="flex flex-col items-start text-left">
                                    <h3 className="text-[16px] font-semibold text-[#88898A] md:text-[18px]">
                                      {formatDate(event?.start_at).time}
                                    </h3>
                                    <h3 className="text-[18px] font-semibold text-white md:text-[18px]">
                                      {event?.name}
                                    </h3>
                                    <div className="my-1 flex items-center gap-2">
                                      By
                                      <img
                                        className="h-4 rounded-full"
                                        src={
                                          urlify(event?.user?.profile_photo) ||
                                          "assets/logo/icon.png"
                                        }
                                        alt=""
                                      />
                                      <p className="text-[#FFFFFF]">
                                        {event?.user?.name}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      {JSON.parse(event?.location || "{}")
                                        ?.type === "VIRTUAL" ? (
                                        <LuVideo className="h-7" />
                                      ) : (
                                        <LuMapPin className="h-7" />
                                      )}
                                      {JSON.parse(event?.location || "{}")
                                        ?.type !== "VIRTUAL" && (
                                        <h3 className="line-clamp-1 text-[16px] font-semibold text-[#88898A]">
                                          {
                                            JSON.parse(event?.location || "{}")
                                              ?.location
                                          }
                                        </h3>
                                      )}
                                    </div>
                                    {event?.isOwned === true && (
                                      <div className="flex items-center pt-1">
                                        <Button
                                          onClick={() => {
                                            router.push(
                                              `/event/manage?q=${event?.slug}`,
                                            );
                                          }}
                                          size={"sm"}
                                          className="h-8"
                                        >
                                          Manage Event
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                  <img
                                    className="aspect-[1/1] h-[90px] rounded-md md:h-[120px]"
                                    src={urlify(event?.banner)}
                                    onError={({ currentTarget }) => {
                                      currentTarget.onerror = null;
                                      currentTarget.src =
                                        "/assets/placeholder/placeholder_banner.png";
                                    }}
                                    alt=""
                                  />
                                </div>
                              </SheetTrigger>
                              <SheetContent className="z-[999] w-full md:w-[550px]">
                                <SheetHeader className="sticky">
                                  <SheetTitle className="border-b border-gray-600/30">
                                    <div className="flex flex-row items-center gap-3 p-[16px] pb-4">
                                      <LuChevronsRight
                                        className="text-xl"
                                        onClick={() => dialogClose()}
                                      />
                                      <Link
                                        href={`/event?q=${event?.slug}`}
                                        target="_blank"
                                        className="rounded-md bg-gray-500/50 px-4 py-1 text-[14px] text-[#FFFFFFA3] hover:bg-gray-400"
                                      >
                                        Event Page
                                      </Link>
                                      <div className="flex flex-row items-center gap-3 p-[16px] pb-4"></div>
                                    </div>
                                  </SheetTitle>
                                  <SheetDescription>
                                    <ScrollArea className="flex h-[750px] w-full flex-col px-[16px] md:h-[660px] xl:md:h-[800px]">
                                      <div className="mb-[40px] flex flex-1 items-center justify-center md:mx-[16px] md:mt-[16px]">
                                        <img
                                          className="h-[358px] rounded-lg md:h-[280px]"
                                          src={urlify(event?.banner)}
                                          onError={({ currentTarget }) => {
                                            currentTarget.onerror = null;
                                            currentTarget.src =
                                              "/assets/placeholder/placeholder_banner.png";
                                          }}
                                          alt=""
                                        />
                                      </div>
                                      <div className="flex flex-col gap-8 text-left">
                                        <div className="flex flex-col gap-4">
                                          <h3 className="text-[32px] font-semibold leading-8 text-white">
                                            {event?.name}
                                          </h3>
                                          <p className="text-[16px] font-semibold text-[#818384]">
                                            Hosted by {event?.user?.name}
                                          </p>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                          <div className="flex">
                                            <div className="h-[50px] w-[50px] rounded-lg border border-gray-600/30 text-center">
                                              <div className="rounded-t-md bg-[#262729] text-[8px] font-medium uppercase text-gray-300">
                                                {
                                                  formatDate(event?.start_at)
                                                    .monthLongName
                                                }
                                              </div>
                                              <div className="flex flex-1 items-center justify-center rounded-b-md p-1 text-[16px] font-medium uppercase text-gray-300">
                                                {
                                                  formatDate(event?.start_at)
                                                    .day
                                                }
                                              </div>
                                            </div>
                                            <div className="ml-4 flex flex-col justify-center gap-0.5 text-white">
                                              <div className="text-[16px] font-medium">
                                                {
                                                  formatDate(event?.start_at)
                                                    .dayName
                                                }
                                                ,{" "}
                                                {
                                                  formatDate(event?.start_at)
                                                    .monthLongName
                                                }{" "}
                                                {
                                                  formatDate(event?.start_at)
                                                    .day
                                                }
                                              </div>
                                              <div className="text-[14px] font-medium text-[#818384]">
                                                {
                                                  formatDate(event?.start_at)
                                                    .time
                                                }
                                                {" - "}
                                                {event?.end_at -
                                                  event?.start_at >=
                                                24 * 60 * 60
                                                  ? `${formatDate(event?.end_at).monthLongName} ${formatDate(event?.end_at).day}, `
                                                  : ""}
                                                {formatDate(event?.end_at).time}{" "}
                                                GMT+8
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flex">
                                            <div className="flex h-[50px] w-[50px] items-center justify-center rounded-lg border border-gray-600/30 text-center">
                                              {JSON.parse(
                                                event?.location || "{}",
                                              )?.type === "VIRTUAL" ? (
                                                <LuVideo className="text-xl text-gray-300" />
                                              ) : (
                                                <LuMapPin className="text-xl text-gray-300" />
                                              )}
                                            </div>
                                            <Link
                                              href="#"
                                              className="ml-4 flex flex-col justify-center gap-0.5 text-white"
                                            >
                                              <div className="font-medium] flex gap-1 text-[16px]">
                                                {
                                                  JSON.parse(
                                                    event?.location || "{}",
                                                  )?.type
                                                }{" "}
                                                <LuArrowUpRight className="text-[#818384]" />
                                              </div>
                                              {JSON.parse(
                                                event?.location || "{}",
                                              )?.type !== "VIRTUAL" && (
                                                <div className="text-[14px] font-medium text-[#818384]">
                                                  {
                                                    JSON.parse(
                                                      event?.location || "{}",
                                                    )?.location
                                                  }
                                                </div>
                                              )}
                                            </Link>
                                          </div>
                                        </div>

                                        {event.end_at < Date.now() && (
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
                                        )}

                                        <div>
                                          <h3 className="mb-[16px] border-b border-gray-600/30 pb-[8px] text-[14px] font-medium text-[#818384]">
                                            About Event
                                          </h3>
                                          <p
                                            className="text-[17px] leading-6 text-[#FFFFFF]"
                                            dangerouslySetInnerHTML={{
                                              __html: event?.description,
                                            }}
                                          ></p>
                                        </div>

                                        <div>
                                          <h3 className="mb-[16px] border-b border-gray-600/30 pb-[8px] text-[14px] font-medium text-[#818384]">
                                            Location
                                          </h3>
                                          <h3 className="text-[18px] leading-6 text-[#FFFFFF]">
                                            {
                                              JSON.parse(
                                                event?.location || "{}",
                                              )?.type
                                            }
                                          </h3>
                                          {JSON.parse(event?.location || "{}")
                                            ?.type !== "VIRTUAL" && (
                                            <p className="text-[14px] leading-6 text-[#FFFFFFC9]">
                                              {
                                                JSON.parse(
                                                  event?.location || "{}",
                                                )?.location
                                              }
                                            </p>
                                          )}
                                          {/* {JSON.parse(event?.location || "{}")
                                          ?.type !== "VIRTUAL" && (
                                          <iframe
                                            className="mt-[16px] aspect-[2/1] w-full rounded-md bg-gray-400 invert-[90%] filter"
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.093497007274!2d120.98312537533448!3d14.707304374454834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b3e239aafdd7%3A0x9f7ee6ff84f9adfd!2sV.%20Matias%2C%20Valenzuela%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1699341419611!5m2!1sen!2sph"
                                            allowFullScreen={false}
                                            aria-hidden="false"
                                            tabIndex={0}
                                          ></iframe>
                                        )} */}
                                        </div>

                                        <div>
                                          <h3 className="mb-[16px] border-b border-gray-600/30 pb-[8px] text-[14px] font-medium text-[#818384]">
                                            Hosted by
                                          </h3>
                                          <div className="flex items-center gap-2">
                                            <img
                                              className="h-6 rounded-full"
                                              src={
                                                urlify(
                                                  event?.user?.profile_photo,
                                                ) || "assets/logo/icon.png"
                                              }
                                              alt=""
                                            />
                                            <p className="text-[16px] text-[#FFFFFF]">
                                              {event?.user?.name}
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
                        ),
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent className="pt-[32px] text-white" value="past">
                {eventState?.pastEvent?.length === 0 && (
                  <div className="mb-[48px] mt-[64px] flex h-[348px] flex-col items-center justify-center">
                    <div className="text-[24px] font-semibold text-[#FFFFFFC9]">
                      No Past Events
                    </div>
                  </div>
                )}
                {eventState?.pastEvent?.length > 0 && (
                  <div className="container mx-auto py-4">
                    <div className="relative border-l-[2px] border-dashed border-[#262729] md:ml-[150px]">
                      {eventState?.pastEvent?.map(
                        (event: any, index: number) => (
                          <Sheet key={index}>
                            <div
                              key={index}
                              className="mb-[30px] md:mb-10 md:ml-4"
                            >
                              <div className="absolute -left-[7.5px] h-3 w-3 rounded-full bg-[#5F6062]"></div>
                              <div className="mb-[10px] ml-6 flex items-center gap-2 md:absolute md:-left-[150px] md:ml-0 md:flex-col md:gap-0">
                                <h3 className="text-[17px] font-semibold text-white">
                                  {formatDate(event?.start_at).monthLongName}{" "}
                                  {formatDate(event?.start_at).day}
                                </h3>
                                <h3 className="text-[16px] font-semibold text-[#88898A]">
                                  {formatDate(event?.start_at).dayName}
                                </h3>
                              </div>
                              <SheetTrigger className="w-full">
                                <div className="ml-6 flex flex-row justify-between gap-1 rounded-md border border-gray-600/30 bg-gray-500/20 px-5 py-3 backdrop-blur-md">
                                  <div className="flex flex-col items-start text-left">
                                    <h3 className="text-[16px] font-semibold text-[#88898A] md:text-[18px]">
                                      {formatDate(event?.start_at).time}
                                    </h3>
                                    <h3 className="text-[18px] font-semibold text-white md:text-[18px]">
                                      {event?.name}
                                    </h3>
                                    <div className="my-1 flex items-center gap-2">
                                      By
                                      <img
                                        className="h-4 rounded-full"
                                        src={
                                          urlify(event?.user?.profile_photo) ||
                                          "assets/logo/icon.png"
                                        }
                                        alt=""
                                      />
                                      <p className="text-[#FFFFFF]">
                                        {event?.user?.name}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      {JSON.parse(event?.location || "{}")
                                        ?.type === "VIRTUAL" ? (
                                        <LuVideo className="h-7" />
                                      ) : (
                                        <LuMapPin className="h-7" />
                                      )}
                                      {JSON.parse(event?.location || "{}")
                                        ?.type !== "VIRTUAL" && (
                                        <h3 className="line-clamp-1 text-[16px] font-semibold text-[#88898A]">
                                          {
                                            JSON.parse(event?.location || "{}")
                                              ?.location
                                          }
                                        </h3>
                                      )}
                                    </div>
                                    {event?.isOwned === true && (
                                      <div className="flex items-center pt-1">
                                        <Button
                                          onClick={() => {
                                            router.push(
                                              `/event/manage?q=${event?.slug}`,
                                            );
                                          }}
                                          size={"sm"}
                                          className="h-8"
                                        >
                                          Manage Event
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                  <img
                                    className="aspect-[1/1] h-[90px] rounded-md md:h-[120px]"
                                    src={urlify(event?.banner)}
                                    onError={({ currentTarget }) => {
                                      currentTarget.onerror = null;
                                      currentTarget.src =
                                        "/assets/placeholder/placeholder_banner.png";
                                    }}
                                    alt=""
                                  />
                                </div>
                              </SheetTrigger>
                              <SheetContent className="z-[999] w-full md:w-[550px]">
                                <SheetHeader className="sticky">
                                  <SheetTitle className="border-b border-gray-600/30">
                                    <div className="flex flex-row gap-3 p-[16px] pb-4">
                                      {/* <a
                                    href="#"
                                    className="rounded-md bg-gray-500/50 px-4 py-1 text-[14px] text-[#FFFFFFA3] hover:bg-gray-400"
                                  >
                                    Copy Link
                                  </a> */}
                                      <Link
                                        href={`/event?q=${event?.slug}`}
                                        target="_blank"
                                        className="rounded-md bg-gray-500/50 px-4 py-1 text-[14px] text-[#FFFFFFA3] hover:bg-gray-400"
                                      >
                                        Event Page
                                      </Link>
                                    </div>
                                  </SheetTitle>
                                  <SheetDescription>
                                    <ScrollArea className="flex h-[750px] w-full flex-col px-[16px] md:h-[660px] xl:md:h-[800px]">
                                      <div className="mb-[40px] flex flex-1 items-center justify-center md:mx-[16px] md:mt-[16px]">
                                        <img
                                          className="h-[358px] rounded-lg md:h-[280px]"
                                          src={urlify(event?.banner)}
                                          onError={({ currentTarget }) => {
                                            currentTarget.onerror = null;
                                            currentTarget.src =
                                              "/assets/placeholder/placeholder_banner.png";
                                          }}
                                          alt=""
                                        />
                                      </div>
                                      <div className="flex flex-col gap-8 text-left">
                                        <div className="flex flex-col gap-4">
                                          <h3 className="text-[32px] font-semibold leading-8 text-white">
                                            {event?.name}
                                          </h3>
                                          <p className="text-[16px] font-semibold text-[#818384]">
                                            Hosted by {event?.user?.name}
                                          </p>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                          <div className="flex">
                                            <div className="h-[50px] w-[50px] rounded-lg border border-gray-600/30 text-center">
                                              <div className="rounded-t-md bg-[#262729] text-[8px] font-medium uppercase text-gray-300">
                                                {
                                                  formatDate(event?.start_at)
                                                    .monthLongName
                                                }
                                              </div>
                                              <div className="flex flex-1 items-center justify-center rounded-b-md p-1 text-[16px] font-medium uppercase text-gray-300">
                                                {
                                                  formatDate(event?.start_at)
                                                    .day
                                                }
                                              </div>
                                            </div>
                                            <div className="ml-4 flex flex-col justify-center gap-0.5 text-white">
                                              <div className="text-[16px] font-medium">
                                                {
                                                  formatDate(event?.start_at)
                                                    .dayName
                                                }
                                                ,{" "}
                                                {
                                                  formatDate(event?.start_at)
                                                    .monthLongName
                                                }{" "}
                                                {
                                                  formatDate(event?.start_at)
                                                    .day
                                                }
                                              </div>
                                              <div className="text-[14px] font-medium text-[#818384]">
                                                {
                                                  formatDate(event?.start_at)
                                                    .time
                                                }
                                                {" - "}
                                                {event?.end_at -
                                                  event?.start_at >=
                                                24 * 60 * 60
                                                  ? `${formatDate(event?.end_at).monthLongName} ${formatDate(event?.end_at).day}, `
                                                  : ""}
                                                {formatDate(event?.end_at).time}{" "}
                                                GMT+8
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flex">
                                            <div className="flex h-[50px] w-[50px] items-center justify-center rounded-lg border border-gray-600/30 text-center">
                                              {JSON.parse(
                                                event?.location || "{}",
                                              )?.type === "VIRTUAL" ? (
                                                <LuVideo className="text-xl text-gray-300" />
                                              ) : (
                                                <LuMapPin className="text-xl text-gray-300" />
                                              )}
                                            </div>
                                            <Link
                                              href="#"
                                              className="ml-4 flex flex-col justify-center gap-0.5 text-white"
                                            >
                                              <div className="font-medium] flex gap-1 text-[16px]">
                                                {
                                                  JSON.parse(
                                                    event?.location || "{}",
                                                  )?.type
                                                }{" "}
                                                <LuArrowUpRight className="text-[#818384]" />
                                              </div>
                                              {JSON.parse(
                                                event?.location || "{}",
                                              )?.type !== "VIRTUAL" && (
                                                <div className="text-[14px] font-medium text-[#818384]">
                                                  {
                                                    JSON.parse(
                                                      event?.location || "{}",
                                                    )?.location
                                                  }
                                                </div>
                                              )}
                                            </Link>
                                          </div>
                                        </div>

                                        {event.end_at < Date.now() && (
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
                                        )}

                                        <div>
                                          <h3 className="mb-[16px] border-b border-gray-600/30 pb-[8px] text-[14px] font-medium text-[#818384]">
                                            About Event
                                          </h3>
                                          <p
                                            className="text-[17px] leading-6 text-[#FFFFFF]"
                                            dangerouslySetInnerHTML={{
                                              __html: event?.description,
                                            }}
                                          ></p>
                                        </div>

                                        <div>
                                          <h3 className="mb-[16px] border-b border-gray-600/30 pb-[8px] text-[14px] font-medium text-[#818384]">
                                            Location
                                          </h3>
                                          <h3 className="text-[18px] leading-6 text-[#FFFFFF]">
                                            {
                                              JSON.parse(
                                                event?.location || "{}",
                                              )?.type
                                            }
                                          </h3>
                                          {JSON.parse(event?.location || "{}")
                                            ?.type !== "VIRTUAL" && (
                                            <p className="text-[14px] leading-6 text-[#FFFFFFC9]">
                                              {
                                                JSON.parse(
                                                  event?.location || "{}",
                                                )?.location
                                              }
                                            </p>
                                          )}
                                          {/* {JSON.parse(event?.location || "{}")
                                        ?.type !== "VIRTUAL" && (
                                        <iframe
                                          className="mt-[16px] aspect-[2/1] w-full rounded-md bg-gray-400 invert-[90%] filter"
                                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.093497007274!2d120.98312537533448!3d14.707304374454834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b3e239aafdd7%3A0x9f7ee6ff84f9adfd!2sV.%20Matias%2C%20Valenzuela%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1699341419611!5m2!1sen!2sph"
                                          allowFullScreen={false}
                                          aria-hidden="false"
                                          tabIndex={0}
                                        ></iframe>
                                      )} */}
                                        </div>

                                        <div>
                                          <h3 className="mb-[16px] border-b border-gray-600/30 pb-[8px] text-[14px] font-medium text-[#818384]">
                                            Hosted by
                                          </h3>
                                          <div className="flex items-center gap-2">
                                            <img
                                              className="h-6 rounded-full"
                                              src={
                                                urlify(
                                                  event?.user?.profile_photo,
                                                ) || "assets/logo/icon.png"
                                              }
                                              alt=""
                                            />
                                            <p className="text-[16px] text-[#FFFFFF]">
                                              {event?.user?.name}
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
                        ),
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
};

export default User;
