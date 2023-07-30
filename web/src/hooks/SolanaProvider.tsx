import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { FC, ReactNode, useMemo } from 'react';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import React, { useState, useEffect } from 'react';

const SolanaProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [endpoint, setEndpoint] = useState(process.env.REACT_APP_SOLANA_RPC_TARGET as string);

    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const wallets = useMemo(
        () => [
            new UnsafeBurnerWalletAdapter(),
        ],
        // eslint-disable-next-line
        []
    );

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const rpcParam = searchParams.get('rpc');
        if (rpcParam) {
            const decodedRpcParam = decodeURIComponent(rpcParam);
            setEndpoint(decodedRpcParam);
        }
    }, []);


    return (
        <ConnectionProvider endpoint={endpoint} config={{commitment: 'singleGossip'}}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default SolanaProvider;
