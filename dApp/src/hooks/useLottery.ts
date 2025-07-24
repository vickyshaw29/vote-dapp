import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import { lotteryContract, publicClient } from "@/lib/contract";
import { formatEther, type Address } from "viem";
import toast from "react-hot-toast";

export function useLottery() {
  const { address } = useAccount();

  // Read functions for the contract
  const { data: isActive } = useReadContract({
    ...lotteryContract,
    functionName: "isActive",
  });

  const { data: entryFee } = useReadContract({
    ...lotteryContract,
    functionName: "entryFee",
  });

  const { data: lotteryId } = useReadContract({
    ...lotteryContract,
    functionName: "lotteryId",
  });

  const { data: balance } = useReadContract({
    ...lotteryContract,
    functionName: "getBalance",
  });

  const { data: players } = useReadContract({
    ...lotteryContract,
    functionName: "getPlayers",
  });

  const { data: owner } = useReadContract({
    ...lotteryContract,
    functionName: "owner",
  });

  // Write functions 
  const { writeContract: enterLottery } = useWriteContract();
  const { writeContract: startNewLottery } = useWriteContract();
  const { writeContract: pickWinner } = useWriteContract();

  // listeners
  useWatchContractEvent({
    ...lotteryContract,
    eventName: "PlayerEntered",
    onLogs: (logs) => {
      logs.forEach((log) => {
        const player = (log as any).args.player;
        toast.success(`New player: ${player}`);
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
        toast.success(`${winner} won ${formatEther(amount)} ETH!`);
      });
    },
  });

  useWatchContractEvent({
    ...lotteryContract,
    eventName: "LotteryStarted",
    onLogs: () => {
      toast.success("New lottery started!");
    },
  });

  useWatchContractEvent({
    ...lotteryContract,
    eventName: "LotteryReset",
    onLogs: () => {
      toast("Lottery reset", { icon: "🔄" });
    },
  });

  const enter = async () => {
    if (!entryFee) return;

    const toastId = toast.loading("Waiting for wallet confirmation...");
    try {
      const hash = await new Promise<`0x${string}`>((resolve, reject) => {       // Getting the transaction hash from here
        enterLottery(
          {
            ...lotteryContract,
            functionName: "enter",
            value: BigInt(entryFee.toString()),
          },
          {
            onSuccess: (hash) => resolve(hash),
            onError: (error) => reject(error),
          }
        );
      });

      toast.loading("Processing transaction...", { id: toastId });
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status === "success") {
        toast.success("You're in!", { id: toastId });
      } else {
        toast.error("Transaction failed", { id: toastId });
      }
      return receipt;
    } catch (error) {
      toast.error("Failed to enter", { id: toastId });
      throw error;
    }
  };

  const startLottery = async (fee: string) => {
    const toastId = toast.loading("Waiting for wallet confirmation...");
    try {
      const hash = await new Promise<`0x${string}`>((resolve, reject) => {
        startNewLottery(
          {
            ...lotteryContract,
            functionName: "startLottery",
            args: [BigInt(Number(fee) * 1e18)],
          },
          {
            onSuccess: (hash) => resolve(hash),
            onError: (error) => reject(error),
          }
        );
      });

      toast.loading("Processing transaction...", { id: toastId });
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status === "success") {
        toast.success("Lottery started!", { id: toastId });
      } else {
        toast.error("Transaction failed", { id: toastId });
      }
      return receipt;
    } catch (error) {
      toast.error("Failed to start lottery", { id: toastId });
      throw error;
    }
  };

  const selectWinner = async () => {
    const toastId = toast.loading("Waiting for wallet confirmation...");
    try {
      const hash = await new Promise<`0x${string}`>((resolve, reject) => {
        pickWinner(
          {
            ...lotteryContract,
            functionName: "pickWinner",
          },
          {
            onSuccess: (hash) => resolve(hash),
            onError: (error) => reject(error),
          }
        );
      });

      toast.loading("Processing transaction...", { id: toastId });
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status === "success") {
        toast.success("Winner selected!", { id: toastId });
      } else {
        toast.error("Transaction failed", { id: toastId });
      }
      return receipt;
    } catch (error) {
      toast.error("Failed to pick winner", { id: toastId });
      throw error;
    }
  };

  return {
    isActive: isActive as boolean,
    entryFee: entryFee as bigint,
    lotteryId: lotteryId as bigint,
    balance: balance as bigint,
    players: players as Address[],
    owner: owner as Address,
    isOwner: owner === address,
    enter,
    startLottery,
    selectWinner,
  };
}
