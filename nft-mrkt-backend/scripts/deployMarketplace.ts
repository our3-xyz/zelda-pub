import { ethers } from "hardhat";
import * as fs from "fs";
import * as envfile from "envfile";

async function main() {
  const marketplaceContract = await ethers.getContractFactory("StubNFTMarketplaceImpl");
  const deployedMarketplaceContract = await marketplaceContract.deploy();
  await deployedMarketplaceContract.deployed();
  // print the address of the deployed contract
  console.log("Marketplace Contract Address:", deployedMarketplaceContract.address);

  // To be changed
  const envPath = "../nft-mrkt-frontend/.env";
  const parsedFile = envfile.parse(fs.readFileSync(envPath, "utf8"));
  if (process.env.HARDHAT_NETWORK === "mumbai") {
    const configPath = "../nft-mrkt-frontend/src/config.json";
    const data = fs.readFileSync(configPath);
    const json = JSON.parse(data.toString());
    json.mumbai_marketplace_address = deployedMarketplaceContract.address;;
    fs.writeFileSync(configPath, JSON.stringify(json, null, 2));
    parsedFile.REACT_APP_MUMBAI_MARKETPLACE_CONTRACT_ADDRESS = deployedMarketplaceContract.address;
  } else if (process.env.HARDHAT_NETWORK === "localhost") {
    parsedFile.REACT_APP_MARKETPLACE_CONTRACT_ADDRESS = deployedMarketplaceContract.address;
  }
  fs.writeFileSync(envPath, envfile.stringify(parsedFile));
}

// Call the main function and catch if there is any error
main()
  // eslint-disable-next-line no-process-exit
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });
