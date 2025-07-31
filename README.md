# Crypto Lottery dApp 

<img width="1440" height="861" alt="Cypto_Lottery" src="https://github.com/user-attachments/assets/b20b7837-beee-4a60-9ec1-32897af842dd" />

A complete decentralized lottery application that is built with Solidity and a modern React (Next.js) frontend. Users enter the lottery by sending ETH, and the owner of the lottery can draw a winner from the total prize pool.


###  Smart Contract (`CryptoLottery.sol`)
Here are the features of the lottery:
- Start new lottery (`startLottery`) using a custom entry fee (only callable by owner)
- Allow users to enter with exact ETH (`enter`)
- Do not allow multiple entries using `hasEntered`
- Pick a winner randomly using `block.prevrandao` (only callable by owner)
- Transfer full balance to winner and reset lottery
- Emit events for all actions (`LotteryStarted`, `PlayerEntered`, `WinnerSelected`, `LotteryReset`)
- Check players with `getPlayers()` and contract balance with `getBalance()`

## 🔧 Tech Stack

### Smart Contracts
- **Language:** Solidity
- **Framework:** Hardhat
- **Typing & Utilities:** TypeChain


### Frontend
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI Libraries:** shadcn/ui, Tailwind CSS
- **Wallet Integration:** wagmi, viem, RainbowKit
- **Data Fetching & Caching:** TanStack Query
- **Responsive:** optimized for mobile and desktop experiences


## Environment Variables

To run this project, you will need to add the following environment variables to your .env.local file in dApp and a .env file in smart-contracts

You can use `.env.local.example` and `.env.example` as references.


### DApp(.env.local)

`NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=YOUR_WALLETCONNECT_PROJECT_ID`

### Smart-contracts(No setup required, already deployed and integrated into the dApp)

`SEPOLIA_RPC_URL=YOUR_SEPOLIA_RPC_URL`

`PRIVATE_KEY=YOUR_PRIVATE_KEY`




##  Project Setup

### 1. Clone the repo
```bash
git clone https://github.com/vickyshaw29/vote-dapp.git
```
### 2. Run the app
```bash
cd vote-dapp && npm run install-all && npm run dapp:dev
```

### (Optional) Compile & deploy smart contracts
```bash
npm run contracts:compile

# (Optional) Deploy smart contracts to Sepolia
npm run contracts:deploy
```
