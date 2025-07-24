import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  const network = await provider.getNetwork();
  console.log("Connected to network:", network.name, "Chain ID:", network.chainId);

  const balance = await provider.getBalance(wallet.address);
  console.log("Wallet address from private key:", wallet.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "ETH");

  if (balance === BigInt(0)) {
    throw new Error("Insufficient funds in deployer wallet");
  }

  const CryptoLottery = await ethers.getContractFactory("CryptoLottery", wallet);
  const lottery = await CryptoLottery.deploy();
  await lottery.waitForDeployment();

  console.log("CryptoLottery contract deployed to:", await lottery.getAddress());
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exit(1);
});
