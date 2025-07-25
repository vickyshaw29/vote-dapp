import { formatEther } from "viem";
import { formatEthValue } from "@/lib/formatEth";

type Props = {
  isActive: boolean;
  entryFee?: bigint;
  balance?: bigint;
  lotteryId?: bigint;
  players?: string[];
};

export function LotteryInfo({ isActive, entryFee, balance, lotteryId, players }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200  p-6">
      <h2 className="textxl md:text-2xl font-bold mb-4 text-center">Current Lottery</h2>
      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <span className="font-medium">Lottery ID:</span>
          <span>{lotteryId?.toString() ?? "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Status:</span>
          <span className={isActive ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Entry Fee:</span>
          <span>{entryFee ? formatEthValue(entryFee) : "0"} ETH</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Prize Pool:</span>
          <span>{balance ? formatEther(balance) : "0"} ETH</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Players entered:</span>
          <span>{players?.length ?? 0}</span>
        </div>
      </div>
    </div>
  );
}
