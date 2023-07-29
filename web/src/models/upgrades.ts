import { ClickerStruct } from "../controllers/clickerProgram"

export interface UpgradeType {
    name: string,
    description: string,
    image: string,

    upgradeIndex: number,
    baseCost: number,
    coinPerUpgrade: number,
}

export const UPGRADES: UpgradeType[] = [
    {
        name: "Sea Rovers",
        description: "",
        image: "https://arweave.net/htWyvQeoaciETL3n1BZE8xWV-hhWnY-4znXhk2ZsfAo",
    
        upgradeIndex: 0,
        baseCost: 15,
        coinPerUpgrade: 1,
    },
    {
        name: "Fractals",
        description: "",
        image: "https://storage.googleapis.com/fractal-launchpad-public-assets/fractals/img/hexa_010.jpg",

        upgradeIndex: 1,
        baseCost: 100,
        coinPerUpgrade: 3,
    },
    {
        name: "Pesky Penguins",
        description: "",
        image: "https://cdn.pesky-penguins.com/artwork/7119-pixel.png",
    
        upgradeIndex: 2,
        baseCost: 1100,
        coinPerUpgrade: 8,
    },
    {
        name: "Shadowy Super Coder",
        description: "",
        image: "https://shdw-drive.genesysgo.net/8yHTE5Cz3hwcTdghynB2jgLuvKyRgKEz2n5XvSiXQabG/3779.png",
    
    
        upgradeIndex: 3,
        baseCost: 12_000,
        coinPerUpgrade: 47,
    },
    {

        name: "NEC",
        description: "",
        image: "https://shdw-drive.genesysgo.net/GWVKh2BgSu5ska9ADqhwfsjUrd23wHwNcg4if54NBJv/Crash%20Dummy.png",
    
        upgradeIndex: 4,
        baseCost: 130_000,
        coinPerUpgrade: 260,
    },
    {
        name: "Claynos",
        description: "",
        image: "https://nftstorage.link/ipfs/bafybeiacpd6pdpa2bpzm62kr3gtyvv7zyujv7fz63qyjporqwzbfgtfimm/4091.png",
    
        upgradeIndex: 5,
        baseCost: 1_400_000,
        coinPerUpgrade: 1400,
    },
    {
        name: "Dronies",
        description: "",
        image: "https://www.arweave.net/hurymaNA8AyoTUk_WS0iO5cxLs6kM1ZRneC29Xo-MRE?ext=png",
    
        upgradeIndex: 6,
        baseCost: 20_000_000,
        coinPerUpgrade: 7800,
    },
    {
        name: "Coach",
        description: "",
        image: "https://arweave.net/jh0zt1_LCkvhGWlzhDBArV1HoRhCQ-i9_FOtoN4zVVI?ext=png",
    
        upgradeIndex: 7,
        baseCost: 330_000_000,
        coinPerUpgrade: 44_000,
    }
    
]

export function getNextCost(baseCost: number, owned: number){
    return Math.round(baseCost * 1.15 ** (owned))
}

export function getCpS(clickerAccount: ClickerStruct){
    let cps = 0;

    clickerAccount.clickerUpgrades.forEach((owned, i)=>{
        if(i < UPGRADES.length){
            cps += owned * UPGRADES[i].coinPerUpgrade
        }
    })

    return cps;
}