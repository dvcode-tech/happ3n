import { NextPage } from "next";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const Ticket: NextPage = () => {
  return (
    <div className="bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat">
      <Header />
      <Navbar />
      <section className="mx-auto flex h-[727px] max-w-[1080px] justify-center px-[14px] pb-[14px] pt-[48px]">
        <div className="w-[400px] rounded-lg bg-white px-[24px] py-[20px] shadow-lg">
          <div className="w-fit rounded-md bg-[#13151714] px-[7px] py-[4px] text-[12px] font-medium uppercase text-[#1315177A]">
            Ticket
          </div>
          <div className="my-[4px] text-[24px] font-medium text-[#131517]">
            ICP Meetup 2024
          </div>
          <div>
            <p></p>
            <p></p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Ticket;
