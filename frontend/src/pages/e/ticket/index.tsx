import { NextPage } from "next";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Link from "next/link";

import QRCode from "react-qr-code";

const Ticket: NextPage = () => {
  return (
    <div className="bg-[url('/assets/bg.png')] bg-cover bg-center bg-no-repeat">
      <Header />
      <Navbar />
      <section className="mx-auto flex h-[727px] max-w-[1080px] justify-center px-[14px] pb-[14px] pt-[48px]">
        <div className="relative h-fit w-[400px] rounded-lg bg-white py-[20px] shadow-lg">
          <div className="px-[24px]">
            <div className="w-fit rounded-md bg-[#13151714] px-[7px] py-[4px] text-[12px] font-medium uppercase text-[#1315177A]">
              Ticket
            </div>
            <div className="my-[4px] text-[24px] font-medium text-[#131517]">
              ICP Meetup 2024
            </div>
            <div className="mb-[24px] text-[14px] text-[#131517A3]">
              <p className="mb-[4px]">May 23, 2024, 6:00 PM GMT+8</p>
              <p>
                Ardenhills Suites, 1 Sct. Albano, Diliman, Quezon City, 1103
                Metro Manila, Philippines
              </p>
            </div>
          </div>

          <div className="w-full border-t border-dashed border-gray-400/30"></div>

          <div className="my-[24px] flex justify-center">
            <QRCode
              id="QRCode"
              size={256}
              className="p-[8px]"
              value={JSON.stringify({
                name: "ICP Meetup 2024",
              })}
              // value={JSON.stringify({
              //   hash: data.hash,
              //   missionId: data.id,
              // })}
              viewBox="0 0 250 250"
            />
          </div>

          <div className="w-full border-t border-dashed border-gray-400/30"></div>

          <div className="my-[24px] flex justify-between px-[24px]">
            <div className="flex flex-1 flex-col">
              <p className="text-[13px] text-[#1315175C]">Guest</p>
              <p className="font-medium text-[#131517]">Jirumaa Olaybal</p>
            </div>
            <div className="flex flex-1 flex-col">
              <p className="text-[13px] text-[#1315175C]">Status</p>
              <p className="font-medium text-[#07A460]">Going</p>
            </div>
          </div>

          {/* <div className="w-full border-t border-dashed border-gray-400/30"></div>

          <div className="my-[24px] flex justify-between px-[24px]">
            <button></button>
            <button></button>
          </div> */}
        </div>
      </section>
    </div>
  );
};

export default Ticket;
