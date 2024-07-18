import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { getWagmiConfig } from '../../constants/wagmi';

const { wagmiConfig, chains } = getWagmiConfig();

export default function WagmiConfigRoot({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        showRecentTransactions={true}
        theme={darkTheme({
          accentColor: '#AEE3FA',
          accentColorForeground: '#151A1F',
          borderRadius: 'small',
          fontStack: 'system',
          overlayBlur: 'small',
        })}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
