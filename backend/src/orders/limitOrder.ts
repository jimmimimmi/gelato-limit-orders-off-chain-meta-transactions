import {Request, Response} from 'express';
import {
    Erc20PermitDto,
    LimitOrderRequest,
    OrderDto,
    RelayProxyOrderData,
    RelayProxyPermitData
} from './types';
import {Contract, ethers, providers, utils, Wallet} from 'ethers';
import RelayProxyABI from '../abi/RelayProxy.json';

export const limitOrder = async (req: Request, res: Response): Promise<void> => {
    const data: LimitOrderRequest = req.body;
    const {erc20Permit, signer, order} = data;
    const relayProxyOrder = prepareRelayProxyOrder(order);
    const relayProxyPermit = prepareRelayProxyPermit(erc20Permit);

    const wallet = new Wallet(`${process.env.PAYER_PRIVATE_KEY}`);
    const connected = await wallet.connect(new providers.JsonRpcProvider(process.env.ALCHEMY_MATIC_URL));

    const gas = {gasPrice: utils.parseUnits('500', 'gwei'), gasLimit: 1000000};

    const relayProxy = new Contract(erc20Permit.relayProxy, RelayProxyABI.abi, connected);
    let amountBn = ethers.utils.parseUnits(order.amount, 'wei');
    console.log(`Sending limit order to relay proxy: signer ${signer}, amount ${amountBn}`);

    const tx = await relayProxy.limitOrder(signer, amountBn, relayProxyPermit, relayProxyOrder, gas);
    console.log(`Limit order transaction ${tx.hash} submitted: signer ${signer}, amount ${amountBn}`);

    try {
        await tx.wait();
        console.log(`Limit order transaction is succeeded`);
    } catch (e) {
        console.log(`Limit order transaction is failed`, e);
    }

    res.status(200).json({
        success: true,
        txHash: tx.hash
    });
};

const prepareRelayProxyPermit: (p: Erc20PermitDto) => RelayProxyPermitData = (p: Erc20PermitDto) => {
    const {s, v, r, allowed, expiry, spender, nonce} = p;
    return {s, v, r, allowed, nonce, expiry, spender};
}

const prepareRelayProxyOrder: (order: OrderDto) => RelayProxyOrderData = (order: OrderDto) => {
    const {inputToken, outputToken, minReturn, module} = order;

    const encodedData = new utils.AbiCoder().encode(['address', 'uint256'], [outputToken, minReturn]);
    const randomSecret = utils.hexlify(utils.randomBytes(19)).replace("0x", "");
    const fullSecret = `0x67656c61746f6e6574776f726b${randomSecret}`;
    const {privateKey: secret, address: witness} = new Wallet(fullSecret);

    return {
        module,
        inputToken,
        witness,
        data: encodedData,
        secret,
    };
}
