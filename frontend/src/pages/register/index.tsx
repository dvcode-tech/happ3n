import { NextPage } from "next"
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";

const Signin: NextPage = () => {
  return(
    <div className="bg-[url('/assets/bg.png')] bg-center bg-cover bg-no-repeat bg-black">
      <Header />
      <Navbar/>
    <section className="max-w-[1080px] h-[727px] mx-auto px-[14px] pt-[48px] pb-[14px]">
      <div className="flex flex-1 h-full items-center justify-center">
        <div className="w-[360px] flex flex-col rounded-2xl backdrop-blur-md bg-gray-500/40 border border-gray-600">
            <div className="flex flex-col gap-0.5 mb-[16px] px-[24px] pt-[24px]">
                <div className="text-[22px] font-semibold text-slate-200">Welcome to happ3n</div>
                <p className="text-slate-200 text-[14px] py-[2px]">Please sign in or sign up below.</p>
            </div>
            <div className="flex flex-col gap-2 text-white px-[24px] pb-[20px]">
                <Input type="text" placeholder="Name" />
                <Input type="text" placeholder="Username" />
                <Input type="email" placeholder="Email" />
                <Button type="submit">Register</Button>
            </div>
            <div className="py-[20px] border-t border-t-gray-600">
                <div className="px-[24px]">
                    <a href="/signin" className="inline-flex text-white bg-[#404953] w-full py-2.5 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950  dark:focus-visible:ring-slate-300">Sign In</a>
                </div>
            </div>
         </div>
      </div>
    </section>
    </div>
  )
}

export default Signin;