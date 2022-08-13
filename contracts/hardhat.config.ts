import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.9",
        settings: {
            optimizer: {enabled: true},
        },
    },
    networks: {
        hardhat: {},
        rinkeby: {
            url: process.env.ALCHEMY_RINKEBY_URL,
            accounts: [`${process.env.PAYER_PRIVATE_KEY}`],
        },
        matic: {
            url: process.env.ALCHEMY_MATIC_URL,
            accounts: [`${process.env.PAYER_PRIVATE_KEY}`],
            gasPrice: "auto"
        }
    },
    etherscan: {
        apiKey: process.env.POLYGON_API_KEY
    }
};

export default config;
