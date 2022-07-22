export interface Item {
    contractAddress: string
    tokenId: string
    forSale: boolean
    price: number
    name: string
    productUri: string | undefined
}

// I made these up - lets modify as needed