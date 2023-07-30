import { initializeKeypair } from "./initializeKeypair"
import * as web3 from "@solana/web3.js"
import * as token from "@solana/spl-token"
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { DataV2, createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";
import { CLICKER_PROGRAM_ID, getClickerProgram } from "./clicker";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { IDL, Upgrade } from "./upgrade";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

// ------------------ MAIN --------------------------------------

async function main() {
    // Talk about RPC Url and Commitment
    const connection = new web3.Connection(process.env.RPC as string);
    const myWallet = await initializeKeypair(connection);
    const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(myWallet))

    const program = await getClickerProgram(myWallet, connection);

    const mintKeypair = web3.Keypair.generate();
    console.log(`Mint Keypair: [${mintKeypair.secretKey.toString()}]`);
    console.log(`Mint Address: ${mintKeypair.publicKey.toString()}`);

    // 1. Create New Mint Account
    const mintAccount = await token.createMint(
        connection,
        myWallet,
        myWallet.publicKey,
        myWallet.publicKey,
        0,
        mintKeypair
    );

    const metadataAccount = await metaplex.nfts().pdas().metadata({ mint: mintAccount })

    const tokenMetadata = {
        name: "Coin",
        symbol: 'CC',
        uri: 'https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/coin-metadata.json',
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null,
      } as DataV2

    const ix = createCreateMetadataAccountV3Instruction({
        metadata: metadataAccount,
        mint: mintAccount,
        mintAuthority: myWallet.publicKey,
        payer: myWallet.publicKey,
        updateAuthority: myWallet.publicKey
    },
    {
        createMetadataAccountArgsV3: {
          data: tokenMetadata,
          isMutable: true,
          collectionDetails: null,
        },
      });
    
      const transaction = new web3.Transaction()
      transaction.add(ix)
    
      const transactionSignature = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [myWallet]
      )

      // GAME STUFF

      const [game, gameBump] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("GAME"), mintKeypair.publicKey.toBuffer()],
        program.programId
      );
      
      await program.methods
        .create(
          gameBump,
        )
        .accounts({
          game: game,
          owner: myWallet.publicKey,
          mint: mintKeypair.publicKey,
          tokenProgram: token.TOKEN_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();

        console.log("Game: " + game.toString());
        console.log("Mint: " + mintKeypair.publicKey.toString());
        console.log(`Mint Keypair: [${mintKeypair.secretKey.toString()}]`);      
}

main()
    .then(() => {
        console.log("Finished successfully")
        process.exit(0)
    })
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
