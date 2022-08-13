import React from 'react';

import {Web3ReactProvider} from '@web3-react/core'

import {Web3Provider} from '@ethersproject/providers'
import './App.css';
import ConnectMetamask from "./components/ConnectMetamask";
import {LimitOrder} from "./components/LimitOrder";

function getLibrary(provider: any): Web3Provider {
    return new Web3Provider(provider)
}

function App() {
    return (
        <div className="App">
            <Web3ReactProvider getLibrary={getLibrary}>
                <div className="App-header">
                    <ConnectMetamask/>
                </div>
                <div className="App-body">
                    <div>
                        <LimitOrder/>
                    </div>
                </div>
            </Web3ReactProvider>
        </div>
    );
}

export default App;
