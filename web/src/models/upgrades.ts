
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
        name: "One",
        description: "Description for One",
        image: "https://via.placeholder.com/500",
    
        upgradeIndex: 0,
        baseCost: 15,
        coinPerUpgrade: 1,
    },
    {
        name: "Two",
        description: "Description for Two",
        image: "https://via.placeholder.com/500",
    
        upgradeIndex: 1,
        baseCost: 30,
        coinPerUpgrade: 2,
    },
    {
        name: "Three",
        description: "Description for Three",
        image: "https://via.placeholder.com/500",
    
        upgradeIndex: 2,
        baseCost: 45,
        coinPerUpgrade: 3,
    },
    {
        name: "Four",
        description: "Description for Four",
        image: "https://via.placeholder.com/500",
    
        upgradeIndex: 3,
        baseCost: 60,
        coinPerUpgrade: 4,
    },
    {
        name: "Five",
        description: "Description for Five",
        image: "https://via.placeholder.com/500",
    
        upgradeIndex: 4,
        baseCost: 75,
        coinPerUpgrade: 5,
    },
    {
        name: "Six",
        description: "Description for Six",
        image: "https://via.placeholder.com/500",
    
        upgradeIndex: 5,
        baseCost: 90,
        coinPerUpgrade: 6,
    },
    {
        name: "Seven",
        description: "Description for Seven",
        image: "https://via.placeholder.com/500",
    
        upgradeIndex: 6,
        baseCost: 105,
        coinPerUpgrade: 7,
    },
    {
        name: "Eight",
        description: "Description for Eight",
        image: "https://via.placeholder.com/500",
    
        upgradeIndex: 7,
        baseCost: 120,
        coinPerUpgrade: 8,
    }
]