import { formatAddress } from "@/lib/formatAddress";

type Props = {
  players: string[];
};

export function PlayerList({ players }: Props) {
  return (
    <div className="p-4 border not-last:border-gray-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Current Players</h3>
      <ul className="space-y-1">
        {players.map((player, index) => (
          <li key={index} className="text-sm font-mono">
            {formatAddress(player, 6)}
          </li>
        ))}
      </ul>
    </div>
  );
}
