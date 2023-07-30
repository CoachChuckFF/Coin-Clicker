Install [Amman](https://amman-explorer.metaplex.com/#/guide)

If you are having problems with M-Series Mac:
https://solana.stackexchange.com/questions/4499/cant-start-solana-test-validator-on-macos-13-0-1/4761#4761
( Make sure to export to your path! )# NAS-Session-3


# Jame's Notes

1. Add dependencies @metaplex-foundation/js and @metaplex-foundation/mpl-token-metadata

`npm install @metaplex-foundation/js @metaplex-foundation/mpl-token-metadata`

2. Add createTokenMetadata function

```
async function createTokenMetadata(
  tokenName: string,
  tokenDescription: string,
  tokenSymbol: string,
  tokenImagePath: string,
  tokenImageFileName: string,
  tokenMint: web3.PublicKey,
  payer: web3.Keypair,
  connection: web3.Connection
) {
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(payer))
    .use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
      })
    )

  const imageBuffer = fs.readFileSync(tokenImagePath)
  const file = toMetaplexFile(imageBuffer, tokenImageFileName)
  const imageUri = await metaplex.storage().upload(file)
  const { uri } = await metaplex.nfts().uploadMetadata({
    name: tokenName,
    description: tokenDescription,
    image: imageUri,
  })

  console.log("Image URI:", imageUri)
  console.log("Metadata URI:", uri)

  const metadataPda = await metaplex.nfts().pdas().metadata({ mint: tokenMint })

  console.log("Metadata PDA:", metadataPda.toBase58())

  const tokenMetadata = {
    name: tokenName,
    symbol: tokenSymbol,
    uri: uri,
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  } as DataV2

  const instruction = createCreateMetadataAccountV3Instruction(
    {
      metadata: metadataPda,
      mint: tokenMint,
      mintAuthority: payer.publicKey,
      payer: payer.publicKey,
      updateAuthority: payer.publicKey,
    },
    {
      createMetadataAccountArgsV3: {
        data: tokenMetadata,
        isMutable: true,
        collectionDetails: null,
      },
    }
  )

  const transaction = new web3.Transaction()
  transaction.add(instruction)

  const transactionSignature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [payer]
  )

  console.log("Metadata transaction:", transactionSignature)
}
```

3. Call it from main

```
async function main() {
  const connection = new web3.Connection(
	  web3.clusterApiUrl("devnet"),
	  "confirmed"
	)
  const user = await initializeKeypair(connection)

  const mint = await createNewMint(
    connection,
    user,
    user.publicKey,
    user.publicKey,
    2
  )

	await createTokenMetadata(
    "NAS Student Token",
    "A test token for learning about token metadata",
    "NAS",
    "assets/nas-token.png",
    "nas-token.png",
    mint,
    user,
    connection
  )
...
}
```