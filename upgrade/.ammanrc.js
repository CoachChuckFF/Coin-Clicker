module.exports = {
  validator: {
    killRunningValidators: true,
    resetLedger: true,
    ledgerDir: "./.ledger",
    commitment: "confirmed",
    // By default, Amman will pull the account data from the accountsCluster (can be overridden on a per account basis)
    // accountsCluster: "https://api.metaplex.solana.com",
    accounts: [
      {
        label: "Token Metadata Program",
        accountId: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
        // marking executable as true will cause Amman to pull the executable data account as well automatically
        executable: true,
      },
      {
        label: "ATA",
        accountId: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        // marking executable as true will cause Amman to pull the executable data account as well automatically
        executable: true,
      },
      {
        label: "Token",
        accountId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        // marking executable as true will cause Amman to pull the executable data account as well automatically
        executable: true,
      },
    ],
  },
}
