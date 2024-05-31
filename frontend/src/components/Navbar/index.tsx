/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAuth } from "@bundly/ares-react";
import { LoginButton, LogoutButton } from "../AuthButton";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import React from "react";
import { useRouter } from "next/router";
import { useHappenContext } from "@/context/HappenContext";
import { urlify } from "@/lib/utils";
import { LuTicket } from "react-icons/lu";

const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const Navbar: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, ctxAccount } = useHappenContext();
  const [time, setTime] = useState("");
  const currentTime = new Date();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = new Intl.DateTimeFormat("en-US").format(now);
      setTime(formattedTime);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section
      className={`sticky top-0 z-[98] flex flex-1 items-center justify-between bg-[#131517]/50 px-[16px] py-[12px]`}
    >
      <Link href="/">
        <img className="h-5" src="/assets/logo/icon.png" alt="" />
      </Link>
      <div className="flex items-center gap-4 text-[14px] font-medium text-[#FFFFFFA3]">
        <div className="hidden md:block">{formatTime(currentTime)} GMT+8</div>
        {/* <button>Explore Events</button> */}
        {ctxAccount && (
          <Link href="/create" className="text-[14px]">
            Create Event
          </Link>
        )}

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-6 w-6 rounded-full">
                <AvatarImage
                  src={
                    urlify(ctxAccount?.profile_photo!) ||
                    "/assets/logo/icon.png"
                  }
                  className=""
                />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-[999] w-56 dark:border-[#FFFFFF14] dark:bg-[#1C1E20]">
              {ctxAccount && (
                <>
                  <DropdownMenuLabel className="flex items-center gap-2 font-normal">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          urlify(ctxAccount?.profile_photo!) ||
                          "/assets/logo/icon.png"
                        }
                        className=""
                      />
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {ctxAccount?.name}
                      </p>
                      <p className="text-muted-foreground text-xs leading-none">
                        {ctxAccount?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="dark:bg-[#FFFFFF14]" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => {
                        router.push(`/user?p=${ctxAccount?.username}`);
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>View Profile</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="dark:bg-[#FFFFFF14]" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => {
                        router.push(`/home`);
                      }}
                    >
                      <LuTicket className="mr-2 h-4 w-4" />
                      <span>Events</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="dark:bg-[#FFFFFF14]" />
                </>
              )}
              <DropdownMenuItem>
                <LogoutButton className="w-full" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          // <LogoutButton className="rounded-3xl bg-gray-500/50 px-4 py-1 text-[14px] text-[#FFFFFFA3] hover:bg-gray-400" />
          <LoginButton className="rounded-3xl bg-gray-500/50 px-4 py-1 text-[14px] text-[#FFFFFFA3] hover:bg-gray-400" />
        )}
      </div>
    </section>
  );
};

export default Navbar;
