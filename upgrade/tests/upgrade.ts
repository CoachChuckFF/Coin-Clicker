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
  const wallet = anchor.workspace.Upgrade.provider
    .wallet as anchor.web3.Keypair;

  const mint = anchor.web3.Keypair.generate();

  const ownerVault = token.getAssociatedTokenAddressSync(mint.publicKey, wallet.publicKey);

  const [metadata] = getMetadataKey(mint.publicKey);

  const [game, gameBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("GAME"), wallet.publicKey.toBuffer()],
    program.programId
  );

  const [clicker] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("CLICKER"), game.toBuffer(), wallet.publicKey.toBuffer()],
    program.programId
  );

  // it("Game", async () => {
  //   try {
  //     // Add your test here.
  //     await program.methods
  //       .create(
  //         gameBump,
  //         {
  //           name: "Clicker Coin",
  //           symbol: "COIN",
  //           uri: "https://arweave.net/2gHFk_2OuDvoCBH5ZZv7yGF1wf2Uj-uU-2LgnTreN4o"
  //         }
  //       )
  //       .accounts({
  //         game: game,
  //         owner: wallet.publicKey,
  //         mint: mint.publicKey,
  //         ownerVault: ownerVault,
  //         metadata: metadata,
  //         tokenMetadataProgram: METAPLEX_METADATA_ID,
  //         tokenProgram: token.TOKEN_PROGRAM_ID,
  //         associatedTokenProgram: token.ASSOCIATED_TOKEN_PROGRAM_ID,
  //         systemProgram: anchor.web3.SystemProgram.programId,
  //         rent: anchor.web3.SYSVAR_RENT_PUBKEY,
  //       })
  //       .signers([mint])
  //       .rpc();

  //   } catch (e) {
  //     console.log(e);
  //   }
  // });

  it.only("Start", async () => {
    try {
      // Add your test here.
      await program.methods
        .start()
        .accounts({
          clicker: clicker,
          game: game,
          player: wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
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
          player: wallet.publicKey,
        })
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
        player: wallet.publicKey,
      })
      .rpc();

    const clickerAccount = await program.account.clicker.fetch(clicker);
    console.log(clickerAccount.points.toNumber());
  });

  it("Click Upgraded", async () => {
    const clicks = 10; // Replace this with the number of times you want to run the code

    for (let i = 0; i < clicks; i++) {
      await program.methods
        .click()
        .accounts({
          clicker: clicker,
          player: wallet.publicKey,
        })
        .rpc();

      const clickerAccount = await program.account.clicker.fetch(clicker);
      console.log(clickerAccount.points.toNumber());
    }
  });
});
