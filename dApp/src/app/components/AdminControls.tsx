import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useTransition } from "react";

type Props = {
  isActive: boolean;
  entryFee: string;
  onEntryFeeChange: (value: string) => void;
  startLottery: (value: string) => void;
  selectWinner: () => void;
};

export function AdminControls({
  isActive,
  entryFee,
  onEntryFeeChange,
  startLottery,
  selectWinner,
}: Props) {
  const [isPending, startUITransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => {
    setIsLoading(true);
    startUITransition(() => {
      Promise.resolve(startLottery(entryFee))
        .catch(() => {})
        .finally(() => setIsLoading(false));
    });
  };

  const handlePickWinner = () => {
    setIsLoading(true);
    startUITransition(() => {
      Promise.resolve(selectWinner())
        .catch(() => {})
        .finally(() => setIsLoading(false));
    });
  };

  return (
    <div className="space-y-4 p-4 rounded-lg">
      <h3 className="text-lg font-semibold">Admin Controls</h3>

      {!isActive ? (
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="number"
            value={entryFee}
            onChange={(e) => onEntryFeeChange(e.target.value)}
            step="0.01"
            min="0.01"
            className="w-full"
            placeholder="Entry fee in ETH"
          />
          <Button
            onClick={handleStart}
            variant="outline"
            className="w-full sm:w-auto"
            disabled={isLoading || isPending || !entryFee}
          >
            {isLoading || isPending ? "Starting..." : "Start Lottery"}
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          disabled={isLoading || isPending}
          onClick={handlePickWinner}
        >
          {isLoading || isPending ? "Picking Winner..." : "Pick Winner"}
        </Button>
      )}
    </div>
  );
}
