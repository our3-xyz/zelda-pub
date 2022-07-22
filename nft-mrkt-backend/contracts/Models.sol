// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library Models {
    struct NftCollection {
        string productName;
        string symbol;
        string metadataURI;
        string imageURI;
        address makerAddress;
        address nftContractAddress;
        uint256 price;
    }
}
