import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import { StateCreator, create } from 'zustand';
import { CLICKER_PROGRAM_ID, ClickerStruct, GameStruct, clickClickerAccount, createClickerAccount, fetchClickerAccount, fetchGameAccount, getClickerKey, getClickerProgram, getClickerTokenKey, upgradeClickerAccount } from '../controllers/clickerProgram';
import { IDL, Upgrade } from '../controllers/idl/upgrade';
import { grabLocalKeypair } from '../controllers/storage';

export type CombinedState = AppSlice;


export interface AppSlice {
    publicKey: PublicKey | null;    
    wallet: AnchorWallet | null;
    walletListener: number | null;
    connection: Connection | null;
    balance: number | null;
    setState: (wallet: AnchorWallet, connection: Connection) => void;
    clearState: () => void;

    // ---- CLICKER STUFF -----
    clickerProgram: Program<Upgrade> | null;
    clickerKey: PublicKey | null;
    clickerTokenKey: PublicKey | null;
    clickerAccount: ClickerStruct | null;
    clickerCreate: () => void;
    clickerClick: () => void;
    clickerUpgrade: (upgrade: number) => void;

    // ---- GAME STUFF -----
    gameKeypair: Keypair | null;
    // newKeypair: () => void;
    // gameWithdraw: () => void;
    // gameDeposit: () => void;
    // gameSubmit: () => void;
    gameAccount: GameStruct | null;

    // ---- Toast -----
    clearToast: () => void;
    isLoading: boolean;
    toastMessage: string | null;
    toastError: string | null;
    toastSuccess: string | null;

}

export const createAppStateSlice: StateCreator<CombinedState, [], [], AppSlice> = (set, get) => {

    const setState = (wallet: AnchorWallet, connection: Connection) => {

        const gameKeypair = grabLocalKeypair(wallet.publicKey);

        const clickerProgram = getClickerProgram(wallet, connection);
        const clickerKey = getClickerKey(
            clickerProgram,
            wallet.publicKey
        );
        const clickerTokenKey = getClickerTokenKey(wallet.publicKey);

        const walletListener = connection.onAccountChange(wallet.publicKey, (walletAccount) => {
            set({
                balance: walletAccount.lamports / LAMPORTS_PER_SOL,
            });
        })

        set({
            wallet,
            connection,
            publicKey: wallet.publicKey,
            clickerProgram,
            clickerKey,
            clickerTokenKey,
            walletListener
        });

        // ------ ASYNC STUFF ------
        connection.getBalance(wallet.publicKey).then((balance) => {
            set({
                balance: balance / LAMPORTS_PER_SOL,
            });
        }).catch((err) => {
            set({
                balance: null,
            });
            console.log(`Error getting balance [${err}]`);
        })

        fetchClickerAccount(clickerProgram, clickerKey).then((clickerAccount) => {
            set({
                clickerAccount,
            });
        }).catch((err) => {
            set({
                clickerAccount: null,
            });
            console.log(`Account does not exist yet [${err}]`);
        });

        fetchGameAccount(clickerProgram).then((gameAccount) => {
            set({
                gameAccount,
            });
        }).catch((err) => {
            set({
                gameAccount: null,
            });
            console.log(`Game account is not showing up [${err}]`);
        });
    }

    const clearState = () => {

        const connection = get().connection;
        const walletListener = get().walletListener;
        if(connection && walletListener !== null){
            connection.removeAccountChangeListener(walletListener);
        }

        set({
            wallet: null,
            connection: null,
            publicKey: null,
            walletListener: null,
            balance: null,
            clickerKey: null,
            clickerProgram: null,
            clickerAccount: null,
            clickerTokenKey: null,
            gameKeypair: null,
            gameAccount: null,
            toastError: null,
            toastMessage: null,
            toastSuccess: null,
            isLoading: false,
        });
    }

    const clearToast = () => {
        set({
            toastError: null,
            toastMessage: null,
            toastSuccess: null,
        });
    }

    const clickerCreate = () => {
        const { 
            clickerProgram,
            clickerKey,
            wallet,
            isLoading
        } = get();

        if(clickerProgram && clickerKey && wallet && !isLoading){
            set({isLoading: true,})
            createClickerAccount(wallet, clickerProgram, clickerKey).then((clickerAccount) => {
                set({
                    clickerAccount,
                    toastSuccess: 'Clicker account created!',
                })
            }).catch((e)=>{
                set({
                    toastError: `Error creating: ${e}`,
                })
            }).finally(()=>{
                set({isLoading: false,})
            })
        }
    }

    const clickerClick = () => {
        const { 
            clickerProgram,
            clickerKey,
            wallet,
            isLoading
        } = get();

        if(clickerProgram && clickerKey && wallet && !isLoading){
            set({isLoading: true,})
            clickClickerAccount(wallet, clickerProgram, clickerKey).then((clickerAccount) => {
                set({
                    clickerAccount,
                    toastMessage: `Clicked! ${clickerAccount.points.toNumber()}`,
                })
            }).catch((e)=>{
                set({
                    toastError: `Error clicking: ${e}`,
                })
            }).finally(()=>{
                set({isLoading: false,})
            })
        }
    }

    const clickerUpgrade = (upgrade: number, amount: number = 1) => {
        const { 
            clickerProgram,
            clickerKey,
            wallet,
            isLoading
        } = get();

        if(clickerProgram && clickerKey && wallet && !isLoading){
            set({isLoading: true,})
            upgradeClickerAccount(upgrade, amount, wallet, clickerProgram, clickerKey).then((clickerAccount) => {
                set({
                    clickerAccount,
                    toastMessage: `Upgraded!`,
                })
            }).catch((e)=>{
                set({
                    toastError: `Error upgrading: ${e}`,
                })
            }).finally(()=>{
                set({isLoading: false,})
            })
        }
    }

    return {
        publicKey: null,
        wallet: null,
        connection: null,
        balance: null,
        walletListener: null,
        setState,
        clearState,

        clickerProgram: null,
        clickerKey: null,
        clickerTokenKey: null,
        clickerAccount: null,
        gameAccount: null,
        gameKeypair: null,
        clickerCreate,
        clickerClick,
        clickerUpgrade,

        clearToast,
        isLoading: false,
        toastMessage: null,
        toastError: null,
        toastSuccess: null,
    }
}

export const useAppState = create<CombinedState>()((set, get, slice) => {
    return{
        ...createAppStateSlice(set, get, slice),
    }
});
