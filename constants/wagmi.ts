import { configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  rabbyWallet,
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  safeWallet,
} from '@rainbow-me/rainbowkit/wallets';

import { APP_CHAINS } from '../constants/chains';

export const getWagmiConfig = () => {
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

  if (!projectId) throw new Error('Project ID is not defined');

  const { chains, publicClient } = configureChains(APP_CHAINS, [publicProvider()]);

  const connectors = connectorsForWallets([
    {
      groupName: 'Popular',

      wallets: [
        injectedWallet({ chains }),
        metaMaskWallet({ projectId, chains }),
        rabbyWallet({ chains }),
        walletConnectWallet({ projectId, chains }),
      ],
    },
    {
      groupName: 'Others',
      wallets: [
        coinbaseWallet({ chains, appName: 'IM3' }),
        rainbowWallet({ projectId, chains }),
        safeWallet({ chains }),
      ],
    },
  ]);

  return {
    wagmiConfig: createConfig({
      autoConnect: true,
      connectors,
      publicClient,
    }),
    chains,
  };
};
