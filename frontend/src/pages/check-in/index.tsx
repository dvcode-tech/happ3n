/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import { useRouter } from "next/router";
import Header from "@/components/Header";

import {
  LuCamera,
  LuCheck,
  LuLoader,
  LuSearch,
  LuUsers,
  LuX,
} from "react-icons/lu";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useHappenContext } from "@/context/HappenContext";
import { toast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { timeAgo, urlify } from "@/lib/utils";

const CheckIn: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, ctxAccount, backend } = useHappenContext();
  const { q } = router?.query;
  const [data, setData] = useState<any>(null);
  const [guestList, setGuestList] = useState<any[]>([]);
  const [guestListLoading, setGuestListLoading] = useState(true);
  const [searchList, setSearchList] = useState<any[]>([]);
  const [submittingLoading, setSubmittingLoading] = useState(false);

  const getGuestList = async () => {
    try {
      setGuestListLoading(true);
      const response: any = (
        await backend.post(`/event/${data?.id}/guests/list`)
      ).data;

      setGuestList(response.data?.filter((item: any) => item.status === 1));
      setSearchList(response.data?.filter((item: any) => item.status === 1));

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
    } finally {
      setGuestListLoading(false);
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

  const fetchEvent = async (q: any) => {
    try {
      const data: any = (await backend.get(`/event/slug/${q}`)).data;
      console.log(data?.data);
      setData(data?.data);
    } catch (error) {
      console.error({ error });
    }
  };

  const manageCheckinStatus = async (guestId: number) => {
    try {
      setSubmittingLoading(true);
      const response: any = await backend.post(
        `/event/${data?.id}/guests/${guestId}/checkedin`,
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
      getGuestList().finally(() => {
        setSubmittingLoading(false);
      });
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
            <Link
              href={`/check-in/scan?q=${q}`}
              className="flex h-fit w-fit items-center gap-2 rounded-lg border border-gray-600/30 bg-[#FFFFFF14] px-[10px] py-[7px] text-[14px] font-semibold leading-none text-[#FFFFFFA3] backdrop-blur-sm"
            >
              <LuCamera /> Scan
            </Link>
          </div>

          <div className="w-full bg-[#212325]">
            <div className="relative mx-auto w-full max-w-[788px] py-[4px]">
              <Input
                onChange={(event) => {
                  onHandleSearch(event.target.value);
                }}
                className="flex h-10 w-full rounded-md border border-none bg-transparent py-2 pl-10 text-[16px] font-semibold text-white ring-offset-transparent file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-none dark:bg-transparent dark:ring-offset-transparent dark:placeholder:text-[#939597] dark:focus-visible:ring-transparent"
                placeholder="Search for a Guest..."
              />
              <LuSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#ffffff85]" />
            </div>
          </div>

          <div className="mx-auto mt-4 w-full max-w-[788px]">
            {guestListLoading && (
              <div className="flex h-[348px] flex-col items-center justify-center">
                <LuLoader className="h-10 w-10 animate-spin text-white" />
              </div>
            )}

            {searchList.length > 0 && !guestListLoading && (
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
                        {guest?.entry_status === 1 && (
                          <div className="rounded-md bg-green-500/25 text-center text-[12px] font-medium text-green-500 ">
                            Checked In
                          </div>
                        )}

                        {guest?.entry_status === 0 && (
                          <div className="flex items-center">
                            {!submittingLoading && (
                              <Button
                                onClick={() => {
                                  manageCheckinStatus(guest?.id);
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
                              <LuLoader className="mx-auto h-4 w-4 animate-spin text-white" />
                            )}
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
            )}

            {searchList?.length === 0 && !guestListLoading && (
              <div className="mx-auto mt-[64px] flex max-w-[788px] flex-col items-center justify-center">
                <LuUsers className="h-[64px] w-[64px] text-[#FFFFFF80]" />
                <h1 className="mt-[24px] text-[18px] font-bold text-[#FFFFFFC9]">
                  No Guests found
                </h1>
                <p className="mt-[8px] text-[16px] font-semibold text-[#FFFFFF80]">
                  Share your event page to collect registrations.
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default CheckIn;
