"use client"

import { lotteryContract, publicClient } from "@/lib/contract";
import { formatAddress } from "@/lib/formatAddress";
import { useEffect, useState } from "react";
import { Address, formatEther } from "viem";

type WinnerEvent = {
  args: {
    lotteryId: bigint;
    winner: Address;
    amount: bigint;
    timestamp?: bigint;
  };
  blockNumber: bigint;
  transactionHash: `0x${string}`;
};

type Winner = {
  lotteryId: bigint;
  winner: Address;
  amount: bigint;
  timestamp: Date;
  transactionHash: `0x${string}`;
};

export function useLotteryWinners() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const MAX_WINNERS = 5;    // Just to see the last 5 winners
  const BLOCK_RANGE = 5000; // limiting this since on free tier

useEffect(() => {
    const fetchRecentWinners = async () => {
      try {
        const currentBlock = await publicClient.getBlockNumber(); // current block
        const fromBlock = currentBlock - BigInt(BLOCK_RANGE) > 0n 
          ? currentBlock - BigInt(BLOCK_RANGE) 
          : 0n;

        const logs = await publicClient.getContractEvents({
          address: lotteryContract.address,
          abi: lotteryContract.abi,
          eventName: "WinnerSelected",
          fromBlock: fromBlock,
          toBlock: currentBlock,
        });

        const recentWinners = await Promise.all(
          logs.slice(-MAX_WINNERS).map(async (log) => {
            const event = log as unknown as WinnerEvent;
            const block = await publicClient.getBlock({
              blockNumber: event.blockNumber,
            });

            return {
              lotteryId: event.args.lotteryId,
              winner: event.args.winner,
              amount: event.args.amount,
              timestamp: new Date(Number(block.timestamp) * 1000),
              transactionHash: event.transactionHash,
            };
          })
        );

        setWinners(recentWinners.reverse());
      } catch (error) {
        console.error("Error fetching recent winners:", error);
        setWinners([]);
      }
    };

    fetchRecentWinners();
  }, []);

  return {
    winners,
    formattedWinners: winners.map((winner) => ({
      ...winner,
      formattedWinner: formatAddress(winner.winner),
      formattedAmount: formatEther(winner.amount),
      dateString: winner.timestamp.toLocaleDateString(),
      timeString: winner.timestamp.toLocaleTimeString(),
      etherscanLink: `https://sepolia.etherscan.io/tx/${winner.transactionHash}`,
    })),
  };
}
