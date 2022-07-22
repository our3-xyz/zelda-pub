//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Models.sol";
import "./StubNFTMarketplaceIf.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./NFTCollection.sol";
import "hardhat/console.sol";

contract StubNFTMarketplaceImpl is StubNFTMarketplaceIf {
    mapping(address => Models.NftCollection) collectionsForSale;
    mapping(uint256 =>address) allAddresses;
    uint256 allAddressesCounter;

    event CreateNftCollectionContract(
        address indexed nftContractAddress,
        address indexed seller
    );

    event BuyItem(
        address indexed nftContractAddress,
        address indexed buyer,
        uint256 tokenId
    );

    constructor () { }

    // msg.sender is maker's address
    function createNftCollectionContract(
        Models.NftCollection memory _newNftCollection
    ) external override {
        console.log("createNftCollectionContract: msg sender is %s", msg.sender);
        // TODO: deploy maker contract here
        collectionsForSale[_newNftCollection.nftContractAddress] = _newNftCollection;
        allAddresses[allAddressesCounter] = _newNftCollection.nftContractAddress;
        allAddressesCounter += 1;
        emit CreateNftCollectionContract(_newNftCollection.nftContractAddress, msg.sender);
    }
    // msg.sender is buyer's address
    // msg.value is price sender willing to pay
    function buyItem(address collectionAddress)
    external override payable
    returns (uint256) {
        uint256 price = collectionsForSale[collectionAddress].price;
        console.log("buyItem: msg sender is %s, msg.value is %s, price is %s", msg.sender, msg.value, price);
        require(msg.value >= price);
        NFTCollection col = NFTCollection(collectionAddress);
        uint256 id = col.mint(msg.sender, "test_uri");
        emit BuyItem(collectionAddress, msg.sender, id);
        return id;
    }

    // msg.sender is buyer's address
    // msg.value is price sender willing to pay
    function getPrice(address collectionAddress)
    external view override
    returns (uint256) {
        return collectionsForSale[collectionAddress].price;
    }

    function getAllCollectionsForSale()
    external override
    view
    returns (Models.NftCollection[] memory collections) {
        console.log("buyItem: msg sender is %s", msg.sender);
        Models.NftCollection[] memory col = new Models.NftCollection[](allAddressesCounter);
        for (uint256 i = 0; i< allAddressesCounter; i++) {
            col[i]= collectionsForSale[allAddresses[i]];
        }
        return col;
    }

    /*
        Added for implementation of maker contract
        Used store all of a makers product lines in an accessable way
        implemented in `getMakerProductLines()` below
    */
    mapping(address => address[]) makerContractToProductLines;

    /*
        adder function for maker contract's product lines
    */
    function addMakerProductLines(address _maker, address _newProductLine) external override {
        // require msg.sender == admin[i];
        makerContractToProductLines[_maker].push(_newProductLine);
    }

    /*
        Getter function for maker contract's product lines
    */
    function getMakerProductLines(address _maker) external view override returns(address[] memory) {
        return makerContractToProductLines[_maker];
    }

    /*
        Added to associate admins with their MakerContract
    */
    mapping(address => address) adminToMaker; // Does not allow one account to have many 'makers'

    function setMakerContractFromAdmin(address _makerContract) external override {
        /*
            we have to add control here. Maybe allow this only to called
            by other admins. We would pass another parameter and change the
            mapping's key to that instead of msg.sender
        */
        adminToMaker[msg.sender] = _makerContract;
    }

    function getMakerContractFromAdmin(address _admin) external view override returns(address) {
        return adminToMaker[_admin];
    }
}
