"use client";

import { useAccount } from "wagmi";
import { useState } from "react";
import { useLotteryActions } from "@/hooks/lottery";
import { LotteryInfo } from "./LotteryInfo";
import { EntryButton } from "./EntryButton";
import { AdminControls } from "./AdminControls";
import { PlayerList } from "./PlayerList";

export function Lottery() {
  const {
    isActive,
    entryFee,
    lotteryId,
    balance,
    players,
    isOwner,
    enter,
    startLottery,
    selectWinner,
    hasEntered,
  } = useLotteryActions();
  const { isConnected } = useAccount();
  const [newEntryFee, setNewEntryFee] = useState("0.01");

  return (
    <div className="max-w-2xl mx-auto p-6 shadow-sm border-1 rounded-md">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">Lottery dApp</h1>

      <div className="space-y-4">
        <LotteryInfo
          isActive={isActive}
          entryFee={entryFee}
          lotteryId={lotteryId}
          balance={balance}
          players={players}
        />

        {isConnected && (
          <>
            <EntryButton
              isActive={isActive}
              hasEntered={hasEntered as boolean}
              entryFee={entryFee}
              onEnter={enter}
            />
            {isOwner && (
              <AdminControls
                isActive={isActive}
                entryFee={newEntryFee}
                onEntryFeeChange={setNewEntryFee}
                startLottery={startLottery}
                selectWinner={selectWinner}
              />
            )}
          </>
        )}

        {players && players.length > 0 && <PlayerList players={players} />}
      </div>
    </div>
  );
}
