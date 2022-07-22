// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./Models.sol";

contract StubMaker is ERC721, ERC721URIStorage {
    uint256 public maxTokenId;
    uint256 public tokenIds;

    constructor(string memory name_, string memory symbol_, uint256 maxTokenId_)
    ERC721(name_, symbol_)
    {
        maxTokenId = maxTokenId_;
    }

    function mint(address toOwner, string memory _tokenURI) public payable returns (uint256) {
        require(tokenIds < maxTokenId, "Exceed maximum supply");
        tokenIds += 1;
        _safeMint(toOwner, tokenIds);
        _setTokenURI(tokenIds, _tokenURI);
        return tokenIds;
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
}
