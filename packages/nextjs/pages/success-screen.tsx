import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const SuccessScreen: NextPage = () => {
  const router = useRouter();
  const [totalValue, setTotalValue] = useState("0,00");

  useEffect(() => {
    if (router.isReady) {
      const queryTotalValue = router.query.totalValueUsed as string;
      if (queryTotalValue) {
        setTotalValue(queryTotalValue);
      } else {
        router.push("/credit-request");
      }
    }
  }, [router.isReady, router.query.totalValueUsed]);

  // Function to format the total value
  const formatValue = (value: string) => {
    const number = parseFloat(value.replace(",", "."));
    return isNaN(number) ? "0,00" : number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  return (
    <>
      <MetaHeader />
      <div className="h-screen flex flex-col items-center text-center py-10">
        <div className="flex flex-col bg-base-100 px-5 py-5 text-center items-center lg:w-1/2 sm:w-3/4 w-3/4 rounded-xl">
          <svg
            aria-hidden="true"
            className="w-16 h-16 text-green-500 dark:text-green-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
          <h1 className="text-3xl mt-4">Loan Successfully Granted</h1>
          <div className="flex flex-col items-center text-center my-2">
            <p className="text-xl my-2 text-neutral-500">You have just received a loan of</p>
            <p className="text-xl text-semibold my-0">{formatValue(totalValue)}</p>
          </div>
          <Link href="/" className="bg-primary hover:bg-base-200 font-large rounded-md text-sm px-20 py-2.5 my-2">
            Home Page
          </Link>

          <Link
            href="/credit-request"
            className="bg-base-300 hover:bg-base-200 font-medium rounded-md text-sm px-10 py-2.5"
          >
            New Loan
          </Link>
        </div>
      </div>
    </>
  );
};

export default SuccessScreen;
