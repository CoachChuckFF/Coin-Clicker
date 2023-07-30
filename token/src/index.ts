import { initializeKeypair } from "./initializeKeypair"
import * as web3 from "@solana/web3.js"
import * as token from "@solana/spl-token"
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { DataV2, createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";

// ------------------ CONFIG --------------------------------------

const IS_DEVNET = true; // Set to false if you use `amman start`
const RPC_URL = IS_DEVNET ? web3.clusterApiUrl('devnet') : 'http://127.0.0.1:8899';

// ------------------ HELPERS --------------------------------------

type LINK_TYPE = 'tx' | 'address';
function printLink(type: LINK_TYPE, data: string | web3.PublicKey){
    return `https://amman-explorer.metaplex.com/#/${type}/${data.toString()}${IS_DEVNET ? '?cluster=devnet' : ''}`;
}

async function keypress(){
    console.log('\nPress a key to continue...')
    process.stdin.setRawMode(true)
    return new Promise<void>(resolve => process.stdin.once('data', () => {
      process.stdin.setRawMode(false)
      resolve()
    }))
  }


// ------------------ MAIN --------------------------------------

async function main() {
    // Talk about RPC Url and Commitment
    const connection = new web3.Connection(RPC_URL);
    const myWallet = await initializeKeypair(connection);
    const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(myWallet))

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

    console.log("metadata ", printLink('tx', transactionSignature))
    console.log("metadata account", printLink('address', metadataAccount))
    
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
