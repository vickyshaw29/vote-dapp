import { formatEther } from "viem";

export function formatEthValue(weiValue: bigint | undefined): string {
  if (!weiValue) return "0";
  const ethValue = formatEther(weiValue);
  const formatted = parseFloat(ethValue).toFixed(6);
  return formatted.replace(/(\.0+|0+)$/, '');
}
