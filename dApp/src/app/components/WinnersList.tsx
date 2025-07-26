"use client"

import { useLotteryWinners } from "@/hooks/lottery/useLotteryWinners"
import { Table ,   TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "./ui/table"


export function WinnersList() {
  const { formattedWinners } = useLotteryWinners()

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Lottery Winners</h2>
      {formattedWinners.length === 0 ? (
        <p className="text-gray-500">No winners yet</p>
      ) : (
          <Table className="shadow-2xl border rounded-md">
            <TableHeader>
              <TableRow>
                <TableHead>Lottery ID</TableHead>
                <TableHead>Winner</TableHead>
                <TableHead className="text-right">Prize (ETH)</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formattedWinners.map((winner, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    #{winner.lotteryId.toString()}
                  </TableCell>
                  <TableCell>
                    <a
                      href={winner.etherscanLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {winner.formattedWinner}
                    </a>
                  </TableCell>
                  <TableCell className="text-center">
                    {winner.formattedAmount}
                  </TableCell>
                  <TableCell>
                    {winner.dateString} at {winner.timeString}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      )}
    </div>
  )
}