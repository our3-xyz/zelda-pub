import { BigNumber, ethers } from "ethers";

const NETWORK_STRING = "network"
const ADDRESS_STRING = "address"
const TOKENID_STRING = "token_id"

export type QRNFTType  = {
    network: string
    address: string
    tokenId: ethers.BigNumber
}

// Call  typeToEmbeddedString 1st

export function typeToEmbeddedString(qrNFTType: QRNFTType): string {
    qrNFTType.tokenId = BigNumber.from(qrNFTType.tokenId._hex);
    return `${NETWORK_STRING}:${qrNFTType.network} ${ADDRESS_STRING}:${qrNFTType.address} ${TOKENID_STRING}:${qrNFTType.tokenId.toString()}`
}

// With that return call this:
export function stringToType(qrString: string): QRNFTType {
    let splitted = qrString.split(" ");
    if (splitted.length > 3) {
        throw new Error(`cannot parse string: ${qrString}: too many spaces in string`)
    }
    let network = split(NETWORK_STRING, splitted[0])
    let address = split(ADDRESS_STRING, splitted[1])
    let tokenId = split(TOKENID_STRING, splitted[2])
    let tokenIDBigInt = ethers.BigNumber.from(tokenId)
    if (tokenIDBigInt.lt(0)) {
        throw new Error("token ID needs to be positive")
    }
    return {
        network: network,
        address: address,
        tokenId: tokenIDBigInt
    }
}

function split(key: string, element: string): string {
    let splitted = element.split(":");
    if (splitted.length > 2 || splitted[0] !== key) {
        throw new Error(`cannot parse string: ${element} - can't read using key ${key}`)
    }
    return splitted[1]
}
