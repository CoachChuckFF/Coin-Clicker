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
        description: "These little 8-bit scallywags will help you click your coin at 1 Coin per Second!",
        image: "https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/sea-rovers.png",
    
        upgradeIndex: 0,
        baseCost: 15,
        coinPerUpgrade: 1,
    },
    {
        name: "Fractals",
        description: "Watch out! These Fractals will click your coin at 3 Coins per Second!",
        image: "https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/fractals.jpeg",

        upgradeIndex: 1,
        baseCost: 100,
        coinPerUpgrade: 3,
    },
    {
        name: "Pesky Penguins",
        description: "NOOT NOOT - These cute little guys are gonna NOOT your coin so hard it'll get you +8 CpS",
        image: "https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/pesky.png",
     
        upgradeIndex: 2,
        baseCost: 1100,
        coinPerUpgrade: 8,
    },
    {
        name: "Shadowy Super Coder",
        description: "Don't ask how they're netting you +47 CpS... They won't even tell me!",
        image: "https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/ssc.png",
    
    
        upgradeIndex: 3,
        baseCost: 12_000,
        coinPerUpgrade: 47,
    },
    {

        name: "NEC",
        description: "These robots from Portals are great at automating! You'll get +260 CpS",
        image: "https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/nec.png",
    
        upgradeIndex: 4,
        baseCost: 130_000,
        coinPerUpgrade: 260,
    },
    {
        name: "Claynos",
        description: "RAWR! Look at these cutties! All full of clay and adorable! Each adorable dino give you +1400 CpS",
        image: "https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/claynos.png",
    
        upgradeIndex: 5,
        baseCost: 1_400_000,
        coinPerUpgrade: 1400,
    },
    {
        name: "Dronies",
        description: "I'm starting to suspect these birds arn't real... And they seem to be Always Watching... Anyways +7800 CpS",
        image: "https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/dronies.png",
    
        upgradeIndex: 6,
        baseCost: 20_000_000,
        coinPerUpgrade: 7800,
    },
    {
        name: "Coach",
        description: "IT'S ME, COACH! I'll use my almighty power to give you +44000 CpS for each instance of me!",
        image: "https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/coach.png",
    
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