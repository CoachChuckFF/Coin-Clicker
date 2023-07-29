import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import { StateCreator, create } from 'zustand';
import { CLICKER_GAME_KEY, CLICKER_PROGRAM_ID, ClickerStruct, GameStruct, clickClickerAccount, depositClickerAccount, fetchClickerAccount, fetchGameAccount, getClickerKey, getClickerProgram, getClickerTokenKey, submitClickerAccount, upgradeClickerAccount, withdrawClickerAccount } from '../controllers/clickerProgram';
import { IDL, Upgrade } from '../controllers/idl/upgrade';
import { grabLocalKeypair } from '../controllers/storage';

export type CombinedState = AppSlice;


export interface AppSlice {
    publicKey: PublicKey | null;    
    wallet: AnchorWallet | null;
    connection: Connection | null;
    setState: (wallet: AnchorWallet, connection: Connection) => void;
    clearState: () => void;

    // ---- WALLET STUFF -----
    walletListener: number | null;
    walletBalance: number | null,
    tokenListener: number | null,
    tokenBalance: number | null,
    playerListener: number | null,
    playerBalance: number | null,

    // ---- CLICKER STUFF -----
    clickerProgram: Program<Upgrade> | null;
    clickerKey: PublicKey | null;
    clickerTokenKey: PublicKey | null;
    clickerAccount: ClickerStruct | null;
    clickerClick: () => void;
    clickerUpgrade: (upgrade: number) => void;

    // ---- GAME STUFF -----
    playerKeypair: Keypair | null;
    gameWithdraw: () => void;
    gameDeposit: () => void;
    gameSubmit: () => void;
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

        const walletListener = connection.onAccountChange(wallet.publicKey, (walletAccount) => {
            set({
                walletBalance: walletAccount.lamports / LAMPORTS_PER_SOL,
            });
        })

        const tokenListener = connection.onAccountChange(wallet.publicKey, (walletAccount) => {
            set({
                tokenBalance: walletAccount.lamports / LAMPORTS_PER_SOL,
            });
        })

        const playerListener = connection.onAccountChange(playerKeypair.publicKey, (walletAccount) => {
            set({
                playerBalance: walletAccount.lamports / LAMPORTS_PER_SOL,
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
            walletListener,
            tokenListener,
            playerListener
        });

        // ------ ASYNC STUFF ------
        connection.getBalance(wallet.publicKey).then((balance) => {
            set({
                walletBalance: balance / LAMPORTS_PER_SOL,
            });
        }).catch((err) => {
            set({
                walletBalance: null,
            });
            console.log(`Error getting balance [${err}]`);
        })

        connection.getBalance(playerKeypair.publicKey).then((balance) => {
            set({
                playerBalance: balance / LAMPORTS_PER_SOL,
            });
        }).catch((err) => {
            set({
                playerBalance: null,
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
            walletBalance: null,
            playerListener: null,
            playerBalance: null,
            tokenListener: null,
            tokenBalance: null,

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

    const gameSubmit = () => {
        const { 
            clickerProgram,
            clickerKey,
            wallet,
            isLoading,
            playerKeypair: gameKeypair
        } = get();

        if(clickerProgram && clickerKey && wallet && gameKeypair && !isLoading){
            set({isLoading: true,})

            submitClickerAccount(wallet, gameKeypair, clickerProgram, clickerKey).then(() => {

                clickerProgram.account.game.fetch(CLICKER_GAME_KEY).then((gameAccount)=>{
                    set({
                        gameAccount
                    })
                })

                set({
                    clickerAccount : null,
                    toastSuccess: 'Submitted!',
                })
            }).catch((e)=>{
            console.log(`${e}`)

                set({
                    toastError: `Error submitting: ${e}`,
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
        setState,
        clearState,

        walletListener: null,
        walletBalance: null,
        playerListener: null,
        playerBalance: null,
        tokenListener: null,
        tokenBalance: null,

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
        gameSubmit,
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
