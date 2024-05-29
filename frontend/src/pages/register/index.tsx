import { NextPage } from "next";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useAuth, useRestActor } from "@bundly/ares-react";
import { useRouter } from "next/router";

const Signin: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const backend = useRestActor("backend");
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({
    email: null,
    username: null,
    name: null,
  });

  const updateData = (e: any) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    setIsLoading(true);

    if (!data.username) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Username is required!",
        duration: 1000,
      });
      setIsLoading(false);
      return;
    }

    if (!data.email) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Email is required!",
        duration: 1000,
      });
      setIsLoading(false);
      return;
    }

    if (!data.name) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Name is required!",
        duration: 1000,
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await backend.post("/user/register", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast({
        variant: "default",
        title: "Success",
        description: (response.data as any)?.message,
        duration: 2000,
      });

      console.log(response.data);
      setIsLoading(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error?.message,
        duration: 1000,
      });
      console.error({ error });
      setIsLoading(false);
    }

    console.log(data);
  };

  const fetchUserInfo = async () => {
    try {
      const userInfo = await backend.get("/user/me");
      console.log("userInfo", userInfo);
      return true;
    } catch (error) {
      console.error({ error });
      return false;
    }
  };

  useEffect(() => {
    const checkAuthUser = async () => {
      if (!isAuthenticated) {
        router.push("/");
        return;
      }
      if (await fetchUserInfo()) {
        router.push("/home");
      } else {
        router.push("/register");
      }
    };

    checkAuthUser();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-black bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat">
      <Header />
      <Navbar />
      <section className="mx-auto h-[727px] max-w-[1080px] px-[14px] pb-[14px] pt-[48px]">
        <div className="flex h-full flex-1 items-center justify-center">
          <div className="flex w-[360px] flex-col rounded-2xl border border-gray-600 bg-gray-500/40 backdrop-blur-md">
            <div className="mb-[16px] flex flex-col gap-0.5 px-[24px] pt-[24px]">
              <div className="text-[22px] font-semibold text-slate-200">
                Welcome to happ3n
              </div>
              <p className="py-[2px] text-[14px] text-slate-200">
                Please sign in or sign up below.
              </p>
            </div>
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-2 px-[24px] pb-[20px] text-white"
            >
              <Input
                type="text"
                placeholder="Name"
                id="name"
                name="name"
                disabled={isLoading}
                onChange={updateData}
                required
              />
              <Input
                type="text"
                placeholder="Username"
                id="username"
                name="username"
                disabled={isLoading}
                onChange={updateData}
              />
              <Input
                type="email"
                placeholder="Email"
                id="email"
                name="email"
                disabled={isLoading}
                onChange={updateData}
              />
              <Button className="mt-4" type="submit">
                Register
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signin;
