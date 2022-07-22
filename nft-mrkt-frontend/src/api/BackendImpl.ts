import axios from "axios";
import { BigNumber, ethers } from "ethers";
import { BackendAPI, ERC721TokenData, Maker, NFTContract, Token } from "./BackendIf";
import Web3Modal from "web3modal";
import MarketplaceContractArtifact from "../artifacts/contracts/StubNFTMarketplaceIf.sol/StubNFTMarketplaceIf.json";
import IERC721MetadataArtifact
  from "../artifacts/@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol/IERC721Metadata.json";
import { GetIPFSGatewayPrefixedLink } from "../models/IPFSUtils";
import NFTCollectionArtifact from "../artifacts/contracts/NFTCollection.sol/NFTCollection.json";
import MakerArtifact from "../artifacts/contracts/MakerContract.sol/MakerContract.json";
import {
  IERC721Metadata,
  MakerContract,
  MakerContract__factory,
  NFTCollection,
  NFTCollection__factory,
  StubNFTMarketplaceIf,
  StubNFTMarketplaceImpl
} from "../typechain";

const COVALENT_CHAIN_ID = 80001
const MAX_TOKENS = 999
const COMPANY_NAME = "My Company Name"
const COMPANY_LOGO = "https://picsum.photos/200"

export default class BackendAPIImpl implements BackendAPI {
  private readonly mpContractAddress: string = `${process.env.REACT_APP_MARKETPLACE_CONTRACT_ADDRESS}`; //
  private readonly network: string = "mumbai";

  providerFn: () => Promise<ethers.providers.JsonRpcProvider> = async () => {
    const web3Modal = new Web3Modal();
    return new ethers.providers.Web3Provider(await web3Modal.connect());
  };

    constructor(
      mpContractAddress?: string,
      providerFnOverride?: () => Promise<ethers.providers.JsonRpcProvider>
    ) {
        if (mpContractAddress) {
            this.mpContractAddress = mpContractAddress;
        } else {
            throw new Error("cannot get marketplace contract address");
        }
        if (providerFnOverride) {
            this.providerFn = providerFnOverride;
        }
    }

    async getTokenDetail(contractAddress: string, tokenID: number): Promise<ERC721TokenData> {
        const prov = await this.providerFn()
        const contract = await new ethers.Contract(contractAddress, IERC721MetadataArtifact.abi, prov) as IERC721Metadata
        const tokenURI = await contract.tokenURI(tokenID)
        const owner = await contract.ownerOf(tokenID)
        const httpLink = GetIPFSGatewayPrefixedLink(tokenURI)
        const metadata = await axios.get(httpLink)

        return {
            id: BigNumber.from(tokenID),
            ownerAddress:owner,
            contractAddress: contractAddress,
            name:"name" in metadata.data ? metadata.data["name"] : "",
            description:"description" in metadata.data ? metadata.data["description"] : "",
            image:"image" in metadata.data ? GetIPFSGatewayPrefixedLink(metadata.data["image"]) : "",
        }
    }

  /**
   * Probably better to use covalent for this
   * @param nftContractAddress
   */
  async getCollectionData(
    nftContractAddress: string
  ): Promise<NFTContract> {
    const prov = await this.providerFn();
    const signer = prov.getSigner();
    const _collectionContract = new ethers.Contract(
      nftContractAddress,
      NFTCollectionArtifact.abi,
      signer
    ) as NFTCollection;
    const productUri = await _collectionContract.connect(signer).getProductUri();
    const productMeta = await _collectionContract.connect(signer).getProductMeta();
    const productPrice = await _collectionContract.connect(signer).getMakerSalePrice();
    const _makerContractAddress = await _collectionContract.connect(signer).getMakerAddress();
    const makerContract = new ethers.Contract(
      _makerContractAddress,
      MakerArtifact.abi,
      signer
    ) as MakerContract;
    const companyName = await makerContract.connect(signer).getCompanyName();
    const companyLogo = await makerContract.connect(signer).getLogoUri();
    const produced = (await _collectionContract.getNumOfCollectionItems()).toNumber();
    const currentProduced = (await _collectionContract.tokenCount()).toNumber();

    const c:NFTContract = {
      contractAddress: nftContractAddress,
      maker: {
        network: prov.network.name,
        makerAddress: _makerContractAddress,
        companyName: companyName,
        companyLogoUri: companyLogo,
        userAddress: "",
      },
      makerSalePrice: productPrice,
      productUri: GetIPFSGatewayPrefixedLink(productUri),
      productName: await _collectionContract.getProductName(),
      productMeta: productMeta,
      numberProduced: produced,
    };
    let tokens: Token[] = []
    for (let i =1; i<=currentProduced; i++ ) {
      tokens.push(
        {
          id: BigNumber.from(i),
          ownerAddress: (await _collectionContract.ownerOf(i)).toString(),
          contract: c,
          forSale: false,
          salePrice: BigNumber.from(0),
          minted: true,
          erc721Data: await this.getTokenDetail(nftContractAddress, i)
        }
      )
    }
    c.tokensMinted = tokens;
    return c;
  }

  async addCollectionContract(
    productName: string, //Product Line
    makerAddress: string, // Manufacturer address
    productImgUri:string, // Product Image
    productMetadata: string,
    makerSalePrice: BigNumber,  // Price
    numberProduced: number, // Max TokenId
  ): Promise<NFTContract> {
    const prov = await this.providerFn();
    const signer = prov.getSigner(makerAddress);
    const address = await signer.getAddress();

    const marketPlaceContract = new ethers.Contract(
      this.mpContractAddress,
      MarketplaceContractArtifact.abi,
      prov // prov because it is readonly
    ) as StubNFTMarketplaceIf;
    const _makerContractAddress = await marketPlaceContract.getMakerContractFromAdmin(address);
    const makerContract = new ethers.Contract(
      _makerContractAddress,
      MakerArtifact.abi,
      signer
    ) as MakerContract;
    const cf = new ethers.ContractFactory(
      NFTCollectionArtifact.abi,
      NFTCollectionArtifact.bytecode,
      signer
    ) as NFTCollection__factory;
    const NFTCollectionContract = await cf.deploy(
        "ZELDA",
        productImgUri,
        numberProduced,
        productName,
        makerSalePrice,
        productMetadata,
        _makerContractAddress
    );
    const tx = await makerContract.connect(signer).addContract(NFTCollectionContract.address);
    await tx.wait()
    const tx2 = await marketPlaceContract.connect(signer)
      .addMakerProductLines(_makerContractAddress, NFTCollectionContract.address);
    await tx2.wait()
    const tx3 = await marketPlaceContract.connect(signer).createNftCollectionContract({
      productName: productName,
      price: makerSalePrice,
      makerAddress: address,
      metadataURI: productMetadata,
      imageURI: productImgUri,
      symbol: "ZELDA",
      nftContractAddress: NFTCollectionContract.address
    })
    await tx3.wait()
    return {
      contractAddress: NFTCollectionContract.address,
      maker: {
        network: this.network,
        makerAddress: makerContract.address,
        companyName: await makerContract.getCompanyName(),
        companyLogoUri: await makerContract.getLogoUri(),
        userAddress: "",
      },
      makerSalePrice: makerSalePrice,
      productUri: productImgUri,
      productName: productName,
      productMeta: productMetadata,
      numberProduced: numberProduced,
    };
  }

  /**
   * This function will call covalent's api, unlike most of the other functions
   * in this class. Ideally, this should be injected instead to support
   * testing or local development.
   * @param ownerAddress
   */
  async getUserNFTs(ownerAddress: string): Promise<Token[]> {
    let url = `https://api.covalenthq.com/v1/${COVALENT_CHAIN_ID}/address/${ownerAddress}/balances_v2/?format=JSON&nft=true&key=${process.env.REACT_APP_COVALENT_API_KEY}`;
    let response = await axios.get(url);
    let items = response.data["data"]["items"];
    return items
      .filter(function (i: any) {
        return i["supports_erc"].includes("erc721");
      })
      .flatMap(function (i: any) {
        if (!i.hasOwnProperty("nft_data")) {
          // eslint-disable-next-line array-callback-return
          return;
        }
        return i["nft_data"].map(function (j: any) {
          return {
            id: BigNumber.from(j["token_id"]),
            ownerAddress: ownerAddress,
            contract: {
              contractAddress: i["contract_address"],
              maker: {
                companyLogoUri: "",
                companyName: "",
                network: "",
                userAddress: "",
                makerAddress: ""
              },
              makerSalePrice: BigNumber.from(0),
              productUri: "",
              productName: "",
              productMeta: "",
              numberProduced: 0,
            },
            forSale: false,
            salePrice: BigNumber.from(0),
            minted: true,
          };
        });
      });
  }

  async buyNFT(
    nftContractAddress: string,
    tokenId: BigNumber
  ): Promise<BigNumber> {
    const prov = await this.providerFn();
    const signer = await prov.getSigner();
    const contract = new ethers.Contract(
      this.mpContractAddress,
      MarketplaceContractArtifact.abi,
      signer
    ) as StubNFTMarketplaceImpl;
    const price = await contract.getPrice(nftContractAddress);
    const response = await contract.buyItem(nftContractAddress, {
      value: price,
      gasLimit: 13000000,
    });
    const receipt = await response.wait();
    if (receipt.events) {
      const tokenID = parseInt(receipt.events[0]["topics"][3], 16);
      return BigNumber.from(tokenID);
    }
    throw new Error("cannot get token id");
  }

  async changePrice(
    contractAddress: string,
    newPrice: Number
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async getMakerData(): Promise<string[]> {
    const prov = await this.providerFn();
    const signer = prov.getSigner();
    const address = await signer.getAddress();
    const marketPlaceContract = new ethers.Contract(
      this.mpContractAddress,
      MarketplaceContractArtifact.abi,
      prov // prov because it is readonly
    ) as StubNFTMarketplaceIf;

    const _makerContractAddress = await marketPlaceContract.getMakerContractFromAdmin(address);
    const _makerContract = new ethers.Contract(
      _makerContractAddress,
      MakerArtifact.abi,
      signer
    ) as MakerContract;
    return await _makerContract.getContracts();
  }

  async getNFTsForSale(): Promise<Token[]> {
    const prov = await this.providerFn();
    const signer = await prov.getSigner();
    const mpContract = new ethers.Contract(
      this.mpContractAddress,
      MarketplaceContractArtifact.abi,
      signer
    ) as StubNFTMarketplaceIf;
    const response = await mpContract.getAllCollectionsForSale();
    return response.map((i) => {
      let t: Token;
      t = {
        contract: {
          contractAddress: i.nftContractAddress,
          maker: {
            companyLogoUri: COMPANY_LOGO,
            companyName: COMPANY_NAME,
            network: this.network,
            makerAddress: i.makerAddress,
            userAddress: "",
          },
          makerSalePrice: i.price,
          productUri: GetIPFSGatewayPrefixedLink(i.imageURI),
          productName: i.productName,
          productMeta: i.metadataURI,
          numberProduced: MAX_TOKENS,
        },
        forSale: true,
        id: BigNumber.from(0),
        minted: false,
        ownerAddress: i.makerAddress,
        salePrice: BigNumber.from(i.price),
      };
      return t;
    });
  }

    async addMaker(
      companyName: string,
      logoIpfsUrl: string,
      makerUserAddress: string
    ): Promise<Maker> {
        const prov = await this.providerFn();
        const signer = prov.getSigner(makerUserAddress);
        const cf = new ethers.ContractFactory(
          MakerArtifact.abi,
          MakerArtifact.bytecode,
          signer
        ) as MakerContract__factory;
        const makerContract = await cf.connect(signer).deploy(companyName, logoIpfsUrl);
        const marketPlaceContract = new ethers.Contract(
          this.mpContractAddress,
          MarketplaceContractArtifact.abi,
          signer // signer because it is writing
        ) as StubNFTMarketplaceImpl;
        const _addContractToAdmin = await marketPlaceContract.connect(signer).setMakerContractFromAdmin(makerContract.address);
        await _addContractToAdmin.wait();

        return {
            network: prov.network.name,
            userAddress: signer._address,
            makerAddress: makerContract.address,
            companyName: await makerContract.getCompanyName(),
            companyLogoUri: await makerContract.getLogoUri(),
        };
    }

    async getMaker(makerUserAddress: string): Promise<Maker> {
        const prov = await this.providerFn();
        const signer = prov.getSigner(makerUserAddress);
        const address = await signer.getAddress();
        const marketPlaceContract = new ethers.Contract(
          this.mpContractAddress,
          MarketplaceContractArtifact.abi,
          prov // prov because it is readonly
        ) as StubNFTMarketplaceIf;
        const _makerContractAddress = await marketPlaceContract.getMakerContractFromAdmin(address);

        if(_makerContractAddress === "0") {
          throw new Error("maker contract address not found");
        }
        const makerContract = new ethers.Contract(
          _makerContractAddress,
          MakerArtifact.abi,
          prov // prov because it is readonly
        ) as MakerContract;
        const companyName = await makerContract.getCompanyName();
        const companyLogo = await makerContract.getLogoUri();
        return {
            network: prov.network.name,
            makerAddress: _makerContractAddress,
            companyName: companyName,
            companyLogoUri: GetIPFSGatewayPrefixedLink(companyLogo),
            userAddress: "",
        };
    }

    // Temp hack on contract
    // Should use covalent instead
    async getContractOwner(contractAddress:string): Promise<string>{
        return (await this.getNFTsForSale()).find(i => i.contract.contractAddress === contractAddress)?.contract.maker.makerAddress ?? "";
    }

    async makerMint(nftContractAddress: string, tokenUri: string): Promise<BigNumber> {
        const prov = await this.providerFn();
        const signer = prov.getSigner();
        const collectionContract = new ethers.Contract(
          nftContractAddress,
          NFTCollectionArtifact.abi,
          signer
        ) as NFTCollection;
        const response = await collectionContract.mint(
          await signer.getAddress(),
          tokenUri,
          {
              gasLimit: 13000000,
          });
        const receipt = await response.wait();
        if (receipt.events) {
            const tokenID = parseInt(receipt.events[0]["topics"][3], 16);
            return BigNumber.from(tokenID);
        }
        return BigNumber.from(0);
    }
}
