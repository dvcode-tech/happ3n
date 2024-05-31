/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import Header from "@/components/Header";
import {
  LuUsers,
  LuArrowUpRight,
  LuCheck,
  LuX,
  LuLoader,
} from "react-icons/lu";
import { QrReader } from "react-qr-reader";
import { useHappenContext } from "@/context/HappenContext";
import { toast } from "@/components/ui/use-toast";
import { formatDate, timeAgo, urlify } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Scan: NextPage = () => {
  const [checkedIn, setCheckedIn] = useState(45);

  const router = useRouter();
  const { isAuthenticated, ctxAccount, backend } = useHappenContext();
  const { q } = router?.query;
  const [data, setData] = useState<any>(null);
  const [qrData, setQrData] = useState<any>(null);
  const [guestList, setGuestList] = useState<any[]>([]);
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

  const getGuestList = async () => {
    try {
      const response: any = (
        await backend.post(`/event/${data?.id}/guests/list`)
      ).data;

      setGuestList(response.data?.filter((item: any) => item.status === 1));

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

  const manageCheckinStatus = async (eventId: number, guestId: number) => {
    try {
      setSubmittingLoading(true);
      const response: any = await backend.post(
        `/event/${eventId}/guests/${guestId}/checkedin`,
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
      setSubmittingLoading(false);
      getGuestList();
      setQrData(null);
    }
  };

  useEffect(() => {
    if (!ctxAccount || !data) return;
    getGuestList();
  }, [ctxAccount, data]);

  useEffect(() => {
    if (!q) return;
    fetchEvent(q);
  }, [q]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#131517] from-10% via-[#00071C] via-50% to-[#00071C] to-90% bg-fixed">
      <Header />
      {!data && (
        <div className="flex h-[348px] flex-col items-center justify-center">
          <LuLoader className="h-10 w-10 animate-spin text-white" />
        </div>
      )}
      {data && (
        <section className="flex flex-col">
          <div className="mx-auto flex w-full max-w-[788px] items-center justify-between px-[16px] py-[10px]">
            <div className="flex items-center justify-center gap-2">
              <img
                onClick={() => router.push("/home")}
                className="h-8 cursor-pointer rounded-full"
                src={urlify(data?.banner) || "/assets/logo/icon.png"}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src =
                    "/assets/placeholder/placeholder_banner.png";
                }}
                alt=""
              />
              <div className="cursor-pointer" onClick={() => router.back()}>
                <div className="text-[16px] font-medium text-[#FFFFFF] hover:text-violet-700">
                  {data?.name}
                </div>
                <p className="text-[13px] text-[#FFFFFFCC]">
                  {data?.start_at > Date.now()
                    ? `Event will start on ${new Date(data?.start_at).toDateString()}`
                    : `Started ${timeAgo(data?.start_at)}`}
                </p>
              </div>
            </div>
            <a
              href={`/check-in?q=${q}`}
              className="flex h-fit w-fit items-center gap-2 rounded-lg border border-gray-600/30 bg-[#FFFFFF14] px-[10px] py-[7px] text-[14px] font-semibold leading-none text-[#FFFFFFA3] backdrop-blur-sm"
            >
              <LuUsers /> Guests
            </a>
          </div>
          <div className="border-t border-gray-600/30"></div>
          <div className="mx-auto flex w-full flex-1 flex-col justify-center overflow-hidden p-[16px] md:max-w-[788px] ">
            {!qrData && (
              <QrReader
                constraints={{ facingMode: "environment" }}
                onResult={(result, error) => {
                  if (!!result) {
                    try {
                      const resultData = JSON.parse(result["text"]);

                      if (!resultData?.eventId || !resultData?.guestId) {
                        toast({
                          variant: "destructive",
                          title: "Uh oh! Something went wrong.",
                          description: "Invalid Ticket QR",
                          duration: 1000,
                        });
                        setQrData(null);
                        return;
                      }

                      setQrData(resultData);
                      console.log(result["text"]);
                    } catch (error) {
                      toast({
                        variant: "destructive",
                        title: "Uh oh! Something went wrong.",
                        description: "Invalid Ticket QR",
                        duration: 1000,
                      });
                    }
                  }

                  // if (!!error) {
                  //   console.info(error);
                  // }
                }}
                className="w-full"
              />
            )}
            {qrData && (
              <div className="mb-8 flex w-full flex-col rounded-md border border-gray-600/30 bg-gray-500/20 backdrop-blur-md">
                <div className="flex w-full items-center gap-4 bg-black/20 p-4">
                  <img
                    className="h-7 rounded-full"
                    src={
                      urlify(qrData?.guestProfile) || "/assets/logo/icon.png"
                    }
                    alt=""
                  />
                  <div className="flex flex-col">
                    <p className="text-white">{qrData?.guestName}</p>
                    <p className="text-sm text-gray-400">
                      {qrData?.guestEmail}
                    </p>
                  </div>
                </div>
                {qrData?.eventId === data?.id && (
                  <div className="flex w-full flex-col p-4">
                    <p className="text-xs text-gray-400">Registered</p>
                    <p className="text-white">
                      {formatDate(qrData?.guestRegisteredDate).day}{" "}
                      {formatDate(qrData?.guestRegisteredDate).monthLongName}
                      {", "}
                      {formatDate(qrData?.guestRegisteredDate).time}
                    </p>
                  </div>
                )}
                {qrData?.eventId !== data?.id && (
                  <div className="flex w-full flex-col bg-red-500/20 p-4">
                    <p className="text-xs text-red-500">
                      Mismatch Event Ticket
                    </p>
                  </div>
                )}
                <div className="flex w-full items-center justify-end bg-black/20 p-4">
                  {qrData?.eventId === data?.id && (
                    <>
                      {!submittingLoading && (
                        <Button
                          onClick={() => {
                            manageCheckinStatus(
                              qrData?.eventId,
                              qrData?.guestId,
                            );
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-fit text-green-500"
                        >
                          <LuCheck className="mr-2 h-4 w-4 text-green-500" />
                          Check In
                        </Button>
                      )}
                      {submittingLoading && (
                        <LuLoader className="h-4 w-4 animate-spin text-white" />
                      )}
                    </>
                  )}
                  <Button
                    onClick={() => {
                      setQrData(null);
                    }}
                    variant="ghost"
                    size="sm"
                    className="h-fit text-gray-500"
                  >
                    <LuX className="mr-2 h-4 w-4 text-gray-500" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            <div className="flex w-full flex-col rounded-md border border-gray-600/30 bg-gray-500/20 p-4 backdrop-blur-md">
              <div className="flex w-full flex-1 flex-col">
                <div className="flex w-full justify-between pb-[8px]">
                  <div className="text-[20px] text-[#939597]">
                    {guestList.filter((item) => item.entry_status === 1).length}{" "}
                    <span className="text-[14px]">Checked In</span>
                  </div>
                  <div className="text-[14px] text-[#939597]">
                    {guestList.filter((item) => item.going_status === 1).length}{" "}
                    <span>Going</span>
                  </div>
                </div>

                <progress
                  value={
                    guestList.filter((item) => item.entry_status === 1).length
                  }
                  max={
                    guestList.filter((item) => item.going_status === 1).length
                  }
                  className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                />
                {guestList.filter((item) => item.going_status === 2).length >
                  0 && (
                  <div className="flex items-center pt-3 text-[14px] leading-none text-[#D2D4D7]">
                    <span className="mr-1 inline-flex h-1 w-1 rounded-full bg-[#D2D4D7]"></span>
                    {1} <span className="ml-1 text-[14px]">Not Going</span>
                  </div>
                )}

                <Link
                  href={`/event/manage?q=${q}`}
                  className="mt-[24px] flex items-center text-[14px] text-[#FFFFFF80]"
                >
                  Manage Event Page <LuArrowUpRight />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Scan;
