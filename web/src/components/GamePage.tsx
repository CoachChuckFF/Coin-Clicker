import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React, { useEffect, useState } from 'react';
import { useAppState } from '../hooks/ClickerStore';
import { createClickerAccount } from '../controllers/clickerProgram';
import { toast } from 'react-toastify';
import { GameButton } from './Button';

function GamePage() {
    const [shakeImage, setShakeImage] = useState(false);
    const handleImageClick = () => {
        setShakeImage(true);
        setTimeout(() => setShakeImage(false), 1000); // reset after 1s
    };
    const { clickerKey, clickerAccount, isLoading, clickerCreate, clickerClick, clearToast, clickerUpgrade, balance, toastMessage, toastError, toastSuccess } = useAppState();

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

    const handleClick = async () => {
        if(clickerKey && !clickerAccount){
            clickerCreate();
        } else {
            clickerClick();
        }
    }

    const handleUpgrade = async () => {
        if(clickerKey && !clickerAccount){
            clickerCreate();
        } else {
            clickerUpgrade(0x01);
        }
    }

    const handleAuto = async () => {
        if(clickerKey && !clickerAccount){
            clickerCreate();
        } else {
            clickerUpgrade(0x02);
        }
    }

    const renderClickerInfo = () => {
        if(!clickerAccount) return null;

        return (
            <>
                <p>Points {clickerAccount.points.toString()}</p>
                <p>PPC {(clickerAccount.clickerUpgrades[0] + 1).toString()}</p>
                <p>PPS {clickerAccount.clickerUpgrades[9].toString()}</p>
            </>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
            <div>
                <WalletMultiButton />
                <GameButton onClick={handleClick} text='Click'/>
                <GameButton onClick={handleUpgrade} text='+ 1 Clicker'/>
                <GameButton onClick={handleAuto} text='+ 1 Auto'/>
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
