import { Connection, PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { IDL, Upgrade } from "../controllers/idl/upgrade";
import { Program, IdlAccounts, AnchorProvider, BN } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";


export const CLICKER_PROGRAM_ID = new PublicKey("67714KFVqCYNTu7NUCjtMuid55dKutnXmjXpeqJEwmpu");

export type ClickerStruct = IdlAccounts<Upgrade>["clicker"];

export function getClickerKey(program: Program<Upgrade>, player: PublicKey){
    const [clickerKey] = PublicKey.findProgramAddressSync(
        [Buffer.from("CLICKER"), player.toBuffer()],
        program.programId
    )

    return clickerKey;
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
        new BN(upgrade),
        new BN(amount),
    )
        .accounts({
        clicker: clickerKey,
        player: program.provider.publicKey,
    }).instruction()

    await sendAndConfirmIx(wallet, program.provider.connection, ix);

    return fetchClickerAccount(program, clickerKey);
}