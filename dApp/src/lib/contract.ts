import { createPublicClient, http } from "viem";
import { sepolia } from "wagmi/chains";
import abi from '../../constants/abi.json'
import { LOTTERY_CONTRACT_ADDRESS } from "../../constants/contract";


export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

export const lotteryContract = {
  address: LOTTERY_CONTRACT_ADDRESS,
  abi,
} as const;
