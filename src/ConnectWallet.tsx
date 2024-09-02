// App.tsx

import {
  createWeb3Modal,
  defaultSolanaConfig,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
  useWeb3ModalState,
} from "@web3modal/solana/react";
import { solana, solanaTestnet, solanaDevnet } from "@web3modal/solana/chains";
import { useEffect } from "react";

// 0. Setup chains
const chains = [solana, solanaTestnet, solanaDevnet];

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = "b5b37945209ea323811f1032e84eaeb5";

// 2. Create solanaConfig
const metadata = {
  name: "AppKit",
  description: "AppKit Solana Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const solanaConfig = defaultSolanaConfig({
  metadata,
  chains,
  projectId,
});

// 3. Create modal
createWeb3Modal({
  solanaConfig,
  chains,
  projectId,
});

export default function ConnectButton() {
  const { address, currentChain } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const isConnectedBitgetWalletSolana =
    address &&
    currentChain?.name === "Solana" &&
    walletProvider?.name?.includes("Bitget");

  useEffect(() => {
    if (isConnectedBitgetWalletSolana) {
      console.log("Connected to Bitget Wallet on Solana");
    } else {
      console.log("Not connected to Bitget Wallet on Solana");
    }
  }, [isConnectedBitgetWalletSolana]);
  return <w3m-button />;
}
//
