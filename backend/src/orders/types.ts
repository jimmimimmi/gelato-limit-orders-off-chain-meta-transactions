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

export type RelayProxyOrderData = {
    witness: string;
    data: string;
    inputToken: string;
    module: string;
    secret: string
}

export type RelayProxyPermitData = Omit<Erc20PermitDto, 'relayProxy'>;
