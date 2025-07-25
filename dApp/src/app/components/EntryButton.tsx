import { formatEther } from "viem";
import { Button } from "./ui/button";
import { useState, useTransition } from "react";

type Props = {
  isActive: boolean;
  hasEntered?: boolean;
  entryFee?: bigint;
  onEnter: () => void;
};
export function EntryButton({
  isActive,
  hasEntered,
  entryFee,
  onEnter,
}: Props) {
  const [isPending, startUITransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const handleEnter = () => {
    setIsLoading(true);
    startUITransition(()=>{
      Promise.resolve(onEnter())
      .catch(()=>{})
      .finally(()=>setIsLoading(false));
    })
  }

  return (
    <Button
      onClick={handleEnter}
      disabled={isLoading || isPending  || !isActive || hasEntered}
      className={`w-full py-2 px-4 rounded-md font-medium ${
        isActive ? "" : "cursor-not-allowed"
      }`}
      variant={"default"}
    >
      {isLoading || isPending ? "Processing..." : hasEntered ? "Already Entered" : "Enter Lottery"} (
      {entryFee ? formatEther(entryFee) : "0"} ETH)
    </Button>
  );
}
