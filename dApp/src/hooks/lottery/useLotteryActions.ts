import {
  useAccount,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { lotteryContract, publicClient } from "@/lib/contract";
import { parseEther, type Address } from "viem";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useLotteryEvents } from "./useLotteryEvents";

export function useLotteryActions() {
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const queryKey = ["readContract", { scopeKey: "lottery" }];
  useLotteryEvents()

  // Read functions for the contract
  const { data: isActive } = useReadContract({...lotteryContract,functionName: "isActive",scopeKey: "lottery"});
  const { data: entryFee } = useReadContract({ ...lotteryContract,functionName: "entryFee",scopeKey: "lottery"});
  const { data: lotteryId } = useReadContract({...lotteryContract,functionName: "lotteryId",scopeKey: "lottery"});
  const { data: balance } = useReadContract({...lotteryContract,functionName: "getBalance",scopeKey: "lottery"});
  const { data: players } = useReadContract({...lotteryContract,functionName: "getPlayers",scopeKey: "lottery"});
  const { data: owner } = useReadContract({...lotteryContract,functionName: "owner",scopeKey: "lottery"});

  const { data: hasEntered } = useReadContract({
    ...lotteryContract,
    functionName: "hasEntered",
    args: [address],
    scopeKey: "lottery",
  });

  // Write functions
  const { writeContract: enterLottery } = useWriteContract();
  const { writeContract: startNewLottery } = useWriteContract();
  const { writeContract: pickWinner } = useWriteContract();
  const enter = async () => {
    if (!entryFee) return;

    const toastId = toast.loading("Waiting for wallet confirmation...");
    try {
      const hash = await new Promise<`0x${string}`>((resolve, reject) => {
        // Getting the transaction hash from here
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
      console.log({ receipt });
      if (receipt.status === "success") {
        queryClient.invalidateQueries({ queryKey });
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
      const amount = parseEther(fee);
      console.log({ amount });
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
        queryClient.invalidateQueries({ queryKey });
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
      console.log({ receipt }, "receipt");
      if (receipt.status === "success") {
        queryClient.invalidateQueries({ queryKey });

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
    hasEntered,
  };
}
