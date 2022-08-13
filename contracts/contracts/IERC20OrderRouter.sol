// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20OrderRouter {
    function depositToken(
        uint256 amount,
        address module,
        address inputToken,
        address payable owner,
        address witness,
        bytes calldata data,
        bytes32 secret
    ) external;
}
