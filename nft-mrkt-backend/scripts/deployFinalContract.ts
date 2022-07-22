import { ethers } from "hardhat";
import * as fs from "fs";
import * as envfile from "envfile";

async function main() {
  const finalMarketplace = await ethers.getContractFactory("FinalMarketplace");
  const FinalMarketplace = await finalMarketplace.deploy();

  await FinalMarketplace.deployed();

  console.log("FinalMarketPlace deployed to:", FinalMarketplace.address);

  const envPath = "../nft-mrkt-frontend/.env";
  const parsedFile = envfile.parse(fs.readFileSync(envPath, "utf8"));
  if (process.env.HARDHAT_NETWORK === "mumbai") {
    parsedFile.REACT_APP_MUMBAI_MARKETPLACE_CONTRACT_ADDRESS = FinalMarketplace.address;
  } else if (process.env.HARDHAT_NETWORK === "localhost") {
    parsedFile.REACT_APP_MARKETPLACE_CONTRACT_ADDRESS = FinalMarketplace.address;
  }
  fs.writeFileSync(envPath, envfile.stringify(parsedFile));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
