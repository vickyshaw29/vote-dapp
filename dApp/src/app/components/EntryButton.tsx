import { formatEther } from "viem";
import { Button } from "./ui/button";

type Props = {
  isActive: boolean;
  hasEntered?: boolean;
  entryFee?: bigint;
  onEnter: () => void;
};

export function EntryButton({ isActive, hasEntered, entryFee, onEnter }: Props) {
  return (
    <Button
      onClick={onEnter}
      disabled={!isActive || hasEntered}
      className={`w-full py-2 px-4 rounded-md font-medium ${
        isActive
          ? ""
          : "cursor-not-allowed"
      }`}
      variant={"default"}
    >
      {hasEntered ? "Already Entered" : "Enter Lottery"} (
      {entryFee ? formatEther(entryFee) : "0"} ETH)
    </Button>
  );
}
