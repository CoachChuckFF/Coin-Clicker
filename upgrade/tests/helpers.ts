import * as anchor from "@coral-xyz/anchor";


export const METAPLEX_METADATA_ID = new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")

export function getMetadataKey(mint: anchor.web3.PublicKey) {
    return anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('metadata'), METAPLEX_METADATA_ID.toBuffer(), mint.toBuffer()],
      METAPLEX_METADATA_ID
    );
  }
  
  export function getMetadataEditionKey(mint: anchor.web3.PublicKey) {
    return anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from('metadata'), METAPLEX_METADATA_ID.toBuffer(), mint.toBuffer(), Buffer.from('edition')],
      METAPLEX_METADATA_ID
    );
  }