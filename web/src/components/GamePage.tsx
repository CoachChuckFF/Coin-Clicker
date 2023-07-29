import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React, { useEffect, useRef, useState } from 'react';
import { useAppState } from '../hooks/ClickerStore';
import { toast } from 'react-toastify';
import { GameButton } from './Button';
import { UPGRADES, getCpS, getNextCost } from '../models/upgrades';
import { DUMMY_ENTRIES, TerminalColor, TerminalEntry } from '../models/terminal';
import { LeaderboardEntry } from '../models/leaderboard';
import { formatNumber } from '../controllers/helpers';

function GamePage() {
    // ----------- STATE ------------------------

    const [shakeImage, setShakeImage] = useState(false);
    const [terminalEntries, setTerminalEntries] = useState<TerminalEntry[]>([]);
    const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
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
        gameSubmit,
        clickerUpgrade,
        gameAccount,
        toastMessage,
        toastError,
        toastSuccess,
        playerBalance,
        walletBalance
    } = useAppState();

    useEffect(()=>{
        if(gameAccount){

            const leaderboard: LeaderboardEntry[] = [];
            gameAccount.leaderboards.forEach((entry)=>{
                if(entry.points.toNumber() > 0){
                    leaderboard.push({
                        name: entry.wallet.toString().substring(0, 3).toUpperCase(),
                        address: entry.wallet,
                        coins: entry.points.toNumber()
                    } as LeaderboardEntry)
                }
            })

            leaderboard.sort((a, b)=>{
                return b.coins - a.coins
            })

            setLeaderboardEntries(leaderboard);
        }
    }, [gameAccount])

    useEffect(() => {
        let newMessage = '';
        let messageType: TerminalColor = TerminalColor.normal

        if (toastSuccess) {
            newMessage = toastMessage as string;
            messageType = TerminalColor.normal
        } else if (toastMessage) {
            newMessage = toastMessage as string;
            messageType = TerminalColor.normal
        } else if (toastError) {
            newMessage = toastMessage as string;
            messageType = TerminalColor.error
        }


        if(newMessage){
            const newEntry = {
                type: messageType,
                message: newMessage,
                timestamp: Date.now(),
            };

            setTerminalEntries((prevEntries) => {
                // Add new entry to the array
                const newEntries = [...prevEntries, newEntry];
                // If the array length exceeds 99, remove the first message
                if (newEntries.length > 99) {
                    return newEntries.slice(1);
                }
                return newEntries;
            });
        }

    }, [toastMessage, toastError, toastSuccess]);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }

    }, [terminalEntries]);


    // ----------- ENABLED ------------------------
    const depositEnabled = !isLoading && gameAccount;
    const withdrawEnabled = !isLoading && gameAccount && clickerAccount;
    const clickEnabled = !isLoading && gameAccount && clickerAccount;
    const upgradeEnabled = !isLoading && gameAccount && clickerAccount;
    const submitEnabled = !isLoading && gameAccount && clickerAccount;

    // ----------- FUNCTIONS ------------------------

    const handleDeposit = async () => {
        if(depositEnabled)
            gameDeposit();
    };

    const handleClick = async () => {
        if(clickEnabled)
            clickerClick();
    };

    const handleUpgrade = async (index: number) => {
        if(upgradeEnabled)
            clickerUpgrade(index);
    };

    const handleWithdraw = async () => {
        if(withdrawEnabled)
            gameWithdraw();
    };

    const handleSubmit = async () => {
        if(submitEnabled)
            gameSubmit();
    };

    // ----------- RENDERERS ------------------------

    const renderClickerSection = () => {
        return (
            <>
                <h1 className="text-2xl mb-4 text-center">Coin Clicker</h1>
                <h1 className="text-2xl mb-4 text-center">CpS {clickerAccount ? formatNumber(getCpS(clickerAccount)) : 'X'}</h1>
                <img
                    onClick={handleClick}
                    src="https://arweave.net/AVwhbS2Zc8sIOcgEIaTDCRhh-enHdpzNqZURNVFm_eI"
                    alt="Placeholder Image"
                    className="object-contain w-full"
                />
                <p className="text-lg mt-4 text-center">Coins {clickerAccount ? clickerAccount.points.toNumber() : 'XXX'}</p>
                {/* Additional Left side content goes here */}
            </>
        );
    };

    const renderWalletSection = () => {
        return (
            <div className="h-full flex flex-col">
                <div className="h-[70%] w-full flex justify-around items-center">
                    <div onClick={handleDeposit} className="bg-solana-blue hover:bg-blue-700 text-white w-full font-bold py-2 mx-3 text-center rounded">
                        Deposit 0.01
                    </div>
                    <div onClick={handleWithdraw} className="bg-solana-blue hover:bg-blue-700 text-white w-full font-bold py-2 mx-3 text-center rounded">
                        Withdraw
                    </div>
                    <div onClick={handleSubmit} className="bg-solana-blue hover:bg-blue-700 text-white w-full font-bold py-2 mx-3 text-center rounded">
                        Submit To Leaderboard
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

            
            //   const ownedAmount = clickerAccount ? clickerAccount.clickerUpgrades[i] : 0;
              const owned: string = clickerAccount ? formatNumber(clickerAccount.clickerUpgrades[i]) : 'X';
              const cost: string = clickerAccount ? formatNumber(getNextCost(upgrade.baseCost, clickerAccount.clickerUpgrades[i])): formatNumber(upgrade.baseCost);

              return (
                <div
                  key={i}
                  onClick={() => handleUpgrade(i)}
                  className="rounded shadow relative group overflow-hidden"
                  style={{ backgroundImage: `url(${upgrade.image})`, backgroundSize: 'cover' }}
                >
                  <div className="font-mono w-full h-full bg-black bg-opacity-75 group-hover:backdrop-filter group-hover:backdrop-blur">
                    <div className="p-4 flex flex-col justify-between h-full">
                      <div>
                        <h2 className="text-white font-bold">{upgrade.name}</h2>
                      </div>
                      <div>
                        <p className="text-white">Cost: {cost}</p>
                        <p className="text-white">CpS: {formatNumber(upgrade.coinPerUpgrade)}</p>
                        <p className="text-white">Owned: {owned}</p>
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
    
        return (
            <div className="font-mono bg-solana-black text-solana-light rounded shadow p-4 h-full overflow-auto">
                <h1 className="text-2xl font-bold mb-2 text-center">LEADERBOARD</h1>
                <div>
                    {leaderboardEntries.map((player, index) => (
                        <div key={index} className="flex justify-between">
                            <span>{index+1}. {player.name}</span>
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
                    <div className="w-2/3">{renderTerminalSection()}</div>
                    <div className="w-1/3">{renderLeaderboardSection()}</div>
                </div>
            </div>
        </div>
    );

}
export default GamePage;
