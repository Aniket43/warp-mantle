import {
  IconArrowBack,
  IconArrowBarLeft,
  IconChevronLeft,
  IconRefresh,
  IconWallet,
} from "@tabler/icons";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { Context } from "../../../App";
import To from "../../../logos/icons/to.svg";
import From from "../../../logos/icons/from.svg";
import { connect } from "@tableland/sdk";
import { ethers } from "ethers";
import historyABI from "../../../ABI/historyManager.json";

function HistoryPanel() {
  const state = useContext(Context);

  async function readTablelandData(tableName) {
    // Establish a connection
    const tableland = connect({ network: "testnet", chain: "polygon-mumbai" });
    // const receiptRes = await tableland.receipt(
    //   "0x867b803a36feeb7ff35f5331f74fcee8bd837ed0d06c866423c7884a0dc83320",
    // );
    // console.log(receiptRes);
    const readRes = await tableland.read(`SELECT * FROM ${tableName};`);
    console.log(await readRes);
    var revRows = await readRes.rows.reverse();
    state.setDatabase({
      ...state.database,

      history: await revRows,
    });
  }

  async function readHistoryContract() {
    const user = state.database.wallet;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const historyContract = new ethers.Contract(
      process.env.REACT_APP_HISTORY_CONTRACT,
      historyABI,
      signer
    );

    let count = await historyContract.getRecieverHistoryCount(user);
    console.log("USER HISTORY COUNT :", count);
    count = parseInt(count._hex);

    let arr = [];
    while (count !== 0) {
      count--;
      const data = await historyContract.getUserHistory(user, count);
      console.log("USER HISTORY DATA :", data);
      arr.push(data);
    }
    if (arr.length > 0) {
      state.setDatabase({
        ...state.database,

        history: arr,
      });
    }
  }
  function formatted_date(d) {
    var result = "";
    d = new Date();

    result +=
      " " +
      d.getHours() +
      ":" +
      d.getMinutes() +
      ":" +
      d.getSeconds() +
      " " +
      d.getMilliseconds() +
      "" +
      d.getDate() +
      "/" +
      (d.getMonth() + 1) +
      "/" +
      d.getFullYear();
    return result;
  }

  useEffect(() => {
    console.log(state.database.history);
    readHistoryContract();
  }, [state.database.wallet]);

  return (
    <div className="  h-full p-4">
      <div className="flex  ">
        <button
          onClick={() => readHistoryContract()}
          className="    btn-ghost p-1 rounded-lg bg-base-200"
        >
          <IconRefresh />
        </button>
        <button
          onClick={() =>
            state.setDatabase({
              ...state.database,

              history: state.database.history.reverse(),
            })
          }
          className="  mx-4 btn-ghost p-1 rounded-lg bg-base-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
        </button>
      </div>
      {state.database.history.map((history, index) => {
        return (
          <div
            className="border-b-2 border-opacity-5 border-white p-3"
            key={index}
          >
            <div className="flex items-center gap-4">
              <p className="font-bold text-slate-200">{history[2]}</p>
              <a
                target={"_blank"}
                href={`https://files.lighthouse.storage/viewFile/${history[1]}`}
                className=" text-sm cursor-pointer underline text-yellow-400"
              >
                open
              </a>
            </div>
            <div className="flex items-center gap-4  ">
              <div className="mr-2 flex ">
                <img src={To} className="h-6 w-6"></img>
                <span className="text-slate-200">From:</span>{" "}
                {history[0].slice(0, 6)}...
                {history[0].slice(history[0].length - 2, history[0].length)}
              </div>
              <p className="text-xs opacity-40">
                {new Date(history[3] * 1).toString()}
              </p>
            </div>
          </div>
        );

        // : history[2] === state.database.wallet ? (
        //   <div
        //     className="border-b-2 border-opacity-5 border-white p-3"
        //     key={index}
        //   >
        //     <div className="flex items-center gap-4">
        //       <p className="font-bold text-slate-200">{history[1]}</p>
        //       <a
        //         target={"_blank"}
        //         href={`https://${history[3]}.ipfs.dweb.link/` + history[1]}
        //         className=" text-sm cursor-pointer underline text-yellow-400"
        //       >
        //         open
        //       </a>
        //     </div>
        //     <div className="flex items-center gap-4  ">
        //       <div className="mr-2 flex ">
        //         <img src={From} className="h-6 w-6"></img>
        //         <span className="text-slate-200">From:</span>{" "}
        //         {history[3].slice(0, 6)}...
        //         {history[3].slice(history[2].length - 2, history[2].length)}
        //       </div>

        //       <p className="text-xs opacity-40">
        //         {new Date(history[0] * 1).toString()}
        //       </p>
        //     </div>
        //   </div>
        // ) : null;
      })}
    </div>
  );
}

export default HistoryPanel;
