import { useWatchContractEvent } from "wagmi";
import { lotteryContract } from "@/lib/contract";
import { formatEther } from "viem";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";


export function useLotteryEvents() {
  const queryClient = useQueryClient();
  const queryKey = ["readContract", { scopeKey: "lottery" }];

  useWatchContractEvent({
    ...lotteryContract,
    eventName: "PlayerEntered",
    onLogs: (logs) => {
      logs.forEach((log) => {
        const player = (log as any).args.player;

        toast.success(`New player: ${player}`, {
          style: {
            minWidth: "300px",
            maxWidth: "100%",
            whiteSpace: "normal",
          },
        });
      });
    },
  });

  useWatchContractEvent({
    ...lotteryContract,
    eventName: "WinnerSelected",
    onLogs: (logs) => {
      logs.forEach((log) => {
        const winner = (log as any).args.winner;
        const amount = (log as any).args.amount;
        queryClient.invalidateQueries({ queryKey });
        toast.success(`${winner} won ${formatEther(amount)} ETH!`, {
          id: `winner-${winner}-${amount}`,
          style: {
            minWidth: "300px",
            maxWidth: "100%",
            whiteSpace: "normal",
          },
          duration: 10000,
        });
      });
    },
  });

  useWatchContractEvent({
    ...lotteryContract,
    eventName: "LotteryStarted",
    onLogs: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("New lottery started!");
    },
  });

  useWatchContractEvent({
    ...lotteryContract,
    eventName: "LotteryReset",
    onLogs: () => {
      queryClient.invalidateQueries({ queryKey });
      toast("Lottery reset", { icon: "✅" });
    },
  });
}
