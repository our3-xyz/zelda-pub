// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTCollection is ERC721, ERC721URIStorage {
    uint256 public maxNumOfItems;
    string public productName;
    address public makerAddress;
    uint256 public tokenCount; // counter

    /*
        Sale price needs to be defined to work with frontend
        See frontend>src>api>Backend.if>NFTContract type
    */
    uint256 public makerSalePrice;

    /*
        Product Uri should be set for the contract, not the NFT's.
        Product lines are fungible until first sale.
    */
    string public productUri;

    /*
        Product metadata needs to be included to function with optional
        fields that we allow to input on contract creation modal
    */
    string public productMeta;

    constructor(
        string memory _symbol,
        string memory _productUri,
        uint256 _maxNumOfItems,
        string memory _productName,
        uint256 _makerSalePrice,
        string memory _productMeta,
        address _makerAddress
    ) ERC721(_productName, _symbol) {
        maxNumOfItems = _maxNumOfItems;
        productName = _productName;
        makerAddress = _makerAddress;
        makerSalePrice = _makerSalePrice;
        productMeta = _productMeta;
        productUri = _productUri;
    }

    function mint(address toAddress, string memory _tokenURI) public returns (uint256) {
        require(tokenCount < maxNumOfItems, "Exceed maximum supply");
        tokenCount++;
        _safeMint(toAddress, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        return tokenCount;
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function getNumOfCollectionItems() external view returns (uint256) {
        return maxNumOfItems;
    }

    function getCollectionAddress() external view returns (address) {
        return address(this); // Can you access this method without already knowing the address?
    }

    function getMakerAddress() external view returns (address) {
        return makerAddress;
    }

    function getProductName() external view returns (string memory) {
        return productName;
    }
    function getProductUri() external view returns (string memory) {
        return productUri;
    }
    function getProductMeta() external view returns (string memory) {
        return productMeta;
    }
    function getMakerSalePrice() external view returns (uint256) {
        return makerSalePrice;
    }
}
