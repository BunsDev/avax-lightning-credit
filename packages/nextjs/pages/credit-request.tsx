import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { BanknotesIcon, ClockIcon, TicketIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";

const CreditRequest: NextPage = () => {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    router.push({
      pathname: "/title-selection",
      query: { loanAmount: inputValue },
    });
  };

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10 pb-10">
        <div className="flex flex-col bg-base-100 px-5 py-5 text-center items-center w-3/4 rounded-2xl">
          <div className="flex flex-col pb-10 pt-10">
            <Image
              src="/images/tesouro-logo.jpg"
              className="object-contain"
              width={80}
              height={80}
              alt="Tesouro Logo"
            />
          </div>

          <div className="flex flex-col items-left text-center w-1/2 pb-4">
            <h1 className="text-4xl">Loans guaranteed by the National Treasury of Brazil</h1>

            <h2 className="text-2xl">Do you invest in government bonds? This loan is for you!</h2>

            <p className="text-justify mt-0 mb-0">
              Now you can use your Treasury Bonds (Selic, IPCA+, Prefixado) to get a loan. And the best part: you can
              use your investments from any bank or financial institution you prefer!
            </p>
          </div>

          <div className="flex flex-col items-center pb-4 w-1/2 sm:wd-3/4">
            <div className="flex flex-col items-center pb-4 mb-4 bg-base-200 rounded-md focus:outline-none focus:border-blue-500 w-full">
              <span className="mt-2">Type the value you wish to get</span>
              <input
                className="px-2 pt-4 pb-2 text-center text-xl bg-base-200 focus:outline-none focus:border-blue-500 w-full"
                type="text"
                placeholder="R$0,00"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-row justify-evenly bg-base-200 px-5 py-2 w-full rounded-2xl">
              <div className="px-4 text-left">
                <div className="flex flex-row gap-2 justify-center items-start">
                  <TicketIcon className="w-4 h-4 mt-5" />
                  <p className="font-bold">Loans</p>
                </div>
                <p className="mt-0">from R$99,99</p>
              </div>

              <div className="px-4 text-left">
                <div className="flex flex-row gap-2 justify-center items-start">
                  <ClockIcon className="w-4 h-4 mt-5" />
                  <p className="font-bold">Term</p>
                </div>
                <p className="mt-0">up to 240 months</p>
              </div>

              <div className="px-4 text-left">
                <div className="flex flex-row gap-2 justify-center items-start">
                  <BanknotesIcon className="w-4 h-4 mt-5" />
                  <p className="font-bold">Interest rates</p>
                </div>
                <p className="mt-0">from 0,5% per month</p>
              </div>
            </div>

            <div className="flex flex-col items-center mt-4">
              <form
                onSubmit={e => {
                  e.preventDefault(); // Prevent the default form submissio
                  handleSubmit(e); // Pass the event to handleSubmit
                }}
              >
                <button
                  type="submit"
                  className="bg-base-300 hover:bg-base-200 font-medium rounded-md text-sm px-10 py-2.5"
                >
                  Apply for a loan
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreditRequest;
