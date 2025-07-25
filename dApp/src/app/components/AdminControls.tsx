import { Button } from "./ui/button";
import { Input } from "./ui/input";

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
            onClick={() => startLottery(entryFee)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Start Lottery
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={selectWinner}
        >
          Pick Winner
        </Button>
      )}
    </div>
  );
}
