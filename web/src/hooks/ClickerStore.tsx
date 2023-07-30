import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { StateCreator, create } from 'zustand';
import {
    CLICKER_GAME_KEY,
    ClickerStruct,
    GameStruct,
    clickClickerAccount,
    depositClickerAccount,
    fetchClickerAccount,
    fetchGameAccount,
    getClickerKey,
    getClickerProgram,
    getClickerTokenKey,
    submitClickerAccount,
    upgradeClickerAccount,
    withdrawClickerAccount,
} from '../controllers/clickerProgram';
import { IDL, Upgrade } from '../controllers/idl/upgrade';
import { grabLocalKeypair } from '../controllers/storage';
import { TerminalColor, TerminalEntry } from '../models/terminal';
import { UPGRADES } from '../models/upgrades';
import { formatNumber } from '../controllers/helpers';
import { getAccount as getTokenAccount } from '@solana/spl-token';

export type CombinedState = AppSlice;

export interface AppSlice {
    publicKey: PublicKey | null;
    wallet: AnchorWallet | null;
    connection: Connection | null;
    setState: (wallet: AnchorWallet, connection: Connection) => void;
    clearState: () => void;

    // ---- WALLET STUFF -----
    walletListener: number | null;
    walletBalance: number | null;
    tokenListener: number | null;
    tokenBalance: number | null;
    playerListener: number | null;
    playerBalance: number | null;

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
    isLoading: boolean;
    lastTerminalEntry: TerminalEntry | null;
}

export const createAppStateSlice: StateCreator<CombinedState, [], [], AppSlice> = (set, get) => {
    const setState = (wallet: AnchorWallet, connection: Connection) => {
        const playerKeypair = grabLocalKeypair(wallet.publicKey);

        const clickerProgram = getClickerProgram(wallet, connection);
        const clickerKey = getClickerKey(clickerProgram, playerKeypair.publicKey);
        const clickerTokenKey = getClickerTokenKey(wallet.publicKey);

        const walletListener = connection.onAccountChange(wallet.publicKey, (walletAccount) => {
            set({
                walletBalance: walletAccount.lamports / LAMPORTS_PER_SOL,
            });
        });

        const tokenListener = connection.onAccountChange(clickerTokenKey, (_) => {
            getTokenAccount(connection, clickerTokenKey)
                .then((tokenAccount) => {
                    set({
                        tokenBalance: Number(tokenAccount.amount),
                    });
                })
                .catch((err) => {
                    set({
                        tokenBalance: null,
                    });
                    console.log(`Error token balance [${err}]`);
                });
        });

        const playerListener = connection.onAccountChange(playerKeypair.publicKey, (walletAccount) => {
            set({
                playerBalance: walletAccount.lamports / LAMPORTS_PER_SOL,
            });
        });

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
            playerListener,
        });

        // ------ ASYNC STUFF ------
        getTokenAccount(connection, clickerTokenKey)
            .then((tokenAccount) => {
                set({
                    tokenBalance: Number(tokenAccount.amount),
                });
            })
            .catch((err) => {
                set({
                    tokenBalance: null,
                });
                console.log(`Error token balance [${err}]`);
            });

        connection
            .getBalance(wallet.publicKey)
            .then((balance) => {
                set({
                    walletBalance: balance / LAMPORTS_PER_SOL,
                });
            })
            .catch((err) => {
                set({
                    walletBalance: null,
                });
                console.log(`Error getting balance [${err}]`);
            });

        connection
            .getBalance(playerKeypair.publicKey)
            .then((balance) => {
                set({
                    playerBalance: balance / LAMPORTS_PER_SOL,
                });
            })
            .catch((err) => {
                set({
                    playerBalance: null,
                });
                console.log(`Error getting balance [${err}]`);
            });

        fetchClickerAccount(clickerProgram, clickerKey)
            .then((clickerAccount) => {
                set({
                    clickerAccount,
                });
            })
            .catch((err) => {
                set({
                    clickerAccount: null,
                });
                console.log(`Account does not exist yet [${err}]`);
            });

        fetchGameAccount(clickerProgram)
            .then((gameAccount) => {
                set({
                    gameAccount,
                });
            })
            .catch((err) => {
                set({
                    gameAccount: null,
                });
                console.log(`Game account is not showing up [${err}]`);
            });
    };

    const clearState = () => {
        const connection = get().connection;
        const walletListener = get().walletListener;
        if (connection && walletListener !== null) {
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
            lastTerminalEntry: null,
            isLoading: false,
        });
    };

    const gameDeposit = () => {
        const { clickerProgram, clickerKey, wallet, isLoading, playerKeypair: gameKeypair } = get();

        if (clickerProgram && clickerKey && wallet && gameKeypair && !isLoading) {
            set({ isLoading: true });

            depositClickerAccount(wallet, gameKeypair, clickerProgram, clickerKey)
                .then((clickerAccount) => {
                    set({
                        clickerAccount,
                        lastTerminalEntry: {
                            type: TerminalColor.system,
                            timestamp: Date.now(),
                            message: 'DEPOSIT: Game on! Your Clicker account is now ready to go!',
                        },
                    });
                })
                .catch((e) => {
                    console.log(`${e}`);

                    set({
                        lastTerminalEntry: {
                            type: TerminalColor.error,
                            timestamp: Date.now(),
                            message: `Error dpositing into your Clicker account ( ${e} )`,
                        },
                    });
                })
                .finally(() => {
                    set({ isLoading: false });
                });
        }
    };

    const gameWithdraw = () => {
        const { clickerProgram, clickerKey, wallet, isLoading, playerKeypair: gameKeypair } = get();

        if (clickerProgram && clickerKey && wallet && gameKeypair && !isLoading) {
            set({ isLoading: true });

            clickClickerAccount(gameKeypair, clickerProgram, clickerKey)
                .then(() => {
                    withdrawClickerAccount(wallet, gameKeypair, clickerProgram, clickerKey)
                        .then((clickerAccount) => {
                            set({
                                clickerAccount: null,
                                lastTerminalEntry: {
                                    type: TerminalColor.system,
                                    timestamp: Date.now(),
                                    message:
                                        'WITHDRAW: Your Coins are now safe in your wallet! Just re-deposit to resume playing!',
                                },
                            });
                        })
                        .catch((e) => {
                            console.log(`${e}`);

                            set({
                                lastTerminalEntry: {
                                    type: TerminalColor.error,
                                    timestamp: Date.now(),
                                    message: `Error withdrawing from your Clicker account ( ${e} )`,
                                },
                            });
                        })
                        .finally(() => {
                            set({ isLoading: false });
                        });
                })
                .catch((e) => {
                    console.log(`${e}`);

                    set({
                        isLoading: false,
                        lastTerminalEntry: {
                            type: TerminalColor.error,
                            timestamp: Date.now(),
                            message: `Error withdrawing ( ${e} )`,
                        },
                    });
                });
        }
    };

    const gameSubmit = () => {
        const { clickerProgram, clickerKey, wallet, isLoading, playerKeypair: gameKeypair } = get();

        if (clickerProgram && clickerKey && wallet && gameKeypair && !isLoading) {
            set({ isLoading: true });

            clickClickerAccount(gameKeypair, clickerProgram, clickerKey)
                .then(() => {
                    submitClickerAccount(wallet, gameKeypair, clickerProgram, clickerKey)
                        .then(() => {
                            clickerProgram.account.game.fetch(CLICKER_GAME_KEY).then((gameAccount) => {
                                set({
                                    gameAccount,
                                });
                            });

                            set({
                                clickerAccount: null,
                                lastTerminalEntry: {
                                    type: TerminalColor.system,
                                    timestamp: Date.now(),
                                    message:
                                        'SUBMIT: You have submitted your Coins to the leaderboard! Amazing job superstar!',
                                },
                            });
                        })
                        .catch((e) => {
                            console.log(`${e}`);

                            set({
                                lastTerminalEntry: {
                                    type: TerminalColor.error,
                                    timestamp: Date.now(),
                                    message: `Error submitting to leaderboard ( ${e} )`,
                                },
                            });
                        })
                        .finally(() => {
                            set({ isLoading: false });
                        });
                })
                .catch((e) => {
                    console.log(`${e}`);

                    set({
                        isLoading: false,
                        lastTerminalEntry: {
                            type: TerminalColor.error,
                            timestamp: Date.now(),
                            message: `Error submitting to leaderboard ( ${e} )`,
                        },
                    });
                });
        }
    };

    const clickerClick = () => {
        const { clickerProgram, clickerAccount, clickerKey, playerKeypair: gameKeypair, isLoading } = get();

        if (clickerProgram && clickerAccount && gameKeypair && clickerKey && !isLoading) {
            set({ isLoading: true });
            clickClickerAccount(gameKeypair, clickerProgram, clickerKey)
                .then((newClickerAccount) => {
                    const lastCoins = clickerAccount.points.toNumber();

                    set({
                        clickerAccount: newClickerAccount,
                        lastTerminalEntry: {
                            type: TerminalColor.normal,
                            timestamp: Date.now(),
                            message: `CLICK: +${formatNumber(newClickerAccount.points.toNumber() - lastCoins)} coin(s)`,
                        },
                    });
                })
                .catch((e) => {
                    set({
                        lastTerminalEntry: {
                            type: TerminalColor.error,
                            timestamp: Date.now(),
                            message: `Error clicking! ( ${e} )`,
                        },
                    });
                })
                .finally(() => {
                    set({ isLoading: false });
                });
        }
    };

    const clickerUpgrade = (upgrade: number, amount: number = 1) => {
        const { clickerProgram, clickerKey, wallet, playerKeypair: gameKeypair, isLoading } = get();

        if (clickerProgram && clickerKey && wallet && gameKeypair && !isLoading) {
            set({ isLoading: true });
            upgradeClickerAccount(upgrade, amount, wallet, gameKeypair, clickerProgram, clickerKey)
                .then((clickerAccount) => {
                    set({
                        clickerAccount,
                        lastTerminalEntry: {
                            type: TerminalColor.normal,
                            timestamp: Date.now(),
                            message: `UPGRADE: +1 ${UPGRADES[upgrade].name} +${UPGRADES[upgrade].coinPerUpgrade} CpS`,
                        },
                    });
                })
                .catch((e) => {
                    set({
                        lastTerminalEntry: {
                            type: TerminalColor.error,
                            timestamp: Date.now(),
                            message: `Error Upgrading! ( ${e} )`,
                        },
                    });
                })
                .finally(() => {
                    set({ isLoading: false });
                });
        }
    };

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
        isLoading: false,
        lastTerminalEntry: null,
    };
};

export const useAppState = create<CombinedState>()((set, get, slice) => {
    return {
        ...createAppStateSlice(set, get, slice),
    };
});
