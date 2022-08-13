import {ethers} from "hardhat";
import {writeFileSync} from "fs";
import {copyFile} from "fs/promises";

async function main() {
    const RelayProxy = await ethers.getContractFactory("RelayProxy");
    const relayProxy = await RelayProxy.deploy();

    console.log(`RelayProxy deployed to:`, relayProxy.address);

    await copyFile('./artifacts/contracts/RelayProxy.sol/RelayProxy.json', '../backend/src/abi/RelayProxy.json');
    writeFileSync('../frontend/src/abi/relayProxyAddress.json', JSON.stringify({
        RelayProxyAddress: relayProxy.address,
    }))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
