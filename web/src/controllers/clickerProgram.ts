import { Connection, PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { Program, IdlAccounts, AnchorProvider, BN } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { IDL, Upgrade } from "../controllers/idl/upgrade";
import { getAssociatedTokenAddressSync} from "@solana/spl-token";


export const CLICKER_PROGRAM_ID = new PublicKey(process.env.REACT_APP_PROGRAM_KEY as string);
export const CLICKER_GAME_KEY = new PublicKey(process.env.REACT_APP_GAME_KEY as string);
export const CLICKER_MINT_KEY = new PublicKey(process.env.REACT_APP_MINT_KEY as string);


export type ClickerStruct = IdlAccounts<Upgrade>["clicker"];
export type GameStruct = IdlAccounts<Upgrade>["game"];

export function getClickerKey(program: Program<Upgrade>, player: PublicKey){
    const [clickerKey] = PublicKey.findProgramAddressSync(
        [Buffer.from("CLICKER"), CLICKER_GAME_KEY.toBuffer(), player.toBuffer()],
        program.programId
    )

    return clickerKey;
}

export function getClickerTokenKey(player: PublicKey){

    return getAssociatedTokenAddressSync(CLICKER_MINT_KEY, player);
}

export function getClickerProgram(wallet: AnchorWallet, connection: Connection){
    const programProvider = new AnchorProvider(
        connection,
        wallet,
        AnchorProvider.defaultOptions()
      );
    return new Program<Upgrade>(
        IDL,
        CLICKER_PROGRAM_ID,
        programProvider
      );
}

export function fetchClickerAccount(program: Program<Upgrade>, clickerKey: PublicKey){

    return program.account.clicker.fetch(clickerKey);
}

export function fetchGameAccount(program: Program<Upgrade>){

    return program.account.game.fetch(CLICKER_GAME_KEY);
}

async function sendAndConfirmIx(wallet: AnchorWallet, connection: Connection, ix: TransactionInstruction){

    const tx = new Transaction().add(ix);

    tx.recentBlockhash = (
        await connection.getLatestBlockhash("singleGossip")
    ).blockhash;

    tx.feePayer = wallet.publicKey;

    const sigTx = await wallet.signTransaction(tx);

    const rawTransaction = sigTx.serialize();
    const txSig = await connection.sendRawTransaction(rawTransaction);

    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txSig,
    })  

    return txSig
  }

export async function createClickerAccount(wallet: AnchorWallet, program: Program<Upgrade>, clickerKey: PublicKey){

    if (!program) throw new Error("Needs a program");
    if (!clickerKey) throw new Error("Needs a clicker key");

    const ix = await program.methods.start().accounts({
        clicker: clickerKey,
        game: CLICKER_GAME_KEY,
        player: program.provider.publicKey,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY
    }).instruction()

    await sendAndConfirmIx(wallet, program.provider.connection, ix);

    return fetchClickerAccount(program, clickerKey);
}

export async function clickClickerAccount(wallet: AnchorWallet, program: Program<Upgrade>, clickerKey: PublicKey){

    if (!program) throw new Error("Needs a program");
    if (!clickerKey) throw new Error("Needs a clicker key");

    const ix = await program.methods.click().accounts({
        clicker: clickerKey,
        player: program.provider.publicKey,
    }).instruction()

    await sendAndConfirmIx(wallet, program.provider.connection, ix);

    return fetchClickerAccount(program, clickerKey);
}

export async function upgradeClickerAccount(upgrade: number, amount: number, wallet: AnchorWallet, program: Program<Upgrade>, clickerKey: PublicKey){
    const ix = await program.methods.upgrade(
        upgrade, amount
    )
        .accounts({
        clicker: clickerKey,
        player: program.provider.publicKey,
    }).instruction()

    await sendAndConfirmIx(wallet, program.provider.connection, ix);

    return fetchClickerAccount(program, clickerKey);
}

export async function withdrawClickerAccount(upgrade: number, amount: number, wallet: AnchorWallet, program: Program<Upgrade>, clickerKey: PublicKey){
    const ix = await program.methods.upgrade(
        upgrade, amount
    )
        .accounts({
        clicker: clickerKey,
        player: program.provider.publicKey,
    }).instruction()

    await sendAndConfirmIx(wallet, program.provider.connection, ix);

    return fetchClickerAccount(program, clickerKey);
}