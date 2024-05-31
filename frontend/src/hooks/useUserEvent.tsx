import { useEffect, useState } from "react";

import { toast, useToast } from "@/components/ui/use-toast";
import { useHappenContext } from "@/context/HappenContext";
import { useRouter } from "next/router";

export default function useUserEvent() {
  const router = useRouter();
  const { backend, ctxAccount } = useHappenContext();
  const [loading, setLoading] = useState(true);
  const [pastEvent, setPastEvent] = useState<any>([]);
  const [userInfo, setUserInfo] = useState<any>([]);
  const [upcomingEvent, setUpcomingEvent] = useState<any>([]);

  const fetchEvents = async (username: any) => {
    setLoading(true);
    try {
      const userData: any = (await backend.get(`/user/${username}/info`)).data;

      setUserInfo(userData?.data);

      const data: any = (await backend.get(`/user/${username}/event/list`))
        .data;

      const allEvent = data?.data?.map((item: any) => ({
        ...item,
        isOwned: item?.user?.username === ctxAccount?.username,
      }));

      const filterUpcoming = [...allEvent]
        ?.filter((event: any) => event.end_at >= Date.now())
        .sort((a: any, b: any) => a.start_at - b.start_at);

      const filterPast = [...allEvent]
        ?.filter((event: any) => event.end_at < Date.now())
        .sort((a: any, b: any) => a.start_at - b.start_at);

      setUpcomingEvent(filterUpcoming);
      setPastEvent(filterPast);

      console.log(filterUpcoming);
      console.log(filterPast);
    } catch (e: any) {
      const error = e?.data?.message || e.message;

      console.error(error);

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error,
        duration: 1000,
      });

      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  return [
    {
      loading,
      pastEvent,
      upcomingEvent,
      userInfo,
    },
    {
      setLoading,
      fetchEvents,
    },
  ];
}
