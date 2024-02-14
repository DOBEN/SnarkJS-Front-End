'use client';
import * as snarkjs from 'snarkjs';

import CommectWallet from '../components/ConnectWallet'

import { WagmiConfig, createConfig, configureChains, sepolia } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

import { ALCHEMY_API_KEY, WALLET_CONNECT_PROJECT_ID } from '../../constants'
import { useEffect, useState } from 'react';
import VerifyProofInSmartContract from '@/components/VerifyProofInSmartContract';
import CreateProof from '@/components/CreateProof';

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [alchemyProvider({ apiKey: ALCHEMY_API_KEY }), publicProvider()]
)

// Set up wagmi config
const config = createConfig({
  autoConnect: false,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: WALLET_CONNECT_PROJECT_ID,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})

export default function Home() {

  const [hasMounted, setHasMounted] = useState(false);

  const [proof, setProof] = useState<snarkjs.Groth16Proof>();
  const [publicSignals, setPublicSignals] = useState<snarkjs.PublicSignals>();

  // Hooks
  useEffect(() => {
    setHasMounted(true);
  }, [])

  // Render
  if (!hasMounted) { return (<></>) }

  return (
    <WagmiConfig config={config}>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <CommectWallet />
        <CreateProof proof={proof} setProof={setProof} setPublicSignals={setPublicSignals} />
        <VerifyProofInSmartContract proof={proof} publicSignals={publicSignals} />
      </main>
    </WagmiConfig>
  );
}
