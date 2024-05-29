"use client";

import { toast } from "@/components/ui/use-toast";
import { useAuth, useRestActor } from "@bundly/ares-react";
import { RestClientInstance } from "@bundly/ares-rest";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";

export interface CtxAccount {
  id: number;
  email: string;
  username: string;
  principal_id: string;
  name: string;
  bio: string | null;
  facebook: string | null;
  twitter: string | null;
  tiktok: string | null;
  instagram: string | null;
  website: string | null;
  profile_photo: string | null;
  banner_photo: string | null;
  status: number;
  created_at: number;
  updated_at: number;
}

export type HappenContextType = {
  ctxAccount?: CtxAccount;
  restoreSession: () => Promise<void>;
  isAuthenticated: boolean;
  backend: RestClientInstance;
};

export const HappenContext = createContext<HappenContextType>(
  {} as HappenContextType,
);

export const useHappenContext = () => useContext(HappenContext);

export default function HappenProvider({ children }: { children: any }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const backend = useRestActor("backend");
  const [ctxAccount, setCtxAccount] = useState<CtxAccount>();

  const getUser = async () => {
    try {
      const userInfo = await backend.get("/user/me");
      setCtxAccount((userInfo.data as any)?.data);
    } catch (e: any) {
      console.error(e?.data?.message);
      router.push("/register");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getUser();
    } else {
      setCtxAccount(undefined);
    }
  }, [isAuthenticated]);

  const restoreSession = async () => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    await getUser();
  };

  return (
    <HappenContext.Provider
      value={{
        ctxAccount,
        isAuthenticated,
        restoreSession,
        backend,
      }}
    >
      {children}
    </HappenContext.Provider>
  );
}
