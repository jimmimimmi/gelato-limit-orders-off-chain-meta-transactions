import {useEffect, useState} from 'react'

import {useWeb3React} from '@web3-react/core'
import {Web3Provider} from '@ethersproject/providers'
import {injected} from '../utils/connectors'
import {UserRejectedRequestError} from '@web3-react/injected-connector'
import {formatAddress} from '../utils/formats'
import {formatEther} from "@ethersproject/units";

const ConnectMetamask = () => {

    const {account, activate, deactivate, setError, active, library, connector} = useWeb3React<Web3Provider>()
    const [accBalance, setAccBalance] = useState<number | undefined>(undefined)

    useEffect(() => {
        if (active && account && connector) {
            library?.getBalance(account).then((result) => {
                setAccBalance(Number(formatEther(result)))
            })
        }
    })

    const onClickConnect = async () =>
        activate(injected, (error) => {
            if (error instanceof UserRejectedRequestError) {
                console.log("user refused")
            } else {
                setError(error)
            }
        }, false)


    const onClickDisconnect = () => {
        deactivate()
    }


    return (active && account) ? (
        <div>
            <span> Balance: {accBalance?.toFixed(3)} </span>
            <button className="Button Button--connected" type="button" onClick={onClickDisconnect}>
                Disconnect: {formatAddress(account, 4)}
            </button>
        </div>
    ) : (
        <div>
            <button className="Button Button--disconnected" type="button" onClick={onClickConnect}>
                Connect MetaMask
            </button>
        </div>
    )
}

export default ConnectMetamask
