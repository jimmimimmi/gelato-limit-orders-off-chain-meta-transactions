import {Contract, ethers} from "ethers";
import {
    CHAIN_ID,
    DAI_PERMIT_EXPIRATION,
    DAI_POLYGON_NAME,
    DAI_POLYGON_SALT,
    DAI_POLYGON_VERSION,
    DAI_TOKEN_ADDRESS,
    ETH_ADDRESS,
    GELATO_LIMIT_ORDERS_MODULE_ADDRESS,
    RELAYER_PROXY_ADDRESS,
    RELAYER_SERVER_URL
} from "../utils/constants";
import {DaiPermitMessage, RSV, signDaiPermit} from "../utils/daiPermit";
import ABI from "../abi/dai.json";
import {JsonRpcSigner} from "@ethersproject/providers";


export type OrderDto = {
    inputToken: string;
    outputToken: string;
    minReturn: string;
    amount: string;
    module: string;
}

export type Erc20PermitDto = {
    relayProxy: string;
    nonce: number;
    expiry: number;
    allowed: boolean;
    spender: string;
    v: number;
    r: string;
    s: string;
}


export type LimitOrderRequest = {
    signer: string;
    erc20Permit: Erc20PermitDto;
    order: OrderDto
};


export function createProvider() {
    return new ethers.providers.Web3Provider(window.ethereum)
}

export type Signature = {
    r: string;
    s: string;
    v: number;
}

const daiPermit = async (signer: JsonRpcSigner, signerAddress: string, nonce: number): Promise<DaiPermitMessage & RSV> => {
    const domain = {
        name: DAI_POLYGON_NAME,
        version: DAI_POLYGON_VERSION,
        salt: DAI_POLYGON_SALT,
        verifyingContract: DAI_TOKEN_ADDRESS[CHAIN_ID.MATIC],
    };
    return await signDaiPermit(
        signer,
        domain,
        signerAddress,
        RELAYER_PROXY_ADDRESS,
        new Date().valueOf() + DAI_PERMIT_EXPIRATION,
        nonce);
};

const buildRequest = (amount: string, minReturn: string, signerAddress: string, permitData: DaiPermitMessage & RSV) => {
    const amountWei = ethers.utils.parseEther(amount).toString()
    const minReturnWei = ethers.utils.parseEther(minReturn).toString()
    const orderRequest: LimitOrderRequest = {
        signer: signerAddress,
        order: {
            amount: amountWei,
            inputToken: DAI_TOKEN_ADDRESS[CHAIN_ID.MATIC],
            outputToken: ETH_ADDRESS,
            minReturn: minReturnWei,
            module: GELATO_LIMIT_ORDERS_MODULE_ADDRESS[CHAIN_ID.MATIC]
        },
        erc20Permit: {
            allowed: permitData.allowed!,
            nonce: permitData.nonce,
            spender: permitData.spender,
            expiry: permitData.expiry as number,
            relayProxy: RELAYER_PROXY_ADDRESS,
            r: permitData.r,
            v: permitData.v,
            s: permitData.s
        }
    }
    return orderRequest;
};

export const signDaiPermitTxAndSendToken = async (amount: string, minReturn: string) => {
    const signer = createProvider().getSigner();
    const signerAddress = await signer.getAddress();

    const contract = new Contract(DAI_TOKEN_ADDRESS[CHAIN_ID.MATIC], ABI, signer);
    let nonceRes = await contract.getNonce(signerAddress);
    const nonce = Number.parseInt(`${nonceRes}`, 10);

    const permitData = await daiPermit(signer, signerAddress, nonce);

    const orderRequest = buildRequest(amount, minReturn, signerAddress, permitData);

    console.log(`Submitting order with permit `, orderRequest);

    const response = await fetch(RELAYER_SERVER_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(orderRequest)
    })

    const responseData = await response.json();
    console.log(`Server response `, responseData);
}


