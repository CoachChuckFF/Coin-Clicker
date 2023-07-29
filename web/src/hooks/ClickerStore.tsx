import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import { StateCreator, create } from 'zustand';
import { CLICKER_PROGRAM_ID, ClickerStruct, GameStruct, clickClickerAccount, depositClickerAccount, fetchClickerAccount, fetchGameAccount, getClickerKey, getClickerProgram, getClickerTokenKey, upgradeClickerAccount, withdrawClickerAccount } from '../controllers/clickerProgram';
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
    clickerClick: () => void;
    clickerUpgrade: (upgrade: number) => void;

    // ---- GAME STUFF -----
    playerKeypair: Keypair | null;
    // newKeypair: () => void;
    gameWithdraw: () => void;
    gameDeposit: () => void;
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

        const playerKeypair = grabLocalKeypair(wallet.publicKey);

        const clickerProgram = getClickerProgram(wallet, connection);
        const clickerKey = getClickerKey(
            clickerProgram,
            playerKeypair.publicKey
        );
        const clickerTokenKey = getClickerTokenKey(wallet.publicKey);

        const walletListener = connection.onAccountChange(playerKeypair.publicKey, (walletAccount) => {
            set({
                balance: walletAccount.lamports / LAMPORTS_PER_SOL,
            });
        })

        set({
            wallet,
            playerKeypair: playerKeypair,
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
            playerKeypair: null,
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

    const gameDeposit = () => {
        const { 
            clickerProgram,
            clickerKey,
            wallet,
            isLoading,
            playerKeypair: gameKeypair
        } = get();

        if(clickerProgram && clickerKey && wallet && gameKeypair && !isLoading){
            set({isLoading: true,})

            depositClickerAccount(wallet, gameKeypair, clickerProgram, clickerKey).then((clickerAccount) => {

                set({
                    clickerAccount,
                    toastSuccess: 'Clicker account created!',
                })
            }).catch((e)=>{
            console.log(`${e}`)

                set({
                    toastError: `Error creating: ${e}`,
                })
            }).finally(()=>{

                set({isLoading: false,})
            })
        }
    }

    const gameWithdraw = () => {
        const { 
            clickerProgram,
            clickerKey,
            wallet,
            isLoading,
            playerKeypair: gameKeypair
        } = get();

        if(clickerProgram && clickerKey && wallet && gameKeypair && !isLoading){
            set({isLoading: true,})

            withdrawClickerAccount(wallet, gameKeypair, clickerProgram, clickerKey).then((clickerAccount) => {

                set({
                    clickerAccount,
                    toastSuccess: 'Clicker account created!',
                })
            }).catch((e)=>{
            console.log(`${e}`)

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
            clickerAccount,
            clickerKey,
            playerKeypair: gameKeypair,
            isLoading
        } = get();

        if(clickerProgram && clickerAccount && gameKeypair && clickerKey && !isLoading){
            set({isLoading: true,})
            clickClickerAccount(gameKeypair, clickerProgram, clickerKey).then((clickerAccount) => {
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
            playerKeypair: gameKeypair,
            isLoading
        } = get();

        if(clickerProgram && clickerKey && wallet && gameKeypair && !isLoading){
            set({isLoading: true,})
            upgradeClickerAccount(upgrade, amount, wallet, gameKeypair, clickerProgram, clickerKey).then((clickerAccount) => {
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
        playerKeypair: null,
        clickerClick,
        clickerUpgrade,
        gameDeposit,
        gameWithdraw,
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
