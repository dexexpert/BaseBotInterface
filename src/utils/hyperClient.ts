import { NETWORK } from "../config";
import { ethers } from "ethers";

// Hyper EVM RPC endpoints
const HYPER_EVM_RPC_URLS = {
  mainnet: "https://rpc.hyperevm.com", // Replace with actual Hyper EVM mainnet RPC
  devnet: "https://rpc-testnet.hyperevm.com", // Replace with actual Hyper EVM testnet RPC
};

// Create Hyper EVM provider
const hyperProviderInstance = new ethers.JsonRpcProvider(
  HYPER_EVM_RPC_URLS[NETWORK === "mainnet" ? "mainnet" : "devnet"]
);

// Create Hyper EVM signer (will be set with private key when needed)
let hyperSignerInstance: ethers.Wallet | null = null;

// Initialize signer with private key
export function initializeHyperSigner(privateKey: string) {
  hyperSignerInstance = new ethers.Wallet(privateKey, hyperProviderInstance);
  return hyperSignerInstance;
}

// Get Hyper EVM provider
export function getHyperProvider() {
  return hyperProviderInstance;
}

// Get Hyper EVM signer
export function getHyperSigner() {
  return hyperSignerInstance;
}

// Get Hyper EVM client (provider + signer)
export function getHyperClient() {
  return {
    provider: hyperProviderInstance,
    signer: hyperSignerInstance,
  };
}
