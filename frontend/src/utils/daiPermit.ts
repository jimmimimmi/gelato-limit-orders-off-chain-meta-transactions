import {JsonRpcSigner} from "@ethersproject/providers";

export interface RSV {
    r: string;
    s: string;
    v: number;
}

export interface DaiPermitMessage {
    holder: string;
    spender: string;
    nonce: number;
    expiry: number | string;
    allowed?: boolean;
}

interface Domain {
    name: string;
    version: string;
    verifyingContract: string;
    salt: string;
}

const EIP712Domain = [
    {name: "name", type: "string"},
    {name: "version", type: "string"},
    {name: "verifyingContract", type: "address"},
    {name: "salt", type: "bytes32"},
];

const createTypedDaiData = (message: DaiPermitMessage, domain: Domain) => {
    return {
        types: {
            EIP712Domain,
            Permit: [
                {name: "holder", type: "address"},
                {name: "spender", type: "address"},
                {name: "nonce", type: "uint256"},
                {name: "expiry", type: "uint256"},
                {name: "allowed", type: "bool"},
            ],
        },
        primaryType: "Permit",
        domain,
        message,
    };
};

export const signDaiPermit = async (
    signer: JsonRpcSigner,
    domain: Domain,
    holder: string,
    spender: string,
    expiry: number,
    nonce: number,
): Promise<DaiPermitMessage & RSV> => {
    const message: DaiPermitMessage = {
        holder,
        spender,
        nonce,
        expiry,
        allowed: true,
    };

    const typedData = createTypedDaiData(message, domain);
    const sig = await signTypedData_v4(signer, holder, typedData);

    return {...sig, ...message};
};

const signTypedData_v4 = async (signer: JsonRpcSigner, fromAddress: string, typeData: unknown): Promise<RSV> => {
    const signerAddress = await signer.getAddress();
    if (signerAddress.toLowerCase() !== fromAddress.toLowerCase()) {
        throw new Error('Signer address does not match requested signing address');
    }

    const typeDataString = JSON.stringify(typeData);
    const result = await signer.provider.send('eth_signTypedData_v4', [fromAddress, typeDataString])
        .catch((error: any) => {
            if (error.message === 'Method eth_signTypedData_v4 not supported.') {
                return signer.provider.send('eth_signTypedData', [fromAddress, typeData]);
            } else {
                throw error;
            }
        });

    return {
        r: result.slice(0, 66),
        s: '0x' + result.slice(66, 130),
        v: parseInt(result.slice(130, 132), 16),
    };
}

