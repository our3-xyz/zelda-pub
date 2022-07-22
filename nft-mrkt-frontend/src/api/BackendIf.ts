import { BigNumber } from "ethers";
import BackendStubImpl from "./BackendStubImpl";
import BackendAPIImpl from "./BackendImpl";
import configJson from "../config.json"

export type Token = {
    id: BigNumber
    ownerAddress: string
    contract: NFTContract
    forSale: boolean
    salePrice: BigNumber
    minted: boolean
    erc721Data?: ERC721TokenData
}

/**
 * ERC721TokenData is the on chain data retrieved. This token data differs from
 * the other representation as it should relate only to what is mentioned in the
 * ERC721 standards or Opensea's https://docs.opensea.io/docs/metadata-standards
 *
 * This is not fully implemented but should be a strict subset of what data
 * is available on-chain.
 */
export type ERC721TokenData = {
    contractAddress: string,
    name: string,
    id: BigNumber,
    ownerAddress: string,
    description?: string,
    image?: string,
}

export type NFTContract = {
    contractAddress: string
    maker: Maker
    makerSalePrice: BigNumber
    productUri: string
    productName: string
    productMeta: string
    numberProduced: number
    tokensMinted?: Token[]
}

export type FinalUser = {
    network: string
    userAddress: string
}

export type Maker = FinalUser & {
    companyName: string
    companyLogoUri: string
    makerAddress: string
}

export interface BackendAPI {
    getUserNFTs(ownerAddress: string): Promise<Token[]>

    getNFTsForSale(): Promise<Token[]>

    getCollectionData(nftContractAddress: string): Promise<NFTContract>

    // contracts address - get a list
    // name - get name from first contract
    // logo - get logo from first contract
    getMakerData(): Promise<string[]>

    buyNFT(address: string, tokenId: BigNumber): Promise<BigNumber>

    addMaker(companyName: string, logoIpfsUrl: string, makerUserAddress: string): Promise<Maker>

    getMaker(makerUserAddress: string): Promise<Maker>

    addCollectionContract(
        productName: string, //Product Line
        makerAddress: string, // Manufacturer address
        productImgUri:string, // Product Image
        productMetadata: string,
        makerSalePrice: BigNumber,  // Price
        numberProduced: number, // Max TokenId
    ): Promise<NFTContract>

    changePrice(contractAddress: string, newPrice: Number): Promise<boolean>

    getTokenDetail(contractAddress: string, tokenID: number): Promise<ERC721TokenData>

    makerMint(contractAddress: string, tokenUri: string): Promise<BigNumber>

    getContractOwner(contractAddress:string): Promise<string>
}

export function GetInstance(): BackendAPI {
    if (process.env.REACT_APP_DATA_SOURCE && process.env.REACT_APP_DATA_SOURCE === "static") {
        console.log("Using static data source")
        return new BackendStubImpl()
    }
    if (process.env.REACT_APP_DATA_SOURCE && process.env.REACT_APP_DATA_SOURCE === "mumbai") {
        if (configJson.mumbai_marketplace_address) {
            return new BackendAPIImpl(configJson.mumbai_marketplace_address)
        }
        throw new Error("cannot get mumbai market place contract address")
    }
    if (process.env.REACT_APP_MARKETPLACE_CONTRACT_ADDRESS) {
        return new BackendAPIImpl(process.env.REACT_APP_MARKETPLACE_CONTRACT_ADDRESS)
    }
    throw new Error("cannot find REACT_APP_MARKETPLACE_CONTRACT_ADDRESS in env file")
}
