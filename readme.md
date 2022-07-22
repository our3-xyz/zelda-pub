# Zelda
### by Our3

## Introduction

Zelda allows makers and owners to create links between their physical items and the blockchain. 
For makers, the application provides a way to upload images and metadata for real-world products, 
create digital tokens representing those items (along with corresponding QR codes), 
and offer them for sale in a decentralized marketplace. 

For buyers, the application allows them to browse available collections in the marketplace, 
buy a token from a collection, and see the current tokens they own.

## Getting it up and running locally

### Prereqs

- Node.js
- hardhat with Typescript support
- npm install 
- Add the hardhat network to your metamask:
  - RPC URL: http://127.0.0.1:8545
  - Chain ID: 31337
  - Currency Symbol: GO
- Create an empty `.env` file in the /nft-mrkt-frontend folder: 
  `touch ./nft-mrkt-frontend/.env`
- To reproduce the full application you'll need API keys for Covalent and Pinata, and to append those keys to `.env` after step 4 below. 



### Commands

1. Start the hardhat node 
in zelda/nft-mrkt-backend run `npx hardhat node`

2. The above command will generate 20 test accounts. Use the private key from one of these accounts to add an account to your Metamask.

4. Deploy the marketplace contract
in zelda/nft-mrkt-backend run `npx hardhat run scripts/deployMarketplace.ts --network localhost`

5. Instead of the usual npm start to start the react server, use this instead
in zelda/nft-mrkt-frontend run `npm run start2`

----

Visit [Our3](https://our3.xyz) \
Follow [Our3](https://twitter.com/our310)
