import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { FC, ReactNode, useMemo } from 'react';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import React from 'react';

const SolanaProvider: FC<{ children: ReactNode }> = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const wallets = useMemo(
        () => [
            new UnsafeBurnerWalletAdapter(),
        ],
        // eslint-disable-next-line
        []
    );

    return (
        <ConnectionProvider endpoint={process.env.REACT_APP_SOLANA_RPC_TARGET as string}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default SolanaProvider;
