import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import { StateCreator, create } from 'zustand';
import { CLICKER_PROGRAM_ID, ClickerStruct, clickClickerAccount, createClickerAccount, fetchClickerAccount, getClickerKey, getClickerProgram, upgradeClickerAccount } from '../controllers/clickerProgram';
import { IDL, Upgrade } from '../controllers/idl/upgrade';

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
    clickerAccount: ClickerStruct | null;
    clickerCreate: () => void;
    clickerClick: () => void;
    clickerUpgrade: (upgrade: number) => void;

    // ---- Toast -----
    clearToast: () => void;
    isLoading: boolean;
    toastMessage: string | null;
    toastError: string | null;
    toastSuccess: string | null;

}

export const createAppStateSlice: StateCreator<CombinedState, [], [], AppSlice> = (set, get) => {

    const setState = (wallet: AnchorWallet, connection: Connection) => {
        const clickerProgram = getClickerProgram(wallet, connection);
        const clickerKey = getClickerKey(
            clickerProgram,
            wallet.publicKey
        );

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

    const clickerUpgrade = (upgrade: number) => {
        const { 
            clickerProgram,
            clickerKey,
            wallet,
            isLoading
        } = get();

        if(clickerProgram && clickerKey && wallet && !isLoading){
            set({isLoading: true,})
            upgradeClickerAccount(upgrade, 1, wallet, clickerProgram, clickerKey).then((clickerAccount) => {
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
        clickerAccount: null,
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

// import create from 'zustand';
// import { AppState, createAppStateSlice } from './create-app-state-slice';

// export type CombinedState = PlayerSlice &
//   AppState &
//   CurrentCreatorSlice &
//   CreateARMediaSlice &
//   CreatorChannelSlice &
//   EditARMediaSlice &
//   EditARCreatorSlice &
//   AssetSlice &
//   CurrencySlice &
//   MediaModalSlice &
//   ConfettiSlice;

// export const useAppState = create<CombinedState>()((set, get, slice) => {
//   return {
//     ...createAppStateSlice(set, get, slice),
//     ...createCreatorChannelSlice(set, get, slice),
//     ...createCurrentCreatorSlice(set, get, slice),
//     ...createPlayerSlice(set, get, slice),
//     ...createCreateARMediaSlice(set, get, slice),
//     ...createEditARMediaSlice(set, get, slice),
//     ...createEditARCreatorSlice(set, get, slice),
//     ...createAssetSlice(set, get, slice),
//     ...createCurrencySlice(set, get, slice),
//     ...createMediaModalSlice(set, get, slice),
//     ...createConfettiSlice(set, get, slice)
//   };
// });

// import { WebBundlr } from '@bundlr-network/client';
// import { getBurnerProgram, getDrmProgram, getProgramId } from '@excalibur/drm';
// import { WalletContextState } from '@solana/wallet-adapter-react';
// import { Connection, LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionSignature } from '@solana/web3.js';
// import bs58 from 'bs58';
// // import Gun from 'gun';
// import { DrmApiSolanaImpl } from 'src/controllers/drm-api/drm-api-solana-impl';
// import { getConfig } from 'src/controllers/utils';
// import { checkIfWalletIsInstalled } from 'src/controllers/utils/check-if-installed';
// import { GoogleActionType, reportGoogleEvent } from 'src/views/modules/app/GoogleAnalytics';
// import naclUtil from 'tweetnacl-util';
// import { StateCreator } from 'zustand';
// import { CombinedState } from './use-app-state';

// import { DRMProgram, SolanaNetwork } from '@excalibur/drm';
// import { ClientSubscriptionId, Commitment } from '@solana/web3.js';
// import { DrmApi } from 'src/controllers/drm-api';

// export enum ExcaliburWalletState {
//   noWallets = 'No Wallets Installed',
//   notConnected = 'Not Connected',
//   poor = 'Poor',
//   operational = 'Operational'
// }

// export interface TestAppUrlParams {
//   noWallet: string | null;
//   airdrop: string | null;
//   airdropTo: string | null;
// }

// export interface AppState {
//   publicKey: PublicKey | null;
//   balance: number | null;
//   balanceSub: ClientSubscriptionId | null;
//   connection: Connection;
//   network: SolanaNetwork;
//   defaultCommitment: Commitment;
//   walletContext: WalletContextState | null;
//   program: DRMProgram;
//   drmApi: DrmApi;
//   bundlr: WebBundlr | null;

//   walletState: ExcaliburWalletState;
//   setDetectedWallets: (walletContext: WalletContextState) => void;

//   connectionPopupOpen: number;
//   setConnectionPopupOpen: (isOpen: number) => void;
//   openConnectionPopup: () => void;

//   connectWallet: (walletContext: WalletContextState) => Promise<void>;
//   disconnectWallet: () => Promise<void>;

//   updateBalance(): Promise<number>;

//   signAndSendTransaction(transaction: Transaction): Promise<TransactionSignature>;

//   signTransaction(transaction: Transaction): Promise<Transaction>;

//   signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;

//   signMessage(message: string): Promise<string>;
// }

// const programId = getProgramId();

// const { solanaRpcTarget, solanaNetwork, defaultCommitment, bundlrRpcTarget } = getConfig();

// const connection = new Connection(solanaRpcTarget, {
//   commitment: defaultCommitment
//   // confirmTransactionInitialTimeout: 20000
// });

// const cascadeLoginState = async get => {
//   await get().playerCurrentCreatorChanged();
//   await get().currentCreatorCurrentCreatorChanged();
//   await get().creatorChannelCurrentCreatorChanged();
// };

// export const createAppStateSlice: StateCreator<CombinedState, [], [], AppState> = (set, get) => {
//   const burnerProgram = getBurnerProgram(connection, { commitment: defaultCommitment }, programId);
//   const burnerDrmApi = new DrmApiSolanaImpl(burnerProgram, connection);

//   return {
//     publicKey: null,
//     balance: null,
//     balanceSub: null,
//     connection: connection,
//     network: solanaNetwork,
//     defaultCommitment: defaultCommitment,
//     provider: null,
//     program: burnerProgram,
//     drmApi: burnerDrmApi,
//     bundlr: null,
//     walletContext: null,

//     walletState: ExcaliburWalletState.notConnected,
//     setDetectedWallets: (walletContext: WalletContextState) => {
//       if (!checkIfWalletIsInstalled(walletContext)) {
//         set({ walletState: ExcaliburWalletState.noWallets });
//       }
//     },

//     connectionPopupOpen: 0,
//     setConnectionPopupOpen: (isOpen: number) => {
//       set({ connectionPopupOpen: isOpen });
//     },
//     openConnectionPopup: () => {
//       set({ connectionPopupOpen: get().connectionPopupOpen + 1 });
//     },

//     connectWallet: async (walletContext: WalletContextState) => {
//       const connectionPopupOpen = 0;
//       const programId = getProgramId();
//       const publicKey = walletContext.publicKey;
//       const balance = await connection.getBalance(publicKey);

//       const bundlr = new WebBundlr(bundlrRpcTarget, 'solana', walletContext, {
//         providerUrl: get().connection.rpcEndpoint
//       });
//       await bundlr.ready();

//       const walletState = balance === 0 ? ExcaliburWalletState.poor : ExcaliburWalletState.operational;

//       const balanceSub = await get().connection.onAccountChange(
//         publicKey,
//         change => {
//           const balance = change.lamports / LAMPORTS_PER_SOL;
//           if (get().balance !== balance) {
//             set({
//               walletState: balance === 0 ? ExcaliburWalletState.poor : ExcaliburWalletState.operational,
//               balance: change.lamports / LAMPORTS_PER_SOL
//             });
//           }
//         },
//         defaultCommitment
//       );
//       const program = getDrmProgram(
//         publicKey,
//         connection,
//         get().signTransaction,
//         get().signAllTransactions,
//         {
//           commitment: defaultCommitment
//         },
//         programId
//       );
//       set({
//         walletState,
//         connectionPopupOpen,
//         walletContext,
//         publicKey,
//         balanceSub,
//         program,
//         bundlr,
//         drmApi: new DrmApiSolanaImpl(program, connection),
//         balance: balance / LAMPORTS_PER_SOL
//       });

//       // Google Anaylitics
//       reportGoogleEvent({
//         action: GoogleActionType.connectWallet,
//         params: {
//           user_wallet: publicKey.toString()
//         }
//       });

//       await cascadeLoginState(get);
//     },

//     disconnectWallet: async () => {
//       if (get().walletContext && get().walletContext.disconnect) {
//         await get().walletContext.disconnect();
//       }

//       if (get().balanceSub) {
//         await get().connection.removeAccountChangeListener(get().balanceSub);
//       }

//       set({
//         walletState: ExcaliburWalletState.notConnected,
//         balanceSub: null,
//         walletContext: null,
//         publicKey: null,
//         balance: null,
//         program: burnerProgram,
//         drmApi: burnerDrmApi
//       });
//       await cascadeLoginState(get);
//     },

//     async signAllTransactions(transactions: Transaction[]): Promise<Transaction[]> {
//       return await get().walletContext.signAllTransactions(transactions);
//     },

//     async signAndSendTransaction(transaction: Transaction): Promise<TransactionSignature> {
//       return await get().walletContext.sendTransaction(transaction, get().connection);
//     },

//     async signMessage(message: string): Promise<string> {
//       const rawMessageBinary = naclUtil.decodeUTF8(message);
//       const signedMessage = await get().walletContext.signMessage(rawMessageBinary);
//       return bs58.encode(signedMessage);
//     },

//     async signTransaction(transaction: Transaction): Promise<Transaction> {
//       return await get().walletContext.signTransaction(transaction);
//     },

//     async updateBalance(): Promise<number> {
//       const balance = await connection.getBalance(get().publicKey);
//       return balance / LAMPORTS_PER_SOL;
//     }
//   };
// };

