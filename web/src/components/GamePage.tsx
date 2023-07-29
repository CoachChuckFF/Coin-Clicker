import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React, { useEffect, useState } from 'react';
import { useAppState } from '../hooks/ClickerStore';
import { toast } from 'react-toastify';
import { GameButton } from './Button';

function GamePage() {
    const [shakeImage, setShakeImage] = useState(false);
    const handleImageClick = () => {
        setShakeImage(true);
        setTimeout(() => setShakeImage(false), 1000); // reset after 1s
    };
    const { clickerKey, clickerAccount, isLoading, gameWithdraw, gameDeposit, clickerClick, clearToast, clickerUpgrade, balance, toastMessage, toastError, toastSuccess } = useAppState();

    useEffect(() => {
        if(toastSuccess){
            toast(toastSuccess, {type: 'success', pauseOnHover: false, autoClose: 555})
            toast.onChange(clearToast);
        } else if(toastMessage){
            toast(toastMessage, {type: 'info', pauseOnHover: false, autoClose: 555})
            toast.onChange(clearToast);
        } else if(toastError){
            toast(toastError, {type: 'error', pauseOnHover: false, autoClose: 3000})
            toast.onChange(clearToast);
        }
    }, [toastMessage, toastError, toastSuccess]);

    useEffect(() => {

    }, [toastError]);

    const handleDeposite = async () => {
        if(clickerKey && !clickerAccount){
            gameDeposit();
        } else {
            clickerClick();
        }
    }

    const handleClick = async () => {
        if(clickerKey && !clickerAccount){
            gameDeposit();
        } else {
            clickerClick();
        }
    }

    const handleUpgrade = async () => {
        if(clickerKey && !clickerAccount){
            gameDeposit();
        } else {
            clickerUpgrade(0x00);
        }
    }

    const handleWithdraw = async () => {
        if(clickerKey && !clickerAccount){
            gameDeposit();
        } else {
            gameWithdraw();
        }
    }

    const renderClickerInfo = () => {
        if(!clickerAccount) return null;

        return (
            <>
                <p>Points {clickerAccount.points.toString()}</p>
                <p>PPC {(clickerAccount.clickerUpgrades[0] + 1).toString()}</p>
                <p>PPS {clickerAccount.clickerUpgrades[1].toString()}</p>
            </>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
            <div>
                <WalletMultiButton />
                <GameButton onClick={handleDeposite} text='Deposite'/>
                <GameButton onClick={handleClick} text='Click'/>
                <GameButton onClick={handleUpgrade} text='Upgrade'/>
                <GameButton onClick={handleWithdraw} text='Withdraw'/>
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
