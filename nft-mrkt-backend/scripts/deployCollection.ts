import { ethers } from "hardhat";
import { writeFileSync } from "fs";

async function main() {
  // URL from where we can extract the metadata for the NFTs
  const metadataURL = "ipfs://QmZc7jp32oZNbaSGBLbMib4GU5YnGesvudHcE3o7EVqdjs/";
  const MY_ADDRESS = "0xFE2de2924c17C5A5E351E5fD13E2657836716BdD";
  const COLLECTION_NAME = "Wood Tables";
  const COLLECTION_SYMBOL = "WTB";
  const COLLECTION_MAX_NUM_OF_ITEMS = 40;
  const COLLECTION_PRODUCT_NAME = "Tables";
  const COLLECTION_MAKER_ADDRESS = MY_ADDRESS;
  const WAITING_UNTIL_DEPLOYMENT = 60000; // In miliseconds
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so collectionContract here is a factory for instances of our NFTCollection contract.
  */
  const collectionContract = await ethers.getContractFactory("NFTCollection");

  // deploy the contract
  const deployedCollectionContract = await collectionContract.deploy("Wood Tables", "WTB", 40, "Wood Tables", MY_ADDRESS);
  await deployedCollectionContract.deployed();
  // print the address of the deployed contract
  console.log("Collection Contract Address:", deployedCollectionContract.address);

  // Verify the contract
  const waitFor = (delay: number) =>
    new Promise((resolve) =>
      setTimeout(() => {
        hre.run("verify:verify", {
          address: deployedCollectionContract.address,
          constructorArguments: [COLLECTION_NAME, COLLECTION_SYMBOL, COLLECTION_MAX_NUM_OF_ITEMS, COLLECTION_PRODUCT_NAME, COLLECTION_MAKER_ADDRESS],
        });
      }, delay)
    );
  await waitFor(WAITING_UNTIL_DEPLOYMENT);

  // To be changed
  writeFileSync(
    "../frontend/config.ts",
    `export const marketplaceAddress = "${deployedCollectionContract.address}"
  `
  );
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

/*
 * DEPLOY
 * `npx hardhat run scripts/deployCollection.ts --network mumbai`
 *
 * VERIFY
 *  `npx hardhat verify 0x5e3dF86A4C35885E1C6A1492970d6708CBAECaaf "Wood Tables" "WTB" 40 "Wood Tables" 0xFE2de2924c17C5A5E351E5fD13E2657836716BdD --network mumbai`
 *  (without commas)
 */
