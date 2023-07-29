import { Keypair, PublicKey } from "@solana/web3.js";

const STORAGE_BUMP = 'CLICKER_GAME_'

function getLocalKeypairIndex(publicKey: PublicKey){
    return STORAGE_BUMP + publicKey.toString();
}

export function grabLocalKeypair(publicKey: PublicKey){
    let gameKeypair: Keypair;
    const rawLocalKeypair = localStorage.getItem(getLocalKeypairIndex(publicKey));
    try {
        if(!rawLocalKeypair) throw Error('No Keypair');
        console.log(`Found keypair, loading...`);
        gameKeypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(rawLocalKeypair as string)));
    } catch(e){
        console.log(`No keypair found, generating new one...`);
        gameKeypair = Keypair.generate();
        generateNewLocalKeypairUnsafe(publicKey, gameKeypair)
    }

    return gameKeypair;
}

export function generateNewLocalKeypairUnsafe(publicKey: PublicKey, gameKeypair?: Keypair){
    gameKeypair = gameKeypair ?? Keypair.generate();
    localStorage.setItem(getLocalKeypairIndex(publicKey), `[${gameKeypair.secretKey}]`);
}