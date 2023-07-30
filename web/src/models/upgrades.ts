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
        image: "https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/sea-rovers.png",
    
        upgradeIndex: 0,
        baseCost: 15,
        coinPerUpgrade: 1,
    },
    {
        name: "Fractals",
        description: "",
        image: "https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/fractals.jpeg",

        upgradeIndex: 1,
        baseCost: 100,
        coinPerUpgrade: 3,
    },
    {
        name: "Pesky Penguins",
        description: "",
        image: "https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/pesky.png",
     
        upgradeIndex: 2,
        baseCost: 1100,
        coinPerUpgrade: 8,
    },
    {
        name: "Shadowy Super Coder",
        description: "",
        image: "https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/ssc.png",
    
    
        upgradeIndex: 3,
        baseCost: 12_000,
        coinPerUpgrade: 47,
    },
    {

        name: "NEC",
        description: "",
        image: "https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/nec.png",
    
        upgradeIndex: 4,
        baseCost: 130_000,
        coinPerUpgrade: 260,
    },
    {
        name: "Claynos",
        description: "",
        image: "https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/claynos.png",
    
        upgradeIndex: 5,
        baseCost: 1_400_000,
        coinPerUpgrade: 1400,
    },
    {
        name: "Dronies",
        description: "",
        image: "https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/dronies.png",
    
        upgradeIndex: 6,
        baseCost: 20_000_000,
        coinPerUpgrade: 7800,
    },
    {
        name: "Coach",
        description: "",
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