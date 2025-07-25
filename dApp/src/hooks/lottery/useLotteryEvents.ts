import { useWatchContractEvent } from "wagmi";
import { lotteryContract } from "@/lib/contract";
import { formatEther } from "viem";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { formatAddress } from "@/lib/formatAddress";


export function useLotteryEvents() {
  const queryClient = useQueryClient();
  const queryKey = ["readContract", { scopeKey: "lottery" }];

  useWatchContractEvent({
    ...lotteryContract,
    eventName: "PlayerEntered",
    onLogs: (logs) => {
      logs.forEach((log) => {
        const player = (log as any).args.player;
        const formatted = formatAddress(player);
        toast.success(`New player: ${formatted}`);
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
        const formattedWinner = formatAddress(winner);
        queryClient.invalidateQueries({ queryKey });
        toast.success(`${formattedWinner} won ${formatEther(amount)} ETH!`, {
          id: `winner-${formattedWinner}-${amount}`,
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
