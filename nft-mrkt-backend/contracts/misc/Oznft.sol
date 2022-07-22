//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract OzNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor(string memory _tokenName, string memory _tokenSymbol) ERC721(_tokenName, _tokenSymbol) {}

    function mintToken(address to) public returns(uint256) {
        _tokenIds.increment();
        _mint(to, _tokenIds.current());
        return _tokenIds.current();
    }

    function transfer(address _to, uint256 _tokenId) public {
        _transfer(msg.sender, _to, _tokenId);
    }
}
