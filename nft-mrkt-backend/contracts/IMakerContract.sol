//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";


interface IMakerContract {

    function addAdmin(address _newAdmin) external;

    function getCompanyName() external view returns(string memory);

    function getLogoUri() external view returns(string memory);

    function getAdmin(uint256 _index) external view returns(address);

    function getAdminCount() external view returns(uint256);

    function addContract(address _address) external;

    function getContracts() external view returns(address[] memory);

    function getContractCount() external view returns(uint256);
}
