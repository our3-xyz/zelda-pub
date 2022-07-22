//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";


contract MakerContract {
    // this is for the test
    address[] admins;
    address[] contracts;
    string companyName;
    string logoIpfsUrl;

    modifier onlyAdmin() {
        bool isAdmin = false;

        for(uint i=0; i<admins.length; i++) {
            if(msg.sender == admins[i]) {
                isAdmin = true;
                break;
            }
        }
        require(isAdmin == true, "Only Admins can do this!");
        _;
    }
    constructor(
        string memory _companyName,
        string memory _logoIpfsUrl
    ) {
        admins.push(msg.sender);
        // These will obviously be made into parameters
        companyName = _companyName;
        logoIpfsUrl = _logoIpfsUrl;
    }

    function addAdmin(address _newAdmin) external onlyAdmin {
        admins.push(_newAdmin);
    }

    function getCompanyName() external view returns(string memory) {
        return companyName;
    }

    function getLogoUri() external view returns(string memory) {
        return logoIpfsUrl;
    }

    function getAdmin(uint256 _index) external view returns(address) {
        return(admins[_index]);
    }

    function getAdminCount() external view returns(uint256) {
        return admins.length;
    }

    function addContract(address _address) external onlyAdmin {
        contracts.push(_address);
    }

    function getContracts() external view returns(address[] memory){
        return contracts;
    }

    function getContractCount() external view returns(uint256) {
        return contracts.length;
    }
}
