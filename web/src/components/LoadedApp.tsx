import { FC } from 'react';
import SolanaProvider from '../hooks/SolanaProvider';
import React  from 'react';
import GamePage from './GamePage';
import ClickerProvider from '../hooks/ClickerProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoadedApp: FC = () => {
    return (
        <SolanaProvider>
            <ClickerProvider>
                {GamePage()}
                <ToastContainer />
            </ClickerProvider>
        </SolanaProvider>
    );
};
export default LoadedApp;
