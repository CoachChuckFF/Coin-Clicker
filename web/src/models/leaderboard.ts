import { PublicKey } from "@solana/web3.js";

export interface LeaderboardInfo {
    name: string,
    address: PublicKey,
    coins: number
}