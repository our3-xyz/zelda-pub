### Configuration

- Install all the npm packages    `npm install`

- Create a `.env` file. Copy the variables names from `.env.example`. That file must not uploaded to the repository. 
The ETHERSCAN_API_KEY is only used to verfy the contracts, not to deploy them.

- Compile the smart contract    `npx hardhat compile`

---

#### Running a local blockchain

To run in local hardhat environment:

1) Start the hardhat node 
in NFT-MRKT/nft-mrkt-backend `run npx hardhat node`

2) Deploy the marketplace contract
in NFT-MRKT/nft-mrkt-backend run `npx hardhat run scripts/deployMarketplace.ts --network localhost`

3) Instead of the usual npm start to start the react server, use this instead
in NFT-MRKT/nft-mrkt-frontend `run npm run start2`. Note: `npm start` will still use the stubbed data.

4) Add the hardhat network to Metamask
  4.1) MM settings>network>Add Network
  4.2) In nft-mrkt-backend>hardhat.config.ts add chainId: 1337 to networks > hardhat
 networks: {
    hardhat: {
      chainId: 1337,
    },

  4.3) import hardhat account into MM using private key provided in terminal output
  4.4) You should have 1000 ETH and network should be hardhat 

---

#### Deploying a contract to mumbai 

To deploy a contract

1) Deploy the marketplace contract
in NFT-MRKT/nft-mrkt-backend run `npx hardhat run scripts/deployMarketplace.ts --network mumbai`
   - `mumbai` to be used for testnet testing 

2) Instead of the usual npm start to start the react server, use this instead
in NFT-MRKT/nft-mrkt-frontend `run npm run startM`. 
   - `startM` is used instead of `start2`
   - `startM` is configured for mumbai
   - Note: `npm start` will still use the stubbed data.

3) Switch Metamask to use `mumbai` testnet instead
