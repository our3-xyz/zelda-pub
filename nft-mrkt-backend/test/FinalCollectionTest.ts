import { expect } from "chai";
import { ethers } from "hardhat";

describe("OzNft Contract", function () {
  let owner: any;
  let user1: any;
  let OZContract: any;
  before(async function () {
    [owner, user1] = await ethers.getSigners();

    const OZcontract_ = await ethers.getContractFactory("OzNFT");
    OZContract = await OZcontract_.deploy("test name", "test");
    await OZContract.deployed();

    const tx = await OZContract.connect(owner).mintToken(owner.address);
    await tx.wait();
  });
  describe("functionality", function () {
    it("Should deploy and be mintable", async function () {
      const ownerNFTBalance = await OZContract.balanceOf(owner.address);
      await expect(ownerNFTBalance).to.equal(1);
    });
    it("Should allow non-owners to mint", async function () {
      const tx2 = await OZContract.connect(user1).mintToken(user1.address);
      await tx2.wait();

      const user1NFTBalance = await OZContract.balanceOf(user1.address);
      await expect(user1NFTBalance).to.equal(1);
    });
    it("Should allow transfers of NFT's", async function () {
      const tx2 = await OZContract.connect(user1).transfer(owner.address, 2);
      await tx2.wait();

      const newOwnerNFTBalance = await OZContract.balanceOf(owner.address);
      await expect(newOwnerNFTBalance).to.equal(2);
    });
  });
});
