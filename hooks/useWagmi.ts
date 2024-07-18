import { Address, Chain, useAccount, useNetwork } from 'wagmi';

type useWagmiReturnType = {
  chainId: number | undefined;
  account: Address | undefined;
  chain:
    | (Chain & {
        unsupported?: boolean | undefined;
      })
    | undefined;
  isConnected: boolean;
  isConnecting: boolean;
};

export default function useWagmi(): useWagmiReturnType {
  const { chain } = useNetwork();
  const { address, isConnected, isConnecting } = useAccount();
  return {
    chainId: chain?.id,
    account: address,

    chain,
    isConnected,
    isConnecting,
  };
}
