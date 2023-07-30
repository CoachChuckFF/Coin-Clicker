import React, { Suspense } from 'react';
import Loader from './components/Loader';

// eslint-disable-next-line
(window as any).Buffer = (window as any).Buffer || require('buffer').Buffer;

require('./App.css');
require('@solana/wallet-adapter-react-ui/styles.css');
require('react-tooltip/dist/react-tooltip.css');


const LargeApp = React.lazy(() => import('./components/LoadedApp'));

const App = () => {
    return (
        <Suspense fallback={<Loader />}>
            <LargeApp />
        </Suspense>
    );
};

export default App;
