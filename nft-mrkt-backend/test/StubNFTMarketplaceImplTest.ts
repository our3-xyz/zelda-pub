import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { StubMaker, StubMaker__factory, StubNFTMarketplaceImpl, StubNFTMarketplaceImpl__factory } from "../../nft-mrkt-frontend/src/typechain";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { fail } from "assert";
import { step } from "mocha-steps";

describe.only("Marketplace Contract", function () {
  let mpSigner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let mpContract: StubNFTMarketplaceImpl;
  let nftContract: StubMaker;
  let testAddress1: string = "0x3c44cdddb6a900fa2b585dd299e03d12fa429399"
  let testAddress2: string = "0x3c44cdddb6a900fa2b585dd299e03d12fa429888"

  before(async function () {
    await hre.network.provider.send("hardhat_reset");
    [mpSigner, user1, user2] = await ethers.getSigners();
    const balance = await user2.getBalance();
    expect(balance.toString()).equals("10000000000000000000000");

    const mpContractFactory = (await ethers.getContractFactory(
      "StubNFTMarketplaceImpl"
    )) as StubNFTMarketplaceImpl__factory;
    mpContract = await mpContractFactory.connect(mpSigner).deploy();
    await mpContract.deployed();

    const nftContractFactory = (await ethers.getContractFactory("StubMaker")) as StubMaker__factory;
    nftContract = await nftContractFactory.deploy("test_name1", "test_symbol1", 10);
    await nftContract.deployed();
  });

  describe("Marketplace Contract", async function () {
    step("empty response", async function () {
      const responseCount = await mpContract.getAllCollectionsForSale();
      await expect(responseCount).lengthOf(0);
    });
    step("add one contract", async function () {
      await mpContract.connect(user1).createNftCollectionContract({
        productName: await nftContract.name(),
        makerAddress: user1.address,
        metadataURI: "123",
        imageURI: "image_url",
        nftContractAddress: nftContract.address,
        price: BigNumber.from(0),
        symbol: await nftContract.symbol(),
      });
      const responseCount = await mpContract.getAllCollectionsForSale();
      expect(responseCount).lengthOf(1);
      expect(responseCount[0].nftContractAddress).to.be.equals(nftContract.address);
    });

    step("make sale", async function () {
      const balance = await user2.getBalance();
      expect(balance.toString()).equals("10000000000000000000000");
      const responseCount = await mpContract.getAllCollectionsForSale();
      await expect(responseCount).lengthOf(1);
      const tx = await mpContract.connect(user2).buyItem(nftContract.address, {
        value: BigNumber.from("50000000000000000"),
      });
      const receipt = await tx.wait();
      expect(receipt.gasUsed).equals(130297);
      // eslint-disable-next-line no-unused-expressions
      expect(receipt.events).not.to.be.undefined;
      if (receipt.events) {
        const tokenID = parseInt(receipt.events[0].topics[3], 16);
        expect(tokenID).to.be.equals(1);
      } else {
        fail("should not fail");
      }
    });

    step("sale fail", async function () {
      try {
        await mpContract.connect(user2).buyItem(nftContract.address, {
          value: BigNumber.from("10000000000000000000000"),
        });
        fail("should not enter");
      } catch (e) {
        expect(e).to.be.a("Error");
        if (e instanceof Error) {
          const message = e.message;
          expect(message).contain("sender doesn't have enough funds to send tx");
        }
      }
    });
    step("check owner of sale", async function () {
      const postSaleOwner = await nftContract.ownerOf(1);
      expect(postSaleOwner).equals(user2.address);
    });
  });

  describe("Maker interactions", async function () {
    it("empty response", async function () {
      let response = await mpContract.getMakerProductLines(user1.address)
      await expect(response).lengthOf(0);

      let response2 = await mpContract.getMakerContractFromAdmin(user1.address)
      await expect(response2).equals("0x0000000000000000000000000000000000000000");
    });
    it("add maker", async function () {
      await mpContract.addMakerProductLines(testAddress1, testAddress2)
      let response = await mpContract.getMakerProductLines(testAddress1)
      await expect(response).lengthOf(1);
      await expect(response[0].toLowerCase()).equals(testAddress2);
    });
    it("add maker via admin", async function () {
      await mpContract.connect(user2).setMakerContractFromAdmin(testAddress1)
      let response = await mpContract.getMakerContractFromAdmin(user2.address)
      await expect(response.toLowerCase()).equals(testAddress1);
    });
  });
});
