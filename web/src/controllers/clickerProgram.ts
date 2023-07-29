import { Connection, Keypair, PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram,  Transaction, TransactionInstruction, } from "@solana/web3.js";
import { Program, IdlAccounts, AnchorProvider, BN } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { IDL, Upgrade } from "../controllers/idl/upgrade";
import { getAssociatedTokenAddressSync} from "@solana/spl-token";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";


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

async function sendAndConfirmIx(wallet: AnchorWallet, player: Keypair, connection: Connection, ix: TransactionInstruction){

    const tx = new Transaction().add(ix);

    tx.recentBlockhash = (
        await connection.getLatestBlockhash("singleGossip")
    ).blockhash;
    tx.feePayer = wallet.publicKey;
    
    console.log("Signing")

    tx.partialSign(player);
    const sigTx = await wallet.signTransaction(tx);
    const rawTransaction = sigTx.serialize({ requireAllSignatures: false });

    let txSig = '';
    console.log("Sending")
    try{
        txSig = await connection.sendRawTransaction(rawTransaction, { skipPreflight: true });

    } catch (e){
        console.log(`Sending Error ${e}`)
    }


    const latestBlockHash = await connection.getLatestBlockhash();

    console.log("Checking")


    try {
        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: txSig,
        })  
    } catch(e){
        console.log(`Confirm Error ${e}`)
    }


    console.log("Done")

    return txSig
  }

  async function sendAndConfirmKeypairIx(keypair: Keypair, connection: Connection, ix: TransactionInstruction){

    const tx = new Transaction().add(ix);

    tx.recentBlockhash = (
        await connection.getLatestBlockhash("singleGossip")
    ).blockhash;

    tx.feePayer = keypair.publicKey;

    const wallet = new NodeWallet(keypair);
    const sigTx = await wallet.signTransaction(tx);

    const rawTransaction = sigTx.serialize();
    const txSig = await connection.sendRawTransaction(rawTransaction, {skipPreflight: true});

    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txSig,
    })  

    return txSig
  }

export async function depositClickerAccount(
    wallet: AnchorWallet, 
    player: Keypair, 
    program: Program<Upgrade>, 
    clickerKey?: PublicKey,
    ownerVault?: PublicKey,
){

    if (!program) throw new Error("Needs a program");

    clickerKey = clickerKey ?? getClickerKey(program, player.publicKey);
    ownerVault = ownerVault ?? getClickerTokenKey(wallet.publicKey);

    const ix = await program.methods.deposit()
    .accounts({
        game: CLICKER_GAME_KEY,
        clicker: clickerKey,
        mint: CLICKER_MINT_KEY,
        ownerVault: ownerVault,
        player: player.publicKey,
        owner: wallet.publicKey,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
      })
      .signers([player])
      .instruction();

    await sendAndConfirmIx(wallet, player, program.provider.connection, ix);

    return fetchClickerAccount(program, clickerKey);
}

export async function withdrawClickerAccount(
    wallet: AnchorWallet, 
    player: Keypair, 
    program: Program<Upgrade>, 
    clickerKey?: PublicKey,
    ownerVault?: PublicKey,
){

    if (!program) throw new Error("Needs a program");

    clickerKey = clickerKey ?? getClickerKey(program, player.publicKey);
    ownerVault = ownerVault ?? getClickerTokenKey(wallet.publicKey);

    const ix = await program.methods.withdraw()
    .accounts({
        game: CLICKER_GAME_KEY,
        clicker: clickerKey,
        mint: CLICKER_MINT_KEY,
        ownerVault: ownerVault,
        player: player.publicKey,
        owner: wallet.publicKey,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
      })
      .signers([player])
      .instruction();

    await sendAndConfirmIx(wallet, player, program.provider.connection, ix);

    return fetchClickerAccount(program, clickerKey);
}

export async function clickClickerAccount(player: Keypair, program: Program<Upgrade>, clickerKey?: PublicKey){

    if (!program) throw new Error("Needs a program");
    clickerKey = clickerKey ?? getClickerKey(program, player.publicKey);

    const ix = await program.methods.click().accounts({
        clicker: clickerKey,
        player: player.publicKey,
    }).signers([player]).instruction()

    await sendAndConfirmKeypairIx(player, program.provider.connection, ix);

    return fetchClickerAccount(program, clickerKey);
}

export async function upgradeClickerAccount(upgrade: number, amount: number, wallet: AnchorWallet, player: Keypair, program: Program<Upgrade>, clickerKey: PublicKey){
    if (!program) throw new Error("Needs a program");
    clickerKey = clickerKey ?? getClickerKey(program, player.publicKey);

    const ix = await program.methods.upgrade(
        upgrade,
        amount,
    ).accounts({
        clicker: clickerKey,
        player: player.publicKey,
    }).signers([player]).instruction()

    await sendAndConfirmKeypairIx(player, program.provider.connection, ix);

    return fetchClickerAccount(program, clickerKey);
}
