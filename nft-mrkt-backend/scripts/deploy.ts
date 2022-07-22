// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import * as fs from "fs";
import * as envfile from "envfile";

async function main() {
  const StubNFTMarketplaceImpl = await ethers.getContractFactory("StubNFTMarketplaceImpl");
  const stubNFTMarketplaceImpl = await StubNFTMarketplaceImpl.deploy({});

  await stubNFTMarketplaceImpl.deployed();

  console.log("StubNFTMarketplaceImpl deployed to:", stubNFTMarketplaceImpl.address);
  const envPath = "../nft-mrkt-frontend/.env";
  const parsedFile = envfile.parse(fs.readFileSync(envPath, "utf8"));
  if (process.env.HARDHAT_NETWORK === "mumbai") {
    parsedFile.REACT_APP_MUMBAI_MARKETPLACE_CONTRACT_ADDRESS = stubNFTMarketplaceImpl.address;
    const configPath = "../nft-mrkt-frontend/src/config.json";
    const data = fs.readFileSync(configPath);
    const json = JSON.parse(data.toString());
    json.mumbai_marketplace_address = stubNFTMarketplaceImpl.address;;
    fs.writeFileSync(configPath, JSON.stringify(json, null, 2));
  } else if (process.env.HARDHAT_NETWORK === "localhost") {
    parsedFile.REACT_APP_MARKETPLACE_CONTRACT_ADDRESS = stubNFTMarketplaceImpl.address;
  }
  fs.writeFileSync(envPath, envfile.stringify(parsedFile));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
