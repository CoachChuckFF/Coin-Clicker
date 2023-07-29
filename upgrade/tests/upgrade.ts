import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Upgrade } from "../target/types/upgrade";
import * as token from "@solana/spl-token"
import * as mpl from "@metaplex-foundation/js"
import { METAPLEX_METADATA_ID, getMetadataKey } from "./helpers";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("upgrade", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Upgrade as Program<Upgrade>;
  const provider = anchor.getProvider();
  const owner = anchor.workspace.Upgrade.provider
    .wallet.payer as anchor.web3.Keypair;

  const player = anchor.web3.Keypair.generate();

  const mint = anchor.web3.Keypair.generate();

  const ownerVault = token.getAssociatedTokenAddressSync(mint.publicKey, owner.publicKey);

  const [game, gameBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("GAME"), mint.publicKey.toBuffer()],
    program.programId
  );

  const [clicker] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("CLICKER"), game.toBuffer(), player.publicKey.toBuffer()],
    program.programId
  );

  before(async()=>{
    // await provider.connection.requestAirdrop(player.publicKey, anchor.web3.LAMPORTS_PER_SOL);
    await token.createMint(provider.connection, owner, owner.publicKey, owner.publicKey, 0, mint)
  })

  it("Game", async () => {
    try {
      // Add your test here.
      await program.methods
        .create(
          gameBump,
        )
        .accounts({
          game: game,
          owner: owner.publicKey,
          mint: mint.publicKey,
          tokenProgram: token.TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .rpc();

        console.log("Game: " + game.toString());
        console.log("Mint: " + mint.publicKey.toString());

    } catch (e) {
      console.log(e);
    }
  });

  it("Deposit", async () => {
    try {
      // Add your test here.
      await program.methods
        .deposit()
        .accounts({
          game: game,
          clicker: clicker,
          mint: mint.publicKey,
          ownerVault: ownerVault,
          player: player.publicKey,
          owner: owner.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          tokenProgram: token.TOKEN_PROGRAM_ID,
          associatedTokenProgram: token.ASSOCIATED_TOKEN_PROGRAM_ID
        })
        .signers([player])
        .rpc();

    } catch (e) {
      console.log(e);
    }
  });

  it("Click", async () => {
    const clicks = 20; // Replace this with the number of times you want to run the code

    for (let i = 0; i < clicks; i++) {
      await program.methods
        .click()
        .accounts({
          clicker: clicker,
          player: player.publicKey,
        })
        .signers([player])
        .rpc();

      const clickerAccount = await program.account.clicker.fetch(clicker);
      console.log(clickerAccount.points.toNumber());
    }
  });

  it("Upgrade", async () => {
    await program.methods
      .upgrade(0, 1)
      .accounts({
        clicker: clicker,
        player: player.publicKey,
      })
      .signers([player])
      .rpc();

    const clickerAccount = await program.account.clicker.fetch(clicker);
    console.log(clickerAccount.points.toNumber());
  });

  it("Withdraw", async () => {

    try {
      await program.methods
        .withdraw()
        .accounts({
          game: game,
          clicker: clicker,
          mint: mint.publicKey,
          ownerVault: ownerVault,
          player: player.publicKey,
          owner: owner.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          tokenProgram: token.TOKEN_PROGRAM_ID,
          associatedTokenProgram: token.ASSOCIATED_TOKEN_PROGRAM_ID
        })
        .signers([player])
        .rpc();

    } catch(e){
      console.log(e)
    }


  });

  it("Deposit", async () => {

    try {
      await program.methods
        .deposit()
        .accounts({
          game: game,
          clicker: clicker,
          mint: mint.publicKey,
          ownerVault: ownerVault,
          player: player.publicKey,
          owner: owner.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          tokenProgram: token.TOKEN_PROGRAM_ID,
          associatedTokenProgram: token.ASSOCIATED_TOKEN_PROGRAM_ID
        })
        .signers([player])
        .rpc();

      const clickerAccount = await program.account.clicker.fetch(clicker);
      console.log(clickerAccount.points.toNumber());
    } catch(e){
      console.log(e)
    }


  });


  it("Click Upgraded", async () => {
    await sleep(5000);
    await program.methods
      .click()
      .accounts({
        clicker: clicker,
        player: player.publicKey,
      })
      .signers([player])
      .rpc();

    const clickerAccount = await program.account.clicker.fetch(clicker);
    console.log(clickerAccount.points.toNumber());
  });

  it("Submit", async () => {

    try {
      await program.methods
        .submit()
        .accounts({
          game: game,
          clicker: clicker,
          player: player.publicKey,
          owner: owner.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId
        })
        .signers([player])
        .rpc();

      const gameAccount = await program.account.game.fetch(game);
      console.log(gameAccount.leaderboards);
    } catch(e){
      console.log(e)
    }


  });
});
