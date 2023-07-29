import { PublicKey } from "@solana/web3.js";

export interface LeaderboardEntry {
    name: string,
    address: PublicKey,
    coins: number
}