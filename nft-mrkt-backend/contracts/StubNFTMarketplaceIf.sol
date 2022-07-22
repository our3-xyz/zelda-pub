//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Models.sol";

interface StubNFTMarketplaceIf {
    function createNftCollectionContract(
        Models.NftCollection memory _newNftCollection
    ) external;

    function buyItem(address collectionAddress)
    external payable
    returns (uint256);

    function getPrice(address collectionAddress)
    external view
    returns (uint256);

    function getAllCollectionsForSale()
    external
    view
    returns (Models.NftCollection[] memory collections);

    function addMakerProductLines(address _maker, address _newProductLine) external;

    function getMakerProductLines(address _maker) external view returns(address[] memory);

    function setMakerContractFromAdmin(address _makerContract) external;

    function getMakerContractFromAdmin(address _admin) external view returns(address);

}
