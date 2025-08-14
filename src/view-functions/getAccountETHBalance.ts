import { getHyperProvider } from "../utils/hyperClient";
import { ethers } from "ethers";

interface GetAccountHYPERBalanceArguments {
  owner: string;
  tokenAddress?: string; // Optional: for ERC-20 tokens, default to HYPER native token
}

export const getAccountHYPERBalance = async (
  args: GetAccountHYPERBalanceArguments
) => {
  try {
    const provider = getHyperProvider();
    if (args.tokenAddress) {
      // ERC-20 token balance
      const tokenContract = new ethers.Contract(
        args.tokenAddress,
        ['function balanceOf(address) view returns (uint256)'],
        provider
      );
      const balance = await tokenContract.balanceOf(args.owner);
      return balance.toString();
    } else {
      // Native HYPER balance
      const balance = await provider.getBalance(args.owner);
      return balance.toString();
    }
  } catch (error) {
    console.error("Failed to get HYPER balance:", error);
    return null;
  }
};