import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { FC, ReactNode, useEffect, } from 'react';
import { useAppState } from './ClickerStore';

const ClickerProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const wallet = useAnchorWallet();
    const {connection} = useConnection();
    const {setState, clearState} = useAppState();

    useEffect(() => {
        if(wallet){
            // connection.requestAirdrop(wallet.publicKey, LAMPORTS_PER_SOL * 3);
            setState(wallet, connection);
        } else {
            clearState();
        }
    }, [wallet]);

    return (
        <>
            {children}
        </>
    );
};

export default ClickerProvider;

