import { NextPage } from "next";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const User: NextPage = () => {
  return (
    <div className="bg-black bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat">
      <Header />
      <Navbar />
      <section className="mx-auto h-[727px] max-w-[1080px] px-[14px] pb-[14px] pt-[48px]"></section>
    </div>
  );
};

export default User;
