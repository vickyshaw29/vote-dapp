"use client";

import { useLottery } from "@/hooks/useLottery";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { useState } from "react";

export function Lottery() {
  const {
    isActive,
    entryFee,
    lotteryId,
    balance,
    players,
    isOwner,
    enter,
    startLottery,
    selectWinner,
  } = useLottery();
  const { isConnected } = useAccount();
  const [newEntryFee, setNewEntryFee] = useState("0.01");

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">Lottery dApp</h1>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Current Lottery</h2>
          <p>Lottery ID: {lotteryId?.toString()}</p>
          <p>Status: {isActive ? "Active" : "Inactive"}</p>
          <p>Entry Fee: {entryFee ? formatEther(entryFee) : "0"} ETH</p>
          <p>Prize Pool: {balance ? formatEther(balance) : "0"} ETH</p>
          <p>Players entered: {players?.length || 0}</p>
        </div>

        {isConnected && (
          <div className="space-y-4">
            <button
              onClick={() => enter()}
              disabled={!isActive}
              className={`w-full py-2 px-4 rounded-md font-medium ${
                isActive
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Enter Lottery ({entryFee ? formatEther(entryFee) : "0"} ETH)
            </button>

            {isOwner && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold">Admin Controls</h3>

                {!isActive ? (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newEntryFee}
                      onChange={(e) => setNewEntryFee(e.target.value)}
                      step="0.01"
                      min="0.01"
                      className="flex-1 p-2 border rounded-md"
                      placeholder="Entry fee in ETH"
                    />
                    <button
                      onClick={() => {
                        const feeInWei = BigInt(Number(newEntryFee) * 10 ** 18);
                        startLottery(feeInWei.toString()); 
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
                    >
                      Start Lottery
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={selectWinner}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md"
                  >
                    Pick Winner
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {players && players.length > 0 && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Current Players</h3>
            <ul className="space-y-1">
              {players.map((player, index) => (
                <li key={index} className="text-sm font-mono">
                  {player}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
