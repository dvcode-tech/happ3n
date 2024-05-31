import { useEffect, useState } from "react";

import { toast, useToast } from "@/components/ui/use-toast";
import { useHappenContext } from "@/context/HappenContext";

export default function useEvent() {
  const { backend } = useHappenContext();
  const [loading, setLoading] = useState(true);
  const [pastEvent, setPastEvent] = useState<any>([]);
  const [upcomingEvent, setUpcomingEvent] = useState<any>([]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data: any = (await backend.get("/event/list")).data;
      const joinedList: any = (await backend.get("/event/joined/list")).data;

      const allEvent = data?.data?.map((item: any) => ({
        ...item,
        isOwned: true,
      }));

      const allJoinedEvent = joinedList?.data?.map((item: any) => ({
        ...item.event,
        isOwned: false,
        guestStatus: item.status,
        guestGoingStatus: item.going_status,
      }));

      const combinedEvent = Object.values(
        [...allEvent, ...allJoinedEvent].reduce((acc: any, obj: any) => {
          if (!acc[obj.id] || obj.isOwned) {
            acc[obj.id] = obj;
          }
          return acc;
        }, {}),
      );

      const filterUpcoming = combinedEvent
        ?.filter((event: any) => event.end_at >= Date.now())
        .sort((a: any, b: any) => a.start_at - b.start_at);

      const filterPast = combinedEvent
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
    } finally {
      setLoading(false);
    }
  };

  return [
    {
      loading,
      pastEvent,
      upcomingEvent,
    },
    {
      setLoading,
      fetchEvents,
    },
  ];
}
