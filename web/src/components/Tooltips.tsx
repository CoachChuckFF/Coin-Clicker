import { PlacesType, Tooltip, VariantType } from "react-tooltip";
import { UPGRADES } from "../models/upgrades";

export enum TooltipIds {
    coins = 'coins',
    cps = 'cps',
    deposit = 'deposit',
    withdraw = 'withdraw',
    submit = 'submit',
    playerBalance = 'playerBalance',
    walletCoins = 'walletCoins',
    walletBalance = 'walletBalance',
    upgradeNotUnlocked = 'upgradeNotUnlocked',
    upgradeNotUnlockedBottom = 'upgradeNotUnlockedBottom',
    upgrade = 'upgrade-', // Needs Added Index
    leaderboard = 'leaderboard',
}

function GameTooltip(id: string,  content: string, place: PlacesType = 'bottom' ){
    return <Tooltip 
        id={id}
        place={place}
        content={content}
        delayShow={200}
        variant="info"
    />
}

export function Tooltips(props: {shouldShow: boolean}){

    if(!props.shouldShow) return null;
    return (
        <div className="z-50">
            {GameTooltip(TooltipIds.coins, 'Your total Coins and ( Coins to be Redeemed ) - Click to redeem!', 'top-start')}
            {GameTooltip(TooltipIds.cps, 'Your total Coins per Second (CpS)! Increase this by buying upgrades!', 'top-start')}
            {GameTooltip(TooltipIds.deposit, 'Loads up your Player Wallet to pay the tx fees, it also burns any coins in your Player Wallet and transfers them to the clicker account.')}
            {GameTooltip(TooltipIds.withdraw, 'Withdraws all Coins from the clicker account, all the solana from the Player Wallet and transfers them to your Wallet.')}
            {GameTooltip(TooltipIds.submit, 'CAREFUL! This will submit your coins to the leaderboard, and reset your clicker account! You can only submit when you\'re playing.', 'bottom-end')}
            {GameTooltip(TooltipIds.playerBalance, 'The Player Wallet\'s Solana, this is used to pay the small Solana transaction fee per click/upgrade function calls.')}
            {GameTooltip(TooltipIds.walletCoins, 'How many Coins you have in your wallet!')}
            {GameTooltip(TooltipIds.walletBalance, 'Your Solana balance')}
            {GameTooltip(TooltipIds.upgradeNotUnlocked, 'Keep clicking to unlock this upgrade!', 'top')}
            {GameTooltip(TooltipIds.upgradeNotUnlockedBottom, 'Keep clicking to unlock this upgrade!')}
            {GameTooltip(TooltipIds.upgrade + '0', UPGRADES[0].description, 'top')}
            {GameTooltip(TooltipIds.upgrade + '1', UPGRADES[1].description, 'top')}
            {GameTooltip(TooltipIds.upgrade + '2', UPGRADES[2].description, 'top-end')}
            {GameTooltip(TooltipIds.upgrade + '3', UPGRADES[3].description, 'top-end')}
            {GameTooltip(TooltipIds.upgrade + '4', UPGRADES[4].description)}
            {GameTooltip(TooltipIds.upgrade + '5', UPGRADES[5].description)}
            {GameTooltip(TooltipIds.upgrade + '6', UPGRADES[6].description, 'bottom-end')}
            {GameTooltip(TooltipIds.upgrade + '7', UPGRADES[7].description, 'bottom-end')}
            {GameTooltip(TooltipIds.leaderboard, 'This is the only real point of the game! Can you engrave yourself into Solana history???', 'top')}
        </div>
    )
}