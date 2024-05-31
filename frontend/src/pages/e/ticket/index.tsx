import { NextPage } from "next";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Link from "next/link";

import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import { useHappenContext } from "@/context/HappenContext";
import { useRouter } from "next/router";
import { formatDate } from "@/lib/utils";
import { LuLoader } from "react-icons/lu";

const Ticket: NextPage = () => {
  const { isAuthenticated, ctxAccount, backend } = useHappenContext();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [guestData, setGuestData] = useState<any>(null);
  const [guestDataLoading, setGuestDataLoading] = useState(true);
  const [status, setStatus] = useState<any>("");
  const slug = router?.query?.q;

  const fetchEvent = async (q: any) => {
    try {
      const data: any = (await backend.get(`/event/slug/${q}`)).data;
      console.log(data?.data);
      setData(data?.data);
    } catch (error) {
      console.error({ error });
    }
  };

  const checkJoinEvent = async () => {
    try {
      setGuestDataLoading(true);
      const checkEventPost = await backend.post(
        `/event/${data?.id}/register/status`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log(checkEventPost?.data);

      setGuestData((checkEventPost?.data as any)?.data);

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

      setGuestDataLoading(false);

      console.log(_status);
    } catch (e: any) {
      console.error(e);
      setStatus("NONE");
      setGuestDataLoading(false);
    }
  };

  useEffect(() => {
    if (!ctxAccount || !data) return;
    checkJoinEvent();
  }, [ctxAccount, data]);

  useEffect(() => {
    if (!slug) return;
    fetchEvent(slug);
  }, [slug]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-black bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat">
      <Header />
      <Navbar />
      <section className="mx-auto flex h-[727px] max-w-[1080px] justify-center px-[14px] pb-[14px] pt-[48px]">
        <div className="relative h-fit w-[400px] rounded-lg bg-white py-[20px] shadow-lg">
          <div className="px-[24px]">
            <div className="w-fit rounded-md bg-[#13151714] px-[7px] py-[4px] text-[12px] font-medium uppercase text-[#1315177A]">
              Ticket
            </div>
            <div className="my-[4px] text-[24px] font-medium text-[#131517]">
              {data?.name}
            </div>
            <div className="mb-[24px] text-[14px] text-[#131517A3]">
              <p className="mb-[4px]">
                {formatDate(data?.start_at).dayName},{" "}
                {formatDate(data?.start_at).monthLongName}{" "}
                {formatDate(data?.start_at).day}
                {", "}
                {formatDate(data?.start_at).time}
                {" - "}
                {data?.end_at - data?.start_at >= 24 * 60 * 60
                  ? `${formatDate(data?.end_at).monthLongName} ${formatDate(data?.end_at).day}, `
                  : ""}
                {formatDate(data?.end_at).time} GMT+8
              </p>
              {JSON.parse(data?.location || "{}")?.type !== "VIRTUAL" && (
                <p>{JSON.parse(data?.location || "{}")?.location}</p>
              )}
            </div>
          </div>

          <div className="w-full border-t border-dashed border-gray-400/30"></div>

          <div className="my-[24px] flex justify-center">
            {!guestDataLoading && guestData && ctxAccount && data ? (
              <QRCode
                id="QRCode"
                size={256}
                className="p-[8px]"
                value={JSON.stringify({
                  guestId: guestData?.id,
                  guestStatus: guestData?.status,
                  guestName: ctxAccount?.name,
                  eventId: data?.id,
                  eventName: data?.name,
                  guestEmail: ctxAccount?.email,
                  guestProfile: ctxAccount?.profile_photo,
                  guestRegisteredDate: guestData?.created_at,
                })}
                viewBox="0 0 250 250"
              />
            ) : (
              <>
                {guestDataLoading && (
                  <LuLoader className="h-10 w-10 animate-spin" />
                )}

                {!guestDataLoading && !guestData && <p>Ticket not found!</p>}
              </>
            )}
          </div>

          {!guestDataLoading && guestData && ctxAccount && data && (
            <>
              {" "}
              <div className="w-full border-t border-dashed border-gray-400/30"></div>
              <div className="my-[24px] flex justify-between px-[24px]">
                <div className="flex flex-1 flex-col">
                  <p className="text-[13px] text-[#1315175C]">Guest</p>
                  <p className="font-medium text-[#131517]">
                    {ctxAccount?.name}
                  </p>
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="text-[13px] text-[#1315175C]">Status</p>
                  {status === "APPROVED" && (
                    <p className="font-medium text-[#07A460]">{status}</p>
                  )}
                  {status === "PENDING" && (
                    <p className="font-medium text-yellow-500">{status}</p>
                  )}
                  {status === "REJECTED" && (
                    <p className="font-medium text-red-500">{status}</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Ticket;
