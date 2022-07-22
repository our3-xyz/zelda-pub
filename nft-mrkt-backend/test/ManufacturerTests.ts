import { expect } from "chai";
import { ethers } from "hardhat";
import {
  MakerContract,
  MakerContract__factory,
} from "../../nft-mrkt-frontend/src/typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe.only("Maker Contract", function () {
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let makerContract: MakerContract;
  let contractAddress1: string = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92299"
  let OzContract2: any;

  before(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const makerContractFactory = await ethers.getContractFactory("MakerContract") as MakerContract__factory;
    makerContract = await makerContractFactory.deploy("test_name", "test_uri");
  });

  describe("Test gets", async function () {
    it("get name", async function () {
      const response = await makerContract.getCompanyName();
      expect(response).to.equal("test_name");
    });
    it("get logo", async function () {
      const response = await makerContract.getLogoUri();
      expect(response).to.equal("test_uri");
    });
  });
  describe("Admins", async function () {
    it("should have one admin", async function () {
      const adminCount = await makerContract.getAdminCount();
      expect(adminCount).to.equal(1);
    });
    it("should have added an admin", async function () {
      // eslint-disable-next-line prettier/prettier
      const tx = await makerContract.connect(owner).addAdmin(user1.address);
      await tx.wait();
      const adminCount = await makerContract.getAdminCount();
      expect(adminCount).to.equal(2);
    });
  });
  describe("contracts", async function () {
    it("add a contract", async function () {
      const tx2 = await makerContract.addContract(contractAddress1);
      await tx2.wait();
      const contractCount = await makerContract.getContractCount();
      expect(contractCount).to.equal(1);
      const contracts = await makerContract.getContracts()
      expect(contracts[0].toLowerCase()).to.equal(contractAddress1);
      expect(contracts).lengthOf(1)
    });
    it("should mint another NFT contract", async function () {
      const OzContract_ = await ethers.getContractFactory("OzNFT");
      OzContract2 = await OzContract_.connect(user1).deploy(
        "WonkaGum",
        "WNKAG"
      );
      await OzContract2.deployed();
    });
    it("should add the second NFT contract to the Maker's db", async function () {
      const contract2Address = OzContract2.address;
      const tx3 = await makerContract.addContract(contract2Address);
      await tx3.wait();
      const contractCount = await makerContract.getContractCount();
      await expect(contractCount).to.equal(2);
    });
  });
  describe("minting and transfer", async function () {
    it("a buyer should be able to lazy mint from contract 2", async function () {
      const tx4 = await OzContract2.connect(user2).mintToken(user2.address);
      await tx4.wait();
      const user2Contract2Balance = await OzContract2.balanceOf(user2.address);
      await expect(user2Contract2Balance).to.equal(1);
    });
    it("a buyer should be able to transfer that token", async function () {
      const tx5 = await OzContract2.connect(user2).transfer(user1.address, 1);
      await tx5.wait();
      const user2Contract2Balance = await OzContract2.balanceOf(user2.address);
      const user1Contract2Balance = await OzContract2.balanceOf(user1.address);
      await expect(user2Contract2Balance).to.equal(0);
      await expect(user1Contract2Balance).to.equal(1);
    });
  });
});
