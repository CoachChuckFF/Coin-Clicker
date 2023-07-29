import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React, { useEffect, useRef, useState } from 'react';
import { useAppState } from '../hooks/ClickerStore';
import { toast } from 'react-toastify';
import { GameButton } from './Button';
import { UPGRADES } from '../models/upgrades';
import { DUMMY_ENTRIES, TerminalColor, TerminalEntry } from '../models/terminal';

function GamePage() {
    const [shakeImage, setShakeImage] = useState(false);
    const [terminalEntries, setTerminalEntries] = useState<TerminalEntry[]>(DUMMY_ENTRIES);
    const terminalRef = useRef<HTMLDivElement>(null);

    const handleImageClick = () => {
        setShakeImage(true);
        setTimeout(() => setShakeImage(false), 1000); // reset after 1s
    };
    const {
        clickerKey,
        clickerAccount,
        isLoading,
        gameWithdraw,
        gameDeposit,
        clickerClick,
        clearToast,
        clickerUpgrade,
        balance,
        toastMessage,
        toastError,
        toastSuccess,
    } = useAppState();

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalEntries]);

    useEffect(() => {
        if (toastSuccess) {
            toast(toastSuccess, { type: 'success', pauseOnHover: false, autoClose: 555 });
            toast.onChange(clearToast);
        } else if (toastMessage) {
            toast(toastMessage, { type: 'info', pauseOnHover: false, autoClose: 555 });
            toast.onChange(clearToast);
        } else if (toastError) {
            toast(toastError, { type: 'error', pauseOnHover: false, autoClose: 3000 });
            toast.onChange(clearToast);
        }
    }, [toastMessage, toastError, toastSuccess]);

    const addRandomTerminalEntry = () => {
        const types = Object.values(TerminalColor);
        const newEntry = {
            type: types[Math.floor(Math.random() * types.length)],
            message: Math.random().toString(36).substring(7), // Random alphanumeric string
            timestamp: Date.now(),
        };
    
        setTerminalEntries((prevEntries) => [...prevEntries, newEntry]);
    };

    const handleDeposite = async () => {
        gameDeposit();
    };

    const handleClick = async () => {
        addRandomTerminalEntry();
        // clickerClick();
    };

    const handleUpgrade = async () => {
        clickerUpgrade(0x00);
    };

    const handleWithdraw = async () => {
        gameWithdraw();
    };

    const renderClickerInfo = () => {
        if (!clickerAccount) return null;

        return (
            <>
                <p>Points {clickerAccount.points.toString()}</p>
                <p>PPC {(clickerAccount.clickerUpgrades[0] + 1).toString()}</p>
                <p>PPS {clickerAccount.clickerUpgrades[1].toString()}</p>
            </>
        );
    };

    const renderClickerSection = () => {
        return (
            <>
                <h1 className="text-2xl mb-4 text-center">Coin Clicker</h1>
                <img
                    onClick={handleClick}
                    src="https://via.placeholder.com/100"
                    alt="Placeholder Image"
                    className="object-contain w-full"
                />
                <p className="text-lg mt-4 text-center">Coins {clickerAccount?.points ?? 'XXX'}</p>
                {/* Additional Left side content goes here */}
            </>
        );
    };

    const renderWalletSection = () => {
        return (
            <div className="h-full flex flex-col">
                <div className="h-[70%] w-full flex justify-around items-center">
                    <div className="bg-solana-blue hover:bg-blue-700 text-white w-full font-bold py-2 mx-3 text-center rounded">
                        Deposit 0.01
                    </div>
                    <div className="bg-solana-blue hover:bg-blue-700 text-white w-full font-bold py-2 mx-3 text-center rounded">
                        Withdraw
                    </div>
                    <div className="bg-solana-blue hover:bg-blue-700 text-white w-full font-bold py-2 mx-3 text-center rounded">
                        Submit To Leaderboard
                    </div>
                    <div className="font-bold py-2 px-4 rounded">
                        <WalletMultiButton />
                    </div>
                </div>
                <div className="h-[30%] w-full flex justify-around items-center">
                    <p className="text-center w-full">Player: ◎ {balance?.toFixed(5) ?? 'X'}</p>
                    <p className="text-center w-full">Wallet Coins: {balance?.toFixed(0) ?? 'X'}</p>
                    <p className="text-center w-full">Wallet: ◎ {balance?.toFixed(5) ?? 'X'}</p>
                </div>
            </div>
        );
    };

    const renderStoreSection = () => {
        return (
            <div className="h-full w-full grid grid-cols-4 grid-rows-2 gap-4">
                {UPGRADES.map((upgrade, i) => (
                    <div key={i} className="rounded shadow bg-solana-blue hover:bg-blue-700 flex items-center p-1 space-x-2">
                        {/* <img src={upgrade.image} alt={upgrade.name} className="w-16 h-full" /> */}
                        <div className="flex flex-col">
                            <div className="flex justify-between items-center w-full">
                                <h2>{upgrade.name}</h2>
                                <p>Base Cost: {upgrade.baseCost}</p>
                            </div>
                            <p className="line-clamp-2 overflow-ellipsis">{upgrade.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderTerminalSection = () => {
        return (
            <div ref={terminalRef} className="font-mono bg-solana-black text-solana-light rounded shadow p-4 h-full overflow-auto mr-3">
                {terminalEntries.map((entry, index) =>{
                    return (
                    <p className={entry.type.toString()} key={index}>
                        {new Date(entry.timestamp).toLocaleTimeString()} - {entry.message}
                    </p>
                )})}
            </div>
        );
    };

    const renderLeaderboardSection = () => {
        // Mock leaderboard data
        const leaderboardData = [
            { name: "BAS", score: 100000 },
            { name: "AAA", score: 50000 },
            //... add more data as needed
        ];
    
        return (
            <div className="font-mono bg-solana-black text-solana-light rounded shadow p-4 h-full overflow-auto">
                <h1 className="text-2xl font-bold mb-2 text-center">LEADERBOARD</h1>
                <div>
                    {leaderboardData.map((player, index) => (
                        <div key={index} className="flex justify-between">
                            <span>{index+1}. {player.name}</span>
                            <span>{player.score}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="w-screen h-screen flex bg-solana-black text-solana-light">
            <div className="w-1/3 h-full flex items-center justify-center p-8 flex-col">{renderClickerSection()}</div>
            <div className="w-2/3 h-full flex flex-col p-4">
                <div className="h-1/5 p-4 rounded shadow-lg bg-solana-dark">{renderWalletSection()}</div>
                <div className="h-3/5 p-4 rounded shadow-lg bg-solana-dark mt-4">{renderStoreSection()}</div>
                <div className="h-2/5 p-4 rounded shadow-lg bg-solana-dark mt-4 flex">
                    <div className="w-2/3">{renderTerminalSection()}</div>
                    <div className="w-1/3">{renderLeaderboardSection()}</div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
            <div>
                <WalletMultiButton />
                <GameButton onClick={handleDeposite} text="Deposite" />
                <GameButton onClick={handleClick} text="Click" />
                <GameButton onClick={handleUpgrade} text="Upgrade" />
                <GameButton onClick={handleWithdraw} text="Withdraw" />
                <p>{balance}</p>
                {renderClickerInfo()}
                <img
                    src="https://via.placeholder.com/500"
                    alt="Placeholder"
                    className={`mx-auto block ${shakeImage ? 'animate-pulse' : ''}`}
                    onClick={handleImageClick}
                />
                <h1 className="text-center text-3xl font-semibold mt-5">Idol Clicker Game</h1>
                {/* Game related logic will go here */}
            </div>
        </div>
    );
}
export default GamePage;
