/* eslint-disable @next/next/no-img-element */
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  LuArrowUpRight,
  LuLoader,
  LuMapPin,
  LuUserCheck2,
  LuVideo,
} from "react-icons/lu";

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
import { toast, useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useRestActor } from "@bundly/ares-react";
import { formatDate, urlify } from "@/lib/utils";
import { useHappenContext } from "@/context/HappenContext";
import { LoginButton } from "@/components/AuthButton";

const formSchema = z.object({
  fullname: z.string().min(2, {
    message: "This is required.",
  }),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: "Please enter a valid email address",
  }),
});

const EventPage = () => {
  const { isAuthenticated, ctxAccount, backend } = useHappenContext();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<any>("");
  const slug = router?.query?.q;
  const [submittingLoading, setSubmittingLoading] = useState(false);

  const fetchEvent = async (q: any) => {
    try {
      const data: any = (await backend.get(`/event/slug/${q}`)).data;
      console.log(data?.data);
      setData(data?.data);
    } catch (error) {
      console.error({ error });
    }
  };

  useEffect(() => {
    if (!slug) return;
    fetchEvent(slug);
  }, [slug]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
    },
  });

  const handleJoinEvent = async () => {
    try {
      setSubmittingLoading(true);
      const joinEventPost = await backend.post(
        `/event/${data?.id}/register`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      toast({
        variant: "default",
        title: "Success",
        description: (joinEventPost.data as any)?.message,
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
    } finally {
      checkJoinEvent().finally(() => {
        setSubmittingLoading(false);
      });
    }
  };

  const checkJoinEvent = async () => {
    try {
      const checkEventPost = await backend.post(
        `/event/${data?.id}/register/status`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const _status = (checkEventPost?.data as any)?.data?.status;

      if (_status === 0) {
        setStatus("PENDING");
      } else if (_status === 1) {
        setStatus("APPROVED");
      } else if (_status === 2) {
        setStatus("REJECTED");
      } else {
        setStatus("NONE");
      }

      console.log(_status);
    } catch (e: any) {
      console.error(e);
      setStatus("NONE");
    }
  };

  useEffect(() => {
    if (!ctxAccount || !data) return;
    checkJoinEvent();
  }, [ctxAccount, data]);

  return (
    <div className="min-h-screen overflow-hidden bg-black bg-[url('/assets/bg.png')] bg-cover bg-fixed bg-center bg-no-repeat">
      <Header />
      <Navbar />
      {!data && (
        <div className="mb-[48px] mt-[64px] flex h-[348px] flex-col items-center justify-center">
          <LuLoader className="h-10 w-10 animate-spin text-white" />
        </div>
      )}
      {data && (
        <section className="mx-auto flex max-w-[950px] flex-col-reverse md:flex-row">
          <div className="flex h-full flex-col gap-5 p-4 lg:gap-8">
            <img
              className="hidden aspect-[1/1] h-[358px] flex-col items-center justify-center rounded-xl md:flex md:h-[280px] lg:h-[330px]"
              src={urlify(data?.banner)}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src =
                  "/assets/placeholder/placeholder_banner.png";
              }}
              alt=""
            />

            <div className="flex max-w-[362px] flex-col gap-2">
              <div className="flex w-full items-center gap-2">
                <img
                  className="h-6 rounded-full"
                  src={data?.user?.profile_photo || "assets/logo/icon.png"}
                  alt=""
                />
                <div className="ml-2 flex w-full justify-between">
                  <div className="flex flex-col">
                    <p className="text-[12px] text-[#FFFFFFC8]">Presented by</p>
                    <h1 className="line-clamp-1 text-[#FFFFFF]">
                      {data?.user?.name}
                    </h1>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#404953]/20 p-2 text-[#a0a2a2]">
                    <LuUserCheck2 />
                  </div>
                </div>
              </div>
              <div className=" text-[14px] text-[#FFFFFF]">
                {data?.user?.bio || "Welcome to Happ3n!"}
              </div>
            </div>

            <div>
              <h3 className="mb-[16px] border-b border-gray-600/30 pb-[8px] text-[14px] font-medium text-[#818384]">
                Hosted by
              </h3>
              <div className="flex items-center gap-2">
                <img
                  className="h-6 rounded-full"
                  src={data?.user?.profile_photo || "assets/logo/icon.png"}
                  alt=""
                />
                <p className="text-[16px] text-[#FFFFFF]">{data?.user?.name}</p>
              </div>
            </div>

            {data?.guests_list?.length > 0 && (
              <div>
                <h3 className="mb-[16px] border-gray-600/30 pb-[8px] text-[14px] font-semibold text-[#818384]">
                  {data?.guests_list?.length} Going
                </h3>
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col space-y-4">
            <div className="flex w-full flex-col gap-4 p-[16px]">
              <img
                className="flex aspect-[1/1] h-[358px] flex-col items-center justify-center rounded-xl md:hidden md:h-[280px] lg:h-[330px]"
                src={urlify(data?.banner)}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src =
                    "/assets/placeholder/placeholder_banner.png";
                }}
                alt=""
              />
              <div className="flex flex-col gap-8 text-left">
                <div className="flex flex-col gap-4 pt-2">
                  <h3 className="text-[38px] font-semibold leading-10 text-white md:leading-8">
                    {data?.name}
                  </h3>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex">
                    <div className="h-[50px] w-[50px] rounded-lg border border-gray-600/30 text-center">
                      <div className="rounded-t-md bg-[#262729] py-1 text-[9px] font-medium uppercase text-gray-300">
                        {formatDate(data?.start_at).monthLongName}
                      </div>
                      <div className="flex flex-1 items-center justify-center rounded-b-md p-0.5 text-[16px] font-medium uppercase text-gray-300">
                        {formatDate(data?.start_at).day}
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col justify-center gap-0.5 text-white">
                      <div className="text-[16px] font-medium">
                        {formatDate(data?.start_at).dayName},{" "}
                        {formatDate(data?.start_at).monthLongName}{" "}
                        {formatDate(data?.start_at).day}
                      </div>
                      <div className="text-[14px] font-medium text-[#818384]">
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
                      <div className="font-medium] flex gap-1 text-[16px]">
                        {JSON.parse(data?.location || "{}")?.type}{" "}
                        <LuArrowUpRight className="text-[#818384]" />
                      </div>
                      {(JSON.parse(data?.location || "{}")?.type !==
                        "VIRTUAL" ||
                        status === "APPROVED") && (
                        <div className="text-[14px] font-medium text-[#818384]">
                          {JSON.parse(data?.location || "{}")?.location}
                        </div>
                      )}
                    </a>
                  </div>
                </div>

                <div className="container flex flex-col gap-2 overflow-hidden rounded-md border border-gray-600/30 bg-gray-500/20 backdrop-blur-md">
                  <div className="bg-[#404953] px-4 py-2 text-white">
                    <p className="text-[14px]">Registration</p>
                  </div>
                  {data?.required_approval === 1 && (
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
                  )}
                  <div className="py-2 text-white">
                    <h3 className="px-4 text-[16px]">
                      Welcome! To join the event, please register below.
                    </h3>
                    {isAuthenticated && ctxAccount && (
                      <div className="flex items-center p-4 text-[14px] text-[#818384]">
                        <img
                          className="h-5 rounded-full"
                          src={
                            ctxAccount?.profile_photo || "/assets/logo/icon.png"
                          }
                          alt=""
                        />
                        <h1 className="ml-2 text-[16px] font-medium text-white">
                          {ctxAccount?.name}
                        </h1>
                        <p className="ml-2 text-[16px] font-light text-white">
                          {ctxAccount?.email}
                        </p>
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-2 px-4 md:flex-row">
                      {!isAuthenticated && (
                        <LoginButton className="mt-4 inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-slate-900 px-4 py-2 text-[16px] font-medium text-slate-50 ring-offset-white transition-colors hover:bg-slate-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-slate-50 dark:text-slate-900 dark:ring-offset-slate-950 dark:hover:bg-slate-50/90 dark:focus-visible:ring-slate-300">
                          Register
                        </LoginButton>
                      )}
                      {isAuthenticated &&
                        status === "NONE" &&
                        !submittingLoading && (
                          <Button
                            onClick={handleJoinEvent}
                            className="w-full text-[16px]"
                          >
                            Request to Join
                          </Button>
                        )}

                      {submittingLoading && (
                        <LuLoader className="mx-auto my-2 h-6 w-6 animate-spin text-white" />
                      )}

                      {status === "REJECTED" && (
                        <Button className="w-full text-[16px] !text-red-500">
                          Request Rejected
                        </Button>
                      )}

                      {status === "APPROVED" && (
                        <>
                          <Button className="w-full text-[16px] !text-green-500">
                            Approved
                          </Button>
                          <Button
                            onClick={() => {
                              router.push(`/e/ticket?q=${slug}`);
                            }}
                            className="w-full text-[16px] !text-blue-500 md:w-2/5"
                          >
                            My Ticket
                          </Button>
                        </>
                      )}

                      {status === "PENDING" && (
                        <Button className="w-full text-[16px] !text-yellow-500">
                          Request Pending
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-[16px] border-b border-gray-600/30 pb-[8px] text-[14px] font-medium text-[#818384]">
                    About Event
                  </h3>
                  <p
                    className="text-[17px] leading-6 text-[#FFFFFF]"
                    dangerouslySetInnerHTML={{ __html: data?.description }}
                  ></p>
                </div>

                <div>
                  <h3 className="mb-[16px] border-b border-gray-600/30 pb-[8px] text-[14px] font-medium text-[#818384]">
                    Location
                  </h3>
                  <h3 className="text-[18px] leading-6 text-[#FFFFFF]">
                    {JSON.parse(data?.location || "{}")?.type}
                  </h3>
                  {JSON.parse(data?.location || "{}")?.type !== "VIRTUAL" && (
                    <p className="text-[14px] leading-6 text-[#FFFFFFC9]">
                      {JSON.parse(data?.location || "{}")?.location}
                    </p>
                  )}
                  {/* {JSON.parse(data?.location || "{}")?.type !== "VIRTUAL" && (
                  <iframe
                    className="mt-[16px] aspect-[2/1] w-full rounded-md bg-gray-400 invert-[90%] filter"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.093497007274!2d120.98312537533448!3d14.707304374454834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b3e239aafdd7%3A0x9f7ee6ff84f9adfd!2sV.%20Matias%2C%20Valenzuela%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1699341419611!5m2!1sen!2sph"
                    allowFullScreen={false}
                    aria-hidden="false"
                    tabIndex={0}
                  ></iframe>
                )} */}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
export default EventPage;
