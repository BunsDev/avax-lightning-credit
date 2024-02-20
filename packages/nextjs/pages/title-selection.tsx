import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { useGlobalState } from "~~/context/GlobalStateContext";
import ALCJSON from "~~/utils/ALC.json";
import { useAccount, useParticleConnect, useParticleProvider } from '@particle-network/connect-react-ui';


import {
  fetchTPFtByAddress,
  fetchWalletByCpfAndBank,
  findAddressByBankName,
  findTPFtByAddres,
} from "~~/utils/bacenApiFetcher";

// Define the type for the inputValues state
type InputValuesType = {
  [key: string]: string;
};
const TitleSelection: NextPage = () => {
  const router = useRouter();
  const [loanAmount, setLoanAmount] = useState(""); // State to hold the loan amount
  const [inputValues, setInputValues] = useState<InputValuesType>({}); // State to hold all input values
  const [isLoading, setIsLoading] = useState(false); // New state for loading status
  const [currentValue, setCurrentValue] = useState(0); // State to hold the current value of the Selic title
  const ALCAddress = "0x7850FE6BbC5572D49edE7d9d77C3AD336E84E59b";
  const NTBtAddress = "0xA9C5c74C998d18266118aa60CFBd9bBF89BDdb8f";
  const ParticleProvider = useParticleProvider();
  const account = useAccount();

  useEffect(() => {
    // Define an async function to fetch and filter data
    const fetchDataAndFilter = async () => {
      // If the page has finished loading and the router is ready
      if (router.isReady) {
        // Retrieve the loan amount from the query and set it to the state
        const queryLoanAmount = router.query.loanAmount as string;
        setLoanAmount(queryLoanAmount);

        const cpf = "11640141619"; // CPF do usuário
        const bankName = "RGBank"; // Nome do banco do usuário
        try {
          const walletData = await fetchWalletByCpfAndBank(cpf);
          const walletAddresses = await findAddressByBankName(walletData, bankName); // Use await here
          const walletAddress = walletAddresses[0];
          const tpfts = await fetchTPFtByAddress();
          const addressTPFts = await findTPFtByAddres(tpfts, walletAddress); // Use await here
          setCurrentValue(addressTPFts.value.current);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchDataAndFilter(); // Call the async function to fetch and filter data
  }, [router.isReady, router.query.loanAmount]); // Dependency array

  // Function to handle the input change and store the value
  const handleInputChange = (index: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValues(prevValues => ({
      ...prevValues,
      [index]: value,
    }));
  };

  async function creditOperation(
    investorAddress: string,
    TPFtAddress: string,
    BRLAmount: string,
    contractAddress: string,
    abi: any,
  ) {

    const customProvider = new ethers.providers.Web3Provider(ParticleProvider);
    const signer = customProvider.getSigner();

    const ALCABI = ALCJSON.abi;
    const ALCAddress = "0x7850FE6BbC5572D49edE7d9d77C3AD336E84E59b"

    const ALCContract = new ethers.Contract(ALCAddress, ALCABI, signer);

    const tokenTransaction = await ALCContract.creditOperation(account, NTBtAddress, BRLAmount);

    await tokenTransaction.wait();

    try {
      console.log("Operação de crédito realizada com sucesso");
    } catch (error) {
      console.error("Erro ao realizar operação de crédito:", error);
    }
  }

  // Function to handle navigation to the success screen
  const navigateToSuccessScreen = async (
    investorAddress: string,
    TPFtAddress: string,
    BRLAmount: string, // Agora recebe BRLAmount como parâmetro
    contractAddress: string,
    contractAbi: any,
  ) => {
    incrementBalance(totalValueUsed); // Incrementa o saldo global
    setIsLoading(true); // Disable navigation by setting isLoading to true

    // Chama a função creditOperation com os parâmetros fornecidos
    try {
      await creditOperation(
        investorAddress, // Endereço do investidor
        TPFtAddress, // Endereço do TPFt
        BRLAmount, // Valor em BRL
        contractAddress, // Endereço do contrato
        contractAbi, // ABI do contrato
      );
      console.log("Operação de crédito realizada com sucesso.");

      // Aqui você pode adicionar código para salvar os dados no banco de dados
    } catch (error) {
      console.error("Erro na operação de crédito:", error);
    }

    setIsLoading(false); // Re-enable navigation by setting isLoading to false

    // Navega para a tela de sucesso com totalValueUsed como parâmetro de consulta
    router.push({
      pathname: "/success-screen",
      query: { totalValueUsed: totalValueUsed.toFixed(2) }, // Passando o valor total
    });
  };

  // Calculate the sum of all input values, ensuring each value is a number
  const totalValueUsed = Object.values(inputValues).reduce((sum, value) => {
    const numericValue = parseFloat(value);
    return sum + (isNaN(numericValue) ? 0 : numericValue); // Only add if it's a number
  }, 0);

  const { incrementBalance } = useGlobalState(); // Use the global state increment function

  const titlesData = [
    { title: "Tesouro Prefixado 2026", institution: "Banco do Brasil", yield: "10,4%" },
    { title: "Tesouro IPCA+ 2032", institution: "Caixa Econômica", yield: "IPCA + 6,2%" },
    { title: "Tesouro Selic 2029", institution: "Banco Santander", yield: "SELIC + 0,147%" },
    // Add more titles and their respective data as needed
  ];

  return (
    <>
      <MetaHeader />
      <div className="flex flex-col flex-grow bg-base-300 items-center py-10">
        <div className="flex flex-col bg-base-100 px-5 py-5 text-center items-center w-3/4 rounded-xl">
          <div className="flex flex-row py-4 justify-between w-full px-10">
            <div className="flex flex-col items-start text-left">
              <h1 className="text-4xl mb-0">Treasury Bonds to Use</h1>

              <p className="text-2xl my-2 text-zinc-500">Select titles to leave as loan collateral</p>
            </div>

            <div className="flex flex-col items-end text-right">
              <button
                disabled={isLoading} // Disable the button based on isLoading state
                onClick={() =>
                  navigateToSuccessScreen(
                    account!,
                    NTBtAddress,
                    totalValueUsed.toString() + "00",
                    ALCAddress,
                    ALCJSON.abi,
                  )
                }
                className={`bg-base-300 hover:bg-base-200 font-medium rounded-md text-sm px-10 py-2.5 ${
                  isLoading ? "opacity-50" : ""
                }`}
              >
                {isLoading ? "Processing..." : "Done"}
              </button>
            </div>
          </div>

          <div className="flex flex-col py-2 w-full px-10">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        Institution
                        <Link href="#">
                          <svg
                            className="w-3 h-3 ms-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </Link>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        Annual Yield
                        <Link href="#">
                          <svg
                            className="w-3 h-3 ms-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </Link>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        Balance
                        <Link href="#">
                          <svg
                            className="w-3 h-3 ms-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </Link>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        Amount to use
                        <Link href="#">
                          <svg
                            className="w-3 h-3 ms-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                          </svg>
                        </Link>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {titlesData.map((data, index) => (
                    <tr key={data.title} className="bg-white border-b">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {data.title}
                      </th>
                      <td className="px-6 py-4">{data.institution}</td>
                      <td className="px-6 py-4">{data.yield}</td>
                      <td className="px-6 py-4">
                        R$ {data.title === "Tesouro Selic 2029" ? currentValue?.toFixed(0) || "0,00" : 10000}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <input
                          className="px-2 py-2 text-left focus:outline-none focus:border-blue-500 w-full"
                          type="number"
                          placeholder="R$0,00"
                          value={inputValues[`value-${index}`] || ""} // Use dynamic keys for inputValues
                          onChange={handleInputChange(`value-${index}`)} // Pass a unique key for each input
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-200">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      <div>
                        <p>Desired Loan</p>
                        <p className="font-bold text-lg">Value used as collateral</p>
                      </div>
                    </th>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4 text-right">
                      <div>
                        <p>{loanAmount ? `R$ ${loanAmount}` : "R$ 0,00"}</p>
                        {/* Display the sum of values */}
                        <p className="font-bold text-lg">R$ {totalValueUsed.toFixed(2)}</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TitleSelection;
