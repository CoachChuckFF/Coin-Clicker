
import * as web3 from "@solana/web3.js"
import { IdlAccounts, Program, AnchorProvider, setProvider } from "@coral-xyz/anchor";
import { IDL, Upgrade } from './upgrade'
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

export type ClickerStruct = IdlAccounts<Upgrade>["clicker"];
export type GameStruct = IdlAccounts<Upgrade>["game"];

export const CLICKER_PROGRAM_ID = new web3.PublicKey("67714KFVqCYNTu7NUCjtMuid55dKutnXmjXpeqJEwmpu")

export function getGameKey(program: Program<Upgrade>, mint: web3.Keypair){
    const [gameKey] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("GAME"), mint.publicKey.toBuffer()],
        program.programId
    )

    return gameKey;
}

export function getClickerKey(program: Program<Upgrade>, game: web3.PublicKey, player: web3.PublicKey){
    const [clickerKey] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("CLICKER"), game.toBuffer(), player.toBuffer()],
        program.programId
    )

    return clickerKey;
}

export async function getClickerProgram(keypair: web3.Keypair, connection: web3.Connection){
    const programProvider = new AnchorProvider(
        connection,
        new NodeWallet(keypair),
        AnchorProvider.defaultOptions()
      );
      const programIdl = await Program.fetchIdl<Upgrade>(CLICKER_PROGRAM_ID, programProvider);
      return new Program<Upgrade>(programIdl as any, CLICKER_PROGRAM_ID, programProvider);
}