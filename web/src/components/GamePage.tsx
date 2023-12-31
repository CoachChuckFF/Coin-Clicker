import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FaGithub, FaTwitter } from 'react-icons/fa';
import React, { useEffect, useRef, useState } from 'react';
import { useAppState } from '../hooks/ClickerStore';
import { UPGRADES, getCpS, getNextCost } from '../models/upgrades';
import { STARTING_ENTRIES, TerminalEntry } from '../models/terminal';
import { LeaderboardEntry } from '../models/leaderboard';
import { formatNumber } from '../controllers/helpers';
import CoinView from './CoinView';
import { Tooltip } from 'react-tooltip';
import { TooltipIds, Tooltips } from './Tooltips';
import useSound from 'use-sound';
import ConfettiArea from './Confetti';

function GamePage() {
    // ----------- STATE ------------------------

    const [coinClicked, setCoinClicked] = useState(false);
    const [terminalEntries, setTerminalEntries] = useState<TerminalEntry[]>(STARTING_ENTRIES);
    const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
    const terminalRef = useRef<HTMLDivElement>(null);
    const [play, { stop }] = useSound(
        'https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/clicker-sounds.mp3',
        {
            sprite: {
                coin: [0, 366],
                upgrade: [366, 1079],
                deposit: [1445, 440],
                withdraw: [1858, 3576],
                submit: [5434, 4704],
                click: [10138, 348],
            },
        }
    );

    const {
        isLoading,
        clickerAccount,
        lastTerminalEntry,
        gameWithdraw,
        gameDeposit,
        clickerClick,
        gameSubmit,
        clickerUpgrade,
        gameAccount,
        playerBalance,
        tokenBalance,
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
            if (lastTerminalEntry.message.includes('DEPOSIT')) {
                playSound('deposit');
            } else if (lastTerminalEntry.message.includes('WITHDRAW')) {
                playSound('withdraw');
            } else if (lastTerminalEntry.message.includes('SUBMIT')) {
                playSound('submit');
            } else if (lastTerminalEntry.message.includes('UPGRADE')) {
                playSound('upgrade');
            }

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
    const depositEnabled = !isLoading && gameAccount !== null;
    const withdrawEnabled =
        !isLoading && gameAccount !== null && clickerAccount !== null && clickerAccount.points.toNumber() > 0;
    const clickEnabled = !isLoading && gameAccount !== null && clickerAccount !== null;
    const upgradeEnabled = !isLoading && gameAccount !== null && clickerAccount !== null;
    const submitEnabled =
        !isLoading && gameAccount !== null && clickerAccount !== null && clickerAccount.points.toNumber() > 0;

    // ----------- COINS FOR CONFETTI ------------------------
    let coinsForConfetti = 0;
    if (clickerAccount) {
        coinsForConfetti = clickerAccount.points.toNumber();
    }
    if (tokenBalance) {
        coinsForConfetti += tokenBalance;
    }

    // ----------- FUNCTIONS ------------------------

    const playSound = (id: 'click' | 'upgrade' | 'deposit' | 'withdraw' | 'submit' | 'coin') => {
        stop('coin');
        stop('click');
        stop('upgrade');
        stop('deposit');
        stop('withdraw');
        stop('submit');
        play({ id });
    };

    const handleDeposit = async () => {
        if (depositEnabled) {
            playSound('click');
            gameDeposit();
        }
    };

    const handleClick = async () => {
        if (!coinClicked && !isLoading) {
            setCoinClicked(true);
            playSound('coin');
            setTimeout(() => setCoinClicked(false), 100); // Set the duration of the pop effect here
        }

        if (clickEnabled) {
            clickerClick();
        } else if (depositEnabled) {
            gameDeposit();
        }
    };

    const handleUpgrade = async (index: number) => {
        if (upgradeEnabled) {
            playSound('click');
            clickerUpgrade(index);
        }
    };

    const handleWithdraw = async () => {
        if (withdrawEnabled) {
            playSound('click');
            gameWithdraw();
        }
    };

    const handleSubmit = async () => {
        if (submitEnabled) {
            playSound('click');
            gameSubmit();
        }
    };

    // ----------- RENDERERS ------------------------

    const renderClickerSection = () => {
        return (
            <>
                <h1 className="text-2xl mb-4 text-center">Coach&apos;s Coin Clicker</h1>
                {clickerAccount ? (
                    <div className={isLoading ? 'text-stone-400' : 'text-white'}>
                        <CoinView
                            cps={getCpS(clickerAccount)}
                            lastUpdateUnixSeconds={clickerAccount.lastUpdated.toNumber()}
                            coins={clickerAccount.points.toNumber()}
                        />
                    </div>
                ) : (
                    <h1 className="text-2xl mb-4 text-center">Deposit To Start</h1>
                )}
                <div className="sinewave-animation">
                    <img
                        onClick={handleClick}
                        src="https://shdw-drive.genesysgo.net/5WRCJEgy7c1Wy3ewWdfJcAePMCaUq4asyuP8sRgTQZYq/coin-lg.png"
                        alt="Placeholder Image"
                        className={`object-contain w-full cursor-pointer ${coinClicked ? 'scale-lg' : 'scale-reg'}`}
                    />
                </div>
            </>
        );
    };

    const renderWalletSection = () => {
        return (
            <div className="h-full flex">
                {/* Left column */}
                <div className="w-full flex flex-col">
                    <div className="h-[50%] flex justify-around items-center">
                        <button
                            data-tooltip-id={TooltipIds.deposit}
                            onClick={handleDeposit}
                            className={`w-full py-2 mx-3 text-center rounded cursor-pointer ${
                                depositEnabled
                                    ? ' hover:text-stone-400 text-white'
                                    : 'bg-opacity-20 text-stone-500 cursor-not-allowed'
                            }`}
                        >
                            &#9608; Deposit ◎ 0.01
                        </button>
                        <button
                            data-tooltip-id={TooltipIds.withdraw}
                            onClick={handleWithdraw}
                            className={`w-full font-bold py-2 mx-3 text-center rounded cursor-pointer ${
                                withdrawEnabled
                                    ? 'hover:text-stone-400 text-white'
                                    : ' bg-opacity-20 text-stone-500 cursor-not-allowed'
                            }`}
                        >
                            &#9608; Withdraw
                        </button>
                        <button
                            data-tooltip-id={'submit'}
                            onClick={handleSubmit}
                            className={`w-full font-bold py-2 mx-3 text-center rounded cursor-pointer ${
                                submitEnabled
                                    ? 'hover:text-stone-400 text-white'
                                    : ' bg-opacity-20 text-stone-500 cursor-not-allowed'
                            }`}
                        >
                            &#9608; Submit
                        </button>
                    </div>
                    <div className="h-[50%] flex justify-around items-center mt-3 text-stone-500">
                        <p data-tooltip-id={TooltipIds.playerBalance} className="text-center">
                            Player: ◎ {playerBalance?.toFixed(6) ?? 'X'}
                        </p>
                        <p data-tooltip-id={TooltipIds.walletCoins} className="text-center">
                            Wallet Coins: {tokenBalance?.toFixed(0) ?? 'X'}
                        </p>
                        <p data-tooltip-id={TooltipIds.walletBalance} className="text-center">
                            Wallet: ◎ {walletBalance?.toFixed(6) ?? 'X'}
                        </p>
                    </div>
                </div>

                {/* Right column */}
                <div className="flex justify-center items-center min-w-fit">
                    <WalletMultiButton />
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
                    const cost: number = clickerAccount
                        ? getNextCost(upgrade.baseCost, clickerAccount.clickerUpgrades[i])
                        : upgrade.baseCost;
                    const costString = formatNumber(cost);
                    const buyEnabled: boolean = clickerAccount
                        ? clickerAccount.points.toNumber() >= cost && upgradeEnabled
                        : false;
                    const shouldShow: boolean = clickerAccount
                        ? clickerAccount.clickerUpgrades[i] > 0 || buyEnabled
                        : false;
                    const tooltipId = shouldShow
                        ? TooltipIds.upgrade + i
                        : i > 3
                        ? TooltipIds.upgradeNotUnlockedBottom
                        : TooltipIds.upgradeNotUnlocked;

                    return (
                        <div
                            key={i + tooltipId}
                            data-tooltip-id={tooltipId}
                            onClick={() => {
                                if (buyEnabled) handleUpgrade(i);
                            }}
                            className="rounded shadow relative group overflow-hidden"
                            style={{ backgroundImage: `url(${upgrade.image})`, backgroundSize: 'cover' }}
                        >
                            <div
                                className={`shadow-lg font-mono w-full h-full backdrop-filter backdrop-blur cursor-pointer ${
                                    buyEnabled
                                        ? 'bg-black bg-opacity-60 hover:bg-opacity-30 hover:backdrop-blur-none'
                                        : shouldShow
                                        ? 'bg-black bg-opacity-70 backdrop-blur text-stone-500 cursor-not-allowed'
                                        : 'bg-black bg-opacity-95 backdrop-blur text-stone-500 cursor-not-allowed'
                                } `}
                            >
                                <div className="p-4 flex flex-col justify-between h-full">
                                    <div>
                                        <h2 className="font-bold">
                                            {shouldShow ? upgrade.name : `Unlock at ${costString}`}
                                        </h2>
                                    </div>
                                    {shouldShow ? (
                                        <div>
                                            <p className="">Cost: -{costString}</p>
                                            <p className="">
                                                CpS: +{formatNumber(upgrade.coinPerUpgrade)} ({' '}
                                                {formatNumber(ownedAmount * upgrade.coinPerUpgrade)} )
                                            </p>
                                            <p className="">Owned: {owned}</p>
                                        </div>
                                    ) : null}
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
                <h1 data-tooltip-id={TooltipIds.leaderboard} className="text-2xl font-bold mb-2 text-center">
                    LEADERBOARD
                </h1>
                <div>
                    {leaderboardEntries.map((player, index) => (
                        <div key={index} className="flex justify-between">
                            <div className="flex">
                                <span style={{ width: '30px', textAlign: 'left' }}>{index + 1}.</span>
                                <span style={{ marginLeft: '10px' }}>{player.name}</span>
                            </div>
                            <span>{player.coins}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderSocials = () => {
        return (
            <div className="absolute top-4 left-4 space-x-4 shadow-lg">
                <a href="https://github.com/CoachChuckFF/Coin-Clicker" target="_blank" rel="noopener noreferrer">
                    <FaGithub className="text-2xl text-solana-light hover:text-stone-400 cursor-pointer" />
                </a>
                <a href="https://twitter.com/CoachChuckFF shadow-lg" target="_blank" rel="noopener noreferrer">
                    <FaTwitter className="text-2xl text-solana-light hover:text-stone-400 cursor-pointer" />
                </a>
            </div>
        );
    };

    // ----------- PAGE ------------------------

    return (
        <div className="font-mono w-screen h-screen flex text-solana-light -z-20">
            {renderSocials()}
            <Tooltips shouldShow={!isLoading} />
            <ConfettiArea coins={coinsForConfetti} />

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
}
export default GamePage;
