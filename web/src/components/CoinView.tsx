import React, { useState, useEffect } from "react";
import { formatNumber } from "../controllers/helpers";
import { TooltipIds } from "./Tooltips";

export interface CoinViewProps {
    cps: number, 
    lastUpdateUnixSeconds: number,
    coins: number,
}

export const CoinView = (props: CoinViewProps) => {
    const {cps, lastUpdateUnixSeconds, coins} = props;
    const [currentTime, setCurrentTime] = useState(Date.now() / 1000);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(Date.now() / 1000);
        }, 100);

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, []); // Empty array ensures effect is only run on mount and unmount

    // Calculate the elapsed time in seconds
    const elapsedSeconds = currentTime - lastUpdateUnixSeconds;

    // Calculate the accumulated coins
    const accumulatedCoins = elapsedSeconds * cps;

    return (
        <>

            <h1 data-tooltip-id={TooltipIds.coins} className="text-2xl mb-1 text-center ">Coins {formatNumber(coins)} ← ( {formatNumber(accumulatedCoins)} )</h1>
            <p data-tooltip-id={TooltipIds.cps} className="text-sm mb-5 text-center">Total CpS {cps}</p>
        </>
    );
};

export default CoinView;
