import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React, { useEffect, useRef, useState } from 'react';
import { useAppState } from '../hooks/ClickerStore';
import { toast } from 'react-toastify';
import { GameButton } from './Button';
import { UPGRADES, getCpS, getNextCost } from '../models/upgrades';
import { STARTING_ENTRIES, TerminalColor, TerminalEntry } from '../models/terminal';
import { LeaderboardEntry } from '../models/leaderboard';
import { formatNumber } from '../controllers/helpers';
import CoinView from './CoinView';

function GamePage() {
    // ----------- STATE ------------------------

    const [terminalEntries, setTerminalEntries] = useState<TerminalEntry[]>(STARTING_ENTRIES);
    const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
    const terminalRef = useRef<HTMLDivElement>(null);

    const {
        clickerAccount,
        lastTerminalEntry,
        gameWithdraw,
        gameDeposit,
        clickerClick,
        gameSubmit,
        clickerUpgrade,
        gameAccount,
        playerBalance,
        walletBalance,
    } = useAppState();

    useEffect(() => {
        if (gameAccount) {
            const leaderboard: LeaderboardEntry[] = [];
            gameAccount.leaderboards.forEach((entry) => {
                if (entry.points.toNumber() > 0) {
                    leaderboard.push({
                        name: entry.wallet.toString().substring(0, 3).toUpperCase(),
                        address: entry.wallet,
                        coins: entry.points.toNumber(),
                    } as LeaderboardEntry);
                }
            });

            leaderboard.sort((a, b) => {
                return b.coins - a.coins;
            });

            setLeaderboardEntries(leaderboard);
        }
    }, [gameAccount]);

    useEffect(() => {
        if (lastTerminalEntry) {
            setTerminalEntries((prevEntries) => {
                // Add new entry to the array
                const newEntries = [...prevEntries, lastTerminalEntry];
                // If the array length exceeds 99, remove the first message
                if (newEntries.length > 99) {
                    return newEntries.slice(1);
                }
                return newEntries;
            });
        }
    }, [lastTerminalEntry]);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalEntries]);

    // ----------- ENABLED ------------------------
    const depositEnabled = gameAccount;
    const withdrawEnabled = gameAccount && clickerAccount;
    const clickEnabled = gameAccount && clickerAccount;
    const upgradeEnabled = gameAccount && clickerAccount;
    const submitEnabled = gameAccount && clickerAccount;

    // ----------- FUNCTIONS ------------------------

    const handleDeposit = async () => {
        if (depositEnabled) gameDeposit();
    };

    const handleClick = async () => {
        if (clickEnabled) {
            clickerClick();
        } else if (depositEnabled) {
            gameDeposit();
        }
    };

    const handleUpgrade = async (index: number) => {
        if (upgradeEnabled) clickerUpgrade(index);
    };

    const handleWithdraw = async () => {
        if (withdrawEnabled) gameWithdraw();
    };

    const handleSubmit = async () => {
        if (submitEnabled) gameSubmit();
    };

    // ----------- RENDERERS ------------------------

    const renderClickerSection = () => {
        return (
            <>
                <h1 className="text-2xl mb-4 text-center">Coach&apos;s Coin Clicker</h1>
                {clickerAccount ? (
                    <CoinView
                        cps={getCpS(clickerAccount)}
                        lastUpdateUnixSeconds={clickerAccount.lastUpdated.toNumber()}
                        coins={clickerAccount.points.toNumber()}
                    />
                ) : (
                    <h1 className="text-2xl mb-4 text-center">Deposit To Start</h1>
                )}
                <img
                    onClick={handleClick}
                    src="https://arweave.net/AVwhbS2Zc8sIOcgEIaTDCRhh-enHdpzNqZURNVFm_eI"
                    alt="Placeholder Image"
                    className="object-contain w-full cursor-pointer"
                />
            </>
        );
    };

    const renderWalletSection = () => {
        return (
            <div className="h-full flex flex-col">
                <div className="h-[70%] w-full flex justify-around items-center">
                    <div
                        onClick={(handleDeposit)}
                        className={`bg-solana-blue w-full font-bold py-2 mx-3 text-center rounded cursor-pointer ${depositEnabled ? 'bg-solana-blue hover:bg-solana-blue-pressed hover:text-stone-200 text-white' : ' bg-opacity-20 text-stone-500 cursor-not-allowed'}`}
                    >
                        Deposit ◎ 0.01
                    </div>
                    <div
                        onClick={handleWithdraw}
                        className={`bg-solana-blue w-full font-bold py-2 mx-3 text-center rounded cursor-pointer ${withdrawEnabled ? 'bg-solana-blue hover:bg-solana-blue-pressed hover:text-stone-200 text-white' : ' bg-opacity-20 text-stone-500 cursor-not-allowed'}`}
                    >
                        Withdraw
                    </div>
                    <div
                        onClick={handleSubmit}
                        className={`bg-solana-blue w-full font-bold py-2 mx-3 text-center rounded cursor-pointer ${submitEnabled ? 'bg-solana-blue hover:bg-solana-blue-pressed hover:text-stone-200 text-white' : ' bg-opacity-20 text-stone-500 cursor-not-allowed'}`}
                    >
                        Submit
                    </div>
                    <WalletMultiButton />
                </div>
                <div className="h-[30%] w-full flex justify-around items-center">
                    <p className="text-center w-full">Player: ◎ {playerBalance?.toFixed(6) ?? 'X'}</p>
                    <p className="text-center w-full">Wallet Coins: {0?.toFixed(0) ?? 'X'}</p>
                    <p className="text-center w-full">Wallet: ◎ {walletBalance?.toFixed(6) ?? 'X'}</p>
                </div>
            </div>
        );
    };

    const renderStoreSection = () => {
        return (
            <div className="h-full w-full grid grid-cols-4 grid-rows-2 gap-4">
                {UPGRADES.map((upgrade, i) => {
                    const ownedAmount = clickerAccount ? clickerAccount.clickerUpgrades[i] : 0;
                    const owned: string = clickerAccount ? formatNumber(clickerAccount.clickerUpgrades[i]) : 'X';
                    const cost: string = clickerAccount
                        ? formatNumber(getNextCost(upgrade.baseCost, clickerAccount.clickerUpgrades[i]))
                        : formatNumber(upgrade.baseCost);
                    const buyEnabled: boolean = clickerAccount ? clickerAccount.points.toNumber() >= cost : false;

                    return (
                        <div
                            key={i}
                            onClick={() =>{if(buyEnabled) handleUpgrade(i)}}
                            className="rounded shadow relative group overflow-hidden"
                            style={{ backgroundImage: `url(${upgrade.image})`, backgroundSize: 'cover' }}
                        >
                            <div
                                className={`font-mono w-full h-full bg-black bg-opacity-75 backdrop-filter backdrop-blur cursor-pointer ${
                                    buyEnabled ? 'bg-black bg-opacity-60 hover:backdrop-blur-none' : 'bg-opacity-85 backdrop-blur text-stone-500 cursor-not-allowed'
                                } `}
                            >
                                <div className="p-4 flex flex-col justify-between h-full">
                                    <div>
                                        <h2 className="font-bold">{upgrade.name}</h2>
                                    </div>
                                    <div>
                                        <p className="">Cost: -{cost}</p>
                                        <p className="">
                                            CpS: +{formatNumber(upgrade.coinPerUpgrade)} ({' '}
                                            {formatNumber(ownedAmount * upgrade.coinPerUpgrade)} )
                                        </p>
                                        <p className="">Owned: {owned}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderTerminalSection = () => {
        return (
            <div
                ref={terminalRef}
                className="font-mono bg-solana-black text-solana-light rounded shadow p-4 h-full overflow-auto mr-3"
            >
                {terminalEntries.map((entry, index) => {
                    return (
                        <p className={entry.type.toString() + ' mb-2'} key={index}>
                            {new Date(entry.timestamp).toLocaleTimeString()} - {entry.message}
                        </p>
                    );
                })}
            </div>
        );
    };

    const renderLeaderboardSection = () => {
        return (
            <div className="font-mono bg-solana-black text-solana-light rounded shadow p-4 h-full overflow-auto">
                <h1 className="text-2xl font-bold mb-2 text-center">LEADERBOARD</h1>
                <div>
                    {leaderboardEntries.map((player, index) => (
                        <div key={index} className="flex justify-between">
                            <span>
                                {index + 1}. {player.name}
                            </span>
                            <span>{player.coins}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // ----------- PAGE ------------------------
    return (
        <div className="font-mono w-screen h-screen flex bg-solana-black text-solana-light">
            <div className="w-1/3 h-full flex items-center justify-center p-8 flex-col">{renderClickerSection()}</div>
            <div className="w-2/3 h-full flex flex-col p-4">
                <div className="h-1/5 p-4 rounded shadow-lg bg-solana-dark">{renderWalletSection()}</div>
                <div className="h-3/5 p-4 rounded shadow-lg bg-solana-dark mt-4">{renderStoreSection()}</div>
                <div className="h-2/5 p-4 rounded shadow-lg bg-solana-dark mt-4 flex">
                    <div className="w-3/4">{renderTerminalSection()}</div>
                    <div className="w-1/4">{renderLeaderboardSection()}</div>
                </div>
            </div>
        </div>
    );
}
export default GamePage;
